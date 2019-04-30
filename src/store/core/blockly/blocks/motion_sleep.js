const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.sleep = (block) => {
  const value = Blockly.JavaScript.valueToCode(block, 'sec', Blockly.JavaScript.ORDER_ATOMIC);
  const params = { value: value || 0 };
  // return genFuncCode(params, block);
  //
  const value2 = params.value;

  let code = '';
  code += BlocklyCom.blocklyLib.consoleLog(block, params);
  const online = `window.GlobalUtil.model.robot.state.isMoving = true;await window.CommandsRobotSocket.setSleepTime(${value2}, (response) => { console.log('sleep res', response);window.GlobalUtil.model.robot.state.isMoving = false; });${BlocklyCom.blocklyLib.movingWaitUntil(0.1)}`;
  const offline = `await BlocklyCom.blocklyLib.wait(${value2});console.log('off line off line');`;
  code += BlocklyCom.blocklyLib.onOffLineCode(online, offline);
  return code;
  // return `await BlocklyCom.blocklyLib.wait(${value2});\n`;
};

mBlockly.Blocks.sleep = {
  init() {
    this.appendValueInput('sec')
      .setCheck('Number')
      .appendField(Blockly.Msg.motion.sleep);
    this.appendDummyInput()
      .appendField(Blockly.Msg.motion.sleepUnit);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_SLEEP);
    this.setTooltip(Blockly.Msg.toolTip.sleep);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
