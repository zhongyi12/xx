const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.set_speed = (block) => {
  const speed = Blockly.JavaScript.valueToCode(block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
  // const speed = block.getFieldValue('speed');
  const params = { speed };
  // return genFuncCode(params, block);
  //
  const speed2 = params.speed;
  const data = JSON.stringify({
    index: 'speed',
    value: speed2,
  })
  // return `${BlocklyCom.blocklyLib.consoleLog(block, params)}window.xArmVuex.commit('SET_ROBOT_PARAM',${data});\n`;
  return `${BlocklyCom.blocklyLib.consoleLog(block, params)}window.GlobalUtil.model.robot.state.func.setRobotParam(${data});\n`;
};

mBlockly.Blocks.set_speed = {
  init() {
    this.appendValueInput('speed')
      .setCheck('Number')
      .appendField(Blockly.Msg.motion.speed);
    this.appendDummyInput()
      .appendField(Blockly.Msg.motion.speedUnit);
    // this.appendDummyInput()
    //   .appendField(Blockly.Msg.motion.speed)
    //   .appendField(new Blockly.FieldDropdown([['1x', '1'], ['2x', '2'],
    //     ['4x', '4']]), 'speed');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_SPEED);
    this.setTooltip(Blockly.Msg.toolTip.speed);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
