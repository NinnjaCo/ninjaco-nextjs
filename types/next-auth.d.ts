import NextAuth from 'next-auth'

declare module 'next-auth' {
  // export default NextAuth
  interface User {
    id: number
    jwt: string
    refresh: string
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    id: number
    jwt: string
    refresh: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number
    jwt: string
    refreshToken: string
  }
}
