const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.btn = (block) => {
  return '';
};

mBlockly.Blocks.btn = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.motion.set)
    this.setOutput(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_ADVANCE);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
