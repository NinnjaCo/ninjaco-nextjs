import { Course } from '@/models/crud/course.model'
import { Level } from '@/models/crud/level.model'
import { Mission } from '@/models/crud/mission.model'
import { htmlBlocks } from '@/blockly/blocks/html'
import { htmlGenerator } from '@/blockly/generetors/html'
import { htmlToolBox } from '@/blockly/toolbox/html'
import Blockly from 'blockly'
import BlocklyBoard from '@/components/blockly/blockly'
import React from 'react'

interface Props {
  course: Course
  mission: Mission
  level: Level
}

const ArduinoBlockly = ({ level, course, mission }: Props) => {
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
  return (
    <div className="w-full h-full relative overflow-hidden hidden lg:flex">
      <BlocklyBoard
        ref={parentRef}
        blocklyOptions={blocklyGameOptions}
        codeGenerator={htmlGenerator}
        blocksDefinitions={htmlBlocks}
        onChangeListener={onChangeListener}
        storageKey={`course-${course._id}-mission-${mission._id}-level-${level._id}`}
      ></BlocklyBoard>
    </div>
  )
}

export default ArduinoBlockly
