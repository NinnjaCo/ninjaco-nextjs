import { ArrowDownIcon, CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Course } from '@/models/crud/course.model'
import { CourseEnrollmentAPI } from '@/utils/api/courseEnrollment/course-enrollment.api'
import { FeedbackDialog } from './feedback'
import { Level } from '@/models/crud/level.model'
import { LevelApi } from '@/utils/api/level/level.api'
import { LevelEnrollmentApi } from '@/utils/api/levelEnrollment/level-enrollment.api'
import { Mission } from '@/models/crud/mission.model'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import { Router } from 'next/router'
import { Switch } from '@headlessui/react'
import { User } from '@/models/crud'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { htmlBlocks } from '@/blockly/blocks/html'
import { htmlGenerator } from '@/blockly/generetors/html'
import { htmlToolBox } from '@/blockly/toolbox/html'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Blockly from 'blockly'
import BlocklyBoard from '@/components/blockly/blockly'
import DOMPurify from 'isomorphic-dompurify'
import Image from 'next/image'
import React from 'react'
import convertHtmlToReact from '@hedgedoc/html-to-react'
import targetwebsite from '@/images/targetwebsite.png'
import useTranslation from '@/hooks/useTranslation'

interface Props {
  course: Course
  level: Level
  mission: Mission
  user: User
}

const HtmlLevel = ({ course, level, mission, user }: Props) => {
  const t = useTranslation()
  const router = useRouter()
  const [openDialogue, setOpenDialogue] = React.useState(false)
  const [showWebsitePreview, setShowWebsitePreview] = React.useState(true)
  const [htmlCode, setHtmlCode] = React.useState('')
  const [numBlocks, setNumBlocks] = React.useState<number>(0)

  console.log({
    course,
    level,
    mission,
  })
  const parentRef = React.useRef<any>()

  const close = () => {
    router.push(`/app/${course._id}/${mission._id}`)
  }

  React.useEffect(() => {
    const code = getCodeFromBlockly()
    if (code) {
      setHtmlCode(code)
    }
  }, [])

  //  useState to save the number of blocks

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
    }, 20000)

    const code = getCodeFromBlockly()
    if (code) {
      setHtmlCode(code)
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
    toolbox: htmlToolBox,
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

  const getCleanReactHtml = (html: string) => {
    const cleanHtml = DOMPurify.sanitize(html)
    return convertHtmlToReact(cleanHtml)
  }

  const getCodeFromBlockly = () => {
    if (parentRef.current) {
      return parentRef.current.generateCode()
    }
    return null
  }

  const resetCode = () => {
    if (parentRef.current) {
      parentRef.current.clearBlocks()
    }
    setHtmlCode('')
  }

  const downloadCode = () => {
    // prompt the user to download the code in a file named `index.html`

    const cleanCode = DOMPurify.sanitize(htmlCode)
    const blob = new Blob([cleanCode], { type: 'text/html' })

    const link = document.createElement('a')
    link.download = 'index.html'
    link.href = window.URL.createObjectURL(blob)
    link.click()

    // delete the link to avoid memory leaks
    link.remove()
  }

  // function to update the level status
  const session = useSession()

  const updateLevelStatus = async () => {
    // update levelEnrollment to be complete
    await new LevelEnrollmentApi(course._id, mission._id, session.data).update(level._id, {
      completed: true,
    })
    //  get all levels of the mission
    const levels = await new LevelApi(course._id, mission._id, session.data).find()
    // check for the next level
    for (let i = 0; i < levels.length; i++) {
      // find the index of the current level
      if (levels[i]._id === level._id) {
        // if the current level is not the last level
        if (i < levels.length - 1) {
          // update the next level to be unlocked
          await new LevelEnrollmentApi(course._id, mission._id, session.data).create({
            levelId: levels[i + 1]._id,
            completed: false,
          })
        }
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
        levelId={level._id}
        open={openDialogue}
        title="Feedback"
        close={() => {
          close()
        }}
      />
      <div className="w-full h-full relative overflow-hidden hidden lg:flex">
        <BlocklyBoard
          ref={parentRef}
          blocklyOptions={blocklyGameOptions}
          codeGenerator={htmlGenerator}
          blocksDefinitions={htmlBlocks}
          onChangeListener={onChangeListener}
          storageKey={`course-${course._id}-mission-${mission._id}-level-${level._id}`}
        ></BlocklyBoard>
        <div className="basis-2/3 border-l-2 border-l-brand-400 h-full flex flex-col">
          <div className="basis-1/2 w-full text-xs bg-brand-100">
            <div className="w-full h-full relative">
              <div className="group relative flex justify-center">
                <QuestionMarkCircleIcon className="absolute top-1 right-3 w-4 h-4 text-brand-300 hover:text-brand-500 cursor-pointer z-20" />
                <span className="absolute top-2 right-5 scale-0 rounded bg-brand p-2 text-xs text-white group-hover:scale-100 z-20">
                  ✨ This is how your website should look like
                </span>
              </div>
              <Image
                src={level.websitePreviewImage || targetwebsite}
                alt="Target Website Preview"
                className="w-full h-full max-w-full max-h-full"
                fill
                style={{
                  objectFit: 'contain',
                }}
              ></Image>
            </div>
          </div>
          <div className="basis-1/2 w-full border-t-2 border-brand-400  overflow-y-scroll font-serif relative">
            <div className="group relative flex justify-center">
              <QuestionMarkCircleIcon className="absolute top-1 right-3 w-4 h-4 text-brand-100 hover:text-brand-500 cursor-pointer z-20" />
              <span className="absolute top-2 right-5 scale-0 rounded bg-brand p-2 text-xs text-white group-hover:scale-100 z-20 font-quicksand">
                🚀 Preview your own HTML code in real-time
              </span>
            </div>
            {showWebsitePreview ? (
              <div>{getCleanReactHtml(htmlCode)}</div>
            ) : (
              <pre className="text-xs">{htmlCode}</pre>
            )}
          </div>
        </div>

        <div className="absolute top-[55%] left-4 z-20 flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <div>
              {showWebsitePreview ? t.User.htmlLevel.showCode : t.User.htmlLevel.showWebsite}
            </div>
            <Switch
              checked={showWebsitePreview}
              onChange={(isChecked) => {
                setShowWebsitePreview(isChecked)
              }}
              className={`${!showWebsitePreview ? 'bg-brand-700' : 'bg-brand-500'}
            inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span className="sr-only">{showWebsitePreview ? 'Show Code' : 'Show Website'}</span>
              <span
                aria-hidden="true"
                className={`${!showWebsitePreview ? 'translate-x-7' : 'translate-x-0'}
              pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
          {numBlocks > 2 && (
            <button
              className="btn btn-brand rounded-md flex justify-start gap-4 pl-2 pr-4"
              onClick={() => {
                updateLevelStatus()
              }}
            >
              <CheckCircleIcon className="text-secondary z-20 w-5 h-5"></CheckCircleIcon>
              Complete Level
            </button>
          )}
          <button
            className="btn btn-brand rounded-md flex justify-between gap-4 pl-2 pr-4"
            onClick={() => {
              downloadCode()
            }}
          >
            <ArrowDownIcon className="text-secondary z-20 w-5 h-5"></ArrowDownIcon>
            <p className="whitespace-nowrap">{t.User.htmlLevel.downloadCode}</p>
          </button>
          <button
            className="btn btn-brand rounded-md flex justify-start gap-4 pl-2 pr-4"
            onClick={() => {
              resetCode()
            }}
          >
            <TrashIcon className="text-secondary z-20 w-5 h-5"></TrashIcon>
            <p className="whitespace-nowrap">{t.User.htmlLevel.resetAll}</p>
          </button>
        </div>
      </div>
    </>
  )
}
export default HtmlLevel
