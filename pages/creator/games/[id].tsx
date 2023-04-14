import { GameApi } from '@/utils/api/game/game.api'
import { Input } from '@/components/forms/input'
import { Switch } from '@headlessui/react'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import Alert from '@/components/shared/alert'
import CreatorMenu from '@/components/creator/creatorMenu'
import Eraser from '@/components/creator/game/eraser'
import Flag from '@/components/creator/game/flag'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Player from '@/components/creator/game/player'
import React, { useEffect } from 'react'
import Wall from '@/components/creator/game/wall'
import clsx from 'clsx'
import underLineImage from '@/images/lightlyWavedLine.svg'

interface GridCell {
  row: number
  col: number
  isWall: boolean
  isPlayer: boolean
  isGoal: boolean
}

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

const GameViewAndEditPage = ({ user }: { user: User }) => {
  const session = useSession()
  const [gameTitle, setGameTitle] = React.useState('')
  const MIN_COLUMNS = 5
  const MAX_COLUMNS = 20
  const [numberOfColumns, setNumberOfColumns] = React.useState(15)
  const [gameGrid, setGameGrid] = React.useState<GridCell[][]>(
    createGrid(numberOfColumns, numberOfColumns)
  )

  const [selectedTool, setSelectedTool] = React.useState<Tools>(Tools.NONE)
  const [cellSize, setCellSize] = React.useState(25)

  const [toogleLimitedBlocks, setToogleLimitedBlocks] = React.useState(false)
  const [numberOfBlocks, setNumberOfBlocks] = React.useState<number | undefined>(undefined)
  const [gameState, setGameState] = React.useState<{
    isPlayerSet: boolean
    isGoalSet: boolean
    numberOfBlocks?: number | undefined
    sizeOfGrid: number | undefined
    playerLocation: { row: number; col: number } | undefined
    goalLocation: { row: number; col: number } | undefined
    wallsLocations: { row: number; col: number }[] | undefined
  }>({
    isPlayerSet: false,
    isGoalSet: false,
    numberOfBlocks: undefined,
    sizeOfGrid: undefined,
    playerLocation: undefined,
    goalLocation: undefined,
    wallsLocations: undefined,
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
      name: 'Player',
      icon: {
        width: 30,
        height: 60,
        color: '#FCD95B',
        icon: Player,
      },
      toolType: Tools.PLAYER,
    },
    {
      name: 'Goal',
      icon: {
        width: 30,
        height: 60,
        color: '#FCD95B',
        icon: Flag,
      },
      toolType: Tools.GOAL,
    },
    {
      name: 'Wall',
      icon: {
        width: 30,
        height: 60,
        color: '#FCD95B',
        icon: Wall,
      },
      toolType: Tools.WALL,
    },
    {
      name: 'Erase All',
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
    console.log('Clicked on square', rowIndex, colIndex)
    console.log('Selected tool', selectedTool)
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
      setGameGrid(newGrid)
      setGameState({
        ...gameState,
        isPlayerSet: true,
        playerLocation: { row: rowIndex, col: colIndex },
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
      setGameGrid(newGrid)
      setGameState({
        ...gameState,
        isGoalSet: true,
        goalLocation: { row: rowIndex, col: colIndex },
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
        wallsLocations: [...(gameState.wallsLocations || []), { row: rowIndex, col: colIndex }],
      })
    }
  }

  const changeTool = (tool: Tools) => {
    console.log('Changing tool to', tool)

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

  const saveGame = async () => {
    closeAlert()

    if (!gameState.isPlayerSet) {
      setAlertData({
        message: 'Please set a player on the grid before saving',
        variant: 'error',
        open: true,
      })
      return
    }
    if (!gameState.isGoalSet) {
      setAlertData({
        message: 'Please set a goal on the grid before saving',
        variant: 'error',
        open: true,
      })
      return
    }

    // check if game title is valid
    if (gameTitle === '' || gameTitle.length < 3) {
      setAlertData({
        message: 'Please enter a game title with at least 3 characters',
        variant: 'error',
        open: true,
      })
      return
    }
    // Save game
    await new GameApi().create({
      title: gameTitle,
      numOfBlocks: numberOfBlocks as number,
      sizeOfGrid: gameGrid.length,
      playerLocation: gameState.playerLocation
        ? [gameState.playerLocation.row, gameState.playerLocation.col]
        : undefined,
      goalLocation: gameState.goalLocation
        ? [gameState.goalLocation.row, gameState.goalLocation.col]
        : undefined,
      wallsLocations: gameState.wallsLocations
        ? gameState.wallsLocations.map((wall) => [wall.row, wall.col])
        : undefined,
    })
    console.log('Game saved', gameState)
  }

  return (
    <>
      <Head>
        <title>NinjaCo | Creator Edit & View Game</title>
        <meta name="description" content="Leading online platform for visual programming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="relative w-full">
        <CreatorMenu isOnCoursePage={false} isOnGamesPage={true} creator={user} />
        <div className="grid md:hidden items-center h-screen grid-cols-1 justify-items-center py-24 px-8 relative flex-auto">
          <h1 className="self-end divide-x-2 divide-black text-sm ">
            <span className="px-2 font-bold">Please use your Computer to View Or Edit a Game</span>
          </h1>
          <Link href="/creator/games" className="self-start my-4 text-sm btn btn-brand">
            Go Back
          </Link>
        </div>
        <div className="w-full h-1/2 hidden justify-between items-stretch md:flex">
          <div className="flex flex-col p-8 gap-8 w-full">
            <div className="flex justify-between">
              <div className="flex flex-col text-brand-500 font-bold">
                <p className="text-lg md:text-xl lg:text-2xl">Create game level</p>
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
              label="Game Title"
              placeholder="Game Title"
              className="max-w-sm"
              value={gameTitle}
              onChange={(e) => {
                setGameTitle(e.target.value)
              }}
            />
            <div className="w-full flex bg-white justify-evenly gap-12 flex-col lg:flex-row">
              {/* Draw Grid */}
              <div
                className="grid gap-px transition-all w-fit"
                style={{
                  gridTemplateColumns: `repeat(${gameGrid[0].length}, minmax(0, 1fr))`,
                }}
              >
                {gameGrid.map((row, rowIndex) => {
                  return row.map((cell, colIndex) => {
                    return (
                      <div
                        className={clsx(
                          'bg-brand-50 border-2 border-brand-100 cursor-cell',
                          cell.isWall && 'bg-brand-500',
                          cell.isPlayer && 'bg-secondary',
                          cell.isGoal && 'bg-brand-800'
                        )}
                        style={{
                          width: `${cellSize}px`,
                          height: `${cellSize}px`,
                        }}
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => {
                          clickOnSquare(rowIndex, colIndex)
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={() => {
                          clickOnSquare(rowIndex, colIndex)
                        }}
                      />
                    )
                  })
                })}
              </div>
              <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-8 justify-normal">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="default-range" className="block text-sm font-medium text-brand">
                      Size of the grid {numberOfColumns} x {numberOfColumns}
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
                          setGameState({ ...gameState, sizeOfGrid: newNumberOfColumns })
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
                          setGameState({ ...gameState, numberOfBlocks: undefined })
                        }}
                        className={`${toogleLimitedBlocks ? 'bg-brand-700' : 'bg-brand-500'}
                      relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                      >
                        <span className="sr-only">toogle Limited Blocks</span>
                        <span
                          aria-hidden="true"
                          className={`${toogleLimitedBlocks ? 'translate-x-7' : 'translate-x-0'}
                        pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                      <div className="text-brand font-medium">Limited number of blocks</div>
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
                        setGameState({ ...gameState, numberOfBlocks: newNumberOfBlocks })
                      }}
                      className={clsx({
                        'bg-brand-50 cursor-not-allowed': !toogleLimitedBlocks,
                      })}
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    className="btn btn-brand rounded-lg hover:bg-brand-400 hover:text-white py-2 h-fit"
                    onClick={() => {
                      saveGame()
                    }}
                  >
                    Save Game
                  </button>
                  <button
                    className="btn btn-secondary rounded-lg hover:bg-brand-400 hover:text-white py-2 h-fit"
                    onClick={() => {
                      setGameGrid(createGrid(numberOfColumns, numberOfColumns))
                    }}
                  >
                    Reset Grid
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* ToolBox */}
          <div className="hidden md:flex bg-brand min-h-screen w-full max-w-[12rem] flex-col items-start gap-12 py-4 px-1 lg:px-4">
            <div className="flex flex-col gap-1">
              <div className="text-brand-50 text-xl">Items Menu</div>
              <div className="text-brand-200 text-2xs">Select an item and place it on the map</div>
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
