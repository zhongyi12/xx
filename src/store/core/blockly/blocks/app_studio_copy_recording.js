const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.studio_copy_recording = (block) => {
  return '';
};

mBlockly.Blocks.studio_copy_recording = {
  init() {
    // this.appendValueInput('record')
    //   .appendField(Blockly.Msg.app.record_copy);
    this.appendDummyInput()
      .appendField(Blockly.Msg.app.record_copy)
      .appendField(new Blockly.FieldTextInput(''), 'record');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_APP);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
