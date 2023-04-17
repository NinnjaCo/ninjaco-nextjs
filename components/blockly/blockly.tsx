import 'blockly/blocks'
import { BlocklyOptions, Theme } from 'blockly'
import { load, save } from '@/blockly/serialization'
import Blockly from 'blockly'
import React, { useCallback, useEffect, useRef } from 'react'

interface blocksDefinition {
  [key: string]: any
}
interface BlocklyBoardProps {
  blocklyOptions: BlocklyOptions
  blocksDefinitions?: blocksDefinition
  codeGenerator: Blockly.CodeGenerator
  children?: React.ReactNode
}

const BlocklyBoard = (props: BlocklyBoardProps) => {
  const blocklyDiv = useRef<HTMLDivElement>(null)
  const toolboxDiv = useRef<HTMLDivElement>(null)
  const primaryWorkspace = useRef<Blockly.WorkspaceSvg>()
  const [loaded, setLoaded] = React.useState(false)

  const generateCode = useCallback(() => {
    const code = props.codeGenerator.workspaceToCode(primaryWorkspace.current)
    console.log(code)
  }, [props])

  useEffect(() => {
    const { toolbox, ...rest } = props.blocklyOptions

    if (blocklyDiv.current) {
      if (loaded || primaryWorkspace.current?.rendered) {
        return
      }
      // Start the workspace
      if (props.blocksDefinitions) Blockly.common.defineBlocks(props.blocksDefinitions)
      const workspace = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        ...rest,
      })
      primaryWorkspace.current = workspace as Blockly.WorkspaceSvg

      load(workspace)
      if (!workspace) {
        throw new Error('Could not load workspace')
      }

      setLoaded(true)
      workspace.addChangeListener((e) => {
        // UI events are things like scrolling, zooming, etc.
        // No need to save after one of these.
        if (e.isUiEvent) return
        save(workspace)
      })
      // Whenever the workspace changes meaningfully, run the code again.
      workspace.addChangeListener((e) => {
        // Don't run the code when the workspace finishes loading; we're
        // already running it once when the application starts.
        // Don't run the code during drags; we might have invalid state.
        if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING || workspace.isDragging()) {
          return
        }
        // generateCode()
      })
    }
  }, [primaryWorkspace, blocklyDiv, props, loaded, generateCode])

  return (
    <div className="w-full h-full flex flex-col relative">
      <div ref={blocklyDiv} className="w-full h-full" />
      <div className="hidden" ref={toolboxDiv}>
        {props.children}
      </div>
      {/* <div className="absolute w-32 h-32 bg-red-500 z-20 top-10 right-10"></div> */}
      <button onClick={generateCode}>Convert</button>
    </div>
  )
}

export default BlocklyBoard
