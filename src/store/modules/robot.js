import Vue from 'vue';
import * as types from '../mutation-types';
import { join } from 'path';
import router from '../../router';

console.log('test order robot')
const xArmLang = window.location.search.includes('lang=cn') ? 'cn' : 'en';

window.Blockly.Running = false;

const state = window.GlobalUtil.model.robot.state;
const event = window.GlobalUtil.model.robot.event;
let msgInstance = null;
let confirmInstance = null;
// msgInstance.close();
const actions = {
  setError: ({ state }, value) => {
    state.status.error = value;
  },
};
const mutations = {
  test(state, data) {
    state.info.test = data;
  },
  [types.SET_GPIO_STATUS](state, data) {
    event.GPIOEvent.proceedEvent(data);
  },
  [types.SET_ROBOT_STATUS](state, data) {
    state.jointRangeMoving = true;
    state.func.reInitRangeMovingInterval(() => {
      console.log('re Init Range Moving Interval = false');
      state.jointRangeMoving = false;
      // state.jointRangeEventTouch = false;
    });
    if (state.status.connected !== data.xarm_connected) {
      if (data.xarm_connected) {
        const connetTip = window.GlobalUtil.model.language_manage.currentLang === 'en' ? 'xArm is connected' : 'xArm 已连接';
        Vue.prototype.$message({
          message: connetTip,
          duration: 1000,
        });
      }
      else {
        const disconnetTip = window.GlobalUtil.model.language_manage.currentLang === 'en' ? 'xArm is disconnect' : 'xArm 已断开';
        Vue.prototype.$message({
          message: disconnetTip,
         duration: 1000,
        });
      }
    }
    state.status.connected = data.xarm_connected;
    if (!data.xarm_connected) {
      state.local.jointLocks = [false, false, false, false, false, false, false]
    }
    // console.log(`data.xarm data.xarm = ${JSON.stringify(data)}`);

    state.info.xarm_limit_velo = [Number(data.xarm_limit_velo[0]), Number(data.xarm_limit_velo[1])];
    state.info.xarm_limit_acc = [Number(data.xarm_limit_acc[0]), Number(data.xarm_limit_acc[1])];
    state.info.xarm_limit_angle_velo = [Number(data.xarm_limit_angle_velo[0]), Number(data.xarm_limit_angle_velo[1])];
    state.info.xarm_limit_angle_acc = [Number(data.xarm_limit_angle_acc[0]), Number(data.xarm_limit_angle_acc[1])];
    state.info.xarm_is_ready = data.xarm_is_ready;
    state.info.xarm_axis = data.xarm_axis;
    state.info.xarm_mode = data.xarm_mode;
    state.info.xarm_collision_sensitivity = data.xarm_collision_sensitivity;
    state.info.xarm_teach_sensitivity = data.xarm_teach_sensitivity;
    state.info.xarm_tcp_load = data.xarm_tcp_load;
    state.info.xarm_tcp_offset = data.xarm_tcp_offset;
    state.info.xarm_gravity_direction = data.xarm_gravity_direction;
    state.info.xarm_gripper_is_enable = data.xarm_gripper_is_enable;
    state.info.xarm_end_tool_type = data.xarm_end_tool_type;
    if (data.xarm_type !== undefined) {
      if (window.GlobalConstant.COMMON_PARAMS.version !== data.xarm_type) {
        window.GlobalConstant.COMMON_PARAMS.version = data.xarm_type;
        window.GlobalUtil.model.commonStatusMgr.showAxisMsg = true;
        state.local.selectJointIndex = -1;
        router.push({ name: 'Home', params: {data: 'reload'}});
      }
      else {
        if (window.GlobalUtil.model.commonStatusMgr.showAxisMsg === true) {
          window.GlobalUtil.model.commonStatusMgr.showAxisMsg = false;
          if (window.GlobalUtil.model.commonStatusMgr.notifyInstance !== undefined && window.GlobalUtil.model.commonStatusMgr.notifyInstance !== null) {
            window.GlobalUtil.model.commonStatusMgr.notifyInstance.close();
            window.GlobalUtil.model.commonStatusMgr.notifyInstance = null;
          }
          // window.GlobalUtil.model.commonStatusMgr.notifyInstance = Vue.prototype.$message({
          //   type: 'info',
          //   showClose: true,
          //   duration: 0,
          //   message: xArmLang === 'cn' ? `当前机械臂是${state.info.xarm_axis}轴.` : `The current arm is ${state.info.xarm_axis} axes.`,
          // });
        }
      }
    }

    if (!state.status.connected) {
      if (state.info.online) {
        state.info.lastOnline = state.info.online;
      }
      state.info.online = false;
    }
    else if (state.info.lastOnline) {
      // console.log(`last_online: ${state.info.lastOnline}`);
      state.info.online = state.info.lastOnline;
      state.info.lastOnline = false;
    }
    const xArmPython = data.xarm_python;
    if (xArmPython !== undefined && xArmPython !== null) {
      window.GlobalUtil.model.ideModel.isReady = xArmPython.isRunning;
    }
    const end = data.xarm_tcp_pose;
    const joint = data.xarm_joint_pose;
    const error = data.xarm_error_code;
    const joints = joint.map(num => Number(num.toFixed(1))).slice();
    const speed = Number(data.xarm_current_velo);
    const acceleration = Number(data.xarm_current_acc);
    const angle_speed = Number(data.xarm_current_angle_velo);
    const angle_acceleration = Number(data.xarm_current_angle_acc);
    const isStop = data.xarm_state === 1;
    const jointLocks = data.xarm_mtbrake.slice(0, state.info.xarm_axis);
    if (data.xarm_state !== 1) {
      // state.isMoving = false;
      state.jointRangeMoving = false;
      state.jointRangeEventTouch = false;
      // console.log(`data.xarm_state = ${data.xarm_state}`)
    }
    if (data.config !== undefined) {
      
      if (data.config.cartesian !== undefined && data.config.cartesian.length > 0) {
        state.range.position.x.min = data.config.cartesian[0][0];
        state.range.position.x.max = data.config.cartesian[0][1];
        state.range.position.y.min = data.config.cartesian[1][0];
        state.range.position.y.max = data.config.cartesian[1][1];
        state.range.position.z.min = data.config.cartesian[2][0];
        state.range.position.z.max = data.config.cartesian[2][1];
        state.range.orientation.roll.min = data.config.cartesian[3][0];
        state.range.orientation.roll.max = data.config.cartesian[3][1];
        state.range.orientation.pitch.min = data.config.cartesian[4][0];
        state.range.orientation.pitch.max = data.config.cartesian[4][1];
        state.range.orientation.yaw.min = data.config.cartesian[5][0];
        state.range.orientation.yaw.max = data.config.cartesian[5][1];
      }
      if (data.config.joints !== undefined && data.config.joints.length > 0) {
        data.config.joints.forEach((joint, index) => {
          state.range.joint[index].min = joint[0];
          state.range.joint[index].max = joint[1];
        });
      }
      // state.range.position.x = data.config.cartesian !== undefined && data.config.cartesian.x !== undefined && data.config.cartesian.x.max !== undefined && data.config.cartesian.x.min !== undefined ? data.config.cartesian.x : state.range.position.x;
      // state.range.position.y = data.config.cartesian !== undefined && data.config.cartesian.y !== undefined && data.config.cartesian.y.max !== undefined && data.config.cartesian.y.min !== undefined ? data.config.cartesian.y : state.range.position.y;
      // state.range.position.z = data.config.cartesian !== undefined && data.config.cartesian.z !== undefined && data.config.cartesian.z.max !== undefined && data.config.cartesian.z.min !== undefined ? data.config.cartesian.z : state.range.position.z;
      // state.range.orientation.roll = data.config.cartesian !== undefined && data.config.cartesian.roll !== undefined && data.config.cartesian.roll.max !== undefined && data.config.cartesian.roll.min !== undefined ? data.config.cartesian.roll : state.range.orientation.roll;
      // state.range.orientation.yaw = data.config.cartesian !== undefined && data.config.cartesian.yaw !== undefined && data.config.cartesian.yaw.max !== undefined && data.config.cartesian.yaw.min !== undefined ? data.config.cartesian.yaw : state.range.orientation.yaw;
      // state.range.orientation.pitch = data.config.cartesian !== undefined && data.config.cartesian.pitch !== undefined && data.config.cartesian.pitch.max !== undefined && data.config.cartesian.pitch.min !== undefined ? data.config.cartesian.pitch : state.range.orientation.pitch;
      // if (data.config.joints !== undefined && data.config.joints instanceof Array && data.config.joints.length >= 7) {
      //   data.config.joints.forEach((joint, index) => {
      //     if (joint.max !== undefined && joint.min !== undefined) {
      //       state.range.joint[index] = joint;
      //     }
      //   });
      // }
    }
    const position = {
      x: Number(end[0]),
      y: Number(end[1]),
      z: Number(end[2]),
    };
    const orientation = {
      roll: Number(end[3]),
      pitch: Number(end[4]),
      yaw: Number(end[5]),
    };
    // console.log(`data 2 = ${JSON.stringify(data)}`);
    if (!end || end.length === 0) {
      console.log('data 2 end params error');
      return;
    }
    if (!joint || joint.length === 0) {
      console.log('data 2 joint params error');
      return;
    }
    // set speed
    state.remote.speed = speed;
    state.remote.acceleration = acceleration;
    state.remote.angle_speed = angle_speed;
    state.remote.angle_acceleration = angle_acceleration;
    state.remote.speedPercent = Number(data.xarm_speed_percent);
    state.remote.accPercent = Number(data.xarm_acc_percent);
    state.remote.initialPoint = data.xarm_initial_point;
    state.remote.positionStep = data.xarm_position_step;
    state.remote.attitudeStep = data.xarm_attitude_step;
    state.remote.jointStep = data.xarm_joint_step;
    // set remote
    state.remote.position = position;
    state.remote.orientation = orientation;
    state.remote.joints = joints.concat();
    if (data.xarm_last_used_position !== undefined) {
      state.remote.last_used_position = data.xarm_last_used_position;
    }
    // set local
    if (state.info.online === true) {
      state.local.joints = joints.concat();
      // state.local.speed = speed;
      // state.local.acceleration = acceleration;
    }
    // position and orientation must online
    state.local.position = position;
    state.local.orientation = orientation;
    state.status.warning = data.xarm_warn_code;
    // set is lock
    state.remote.jointLocks = jointLocks.concat();
    state.local.jointLocks = jointLocks.concat();

    const xarm_error = data.xarm_error;
    const xarm_warn = data.xarm_warn;
    let xarm_servo_error = data.xarm_servo_error;

    if (xarm_error.code != 0) {
      window.Blockly.Running = false;
      window.GlobalUtil.model.commonStatusMgr.blocklyCanUpdate = true;
      // window.GlobalUtil.model.robot.state.showSetControlValueDialog = false;
      window.GlobalUtil.model.localAppsMgr.enableRun = true;
      try {
        window.Blockly.setBlocksDeletable(true);
        window.Blockly.setBlocksEditable(true);
        window.Blockly.setBlocksMovable(true);
        window.Blockly.onBlocklyProjectStop();
      } catch (e) {}
    }

    window.GlobalUtil.model.exceptionModel.handleError(xarm_error, xarm_servo_error, data.xarm_end_tool_type === 'gripper');

    // if (xarm_error.code != 0 || xarm_warn.code != 0 || xarm_servo_error.length > 0) {
    //   console.log('xArmError11: ', xarm_error);
    //   console.log('xArmError22: ', xarm_servo_error);
    //   for (const i in xarm_servo_error) {
    //     console.log('xArmError33:', xarm_servo_error[i].code, xarm_servo_error[i].code in state.error.servo_error)
    //   }
    //   let html = '';
    //   if (xarm_warn.code != 0) {
    //     html += '<div style="margin-top: 10px;">'
    //     html += `<h2>${xArmLang === 'cn' ? '控制器警告' : 'Controller Warning'}</p2>`;
    //     html += '<div style="margin-left: 10px;color: gray;">'
    //     html += `<p>${xArmLang === 'cn' ? '警告码' : 'code'}: ${xarm_warn.code}</p>`;
    //     html += `<p style="margin-top: 3px;">${xArmLang === 'cn' ? '警告描述' : 'description'}: ${xarm_warn.desc[xArmLang]}</p>`;
    //     html += '</div>';
    //     html += '</div>';
    //   }
    //   if (xarm_error.code != 0) {
    //     html += '<div style="margin-top: 10px;">'
    //     html += `<h2>${xArmLang === 'cn' ? '控制器错误' : 'Controller Error'}</p2>`;
    //     html += '<div style="margin-left: 10px; margin-top: 5px; color: red;">'
    //     html += `<p>${xArmLang === 'cn' ? '错误码' : 'code'}: ${xarm_error.code}</p>`;
    //     html += `<p style="margin-top: 3px;">${xArmLang === 'cn' ? '错误描述' : 'desc'}: ${xarm_error.desc[xArmLang]}</p>`;
    //     html += '</div>';
    //     html += '</div>';
    //   }
    //   if (xarm_servo_error.length > 0) {
    //     html += '<div style="margin-top: 10px;">'
    //     html += `<h2>${xArmLang === 'cn' ? '电机错误' : 'Servo Error'}</p2>`;
    //     html += '<div style="margin-left: 10px; margin-top: 5px; color: red;">'
    //     for (const i in xarm_servo_error) {
    //       if (xarm_servo_error[i].code != 0 || xarm_servo_error[i].status != 0) {
    //         html += xarm_servo_error[i].servo_id != 8 ? `<p>${xArmLang === 'cn' ? '伺服' : 'Servo'} ${xarm_servo_error[i].servo_id}</p>` : `<p>${xArmLang === 'cn' ? '机械爪' : 'Gripper'}</p>`;
    //         html += '<div style="margin-left: 20px; margin-top: 5px; color: red;">';
    //         html += `<p>${xArmLang === 'cn' ? '错误码' : 'code'}: 0x${xarm_servo_error[i].code.toString(16)} (${xarm_servo_error[i].code}), ${xArmLang === 'cn' ? '状态' : 'status'}: ${xarm_servo_error[i].status}</p>`;
    //         html += `<p style="margin-top: 3px;">${xArmLang === 'cn' ? '错误描述' : 'desc'}: ${xarm_servo_error[i].desc[xArmLang]}</p>`;
    //         html += '</div>';
    //       }
    //     }
    //     html += '</div>';
    //     html += '</div>';
    //   }
    //   if (msgInstance !== null) {
    //     msgInstance.close();
    //   }
    //   if (data.xarm_connected) {
    //     msgInstance = Vue.prototype.$message({
    //       dangerouslyUseHTMLString: true,
    //       duration: 0,
    //       type: 'info',
    //       showClose: true,
    //       message: html
    //     });
    //   }
    //   // if (xarm_servo_error.length > 0) {
    //   //   let servo_html = '<div>'
    //   //   const servo_ids = [];
    //   //   for (const i in xarm_servo_error) {
    //   //     if (xarm_servo_error[i].code != 0 || xarm_servo_error[i].state != 0) {
    //   //       servo_html += xarm_servo_error[i].servo_id != 8 ? `<p>伺服${xarm_servo_error[i].servo_id}</p>` : `<p>机械爪：</p>`;
    //   //       servo_html += '<div style="margin-left: 10px; margin-top: 5px; color: red;">';
    //   //       servo_html += `<p>错误码: ${xarm_servo_error[i].code}, 状态: ${xarm_servo_error[i].state}</p>`;
    //   //       servo_html += `<p style="margin-top: 3px;">错误描述: ${xarm_servo_error[i].desc}</p>`;
    //   //       servo_html += '</div>';
    //   //       servo_ids.push(xarm_servo_error[i].servo_id);
    //   //       // if (xarm_servo_error[i].servo_id != 8 ) {
    //   //       //   servo_ids.push(xarm_servo_error[i].servo_id);
    //   //       // }
    //   //     }
    //   //   }
    //   //   servo_html += '</div>';
    //   //   // html += '</div>';
    //   //   Vue.prototype.$confirm(servo_html, '电机错误', {
    //   //     dangerouslyUseHTMLString: true,
    //   //     type: 'warning',
    //   //     showClose: true,
    //   //     confirmButtonText: '清除错误',
    //   //     cancelButtonText: '取消',
    //   //   })
    //   //   .then(() => {
    //   //     // xarm_servo_error = [];
    //   //     window.CommandsRobotSocket.clean_servo_error(servo_ids, (response) => {
    //   //     });
    //   //   })
    //   //   .catch(() => {
    //   //     html += '<div style="color: red;">电机错误未清除</div>';
    //   //     if (msgInstance !== null) {
    //   //       msgInstance.close();
    //   //     }
    //   //     msgInstance = Vue.prototype.$message({
    //   //       dangerouslyUseHTMLString: true,
    //   //       duration: 0,
    //   //       type: 'info',
    //   //       showClose: true,
    //   //       message: html
    //   //     });
    //   //   });
    //   // }
    // }
    // else if (state.error.xarm_error.code != 0 || state.error.xarm_warn.code != 0 || state.error.xarm_servo_error.length > 0){
    //   if (msgInstance !== null) {
    //     msgInstance.close();
    //   }
    //   msgInstance = Vue.prototype.$message({
    //     type: 'info',
    //     showClose: true,
    //     duration: 3000,
    //     // message: '所有警告和错误已清除',
    //     message: xArmLang === 'cn' ? '所有警告和错误已清除' : 'All warnings and errors have been cleared',
    //   });
    // }
    state.error.xarm_error = xarm_error;
    state.error.xarm_warn = xarm_warn;
    state.error.xarm_servo_error = xarm_servo_error;
    state.status.connected = data.xarm_connected;
    state.status.printed = data.xarm_printed;
    state.status.paused = data.xarm_paused;
    if (!data.xarm_connected) {
      state.local.jointLocks = [false, false, false, false, false, false, false]
    }

    if (error && (error > 0)) {
      const ERROR_LIST = {
        1: 'UX2_ERR_CODE',
        2: 'UX2_WAR_CODE',
        3: 'UX2_ERR_TOUT',
        4: 'UX2_ERR_LENG',
        5: 'UX2_ERR_OTHER',
        1000: 'Exception',
      };
      if (ERROR_LIST[error] !== undefined) {
        state.status.error = ERROR_LIST[error];
      }
      else {
        state.status.error = 'unknow error';
      }
    }
    else {
      state.status.connected = data.xarm_connected;
      state.status.printed = data.xarm_printed;
      state.status.paused = data.xarm_paused;
      if (!data.xarm_connected) {
        state.local.jointLocks = [false, false, false, false, false, false, false]
      }
    }
  },
  // [types.MOVE_END_STEP](state, data) {
  //   console.log('set position:', data);
  //   const index = Object.keys(data)[0]
  //   const value = Number(data[index])
  //   state.local.position[index] += value;
  //   const params = {
  //     [index.toUpperCase()]: state.local.position[index],
  //     F: Number(state.local.speed),
  //     Q: Number(state.local.acceleration),
  //     wait: true,
  //   }
  //   if (state.info.online) {
  //     window.GlobalUtil.socketCom.sendCmd(
  //       'xarm_move_line',
  //       {
  //         data: params,
  //       },
  //       (response) => { console.log(`set ${index} move end step, socket res`, response); },
  //     );
  //   }
  // },
  // [types.ROBOT_MOVE_JOINT](state, data) {
  //   console.log('set 7 joint:', data);
  //   if (state.info.online) {
  //     window.CommandsRobotSocket.moveAllJoints(data, true, (response) => {
  //       console.log('socket res', response);
  //     });
  //     // const JOINT_LIST = ['I', 'J', 'K', 'L', 'M', 'N', 'O'];
  //     // const sendData = {
  //     //   wait: true,
  //     // };
  //     // JOINT_LIST.forEach((value, index) => {
  //     //   sendData[value] = data[index];
  //     // });
  //     // Object.assign(sendData, {
  //     //   F: Number(state.local.speed),
  //     //   Q: Number(state.local.acceleration),
  //     // });
  //     // window.GlobalUtil.socketCom.sendCmd(
  //     //   'xarm_move_joint',
  //     //   {
  //     //     data: sendData,
  //     //   },
  //     //   (response) => { console.log('socket res', response); },
  //     // );
  //   }
  //   else {
  //     // state.info.axis = data.slice();
  //     state.local.joints = data.slice();
  //   }
  // },
};

export default { state, actions, mutations };
