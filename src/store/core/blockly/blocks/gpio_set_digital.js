const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.gpio_set_digital = (block) => {
  const io = Number(block.getFieldValue('io'))
  const value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC);

  let code = `window.CommandsRobotSocket.set_gpio_digital(${io}, ${value}, (res) => {});`
  return code;
};

mBlockly.Blocks.gpio_set_digital = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.SET_GPIO_DIGITAL)
      .appendField(Blockly.Msg.fitting.gpio.io)
      .appendField(new Blockly.FieldDropdown([
        ['1', '1'],
        ['2', '2']
      ]), 'io')
    this.appendValueInput('value')
      .setCheck('Number')
      .appendField(Blockly.Msg.fitting.gpio.value)
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_GRIPPER);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
