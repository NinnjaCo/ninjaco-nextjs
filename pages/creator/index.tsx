import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Creator dashboard</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full">
        <CreatorMenu />
      </main>
    </>
  )
}
