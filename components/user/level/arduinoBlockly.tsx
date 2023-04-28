import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  Bars3Icon,
  ChevronLeftIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { Blockly, arduinoGenerator } from '@/blockly/generetors/arduino'
import { Course } from '@/models/crud/course.model'
import { Level } from '@/models/crud/level.model'
import { Mission } from '@/models/crud/mission.model'
import { arduinoToolbox } from '@/blockly/toolbox/arduino'
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
  level: Level
}

const ArduinoBlockly = ({ level, course, mission }: Props) => {
  const t = useTranslation()
  const [openSideMenu, setOpenSideMenu] = React.useState(false)
  const [arduinoCode, setArduinoCode] = React.useState('')
  const [showCodePreview, setShowCodePreview] = React.useState(true)
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
            case 0:
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
          message: e.message || 'Upload failed',
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

  return (
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
          'absolute  w-48  flex self-stretch flex-1 flex-col justify-start gap-8 py-4 px-4',
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
  )
}

export default ArduinoBlockly
