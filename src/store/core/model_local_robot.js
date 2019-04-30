import Vue from 'vue';
import * as types from '../mutation-types';

const Robot = {};
const self = Robot;

console.log('test order robot')

const resetPosition = {
  x: 201.5,
  y: 0,
  z: 140.5,
};

const resetOrientation = {
  roll: 180,
  yaw: 0,
  pitch: 0,
};

const resetJoints = [0, 0, 0, 0, 0, 0, 0];

const state = {
  showSetControlValueDialog: false,
  running: true,
  positionInterval: null,
  rangeMovingInterval: null,
  intervalInfo: {
    curIntervals: [],
    position: {
      degree: 0,
      percent: 0,
    },
    orientation: {
      degree: 0,
      percent: 0,
    },
    angle: {
      percent: 0.5,
    },
    positionZ: {
      percent: 0.5,
    },
  },
  rangeMask: {
    dom: [],
    maskBar: [],
    inputWidth: [],
    rangeLength: [],
  },
  joystick: {
    step: {
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      orientation: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
  },
  status: {
    warning: null,
    connected: false,
    printed: null,
    paused: null,
    error: null,
    errorCount: 0,
  },
  message: {
    buffer: {},
    id: 0,
  },
  printer: {
    progress: 0,
  },
  download: {
    progress: 0,
  },
};


state.resetJoints = resetJoints.concat();

state.size = {
  modelCotainerWidth: '200',
  modelCotainerHeight: '200',
  leftControlWidth: '200',
};

state.range = {
  // position: { max: 700.0, min: -700.0 },
  // orientation: { max: 180.0, min: -180.0 },
  // joint: { max: 180.0, min: -180.0 },
  position: {
    x: { max: 750.0, min: -750.0 },
    y: { max: 750.0, min: -750.0 },
    z: { max: 1000.0, min: -400.0 },
  },
  orientation: {
    roll: { max: 180.0, min: -180.0 },
    yaw: { max: 180.0, min: -180.0 },
    pitch: { max: 180.0, min: -180.0 },
  },
  joint: [
    { max: 360.0, min: -360.0 },
    { max: 125.0, min: -125.0 },
    { max: 360.0, min: -360.0 },
    { max: 6.0, min: -230.0 },
    { max: 360.0, min: -360.0 },
    { max: 180.0, min: -100.0 },
    { max: 360.0, min: -360.0 },
  ],
  // joint: [
  //   { max: 180.0, min: -180.0 },
  //   { max: 125.0, min: -125.0 },
  //   { max: 180.0, min: -180.0 },
  //   { max: 11.0, min: -230.0 },
  //   { max: 180.0, min: -180.0 },
  //   { max: 180.0, min: -100.0 },
  //   { max: 180.0, min: -180.0 },
  // ],
  // joint: [
  //   { max: 180.0, min: -180.0 },
  //   { max: 180.0, min: -180.0 },
  //   { max: 34.4, min: -180.0 },
  //   { max: 6.6, min: -212.7 },
  //   { max: 180.0, min: -180.0 },
  //   { max: 180.0, min: -102.5 },
  //   { max: 180.0, min: -180.0 },
  // ]
};

state.tempJoints = [0, 0, 0, 0, 0, 0, 0];

state.local = {
  position: { x: 678, y: null, z: null },
  orientation: { roll: null, yaw: null, pitch: null },
  joints: resetJoints.concat(),
  jointLocks: [false, false, false, false, false, false, false],
  selectJointIndex: -1,
  isSetJoint: false,
  selectPosIndex: -1,
  speed: 50,
  acceleration: 5000,
  angle_speed: 20,
  angle_acceleration: 5000,
  gripper: { enable: false, speed: 8000, pos: 500 },
  speedPercent: 0.1,
  accPercent: 0.1,
  initialPoint: [0, 0, 0, 0, 0, 0, 0],
  positionStep: 1,
  attitudeStep: 1,
  jointStep: 1,
};

state.remote = {
  position: { x: 456, y: null, z: null },
  orientation: { roll: null, yaw: null, pitch: null },
  joints: resetJoints.concat(),
  jointLocks: [false, false, false, false, false, false, false],
  speed: 50,
  acceleration: 5000,
  angle_speed: 20,
  angle_acceleration: 5000,
  gripper: { enable: false, speed: 8000, pos: 500 },
  last_used_position: [0, 0, 0, 0, 0, 0],
  speedPercent: 0.1,
  accPercent: 0.1,
  initialPoint: [0, 0, 0, 0, 0, 0, 0],
  positionStep: 1,
  attitudeStep: 1,
  jointStep: 1,
};

state.error = {
  xarm_warn: {
    code: 0,
    desc: '',
    handle: [],
  },
  xarm_error: {
    code: 0,
    desc: '',
    handle: [],
  },
  xarm_servo_error: [],
}

state.info = {
  socketConnected: false,
  // connected: false,
  port: null,
  serialNumber: null,
  robotVersion: null,
  coreVersion: null,
  baudrate: null,
  test: null,
  socket: null,
  // speed: 10,
  // acceleration: 2000,
  xarm_limit_velo: [1, 999],
  xarm_limit_acc: [100, 50000],
  xarm_limit_angle_velo: [1, 200],
  xarm_limit_angle_acc: [100, 50000],
  online: false,
  lastOnline: false,
  xarm_axis: 7,
  xarm_mode: 0,
  xarm_collision_sensitivity: 0,
  xarm_teach_sensitivity: 0,
  xarm_tcp_load: [0, [0, 0, 0]],
  xarm_tcp_offset: [0, 0, 0, 0, 0, 0],
  xarm_gravity_direction: [0, 0, -1],
  isOldProcotol: false,
  xarm_end_tool_type: null,
  xarm_gripper_is_enable: false,
};

state.jointRangeEventTouch = false;
state.jointRangeMoving = false;

state.isRobotShowEditBtn = true;

state.counter = 0;

state.isMoving = false;

state.restCtrls = {};

// state.jointRangeMoved = {
//   state: false,
//   index: null,
//   value: null,
// };

state.currentMoveIndex = null;

state.func = {};
state.func.initInterval = (callback) => {
  if (state.positionInterval === null) {
    state.positionInterval = window.setInterval(() => {
      if (callback) {
        callback();
      }
    }, 500);
  }
};

state.func.reInitRangeMovingInterval = (callback) => {
  window.clearInterval(state.rangeMovingInterval);
  state.rangeMovingInterval = null;
  state.rangeMovingInterval = window.setInterval(() => {
    if (callback) {
      callback();
    }
    window.clearInterval(state.rangeMovingInterval);
    state.rangeMovingInterval = null;
  }, 1000);
};

state.func.setRobotInfo = (dict) => {
  console.log('device info broadcast:', dict);
  if (dict.xarm_port_name === 'localhost') {
    state.info.port = location.hostname;
  }
  else {
    state.info.port = dict.xarm_port_name;
  }
  state.info.serialNumber = dict.xarm_port_serial_number;
  state.info.robotVersion = dict.xarm_version;
  state.info.coreVersion = dict.core_version;
  state.info.baudrate = dict.xarm_port_baudrate;
  state.info.isOldProcotol = dict.is_old_protocol;
};

state.func.setRobotStateOnline = (isOnline) => {
  state.info.online = isOnline;
}

state.func.resetLocal = () => {
  state.local.joints = resetJoints.concat();
  state.local.position = Object.assign({}, resetPosition);
  state.local.orientation = Object.assign({}, resetOrientation);
};

state.func.resetXarmPosition = (wait, callback) => {
  window.CommandsRobotSocket.goHome(wait, (dict) => {
    console.log(dict);
    if (callback) {
      callback(dict);
    }
  });
  // if (state.info.online) {
  //   // state.local.joints = resetJoints.concat();
  //   window.CommandsRobotSocket.goHome((dict) => { console.log(dict); if (callback) { callback(dict); } });
  // }
  // else {
  //   state.func.resetLocal();
  // }
};

state.func.setRobotParam = (dict, callback) => {
  state.info[dict.index] = dict.value;
  if (dict.index === 'speed') {
    state.local.speed = Number(dict.value);
    window.CommandsRobotSocket.setParamsSpeed((dict) => { console.log(dict); if (callback) { callback(dict); } })
  }
  else if (dict.index === 'acceleration') {
    state.local.acceleration = Number(dict.value);
    window.CommandsRobotSocket.setParamsAcceleration((dict) => { console.log(dict); if (callback) { callback(dict) } });
  }
  else if (dict.index === 'angle_speed') {
    state.local.angle_speed = Number(dict.value);
    window.CommandsRobotSocket.setParams(null, (dict) => { console.log(dict); if (callback) { callback(dict); } })
  }
  else if (dict.index === 'angle_acceleration') {
    state.local.angle_acceleration = Number(dict.value);
    window.CommandsRobotSocket.setParams(null, (dict) => { console.log(dict); if (callback) { callback(dict) } });
  }
  else {
    state.info[dict.index] = dict.value;
  }
};

state.func.reset = () => {
  if (state.intervalInfo.curIntervals.length === 0) {
    window.clearInterval(state.positionInterval);
    state.positionInterval = null;
    return true;
  }
  return false;
};

state.func.setRobotMoveAllJoints = (joints, isWait, callback, isControl) => {
  // console.log(`move All Joints state.info.online = ${state.info.online}`);
  if (state.info.online === true) {
    window.CommandsRobotSocket.moveAllJoints(joints, isWait, (dict) => {
      if (callback) {
        callback(dict);
      }
    }, isControl);
  }
  else { // offline mode
    // state.info.axis = joints.slice();
    state.local.joints = joints.slice();
    if (callback) {
      callback({});
    }
  }
};

state.func.moveEndStep = (data, wait, callback) => {
  console.log('set position:', data);
  const index = Object.keys(data)[0]
  const value = Number(data[index])
  const params = {
    [index.toUpperCase()]: value,
    F: Number(state.local.speed),
    Q: Number(state.local.acceleration),
    wait: wait !== undefined ? wait : true,
    relative: data.relative,
    R: wait !== false ? -1 : 0
  }
  // state.local.position[index] += value;
  // const params = {
  //   [index.toUpperCase()]: state.local.position[index],
  //   F: Number(state.local.speed),
  //   Q: Number(state.local.acceleration),
  //   wait: wait !== undefined ? wait : true,
  // }
  if (state.info.online) {
    window.GlobalUtil.socketCom.sendCmd('xarm_move_arc_line', { data: params }, (response) => { 
      console.log(`set ${index} move end step, socket res`, response);
      if (callback) {
        callback(response);
      }
    });
  }
};

state.func.remote2Local = () => {
  // state.local = Object.assign({}, state.remote);
  state.local.position = Object.assign({}, state.remote.position);
  state.local.orientation = Object.assign({}, state.remote.orientation);
  state.local.joints = state.remote.joints.concat();
  state.local.jointLocks = state.remote.jointLocks.concat();
  // position: { x: 678, y: null, z: null },
  // orientation: { roll: null, yaw: null, pitch: null },
  // joints: resetJoints.concat(),
  // jointLocks: [false, false, false, false, false, false, false],
};

function initStateInfo() {
  state.local.position.x = state.local.position.x || 0;
  state.local.position.y = state.local.position.y || 0;
  state.local.position.z = state.local.position.z || 0;
  state.local.orientation.roll = state.local.orientation.roll || 0;
  state.local.orientation.yaw = state.local.orientation.yaw || 0;
  state.local.orientation.pitch = state.local.orientation.pitch || 0;
}

function setJoystickStep(type) {
  // const zoom = type === 'position' ? 7 : 2;
  const degree = state.intervalInfo[type].degree;
  const percent = state.intervalInfo[type].percent;
  // const zoom = type === 'position' ? 1 : 2;
  // const distance = 40.0 * percent;
  const distance = 1.0 * percent;
  const radian = degree * Math.PI / 180.0;
  // const pi = Math.PI;
  if (type === 'position') {
    state.joystick.step[type].x = distance * Math.sin(radian);
    state.joystick.step[type].y = 0 - distance * Math.cos(radian);
    // console.log(`X: ${state.joystick.step[type].x}, Y:${state.joystick.step[type].y}`);
  }
  else if (type === 'orientation') {
    state.joystick.step[type].y = distance * Math.sin(radian);
    state.joystick.step[type].x = distance * Math.cos(radian);
  }
}

state.func.intervalInfo2ArcParams = () => {
  const angles = {
    position: {},
    orientation: {},
  };
  for (let i = 0; i < state.intervalInfo.curIntervals.length; i += 1) {
    const key = state.intervalInfo.curIntervals[i];
    switch (key) {
      default:
        break;
      case 'position': {
        setJoystickStep('position');
        const positionX = Number((state.joystick.step.position.x).toFixed(1));
        const positionY = Number((state.joystick.step.position.y).toFixed(1));

        state.local.position.x += positionX;
        state.local.position.y += positionY;

        angles['position']['x'] = positionX;
        angles['position']['y'] = positionY;

        const max = 800

        if (state.local.position.x > max || state.local.position.x < -max) {
          state.status.errorCount += 1;
          state.local.position.x -= positionX;
        }
        else if (state.local.position.y > max || state.local.position.y < -max) {
          state.status.errorCount += 1;
          state.local.position.y -= positionY;
        }
        break;
      }
      case 'orientation': {
        setJoystickStep('orientation');
        const orientationX = Number((state.joystick.step.orientation.x).toFixed(1));
        const orientationY = Number((state.joystick.step.orientation.y).toFixed(1));
        // console.log('>>>>2', orientationX, orientationY);
        angles['orientation']['pitch'] = orientationX;
        angles['orientation']['yaw'] = orientationY;
        const max2 = 180;
        const tempx = state.local.orientation.pitch + orientationX;
        const tempy = state.local.orientation.yaw + orientationY;
        // if (tempx > max2 || tempx < -max2) {
        //   // state.status.errorCount += 1;
        // }
        if (tempx > max2) {
          state.local.orientation.pitch = max2;
        }
        else if (tempx < -max2) {
          state.local.orientation.pitch = -max2;
        }
        else {
          state.local.orientation.pitch = tempx;
        }
        if (tempy > max2) {
          state.local.orientation.yaw = max2;
        }
        else if (tempy < -max2) {
          state.local.orientation.yaw = -max2;
        }
        else {
          state.local.orientation.yaw = tempy;
        }
        break;
      }
      case 'angle': {
        const percent3 = state.intervalInfo.angle.percent;
        // console.log('>>>>3', percent3);
        angles['orientation']['roll'] = (percent3 - 0.5) * 2;
        const max3 = 180;
        // const roll = 60.0 * percent3 - 30.0; // Number(state.joystick.step.orientation.z);
        const roll = 30.0 * percent3 - 15.0;
        const temp = state.local.orientation.roll + roll;
        if (temp > max3) {
          state.local.orientation.roll = max3;
        }
        else if (temp < -max3) {
          state.local.orientation.roll = -max3;
        }
        // if (temp > max3 || temp < -max3) {
        //   // state.status.errorCount += 1;
        // }
        else {
          state.local.orientation.roll = temp;
        }
        break;
      }
      case 'positionZ': {
        const percent4 = state.intervalInfo.positionZ.percent;
        // console.log('>>>>4', percent4);
        angles['position']['z'] = (percent4 - 0.5) * 2;
        // const z = percent4 * 100.0 - 50.0;
        const z = percent4 * 50.0 - 25.0;
        state.local.position.z += z;
        break;
      }
    }
  }
  const data = {
    X: Number(state.local.position.x),
    Y: Number(state.local.position.y),
    Z: Number(state.local.position.z),
    A: Number(state.local.orientation.roll),
    B: Number(state.local.orientation.yaw),
    C: Number(state.local.orientation.pitch),
    F: Number(state.local.speed),
    Q: Number(state.local.acceleration),
    R: 0,
  };
  initStateInfo();
  console.log(`angles: ${JSON.stringify(angles)}`);
  // return { data: data };
  // return data;
  return angles;
};

const GPIOEvent = {
  show: false,
  values: {
    digital: {
      io1: -1,
      io2: -1,
    },
    analog: {
      io1: -1,
      io2: -1,
    },
  },
  eventListener: {
    digital: {},
    analog: {},
  },
  addEventListener(type, io, value, args) {
    if (this.eventListener[type] === undefined) {
      this.eventListener[type] = {};
    }
    if (this.eventListener[type][io] === undefined) {
      this.eventListener[type][io] = {};
    }
    if (this.eventListener[type][io][value] === undefined) {
      this.eventListener[type][io][value] = [];
    }
    this.eventListener[type][io][value].push(args);
    window.CommandsRobotSocket.start_report_gpio_digital();
    self.event.hasEvent = true;
    this.show = true;
  },
  clearEventListener() {
    this.eventListener = {
      digital: {},
      analog: {},
    };
    window.CommandsRobotSocket.stop_report_gpio_digital();
    self.event.hasEvent = false;
    this.show = false;
  },
  proceedEvent(data) {
    for (let io_type in this.eventListener) {
      for (let io in this.eventListener[io_type]) {
        for (let value in this.eventListener[io_type][io]) {
          if ((io === 'io1' && Number(value) === data[io_type][0] && data[io_type][0] !== this.values[io_type][io]) 
            || (io === 'io2' && Number(value) === data[io_type][1] && data[io_type][1] !== this.values[io_type][io])) {
              for (const event of this.eventListener[io_type][io][value]) {
                event.callback();
              }
            }
        }
      }
    }
    this.values.digital.io1 = data.digital[0];
    this.values.digital.io2 = data.digital[1];
    this.values.analog.io1 = data.analog[0];
    this.values.analog.io2 = data.analog[1];
  },
};

const event = {
  hasEvent: false,
  GPIOEvent: GPIOEvent,
}
self.event = event;
self.state = state;

export default self;
