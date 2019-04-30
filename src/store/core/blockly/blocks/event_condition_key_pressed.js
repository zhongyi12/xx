const mBlockly = {};
mBlockly.Blocks = {};
mBlockly.JavaScript = {};

mBlockly.JavaScript.condition_key_pressed = (block) => {
  const keycode = block.getFieldValue('keycode');
  const params = { keycode };
  // return genFuncCode(params, block);
  //
  const keycode2 = params.keycode;
  return [`BlocklyCom.blocklyLib.KeyPressEvent.getValue(${keycode2})`];
};

mBlockly.Blocks.condition_key_pressed = {
  init() {
    this.appendDummyInput()
      .appendField(Blockly.Msg.CONDITION_KEY)
      .appendField(new Blockly.FieldDropdown([
        ['A', '65'],
        ['B', '66'],
        ['C', '67'],
        ['D', '68'],
        ['E', '69'],
        ['F', '70'],
        ['G', '71'],
        ['H', '72'],
        ['I', '73'],
        ['J', '74'],
        ['K', '75'],
        ['L', '76'],
        ['M', '77'],
        ['N', '78'],
        ['O', '79'],
        ['P', '80'],
        ['Q', '81'],
        ['R', '82'],
        ['S', '83'],
        ['T', '84'],
        ['U', '85'],
        ['V', '86'],
        ['W', '87'],
        ['X', '88'],
        ['Y', '89'],
        ['Z', '90'],
        ['SPACE', '32'],
        ['UP', '38'],
        ['DOWN', '40'],
        ['LEFT', '37'],
        ['RIGHT', '39'],
        ['0', '48'],
        ['1', '49'],
        ['2', '50'],
        ['3', '51'],
        ['4', '52'],
        ['5', '53'],
        ['6', '54'],
        ['7', '55'],
        ['8', '56'],
        ['9', '57'],
      ]), 'keycode');
    this.setOutput(true, null);
    this.setColour(BlocklyDefaultColor.COLOR_CONDITION);
    this.setTooltip('');
    this.setHelpUrl('');
  },
  onStart() {
    BlocklyCom.blocklyLib.KeyPressEvent.init();
  },
  onStop() {
    BlocklyCom.blocklyLib.KeyPressEvent.clearValue();
    BlocklyCom.blocklyLib.KeyPressEvent.stop();
  },
};

// Object.assign(Blockly.Blocks, mBlockly.Blocks);
// Object.assign(Blockly.JavaScript, mBlockly.JavaScript);

export default mBlockly;
