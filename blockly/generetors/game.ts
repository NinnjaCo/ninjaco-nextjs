import * as Blockly from 'blockly'

export class GameGenerator extends Blockly.Generator {
  constructor() {
    super('Game')
  }
  scrub_(block: Blockly.Block, code: string, thisOnly: boolean) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock()
    if (nextBlock && !thisOnly) {
      return code + '\n' + this.blockToCode(nextBlock)
    }
    return code
  }

  maze_moveForward(block: Blockly.Block) {}
  maze_turn(block: Blockly.Block) {}
  maze_if(block: Blockly.Block) {}
  maze_ifElse(block: Blockly.Block) {}
  maze_forever(block: Blockly.Block) {}
  maze_repeat(block: Blockly.Block) {}
}

const gameGenerator = new GameGenerator()

gameGenerator['maze_moveForward'] = function (block) {
  return `moveForward('block_id_${block.id}');\n`
}

gameGenerator['maze_turn'] = function (block) {
  return `${block.getFieldValue('DIR')}('block_id_${block.id}');\n`
}

gameGenerator['maze_if'] = function (block) {
  const argument = `${block.getFieldValue('DIR')}('block_id_${block.id}')`
  const branch = gameGenerator.statementToCode(block, 'DO')
  return `if (${argument}) {\n${branch}}\n`
}

gameGenerator['maze_ifElse'] = function (block) {
  const argument = `${block.getFieldValue('DIR')}('block_id_${block.id}')`
  const branch0 = gameGenerator.statementToCode(block, 'DO')
  const branch1 = gameGenerator.statementToCode(block, 'ELSE')
  return `if (${argument}) {\n${branch0}} else {\n${branch1}}\n`
}

gameGenerator['maze_forever'] = function (block) {
  let branch = gameGenerator.statementToCode(block, 'DO')
  if (gameGenerator.INFINITE_LOOP_TRAP) {
    branch = gameGenerator.INFINITE_LOOP_TRAP.replace(/%1/g, `'block_id_${block.id}'`) + branch
  }
  return `while (notDone()) {\n${branch}}\n`
}

gameGenerator['maze_repeat'] = function (block) {
  const argument = block.getFieldValue('TIMES')
  let branch = gameGenerator.statementToCode(block, 'DO')
  if (gameGenerator.INFINITE_LOOP_TRAP) {
    branch = gameGenerator.INFINITE_LOOP_TRAP.replace(/%1/g, `'block_id_${block.id}'`) + branch
  }
  return `for (let i = 0; i < ${argument}; i++) {\n${branch}}\n`
}

gameGenerator.addReservedWords(
  'moveForward,moveBackward,' +
    'turnRight,turnLeft,isPathForward,isPathRight,isPathBackward,isPathLeft'
)

export { gameGenerator }
