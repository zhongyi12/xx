const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.gpio_get_digital = (block) => {
  const io = Number(block.getFieldValue('io'))

  let code = `await window.CommandsRobotSocket.get_gpio_digital(${io}, (res) => {})`
  return [code];
};

mBlockly.Blocks.gpio_get_digital = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.GET_GPIO_DIGITAL)
      .appendField(Blockly.Msg.fitting.gpio.io)
      .appendField(new Blockly.FieldDropdown([
        ['1', '1'],
        ['2', '2']
      ]), 'io')
    this.setInputsInline(true);
    this.setOutput(true, null);
    // this.setPreviousStatement(true, null);
    // this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_GRIPPER);
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
