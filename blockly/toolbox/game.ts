import { ToolboxDefinition } from 'blockly/core/utils/toolbox'

export const gameToolBox: ToolboxDefinition = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Movement',
      contents: [
        {
          kind: 'block',
          type: 'maze_moveForward',
        },
        {
          kind: 'block',
          type: 'maze_turn',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Logic',
      contents: [
        {
          kind: 'block',
          type: 'maze_if',
        },
        {
          kind: 'block',
          type: 'maze_ifElse',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Loops',
      contents: [
        {
          kind: 'block',
          type: 'maze_repeat',
        },
        {
          kind: 'block',
          type: 'maze_forever',
        },
      ],
    },
  ],
}
