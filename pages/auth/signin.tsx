import * as yup from 'yup'
import { AuthError } from '@/models/shared'
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/20/solid'
import { Input } from '@/components/forms/input'
import Head from 'next/head'

import { getSession, signIn } from 'next-auth/react'
import { isAxiosError, unWrapAuthError } from '@/utils/errors'
import { useAuthApi } from '@/utils/api/auth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@/components/auth/alert'
import AuthCard from '@/components/auth/authCard'
import Footer from '@/components/layout/footer'
import Link from 'next/link'
import Menu from '@/components/layout/menu'
import React, { useTransition } from 'react'
import heavilyWavedLine from '@/images/heavilyWavedLine.svg'
import logoPointingDown from '@/images/logoPointingYellowBand.svg'
import useTranslation from '@/hooks/useTranslation'
type SignInFormDataType = {
  email: string
  password: string
}

const SignInFormSchema = yup
  .object()
  .shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  })
  .required()

const Signin = () => {
  const authApi = useAuthApi()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInFormDataType>({
    resolver: yupResolver(SignInFormSchema),
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

  const onSubmitHandler = async (data: SignInFormDataType) => {
    try {
      closeAlert()

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
  const t = useTranslation()

  return (
    <>
      <Head>
        <title>{t.signin.headTitle}</title>
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
        <AuthCard
          title={t.signin.signIn as string}
          titleImage={logoPointingDown}
          underLineImage={heavilyWavedLine}
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
              label={t.signin.email as string}
              placeholder={t.signin.email as string}
              StartIcon={EnvelopeIcon}
              error={errors.email?.message}
            />
            <Input
              {...register('password')}
              type="password"
              label={t.signin.password as string}
              placeholder={t.signin.password as string}
              StartIcon={LockClosedIcon}
              error={errors.password?.message}
            />

            <button
              type="submit"
              form="form"
              value="Submit"
              className="w-full btn bg-brand-200 hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500"
            >
              {t.signin.signIn}
            </button>
          </form>
          <div className="w-full flex justify-between text-xs mt-6">
            <Link className="cursor-pointer text-brand-500" href="/">
              {t.signin.BTH}
            </Link>
            <div className="text-brand-500">
              {t.signin.dontHaveAccount}
              <span className="ml-2  cursor-pointer text-brand font-semibold">
                <Link href="/auth/signup">{t.signin.SU}</Link>
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
export default Signin
