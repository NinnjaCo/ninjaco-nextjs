import '../blocks/arduino/base'
import '../blocks/arduino/text'
import '../generetors/arduino/index'

import { ToolboxDefinition } from 'blockly/core/utils/toolbox'
export const arduinoToolbox: ToolboxDefinition = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Logic',
      colour: '#4C97FF',
      contents: [
        {
          kind: 'block',
          type: 'controls_if',
        },
        {
          kind: 'block',
          type: 'logic_compare',
        },
        {
          kind: 'block',
          type: 'logic_operation',
        },
        {
          kind: 'block',
          type: 'logic_negate',
        },
        {
          kind: 'block',
          type: 'logic_null',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Control',
      colour: '#0FBD8C',
      contents: [
        {
          kind: 'block',
          type: 'base_delay',
        },
        {
          kind: 'block',
          type: 'controls_for',
        },
        {
          kind: 'block',
          type: 'controls_whileUntil',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Math',
      colour: '#59C059',
      contents: [
        {
          kind: 'block',
          type: 'math_number',
        },
        {
          kind: 'block',
          type: 'math_arithmetic',
        },
        {
          kind: 'block',
          type: 'base_map',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Text',
      colour: '#4BD8A9',
      contents: [
        {
          kind: 'block',
          type: 'text',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Variables',
      custom: 'VARIABLE',
      colour: '#FF8C1A',
    },
    {
      kind: 'category',
      name: 'Functions',
      custom: 'PROCEDURE',
      colour: '#FF6680',
    },
    {
      kind: 'sep',
      colour: '#FF6680',
    },
    {
      kind: 'category',
      name: 'Input/Output',
      colour: '#4B63D8',
      contents: [
        {
          kind: 'block',
          type: 'inout_highlow',
        },
        {
          kind: 'block',
          type: 'inout_digital_write',
        },
        {
          kind: 'block',
          type: 'inout_digital_read',
        },
        {
          kind: 'block',
          type: 'inout_analog_write',
        },
        {
          kind: 'block',
          type: 'inout_analog_read',
        },
        {
          kind: 'block',
          type: 'serial_print',
        },
        {
          kind: 'block',
          type: 'inout_tone',
        },
        {
          kind: 'block',
          type: 'inout_notone',
        },
        {
          kind: 'block',
          type: 'inout_buildin_led',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Servo',
      colour: '#4BD84B',
      contents: [
        {
          kind: 'block',
          type: 'servo_move',
        },
        {
          kind: 'block',
          type: 'servo_read_degrees',
        },
      ],
    },
  ],
}

//     <category name="Grove Analog">
//       <block type="grove_rotary_angle"></block>
//       <block type="grove_temporature_sensor"></block>
//       <block type="grove_sound_sensor"></block>
//       <block type="grove_thumb_joystick"></block>
//     </category>
//     <category name="Grove">
//       <block type="grove_led"></block>
//       <block type="grove_button"></block>
//       <block type="grove_relay"></block>
//       <block type="grove_tilt_switch"></block>
//       <block type="grove_piezo_buzzer"></block>
//       <block type="grove_pir_motion_sensor"></block>
//       <block type="grove_line_finder"></block>
//       <block type="grove_rgb_led"></block>
//       <block type="grove_ultrasonic_ranger"></block>
//     </category>
//     <category name="Grove LCD">
//       <block type="grove_serial_lcd_print">
//         <value name="TEXT">
//           <block type="text">
//             <field name="TEXT"></field>
//           </block>
//         </value>
//         <value name="TEXT2">
//           <block type="text">
//             <field name="TEXT"></field>
//           </block>
//         </value>
//         <value name="DELAY_TIME">
//           <block type="math_number">
//             <field name="NUM">1000</field>
//           </block>
//         </value>
//       </block>
//       <block type="grove_serial_lcd_power"></block>
//       <block type="grove_serial_lcd_effect"></block>
//     </category>
//     <category name="Grove Motor">
//       <block type="grove_motor_shield"></block>
//     </category>
//   </xml>
