// import Vue from 'vue';
// import * as types from '../mutation-types';

// function getReverseKinematics(data, callback) {
//   window.GlobalUtil.socketCom.sendCmd(
//     'xarm_get_ik',
//     {
//       data: {
//         X: data.info.position.x,
//         Y: data.info.position.y,
//         Z: data.info.position.z,
//         A: data.info.orientation.roll,
//         B: data.info.orientation.yaw,
//         C: data.info.orientation.pitch,
//       },
//     },
//     callback,
//   );
// }
// const state = {
//   running: true,
//   positionInterval: null,
//   intervalInfo: {
//     curIntervals: [],
//     position: {
//       degree: 0,
//       percent: 0,
//     },
//     orientation: {
//       degree: 0,
//       percent: 0,
//     },
//     angle: {
//       percent: 0.5,
//     },
//     positionZ: {
//       percent: 0.5,
//     },
//   },
//   rangeMask: {
//     dom: [],
//     maskBar: [],
//     inputWidth: [],
//     rangeLength: [],
//   },
//   joystick: {
//     step: {
//       position: {
//         x: 0,
//         y: 0,
//         z: 0,
//       },
//       orientation: {
//         x: 0,
//         y: 0,
//         z: 0,
//       },
//     },
//   },
//   status: {
//     warning: null,
//     connected: false,
//     printed: null,
//     paused: null,
//     error: null,
//     errorCount: 0,
//   },
//   message: {
//     buffer: {},
//     id: 0,
//   },
//   printer: {
//     progress: 0,
//   },
//   download: {
//     progress: 0,
//   },
// };
// const actions = {
//   setSpeed: ({ state }, value) => {
//     window.GlobalUtil.socketCom.sendCmd(
//       'xarm_set_params',
//       {
//         data: {
//           F: value,
//         },
//       },
//     );
//     // state.info.speed = (value < 0) ? 10 : value;
//   },
//   setAcceleration: ({ state }, value) => {
//     window.GlobalUtil.socketCom.sendCmd(
//       'xarm_set_params',
//       {
//         data: {
//           Q: value,
//         },
//       },
//     );
//     // state.info.acceleration = (value < 0) ? 2000 : value;
//   },
//   setError: ({ state }, value) => {
//     state.status.error = value;
//   },
// };
// const mutations = {
//   test(state, data) {
//     state.info.test = data;
//   },
//   [types.SET_ERROR](state, data) {
//     state.status.error = data;
//     state.status.errorCount += 1;
//     if (data < 0) {
//       window.GlobalUtil.socketCom.sendCmd(
//         'xarm_get_joint_pose',
//         {
//           data: '',
//         },
//         (response) => {
//           const joint = response.data;
//           if (joint && (joint.length > 0)) {
//             state.info.axis = joint.map(num => Number(num.toFixed(2))).slice(); // .slice()
//             state.info.test = joint[1];
//           }
//           else {
//             console.log('[response]get_joint_pose FAIL', response);
//           }
//         },
//       );
//     }
//   },
//   [types.GET_ROBOT_STATUS](state) {
//     window.GlobalUtil.socketCom.sendCmd(
//       'xarm_get_tcp_pose',
//       {
//         data: '',
//       },
//       (response) => {
//         const end = response.data;
//         if (end && (end.length > 0)) {
//           state.info.position = {
//             x: Number(end[0]),
//             y: Number(end[1]),
//             z: Number(end[2]),
//           };
//           state.info.orientation = {
//             roll: Number(end[3]),
//             yaw: Number(end[4]),
//             pitch: Number(end[5]),
//           };
//         }
//         else {
//           console.log('[response]get get_tcp_pose FAIL', response);
//         }
//       },
//     );
//     window.GlobalUtil.socketCom.sendCmd(
//       'xarm_get_joint_pose',
//       {
//         data: '',
//       },
//       (response) => {
//         const joint = response.data;
//         console.log(`response.data = ${JSON.stringify(response.data)}`);
//         if (joint && (joint.length > 0)) {
//           state.info.axis = joint.map(num => Number(num.toFixed(2))).slice(); // .slice()
//           state.info.test = joint[1];
//         }
//         else {
//           console.log('[response]get_joint_pose FAIL', response);
//         }
//       },
//     );
//   },
//   [types.SET_ROBOT_STATUS](state, data) {
//     state.status.connected = data.xarm_connected;
//     // console.log(`data.xarm data.xarm = ${JSON.stringify(data)}`);

//     state.info.xarm_limit_velo = [Number(data.xarm_limit_velo[0]), Number(data.xarm_limit_velo[1])];
//     state.info.xarm_limit_acc = [Number(data.xarm_limit_acc[0]), Number(data.xarm_limit_acc[1])];

//     if (!state.status.connected) {
//       if (state.info.online) {
//         state.info.lastOnline = state.info.online;
//       }
//       state.info.online = false;
//     }
//     else if (state.info.lastOnline) {
//       // console.log(`last_online: ${state.info.lastOnline}`);
//       state.info.online = state.info.lastOnline;
//       state.info.lastOnline = false;
//     }
//     const end = data.xarm_tcp_pose;
//     const joint = data.xarm_joint_pose;
//     const error = data.xarm_error_code;
//     console.log(`status state.info.speed 1 = ${state.info.speed}`);
//     if (state.info.speed !== Number(data.xarm_current_velo)) {
//       state.info.speed = Number(data.xarm_current_velo);
//       console.log(`status state.info.speed 2 = ${state.info.speed}`);
//     }
//     if (state.info.acceleration !== Number(data.xarm_current_acc)) {
//       state.info.acceleration = Number(data.xarm_current_acc);
//     }
//     if (state.info.online || (state.info.axis.length === 0)) {
//       if (end && (end.length > 0)) {
//         // console.log('table posi print:');
//         // console.table(end);
//         state.info.position = {
//           x: Number(end[0]),
//           y: Number(end[1]),
//           z: Number(end[2]),
//         };
//         state.info.orientation = {
//           roll: Number(end[3]),
//           yaw: Number(end[4]),
//           pitch: Number(end[5]),
//         };
//         // state.info.position.y = Number(end[1]);
//         // state.info.position.z = Number(end[2]);
//         // state.info.orientation.roll = Number(end[3]);
//         // state.info.orientation.yaw = Number(end[4]);
//         // state.info.orientation.pitch = Number(end[5]);
//       }
//       if (joint && (joint.length > 0)) {
//         // console.table(joint);
//         state.info.axis = joint.map(num => Number(num.toFixed(2))).slice(); // .slice()
//         state.info.test = joint[1];
//       }
//     }
//     state.status.warning = data.xarm_warn_code;
//     if (error && (error > 0)) {
//       const ERROR_LIST = {
//         1: 'UX2_ERR_CODE',
//         2: 'UX2_WAR_CODE',
//         3: 'UX2_ERR_TOUT',
//         4: 'UX2_ERR_LENG',
//         5: 'UX2_ERR_OTHER',
//         1000: 'Exception',
//       };
//       if (ERROR_LIST[error] !== undefined) {
//         state.status.error = ERROR_LIST[error];
//       }
//       else {
//         state.status.error = 'unknow error';
//       }
//     }
//     else {
//       state.status.connected = data.xarm_connected;
//       state.status.printed = data.xarm_printed;
//       state.status.paused = data.xarm_paused;
//     }
//   },
//   [types.GET_ROBOT_INFO](state, data) {
//     console.log('device info broadcast:', data);
//     state.info.port = data.xarm_port_name;
//     state.info.serialNumber = data.xarm_port_serial_number;
//     state.info.robotVersion = data.xarm_version;
//     state.info.coreVersion = data.core_version;
//     state.info.baudrate = data.xarm_port_baudrate;
//   },
//   [types.SET_ROBOT_INFO](state, info) {
//     state.info = info;
//   },
//   [types.ROBOT_BROADCAST](state, data) {
//     state.printer.progress = data.progress;
//   },
//   // [types.MOVE_END_XY](state, data) {
//   //   console.log('set position:', data);
//   //   state.info.position.x += data[0];
//   //   state.info.position.y += data[1];
//   //   const max = 800
//   //   if (state.info.position.x > max || state.info.position.x < -max) {
//   //     state.status.errorCount += 1;
//   //     state.info.position.x -= data[0];
//   //   }
//   //   else if (state.info.position.y > max || state.info.position.y < -max) {
//   //     state.status.errorCount += 1;
//   //     state.info.position.y -= data[1];
//   //   }
//   //   else if (state.info.online) {
//   //     window.GlobalUtil.socketCom.sendCmd(
//   //       'xarm_move_arc_line',
//   //       {
//   //         data: {
//   //           X: state.info.position.x,
//   //           Y: state.info.position.y,
//   //           Z: state.info.position.z,
//   //           A: state.info.orientation.roll,
//   //           B: state.info.orientation.yaw,
//   //           C: state.info.orientation.pitch,
//   //           F: state.info.speed,
//   //           Q: state.info.acceleration,
//   //           R: 0,
//   //         },
//   //       },
//   //       (response) => { console.log('set xy socket res', response); },
//   //     );
//   //   }
//   //   else { // offline mode
//   //     getReverseKinematics(state, (response) => {
//   //       state.info.axis = response.data.map(num => Number(num.toFixed(2))).slice();
//   //       // console.log('get 7 angle, socket res', response);
//   //     });
//   //   }
//   // },
//   // [types.MOVE_END_Z](state, data) {
//   //   // console.log('set position:', data);
//   //   state.info.position.z += data;
//   //   if (state.info.online) {
//   //     window.GlobalUtil.socketCom.sendCmd(
//   //       'xarm_move_arc_line',
//   //       {
//   //         data: {
//   //           X: state.info.position.x,
//   //           Y: state.info.position.y,
//   //           Z: state.info.position.z,
//   //           A: state.info.orientation.roll,
//   //           B: state.info.orientation.yaw,
//   //           C: state.info.orientation.pitch,
//   //           F: state.info.speed,
//   //           Q: state.info.acceleration,
//   //           R: 0,
//   //         },
//   //       },
//   //       (response) => { console.log('set z socket res', response); },
//   //     );
//   //   }
//   //   else { // offline mode
//   //     getReverseKinematics(state, (response) => {
//   //       state.info.axis = response.data.map(num => Number(num.toFixed(2))).slice();
//   //       console.log('get 7 angle, socket res', response);
//   //     });
//   //   }
//   // },
//   [types.MOVE_END_STEP](state, data) {
//     // console.log('set position:', data);
//     const index = Object.keys(data)[0]
//     const value = Number(data[index])
//     state.info.position[index] += value;
//     const params = {
//       [index.toUpperCase()]: state.info.position[index],
//       F: state.info.speed,
//       Q: state.info.acceleration,
//       wait: true,
//     }
//     if (state.info.online) {
//       window.GlobalUtil.socketCom.sendCmd(
//         'xarm_move_line',
//         {
//           data: params,
//         },
//         (response) => { console.log(`set ${index} move end step, socket res`, response); },
//       );
//     }
//     else { // offline mode
//       getReverseKinematics(state, (response) => {
//         state.info.axis = response.data.map(num => Number(num.toFixed(2))).slice();
//         console.log('get 7 angle, socket res', response);
//       });
//     }
//   },
//   // [types.MOVE_ROLL_YAW](state, data) {
//   //   // console.log('set position22:', data);
//   //   // state.info.orientation.roll += data[0];
//   //   // state.info.orientation.pitch += data[1];
//   //   const max = 180
//   //   const tempx = state.info.orientation.roll + data[0]
//   //   const tempy = state.info.orientation.yaw + data[1]
//   //   // if (tempx > max || tempx < -max) {
//   //   //   // state.status.errorCount += 1;
//   //   // }
//   //   if (tempx > max) {
//   //     state.info.orientation.roll = max;
//   //   }
//   //   else if (tempx < -max) {
//   //     state.info.orientation.roll = -max;
//   //   }
//   //   else {
//   //     state.info.orientation.roll = tempx;
//   //   }
//   //   if (tempy > max) {
//   //     state.info.orientation.yaw = max;
//   //   }
//   //   else if (tempy < -max) {
//   //     state.info.orientation.yaw = -max;
//   //   }
//   //   else {
//   //     state.info.orientation.yaw = tempy;
//   //   }
//   //   // if (tempx > max || tempx < -max) {
//   //   //   // state.status.errorCount += 1;
//   //   // }
//   //   // else {
//   //   //   state.info.orientation.roll = tempx;
//   //   // }
//   //   // if (tempy > max || tempy < -max) {
//   //   //   // state.status.errorCount += 1;
//   //   // }
//   //   // else {
//   //   //   state.info.orientation.yaw = tempy;
//   //   // }

//   //   if (state.info.online) {
//   //     window.GlobalUtil.socketCom.sendCmd(
//   //       'xarm_move_arc_line',
//   //       {
//   //         data: {
//   //           X: state.info.position.x,
//   //           Y: state.info.position.y,
//   //           Z: state.info.position.z,
//   //           A: state.info.orientation.roll,
//   //           B: state.info.orientation.yaw,
//   //           C: state.info.orientation.pitch,
//   //           F: state.info.speed,
//   //           Q: state.info.acceleration,
//   //           R: 0,
//   //         },
//   //       },
//   //       (response) => { console.log('roll yaw socket res', response); },
//   //     );
//   //   }
//   //   else { // offline mode
//   //     // if (data.position !== undefined) {
//   //     //   Object.assign(state.info.position, data.position.map(num => Number(num.toFixed(2))));
//   //     // }
//   //     // if (data.orientation !== undefined) {
//   //     //   Object.assign(state.info.orientation, data.orientation);
//   //     // }
//   //     getReverseKinematics(state, (response) => {
//   //       state.info.axis = response.data.map(num => Number(num.toFixed(2))).slice();
//   //       console.log('get 7 angle, socket res', response);
//   //     });
//   //   }
//   // },
//   // [types.MOVE_PITCH](state, data) {
//   //   // console.log('set position:', data);
//   //   // state.info.orientation.yaw += data;
//   //   const max = 180
//   //   const temp = state.info.orientation.pitch + data
//   //   if (temp > max) {
//   //     state.info.orientation.pitch = max;
//   //   }
//   //   else if (temp < -max) {
//   //     state.info.orientation.pitch = -max;
//   //   }
//   //   // if (temp > max || temp < -max) {
//   //   //   // state.status.errorCount += 1;
//   //   // }
//   //   else {
//   //     state.info.orientation.pitch = temp;
//   //   }
//   //   // console.log('pitch:', state.info.orientation.pitch)
//   //   if (state.info.online) {
//   //     window.GlobalUtil.socketCom.sendCmd(
//   //       'xarm_move_arc_line',
//   //       {
//   //         data: {
//   //           X: state.info.position.x,
//   //           Y: state.info.position.y,
//   //           Z: state.info.position.z,
//   //           A: state.info.orientation.roll,
//   //           B: state.info.orientation.yaw,
//   //           C: state.info.orientation.pitch,
//   //           F: state.info.speed,
//   //           Q: state.info.acceleration,
//   //           R: 0,
//   //         },
//   //       },
//   //       (response) => { console.log('roll yaw socket res', response); },
//   //     );
//   //   }
//   //   else { // offline mode
//   //     // if (data.position !== undefined) {
//   //     //   Object.assign(state.info.position, data.position.map(num => Number(num.toFixed(2))));
//   //     // }
//   //     // if (data.orientation !== undefined) {
//   //     //   Object.assign(state.info.orientation, data.orientation);
//   //     // }
//   //     getReverseKinematics(state, (response) => {
//   //       console.log('get 7 angle, socket res', response);
//   //       if (typeof response.data === 'object') {
//   //         state.info.axis = response.data.map(num => Number(num.toFixed(2))).slice();
//   //       }
//   //     });
//   //   }
//   // },
//   [types.MOVE_END](state, data) {
//     if (state.info.online) {
//       window.GlobalUtil.socketCom.sendCmd(
//         'xarm_move_line',
//         {
//           data: {
//             X: data.position.x,
//             Y: data.position.y,
//             Z: data.position.z,
//             A: data.orientation.roll,
//             B: data.orientation.yaw,
//             C: data.orientation.pitch,
//             F: state.info.speed,
//             Q: state.info.acceleration,
//             wait: true,
//           },
//         },
//         (response) => { console.log('roll yaw socket res', response); },
//       );
//     }
//     else { // offline mode
//       window.GlobalUtil.socketCom.sendCmd(
//         'xarm_get_ik',
//         {
//           data: {
//             X: data.position.x,
//             Y: data.position.y,
//             Z: data.position.z,
//             A: data.orientation.roll,
//             B: data.orientation.yaw,
//             C: data.orientation.pitch,
//           },
//         },
//         (response) => {
//           state.info.axis = response.data.map(num => Number(num.toFixed(2))).slice();
//           console.log('set end, socket res', response);
//         },
//       );
//     }
//   },
//   [types.GO_HOME](state) {            // reset speed and position
//     // state.info.acceleration = 500
//     // state.info.speed = 25
//     if (state.info.online) {
//       window.GlobalUtil.socketCom.sendCmd(
//         'xarm_move_gohome',
//         {
//           data: {
//             F: state.info.speed,
//             Q: state.info.acceleration,
//             wait: true,
//           },
//         },
//         (response) => { console.log('socket res', response); },
//       );
//     }
//     else {
//       state.info.axis = [0, 0, 0, 0, 0, 0, 0];
//       state.info.position = {
//         x: 201.5,
//         y: 0,
//         z: 140.5,
//       }
//       state.info.orientation = {
//         roll: -180,
//         yaw: 0,
//         pitch: 0,
//       }
//     }
//   },
//   [types.RESET_XARM_POSITION](state) {           // reset position
//     // state.info.acceleration = 500
//     // state.info.speed = 25
//     if (state.info.online) {
//       window.GlobalUtil.socketCom.sendCmd(
//         'xarm_move_gohome',
//         {
//           data: {
//             F: state.info.speed,
//             Q: state.info.acceleration,
//             wait: true,
//           },
//         },
//         (response) => { console.log('socket res', response); },
//       );
//     }
//     else {
//       state.info.axis = [0, 0, 0, 0, 0, 0, 0];
//       state.info.position = {
//         x: 201.5,
//         y: 0,
//         z: 140.5,
//       }
//       state.info.orientation = {
//         roll: -180,
//         yaw: 0,
//         pitch: 0,
//       }
//     }
//   },
//   [types.ROBOT_MOVE_JOINT](state, data) {
//     console.log('set 7 joint:', data);
//     if (state.info.online) {
//       const JOINT_LIST = ['I', 'J', 'K', 'L', 'M', 'N', 'O'];
//       const sendData = {
//         wait: true,
//       };
//       JOINT_LIST.forEach((value, index) => {
//         sendData[value] = data[index];
//       });
//       Object.assign(sendData, {
//         F: state.info.speed,
//         Q: state.info.acceleration,
//       });
//       window.GlobalUtil.socketCom.sendCmd(
//         'xarm_move_joint',
//         {
//           data: sendData,
//         },
//         (response) => { console.log('socket res', response); },
//       );
//     }
//     else {
//       state.info.axis = data.slice();
//     }
//   },
//   [types.SET_ROBOT_PARAM](state, data) {
//     state.info[data.index] = data.value;
//     if (data.index === 'speed') {
//       window.GlobalUtil.socketCom.sendCmd(
//         'xarm_set_params',
//         {
//           data: {
//             F: data.value,
//           },
//         },
//       );
//     }
//     else if (data.index === 'acceleration') {
//       window.GlobalUtil.socketCom.sendCmd(
//         'xarm_set_params',
//         {
//           data: {
//             Q: data.value,
//           },
//         },
//       );
//     }
//     else {
//       state.info[data.index] = data.value;
//     }
//     // state.info[data.index] = data.value;
//   },
//   [types.SET_ROBOT_STATE](state, data) {
//     window.GlobalUtil.socketCom.sendCmd(
//       'xarm_set_state',
//       {
//         data: {
//           state: data,
//         },
//       },
//     );
//   },
//   // [types.MOVE_ONE_JOINT](state, data) {
//   //   // console.log('set one joint:', data);
//   //   if (state.info.online) {
//   //     const JOINT_LIST = ['I', 'J', 'K', 'L', 'M', 'N', 'O'];
//   //     window.GlobalUtil.socketCom.sendCmd(
//   //       'xarm_move_joint',
//   //       {
//   //         data: {
//   //           [JOINT_LIST[data.index]]: data.value,
//   //           F: state.info.speed,
//   //           Q: state.info.acceleration,
//   //         },
//   //       },
//   //       (response) => { console.log('socket res', response); },
//   //     );
//   //   }
//   //   else { // offline mode
//   //     // state.info.axis[data.index] = Number(data.value);
//   //     Vue.set(state.info.axis, data.index, Number(data.value));
//   //   }
//   // },
//   [types.XARM_URGENT_STOP](state, data) {
//     state.status.error = data;
//     window.GlobalUtil.socketCom.sendCmd(
//       'xarm_urgent_stop',
//       {
//         data: '',
//       },
//       (response) => {
//         window.Blockly.Running = false;
//         window.GlobalUtil.model.localAppsMgr.enableRun = true;
//         const stop = response.data;
//         if (stop && (stop.length > 0)) {
//           console.log('stop', stop);
//           // console.log('state.status.errorCount', state.status.errorCount, 'state.status.error', state.status.error);
//         }
//         else {
//           console.log('urgent stop fail', response);
//         }
//       },
//     );
//   },
//   [types.DOWNLOAD_PROGRESS](state, data) {
//     state.download.progress = data.progress;
//   },
// };

// state.info = {
//   socketConnected: false,
//   // connected: false,
//   port: null,
//   serialNumber: null,
//   robotVersion: null,
//   coreVersion: null,
//   baudrate: null,
//   position: {
//     x: null,
//     y: null,
//     z: null,
//   },
//   orientation: {
//     roll: null,
//     yaw: null,
//     pitch: null,
//   },
//   axis: [0, 0, 0, 0, 0, 0, 0],
//   test: null,
//   socket: null,
//   speed: 10,
//   acceleration: 2000,
//   xarm_limit_velo: [1, 50],
//   xarm_limit_acc: [500, 5000],
//   online: false,
//   lastOnline: false,
// };

// state.intervalInfo2ArcParams = () => {
//   let cmd = 'xarm_move_arc_line';
//   let data = {
//     X: state.info.position.x,
//     Y: state.info.position.y,
//     Z: state.info.position.z,
//     A: state.info.orientation.roll,
//     B: state.info.orientation.yaw,
//     C: state.info.orientation.pitch,
//     F: state.info.speed,
//     Q: state.info.acceleration,
//     R: 0,
//   };

//   for (let i = 0; i < state.intervalInfo.curIntervals.length; i += 1) {
//     const key = state.intervalInfo.curIntervals[i];
//     switch (key) {
//       default:
//         break;
//       case 'position':
//         const degree1 = state.intervalInfo.position.degree;
//         const percent1 = state.intervalInfo.position.percent;
//         const positionX = 1; // Number((state.joystick.step.position.x).toFixed(2));
//         const positionY = 1; // Number((state.joystick.step.position.y).toFixed(2));
//         state.info.position.x += positionX;
//         state.info.position.y += positionY;
//         const max = 800
//         if (state.info.position.x > max || state.info.position.x < -max) {
//           state.status.errorCount += 1;
//           state.info.position.x -= positionX;
//         }
//         else if (state.info.position.y > max || state.info.position.y < -max) {
//           state.status.errorCount += 1;
//           state.info.position.y -= positionY;
//         }
//         break;
//       case 'orientation':
//         const degree2 = state.intervalInfo.orientation.degree;
//         const percent2 = state.intervalInfo.orientation.percent;
//       // [Number((state.joystick.step.orientation.x).toFixed(2)), Number((state.joystick.step.orientation.y).toFixed(2))]
//         const orientationX = 1; // Number((state.joystick.step.orientation.x).toFixed(2));
//         const orientationY = 1; // Number((state.joystick.step.orientation.y).toFixed(2));
//         const max2 = 180;
//         const tempx = state.info.orientation.roll + orientationX;
//         const tempy = state.info.orientation.yaw + orientationY;
//         // if (tempx > max2 || tempx < -max2) {
//         //   // state.status.errorCount += 1;
//         // }
//         if (tempx > max2) {
//           state.info.orientation.roll = max2;
//         }
//         else if (tempx < -max2) {
//           state.info.orientation.roll = -max2;
//         }
//         else {
//           state.info.orientation.roll = tempx;
//         }
//         if (tempy > max2) {
//           state.info.orientation.yaw = max2;
//         }
//         else if (tempy < -max2) {
//           state.info.orientation.yaw = -max2;
//         }
//         else {
//           state.info.orientation.yaw = tempy;
//         }
//         break;
//       case 'angle':
//         const percent3 = state.intervalInfo.angle.percent;
//         const max3 = 180;
//         const pitch = 60.0 * percent3 - 30.0; // Number(state.joystick.step.orientation.z);
//         const temp = state.info.orientation.pitch + pitch;
//         if (temp > max3) {
//           state.info.orientation.pitch = max3;
//         }
//         else if (temp < -max3) {
//           state.info.orientation.pitch = -max3;
//         }
//         // if (temp > max3 || temp < -max3) {
//         //   // state.status.errorCount += 1;
//         // }
//         else {
//           state.info.orientation.pitch = temp;
//         }
//         break;
//       case 'positionZ':
//         const percent4 = state.intervalInfo.positionZ.percent;
//         const z = percent4 * 20.0 - 10.0;
//         state.info.position.z += z;
//         break;
//     }
//   }

//   state.info.position.x = state.info.position.x || 0;
//   state.info.position.y = state.info.position.y || 0;
//   state.info.position.z = state.info.position.z || 0;
//   state.info.orientation.roll = state.info.orientation.roll || 0;
//   state.info.orientation.yaw = state.info.orientation.yaw || 0;
//   state.info.orientation.pitch = state.info.orientation.pitch || 0;
//   state.info.speed = state.info.speed || 0;
//   state.info.acceleration = state.info.acceleration || 0;

//   // offline mode
//   if (state.info.online === false) {
//     data = {
//       X: state.info.position.x,
//       Y: state.info.position.y,
//       Z: state.info.position.z,
//       A: state.info.orientation.roll,
//       B: state.info.orientation.yaw,
//       C: state.info.orientation.pitch,
//     };
//     cmd = 'xarm_get_ik';
//     // state.info.axis = response.data.map(num => Number(num.toFixed(2))).slice();
//     // getReverseKinematics(state, (response) => {
//     //   state.info.axis = response.data.map(num => Number(num.toFixed(2))).slice();
//     //   console.log('get 7 angle, socket res', response);
//     // });
//   }

//   if (cmd === 'xarm_move_arc_line') {
//   }
//   else if (cmd === 'xarm_get_ik') {
//   }

//   return { data: data, cmd: cmd };
// };

// window.GlobalUtil.model.robot = {};
// window.GlobalUtil.model.robot.state = state;

// export default { state, actions, mutations };
