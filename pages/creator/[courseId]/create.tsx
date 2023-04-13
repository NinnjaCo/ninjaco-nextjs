import * as yup from 'yup'
import { AdminAlertDialog } from '@/components/admin/dialog'
import { ImageType } from 'react-images-uploading'
import { Input } from '@/components/forms/input'
import { TextArea } from '@/components/forms/textArea'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
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
import React from 'react'
import SelectWithAddition from '@/components/forms/selectWithAddition'
import SingleImageUpload from '@/components/forms/singleImageUpload'
import floatingLegos from '@/images/floatingLegos.svg'
import underLineImage from '@/images/lightlyWavedLine.svg'

type CreateMissionFormDataType = {
  missionTitle: string
  missionImage: ImageType
  missionDescription: string
  missionCategory: string
}

const CreateMissionFormSchema = yup
  .object()
  .shape({
    missionTitle: yup.string().required('Mission Title is required'),
    missionImage: yup.object().required('Mission Image is required'),
    missionDescription: yup.string().required('Mission Description is required'),
    missionCategory: yup.string().required('Mission Category is required'),
  })
  .required()

const CreateMissionOrEdit = ({ user }: { user: User }) => {
  const router = useRouter()
  const session = useSession()
  console.log(session)
  const oldCategories: string[] = ['Math', 'Science', 'English']

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
  } = useForm<CreateMissionFormDataType>({
    resolver: yupResolver(CreateMissionFormSchema),
  })

  const onSubmitHandler = async (data: CreateMissionFormDataType) => {
    console.log(data)
  }

  const [addNewCategoryState, setAddNewCategoryState] = React.useState({
    newCategoryName: '',
    open: false,
  })

  return (
    <>
      <Head>
        <title>NinjaCo | Create or Edit Mission</title>
        <meta name="description" content="Create or Edit Mission" />
      </Head>
      <main className="w-full">
        <CreatorMenu creator={user} isOnCoursePage={true} isOnGamesPage={false} />
        <CreateResourceCard
          title="Create Mission"
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
            <Input
              {...register('missionTitle')}
              label={'Mission Title'}
              placeholder="Mission Title"
              error={errors.missionTitle?.message}
              isRequired={true}
            />
            <SingleImageUpload
              control={control}
              name={register('missionImage').name}
              error={errors.missionImage?.message as unknown as string} // Convert to string since it returned a FieldError
              isRequired={true}
              label="Mission Banner Image"
            />
            <TextArea
              cols={4}
              rows={4}
              control={control}
              name={register('missionDescription').name}
              ref={register('missionDescription').ref}
              label={'Mission Description'}
              placeholder="Mission Description"
              error={errors.missionDescription?.message}
              className="resize-none"
              isRequired={true}
            />
            <SelectWithAddition
              control={control}
              name={register('missionCategory').name}
              error={errors.missionCategory?.message}
              isRequired={true}
              label="Mission Category"
              placeholder="Select a Category"
              selectList={oldCategories}
              callBackOnClickAddition={() => {
                setAddNewCategoryState({
                  newCategoryName: '',
                  open: true,
                })
              }}
            />

            <AdminAlertDialog
              open={addNewCategoryState.open}
              title="Create a new category"
              close={() => {
                setAddNewCategoryState({
                  newCategoryName: '',
                  open: false,
                })
              }}
              confirm={() => {
                setValue('missionCategory', addNewCategoryState.newCategoryName)
                setAddNewCategoryState({
                  newCategoryName: '',
                  open: false,
                })
              }}
              backButtonText="Cancel"
              confirmButtonText="Create"
              backButtonClassName="bg-error text-brand hover:bg-error-dark hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
              confirmButtonClassName="bg-brand-200 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
            >
              <Input
                name="addCategory"
                label="New Category"
                placeholder="New Category"
                value={addNewCategoryState.newCategoryName ?? null}
                onChange={(e) => {
                  setAddNewCategoryState({
                    newCategoryName: e.target.value,
                    open: true,
                  })
                }}
              />
            </AdminAlertDialog>

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
                Create Mission
              </button>
            </div>
          </form>
        </CreateResourceCard>
      </main>
    </>
  )
}

export default CreateMissionOrEdit

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
