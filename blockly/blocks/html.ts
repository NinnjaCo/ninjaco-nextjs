import { BlocksDefinition } from '@/components/blockly/blockly'
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

export const htmlBlocks: BlocksDefinition = Blockly.common.createBlockDefinitionsFromJsonArray([])

Blockly.Blocks['baseframe'] = {
  init: function () {
    this.appendDummyInput().appendField('document')
    this.appendDummyInput().appendField('header')
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
    this.appendDummyInput().appendField('document')
    this.appendStatementInput('content').setCheck('document')
    this.setColour(BASE_FRAME_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['body'] = {
  init: function () {
    this.appendDummyInput().appendField('content')
    this.appendStatementInput('content').setCheck('html')
    this.setPreviousStatement(true, 'document')
    this.setNextStatement(true, 'document')
    this.setColour(BASE_FRAME_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

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

Blockly.Blocks['plaintext'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('text')
      .appendField(new Blockly.FieldTextInput(''), 'content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['division'] = {
  init: function () {
    this.appendValueInput('NAME').setCheck('attribute').appendField('division')
    this.appendStatementInput('content').setCheck('html')
    this.setPreviousStatement(true, 'html')
    this.setNextStatement(true, 'html')
    this.setColour(BLOCKS_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

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
Blockly.Blocks['color'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('text colour : ')
      .appendField(new Blockly.FieldColour('#ff0000'), 'NAME')
    this.setPreviousStatement(true, 'css')
    this.setNextStatement(true, 'css')
    this.setColour(STYLE_HUE)
    this.setTooltip('')
    this.setHelpUrl('')
  },
}

Blockly.Blocks['bgcolour'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('background colour : ')
      .appendField(new Blockly.FieldColour('#ff0000'), 'NAME')
    this.setPreviousStatement(true, 'css')
    this.setNextStatement(true, 'css')
    this.setColour(STYLE_HUE)
    this.setTooltip('')
    this.setHelpUrl('')
  },
}

Blockly.Blocks['genericstyle'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('property'), 'property')
      .appendField(':')
      .appendField(new Blockly.FieldTextInput('value'), 'value')
    this.setPreviousStatement(true, 'css')
    this.setNextStatement(true, 'css')
    this.setColour(STYLE_HUE)
    this.setTooltip('')
    this.setHelpUrl('')
  },
}

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

Blockly.Blocks['span'] = {
  init: function () {
    this.appendValueInput('NAME').setCheck('attribute').appendField('span')
    this.appendStatementInput('content').setCheck('html')
    this.setPreviousStatement(true, 'html')
    this.setNextStatement(true, 'html')
    this.setColour(BLOCKS_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

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

Blockly.Blocks['emphasise'] = {
  init: function () {
    this.appendDummyInput().appendField('emphasise')
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['strong'] = {
  init: function () {
    this.appendDummyInput().appendField('important')
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['headline'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('headline')
      .appendField(
        new Blockly.FieldDropdown([
          ['level 1', 'h1'],
          ['level 2', 'h2'],
          ['level 3', 'h3'],
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

Blockly.Blocks['unorderedlist'] = {
  init: function () {
    this.appendDummyInput().appendField('unordered list')
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
    this.appendDummyInput().appendField('ordered list')
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
    this.appendDummyInput().appendField('list item')
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['inserted'] = {
  init: function () {
    this.appendDummyInput().appendField('inserted')
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
    this.appendDummyInput().appendField('deleted')
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
    this.appendDummyInput().appendField('superscript')
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
    this.appendDummyInput().appendField('subscript')
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
    this.appendDummyInput().appendField('code')
    this.appendStatementInput('content')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(TEXT_STRUCTURE_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}

Blockly.Blocks['quote'] = {
  init: function () {
    this.appendDummyInput().appendField('quote')
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
    this.appendDummyInput().appendField('blockquote')
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
    this.appendDummyInput().appendField('sample output')
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
    this.appendDummyInput().appendField('keyboard input')
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
    this.appendDummyInput().appendField('variable')
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
    this.appendValueInput('NAME').appendField('table')
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
    this.appendValueInput('NAME').appendField('row')
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
    this.appendValueInput('NAME').appendField('entry')
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
    this.appendValueInput('NAME').appendField('content')
    this.appendStatementInput('content')
    this.setPreviousStatement(true, 'document')
    this.setNextStatement(true, 'document')
    this.setColour(BASE_FRAME_HUE)
    this.setTooltip('')
    this.setHelpUrl('http://www.w3schools.com/tags/tag_html.asp')
  },
}
