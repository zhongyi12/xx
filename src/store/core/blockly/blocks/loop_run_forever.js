const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.loop_run_forever = (block) => {
  const statement = Blockly.JavaScript.statementToCode(block, 'statement');
  const params = { statement };
  // return genFuncCode(params, block);
  //
  const statement2 = params.statement;
  return `await BlocklyCom.blocklyLib.runForever(async() => {\n${statement2}});\n`;
};

mBlockly.Blocks.loop_run_forever = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.LOOP_FOREVER);
    this.appendStatementInput('statement')
      .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_LOOP);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
