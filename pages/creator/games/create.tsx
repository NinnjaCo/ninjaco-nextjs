import * as yup from 'yup'
import { AuthError } from '@/models/shared'
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
import SingleImageUpload from '@/components/forms/singleImageUpload'
import Wall from '@/components/creator/game/wall'
import clsx from 'clsx'
import underLineImage from '@/images/lightlyWavedLine.svg'
import useTranslation from '@/hooks/useTranslation'

const createGrid = (rows: number, cols: number): GridCell[][] => {
  const grid: GridCell[][] = []
  for (let row = 0; row < rows; row++) {
    grid.push([])
    for (let col = 0; col < cols; col++) {
      // if it is a border cell, make it a wall
      grid[row].push({
        row,
        col,
        isWall: row === 0 || row === rows - 1 || col === 0 || col === cols - 1,
        isPlayer: false,
        isGoal: false,
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

const GameCreatePage = ({ user }: { user: User }) => {
  const session = useSession()
  const router = useRouter()
  const t = useTranslation()
  const [gameTitle, setGameTitle] = React.useState('')
  const MIN_COLUMNS = 5
  const MAX_COLUMNS = 20
  const [numberOfColumns, setNumberOfColumns] = React.useState(15)
  const [gameGrid, setGameGrid] = React.useState<GridCell[][]>(
    createGrid(numberOfColumns, numberOfColumns)
  )
  const [saveButtonDisabled, setSaveButtonDisabled] = React.useState(false)
  const [selectedTool, setSelectedTool] = React.useState<Tools>(Tools.NONE)
  const cellSize = 25

  const [toogleLimitedBlocks, setToogleLimitedBlocks] = React.useState(false)
  const [numberOfBlocks, setNumberOfBlocks] = React.useState<number | undefined>(undefined)
  const [gameState, setGameState] = React.useState<{
    isPlayerSet: boolean
    isGoalSet: boolean
    playerLocation: GridCell | undefined
    goalLocation: GridCell | undefined
    wallsLocations?: GridCell[] | undefined
  }>({
    isPlayerSet: false,
    isGoalSet: false,
    playerLocation: undefined,
    goalLocation: undefined,
    wallsLocations: gameGrid.flat().filter((cell) => cell.isWall),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    gameImage: ImageType
  }>({
    resolver: yupResolver(
      yup.object().shape({
        gameImage: yup.mixed().required('Image is required'),
      })
    ),
  })

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
      name: t.Creator.games.createGame.toolbox.player as string,
      icon: {
        width: 30,
        height: 60,
        color: '#FCD95B',
        icon: Player,
      },
      toolType: Tools.PLAYER,
    },
    {
      name: t.Creator.games.createGame.toolbox.goal as string,
      icon: {
        width: 30,
        height: 60,
        color: '#FCD95B',
        icon: Flag,
      },
      toolType: Tools.GOAL,
    },
    {
      name: t.Creator.games.createGame.toolbox.wall as string,
      icon: {
        width: 30,
        height: 60,
        color: '#FCD95B',
        icon: Wall,
      },
      toolType: Tools.WALL,
    },
    {
      name: t.Creator.games.createGame.toolbox.eraseAll as string,
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
      // Only 1 player allowed
      const newGrid = gameGrid.map((row) => {
        return row.map((cell) => {
          return {
            ...cell,
            isPlayer: false,
          }
        })
      })
      newGrid[rowIndex][colIndex].isPlayer = true
      newGrid[rowIndex][colIndex].isWall = false
      newGrid[rowIndex][colIndex].isGoal = false
      setGameGrid(newGrid)
      setGameState({
        ...gameState,
        isPlayerSet: true,
        playerLocation: newGrid[rowIndex][colIndex],
      })
    } else if (selectedTool === Tools.GOAL) {
      // Only 1 goal allowed
      const newGrid = gameGrid.map((row) => {
        return row.map((cell) => {
          return {
            ...cell,
            isGoal: false,
          }
        })
      })
      newGrid[rowIndex][colIndex].isGoal = true
      newGrid[rowIndex][colIndex].isWall = false
      newGrid[rowIndex][colIndex].isPlayer = false
      setGameGrid(newGrid)
      setGameState({
        ...gameState,
        isGoalSet: true,
        goalLocation: newGrid[rowIndex][colIndex],
      })
    } else if (selectedTool === Tools.WALL) {
      const newGrid = gameGrid.map((row) => {
        return row.map((cell) => {
          if (cell.row === rowIndex && cell.col === colIndex) {
            // if cell already has a wall, remove it
            // if cell doesn't have a wall, add it
            // if cell has a player or goal, don't allow it to be a wall
            return {
              ...cell,
              isWall: !cell.isWall && !cell.isPlayer && !cell.isGoal,
            }
          }
          return cell
        })
      })
      setGameGrid(newGrid)
      setGameState({
        ...gameState,
        wallsLocations: newGrid.flat().filter((cell) => cell.isWall),
      })
    } else {
      setAlertData({
        message: t.Creator.games.createGame.alerts.pleaseSelectATool as string,
        variant: 'info',
        open: true,
      })
    }
  }

  const changeTool = (tool: Tools) => {
    if (tool === Tools.ERASER) {
      const newGrid = gameGrid.map((row) => {
        return row.map((cell) => {
          return {
            ...cell,
            isWall: false,
            isPlayer: false,
            isGoal: false,
          }
        })
      })
      setGameGrid(newGrid)
    }

    setSelectedTool(tool)
  }

  const saveGame = async (data: { gameImage: ImageType }) => {
    closeAlert()

    if (!gameState.isPlayerSet || gameState.playerLocation === undefined) {
      setAlertData({
        message: t.Creator.games.createGame.alerts.pleaseSetAPlayer as string,
        variant: 'error',
        open: true,
      })
      return
    }
    if (!gameState.isGoalSet || gameState.goalLocation === undefined) {
      setAlertData({
        message: t.Creator.games.createGame.alerts.pleaseSetAGoal as string,
        variant: 'error',
        open: true,
      })
      return
    }

    // check if game title is valid
    if (gameTitle === '' || gameTitle.length < 3) {
      setAlertData({
        message: t.Creator.games.createGame.alerts.pleaseEnterAGameTitle as string,
        variant: 'error',
        open: true,
      })
      return
    }

    if (!data.gameImage || !data.gameImage.file) {
      setAlertData({
        message: t.Creator.games.createGame.alerts.pleaseUploadAnImage as string,
        variant: 'error',
        open: true,
      })
      return
    }

    setSaveButtonDisabled(true)

    // Save game
    try {
      const playerLocation = [gameState.playerLocation.row, gameState.playerLocation.col]
      const goalLocation = [gameState.goalLocation.row, gameState.goalLocation.col]
      const wallsLocations = gameState.wallsLocations?.map((wall) => [wall.row, wall.col]) || []

      const imageRes = await new ImageApi(session.data).uploadImage({
        image: data.gameImage.file,
      })

      await new GameApi(session.data).create({
        title: gameTitle,
        image: imageRes.payload.image_url,
        numOfBlocks: numberOfBlocks,
        sizeOfGrid: numberOfColumns,
        playerLocation: playerLocation,
        goalLocation: goalLocation,
        wallsLocations: wallsLocations,
      })

      setAlertData({
        message: t.Creator.games.createGame.alerts.gameCreatedSuccessfully as string,
        variant: 'success',
        open: true,
      })

      router.push('/creator/games')
    } catch (error) {
      setSaveButtonDisabled(false)
      if (isAxiosError<AuthError>(error)) {
        const errors = unWrapAuthError(error)
        setAlertData({
          message:
            errors[0].message || (t.Creator.games.createGame.alerts.somethingWentWrong as string),
          variant: 'error',
          open: true,
        })
      } else {
        setAlertData({
          message: t.Creator.games.createGame.alerts.errorCreatingGame as string,
          variant: 'error',
          open: true,
        })
      }
    }
  }

  return (
    <>
      <Head>
        <title>{t.Creator.games.createGame.headTitle}</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full">
        <CreatorMenu isOnCoursePage={false} isOnGamesPage={true} creator={user} />
        <div className="grid md:hidden items-center h-screen grid-cols-1 justify-items-center py-24 px-8 relative flex-auto">
          <h1 className="self-end divide-x-2 divide-black text-sm ">
            <span className="px-2 font-bold">{t.Creator.games.createGame.mobileError}</span>
          </h1>
          <Link href="/creator/games" className="self-start my-4 text-sm btn btn-brand">
            {t.Creator.games.createGame.goBack}
          </Link>
        </div>
        <div className="w-full h-1/2 hidden justify-between items-stretch md:flex">
          <div className="flex flex-col p-8 gap-8 w-full">
            <div className="flex justify-between">
              <div className="flex flex-col text-brand-500 font-bold">
                <p className="text-lg md:text-xl lg:text-2xl">{t.Creator.games.createGame.title}</p>
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
              label={t.Creator.games.createGame.gameTitle as string}
              placeholder={t.Creator.games.createGame.gameTitle as string}
              className="max-w-sm"
              value={gameTitle}
              onChange={(e) => {
                setGameTitle(e.target.value)
              }}
            />
            <div className="w-full flex bg-white justify-evenly gap-12 flex-col lg:flex-row">
              {/* Draw Grid */}
              <div
                className="grid gap-px transition-all w-fit h-fit"
                style={{
                  gridTemplateColumns: `repeat(${gameGrid[0].length}, minmax(0, 1fr))`,
                }}
              >
                {gameGrid.map((row, rowIndex) => {
                  return row.map((cell, colIndex) => {
                    return (
                      <GridCellComponent
                        key={`${rowIndex}-${colIndex}`}
                        cell={cell}
                        size={cellSize}
                        onClick={clickOnSquare}
                      />
                    )
                  })
                })}
              </div>
              <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-8 justify-normal">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="default-range" className="block text-sm font-medium text-brand">
                      {t.Creator.games.createGame.sizeOfTheGrid} {numberOfColumns} x{' '}
                      {numberOfColumns}
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
                          const newNumberOfColumns = parseInt(e.target.value, 10)
                          setNumberOfColumns(newNumberOfColumns)
                          // update the grid
                          const newGrid = createGrid(newNumberOfColumns, newNumberOfColumns)
                          setGameGrid(newGrid)
                        }}
                        value={numberOfColumns}
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
                          setNumberOfBlocks(undefined)
                        }}
                        className={`${toogleLimitedBlocks ? 'bg-brand-700' : 'bg-brand-500'}
                      relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                      >
                        <span className="sr-only">
                          {t.Creator.games.createGame.toggleLimitedBlocks}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`${toogleLimitedBlocks ? 'translate-x-7' : 'translate-x-0'}
                        pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                      <div className="text-brand font-medium">
                        {t.Creator.games.createGame.limitedNumberOfBlocks}
                      </div>
                    </div>
                    <Input
                      name="limitedBlocks"
                      placeholder="Number of Allowed Blocks"
                      type="number"
                      disabled={!toogleLimitedBlocks}
                      value={numberOfBlocks}
                      onChange={(e) => {
                        const newNumberOfBlocks = parseInt(e.target.value, 10)
                        setNumberOfBlocks(newNumberOfBlocks)
                      }}
                      className={clsx({
                        'bg-brand-50 cursor-not-allowed': !toogleLimitedBlocks,
                      })}
                    />
                  </div>
                </div>
                <SingleImageUpload
                  control={control}
                  name="gameImage"
                  error={errors.gameImage?.message as unknown as string}
                  label="Game Image"
                  isRequired={true}
                />

                <div className="flex gap-4 pt-4">
                  <button
                    className="btn btn-brand rounded-lg hover:bg-brand-400 hover:text-white py-2 h-fit disabled:bg-gray-500 disabled:cursor-not-allowed disabled:text-white"
                    disabled={saveButtonDisabled}
                    onClick={() => {
                      handleSubmit(saveGame)()
                    }}
                  >
                    {t.Creator.games.createGame.saveGame}
                  </button>
                  <button
                    className="btn btn-secondary rounded-lg hover:bg-brand-400 hover:text-white py-2 h-fit"
                    onClick={() => {
                      setGameGrid(createGrid(numberOfColumns, numberOfColumns))
                    }}
                  >
                    {t.Creator.games.createGame.resetGrid}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* ToolBox */}
          <div className="hidden md:flex bg-brand min-h-screen w-full max-w-[12rem] flex-col items-start gap-12 py-4 px-1 lg:px-4">
            <div className="flex flex-col gap-1">
              <div className="text-brand-50 text-xl">
                {t.Creator.games.createGame.toolbox.title}
              </div>
              <div className="text-brand-200 text-2xs">
                {t.Creator.games.createGame.toolbox.description}
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

export default GameCreatePage

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

  return {
    props: {
      user: session.user,
    },
  }
}
