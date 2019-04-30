const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.event_gpio_digital = (block) => {
  const io = Number(block.getFieldValue('io'));
  const trigger = block.getFieldValue('trigger');
  const statement = Blockly.JavaScript.statementToCode(block, 'statement');
  const value = trigger === 'LOW' ? 0 : 1;
  const args = `{"callback": async function(){\n${statement}}}`;
  let code = `window.GlobalUtil.model.robot.event.GPIOEvent.addEventListener('digital', 'io${io}', ${value}, ${args});\n`
  console.log('event_gpio_digital:', code);
  // let code = `await window.CommandsRobotSocket.get_gpio_digital(${io}, (res) => {})`
  return code;
};

mBlockly.Blocks.event_gpio_digital = {
  init() {
    this.appendStatementInput('statement')
      .appendField(Blockly.Msg.GPIO_EVENT_DIGITAL_PREFIX)
      // .appendField(Blockly.Msg.fitting.gpio.io)
      .appendField(new Blockly.FieldDropdown([
        ['1', '1'],
        ['2', '2']
      ]), 'io')
      .appendField(Blockly.Msg.GPIO_EVENT_DIGITAL_MAIN)
      .appendField(new Blockly.FieldDropdown([
        [Blockly.Msg.GPIO_EVENT_DIGITAL_LOW, 'LOW'],
        [Blockly.Msg.GPIO_EVENT_DIGITAL_HIGH, 'HIGH']
      ]), 'trigger')
      .appendField(Blockly.Msg.GPIO_EVENT_DO);
    // this.setInputsInline(true);
    // this.setOutput(true, null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_GRIPPER);
  },
  onStop() {
    window.GlobalUtil.model.robot.event.GPIOEvent.clearEventListener();
  }
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
