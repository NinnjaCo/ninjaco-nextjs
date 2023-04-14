import { FunnelIcon } from '@heroicons/react/24/outline'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '../../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import CreatorMenu from '@/components/creator/creatorMenu'
import GameCard from '@/components/creator/gameCard'
import Head from 'next/head'
import Link from 'next/link'

export default function Home({ user }: { user: User }) {
  const games = [
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/coding_smart_city.png',
      name: 'Simple Movements',
    },
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/coding_smart_city.png',
      name: 'Simple Movements',
    },
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/coding_smart_city.png',
      name: 'Simple Movements',
    },
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/coding_smart_city.png',
      name: 'Simple Movements',
    },
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/coding_smart_city.png',
      name: 'Simple Movements',
    },
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/coding_smart_city.png',
      name: 'Simple Movements',
    },
    {
      image:
        'https://s3-us-west-2.amazonaws.com/cherpa01-static/curriculum/courses/coding_smart_city.png',
      name: 'Simple Movements',
    },
  ]
  return (
    <>
      <Head>
        <title>NinjaCo | Games</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="relative h-screen w-full">
        <CreatorMenu isOnCoursePage={false} isOnGamesPage={true} creator={user} />
        <div className="flex flex-row mt-7 justify-between">
          <div className="flex flex-col mx-6 gap-6 w-full">
            <div className="flex w-full justify-between items-center">
              <div className="text-brand-700 font-semibold text-xl lg:text-2xl">Games</div>
              <div className="text-brand-700 font-semibold">
                <button className="btn btn-secondary bg-secondary rounded-xl text-brand-700 border-brand-700 hover:bg-secondary-800 py-2 h-fit">
                  Create Game
                </button>
              </div>
            </div>
            <div className="flex gap-10 justify-start items-center">
              <div className="text-base text-brand"> 10 entries</div>{' '}
              <button className="btn btn-secondary bg-brand-300 rounded-lg text-brand-700 border-brand-700 hover:bg-secondary-800 py-1 px-4 h-fit flex gap-3">
                <FunnelIcon className="w-4 h-4 text-brand" />
                Filter
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-8 items-center mt-7 px-10 place-items-center">
          {games.map((game, index) => (
            <>
              <GameCard key={index} image={game.image} name={game.name} />
              <Link href={`/creator/games/${game._id}`} />
            </>
          ))}
        </div>
      </main>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { query, req, res } = context

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
}
