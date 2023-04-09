import { NextResponse } from 'next/server'
import { RoleEnum } from './models/crud/role.model'
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  async function middleware(req) {
    const { token } = req.nextauth
    if (token) {
      let data: ValidateTokenRoleRequest | undefined = undefined

      if (req.nextUrl.pathname.startsWith('/admin')) {
        data = await validateTokenRoleRequest(RoleEnum.ADMIN, token.jwt)
      }
      if (req.nextUrl.pathname.startsWith('/creator')) {
        data = await validateTokenRoleRequest(RoleEnum.CREATOR, token.jwt)
      }

      // If the user is not an admin, redirect to the home page
      if (!data || !data.payload) {
        console.log('Invalid Role Trying to access admin')
        const url = req.nextUrl.clone()
        url.pathname = '/auth/signin'
        return NextResponse.rewrite(url)
      }

      return NextResponse.next()
    } else {
      console.log('No token access to admin')
      return NextResponse.rewrite('/auth/signin')
    }
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

interface ValidateTokenRoleRequest {
  payload: boolean
  timestamp: number
}

const validateTokenRoleRequest = async (
  role: RoleEnum,
  access_token: string
): Promise<ValidateTokenRoleRequest> => {
  const data = await (
    await fetch(process.env.API_URL + '/auth/validate-token-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ role: role, token: access_token }),
    })
  ).json()

  return data
}

// should match anything that starts with /admin OR /creator
export const config = {
  matcher: ['/admin/:path*', '/creator/:path*'],
}
