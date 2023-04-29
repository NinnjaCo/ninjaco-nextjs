import * as yup from 'yup'
import { AuthError } from '@/models/shared'
import { Input } from '@/components/forms/input'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '../../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { isAxiosError, unWrapAuthError } from '@/utils/errors'
import { useAuthApi } from '@/utils/api/auth'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@/components/shared/alert'
import AuthCard from '@/components/auth/authCard'
import Footer from '@/components/layout/footer'
import Head from 'next/head'
import Link from 'next/link'
import Menu from '@/components/layout/menu'
import React, { useEffect } from 'react'
import clsx from 'clsx'
import jwt from 'jsonwebtoken'
import lightlyWavedLine from '@/images/lightlyWavedLine.svg'
import logoPointingDown from '@/images/logoPointingYellowBand.svg'
import useTranslation from '@/hooks/useTranslation'

type VerifyEmailFormDataType = {
  code: string
}

const VerifyEmailFormSchema = yup
  .object()
  .shape({
    code: yup.string().required('Code is required'),
  })
  .required()

interface ServerProps {
  token: string
  errorMessage: string
  decodedUserId: string
}

const VerifyEmail = (props: ServerProps) => {
  const router = useRouter()
  const session = useSession()
  const authApi = useAuthApi(session.data)
  const t = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<VerifyEmailFormDataType>({
    resolver: yupResolver(VerifyEmailFormSchema),
    defaultValues: {
      code: props.token,
    },
  })

  const closeAlert = () => {
    setAlertData({ ...alertData, open: false })
  }
  const [alertData, setAlertData] = React.useState<{
    message: string
    variant: 'success' | 'info' | 'warning' | 'error'
    open: boolean
  }>({
    message: '',
    variant: 'info',
    open: false,
  })

  const onSubmitHandler = async (data: VerifyEmailFormDataType) => {
    try {
      closeAlert()
      const res = await authApi.confirmEmail(data.code)

      if (!res.payload) {
        setAlertData({
          message: 'Something went wrong',
          variant: 'error',
          open: true,
        })
        return
      }

      setAlertData({
        message: 'Verify Email Successful',
        variant: 'success',
        open: true,
      })

      if (!session.data?.user._id) {
        setAlertData({
          message: 'Please re signin to continue',
          variant: 'error',
          open: true,
        })
        return
      }

      const userRes = await new UserApi(session.data).findOne(session.data?.user._id)

      if (!userRes.payload) {
        setAlertData({
          message: 'Please re signin to continue',
          variant: 'error',
          open: true,
        })
        return
      }

      await session.update({
        ...session,
        user: {
          ...userRes.payload,
        },
      })

      // redirect to home page after two seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)
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
  useEffect(() => {
    if (props.errorMessage) {
      setAlertData({
        message: props.errorMessage,
        variant: 'error',
        open: true,
      })
    }
  }, [props.errorMessage, alertData.open])

  return (
    <>
      <Head>
        <title>NinjaCo | Verify Your Email</title>
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
          title="Verify Email"
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
              {...register('code')}
              type="text"
              label={t.Auth.verifyEmail.code}
              placeholder={t.Auth.verifyEmail.code as string}
              StartIcon={LockClosedIcon}
              error={errors.code?.message}
              disabled={props.errorMessage !== undefined}
              isRequired={true}
            />
            <button
              type="submit"
              form="form"
              value="Submit"
              disabled={isSubmitted || props.errorMessage !== undefined}
              className={clsx(
                'w-full btn bg-brand-200 hover:bg-brand text-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500',
                {
                  'cursor-not-allowed hover:bg-brand-200 hover:text-brand':
                    isSubmitted || props.errorMessage,
                }
              )}
            >
              {t.Auth.verifyEmail.verify}
            </button>
          </form>
          <div className="w-full flex justify-between text-xs mt-6">
            <Link className="cursor-pointer text-brand-500" href="/">
              {t.Auth.verifyEmail.backToHome}
            </Link>
            <Link href="/auth/signin" className="cursor-pointer text-brand font-semibold">
              {t.Auth.verifyEmail.signIn}
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
  const { token } = query

  const auth_secret = process.env.NEXTAUTH_SECRET
  if (!auth_secret) {
    return {
      props: {
        token: null,
        errorMessage: 'Something went wrong',
      },
    }
  }
  // check if token is a valid jwt token and did not expire
  let error = false
  let decodedUserId
  jwt.verify(token, auth_secret, (err, decoded) => {
    if (err) {
      error = true
    } else {
      decodedUserId = decoded?.sub
    }
  })
  if (error || !decodedUserId) {
    return {
      props: {
        token: null,
        errorMessage: 'Invalid or Expired Token Provided',
      },
    }
  }

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
  if (session.id !== decodedUserId) {
    return {
      props: {
        token: null,
        errorMessage: 'Invalid Token Provided for this User',
      },
    }
  }

  const response = await new UserApi(session).findOne(decodedUserId)
  if (!response || !response.payload?._id) {
    return {
      props: {
        token: null,
        errorMessage: 'User not found',
      },
    }
  }
  if (response.payload.isVerified) {
    return {
      props: {
        token: null,
        errorMessage: 'User is already verified',
      },
    }
  }

  return {
    props: { token, decodedUserId },
  }
}
export default VerifyEmail
