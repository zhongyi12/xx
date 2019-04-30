const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.save_config = (block) => {
  let code = `window.CommandsRobotSocket.save_config((res) => {});`
  return code;
};

mBlockly.Blocks.save_config = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.setting.save_config);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_ADVANCE);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
