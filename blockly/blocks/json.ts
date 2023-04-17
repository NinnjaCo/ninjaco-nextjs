import * as Blockly from 'blockly'
import { BlockDefinition } from 'blockly/core/blocks'

export const jsonBlocks: BlockDefinition = Blockly.common.createBlockDefinitionsFromJsonArray([
  {
    type: 'object',
    message0: '{ %1 %2 }',
    args0: [
      {
        type: 'input_dummy',
      },
      {
        type: 'input_statement',
        name: 'MEMBERS',
      },
    ],
    output: null,
    colour: 230,
  },
  {
    type: 'member',
    message0: '%1 %2 %3',
    args0: [
      {
        type: 'field_input',
        name: 'MEMBER_NAME',
        text: '',
      },
      {
        type: 'field_label',
        name: 'COLON',
        text: ':',
      },
      {
        type: 'input_value',
        name: 'MEMBER_VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
  },
  {
    type: 'math_number',
    message0: '%1',
    args0: [
      {
        type: 'field_number',
        name: 'NUM',
        value: 0,
      },
    ],
    output: null,
    colour: 230,
  },
])
