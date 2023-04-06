import { AuthApi } from '@/utils/api/auth'
import { AuthError } from '@/models/shared/error'
import { isAxiosError, isError } from '@/utils/errors'
import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'
import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    secret: process.env.JWT_ACCESS_SECRET,
    providers: [
      CredentialsProvider({
        name: 'local',
        credentials: {
          email: { label: 'Email', type: 'text', placeholder: 'Email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          try {
            const res = await new AuthApi().signIn(
              credentials?.email ?? '',
              credentials?.password ?? ''
            )
            return {
              id: res.payload.user._id,
              jwt: res.payload.access_token,
              refresh: res.payload.refresh_token,
            }
          } catch (e) {
            if (isAxiosError<AuthError>(e)) {
              throw new Error(
                e.response?.data.error?.response?.errors?.message ?? 'Something went wrong'
              )
            }
            throw new Error(isError(e) ? e.message : 'Something went wrong')
          }
        },
      }),
    ],
    pages: {
      signIn: '/auth/signin',
      newUser: '/',
      error: '/auth/signip',
    },
    callbacks: {
      session: async ({ session, token }) => {
        session.jwt = token.jwt
        session.refresh = token.refreshToken
        session.id = token.id
        const { exp } = jwt.decode(token.jwt) as jwt.JwtPayload
        session.expires = new Date((exp as number) * 1000).toISOString()
        return session
      },
      jwt: async ({ token, user, account }) => {
        if (!user || !account) {
          const decoded = jwt.decode(token.jwt)
          if (!decoded || typeof decoded === 'string' || !decoded.exp)
            throw new Error('Invalid token')

          if (decoded.exp < Math.floor(Date.now() / 1000)) {
            try {
              const res = await new AuthApi().refresh(token.refreshToken)
              return {
                ...token,
                jwt: res.payload.access_token,
                refreshToken: res.payload.refresh_token,
                id: res.payload.user._id,
              }
            } catch (e) {
              throw new Error('Invalid token')
            }
          }

          return {
            ...token,
            id: decoded.id,
          }
        }

        // Credential based auth
        return {
          ...token,
          jwt: user.jwt,
          id: user.id,
          refreshToken: user.refresh,
        }
      },
    },
  })
}
