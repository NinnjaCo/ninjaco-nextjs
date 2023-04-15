import * as yup from 'yup'
import { AuthError } from '@/models/shared'
import { Course } from '@/models/crud/course.model'
import { CourseApi } from '@/utils/api/course/course.api'
import { ImageApi } from '@/utils/api/images/image-upload.api'
import { ImageType } from 'react-images-uploading'
import { Input } from '@/components/forms/input'
import { TextArea } from '@/components/forms/textArea'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { isAxiosError, unWrapAuthError } from '@/utils/errors'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@/components/shared/alert'
import CreateResourceCard from '@/components/creator/creationCard'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import InputTags from '@/components/forms/inputTags'
import React from 'react'
import Select from '@/components/forms/select'
import SingleImageUpload from '@/components/forms/singleImageUpload'
import floatingLegos from '@/images/floatingLegos.svg'
import underLineImage from '@/images/lightlyWavedLine.svg'

enum CourseType {
  ARDUINO = 'ARDUINO',
  HTML = 'HTML',
}
type EditCourseFormDataType = {
  type: CourseType
  title: string
  image: ImageType
  description: string
  ageRange?: string[]
  preRequisites?: string[]
  objectives?: string[]
}

const EditCourseFormSchema = yup
  .object()
  .shape({
    type: yup.string().oneOf(Object.values(CourseType)).required('Course Type is required'),
    title: yup.string().required('Course Title is required'),
    image: yup.object(),
    description: yup.string().required('Course Description is required'),
    ageRange: yup.array().of(yup.string()),
    preRequisites: yup.array().of(yup.string()),
    objectives: yup.array().of(yup.string()),
  })
  .required()

const CreateCourseOrEdit = ({ user, course }: { user: User; course: Course }) => {
  const router = useRouter()
  const session = useSession()
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
    formState: { errors, dirtyFields },
  } = useForm<EditCourseFormDataType>({
    resolver: yupResolver(EditCourseFormSchema),
    defaultValues: {
      ageRange: course.ageRange,
      description: course.description,
      objectives: course.objectives,
      preRequisites: course.preRequisites,
      title: course.title,
      type: course.type,
    },
  })

  const onSubmitHandler = async (data: EditCourseFormDataType) => {
    // I had to use any, because the dirtyData.image type will get change from ImageType to string
    console.log(data)
    const dirtyData: any = {}
    Object.keys(dirtyFields).forEach((key) => {
      dirtyData[key] = data[key]
    })

    try {
      if (dirtyData.image && dirtyData.image.file) {
        // Upload Image and get url
        const imageUploadRes = await new ImageApi(session.data).uploadImage({
          image: dirtyData.image.file,
        })
        dirtyData.image = imageUploadRes.payload.image_url
      }

      console.log(dirtyData)
      await new CourseApi(session.data).update(course._id, {
        ...dirtyData,
      })
      router.push(`/creator/${course._id}`)
    } catch (error) {
      if (isAxiosError<AuthError>(error)) {
        const errors = unWrapAuthError(error)
        setAlertData({
          message: errors[0].message || 'Something went wrong',
          variant: 'error',
          open: true,
        })
      } else {
        setAlertData({
          message: 'Error editing game',
          variant: 'error',
          open: true,
        })
      }
    }
  }
  return (
    <>
      <Head>
        <title>NinjaCo | Edit Course</title>
        <meta name="description" content="Edit a Course" />
      </Head>
      <main className="w-full">
        <CreatorMenu creator={user} isOnCoursePage={true} isOnGamesPage={false} />
        <CreateResourceCard
          title="Edit Course"
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
              error={errors.type?.message}
              label="Course Type"
              name={register('type').name}
              selectList={Object.values(CourseType)}
              isRequired={true}
              rootClassName="w-48"
            />
            <SingleImageUpload
              control={control}
              name={register('image').name}
              error={errors.image?.message as unknown as string}
              label="course Image"
              isRequired={true}
              defaultImage={course.image}
            />
            <Input
              {...register('title')}
              label={'Course Title'}
              placeholder="Course Title"
              error={errors.title?.message}
              isRequired={true}
            />
            <TextArea
              cols={4}
              rows={4}
              control={control}
              {...register('description')}
              label={'Course Description'}
              placeholder="Course Description"
              error={errors.description?.message}
              className="resize-none"
              isRequired={true}
            />
            <InputTags
              control={control}
              error={errors.ageRange?.message}
              name={register('ageRange').name}
              label="Course Age Range"
              helperText="Enter a range and press enter to add it"
              placeholder="Course Age Range"
              formatter={(ageRange) => {
                //   should be number-number or number
                const ageRangeArray = ageRange.split('-')
                if (ageRangeArray.length === 2) {
                  return `${ageRangeArray[0]} - ${ageRangeArray[1]}`
                } else if (ageRangeArray.length === 1) {
                  return `${ageRangeArray[0]}+`
                } else {
                  return ageRange
                }
              }}
            />
            <InputTags
              control={control}
              error={errors.preRequisites?.message}
              name={register('preRequisites').name}
              label="Course Prerequisites"
              helperText="Enter a prerequisites and press enter to add it"
              placeholder="Course Prerequisites"
            />
            <InputTags
              control={control}
              error={errors.objectives?.message}
              name={register('objectives').name}
              label="Course Objectives"
              helperText="Enter an objectives and press enter to add it"
              placeholder="Course Objectives"
            />
            <div className="flex w-full justify-between gap-4 md:gap-12 h-fit md:flex-row flex-col-reverse">
              <button
                className="w-full md:w-40 h-fit btn bg-error text-brand hover:bg-error-dark hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
                onClick={(e) => {
                  e.preventDefault()
                  router.back()
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="form"
                value="Submit"
                className="w-full md:w-40 h-fit btn bg-brand-200 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
              >
                Edit Course
              </button>
            </div>
          </form>
        </CreateResourceCard>
      </main>
    </>
  )
}

export default CreateCourseOrEdit

export const getServerSideProps = async (context) => {
  const { query, req, res } = context

  const { courseId } = query

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

  const courseRes = await new CourseApi(session).findOne(courseId)
  if (!courseRes || !courseRes.payload) {
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
      user: session.user,
      course: courseRes.payload,
    },
  }
}