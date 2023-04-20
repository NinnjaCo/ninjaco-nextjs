import { ToolboxDefinition } from 'blockly/core/utils/toolbox'

// <xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
//   <category name="HTML"></category>
//   <sep></sep>
//   <category name="Base frame" colour="#a55b5b">
//     <block type="html">
//       <statement name="content">
//         <block type="head">
//           <statement name="content">
//             <block type="title">
//               <statement name="content">
//                 <block type="plaintext">
//                   <field name="content"></field>
//                 </block>
//               </statement>
//             </block>
//           </statement>
//           <next>
//             <block type="body"></block>
//           </next>
//         </block>
//       </statement>
//     </block>
//     <block type="html"></block>
//     <block type="body"></block>
//     <block type="body_attributes"></block>
//     <block type="head"></block>
//     <block type="title">
//       <statement name="content">
//         <block type="plaintext">
//           <field name="content"></field>
//         </block>
//       </statement>
//     </block>
//   </category>
//   <category name="Text structure" colour="#5ba55b">
//     <block type="plaintext">
//       <field name="content"></field>
//     </block>
//     <block type="horizontalbreak"></block>
//     <block type="linebreak"></block>
//     <block type="paragraph"></block>
//     <block type="headline">
//       <field name="NAME">h1</field>
//     </block>
//     <block type="link">
//       <field name="NAME">target</field>
//     </block>
//     <block type="image">
//       <field name="IMAGE">URL</field>
//       <field name="ALT">alternative text</field>
//     </block>
//     <block type="generictag">
//       <field name="NAME">tag</field>
//     </block>
//   </category>
//   <category name="Text markup" colour="#5ba55b">
//     <block type="emphasise"></block>
//     <block type="inserted"></block>
//     <block type="strong"></block>
//     <block type="deleted"></block>
//     <block type="super"></block>
//     <block type="sub"></block>
//     <block type="code"></block>
//     <block type="quote"></block>
//     <block type="blockquote"></block>
//     <block type="sample"></block>
//     <block type="keyboard"></block>
//     <block type="variable"></block>
//     <block type="division"></block>
//   </category>
//   <category name="Style" colour="#5b6da5">
//     <block type="span">
//       <value name="NAME">
//         <block type="style"></block>
//       </value>
//     </block>
//     <block type="style"></block>
//     <block type="color">
//       <field name="NAME">#ff0000</field>
//     </block>
//     <block type="bgcolour">
//       <field name="NAME">#ff0000</field>
//     </block>
//     <block type="genericstyle">
//       <field name="property">property</field>
//       <field name="value">value</field>
//     </block>
//     <block type="span"></block>
//     <block type="division"></block>
//     <block type="generictag">
//       <field name="NAME">tag</field>
//     </block>
//   </category>
//   <category name="Enumeration" colour="#a55ba5">
//     <block type="unorderedlist"></block>
//     <block type="orderedlist"></block>
//     <block type="listelement"></block>
//   </category>
//   <category name="Tables" colour="#5ba5a5">
//     <block type="table">
//       <statement name="content">
//         <block type="tablerow">
//           <statement name="content">
//             <block type="tablecell">
//               <next>
//                 <block type="tablecell"></block>
//               </next>
//             </block>
//           </statement>
//           <next>
//             <block type="tablerow">
//               <statement name="content">
//                 <block type="tablecell">
//                   <next>
//                     <block type="tablecell"></block>
//                   </next>
//                 </block>
//               </statement>
//             </block>
//           </next>
//         </block>
//       </statement>
//     </block>
//     <block type="table"></block>
//     <block type="tablerow"></block>
//     <block type="tablecell"></block>
//   </category>
//   <category name="Forms" colour="#80a55b">
//     <block type="form"></block>
//     <block type="input_text">
//       <field name="default"></field>
//     </block>
//     <block type="button"></block>
//     <block type="input">
//       <field name="type">text</field>
//       <field name="value"></field>
//     </block>
//   </category>
//   <category name="Script" colour="#a5a55b">
//     <block type="script"></block>
//     <block type="onclick"></block>
//   </category>
//   <sep></sep>
//   <category name="Scripting"></category>
//   <sep></sep>
//   <category name="Logic" colour="#5C81A6">
//     <block type="controls_if"></block>
//     <block type="logic_compare">
//       <field name="OP">EQ</field>
//     </block>
//     <block type="logic_operation">
//       <field name="OP">AND</field>
//     </block>
//     <block type="logic_negate"></block>
//     <block type="logic_boolean">
//       <field name="BOOL">TRUE</field>
//     </block>
//     <block type="logic_null"></block>
//     <block type="logic_ternary"></block>
//   </category>
//   <category name="Loops" colour="#5CA65C">
//     <block type="controls_repeat_ext">
//       <value name="TIMES">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//     </block>
//     <block type="controls_whileUntil">
//       <field name="MODE">WHILE</field>
//     </block>
//     <block type="controls_for">
//       <field name="VAR" id=")[(PctVvu3c`*IACnwmm">i</field>
//       <value name="FROM">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//       <value name="TO">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//       <value name="BY">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//     </block>
//     <block type="controls_forEach">
//       <field name="VAR" id="~a;YXk@k`X$Eb9]Z6{Me">j</field>
//     </block>
//     <block type="controls_flow_statements">
//       <field name="FLOW">BREAK</field>
//     </block>
//   </category>
//   <category name="Math" colour="#5C68A6">
//     <block type="math_round">
//       <field name="OP">ROUND</field>
//       <value name="NUM">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//     </block>
//     <block type="math_number">
//       <field name="NUM">0</field>
//     </block>
//     <block type="math_single">
//       <field name="OP">ROOT</field>
//       <value name="NUM">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//     </block>
//     <block type="math_trig">
//       <field name="OP">SIN</field>
//       <value name="NUM">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//     </block>
//     <block type="math_constant">
//       <field name="CONSTANT">PI</field>
//     </block>
//     <block type="math_number_property">
//       <mutation divisor_input="false"></mutation>
//       <field name="PROPERTY">EVEN</field>
//       <value name="NUMBER_TO_CHECK">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//     </block>
//     <block type="math_arithmetic">
//       <field name="OP">ADD</field>
//       <value name="A">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//       <value name="B">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//     </block>
//     <block type="math_on_list">
//       <mutation op="SUM"></mutation>
//       <field name="OP">SUM</field>
//     </block>
//     <block type="math_modulo">
//       <value name="DIVIDEND">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//       <value name="DIVISOR">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//     </block>
//     <block type="math_constrain">
//       <value name="VALUE">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//       <value name="LOW">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//       <value name="HIGH">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//     </block>
//     <block type="math_random_int">
//       <value name="FROM">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//       <value name="TO">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//     </block>
//     <block type="math_random_float"></block>
//   </category>
//   <category name="Text" colour="#5CA68D">
//     <block type="text_charAt">
//       <mutation at="true"></mutation>
//       <field name="WHERE">FROM_START</field>
//       <value name="VALUE">
//         <block type="variables_get">
//           <field name="VAR" id="3lD0;=:EX{.QS(1_E}e_">item</field>
//         </block>
//       </value>
//     </block>
//     <block type="text">
//       <field name="TEXT"></field>
//     </block>
//     <block type="text_append">
//       <field name="VAR" id="3lD0;=:EX{.QS(1_E}e_">item</field>
//       <value name="TEXT">
//         <shadow type="text">
//           <field name="TEXT"></field>
//         </shadow>
//       </value>
//     </block>
//     <block type="text_length">
//       <value name="VALUE">
//         <shadow type="text">
//           <field name="TEXT"></field>
//         </shadow>
//       </value>
//     </block>
//     <block type="text_isEmpty">
//       <value name="VALUE">
//         <shadow type="text">
//           <field name="TEXT"></field>
//         </shadow>
//       </value>
//     </block>
//     <block type="text_indexOf">
//       <field name="END">FIRST</field>
//       <value name="VALUE">
//         <block type="variables_get">
//           <field name="VAR" id="3lD0;=:EX{.QS(1_E}e_">item</field>
//         </block>
//       </value>
//       <value name="FIND">
//         <shadow type="text">
//           <field name="TEXT"></field>
//         </shadow>
//       </value>
//     </block>
//     <block type="text_join">
//       <mutation items="2"></mutation>
//     </block>
//     <block type="text_getSubstring">
//       <mutation at1="true" at2="true"></mutation>
//       <field name="WHERE1">FROM_START</field>
//       <field name="WHERE2">FROM_START</field>
//       <value name="STRING">
//         <block type="variables_get">
//           <field name="VAR" id="3lD0;=:EX{.QS(1_E}e_">item</field>
//         </block>
//       </value>
//     </block>
//     <block type="text_changeCase">
//       <field name="CASE">UPPERCASE</field>
//       <value name="TEXT">
//         <shadow type="text">
//           <field name="TEXT"></field>
//         </shadow>
//       </value>
//     </block>
//     <block type="text_trim">
//       <field name="MODE">BOTH</field>
//       <value name="TEXT">
//         <shadow type="text">
//           <field name="TEXT"></field>
//         </shadow>
//       </value>
//     </block>
//     <block type="text_print">
//       <value name="TEXT">
//         <shadow type="text">
//           <field name="TEXT"></field>
//         </shadow>
//       </value>
//     </block>
//     <block type="text_prompt_ext">
//       <mutation type="TEXT"></mutation>
//       <field name="TYPE">TEXT</field>
//       <value name="TEXT">
//         <shadow type="text">
//           <field name="TEXT"></field>
//         </shadow>
//       </value>
//     </block>
//   </category>
//   <category name="Lists" colour="#745CA6">
//     <block type="lists_indexOf">
//       <field name="END">FIRST</field>
//       <value name="VALUE">
//         <block type="variables_get">
//           <field name="VAR" id="$nGj}F5dt?Fu8z!2-*~F">item</field>
//         </block>
//       </value>
//     </block>
//     <block type="lists_create_with">
//       <mutation items="0"></mutation>
//     </block>
//     <block type="lists_repeat">
//       <value name="NUM">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//     </block>
//     <block type="lists_length"></block>
//     <block type="lists_isEmpty"></block>
//     <block type="lists_create_with">
//       <mutation items="3"></mutation>
//     </block>
//     <block type="lists_getIndex">
//       <mutation statement="false" at="true"></mutation>
//       <field name="MODE">GET</field>
//       <field name="WHERE">FROM_START</field>
//       <value name="VALUE">
//         <block type="variables_get">
//           <field name="VAR" id="$nGj}F5dt?Fu8z!2-*~F">item</field>
//         </block>
//       </value>
//     </block>
//     <block type="lists_setIndex">
//       <mutation at="true"></mutation>
//       <field name="MODE">SET</field>
//       <field name="WHERE">FROM_START</field>
//       <value name="LIST">
//         <block type="variables_get">
//           <field name="VAR" id="$nGj}F5dt?Fu8z!2-*~F">item</field>
//         </block>
//       </value>
//     </block>
//     <block type="lists_getSublist">
//       <mutation at1="true" at2="true"></mutation>
//       <field name="WHERE1">FROM_START</field>
//       <field name="WHERE2">FROM_START</field>
//       <value name="LIST">
//         <block type="variables_get">
//           <field name="VAR" id="$nGj}F5dt?Fu8z!2-*~F">item</field>
//         </block>
//       </value>
//     </block>
//     <block type="lists_split">
//       <mutation mode="SPLIT"></mutation>
//       <field name="MODE">SPLIT</field>
//       <value name="DELIM">
//         <shadow type="text">
//           <field name="TEXT"></field>
//         </shadow>
//       </value>
//     </block>
//     <block type="lists_sort">
//       <field name="TYPE">NUMERIC</field>
//       <field name="DIRECTION">1</field>
//     </block>
//   </category>
//   <category name="Colour" colour="#A6745C">
//     <block type="colour_picker">
//       <field name="COLOUR">#ff0000</field>
//     </block>
//     <block type="colour_random"></block>
//     <block type="colour_rgb">
//       <value name="RED">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//       <value name="GREEN">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//       <value name="BLUE">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//     </block>
//     <block type="colour_blend">
//       <value name="COLOUR1">
//         <shadow type="colour_picker">
//           <field name="COLOUR">#ff0000</field>
//         </shadow>
//       </value>
//       <value name="COLOUR2">
//         <shadow type="colour_picker">
//           <field name="COLOUR">#ff0000</field>
//         </shadow>
//       </value>
//       <value name="RATIO">
//         <shadow type="math_number">
//           <field name="NUM">0</field>
//         </shadow>
//       </value>
//     </block>
//   </category>
//   <category name="Variables" colour="#A65C81" custom="VARIABLE"></category>
//   <category name="Functions" colour="#9A5CA6" custom="PROCEDURE"></category>
// </xml>

// use the xml above to generate the toolbox definition

export const htmlToolBox: ToolboxDefinition = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Base frame',
      colour: '#a55b5b',
      contents: [
        {
          kind: 'block',
          type: 'html',
          contents: [
            {
              kind: 'statement',
              name: 'content',
              contents: [
                {
                  kind: 'block',
                  type: 'head',
                  contents: [
                    {
                      kind: 'statement',
                      name: 'content',
                      contents: [
                        {
                          kind: 'block',
                          type: 'title',
                          contents: [
                            {
                              kind: 'statement',
                              name: 'content',
                              contents: [
                                {
                                  kind: 'block',
                                  type: 'plaintext',
                                  fields: {
                                    content: '',
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      kind: 'next',
                      contents: [
                        {
                          kind: 'block',
                          type: 'body',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          kind: 'block',
          type: 'html',
        },
        {
          kind: 'block',
          type: 'body',
        },
        {
          kind: 'block',
          type: 'body_attributes',
        },
        {
          kind: 'block',
          type: 'head',
        },
        {
          kind: 'block',
          type: 'title',
          contents: [
            {
              kind: 'statement',
              name: 'content',
              contents: [
                {
                  kind: 'block',
                  type: 'plaintext',
                  fields: {
                    content: '',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
