import { User as UserModel } from '@/models/crud'
import NextAuth from 'next-auth'

declare module 'next-auth' {
  // export default NextAuth
  interface User {
    id: string
    user: UserModel
    accessToken: string
    refreshToken: string
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    id: string
    user: UserModel
    accessToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    user: UserModel
    accessToken: string
    refreshToken: string
  }
}
