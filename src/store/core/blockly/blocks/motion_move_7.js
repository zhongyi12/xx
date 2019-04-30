const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.move_7 = (block) => {
  const position = Blockly.JavaScript.valueToCode(block, 'position7', Blockly.JavaScript.ORDER_ATOMIC);
  console.log(`position7: ${position}`);
  const params = { position };
  // return genFuncCode(params, block);
  //
  const defaltStr = '{ "i": 0, "j": 0, "k": 0, "l": 0, "m": 0, "n": 0, "o": 0, "wait": true }';
  params.position = params.position === '' ? defaltStr : params.position;
  const position2 = JSON.parse(params.position);
  // const args = `{"i": ${position.i}, "j": ${position.j}, "k": ${position.k},
  // "l": ${position.l}, "m": ${position.m}, "n": ${position.n}, "o": ${position.o}}`;
  const args = `[${position2.i}, ${position2.j}, ${position2.k}, 
  ${position2.l}, ${position2.m}, ${position2.n}, ${position2.o}]`;
  const wait = `${position2.wait}`;

  // return `${BlocklyCom.blocklyLib.consoleLog(block, params)}await window.xArmVuex.commit('ROBOT_MOVE_JOINT', ${args});\n`;
  // return `await UArm.set_joint(${args});\n`;
  // return `${BlocklyCom.blocklyLib.consoleLog(block, params)};await window.GlobalUtil.model.robot.state.func.setRobotMoveAllJoints(${args}, true, () => {});\n`;
  let code = '';
  code += BlocklyCom.blocklyLib.consoleLog(block, params);
  code += `window.GlobalUtil.model.robot.state.isMoving = true;await window.GlobalUtil.model.robot.state.func.setRobotMoveAllJoints(${args}, ${wait}, (response) => {window.GlobalUtil.model.robot.state.isMoving = false;});${BlocklyCom.blocklyLib.movingWaitUntil(0.1)}\n`;
  return code;
};

mBlockly.Blocks.move_7 = {
  init() {
    this.appendValueInput('position7')
      .setCheck('Array')
      .appendField(Blockly.Msg.motion.moveto);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_JOINT);
    this.setTooltip(Blockly.Msg.toolTip.moveto);
  },
  setValue(positions) {
    const posChildBlock = this.getChildren();
    if (posChildBlock.length > 0) {
      for (const item of posChildBlock[0].inputList) {
        if (item.connection !== null) {
          switch (item.name) {
            default:
              break;
            case 'i':
              item.connection.targetBlock().setFieldValue(Math.round(positions[0]).toString(), 'NUM');
              break;
            case 'j':
              item.connection.targetBlock().setFieldValue(Math.round(positions[1]).toString(), 'NUM');
              break;
            case 'k':
              item.connection.targetBlock().setFieldValue(Math.round(positions[2]).toString(), 'NUM');
              break;
            case 'l':
              item.connection.targetBlock().setFieldValue(Math.round(positions[3]).toString(), 'NUM');
              break;
            case 'm':
              item.connection.targetBlock().setFieldValue(Math.round(positions[4]).toString(), 'NUM');
              break;
            case 'n':
              item.connection.targetBlock().setFieldValue(Math.round(positions[5]).toString(), 'NUM');
              break;
            case 'o':
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
