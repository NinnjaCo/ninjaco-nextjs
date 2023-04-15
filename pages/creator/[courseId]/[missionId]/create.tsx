import * as yup from 'yup'
import { CategoryApi } from '@/utils/api/category/category.api'
import { Course } from '@/models/crud/course.model'
import { CourseApi } from '@/utils/api/course/course.api'
import { ImageApi } from '@/utils/api/images/image-upload.api'
import { ImageListType } from 'react-images-uploading'
import { LevelApi } from '@/utils/api/level/level.api'
import { Mission } from '@/models/crud/mission.model'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { getSession, useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@/components/shared/alert'
import CreateResourceCard from '@/components/creator/creationCard'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import MultipleImageUpload from '@/components/forms/multipleImageUpload'
import React from 'react'
import floatingLegos from '@/images/floatingLegos.svg'
import underLineImage from '@/images/lightlyWavedLine.svg'

type CreateLevelFormDataType = {
  buildingPartsImages: ImageListType
  stepByStepGuideImages: ImageListType
}

const CreateLevelFormSchema = yup
  .object()
  .shape({
    buildingPartsImages: yup.array().min(1).required(),
    stepByStepGuideImages: yup.array().min(1).required(),
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
    setValue,
    formState: { errors },
  } = useForm<CreateLevelFormDataType>({
    resolver: yupResolver(CreateLevelFormSchema),
  })

  const onSubmitHandler = async (data: CreateLevelFormDataType) => {
    setAlertData({
      message: 'Creating level...',
      variant: 'info',
      open: true,
    })

    if (data.buildingPartsImages.length > 10) {
      setAlertData({
        message: 'You can only upload 10 images for building parts',
        variant: 'error',
        open: true,
      })
      return
    }

    if (data.stepByStepGuideImages.length > 10) {
      setAlertData({
        message: 'You can only upload 10 images for step by step guide',
        variant: 'error',
        open: true,
      })
      return
    }

    // go over the images and upload them using ImageApi
    // then get the urls and save them in the database

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
        message: 'There was an error uploading the images',
        variant: 'error',
        open: true,
      })
      return
    }

    if (stepByStepGuideImagesUrlsFiltered.length === 0) {
      setAlertData({
        message: 'There was an error uploading the images',
        variant: 'error',
        open: true,
      })
      return
    }

    // create the level
    try {
      const level = await new LevelApi(course._id, mission._id, session.data).create({
        buildingPartsImages: buildingPartsImagesUrlsFiltered,
        stepGuideImages: stepByStepGuideImagesUrlsFiltered,
        levelNumber: mission.levels.length + 1,
      })

      router.push(`/creator/${course._id}/${mission._id}/`)
    } catch (err) {
      setAlertData({
        message: 'There was an error creating the level',
        variant: 'error',
        open: true,
      })
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
            <div className="text-2xl text-brand">
              Creating Level Number {mission.levels.length + 1}
            </div>
            <MultipleImageUpload
              control={control}
              name={register('buildingPartsImages').name}
              error={errors.buildingPartsImages?.message as unknown as string} // Convert to string since it returned a FieldError
              isRequired={true}
              label="Building Parts Images"
            />
            <MultipleImageUpload
              control={control}
              name={register('stepByStepGuideImages').name}
              error={errors.stepByStepGuideImages?.message as unknown as string} // Convert to string since it returned a FieldError
              isRequired={true}
              label="Step by Step Guide Images "
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
                Create Level
              </button>
            </div>
          </form>
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
