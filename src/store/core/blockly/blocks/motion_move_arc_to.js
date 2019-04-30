const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.move_arc_to = (block) => {
  const position = Blockly.JavaScript.valueToCode(block, 'position', Blockly.JavaScript.ORDER_ATOMIC);
  console.log(`position move arc to: ${position}`);
  const params = { position };
  // return genFuncCode(params, block);
  //
  params.position = params.position === '' ? '{"position":{"x":"201.5","y":"0","z":"140.5"},"orientation":{"roll":"180","yaw":"0","pitch":"0","r":"-1"},"wait":true}' : params.position;
  // const data = JSON.parse(params)
  // const args = `{"x": ${position.x}, "y": ${position.y}, "z": ${position.z}}`;
  let code = '';
  code += BlocklyCom.blocklyLib.consoleLog(block, params);
  // BlocklyCom.blocklyLib.isMoving
  // const waitUntil = 'await BlocklyCom.blocklyLib.waitUntil(() => { return window.GlobalUtil.model.robot.state.isMoving === false }, 0.3);\n';
  const online = `window.GlobalUtil.model.robot.state.isMoving = true;await window.CommandsRobotSocket.moveArcLine(${params.position}, ${JSON.parse(position).wait}, (response) => { console.log('move line res', response);window.GlobalUtil.model.robot.state.isMoving = false; });${BlocklyCom.blocklyLib.movingWaitUntil(0.1)}`;
  const offline = `await BlocklyCom.blocklyLib.wait(2);console.log('off line off line');`;
  code += BlocklyCom.blocklyLib.onOffLineCode(online, offline);
  return code;
};

mBlockly.Blocks.move_arc_to = {
  init() {
    this.appendValueInput('position')
      .setCheck('Array')
      .appendField(Blockly.Msg.motion.movearcto);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_MOTION);
    this.setTooltip(Blockly.Msg.toolTip.movearcto);
  },
  setValue(positions) {
    const posChildBlock = this.getChildren();
    if (posChildBlock.length > 0) {
      for (const item of posChildBlock[0].inputList) {
        if (item.connection !== null) {
          switch (item.name) {
            default:
              break;
            case 'x':
              item.connection.targetBlock().setFieldValue(Math.round(positions[0]).toString(), 'NUM');
              break;
            case 'y':
              item.connection.targetBlock().setFieldValue(Math.round(positions[1]).toString(), 'NUM');
              break;
            case 'z':
              item.connection.targetBlock().setFieldValue(Math.round(positions[2]).toString(), 'NUM');
              break;
            case 'a':
              item.connection.targetBlock().setFieldValue(Math.round(positions[3]).toString(), 'NUM');
              break;
            case 'b':
              item.connection.targetBlock().setFieldValue(Math.round(positions[4]).toString(), 'NUM');
              break;
            case 'c':
              item.connection.targetBlock().setFieldValue(Math.round(positions[5]).toString(), 'NUM');
              break;
            case 'r':
              item.connection.targetBlock().setFieldValue(Math.round(positions[6]).toString(), 'NUM');
              break;
            case 'wait':
              item.connection.targetBlock().setFieldValue(positions[7], 'BOOL');
              break;
          }
        }
      }
    }
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
