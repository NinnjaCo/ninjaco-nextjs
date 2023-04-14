import * as yup from 'yup'
import { ImageListType } from 'react-images-uploading'
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
import SingleImageUpload from '@/components/forms/singleImageUpload'
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

const CreateLevel = ({ user }: { user: User }) => {
  const router = useRouter()
  const session = useSession()
  console.log(session)

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
    console.log(data)
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
            <div className="text-2xl text-brand">Creating Level Number {1}</div>
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
