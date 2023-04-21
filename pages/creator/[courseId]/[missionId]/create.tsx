import * as yup from 'yup'
import { Course, CourseType } from '@/models/crud/course.model'
import { CourseApi } from '@/utils/api/course/course.api'
import {
  FieldArray,
  FieldArrayPath,
  FieldError,
  FieldErrors,
  FieldValues,
  FormState,
  RegisterOptions,
  UseFormRegisterReturn,
  useForm,
} from 'react-hook-form'
import { ImageApi } from '@/utils/api/images/image-upload.api'
import { ImageListType } from 'react-images-uploading'
import { LevelApi } from '@/utils/api/level/level.api'
import { Mission } from '@/models/crud/mission.model'
import { User } from '@/models/crud'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@/components/shared/alert'
import CreateResourceCard from '@/components/creator/creationCard'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import MultipleImageUpload from '@/components/forms/multipleImageUpload'
import React from 'react'
import SingleImageUpload from '@/components/forms/singleImageUpload'
import floatingLegos from '@/images/floatingLegos.svg'
import underLineImage from '@/images/lightlyWavedLine.svg'
import useTranslation from '@/hooks/useTranslation'

type CreateArduinoLevelFormDataType = {
  buildingPartsImages: ImageListType
  stepByStepGuideImages: ImageListType
}

type CreateHTMLLevelFormDataType = {
  websiteImage: ImageListType
}

const CreateArduinoLevelFormSchema = yup
  .object()
  .shape({
    buildingPartsImages: yup.array().min(1).required(),
    stepByStepGuideImages: yup.array().min(1).required(),
  })
  .required()

const CreateHTMLLevelFormSchema = yup
  .object()
  .shape({
    websiteImage: yup.object().required(),
  })
  .required()

const CreateLevel = ({
  user,
  mission,
  course,
}: {
  user: User
  mission: Mission
  course: Course
}) => {
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

  const {
    register: registerArduino,
    handleSubmit: handleSubmitArduino,
    control: controlArduino,
    formState: { errors: errorsArduino },
  } = useForm<CreateArduinoLevelFormDataType>({
    resolver: yupResolver(CreateArduinoLevelFormSchema),
  })
  const {
    register: registerHTML,
    handleSubmit: handleSubmitHTML,
    control,
    formState: { errors: errorsHTML },
  } = useForm<CreateHTMLLevelFormDataType>({
    resolver: yupResolver(CreateHTMLLevelFormSchema),
  })

  const onSubmitHandlerHTML = async (data: CreateHTMLLevelFormDataType) => {
    setAlertData({
      message: t.Creator.createLevelPage.creatingLevel as string,
      variant: 'info',
      open: true,
    })
    scrollToTop()
  }

  const onSubmitHandlerArduino = async (data: CreateArduinoLevelFormDataType) => {
    setAlertData({
      message: t.Creator.createLevelPage.creatingLevel as string,
      variant: 'info',
      open: true,
    })
    scrollToTop()

    if (data.buildingPartsImages.length > 10) {
      setAlertData({
        message: t.Creator.createLevelPage.onlyTenBuildingParts as string,
        variant: 'error',
        open: true,
      })
      scrollToTop()
      return
    }

    if (data.stepByStepGuideImages.length > 10) {
      setAlertData({
        message: t.Creator.createLevelPage.onlyTenStepByStep as string,
        variant: 'error',
        open: true,
      })
      scrollToTop()
      return
    }
    // go over the images and upload them using ImageApi
    // then get the urls and save them in the database

    const buildingPartsImagesUrls = await Promise.all(
      data.buildingPartsImages.map(async (image) => {
        if (!image.file) {
          setAlertData({
            message: t.Creator.createLevelPage.imageIsNotValid as string,
            variant: 'error',
            open: true,
          })
          scrollToTop()
          return
        }

        if (image.file.size > 1000000) {
          setAlertData({
            message: t.Creator.createLevelPage.imageIsTooBig as string,
            variant: 'error',
            open: true,
          })
          scrollToTop()
          return
        }

        try {
          const url = await new ImageApi(session.data).uploadImage({
            image: image.file,
          })
          return url.payload.image_url
        } catch (err) {
          setAlertData({
            message: t.Creator.createLevelPage.errorUploadingImage as string,
            variant: 'error',
            open: true,
          })
          scrollToTop()
          return
        }
      })
    )

    const stepByStepGuideImagesUrls = await Promise.all(
      data.stepByStepGuideImages.map(async (image) => {
        if (!image.file) {
          setAlertData({
            message: t.Creator.createLevelPage.imageIsNotValid as string,
            variant: 'error',
            open: true,
          })
          scrollToTop()
          return
        }

        if (image.file.size > 1000000) {
          setAlertData({
            message: t.Creator.createLevelPage.imageIsTooBig as string,
            variant: 'error',
            open: true,
          })
          scrollToTop()
          return
        }

        try {
          const url = await new ImageApi(session.data).uploadImage({
            image: image.file,
          })
          return url.payload.image_url
        } catch (err) {
          setAlertData({
            message: t.Creator.createLevelPage.errorUploadingImage as string,
            variant: 'error',
            open: true,
          })
          scrollToTop()
          return
        }
      })
    )

    // check if there are any undefined values in the arrays, if so remove them
    const buildingPartsImagesUrlsFiltered: string[] = []
    const stepByStepGuideImagesUrlsFiltered: string[] = []

    buildingPartsImagesUrls.forEach((url) => {
      if (url) {
        buildingPartsImagesUrlsFiltered.push(url)
      }
    })

    stepByStepGuideImagesUrls.forEach((url) => {
      if (url) {
        stepByStepGuideImagesUrlsFiltered.push(url)
      }
    })

    // check if the arrays are empty, if so return
    if (buildingPartsImagesUrlsFiltered.length === 0) {
      setAlertData({
        message: t.Creator.createLevelPage.errorUploadingImage as string,
        variant: 'error',
        open: true,
      })
      scrollToTop()
      return
    }

    if (stepByStepGuideImagesUrlsFiltered.length === 0) {
      setAlertData({
        message: t.Creator.createLevelPage.errorUploadingImage as string,
        variant: 'error',
        open: true,
      })
      scrollToTop()
      return
    }

    // create the level
    try {
      await new LevelApi(course._id, mission._id, session.data).create({
        buildingPartsImages: buildingPartsImagesUrlsFiltered,
        stepGuideImages: stepByStepGuideImagesUrlsFiltered,
        levelNumber: mission.levels.length + 1,
      })

      router.push(`/creator/${course._id}/${mission._id}/`)
    } catch (err) {
      setAlertData({
        message: t.Creator.createLevelPage.errorCreatingLevel as string,
        variant: 'error',
        open: true,
      })
      scrollToTop()
    }
  }

  const displayLevelType = () => {
    if (course.type === CourseType.ARDUINO) {
      return (
        <>
          <MultipleImageUpload
            control={controlArduino}
            name={registerArduino('buildingPartsImages').name}
            error={errorsArduino.buildingPartsImages?.message as unknown as string} // Convert to string since it returned a FieldError
            isRequired={true}
            label={t.Creator.createLevelPage.buildingPartImages as string}
          />
          <MultipleImageUpload
            control={control}
            name={registerArduino('stepByStepGuideImages').name}
            error={errorsArduino.stepByStepGuideImages?.message as unknown as string} // Convert to string since it returned a FieldError
            isRequired={true}
            label={t.Creator.createLevelPage.stepByStepImages as string}
          />
        </>
      )
    } else {
      return (
        <>
          <SingleImageUpload
            control={control}
            name={registerHTML('websiteImage').name}
            error={errorsHTML.websiteImage?.message as unknown as string}
            isRequired={true}
            label="Website Final Image"
          ></SingleImageUpload>
        </>
      )
    }
  }

  return (
    <>
      <Head>
        <title>NinjaCo | Create Level</title>
        <meta name="description" content="Create Level" />
      </Head>
      <main className="w-full">
        <CreatorMenu creator={user} isOnCoursePage={true} isOnGamesPage={false} />
        <CreateResourceCard
          title={t.Creator.createLevelPage.createLevel as string}
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
          {course.type === CourseType.ARDUINO && (
            <form
              onSubmit={handleSubmitArduino(onSubmitHandlerArduino)}
              className="flex flex-col gap-8"
              id="form"
            >
              <div className="text-2xl text-brand">
                {t.Creator.createLevelPage.creatingLevelNumber} {mission.levels.length + 1}
              </div>
              {displayLevelType()}

              <div className="flex w-full justify-between gap-4 md:gap-12 h-fit md:flex-row flex-col-reverse">
                <button
                  className="w-full md:w-40 h-fit btn bg-error text-brand hover:bg-error-dark hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
                  onClick={(e) => {
                    e.preventDefault()
                    router.back()
                  }}
                >
                  {t.Creator.createLevelPage.cancel}
                </button>
                <button
                  type="submit"
                  form="form"
                  value="Submit"
                  className="w-full md:w-40 h-fit btn bg-brand-200 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
                >
                  {t.Creator.createLevelPage.createLevel}
                </button>
              </div>
            </form>
          )}
          {course.type === CourseType.HTML && (
            <form
              onSubmit={handleSubmitHTML(onSubmitHandlerHTML)}
              className="flex flex-col gap-8"
              id="form"
            >
              <div className="text-2xl text-brand">
                {t.Creator.createLevelPage.creatingLevelNumber} {mission.levels.length + 1}
              </div>
              {displayLevelType()}

              <div className="flex w-full justify-between gap-4 md:gap-12 h-fit md:flex-row flex-col-reverse">
                <button
                  className="w-full md:w-40 h-fit btn bg-error text-brand hover:bg-error-dark hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
                  onClick={(e) => {
                    e.preventDefault()
                    router.back()
                  }}
                >
                  {t.Creator.createLevelPage.cancel}
                </button>
                <button
                  type="submit"
                  form="form"
                  value="Submit"
                  className="w-full md:w-40 h-fit btn bg-brand-200 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
                >
                  {t.Creator.createLevelPage.createLevel}
                </button>
              </div>
            </form>
          )}
        </CreateResourceCard>
      </main>
    </>
  )
}

export default CreateLevel

export const getServerSideProps = async (context) => {
  const { req, res, query } = context

  const { courseId, missionId } = query

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

  const course = await new CourseApi(session).findOne(courseId)

  if (!course || !course.payload) {
    return {
      props: {
        redirect: {
          destination: '/creator',
          permanent: false,
        },
      },
    }
  }
  const mission = course.payload.missions.find((mission) => mission._id === missionId)

  if (!mission) {
    return {
      props: {
        redirect: {
          destination: '/creator/' + courseId,
          permanent: false,
        },
      },
    }
  }

  return {
    props: {
      user: session.user,
      mission: mission,
      course: course.payload,
    },
  }
}
