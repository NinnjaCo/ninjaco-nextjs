import NextAuth from 'next-auth'

declare module 'next-auth' {
  // export default NextAuth
  interface User {
    id: string
    jwt: string
    refresh: string
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    id: string
    jwt: string
    refresh: string
    user: User
    test: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    jwt: string
    refreshToken: string
  }
}
