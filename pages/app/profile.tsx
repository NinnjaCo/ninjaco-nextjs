import * as yup from 'yup'
import { AuthError } from '@/models/shared'
import { AxiosError } from 'axios'
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/solid'
import { ImageApi } from '@/utils/api/images/image-upload.api'
import { ImageType } from 'react-images-uploading'
import { Input } from '@/components/forms/input'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { isAxiosError, unWrapAuthError } from '@/utils/errors'
import { signOut, useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@/components/shared/alert'
import CreatorMenu from '@/components/creator/creatorMenu'
import DatePickerWithHookForm from '@/components/forms/datePickerWithHookForm'
import Head from 'next/head'
import LevelIndicator from '@/components/shared/level'
import ProfileImageUpload from '@/components/forms/profileImageUpload'
import React from 'react'
import UserMenu from '@/components/user/userMenu'
import useTranslation from '@/hooks/useTranslation'
import useUserProfilePicture from '@/hooks/useUserProfilePicture'

interface ServerProps {
  serverUser: User
}

type UserProfileFormDataType = {
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
  const session = useSession()
  const t = useTranslation()

  const { data: fetchedUser } = useQuery<User>(
    ['user', session],
    async () => {
      const response = await new UserApi(session.data).findOne(serverUser._id)
      return response.payload
    },
    {
      initialData: serverUser,
      enabled: !!session.data,
      onError: (error) => {
        if (isAxiosError(error)) {
          const errors = unWrapAuthError(error as AxiosError<AuthError> | undefined)
          setAlertData({
            message: errors[0].message || (t.User.profile.somethingWentWrong as string),
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

  const UserProfileFormSchema = yup
    .object()
    .shape(
      {
        firstName: yup.string().required(t.User.profile.firstNameIsRequired as string),
        lastName: yup.string().required(t.User.profile.lastNameIsRequired as string),
        profilePictureState: yup.object(),
        dateOfBirth: yup
          .date()
          .max(new Date(), t.User.profile.dateOfBirthIsNotValid as string)
          .required(t.User.profile.dateOfBirthIsRequired as string),
        email: yup
          .string()
          .email(t.User.profile.invalidEmail as string)
          .required(t.User.profile.emailIsRequired as string),
        password: yup.string().when('password', {
          is: (val) => val && val.length > 0,
          then: (schema) => schema.min(8, t.User.profile.passwordIsRequired as string),
        }),
        passwordConfirmation: yup.string().when('password', {
          is: (val) => val && val.length > 0,
          then: (schema) =>
            schema.oneOf([yup.ref('password')], t.User.profile.passwordMustMatch as string),
        }),
      },
      [['password', 'password']]
    )
    .required()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<UserProfileFormDataType>({
    resolver: yupResolver(UserProfileFormSchema),
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
  const submitHandler = async (data: UserProfileFormDataType) => {
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
    if (Object.keys(dirtyData).length === 0) {
      setSaveButtonDisabled(false)
      setAlertData({
        message: t.User.profile.noChangesMade as string,
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
        const imageUploadRes = await new ImageApi(session.data).uploadImage({
          image: data.profilePictureState.image.file,
        })

        // add url to dirty data
        dirtyData = {
          ...dirtyData,
          profilePicture: imageUploadRes.payload.image_url,
        }
      }
      const res = await new UserApi(session.data).update(serverUser._id, dirtyData)

      // update user using react-query
      // refetch the user data
      await queryClient.invalidateQueries('user')
      setAlertData({
        message: t.User.profile.profileUpdatedSuccessfully as string,
        variant: 'success',
        open: true,
      })
      // reset react hook form
      reset({
        firstName: res.payload.firstName,
        lastName: res.payload.lastName,
        dateOfBirth: new Date(res.payload.dateOfBirth),
        email: res.payload.email,
        password: '',
        passwordConfirmation: '',
      })

      await session.update({
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
          message: errors[0].message || (t.User.profile.somethingWentWrong as string),
          variant: 'error',
          open: true,
        })
      } else {
        setAlertData({
          message: t.User.profile.errorUpdatingProfile as string,
          variant: 'error',
          open: true,
        })
      }
    }
  }

  return (
    <>
      <Head>
        <title>NinjaCo | Profile</title>
        <meta name="description" content="View and edit your profile in NinjaCo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="relative h-screen w-full">
        <UserMenu isOnCoursePage={false} isOnGamesPage={false} user={user} />
        <div className="flex items-start gap-4 w-full py-8 px-4 flex-col md:flex-row">
          <div className="px-8 w-full md:w-auto flex flex-col items-center justify-center md:justify-start">
            <ProfileImageUpload
              control={control}
              name="profilePictureState"
              defaultStartImage={useUserProfilePicture(user)}
              user={user}
            />
          </div>
          <form
            id="form"
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col w-full gap-6 md:gap-6 "
          >
            <div className="flex w-full flex-col md:flex-row justify-start md:justify-between items-center gap-4 md:gap-0 ">
              <div className="text-brand text-lg md:text-xl lg:text-2xl font-semibold">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  className="btn btn-warning rounded-lg px-4 sm:pr-6 py-2 hover:bg-error hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  onClick={(e) => {
                    e.preventDefault()
                    signOut()
                  }}
                >
                  {t.User.profile.logout}
                </button>
                <button
                  type="submit"
                  form="form"
                  value="Submit"
                  className="btn btn-secondary rounded-lg px-4 sm:pr-6 py-2 hover:bg-brand-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={saveButtonDisabled}
                >
                  {t.Profile.save}
                </button>
              </div>
              <div className="md:hidden block lg:w-64 md:w-48 w-36 pl-6 pt-4 ">
                <LevelIndicator points={user.points} />
              </div>
            </div>
            <div className="md:block hidden lg:w-64 md:w-48 w-32 ">
              <LevelIndicator points={user.points} />
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
                    {...register('firstName')}
                    label={t.Profile.firstName}
                    placeholder="John"
                    StartIcon={UserIcon}
                    error={errors.firstName?.message}
                  />
                </div>
                <div className="flex-1 flex-shrink">
                  <Input
                    {...register('lastName')}
                    label={t.Profile.lastName}
                    placeholder="Smith"
                    StartIcon={UserIcon}
                    error={errors.lastName?.message}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row flex-wrap w-full gap-4">
                <div className="flex-1 flex-shrink">
                  <DatePickerWithHookForm
                    control={control}
                    name={register('dateOfBirth').name} // we only need the "name" prop
                    label={t.Profile.dateOfBirth as string}
                    error={errors.dateOfBirth?.message}
                  />
                </div>
                <div className="flex-1 flex-shrink">
                  <Input
                    {...register('email')}
                    label="Email"
                    placeholder={'Email'}
                    StartIcon={EnvelopeIcon}
                    error={errors.email?.message}
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
                    {...register('password')}
                    label={t.Profile.password}
                    placeholder="Password"
                    type="password"
                    StartIcon={LockClosedIcon}
                    error={errors.password?.message}
                  />
                </div>
                <div className="flex-1 flex-shrink">
                  <Input
                    {...register('passwordConfirmation')}
                    label={t.Profile.confirmPassword}
                    type="password"
                    placeholder="Confirm Password"
                    StartIcon={LockClosedIcon}
                    error={errors.passwordConfirmation?.message}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
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
