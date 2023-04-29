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
import { Mission } from '@/models/crud/mission.model'
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

const EditMission = ({
  user,
  course,
  mission,
  serverCategories,
}: {
  user: User
  course: Course
  mission: Mission
  serverCategories: Category[]
}) => {
  const t = useTranslation()
  const router = useRouter()
  const session = useSession()
  const queryClient = useQueryClient()
  const scrollToTop = () => {
    window.scrollTo({
      top: 25,
      behavior: 'smooth',
    })
  }
  type EditMissionFormDataType = {
    title: string
    image: ImageType
    description: string
    categoryName: string
  }

  const EditMissionFormSchema = yup
    .object()
    .shape({
      title: yup.string().required(t.Creator.editMissionPage.missionTitleRequired as string),
      image: yup.object(),
      description: yup
        .string()
        .required(t.Creator.editMissionPage.missionDescriptionRequired as string),
      categoryName: yup
        .string()
        .required(t.Creator.editMissionPage.missionCategoryRequired as string),
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
            message: errors[0].message || (t.Creator.editMissionPage.somethingWrong as string),
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
    formState: { errors, dirtyFields },
  } = useForm<EditMissionFormDataType>({
    resolver: yupResolver(EditMissionFormSchema),
    defaultValues: {
      title: mission.title,
      description: mission.description,
      categoryName:
        categories.find((category) => category._id === mission.categoryId)?.categoryName || '',
    },
  })

  const onSubmitHandler = async (data: EditMissionFormDataType) => {
    // I had to use any, because the dirtyData.image type will get change from ImageType to string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dirtyData: any = {}
    Object.keys(dirtyFields).forEach((key) => {
      dirtyData[key] = data[key]
    })

    // if no changes, return
    if (Object.keys(dirtyData).length === 0) {
      setAlertData({
        message: t.Creator.editMissionPage.noChangesMade as string,
        variant: 'warning',
        open: true,
      })
      scrollToTop()

      return
    }

    try {
      if (dirtyData.image && dirtyData.image.file) {
        // Upload Image and get url
        const imageUploadRes = await new ImageApi(session.data).uploadImage({
          image: dirtyData.image.file,
        })
        dirtyData.image = imageUploadRes.payload.image_url
      }

      if (dirtyData.categoryName) {
        const category = categories.find(
          (category) => category.categoryName === dirtyData.categoryName
        )
        if (category) {
          dirtyData.categoryId = category._id
        }
      }
      await new MissionApi(course._id, session.data).update(mission._id, {
        ...dirtyData,
      })

      router.push(`/creator/${course._id}/${mission._id}`)
    } catch (error) {
      if (isAxiosError<AuthError>(error)) {
        const errors = unWrapAuthError(error)
        setAlertData({
          message: errors[0].message || (t.Creator.editMissionPage.somethingWrong as string),
          variant: 'error',
          open: true,
        })
        scrollToTop()
      } else {
        setAlertData({
          message: t.Creator.editMissionPage.errorEditingMission as string,
          variant: 'error',
          open: true,
        })
        scrollToTop()
      }
    }
  }

  const [addNewCategoryState, setAddNewCategoryState] = React.useState({
    newCategoryName: '',
    newCategoryId: '',
    open: false,
  })

  const addNewCategoryAndSelectIt = async () => {
    try {
      await new CategoryApi(session.data).create({
        categoryName: addNewCategoryState.newCategoryName,
      })
      queryClient.invalidateQueries('categories')

      setValue('categoryName', addNewCategoryState.newCategoryName)
      setAddNewCategoryState({
        newCategoryName: '',
        newCategoryId: '',
        open: false,
      })
    } catch (error) {
      if (isAxiosError<AuthError>(error)) {
        const errors = unWrapAuthError(error)
        setAlertData({
          message: errors[0].message || (t.Creator.editMissionPage.somethingWrong as string),
          variant: 'error',
          open: true,
        })
        scrollToTop()
      } else {
        setAlertData({
          message: t.Creator.editMissionPage.errorCreatingCategory as string,
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
          title={t.Creator.editMissionPage.editMission as string}
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
              {...register('title')}
              label={t.Creator.editMissionPage.missionTitle as string}
              placeholder={t.Creator.editMissionPage.missionTitle as string}
              error={errors.title?.message}
              isRequired={true}
            />
            <SingleImageUpload
              control={control}
              name={register('image').name}
              error={errors.image?.message as unknown as string} // Convert to string since it returned a FieldError
              isRequired={true}
              label={t.Creator.editMissionPage.missionBannerImage as string}
              defaultImage={mission.image}
            />
            <TextArea
              cols={4}
              rows={4}
              control={control}
              name={register('description').name}
              ref={register('description').ref}
              label={t.Creator.editMissionPage.missionDescription as string}
              placeholder={t.Creator.editMissionPage.missionDescription as string}
              error={errors.description?.message}
              className="resize-none"
              isRequired={true}
            />
            <SelectWithAddition
              control={control}
              name={register('categoryName').name}
              error={errors.categoryName?.message}
              isRequired={true}
              label={t.Creator.editMissionPage.missionCategory as string}
              placeholder={t.Creator.editMissionPage.missionCategory as string}
              selectList={categories.map((category) => category.categoryName)}
              callBackOnClickAddition={() => {
                setAddNewCategoryState({
                  newCategoryName: '',
                  newCategoryId: '',
                  open: true,
                })
              }}
            />

            <AdminAlertDialog
              open={addNewCategoryState.open}
              title={t.Creator.editMissionPage.createNewCategory as string}
              close={() => {
                setAddNewCategoryState({
                  newCategoryName: '',
                  newCategoryId: '',
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
                <p className="text-brand text-sm">{t.Creator.editMissionPage.warning}</p>
              </div>

              <Input
                name={t.Creator.editMissionPage.addCategory as string}
                label={t.Creator.editMissionPage.newCategory as string}
                placeholder={t.Creator.editMissionPage.newCategory as string}
                value={addNewCategoryState.newCategoryName ?? null}
                onChange={(e) => {
                  setAddNewCategoryState({
                    newCategoryName: e.target.value,
                    newCategoryId: '',
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
                {t.Creator.editMissionPage.cancel}
              </button>
              <button
                type="submit"
                form="form"
                value="Submit"
                className="w-full md:w-40 h-fit btn bg-brand-200 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
              >
                {t.Creator.editMissionPage.editMission}
              </button>
            </div>
          </form>
        </CreateResourceCard>
      </main>
    </>
  )
}

export default EditMission

export const getServerSideProps = async (context) => {
  const { query, req, res } = context

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

  const courseResponse = await new CourseApi(session).findOne(courseId as string)
  if (!courseResponse || !courseResponse.payload) {
    return {
      redirect: {
        destination: '/creator',
        permanent: false,
      },
    }
  }

  const mission = courseResponse.payload.missions.find((mission) => mission._id === missionId)

  if (!mission) {
    return {
      redirect: {
        destination: `/creator/${courseId}`,
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
      mission: mission,
      serverCategories: categories.payload,
    },
  }
}
