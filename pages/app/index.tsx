import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import React from 'react'

export default function MainApp() {
  return (
    <>
      <Head>
        <title>User courses page</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative h-screen w-full">
        <CreatorMenu isOnCoursePage={false} isOnGamesPage={true} creator={user} />
      </main>
    </>
  )
}
