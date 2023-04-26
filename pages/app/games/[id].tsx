import { AdminAlertDialog } from '@/components/admin/dialog'
import { BlockCode, BlockType, ConditionType, parseCode, prettifyCode } from '@/blockly/parser/game'
import { Direction, GridCell } from '@/components/user/game/gridCell'
import { Game } from '@/models/crud/game.model'
import { GameEnrollmentAPI } from '@/utils/api/game-enrollment/game-enrollment.api'
import { GetServerSideProps } from 'next'
import { GridCellComponent } from '@/components/user/game/gridCell'
import { Queue } from 'datastructure/queue'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user/user.api'
import { UserPlayGame } from '@/models/crud/game-enrollment.model'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { gameBlocks } from '@/blockly/blocks/game'
import { gameGenerator } from '@/blockly/generetors/game'
import { gameToolBox } from '@/blockly/toolbox/game'
import { getLevelFromPoints } from '@/utils/shared'
import { getServerSession } from 'next-auth'
import { useImmer } from 'use-immer'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
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
  const { data: session } = useSession()

  const parentRef = React.useRef<any>()

  const cellSize = 25
  const maxNumberOfBlocks = game.game.numOfBlocks

  const [runButtonDisabled, setRunButtonDisabled] = React.useState(false)
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
    message: t.User.game.placeBlocks as string,
    variant: 'info',
    open: true,
    close: () => setAlertData({ ...alertData, open: false }),
  })
  const [adminDialogOpen, setAdminDialogOpen] = React.useState(false)
  const [currentCode, setCurrentCode] = React.useState<string>('')
  const actionsQueue: Queue<() => void> = new Queue()

  // At max it is 1000 and at min it is 300, and linearly proportional to the size of the grid, the bigger the faster
  const waitTimeBetweenActions = 500 - (game.game.sizeOfGrid - 5) * 25

  // Changes the state of the currentPlayerDirection
  const turnLeft = (carryCheckFunction?: (gameState) => boolean) => {
    setGameState((draft) => {
      if (carryCheckFunction && !carryCheckFunction(draft)) {
        return
      }
      const { row, col } = draft.playerLocation
      console.log('Turning left:', draft.currentPlayerDirection, row, col)
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
        const { row, col } = draft.playerLocation
        console.log('Not turning right', draft.currentPlayerDirection, row, col)
        return
      }
      const { row, col } = draft.playerLocation
      console.log('Turning right:', draft.currentPlayerDirection, row, col)

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
          console.log(
            'Player location:',
            row,
            col,
            'isPathAhead:',
            true,
            'Direction:',
            Direction.UP
          )
          return true
        } else {
          console.log(
            'Player location:',
            row,
            col,
            'isPathAhead:',
            false,
            'Direction:',
            Direction.UP
          )
        }
        break
      case Direction.DOWN:
        if (
          row + 1 < currentGameState.gameGrid.length &&
          !currentGameState.gameGrid[row + 1][col].isWall
        ) {
          console.log(
            'Player location:',
            row,
            col,
            'isPathAhead:',
            true,
            'Direction:',
            Direction.DOWN
          )
          return true
        } else {
          console.log(
            'Player location:',
            row,
            col,
            'isPathAhead:',
            false,
            'Direction:',
            Direction.DOWN
          )
        }
        break
      case Direction.LEFT:
        if (col - 1 >= 0 && !currentGameState.gameGrid[row][col - 1].isWall) {
          console.log(
            'Player location:',
            row,
            col,
            'isPathAhead:',
            true,
            'Direction:',
            Direction.LEFT
          )
          return true
        } else {
          console.log(
            'Player location:',
            row,
            col,
            'isPathAhead:',
            false,
            'Direction:',
            Direction.LEFT
          )
        }
        break
      case Direction.RIGHT:
        if (
          col + 1 < currentGameState.gameGrid.length &&
          !currentGameState.gameGrid[row][col + 1].isWall
        ) {
          console.log('Player location:', row, col, 'isPathAhead:', true, 'Direction.RIGHT')
          return true
        } else {
          console.log('Player location:', row, col, 'isPathAhead:', false, 'Direction.RIGHT')
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
          console.log('Player location:', row, col, 'isPathLeft:', true, 'Direction.UP')
          return true
        } else {
          console.log('Player location:', row, col, 'isPathLeft:', false, 'Direction.UP')
        }
        break
      case Direction.DOWN:
        if (
          col + 1 < currentGameState.gameGrid.length &&
          !currentGameState.gameGrid[row][col + 1].isWall
        ) {
          console.log('Player location:', row, col, 'isPathLeft:', true, 'Direction.DOWN')
          return true
        } else {
          console.log('Player location:', row, col, 'isPathLeft:', false, 'Direction.DOWN')
        }
        break
      case Direction.LEFT:
        if (
          row + 1 < currentGameState.gameGrid.length &&
          !currentGameState.gameGrid[row + 1][col].isWall
        ) {
          console.log('Player location:', row, col, 'isPathLeft:', true, 'Direction.LEFT')
          return true
        } else {
          console.log('Player location:', row, col, 'isPathLeft:', false, 'Direction.LEFT')
        }
        break
      case Direction.RIGHT:
        if (row - 1 >= 0 && !currentGameState.gameGrid[row - 1][col].isWall) {
          console.log('Player location:', row, col, 'isPathLeft:', true, 'Direction.RIGHT')
          return true
        } else {
          console.log('Player location:', row, col, 'isPathLeft:', false, 'Direction.RIGHT')
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
      // Event is UI event or finished loading or workspace is dragging
      return
    }

    setAlertData({
      ...alertData,
      open: false,
    })

    // If the game already have a numberOfBlocksLeft, then update it
    if (numberOfBlocksLeft !== undefined)
      setNumberOfBlocksLeft(workspaceRefrence.remainingCapacity())
    if (e.type == Blockly.Events.BLOCK_CREATE) {
      // Event is block create
      return
    }
    if (e.type == Blockly.Events.BLOCK_DELETE) {
      // Event is block delete
      return
    }
    if (e.type == Blockly.Events.BLOCK_CHANGE) {
      // Event is block change
      return
    }
    if (e.type == Blockly.Events.BLOCK_MOVE) {
      // Event is block move
      return
    }
    if (e.type == Blockly.Events.BLOCK_DRAG) {
      // Event is block drag
      return
    }
    if (e.type == Blockly.Events.BUBBLE_OPEN) {
      // Event is bubble open
      return
    }
    if (e.type == Blockly.Events.TOOLBOX_ITEM_SELECT) {
      // Event is toolbox item select
      return
    }
    if (e.type == Blockly.Events.VAR_CREATE) {
      // Event is var create
      return
    }
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
    executingIndex: number,
    carryCheckFunction?: (gameState) => boolean
  ) => {
    if (!code || code.length === 0 || executingIndex >= code.length) {
      return
    }

    const block = code[executingIndex]
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
            // check if there is a next block and of type else
            if (
              executingIndex + 1 < code.length &&
              code[executingIndex + 1].type === BlockType.ELSE
            ) {
              executeCode(
                code[executingIndex + 1].body,
                0,
                carryCheckFunction
                  ? (aGameState) => carryCheckFunction(aGameState) && !isPathAhead(aGameState)
                  : (aGameState) => !isPathAhead(aGameState)
              )
            }
            executeCode(
              block.body,
              0,
              carryCheckFunction
                ? (aGameState) => carryCheckFunction(aGameState) && isPathAhead(aGameState)
                : (aGameState) => isPathAhead(aGameState)
            )
            break
          case ConditionType.IS_PATH_LEFT:
            // check if there is a next block and of type else
            if (
              executingIndex + 1 < code.length &&
              code[executingIndex + 1].type === BlockType.ELSE
            ) {
              executeCode(
                code[executingIndex + 1].body,
                0,
                carryCheckFunction
                  ? (aGameState) => carryCheckFunction(aGameState) && !isPathLeft(aGameState)
                  : (aGameState) => !isPathLeft(aGameState)
              )
            }
            executeCode(
              block.body,
              0,
              carryCheckFunction
                ? (aGameState) => carryCheckFunction(aGameState) && isPathLeft(aGameState)
                : (aGameState) => isPathLeft(aGameState)
            )
            break
          case ConditionType.IS_PATH_RIGHT:
            // check if there is a next block and of type else
            if (
              executingIndex + 1 < code.length &&
              code[executingIndex + 1].type === BlockType.ELSE
            ) {
              executeCode(
                code[executingIndex + 1].body,
                0,
                carryCheckFunction
                  ? (aGameState) => carryCheckFunction(aGameState) && !isPathRight(aGameState)
                  : (aGameState) => !isPathRight(aGameState)
              )
            }
            executeCode(
              block.body,
              0,
              carryCheckFunction
                ? (aGameState) => carryCheckFunction(aGameState) && isPathRight(aGameState)
                : (aGameState) => isPathRight(aGameState)
            )
            break
        }
        break
      case BlockType.ELSE:
        // the else block is already handled in the IF block automatically
        break
      case BlockType.FOR:
        if (!block.loopCount) {
          return
        }
        if (block.loopCount > 100) {
          setAlertData({
            ...alertData,
            message: t.User.game.loop as string,
            variant: 'warning',
            open: true,
          })
          return
        }

        // each iteration of the loop should wait for the previous iteration WAIT_TIME
        for (let i = 0; i < block.loopCount; i++) {
          executeCode(block.body, 0, carryCheckFunction)
        }

        break
      case BlockType.WHILE:
        // limit the number of iterations to 50, since the game is not designed to handle infinite loops
        for (let i = 0; i < 100; i++) {
          executeCode(block.body, 0, carryCheckFunction)
        }
        break
    }
    executeCode(code, executingIndex + 1, carryCheckFunction)
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
    actionsQueue.clear()

    const code = getCodeFromBlockly()
    if (!code) {
      return
    }
    setCurrentCode(code)

    const parsedCode: BlockCode[] = parseCode(code)

    // traverse the code and execute the blocks in order (depth first)
    executeCode(parsedCode, 0)

    // After the code is executed, if we reached the end of the queue then the goal was never reached by a moveForward
    // thus, setAlertData that you didnt reach the goal
    actionsQueue.enqueue(() => {
      setGameState((prevState) => {
        return { ...prevState, result: ResultType.UNSET }
      })
      setAlertData({
        ...alertData,
        message: t.User.game.didNotReachGoal as string,
        variant: 'error',
        open: true,
      })
      setRunButtonDisabled(false)
    })

    runQueueActionsWithDelay(waitTimeBetweenActions)
    setTimeout(() => {
      clearHighlightedBlock()
      resetGameState()
    }, waitTimeBetweenActions * (actionsQueue.size() + 1))
  }
  const resetGameState = () => {
    actionsQueue.clear()
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
    setRunButtonDisabled(false)
  }

  const onHitWall = (ExtraInfo?: string) => {
    setAlertData({
      ...alertData,
      message: t.User.game.hitAWall + (ExtraInfo ?? ''),
      variant: 'warning',
      open: true,
    })
  }

  const onHitGoal = async (ExtraInfo?: string) => {
    party.confetti(party.Rect.fromScreen(), {
      count: 200,
      shapes: ['roundedRectangle', 'star', 'circle', 'rectangle'],
      speed: 10,
      spread: 30,
    })
    setAdminDialogOpen(true)

    // if the user already completed the game before, return
    if (game.completed) {
      return
    }

    //update user points
    const points = getLevelFromPoints(100)
    console.log('points', points)
    console.log('user points before', user.points)
    user.points += points
    console.log('user points after', user.points)
    await new UserApi(session).update(user._id, { points: user.points })
    //update userPlayGame to be completed
    await new GameEnrollmentAPI(session).update(game._id, { completed: true })
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
          title={t.User.game.congratulations as string}
          confirm={() => {
            setAdminDialogOpen(false)
            router.push('/app/games')
          }}
          close={() => {
            setAdminDialogOpen(false)
          }}
          confirmButtonText="Go Back to Games"
          confirmButtonClassName="bg-brand text-white"
          backButtonText="Go Back to Games"
          backButtonClassName="bg-brand text-brand hidden"
        >
          <p className="text-brand text-sm">{t.User.game.hereIsTheCodeYouWrote}</p>
          <pre className="text-xs text-brand-400 border-2 p-2">{prettifyCode(currentCode)}</pre>
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
          <div className="absolute top-1 right-12 z-20">
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
            onClick={() => {
              runProgram()
              setRunButtonDisabled(true)
            }}
            disabled={runButtonDisabled}
            className="btn w-fit bg-brand py-3 text-white hover:bg-brand-500 absolute bottom-14 left-4 z-10 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {t.User.game.runProgram}
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
        session,
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
