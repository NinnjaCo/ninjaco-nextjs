import * as yup from 'yup'
import { AuthError } from '@/models/shared'
import { Course, CourseType } from '@/models/crud/course.model'
import { CourseApi } from '@/utils/api/course/course.api'
import { ImageApi } from '@/utils/api/images/image-upload.api'
import { ImageType } from 'react-images-uploading'
import { Input } from '@/components/forms/input'
import { TextArea } from '@/components/forms/textArea'
import { User } from '@/models/crud'
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
import useTranslation from '@/hooks/useTranslation'

type EditCourseFormDataType = {
  type: CourseType
  title: string
  image: ImageType
  description: string
  ageRange?: string[]
  preRequisites?: string[]
  objectives?: string[]
}

const EditCourse = ({ user, course }: { user: User; course: Course }) => {
  const t = useTranslation()
  const router = useRouter()
  const session = useSession()
  const scrollToTop = () => {
    window.scrollTo({
      top: 25,
      behavior: 'smooth',
    })
  }
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

  const EditCourseFormSchema = yup
    .object()
    .shape({
      type: yup
        .string()
        .oneOf(Object.values(CourseType))
        .required(`${t.Creator.editCourse.schema.courseTypeRequired}`),
      title: yup.string().required(`${t.Creator.editCourse.schema.courseTitleRequired}`),
      image: yup.object(),
      description: yup
        .string()
        .required(`${t.Creator.editCourse.schema.courseDescriptionRequired}`),
      ageRange: yup.array().of(yup.string()),
      preRequisites: yup.array().of(yup.string()),
      objectives: yup.array().of(yup.string()),
    })
    .required()

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      await new CourseApi(session.data).update(course._id, {
        ...dirtyData,
      })
      router.push(`/creator/${course._id}`)
    } catch (error) {
      if (isAxiosError<AuthError>(error)) {
        const errors = unWrapAuthError(error)
        setAlertData({
          message: errors[0].message || `${t.Creator.editCourse.alerts.wentWrong}`,
          variant: 'error',
          open: true,
        })
        scrollToTop()
      } else {
        setAlertData({
          message: `${t.Creator.editCourse.alerts.error}`,
          variant: 'error',
          open: true,
        })
        scrollToTop()
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
          title={t.Creator.editCourse.editCourse}
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
              label={t.Creator.editCourse.courseType}
              name={register('type').name}
              selectList={Object.values(CourseType)}
              isRequired={true}
              rootClassName="w-48"
              disabled={true}
            />
            <SingleImageUpload
              control={control}
              name={register('image').name}
              error={errors.image?.message as unknown as string}
              label={t.Creator.editCourse.courseImage}
              isRequired={true}
              defaultImage={course.image}
            />
            <Input
              {...register('title')}
              label={t.Creator.editCourse.courseTitle}
              placeholder={t.Creator.editCourse.courseTitle as string}
              error={errors.title?.message}
              isRequired={true}
            />
            <TextArea
              cols={4}
              rows={4}
              control={control}
              {...register('description')}
              label={t.Creator.editCourse.courseDescription}
              placeholder={t.Creator.editCourse.courseDescription as string}
              error={errors.description?.message}
              className="resize-none"
              isRequired={true}
            />
            <InputTags
              control={control}
              error={errors.ageRange?.message}
              name={register('ageRange').name}
              label={t.Creator.editCourse.courseAgeRange}
              helperText={t.Creator.editCourse.ageRangeHelper}
              placeholder={t.Creator.editCourse.courseAgeRange as string}
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
              label={t.Creator.editCourse.coursePrerequisites}
              helperText={t.Creator.editCourse.prerequisitesHelper}
              placeholder={t.Creator.editCourse.coursePrerequisites as string}
            />
            <InputTags
              control={control}
              error={errors.objectives?.message}
              name={register('objectives').name}
              label={t.Creator.editCourse.courseObjectives}
              helperText={t.Creator.editCourse.objectivesHelper}
              placeholder={t.Creator.editCourse.courseObjectives as string}
            />
            <div className="flex w-full justify-between gap-4 md:gap-12 h-fit md:flex-row flex-col-reverse">
              <button
                className="w-full md:w-40 h-fit btn bg-error text-brand hover:bg-error-dark hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
                onClick={(e) => {
                  e.preventDefault()
                  router.back()
                }}
              >
                {t.Creator.editCourse.cancel}
              </button>
              <button
                type="submit"
                form="form"
                value="Submit"
                className="w-full md:w-40 h-fit btn bg-brand-200 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
              >
                {t.Creator.editCourse.editCourse}
              </button>
            </div>
          </form>
        </CreateResourceCard>
      </main>
    </>
  )
}

export default EditCourse

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
      redirect: {
        destination: '/auth/signin',
        permanent: false,
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
