import { NextRequestWithAuth } from 'next-auth/middleware'
import { User } from '@/models/crud'

interface CheckIfUserIsVerifiedRequest {
  payload: User
  timestamp: number
}

export const checkIfUserIsVerifiedRequest = async (
  access_token: string,
  userId: string
): Promise<CheckIfUserIsVerifiedRequest> => {
  const data = await (
    await fetch(process.env.API_URL + '/users/' + userId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).json()

  return data
}

export interface VerifiedResponse {
  isVerified: boolean
  error?: string
  rewriteUrl?: string
}

export const checkIfUserIsVerified = async (
  req: NextRequestWithAuth
): Promise<VerifiedResponse> => {
  const { token } = req.nextauth
  if (token && token.sub) {
    const verificationData: CheckIfUserIsVerifiedRequest = await checkIfUserIsVerifiedRequest(
      token.jwt,
      token.sub
    )

    console.log(verificationData)

    // If the user does not have the correct role, redirect them to the home page
    if (!verificationData || !verificationData.payload.isVerified) {
      console.log('Unverified User Trying to access a page')
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
  } else {
    // A non signedin user should not be able to access the admin page
    return {
      isVerified: false,
      rewriteUrl: '/auth/signin',
      error: 'You must be signed in to access this page',
    }
  }
}
