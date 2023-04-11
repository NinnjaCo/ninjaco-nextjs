import { FC, useEffect, useState } from 'react'
import { Session } from 'next-auth'
import { SessionProvider, getSession } from 'next-auth/react'

const SessionManager: FC<{ serverSession?: Session | null; children }> = ({
  serverSession,
  children,
}) => {
  const [session, setSession] = useState(serverSession)

  useEffect(() => {
    const runEffect = async () => {
      if (serverSession) {
        setSession(serverSession)
      } else {
        const s = await getSession()
        setSession(s)
      }
    }
    runEffect()
  }, [serverSession])

  return (
    <SessionProvider
      key={session?.id}
      session={session}
      refetchInterval={15.1 * 60}
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  )
}

export default SessionManager
