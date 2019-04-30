const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.tool_remark = (block) => {
  return '';
};

mBlockly.Blocks.tool_remark = {
  init() {
    // this.appendValueInput('msg')
    //   .setCheck('String')
    //   .appendField(Blockly.Msg.TEXT_REMARK);
    this.appendDummyInput()
      .appendField(Blockly.Msg.TEXT_REMARK)
      .appendField(new Blockly.FieldTextInput(Blockly.Msg.TEXT_REMARK), 'msg')
      .appendField(new Blockly.FieldColour(BlocklyDefaultColor.COLOR_TEXT), 'colour');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_REMARK);
    this.setTooltip('');
    this.setHelpUrl('');
  },
  onchange(event) {
    this.setColour(this.inputList[0].fieldRow[2].colour_)
  }
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
