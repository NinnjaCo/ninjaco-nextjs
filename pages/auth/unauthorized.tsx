import { AuthApi } from '@/utils/api/auth'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import Menu from '@/components/layout/menu'
import React from 'react'
import useTranslation from '@/hooks/useTranslation'
interface ServerProps {
  error: string
}
const Unauthorized = ({ error }: ServerProps) => {
  const session = useSession()
  const t = useTranslation()

  const resendEmail = async () => {
    if (!session.data) {
      console.log('no session data')
      return
    }
    await new AuthApi().resendVerificationEmail(session.data.user.email)
  }

  return (
    <>
      <Head>
        <title>{t.Auth.unauthorized.headTitle}</title>
        <meta name="description" content="Unauthorized Access" />
      </Head>
      <Menu
        menuOption={{
          logoToUse: 'light',
          startBackgroundDark: true,
          startTextWhite: true,
          isSticky: true,
          startWithBottomBorder: true,
          startButtonDark: false,
        }}
      />
      <div
        className="relative z-20"
        aria-labelledby={'Unauthorized'}
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-brand-200 bg-opacity-75 transition-opacity"></div>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
            <div className="relative bg-white rounded-lg text-left overflow-hidden break-words shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-error-light sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-error-dark"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-brand" id="modal-title">
                      {t.Auth.unauthorized.title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-brand-500">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
              {error.includes('Verify your email to access this page') && (
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-start">
                  <Link
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-brand-100 shadow-sm px-4 py-2 bg-brand text-base font-medium text-white hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    href="/"
                    onClick={resendEmail}
                  >
                    resend email
                  </Link>
                  <Link
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-brand-100 shadow-sm px-4 py-2 bg-white text-base font-medium text-brand hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    href="/"
                  >
                    {t.Auth.unauthorized.goBack}
                  </Link>
                </div>
              )}
              {!error.includes('Verify your email to access this page') && (
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-start">
                  <Link
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-brand-100 shadow-sm px-4 py-2 bg-white text-base font-medium text-brand hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    href="/"
                  >
                    {t.Auth.unauthorized.goBack}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Unauthorized
export const getServerSideProps = async (context) => {
  const { error } = context.query
  if (error) {
    return {
      props: { error },
    }
  }
  return {
    props: {
      redirect: {
        destination: '/',
        permanent: false,
      },
    },
  }
}
