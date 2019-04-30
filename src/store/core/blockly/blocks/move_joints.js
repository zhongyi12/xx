const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.move_joints = (block) => {
  const fieldRow = block.inputList[0].fieldRow;
  const i = Number(fieldRow[2].getText());
  const j = Number(fieldRow[4].getText());
  const k = Number(fieldRow[6].getText());
  const l = Number(fieldRow[8].getText());
  const m = Number(fieldRow[10].getText());
  // const n = Number(fieldRow[12].getText());
  // const o = Number(fieldRow[14].getText());
  // const wait = fieldRow[16].getText() === 'true' ? true : false;
  let n = 0, o = 0;
  if (window.GlobalUtil.model.robot.state.info.xarm_axis > 5) {
    n = Number(fieldRow[12].getText());
  }
  if (window.GlobalUtil.model.robot.state.info.xarm_axis > 6) {
    o = Number(fieldRow[14].getText());
  }
  const positions = [i, j, k, l, m, n, o];
  const wait = fieldRow[fieldRow.length - 1].getText() === 'true' ? true : false;
  let code = '';
  code += BlocklyCom.blocklyLib.consoleLog(block, positions);
  code += `window.GlobalUtil.model.robot.state.isMoving = true;await window.GlobalUtil.model.robot.state.func.setRobotMoveAllJoints(${JSON.stringify(positions)}, ${wait}, (response) => {window.GlobalUtil.model.robot.state.isMoving = false;});${BlocklyCom.blocklyLib.movingWaitUntil(0.1)}\n`;
  return code;

  // const position = Blockly.JavaScript.valueToCode(block, 'position7', Blockly.JavaScript.ORDER_ATOMIC);
  // console.log(`position7: ${position}`);
  // const params = { position };
  // // return genFuncCode(params, block);
  // //
  // const defaltStr = '{ "i": 0, "j": 0, "k": 0, "l": 0, "m": 0, "n": 0, "o": 0, "wait": true }';
  // params.position = params.position === '' ? defaltStr : params.position;
  // const position2 = JSON.parse(params.position);
  // // const args = `{"i": ${position.i}, "j": ${position.j}, "k": ${position.k},
  // // "l": ${position.l}, "m": ${position.m}, "n": ${position.n}, "o": ${position.o}}`;
  // const args = `[${position2.i}, ${position2.j}, ${position2.k}, 
  // ${position2.l}, ${position2.m}, ${position2.n}, ${position2.o}]`;
  // const wait = `${position2.wait}`;

  // // return `${BlocklyCom.blocklyLib.consoleLog(block, params)}await window.xArmVuex.commit('ROBOT_MOVE_JOINT', ${args});\n`;
  // // return `await UArm.set_joint(${args});\n`;
  // // return `${BlocklyCom.blocklyLib.consoleLog(block, params)};await window.GlobalUtil.model.robot.state.func.setRobotMoveAllJoints(${args}, true, () => {});\n`;
  // let code = '';
  // code += BlocklyCom.blocklyLib.consoleLog(block, params);
  // code += `window.GlobalUtil.model.robot.state.isMoving = true;await window.GlobalUtil.model.robot.state.func.setRobotMoveAllJoints(${args}, ${wait}, (response) => {window.GlobalUtil.model.robot.state.isMoving = false;});${BlocklyCom.blocklyLib.movingWaitUntil(0.1)}\n`;
  // return code;
};

mBlockly.Blocks.move_joints = {
  init() {
    const createNumberField = (opt_value, opt_min, opt_max) => {
      const field = new Blockly.FieldNumber(opt_value, opt_min, opt_max);
      return field;
    }
    const joints = window.GlobalUtil.model.robot.state.range.joint;
    if (window.GlobalUtil.model.robot.state.info.xarm_axis === 5) {
      this.appendDummyInput()
        .appendField(Blockly.Msg.motion.moveJoints)
        // .appendField('°')
        .appendField('J1')
        .appendField(createNumberField(0, joints[0].min, joints[0].max), 'i')
        .appendField('J2')
        .appendField(createNumberField(0, joints[1].min, joints[1].max), 'j')
        .appendField('J3')
        .appendField(createNumberField(0, joints[2].min, joints[2].max), 'k')
        .appendField('J4')
        .appendField(createNumberField(0, joints[3].min, joints[3].max), 'l')
        .appendField('J5')
        .appendField(createNumberField(0, joints[4].min, joints[4].max), 'm')
        .appendField('Wait')
        .appendField(new Blockly.FieldDropdown([
          ['true', 'TRUE'],
          ['false', 'FALSE']
        ]), 'wait')
    }
    else if (window.GlobalUtil.model.robot.state.info.xarm_axis === 6) {
      this.appendDummyInput()
        .appendField(Blockly.Msg.motion.moveJoints)
        // .appendField('°')
        .appendField('J1')
        .appendField(createNumberField(0, joints[0].min, joints[0].max), 'i')
        .appendField('J2')
        .appendField(createNumberField(0, joints[1].min, joints[1].max), 'j')
        .appendField('J3')
        .appendField(createNumberField(0, joints[2].min, joints[2].max), 'k')
        .appendField('J4')
        .appendField(createNumberField(0, joints[3].min, joints[3].max), 'l')
        .appendField('J5')
        .appendField(createNumberField(0, joints[4].min, joints[4].max), 'm')
        .appendField('J6')
        .appendField(createNumberField(0, joints[5].min, joints[5].max), 'n')
        .appendField('Wait')
        .appendField(new Blockly.FieldDropdown([
          ['true', 'TRUE'],
          ['false', 'FALSE']
        ]), 'wait')
    }
    else {
      this.appendDummyInput()
        .appendField(Blockly.Msg.motion.moveJoints)
        // .appendField('°')
        .appendField('J1')
        .appendField(createNumberField(0, joints[0].min, joints[0].max), 'i')
        .appendField('J2')
        .appendField(createNumberField(0, joints[1].min, joints[1].max), 'j')
        .appendField('J3')
        .appendField(createNumberField(0, joints[2].min, joints[2].max), 'k')
        .appendField('J4')
        .appendField(createNumberField(0, joints[3].min, joints[4].max), 'l')
        .appendField('J5')
        .appendField(createNumberField(0, joints[4].min, joints[4].max), 'm')
        .appendField('J6')
        .appendField(createNumberField(0, joints[5].min, joints[5].max), 'n')
        .appendField('J7')
        .appendField(createNumberField(0, joints[6].min, joints[6].max), 'o')
        .appendField('Wait')
        .appendField(new Blockly.FieldDropdown([
          ['true', 'TRUE'],
          ['false', 'FALSE']
        ]), 'wait')
    }
    this.appendValueInput('btn_move');
    this.appendValueInput('btn_edit');
    this.setInputsInline(true);
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
