const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.studio_run_app = (block) => {
  const other = Blockly.JavaScript.valueToCode(block, 'other', Blockly.JavaScript.ORDER_ATOMIC);
  // const speed = block.getFieldValue('speed');
  const params = { other };
  console.log(params);
  return `${BlocklyCom.blocklyLib.consoleLog(block, params)}`;
};

mBlockly.Blocks.studio_run_app = {
  init() {
    // this.appendValueInput('other')
    //   .appendField(Blockly.Msg.app.other);
    this.appendDummyInput()
      .appendField(Blockly.Msg.app.other)
      .appendField(new Blockly.FieldTextInput(''), 'other');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_APP);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
