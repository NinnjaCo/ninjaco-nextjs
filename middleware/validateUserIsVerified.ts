import { NextRequestWithAuth } from 'next-auth/middleware'

export interface VerifiedResponse {
  isVerified: boolean
  error?: string
  rewriteUrl?: string
}

export const checkIfUserIsVerified = async (
  req: NextRequestWithAuth
): Promise<VerifiedResponse> => {
  const { token } = req.nextauth

  console.log('checkIfUserIsVerified token is ', token)
  if (token && token.id) {
    try {
      const user = token.user

      // If the user does not have the correct role, redirect them to the home page
      if (!user || !user.isVerified) {
        return {
          isVerified: false,
          rewriteUrl: '/auth/unauthorized',
          error:
            'Verify your email to access this page, check your spam folder if you do not see it in your inbox',
        }
      }

      return {
        isVerified: true,
      }
    } catch (error) {
      console.log('Error in checkIfUserIsVerified', error)
      return {
        isVerified: false,
        rewriteUrl: '/auth/signin',
        error: 'You must be signed in to access this page',
      }
    }
  } else {
    // A non signedin user should not be able to access the admin page
    console.log('User is not signed in in validateUserIsVerified')
    return {
      isVerified: false,
      rewriteUrl: '/auth/signin',
      error: 'You must be signed in to access this page',
    }
  }
}
