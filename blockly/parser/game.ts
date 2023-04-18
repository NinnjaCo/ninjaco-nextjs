interface Block {
  type: string
  id?: string
  condition?: string
  body?: Block[]
  loopCount?: number
}

function parseCode(code: string) {
  const lines = code
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  console.log(lines)
  console.log(getBlock(lines, 0))
  return parseBlocks(lines)
}

function parseBlocks(lines: string[], currentLine = 0): Block[] {
  const blocks: Block[] = []
  let i = currentLine

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('if')) {
      const condition = line.match(/\((.*)\)/)?.[1]
      const block: Block = { type: 'if', condition }
      const { block: codeInsideTheIf, nextLine } = getBlock(lines, i)
      const parsedCodeIntoBlocks = parseBlocks(codeInsideTheIf)
      block.body = parsedCodeIntoBlocks
      blocks.push(block)
      i = nextLine
      const prevLineStr = lines[i - 1]
      if (prevLineStr && prevLineStr.includes('else')) {
        const block: Block = { type: 'else' }
        const { block: codeInsideTheElse, nextLine: nextLine2 } = getBlock(lines, i - 1)
        const parsedCodeIntoBlocks2 = parseBlocks(codeInsideTheElse)
        block.body = parsedCodeIntoBlocks2
        blocks.push(block)
        i = nextLine2
      }
    } else if (line.startsWith('for')) {
      const loopCount = parseInt(line.match(/<\s*(\d+)/)?.[1] ?? '0')
      const block: Block = { type: 'for', loopCount }
      const { block: codeInsideTheFor, nextLine } = getBlock(lines, i)
      const parsedCodeIntoBlocks = parseBlocks(codeInsideTheFor)
      block.body = parsedCodeIntoBlocks
      blocks.push(block)
      i = nextLine
    } else if (line.startsWith('moveForward')) {
      const id = line.match(/'([^']*)'/)?.[1]
      blocks.push({ type: 'moveForward', id })
      i++
    } else if (line.startsWith('turnLeft')) {
      const id = line.match(/'([^']*)'/)?.[1]
      blocks.push({ type: 'turnLeft', id })
      i++
    } else if (line.startsWith('turnRight')) {
      const id = line.match(/'([^']*)'/)?.[1]
      blocks.push({ type: 'turnRight', id })
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
        console.log('closing bracket', line, openBrackets)
        openBrackets--
      } else {
        console.log('closing bracket inside a string', line)
      }
    }

    if (openBrackets === 0) {
      break
    }

    if (line.trim().includes('{')) {
      // check if the bracket is not inside a string
      const isInsideString = line.match(/'.*{/)?.[0]
      if (!isInsideString) {
        console.log('opening bracket', line, openBrackets)
        openBrackets++
      } else {
        console.log('opening bracket inside a string', line)
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
