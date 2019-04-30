
// const path = require('path')
const merge = require('webpack-merge')

const CommandsRobotSocket = {};
const self = CommandsRobotSocket;
window.CommandsRobotSocket = CommandsRobotSocket;

self.sendCmd = (cmdId, data, callback) => {
  self.socketCom.sendCmd(cmdId, data, callback);
};

self.moveArcLine = (data, isWait, callback, isControl) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    X: Number(data.position.x || 0),
    Y: Number(data.position.y || 0),
    Z: Number(data.position.z || 0),
    A: self.model.robot.state.info.xarm_axis === 5 ? 180 : Number(data.orientation.roll || 0),
    B: self.model.robot.state.info.xarm_axis === 5 ? 0 : Number(data.orientation.pitch || 0),
    C: Number(data.orientation.yaw || 0),
    // R: Number(data.radius || 0),
    R: Number(data.orientation.r || 0),
    F: Number(self.model.robot.state.local.speed || 0),
    Q: Number(self.model.robot.state.local.acceleration || 0),
    wait: isWait || data.wait,
    isControl: isControl === true ? true : false,
  });
  self.sendCmd(window.GlobalConstant.MOVE_ARC_LINE, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.setMoveArcLine = (data, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, data);
  self.sendCmd(window.GlobalConstant.SET_MOVE_ARC_LINE, params, (dict) => {
    // self.listProjs(callback);
    if (callback) {
      callback(dict);
    }
  });
}

self.urgentStop = (data, callback) => {
  self.model.robot.state.status.error = data;
  self.model.commonStatusMgr.blocklyCanUpdate = false;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd(window.GlobalConstant.URGENT_STOP, params, (response) => {
    if (data === false) {
      window.Blockly.Running = false;
      window.GlobalUtil.model.localAppsMgr.enableRun = true;
      setTimeout(() => {
        self.model.commonStatusMgr.blocklyCanUpdate = true;
      }, 500);
    }
    // window.Blockly.Running = false;
    // window.GlobalUtil.model.localAppsMgr.enableRun = true;
    // setTimeout(() => {
    //   self.model.commonStatusMgr.blocklyCanUpdate = true;
    // }, 500);
    // self.model.commonStatusMgr.blocklyCanUpdate = true;
    const stop = response.data;
    if (stop && (stop.length > 0)) {
      console.log('stop', stop);
      // console.log('state.status.errorCount', state.status.errorCount, 'state.status.error', state.status.error);
    }
    else {
      console.log('urgent stop fail', response);
    }
    if (callback) {
      callback(response);
    }
  });
};

self.setState = (state, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    state, // 0: 开启运动, 3: 暂停当前运动, 4: 停止所有运动
  });
  self.sendCmd(window.GlobalConstant.SET_STATE, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.setStateRun = (callback) => {
  self.setState(0, callback);
};

self.setStatePause = (callback) => {
  self.setState(3, callback);
};

self.setStateStop = (callback) => {
  self.setState(4, callback);
};

self.setParams = (paramKeys, callback) => {
  // "F": 0, // 速度
  // "Q": 0, // 加速度
  // "LIMIT_ACC": [min_acc, max_acc], // 加速度限制范围
  // "LIMIT_VELO": [min_velo, max_velo], // 速度限制范围
  const settingParams = {
    F: Number(self.model.robot.state.local.speed),
    Q: Number(self.model.robot.state.local.acceleration),
    F2: Number(self.model.robot.state.local.angle_speed),
    Q2: Number(self.model.robot.state.local.angle_acceleration),
  };
  // for (let i = 0; i < paramKeys.length; i += 1) {
  //   const key = paramKeys[i];
  //   switch (key) {
  //     default:
  //       break;
  //     case 'F': {
  //       Object.assign(settingParams, {
  //         F: Number(self.model.robot.state.local.speed),
  //       });
  //       break;
  //     }
  //     case 'Q': {
  //       Object.assign(settingParams, {
  //         Q: Number(self.model.robot.state.local.acceleration),
  //       })
  //       break;
  //     }
  //   }
  // }
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, settingParams);
  console.log(`set params 1 = ${JSON.stringify(params)}`);
  self.sendCmd(window.GlobalConstant.SET_PARAMS, params, (dict) => {
    console.log(`set params 2 = ${JSON.stringify(dict)}`);
    if (callback) {
      callback(dict);
    }
  });
};

self.setParamsSpeed = (callback) => {
  self.setParams(['F'], callback);
};

self.setParamsAcceleration = (callback) => {
  self.setParams(['Q'], callback);
};

self.setParamsSpeedAcceleration = (callback) => {
  self.setParams(['F', 'Q'], callback);
};

self.goHome = (wait, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    F: Number(self.model.robot.state.local.angle_speed),
    Q: Number(self.model.robot.state.local.angle_acceleration),
    wait: wait !== undefined ? wait : true,
  });
  self.sendCmd(window.GlobalConstant.MOVE_GO_HOME, params, (response) => {
    if (callback) {
      callback(response);
    }
  });
};

self.moveJoint = (positions, index, isWait, callback, isControl) => {
  const JOINT_LIST = ['I', 'J', 'K', 'L', 'M', 'N', 'O'];
  const sendData = isWait === true ? { wait: true } : {};
  if (index >= 0) {
    sendData[JOINT_LIST[index]] = Number(positions[0]);
  }
  else {
    JOINT_LIST.forEach((value, index) => {
      sendData[value] = Number(positions[index]);
    });
  }
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    F: Number(self.model.robot.state.local.angle_speed),
    Q: Number(self.model.robot.state.local.angle_acceleration),
    isControl: isControl === true ? true : false,
  });
  Object.assign(params.data, sendData);

  self.sendCmd(window.GlobalConstant.MOVE_JOINT, params, (response) => {
    if (callback) {
      callback(response);
    }
  });
};

self.moveOneJoint = (position, index, isWait, callback, isControl) => {
  self.moveJoint([position], index, isWait, callback, isControl);
};

self.moveAllJoints = (positions, isWait, callback, isControl) => {
  self.moveJoint(positions, -1, isWait, callback, isControl);
};

self.moveLine = (data, isWait, callback, isControl) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    X: Number(data.position.x || 0),
    Y: Number(data.position.y || 0),
    Z: Number(data.position.z || 0),
    A: self.model.robot.state.info.xarm_axis === 5 ? 180 : Number(data.orientation.roll || 0),
    B: self.model.robot.state.info.xarm_axis === 5 ? 0 : Number(data.orientation.pitch || 0),
    C: Number(data.orientation.yaw || 0),
    F: Number(self.model.robot.state.local.speed || 0),
    Q: Number(self.model.robot.state.local.acceleration || 0),
    wait: isWait,
    isControl: isControl === true ? true : false,
  });
  self.sendCmd(window.GlobalConstant.MOVE_LINE, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.moveLineFromLocal = (isWait, callback) => {
  const data = {};
  data.position = {};
  data.orientation = {};
  data.position.x = self.model.robot.state.local.position.x;
  data.position.y = self.model.robot.state.local.position.y;
  data.position.z = self.model.robot.state.local.position.z;
  data.orientation.roll = self.model.robot.state.local.orientation.roll;
  data.orientation.yaw = self.model.robot.state.local.orientation.yaw;
  data.orientation.pitch = self.model.robot.state.local.orientation.pitch;
  self.moveLine(data, true, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.sendCommand = (command, callback) => {
  // 发送Gcode命令
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    command: String(command),
  });
  self.sendCmd(window.GlobalConstant.SEND_COMMAND, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.setTcpJerk = (tcp_jerk, callback) => {
  // 设置笛卡尔空间平移的加加速度
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    tcp_jerk: Number(tcp_jerk),
  });
  self.sendCmd(window.GlobalConstant.SET_TCP_JERK, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.setTcpMaxAcc = (tcp_maxacc, callback) => {
  // 设置笛卡尔空间平移的最大加速度
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    tcp_maxacc: Number(tcp_maxacc),
  });
  self.sendCmd(window.GlobalConstant.SET_TCP_MAXACC, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.setJointJerk = (joint_jerk, callback) => {
  // 设置关节空间的加加速度
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    joint_jerk: Number(joint_jerk),
  });
  self.sendCmd(window.GlobalConstant.SET_JOINT_JERK, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.setJointMaxAcc = (joint_maxacc, callback) => {
  // 设置关节空间的最大加速度
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    joint_maxacc: Number(joint_maxacc),
  });
  self.sendCmd(window.GlobalConstant.SET_JOINT_MAXACC, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.setSleepTime = (sltime, callback) => {
  // 休眠
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    sltime: Number(sltime), // sleep time, second
  });
  self.sendCmd(window.GlobalConstant.SET_SLEEP_TIME, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.cleanError = (callback) => {
  // 清除错误，会重启系统，需要重新使能，设置状态
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {});
  self.sendCmd(window.GlobalConstant.CLEAN_ERROR, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.cleanWarn = (callback) => {
  // 清除警告
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {});
  self.sendCmd(window.GlobalConstant.CLEAN_WARN, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.cleanErrorWarn = (callback) => {
  // 强制清除错误（包括电机错误，0x12除外）和警告，并使能设置状态
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {});
  self.sendCmd(window.GlobalConstant.CLEAN_ERROR_WARN, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.motionEnable = (enable, servoId, callback) => {
  // 使能电机
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    servo_id: servoId === null ? servoId : Number(servoId), // 1~7, null
    enable: enable, // true/false
  });
  self.sendCmd(window.GlobalConstant.MOTION_ENABLE, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.setServoLock = (isLock, servoId, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    servo_id: servoId === null ? servoId : Number(servoId), // 1~7, null
  });
  const lockCmd = isLock === true ? window.GlobalConstant.SET_SERVO_ATTACH : window.GlobalConstant.SET_SERVO_DETACH;
  self.sendCmd(lockCmd, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.setServoDetach = (servoId, callback) => {
  // 打开抱闸
  self.setServoLock(false, servoId, callback);
}

self.setServoAttach = (servoId, callback) => {
  // 关闭抱闸
  self.setServoLock(true, servoId, callback);
}

self.shutdown = (callback) => {
  // 关机
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd(window.GlobalConstant.SHUTDOWN, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.reboot = (ip, callback) => {
  // 重启
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    setNetAddr: ip === undefined ? null : ip,
  });
  self.sendCmd(window.GlobalConstant.REBOOT, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.getNetWorkInfo = (callback) => {
  // 获取网络配置
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd(window.GlobalConstant.GET_NETWORK_INFO, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.setNetWorkInfo = (data, callback) => {
  // 设置网络配置
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, data);
  self.sendCmd(window.GlobalConstant.SET_NETWORK_INFO, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.setGripperEnable = (enable, callback) => {
  // 使能夹子
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    enable: Boolean(enable),
  });
  self.sendCmd(window.GlobalConstant.SET_GRIPPER_ENABLE, params, (dict) => {
    console.log('set gripper enable: ', JSON.stringify(dict));
    if (callback) {
      callback(dict);
    }
  });
}

self.setGripperMode = (mode, callback) => {
  // 设置夹子模式
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    mode: Number(mode),
  });
  self.sendCmd(window.GlobalConstant.SET_GRIPPER_MODE, params, (dict) => {
    console.log('set gripper mode: ', JSON.stringify(dict));
    if (callback) {
      callback(dict);
    }
  });
}

self.getGripperPosition = (callback) => {
  // 获取夹子位置
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd(window.GlobalConstant.GET_GRIPPER_POSITION, params, (dict) => {
    console.log('get gripper pos: ', JSON.stringify(dict));
    if (callback) {
      callback(dict);
    }
  });
}

self.setGripperPosition = (pos, speed, wait, callback) => {
  // 设置夹子位置
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    pos: Number(pos),
    speed: Number(speed),
    wait: Boolean(wait),
  });
  self.sendCmd(window.GlobalConstant.SET_GRIPPER_POSITION, params, (dict) => {
    console.log('set gripper pos: ', JSON.stringify(dict));
    if (callback) {
      callback(dict);
    }
  });
}

self.setGripperSpeed = (speed, callback) => {
  // 设置夹子速度
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    speed: Number(speed),
  });
  self.sendCmd(window.GlobalConstant.set_GRIPPER_SPEED, params, (dict) => {
    console.log('set gripper speed: ', JSON.stringify(dict));
    if (callback) {
      callback(dict);
    }
  });
}

self.set_servo_addr_16 = (servo_id, addr, value, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    servo_id: servo_id,
    addr: addr,
    value: value,
  });
  self.sendCmd(window.GlobalConstant.SET_SERVO_ADDR_16, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.set_servo_addr_32 = (servo_id, addr, value, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    servo_id: servo_id,
    addr: addr,
    value: value,
  });
  self.sendCmd(window.GlobalConstant.SET_SERVO_ADDR_32, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.clean_servo_error = (servo_ids, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    servo_ids: servo_ids,
  });
  self.sendCmd(window.GlobalConstant.CLEAN_SERVO_ERROR, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.set_tcp_load = (weight, center_of_gravity, save, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    weight: weight,
    center_of_gravity: center_of_gravity,
    save: save === true ? true : false,
  });
  self.sendCmd(window.GlobalConstant.SET_TCP_LOAD, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.set_collision_sensitivity = (sensitivity, save, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    sensitivity: sensitivity,
    save: save === true ? true : false,
  });
  self.sendCmd(window.GlobalConstant.SET_COLLISION_SENSITIVITY, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.set_teach_sensitivity = (sensitivity, save, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    sensitivity: sensitivity,
    save: save === true ? true : false,
  });
  self.sendCmd(window.GlobalConstant.SET_TEACH_SENSITIVITY, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.switch_mode = (mode, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    mode: mode,
  });
  self.sendCmd(window.GlobalConstant.SWITCH_MODE, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.set_tcp_offset = (offset, save, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    offset: offset,
    save: save === true ? true : false,
  });
  self.sendCmd(window.GlobalConstant.SET_TCP_OFFSET, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.save_config = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd(window.GlobalConstant.SAVE_CONFIG, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.restore_default_config = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd(window.GlobalConstant.CLEAN_CONFIG, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.set_gpio_digital = (ionum, value, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    ionum: ionum,
    value: value,
  });
  self.sendCmd(window.GlobalConstant.SET_GPIO_DIGITAL, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.get_gpio_digital = async (ionum, callback) => {
  const get_gpio_digital = (ionum) => {
    return new Promise((resolve, reject) => {
      const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
      Object.assign(params.data, {
        ionum: ionum,
      });
      self.sendCmd(window.GlobalConstant.GET_GPIO_DIGITAL, params, (dict) => {
        // console.log(`get_gpio_digital dict: ${JSON.stringify(dict)}`);
        resolve(dict);
      });
    });
  };
  let dict = await get_gpio_digital(ionum);
  window.GlobalUtil.model.robot.event.GPIOEvent.show = true;
  // console.log(`get_gpio_digital dict111: ${JSON.stringify(dict)}`);
  if (callback) {
    callback(dict);
  }
  if (dict.code !== 0) {
    return -1;
  }
  return dict.data[ionum-1];
};

self.get_gpio_analog = async (ionum, callback) => {
  const get_gpio_analog = (ionum) => {
    return new Promise((resolve, reject) => {
      const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
      Object.assign(params.data, {
        ionum: ionum,
      });
      self.sendCmd(window.GlobalConstant.GET_GPIO_ANALOG, params, (dict) => {
        // console.log(`get_gpio_analog dict: ${JSON.stringify(dict)}`);
        resolve(dict);
      });
    });
  };
  window.GlobalUtil.model.robot.event.GPIOEvent.show = true;
  let dict = await get_gpio_analog(ionum);
  // console.log(`get_gpio_analog dict111: ${JSON.stringify(dict)}`);
  if (callback) {
    callback(dict);
  }
  if (dict.code !== 0) {
    return -1;
  }
  return dict.data;
};

self.start_report_gpio_digital = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd(window.GlobalConstant.START_REPORT_GPIO_DIGITAL, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.stop_report_gpio_digital = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd(window.GlobalConstant.STOP_REPORT_GPIO_DIGITAL, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.set_gravity_direction = (direction, save, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    direction: direction,
    save: save === true ? true : false,
  });
  self.sendCmd(window.GlobalConstant.SET_GRAVITY_DIRECTION, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.moveCircle = (pose1, pose2, percent, wait, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    pose1: pose1,
    pose2: pose2,
    percent: percent,
    wait: wait === true ? true : false,
  });
  self.sendCmd(window.GlobalConstant.MOVE_CIRCLE, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.moveStep = (data, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, data);
  self.sendCmd(window.GlobalConstant.MOVE_STEP_START, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.moveStepOver = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd(window.GlobalConstant.MOVE_STEP_OVER, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.setSpeedPercent = (percent, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    percent: percent
  });
  self.sendCmd(window.GlobalConstant.SET_SPEED_PERCENT, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.setInitialPoint = (point, axis, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    point: point,
    axis: axis === undefined ? null : axis,
  });
  self.sendCmd(window.GlobalConstant.SET_INITIAL_POINT, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.setStepParam = (type, value, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    type: type,
    step: value,
  });
  self.sendCmd(window.GlobalConstant.SET_STEP_PARAM, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.setEndType = (type, install, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    type: type,
    install: install,
  });
  self.sendCmd(window.GlobalConstant.SET_END_TYPE, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.startRecording = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd('xarm_start_recording', params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.stopRecording = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd('xarm_stop_recording', params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.playRecording = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd('xarm_play_recording', params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}


export default self;
