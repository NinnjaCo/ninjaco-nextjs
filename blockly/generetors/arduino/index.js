import Blockly from 'blockly'

/**
 * Arduino code generator.
 * @type !Blockly.Generator
 */
Blockly.Arduino = new Blockly.Generator('Arduino')

const arduinoGenerator = Blockly.Arduino

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
arduinoGenerator.addReservedWords(
  // http://arduino.cc/en/Reference/HomePage
  'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,interger, constants,floating,point,void,bookean,char,unsigned,byte,int,word,long,float,double,string,String,array,static, volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts'
)

/**
 * Order of operation ENUMs.
 *
 */
arduinoGenerator.ORDER_ATOMIC = 0 // 0 "" ...
arduinoGenerator.ORDER_UNARY_POSTFIX = 1 // expr++ expr-- () [] .
arduinoGenerator.ORDER_UNARY_PREFIX = 2 // -expr !expr ~expr ++expr --expr
arduinoGenerator.ORDER_MULTIPLICATIVE = 3 // * / % ~/
arduinoGenerator.ORDER_ADDITIVE = 4 // + -
arduinoGenerator.ORDER_SHIFT = 5 // << >>
arduinoGenerator.ORDER_RELATIONAL = 6 // is is! >= > <= <
arduinoGenerator.ORDER_EQUALITY = 7 // == != === !==
arduinoGenerator.ORDER_BITWISE_AND = 8 // &
arduinoGenerator.ORDER_BITWISE_XOR = 9 // ^
arduinoGenerator.ORDER_BITWISE_OR = 10 // |
arduinoGenerator.ORDER_LOGICAL_NOT = 10 // !
arduinoGenerator.ORDER_LOGICAL_AND = 11 // &&
arduinoGenerator.ORDER_LOGICAL_OR = 12 // ||
arduinoGenerator.ORDER_CONDITIONAL = 13 // expr ? expr : expr
arduinoGenerator.ORDER_ASSIGNMENT = 14 // = *= /= ~/= %= += -= <<= >>= &= ^= |=
arduinoGenerator.ORDER_NONE = 99 // (...)

/*
 * Arduino Board profiles
 *
 */
const profile = {
  arduino: {
    description: 'Arduino standard-compatible board',
    digital: [
      ['1', '1'],
      ['2', '2'],
      ['3', '3'],
      ['4', '4'],
      ['5', '5'],
      ['6', '6'],
      ['7', '7'],
      ['8', '8'],
      ['9', '9'],
      ['10', '10'],
      ['11', '11'],
      ['12', '12'],
      ['13', '13'],
      ['A0', 'A0'],
      ['A1', 'A1'],
      ['A2', 'A2'],
      ['A3', 'A3'],
      ['A4', 'A4'],
      ['A5', 'A5'],
    ],
    analog: [
      ['A0', 'A0'],
      ['A1', 'A1'],
      ['A2', 'A2'],
      ['A3', 'A3'],
      ['A4', 'A4'],
      ['A5', 'A5'],
    ],
    serial: 9600,
  },
  arduino_mega: {
    description: 'Arduino Mega-compatible board',
    //53 digital
    //15 analog
  },
}
//set default profile to arduino standard-compatible board
profile['default'] = profile['arduino']
//alert(profile.default.digital[0]);

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
arduinoGenerator.init = function (workspace) {
  // Create a dictionary of definitions to be printed before setups.
  arduinoGenerator.definitions_ = Object.create(null)
  // Create a dictionary of setups to be printed before the code.
  arduinoGenerator.setups_ = Object.create(null)

  if (!arduinoGenerator.nameDB_) {
    arduinoGenerator.nameDB_ = new Blockly.Names(arduinoGenerator.RESERVED_WORDS_)
  } else {
    arduinoGenerator.nameDB_.reset()
  }

  const defvars = []
  const variables = workspace.getAllVariables()

  for (let x = 0; x < variables.length; x++) {
    defvars[x] =
      'int ' +
      arduinoGenerator.nameDB_.getName(variables[x].name, Blockly.Variables.NAME_TYPE) +
      ';'
  }
  arduinoGenerator.definitions_['variables'] = defvars.join('\n')
}

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
arduinoGenerator.finish = function (code) {
  // Indent every line.
  code = '  ' + code.replace(/\n/g, '\n  ')
  code = code.replace(/\n\s+$/, '\n')
  code = 'void loop() \n{\n' + code + '\n}'

  // Convert the definitions dictionary into a list.
  const imports = []
  const definitions = []
  for (let name in arduinoGenerator.definitions_) {
    const def = arduinoGenerator.definitions_[name]
    if (def.match(/^#include/)) {
      imports.push(def)
    } else {
      definitions.push(def)
    }
  }

  // Convert the setups dictionary into a list.
  const setups = []
  for (let name_ in arduinoGenerator.setups_) {
    setups.push(arduinoGenerator.setups_[name_])
  }

  const allDefs =
    imports.join('\n') +
    '\n\n' +
    definitions.join('\n') +
    '\nvoid setup() \n{\n  ' +
    setups.join('\n  ') +
    '\n}' +
    '\n\n'
  return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code
}

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
arduinoGenerator.scrubNakedValue = function (line) {
  return line + ';\n'
}

/**
 * Encode a string as a properly escaped Arduino string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Arduino string.
 * @private
 */
arduinoGenerator.quote_ = function (string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\\n')
    .replace(/\$/g, '\\$')
    .replace(/'/g, "\\'")
  return '"' + string + '"'
}

/**
 * Common tasks for generating Arduino from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Arduino code created for this block.
 * @return {string} Arduino code with comments and subsequent blocks added.
 * @private
 */
arduinoGenerator.scrub_ = function (block, code) {
  if (code === null) {
    // Block has handled code generation itself.
    return ''
  }
  let commentCode = ''
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    let comment = block.getCommentText()
    if (comment) {
      commentCode += arduinoGenerator.prefixLines(comment, '// ') + '\n'
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (let x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        const childBlock = block.inputList[x].connection.targetBlock()
        if (childBlock) {
          let comment = arduinoGenerator.allNestedComments(childBlock)
          if (comment) {
            commentCode += arduinoGenerator.prefixLines(comment, '// ')
          }
        }
      }
    }
  }
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock()
  const nextCode = arduinoGenerator.blockToCode(nextBlock)
  return commentCode + code + nextCode
}

arduinoGenerator['base_delay'] = function () {
  var delay_time =
    arduinoGenerator.valueToCode(this, 'DELAY_TIME', arduinoGenerator.ORDER_ATOMIC) || '1000'
  var code = 'delay(' + delay_time + ');\n'
  return code
}

arduinoGenerator['base_map'] = function () {
  var value_num = arduinoGenerator.valueToCode(this, 'NUM', arduinoGenerator.ORDER_NONE)
  var value_dmax = arduinoGenerator.valueToCode(this, 'DMAX', arduinoGenerator.ORDER_ATOMIC)
  var code = 'map(' + value_num + ', 0, 1024, 0, ' + value_dmax + ')'
  return [code, arduinoGenerator.ORDER_NONE]
}

arduinoGenerator['inout_buildin_led'] = function () {
  var dropdown_stat = this.getFieldValue('STAT')
  arduinoGenerator.setups_['setup_output_13'] = 'pinMode(13, OUTPUT);'
  var code = 'digitalWrite(13, ' + dropdown_stat + ');\n'
  return code
}

arduinoGenerator['inout_digital_write'] = function () {
  var dropdown_pin = this.getFieldValue('PIN')
  var dropdown_stat = this.getFieldValue('STAT')
  arduinoGenerator.setups_['setup_output_' + dropdown_pin] =
    'pinMode(' + dropdown_pin + ', OUTPUT);'
  var code = 'digitalWrite(' + dropdown_pin + ', ' + dropdown_stat + ');\n'
  return code
}

arduinoGenerator['inout_digital_read'] = function () {
  var dropdown_pin = this.getFieldValue('PIN')
  arduinoGenerator.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);'
  var code = 'digitalRead(' + dropdown_pin + ')'
  return [code, arduinoGenerator.ORDER_ATOMIC]
}

arduinoGenerator['inout_analog_write'] = function () {
  var dropdown_pin = this.getFieldValue('PIN')
  //var dropdown_stat = this.getFieldValue('STAT');
  var value_num = arduinoGenerator.valueToCode(this, 'NUM', arduinoGenerator.ORDER_ATOMIC)
  //arduinoGenerator.setups_['setup_output'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);';
  var code = 'analogWrite(' + dropdown_pin + ', ' + value_num + ');\n'
  return code
}

arduinoGenerator['inout_analog_read'] = function () {
  var dropdown_pin = this.getFieldValue('PIN')
  //arduinoGenerator.setups_['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
  var code = 'analogRead(' + dropdown_pin + ')'
  return [code, arduinoGenerator.ORDER_ATOMIC]
}

arduinoGenerator['inout_tone'] = function () {
  var dropdown_pin = this.getFieldValue('PIN')
  var value_num = arduinoGenerator.valueToCode(this, 'NUM', arduinoGenerator.ORDER_ATOMIC)
  arduinoGenerator.setups_['setup_output' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);'
  var code = 'tone(' + dropdown_pin + ', ' + value_num + ');\n'
  return code
}

arduinoGenerator['inout_notone'] = function () {
  var dropdown_pin = this.getFieldValue('PIN')
  arduinoGenerator.setups_['setup_output' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);'
  var code = 'noTone(' + dropdown_pin + ');\n'
  return code
}

arduinoGenerator['inout_highlow'] = function () {
  // Boolean values HIGH and LOW.
  var code = this.getFieldValue('BOOL') == 'HIGH' ? 'HIGH' : 'LOW'
  return [code, arduinoGenerator.ORDER_ATOMIC]
}

/*
//servo
#include <Servo.h>

Servo servo_11;

void setup() {
  servo_11.attach(11);
}

void loop() {
servo_11.write(0);

servo_11.write(150); //0~180
}
*/
arduinoGenerator['servo_move'] = function () {
  var dropdown_pin = this.getFieldValue('PIN')
  var value_degree = arduinoGenerator.valueToCode(this, 'DEGREE', arduinoGenerator.ORDER_ATOMIC)

  arduinoGenerator.definitions_['define_servo'] = '#include <Servo.h>\n'
  arduinoGenerator.definitions_['var_servo' + dropdown_pin] = 'Servo servo_' + dropdown_pin + ';\n'
  arduinoGenerator.setups_['setup_servo_' + dropdown_pin] =
    'servo_' + dropdown_pin + '.attach(' + dropdown_pin + ');\n'

  var code = 'servo_' + dropdown_pin + '.write(' + value_degree + ');\n'
  return code
}

arduinoGenerator['servo_read_degrees'] = function () {
  var dropdown_pin = this.getFieldValue('PIN')

  arduinoGenerator.definitions_['define_servo'] = '#include <Servo.h>\n'
  arduinoGenerator.definitions_['var_servo' + dropdown_pin] = 'Servo servo_' + dropdown_pin + ';\n'
  arduinoGenerator.setups_['setup_servo_' + dropdown_pin] =
    'servo_' + dropdown_pin + '.attach(' + dropdown_pin + ');\n'

  var code = 'servo_' + dropdown_pin + '.read()'
  return code
}

arduinoGenerator['serial_print'] = function () {
  var content = arduinoGenerator.valueToCode(this, 'CONTENT', arduinoGenerator.ORDER_ATOMIC) || '0'
  //content = content.replace('(','').replace(')','');

  arduinoGenerator.setups_['setup_serial_' + profile.default.serial] =
    'Serial.begin(' + profile.default.serial + ');\n'

  var code = 'Serial.println(' + content + ');\n'
  return code
}

arduinoGenerator['controls_if'] = function () {
  // If/elseif/else condition.
  var n = 0
  var argument =
    arduinoGenerator.valueToCode(this, 'IF' + n, arduinoGenerator.ORDER_NONE) || 'false'
  var branch = arduinoGenerator.statementToCode(this, 'DO' + n)
  var code = 'if (' + argument + ') {\n' + branch + '\n}'
  for (n = 1; n <= this.elseifCount_; n++) {
    argument = arduinoGenerator.valueToCode(this, 'IF' + n, arduinoGenerator.ORDER_NONE) || 'false'
    branch = arduinoGenerator.statementToCode(this, 'DO' + n)
    code += ' else if (' + argument + ') {\n' + branch + '}'
  }
  if (this.elseCount_) {
    branch = arduinoGenerator.statementToCode(this, 'ELSE')
    code += ' else {\n' + branch + '\n}'
  }
  return code + '\n'
}

arduinoGenerator['logic_compare'] = function () {
  // Comparison operator.
  var mode = this.getFieldValue('OP')
  var operator = arduinoGenerator.logic_compare.OPERATORS[mode]
  var order =
    operator == '==' || operator == '!='
      ? arduinoGenerator.ORDER_EQUALITY
      : arduinoGenerator.ORDER_RELATIONAL
  var argument0 = arduinoGenerator.valueToCode(this, 'A', order) || '0'
  var argument1 = arduinoGenerator.valueToCode(this, 'B', order) || '0'
  var code = argument0 + ' ' + operator + ' ' + argument1
  return [code, order]
}

arduinoGenerator.logic_compare.OPERATORS = {
  EQ: '==',
  NEQ: '!=',
  LT: '<',
  LTE: '<=',
  GT: '>',
  GTE: '>=',
}

arduinoGenerator['logic_operation'] = function () {
  // Operations 'and', 'or'.
  var operator = this.getFieldValue('OP') == 'AND' ? '&&' : '||'
  var order =
    operator == '&&' ? arduinoGenerator.ORDER_LOGICAL_AND : arduinoGenerator.ORDER_LOGICAL_OR
  var argument0 = arduinoGenerator.valueToCode(this, 'A', order) || 'false'
  var argument1 = arduinoGenerator.valueToCode(this, 'B', order) || 'false'
  var code = argument0 + ' ' + operator + ' ' + argument1
  return [code, order]
}

arduinoGenerator['logic_negate'] = function () {
  // Negation.
  var order = arduinoGenerator.ORDER_UNARY_PREFIX
  var argument0 = arduinoGenerator.valueToCode(this, 'BOOL', order) || 'false'
  var code = '!' + argument0
  return [code, order]
}

arduinoGenerator['logic_boolean'] = function () {
  // Boolean values true and false.
  var code = this.getFieldValue('BOOL') == 'TRUE' ? 'true' : 'false'
  return [code, arduinoGenerator.ORDER_ATOMIC]
}

arduinoGenerator['logic_null'] = function () {
  var code = 'NULL'
  return [code, arduinoGenerator.ORDER_ATOMIC]
}

arduinoGenerator['controls_for'] = function () {
  // For loop.
  const variables = Blockly.Workspace.getAll()[0].getAllVariables()
  const varId = this.getFieldValue('VAR')

  const variable0 = variables.find((v) => v.id_ === varId).name
  let argument0 =
    arduinoGenerator.valueToCode(this, 'FROM', arduinoGenerator.ORDER_ASSIGNMENT) || '0'
  let argument1 = arduinoGenerator.valueToCode(this, 'TO', arduinoGenerator.ORDER_ASSIGNMENT) || '0'
  let branch = arduinoGenerator.statementToCode(this, 'DO')
  if (arduinoGenerator.INFINITE_LOOP_TRAP) {
    branch = arduinoGenerator.INFINITE_LOOP_TRAP.replace(/%1/g, "'" + this.id + "'") + branch
  }
  let code
  if (argument0.match(/^-?\d+(\.\d+)?$/) && argument1.match(/^-?\d+(\.\d+)?$/)) {
    // Both arguments are simple numbers.
    let up = parseFloat(argument0) <= parseFloat(argument1)
    code =
      'for (' +
      variable0 +
      ' = ' +
      argument0 +
      '; ' +
      variable0 +
      (up ? ' <= ' : ' >= ') +
      argument1 +
      '; ' +
      variable0 +
      (up ? '++' : '--') +
      ') {\n' +
      branch +
      '}\n'
  } else {
    code = ''
    // Cache non-trivial values to variables to prevent repeated look-ups.
    let startVar = argument0
    if (!argument0.match(/^\w+$/) && !argument0.match(/^-?\d+(\.\d+)?$/)) {
      let startVar = arduinoGenerator.nameDB_.getDistinctName(
        variable0 + '_start',
        Blockly.Variables.NAME_TYPE
      )
      code += 'int ' + startVar + ' = ' + argument0 + ';\n'
    }
    let endVar = argument1
    if (!argument1.match(/^\w+$/) && !argument1.match(/^-?\d+(\.\d+)?$/)) {
      let endVar = arduinoGenerator.nameDB_.getDistinctName(
        variable0 + '_end',
        Blockly.Variables.NAME_TYPE
      )
      code += 'int ' + endVar + ' = ' + argument1 + ';\n'
    }
    code +=
      'for (' +
      variable0 +
      ' = ' +
      startVar +
      ';\n' +
      '    (' +
      startVar +
      ' <= ' +
      endVar +
      ') ? ' +
      variable0 +
      ' <= ' +
      endVar +
      ' : ' +
      variable0 +
      ' >= ' +
      endVar +
      ';\n' +
      '    ' +
      variable0 +
      ' += (' +
      startVar +
      ' <= ' +
      endVar +
      ') ? 1 : -1) {\n' +
      branch +
      '}\n'
  }
  return code
}

arduinoGenerator['controls_whileUntil'] = function () {
  // Do while/until loop.
  let until = this.getFieldValue('MODE') == 'UNTIL'
  let argument0 =
    arduinoGenerator.valueToCode(
      this,
      'BOOL',
      until ? arduinoGenerator.ORDER_LOGICAL_NOT : arduinoGenerator.ORDER_NONE
    ) || 'false'
  let branch = arduinoGenerator.statementToCode(this, 'DO')
  if (arduinoGenerator.INFINITE_LOOP_TRAP) {
    branch = arduinoGenerator.INFINITE_LOOP_TRAP.replace(/%1/g, "'" + this.id + "'") + branch
  }
  if (until) {
    argument0 = '!' + argument0
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n'
}

arduinoGenerator['procedures_defreturn'] = function () {
  // Define a procedure with a return value.
  let funcName = arduinoGenerator.nameDB_.getName(
    this.getFieldValue('NAME'),
    Blockly.Procedures.NAME_TYPE
  )
  let branch = arduinoGenerator.statementToCode(this, 'STACK')
  if (arduinoGenerator.INFINITE_LOOP_TRAP) {
    branch = arduinoGenerator.INFINITE_LOOP_TRAP.replace(/%1/g, "'" + this.id + "'") + branch
  }
  let returnValue = arduinoGenerator.valueToCode(this, 'RETURN', arduinoGenerator.ORDER_NONE) || ''
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n'
  }
  let returnType = returnValue ? 'int' : 'void'
  let args = []
  for (let x = 0; x < this.arguments_.length; x++) {
    args[x] =
      'int ' + arduinoGenerator.nameDB_.getName(this.arguments_[x], Blockly.Variables.NAME_TYPE)
  }
  let code =
    returnType + ' ' + funcName + '(' + args.join(', ') + ') {\n' + branch + returnValue + '}\n'
  code = arduinoGenerator.scrub_(this, code)
  arduinoGenerator.definitions_[funcName] = code
  return null
}

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
arduinoGenerator['procedures_defnoreturn'] = arduinoGenerator['procedures_defreturn']

arduinoGenerator['procedures_callreturn'] = function () {
  // Call a procedure with a return value.
  let funcName = arduinoGenerator.nameDB_.getName(
    this.getFieldValue('NAME'),
    Blockly.Procedures.NAME_TYPE
  )
  let args = []
  for (let x = 0; x < this.arguments_.length; x++) {
    args[x] = arduinoGenerator.valueToCode(this, 'ARG' + x, arduinoGenerator.ORDER_NONE) || 'null'
  }
  let code = funcName + '(' + args.join(', ') + ')'
  return [code, arduinoGenerator.ORDER_UNARY_POSTFIX]
}

arduinoGenerator['procedures_callnoreturn'] = function () {
  // Call a procedure with no return value.
  let funcName = arduinoGenerator.nameDB_.getName(
    this.getFieldValue('NAME'),
    Blockly.Procedures.NAME_TYPE
  )
  let args = []
  for (let x = 0; x < this.arguments_.length; x++) {
    args[x] = arduinoGenerator.valueToCode(this, 'ARG' + x, arduinoGenerator.ORDER_NONE) || 'null'
  }
  let code = funcName + '(' + args.join(', ') + ');\n'
  return code
}

arduinoGenerator['procedures_ifreturn'] = function () {
  // Conditionally return value from a procedure.
  let condition =
    arduinoGenerator.valueToCode(this, 'CONDITION', arduinoGenerator.ORDER_NONE) || 'false'
  let code = 'if (' + condition + ') {\n'
  if (this.hasReturnValue_) {
    let value = arduinoGenerator.valueToCode(this, 'VALUE', arduinoGenerator.ORDER_NONE) || 'null'
    code += '  return ' + value + ';\n'
  } else {
    code += '  return;\n'
  }
  code += '}\n'
  return code
}

arduinoGenerator['text'] = function () {
  // Text value.
  var code = arduinoGenerator.quote_(this.getFieldValue('TEXT'))
  return [code, arduinoGenerator.ORDER_ATOMIC]
}

arduinoGenerator['math_number'] = function () {
  // Numeric value.
  var code = window.parseFloat(this.getFieldValue('NUM'))
  // -4.abs() returns -4 in Dart due to strange order of operation choices.
  // -4 is actually an operator and a number.  Reflect this in the order.
  var order = code < 0 ? arduinoGenerator.ORDER_UNARY_PREFIX : arduinoGenerator.ORDER_ATOMIC
  return [code, order]
}

arduinoGenerator['math_arithmetic'] = function () {
  // Basic arithmetic operators, and power.
  var mode = this.getFieldValue('OP')
  var tuple = arduinoGenerator.math_arithmetic.OPERATORS[mode]
  var operator = tuple[0]
  var order = tuple[1]
  var argument0 = arduinoGenerator.valueToCode(this, 'A', order) || '0'
  var argument1 = arduinoGenerator.valueToCode(this, 'B', order) || '0'
  var code
  if (!operator) {
    code = 'Math.pow(' + argument0 + ', ' + argument1 + ')'
    return [code, arduinoGenerator.ORDER_UNARY_POSTFIX]
  }
  code = argument0 + operator + argument1
  return [code, order]
}

arduinoGenerator['math_arithmetic'].OPERATORS = {
  ADD: [' + ', arduinoGenerator.ORDER_ADDITIVE],
  MINUS: [' - ', arduinoGenerator.ORDER_ADDITIVE],
  MULTIPLY: [' * ', arduinoGenerator.ORDER_MULTIPLICATIVE],
  DIVIDE: [' / ', arduinoGenerator.ORDER_MULTIPLICATIVE],
  POWER: [null, arduinoGenerator.ORDER_NONE], // Handle power separately.
}

arduinoGenerator['math_change'] = function () {
  // Add to a variable in place.
  const argument0 =
    arduinoGenerator.valueToCode(this, 'DELTA', arduinoGenerator.ORDER_ADDITIVE) || '0'
  const varName = arduinoGenerator.nameDB_.getName(
    this.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE
  )
  return (
    varName + ' = (typeof ' + varName + " == 'number' ? " + varName + ' : 0) + ' + argument0 + ';\n'
  )
}

arduinoGenerator['variables_get'] = function () {
  // Variable getter.

  const variables = Blockly.Workspace.getAll()[0].getAllVariables()
  const varId = this.getFieldValue('VAR')

  const code = variables.find((v) => v.id_ === varId).name
  return [code, arduinoGenerator.ORDER_ATOMIC]
}

arduinoGenerator['variables_declare'] = function () {
  // Variable setter.
  const dropdown_type = this.getFieldValue('TYPE')
  //TODO: settype to variable
  const argument0 =
    arduinoGenerator.valueToCode(this, 'VALUE', arduinoGenerator.ORDER_ASSIGNMENT) || '0'

  const variables = Blockly.Workspace.getAll()[0].getAllVariables()
  const varId = this.getFieldValue('VAR')

  const varName = variables.find((v) => v.id_ === varId).name
  arduinoGenerator.setups_['setup_var' + varName] = varName + ' = ' + argument0 + ';\n'
  return ''
}

arduinoGenerator['variables_set'] = function () {
  // Variable setter.
  const argument0 =
    arduinoGenerator.valueToCode(this, 'VALUE', arduinoGenerator.ORDER_ASSIGNMENT) || '0'

  const variables = Blockly.Workspace.getAll()[0].getAllVariables()
  const varId = this.getFieldValue('VAR')

  const varName = variables.find((v) => v.id_ === varId).name
  return varName + ' = ' + argument0 + ';\n'
}

const _get_next_pin = function (dropdown_pin) {
  var NextPIN = dropdown_pin
  if (parseInt(NextPIN)) {
    NextPIN = parseInt(dropdown_pin) + 1
  } else {
    NextPIN = 'A' + (parseInt(NextPIN.slice(1, NextPIN.length)) + 1)
  }
  //check if NextPIN in bound
  var pinlen = profile.default.digital.length
  var notExist = true
  for (var i = 0; i < pinlen; i++) {
    if (profile.default.digital[i][1] == NextPIN) {
      notExist = false
    }
  }
  if (notExist) {
    alert('Grove Sensor needs PIN#+1 port, current setting is out of bound.')
    return null
  } else {
    return NextPIN
  }
}

arduinoGenerator['grove_serial_lcd_print'] = function () {
  var dropdown_pin = this.getFieldValue('PIN')
  var text = Blockly.Arduino.valueToCode(this, 'TEXT', Blockly.Arduino.ORDER_UNARY_POSTFIX) || "''"
  var text2 =
    Blockly.Arduino.valueToCode(this, 'TEXT2', Blockly.Arduino.ORDER_UNARY_POSTFIX) || "''"
  var delay_time =
    Blockly.Arduino.valueToCode(this, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000'
  /*if(text.length>16||text2.length>16){
      alert("string is too long");
  }*/
  Blockly.Arduino.definitions_['define_seriallcd'] = '#include <SerialLCD.h>\n'
  Blockly.Arduino.definitions_['define_softwareserial'] = '#include <SoftwareSerial.h>\n'
  //generate PIN#+1 port
  var NextPIN = _get_next_pin(dropdown_pin)

  Blockly.Arduino.definitions_['var_lcd_' + dropdown_pin] =
    'SerialLCD slcd_' + dropdown_pin + '(' + dropdown_pin + ',' + NextPIN + ');\n'

  Blockly.Arduino.setups_['setup_lcd_' + dropdown_pin] = 'slcd_' + dropdown_pin + '.begin();\n'
  var code = 'slcd_' + dropdown_pin + '.backlight();\n'
  code += 'slcd_' + dropdown_pin + '.setCursor(0,0);\n'
  code += 'slcd_' + dropdown_pin + '.print(' + text + ');\n' //text.replace(new RegExp('\'',"gm"),'')
  code += 'slcd_' + dropdown_pin + '.setCursor(0,1);\n'
  code += 'slcd_' + dropdown_pin + '.print(' + text2 + ');\n'
  code += 'delay(' + delay_time + ');\n'
  return code
}

arduinoGenerator['grove_serial_lcd_power'] = function () {
  var dropdown_pin = this.getFieldValue('PIN')
  var dropdown_stat = this.getFieldValue('STAT')

  Blockly.Arduino.definitions_['define_seriallcd'] = '#include <SerialLCD.h>\n'
  Blockly.Arduino.definitions_['define_softwareserial'] = '#include <SoftwareSerial.h>\n'
  //generate PIN#+1 port
  var NextPIN = _get_next_pin(dropdown_pin)

  Blockly.Arduino.definitions_['var_lcd' + dropdown_pin] =
    'SerialLCD slcd_' + dropdown_pin + '(' + dropdown_pin + ',' + NextPIN + ');\n'
  var code = 'slcd_' + dropdown_pin
  if (dropdown_stat === 'ON') {
    code += '.Power();\n'
  } else {
    code += '.noPower();\n'
  }
  return code
}

arduinoGenerator['grove_serial_lcd_effect'] = function () {
  var dropdown_pin = this.getFieldValue('PIN')
  var dropdown_stat = this.getFieldValue('STAT')

  Blockly.Arduino.definitions_['define_seriallcd'] = '#include <SerialLCD.h>\n'
  Blockly.Arduino.definitions_['define_softwareserial'] = '#include <SoftwareSerial.h>\n'
  //generate PIN#+1 port
  var NextPIN = _get_next_pin(dropdown_pin)

  Blockly.Arduino.definitions_['var_lcd' + dropdown_pin] =
    'SerialLCD slcd_' + dropdown_pin + '(' + dropdown_pin + ',' + NextPIN + ');\n'
  var code = 'slcd_' + dropdown_pin
  if (dropdown_stat === 'LEFT') {
    code += '.scrollDisplayLeft();\n'
  } else if (dropdown_stat === 'RIGHT') {
    code += '.scrollDisplayRight();\n'
  } else {
    code += '.autoscroll();\n'
  }
  return code
}
export { Blockly, profile, arduinoGenerator }
