import * as Blockly from 'blockly/core'

export class HtmlGenerator extends Blockly.Generator {
  readonly ORDER_ATOMIC = 0
  readonly ORDER_NONE = 0
  constructor() {
    super('HTML')
  }
  scrub_(block: Blockly.Block, code: string, thisOnly: boolean) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock()
    const nextCode = this.blockToCode(nextBlock)
    return code + nextCode
  }
}

const htmlGenerator = new HtmlGenerator()

htmlGenerator['baseframe'] = function (block) {
  const statements_head = htmlGenerator.statementToCode(block, 'head')
  const statements_body = htmlGenerator.statementToCode(block, 'body')

  const code =
    '<!DOCTYPE HTML>\n<html>\n<head>\n  <meta charset="utf-8">\n' +
    statements_head +
    '</head>\n\n<body>\n' +
    statements_body +
    '</body>\n</html>\n'

  return code
}

htmlGenerator['html'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<!DOCTYPE HTML>\n<html>\n' + statements_content + '</html>\n'
  return code
}

htmlGenerator['body'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<body>\n' + statements_content + '</body>\n'
  return code
}

htmlGenerator['head'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<head>\n  <meta charset="utf-8">\n' + statements_content + '</head>\n'
  return code
}

htmlGenerator['title'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<title>' + statements_content.trim() + '</title>\n'
  return code
}

htmlGenerator['paragraph'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<p>\n' + statements_content + '</p>\n'
  return code
}

htmlGenerator['plaintext'] = function (block) {
  const text_content = block.getFieldValue('content')
  const code = text_content + '\n'
  return code
}

htmlGenerator['division'] = function (block) {
  const value_name = htmlGenerator.valueToCode(block, 'NAME', htmlGenerator.ORDER_ATOMIC)
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<div' + value_name + '>\n' + statements_content + '</div>\n'
  return code
}

htmlGenerator['style'] = function (block) {
  const statements_name = htmlGenerator.statementToCode(block, 'NAME')
  const code = ' style="' + statements_name.trim() + '"'
  return [code, htmlGenerator.ORDER_NONE]
}

htmlGenerator['color'] = function (block) {
  const colour_name = block.getFieldValue('NAME')
  const code = 'color: ' + colour_name + ';'
  return code
}

htmlGenerator['bgcolour'] = function (block) {
  const colour_name = block.getFieldValue('NAME')
  const code = 'background-color: ' + colour_name + ';'
  return code
}

htmlGenerator['genericstyle'] = function (block) {
  const text_property = block.getFieldValue('property')
  const text_value = block.getFieldValue('value')
  const code = text_property + ': ' + text_value + ';'
  return code
}

htmlGenerator['generictag'] = function (block) {
  const text_name = block.getFieldValue('NAME')
  const value_name = htmlGenerator.valueToCode(block, 'NAME', htmlGenerator.ORDER_ATOMIC)
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<' + text_name + value_name + '>\n' + statements_content + '</' + text_name + '>\n'
  return code
}

htmlGenerator['more_attributes'] = function (block) {
  const value_name1 = htmlGenerator.valueToCode(block, 'NAME1', htmlGenerator.ORDER_ATOMIC)
  const value_name2 = htmlGenerator.valueToCode(block, 'NAME2', htmlGenerator.ORDER_ATOMIC)
  const value_name3 = htmlGenerator.valueToCode(block, 'NAME3', htmlGenerator.ORDER_ATOMIC)
  const code = value_name1 + value_name2 + value_name3
  return [code, htmlGenerator.ORDER_NONE]
}

htmlGenerator['genericattribute'] = function (block) {
  const text_attribute = block.getFieldValue('attribute')
  const text_value = block.getFieldValue('value')
  const code = ' ' + text_attribute + '="' + text_value + '"'
  return [code, htmlGenerator.ORDER_NONE]
}

htmlGenerator['link'] = function (block) {
  const text_name = block.getFieldValue('NAME')
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<a href="' + text_name + '">' + statements_content.trim() + '</a>\n'
  return code
}

htmlGenerator['span'] = function (block) {
  const value_name = htmlGenerator.valueToCode(block, 'NAME', htmlGenerator.ORDER_ATOMIC)
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<span' + value_name + '>' + statements_content.trim() + '</span>\n'
  return code
}

htmlGenerator['image'] = function (block) {
  const text_image = block.getFieldValue('IMAGE')
  const text_alt = block.getFieldValue('ALT')
  const code = '<img src="' + text_image + '" alt="' + text_alt + '">\n'
  return code
}

htmlGenerator['emphasise'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<em>' + statements_content.trim() + '</em>\n'
  return code
}

htmlGenerator['strong'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<strong>' + statements_content.trim() + '</strong>\n'
  return code
}

htmlGenerator['headline'] = function (block) {
  const dropdown_name = block.getFieldValue('NAME')
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<' + dropdown_name + '>' + statements_content.trim() + '</' + dropdown_name + '>\n'
  return code
}

htmlGenerator['linebreak'] = function (block) {
  const code = '<br>\n'
  return code
}

htmlGenerator['horizontalbreak'] = function (block) {
  const code = '<hr>\n'
  return code
}

htmlGenerator['unorderedlist'] = function (block) {
  const statements_name = htmlGenerator.statementToCode(block, 'NAME')
  const code = '<ul>\n' + statements_name + '</ul>\n'
  return code
}

htmlGenerator['orderedlist'] = function (block) {
  const statements_name = htmlGenerator.statementToCode(block, 'NAME')
  const code = '<ol>\n' + statements_name + '</ol>\n'
  return code
}

htmlGenerator['listelement'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<li>' + statements_content + '</li>\n'
  return code
}

htmlGenerator['inserted'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<ins>' + statements_content.trim() + '</ins>\n'
  return code
}

htmlGenerator['deleted'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<del>' + statements_content.trim() + '</del>\n'
  return code
}

htmlGenerator['super'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<sup>' + statements_content.trim() + '</sup>\n'
  return code
}

htmlGenerator['sub'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<sub>' + statements_content.trim() + '</sub>\n'
  return code
}

htmlGenerator['code'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<code>\n' + statements_content + '</code>\n'
  return code
}

htmlGenerator['quote'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<q>' + statements_content.trim() + '</q>\n'
  return code
}

htmlGenerator['blockquote'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<blockquote>\n' + statements_content + '</blockquote>\n'
  return code
}

htmlGenerator['sample'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<samp>\n' + statements_content + '</samp>\n'
  return code
}

htmlGenerator['keyboard'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<kbd>\n' + statements_content + '</kbd>\n'
  return code
}

htmlGenerator['variable'] = function (block) {
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<var>' + statements_content.trim() + '</var>\n'
  return code
}

htmlGenerator['table'] = function (block) {
  const value_name = htmlGenerator.valueToCode(block, 'NAME', htmlGenerator.ORDER_ATOMIC)
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<table' + value_name + '>' + statements_content.trim() + '</table>'
  return code
}

htmlGenerator['tablerow'] = function (block) {
  const value_name = htmlGenerator.valueToCode(block, 'NAME', htmlGenerator.ORDER_ATOMIC)
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<tr' + value_name + '>' + statements_content.trim() + '</tr>'
  return code
}

htmlGenerator['tablecell'] = function (block) {
  const value_name = htmlGenerator.valueToCode(block, 'NAME', htmlGenerator.ORDER_ATOMIC)
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<td' + value_name + '>' + statements_content.trim() + '</td>'
  return code
}

htmlGenerator['body_attributes'] = function (block) {
  const value_name = htmlGenerator.valueToCode(block, 'NAME', htmlGenerator.ORDER_ATOMIC)
  const statements_content = htmlGenerator.statementToCode(block, 'content')
  const code = '<body' + value_name + '>\n' + statements_content + '</body>\n'
  return code
}

htmlGenerator.addReservedWords('html,head,body')

export { htmlGenerator }
