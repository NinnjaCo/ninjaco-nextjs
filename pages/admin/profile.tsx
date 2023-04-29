import * as yup from 'yup'
import { AdminAlertDialog } from '@/components/admin/dialog'
import { AuthError } from '@/models/shared'
import { AxiosError } from 'axios'
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/solid'
import { ImageApi } from '@/utils/api/images/image-upload.api'
import { ImageType } from 'react-images-uploading'
import { Input } from '@/components/forms/input'
import { RoleEnum, User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { isAxiosError, unWrapAuthError } from '@/utils/errors'
import { useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from 'react-query'
import { useSession } from 'next-auth/react'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@/components/shared/alert'
import DatePickerWithHookForm from '@/components/forms/datePickerWithHookForm'
import Head from 'next/head'
import ProfileImageUpload from '@/components/forms/profileImageUpload'
import React from 'react'
import SideMenu from '@/components/admin/sideMenu'
import useTranslation from '@/hooks/useTranslation'
import useUserProfilePicture from '@/hooks/useUserProfilePicture'

interface ServerProps {
  serverUser: User
}

type AddAdminFormDataType = {
  firstName: string
  lastName: string
  dateOfBirth: Date
  email: string
  password: string
  passwordConfirmation: string
}

const AddAdminFormSchema = yup
  .object()
  .shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup
      .string()
      .required('Last Name is required')
      .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
    dateOfBirth: yup
      .date()
      .max(new Date(), 'Date of Birth cannot be in the future')
      .required('Date of Birth is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Password Confirmation is required'),
  })
  .required()

type AdminProfileFormDataType = {
  firstName: string
  lastName: string
  profilePictureState: { image: ImageType; didRemove: boolean }
  dateOfBirth: Date
  email: string
  password: string
  passwordConfirmation: string
}
const useNonNullUser = (user: User | undefined, serverUser: User) => {
  if (user === undefined) return serverUser
  return user
}
export default function Profile({ serverUser }: ServerProps) {
  const queryClient = useQueryClient()
  const { data: session, update: updateSession } = useSession()
  const t = useTranslation()

  const { data: fetchedUser } = useQuery<User>(
    ['user', session],
    async () => {
      const response = await new UserApi(session).findOne(serverUser._id)
      return response.payload
    },
    {
      initialData: serverUser,
      enabled: !!session,
      onError: (error) => {
        if (isAxiosError(error)) {
          const errors = unWrapAuthError(error as AxiosError<AuthError> | undefined)
          setAlertData({
            message: errors[0].message || 'Something went wrong',
            variant: 'error',
            open: true,
          })
        }
      },
    }
  )

  const user = useNonNullUser(fetchedUser, serverUser)

  const [saveButtonDisabled, setSaveButtonDisabled] = React.useState(false)

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

  const AdminProfileFormSchema = yup
    .object()
    .shape(
      {
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
        dateOfBirth: yup
          .date()
          .max(new Date(), 'Date of Birth cannot be in the future')
          .required('Date of Birth is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().when('password', {
          is: (val) => val && val.length > 0,
          then: (schema) => schema.min(8, 'Password must be at least 8 characters'),
        }),
        passwordConfirmation: yup.string().when('password', {
          is: (val) => val && val.length > 0,
          then: (schema) => schema.oneOf([yup.ref('password')], 'Passwords must match'),
        }),
      },
      [['password', 'password']]
    )
    .required()

  const {
    register: registerAdminProfile,
    handleSubmit: handleSubmitAdminProfile,
    control: controlAdminProfile,
    reset,
    formState: { errors: errorsAdminProfile, dirtyFields },
  } = useForm<AdminProfileFormDataType>({
    resolver: yupResolver(AdminProfileFormSchema),
    defaultValues: {
      firstName: user?.firstName || serverUser.firstName,
      lastName: user?.lastName || serverUser.lastName,
      dateOfBirth: new Date(user?.dateOfBirth || serverUser.dateOfBirth),
      email: user?.email || serverUser.email,
      password: '',
      passwordConfirmation: '',
    },
  })

  // Handle form submission
  const submitHandler = async (data: AdminProfileFormDataType) => {
    if (!user) return

    // check the dirty fields and only send the data that has been changed
    setSaveButtonDisabled(true)
    const dirtyFieldsArray = Object.keys(dirtyFields)
    let dirtyData = {}
    dirtyFieldsArray.forEach((field) => {
      if (field === 'profilePictureState') {
        return
      } else {
        dirtyData[field] = data[field]
      }
    })

    if (data.profilePictureState && data.profilePictureState.didRemove && user.profilePicture) {
      dirtyData = {
        ...dirtyData,
        profilePicture: null,
      }
    }

    if (data.profilePictureState && data.profilePictureState.image) {
      dirtyData = {
        ...dirtyData,
        profilePicture: data.profilePictureState.image.dataURL,
      }
    }

    // if empty object, i.e. no changes made, return
    if (dirtyFieldsArray.length === 0) {
      setSaveButtonDisabled(false)
      setAlertData({
        message: 'No changes made',
        variant: 'warning',
        open: true,
      })
      return
    }

    try {
      // They change the profile pic
      if (
        data.profilePictureState &&
        data.profilePictureState.image &&
        data.profilePictureState.image.file
      ) {
        // Upload Image and get url
        const imageUploadRes = await new ImageApi(session).uploadImage({
          image: data.profilePictureState.image.file,
        })

        // add url to dirty data
        dirtyData = {
          ...dirtyData,
          profilePicture: imageUploadRes.payload.image_url,
        }
      }
      const res = await new UserApi(session).update(serverUser._id, dirtyData)

      // update user using react-query
      // refetch the user data
      await queryClient.invalidateQueries('user')
      setAlertData({
        message: 'Profile updated successfully',
        variant: 'success',
        open: true,
      })
      // reset react hook form
      await reset({
        firstName: res.payload.firstName,
        lastName: res.payload.lastName,
        dateOfBirth: new Date(res.payload.dateOfBirth),
        email: res.payload.email,
        password: '',
        passwordConfirmation: '',
      })

      await updateSession({
        ...session,
        user: {
          ...res.payload,
        },
      })

      setSaveButtonDisabled(false)
    } catch (error) {
      setSaveButtonDisabled(false)
      if (isAxiosError<AuthError>(error)) {
        const errors = unWrapAuthError(error)
        setAlertData({
          message: errors[0].message || 'Something went wrong',
          variant: 'error',
          open: true,
        })
      } else {
        setAlertData({
          message: 'Error updating profile',
          variant: 'error',
          open: true,
        })
      }
    }
  }

  const [openCreatorAddDialog, setOpenCreatorAddDialog] = React.useState(false)
  const {
    register: registerAdminAdd,
    handleSubmit: handleSubmitAdminAdd,
    control: controlAdminAdd,
    formState: { errors: errorsAdminAdd },
  } = useForm<AddAdminFormDataType>({
    resolver: yupResolver(AddAdminFormSchema),
  })

  const onSubmitHandler = async (data: AddAdminFormDataType) => {
    try {
      closeAlert()

      await new UserApi(session).create({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth.toISOString(),
        email: data.email,
        password: data.password,
        role: RoleEnum.ADMIN,
        isVerified: true,
      })

      setOpenCreatorAddDialog(false)
      queryClient.invalidateQueries('users')
      setAlertData({
        message: t.Admin.Creators.createdSuccessfully as string,
        variant: 'success',
        open: true,
      })
    } catch (error) {
      setOpenCreatorAddDialog(false)
      if (isAxiosError<AuthError>(error)) {
        const errors = unWrapAuthError(error)
        setAlertData({
          message: errors[0].message || (t.Admin.Creators.somethingWentWrong as string),
          variant: 'error',
          open: true,
        })
      }
    }
  }

  return (
    <>
      <Head>
        <title>NinjaCo | Admin Profile</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AdminAlertDialog
        title={t.Admin.Creators.addCreators as string}
        open={openCreatorAddDialog}
        confirm={() => {}} // Confirmation is done inside the form body
        close={() => setOpenCreatorAddDialog(false)}
        backButtonText="Cancel"
        backButtonClassName="bg-brand-200 text-brand-500 hover:bg-brand-300 hover:text-brand hidden"
        confirmButtonText="Add User"
        confirmButtonClassName="bg-brand-500 text-brand-50 hover:bg-brand-700 hidden"
      >
        <form
          onSubmit={handleSubmitAdminAdd(onSubmitHandler)}
          className="flex flex-col gap-4"
          id="form"
        >
          <Input
            {...registerAdminAdd('firstName')}
            label={t.Admin.Creators.firstName as string}
            placeholder="John"
            StartIcon={UserIcon}
            error={errorsAdminAdd.firstName?.message}
            isRequired={true}
          />
          <Input
            {...registerAdminAdd('lastName')}
            label={t.Admin.Creators.lastName as string}
            placeholder="Smith"
            StartIcon={UserIcon}
            error={errorsAdminAdd.lastName?.message}
            isRequired={true}
          />
          <DatePickerWithHookForm
            control={controlAdminAdd}
            name={registerAdminAdd('dateOfBirth').name} // we only need the "name" prop
            label={t.Admin.Creators.dateOfBirth as string}
            error={errorsAdminAdd.dateOfBirth?.message}
            isRequired={true}
          />
          <Input
            {...registerAdminAdd('email')}
            label="Email"
            placeholder="Email"
            StartIcon={EnvelopeIcon}
            error={errorsAdminAdd.email?.message}
            isRequired={true}
          />
          <Input
            {...registerAdminAdd('password')}
            type="password"
            label={t.Admin.Creators.password as string}
            placeholder={t.Admin.Creators.password as string}
            StartIcon={LockClosedIcon}
            error={errorsAdminAdd.password?.message}
            isRequired={true}
          />
          <Input
            {...registerAdminAdd('passwordConfirmation')}
            type="password"
            label={t.Admin.Creators.confirmPassword as string}
            placeholder={t.Admin.Creators.confirmPassword as string}
            StartIcon={LockClosedIcon}
            error={errorsAdminAdd.passwordConfirmation?.message}
            isRequired={true}
          />
          <button
            type="submit"
            form="form"
            value="Submit"
            className="w-full btn bg-brand-200 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
          >
            {t.Admin.Creators.addCreators as string}
          </button>
          <button
            onClick={() => setOpenCreatorAddDialog(false)}
            className="w-full btn bg-brand-50 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
          >
            {t.Admin.Creators.cancel as string}
          </button>
        </form>
      </AdminAlertDialog>

      <div className="flex w-full h-screen ">
        <SideMenu higlightProfile={true} />
        <main className="flex w-full h-screen overflow-y-scroll ">
          <div className="flex items-start gap-4 w-full py-8 px-4 flex-col md:flex-row">
            <div className="px-8 w-full md:w-auto flex flex-col items-center justify-center md:justify-start">
              <ProfileImageUpload
                control={controlAdminProfile}
                name="profilePictureState"
                defaultStartImage={useUserProfilePicture(user)}
                user={user}
              />
            </div>
            <form
              id="form"
              onSubmit={handleSubmitAdminProfile(submitHandler)}
              className="flex flex-col w-full h-full gap-6 md:gap-12 py-8 px-4"
            >
              <div className="flex w-full justify-between items-center">
                <div className="text-brand text-lg md:text-xl lg:text-2xl font-semibold">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="btn btn-secondary gap-2 text-brand rounded-lg hover:bg-brand-500 hover:text-white py-2"
                    onClick={() => {
                      setOpenCreatorAddDialog(true)
                    }}
                  >
                    {t.Profile.addAdmin}
                  </button>

                  <button
                    type="submit"
                    form="form"
                    value="Submit"
                    className="btn btn-brand rounded-lg px-4 sm:pr-6 py-2 hover:bg-brand-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center align-center"
                    disabled={saveButtonDisabled}
                  >
                    {t.Profile.save}
                  </button>
                </div>
              </div>
              <Alert
                open={alertData.open}
                message={alertData.message}
                variant={alertData.variant}
                close={closeAlert}
              />
              <div className="bg-brand-50 p-4 rounded w-full flex flex-col gap-4">
                <div className="hidden md:block text-brand font-semibold text-sm md:text-base">
                  {t.Profile.profile}
                </div>
                <div className="flex flex-col md:flex-row flex-wrap w-full gap-2 md:gap-4">
                  <div className="flex-1 flex-shrink">
                    <Input
                      {...registerAdminProfile('firstName')}
                      label={t.Profile.firstName}
                      placeholder="John"
                      StartIcon={UserIcon}
                      error={errorsAdminProfile.firstName?.message}
                    />
                  </div>
                  <div className="flex-1 flex-shrink">
                    <Input
                      {...registerAdminProfile('lastName')}
                      label={t.Profile.lastName}
                      placeholder="Smith"
                      StartIcon={UserIcon}
                      error={errorsAdminProfile.lastName?.message}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row flex-wrap w-full gap-4">
                  <div className="flex-1 flex-shrink">
                    <DatePickerWithHookForm
                      control={controlAdminProfile}
                      name={registerAdminProfile('dateOfBirth').name} // we only need the "name" prop
                      label={t.Profile.dateOfBirth as string}
                      error={errorsAdminProfile.dateOfBirth?.message}
                    />
                  </div>
                  <div className="flex-1 flex-shrink">
                    <Input
                      {...registerAdminProfile('email')}
                      label="Email"
                      placeholder={'Email'}
                      StartIcon={EnvelopeIcon}
                      error={errorsAdminProfile.email?.message}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-brand-50 p-4 rounded w-full flex flex-col gap-4 ">
                <div className="hidden md:block text-brand font-semibold text-sm md:text-base">
                  {t.Profile.changePassword}
                </div>
                <div className="flex flex-col md:flex-row flex-wrap w-full gap-2 md:gap-4 ">
                  <div className="flex-1 flex-shrink ">
                    <Input
                      {...registerAdminProfile('password')}
                      label={t.Profile.password}
                      placeholder="Password"
                      type="password"
                      StartIcon={LockClosedIcon}
                      error={errorsAdminProfile.password?.message}
                    />
                  </div>
                  <div className="flex-1 flex-shrink">
                    <Input
                      {...registerAdminProfile('passwordConfirmation')}
                      label={t.Profile.confirmPassword}
                      type="password"
                      placeholder="Confirm Password"
                      StartIcon={LockClosedIcon}
                      error={errorsAdminProfile.passwordConfirmation?.message}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  )
}
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
      serverUser: session.user,
    },
  }
}
