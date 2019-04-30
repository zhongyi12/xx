/* eslint-disable arrow-body-style */

/**
 * Created by Jeffrey on 2018/1/19.
 */

import Blockly from 'node-blockly/browser';
window.Blockly = Blockly;
import BlocklyLib from './blockly_lib';
window.BlocklyLib = BlocklyLib;
import blocks from './blocks';
for (let i = 0; i < blocks.blocks.length; i += 1) {
  const mBlockly = blocks.blocks[i];
  Object.assign(Blockly.Blocks, mBlockly.Blocks);
  Object.assign(Blockly.JavaScript, mBlockly.JavaScript);
}
import { transform } from 'babel-standalone';
import es2015 from 'babel-preset-es2015';
import transformRuntime from 'babel-plugin-transform-runtime';
import toolbox from './toolbox.xml';
import format from 'string-format';
import swal from 'sweetalert2';
// import '../../css/blockly.scss';

const BlocklyCom = {}
window.BlocklyCom = BlocklyCom;
BlocklyCom.blocklyLib = BlocklyLib;
BlocklyCom.blockly = Blockly;

const BlocklyDefaultColor = {
  COLOR_SETTING: '#6A5ACD',
  COLOR_MOTION: '#71CB8C',
  COLOR_JOINT: '#66CDAA',
  COLOR_GROVE: '#E37D7D',
  COLOR_EVENT: '#FFBE53',
  COLOR_INPUT: '#FFBE53',
  COLOR_CONDITION: '#FFBE53',
  COLOR_LOGIC: '#58C9B9',
  COLOR_LOOP: '#5A93D7',
  COLOR_MATH: '#94BD86',
  COLOR_LIST: '#B96BA7',
  COLOR_TEXT: '#FF8657',
  COLOR_ADVANCE: '#C65146',
  COLOR_VARIABLE: '#8283A7',
  COLOR_FUNCTION: '#E98CB1',
  COLOR_SOUND: '#6AAFE6',
  COLOR_APP: '#E37D7D',
  COLOR_FITTING: '#5F9EA0',
  COLOR_GRIPPER: '#5F9EA0',
  COLOR_REMOVE: '#B0C4DE',
  COLOR_SPEED: '#7AC5CD',
  COLOR_SLEEP: '#778899',
  COLOR_SUCCESS: '#67C23A',
  COLOR_INFO: '#909399',
  COLOR_WARNING: '#E6A23C',
  COLOR_ERROR: '#F56C6C',
  COLOR_REMARK: '#FF8657',
  COLOR_COMMENT: '#990000',
};

window.BlocklyDefaultColor = BlocklyDefaultColor;

function initBlocklyColor(Blockly) {
  Blockly.Msg.LOGIC_HUE = BlocklyDefaultColor.COLOR_LOGIC;
  Blockly.Msg.VARIABLES_HUE = BlocklyDefaultColor.COLOR_VARIABLE;
  Blockly.Msg.PROCEDURES_HUE = BlocklyDefaultColor.COLOR_FUNCTION;
  Blockly.Msg.LISTS_HUE = BlocklyDefaultColor.COLOR_LIST;
  Blockly.Msg.LOOPS_HUE = BlocklyDefaultColor.COLOR_LOOP;
  Blockly.Msg.MATH_HUE = BlocklyDefaultColor.COLOR_MATH;
  Blockly.Msg.TEXTS_HUE = BlocklyDefaultColor.COLOR_TEXT;

  Blockly.Blocks.lists.HUE = BlocklyDefaultColor.COLOR_LIST;
  Blockly.Blocks.procedures.HUE = BlocklyDefaultColor.COLOR_FUNCTION;
  Blockly.Blocks.texts.HUE = BlocklyDefaultColor.COLOR_TEXT;
}

function callOnDelete(blockXml) {
  let blockType;
  if (blockXml.nodeName.toLowerCase() === 'block') {
    for (const attr of blockXml.attributes) {
      // console.log(`${blockXml.nodeName} - name:${attr.name}, value:${attr.nodeValue}`); s
      if (attr.name === 'type') blockType = attr.nodeValue;
    }
    if (blockType !== undefined) {
      if (Blockly.Blocks[blockType] !== undefined) {
        if (Blockly.Blocks[blockType].onDelete !== undefined) {
          Blockly.Blocks[blockType].onDelete(blockXml);ƒ
        }
      }
    }
  }
  if (blockXml.childNodes !== undefined) {
    // console.log(`${blockXml.nodeName} - childNodes: ${blockXml.childNodes.length}`);
    for (const child of blockXml.childNodes) {
      callOnDelete(child);
    }
    // console.log(`${blockXml.nodeName} - after get childs`);
  }
}

const onChangeEvent = (event) => {
  // console.log(event.type);
  const currBlock = BlocklyCom.BlockWorkspace.getBlockById(event.blockId);
  if (currBlock !== null) {
    if (event.type === Blockly.Events.CREATE) {
      if (currBlock.onCreate !== undefined) {
        console.log(`oncreate: ${currBlock.type}`);
        if (!currBlock.isShadow()) currBlock.onCreate();
      }
    }
    else if (event.type === Blockly.Events.MOVE) {
      if (currBlock.onMove !== undefined) {
        currBlock.onMove();
      }
    }
    else if (event.type === Blockly.Events.CHANGE) {
      if (event.element === 'disabled') {
        if (currBlock.onDisabled !== undefined) {
          currBlock.onDisabled(event.newValue);
        }
      }
    }
  }
  if (event.type === Blockly.Events.DELETE) {
    // console.log(event.oldXml);
    console.log('Delete Event');
    callOnDelete(event.oldXml);
  }
};

BlocklyCom.init = (languageCode) => {
  if (languageCode === 'cn') {
    const { initBlocklyMsg } = require('./i18n/cn');
    initBlocklyMsg(Blockly);
  }
  else {
    const { initBlocklyMsg } = require('./i18n/en');
    initBlocklyMsg(Blockly);
  }
  const formatKeys = {
    MSG: Blockly.Msg,
    COLOR: BlocklyDefaultColor,
  };
  const toolboxText = format(toolbox, formatKeys);
  Blockly.Version = '1.1';
  BlocklyCom.BlockWorkspace = null;
  Blockly.Running = false;
  Blockly.AppRunning = false;

  // Blockly End Events
  Blockly.EndEvents = [];

  Blockly.addEndListener = (callback) => {
    Blockly.EndEvents.push(callback);
  };

  Blockly.removeEndListener = (callback) => {
    const index = Blockly.EndEvents.indexOf(callback);
    if (index !== -1) Blockly.EndEvents.splice(index, 1);
  };

  // highlight block
  window.highlightBlock = (id) => {
    const block = BlocklyCom.BlockWorkspace.getBlockById(id);
    if (block) {
      console.log('highlightBlock = ' + block.type);
    }
    const includeTypes = [];
    includeTypes.push('studio_play_recording');
    includeTypes.push('studio_run_python');
    includeTypes.push('studio_run_file');
    includeTypes.push('wait_until');
    includeTypes.push('wait');
    includeTypes.push('sleep');
    includeTypes.push('loop_break');
    includeTypes.push('move_7');
    includeTypes.push('move_to');
    includeTypes.push('move_arc_to');
    includeTypes.push('move_circle');
    includeTypes.push('move');
    includeTypes.push('reset');
    includeTypes.push('set_acceleration');
    includeTypes.push('set_speed');
    includeTypes.push('set_angle_speed');
    includeTypes.push('set_angle_acceleration');
    includeTypes.push('motion_stop');
    includeTypes.push('set_gripper');
    includeTypes.push('gripper_mode');
    includeTypes.push('gripper_enable');
    includeTypes.push('gripper_position');
    includeTypes.push('gripper_speed');
    includeTypes.push('gpio_set_digital');
    includeTypes.push('move_joints');
    includeTypes.push('move_cartesian');
    if (block && includeTypes.includes(block.type)) {
      BlocklyCom.BlockWorkspace.highlightBlock(id);
    }
  };

  Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  Blockly.JavaScript.addReservedWords('highlightBlock');
  Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if(BlocklyCom.blocklyLib.Blockly.Running === false) return;';

  // init Blockly
  // initBlocklyDefine(Blockly);
  // Object.assign(Blockly.Blocks, blocks_define);
  // initBlocklyCode(Blockly, CodeGenerator);
  initBlocklyColor(Blockly);
  BlocklyCom.blocklyLib.init(Blockly);

  Blockly.JavaScript.scrub_ = (block, code) => {
    const commentCode = '';
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
      // Collect comment for this block.
      // var comment = block.getCommentText();
      // if (comment) {
      //   commentCode += Blockly.JavaScript.prefixLines(comment, '// ') + '\n';
      // }
      // Collect comments for all value arguments.
      // Don't collect comments for nested statements.
      for (let x = 0; x < block.inputList.length; x++) {
        if (block.inputList[x].type === Blockly.INPUT_VALUE) {
          const childBlock = block.inputList[x].connection.targetBlock();
          if (childBlock) {
            // var comment = Blockly.JavaScript.allNestedComments(childBlock);
            // if (comment) {
            //   commentCode += Blockly.JavaScript.prefixLines(comment, '// ');
            // }
          }
        }
      }
    }
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = Blockly.JavaScript.blockToCode(nextBlock);
    return commentCode + code + nextCode;
  };

  Blockly.JavaScript.procedures_defnoreturn = (block) => {
    // Define a procedure with a return value.
    const funcName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
    let branch = Blockly.JavaScript.statementToCode(block, 'STACK');
    if (Blockly.JavaScript.STATEMENT_PREFIX) {
      branch = Blockly.JavaScript.prefixLines(Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g, `'${block.id}a'`), Blockly.JavaScript.INDENT) + branch;
    }
    if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
      branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g, `'${block.id}a'`) + branch;
    }
    let returnValue = Blockly.JavaScript.valueToCode(block, 'RETURN', Blockly.JavaScript.ORDER_NONE) || '';
    if (returnValue) {
      // returnValue = '  return ' + returnValue + ';\n';
      returnValue = `  return ${returnValue};\n`;
    }
    const args = [];
    for (let x = 0; x < block.arguments_.length; x++) {
      args[x] = Blockly.JavaScript.variableDB_.getName(block.arguments_[x],
        Blockly.Variables.NAME_TYPE);
    }
    // let code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
    //   branch + returnValue + '}';
    let code = `function ${funcName}(${args.join(', ')}) {\n${branch}${returnValue}}`;
    code = Blockly.JavaScript.scrub_(block, code);
    if (code.indexOf('await ') !== -1) {
      code = `async ${code}`;
    }
    Blockly.JavaScript.definitions_[funcName] = code;
    return null;
  };

  if (Blockly.JavaScript._procedures_callnoreturn === undefined) {
    Blockly.JavaScript._procedures_callnoreturn = Blockly.JavaScript.procedures_callnoreturn;
  }
  Blockly.JavaScript.procedures_callnoreturn = (block) => {
    // Call a procedure with no return value.
    const funcName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
    const code = Blockly.JavaScript._procedures_callnoreturn.call(Blockly.JavaScript, block);
    const defs = Blockly.JavaScript.definitions_;
    if (defs[funcName] && defs[funcName].indexOf('async ') === 0) {
      return `await ${code}`;
    }
    return code;
  };

  if (Blockly.JavaScript._procedures_callreturn === undefined) {
    Blockly.JavaScript._procedures_callreturn = Blockly.JavaScript.procedures_callreturn;
  }

  Blockly.JavaScript.procedures_callreturn = (block) => {
    // Call a procedure with a return value.
    const funcName = Blockly.JavaScript.constiableDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
    const codes = Blockly.JavaScript._procedures_callreturn.call(Blockly.JavaScript, block);
    const defs = Blockly.JavaScript.definitions_;
    if (defs[funcName] && defs[funcName].indexOf('async ') === 0) {
      return [`await ${codes[0]}`, codes[1]];
    }
    return codes;
  };

  // Blockly.JavaScript._procedures_callnoreturn = Blockly.JavaScript.procedures_callnoreturn;

  if (Blockly.JavaScript._workspaceToCode === undefined) {
    Blockly.JavaScript._workspaceToCode = Blockly.JavaScript.workspaceToCode;
  }

  Blockly.JavaScript.workspaceToCode = (workspace) => {
    const originCode = Blockly.JavaScript._workspaceToCode.call(Blockly.JavaScript, workspace);
    let code = 'BlocklyCom.blocklyLib.runningIndex = 0;\n';
    code += 'Blockly.Running = true;\n';
    code += 'window.GlobalUtil.model.localAppsMgr.enableRun = false;\n';
    code += originCode + '\n';
    // code += `if (BlocklyCom.blocklyLib.KeyPressEvent.hasKeyEvent === false) {\n
    //   Blockly.Running = false;\n
    //   window.GlobalUtil.model.localAppsMgr.enableRun = true;\n
    //   Blockly.setBlocksDeletable(true);
    //   Blockly.setBlocksEditable(true);
    //   Blockly.setBlocksMovable(true);
    //   Blockly.onBlocklyProjectStop();
    // }\n`
    code += `if (window.GlobalUtil.model.robot.event.hasEvent === false) {\n
      Blockly.Running = false;\n
      window.GlobalUtil.model.localAppsMgr.enableRun = true;\n
      Blockly.setBlocksDeletable(true);
      Blockly.setBlocksEditable(true);
      Blockly.setBlocksMovable(true);
      Blockly.onBlocklyProjectStop();
    }\n`
    // code += 'Blockly.Running = false;\n';
    // code += 'window.GlobalUtil.model.localAppsMgr.enableRun = true;\n';
    // code += 'reachCodeEnding();';
    if (code.indexOf('await ') === -1) {
      code = code.replace(new RegExp('async function', 'g'), 'function');
    }
    else {
      code = `(async function () {\n\n${code}\n}());`;
    }
    // console.log('this.jsCode = ' + code);
    return code;
  };

  // window.reachCodeEnding = () => {
  //   // Blockly.Running = false;
  //   // console.log('Stop');
  //   if (!Blockly.containEventBlock()) {
  //     console.log('Blockly-Stop');
  //     Blockly.EndEvents.forEach((item) => {
  //       item();
  //     });
  //   }
  //   else {
  //     console.log('Blockly-Event-no-stop');
  //   }
  // };

  Blockly.generateXML = (save) => {
    if (BlocklyCom.BlockWorkspace !== null) {
      if (save && Blockly.Running) Blockly.setBlocksDeletable(true);
      const xmlDom = Blockly.Xml.workspaceToDom(BlocklyCom.BlockWorkspace);
      // const version = xmlDom.getAttribute('version');
      // console.log(`Blockly: ${version}`);
      // xmlDom.setAttribute('version', Blockly.Version);
      const prettyText = Blockly.Xml.domToPrettyText(xmlDom);
      if (save && Blockly.Running) Blockly.setBlocksDeletable(false);
      return prettyText;
    }
    return '';
  };

  Blockly.exportXMLtoSave = () => {
    if (Blockly.Running) {
      Blockly.setBlocksDeletable(true);
    }
  };

  function loadWorkspace(xmlDom, disableEvent) {
    BlocklyCom.BlockWorkspace.removeChangeListener(disableEvent);
    Blockly.Xml.domToWorkspace(xmlDom, BlocklyCom.BlockWorkspace);
    Blockly.setBlocksDeletable(true);
    setTimeout(() => {
      BlocklyCom.BlockWorkspace.addChangeListener(disableEvent);
      // Blockly.Events.enable();
    }, 1000);
  }

  Blockly.loadWorkspace = (xmlText, disableEvent) => {
    const xmlDom = Blockly.Xml.textToDom(xmlText);
    loadWorkspace(xmlDom, disableEvent);
    // const version = xmlDom.getAttribute('version');
    // if (version !== Blockly.Version) {
    //   Blockly.messageBox('confirm', Blockly.Msg.MSG_CONFIRM, Blockly.Msg.VERSION_INCOMPATIBLE).then(() => {
    //     loadWorkspace(xmlDom, disableEvent);
    //     return;
    //   });
    // }
    // else {
    //   loadWorkspace(xmlDom, disableEvent);
    // }
  };
  Blockly.clearWorkspace = () => {
    return new Promise((resolve) => {
      BlocklyCom.BlockWorkspace.clear();
      resolve()
    })
  }
  /* eslint-disable no-eval */
  Blockly.executeCode = () => {
    return new Promise((resolve, reject) => {
      try {
        const code = BlocklyCom.generateCode();
        // transform ES2015 code to ES5
        const _code = transform(code, {
          presets: [es2015],
          plugins: [transformRuntime],
        }).code;
        // setTimeout(() => {
        Blockly.Running = true;
        // })
        window.GlobalUtil.model.localAppsMgr.enableRun = false;
        console.log(`001 begin _code = ${_code}`);
        eval(_code);
        // console.log(`001 end`);
        resolve();
      }
      catch (e) {
        console.log(`Error when RunCode: ${e.toString()}`);
        reject(e.toString());
        Blockly.setBlocksDeletable(true);
        Blockly.onBlocklyProjectStop();
        BlocklyLib.KeyPressEvent.clearEventListener();
        Blockly.Running = false;
      }
    });
  };

  /** Override Blockly.alert() with custom implementation. */
  Blockly.alert = (message) => {
    swal({
      title: 'Alert!',
      text: message,
    });
  };

  /** Override Blockly.confirm() with custom implementation. */
  Blockly.confirm = (message, callback) => {
    // console.log(`Confirm: ${message}`);
    swal({
      title: 'Confirm',
      text: message,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK',
    }).then(() => {
      callback(true);
    }, (dismiss) => {
      if (dismiss === 'cancel') {
        callback(false);
      }
    });
  };

  /** Override Blockly.prompt() with custom implementation. */
  Blockly.prompt = (message, defaultValue, callback) => {
    swal({
      title: message,
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    }).then((text) => {
      callback(text);
    }, (dismiss) => {
      if (dismiss === 'cancel') {
        callback(false);
      }
    });
  };

  Blockly.initBlockly = (blocklyDiv) => {
    BlocklyCom.BlockWorkspace = Blockly.inject(blocklyDiv, {
      // media: './src/assets/lib/blockly/media/',
      media: '/static/blockly/media/',
      toolbox: toolboxText,
      zoom: {
        controls: true, // default is false
        wheel: true, // default is false
        // startScale: 1, // default is 1.0
        maxScale: 3, // default is 3
        minScale: 0.3, // default is 0.3
        scaleSpeed: 1.1, // default is 1.2
      },
      grid: {
        spacing: 25,
        length: 3,
        colour: '#ccc',
        snap: true,
      },
    });
    // setTimeout(() => {
    //   BlocklyCom.BlockWorkspace.addChangeListener(onChangeEvent);
    // }, 1000);
  };

  Blockly.containEventBlock = () => {
    if (BlocklyCom.BlockWorkspace !== null) {
      const blocks = BlocklyCom.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        if (block.type.startsWith('event') || block.type.startsWith('loop')) return true;
      }
    }
    return false;
  };

  Blockly.onUArmConnect = () => {
    if (BlocklyCom.BlockWorkspace !== null) {
      const blocks = BlocklyCom.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        if (block.onConnect) block.onConnect();
      }
    }
  };
  Blockly.onBlocklyProjectLoad = () => {
    if (BlocklyCom.BlockWorkspace !== null) {
      const blocks = BlocklyCom.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        if (block.onCreate) block.onCreate();
      }
    }
  };
  Blockly.onBlocklyProjectStart = () => {
    if (BlocklyCom.BlockWorkspace !== null) {
      const blocks = BlocklyCom.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        if (block.onStart) block.onStart();
      }
    }
  };
  Blockly.onBlocklyProjectStop = () => {
    if (BlocklyCom.BlockWorkspace !== null) {
      const blocks = BlocklyCom.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        if (block.onStop) block.onStop();
      }
    }
  };
  Blockly.onBlocklyProjectExit = () => {
    if (BlocklyCom.BlockWorkspace !== null) {
      const blocks = BlocklyCom.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        if (block.onExit) block.onExit();
      }
    }
  };
  Blockly.setBlocksDeletable = (deletable) => {
    if (BlocklyCom.BlockWorkspace !== null) {
      const blocks = BlocklyCom.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        block.setDeletable(deletable);
      }
    }
  };
  Blockly.setBlocksEditable = (deletable) => {
    if (BlocklyCom.BlockWorkspace !== null) {
      const blocks = BlocklyCom.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        block.setEditable(deletable);
      }
    }
  };
  Blockly.setBlocksMovable = (deletable) => {
    if (BlocklyCom.BlockWorkspace !== null) {
      const blocks = BlocklyCom.BlockWorkspace.getAllBlocks();
      for (const block of blocks) {
        block.setMovable(deletable);
      }
    }
  };
  Blockly.messageBox = (type, title, text) => new Promise((resolve, reject) => {
    if (type === 'confirm') {
      swal({
        title,
        text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: Blockly.Msg.MSG_CONFIRM,
      }).then(resolve).catch(reject);
    }
    else {
      swal({
        type,
        title,
        text,
      }).then(resolve);
    }
  });
}

BlocklyCom.appendXML = (xmlText) => {
  const xmlDom = Blockly.Xml.textToDom(xmlText)
  Blockly.Xml.appendDomToWorkspace(xmlDom, BlocklyCom.BlockWorkspace)
}

BlocklyCom.generateCode = () => {
  if (BlocklyCom.BlockWorkspace !== null) {
    const count = BlocklyCom.BlockWorkspace.getAllBlocks().length;
    if (count <= 0) {
      return '';
    }
    return Blockly.JavaScript.workspaceToCode(BlocklyCom.BlockWorkspace);
  }
  return '';
};

BlocklyCom.genDocText = (points, index) => {
  let docText = '';
  console.log('points = ' + points);
  const onePoint = points[index];
  const isTimer = onePoint.length === 1;
  let blockType = isTimer === true ? 'sleep' : 'move_7';
  if (onePoint.length === 2) {
    blockType = 'gripper_position';
  }
  docText += `<block type=\"${blockType}\" id=\"${Blockly.utils.genUid()}\">`;
  if (blockType === 'sleep') {
    const dura = onePoint[0];
    docText += `<value name=\"sec\">`;
    docText += `<shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\">`;
    docText += `<field name=\"NUM\">${dura}</field>`;
    docText += `</shadow>`;
    docText += `</value>`;
  }
  else if (blockType === 'move_7') {
    docText += `<value name=\"position7\">`;
    docText += `  <shadow type=\"position7\">`;
    docText += `    <value name=\"i\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
    docText += `    <value name=\"j\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
    docText += `    <value name=\"k\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
    docText += `    <value name=\"l\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
    docText += `    <value name=\"m\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
    docText += `    <value name=\"n\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
    docText += `    <value name=\"o\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
    docText += `  </shadow>`;
    docText += `  <block type=\"position7\" id=\"${Blockly.utils.genUid()}\">`;
    docText += `    <value name=\"i\"><shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\"><field name=\"NUM\">${onePoint[0]}</field></shadow></value>`;
    docText += `    <value name=\"j\"><shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\"><field name=\"NUM\">${onePoint[1]}</field></shadow></value>`;
    docText += `    <value name=\"k\"><shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\"><field name=\"NUM\">${onePoint[2]}</field></shadow></value>`;
    docText += `    <value name=\"l\"><shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\"><field name=\"NUM\">${onePoint[3]}</field></shadow></value>`;
    docText += `    <value name=\"m\"><shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\"><field name=\"NUM\">${onePoint[4]}</field></shadow></value>`;
    docText += `    <value name=\"n\"><shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\"><field name=\"NUM\">${onePoint[5]}</field></shadow></value>`;
    docText += `    <value name=\"o\"><shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\"><field name=\"NUM\">${onePoint[6]}</field></shadow></value>`;
    docText += `    <value name=\"wait\"><shadow type=\"logic_boolean\" id=\"${Blockly.utils.genUid()}\"><field name=\"BOOL\">TRUE</field></shadow></value>`;
    docText += `    <value name=\"btn\"><block type=\"btn\" id=\"${Blockly.utils.genUid()}\"></block></value>`;
    docText += `  </block>`;
    docText += `</value>`;
  }
  else if (blockType === 'gripper_position') {
    docText += `<value name=\"speed\"><shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\"><field name=\"NUM\">${onePoint[1]}</field></shadow></value>`;
  }
  if (index < points.length - 1) {
    docText += '<next>';
    docText += BlocklyCom.genDocText(points, index + 1);
    docText += '</next>';
  }
  docText += `</block>`;
  return docText;
}

BlocklyCom.record2Text = (points) => {
  // Blockly.utils.genUid();
  const changeLine = '\n';
  const blockType = 'wait';
  let docText = '';

  docText += `<xml xmlns=\"http://www.w3.org/1999/xhtml\">`;
  docText += `<variables></variables>`;
  docText += BlocklyCom.genDocText(points, 0);
  docText += `</xml>${changeLine}`;

  return docText;
};

BlocklyCom.record2Block = (points) => {
  let docText = '';
  let endText = '';
  const changeLine = '\n';
  docText += `<xml xmlns=\"http://www.w3.org/1999/xhtml\">`;
  docText += `<variables></variables>`;
  let blockType = '';
  points.forEach((point, index) => {
    if (index !== 0 && index < points.length) {
      docText += '<next>';
    }
    if (point.type === 'time' || point.point.length == 1) {
      blockType = 'sleep';
      docText += `<block type=\"${blockType}\" id=\"${Blockly.utils.genUid()}\">`;
      docText += `<value name=\"sec\">`;
      docText += `<shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\">`;
      docText += `<field name=\"NUM\">${point.point[0]}</field>`;
      docText += `</shadow>`;
      docText += `</value>`;
      endText = `</block>${endText}`;
    }
    else if (point.type === 'gripper' || point.point.length == 2) {
      blockType = 'gripper_set';
      docText += `<block type=\"${blockType}\" id=\"${Blockly.utils.genUid()}\">`;
      docText += `<value name="pos">`;
      docText += `  <shadow type="math_number" id=\"${Blockly.utils.genUid()}\">`;
      docText += `    <field name="NUM">${point.point[1]}</field>`;
      docText += `  </shadow>`;
      docText += `</value>`;
      docText += `<value name="speed">`;
      docText += `  <shadow type="math_number" id=\"${Blockly.utils.genUid()}\">`;
      docText += `    <field name="NUM">${point.point[0]}</field>`;
      docText += `  </shadow>`;
      docText += `</value>`;
      docText += `<value name="wait">`;
      docText += `  <shadow type="logic_boolean" id=\"${Blockly.utils.genUid()}\">`;
      docText += `    <field name="BOOL">TRUE</field>`;
      docText += `  </shadow>`;
      docText += `</value>`;
      docText += `<value name="btn">`;
      docText += `  <block type="btn" id=\"${Blockly.utils.genUid()}\"/>`;
      docText += `</value>`;
      endText = `</block>${endText}`;
    }
    else if (point.type === 'joint' && point.point.length === 7) {
      blockType = 'move_7';
      docText += `<block type=\"${blockType}\" id=\"${Blockly.utils.genUid()}\">`;
      docText += `<value name=\"position7\">`;
      docText += `  <shadow type=\"position7\">`;
      docText += `    <value name=\"i\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
      docText += `    <value name=\"j\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
      docText += `    <value name=\"k\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
      docText += `    <value name=\"l\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
      docText += `    <value name=\"m\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
      // docText += `    <value name=\"n\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
      // docText += `    <value name=\"o\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
      if (window.GlobalUtil.model.robot.state.info.xarm_axis > 5) {
        docText += `    <value name=\"n\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
      }
      if (window.GlobalUtil.model.robot.state.info.xarm_axis > 6) {
        docText += `    <value name=\"o\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value>`;
      }
      
      docText += `  </shadow>`;
      docText += `  <block type=\"position7\" id=\"${Blockly.utils.genUid()}\">`;
      // docText += `    <value name=\"i\"><shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\"><field name=\"NUM\">${point.point[0]}</field></shadow></value>`;
      // docText += `    <value name=\"j\"><shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\"><field name=\"NUM\">${point.point[1]}</field></shadow></value>`;
      // docText += `    <value name=\"k\"><shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\"><field name=\"NUM\">${point.point[2]}</field></shadow></value>`;
      // docText += `    <value name=\"l\"><shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\"><field name=\"NUM\">${point.point[3]}</field></shadow></value>`;
      // docText += `    <value name=\"m\"><shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\"><field name=\"NUM\">${point.point[4]}</field></shadow></value>`;
      // docText += `    <value name=\"n\"><shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\"><field name=\"NUM\">${point.point[5]}</field></shadow></value>`;
      // docText += `    <value name=\"o\"><shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\"><field name=\"NUM\">${point.point[6]}</field></shadow></value>`;
      
      docText += `    <field name=\"i\">${point.point[0]}</field>`;
      docText += `    <field name=\"j\">${point.point[1]}</field>`;
      docText += `    <field name=\"k\">${point.point[2]}</field>`;
      docText += `    <field name=\"l\">${point.point[3]}</field>`;
      docText += `    <field name=\"m\">${point.point[4]}</field>`;
      // docText += `    <field name=\"n\">${point.point[5]}</field>`;
      // docText += `    <field name=\"o\">${point.point[6]}</field>`;
      if (window.GlobalUtil.model.robot.state.info.xarm_axis > 5) {
        docText += `    <field name=\"n\">${point.point[5]}</field>`;
      }
      if (window.GlobalUtil.model.robot.state.info.xarm_axis > 6) {
        docText += `    <field name=\"o\">${point.point[6]}</field>`;
      }
      docText += `    <value name=\"wait\"><shadow type=\"logic_boolean\" id=\"${Blockly.utils.genUid()}\"><field name=\"BOOL\">TRUE</field></shadow></value>`;
      docText += `    <value name=\"btn\"><block type=\"btn\" id=\"${Blockly.utils.genUid()}\"></block></value>`;
      docText += `  </block>`;
      docText += `</value>`;
      endText = `</block>${endText}`;
    }
    else if (point.type === 'cartesian' && point.point.length >= 6) {
      blockType = 'move_arc_to';
      docText += `<block type=\"${blockType}\" id=\"${Blockly.utils.genUid()}\">`;
      // TODO
      endText = `</block>${endText}`;
    }
    if (index !== 0 && index < points.length) {
      endText = `</next>${endText}`;
    }
  });
  endText += `</xml>${changeLine}`;
  docText += endText;
  BlocklyCom.appendXML(docText);
}

export default BlocklyCom;

// export {Blockly, init};
