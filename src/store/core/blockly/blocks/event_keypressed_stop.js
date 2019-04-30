const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.event_keypressed_stop = (block) => {
  // genFuncCode(null, block);
  //
  return 'BlocklyCom.blocklyLib.KeyPressEvent.clearEventListener();\n';
};

mBlockly.Blocks.event_keypressed_stop = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.events.stopkeyboard);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_EVENT);
    this.setTooltip('');
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
