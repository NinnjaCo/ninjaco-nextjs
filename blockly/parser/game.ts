export interface BlockCode {
  type: string
  id?: string
  condition?: string
  body?: BlockCode[]
  loopCount?: number
}

export enum BlockType {
  MOVE_FORWARD = 'moveForward',
  TURN_LEFT = 'turnLeft',
  TURN_RIGHT = 'turnRight',
  IF = 'if',
  ELSE = 'else',
  FOR = 'for',
  WHILE = 'while',
}

export enum ConditionType {
  IS_PATH_FORWARD = 'isPathForward',
  IS_PATH_LEFT = 'isPathLeft',
  IS_PATH_RIGHT = 'isPathRight',
}

/**
 * @param {string} code
 * @returns {BlockCode[]}
 */
function parseCode(code: string) {
  const lines = code
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  return parseBlocks(lines)
}

/**
 * @param {string[]} lines
 * @param {number} currentLine
 * @returns {BlockCode[]}
 */
function parseBlocks(lines: string[], currentLine = 0): BlockCode[] {
  const blocks: BlockCode[] = []
  let i = currentLine

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('if')) {
      // isPathForward('block_id_5CoZ_`hU;XeKec`Y*NZA')
      const condition = line.match(/\((.*)\)/)?.[1]
      const actualCondition = condition?.match(/(\w+)\(/)?.[1]
      const id = condition?.match(/'([^']*)'/)?.[1]

      if (!id || !actualCondition) {
        throw new Error('Invalid condition')
      }

      const block: BlockCode = { type: BlockType.IF, condition: actualCondition, id }
      const { block: codeInsideTheIf, nextLine } = getBlock(lines, i)
      const parsedCodeIntoBlocks = parseBlocks(codeInsideTheIf)
      block.body = parsedCodeIntoBlocks
      blocks.push(block)
      i = nextLine
      const prevLineStr = lines[i - 1]
      if (prevLineStr && prevLineStr.includes('else')) {
        const block: BlockCode = { type: BlockType.ELSE, id }
        const { block: codeInsideTheElse, nextLine: nextLine2 } = getBlock(lines, i - 1)
        const parsedCodeIntoBlocks2 = parseBlocks(codeInsideTheElse)
        block.body = parsedCodeIntoBlocks2
        blocks.push(block)
        i = nextLine2
      }
    } else if (line.startsWith('for')) {
      const loopCount = parseInt(line.match(/<\s*(\d+)/)?.[1] ?? '0')
      const block: BlockCode = { type: BlockType.FOR, loopCount }
      const { block: codeInsideTheFor, nextLine } = getBlock(lines, i)
      const parsedCodeIntoBlocks = parseBlocks(codeInsideTheFor)
      block.body = parsedCodeIntoBlocks
      blocks.push(block)
      i = nextLine
    } else if (line.startsWith('moveForward')) {
      const id = line.match(/'([^']*)'/)?.[1]
      blocks.push({ type: BlockType.MOVE_FORWARD, id })
      i++
    } else if (line.startsWith('turnLeft')) {
      const id = line.match(/'([^']*)'/)?.[1]
      blocks.push({ type: BlockType.TURN_LEFT, id })
      i++
    } else if (line.startsWith('turnRight')) {
      const id = line.match(/'([^']*)'/)?.[1]
      blocks.push({ type: BlockType.TURN_RIGHT, id })
      i++
    } else if (line.startsWith('while')) {
      const block: BlockCode = { type: BlockType.WHILE }
      const { block: codeInsideTheWhile, nextLine } = getBlock(lines, i)
      const parsedCodeIntoBlocks = parseBlocks(codeInsideTheWhile)
      block.body = parsedCodeIntoBlocks
      blocks.push(block)
      i = nextLine
    } else {
      i++
    }
  }

  return blocks
}

/**
 * Returns a block of code between two curly brackets excluding the lines with the brackets
 * @param lines
 * @param startIndex
 * @returns { block: string[]; nextLine: number}
 * @note only call it on a line that starts with a curly bracket
 */
function getBlock(lines: string[], startIndex: number): { block: string[]; nextLine: number } {
  const blockLines: string[] = []
  let i = startIndex + 1
  let openBrackets = 1

  // returns a block of code between two curly brackets excluding the lines with the brackets
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim().startsWith('}')) {
      openBrackets--
    }

    if (openBrackets === 0) {
      break
    }

    if (line.trim().endsWith('{')) {
      openBrackets++
    }
    if (openBrackets === 0) {
      break
    }
    blockLines.push(line)
    i++
  }

  return { block: blockLines, nextLine: i + 1 }
}

/**
 * Removes parameters from all functions except if and for
 * e.g. moveForward('block_id_5CoZ_`hU;XeKec`Y*NZA') => moveForward()
 * @param code
 * @returns string
 */
const prettifyCode = (code: string) => {
  // remove prameters from all functions except if and for
  // e.g. moveForward('block_id_5CoZ_`hU;XeKec`Y*NZA') => moveForward()

  const codeWithoutParams = code.replace(/(\w+)\('([^']*)'\)/g, '$1()')

  return codeWithoutParams
}

export { parseCode, prettifyCode }
