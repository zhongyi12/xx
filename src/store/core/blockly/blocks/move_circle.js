const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.move_circle = (block) => {
  const percent = Number(Blockly.JavaScript.valueToCode(block, 'percent', Blockly.JavaScript.ORDER_ATOMIC));
  const position1 = JSON.parse(Blockly.JavaScript.valueToCode(block, 'position1', Blockly.JavaScript.ORDER_ATOMIC));
  const position2 = JSON.parse(Blockly.JavaScript.valueToCode(block, 'position2', Blockly.JavaScript.ORDER_ATOMIC));
  const wait = Blockly.JavaScript.valueToCode(block, 'wait', Blockly.JavaScript.ORDER_ATOMIC);
  const pose1 = [
    Number(position1.position.x), Number(position1.position.y), Number(position1.position.z),
    Number(position1.orientation.roll), Number(position1.orientation.pitch), Number(position1.orientation.yaw),
  ];
  const pose2 = [
    Number(position2.position.x), Number(position2.position.y), Number(position2.position.z),
      Number(position2.orientation.roll), Number(position2.orientation.pitch), Number(position2.orientation.yaw),
  ];
  // return genFuncCode(params, block);
  //
  // params.position = params.position === '' ? '{"position":{"x":"201.5","y":"0","z":"140.5"},"orientation":{"roll":"180","yaw":"0","pitch":"0","r":"-1"},"wait":true}' : params.position;
  // // const data = JSON.parse(params)
  // // const args = `{"x": ${position.x}, "y": ${position.y}, "z": ${position.z}}`;
  let code = '';
  // BlocklyCom.blocklyLib.isMoving
  // const waitUntil = 'await BlocklyCom.blocklyLib.waitUntil(() => { return window.GlobalUtil.model.robot.state.isMoving === false }, 0.3);\n';
  const online = `window.GlobalUtil.model.robot.state.isMoving = true;await window.CommandsRobotSocket.moveCircle(${JSON.stringify(pose1)}, ${JSON.stringify(pose2)}, ${percent}, ${wait}, (response) => { console.log('move line res', response);window.GlobalUtil.model.robot.state.isMoving = false; });${BlocklyCom.blocklyLib.movingWaitUntil(0.1)}`;
  const offline = `await BlocklyCom.blocklyLib.wait(2);console.log('off line off line');`;
  code += BlocklyCom.blocklyLib.onOffLineCode(online, offline);
  return code;
};

mBlockly.Blocks.move_circle = {
  // new Blockly.FieldNumber(opt_value, opt_min, opt_max)
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.motion.circle.move)
    this.appendValueInput('position1')
      .setCheck('Array')
      .appendField(Blockly.Msg.motion.circle.pose1)
      .setAlign(Blockly.ALIGN_RIGHT)
    this.appendValueInput('position2')
      .setCheck('Array')
      .appendField(Blockly.Msg.motion.circle.pose2)
      .setAlign(Blockly.ALIGN_RIGHT)
    this.appendValueInput('percent')
      .setCheck('Number')
      .appendField(Blockly.Msg.motion.circle.percent)
      .setAlign(Blockly.ALIGN_RIGHT)
    this.appendValueInput('wait')
      .setCheck('Boolean')
      .appendField('Wait')
      .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('btn_move')
    // this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_MOTION);
    this.setTooltip(Blockly.Msg.toolTip.movecircle);
  },
  // setValue(positions) {
  //   const posChildBlock = this.getChildren();
  //   if (posChildBlock.length > 0) {
  //     for (const item of posChildBlock[0].inputList) {
  //       if (item.connection !== null) {
  //         switch (item.name) {
  //           default:
  //             break;
  //           case 'x':
  //             item.connection.targetBlock().setFieldValue(Math.round(positions[0]).toString(), 'NUM');
  //             break;
  //           case 'y':
  //             item.connection.targetBlock().setFieldValue(Math.round(positions[1]).toString(), 'NUM');
  //             break;
  //           case 'z':
  //             item.connection.targetBlock().setFieldValue(Math.round(positions[2]).toString(), 'NUM');
  //             break;
  //           case 'a':
  //             item.connection.targetBlock().setFieldValue(Math.round(positions[3]).toString(), 'NUM');
  //             break;
  //           case 'b':
  //             item.connection.targetBlock().setFieldValue(Math.round(positions[4]).toString(), 'NUM');
  //             break;
  //           case 'c':
  //             item.connection.targetBlock().setFieldValue(Math.round(positions[5]).toString(), 'NUM');
  //             break;
  //           case 'r':
  //             item.connection.targetBlock().setFieldValue(Math.round(positions[6]).toString(), 'NUM');
  //             break;
  //           case 'wait':
  //             item.connection.targetBlock().setFieldValue(positions[7], 'BOOL');
  //             break;
  //         }
  //       }
  //     }
  //   }
  // },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
