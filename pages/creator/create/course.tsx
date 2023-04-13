import * as yup from 'yup'
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/forms/input'
import { TextArea } from '@/components/forms/textArea'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@/components/shared/alert'
import CreateCourseOrEditCard from '@/components/creator/creationCard'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import InputTags from '@/components/forms/inputTags'
import React from 'react'
import Select from '@/components/forms/select'
import floatingLegos from '@/images/floatingLegos.svg'
import underLineImage from '@/images/lightlyWavedLine.svg'

enum CourseType {
  ARDUINO = 'ARDUINO',
  HTML = 'HTML',
}
type CreateCourseFormDataType = {
  courseType: CourseType
  courseTitle: string
  courseDescription: string
  courseAgeRange?: string[]
  coursePrerequisites?: string[]
  courseObjectives?: string[]
}

const CreateCourseFormSchema = yup
  .object()
  .shape({
    courseType: yup.string().oneOf(Object.values(CourseType)).required('Course Type is required'),
    courseTitle: yup.string().required('Course Title is required'),
    courseDescription: yup.string().required('Course Description is required'),
    courseAgeRange: yup.array().of(yup.string()),
    coursePrerequisites: yup.array().of(yup.string()),
    courseObjectives: yup.array().of(yup.string()),
  })
  .required()

const CreateCourseOrEdit = ({ user }: { user: User }) => {
  const [alertData, setAlertData] = React.useState<{
    message: string
    variant: 'success' | 'info' | 'warning' | 'error'
    open: boolean
  }>({
    message: '',
    variant: 'info',
    open: false,
  })
  const closeAlert = () => {
    setAlertData({ ...alertData, open: false })
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateCourseFormDataType>({
    resolver: yupResolver(CreateCourseFormSchema),
    defaultValues: {
      courseType: CourseType.ARDUINO,
      coursePrerequisites: [],
    },
  })

  const onSubmitHandler = async (data: CreateCourseFormDataType) => {}
  return (
    <>
      <Head>
        <title>NinjaCo | Create or Edit Course</title>
        <meta name="description" content="Create or Edit Course" />
      </Head>
      <main className="w-full">
        <CreatorMenu creator={user} isOnCoursePage={true} isOnGamesPage={false} />
        <CreateCourseOrEditCard
          title="Create Course"
          underLineImage={underLineImage}
          titleImage={floatingLegos}
        >
          <Alert
            className="my-3"
            message={alertData.message}
            variant={alertData.variant}
            open={alertData.open}
            close={closeAlert}
          />
          <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col gap-8" id="form">
            <Select
              control={control}
              error={errors.courseType?.message}
              label="Course Type"
              name={register('courseType').name}
              selectList={Object.values(CourseType)}
              isRequired={true}
            />
            <Input
              {...register('courseTitle')}
              label={'Course Title'}
              placeholder="Course Title"
              error={errors.courseTitle?.message}
              isRequired={true}
            />
            <TextArea
              cols={4}
              rows={4}
              control={control}
              {...register('courseDescription')}
              label={'Course Description'}
              placeholder="Course Description"
              error={errors.courseDescription?.message}
              className="resize-none"
              isRequired={true}
            />
            <InputTags
              control={control}
              error={errors.courseAgeRange?.message}
              name={register('courseAgeRange').name}
              label="Course Age Range"
              helperText="Enter a range and press enter to add it"
              placeholder="Course Age Range"
            />
            <InputTags
              control={control}
              error={errors.coursePrerequisites?.message}
              name={register('coursePrerequisites').name}
              label="Course Prerequisites"
              helperText="Enter a prerequisites and press enter to add it"
              placeholder="Course Prerequisites"
            />
            <InputTags
              control={control}
              error={errors.courseObjectives?.message}
              name={register('courseObjectives').name}
              label="Course Objectives"
              helperText="Enter an objectives and press enter to add it"
              placeholder="Course Objectives"
            />
            <button
              type="submit"
              form="form"
              value="Submit"
              className="w-full btn bg-brand-200 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
            >
              Create Course
            </button>
          </form>
        </CreateCourseOrEditCard>
      </main>
    </>
  )
}

export default CreateCourseOrEdit

export const getServerSideProps = async (context) => {
  const { query, req, res } = context

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination:
          (query.redirectTo as string | undefined) || '/auth/signup?error=Token%20Expired',
        permanent: false,
      },
    }
  }

  const response = await new UserApi(session).findOne(session.id)
  if (!response || !response.payload) {
    return {
      props: {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      },
    }
  }

  return {
    props: {
      user: response.payload,
    },
  }
}
