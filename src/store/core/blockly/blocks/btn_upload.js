const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.btn_upload = (block) => {
  return '';
};

mBlockly.Blocks.btn_upload = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.app.upload)
    this.setOutput(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_SLEEP);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
