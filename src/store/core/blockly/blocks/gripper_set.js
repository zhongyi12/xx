const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.gripper_set = (block) => {
  const position = Blockly.JavaScript.valueToCode(block, 'pos', Blockly.JavaScript.ORDER_ATOMIC);
  const speed = Blockly.JavaScript.valueToCode(block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
  const wait = Blockly.JavaScript.valueToCode(block, 'wait', Blockly.JavaScript.ORDER_ATOMIC) === 'true' ? true: false;

  let code = '';
  // code += BlocklyCom.blocklyLib.consoleLog(block, params);
  const online = `window.GlobalUtil.model.robot.state.isMoving = true;window.CommandsRobotSocket.setGripperPosition(${position}, ${speed}, ${wait}, (response) => { console.log('gripper mode res', response);window.GlobalUtil.model.robot.state.isMoving = false; });${BlocklyCom.blocklyLib.movingWaitUntil(0.1)};`;
  const offline = `await BlocklyCom.blocklyLib.wait(2);console.log('off line off line');`;
  code += BlocklyCom.blocklyLib.onOffLineCode(online, offline);
  console.log(code);
  return code;
};

mBlockly.Blocks.gripper_set = {
  init() {
    // this.appendValueInput('speed')
    //   .setCheck('Number')
    //   .appendField(Blockly.Msg.GRIPPER_POSITION);
    // this.appendDummyInput()
    //   .appendField(Blockly.Msg.motion.speed)
    //   .appendField(new Blockly.FieldDropdown([['1x', '1'], ['2x', '2'],
    //     ['4x', '4']]), 'speed');
    this.appendDummyInput()
      .appendField(Blockly.Msg.SET_GRIPPER);
    this.appendValueInput('pos')
      .setCheck('Number')
      .appendField(Blockly.Msg.fitting.gripper.pos);
    this.appendValueInput('speed')
      .setCheck('Number')
      .appendField(Blockly.Msg.fitting.gripper.speed);
    this.appendValueInput('wait')
      .setCheck('Boolean')
      .appendField('Wait');
    this.appendValueInput('btn_move');
    this.appendValueInput('btn_edit');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_GRIPPER);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
