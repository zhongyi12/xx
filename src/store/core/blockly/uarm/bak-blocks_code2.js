function initBlocklyCode(Blockly, genFuncCode) {
  Blockly.JavaScript.wait_until = (block) => {
    const condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { condition };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.position = (block) => {
    const x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
    const y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
    const z = Blockly.JavaScript.valueToCode(block, 'z', Blockly.JavaScript.ORDER_ATOMIC);
    const a = Blockly.JavaScript.valueToCode(block, 'a', Blockly.JavaScript.ORDER_ATOMIC);
    const b = Blockly.JavaScript.valueToCode(block, 'b', Blockly.JavaScript.ORDER_ATOMIC);
    const c = Blockly.JavaScript.valueToCode(block, 'c', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { x, y, z, a, b, c };
    return genFuncCode(params, block);
  };
  Blockly.JavaScript.position7 = (block) => {
    const i = Blockly.JavaScript.valueToCode(block, 'i', Blockly.JavaScript.ORDER_ATOMIC);
    const j = Blockly.JavaScript.valueToCode(block, 'j', Blockly.JavaScript.ORDER_ATOMIC);
    const k = Blockly.JavaScript.valueToCode(block, 'k', Blockly.JavaScript.ORDER_ATOMIC);
    const l = Blockly.JavaScript.valueToCode(block, 'l', Blockly.JavaScript.ORDER_ATOMIC);
    const m = Blockly.JavaScript.valueToCode(block, 'm', Blockly.JavaScript.ORDER_ATOMIC);
    const n = Blockly.JavaScript.valueToCode(block, 'n', Blockly.JavaScript.ORDER_ATOMIC);
    const o = Blockly.JavaScript.valueToCode(block, 'o', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { i, j, k, l, m, n, o };
    return genFuncCode(params, block);
  };
  Blockly.JavaScript.move_to = (block) => {
    const position = Blockly.JavaScript.valueToCode(block, 'position', Blockly.JavaScript.ORDER_ATOMIC);
    console.log(`position move to: ${position}`);
    const params = { position };
    return genFuncCode(params, block);
  };
  Blockly.JavaScript.move_7 = (block) => {
    const position = Blockly.JavaScript.valueToCode(block, 'position7', Blockly.JavaScript.ORDER_ATOMIC);
    // console.log(`position: ${position}`);
    const params = { position };
    return genFuncCode(params, block);
  };
  Blockly.JavaScript.move = (block) => {
    const orientation = block.getFieldValue('orientation');
    const value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { orientation, value };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.wait = (block) => {
    const value = Blockly.JavaScript.valueToCode(block, 'sec', Blockly.JavaScript.ORDER_ATOMIC);
    const params = { value: value || 0 };
    return genFuncCode(params, block);
  };

  // Blockly.JavaScript.servo_angle = (block) => {
  //   const value = block.getFieldValue('angle');
  //   // console.log(`servo_angle: angle ${JSON.parse(value)}`);
  //   const params = { value };
  //   return genFuncCode(params, block);
  // };

  Blockly.JavaScript.ON = (block) => {
    const checkboxON = block.getFieldValue('on_off') === 'TRUE';
    const params = { checkboxON };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.buzzer_beats = (block) => {
    const beat = block.getFieldValue('beat');
    const params = { beat };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.set_speed = (block) => {
    const speed = Blockly.JavaScript.valueToCode(block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
    // const speed = block.getFieldValue('speed');
    const params = { speed };
    return genFuncCode(params, block);
  };
  Blockly.JavaScript.set_acceleration = (block) => {
    const acceleration = Blockly.JavaScript.valueToCode(block, 'acceleration', Blockly.JavaScript.ORDER_ATOMIC);
    // const speed = block.getFieldValue('speed');
    const params = { acceleration };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.reset = block => genFuncCode(null, block);

  /* ******************************* Repeat ********************************************************************/
  Blockly.JavaScript.loop_run_forever = (block) => {
    const statement = Blockly.JavaScript.statementToCode(block, 'statement');
    const params = { statement };
    return genFuncCode(params, block);
  };


  /* ******************************* Condition ********************************************************************/

  Blockly.JavaScript.condition_key_pressed = (block) => {
    const keycode = block.getFieldValue('keycode');
    const params = { keycode };
    return genFuncCode(params, block);
  };

  /* ******************************* Studio Only ********************************************************************/

  Blockly.JavaScript.event_keypressed = (block) => {
    const keycode = block.getFieldValue('keycode');
    const statement = Blockly.JavaScript.statementToCode(block, 'statement');
    const params = { keycode, statement };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.event_keypressed_stop = block => genFuncCode(null, block);

  Blockly.JavaScript.event_tip_sensor = (block) => {
    const statement = Blockly.JavaScript.statementToCode(block, 'statement');
    const params = { statement };
    return genFuncCode(params, block);
  };

  Blockly.JavaScript.event_tip_sensor_stop = block => genFuncCode(null, block);

  Blockly.JavaScript.studio_play_recording = (block) => {
    const filename = block.getFieldValue('filename');
    // const speed = block.getFieldValue('speed');
    const params = { filename };
    return genFuncCode(params, block);
  };

  /* ******************************* Grove ********************************************************************/
  /* ******************************* Leap ********************************************************************/
  Blockly.JavaScript.studio_run_python = (block) => {
    const ide = Blockly.JavaScript.valueToCode(block, 'ide', Blockly.JavaScript.ORDER_ATOMIC);
    // const speed = block.getFieldValue('speed');
    const params = { ide };
    return genFuncCode(params, block);
  };
  Blockly.JavaScript.studio_play_recording = (block) => {
    const record = Blockly.JavaScript.valueToCode(block, 'record', Blockly.JavaScript.ORDER_ATOMIC);
    // const speed = block.getFieldValue('speed');
    const params = { record };
    return genFuncCode(params, block);
  };
  Blockly.JavaScript.studio_run_app = (block) => {
    const other = Blockly.JavaScript.valueToCode(block, 'other', Blockly.JavaScript.ORDER_ATOMIC);
    // const speed = block.getFieldValue('speed');
    const params = { other };
    console.log(params)
    return genFuncCode(params, block);
  };
}

export default initBlocklyCode;
