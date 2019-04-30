const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.motion_stop = (block) => {
  // genFuncCode(null, block);
  //
  // const wait = Blockly.JavaScript.valueToCode(block, 'wait', Blockly.JavaScript.ORDER_ATOMIC) === 'true' ? true : false;
  const wait = true;
  const params = {};

  // return `${BlocklyCom.blocklyLib.consoleLog(block, params)}await window.xArmVuex.commit('RESET_XARM_POSITION');\n`;
  let code = '';
  code += BlocklyCom.blocklyLib.consoleLog(block, params);
  const online = `window.CommandsRobotSocket.urgentStop(true, () => {});${BlocklyCom.blocklyLib.movingWaitUntil(0.1)}`;
  const offline = ``;
  code += BlocklyCom.blocklyLib.onOffLineCode(online, offline);
  return code;
};

mBlockly.Blocks.motion_stop = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.motion.stop)
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_ADVANCE);
    this.setTooltip(Blockly.Msg.toolTip.stop);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
