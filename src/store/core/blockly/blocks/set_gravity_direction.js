const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.set_gravity_direction = (block) => {
  const center_x = Blockly.JavaScript.valueToCode(block, 'direction_of_gravity_x', Blockly.JavaScript.ORDER_ATOMIC);
  const center_y = Blockly.JavaScript.valueToCode(block, 'direction_of_gravity_y', Blockly.JavaScript.ORDER_ATOMIC);
  const center_z = Blockly.JavaScript.valueToCode(block, 'direction_of_gravity_z', Blockly.JavaScript.ORDER_ATOMIC);
  // const save = Blockly.JavaScript.valueToCode(block, 'save', Blockly.JavaScript.ORDER_ATOMIC) === 'true' ? true: false;
  const save = false;
  let code = `window.CommandsRobotSocket.set_gravity_direction([${center_x}, ${center_y}, ${center_z}], ${save}, (res) => {});`
  return code;
};

mBlockly.Blocks.set_gravity_direction = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.setting.gravity_direction);
    this.appendValueInput('direction_of_gravity_x')
      .setCheck('Number')
      .appendField(Blockly.Msg.setting.direction_of_gravity_x)
    this.appendValueInput('direction_of_gravity_y')
      .setCheck('Number')
      .appendField(Blockly.Msg.setting.direction_of_gravity_y)
    this.appendValueInput('direction_of_gravity_z')
      .setCheck('Number')
      .appendField(Blockly.Msg.setting.direction_of_gravity_z)
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
