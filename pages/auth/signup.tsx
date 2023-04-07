import * as yup from 'yup'
import { AuthError } from '@/models/shared'
import { CircularProgress } from '@mui/material'
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/forms/input'
import { getSession, signIn } from 'next-auth/react'
import { isAxiosError, unWrapAuthError } from '@/utils/errors'
import { useAuthApi } from '@/utils/api/auth'
import { useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@/components/auth/alert'
import AuthCard from '@/components/auth/authCard'
import DatePickerWithHookForm from '@/components/forms/datePickerWithHookForm'
import Footer from '@/components/layout/footer'
import Head from 'next/head'
import Link from 'next/link'
import Menu from '@/components/layout/menu'
import React from 'react'
import heavilyWavedLine from '@/images/heavilyWavedLine.svg'
import logoPointingDown from '@/images/logoPointingYellowBand.svg'

type SignUpFormDataType = {
  firstName: string
  lastName: string
  dateOfBirth: Date
  email: string
  password: string
  passwordConfirmation: string
}

const SignUpFormSchema = yup
  .object()
  .shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    dateOfBirth: yup.date().required('Date of Birth is required'),
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

const Signup = () => {
  const authApi = useAuthApi()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFormDataType>({
    resolver: yupResolver(SignUpFormSchema),
  })
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

  const onSubmitHandler = async (data: SignUpFormDataType) => {
    try {
      console.log(data)
      closeAlert()
      await authApi.signUp({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth.toISOString(),
        email: data.email,
        password: data.password,
      })
      setAlertData({
        message: 'Account Created Successfully',
        variant: 'success',
        open: true,
      })
      // sign in the user using next-auth
      await signIn('credentials', {
        redirect: true,
        email: data.email,
        password: data.password,
      })
    } catch (error) {
      if (isAxiosError<AuthError>(error)) {
        const errors = unWrapAuthError(error)
        setAlertData({
          message: errors[0].message || 'Something went wrong',
          variant: 'error',
          open: true,
        })
      }
    }
  }

  return (
    <>
      <Head>
        <title>NinjaCo | Sign Up</title>
        <meta name="description" content="Sign Up to NinjaCo" />
      </Head>
      <main className="relative w-full h-screen">
        <Menu
          menuOption={{
            logoToUse: 'dark',
            startBackgroundDark: false,
            startTextWhite: false,
            isSticky: false,
            startWithBottomBorder: true,
            startButtonDark: true,
          }}
        ></Menu>
        <AuthCard title="Sign Up" titleImage={logoPointingDown} underLineImage={heavilyWavedLine}>
          <Alert
            className="my-3"
            message={alertData.message}
            variant={alertData.variant}
            open={alertData.open}
            close={closeAlert}
          />
          <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col gap-4" id="form">
            <Input
              {...register('firstName')}
              label={'First Name'}
              placeholder="John"
              StartIcon={UserIcon}
              error={errors.firstName?.message}
            />
            <Input
              {...register('lastName')}
              label={'Last Name'}
              placeholder="Smith"
              StartIcon={UserIcon}
              error={errors.lastName?.message}
            />
            <DatePickerWithHookForm
              control={control}
              name={register('dateOfBirth').name} // we only need the "name" prop
              placeholder="Date of Birth"
              label="Date of Birth"
              error={errors.dateOfBirth?.message}
            />
            <Input
              {...register('email')}
              label={'Email'}
              placeholder={'Email'}
              StartIcon={EnvelopeIcon}
              error={errors.email?.message}
            />
            <Input
              {...register('password')}
              type="password"
              label={'Password'}
              placeholder={'Password'}
              StartIcon={LockClosedIcon}
              error={errors.password?.message}
            />
            <Input
              {...register('passwordConfirmation')}
              type="password"
              label={'Confirm Password'}
              placeholder={'Confirm Password'}
              StartIcon={LockClosedIcon}
              error={errors.passwordConfirmation?.message}
            />
            <button
              type="submit"
              form="form"
              value="Submit"
              className="w-full btn bg-brand-200 hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500"
            >
              Sign Up
            </button>
          </form>
          <div className="w-full flex justify-between text-xs mt-6">
            <Link className="cursor-pointer text-brand-500" href="/">
              Back to Home
            </Link>
            <Link href="/auth/signin" className="cursor-pointer text-brand font-semibold">
              Sign In
            </Link>
          </div>
        </AuthCard>
        <Footer />
      </main>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { query } = context

  const session = await getSession(context)
  if (session) {
    return {
      redirect: {
        destination: (query.redirectTo as string | undefined) || '/',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}
export default Signup
