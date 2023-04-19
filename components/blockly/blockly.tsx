import 'blockly/blocks'
import { BlocklyOptions } from 'blockly'
import { load, save } from '@/blockly/serialization'
import Blockly from 'blockly'
import React, { useCallback, useEffect, useImperativeHandle, useRef } from 'react'

interface blocksDefinition {
  [key: string]: any
}
interface BlocklyBoardProps {
  onChangeListener: (e: Blockly.Events.Abstract, workspaceRefrence: Blockly.WorkspaceSvg) => void
  blocklyOptions: BlocklyOptions
  blocksDefinitions?: blocksDefinition
  codeGenerator: Blockly.CodeGenerator
  storageKey?: string
  children?: React.ReactNode
}

const getBlockIdFromString = (blockString: string) => {
  // block_id_g2yJbN94^*2e4|i+(-_Y
  // or block_id_b]_Ysd|r{m@7O84Olv/F
  // use regex to get the block id, since _ can appear in the actual block id
  const blockId = blockString.match(/block_id_(.*)/)?.[1]
  return blockId ?? ''
}

const BlocklyBoard = React.forwardRef(
  (
    {
      blocklyOptions,
      codeGenerator,
      onChangeListener,
      blocksDefinitions,
      children,
      storageKey,
    }: BlocklyBoardProps,
    ref: any
  ) => {
    const blocklyDiv = useRef<HTMLDivElement>(null)
    const toolboxDiv = useRef<HTMLDivElement>(null)
    const primaryWorkspace = useRef<Blockly.WorkspaceSvg>()
    const [loaded, setLoaded] = React.useState(false)

    const generateCode = useCallback(() => {
      const code = codeGenerator.workspaceToCode(primaryWorkspace.current)
      return code
    }, [codeGenerator])

    const highlightBlockById = useCallback((blockId: string) => {
      // blockId is of the form block_id_g2yJbN94^*2e4|i+(-_Y
      const id = getBlockIdFromString(blockId)
      if (primaryWorkspace.current) primaryWorkspace.current.highlightBlock(id)
    }, [])

    useImperativeHandle(ref, () => ({
      generateCode,
      highlightBlockById,
    }))

    useEffect(() => {
      const { toolbox, ...rest } = blocklyOptions

      if (blocklyDiv.current && toolboxDiv.current) {
        if (loaded || primaryWorkspace.current?.rendered) {
          return
        }
        // Start the workspace
        if (blocksDefinitions) Blockly.common.defineBlocks(blocksDefinitions)
        const workspace = Blockly.inject(blocklyDiv.current, {
          // if children are passed, use the toolboxDiv as the toolbox so that it gets populated with the children otherwise use the toolbox prop
          toolbox: children ? toolboxDiv.current : toolbox,
          ...rest,
        })
        primaryWorkspace.current = workspace as Blockly.WorkspaceSvg

        // Save the workspace to local storage on change, and load it if it exists.
        if (storageKey) {
          load(workspace, storageKey)
          workspace.addChangeListener((e) => {
            // UI events are things like scrolling, zooming, etc.
            // No need to save after one of these.
            if (e.isUiEvent) return
            save(workspace, storageKey)
          })
        }

        if (!workspace) {
          throw new Error('Could not load workspace')
        }

        setLoaded(true)
        // Whenever the workspace changes meaningfully, run the code again.
        workspace.addChangeListener((e: Blockly.Events.Abstract) => {
          onChangeListener(e, workspace)
        })
      }
    }, [
      primaryWorkspace,
      blocklyDiv,
      loaded,
      generateCode,
      blocklyOptions,
      blocksDefinitions,
      children,
      storageKey,
      onChangeListener,
    ])

    return (
      <div className="w-full h-full flex flex-col relative z-0">
        <div ref={blocklyDiv} className="w-full h-full" />
        <div className="hidden" ref={toolboxDiv}>
          {children}
        </div>
      </div>
    )
  }
)

// set display name
BlocklyBoard.displayName = 'BlocklyBoard'
export default BlocklyBoard
