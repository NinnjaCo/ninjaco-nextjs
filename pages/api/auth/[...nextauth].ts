import { AuthApi } from '@/utils/api/auth'
import { AuthError } from '@/models/shared/error'
import { isAxiosError, isError, unWrapAuthError } from '@/utils/errors'
import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth, { AuthOptions } from 'next-auth'
import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

export const authOptions: AuthOptions = {
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
            accessToken: res.payload.access_token,
            refreshToken: res.payload.refresh_token,
          }
        } catch (e) {
          if (isAxiosError<AuthError>(e)) {
            if (e.response?.data.error?.status === 401) throw new Error('Invalid Credentials')
            const errors = unWrapAuthError(e)
            throw new Error(errors[0].message ?? 'Something went wrong')
          }
          throw new Error(isError(e) ? e.message : 'Something went wrong')
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  callbacks: {
    async jwt({ user, token, account }) {
      // User is what is returned from the authorize function
      // Token is what is returned from the session function
      // Account is what is returned from the provider callback

      if (user) {
        // If user is returned, it means that the user is signing in just now
        return {
          id: user.id,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        }
      } else {
        // If user is not returned, it means that the user is already signed in
        // Check if token is expired
        if (token) {
          const decoded = jwt.decode(token.accessToken) as jwt.JwtPayload
          // console.log('decoded', decoded)
          const exp = decoded.exp
          if (!exp)
            throw new Error('Something went wrong, expiration date is not defined in jwt callback')

          // exp is the actual expiration date of the access token
          // we want to refresh the token before it expires, thus we create a safe zone of 5 minutes
          // before the actual expiration date, so that we can refresh the token before it expires
          const exp_safe_zone = exp - 5 * 60
          if (exp_safe_zone * 1000 < Date.now()) {
            // If token is expired, refresh it
            try {
              const res = await new AuthApi().refresh(token.refreshToken)
              return {
                id: res.payload.user._id,
                accessToken: res.payload.access_token,
                refreshToken: res.payload.refresh_token,
              }
            } catch (e) {
              throw new Error('Something went wrong', {
                cause: e,
              })
            }
          }
          // If token is not expired, return it
          else {
            return {
              id: token.id,
              accessToken: token.accessToken,
              refreshToken: token.refreshToken,
            }
          }
        }

        throw new Error(
          'Something went wrong, neither token nor user was not defined in jwt callback'
        )
      }
    },
    session: async ({ session, token }) => {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.id = token.sub ?? token.id
      const decoded = jwt.decode(token.accessToken) as jwt.JwtPayload
      if (!decoded || !decoded.exp)
        throw new Error('Something went wrong, jwt is not defined in session callback')

      // exp is the actual expiration date of the access token
      // we want to refresh the token before it expires, thus we create a safe zone of 5 minutes
      // before the actual expiration date, so that we can refresh the token before it expires
      const exp_safe_zone = decoded.exp - 5 * 60
      session.expires = new Date(exp_safe_zone * 1000).toString()
      return session
    },
  },
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, authOptions)
}
