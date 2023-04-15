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
      refetchOnWindowFocus={true}
      refetchInterval={10 * 60}
    >
      {children}
    </SessionProvider>
  )
}

export default SessionManager
