import * as yup from 'yup'
import { AuthApi, useAuthApi } from '@/utils/api/auth'
import { AuthError, ErrorMessage } from '@/models/shared'
import { CalendarIcon, EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/forms/input'
import { getSession, signIn, useSession } from 'next-auth/react'
import { isAxiosError } from '@/utils/errors'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@/components/auth/alert'
import AuthCard from '@/components/auth/authCard'
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
  email: string
  password: string
  passwordConfirmation: string
}

const SignUpFormSchema = yup
  .object()
  .shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
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
  const session = useSession()
  console.log(session)
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
      closeAlert()
      await authApi.signUp({
        firstName: data.firstName,
        lastName: data.lastName,
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
      console.log(error)
      if (isAxiosError<AuthError>(error)) {
        console.log(error)
        if (error.response?.data.error.response.errors) {
          Object.values(error.response?.data.error.response.errors).forEach((error) => {
            // Duplicate Key Error
            console.log(error)
            if (error.startsWith('E11000')) {
              setAlertData({
                message: 'Email already exists',
                variant: 'error',
                open: true,
              })
            } else {
              setAlertData({
                message: error || 'Something went wrong, please try again later',
                variant: 'error',
                open: true,
              })
            }
          })
        } else {
          setAlertData({
            message:
              error.response?.data.error.message || 'Something went wrong, please try again later',
            variant: 'error',
            open: true,
          })
        }
      }
    }
  }

  return (
    <>
      <Head>
        <title>NinjaCo | Sign Up</title>
      </Head>
      <main className="relative w-full h-screen">
        <Menu
          menuOption={{
            logoToUse: 'dark',
            startBackgroundDark: false,
            startTextWhite: false,
            isSticky: false,
            startWithBottomBorder: true,
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
            <div className="text-brand-500">
              Already Have an Account?
              <span className="ml-2  cursor-pointer text-brand font-semibold">
                <Link href="/auth/signin">Sign In</Link>
              </span>
            </div>
          </div>
        </AuthCard>
        <Footer />
      </main>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context)
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}
export default Signup
