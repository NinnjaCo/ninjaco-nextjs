import { Direction, GridCell } from '@/components/user/game/gridCell'
import { GetServerSideProps } from 'next'
import { GridCellComponent } from '@/components/user/game/gridCell'
import { User } from '@/models/crud'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { gameBlocks } from '@/blockly/blocks/game'
import { gameGenerator } from '@/blockly/generetors/game'
import { gameToolBox } from '@/blockly/toolbox/game'
import { getServerSession } from 'next-auth'
import { parseCode } from '@/blockly/parser/game'
import Blockly from 'blockly'
import BlocklyBoard from '@/components/blockly/blockly'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import UserMenu from '@/components/user/userMenu'
import useTranslation from '@/hooks/useTranslation'

interface ServerSideProps {
  user: User
  gameId: string
}

const getInitialGrid = (size: number): GridCell[][] => {
  const grid: GridCell[][] = []
  for (let i = 0; i < size; i++) {
    grid.push([])
    for (let j = 0; j < size; j++) {
      grid[i].push({
        row: i,
        col: j,
        isPlayer: i === 1 && j === 1,
        isGoal: false,
        isWall: i === 0 || j === 0 || i === size - 1 || j === size - 1,
      })
    }
  }
  return grid
}

// create an interface type that represent a action writing in the blockly
type Action = {
  type: string
  args: string[]
}

/**
 * Outcomes of running the user program.
 */
const ResultType = {
  UNSET: 0,
  SUCCESS: 1,
  FAILURE: -1,
  TIMEOUT: 2,
  ERROR: -2,
}

const ViewGame = ({ user, gameId }: ServerSideProps) => {
  const t = useTranslation()

  const [gameGrid, setGameGrid] = React.useState<GridCell[][]>(getInitialGrid(15))
  const [currentPlayerDirection, setCurrentPlayerDirection] = React.useState<Direction>(
    Direction.DOWN
  )
  const [playerLocation, setPlayerLocation] = React.useState({ row: 1, col: 1 })
  const [result, setResult] = React.useState(ResultType.UNSET)
  const cellSize = 25

  // Changes the state of the currentPlayerDirection
  const turnLeft = () => {
    switch (currentPlayerDirection) {
      case Direction.UP:
        setCurrentPlayerDirection(Direction.LEFT)
        break
      case Direction.DOWN:
        setCurrentPlayerDirection(Direction.RIGHT)
        break
      case Direction.LEFT:
        setCurrentPlayerDirection(Direction.DOWN)
        break
      case Direction.RIGHT:
        setCurrentPlayerDirection(Direction.UP)
        break
    }
  }
  // Changes the state of the currentPlayerDirection
  const turnRight = () => {
    switch (currentPlayerDirection) {
      case Direction.UP:
        setCurrentPlayerDirection(Direction.RIGHT)
        break
      case Direction.DOWN:
        setCurrentPlayerDirection(Direction.LEFT)
        break
      case Direction.LEFT:
        setCurrentPlayerDirection(Direction.UP)
        break
      case Direction.RIGHT:
        setCurrentPlayerDirection(Direction.DOWN)
        break
    }
  }
  // Changes the state of the playerLocation and gameGrid
  const moveForward = () => {
    const newGrid = [...gameGrid]
    const { row, col } = playerLocation
    switch (currentPlayerDirection) {
      case Direction.UP:
        if (row - 1 >= 0 && !newGrid[row - 1][col].isWall) {
          newGrid[row][col].isPlayer = false
          newGrid[row - 1][col].isPlayer = true
          setPlayerLocation({ row: row - 1, col })
        }
        break
      case Direction.DOWN:
        if (row + 1 < gameGrid.length && !newGrid[row + 1][col].isWall) {
          newGrid[row][col].isPlayer = false
          newGrid[row + 1][col].isPlayer = true
          setPlayerLocation({ row: row + 1, col })
        }
        break
      case Direction.LEFT:
        if (col - 1 >= 0 && !newGrid[row][col - 1].isWall) {
          newGrid[row][col].isPlayer = false
          newGrid[row][col - 1].isPlayer = true
          setPlayerLocation({ row, col: col - 1 })
        }
        break
      case Direction.RIGHT:
        if (col + 1 < gameGrid.length && !newGrid[row][col + 1].isWall) {
          newGrid[row][col].isPlayer = false
          newGrid[row][col + 1].isPlayer = true
          setPlayerLocation({ row, col: col + 1 })
        }
        break
    }
    setGameGrid(newGrid)
  }
  // Returns true if there is a path ahead of the player (i.e. the player can move forward)
  const isPathAhead = () => {
    const { row, col } = playerLocation
    switch (currentPlayerDirection) {
      case Direction.UP:
        if (row - 1 >= 0 && !gameGrid[row - 1][col].isWall) {
          return true
        }
        break
      case Direction.DOWN:
        if (row + 1 < gameGrid.length && !gameGrid[row + 1][col].isWall) {
          return true
        }
        break
      case Direction.LEFT:
        if (col - 1 >= 0 && !gameGrid[row][col - 1].isWall) {
          return true
        }
        break
      case Direction.RIGHT:
        if (col + 1 < gameGrid.length && !gameGrid[row][col + 1].isWall) {
          return true
        }
        break
    }
    return false
  }
  // Returns true if there is a path to the left of the player (i.e. the player can turn left)
  const isPathLeft = () => {
    const { row, col } = playerLocation
    switch (currentPlayerDirection) {
      case Direction.UP:
        if (col - 1 >= 0 && !gameGrid[row][col - 1].isWall) {
          return true
        }
        break
      case Direction.DOWN:
        if (col + 1 < gameGrid.length && !gameGrid[row][col + 1].isWall) {
          return true
        }
        break
      case Direction.LEFT:
        if (row + 1 < gameGrid.length && !gameGrid[row + 1][col].isWall) {
          return true
        }
        break
      case Direction.RIGHT:
        if (row - 1 >= 0 && !gameGrid[row - 1][col].isWall) {
          return true
        }
        break
    }
    return false
  }
  // Returns true if there is a path to the right of the player (i.e. the player can turn right)
  const isPathRight = () => {
    const { row, col } = playerLocation
    switch (currentPlayerDirection) {
      case Direction.UP:
        if (col + 1 < gameGrid.length && !gameGrid[row][col + 1].isWall) {
          return true
        }
        break
      case Direction.DOWN:
        if (col - 1 >= 0 && !gameGrid[row][col - 1].isWall) {
          return true
        }
        break
      case Direction.LEFT:
        if (row - 1 >= 0 && !gameGrid[row - 1][col].isWall) {
          return true
        }
        break
      case Direction.RIGHT:
        if (row + 1 < gameGrid.length && !gameGrid[row + 1][col].isWall) {
          return true
        }
        break
    }
    return false
  }
  // Returns true if the player is on the goal
  const isOnGoal = () => {
    const { row, col } = playerLocation
    return gameGrid[row][col].isGoal
  }

  const tester = () => {
    moveForward()
  }

  const parentRef = React.useRef<any>()

  const onChangeListener = (
    e: Blockly.Events.Abstract,
    workspaceRefrence: Blockly.WorkspaceSvg
  ) => {
    // Don't run the code when the workspace finishes loading; we're
    // already running it once when the application starts.
    // Don't run the code during drags; we might have invalid state.
    if (
      e.isUiEvent ||
      e.type == Blockly.Events.FINISHED_LOADING ||
      workspaceRefrence.isDragging()
    ) {
      console.log('Event is UI event or finished loading or workspace is dragging')
      return
    }
    if (e.type == Blockly.Events.BLOCK_CREATE) {
      console.log('Event is block create')
      return
    }
    if (e.type == Blockly.Events.BLOCK_DELETE) {
      console.log('Event is block delete')
      return
    }
    if (e.type == Blockly.Events.BLOCK_CHANGE) {
      console.log('Event is block change')
      return
    }
    if (e.type == Blockly.Events.BLOCK_MOVE) {
      console.log('Event is block move')
      return
    }
    if (e.type == Blockly.Events.BLOCK_DRAG) {
      console.log('Event is block drag')
      return
    }
    if (e.type == Blockly.Events.BUBBLE_OPEN) {
      console.log('Event is bubble open')
      return
    }
    if (e.type == Blockly.Events.TOOLBOX_ITEM_SELECT) {
      console.log('Event is toolbox item select')
      return
    }
    if (e.type == Blockly.Events.VAR_CREATE) {
      console.log('Event is var create')
      return
    }

    // generateCode()
  }
  const blocklyGameOptions: Blockly.BlocklyOptions = {
    toolbox: gameToolBox,
    theme: Blockly.Themes.Zelos,
    grid: {
      spacing: 20,
      colour: '#DBE4EE',
      length: 3,
      snap: true,
    },
    css: true,
    move: {
      scrollbars: true,
      drag: true,
      wheel: true,
    },
    comments: false,
    maxBlocks: 10,
    trashcan: true,
    modalInputs: true,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2,
    },
  }
  const getCodeFromBlockly = () => {
    if (parentRef.current) {
      return parentRef.current.generateCode()
    }
    return null
  }
  const runProgram = () => {
    const code = getCodeFromBlockly()
    if (!code) {
      return
    }
    if (result === ResultType.SUCCESS) {
      return
    }

    console.log(code)

    const parsedCode = parseCode(code)
    console.log(parsedCode)
  }

  return (
    <>
      <Head>
        <title>NinjaCo | Play Game</title>
        <meta name="description" content="Play games in ninjaco now!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="relative h-screen w-full flex flex-col">
        <UserMenu isOnCoursePage={false} isOnGamesPage={true} user={user} />
        <div className="grid md:hidden items-center h-screen grid-cols-1 justify-items-center py-24 px-8 relative flex-auto">
          <h1 className="self-end divide-x-2 divide-brand text-sm ">
            <span className="px-2 font-bold">{t.Creator.games.createGame.mobileError}</span>
          </h1>
          <Link href="/app/games" className="self-start my-4 text-sm btn btn-brand">
            {t.Creator.games.createGame.goBack}
          </Link>
        </div>
        <div className="hidden md:flex w-full h-full flex-col relative">
          <BlocklyBoard
            ref={parentRef}
            blocklyOptions={blocklyGameOptions}
            codeGenerator={gameGenerator}
            blocksDefinitions={gameBlocks}
            onChangeListener={onChangeListener}
            storageKey={`game-${gameId}-${user._id}}`}
          ></BlocklyBoard>
          <div
            className="grid gap-px transition-all w-fit h-fit absolute right-20 top-16"
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
                    onClick={() => {}}
                    currentPlayerDirection={currentPlayerDirection}
                  />
                )
              })
            })}
          </div>
          <button
            onClick={runProgram}
            className="btn w-fit bg-brand py-3 text-white hover:bg-brand-500 absolute bottom-14 left-4 z-50"
          >
            Run Program
          </button>
          <button
            onClick={tester}
            className="btn w-fit bg-brand py-3 text-white hover:bg-brand-500 absolute bottom-32 left-4 z-50"
          >
            test
          </button>
        </div>
      </main>
    </>
  )
}

export default ViewGame

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, req, res } = context
  const { id } = query

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
      gameId: id,
    },
  }
}
