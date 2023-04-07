import * as yup from 'yup'
import { AuthError } from '@/models/shared'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/forms/input'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { isAxiosError, unWrapAuthError } from '@/utils/errors'
import { useAuthApi } from '@/utils/api/auth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@/components/auth/alert'
import AuthCard from '@/components/auth/authCard'
import Footer from '@/components/layout/footer'
import Head from 'next/head'
import Link from 'next/link'
import Menu from '@/components/layout/menu'
import React from 'react'
import lightlyWavedLine from '@/images/lightlyWavedLine.svg'
import logoPointingDown from '@/images/logoPointingYellowBand.svg'

type ForgotPasswordFormDataType = {
  email: string
}

const ForgotPasswordFormSchema = yup
  .object()
  .shape({
    email: yup.string().email('Invalid email').required('Email is required'),
  })
  .required()

const ForgotPassword = () => {
  const authApi = useAuthApi()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ForgotPasswordFormDataType>({
    resolver: yupResolver(ForgotPasswordFormSchema),
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

  const onSubmitHandler = async (data: ForgotPasswordFormDataType) => {
    try {
      closeAlert()
      // Send a secret link to the user's email and save the token in the database
      const res = await authApi.forgotPassword({
        email: data.email,
      })

      if (!res.payload) {
        setAlertData({
          message: 'Something went wrong',
          variant: 'error',
          open: true,
        })
        return
      }

      setAlertData({
        message: 'Check your email for a link to reset your password',
        variant: 'success',
        open: true,
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
        <title>NinjaCo | Forgot Password</title>
        <meta name="description" content="Reset Password with NinjaCo" />
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
        <AuthCard
          title="Forgot Password"
          titleImage={logoPointingDown}
          underLineImage={lightlyWavedLine}
        >
          <Alert
            className="my-3"
            message={alertData.message}
            variant={alertData.variant}
            open={alertData.open}
            close={closeAlert}
          />
          <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col gap-4" id="form">
            <Input
              {...register('email')}
              label={'Email'}
              placeholder={'John.smith@email.com'}
              StartIcon={EnvelopeIcon}
              error={errors.email?.message}
            />
            <button
              type="submit"
              form="form"
              value="Submit"
              className="w-full btn bg-brand-200 hover:bg-brand text-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500"
            >
              Send Reset Link
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
  const { query, req, res } = context

  const session = await getServerSession(req, res, authOptions)
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
export default ForgotPassword
