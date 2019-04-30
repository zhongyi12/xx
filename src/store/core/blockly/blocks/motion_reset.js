const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.reset = (block) => {
  // genFuncCode(null, block);
  //
  // const wait = Blockly.JavaScript.valueToCode(block, 'wait', Blockly.JavaScript.ORDER_ATOMIC) === 'true' ? true : false;
  const wait = true;
  const params = {};

  // return `${BlocklyCom.blocklyLib.consoleLog(block, params)}await window.xArmVuex.commit('RESET_XARM_POSITION');\n`;
  let code = '';
  code += BlocklyCom.blocklyLib.consoleLog(block, params);
  const online = `window.GlobalUtil.model.robot.state.isMoving = true;await window.GlobalUtil.model.robot.state.func.resetXarmPosition(${wait}, (dict) => { console.log(dict); window.GlobalUtil.model.robot.state.isMoving = false; } );${BlocklyCom.blocklyLib.movingWaitUntil(0.1)}`;
  const offline = `await window.GlobalUtil.model.robot.state.func.resetLocal();console.log('reset local');`;
  code += BlocklyCom.blocklyLib.onOffLineCode(online, offline);
  return code;
};

mBlockly.Blocks.reset = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.motion.reset)
    // this.appendValueInput('wait')
    //   .setCheck('Boolean')
    //   .appendField('Wait');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_JOINT);
    this.setTooltip(Blockly.Msg.toolTip.reset);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
