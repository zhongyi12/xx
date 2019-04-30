const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.set_tcp_offset = (block) => {
  const x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  const y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  const z = Blockly.JavaScript.valueToCode(block, 'z', Blockly.JavaScript.ORDER_ATOMIC);
  const roll = Blockly.JavaScript.valueToCode(block, 'roll', Blockly.JavaScript.ORDER_ATOMIC);
  const pitch = Blockly.JavaScript.valueToCode(block, 'pitch', Blockly.JavaScript.ORDER_ATOMIC);
  const yaw = Blockly.JavaScript.valueToCode(block, 'yaw', Blockly.JavaScript.ORDER_ATOMIC);
  // const save = Blockly.JavaScript.valueToCode(block, 'save', Blockly.JavaScript.ORDER_ATOMIC) === 'true' ? true: false;
  const save = false;
  let code = `window.CommandsRobotSocket.set_tcp_offset([${x}, ${y}, ${z}, ${roll}, ${pitch}, ${yaw}], ${save}, (res) => {});`
  return code;
};

mBlockly.Blocks.set_tcp_offset = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.setting.tcp_offset)
    this.appendValueInput('x')
      .setCheck('Number')
      .appendField('X')
    this.appendValueInput('y')
      .setCheck('Number')
      .appendField('Y')
    this.appendValueInput('z')
      .setCheck('Number')
      .appendField('Z')
    this.appendValueInput('roll')
      .setCheck('Number')
      .appendField('Roll')
    this.appendValueInput('pitch')
      .setCheck('Number')
      .appendField('Pitch')
    this.appendValueInput('yaw')
      .setCheck('Number')
      .appendField('Yaw')
    // this.appendValueInput('save')
    //   .setCheck('Boolean')
    //   .appendField('Save');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_GRIPPER);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
