import { BlocklyDefaultColor } from './blocks_color';
import BlocklyLib from './blockly_lib';

const mBlockly = {};
mBlockly.Blocks = {};

// function initBlocklyDefine(Blockly) {
// }
// export default initBlocklyDefine;

// mBlockly.Blocks.position = {
//   init() {
//     this.appendDummyInput()
//       .appendField(Blockly.Msg.motion.position);
//     this.appendValueInput('x')
//       .setCheck('Number')
//       .appendField('X');
//     this.appendValueInput('y')
//       .setCheck('Number')
//       .appendField('Y');
//     this.appendValueInput('z')
//       .setCheck('Number')
//       .appendField('Z');
//     this.appendValueInput('a')
//       .setCheck('Number')
//       .appendField('A');
//     this.appendValueInput('b')
//       .setCheck('Number')
//       .appendField('B');
//     this.appendValueInput('c')
//       .setCheck('Number')
//       .appendField('C');
//     this.setInputsInline(true);
//     this.setOutput(true, null);
//     this.setColour(BlocklyDefaultColor.COLOR_MOTION);
//   },
//   onchange(event) {
//     if (event.type === 'change' && BlocklyLib.isChildBlock(event.blockId, this)) {
//       console.log('inputlist', this)
//       for (const item of this.inputList) {
//         if (item.connection !== null) {
//           const value = item.connection.targetBlock().getFieldValue('NUM');
//           switch (item.name) {
//             default:
//               break;
//             case 'x':
//               item.connection.targetBlock().setFieldValue(value, 'NUM');
//               break;
//             case 'y':
//               item.connection.targetBlock().setFieldValue(value, 'NUM');
//               break;
//             case 'z':
//               item.connection.targetBlock().setFieldValue(value, 'NUM');
//               break;
//             case 'a':
//               item.connection.targetBlock().setFieldValue(value, 'NUM');
//               break;
//             case 'b':
//               item.connection.targetBlock().setFieldValue(value, 'NUM');
//               break;
//             case 'c':
//               item.connection.targetBlock().setFieldValue(value, 'NUM');
//               break;
//           }
//         }
//       }
//     }
//   },
// };

// mBlockly.Blocks.position7 = {
//   init() {
//     this.appendDummyInput()
//       .appendField(Blockly.Msg.motion.axis);
//     this.appendValueInput('i')
//       .setCheck('Number')
//       .appendField('I');
//     this.appendValueInput('j')
//       .setCheck('Number')
//       .appendField('J');
//     this.appendValueInput('k')
//       .setCheck('Number')
//       .appendField('K');
//     this.appendValueInput('l')
//       .setCheck('Number')
//       .appendField('L');
//     this.appendValueInput('m')
//       .setCheck('Number')
//       .appendField('M');
//     this.appendValueInput('n')
//       .setCheck('Number')
//       .appendField('N');
//     this.appendValueInput('o')
//       .setCheck('Number')
//       .appendField('O');
//     this.setInputsInline(true);
//     this.setOutput(true, null);
//     this.setColour(BlocklyDefaultColor.COLOR_MOTION);
//   },
//   onchange(event) {
//     if (event.type === 'change' && BlocklyLib.isChildBlock(event.blockId, this)) {
//       for (const item of this.inputList) {
//         if (item.connection !== null) {
//           const value = item.connection.targetBlock().getFieldValue('NUM');
//           switch (item.name) {
//             default:
//               break;
//             case 'i':
//               item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, -200), 200), 'NUM');
//               break;
//             case 'j':
//               item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, -200), 200), 'NUM');
//               break;
//             case 'k':
//               item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, -200), 200), 'NUM');
//               break;
//             case 'l':
//               item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, -200), 200), 'NUM');
//               break;
//             case 'm':
//               item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, -200), 200), 'NUM');
//               break;
//             case 'n':
//               item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, -200), 200), 'NUM');
//               break;
//             case 'o':
//               item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, -200), 200), 'NUM');
//               break;
//           }
//         }
//       }
//     }
//   },
// };
// mBlockly.Blocks.move_7 = {
//   init() {
//     this.appendValueInput('position7')
//       .setCheck('Array')
//       .appendField(Blockly.Msg.motion.rotate);
//     this.setInputsInline(false);
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(BlocklyDefaultColor.COLOR_MOTION);
//   },
//   setValue(positions) {
//     const posChildBlock = this.getChildren();
//     if (posChildBlock.length > 0) {
//       for (const item of posChildBlock[0].inputList) {
//         if (item.connection !== null) {
//           switch (item.name) {
//             default:
//               break;
//             case 'i':
//               item.connection.targetBlock().setFieldValue(Math.round(positions[0]).toString(), 'NUM');
//               break;
//             case 'j':
//               item.connection.targetBlock().setFieldValue(Math.round(positions[1]).toString(), 'NUM');
//               break;
//             case 'k':
//               item.connection.targetBlock().setFieldValue(Math.round(positions[2]).toString(), 'NUM');
//               break;
//             case 'l':
//               item.connection.targetBlock().setFieldValue(Math.round(positions[3]).toString(), 'NUM');
//               break;
//             case 'm':
//               item.connection.targetBlock().setFieldValue(Math.round(positions[4]).toString(), 'NUM');
//               break;
//             case 'n':
//               item.connection.targetBlock().setFieldValue(Math.round(positions[5]).toString(), 'NUM');
//               break;
//             case 'o':
//               item.connection.targetBlock().setFieldValue(Math.round(positions[6]).toString(), 'NUM');
//               break;
//           }
//         }
//       }
//     }
//   },
// };
// mBlockly.Blocks.move_to = {
//   init() {
//     this.appendValueInput('position')
//       .setCheck('Array')
//       .appendField(Blockly.Msg.motion.moveto);
//     this.setInputsInline(false);
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(BlocklyDefaultColor.COLOR_MOTION);
//   },
//   setValue(positions) {
//     const posChildBlock = this.getChildren();
//     if (posChildBlock.length > 0) {
//       for (const item of posChildBlock[0].inputList) {
//         if (item.connection !== null) {
//           switch (item.name) {
//             default:
//               break;
//             case 'x':
//               item.connection.targetBlock().setFieldValue(Math.round(positions[0]).toString(), 'NUM');
//               break;
//             case 'y':
//               item.connection.targetBlock().setFieldValue(Math.round(positions[1]).toString(), 'NUM');
//               break;
//             case 'z':
//               item.connection.targetBlock().setFieldValue(Math.round(positions[2]).toString(), 'NUM');
//               break;
//             case 'a':
//               item.connection.targetBlock().setFieldValue(Math.round(positions[3]).toString(), 'NUM');
//               break;
//             case 'b':
//               item.connection.targetBlock().setFieldValue(Math.round(positions[4]).toString(), 'NUM');
//               break;
//             case 'c':
//               item.connection.targetBlock().setFieldValue(Math.round(positions[5]).toString(), 'NUM');
//               break;
//           }
//         }
//       }
//     }
//   },
// };

// mBlockly.Blocks.move = {
//   init() {
//     this.appendValueInput('value')
//       .setCheck('Number')
//       .appendField(Blockly.Msg.motion.move)
//       .appendField(new Blockly.FieldDropdown([[Blockly.Msg.direction.forward, 'forward'],
//         [Blockly.Msg.direction.backward, 'backward'], [Blockly.Msg.direction.left, 'left'],
//         [Blockly.Msg.direction.right, 'right'], [Blockly.Msg.direction.up, 'up'],
//         [Blockly.Msg.direction.down, 'down']]), 'orientation');
//     this.setInputsInline(false);
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(BlocklyDefaultColor.COLOR_MOTION);
//   },
// };

// mBlockly.Blocks.set_speed = {
//   init() {
//     this.appendValueInput('speed')
//       .setCheck('Number')
//       .appendField(Blockly.Msg.motion.speed);
//     // this.appendDummyInput()
//     //   .appendField(Blockly.Msg.motion.speed)
//     //   .appendField(new Blockly.FieldDropdown([['1x', '1'], ['2x', '2'],
//     //     ['4x', '4']]), 'speed');
//     this.setInputsInline(false);
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(BlocklyDefaultColor.COLOR_MOTION);
//   },
// };
// mBlockly.Blocks.set_acceleration = {
//   init() {
//     this.appendValueInput('acceleration')
//       .setCheck('Number')
//       .appendField(Blockly.Msg.motion.acceleration);
//     this.setInputsInline(false);
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(BlocklyDefaultColor.COLOR_MOTION);
//   },
// };
// mBlockly.Blocks.reset = {
//   init() {
//     this.appendDummyInput()
//       .appendField(Blockly.Msg.motion.reset);
//     this.setInputsInline(true);
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(BlocklyDefaultColor.COLOR_MOTION);
//   },
// };

/* ******************************* LOGIC **********************************************************/
// mBlockly.Blocks.wait_until = {
//   init() {
//     this.appendValueInput('condition')
//       .setCheck('Boolean')
//       .appendField(Blockly.Msg.LOGIC_WAIT_UNTIL);
//     this.setInputsInline(false);
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(BlocklyDefaultColor.COLOR_LOGIC);
//   },
//   onStop() {
//     BlocklyLib.waitUntilTrigger.forEach((trigger) => {
//       clearInterval(trigger);
//     });
//   },
// };

// mBlockly.Blocks.wait = {
//   init() {
//     this.appendValueInput('sec')
//       .setCheck('Number')
//       .appendField(Blockly.Msg.motion.wait);
//     this.setInputsInline(false);
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(BlocklyDefaultColor.COLOR_LOGIC);
//   },
// };
// mBlockly.Blocks.loop_run_forever = {
//   init() {
//     this.appendDummyInput()
//       .appendField(Blockly.Msg.LOOP_FOREVER);
//     this.appendStatementInput('statement')
//       .setCheck(null);
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(BlocklyDefaultColor.COLOR_LOOP);
//   },
// };

/* ******************************* SOUND **********************************************************/

/* ******************************* Loop **********************************************************/

/* ******************************* Condition **********************************************************/

mBlockly.Blocks.condition_key_pressed = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.CONDITION_KEY)
      .appendField(new Blockly.FieldDropdown([
        ['A', '65'],
        ['B', '66'],
        ['C', '67'],
        ['D', '68'],
        ['E', '69'],
        ['F', '70'],
        ['G', '71'],
        ['H', '72'],
        ['I', '73'],
        ['J', '74'],
        ['K', '75'],
        ['L', '76'],
        ['M', '77'],
        ['N', '78'],
        ['O', '79'],
        ['P', '80'],
        ['Q', '81'],
        ['R', '82'],
        ['S', '83'],
        ['T', '84'],
        ['U', '85'],
        ['V', '86'],
        ['W', '87'],
        ['X', '88'],
        ['Y', '89'],
        ['Z', '90'],
        ['SPACE', '32'],
        ['UP', '38'],
        ['DOWN', '40'],
        ['LEFT', '37'],
        ['RIGHT', '39'],
        ['0', '48'],
        ['1', '49'],
        ['2', '50'],
        ['3', '51'],
        ['4', '52'],
        ['5', '53'],
        ['6', '54'],
        ['7', '55'],
        ['8', '56'],
        ['9', '57'],
      ]), 'keycode');
    this.setOutput(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_CONDITION);
    this.setTooltip('');
    this.setHelpUrl('');
  },
  onStart() {
    BlocklyLib.KeyPressEvent.init();
  },
  onStop() {
    BlocklyLib.KeyPressEvent.clearValue();
    BlocklyLib.KeyPressEvent.stop();
  },
};

/** ****************************** Event **********************************************************/

mBlockly.Blocks.event_keypressed_stop = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.events.stopkeyboard);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_EVENT);
    this.setTooltip('');
  },
};

mBlockly.Blocks.event_keypressed = {
  init() {
    this.appendStatementInput('statement')
      .appendField(Blockly.Msg.events.key.press, 'IF')
      .appendField(new Blockly.FieldDropdown([
        ['A', '65'],
        ['B', '66'],
        ['C', '67'],
        ['D', '68'],
        ['E', '69'],
        ['F', '70'],
        ['G', '71'],
        ['H', '72'],
        ['I', '73'],
        ['J', '74'],
        ['K', '75'],
        ['L', '76'],
        ['M', '77'],
        ['N', '78'],
        ['O', '79'],
        ['P', '80'],
        ['Q', '81'],
        ['R', '82'],
        ['S', '83'],
        ['T', '84'],
        ['U', '85'],
        ['V', '86'],
        ['W', '87'],
        ['X', '88'],
        ['Y', '89'],
        ['Z', '90'],
        ['SPACE', '32'],
        ['UP', '38'],
        ['DOWN', '40'],
        ['LEFT', '37'],
        ['RIGHT', '39'],
        ['0', '48'],
        ['1', '49'],
        ['2', '50'],
        ['3', '51'],
        ['4', '52'],
        ['5', '53'],
        ['6', '54'],
        ['7', '55'],
        ['8', '56'],
        ['9', '57'],
      ]), 'keycode')
      .appendField(Blockly.Msg.events.key.do, '，EXCUTE：');
    this.setTooltip('');
    this.setColour(BlocklyDefaultColor.COLOR_EVENT);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
  onStart() {
    BlocklyLib.KeyPressEvent.init();
  },
  onStop() {
    BlocklyLib.KeyPressEvent.clearEventListener();
  },
  onDelete() {
    BlocklyLib.KeyPressEvent.clearEventListener();
  },
};

/** ***************************************** Grove ******************************************/

/** ***************************************** Leap Motion ******************************************/

/** Application block define start*/
// mBlockly.Blocks.studio_run_python = {
//   init() {
//     this.appendValueInput('ide')
//       .appendField(Blockly.Msg.app.ide);
//     this.setInputsInline(false);
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(BlocklyDefaultColor.COLOR_APP);
//   },
//   // onchange(event) {
//   //   console.log('onchange,', event, this)
//   // }
// };

// mBlockly.Blocks.studio_copy_recording = {
//   init() {
//     this.appendValueInput('record')
//       .appendField(Blockly.Msg.app.record_copy);
//     this.setInputsInline(false);
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(BlocklyDefaultColor.COLOR_APP);
//   },
// };

// mBlockly.Blocks.studio_play_recording = {
//   init() {
//     this.appendValueInput('record')
//       .appendField(Blockly.Msg.app.record);
//     this.setInputsInline(false);
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(BlocklyDefaultColor.COLOR_APP);
//   },
// };

// mBlockly.Blocks.studio_run_app = {
//   init() {
//     this.appendValueInput('other')
//       .appendField(Blockly.Msg.app.other);
//     this.setInputsInline(false);
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(BlocklyDefaultColor.COLOR_APP);
//   },
// };

export default mBlockly.Blocks;