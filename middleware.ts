import { NextResponse } from 'next/server'
import { addErrorParamToUrl } from './utils/shared'
import { authroizeRequest } from './middleware/validateTokenRole'
import { checkIfUserIsVerified } from './middleware/validateUserIsVerified'
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  async function middleware(req) {
    // Verify that the user have verified their email
    const verifyRes = await checkIfUserIsVerified(req)
    if (!verifyRes.isVerified) {
      let url = req.nextUrl.clone()
      url.pathname = verifyRes.rewriteUrl || '/auth/unauthorized'
      url = addErrorParamToUrl(url, verifyRes.error)
      return NextResponse.redirect(url)
    }

    // Authroization for admin, creator pages
    const authRes = await authroizeRequest(req)
    if (!authRes.authorized) {
      let url = req.nextUrl.clone()
      url.pathname = authRes.rewriteUrl || '/auth/unauthorized'
      url = addErrorParamToUrl(url, authRes.error)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (token) {
          return true
        }
        return false
      },
    },
  }
)

// should match anything that starts with /admin OR /creator OR /app
export const config = {
  matcher: ['/admin/:path*', '/creator/:path*', '/app/:path*'],
}
