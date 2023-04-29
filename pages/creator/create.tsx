import * as yup from 'yup'
import { AuthError } from '@/models/shared'
import { CourseApi } from '@/utils/api/course/course.api'
import { CourseType } from '@/models/crud/course.model'
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
import React, { useTransition } from 'react'
import Select from '@/components/forms/select'
import SingleImageUpload from '@/components/forms/singleImageUpload'
import floatingLegos from '@/images/floatingLegos.svg'
import underLineImage from '@/images/lightlyWavedLine.svg'
import useTranslation from '@/hooks/useTranslation'

type CreateCourseFormDataType = {
  courseType: CourseType
  courseTitle: string
  courseImage: ImageType
  courseDescription: string
  courseAgeRange?: string[]
  coursePrerequisites?: string[]
  courseObjectives?: string[]
}

const CreateCourseOrEdit = ({ user }: { user: User }) => {
  const router = useRouter()
  const t = useTranslation()
  const session = useSession()
  const scrollToTop = () => {
    window.scrollTo({
      top: 25,
      behavior: 'smooth',
    })
  }

  const [createButtonDisabled, setCreateButtonDisabled] = React.useState<boolean>(false)
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
  const CreateCourseFormSchema = yup
    .object()
    .shape({
      courseType: yup
        .string()
        .oneOf(Object.values(CourseType))
        .required(`${t.Creator.createCourse.schema.courseTypeRequired}`),
      courseTitle: yup.string().required(`${t.Creator.createCourse.schema.courseTitleRequired}`),
      courseImage: yup.object().required(`${t.Creator.createCourse.schema.courseImageRequired}`),
      courseDescription: yup
        .string()
        .required(`${t.Creator.createCourse.schema.courseDescriptionRequired}`),
      courseAgeRange: yup.array().of(yup.string()),
      coursePrerequisites: yup.array().of(yup.string()),
      courseObjectives: yup.array().of(yup.string()),
    })
    .required()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateCourseFormDataType>({
    resolver: yupResolver(CreateCourseFormSchema),
    defaultValues: {
      courseType: CourseType.ARDUINO,
      courseAgeRange: [],
      coursePrerequisites: [],
      courseObjectives: [],
    },
  })

  const onSubmitHandler = async (data: CreateCourseFormDataType) => {
    setCreateButtonDisabled(true)
    if (!data.courseImage.file) {
      setAlertData({
        message: `${t.Creator.createCourse.alerts.imageAlert}`,
        variant: 'error',
        open: true,
      })
      scrollToTop()
      setCreateButtonDisabled(false)
      return
    }
    setAlertData({
      message: 'Creating Course...',
      variant: 'info',
      open: true,
    })
    scrollToTop()
    // Upload Image and get url
    const imageUploadRes = await new ImageApi(session.data).uploadImage({
      image: data.courseImage.file,
    })

    try {
      await new CourseApi(session.data).create({
        type: data.courseType,
        title: data.courseTitle,
        image: imageUploadRes.payload.image_url,
        description: data.courseDescription,
        ageRange: data.courseAgeRange,
        preRequisites: data.coursePrerequisites,
        objectives: data.courseObjectives,
      })
      router.push('/creator')
    } catch (error) {
      setCreateButtonDisabled(false)
      if (isAxiosError<AuthError>(error)) {
        const errors = unWrapAuthError(error)
        setAlertData({
          message: errors[0].message || 'Something went wrong',
          variant: 'error',
          open: true,
        })
        scrollToTop()
      } else {
        setAlertData({
          message: 'Error creating game',
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
        <title>NinjaCo | Create Course</title>
        <meta name="description" content="Create a Course" />
      </Head>
      <main className="w-full">
        <CreatorMenu creator={user} isOnCoursePage={true} isOnGamesPage={false} />
        <CreateResourceCard
          title={t.Creator.createCourse.createCourse}
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
              label={t.Creator.createCourse.courseType}
              name={register('courseType').name}
              selectList={Object.values(CourseType)}
              isRequired={true}
              rootClassName="w-48"
            />
            <SingleImageUpload
              control={control}
              name={register('courseImage').name}
              error={errors.courseImage?.message as unknown as string} // Convert to string since it returned a FieldError
              isRequired={true}
              label={t.Creator.createCourse.courseImage}
            />
            <Input
              {...register('courseTitle')}
              label={t.Creator.createCourse.courseTitle}
              placeholder={t.Creator.createCourse.courseTitle as string}
              error={errors.courseTitle?.message}
              isRequired={true}
            />
            <TextArea
              cols={4}
              rows={4}
              control={control}
              {...register('courseDescription')}
              label={t.Creator.createCourse.courseDescription}
              placeholder={t.Creator.createCourse.courseDescription as string}
              error={errors.courseDescription?.message}
              className="resize-none"
              isRequired={true}
            />
            <InputTags
              control={control}
              error={errors.courseAgeRange?.message}
              name={register('courseAgeRange').name}
              label={t.Creator.createCourse.courseAgeRange}
              helperText={t.Creator.createCourse.ageRangeHelper}
              placeholder={t.Creator.createCourse.courseAgeRange as string}
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
              label={t.Creator.createCourse.coursePrerequisites}
              helperText={t.Creator.createCourse.prerequisitesHelper}
              placeholder="Course Prerequisites"
            />
            <InputTags
              control={control}
              error={errors.courseObjectives?.message}
              name={register('courseObjectives').name}
              label={t.Creator.createCourse.courseObjectives}
              helperText={t.Creator.createCourse.objectivesHelper}
              placeholder="Course Objectives"
            />
            <div className="flex w-full justify-between gap-4 md:gap-12 h-fit md:flex-row flex-col-reverse">
              <button
                className="w-full md:w-40 h-fit btn bg-error text-brand hover:bg-error-dark hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={(e) => {
                  e.preventDefault()
                  router.back()
                }}
                disabled={createButtonDisabled}
              >
                {t.Creator.createCourse.cancel}
              </button>
              <button
                type="submit"
                form="form"
                value="Submit"
                className="w-full md:w-40 h-fit btn bg-brand-200 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={createButtonDisabled}
              >
                {t.Creator.createCourse.createCourse}
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

  return {
    props: {
      user: session.user,
    },
  }
}
