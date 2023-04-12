import { NextRequestWithAuth } from 'next-auth/middleware'
import { RoleEnum } from '@/models/crud'

export interface ValidateTokenRoleRequest {
  payload: boolean
  timestamp: number
}

export const validateTokenRoleRequest = async (
  alloweRoles: RoleEnum[],
  access_token: string
): Promise<ValidateTokenRoleRequest> => {
  const data = await (
    await fetch(process.env.API_URL + '/auth/validate-token-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ alloweRoles: alloweRoles, token: access_token }),
    })
  ).json()

  return data
}

export interface autorizationResposne {
  authorized: boolean
  error?: string
  rewriteUrl?: string
}
export const authroizeRequest = async (req: NextRequestWithAuth): Promise<autorizationResposne> => {
  const { token } = req.nextauth
  if (token) {
    let authorizationData: ValidateTokenRoleRequest | undefined = undefined

    if (req.nextUrl.pathname.startsWith('/admin')) {
      authorizationData = await validateTokenRoleRequest([RoleEnum.ADMIN], token.accessToken)
    }
    if (req.nextUrl.pathname.startsWith('/creator')) {
      authorizationData = await validateTokenRoleRequest(
        [RoleEnum.CREATOR, RoleEnum.ADMIN],
        token.accessToken
      )
    }

    // If the user does not have the correct role, redirect them to the home page
    if (!authorizationData || !authorizationData.payload) {
      console.log('Invalid Role Trying to access authorized page')
      return {
        authorized: false,
        rewriteUrl: '/auth/unauthorized',
        error: 'You do not have access to this page',
      }
    }

    return {
      authorized: true,
    }
  } else {
    // A non signedin user should not be able to access the admin page
    return {
      authorized: false,
      rewriteUrl: '/auth/signin',
      error: 'You must be signed in to access this page',
    }
  }
}
