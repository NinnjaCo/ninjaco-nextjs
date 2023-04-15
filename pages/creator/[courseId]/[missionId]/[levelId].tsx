import * as yup from 'yup'
import { Course } from '@/models/crud/course.model'
import { CourseApi } from '@/utils/api/course/course.api'
import { ImageApi } from '@/utils/api/images/image-upload.api'
import { ImageListType } from 'react-images-uploading'
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
import floatingLegos from '@/images/floatingLegos.svg'
import underLineImage from '@/images/lightlyWavedLine.svg'

type EditLevelFormDataType = {
  buildingPartsImages: ImageListType
  stepByStepGuideImages: ImageListType
}

const EditLevelFormSchema = yup
  .object()
  .shape({
    buildingPartsImages: yup.array(),
    stepByStepGuideImages: yup.array(),
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
  const router = useRouter()
  const session = useSession()

  const [defaultBuildingPartsImages, setDefaultBuildingPartsImages] = React.useState<string[]>(
    level.buildingPartsImages
  )
  const [defaultStepByStepGuideImages, setDefaultStepByStepGuideImages] = React.useState<string[]>(
    level.stepGuideImages
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
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditLevelFormDataType>({
    resolver: yupResolver(EditLevelFormSchema),
  })

  const onSubmitHandler = async (data: EditLevelFormDataType) => {
    if (
      data.buildingPartsImages.length === 0 &&
      data.stepByStepGuideImages.length === 0 &&
      defaultBuildingPartsImages.length === level.buildingPartsImages.length &&
      defaultStepByStepGuideImages.length === level.stepGuideImages.length
    ) {
      setAlertData({
        message: 'No changes were made',
        variant: 'warning',
        open: true,
      })
      return
    }

    if (data.buildingPartsImages.length + defaultBuildingPartsImages.length > 10) {
      setAlertData({
        message: 'You can only upload 10 images for building parts',
        variant: 'error',
        open: true,
      })
      return
    }

    if (data.stepByStepGuideImages.length + defaultStepByStepGuideImages.length > 10) {
      setAlertData({
        message: 'You can only upload 10 images for step by step guide',
        variant: 'error',
        open: true,
      })
      return
    }

    const buildingPartsImagesUrls = await Promise.all(
      data.buildingPartsImages.map(async (image) => {
        if (!image.file) {
          setAlertData({
            message: 'One of the images is not valid',
            variant: 'error',
            open: true,
          })
          return
        }

        if (image.file.size > 1000000) {
          setAlertData({
            message: 'One of the images is too big, please make sure it is less than 1MB',
            variant: 'error',
            open: true,
          })
          return
        }

        try {
          const url = await new ImageApi(session.data).uploadImage({
            image: image.file,
          })
          return url.payload.image_url
        } catch (err) {
          setAlertData({
            message: 'There was an error uploading the images',
            variant: 'error',
            open: true,
          })
          return
        }
      })
    )

    const stepByStepGuideImagesUrls = await Promise.all(
      data.stepByStepGuideImages.map(async (image) => {
        if (!image.file) {
          setAlertData({
            message: 'One of the images is not valid',
            variant: 'error',
            open: true,
          })
          return
        }

        if (image.file.size > 1000000) {
          setAlertData({
            message: 'One of the images is too big, please make sure it is less than 1MB',
            variant: 'error',
            open: true,
          })
          return
        }

        try {
          const url = await new ImageApi(session.data).uploadImage({
            image: image.file,
          })
          return url.payload.image_url
        } catch (err) {
          setAlertData({
            message: 'There was an error uploading the images',
            variant: 'error',
            open: true,
          })
          return
        }
      })
    )

    const newBuildingPartsImages = defaultBuildingPartsImages
    const newStepByStepGuideImages = defaultStepByStepGuideImages

    if (buildingPartsImagesUrls) {
      buildingPartsImagesUrls.forEach((url) => {
        if (url) {
          newBuildingPartsImages.push(url)
        }
      })
    }

    if (stepByStepGuideImagesUrls) {
      stepByStepGuideImagesUrls.forEach((url) => {
        if (url) {
          newStepByStepGuideImages.push(url)
        }
      })
    }

    let dirtyData = {}

    if (newBuildingPartsImages.length !== level.buildingPartsImages.length) {
      dirtyData = { ...dirtyData, buildingPartsImages: newBuildingPartsImages }
    }

    if (newStepByStepGuideImages.length !== level.stepGuideImages.length) {
      dirtyData = { ...dirtyData, stepGuideImages: newStepByStepGuideImages }
    }

    try {
      await new LevelApi(course._id, mission._id, session.data).update(level._id, {
        ...dirtyData,
      })

      router.push(`/creator/${course._id}/${mission._id}/`)
    } catch (err) {
      setAlertData({
        message: 'There was an error updating the level',
        variant: 'error',
        open: true,
      })
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
          title="Create Level"
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
            <div className="text-2xl text-brand">Editing Level Number {level.levelNumber}</div>
            <MultipleImageUpload
              control={control}
              name={register('buildingPartsImages').name}
              error={errors.buildingPartsImages?.message as unknown as string} // Convert to string since it returned a FieldError
              isRequired={true}
              label="Building Parts Images"
              initialData={{
                initialImages: defaultBuildingPartsImages,
                editInitialImages: (newImages) => {
                  setDefaultBuildingPartsImages(newImages)
                },
              }}
            />
            <MultipleImageUpload
              control={control}
              name={register('stepByStepGuideImages').name}
              error={errors.stepByStepGuideImages?.message as unknown as string} // Convert to string since it returned a FieldError
              isRequired={true}
              label="Step by Step Guide Images"
              initialData={{
                initialImages: defaultStepByStepGuideImages,
                editInitialImages: (newImages) => {
                  setDefaultStepByStepGuideImages(newImages)
                },
              }}
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
                Edit Level
              </button>
            </div>
          </form>
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
