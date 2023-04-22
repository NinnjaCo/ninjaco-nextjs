import { ToolboxDefinition } from 'blockly/core/utils/toolbox'

export const htmlToolBox: ToolboxDefinition = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Base Frame',
      colour: '#D84B4B',
      contents: [
        {
          kind: 'block',
          type: 'baseframe',
        },
        {
          kind: 'block',
          type: 'html',
        },
        {
          kind: 'block',
          type: 'body',
        },
        {
          kind: 'block',
          type: 'body_attributes',
        },
        {
          kind: 'block',
          type: 'head',
        },
        {
          kind: 'block',
          type: 'title',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Text Structure',
      colour: '#D8864B',
      contents: [
        {
          kind: 'block',
          type: 'plaintext',
        },
        {
          kind: 'block',
          type: 'horizontalbreak',
        },
        {
          kind: 'block',
          type: 'linebreak',
        },
        {
          kind: 'block',
          type: 'paragraph',
        },
        {
          kind: 'block',
          type: 'headline',
          contents: [
            {
              kind: 'field',
              name: 'NAME',
              contents: [
                {
                  kind: 'text',
                  text: 'h1',
                },
              ],
            },
          ],
        },
        {
          kind: 'block',
          type: 'link',
          contents: [
            {
              kind: 'field',
              name: 'NAME',
              contents: [
                {
                  kind: 'text',
                  text: 'target',
                },
              ],
            },
          ],
        },
        {
          kind: 'block',
          type: 'image',
          contents: [
            {
              kind: 'field',
              name: 'IMAGE',
              contents: [
                {
                  kind: 'text',
                  text: 'URL',
                },
              ],
            },
            {
              kind: 'field',
              name: 'ALT',
              contents: [
                {
                  kind: 'text',
                  text: 'alternative text',
                },
              ],
            },
          ],
        },
        {
          kind: 'block',
          type: 'span',
          contents: [
            {
              kind: 'block',
              type: 'style',
            },
          ],
        },
        {
          kind: 'block',
          type: 'division',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Text Markup',
      colour: '#4BD892',
      contents: [
        {
          kind: 'block',
          type: 'emphasise',
        },
        {
          kind: 'block',
          type: 'inserted',
        },
        {
          kind: 'block',
          type: 'strong',
        },
        {
          kind: 'block',
          type: 'deleted',
        },
        {
          kind: 'block',
          type: 'super',
        },
        {
          kind: 'block',
          type: 'sub',
        },
        {
          kind: 'block',
          type: 'code',
        },
        {
          kind: 'block',
          type: 'quote',
        },
        {
          kind: 'block',
          type: 'blockquote',
        },
        {
          kind: 'block',
          type: 'sample',
        },
        {
          kind: 'block',
          type: 'keyboard',
        },
        {
          kind: 'block',
          type: 'variable',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Tables',
      colour: '#D84B7A',
      contents: [
        {
          kind: 'block',
          type: 'table',
        },
        {
          kind: 'block',
          type: 'tablerow',
        },
        {
          kind: 'block',
          type: 'tablecell',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Lists',
      colour: '#D8864B',
      contents: [
        {
          kind: 'block',
          type: 'unorderedlist',
        },
        {
          kind: 'block',
          type: 'orderedlist',
        },
        {
          kind: 'block',
          type: 'listelement',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Style',
      colour: '#4B7AD8',
      contents: [
        {
          kind: 'block',
          type: 'style',
        },
        {
          kind: 'block',
          type: 'color',
          contents: [
            {
              kind: 'field',
              name: 'NAME',
              contents: [
                {
                  kind: 'text',
                  text: '#ff0000',
                },
              ],
            },
          ],
        },
        {
          kind: 'block',
          type: 'bgcolour',
          contents: [
            {
              kind: 'field',
              name: 'NAME',
              contents: [
                {
                  kind: 'text',
                  text: '#ff0000',
                },
              ],
            },
          ],
        },
        {
          kind: 'block',
          type: 'genericstyle',
          contents: [
            {
              kind: 'field',
              name: 'property',
              contents: [
                {
                  kind: 'text',
                  text: 'property',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
