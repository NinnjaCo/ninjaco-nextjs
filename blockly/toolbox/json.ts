import { ToolboxDefinition } from 'blockly/core/utils/toolbox'

export const jsonToolbox: ToolboxDefinition = {
  kind: 'flyoutToolbox',
  contents: [
    {
      kind: 'block',
      type: 'object',
    },
    {
      kind: 'block',
      type: 'member',
    },
    {
      kind: 'block',
      type: 'math_number',
    },
    {
      kind: 'block',
      type: 'text',
    },
    {
      kind: 'block',
      type: 'logic_boolean',
    },
    {
      kind: 'block',
      type: 'logic_null',
    },
    {
      kind: 'block',
      type: 'lists_create_with',
    },
  ],
}
