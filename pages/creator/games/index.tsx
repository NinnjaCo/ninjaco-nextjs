import { FunnelIcon } from '@heroicons/react/24/outline'
import { Game } from '@/models/crud/game.model'
import { GameApi } from '@/utils/api/game/game.api'
import { User } from '@/models/crud'
import { authOptions } from '../../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { useState } from 'react'
import CreatorMenu from '@/components/creator/creatorMenu'
import Filter from '@/components/creator/filter'
import GameCard from '@/components/creator/gameCard'
import Head from 'next/head'
import Link from 'next/link'
import dayjs from 'dayjs'
import useTranslation from '@/hooks/useTranslation'

export default function Home({ user, games }: { user: User; games: Game[] }) {
  const [filteredGames, setFilteredGames] = useState<Game[]>(games)
  const t = useTranslation()
  return (
    <>
      <Head>
        <title>{t.Creator.games.viewGames.headTitle}</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="relative h-screen w-full">
        <CreatorMenu isOnCoursePage={false} isOnGamesPage={true} creator={user} />
        <div className="flex flex-row mt-7 justify-between">
          <div className="flex flex-col mx-6 gap-6 w-full">
            <div className="flex w-full justify-between items-center">
              <div className="text-brand-700 font-semibold text-xl lg:text-2xl">
                {t.Creator.games.viewGames.title}
              </div>
              <div className="text-brand-700 font-semibold">
                <Link
                  className="btn btn-secondary bg-secondary rounded-xl text-brand-700 border-brand-700 hover:bg-secondary-800 py-2 h-fit"
                  href="/creator/games/create"
                >
                  {t.Creator.games.viewGames.createGame}
                </Link>
              </div>
            </div>
            <div className="flex gap-10 justify-start items-center">
              <div className="text-base text-brand">
                {games.length} {t.Creator.games.viewGames.entries}
              </div>{' '}
              <Filter
                filterFields={[
                  {
                    name: t.Creator.games.viewGames.filter.newest as string,
                    setter: setFilteredGames,
                    sortFunction: (a, b) => (dayjs(a.createdAt).isAfter(b.createdAt) ? -1 : 1),
                  },
                  {
                    name: t.Creator.games.viewGames.filter.recentlyUpdated as string,
                    sortFunction: (a, b) => (dayjs(a.updatedAt).isAfter(b.updatedAt) ? -1 : 1),
                    setter: setFilteredGames,
                  },
                  {
                    name: t.Creator.games.viewGames.filter.oldest as string,
                    sortFunction: (a, b) => (dayjs(a.createdAt).isAfter(b.createdAt) ? 1 : -1),
                    setter: setFilteredGames,
                  },
                  {
                    name: t.Creator.games.viewGames.filter.NameAZ as string,
                    sortFunction: (a, b) => (a.title > b.title ? 1 : -1),
                    setter: setFilteredGames,
                  },
                  {
                    name: t.Creator.games.viewGames.filter.NameZA as string,
                    sortFunction: (a, b) => (a.title > b.title ? -1 : 1),
                    setter: setFilteredGames,
                  },
                  {
                    name: t.Creator.games.viewGames.filter.SizeOfGame as string,
                    sortFunction: (a, b) => (a.sizeOfGrid.length > b.sizeOfGrid.length ? -1 : 1),
                    setter: setFilteredGames,
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-8 items-center mt-7 px-10 place-items-center">
          {filteredGames.map((game, index) => (
            <Link href={`/creator/games/${game._id}`} key={index}>
              <GameCard game={game} />
            </Link>
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

  const gamesResponse = await new GameApi(session).find()
  if (!gamesResponse || !gamesResponse.payload) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: session.user,
      games: gamesResponse.payload,
    },
  }
}
