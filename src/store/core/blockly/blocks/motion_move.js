const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.move = (block) => {
  const orientation = block.getFieldValue('orientation');
  const value = Number(block.getFieldValue('value'));
  const wait = block.getFieldValue('wait') === 'TRUE' ? true : false;
  // const value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC);
  // const wait = Blockly.JavaScript.valueToCode(block, 'wait', Blockly.JavaScript.ORDER_ATOMIC) === 'true' ? true : false;
  const params = { orientation, value };
  // return genFuncCode(params, block);
  //
  const value2 = params.value;
  const orientation2 = params.orientation;
  let args = null;
  switch (orientation2) {
    default:
      break;
    case 'forward':
      args = `{"x": ${value2}, "relative": true}`;
      break;
    case 'backward':
      args = `{"x": ${value2} * -1, "relative": true}`;
      break;
    case 'up':
      args = `{"z": ${value2}, "relative": true}`;
      break;
    case 'down':
      args = `{"z": ${value2} * -1, "relative": true}`;
      break;
    case 'left':
      args = `{"y": ${value2}, "relative": true}`;
      break;
    case 'right':
      args = `{"y": ${value2} * -1, "relative": true}`;
      break;
  }
  // return `${BlocklyCom.blocklyLib.consoleLog(block, params)}await window.xArmVuex.commit('MOVE_END_STEP', ${args});\n`;
  let code = '';
  code += BlocklyCom.blocklyLib.consoleLog(block, params);

  const online = `window.GlobalUtil.model.robot.state.isMoving = true;await window.GlobalUtil.model.robot.state.func.moveEndStep(${args}, ${wait}, (response) => { console.log('move line res', response); window.GlobalUtil.model.robot.state.isMoving = false;} );${BlocklyCom.blocklyLib.movingWaitUntil(0.1)}`;
  const offline = `await BlocklyCom.blocklyLib.wait(2);console.log('off line off line');`;
  code += BlocklyCom.blocklyLib.onOffLineCode(online, offline);
  return code;
};

mBlockly.Blocks.move = {
  init() {
    // this.appendValueInput('value')
    //   .setCheck('Number')
    //   .appendField(Blockly.Msg.motion.move)
    //   .appendField(new Blockly.FieldDropdown([[Blockly.Msg.direction.forward, 'forward'],
    //     [Blockly.Msg.direction.backward, 'backward'], [Blockly.Msg.direction.left, 'left'],
    //     [Blockly.Msg.direction.right, 'right'], [Blockly.Msg.direction.up, 'up'],
    //     [Blockly.Msg.direction.down, 'down']]), 'orientation');
    this.appendDummyInput()
      .appendField(Blockly.Msg.motion.move)
      .appendField(new Blockly.FieldDropdown([[Blockly.Msg.direction.forward, 'forward'],
        [Blockly.Msg.direction.backward, 'backward'], [Blockly.Msg.direction.left, 'left'],
        [Blockly.Msg.direction.right, 'right'], [Blockly.Msg.direction.up, 'up'],
        [Blockly.Msg.direction.down, 'down']]), 'orientation')
      .appendField(new Blockly.FieldDropdown([
        ['true', 'TRUE'],
        ['false', 'FALSE']
      ]), 'wait')
      .appendField(new Blockly.FieldNumber(10), 'value')
      .appendField('mm');
    // this.appendValueInput('value')
    //   .setCheck('Number')
    //   .appendField(new Blockly.FieldDropdown([[Blockly.Msg.direction.forward, 'forward'],
    //     [Blockly.Msg.direction.backward, 'backward'], [Blockly.Msg.direction.left, 'left'],
    //     [Blockly.Msg.direction.right, 'right'], [Blockly.Msg.direction.up, 'up'],
    //     [Blockly.Msg.direction.down, 'down']]), 'orientation')
    // this.appendValueInput('wait')
    //   .setCheck('Boolean')
    //   .appendField('Wait');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_MOTION);
    this.setTooltip(Blockly.Msg.toolTip.move);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
