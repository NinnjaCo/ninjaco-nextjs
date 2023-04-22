import { BlockDefinition } from 'blockly/core/blocks'
import Blockly from 'blockly'

const BASE_FRAME_HUE = 0 // base frame I.E. html, head, body, document
const BLOCKS_HUE = 25 // blocks that will be used in the body of the html
const TEXT_STRUCTURE_HUE = 150 // text structure I.E. paragraph, division, title
const MISCELLANEOUS_HUE = 100 // linebreak , hr tags..
const STYLE_HUE = 220 // style I.E. color, font, background
const TABLE_HUE = 340 // table I.E. table, row, cell

// Ignore the below error, it works but blockly for some reason did not include the type for this, so typescript is complaining
// source: https://developers.google.com/blockly/guides/create-custom-blocks/block-colour#defining_the_block_colour
/** @ts-expect-error HSV_VALUE not decalred it types export*/
Blockly.HSV_VALUE = 0.85
/** @ts-expect-error HSV_SATURATION not decalred it types export*/
Blockly.HSV_SATURATION = 0.65

export const htmlBlocks: BlockDefinition = Blockly.common.createBlockDefinitionsFromJsonArray([])

// redo the above using javascript

Blockly.Blocks['baseframe'] = {
  init: function () {
    //   {
    //   type: 'baseframe',
    //   message0: 'document %1 header %2 %3 content %4 %5',
    //   args0: [
    //     {
    //       type: 'input_dummy',
    //     },
    //     {
    //       type: 'input_dummy',
    //     },
    //     {
    //       type: 'input_statement',
    //       name: 'head',
    //       check: 'header',
    //     },
    //     {
    //       type: 'input_dummy',
    //     },
    //     {
    //       type: 'input_statement',
    //       name: 'body',
    //       check: 'html',
    //     },
    //   ],
    //   colour: BASE_FRAME_HUE,
    //   tooltip: '',
    //   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
    // },
    this.appendDummyInput().appendField('document').appendField('header')
    this.appendStatementInput('head').setCheck('header')
    this.appendDummyInput().appendField('content')
    this.appendStatementInput('body').setCheck('html')
    this.setColour(BASE_FRAME_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['html'] = {
  init: function () {
    //     {
    //   type: 'html',
    //   message0: 'document %1 %2',
    //   args0: [
    //     {
    //       type: 'input_dummy',
    //     },
    //     {
    //       type: 'input_statement',
    //       name: 'content',
    //       check: 'document',
    //     },
    //   ],
    //   colour: BASE_FRAME_HUE,
    //   tooltip: '',
    //   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
    // },
    this.appendDummyInput().appendField('document')
    this.appendStatementInput('content').setCheck('document')
    this.setColour(BASE_FRAME_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['body'] = {
  init: function () {
    //   type: 'body',
    //   message0: 'content %1 %2',
    //   args0: [
    //     {
    //       type: 'input_dummy',
    //     },
    //     {
    //       type: 'input_statement',
    //       name: 'content',
    //       check: 'html',
    //     },
    //   ],
    //   previousStatement: 'document',
    //   nextStatement: 'document',
    //   colour: BASE_FRAME_HUE,
    //   tooltip: '',
    //   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
    // },
    this.appendDummyInput().appendField('content')
    this.appendStatementInput('content').setCheck('html')
    this.setPreviousStatement(true, 'document')
    this.setNextStatement(true, 'document')
    this.setColour(BASE_FRAME_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

// {
//   type: 'head',
//   message0: 'header %1 %2',
//   args0: [
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//       check: 'header',
//     },
//   ],
//   previousStatement: 'document',
//   nextStatement: 'document',
//   colour: BASE_FRAME_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },
Blockly.Blocks['head'] = {
  init: function () {
    this.appendDummyInput().appendField('header')
    this.appendStatementInput('content').setCheck('header')
    this.setPreviousStatement(true, 'document')
    this.setNextStatement(true, 'document')
    this.setColour(BASE_FRAME_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

// {
//   type: 'title',
//   message0: 'title %1',
//   args0: [
//     {
//       type: 'input_statement',
//       name: 'content',
//       check: 'html',
//     },
//   ],
//   previousStatement: 'header',
//   nextStatement: 'header',
//   colour: BASE_FRAME_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },
Blockly.Blocks['title'] = {
  init: function () {
    this.appendDummyInput().appendField('title')
    this.appendStatementInput('content').setCheck('html')
    this.setPreviousStatement(true, 'header')
    this.setNextStatement(true, 'header')
    this.setColour(BASE_FRAME_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

// {
//   type: 'paragraph',
//   message0: 'paragraph %1',
//   args0: [
//     {
//       type: 'input_statement',
//       name: 'content',
//       check: 'html',
//     },
//   ],
//   previousStatement: 'html',
//   nextStatement: 'html',
//   colour: BLOCKS_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },

Blockly.Blocks['paragraph'] = {
  init: function () {
    this.appendDummyInput().appendField('paragraph')
    this.appendStatementInput('content').setCheck('html')
    this.setPreviousStatement(true, 'html')
    this.setNextStatement(true, 'html')
    this.setColour(BLOCKS_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

// {
//   type: 'plaintext',
//   message0: 'text %1',
//   args0: [
//     {
//       type: 'field_input',
//       name: 'content',
//       text: '',
//     },
//   ],
//   previousStatement: null,
//   nextStatement: null,
//   colour: TEXT_STRUCTURE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },

Blockly.Blocks['plaintext'] = {
  init: function () {
    this.appendDummyInput().appendField('text')
    this.appendDummyInput().appendField(new Blockly.FieldTextInput(''), 'content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

// {
//   type: 'division',
//   message0: 'division %1 %2',
//   args0: [
//     {
//       type: 'input_value',
//       name: 'NAME',
//       check: 'attribute',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//       check: 'html',
//     },
//   ],
//   previousStatement: 'html',
//   nextStatement: 'html',
//   colour: BLOCKS_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },

Blockly.Blocks['division'] = {
  init: function () {
    this.appendDummyInput().appendField('division')
    this.appendValueInput('NAME').setCheck('attribute')
    this.appendStatementInput('content').setCheck('html')
    this.setPreviousStatement(true, 'html')
    this.setNextStatement(true, 'html')
    this.setColour(BLOCKS_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

// {
//   type: 'style',
//   message0: 'style =  %1 %2',
//   args0: [
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'NAME',
//       check: 'css',
//     },
//   ],
//   inputsInline: true,
//   output: 'attribute',
//   colour: STYLE_HUE,
//   tooltip: '',
//   helpUrl: '',
// },

Blockly.Blocks['style'] = {
  init: function () {
    this.appendDummyInput().appendField('style = ')
    this.appendStatementInput('NAME').setCheck('css')
    this.setInputsInline(true)
    this.setOutput(true, 'attribute')
    this.setColour(STYLE_HUE)
    this.setTooltip('')
    this.setHelpUrl('')
  },
}

// {
//   type: 'color',
//   message0: 'text colour :  %1',
//   args0: [
//     {
//       type: 'field_colour',
//       name: 'NAME',
//       colour: '#ff0000',
//     },
//   ],
//   previousStatement: 'css',
//   nextStatement: 'css',
//   colour: STYLE_HUE,
//   tooltip: '',
//   helpUrl: '',
// },

Blockly.Blocks['color'] = {
  init: function () {
    this.appendDummyInput().appendField('text colour : ')
    this.appendDummyInput().appendField(new Blockly.FieldColour('#ff0000'), 'NAME')
    this.setPreviousStatement(true, 'css')
    this.setNextStatement(true, 'css')
    this.setColour(STYLE_HUE)
    this.setTooltip('')
    this.setHelpUrl('')
  },
}

// {
//   type: 'bgcolour',
//   message0: 'background colour :  %1',
//   args0: [
//     {
//       type: 'field_colour',
//       name: 'NAME',
//       colour: '#ff0000',
//     },
//   ],
//   previousStatement: 'css',
//   nextStatement: 'css',
//   colour: STYLE_HUE,
//   tooltip: '',
//   helpUrl: '',
// },

Blockly.Blocks['bgcolour'] = {
  init: function () {
    this.appendDummyInput().appendField('background colour : ')
    this.appendDummyInput().appendField(new Blockly.FieldColour('#ff0000'), 'NAME')
    this.setPreviousStatement(true, 'css')
    this.setNextStatement(true, 'css')
    this.setColour(STYLE_HUE)
    this.setTooltip('')
    this.setHelpUrl('')
  },
}
// {
//   type: 'genericstyle',
//   message0: '%1 : %2',
//   args0: [
//     {
//       type: 'field_input',
//       name: 'property',
//       text: 'property',
//     },
//     {
//       type: 'field_input',
//       name: 'value',
//       text: 'value',
//     },
//   ],
//   previousStatement: 'css',
//   nextStatement: 'css',
//   colour: STYLE_HUE,
//   tooltip: '',
//   helpUrl: '',
// },

Blockly.Blocks['genericstyle'] = {
  init: function () {
    this.appendDummyInput().appendField(new Blockly.FieldTextInput('property'), 'property')
    this.appendDummyInput().appendField(new Blockly.FieldTextInput('value'), 'value')
    this.setPreviousStatement(true, 'css')
    this.setNextStatement(true, 'css')
    this.setColour(STYLE_HUE)
    this.setTooltip('')
    this.setHelpUrl('')
  },
}

/**  {
    type: 'more_attributes',
    message0: '%1 %2 %3',
    args0: [
      {
        type: 'input_value',
        name: 'NAME1',
        check: 'attribute',
      },
      {
        type: 'input_value',
        name: 'NAME2',
        check: 'attribute',
      },
      {
        type: 'input_value',
        name: 'NAME3',
        check: 'attribute',
      },
    ],
    output: 'attribute',
    colour: STYLE_HUE,
    tooltip: '',
    helpUrl: '',
  }, */

Blockly.Blocks['more_attributes'] = {
  init: function () {
    this.appendValueInput('NAME1').setCheck('attribute')
    this.appendValueInput('NAME2').setCheck('attribute')
    this.appendValueInput('NAME3').setCheck('attribute')
    this.setOutput(true, 'attribute')
    this.setColour(STYLE_HUE)
    this.setTooltip('')
    this.setHelpUrl('')
  },
}

// {
//   type: 'genericattribute',
//   message0: '%1  =  %2',
//   args0: [
//     {
//       type: 'field_input',
//       name: 'attribute',
//       text: 'attribute',
//     },
//     {
//       type: 'field_input',
//       name: 'value',
//       text: 'value',
//     },
//   ],
//   inputsInline: true,
//   output: 'attribute',
//   colour: STYLE_HUE,
//   tooltip: '',
//   helpUrl: '',
// },

Blockly.Blocks['genericattribute'] = {
  init: function () {
    this.appendDummyInput().appendField(new Blockly.FieldTextInput('attribute'), 'attribute')
    this.appendDummyInput().appendField(new Blockly.FieldTextInput('value'), 'value')
    this.setInputsInline(true)
    this.setOutput(true, 'attribute')
    this.setColour(STYLE_HUE)
    this.setTooltip('')
    this.setHelpUrl('')
  },
}

// {
//   type: 'link',
//   message0: 'link to %1 %2 %3',
//   args0: [
//     {
//       type: 'field_input',
//       name: 'NAME',
//       text: 'target',
//     },
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//       check: 'html',
//     },
//   ],
//   previousStatement: 'html',
//   nextStatement: 'html',
//   colour: BLOCKS_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },

Blockly.Blocks['link'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('link to ')
      .appendField(new Blockly.FieldTextInput('target'), 'NAME')
    this.appendStatementInput('content').setCheck('html')
    this.setPreviousStatement(true, 'html')
    this.setNextStatement(true, 'html')
    this.setColour(BLOCKS_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

// {
//   type: 'span',
//   message0: 'span %1 %2',
//   args0: [
//     {
//       type: 'input_value',
//       name: 'NAME',
//       check: 'attribute',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//       check: 'html',
//     },
//   ],
//   previousStatement: 'html',
//   nextStatement: 'html',
//   colour: BLOCKS_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },

Blockly.Blocks['span'] = {
  init: function () {
    this.appendValueInput('NAME').setCheck('attribute')
    this.appendStatementInput('content').setCheck('html')
    this.setPreviousStatement(true, 'html')
    this.setNextStatement(true, 'html')
    this.setColour(BLOCKS_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

// {
//   type: 'image',
//   message0: 'image %1 or %2',
//   args0: [
//     {
//       type: 'field_input',
//       name: 'IMAGE',
//       text: 'URL',
//     },
//     {
//       type: 'field_input',
//       name: 'ALT',
//       text: 'alternative text',
//     },
//   ],
//   previousStatement: 'html',
//   nextStatement: 'html',
//   colour: BLOCKS_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },

Blockly.Blocks['image'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('image')
      .appendField(new Blockly.FieldTextInput('URL'), 'IMAGE')
      .appendField('or')
      .appendField(new Blockly.FieldTextInput('alternative text'), 'ALT')
    this.setPreviousStatement(true, 'html')
    this.setNextStatement(true, 'html')
    this.setColour(BLOCKS_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

// {
//   type: 'emphasise',
//   message0: 'emphasise %1 %2',
//   args0: [
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//     },
//   ],
//   previousStatement: null,
//   nextStatement: null,
//   colour: TEXT_STRUCTURE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },

Blockly.Blocks['emphasise'] = {
  init: function () {
    this.appendDummyInput()
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

// {
//   type: 'strong',
//   message0: 'important %1 %2',
//   args0: [
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//     },
//   ],
//   previousStatement: null,
//   nextStatement: null,
//   colour: TEXT_STRUCTURE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },

Blockly.Blocks['strong'] = {
  init: function () {
    this.appendDummyInput()
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

// {
//   type: 'headline',
//   message0: 'headline %1 %2 %3',
//   args0: [
//     {
//       type: 'field_dropdown',
//       name: 'NAME',
//       options: [
//         ['level 1', 'h1'],
//         ['level 2', 'h2'],
//         ['level 3', 'h2'],
//         ['level 4', 'h4'],
//         ['level 5', 'h5'],
//         ['level 6', 'h6'],
//       ],
//     },
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//     },
//   ],
//   previousStatement: null,
//   nextStatement: null,
//   colour: BLOCKS_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },

Blockly.Blocks['headline'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('headline')
      .appendField(
        new Blockly.FieldDropdown([
          ['level 1', 'h1'],
          ['level 2', 'h2'],
          ['level 3', 'h2'],
          ['level 4', 'h4'],
          ['level 5', 'h5'],
          ['level 6', 'h6'],
        ]),
        'NAME'
      )
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(BLOCKS_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

// {
//   type: 'linebreak',
//   message0: 'line break',
//   previousStatement: null,
//   nextStatement: null,
//   colour: MISCELLANEOUS_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },
// {
//   type: 'horizontalbreak',
//   message0: 'topic break',
//   previousStatement: null,
//   nextStatement: null,
//   colour: MISCELLANEOUS_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },

Blockly.Blocks['linebreak'] = {
  init: function () {
    this.appendDummyInput().appendField('line break')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(MISCELLANEOUS_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['horizontalbreak'] = {
  init: function () {
    this.appendDummyInput().appendField('topic break')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(MISCELLANEOUS_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

// {
//     type: 'unorderedlist',
//     message0: 'unordered list %1 %2',
//     args0: [
//       {
//         type: 'input_dummy',
//       },
//       {
//         type: 'input_statement',
//         name: 'NAME',
//       },
//     ],
//     previousStatement: null,
//     nextStatement: null,
//     colour: BLOCKS_HUE,
//     tooltip: '',
//     helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
//   },
//   {
//     type: 'orderedlist',
//     message0: 'ordered list %1 %2',
//     args0: [
//       {
//         type: 'input_dummy',
//       },
//       {
//         type: 'input_statement',
//         name: 'NAME',
//       },
//     ],
//     previousStatement: null,
//     nextStatement: null,
//     colour: BLOCKS_HUE,
//     tooltip: '',
//     helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
//   },
//   {
//     type: 'listelement',
//     message0: 'list item %1 %2',
//     args0: [
//       {
//         type: 'input_dummy',
//       },
//       {
//         type: 'input_statement',
//         name: 'content',
//       },
//     ],
//     previousStatement: null,
//     nextStatement: null,
//     colour: TEXT_STRUCTURE_HUE,
//     tooltip: '',
//     helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
//   },

Blockly.Blocks['unorderedlist'] = {
  init: function () {
    this.appendDummyInput()
    this.appendStatementInput('NAME')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(BLOCKS_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['orderedlist'] = {
  init: function () {
    this.appendDummyInput()
    this.appendStatementInput('NAME')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(BLOCKS_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['listelement'] = {
  init: function () {
    this.appendDummyInput()
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

//   type: 'inserted',
//   message0: 'inserted %1 %2',
//   args0: [
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//     },
//   ],
//   previousStatement: null,
//   nextStatement: null,
//   colour: TEXT_STRUCTURE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },
// {
//   type: 'deleted',
//   message0: 'deleted %1 %2',
//   args0: [
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//     },
//   ],
//   previousStatement: null,
//   nextStatement: null,
//   colour: TEXT_STRUCTURE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },
// {
//   type: 'super',
//   message0: 'superscript %1 %2',
//   args0: [
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//     },
//   ],
//   previousStatement: null,
//   nextStatement: null,
//   colour: TEXT_STRUCTURE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },
// {
//   type: 'sub',
//   message0: 'subscript %1 %2',
//   args0: [
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//     },
//   ],
//   previousStatement: null,
//   nextStatement: null,
//   colour: TEXT_STRUCTURE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },
// {
//   type: 'code',
//   message0: 'code %1 %2',
//   args0: [
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//     },
//   ],
//   previousStatement: null,
//   nextStatement: null,
//   colour: TEXT_STRUCTURE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// }

Blockly.Blocks['inserted'] = {
  init: function () {
    this.appendDummyInput()
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['deleted'] = {
  init: function () {
    this.appendDummyInput()
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['super'] = {
  init: function () {
    this.appendDummyInput()
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['sub'] = {
  init: function () {
    this.appendDummyInput()
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['code'] = {
  init: function () {
    this.appendDummyInput()
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

//   type: 'quote',
//   message0: 'quote %1 %2',
//   args0: [
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//     },
//   ],
//   previousStatement: null,
//   nextStatement: null,
//   colour: TEXT_STRUCTURE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },
// {
//   type: 'blockquote',
//   message0: 'blockquote %1 %2',
//   args0: [
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//     },
//   ],
//   previousStatement: null,
//   nextStatement: null,
//   colour: TEXT_STRUCTURE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },
// {
//   type: 'sample',
//   message0: 'sample output %1 %2',
//   args0: [
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//     },
//   ],
//   previousStatement: null,
//   nextStatement: null,
//   colour: TEXT_STRUCTURE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },
// {
//   type: 'keyboard',
//   message0: 'keyboard input %1 %2',
//   args0: [
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//     },
//   ],
//   previousStatement: null,
//   nextStatement: null,
//   colour: TEXT_STRUCTURE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },
// {
//   type: 'variable',
//   message0: 'variable %1 %2',
//   args0: [
//     {
//       type: 'input_dummy',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//     },
//   ],
//   previousStatement: null,
//   nextStatement: null,
//   colour: TEXT_STRUCTURE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },
// {
//   type: 'table',
//   message0: 'table %1 %2',
//   args0: [
//     {
//       type: 'input_value',
//       name: 'NAME',
//       check: 'attribute',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//       check: 'table',
//     },
//   ],
//   previousStatement: 'html',
//   nextStatement: 'html',
//   colour: TABLE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },
// {
//   type: 'tablerow',
//   message0: 'row %1 %2',
//   args0: [
//     {
//       type: 'input_value',
//       name: 'NAME',
//       check: 'attribute',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//       check: 'tablerow',
//     },
//   ],
//   previousStatement: 'table',
//   nextStatement: 'table',
//   colour: TABLE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },
// {
//   type: 'tablecell',
//   message0: 'entry %1 %2',
//   args0: [
//     {
//       type: 'input_value',
//       name: 'NAME',
//       check: 'attribute',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//       check: 'html',
//     },
//   ],
//   previousStatement: 'tablerow',
//   nextStatement: 'tablerow',
//   colour: TABLE_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },
// {
//   type: 'body_attributes',
//   message0: 'content %1 %2',
//   args0: [
//     {
//       type: 'input_value',
//       name: 'NAME',
//       check: 'attribute',
//     },
//     {
//       type: 'input_statement',
//       name: 'content',
//       check: 'html',
//     },
//   ],
//   previousStatement: 'document',
//   nextStatement: 'document',
//   colour: BASE_FRAME_HUE,
//   tooltip: '',
//   helpUrl: 'http://www.w3schools.com/tags/tag_html.asp',
// },

Blockly.Blocks['quote'] = {
  init: function () {
    this.appendDummyInput()
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['blockquote'] = {
  init: function () {
    this.appendDummyInput()
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['sample'] = {
  init: function () {
    this.appendDummyInput()
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['keyboard'] = {
  init: function () {
    this.appendDummyInput()
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['variable'] = {
  init: function () {
    this.appendDummyInput()
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['table'] = {
  init: function () {
    this.appendValueInput('NAME')
    this.appendStatementInput('content')
    this.setPreviousStatement(true, 'html')
    this.setNextStatement(true, 'html')
    this.setColour(TABLE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['tablerow'] = {
  init: function () {
    this.appendValueInput('NAME')
    this.appendStatementInput('content')
    this.setPreviousStatement(true, 'table')
    this.setNextStatement(true, 'table')
    this.setColour(TABLE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['tablecell'] = {
  init: function () {
    this.appendValueInput('NAME')
    this.appendStatementInput('content')
    this.setPreviousStatement(true, 'tablerow')
    this.setNextStatement(true, 'tablerow')
    this.setColour(TABLE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['body_attributes'] = {
  init: function () {
    this.appendValueInput('NAME')
    this.appendStatementInput('content')
    this.setPreviousStatement(true, 'document')
    this.setNextStatement(true, 'document')
    this.setColour(BASE_FRAME_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}
