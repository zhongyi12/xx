const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.set_angle_acceleration = (block) => {
  const acceleration = Blockly.JavaScript.valueToCode(block, 'acceleration', Blockly.JavaScript.ORDER_ATOMIC);
  // const speed = block.getFieldValue('speed');
  const params = { acceleration };
  // return genFuncCode(params, block);
  //
  const acceleration2 = params.acceleration;
  const data = JSON.stringify({
    index: 'angle_acceleration',
    value: acceleration2,
  })
  // return `${BlocklyCom.blocklyLib.consoleLog(block, params)}window.xArmVuex.commit('SET_ROBOT_PARAM',${data});\n`;
  return `${BlocklyCom.blocklyLib.consoleLog(block, params)}window.GlobalUtil.model.robot.state.func.setRobotParam(${data});\n`;
};

mBlockly.Blocks.set_angle_acceleration = {
  init() {
    this.appendValueInput('acceleration')
      .setCheck('Number')
      .appendField(Blockly.Msg.motion.angleacceleration);
    this.appendDummyInput()
      .appendField(Blockly.Msg.motion.angleAccelerationUnit);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_SPEED);
    this.setTooltip(Blockly.Msg.toolTip.acceleration);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
