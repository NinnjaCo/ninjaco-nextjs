import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import CreatorMenu from '@/components/creator/creatorMenu'
import Head from 'next/head'
import React from 'react'

const GameViewAndEditPage = ({ user }: { user: User }) => {
  return (
    <>
      <Head>
        <title>NinjaCo | Creator Edit & View Game</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full">
        <CreatorMenu isOnCoursePage={false} creator={user} />
      </main>
    </>
  )
}

export default GameViewAndEditPage

export const getServerSideProps = async (context) => {
  const { query, req, res } = context
  const { id: gameId } = query

  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination:
          (query.redirectTo as string | undefined) || '/auth/signup?error=Token%20Expired',
        permanent: false,
      },
    }
  }

  const response = await new UserApi(session).findOne(session.id)
  if (!response || !response.payload) {
    return {
      props: {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      },
    }
  }

  return {
    props: {
      user: response.payload,
    },
  }
  //   const response = await new GameApi(session).findOne(gameId)

  //   if (!response || !response.payload) {
  //     return {
  //       props: {
  //         redirect: {
  //           destination: '/creator/games',
  //           permanent: false,
  //         },
  //       },
  //     }
  //   }

  //   return {
  //     props: { game: response.payload },
  //   }
}
