const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.position = (block) => {
  const x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  const y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  const z = Blockly.JavaScript.valueToCode(block, 'z', Blockly.JavaScript.ORDER_ATOMIC);
  const a = Blockly.JavaScript.valueToCode(block, 'a', Blockly.JavaScript.ORDER_ATOMIC);
  const b = Blockly.JavaScript.valueToCode(block, 'b', Blockly.JavaScript.ORDER_ATOMIC);
  const c = Blockly.JavaScript.valueToCode(block, 'c', Blockly.JavaScript.ORDER_ATOMIC);
  const params = { x, y, z, a, b, c };
  // return genFuncCode(params, block);
  //
  const position = { x: params.x, y: params.y, z: params.z };
  const orientation = {
    roll: params.a,
    pitch: params.b,
    yaw: params.c
  }
  return [JSON.stringify({position, orientation})];
};

mBlockly.Blocks.position = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.motion.cartesian);
    this.appendValueInput('x')
      .setCheck('Number')
      .appendField('X');
    this.appendValueInput('y')
      .setCheck('Number')
      .appendField('Y');
    this.appendValueInput('z')
      .setCheck('Number')
      .appendField('Z');
    this.appendValueInput('a')
      .setCheck('Number')
      .appendField('Roll');
    this.appendValueInput('b')
      .setCheck('Number')
      .appendField('Pitch');
    this.appendValueInput('c')
      .setCheck('Number')
      .appendField('Yaw');
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_MOTION);
    this.setTooltip(Blockly.Msg.toolTip.cartesian);
  },
  onchange(event) {
    if (event.type === 'change' && BlocklyCom.blocklyLib.isChildBlock(event.blockId, this)) {
      console.log('inputlist', this)
      for (const item of this.inputList) {
        if (item.connection !== null) {
          const value = item.connection.targetBlock().getFieldValue('NUM');
          switch (item.name) {
            default:
              break;
            case 'x':
              item.connection.targetBlock().setFieldValue(value, 'NUM');
              break;
            case 'y':
              item.connection.targetBlock().setFieldValue(value, 'NUM');
              break;
            case 'z':
              item.connection.targetBlock().setFieldValue(value, 'NUM');
              break;
            case 'a':
              item.connection.targetBlock().setFieldValue(value, 'NUM');
              break;
            case 'b':
              item.connection.targetBlock().setFieldValue(value, 'NUM');
              break;
            case 'c':
              item.connection.targetBlock().setFieldValue(value, 'NUM');
              break;
          }
        }
      }
    }
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
