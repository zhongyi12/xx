const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.tool_message = (block) => {
  const type = block.getFieldValue('type');
  const duration = Number(block.inputList[0].fieldRow[4].getText());
  const msg = block.inputList[0].fieldRow[6].getText();
  let code = '';
  code += `
  BlocklyCom.blockly.message({
    duration: ${duration},
    type: '${type}',
    showClose: true,
    message: '${msg}'
  });
  `
  return code;
};

mBlockly.Blocks.tool_message = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.TEXT_MESSAGE)
      .appendField(Blockly.Msg.message.type)
      .appendField(new Blockly.FieldDropdown([[Blockly.Msg.message.info, 'info'], 
      [Blockly.Msg.message.success, 'success'], [Blockly.Msg.message.warning, 'warning'], [Blockly.Msg.message.error, 'error']]), 'type')
      .appendField(Blockly.Msg.message.duration)
      .appendField(new Blockly.FieldNumber(1000), 'duration')
      .appendField(Blockly.Msg.message.content)
      .appendField(new Blockly.FieldTextInput('message'), 'content');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_INFO);
  },
  onchange(event) {
    if (event.type === 'change' || event.type === 'create') {
      const type = this.inputList[0].fieldRow[2].text_;
      switch (type) {
        case 'success':
          this.setColour(BlocklyDefaultColor.COLOR_SUCCESS);
          break;
        case 'info':
          this.setColour(BlocklyDefaultColor.COLOR_INFO);
          break;
        case 'warning':
          this.setColour(BlocklyDefaultColor.COLOR_WARNING);
          break;
        case 'error':
          this.setColour(BlocklyDefaultColor.COLOR_ERROR);
          break;
        default:
          break;
      }
    }
  }
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
