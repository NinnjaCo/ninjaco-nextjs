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
import useTranslation from '@/hooks/useTranslation'

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
  const t = useTranslation()
  const authApi = useAuthApi()

  const {
    register,
    handleSubmit,
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
          message: t.forgetPassword.wrong as string,
          variant: 'error',
          open: true,
        })
        return
      }

      setAlertData({
        message: t.forgetPassword.checkEmail as string,
        variant: 'success',
        open: true,
      })
    } catch (error) {
      if (isAxiosError<AuthError>(error)) {
        const errors = unWrapAuthError(error)
        setAlertData({
          message: errors[0].message || (t.forgetPassword.wrong as string),
          variant: 'error',
          open: true,
        })
      }
    }
  }

  return (
    <>
      <Head>
        <title> {t.forgetPassword.Title}</title>
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
          title={t.forgetPassword.Title as string}
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
              label={t.forgetPassword.Label as string}
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
              {t.forgetPassword.sendResetLink}
            </button>
          </form>
          <div className="w-full flex justify-between text-xs mt-6">
            <Link className="cursor-pointer text-brand-500" href="/">
              {t.forgetPassword.backTohome}
            </Link>
            <Link href="/auth/signin" className="cursor-pointer text-brand font-semibold">
              {t.forgetPassword.Signin}
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
