const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.position7 = (block) => {
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
  
  const wait = fieldRow[fieldRow.length - 1].getText() === 'true' ? true : false;
  // const wait = block.childBlocks_[0].inputList[0].fieldRow[0].getText() === 'true' ? true : false;
  const params = { i, j, k, l, m, n, o };
  const positions = { i: params.i, j: params.j, k: params.k, l: params.l, m: params.m, n: params.n, o: params.o, wait: wait };
  return [JSON.stringify(positions)];
};

mBlockly.Blocks.position7 = {
  init() {
    // const createAngleField = () => {
    //   const field = new Blockly.FieldAngle('0');
    //   // field.EDITABLE = false;
    //   return field;
    // }
    const createNumberField = (opt_value, opt_min, opt_max) => {
      const field = new Blockly.FieldNumber(opt_value, opt_min, opt_max);
      return field;
    }
    const joints = window.GlobalUtil.model.robot.state.range.joint;
    if (window.GlobalUtil.model.robot.state.info.xarm_axis === 5) {
      this.appendDummyInput()
        .appendField(Blockly.Msg.motion.axis)
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
        .appendField(Blockly.Msg.motion.axis)
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
        .appendField(Blockly.Msg.motion.axis)
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
    // this.appendDummyInput()
    //   .appendField(Blockly.Msg.motion.axis)
    //   // .appendField('°')
    //   .appendField('J1')
    //   .appendField(createNumberField(0, -180, 180), 'i')
    //   .appendField('J2')
    //   .appendField(createNumberField(0, -180, 180), 'j')
    //   .appendField('J3')
    //   .appendField(createNumberField(0, -180, 180), 'k')
    //   .appendField('J4')
    //   .appendField(createNumberField(0, -180, 180), 'l')
    //   .appendField('J5')
    //   .appendField(createNumberField(0, -180, 180), 'm')
    //   .appendField('J6')
    //   .appendField(createNumberField(0, -180, 180), 'n')
    //   .appendField('J7')
    //   .appendField(createNumberField(0, -180, 180), 'o')
    //   .appendField('Wait')
    //   .appendField(new Blockly.FieldDropdown([
    //     ['true', 'TRUE'],
    //     ['false', 'FALSE']
    //   ]), 'wait')
    // this.appendValueInput('wait')
    //   .setCheck('Boolean')
    //   .appendField('Wait');
    this.appendValueInput('btn');
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_JOINT);
    this.setTooltip(Blockly.Msg.toolTip.axis);
  },
  onchange(event) {
    if (event.type === 'change' && BlocklyCom.blocklyLib.isChildBlock(event.blockId, this)) {
      const joints = window.GlobalUtil.model.robot.state.range.joint;
      for (const item of this.inputList) {
        if (item.connection !== null) {
          const value = item.connection.targetBlock().getFieldValue('NUM');
          switch (item.name) {
            default:
              break;
            case 'i':
              item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, joints[0].min), joints[0].max), 'NUM');
              break;
            case 'j':
              item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, joints[1].min), joints[1].max), 'NUM');
              break;
            case 'k':
              item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, joints[2].min), joints[2].max), 'NUM');
              break;
            case 'l':
              item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, joints[3].min), joints[3].max), 'NUM');
              break;
            case 'm':
              item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, joints[4].min), joints[4].max), 'NUM');
              break;
            case 'n':
              item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, joints[5].min), joints[5].max), 'NUM');
              break;
            case 'o':
              item.connection.targetBlock().setFieldValue(Math.min(Math.max(value, joints[6].min), joints[6].max), 'NUM');
              break;
            case 'wait':
              item.connection.targetBlock().setFieldValue(item.connection.targetBlock().getFieldValue('BOOL'), 'BOOL');
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
