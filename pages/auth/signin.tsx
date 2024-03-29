import * as yup from 'yup'
import { AuthError } from '@/models/shared'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/forms/input'
import { RoleEnum } from '@/models/crud'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { isAxiosError, unWrapAuthError } from '@/utils/errors'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { validateTokenRoleRequest } from '@/middleware/validateTokenRole'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@/components/shared/alert'
import AuthCard from '@/components/auth/authCard'
import Footer from '@/components/layout/footer'
import Head from 'next/head'
import Link from 'next/link'
import Menu from '@/components/layout/menu'
import React, { useEffect } from 'react'
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

interface ServerProps {
  error: string | null
  callbackUrl: string | null
}
const Signin = (props: ServerProps) => {
  const [signInButtonDisabled, setSignInButtonDisabled] = React.useState(false)

  const {
    register,
    handleSubmit,
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
      setSignInButtonDisabled(true)
      // sign in the user using next-auth
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: props.callbackUrl || '/',
      })
    } catch (error) {
      setSignInButtonDisabled(false)
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

  useEffect(() => {
    if (props.error) {
      setAlertData({
        message: props.error,
        variant: 'error',
        open: true,
      })
    }
  }, [props.error])
  return (
    <>
      <Head>
        <title>{t.Auth.signin.headTitle}</title>
        <meta name="description" content="Sign In to NinjaCo" />
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
          title={t.Auth.signin.signIn as string}
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
              label={t.Auth.signin.email as string}
              placeholder={t.Auth.signin.email as string}
              StartIcon={EnvelopeIcon}
              error={errors.email?.message}
            />
            <Input
              {...register('password')}
              type="password"
              label={t.Auth.signin.password as string}
              placeholder={t.Auth.signin.password as string}
              StartIcon={LockClosedIcon}
              error={errors.password?.message}
            />

            <button
              type="submit"
              form="form"
              value="Submit"
              className="w-full btn bg-brand-200 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
              disabled={signInButtonDisabled}
            >
              {t.Auth.signin.signIn}
            </button>
          </form>
          <div className="w-full flex justify-between text-xs mt-6 flex-wrap gap-4">
            <Link className="cursor-pointer text-brand font-semibold" href="/auth/forgot-password">
              {t.Auth.signin.forgotPassword}
            </Link>
            <Link href="/auth/signup" className="cursor-pointer text-brand font-semibold">
              {t.Auth.signin.signUp}
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

  const error = query.error as string | null
  const callbackUrl = query.callbackUrl as string | null

  const session = await getServerSession(req, res, authOptions)
  if (session) {
    const canUserAccessCreatorPage = await validateTokenRoleRequest(
      [RoleEnum.CREATOR, RoleEnum.ADMIN],
      session.accessToken
    )
    if (canUserAccessCreatorPage && canUserAccessCreatorPage.payload) {
      const canUserAccessAdminPage = await validateTokenRoleRequest(
        [RoleEnum.ADMIN],
        session.accessToken
      )
      if (canUserAccessAdminPage && canUserAccessAdminPage.payload) {
        return {
          redirect: {
            destination: '/admin',
            permanent: false,
          },
        }
      }
      return {
        redirect: {
          destination: '/creator',
          permanent: false,
        },
      }
    }

    return {
      redirect: {
        destination: (query.redirectTo as string | undefined) || '/app',
        permanent: false,
      },
    }
  }
  return {
    props: {
      error: error || null,
      callbackUrl: callbackUrl || null,
    },
  }
}
export default Signin
