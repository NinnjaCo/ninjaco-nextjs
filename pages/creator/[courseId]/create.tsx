import * as yup from 'yup'
import { AdminAlertDialog } from '@/components/admin/dialog'
import { AuthError } from '@/models/shared'
import { AxiosError } from 'axios'
import { Category } from '@/models/crud/category.model'
import { CategoryApi } from '@/utils/api/category/category.api'
import { Course } from '@/models/crud/course.model'
import { CourseApi } from '@/utils/api/course/course.api'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { ImageApi } from '@/utils/api/images/image-upload.api'
import { ImageType } from 'react-images-uploading'
import { Input } from '@/components/forms/input'
import { MissionApi } from '@/utils/api/mission/mission.api'
import { TextArea } from '@/components/forms/textArea'
import { User } from '@/models/crud'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { isAxiosError, unWrapAuthError } from '@/utils/errors'
import { useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from 'react-query'
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
import useTranslation from '@/hooks/useTranslation'

const CreateMissionOrEdit = ({
  user,
  course,
  serverCategories,
}: {
  user: User
  course: Course
  serverCategories: Category[]
}) => {
  const t = useTranslation()
  const router = useRouter()
  const session = useSession()
  const queryClient = useQueryClient()
  const [createButtonDisabled, setCreateButtonDisabled] = React.useState(false)
  const scrollToTop = () => {
    window.scrollTo({
      top: 25,
      behavior: 'smooth',
    })
  }

  type CreateMissionFormDataType = {
    missionTitle: string
    missionImage: ImageType
    missionDescription: string
    missionCategory: string
  }

  const CreateMissionFormSchema = yup
    .object()
    .shape({
      missionTitle: yup
        .string()
        .required(t.Creator.createMissionPage.missionTitleRequired as string),
      missionImage: yup
        .object()
        .required(t.Creator.createMissionPage.missionImageRequired as string),
      missionDescription: yup
        .string()
        .required(t.Creator.createMissionPage.missionDescriptionRequired as string),
      missionCategory: yup
        .string()
        .required(t.Creator.createMissionPage.missionCategoryRequired as string),
    })
    .required()

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

  const { data: fetechedCategories } = useQuery<Category[]>(
    ['categories', session],
    async () => {
      const response = await new CategoryApi(session.data).find()
      return response.payload
    },
    {
      initialData: serverCategories,
      enabled: !!session.data,
      onError: (error) => {
        if (isAxiosError(error)) {
          const errors = unWrapAuthError(error as AxiosError<AuthError> | undefined)
          setAlertData({
            message: errors[0].message || (t.Creator.createMissionPage.somethingWrong as string),
            variant: 'error',
            open: true,
          })
          scrollToTop()
        }
      },
    }
  )

  const categories = fetechedCategories || serverCategories

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
    setCreateButtonDisabled(true)
    if (!data.missionImage.file) {
      setAlertData({
        message: t.Creator.createMissionPage.pleaseUploadImage as string,
        variant: 'error',
        open: true,
      })
      scrollToTop()
      setCreateButtonDisabled(false)
      return
    }

    setAlertData({
      message: 'Creating mission...',
      variant: 'info',
      open: true,
    })
    scrollToTop()

    try {
      const imageUploadRes = await new ImageApi(session.data).uploadImage({
        image: data.missionImage.file,
      })
      await new MissionApi(course._id, session.data).create({
        title: data.missionTitle,
        image: imageUploadRes.payload.image_url,
        description: data.missionDescription,
        categoryId: categories.find((c) => c.categoryName === data.missionCategory)?._id || '',
      })
      router.push(`/creator/${course._id}`)
    } catch (error) {
      if (isAxiosError<AuthError>(error)) {
        const errors = unWrapAuthError(error)
        setAlertData({
          message: errors[0].message || (t.Creator.createMissionPage.somethingWrong as string),
          variant: 'error',
          open: true,
        })
        scrollToTop()
        setCreateButtonDisabled(false)
      } else {
        setAlertData({
          message: t.Creator.createMissionPage.errorCreatingGame as string,
          variant: 'error',
          open: true,
        })
        scrollToTop()
        setCreateButtonDisabled(false)
      }
    }
  }

  const [addNewCategoryState, setAddNewCategoryState] = React.useState({
    newCategoryName: '',
    open: false,
  })

  const addNewCategoryAndSelectIt = async () => {
    try {
      await new CategoryApi(session.data).create({
        categoryName: addNewCategoryState.newCategoryName,
      })
      queryClient.invalidateQueries('categories')

      setValue('missionCategory', addNewCategoryState.newCategoryName)
      setAddNewCategoryState({
        newCategoryName: '',
        open: false,
      })
    } catch (error) {
      if (isAxiosError<AuthError>(error)) {
        const errors = unWrapAuthError(error)
        setAlertData({
          message: errors[0].message || (t.Creator.createMissionPage.somethingWrong as string),
          variant: 'error',
          open: true,
        })
        scrollToTop()
      } else {
        setAlertData({
          message: t.Creator.createMissionPage.errorCreatingCategory as string,
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
        <title>NinjaCo | Create Mission</title>
        <meta name="description" content="Create Mission" />
      </Head>
      <main className="w-full">
        <CreatorMenu creator={user} isOnCoursePage={true} isOnGamesPage={false} />
        <CreateResourceCard
          title={t.Creator.createMissionPage.createMission as string}
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
              label={t.Creator.createMissionPage.missionTitle as string}
              placeholder={t.Creator.createMissionPage.missionTitle as string}
              error={errors.missionTitle?.message}
              isRequired={true}
            />
            <SingleImageUpload
              control={control}
              name={register('missionImage').name}
              error={errors.missionImage?.message as unknown as string} // Convert to string since it returned a FieldError
              isRequired={true}
              label={t.Creator.createMissionPage.missionBannerImage as string}
            />
            <TextArea
              cols={4}
              rows={4}
              control={control}
              name={register('missionDescription').name}
              ref={register('missionDescription').ref}
              label={t.Creator.createMissionPage.missionDescription as string}
              placeholder={t.Creator.createMissionPage.missionDescription as string}
              error={errors.missionDescription?.message}
              className="resize-none"
              isRequired={true}
            />
            <SelectWithAddition
              control={control}
              name={register('missionCategory').name}
              error={errors.missionCategory?.message}
              isRequired={true}
              label={t.Creator.createMissionPage.missionCategory as string}
              placeholder={t.Creator.createMissionPage.selectACategory as string}
              selectList={categories.map((category) => category.categoryName)}
              callBackOnClickAddition={() => {
                setAddNewCategoryState({
                  newCategoryName: '',
                  open: true,
                })
              }}
            />

            <AdminAlertDialog
              open={addNewCategoryState.open}
              title={t.Creator.createMissionPage.createNewCategory as string}
              close={() => {
                setAddNewCategoryState({
                  newCategoryName: '',
                  open: false,
                })
              }}
              confirm={() => {
                addNewCategoryAndSelectIt()
              }}
              backButtonText="Cancel"
              confirmButtonText="Create"
              backButtonClassName="bg-error text-brand hover:bg-error-dark hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
              confirmButtonClassName="bg-brand-200 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
            >
              {/* add warning that categories created cannot be deleted for consistency purposes */}
              <div className="flex gap-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-error-dark" />
                <p className="text-brand text-sm">{t.Creator.createMissionPage.warning}</p>
              </div>

              <Input
                name={t.Creator.createMissionPage.addCategory as string}
                label={t.Creator.createMissionPage.newCategory as string}
                placeholder={t.Creator.createMissionPage.newCategory as string}
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
                className="w-full md:w-40 h-fit btn bg-error text-brand hover:bg-error-dark hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={(e) => {
                  e.preventDefault()
                  router.back()
                }}
                disabled={createButtonDisabled}
              >
                {t.Creator.createMissionPage.cancel as string}
              </button>
              <button
                type="submit"
                form="form"
                value="Submit"
                className="w-full md:w-40 h-fit btn bg-brand-200 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={createButtonDisabled}
              >
                {t.Creator.createMissionPage.createMission as string}
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

  const courseResponse = await new CourseApi(session).findOne(courseId as string)
  if (!courseResponse || !courseResponse.payload) {
    return {
      redirect: {
        destination: '/creator',
        permanent: false,
      },
    }
  }

  const categories = await new CategoryApi(session).find()

  if (!categories || !categories.payload) {
    return {
      redirect: {
        destination: '/creator',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: session.user,
      course: courseResponse.payload,
      serverCategories: categories.payload,
    },
  }
}
