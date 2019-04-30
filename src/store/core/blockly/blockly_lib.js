/**
 * Created by alex on 20/06/2017.
 */

const BlocklyLib = {
  Blockly: null,
  // waitUntilTrigger: [],
  init(Blockly) {
    this.Blockly = Blockly;
  },
  waitUntil(callback, time, isApp) {
    return new Promise((resolve, reject) => {
      const trigger = setInterval(() => {
        const flag = callback();
        console.log('waitUntil = ' + flag);
        if (window.GlobalUtil.model.robot.state.info.online && window.GlobalUtil.model.robot.state.error.xarm_error.code != 0) {
          window.GlobalUtil.model.robot.state.comStop(true);
        }
        if (this.Blockly.Running) {
          if (isApp === true) {
            if (this.Blockly.AppRunning === false) {
              clearInterval(trigger);
              resolve();
            }
          }
          else if (flag) {
            clearInterval(trigger);
            resolve();
          }
        }
        else {
          this.Blockly.Running = false;
          this.Blockly.AppRunning = false;
          clearInterval(trigger);
          reject = reject || (() => {});
          if (reject) {
            reject();
          }
        }
      }, time * 1000);
      // this.waitUntilTrigger.push(trigger);
    });
  },
  // wait: t => new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     if (BlocklyLib.Blockly.Running) {
  //       resolve();
  //     }
  //     else {
  //       reject();
  //     }
  //   }, 1000 * t);
  // }),
  KeyPressEvent: {
    keyDownHold: false,
    hasKeyEvent: false,
    value: {},
    init() {
      // this.hasKeyEvent = true;
      document.onkeydown = (event) => {
        // if (event.target !== document && event.target !== document.body) return;
        if (!this.keyDownHold) {
          let keycode = event.keyCode;
          if (keycode >= 97 && keycode <= 122) { // if key code in a~z lowercase
            keycode -= 32; // uppercase key code
          }
          this.setValue(keycode, true);
          if (this.eventListener.hasOwnProperty(keycode)) {
            this.eventListener[keycode]();
          }
          this.keyDownHold = true;
        }
      };
      document.onkeyup = (event) => {
        let keycode = event.keyCode;
        if (keycode >= 97 && keycode <= 122) { // if key code in a~z lowercase
          keycode -= 32; // uppercase key code
        }
        this.setValue(keycode, false);
        this.keyDownHold = false;
      };
    },
    clearValue() {
      this.value = {};
      this.hasKeyEvent = false;
      window.GlobalUtil.model.robot.event.hasEvent = false;
    },
    stop() {
      document.onkeydown = () => { };
      document.onkeyup = () => { };
      this.hasKeyEvent = false;
      window.GlobalUtil.model.robot.event.hasEvent = false;
    },
    setValue(key, value) {
      this.value[key] = value;
      // console.log(`${key} - ${this.value[key]}`);
    },
    getValue(key) {
      if (this.value[key] === undefined) {
        this.value[key] = false;
      }
      return this.value[key];
    },
    eventListener: {},
    addEventListener(keycode, statement) {
      this.hasKeyEvent = true;
      window.GlobalUtil.model.robot.event.hasEvent = true;
      this.eventListener[keycode] = statement;
    },
    clearEventListener() {
      this.eventListener = {};
      this.hasKeyEvent = false;
      window.GlobalUtil.model.robot.event.hasEvent = false;
      // document.onkeydown = () => { };
      // document.onkeyup = () => { };
    },
  },
  async runForever(callback) {
    return new Promise((resolve, reject) => {
      this.repeatWhile(() => true, callback).then(resolve).catch((err) => reject(err));
    });
  },
  async repeatWhile(condition, callback) {
    let done = true;
    return new Promise(async (resolve, reject) => {
      const trigger = setInterval(async () => {
        try {
          if (this.Blockly.Running && condition()) {
            if (done) {
              done = false;
              await callback();
              done = true;
            }
          }
          else {
            resolve();
            clearInterval(trigger);
          }
        }
        catch (e) {
          reject(e);
          clearInterval(trigger);
        }
      }, 1000);
    });
  },
};

BlocklyLib.wait = t => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (Blockly.Running) {
      resolve();
    }
    else {
      reject();
    }
  }, 1000 * t);
});

BlocklyLib.isChildBlock = (childBlockId, parentBlock) => {
  const children = parentBlock.getChildren();
  for (const c of children) {
    if (c.id === childBlockId) return true;
  }
  return false;
}

BlocklyLib.isOnline = () => {
  return window.GlobalUtil.model.robot.state.info.online === true;
};

BlocklyLib.isMoving = () => {
  return window.GlobalUtil.model.robot.state.info.jointRangeMoving === true;
};

BlocklyLib.movingWaitUntil = (sec, isApp) => {
  if (!sec) {
    sec = 1;
  }
  return `await BlocklyCom.blocklyLib.waitUntil(() => { return window.GlobalUtil.model.robot.state.isMoving === false }, ${sec}, ${isApp});\n`;
};

BlocklyLib.onOffLineCode = (online, offline) => {
  return `if (BlocklyCom.blocklyLib.isOnline() === true) { ${online} } else { ${offline} }\n`;  
}

BlocklyLib.runningIndex = 0;

BlocklyLib.consoleLog = (block, params) => {
  BlocklyLib.runningIndex += 1;
  if (!params) {
    params = {};
  }
  const keys = Object.keys(params).join(',');
  const values = Object.values(params).join(',');
  const paramsStr = JSON.stringify(params).replace(/"/g, "").replace(/'/g, "").replace(/\\/g, '');
  return `console.log('[proj running type: ${block.type}, seq: ${BlocklyLib.runningIndex} -- ${paramsStr}]');\n`;
  // return `console.log('[proj running param = ${params}');\n`;
};

export default BlocklyLib;
