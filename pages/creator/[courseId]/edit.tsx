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
  courseType: CourseType
  courseTitle: string
  courseImage: ImageType
  courseDescription: string
  courseAgeRange?: string[]
  coursePrerequisites?: string[]
  courseObjectives?: string[]
}

const EditCourseFormSchema = yup
  .object()
  .shape({
    courseType: yup.string().oneOf(Object.values(CourseType)).required('Course Type is required'),
    courseTitle: yup.string().required('Course Title is required'),
    courseImage: yup.object().required('Course Image is required'),
    courseDescription: yup.string().required('Course Description is required'),
    courseAgeRange: yup.array().of(yup.string()),
    coursePrerequisites: yup.array().of(yup.string()),
    courseObjectives: yup.array().of(yup.string()),
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
    formState: { errors },
  } = useForm<EditCourseFormDataType>({
    resolver: yupResolver(EditCourseFormSchema),
    defaultValues: {
      // courseDescription: course.description,
      // courseAgeRange: course.ageRange,
      // coursePrerequisites: course.preRequisites,
      // courseObjectives: course.objectives,
    },
  })

  const onSubmitHandler = async (data: EditCourseFormDataType) => {
    if (!data.courseImage.file) {
      setAlertData({
        message: 'Please upload a course image',
        variant: 'error',
        open: true,
      })
      return
    }
    // Upload Image and get url
    console.log(data)
    const imageUploadRes = await new ImageApi(session.data).uploadImage({
      image: data.courseImage.file,
    })

    try {
      //   await new CourseApi(session.data).update({
      //     type: data.courseType,
      //     title: data.courseTitle,
      //     image: imageUploadRes.payload.image_url,
      //     description: data.courseDescription,
      //     ageRange: data.courseAgeRange,
      //     preRequisites: data.coursePrerequisites,
      //     objectives: data.courseObjectives,
      //   })
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
        <title>NinjaCo | Create or Edit Course</title>
        <meta name="description" content="Create or Edit Course" />
      </Head>
      <main className="w-full">
        <CreatorMenu creator={user} isOnCoursePage={true} isOnGamesPage={false} />
        <CreateResourceCard
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
              rootClassName="w-48"
            />
            <SingleImageUpload
              control={control}
              name="courseImage"
              error={errors.courseImage?.message as unknown as string}
              label="course Image"
              isRequired={true}
              defaultImage={course.image}
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
                Create Course
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

  const { id: courseId } = query

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
