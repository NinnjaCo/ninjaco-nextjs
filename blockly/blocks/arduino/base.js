import * as Blockly from 'blockly/core'
import { profile } from '@/blockly/generetors/arduino'

const BASE_HUE = 120
const IO_HUE = 230

Blockly.Blocks['base_delay'] = {
  helpUrl: 'http://arduino.cc/en/Reference/delay',
  init: function () {
    this.setColour(BASE_HUE)
    this.appendValueInput('DELAY_TIME', 'Number').appendField('Delay').setCheck('Number')
    this.setInputsInline(true)
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setTooltip('Delay specific time')
  },
}

Blockly.Blocks['base_map'] = {
  helpUrl: 'http://arduino.cc/en/Reference/map',
  init: function () {
    this.setColour(IO_HUE)
    this.appendValueInput('NUM', 'Number').appendField('Map ').setCheck('Number')
    this.appendValueInput('DMAX', 'Number').appendField('value to [0-').setCheck('Number')
    this.appendDummyInput().appendField(']')
    this.setInputsInline(true)
    this.setOutput(true)
    this.setTooltip('Re-maps a number from [0-1024] to another.')
  },
}

Blockly.Blocks['inout_buildin_led'] = {
  helpUrl: 'http://arduino.cc/en/Reference/DigitalWrite',
  init: function () {
    this.setColour(BASE_HUE)
    this.appendDummyInput()
      .appendField('Build-in LED Stat')
      .appendField(
        new Blockly.FieldDropdown([
          ['HIGH', 'HIGH'],
          ['LOW', 'LOW'],
        ]),
        'STAT'
      )
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setTooltip('light or off the build-in LED')
  },
}

Blockly.Blocks['inout_digital_write'] = {
  helpUrl: 'http://arduino.cc/en/Reference/DigitalWrite',
  init: function () {
    this.setColour(IO_HUE)
    this.appendDummyInput()
      .appendField('DigitalWrite PIN#')
      .appendField(new Blockly.FieldDropdown(profile.default.digital), 'PIN')
      .appendField('Stat')
      .appendField(
        new Blockly.FieldDropdown([
          ['HIGH', 'HIGH'],
          ['LOW', 'LOW'],
        ]),
        'STAT'
      )
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setTooltip('Write digital value to a specific Port')
  },
}

Blockly.Blocks['inout_digital_read'] = {
  helpUrl: 'http://arduino.cc/en/Reference/DigitalRead',
  init: function () {
    this.setColour(IO_HUE)
    this.appendDummyInput()
      .appendField('DigitalRead PIN#')
      .appendField(new Blockly.FieldDropdown(profile.default.digital), 'PIN')
    this.setOutput(true, 'Boolean')
    this.setTooltip('')
  },
}

Blockly.Blocks['inout_analog_write'] = {
  helpUrl: 'http://arduino.cc/en/Reference/AnalogWrite',
  init: function () {
    this.setColour(IO_HUE)
    this.appendDummyInput()
      .appendField('AnalogWrite PIN#')
      .appendField(new Blockly.FieldDropdown(profile.default.digital), 'PIN')
    this.appendValueInput('NUM', 'Number').appendField('value').setCheck('Number')
    this.setInputsInline(true)
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setTooltip('Write analog value between 0 and 255 to a specific Port')
  },
}

Blockly.Blocks['inout_analog_read'] = {
  helpUrl: 'http://arduino.cc/en/Reference/AnalogRead',
  init: function () {
    this.setColour(IO_HUE)
    this.appendDummyInput()
      .appendField('AnalogRead PIN#')
      .appendField(new Blockly.FieldDropdown(profile.default.analog), 'PIN')
    this.setOutput(true, 'Number')
    this.setTooltip('Return value between 0 and 1024')
  },
}

Blockly.Blocks['inout_tone'] = {
  helpUrl: 'http://www.arduino.cc/en/Reference/Tone',
  init: function () {
    this.setColour(IO_HUE)
    this.appendDummyInput()
      .appendField('Tone PIN#')
      .appendField(new Blockly.FieldDropdown(profile.default.digital), 'PIN')
    this.appendValueInput('NUM', 'Number').appendField('frequency').setCheck('Number')
    this.setInputsInline(true)
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setTooltip('Generate audio tones on a pin')
  },
}

Blockly.Blocks['inout_notone'] = {
  helpUrl: 'http://www.arduino.cc/en/Reference/NoTone',
  init: function () {
    this.setColour(IO_HUE)
    this.appendDummyInput()
      .appendField('No tone PIN#')
      .appendField(new Blockly.FieldDropdown(profile.default.digital), 'PIN')
    this.setInputsInline(true)
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setTooltip('Stop generating a tone on a pin')
  },
}

Blockly.Blocks['inout_highlow'] = {
  helpUrl: 'http://arduino.cc/en/Reference/Constants',
  init: function () {
    this.setColour(IO_HUE)
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ['HIGH', 'HIGH'],
        ['LOW', 'LOW'],
      ]),
      'BOOL'
    )
    this.setOutput(true, 'Boolean')
    this.setTooltip('')
  },
}

//servo block
//http://www.seeedstudio.com/depot/emax-9g-es08a-high-sensitive-mini-servo-p-760.html?cPath=170_171
Blockly.Blocks['servo_move'] = {
  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',
  init: function () {
    this.setColour(BASE_HUE)
    this.appendDummyInput()
      .appendField('Servo')
      .appendField(
        new Blockly.FieldImage(
          'https://statics3.seeedstudio.com/images/product/EMAX%20Servo.jpg',
          64,
          64
        )
      )
      .appendField('PIN#')
      .appendField(new Blockly.FieldDropdown(profile.default.digital), 'PIN')
    this.appendValueInput('DEGREE', 'Number')
      .setCheck('Number')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField('Degree (0~180)')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setTooltip('move between 0~180 degree')
  },
}

Blockly.Blocks['servo_read_degrees'] = {
  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',
  init: function () {
    this.setColour(BASE_HUE)
    this.appendDummyInput()
      .appendField('Servo')
      .appendField(
        new Blockly.FieldImage(
          'https://statics3.seeedstudio.com/images/product/EMAX%20Servo.jpg',
          64,
          64
        )
      )
      .appendField('PIN#')
      .appendField(new Blockly.FieldDropdown(profile.default.digital), 'PIN')
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField('Read Degrees')
    this.setOutput(true, 'Number')
    this.setTooltip('return that degree with the last servo move.')
  },
}

Blockly.Blocks['serial_print'] = {
  helpUrl: 'http://www.arduino.cc/en/Serial/Print',
  init: function () {
    this.setColour(IO_HUE)
    this.appendValueInput('CONTENT', 'String').appendField('Serial Print')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setTooltip('Prints data to the console/serial port as human-readable ASCII text.')
  },
}

Blockly.Blocks['grove_serial_lcd_print'] = {
  helpUrl:
    'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#Serial_LCD',
  init: function () {
    this.setColour(IO_HUE)
    this.appendDummyInput()
      .appendField('Serial LCD')
      .appendField(
        new Blockly.FieldImage(
          'https://statics3.seeedstudio.com/images/product/Serial%20LCD.jpg',
          64,
          64
        )
      )
      .appendField('PIN#')
      .appendField(new Blockly.FieldDropdown(profile.default.digital), 'PIN')
    this.appendValueInput('TEXT', 'String')
      .setCheck('String')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField('print line1')
    this.appendValueInput('TEXT2', 'String')
      .setCheck('String')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField('print line2')
    this.appendValueInput('DELAY_TIME', 'Number')
      .setCheck('Number')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField('Delay')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setTooltip('print text on an 16 character by 2 line LCD.')
  },
}

//grove lcd power on/off
Blockly.Blocks['grove_serial_lcd_power'] = {
  helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#LED',
  init: function () {
    this.setColour(IO_HUE)
    this.appendDummyInput()
      .appendField('Serial LCD')
      .appendField(
        new Blockly.FieldImage(
          'https://statics3.seeedstudio.com/images/product/Serial%20LCD.jpg',
          64,
          64
        )
      )
      .appendField('PIN#')
      .appendField(new Blockly.FieldDropdown(profile.default.digital), 'PIN')
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField('Power')
      .appendField(
        new Blockly.FieldDropdown([
          ['ON', 'ON'],
          ['OFF', 'OFF'],
        ]),
        'STAT'
      )
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setTooltip('Turn LCD power on/off')
  },
}

//scroll left/right/no scroll/blink/noblink
Blockly.Blocks['grove_serial_lcd_effect'] = {
  helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#LED',
  init: function () {
    this.setColour(IO_HUE)
    this.appendDummyInput()
      .appendField('Serial LCD')
      .appendField(
        new Blockly.FieldImage(
          'https://statics3.seeedstudio.com/images/product/Serial%20LCD.jpg',
          64,
          64
        )
      )
      .appendField('PIN#')
      .appendField(new Blockly.FieldDropdown(profile.default.digital), 'PIN')
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField('Effect')
      .appendField(
        new Blockly.FieldDropdown([
          ['Scroll Left', 'LEFT'],
          ['Scroll Right', 'RIGHT'],
          ['Scroll Auto', 'AUTO'],
        ]),
        'STAT'
      )
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setTooltip('Turn LCD power on/off')
  },
}
