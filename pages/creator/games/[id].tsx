import * as yup from 'yup'
import { AuthError } from '@/models/shared'
import { Direction } from '@/components/user/game/gridCell'
import { Game } from '@/models/crud/game.model'
import { GameApi } from '@/utils/api/game/game.api'
import { GridCell, GridCellComponent } from '@/components/creator/game/gridCell'
import { ImageApi } from '@/utils/api/images/image-upload.api'
import { ImageType } from 'react-images-uploading'
import { Input } from '@/components/forms/input'
import { Switch } from '@headlessui/react'
import { User } from '@/models/crud'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { isAxiosError, unWrapAuthError } from '@/utils/errors'
import { useForm } from 'react-hook-form'
import { useImmer } from 'use-immer'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { yupResolver } from '@hookform/resolvers/yup'
import Alert from '@/components/shared/alert'
import CreatorMenu from '@/components/creator/creatorMenu'
import Eraser from '@/components/creator/game/eraser'
import Flag from '@/components/creator/game/flag'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Player from '@/components/creator/game/player'
import React from 'react'
import Select from '@/components/forms/select'
import SingleImageUpload from '@/components/forms/singleImageUpload'
import Wall from '@/components/creator/game/wall'
import clsx from 'clsx'
import underLineImage from '@/images/lightlyWavedLine.svg'
import useTranslation from '@/hooks/useTranslation'

const generateEmptyGrid = (size: number) => {
  const grid: GridCell[][] = []
  for (let i = 0; i < size; i++) {
    grid.push([])
    for (let j = 0; j < size; j++) {
      grid[i].push({
        row: i,
        col: j,
        isPlayer: false,
        isGoal: false,
        isWall: i === 0 || j === 0 || i === size - 1 || j === size - 1,
      })
    }
  }
  return grid
}

const constrcutGridFrom = (
  size: number,
  playerLocation: number[],
  goalLocation: number[],
  walls: number[][]
) => {
  const grid: GridCell[][] = []
  for (let i = 0; i < size; i++) {
    grid.push([])
    for (let j = 0; j < size; j++) {
      grid[i].push({
        row: i,
        col: j,
        isPlayer: i === playerLocation[0] && j === playerLocation[1],
        isGoal: i === goalLocation[0] && j === goalLocation[1],
        isWall: walls.some((wall) => wall[0] === i && wall[1] === j),
      })
    }
  }
  return grid
}

interface ToolsElments {
  name: string
  icon: {
    width: number
    height: number
    color: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any
  }
  toolType: Tools
}

enum Tools {
  PLAYER = 'Player',
  GOAL = 'Goal',
  WALL = 'Wall',
  ERASER = 'Eraser',
  NONE = 'None',
}

interface GameState {
  isPlayerSet: boolean
  isGoalSet: boolean
  numberOfBlocks?: number
  grid: GridCell[][]
}

const GameViewAndEditPage = ({ user, game }: { user: User; game: Game }) => {
  const session = useSession()
  const router = useRouter()
  const t = useTranslation()

  const MIN_COLUMNS = 5
  const MAX_COLUMNS = 20

  const [gameTitle, setGameTitle] = React.useState(game.title)
  const [gameState, setGameState] = useImmer<GameState>({
    grid: constrcutGridFrom(
      game.sizeOfGrid,
      game.playerLocation,
      game.goalLocation,
      game.wallsLocations
    ),
    isPlayerSet: true,
    isGoalSet: true,
    numberOfBlocks: game.numOfBlocks,
  })

  const [saveButtonDisabled, setSaveButtonDisabled] = React.useState(false)
  const [selectedTool, setSelectedTool] = React.useState<Tools>(Tools.NONE)
  const cellSize = 25

  const [toogleLimitedBlocks, setToogleLimitedBlocks] = React.useState(
    game.numOfBlocks ? true : false
  )

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{
    gameImage: ImageType
    playerDirection: Direction
  }>({
    resolver: yupResolver(
      yup.object().shape({
        gameImage: yup.object().nullable(),
        playerDirection: yup
          .mixed()
          .oneOf([Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT])
          .required('Player direction is required'),
      })
    ),
    defaultValues: {
      playerDirection: (game.playerDirection as Direction) ?? Direction.UP,
    },
  })
  const playerDirection = watch('playerDirection')

  const [alertData, setAlertData] = React.useState<{
    message: string
    variant: 'success' | 'info' | 'warning' | 'error'
    open: boolean
  }>({
    message: '',
    variant: 'info',
    open: false,
  })
  const closeAlert = () => {
    setAlertData({ ...alertData, open: false })
  }

  const toolboxTools: ToolsElments[] = [
    {
      name: t.Creator.games.editGame.toolbox.player as string,
      icon: {
        width: 30,
        height: 60,
        color: '#FCD95B',
        icon: Player,
      },
      toolType: Tools.PLAYER,
    },
    {
      name: t.Creator.games.editGame.toolbox.goal as string,
      icon: {
        width: 30,
        height: 60,
        color: '#FCD95B',
        icon: Flag,
      },
      toolType: Tools.GOAL,
    },
    {
      name: t.Creator.games.editGame.toolbox.wall as string,
      icon: {
        width: 30,
        height: 60,
        color: '#FCD95B',
        icon: Wall,
      },
      toolType: Tools.WALL,
    },
    {
      name: t.Creator.games.editGame.toolbox.eraseAll as string,
      icon: {
        width: 30,
        height: 60,
        color: '#FCD95B',
        icon: Eraser,
      },
      toolType: Tools.ERASER,
    },
  ]

  const clickOnSquare = (rowIndex: number, colIndex: number) => {
    if (selectedTool === Tools.PLAYER) {
      setGameState((draft) => {
        // Only 1 player allowed, set all other players to false
        draft.grid = draft.grid.map((row) => {
          return row.map((cell) => {
            return {
              ...cell,
              isPlayer: false,
            }
          })
        })

        draft.grid[rowIndex][colIndex].isPlayer = true
        draft.grid[rowIndex][colIndex].isWall = false
        draft.grid[rowIndex][colIndex].isGoal = false
        draft.isPlayerSet = true
      })
    } else if (selectedTool === Tools.GOAL) {
      // Only 1 goal allowed
      setGameState((draft) => {
        // Only 1 player allowed, set all other players to false
        draft.grid = draft.grid.map((row) => {
          return row.map((cell) => {
            return {
              ...cell,
              isGoal: false,
            }
          })
        })

        draft.grid[rowIndex][colIndex].isGoal = true
        draft.grid[rowIndex][colIndex].isWall = false
        // if the player was on this square, remove it
        draft.isPlayerSet = draft.grid[rowIndex][colIndex].isPlayer ? false : true
        draft.grid[rowIndex][colIndex].isPlayer = false
        draft.isGoalSet = true
      })
    } else if (selectedTool === Tools.WALL) {
      setGameState((draft) => {
        draft.grid[rowIndex][colIndex].isWall = !draft.grid[rowIndex][colIndex].isWall
        // if the player was on this square, remove it
        draft.isPlayerSet = draft.grid[rowIndex][colIndex].isPlayer ? false : true
        draft.grid[rowIndex][colIndex].isPlayer = false
        // if the goal was on this square, remove it
        draft.isGoalSet = draft.grid[rowIndex][colIndex].isGoal ? false : true
        draft.grid[rowIndex][colIndex].isGoal = false
      })
    } else {
      setAlertData({
        message: t.Creator.games.editGame.alerts.pleaseSelectATool as string,
        variant: 'info',
        open: true,
      })
    }
  }

  const changeTool = (tool: Tools) => {
    if (tool === Tools.ERASER) {
      setGameState((draft) => {
        draft.grid = draft.grid.map((row) => {
          return row.map((cell) => {
            return {
              ...cell,
              isPlayer: false,
              isGoal: false,
              isWall: false,
            }
          })
        })
        draft.isPlayerSet = false
        draft.isGoalSet = false
      })
    }

    setSelectedTool(tool)
  }

  const saveGame = async (data: { gameImage: ImageType; playerDirection: Direction }) => {
    closeAlert()

    const playerLocation = gameState.grid
      .map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          return cell.isPlayer ? [rowIndex, colIndex] : undefined
        })
      })
      .flat()
      .filter((cell) => cell !== undefined)[0]

    const goalLocation = gameState.grid
      .map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          return cell.isGoal ? [rowIndex, colIndex] : undefined
        })
      })
      .flat()
      .filter((cell) => cell !== undefined)[0]

    if (!gameState.isPlayerSet || playerLocation === undefined) {
      setAlertData({
        message: t.Creator.games.editGame.alerts.pleaseSetAPlayer as string,
        variant: 'error',
        open: true,
      })
      return
    }
    if (!gameState.isGoalSet || goalLocation === undefined) {
      setAlertData({
        message: t.Creator.games.editGame.alerts.pleaseSetAGoal as string,
        variant: 'error',
        open: true,
      })
      return
    }

    // check if game title is valid
    if (gameTitle === '' || gameTitle.length < 3) {
      setAlertData({
        message: t.Creator.games.editGame.alerts.pleaseEnterAGameTitle as string,
        variant: 'error',
        open: true,
      })
      return
    }

    setSaveButtonDisabled(true)
    // Save game
    try {
      const wallsLocations: number[][] = []
      gameState.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell.isWall) {
            wallsLocations.push([rowIndex, colIndex])
          }
        })
      })

      let image_url = game.image || ''
      if (data.gameImage && data.gameImage.file) {
        const imageRes = await new ImageApi(session.data).uploadImage({
          image: data.gameImage.file,
        })
        image_url = imageRes.payload.image_url
      }

      await new GameApi(session.data).update(game._id, {
        title: gameTitle,
        image: image_url,
        numOfBlocks: gameState.numberOfBlocks,
        playerDirection: data.playerDirection ?? Direction.UP,
        sizeOfGrid: gameState.grid.length,
        playerLocation: playerLocation,
        goalLocation: goalLocation,
        wallsLocations: wallsLocations,
      })

      setAlertData({
        message: t.Creator.games.editGame.alerts.gameCreatedSuccessfully as string,
        variant: 'success',
        open: true,
      })

      // reload page
      setTimeout(() => {
        router.reload()
      }, 2000)
    } catch (error) {
      setSaveButtonDisabled(false)
      if (isAxiosError<AuthError>(error)) {
        const errors = unWrapAuthError(error)
        setAlertData({
          message:
            errors[0].message || (t.Creator.games.editGame.alerts.somethingWentWrong as string),
          variant: 'error',
          open: true,
        })
      } else {
        setAlertData({
          message: t.Creator.games.editGame.alerts.errorCreatingGame as string,
          variant: 'error',
          open: true,
        })
      }
    }
  }

  return (
    <>
      <Head>
        <title>{t.Creator.games.editGame.headTitle}</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full">
        <CreatorMenu isOnCoursePage={false} isOnGamesPage={true} creator={user} />
        <div className="grid md:hidden items-center h-screen grid-cols-1 justify-items-center py-24 px-8 relative flex-auto">
          <h1 className="self-end divide-x-2 divide-black text-sm ">
            <span className="px-2 font-bold">{t.Creator.games.editGame.mobileError}</span>
          </h1>
          <Link href="/creator/games" className="self-start my-4 text-sm btn btn-brand">
            {t.Creator.games.editGame.goBack}
          </Link>
        </div>
        <div className="w-full h-1/2 hidden justify-between items-stretch md:flex">
          <div className="flex flex-col p-8 gap-8 w-full">
            <div className="flex justify-between">
              <div className="flex flex-col text-brand-500 font-bold">
                <p className="text-lg md:text-xl lg:text-2xl">{t.Creator.games.editGame.title}</p>
                <Image src={underLineImage} alt="Waved Line" className="w-40" />
              </div>
              <Alert
                open={alertData.open}
                message={alertData.message}
                variant={alertData.variant}
                close={closeAlert}
              />
            </div>
            <Input
              name="name"
              label={t.Creator.games.editGame.gameTitle}
              placeholder={t.Creator.games.editGame.gameTitle as string}
              className="max-w-md"
              value={gameTitle}
              onChange={(e) => {
                setGameTitle(e.target.value)
              }}
              isRequired={true}
            />
            <div className="w-full flex bg-white justify-evenly gap-12 flex-col lg:flex-row">
              {/* Draw Grid */}
              <div
                className="grid gap-px transition-all w-fit h-fit"
                style={{
                  gridTemplateColumns: `repeat(${gameState.grid.length}, minmax(0, 1fr))`,
                }}
              >
                {gameState.grid.map((row, rowIndex) => {
                  return row.map((cell, colIndex) => {
                    return (
                      <GridCellComponent
                        key={`${rowIndex}-${colIndex}`}
                        cell={cell}
                        size={cellSize}
                        onClick={clickOnSquare}
                        currentPlayerDirection={playerDirection}
                      />
                    )
                  })
                })}
              </div>
              <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-8 justify-normal">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="default-range" className="block text-sm font-medium text-brand">
                      {t.Creator.games.editGame.sizeOfTheGrid} {gameState.grid.length} x{' '}
                      {gameState.grid.length}
                    </label>
                    <div className="flex gap-2 items-center">
                      <span className="text-brand-500">{MIN_COLUMNS}</span>
                      <input
                        id="default-range"
                        type="range"
                        max={MAX_COLUMNS}
                        min={MIN_COLUMNS}
                        step={1}
                        onChange={(e) => {
                          const newGridSize = parseInt(e.target.value, 10)
                          setGameState((draft) => {
                            draft.grid = generateEmptyGrid(newGridSize)
                            draft.isGoalSet = false
                            draft.isPlayerSet = false
                            return draft
                          })
                        }}
                        value={gameState.grid.length}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary accent-brand"
                      ></input>
                      <span className="text-brand-500">{MAX_COLUMNS}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <Switch
                        checked={toogleLimitedBlocks}
                        onChange={(isChecked) => {
                          setToogleLimitedBlocks(isChecked)
                          setGameState((draft) => {
                            draft.numberOfBlocks = 0
                            return draft
                          })
                        }}
                        className={`${toogleLimitedBlocks ? 'bg-brand-700' : 'bg-brand-500'}
                      relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                      >
                        <span className="sr-only">
                          {t.Creator.games.editGame.toggleLimitedBlocks}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`${toogleLimitedBlocks ? 'translate-x-7' : 'translate-x-0'}
                        pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                      <div className="text-brand font-medium">
                        {t.Creator.games.editGame.limitedNumberOfBlocks}
                      </div>
                    </div>
                    <Input
                      name="limitedBlocks"
                      placeholder="Number of Allowed Blocks"
                      type="number"
                      disabled={!toogleLimitedBlocks}
                      value={gameState.numberOfBlocks}
                      onChange={(e) => {
                        const newNumberOfBlocks = parseInt(e.target.value, 10)
                        setGameState((draft) => {
                          draft.numberOfBlocks = newNumberOfBlocks
                          return draft
                        })
                      }}
                      className={clsx({
                        'bg-brand-50 cursor-not-allowed': !toogleLimitedBlocks,
                      })}
                    />
                  </div>
                  <Select
                    name="playerDirection"
                    label={'Player Direction'}
                    control={control}
                    error={errors.playerDirection?.message}
                    isRequired={true}
                    selectList={Object.values(Direction).map((direction) => direction.toString())}
                  />
                </div>

                <SingleImageUpload
                  control={control}
                  name="gameImage"
                  error={errors.gameImage?.message as unknown as string}
                  label="Game Image"
                  isRequired={true}
                  defaultImage={game.image}
                />
                <div className="flex gap-4 pt-4">
                  <button
                    className="btn btn-brand rounded-lg hover:bg-brand-400 hover:text-white py-2 h-fit disabled:bg-gray-500 disabled:cursor-not-allowed disabled:text-white"
                    disabled={saveButtonDisabled}
                    onClick={() => {
                      handleSubmit(saveGame)()
                    }}
                  >
                    {t.Creator.games.editGame.saveGame}
                  </button>
                  <button
                    className="btn btn-secondary rounded-lg hover:bg-brand-400 hover:text-white py-2 h-fit"
                    onClick={() => {
                      setGameState((draft) => {
                        draft.grid = generateEmptyGrid(draft.grid.length)
                        draft.isGoalSet = false
                        draft.isPlayerSet = false
                        return draft
                      })
                    }}
                  >
                    {t.Creator.games.editGame.resetGrid}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* ToolBox */}
          <div className="hidden md:flex bg-brand min-h-screen w-full max-w-[12rem] flex-col items-start gap-12 py-4 px-1 lg:px-4">
            <div className="flex flex-col gap-1">
              <div className="text-brand-50 text-xl">{t.Creator.games.editGame.toolbox.title}</div>
              <div className="text-brand-200 text-2xs">
                {t.Creator.games.editGame.toolbox.description}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              {toolboxTools.map((tool, index) => {
                return (
                  <>
                    <button
                      className="flex gap-4 items-center p-1 hover:bg-brand-500 rounded cursor-grab"
                      key={index}
                      onClick={() => {
                        changeTool(tool.toolType)
                      }}
                    >
                      <tool.icon.icon
                        width={tool.icon.width}
                        height={tool.icon.height}
                        color={tool.icon.color}
                      />
                      <div className="text-2xl text-brand-50">{tool.name}</div>
                    </button>
                    {index !== toolboxTools.length - 1 ? (
                      <div className="w-full h-px bg-brand-500"></div>
                    ) : null}
                  </>
                )
              })}
            </div>
          </div>
        </div>
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

  const gameResponse = await new GameApi(session).findOne(gameId)

  if (!gameResponse || !gameResponse.payload) {
    return {
      redirect: {
        destination: '/creator/games',
        permanent: false,
      },
    }
  }

  return {
    props: { user: session.user, game: gameResponse.payload },
  }
}
