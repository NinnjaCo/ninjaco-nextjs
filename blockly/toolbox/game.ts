import { ToolboxDefinition } from 'blockly/core/utils/toolbox'

export const gameToolBox: ToolboxDefinition = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Core',
      contents: [
        {
          kind: 'block',
          type: 'controls_if',
        },
        {
          kind: 'block',
          type: 'logic_compare',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Custom',
      contents: [
        {
          kind: 'block',
          type: 'start',
        },
        {
          kind: 'category',
          name: 'Move',
          contents: [
            {
              kind: 'block',
              type: 'move_forward',
            },
          ],
        },
        {
          kind: 'category',
          name: 'Turn',
          contents: [
            {
              kind: 'block',
              type: 'turn_left',
            },
          ],
        },
      ],
    },
    {
      kind: 'category',
      name: 'Variables',
      custom: 'VARIABLE',
    },
    {
      kind: 'category',
      name: 'Functions',
      custom: 'PROCEDURE',
    },
  ],
}
