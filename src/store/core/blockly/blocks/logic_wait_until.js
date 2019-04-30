const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.wait_until = (block) => {
  const condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC);
  const params = { condition };
  // return genFuncCode(params, block);
  //
  return `await BlocklyCom.blocklyLib.waitUntil(()=> ${params.condition}, 0.1);\n`;
};

mBlockly.Blocks.wait_until = {
  init() {
    this.appendValueInput('condition')
      .setCheck('Boolean')
      .appendField(Blockly.Msg.LOGIC_WAIT_UNTIL);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_LOGIC);
  },
  onStop() {
    BlocklyCom.blocklyLib.waitUntilTrigger.forEach((trigger) => {
      clearInterval(trigger);
    });
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
