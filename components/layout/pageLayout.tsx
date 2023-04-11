import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

const PageLayout = ({ children }) => {
  const { data: session, status } = useSession()
  useEffect(() => {
    if (status !== 'authenticated' || !session) return
  }, [status, session])
  return <>{children}</>
}

export default PageLayout
