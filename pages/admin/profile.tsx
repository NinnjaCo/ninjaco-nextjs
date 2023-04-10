import * as yup from 'yup'
import { AuthApi } from '@/utils/api/auth'
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/20/solid'
import { Input } from '@/components/forms/input'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { yupResolver } from '@hookform/resolvers/yup'
import CrudApi from '@/utils/api/crud/crud.api'
import DatePickerWithHookForm from '@/components/forms/datePickerWithHookForm'
import Head from 'next/head'
import React, { use } from 'react'
import SideMenu from '@/components/admin/sideMenu'
import dayjs, { Dayjs } from 'dayjs'
import jwt from 'jsonwebtoken'

interface ServerProps {
  firstName: string
  lastName: string
  dateOfBirth: Date
  email: string
  errorMessage: string
  decodedUserId: string
}

export default function Profile(props: ServerProps) {
  const session = useSession()

  type AdminProfileFormDataType = {
    firstName: string
    lastName: string
    dateOfBirth: Date
    email: string
    password: string
    passwordConfirmation: string
  }
  const AdminProfileFormSchema = yup
    .object()
    .shape({
      firstName: yup.string().required('First Name is required'),
      lastName: yup.string().required('Last Name is required'),
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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AdminProfileFormDataType>({
    resolver: yupResolver(AdminProfileFormSchema),
    defaultValues: {
      firstName: props.firstName,
      lastName: props.lastName,
      dateOfBirth: new Date(dayjs(props.dateOfBirth).toDate()),
      email: props.email,
      password: '',
      passwordConfirmation: '',
    },
  })

  // Handle form submission
  const submitHandler = async (data: AdminProfileFormDataType) => {
    const res = await new UserApi(session.data).findOne(session.data?.id as string)
    if (res) {
      if (
        props.firstName !== data.firstName ||
        props.lastName !== data.lastName ||
        props.dateOfBirth !== data.dateOfBirth ||
        props.email !== data.email
      ) {
        const res = await new UserApi(session.data).update(session.data?.id as string, {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: dayjs(data.dateOfBirth),
          email: data.email,
        })
      }
    }
  }

  return (
    <>
      {console.log(session)}
      {console.log(props)}
      <Head>
        <title>NinjaCo | Admin Profile</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex w-full h-screen overflow-hidden">
        <SideMenu higlightProfile={true} />
        <form
          id="form"
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col w-full h-full gap-6 md:gap-12 py-8 px-4"
        >
          <div className="flex w-full justify-between items-center">
            <div className="text-brand text-lg md:text-xl lg:text-2xl font-semibold">
              Raghid Khoury
            </div>
            <button
              type="submit"
              form="form"
              value="Submit"
              className="btn btn-secondary px-4 sm:pr-6 py-2 hover:bg-brand-500 hover:text-white"
            >
              SAVE
            </button>
          </div>
          <div className="bg-brand-50 p-4 rounded w-full flex flex-col gap-4">
            <div className="hidden md:block text-brand font-semibold text-sm md:text-base">
              Profile
            </div>
            <div className="flex flex-col md:flex-row flex-wrap w-full gap-2 md:gap-4">
              <div className="flex-1 flex-shrink">
                <Input
                  {...register('firstName')}
                  label={'First Name'}
                  placeholder="John"
                  StartIcon={UserIcon}
                  error={errors.firstName?.message}
                />
              </div>
              <div className="flex-1 flex-shrink">
                <Input
                  {...register('lastName')}
                  label={'Last Name'}
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
                  label="Date of Birth"
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
          <div className="bg-brand-50 p-4 rounded w-full flex flex-col gap-4">
            <div className="hidden md:block text-brand font-semibold text-sm md:text-base">
              Change Password
            </div>
            <div className="flex flex-col md:flex-row flex-wrap w-full gap-2 md:gap-4">
              <div className="flex-1 flex-shrink">
                <Input
                  {...register('password')}
                  label={'Password'}
                  placeholder="Password"
                  type="password"
                  StartIcon={LockClosedIcon}
                  error={errors.password?.message}
                />
              </div>
              <div className="flex-1 flex-shrink">
                <Input
                  {...register('passwordConfirmation')}
                  label={'Confirm Password'}
                  type="password"
                  placeholder="Confirm Password"
                  StartIcon={LockClosedIcon}
                  error={errors.passwordConfirmation?.message}
                />
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  )
}
export const getServerSideProps = async (context) => {
  const { query, req, res } = context
  const { token } = query

  const auth_secret = process.env.JWT_ACCESS_SECRET
  if (!auth_secret) {
    return {
      props: {
        token: null,
        errorMessage: 'Something went wrong',
      },
    }
  }
  // check if token is a valid jwt token and did not expire
  // let error = false
  // let decodedUserId
  // jwt.verify(token, auth_secret, (err, decoded) => {
  //   if (err) {
  //     error = true
  //   } else {
  //     decodedUserId = decoded?.sub
  //   }
  // })
  // if (error || !decodedUserId) {
  //   return {
  //     props: {
  //       token: null,
  //       errorMessage: 'Invalid or Expired Token Provided',
  //     },
  //   }
  // }

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
  // if (session.id !== decodedUserId) {
  //   return {
  //     props: {
  //       token: null,
  //       errorMessage: 'Invalid Token Provided for this User',
  //     },
  //   }
  // }

  const response = await new UserApi(session).findOne(session.id)
  if (!response || !response.payload?._id) {
    return {
      props: {
        errorMessage: 'User not found',
      },
    }
  }
  // if (response.payload.isVerified) {
  //   return {
  //     props: {
  //       token: null,
  //       errorMessage: 'User is already verified',
  //     },
  //   }
  // }

  // const dateOfBirthString = response.payload.dateOfBirth
  // const dateOfBirthObject = new Date(dateOfBirthString)
  // const dateOfBirthISO = new Date(response.payload.dateOfBirth).toISOString()

  return {
    props: {
      firstName: response.payload.firstName,
      lastName: response.payload.lastName,
      dateOfBirth: response.payload.dateOfBirth,
      email: response.payload.email,
    },
  }
}
