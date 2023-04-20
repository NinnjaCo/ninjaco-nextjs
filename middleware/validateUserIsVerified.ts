import { JWT, decode } from 'next-auth/jwt'
import { NextRequestWithAuth } from 'next-auth/middleware'

export interface VerifiedResponse {
  isVerified: boolean
  error?: string
  rewriteUrl?: string
}

export const checkIfUserIsVerified = async (
  req: NextRequestWithAuth
): Promise<VerifiedResponse> => {
  const allCookies = req.cookies
  const baseUrl = process.env.API_URL
  const isHttps = process.env.VERCEL ?? baseUrl?.startsWith('https') ?? false
  const sessionCookieName = isHttps ? '__Secure-next-auth.session-token' : 'next-auth.session-token'
  const tokenValue = allCookies.get(sessionCookieName)?.value

  let token: JWT | null = null
  const secret = process.env.NEXTAUTH_SECRET
  if (tokenValue && secret) {
    token = await decode({
      token: tokenValue,
      secret: secret,
    })
  }

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
      return {
        isVerified: false,
        rewriteUrl: '/auth/signin',
        error: 'You must be signed in to access this page',
      }
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
