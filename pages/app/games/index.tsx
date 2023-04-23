import { Game } from '@/models/crud/game.model'
import { GameEnrollmentAPI } from '@/utils/api/game-enrollment/game-enrollment.api'
import { User } from '@/models/crud'
import { UserPlayGame } from '@/models/crud/game-enrollment.model'
import { authOptions } from '../../api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { useState } from 'react'
import CreatorMenu from '@/components/creator/creatorMenu'
import Filter from '@/components/creator/filter'
import GameCard from '@/components/creator/gameCard'
import GameEnrollmentCard from '@/components/user/game/enrollmentGameCard'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import UserMenu from '@/components/user/userMenu'
import dayjs from 'dayjs'
import twoBlocksWithRobot from '@/images/twoBlocksRobotAnimated.gif'
import useTranslation from '@/hooks/useTranslation'

enum GameType {
  enrollment = 'enrollment',
  game = 'game',
}

const getTypeOfGame = (game: UserPlayGame | Game): GameType => {
  if ('game' in game) {
    return GameType.enrollment
  } else {
    return GameType.game
  }
}

export default function Home({ user, games }: { user: User; games: (UserPlayGame | Game)[] }) {
  const [filteredGames, setFilteredGames] = useState<(UserPlayGame | Game)[]>(games)
  const t = useTranslation()
  const renderGameCard = (game: UserPlayGame | Game) => {
    if (getTypeOfGame(game) === GameType.enrollment) {
      game = game as UserPlayGame
      return (
        <Link href={`/app/games/${game.game._id}`}>
          <GameEnrollmentCard game={game} />
        </Link>
      )
    } else {
      game = game as Game
      return (
        <Link href={`/app/games/${game._id}`}>
          <GameCard game={game} />
        </Link>
      )
    }
  }

  return (
    <>
      <Head>
        <title>{t.Creator.games.viewGames.headTitle}</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="relative h-screen w-full">
        <UserMenu isOnCoursePage={false} isOnGamesPage={true} user={user}></UserMenu>
        <div className="flex flex-row mt-7 justify-between">
          <div className="flex flex-col mx-6 gap-6 w-full">
            <div className="flex w-full justify-between items-center">
              <div className="text-brand-700 font-semibold text-xl lg:text-2xl">
                {t.Creator.games.viewGames.title}
              </div>
              <div className="text-brand-700 font-semibold w-44 md:w-80 h-fit">
                <Image
                  src={twoBlocksWithRobot}
                  alt="Animated Robot"
                  className="w-44 md:w-80 h-fit"
                  sizes="(max-width: 768px) 11rem,
                        20rem"
                  placeholder="blur"
                  blurDataURL={twoBlocksWithRobot.blurDataURL ?? twoBlocksWithRobot.src}
                />
              </div>
            </div>
            <div className="flex gap-10 justify-start items-center">
              <div className="text-base text-brand">
                {games.length} {t.Creator.games.viewGames.entries}
              </div>{' '}
              <Filter
                filterFields={[
                  {
                    name: t.Creator.games.viewGames.filter.SizeOfGame as string,
                    previousStateModifier: () => {
                      return [
                        ...games.sort((a: any, b: any) => {
                          const aGameType = getTypeOfGame(a)
                          const bGameType = getTypeOfGame(b)

                          const aSize =
                            aGameType === GameType.enrollment ? a.game.sizeOfGrid : a.sizeOfGrid
                          const bSize =
                            bGameType === GameType.enrollment ? b.game.sizeOfGrid : b.sizeOfGrid

                          return aSize > bSize ? -1 : 1
                        }),
                      ]
                    },
                    setter: setFilteredGames,
                  },
                  {
                    name: 'Completed',
                    previousStateModifier: () => {
                      return [
                        ...games.filter((game) => {
                          const gameType = getTypeOfGame(game)
                          if (gameType === GameType.enrollment) {
                            game = game as UserPlayGame

                            if (game.completed) {
                              return game
                            }
                          }
                        }),
                      ]
                    },
                    setter: setFilteredGames,
                  },
                  {
                    name: 'Not Completed',
                    previousStateModifier: () => {
                      return [
                        ...games.filter((game) => {
                          const gameType = getTypeOfGame(game)
                          if (gameType === GameType.enrollment) {
                            game = game as UserPlayGame

                            if (!game.completed) {
                              return game
                            }
                          } else {
                            return game
                          }
                        }),
                      ]
                    },
                    setter: setFilteredGames,
                  },
                  {
                    name: t.Creator.games.viewGames.filter.newest as string,
                    setter: setFilteredGames,
                    previousStateModifier: () => {
                      return [
                        ...games.sort((a: any, b: any) => {
                          const aGameType = getTypeOfGame(a)
                          const bGameType = getTypeOfGame(b)

                          const aCreatedAt =
                            aGameType === GameType.enrollment ? a.game.createdAt : a.createdAt
                          const bCreatedAt =
                            bGameType === GameType.enrollment ? b.game.createdAt : b.createdAt

                          return dayjs(aCreatedAt).isAfter(bCreatedAt) ? -1 : 1
                        }),
                      ]
                    },
                  },
                  {
                    name: t.Creator.games.viewGames.filter.oldest as string,
                    previousStateModifier: () => {
                      return [
                        ...games.sort((a: any, b: any) => {
                          const aGameType = getTypeOfGame(a)
                          const bGameType = getTypeOfGame(b)

                          const aCreatedAt =
                            aGameType === GameType.enrollment ? a.game.createdAt : a.createdAt
                          const bCreatedAt =
                            bGameType === GameType.enrollment ? b.game.createdAt : b.createdAt

                          return dayjs(aCreatedAt).isAfter(bCreatedAt) ? 1 : -1
                        }),
                      ]
                    },
                    setter: setFilteredGames,
                  },
                  {
                    name: t.Creator.games.viewGames.filter.recentlyUpdated as string,
                    previousStateModifier: () => {
                      return [
                        ...games.sort((a: any, b: any) => {
                          const aGameType = getTypeOfGame(a)
                          const bGameType = getTypeOfGame(b)

                          const aUpdatedAt =
                            aGameType === GameType.enrollment ? a.game.updatedAt : a.updatedAt
                          const bUpdatedAt =
                            bGameType === GameType.enrollment ? b.game.updatedAt : b.updatedAt

                          return dayjs(aUpdatedAt).isAfter(bUpdatedAt) ? -1 : 1
                        }),
                      ]
                    },

                    setter: setFilteredGames,
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-8 items-center mt-7 px-10 place-items-center">
          {filteredGames.map((game, index) => (
            <div key={index}>{renderGameCard(game)}</div>
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

  const gamesEnrollmentResponse = await new GameEnrollmentAPI(session).findAll(session.user._id)
  if (!gamesEnrollmentResponse || !gamesEnrollmentResponse.payload) {
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
      games: gamesEnrollmentResponse.payload,
    },
  }
}
