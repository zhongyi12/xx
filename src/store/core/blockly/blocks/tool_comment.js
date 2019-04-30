const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.tool_comment = (block) => {
  const statement = Blockly.JavaScript.statementToCode(block, 'statement');
  const params = { statement };
  const statement2 = params.statement;
  return `\n${statement2}\n`;
};

mBlockly.Blocks.tool_comment = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.TEXT_REMARK)
      .appendField(new Blockly.FieldTextInput(Blockly.Msg.TEXT_REMARK), 'msg')
      .appendField(new Blockly.FieldColour(BlocklyDefaultColor.COLOR_COMMENT), 'colour');
    this.appendStatementInput('statement')
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_TEXT);
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
