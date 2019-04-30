const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.wait = (block) => {
  const value = Blockly.JavaScript.valueToCode(block, 'sec', Blockly.JavaScript.ORDER_ATOMIC);
  const params = { value: value || 0 };
  // return genFuncCode(params, block);
  //
  const value2 = params.value;
  return `await BlocklyCom.blocklyLib.wait(${value2});\n`;
};

mBlockly.Blocks.wait = {
  init() {
    this.appendValueInput('sec')
      .setCheck('Number')
      .appendField(Blockly.Msg.motion.wait);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_LOGIC);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
