import * as yup from 'yup'
import { AuthError } from '@/models/shared'
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/forms/input'
import { RoleEnum } from '@/models/crud'
import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { isAxiosError, unWrapAuthError } from '@/utils/errors'
import { signIn } from 'next-auth/react'
import { useAuthApi } from '@/utils/api/auth'
import { useForm } from 'react-hook-form'
import { validateTokenRoleRequest } from '@/middleware/validateTokenRole'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@/components/shared/alert'
import AuthCard from '@/components/auth/authCard'
import DatePickerWithHookForm from '@/components/forms/datePickerWithHookForm'
import Footer from '@/components/layout/footer'
import Head from 'next/head'
import Link from 'next/link'
import Menu from '@/components/layout/menu'
import React, { useEffect } from 'react'
import heavilyWavedLine from '@/images/heavilyWavedLine.svg'
import logoPointingDown from '@/images/logoPointingYellowBand.svg'
import useTranslation from '@/hooks/useTranslation'

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
    lastName: yup
      .string()
      .required('Last Name is required')
      .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
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

interface ServerProps {
  error: string | null
  callbackUrl: string | null
}
const Signup = (props: ServerProps) => {
  const authApi = useAuthApi()
  const t = useTranslation()
  const [signUpButtonDisabled, setSignUpButtonDisabled] = React.useState(false)

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
  //use the scroll position to show the message
  const scrollToTop = () => {
    window.scrollTo({
      top: 25,
      behavior: 'smooth',
    })
  }

  const onSubmitHandler = async (data: SignUpFormDataType) => {
    try {
      closeAlert()
      setSignUpButtonDisabled(true)
      await authApi.signUp({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth.toISOString(),
        email: data.email,
        password: data.password,
      })
      // sign in the user using next-auth
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      scrollToTop()
      setAlertData({
        message: 'Check your email to confirm your account',
        variant: 'success',
        open: true,
      })
    } catch (error) {
      setSignUpButtonDisabled(false)
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
              label={t.Auth.signUp.firstName}
              placeholder="John"
              StartIcon={UserIcon}
              error={errors.firstName?.message}
              isRequired={true}
            />
            <Input
              {...register('lastName')}
              label={t.Auth.signUp.lastName}
              placeholder="Smith"
              StartIcon={UserIcon}
              error={errors.lastName?.message}
              isRequired={true}
            />
            <DatePickerWithHookForm
              control={control}
              name={register('dateOfBirth').name} // we only need the "name" prop
              label={t.Auth.signUp.dateOfBirth as string}
              error={errors.dateOfBirth?.message}
              isRequired={true}
            />
            <Input
              {...register('email')}
              label={t.Auth.signUp.email}
              placeholder={t.Auth.signUp.email as string}
              StartIcon={EnvelopeIcon}
              error={errors.email?.message}
              isRequired={true}
            />
            <Input
              {...register('password')}
              type="password"
              label={t.Auth.signUp.password}
              placeholder={t.Auth.signUp.password as string}
              StartIcon={LockClosedIcon}
              error={errors.password?.message}
              isRequired={true}
            />
            <Input
              {...register('passwordConfirmation')}
              type="password"
              label={t.Auth.signUp.confirmPassword}
              placeholder={t.Auth.signUp.confirmPassword as string}
              StartIcon={LockClosedIcon}
              error={errors.passwordConfirmation?.message}
              isRequired={true}
            />
            <button
              type="submit"
              form="form"
              value="Submit"
              className="w-full btn bg-brand-200 text-brand hover:bg-brand hover:text-brand-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-brand-500 disabled:bg-gray-300"
              disabled={signUpButtonDisabled}
            >
              {t.Auth.signUp.signUp}
            </button>
          </form>
          <div className="w-full flex justify-between text-xs mt-6">
            <Link className="cursor-pointer text-brand-500" href="/">
              {t.Auth.signUp.backToHome}
            </Link>
            <Link href="/auth/signin" className="cursor-pointer text-brand font-semibold">
              {t.Auth.signUp.signIn}
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
export default Signup
