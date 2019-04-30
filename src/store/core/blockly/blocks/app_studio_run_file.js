const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.studio_run_file = (block) => {
  // const type = block.inputList[0].fieldRow[2].getText();
  const type = block.getFieldValue('type')
  const radian = block.inputList[0].fieldRow[4].getText();
  const offset = block.inputList[0].fieldRow[6].getText();
  const speed = Number(block.inputList[0].fieldRow[8].getText());
  const acc = Number(block.inputList[0].fieldRow[10].getText());
  const filename = block.inputList[0].fieldRow[11].getText();
  const params = { type, radian, offset, speed, acc, filename };
  let code = '';
  code += BlocklyCom.blocklyLib.consoleLog(block, params);
  code += `window.Blockly.AppRunning = true;await window.CommandsAppsSocket.runCsvFile('${params.type}', ${params.radian}, '${params.offset}', ${params.speed}, ${params.acc}, '${params.filename}');${BlocklyCom.blocklyLib.movingWaitUntil(0.1, true)}\n`;
  return code;
};

mBlockly.Blocks.studio_run_file = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.app.exec.name)
      .appendField(Blockly.Msg.app.exec.type)
      .appendField(new Blockly.FieldDropdown([[Blockly.Msg.app.exec.joint, 'joint'],
      [Blockly.Msg.app.exec.cartesian, 'cartesian']]), 'type')
      .appendField(Blockly.Msg.app.exec.radian)
      .appendField(new Blockly.FieldDropdown([
        ['true', 'TRUE'],
        ['false', 'FALSE']
      ]), 'radian')
      .appendField(Blockly.Msg.app.exec.offset)
      .appendField(new Blockly.FieldTextInput('0,0,0,0,0,0,0'), 'offset')
      .appendField(Blockly.Msg.app.exec.speed)
      .appendField(new Blockly.FieldNumber(30), 'speed')
      .appendField(Blockly.Msg.app.exec.acc)
      .appendField(new Blockly.FieldNumber(1000), 'acc')
      .appendField(new Blockly.FieldTextInput(Blockly.Msg.app.exec.filename), 'file')

    this.appendValueInput('btn_upload')
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
