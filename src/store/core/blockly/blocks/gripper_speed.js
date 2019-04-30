const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.gripper_speed = (block) => {
  const speed = Blockly.JavaScript.valueToCode(block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
  // const speed = block.getFieldValue('speed');
  const params = { speed };

  let code = '';
  code += BlocklyCom.blocklyLib.consoleLog(block, params);
  const online = `window.GlobalUtil.model.robot.state.isMoving = true;window.CommandsRobotSocket.setGripperSpeed(${params.speed}, (response) => { console.log('gripper mode res', response);window.GlobalUtil.model.robot.state.isMoving = false; });${BlocklyCom.blocklyLib.movingWaitUntil(0.1)};`;
  const offline = `await BlocklyCom.blocklyLib.wait(2);console.log('off line off line');`;
  code += BlocklyCom.blocklyLib.onOffLineCode(online, offline);
  return code;
};

mBlockly.Blocks.gripper_speed = {
  init() {
    this.appendValueInput('speed')
      .setCheck('Number')
      .appendField('(即将移除，请勿使用)')
      .appendField(Blockly.Msg.GRIPPER_SPEED);
    // this.appendDummyInput()
    //   .appendField(Blockly.Msg.motion.speed)
    //   .appendField(new Blockly.FieldDropdown([['1x', '1'], ['2x', '2'],
    //     ['4x', '4']]), 'speed');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_REMOVE);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
