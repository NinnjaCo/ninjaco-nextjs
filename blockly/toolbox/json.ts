import { ToolboxDefinition } from 'blockly/core/utils/toolbox'

export const jsonToolbox: ToolboxDefinition = {
  // StaticCategoryInfo
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'JSON',
      cssconfig: {
        container: 'blockly-json-category',
        icon: 'fa fa-cog',
      },
      contents: [
        {
          kind: 'block',
          type: 'object',
        },
        {
          kind: 'sep',
        },
        {
          kind: 'block',
          type: 'member',
        },
      ],
    },
  ],
}
