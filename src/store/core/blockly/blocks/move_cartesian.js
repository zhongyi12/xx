const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.move_cartesian = (block) => {
  const fieldRow = block.inputList[0].fieldRow;
  const x = Number(fieldRow[2].getText());
  const y = Number(fieldRow[4].getText());
  const z = Number(fieldRow[6].getText());
  const a = Number(fieldRow[8].getText());
  const b = Number(fieldRow[10].getText());
  const c = Number(fieldRow[12].getText());
  const r = Number(fieldRow[14].getText());
  const wait = fieldRow[fieldRow.length - 1].getText() === 'true' ? true : false;
  const position = { x: x, y: y, z: z };
  const orientation = {
    roll: a,
    pitch: b,
    yaw: c,
    r: r,
  }
  const params = {
    position: position,
    orientation: orientation
  }
  let code = '';
  code += BlocklyCom.blocklyLib.consoleLog(block, params);
  // BlocklyCom.blocklyLib.isMoving
  // const waitUntil = 'await BlocklyCom.blocklyLib.waitUntil(() => { return window.GlobalUtil.model.robot.state.isMoving === false }, 0.3);\n';
  code += `window.GlobalUtil.model.robot.state.isMoving = true;await window.CommandsRobotSocket.moveArcLine(${JSON.stringify(params)}, ${wait}, (response) => { console.log('move line res', response);window.GlobalUtil.model.robot.state.isMoving = false; });${BlocklyCom.blocklyLib.movingWaitUntil(0.1)}`;
  return code;
};

mBlockly.Blocks.move_cartesian = {
  init() {
    const createNumberField = (opt_value, opt_min, opt_max) => {
      const field = new Blockly.FieldNumber(opt_value, opt_min, opt_max);
      return field;
    }
    const position = window.GlobalUtil.model.robot.state.range.position;
    const orientation = window.GlobalUtil.model.robot.state.range.orientation;
    this.appendDummyInput()
      .appendField(Blockly.Msg.motion.moveCartesian)
      .appendField('X')
      .appendField(createNumberField(201.5, position.x.min, position.x.max), 'x')
      .appendField('Y')
      .appendField(createNumberField(0, position.y.min, position.y.max), 'y')
      .appendField('Z')
      .appendField(createNumberField(140.5, position.z.min, position.z.max), 'z')
      .appendField('Roll')
      .appendField(createNumberField(-180, orientation.roll.min, orientation.roll.max), 'a')
      .appendField('Pitch')
      .appendField(createNumberField(0, orientation.pitch.min, orientation.pitch.max), 'b')
      .appendField('Yaw')
      .appendField(createNumberField(0, orientation.yaw.min, orientation.yaw.max), 'c')
      .appendField('Radius')
      .appendField(createNumberField(-1), 'r')
      .appendField('Wait')
      .appendField(new Blockly.FieldDropdown([
        ['true', 'TRUE'],
        ['false', 'FALSE']
      ]), 'wait')
    this.appendValueInput('btn_move');
    this.appendValueInput('btn_edit');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_MOTION);
    this.setTooltip(Blockly.Msg.toolTip.movearcto);
  },
  onchange(event) {
    if (event.type === 'change' && BlocklyCom.blocklyLib.isChildBlock(event.blockId, this)) {
      console.log('inputlist', this)
      for (const item of this.inputList) {
        if (item.connection !== null) {
          const value = item.connection.targetBlock().getFieldValue('NUM');
          switch (item.name) {
            default:
              break;
            case 'x':
              item.connection.targetBlock().setFieldValue(value, 'NUM');
              break;
            case 'y':
              item.connection.targetBlock().setFieldValue(value, 'NUM');
              break;
            case 'z':
              item.connection.targetBlock().setFieldValue(value, 'NUM');
              break;
            case 'a':
              item.connection.targetBlock().setFieldValue(value, 'NUM');
              break;
            case 'b':
              item.connection.targetBlock().setFieldValue(value, 'NUM');
              break;
            case 'c':
              item.connection.targetBlock().setFieldValue(value, 'NUM');
              break;
            case 'r':
              item.connection.targetBlock().setFieldValue(value, 'NUM');
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
