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
}

export enum ConditionType {
  IS_PATH_FORWARD = 'isPathForward',
  IS_PATH_LEFT = 'isPathLeft',
  IS_PATH_RIGHT = 'isPathRight',
}

function parseCode(code: string) {
  const lines = code
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  return parseBlocks(lines)
}

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
        console.log(condition, id, actualCondition)
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
    } else {
      i++
    }
  }

  return blocks
}

function getBlock(lines: string[], startIndex: number): { block: string[]; nextLine: number } {
  const blockLines: string[] = []
  let i = startIndex + 1
  let openBrackets = 1

  // returns a block of code between two curly brackets excluding the lines with the brackets
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim().startsWith('}')) {
      // check if the bracket is not inside a string
      const isInsideString = line.match(/'.*}/)?.[0]
      if (!isInsideString) {
        openBrackets--
      }
    }

    if (openBrackets === 0) {
      break
    }

    if (line.trim().includes('{')) {
      // check if the bracket is not inside a string
      const isInsideString = line.match(/'.*{/)?.[0]
      if (!isInsideString) {
        openBrackets++
      }
    }
    if (openBrackets === 0) {
      break
    }
    blockLines.push(line)
    i++
  }

  return { block: blockLines, nextLine: i + 1 }
}

export { parseCode }
