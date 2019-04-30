const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.gripper_enable = (block) => {
  const condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC);
  const params = { condition };
  // return genFuncCode(params, block);
  // return `await BlocklyCom.blocklyLib.waitUntil(()=> ${params.condition}, 0.1);\n`;

  let code = '';
  code += BlocklyCom.blocklyLib.consoleLog(block, params);
  const online = `window.GlobalUtil.model.robot.state.isMoving = true;window.CommandsRobotSocket.setGripperEnable(${params.condition}, (response) => { console.log('gripper enable res', response);window.GlobalUtil.model.robot.state.isMoving = false; });${BlocklyCom.blocklyLib.movingWaitUntil(0.1)};`;
  const offline = `await BlocklyCom.blocklyLib.wait(2);console.log('off line off line');`;
  code += BlocklyCom.blocklyLib.onOffLineCode(online, offline);
  return code;
};

mBlockly.Blocks.gripper_enable = {
  init() {
    this.appendValueInput('condition')
      .setCheck('Boolean')
      .appendField('(即将移除，请勿使用)')
      .appendField(Blockly.Msg.GRIPPER_ENABLE)
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_REMOVE);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
