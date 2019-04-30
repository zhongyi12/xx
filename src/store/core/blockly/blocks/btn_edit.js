const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.btn_edit = (block) => {
  return '';
};

mBlockly.Blocks.btn_edit = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.motion.btnEdit)
    this.setOutput(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_ADVANCE);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
