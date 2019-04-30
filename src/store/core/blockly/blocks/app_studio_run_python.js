const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.studio_run_python = (block) => {
  // const ide = Blockly.JavaScript.valueToCode(block, 'ide', Blockly.JavaScript.ORDER_ATOMIC);
  const ide = block.inputList[0].fieldRow[1].getText();
  // const speed = block.getFieldValue('speed');
  const params = { ide };
  // return genFuncCode(params, block);
  //
  // return `${BlocklyCom.blocklyLib.consoleLog(block, params)}await window.CommandsAppsSocket.runPython(${params.ide});\n`;
  let code = '';
  code += BlocklyCom.blocklyLib.consoleLog(block, params);
  code += `window.Blockly.AppRunning = true;await window.CommandsAppsSocket.runPython('${params.ide}');${BlocklyCom.blocklyLib.movingWaitUntil(0.1, true)}\n`;
  return code;
};

mBlockly.Blocks.studio_run_python = {
  init() {
    // this.appendValueInput('ide')
    //   .appendField(Blockly.Msg.app.ide);
    this.appendDummyInput()
      .appendField(Blockly.Msg.app.ide)
      .appendField(new Blockly.FieldTextInput(''), 'ide');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_APP);
  },
  // onchange(event) {
  //   console.log('onchange,', event, this)
  // }
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
