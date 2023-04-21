import { Course } from '@/models/crud/course.model'
import { Level } from '@/models/crud/level.model'
import { Mission } from '@/models/crud/mission.model'
import { gameGenerator } from '@/blockly/generetors/game'
import { htmlBlocks } from '@/blockly/blocks/html'
import { htmlToolBox } from '@/blockly/toolbox/html'
import Blockly from 'blockly'
import BlocklyBoard from '@/components/blockly/blockly'
import DOMPurify from 'isomorphic-dompurify'
import React from 'react'
import convertHtmlToReact from '@hedgedoc/html-to-react'

interface Props {
  course: Course
  level: Level
  mission: Mission
}

const HtmlLevel = ({ course, level, mission }: Props) => {
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
      // Event is UI event or finished loading or workspace is dragging
      return
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

  const html = `Some text <strong>wrapped with strong</strong>
      <h1>h</h1>`

  const getCleanReactHtml = (html: string) => {
    const cleanHtml = DOMPurify.sanitize(html)
    return convertHtmlToReact(cleanHtml)
  }

  return (
    <div className="w-full h-full flex">
      <BlocklyBoard
        ref={parentRef}
        blocklyOptions={blocklyGameOptions}
        codeGenerator={gameGenerator}
        blocksDefinitions={htmlBlocks}
        onChangeListener={onChangeListener}
        storageKey={`course-${course._id}-mission-${mission._id}-level-${level._id}`}
      ></BlocklyBoard>
      <div className="basis-2/3 bg-brand-50 border-l-2 border-l-brand-400 h-full flex flex-col">
        <div className="basis-1/2 w-full">{getCleanReactHtml(html)}</div>
        <div className="basis-1/2 w-full border-t-2 border-brand-400"></div>
      </div>
    </div>
  )
}

export default HtmlLevel
