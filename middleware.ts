import { JWT, decode } from 'next-auth/jwt'
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
      authorized: async ({ token, req }) => {
        const secret = process.env.NEXTAUTH_SECRET
        const allCookies = req.cookies.getAll()
        const tokenValue = req.cookies.get('__Secure-next-auth.session-token')?.value

        let decodedToken: JWT | null = null
        if (tokenValue && secret) {
          decodedToken = await decode({
            token: tokenValue,
            secret: secret,
          })
        }
        if (token || decodedToken) {
          return true
        }
        return false
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
)

// should match anything that starts with /admin OR /creator OR /app
export const config = {
  matcher: ['/admin/:path*', '/creator/:path*', '/app/:path*'],
}
