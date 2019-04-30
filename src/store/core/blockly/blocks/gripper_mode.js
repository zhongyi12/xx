const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.gripper_mode = (block) => {
  // const mode = Blockly.JavaScript.valueToCode(block, 'mode', Blockly.JavaScript.ORDER_ATOMIC);
  const mode = block.getFieldValue('mode');
  const params = { mode };

  let code = '';
  code += BlocklyCom.blocklyLib.consoleLog(block, params);
  const online = `window.GlobalUtil.model.robot.state.isMoving = true;window.CommandsRobotSocket.setGripperMode(${params.mode}, (response) => { console.log('gripper mode res', response);window.GlobalUtil.model.robot.state.isMoving = false; });${BlocklyCom.blocklyLib.movingWaitUntil(0.1)};`;
  const offline = `await BlocklyCom.blocklyLib.wait(2);console.log('off line off line');`;
  code += BlocklyCom.blocklyLib.onOffLineCode(online, offline);
  return code;
};

mBlockly.Blocks.gripper_mode = {
  init() {
    this.appendDummyInput()
      .appendField('(即将移除，请勿使用)')
      .appendField(Blockly.Msg.GRIPPER_MODE)
      .appendField(new Blockly.FieldDropdown([['1', '1'], ['2', '2'], ['3', '3']]), 'mode');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    // this.setNextStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_REMOVE);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
