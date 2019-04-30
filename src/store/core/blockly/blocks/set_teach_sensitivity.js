const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.set_teach_sensitivity = (block) => {
  const sensitivity = Blockly.JavaScript.valueToCode(block, 'sensitivity', Blockly.JavaScript.ORDER_ATOMIC);
  // const save = Blockly.JavaScript.valueToCode(block, 'save', Blockly.JavaScript.ORDER_ATOMIC) === 'true' ? true: false;
  const save = false;
  let code = `window.CommandsRobotSocket.set_teach_sensitivity(${sensitivity}, ${save}, (res) => {});`
  return code;
};

mBlockly.Blocks.set_teach_sensitivity = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.setting.teach_sensitivity);
    this.appendValueInput('sensitivity')
      .setCheck('Number')
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
