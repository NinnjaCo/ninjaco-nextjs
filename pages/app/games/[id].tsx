import { AdminAlertDialog } from '@/components/admin/dialog'
import { BlockCode, BlockType, ConditionType, parseCode, prettifyCode } from '@/blockly/parser/game'
import { Direction, GridCell } from '@/components/user/game/gridCell'
import { Game } from '@/models/crud/game.model'
import { GameEnrollmentAPI } from '@/utils/api/game-enrollment/game-enrollment.api'
import { GetServerSideProps } from 'next'
import { GridCellComponent } from '@/components/user/game/gridCell'
import { Queue } from 'datastructure/queue'
import { User } from '@/models/crud'
import { UserPlayGame } from '@/models/crud/game-enrollment.model'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { gameBlocks } from '@/blockly/blocks/game'
import { gameGenerator } from '@/blockly/generetors/game'
import { gameToolBox } from '@/blockly/toolbox/game'
import { getServerSession } from 'next-auth'
import { useImmer } from 'use-immer'
import { useRouter } from 'next/router'
import Alert from '@/components/shared/alert'
import Blockly from 'blockly'
import BlocklyBoard from '@/components/blockly/blockly'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import UserMenu from '@/components/user/userMenu'
import party from 'party-js'
import useTranslation from '@/hooks/useTranslation'

enum GameType {
  enrollment = 'enrollment',
  game = 'game',
}

const getTypeOfGame = (game: UserPlayGame | Game): GameType => {
  if ((game as UserPlayGame).game) {
    return GameType.enrollment
  } else {
    return GameType.game
  }
}

interface ServerSideProps {
  user: User
  game: UserPlayGame
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
/**
 * Outcomes of running the user program.
 */
const ResultType = {
  UNSET: 0,
  SUCCESS: 1,
  RUNNING: 2,
}

const ViewGame = ({ user, game }: ServerSideProps) => {
  const t = useTranslation()
  const router = useRouter()
  const parentRef = React.useRef<any>()

  const cellSize = 25
  const maxNumberOfBlocks = game.game.numOfBlocks

  // use useImmer instead of useState to avoid unnecessary re-renders
  const [gameState, setGameState] = useImmer({
    gameGrid: constrcutGridFrom(
      game.game.sizeOfGrid,
      game.game.playerLocation,
      game.game.goalLocation,
      game.game.wallsLocations
    ),
    currentPlayerDirection: game.game.playerDirection as Direction,
    playerLocation: { row: game.game.playerLocation[0], col: game.game.playerLocation[1] },
    result: ResultType.UNSET,
  })

  const [numberOfBlocksLeft, setNumberOfBlocksLeft] = React.useState<number | undefined>(
    maxNumberOfBlocks
  )
  const [alertData, setAlertData] = React.useState<{
    message: string
    variant: 'error' | 'success' | 'info' | 'warning'
    open: boolean
    close: () => void
  }>({
    message: 'Place blocks and run the program to start the game',
    variant: 'info',
    open: true,
    close: () => setAlertData({ ...alertData, open: false }),
  })
  const [adminDialogOpen, setAdminDialogOpen] = React.useState(false)
  const [currentCode, setCurrentCode] = React.useState<string>('')
  const actionsQueue: Queue<() => void> = new Queue()

  // Changes the state of the currentPlayerDirection
  const turnLeft = (carryCheckFunction?: (gameState) => boolean) => {
    setGameState((draft) => {
      if (carryCheckFunction && !carryCheckFunction(draft)) {
        return
      }
      switch (draft.currentPlayerDirection) {
        case Direction.UP:
          draft.currentPlayerDirection = Direction.LEFT
          break
        case Direction.DOWN:
          draft.currentPlayerDirection = Direction.RIGHT
          break
        case Direction.LEFT:
          draft.currentPlayerDirection = Direction.DOWN
          break
        case Direction.RIGHT:
          draft.currentPlayerDirection = Direction.UP
          break
      }
    })
  }
  // Changes the state of the currentPlayerDirection
  const turnRight = (carryCheckFunction?: (gameState) => boolean) => {
    setGameState((draft) => {
      if (carryCheckFunction && !carryCheckFunction(draft)) {
        return
      }

      switch (draft.currentPlayerDirection) {
        case Direction.UP:
          draft.currentPlayerDirection = Direction.RIGHT
          break
        case Direction.DOWN:
          draft.currentPlayerDirection = Direction.LEFT
          break
        case Direction.LEFT:
          draft.currentPlayerDirection = Direction.UP
          break
        case Direction.RIGHT:
          draft.currentPlayerDirection = Direction.DOWN
          break
      }
    })
  }
  // Changes the state of the playerLocation and gameGrid
  const moveForward = (carryCheckFunction?: (gameState) => boolean) => {
    setGameState((draft) => {
      // If the carryCheckFunction is defined and returns false, then do not move forward
      if (carryCheckFunction && !carryCheckFunction(draft)) {
        return
      }
      // If there is no path ahead of the player, then show an alert and do not move forward
      if (!isPathAhead(draft)) {
        onHitWall()
        return
      }

      const { row, col } = draft.playerLocation
      switch (draft.currentPlayerDirection) {
        case Direction.UP:
          if (row - 1 >= 0) {
            draft.playerLocation.row = row - 1
          }
          break
        case Direction.DOWN:
          if (row + 1 < draft.gameGrid.length) {
            draft.playerLocation.row = row + 1
          }
          break
        case Direction.LEFT:
          if (col - 1 >= 0) {
            draft.playerLocation.col = col - 1
          }
          break
        case Direction.RIGHT:
          if (col + 1 < draft.gameGrid.length) {
            draft.playerLocation.col = col + 1
          }
          break
      }
      draft.gameGrid[row][col].isPlayer = false
      draft.gameGrid[draft.playerLocation.row][draft.playerLocation.col].isPlayer = true

      // If the player has reached the goal, then set the result to success
      if (isOnGoal(draft)) {
        draft.result = ResultType.SUCCESS
        onHitGoal()
        // Clear the actionsQueue to stop the game
        actionsQueue.clear()
      }
    })
  }
  // Returns true if there is a path ahead of the player (i.e. the player can move forward)
  const isPathAhead = (currentGameState) => {
    const { row, col } = currentGameState.playerLocation
    switch (currentGameState.currentPlayerDirection) {
      case Direction.UP:
        if (row - 1 >= 0 && !currentGameState.gameGrid[row - 1][col].isWall) {
          return true
        }
        break
      case Direction.DOWN:
        if (
          row + 1 < currentGameState.gameGrid.length &&
          !currentGameState.gameGrid[row + 1][col].isWall
        ) {
          return true
        }
        break
      case Direction.LEFT:
        if (col - 1 >= 0 && !currentGameState.gameGrid[row][col - 1].isWall) {
          return true
        }
        break
      case Direction.RIGHT:
        if (
          col + 1 < currentGameState.gameGrid.length &&
          !currentGameState.gameGrid[row][col + 1].isWall
        ) {
          return true
        }
        break
    }
    return false
  }
  // Returns true if there is a path to the left of the player (i.e. the player can turn left)
  const isPathLeft = (currentGameState) => {
    const { row, col } = currentGameState.playerLocation
    switch (currentGameState.currentPlayerDirection) {
      case Direction.UP:
        if (col - 1 >= 0 && !currentGameState.gameGrid[row][col - 1].isWall) {
          return true
        }
        break
      case Direction.DOWN:
        if (
          col + 1 < currentGameState.gameGrid.length &&
          !currentGameState.gameGrid[row][col + 1].isWall
        ) {
          return true
        }
        break
      case Direction.LEFT:
        if (
          row + 1 < currentGameState.gameGrid.length &&
          !currentGameState.gameGrid[row + 1][col].isWall
        ) {
          return true
        }
        break
      case Direction.RIGHT:
        if (row - 1 >= 0 && !currentGameState.gameGrid[row - 1][col].isWall) {
          return true
        }
        break
    }
    return false
  }
  // Returns true if there is a path to the right of the player (i.e. the player can turn right)
  const isPathRight = (currentGameState) => {
    const { row, col } = currentGameState.playerLocation
    switch (currentGameState.currentPlayerDirection) {
      case Direction.UP:
        if (
          col + 1 < currentGameState.gameGrid.length &&
          !currentGameState.gameGrid[row][col + 1].isWall
        ) {
          return true
        }
        break
      case Direction.DOWN:
        if (col - 1 >= 0 && !currentGameState.gameGrid[row][col - 1].isWall) {
          return true
        }
        break
      case Direction.LEFT:
        if (row - 1 >= 0 && !currentGameState.gameGrid[row - 1][col].isWall) {
          return true
        }
        break
      case Direction.RIGHT:
        if (
          row + 1 < currentGameState.gameGrid.length &&
          !currentGameState.gameGrid[row + 1][col].isWall
        ) {
          return true
        }
        break
    }
    return false
  }
  // Returns true if the player is on the goal
  const isOnGoal = (currentGameState) => {
    const { row, col } = currentGameState.playerLocation
    return currentGameState.gameGrid[row][col].isGoal
  }
  // Change listener passed to Blockly compoenent as a callback
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

    setAlertData({
      ...alertData,
      open: false,
    })

    // If the game already have a numberOfBlocksLeft, then update it
    if (numberOfBlocksLeft !== undefined)
      setNumberOfBlocksLeft(workspaceRefrence.remainingCapacity())
    console.log('Number of blocks left: ' + workspaceRefrence.remainingCapacity())
    if (e.type == Blockly.Events.BLOCK_CREATE) {
      console.log('Event is block create')
      console.log(e)
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
      const castedEvent = e as Blockly.Events.BlockMove
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
    maxBlocks: maxNumberOfBlocks,
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
  const highlightBlock = (blockId: string | undefined) => {
    if (parentRef.current) {
      parentRef.current.highlightBlockById(blockId)
    }
  }
  const clearHighlightedBlock = () => {
    if (parentRef.current) {
      parentRef.current.clearHighlightedBlock()
    }
  }
  const executeCode = (
    code: BlockCode[] | undefined,
    carryCheckFunction?: (gameState) => boolean
  ) => {
    if (!code || code.length === 0) {
      return
    }

    const block = code[0]
    const remainingCode = code.slice(1)
    // Execute block
    switch (block.type) {
      case BlockType.MOVE_FORWARD:
        actionsQueue.enqueue(() => {
          highlightBlock(block.id)
          moveForward(carryCheckFunction)
        })

        break
      case BlockType.TURN_LEFT:
        actionsQueue.enqueue(() => {
          highlightBlock(block.id)
          turnLeft(carryCheckFunction)
        })
        break
      case BlockType.TURN_RIGHT:
        actionsQueue.enqueue(() => {
          highlightBlock(block.id)
          turnRight(carryCheckFunction)
        })
        break
      case BlockType.IF:
        actionsQueue.enqueue(() => {
          highlightBlock(block.id)
        })
        switch (block.condition) {
          case ConditionType.IS_PATH_FORWARD:
            executeCode(
              block.body,
              carryCheckFunction
                ? (aGameState) => carryCheckFunction(aGameState) && isPathAhead(aGameState)
                : isPathAhead
            )
            break
          case ConditionType.IS_PATH_LEFT:
            executeCode(
              block.body,
              carryCheckFunction
                ? (aGameState) => carryCheckFunction(aGameState) && isPathLeft(aGameState)
                : isPathLeft
            )
            break
          case ConditionType.IS_PATH_RIGHT:
            executeCode(
              block.body,
              carryCheckFunction
                ? (aGameState) => carryCheckFunction(aGameState) && isPathRight(aGameState)
                : isPathRight
            )
            break
        }
        break
      case BlockType.ELSE:
        actionsQueue.enqueue(() => {
          highlightBlock(block.id)
        })
        executeCode(block.body, carryCheckFunction)
        break
      case BlockType.FOR:
        if (!block.loopCount) {
          return
        }
        if (block.loopCount > 100) {
          setAlertData({
            ...alertData,
            message: 'You have a loop with more than 100 iterations',
            variant: 'warning',
            open: true,
          })
          return
        }

        // each iteration of the loop should wait for the previous iteration WAIT_TIME
        for (let i = 0; i < block.loopCount; i++) {
          executeCode(block.body, carryCheckFunction)
        }

        break
    }
    executeCode(remainingCode, carryCheckFunction)
  }
  const runQueueActionsWithDelay = (delay: number) => {
    if (actionsQueue.isEmpty()) {
      return
    }
    const action = actionsQueue.dequeue()
    if (action) {
      action()
    }
    setTimeout(() => {
      runQueueActionsWithDelay(delay)
    }, delay)
  }
  const runProgram = () => {
    setAlertData({
      ...alertData,
      open: false,
    })

    const code = getCodeFromBlockly()
    if (!code) {
      return
    }
    setCurrentCode(code)

    console.log(code)
    const parsedCode: BlockCode[] = parseCode(code)
    console.log('parsedCode', parsedCode)

    // Set the game state to running
    actionsQueue.enqueue(() => {
      setGameState((prevState) => {
        return { ...prevState, result: ResultType.RUNNING }
      })
    })

    // traverse the code and execute the blocks in order (depth first)
    executeCode(parsedCode)

    // After the code is executed, if we reached the end of the queue then the goal was never reached by a moveForward
    // thus, setAlertData that you didnt reach the goal
    actionsQueue.enqueue(() => {
      setGameState((prevState) => {
        return { ...prevState, result: ResultType.UNSET }
      })
      setAlertData({
        ...alertData,
        message: 'Ugh ☹️ You did not reach the goal, try again!',
        variant: 'error',
        open: true,
      })
    })

    runQueueActionsWithDelay(1000)
    setTimeout(() => {
      clearHighlightedBlock()
      resetGameState()
    }, 1000 * (actionsQueue.size() + 1))
  }

  const resetGameState = () => {
    setGameState({
      gameGrid: constrcutGridFrom(
        game.game.sizeOfGrid,
        game.game.playerLocation,
        game.game.goalLocation,
        game.game.wallsLocations
      ),
      currentPlayerDirection: game.game.playerDirection as Direction,
      playerLocation: { row: game.game.playerLocation[0], col: game.game.playerLocation[1] },
      result: ResultType.UNSET,
    })
  }

  const onHitWall = (ExtraInfo?: string) => {
    setAlertData({
      ...alertData,
      message: 'You hit a wall! ' + (ExtraInfo ?? ''),
      variant: 'warning',
      open: true,
    })
  }

  const onHitGoal = (ExtraInfo?: string) => {
    party.confetti(party.Rect.fromScreen(), {
      count: 200,
      shapes: ['roundedRectangle', 'star', 'circle', 'rectangle'],
      speed: 10,
      spread: 30,
    })
    setAdminDialogOpen(true)
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
        <AdminAlertDialog
          open={adminDialogOpen}
          title="Congratulations, You won!"
          confirm={() => {
            router.reload()
          }}
          close={() => {
            setAdminDialogOpen(false)
          }}
          confirmButtonText="Restart Game"
          confirmButtonClassName="bg-brand text-white hidden"
          backButtonText="Go back to Games"
          backButtonClassName="bg-brand  text-white"
        >
          <p className="text-brand text-sm">Here is the code you wrote:</p>
          <pre className="text-xs text-brand-400 border-2 p-2">{prettifyCode(currentCode)}</pre>
          <p className="text-brand text-sm">Do you want to go to the next game?</p>
        </AdminAlertDialog>

        <div className="grid md:hidden items-center h-screen grid-cols-1 justify-items-center py-24 px-8 relative flex-auto">
          <h1 className="self-end divide-x-2 divide-brand text-sm ">
            <span className="px-2 font-bold">{t.Creator.games.createGame.mobileError}</span>
          </h1>
          <Link href="/app/games" className="self-start my-4 text-sm btn btn-brand">
            {t.Creator.games.createGame.goBack}
          </Link>
        </div>
        <div className="hidden md:flex w-full h-full flex-col relative">
          <div className="absolute bottom-12 right-12 z-20">
            <Alert
              variant={alertData.variant}
              message={alertData.message}
              open={alertData.open}
              close={alertData.close}
            />
          </div>
          <BlocklyBoard
            ref={parentRef}
            blocklyOptions={blocklyGameOptions}
            codeGenerator={gameGenerator}
            blocksDefinitions={gameBlocks}
            onChangeListener={onChangeListener}
            storageKey={`game-${game.game._id}-${user._id}}`}
          ></BlocklyBoard>
          <div
            className="grid gap-px transition-all w-fit h-fit absolute right-20 top-16"
            style={{
              gridTemplateColumns: `repeat(${game.game.sizeOfGrid}, minmax(0, 1fr))`,
            }}
          >
            {gameState.gameGrid.map((row, rowIndex) => {
              return row.map((cell, colIndex) => {
                return (
                  <GridCellComponent
                    key={`${rowIndex}-${colIndex}`}
                    cell={cell}
                    size={cellSize}
                    onClick={() => {}}
                    currentPlayerDirection={gameState.currentPlayerDirection}
                  />
                )
              })
            })}
          </div>
          <div className="absolute bottom-32 left-4 z-50 text-xs font-semibold text-brand-700">
            {game.game.title}
          </div>
          {numberOfBlocksLeft !== undefined && numberOfBlocksLeft >= 0 ? (
            <div className="absolute bottom-48 left-4 z-50 text-xs text-brand-700">
              # Blocks Left: {numberOfBlocksLeft}
            </div>
          ) : null}
          <button
            onClick={runProgram}
            className="btn w-fit bg-brand py-3 text-white hover:bg-brand-500 absolute bottom-14 left-4 z-10"
          >
            Run Program
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

  const gameRes = await new GameEnrollmentAPI(session).findByGameId(id as string, session.user._id)
  if (!gameRes || !gameRes.payload) {
    return {
      redirect: {
        destination: '/app/games',
        permanent: false,
      },
    }
  }

  const gameType = getTypeOfGame(gameRes.payload)

  // If the game type is normal game and not enrollment, then this is the first time the user is playing the game
  // thus create a new enrollment
  if (gameType === GameType.game) {
    const newEnrollmentRes = await new GameEnrollmentAPI(session).create({
      gameId: id as string,
      userId: session.user._id,
    })

    if (!newEnrollmentRes || !newEnrollmentRes.payload) {
      return {
        redirect: {
          destination: '/app/games',
          permanent: false,
        },
      }
    }

    return {
      props: {
        user: session.user,
        game: newEnrollmentRes.payload,
      },
    }
  }

  // If we are here, then the game type is enrollment, so we can just return the enrollment
  return {
    props: {
      user: session.user,
      game: gameRes.payload,
    },
  }
}
