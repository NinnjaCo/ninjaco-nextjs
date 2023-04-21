import * as yup from 'yup'
import { Course, CourseType } from '@/models/crud/course.model'
import { CourseApi } from '@/utils/api/course/course.api'
import { ImageApi } from '@/utils/api/images/image-upload.api'
import { ImageListType, ImageType } from 'react-images-uploading'
import { Level } from '@/models/crud/level.model'
import { LevelApi } from '@/utils/api/level/level.api'
import { Mission } from '@/models/crud/mission.model'
import { User } from '@/models/crud'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { useForm } from 'react-hook-form'
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

type EditArduinoLevelFormDataType = {
  buildingPartsImages: ImageListType
  stepByStepGuideImages: ImageListType
}

type EditHTMLLevelFormDataType = {
  websitePreviewImage: ImageType
}

const EditArduinoLevelFormSchema = yup
  .object()
  .shape({
    buildingPartsImages: yup.array(),
    stepByStepGuideImages: yup.array(),
  })
  .required()
const EditHTMLLevelFormSchema = yup
  .object()
  .shape({
    websitePreviewImage: yup.object(),
  })
  .required()

const EditLevel = ({
  user,
  level,
  mission,
  course,
}: {
  user: User
  level: Level
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
  const [defaultBuildingPartsImages, setDefaultBuildingPartsImages] = React.useState<string[]>(
    level.buildingPartsImages || []
  )
  const [defaultStepByStepGuideImages, setDefaultStepByStepGuideImages] = React.useState<string[]>(
    level.stepGuideImages || []
  )
  const [defaultWebsitePreviewImage, setDefaultWebsitePreviewImage] = React.useState<string>(
    level.websitePreviewImage || ''
  )

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
  } = useForm<EditArduinoLevelFormDataType>({
    resolver: yupResolver(EditArduinoLevelFormSchema),
  })

  const {
    register: registerHTML,
    handleSubmit: handleSubmitHTML,
    control: controlHTML,
    formState: { errors: errorsHTML },
  } = useForm<EditHTMLLevelFormDataType>({
    resolver: yupResolver(EditHTMLLevelFormSchema),
  })

  const onSubmitHandlerArduino = async (data: EditArduinoLevelFormDataType) => {
    if (!data.buildingPartsImages) {
      data.buildingPartsImages = []
    }
    if (!data.stepByStepGuideImages) {
      data.stepByStepGuideImages = []
    }

    // No new images, and the old images have been deleted
    if (
      data.buildingPartsImages.length === 0 &&
      data.stepByStepGuideImages.length === 0 &&
      (defaultBuildingPartsImages.length === 0 || defaultStepByStepGuideImages.length === 0)
    ) {
      setAlertData({
        message: t.Creator.editLevelPage.atLeastOneImage as string,
        variant: 'error',
        open: true,
      })
      scrollToTop()
      return
    }

    // No new images, and the old images have not been changed
    if (
      data.buildingPartsImages?.length === 0 &&
      data.stepByStepGuideImages?.length === 0 &&
      defaultBuildingPartsImages.length === level.buildingPartsImages.length &&
      defaultStepByStepGuideImages.length === level.stepGuideImages.length
    ) {
      setAlertData({
        message: t.Creator.editLevelPage.noChangesMade as string,
        variant: 'warning',
        open: true,
      })
      scrollToTop()
      return
    }

    if (data.buildingPartsImages?.length + defaultBuildingPartsImages.length > 10) {
      setAlertData({
        message: t.Creator.editLevelPage.onlyTenBuildingParts as string,
        variant: 'error',
        open: true,
      })
      scrollToTop()
      return
    }

    if (data.stepByStepGuideImages?.length + defaultStepByStepGuideImages.length > 10) {
      setAlertData({
        message: t.Creator.editLevelPage.onlyTenStepByStep as string,
        variant: 'error',
        open: true,
      })
      scrollToTop()
      return
    }

    const dirtyData = {
      buildingPartsImages: defaultBuildingPartsImages,
      stepGuideImages: defaultStepByStepGuideImages,
    }

    await Promise.all(
      data.buildingPartsImages.map(async (image) => {
        if (!image.file) {
          setAlertData({
            message: t.Creator.editLevelPage.imageIsNotValid as string,
            variant: 'error',
            open: true,
          })
          scrollToTop()
          return
        }

        if (image.file.size > 1000000) {
          setAlertData({
            message: t.Creator.editLevelPage.imageIsTooBig as string,
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
          dirtyData.buildingPartsImages.push(url.payload.image_url)
        } catch (err) {
          setAlertData({
            message: t.Creator.editLevelPage.errorUploadingImage as string,
            variant: 'error',
            open: true,
          })
          scrollToTop()
          return
        }
      })
    )

    await Promise.all(
      data.stepByStepGuideImages?.map(async (image) => {
        if (!image.file) {
          setAlertData({
            message: t.Creator.editLevelPage.imageIsNotValid as string,
            variant: 'error',
            open: true,
          })
          scrollToTop()
          return
        }

        if (image.file.size > 1000000) {
          setAlertData({
            message: t.Creator.editLevelPage.imageIsTooBig as string,
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
          dirtyData.stepGuideImages.push(url.payload.image_url)
        } catch (err) {
          setAlertData({
            message: t.Creator.editLevelPage.errorUploadingImage as string,
            variant: 'error',
            open: true,
          })
          scrollToTop()
          return
        }
      })
    )

    try {
      await new LevelApi(course._id, mission._id, session.data).update(level._id, {
        ...dirtyData,
      })

      router.push(`/creator/${course._id}/${mission._id}/`)
    } catch (err) {
      setAlertData({
        message: t.Creator.editLevelPage.errorUpdatingLevel as string,
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
            label={t.Creator.editLevelPage.buildingPartImages as string}
            initialData={{
              initialImages: defaultBuildingPartsImages,
              editInitialImages: (newImages) => {
                setDefaultBuildingPartsImages(newImages)
              },
            }}
          />
          <MultipleImageUpload
            control={controlArduino}
            name={registerArduino('stepByStepGuideImages').name}
            error={errorsArduino.stepByStepGuideImages?.message as unknown as string} // Convert to string since it returned a FieldError
            isRequired={true}
            label={t.Creator.editLevelPage.stepByStepImages as string}
            initialData={{
              initialImages: defaultStepByStepGuideImages,
              editInitialImages: (newImages) => {
                setDefaultStepByStepGuideImages(newImages)
              },
            }}
          />
        </>
      )
    } else {
      return (
        <>
          <SingleImageUpload
            control={controlHTML}
            name={registerHTML('websitePreviewImage').name}
            error={errorsHTML.websitePreviewImage?.message as unknown as string}
            isRequired={true}
            label="Website Preview Image"
            defaultImage={defaultWebsitePreviewImage}
          ></SingleImageUpload>
        </>
      )
    }
  }

  return (
    <>
      <Head>
        <title>NinjaCo | Edit Level</title>
        <meta name="description" content="Create Level" />
      </Head>
      <main className="w-full">
        <CreatorMenu creator={user} isOnCoursePage={true} isOnGamesPage={false} />
        <CreateResourceCard
          title={t.Creator.editLevelPage.editLevel as string}
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
          {displayLevelType()}
        </CreateResourceCard>
      </main>
    </>
  )
}

export default EditLevel

export const getServerSideProps = async (context) => {
  const { req, res, query } = context

  const { courseId, missionId, levelId } = query

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

  const level = mission.levels.find((level) => level._id === levelId)

  if (!level) {
    return {
      props: {
        redirect: {
          destination: '/creator/' + courseId + '/' + missionId,
          permanent: false,
        },
      },
    }
  }

  return {
    props: {
      user: session.user,
      level: level,
      mission: mission,
      course: course.payload,
    },
  }
}
