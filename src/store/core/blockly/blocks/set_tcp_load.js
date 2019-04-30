const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.set_tcp_load = (block) => {
  const weight = Blockly.JavaScript.valueToCode(block, 'weight', Blockly.JavaScript.ORDER_ATOMIC);
  const center_x = Blockly.JavaScript.valueToCode(block, 'center_of_gravity_x', Blockly.JavaScript.ORDER_ATOMIC);
  const center_y = Blockly.JavaScript.valueToCode(block, 'center_of_gravity_y', Blockly.JavaScript.ORDER_ATOMIC);
  const center_z = Blockly.JavaScript.valueToCode(block, 'center_of_gravity_z', Blockly.JavaScript.ORDER_ATOMIC);
  // const save = Blockly.JavaScript.valueToCode(block, 'save', Blockly.JavaScript.ORDER_ATOMIC) === 'true' ? true: false;
  const save = false;
  let code = `window.CommandsRobotSocket.set_tcp_load(${weight}, [${center_x}, ${center_y}, ${center_z}], ${save}, (res) => {});`
  return code;
};

mBlockly.Blocks.set_tcp_load = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.setting.tcp_load);
    this.appendValueInput('weight')
      .setCheck('Number')
      .appendField(Blockly.Msg.setting.weight)
    this.appendValueInput('center_of_gravity_x')
      .setCheck('Number')
      .appendField(Blockly.Msg.setting.center_of_gravity_x)
    this.appendValueInput('center_of_gravity_y')
      .setCheck('Number')
      .appendField(Blockly.Msg.setting.center_of_gravity_y)
    this.appendValueInput('center_of_gravity_z')
      .setCheck('Number')
      .appendField(Blockly.Msg.setting.center_of_gravity_z)
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
