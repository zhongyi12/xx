const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.btn_move = (block) => {
  return '';
};

mBlockly.Blocks.btn_move = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.motion.btnMove)
    this.setOutput(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_LOOP);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
