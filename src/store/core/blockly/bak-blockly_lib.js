/**
 * Created by alex on 20/06/2017.
 */
function rgb2hsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  let rr;
  let gg;
  let bb;
  let s;
  let h;
  const v = Math.max(r, g, b);
  const diff = v - Math.min(r, g, b);
  const diffc = c => (v - c) / 6 / diff + 1 / 2;

  if (diff === 0) {
    h = s = 0;
  }
  else {
    s = diff / v;
    rr = diffc(r);
    gg = diffc(g);
    bb = diffc(b);

    if (r === v) {
      h = bb - gg;
    }
    else if (g === v) {
      h = (1 / 3) + rr - bb;
    }
    else if (b === v) {
      h = (2 / 3) + gg - rr;
    }
    if (h < 0) {
      h += 1;
    }
    else if (h > 1) {
      h -= 1;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

function toHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

const BlocklyLib = {
  Blockly: null,
  waitUntilTrigger: [],
  init(Blockly) {
    this.Blockly = Blockly;
  },
  BlocklyColor: {
    COLOR_MOTION: '#EC7357',
    COLOR_GROVE: '#FC9D9A',
    COLOR_EVENT: '#FFCD76',
    COLOR_INPUT: '#FFCD76',
    COLOR_CONDITION: '#FFCD76',
    COLOR_LOGIC: '#58C9B9',
    COLOR_LOOP: '#5A93D7',
    COLOR_MATH: '#A5D296',
    COLOR_LIST: '#8283A7',
    COLOR_TEXT: '#B3B3B3',
    COLOR_ADVANCE: '#C65146',
    COLOR_VARIABLE: '#B96BA7',
    COLOR_FUNCTION: '#F17F42',
    COLOR_SOUND: '#ABA1FD',
  },
  waitUntil(callback, time) {
    return new Promise((resolve, reject) => {
      const trigger = setInterval(() => {
        if (this.Blockly.Running) {
          if (callback()) {
            clearInterval(trigger);
            resolve();
          }
        }
        else {
          clearInterval(trigger);
          reject();
        }
      }, time * 1000);
      this.waitUntilTrigger.push(trigger);
    });
  },
  wait: t => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (BlocklyLib.Blockly.Running) {
        resolve();
      }
      else {
        reject();
      }
    }, 1000 * t);
  }),
  isInHueRange(color, range) {
    const min = range[0];
    const max = range[1];
    if (min <= 360 && min >= 0 && max <= 360 && max >= 0) {
      if (min <= max) {
        return (color >= min) && (color <= max);
      }
      return (color >= min) || (color <= max);
    }
    return false;
  },
  KeyPressEvent: {
    keyDownHold: false,
    value: {},
    init() {
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
    },
    stop() {
      document.onkeydown = () => { };
      document.onkeyup = () => { };
    },
    setValue(key, value) {
      this.value[key] = value;
      console.log(`${key} - ${this.value[key]}`);
    },
    getValue(key) {
      console.log(`key press: ${this.value[key]}`);
      if (this.value[key] === undefined) {
        this.value[key] = false;
      }
      return this.value[key];
    },
    eventListener: {},
    addEventListener(keycode, statement) {
      this.eventListener[keycode] = statement;
    },
    clearEventListener() {
      this.eventListener = {};
      // document.onkeydown = () => { };
      // document.onkeyup = () => { };
    },
  },
  rgb2hex(r, g, b) { // r, g, b to #FFFFFF
    return `#${toHex(Number(r))}${toHex(Number(g))}${toHex(Number(b))}`;
  },
  convertRGB(rgbArray) { // ['R255', 'G255', 'B255'] to rgb(255, 255, 255)
    const r = Number(rgbArray[0].substr(1, rgbArray[0].length));
    const g = Number(rgbArray[1].substr(1, rgbArray[1].length));
    const b = Number(rgbArray[2].substr(1, rgbArray[2].length));
    return `rgb(${r}, ${g}, ${b})`;
  },
  hex2rgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  },
  getHueByRGB(colorArray) { // ['R255', 'G255', 'B255']
    const r = Number(colorArray[0].substr(1, colorArray[0].length));
    const g = Number(colorArray[1].substr(1, colorArray[1].length));
    const b = Number(colorArray[2].substr(1, colorArray[2].length));
    return rgb2hsv(r, g, b).h;
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
  async repeatUntil(condition, callback) {
    return new Promise((resolve, reject) => {
      this.repeatWhile(() => !condition(), callback).then(resolve).catch((err) => reject(err));
    });
  },
  repeatTimes(times, callback) {
    return new Promise(async (resolve, reject) => {
      try {
        for (let i = 0; i < times; i++) {
          if (!this.Blockly.Running) break;
          await callback();
        }
        resolve();
      }
      catch (e) {
        reject(e);
      }
    });
  },
  bin2hex(d) {
    return d.reduce((hexStr, binArry) => {
      const binStr = binArry.reduce((s, b) => `${s}${b}`);
      const hs = parseInt(binStr, 2).toString(16).toUpperCase();
      switch (hs.length) {
        default: break;
        case 0: return `${hexStr}0000`;
        case 1: return `${hexStr}000${hs}`;
        case 2: return `${hexStr}00${hs}`;
        case 3: return `${hexStr}0${hs}`;
        case 4: return `${hexStr}${hs}`;
      }
      return '';
      // return hexStr.length < 2 ? `0${hexStr}` : hexStr;
    }, '');
  },
  isAsciiOnly(str) {
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127) return false;
    }
    return true;
  },
};

BlocklyLib.isChildBlock = (childBlockId, parentBlock) => {
  const children = parentBlock.getChildren();
  for (const c of children) {
    if (c.id === childBlockId) return true;
  }
  return false;
}

BlocklyLib.genDocText = (points, index) => {
  let docText = '';
  console.log('points = ' + points);
  const onePoint = points[index];
  const isTimer = onePoint.length === 1;
  const blockType = isTimer === true ? 'wait' : 'move_7';
  docText += `<block type=\"${blockType}\" id=\"${Blockly.utils.genUid()}\">`;

  if (isTimer === true) {
    const dura = onePoint[0];
    docText += `<value name=\"sec\">`;
    docText += `<shadow type=\"math_number\" id=\"${Blockly.utils.genUid()}\">`;
    docText += `<field name=\"NUM\">${dura}</field>`;
    docText += `</shadow>`;
    docText += `</value>`;
  }
  else {
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
    docText += `  </block>`;
    docText += `</value>`;
  }

  if (index < points.length - 1) {
    docText += '<next>';
    docText += BlocklyLib.genDocText(points, index + 1);
    docText += '</next>';
  }
  docText += `</block>`;
  return docText;
}

BlocklyLib.record2Text = (points) => {
  // Blockly.utils.genUid();
  const changeLine = '\n';
  const blockType = 'wait';
  let docText = '';

  docText += `<xml xmlns=\"http://www.w3.org/1999/xhtml\">`;
  docText += `<variables></variables>`;
  docText += BlocklyLib.genDocText(points, 0);
  docText += `</xml>${changeLine}`;

  return docText;
};

export default BlocklyLib;
