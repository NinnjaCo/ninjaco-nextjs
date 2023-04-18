import * as Blockly from 'blockly'
import { BlockDefinition } from 'blockly/core/blocks'
import marker from '@/images/marker.png'

const MOVEMENT_HUE = 230
const LOGIC_HUE = 210
const LOOPS_HUE = 47

const TURN_DIRECTIONS = [
  ['turn left', 'turnLeft'],
  ['turn right', 'turnRight'],
]
const PATH_DIRECTIONS = [
  ['ahead', 'isPathForward'],
  ['left', 'isPathLeft'],
  ['right', 'isPathRight'],
]

export const gameBlocks: BlockDefinition = Blockly.common.createBlockDefinitionsFromJsonArray([])

Blockly.Blocks['maze_moveForward'] = {
  init: function () {
    this.appendDummyInput().appendField('move forward')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(MOVEMENT_HUE)
    this.setTooltip('Move forward one space.')
    this.setHelpUrl('')
  },
}

Blockly.Blocks['maze_turn'] = {
  init: function () {
    const menu = TURN_DIRECTIONS as any
    this.appendDummyInput().appendField(new Blockly.FieldDropdown(menu), 'DIR')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(MOVEMENT_HUE)
    this.setTooltip('Turn left or right.')
  },
}

Blockly.Blocks['maze_if'] = {
  init: function () {
    const menu = PATH_DIRECTIONS as any
    this.appendDummyInput()
      .appendField('if path')
      .appendField(new Blockly.FieldDropdown(menu), 'DIR')
      .appendField('then')
    this.appendStatementInput('DO').setCheck(null)
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(LOGIC_HUE)
    this.setTooltip('If there is a path in the chosen direction, then do some actions.')
    this.setHelpUrl('')
  },
}

Blockly.Blocks['maze_ifElse'] = {
  init: function () {
    const menu = PATH_DIRECTIONS as any
    this.appendDummyInput()
      .appendField('if path')
      .appendField(new Blockly.FieldDropdown(menu), 'DIR')
      .appendField('then')
    this.appendStatementInput('DO').setCheck(null)
    this.appendDummyInput().appendField('else')
    this.appendStatementInput('ELSE').setCheck(null)
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(LOGIC_HUE)
    this.setTooltip(
      'If there is a path in the chosen direction, then do some actions, else do some other actions.'
    )
    this.setHelpUrl('')
  },
}

Blockly.Blocks['maze_forever'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('repeat until you reach')
      .appendField(new Blockly.FieldImage(marker.src, 12, 16, '*'))
    this.appendStatementInput('DO').setCheck(null)
    this.setPreviousStatement(true, null)
    this.setColour(LOOPS_HUE)
    this.setTooltip('A loop that runs forever')
    this.setHelpUrl('')
  },
}

// Add for loop block
Blockly.Blocks['maze_repeat'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('repeat')
      .appendField(new Blockly.FieldNumber(0, 0), 'TIMES')
      .appendField('times')
    this.appendStatementInput('DO').setCheck(null)
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(LOOPS_HUE)
    this.setTooltip('A loop that runs for a certain number of times')
    this.setHelpUrl('')
  },
}
