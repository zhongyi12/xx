const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.loop_break = (block) => {
  // genFuncCode(null, block);
  //
  return 'break;';
};

mBlockly.Blocks.loop_break = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.LOOP_BREAK);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_LOOP);
    this.setTooltip('');
    this.setHelpUrl('');
  },
  onMove() {
    // console.log('onMove');
    const parent = this.getParent();
    if (!this.isInFlyout) {
      if (parent !== null) {
        switch (parent.type) {
          case 'controls_whileUntil':
            this.setDisabled(false);
            return;
          case 'controls_repeat_ext':
            this.setDisabled(false);
            return;
          case 'controls_for':
            this.setDisabled(false);
            return;
          case 'controls_forEach':
            this.setDisabled(false);
            return;
          default:
            Blockly.messageBox('warning', Blockly.Msg.WARNING, Blockly.Msg.MSG_LOOP_BREAK);
            this.setDisabled(true);
        }
      }
      Blockly.messageBox('warning', Blockly.Msg.WARNING, Blockly.Msg.MSG_LOOP_BREAK);
      this.setDisabled(true);
    }
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
