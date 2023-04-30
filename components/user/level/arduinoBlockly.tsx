import { AdminAlertDialog } from '@/components/admin/dialog'
import { AlertDialog } from '@/components/shared/alertDialog'
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  Bars3Icon,
  BoltIcon,
  ChevronLeftIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { Blockly, arduinoGenerator } from '@/blockly/generetors/arduino'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { Course } from '@/models/crud/course.model'
import { FeedbackDialog } from './feedback'
import { LevelEnrollment } from '@/models/crud/level-enrollment.model'
import { LevelEnrollmentApi } from '@/utils/api/levelEnrollment/level-enrollment.api'
import { Mission } from '@/models/crud/mission.model'
import { User } from '@/models/crud'
import { UserApi } from '@/utils/api/user'
import { arduinoToolbox } from '@/blockly/toolbox/arduino'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Alert from '@/components/shared/alert'
import BlocklyBoard from '@/components/blockly/blockly'
import Prism from 'prismjs'
import React, { useEffect } from 'react'
import clsx from 'clsx'
import useTranslation from '@/hooks/useTranslation'

require('prismjs/components/prism-c')

interface Props {
  course: Course
  mission: Mission
  level: LevelEnrollment
  user: User
}

const ArduinoBlockly = ({ level, course, mission, user }: Props) => {
  const t = useTranslation()
  const router = useRouter()
  const { data: session, update: updateSession } = useSession()

  const [openSideMenu, setOpenSideMenu] = React.useState(false)
  const [openDialogue, setOpenDialogue] = React.useState(false)
  const [arduinoCode, setArduinoCode] = React.useState('')
  const [numBlocks, setNumBlocks] = React.useState(0)
  const [showCodePreview, setShowCodePreview] = React.useState(true)
  const [arduinoIdeAlert, setArduinoIdeAlert] = React.useState(true)
  const [alertData, setAlertData] = React.useState<{
    message: string
    variant: 'error' | 'success' | 'info' | 'warning'
    open: boolean
    close: () => void
  }>({
    message: '',
    variant: 'info',
    open: false,
    close: () => setAlertData({ ...alertData, open: false }),
  })

  const parentRef = React.useRef<any>()

  const getCodeFromBlockly = () => {
    if (parentRef.current) {
      return parentRef.current.generateCode()
    }
    return null
  }

  useEffect(() => {
    const code = getCodeFromBlockly()
    if (code) {
      setArduinoCode(code)
    }
    Prism.highlightAll()
  }, [])

  useEffect(() => {
    const highlight = async () => {
      await Prism.highlightAll()
    }
    highlight()
  }, [arduinoCode, showCodePreview])

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

    const num = workspaceRefrence.getAllBlocks(false).length
    // wait for 20 seconds before updating the number of blocks
    setTimeout(() => {
      setNumBlocks(num)
    }, 200)

    const code = getCodeFromBlockly()
    if (code) {
      setArduinoCode(code)
    }

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
    toolbox: arduinoToolbox,
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
    maxBlocks: undefined,
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

  // upload the code to the arduino using the serial port
  const uploadCode = async () => {
    const code = getCodeFromBlockly()
    if (code) {
      setAlertData({
        ...alertData,
        open: true,
        message: 'Uploading code to the arduino ... Beep Boop 🤖',
        variant: 'info',
      })

      const url = 'http://127.0.0.1:8080/upload'
      const method = 'POST'

      try {
        const response = await fetch(url, {
          method,
          body: JSON.stringify({ code }),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.status === 200) {
          setAlertData({
            ...alertData,
            message: 'Code uploaded successfully 🎉',
            variant: 'success',
            open: true,
          })

          setTimeout(() => {
            setAlertData({ ...alertData, open: false })
          }, 2000)
        } else {
          let errorInfo = ''
          const status = response.status
          switch (status) {
            case 200:
              break
            case 404:
              errorInfo =
                'Cannot find the agent. Make sure that you have downloaded and started the agent'
              break
            case 400:
              errorInfo =
                'Build failed. Make sure that there are no missing connections in the blocks.'
              break
            case 500:
              errorInfo =
                'Upload failed. Make sure that you have connected the Arduino to your computer'
              break
            case 501:
              errorInfo = 'Upload failed. Make sure you have downloaded the Arduino IDE?'
              break
            default:
              errorInfo = 'Unknown error, please try again'
              break
          }
          setAlertData({
            ...alertData,
            message: errorInfo || 'Upload failed',
            variant: 'error',
            open: true,
          })
        }
      } catch (e: any) {
        setAlertData({
          ...alertData,
          message: 'Failed, make sure that the agent is running',
          variant: 'error',
          open: true,
        })
      }
    }
  }

  const downloadCode = () => {
    // download arduino code in .ino file
    const code = getCodeFromBlockly()
    const blob = new Blob([code], { type: 'text/plain' })

    const link = document.createElement('a')
    link.download = 'code.ino'
    link.href = window.URL.createObjectURL(blob)
    link.click()

    // delete the link to avoid memory leaks
    link.remove()
  }

  const resetCode = () => {
    if (parentRef.current) {
      parentRef.current.clearBlocks()
    }
  }

  const downloadAgentPrompt = () => {
    setAlertData({
      ...alertData,
      message: 'Make sure to download ARDUINO IDE v1 before using the agent',
      variant: 'warning',
      open: true,
    })

    setTimeout(() => {
      setAlertData({ ...alertData, open: false })
    }, 30000)

    const url =
      'https://github.com/NinnjaCo/ArduinoServer/releases/download/v1.0.0/NinjacoAgent.exe'
    window.open(url, '_blank')

    setArduinoIdeAlert(true)
  }

  const updateLevelStatus = async () => {
    if (level.completed) {
      router.push(`/app/${course._id}/${mission._id}`)
    }

    // update levelEnrollment to be complete
    await new LevelEnrollmentApi(course._id, mission._id, session).update(level.level._id, {
      completed: true,
    })

    //increase user points
    const oldPoints = session?.user?.points ?? 0

    // maximum 100 minimum 50 and depends on the level number
    let addedPoints = 50 + level.level.levelNumber * 15
    addedPoints = addedPoints > 100 ? 100 : addedPoints < 50 ? 50 : addedPoints
    const newPoints = oldPoints + addedPoints
    try {
      const res = await new UserApi(session).update(user._id, { points: newPoints })
      await updateSession({
        ...session,
        user: {
          ...res.payload,
        },
      })
    } catch (e) {
      console.log(e)
      setAlertData({
        ...alertData,
        message: 'Something went wrong, please try again later',
        variant: 'error',
        open: true,
      })
    }

    //  get all levels of the mission
    const levels = course.missions?.find((m) => m._id === mission._id)?.levels

    if (levels) {
      const currentLevelIndex = levels.findIndex((l) => l._id === level.level._id)
      if (currentLevelIndex < levels.length) {
        //  get the next level
        const nextLevel = levels[currentLevelIndex + 1]
        if (!nextLevel) {
          setOpenDialogue(true)
          return
        }
        //  unlock the next level
        await new LevelEnrollmentApi(course._id, mission._id, session).create({
          levelId: nextLevel._id,
          completed: false,
        })
      }
    }

    // Feedback dialogue
    setOpenDialogue(true)
  }

  return (
    <>
      <FeedbackDialog
        userId={user._id}
        courseId={course._id}
        missionId={mission._id}
        levelId={level.level._id}
        open={openDialogue}
        title="Feedback"
        close={() => {
          close()
        }}
      />
      <AdminAlertDialog
        title="Arduino IDE v1 is Required"
        open={arduinoIdeAlert}
        close={function (): void {
          setArduinoIdeAlert(false)
        }}
        confirm={function (): void {
          throw new Error('Function not implemented.')
        }}
        confirmButtonClassName="hidden"
      >
        <div>If you do not already have Arduino IDE v1, download it here: </div>
        <div className="flex w-full flex-wrap gap-4">
          <a
            className="text-brand font-bold underline"
            href="https://downloads.arduino.cc/arduino-1.8.19-windows.exe"
          >
            Windows
          </a>
          <a
            className="text-brand font-bold underline"
            href="https://downloads.arduino.cc/arduino-1.8.19-linux64.tar.xz"
          >
            Linux (64bit)
          </a>
          <a
            className="text-brand font-bold underline"
            href="https://downloads.arduino.cc/arduino-1.8.19-linux32.tar.xz"
          >
            Linux (32bit)
          </a>
          <a
            className="text-brand font-bold underline"
            href="https://downloads.arduino.cc/arduino-1.8.19-macosx.zip"
          >
            Mac OS X
          </a>
        </div>
      </AdminAlertDialog>
      <div className="w-full h-full relative overflow-hidden hidden lg:flex">
        <div className="absolute top-1 right-12 z-50">
          <Alert
            variant={alertData.variant}
            message={alertData.message}
            open={alertData.open}
            close={alertData.close}
            includeBorder={true}
          />
        </div>
        <BlocklyBoard
          ref={parentRef}
          blocklyOptions={blocklyGameOptions}
          codeGenerator={arduinoGenerator}
          onChangeListener={onChangeListener}
          storageKey={`course-${course._id}-mission-${mission._id}-level-${level._id}`}
        ></BlocklyBoard>
        <div
          className={clsx('border-l-2 border-l-brand-400 h-full flex flex-col transition-all', {
            'basis-0 w-0': !showCodePreview,
            'basis-1/2': showCodePreview,
          })}
        >
          <div className="flex w-full justify-between items-start relative h-full">
            <button
              className="absolute top-12 -left-6 bg-brand w-6 h-6 rounded-l-lg flex items-center justify-center cursor-pointer hover:bg-brand-500"
              onClick={() => {
                setShowCodePreview(!showCodePreview)
                if (parentRef.current) {
                  const workspace = parentRef.current.getWorkspace()

                  // the code preview tab takes ~200ms to hide
                  setTimeout(() => {
                    Blockly.svgResize(workspace)
                  }, 200)
                }
              }}
            >
              {showCodePreview ? (
                <ArrowRightIcon className="text-secondary w-3 h-3"></ArrowRightIcon>
              ) : (
                <ArrowLeftIcon className="text-secondary w-3 h-3"></ArrowLeftIcon>
              )}
            </button>
            {showCodePreview ? (
              <>
                <div className="group flex justify-center absolute top-1 right-2 w-full">
                  <QuestionMarkCircleIcon className="absolute top-1 right-3 w-4 h-4 text-brand-100 hover:text-brand-500 cursor-pointer z-20" />
                  <span className="absolute top-2 right-5 scale-0 rounded bg-brand p-2 text-xs text-white group-hover:scale-100 z-20 font-quicksand">
                    🚀 Preview your own Arduino code in real time
                  </span>
                </div>
                <pre className="text-xs w-full no-margin-important h-full">
                  <code className="language-c">{arduinoCode}</code>
                </pre>
              </>
            ) : null}
          </div>
        </div>

        <div
          className={clsx(
            'absolute  w-52  flex self-stretch flex-1 flex-col justify-start gap-8 py-4 px-4',
            openSideMenu && 'w-40 bg-brand/90 h-full top-0',
            !openSideMenu && 'bg-brand-50/0 bottom-[10%]',
            'duration-300 z-20'
          )}
        >
          <div
            className={clsx(
              'flex w-full',
              openSideMenu && 'items-center justify-end',
              !openSideMenu && 'flex-col gap-4'
            )}
          >
            {openSideMenu ? (
              <ChevronLeftIcon
                className={clsx(
                  'h-8 w-8 cursor-pointer text-secondary',
                  !openSideMenu && 'rotate-180'
                )}
                onClick={() => setOpenSideMenu(!openSideMenu)}
              ></ChevronLeftIcon>
            ) : (
              <button
                className="flex gap-2 items-center absolute bottom-[10%]"
                onClick={() => setOpenSideMenu(!openSideMenu)}
              >
                <Bars3Icon className={clsx('w-8 h-8 cursor-pointer text-brand')} />
                <p className="text-brand font-medium text-2xl">Menu</p>
              </button>
            )}
          </div>
          {openSideMenu && (
            <>
              {numBlocks > 2 && !level.completed && (
                <button
                  className="btn btn-brand bg-secondary hover:bg-secondary-200 rounded-md flex justify-start gap-4 pl-2 pr-4 transition-all text-brand"
                  onClick={() => {
                    updateLevelStatus()
                  }}
                >
                  <CheckCircleIcon className="z-20 w-5 h-5 text-brand"></CheckCircleIcon>
                  Complete Level
                </button>
              )}
              <button
                className="btn btn-brand bg-secondary hover:bg-secondary-200 rounded-md flex justify-start gap-4 pl-2 pr-4"
                onClick={() => {
                  downloadAgentPrompt()
                }}
              >
                <BoltIcon className="text-brand z-20 w-4 h-4"></BoltIcon>
                <p className="whitespace-nowrap text-xs text-brand">Download Agent</p>
              </button>
              <button
                className="btn btn-brand bg-secondary hover:bg-secondary-200 rounded-md flex justify-start gap-4 pl-2 pr-4"
                onClick={() => {
                  uploadCode()
                  setOpenSideMenu(false)
                }}
              >
                <ArrowUpIcon className="text-brand z-20 w-4 h-4"></ArrowUpIcon>
                <p className="whitespace-nowrap text-xs text-brand">Upload to Arduino</p>
              </button>
              <button
                className="btn btn-brand bg-secondary hover:bg-secondary-200 rounded-md flex justify-start gap-4 pl-2 pr-4"
                onClick={() => {
                  downloadCode()
                  setOpenSideMenu(false)
                }}
              >
                <ArrowDownIcon className="text-brand z-20 w-4 h-4"></ArrowDownIcon>
                <p className="whitespace-nowrap text-xs text-brand">
                  {t.User.htmlLevel.downloadCode}
                </p>
              </button>
              <button
                className="btn btn-brand bg-secondary hover:bg-secondary-200 rounded-md flex justify-start gap-4 pl-2 pr-4"
                onClick={() => {
                  resetCode()
                  setOpenSideMenu(false)
                }}
              >
                <TrashIcon className="text-brand z-20 w-5 h-5"></TrashIcon>
                <p className="whitespace-nowrap text-xs text-brand">{t.User.htmlLevel.resetAll}</p>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ArduinoBlockly
