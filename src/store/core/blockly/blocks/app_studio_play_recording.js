const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.studio_play_recording = (block) => {
  // const record = Blockly.JavaScript.valueToCode(block, 'record', Blockly.JavaScript.ORDER_ATOMIC);
  const record = block.inputList[0].fieldRow[1].getText();
  // const speed = block.getFieldValue('speed');
  const params = { record };
  // return genFuncCode(params, block);
  //
  // return `${BlocklyCom.blocklyLib.consoleLog(block, params)}await window.CommandsAppsSocket.runTeach(${params.record});\n`;
  let code = '';
  code += BlocklyCom.blocklyLib.consoleLog(block, params);
  code += `window.Blockly.AppRunning = true;await window.CommandsAppsSocket.runTeach('${params.record}');${BlocklyCom.blocklyLib.movingWaitUntil(0.1, true)}\n`;
  return code;
};

mBlockly.Blocks.studio_play_recording = {
  init() {
    // this.appendValueInput('record')
    //   .appendField(Blockly.Msg.app.record);
    this.appendDummyInput()
      .appendField(Blockly.Msg.app.record)
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
