import { NextResponse } from 'next/server'
import { addErrorParamToUrl } from './utils/shared'
import { authroizeRequest } from './middleware/validateTokenRole'
import { checkIfUserIsVerified } from './middleware/validateUserIsVerified'
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  async function middleware(req) {
    // Verify that the user have verified their email
    const verifyRes = await checkIfUserIsVerified(req)
    console.log('Verify res', verifyRes)
    if (!verifyRes.isVerified) {
      console.log("User isn't verified", verifyRes)
      let url = req.nextUrl.clone()
      url.pathname = verifyRes.rewriteUrl || '/auth/unauthorized'
      url = addErrorParamToUrl(url, verifyRes.error)

      console.log('Verification middleware redirecting to: ', url)
      return NextResponse.redirect(url)
    }

    // Authroization for admin, creator pages
    const authRes = await authroizeRequest(req)
    console.log('Auth res', authRes)
    if (!authRes.authorized) {
      console.log('User is not authorized', authRes)
      let url = req.nextUrl.clone()
      url.pathname = authRes.rewriteUrl || '/auth/unauthorized'
      url = addErrorParamToUrl(url, authRes.error)
      console.log('Auth middleware redirecting to: ', url)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (token) {
          console.log('Next Auth callback middlware returned a token exists')
          return true
        }
        console.log('Next Auth callback middlware returned no token exists')
        return false
      },
    },
  }
)

// should match anything that starts with /admin OR /creator OR /app
export const config = {
  matcher: ['/admin/:path*', '/creator/:path*', '/app/:path*'],
}
