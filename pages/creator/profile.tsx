import * as yup from 'yup'
import { AuthError } from '@/models/shared'
import { AxiosError } from 'axios'
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/20/solid'
import { Image as ImageModel } from '@/models/shared/image'
import { Input } from '@/components/forms/input'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { adventurer } from '@dicebear/collection'
import { authOptions } from '../api/auth/[...nextauth]'
import { createAvatar } from '@dicebear/core'
import { getServerSession } from 'next-auth'
import { isAxiosError, unWrapAuthError } from '@/utils/errors'
import { useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from 'react-query'
import { useSession } from 'next-auth/react'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@/components/shared/alert'
import CreatorMenu from '@/components/creator/creatorMenu'
import DatePickerWithHookForm from '@/components/forms/datePickerWithHookForm'
import Head from 'next/head'
import Image from 'next/image'
import ImageUploading, { ImageListType, ImageType } from 'react-images-uploading'
import React, { useMemo, useState } from 'react'
import clsx from 'clsx'
import creator_profile from '@/images/creator_profile.svg'
import useTranslation from '@/hooks/useTranslation'

interface ServerProps {
  serverUser: User
}

type CreatorProfileFormDataType = {
  firstName: string
  lastName: string
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
  const { data: session } = useSession()
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

  const profilePhoto = useMemo(() => {
    if (user.profilePictureUrl) {
      return user.profilePictureUrl
    }
    if (user.firstName) {
      return createAvatar(adventurer, {
        seed: user.firstName + ' ' + user.lastName,
        backgroundType: ['solid'],
        backgroundColor: ['b6e3f4'],
      }).toDataUriSync()
    }
    return creator_profile
  }, [user])

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

  const CreatorProfileFormSchema = yup
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
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<CreatorProfileFormDataType>({
    resolver: yupResolver(CreatorProfileFormSchema),
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
  const submitHandler = async (data: CreatorProfileFormDataType) => {
    if (!user) return

    // check the dirty fields and only send the data that has been changed
    setSaveButtonDisabled(true)

    const dirtyFieldsArray = Object.keys(dirtyFields)
    const dirtyData = {}
    dirtyFieldsArray.forEach((field) => {
      dirtyData[field] = data[field]
    })

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

  const [proxyImages, setProxyImages] = useState([] as ImageType[])
  const [images, setImages] = useState([] as ImageModel[])

  const onChange = async (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ): Promise<void> => {
    // data for submit
    setImages(imageList as ImageModel[])
    // for avatar preview
    setProxyImages(imageList as ImageType[])
  }
  return (
    <>
      <Head>
        <title>NinjaCo | Creator Profile</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="relative h-screen w-full">
        <CreatorMenu
          {...{
            isOnCoursePage: true,
            creator: user || serverUser,
          }}
        />

        <div className="flex items-start gap-4 w-full py-8 px-4 flex-col md:flex-row">
          <div className="px-8 w-full md:w-auto flex flex-col items-center justify-center md:justify-start">
            <Image
              className="rounded-full bg-white border-2 border-brand"
              src={profilePhoto}
              width={150}
              height={150}
              alt="PP"
            />
            <ImageUploading multiple={false} value={proxyImages} onChange={onChange}>
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                <>
                  <div
                    {...dragProps}
                    className={clsx(
                      'flex flex-col',
                      'items-center justify-center gap-2',
                      'h-40 my-4',
                      'border-2 border-dashed border-gray-300 rounded-sm',
                      {
                        'bg-brand-100': !isDragging,
                        'border-brand-500': isDragging,
                      }
                    )}
                  >
                    <button
                      className="upload_button multiple text-xs btn btn-primary"
                      onClick={(e) => {
                        e.preventDefault()
                        onImageUpload()
                      }}
                      {...dragProps}
                    >
                      Drop image here or click to upload
                    </button>
                    <button className=" text-xs" onClick={onImageRemoveAll}>
                      Remove image
                    </button>
                  </div>
                  <div className="flex gap-4 mb-4 flex-wrap">
                    {imageList.map(({ dataURL, file }, index) => (
                      <div
                        key={index}
                        className="flex justify-start items-center w-40 my-2 py-1 border border-gray-100 rounded-md"
                      >
                        <div className="flex justify-center items-center aspect-1 max-h-20 ml-1 mr-3 bg-gray-100">
                          {(dataURL && <img src={dataURL} alt={file?.name} />) || (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-20"
                              viewBox="100 100 300 300"
                            >
                              <defs>
                                <style>
                                  {`@keyframes hideshow{0%{opacity:1}10%{opacity:.75}15%{opacity:.5}to{opacity:0}}.cls-1{fill:#fff}`}
                                </style>
                              </defs>
                              <path
                                fill="#b3cb02"
                                d="M180.09 221.54c2.37-5 9.87-3.19 9.95 2.38.15 10.8 3 21 12.85 22.26 18.33 2.36 36.77-13.53 54.22-39.31a5.23 5.23 0 0 1 9.6 2.5c.94 13.48 4.93 30.19 18.41 34.41 12.29 3.85 26.05-10.33 36.4-24.75 3.41-4.75 10.9-1.22 9.31 4.4-7.28 25.77-21.07 58.47-44.39 59.91 0 0-21.6 2.52-34.58-18.82a5.14 5.14 0 0 0-7.68-1.23c-10.12 8.55-34.61 26.21-56.77 18.9-22.76-7.51-21.31-30.98-7.32-60.65Z"
                                style={{ animation: 'hideshow 3s linear infinite' }}
                              />
                            </svg>
                          )}
                        </div>
                        <div className="flex flex-col items-start gap-1">
                          <button
                            className="text-xs text-primary-dark"
                            onClick={(e) => {
                              e.preventDefault()
                              onImageUpdate(index)
                            }}
                          >
                            Update
                          </button>
                          <button
                            className="text-xs text-red-500"
                            onClick={(e) => {
                              e.preventDefault()
                              onImageRemove(index)
                              onImageRemove(index)
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ImageUploading>
          </div>
          <form
            id="form"
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col w-full gap-6 md:gap-12"
          >
            <div className="flex w-full justify-between items-center">
              <div className="text-brand text-lg md:text-xl lg:text-2xl font-semibold">
                {user?.firstName} {user?.lastName}
              </div>
              <button
                type="submit"
                form="form"
                value="Submit"
                className="btn btn-secondary rounded-lg px-4 sm:pr-6 py-2 hover:bg-brand-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={saveButtonDisabled}
              >
                {t.profile.save}
              </button>
            </div>
            <Alert
              open={alertData.open}
              message={alertData.message}
              variant={alertData.variant}
              close={closeAlert}
            />
            <div className="bg-brand-50 p-4 rounded w-full flex flex-col gap-4">
              <div className="hidden md:block text-brand font-semibold text-sm md:text-base">
                {t.profile.profile}
              </div>
              <div className="flex flex-col md:flex-row flex-wrap w-full gap-2 md:gap-4">
                <div className="flex-1 flex-shrink">
                  <Input
                    {...register('firstName')}
                    label={t.profile.firstName}
                    placeholder="John"
                    StartIcon={UserIcon}
                    error={errors.firstName?.message}
                  />
                </div>
                <div className="flex-1 flex-shrink">
                  <Input
                    {...register('lastName')}
                    label={t.profile.lastName}
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
                    label={t.profile.dateOfBirth as string}
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
                {t.profile.changePassword}
              </div>
              <div className="flex flex-col md:flex-row flex-wrap w-full gap-2 md:gap-4 ">
                <div className="flex-1 flex-shrink ">
                  <Input
                    {...register('password')}
                    label={t.profile.password}
                    placeholder="Password"
                    type="password"
                    StartIcon={LockClosedIcon}
                    error={errors.password?.message}
                  />
                </div>
                <div className="flex-1 flex-shrink">
                  <Input
                    {...register('passwordConfirmation')}
                    label={t.profile.confirmPassword}
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
      serverUser: response.payload,
    },
  }
}
