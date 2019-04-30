const ExceptionModel = {};
const self = ExceptionModel;

const xArmLang = window.location.search.includes('lang=cn') ? 'cn' : 'en';

self.ControllerError = {
  10: {
    en: {
      title: 'Servo motor error',
      desc: ''
    },
    cn: {
      title: '伺服电机报错',
      desc: ''
    }
  },
  11: {
    en: {
      title: 'Servo motor 1 error',
      desc: ''
    },
    cn: {
      title: '伺服电机1报错',
      desc: ''
    }
  },
  12: {
    en: {
      title: 'Servo motor 2 error',
      desc: ''
    },
    cn: {
      title: '伺服电机2报错',
      desc: ''
    }
  },
  13: {
    en: {
      title: 'Servo motor 3 error',
      desc: ''
    },
    cn: {
      title: '伺服电机3报错',
      desc: ''
    }
  },
  14: {
    en: {
      title: 'Servo motor 4 error',
      desc: ''
    },
    cn: {
      title: '伺服电机4报错',
      desc: ''
    }
  },
  15: {
    en: {
      title: 'Servo motor 5 error',
      desc: ''
    },
    cn: {
      title: '伺服电机5报错',
      desc: ''
    }
  },
  16: {
    en: {
      title: 'Servo motor 6 error',
      desc: ''
    },
    cn: {
      title: '伺服电机6报错',
      desc: ''
    }
  },
  17: {
    en: {
      title: 'Servo motor 7 error',
      desc: ''
    },
    cn: {
      title: '伺服电机7报错',
      desc: ''
    }
  },
  21: {
    en: {
      title: 'Kinematic Error',
      desc: 'Please re-plan the path.'
    },
    cn: {
      title: '运动学错误',
      desc: '请重新规划路径。'
    }
  },
  22: {
    en: {
      title: 'Collision Error',
      desc: 'Please click the "ZERO" button to return to the zero pozition.'
    },
    cn: {
      title: '自碰撞错误',
      desc: '请点击”零点“按钮回到关节零点。'
    }
  },
  23: {
    en: {
      title: 'Joints Angle Exceed Limit',
      desc: 'Please click the "ZERO" button to return to the zero pozition.'
    },
    cn: {
      title: '关节角度超出限制',
      desc: '请点击”零点“按钮回到关节零点。'
    }
  },
  24: {
    en: {
      title: 'Speed Exceeds Limit',
      desc: 'Please reduce the speed and acceleration values.'
    },
    cn: {
      title: '速度超出限制',
      desc: '请减小运动速度和加速度值。'
    }
  },
  25: {
    en: {
      title: 'Planning Error',
      desc: 'Please re-plan the path or reduce the speed.'
    },
    cn: {
      title: '规划错误',
      desc: '请重新规划路径或者减小运动速度。'
    }
  },
  26: {
    en: {
      title: 'Linux RT Error',
      desc: 'Please contact technical support.'
    },
    cn: {
      title: 'Linux RT 错误',
      desc: '请联系技术支持。'
    }
  },
  27: {
    en: {
      title: 'Command Reply Error',
      desc: 'Pleas retry, or restart the xArm with the Emergency Stop Button on the xArm Controller. If multiple reboots are not working, please contact technical support.'
    },
    cn: {
      title: '回复指令错误 ',
      desc: '请重试，或通过控制器上的紧急停止按钮重启机械臂。如多次重启无效，请联系技术支持。'
    }
  },
  28: {
    en: {
      title: 'Gripper error',
      desc: ''
    },
    cn: {
      title: '机械爪错误',
      desc: ''
    }
  },
  29: {
    en: {
      title: 'Other Errors',
      desc: 'Please contact technical support.'
    },
    cn: {
      title: '其他错误',
      desc: '请联系技术支持'
    }
  },
  30: {
    en: {
      title: 'Teach Mode Current Abnormality',
      desc: 'Please check for collisions, check that the payload settings are correct, and that the collision sensitivity matches the speed.'
    },
    cn: {
      title: '示教模式电流异常',
      desc: '请检查是否碰撞、负载设置是否正确，示教灵敏度与速度是否匹配。'
    }
  },
  31: {
    en: {
      title: 'Collision Caused Abnormal Current',
      desc: 'Please check for collisions, check that the payload settings are correct, and that the collision sensitivity matches the speed.'
    },
    cn: {
      title: '碰撞导致电流异常',
      desc: '请检查是否碰撞、负载设置是否正确，碰撞灵敏度与速度是否匹配。'
    }
  }
}

self.ServoError = {
  0x0A: {
    en: {
      title: 'Current Detection Error',
      desc: 'Please restart the xArm with the Emergency Stop Button on the xArm Controller. If multiple reboots are not working, please contact technical support.',
    },
    cn: {
      title: '电流检测异常',
      desc: '请通过控制器上的紧急停止按钮重启机械臂。如多次重启无效，请联系技术支持。',
    }
  },
  0x0B: {
    en: {
      title: 'Joint Current Overlimit',
      desc: 'Please restart the xArm with the Emergency Stop Button on the xArm Controller. If multiple reboots are not working, please contact technical support.',
    },
    cn: {
      title: '关节电流过大',
      desc: '请通过控制器上的紧急停止按钮重启机械臂。如多次重启无效，请联系技术支持。',
    }
  },
  0x0C: {
    en: {
      title: 'Joint Speed Overlimit',
      desc: 'Please restart the xArm with the Emergency Stop Button on the xArm Controller. If multiple reboots are not working, please contact technical support.',
    },
    cn: {
      title: '关节速度过大',
      desc: '请通过控制器上的紧急停止按钮重启机械臂。如多次重启无效，请联系技术支持。',
    }
  },
  0x0E: {
    en: {
      title: 'Position Command Overlimit',
      desc: 'Please restart the xArm with the Emergency Stop Button on the xArm Controller. If multiple reboots are not working, please contact technical support.',
    },
    cn: {
      title: '位置指令过大',
      desc: '请通过控制器上的紧急停止按钮重启机械臂。如多次重启无效，请联系技术支持。',
    }
  },
  0x0F: {
    en: {
      title: 'Joints Overheat',
      desc: 'If the robot arm is running for a long time, please stop running and restart the xArm after it\'s cool down. If multiple reboots are not working, please contact technical support.',
    },
    cn: {
      title: '关节过热',
      desc: '如果机械臂长时间运行温度过高，请停并机冷却后重启机械臂。如多次重启无效，请联系技术支持。',
    }
  },
  0x10: {
    en: {
      title: 'Encoder Initialization Error',
      desc: 'Please ensure that there is no external force to push the robotic arm when the  it\'s energized. Please restart the xArm with the Emergency Stop Button on the xArm Controller. If multiple reboots are not working, please contact technical support.',
    },
    cn: {
      title: '编码器初始化异常',
      desc: '请确保机械臂通电时，无外力推动机械臂运动。请通过控制器上的紧急停止按钮重启机械臂，如多次重启无效，请联系技术支持。',
    }
  },
  0x11: {
    en: {
      title: 'Single Ring Encoder Error',
      desc: 'Please re-enable the robot.',
    },
    cn: {
      title: '单圈编码器故障',
      desc: '请重新使能机械臂。',
    }
  },
  0x12: {
    en: {
      title: 'Multi-turn Encoder Error ',
      desc: 'Please contact technical support.',
    },
    cn: {
      title: '多圈编码器故障',
      desc: '请联系技术支持。',
    }
  },
  0x13: {
    en: {
      title: 'Low Battery Voltage',
      desc: 'Please contact technical support.',
    },
    cn: {
      title: '电池电压过低',
      desc: '请联系技术支持。',
    }
  },
  0x14: {
    en: {
      title: 'Driver IC Hardware Error',
      desc: 'Please re-enable the robot. If it appears frequently, please contact technical support.',
    },
    cn: {
      title: '驱动IC硬件异常',
      desc: '请重新使能机械臂。如频繁出现，请联系技术支持。',
    }
  },
  0x15: {
    en: {
      title: 'Driver IC Initialization Error',
      desc: 'Please restart the xArm with the Emergency Stop Button on the xArm Controller. If multiple reboots are not working, please contact technical support.If multiple reboots are invalid, please contact technical support.',
    },
    cn: {
      title: '驱动IC初始化异常',
      desc: '请通过控制器上的紧急停止按钮重启机械臂，如多次重启无效，请联系技术支持。',
    }
  },
  0x16: {
    en: {
      title: 'Encoder Configuration Error',
      desc: 'Please contact technical support.',
    },
    cn: {
      title: '编码器配置错误',
      desc: '请联系技术支持。',
    }
  },
  0x17: {
    en: {
      title: 'Large Motor Position Deviation',
      desc: 'Please check whether the xArm movement is blocked, whether the payload exceeds the rated payload of xArm, and whether the acceleration value is too large. If it appears frequently, please contact technical support.',
    },
    cn: {
      title: '电机位置偏差过大',
      desc: '请检查机械臂运动是否受阻，末端负载是否超过机械臂额定负载，机械臂加速度值是否设置过大。如频繁出现，请联系技术支持。',
    }
  },
  0x1A: {
    en: {
      title: 'Joint N Positive Overrun',
      desc: 'Please check if angle value of the joint N is too large.',
    },
    cn: {
      title: '第N关节正向超限',
      desc: '请检测N关节角度值是否设置过大。',
    }
  },
  0x1B: {
    en: {
      title: 'Joint N Negative Overrun',
      desc: 'Please check if the angle value of  joint N is too large, if so, please click Clear Error and manually unlock the joint and rotate the joint to the allowed range of motion.',
    },
    cn: {
      title: '第N关节负向超限',
      desc: '请检测第N关节角度值是否设置过大，如果是，请点击清除报错后，手动解锁该关节并转动该关节至其运动范围内。',
    }
  },
  0x1C: {
    en: {
      title: 'Joint Commands Error',
      desc: 'The xArm is not enabled, please click Enable Robot.',
    },
    cn: {
      title: '关节指令错误',
      desc: '机械臂未使能,请点击“使能机械臂”。',
    }
  },
  0x21: {
    en: {
      title: 'Drive Overloaded',
      desc: 'Please make sure the payload is within the rated load.',
    },
    cn: {
      title: '驱动器过载',
      desc: '请确保机械臂负载处于额定负载内。',
    }
  },
  0x22: {
    en: {
      title: 'Motor Overload',
      desc: 'Please make sure the payload is within the rated load.',
    },
    cn: {
      title: '电机过载',
      desc: '请确保机械臂负载处于额定负载内。',
    }
  },
  0x23: {
    en: {
      title: 'Motor Type Error',
      desc: 'Please restart the xArm with the Emergency Stop Button on the xArm Controller. If multiple reboots are not working, please contact technical support.',
    },
    cn: {
      title: '电机类型错误',
      desc: '请通过控制器上的紧急停止按钮重启机械臂。如多次重启无效，请联系技术支持。',
    }
  },
  0x24: {
    en: {
      title: 'Driver Type Error',
      desc: 'Please restart the xArm with the Emergency Stop Button on the xArm Controller. If multiple reboots are not working, please contact technical support.',
    },
    cn: {
      title: '驱动器类型错误',
      desc: '请通过控制器上的紧急停止按钮重启机械臂。如多次重启无效，请联系技术支持。',
    }
  },
  0x27: {
    en: {
      title: 'Joint Voltage Overload',
      desc: 'Please reduce the acceleration value in the Motion Settings.',
    },
    cn: {
      title: '关节过压',
      desc: '请在运动设置中减少加速度值。',
    }
  },
  0x28: {
    en: {
      title: 'Joint Voltage Insufficient',
      desc: 'Please reduce the acceleration value in the Motion Settings.',
    },
    cn: {
      title: '关节欠压',
      desc: '请在运动设置中减少加速度值。',
    }
  },
  0x31: {
    en: {
      title: 'EEPROM Read and Write Error.',
      desc: 'Please restart the xArm with the Emergency Stop Button on the xArm Controller. If multiple reboots are not working, please contact technical support.',
    },
    cn: {
      title: 'EEPROM读写错误',
      desc: '请通过控制器上的紧急停止按钮重启机械臂。如多次重启无效，请联系技术支持。',
    }
  },
  0x34: {
    en: {
      title: 'Motor Angle Initialization Error',
      desc: 'Please restart the xArm with the Emergency Stop Button on the xArm Controller. If multiple reboots are not working, please contact technical support.',
    },
    cn: {
      title: '电机角度初始化失败',
      desc: '请通过控制器上的紧急停止按钮重启机械臂。如多次重启无效，请联系技术支持。',
    }
  },
  failed: {
    en: {
      title: 'Joint Communication failure',
      desc: '请通过控制器上的紧急停止按钮重启机械臂。如多次重启无效，请联系技术支持。',
    },
    cn: {
      title: '关节通信失败',
      desc: '请通过控制器上的紧急停止按钮重启机械臂。如多次重启无效，请联系技术支持。',
    }
  }
}


self.GripperError = {
  0x09: {
    en: {
      title: 'Gripper Current Detection Error',
      desc: 'Please restart the xArm with the Emergency Stop Button on the xArm Controller. If multiple reboots are not working, please contact technical support.',
    },
    cn: {
      title: '机械爪电流检测异常',
      desc: '请通过控制器上的紧急停止按钮重启机械臂。如多次重启无效，请联系技术支持。',
    }
  },
  0x0B: {
    en: {
      title: 'Gripper Current Overlimit',
      desc: 'Please click “OK” to re-enable the Gripper. If it reports the same error repeatedly, please contact technical support.',
    },
    cn: {
      title: '机械爪电流过大',
      desc: '请点击“确认”重新使能机械爪。如反复报错，请联系技术支持。',
    }
  },
  0x0C: {
    en: {
      title: 'Gripper Speed Overlimit',
      desc: 'Please click “OK” to re-enable the Gripper. If it reports the same error repeatedly, please contact technical support.',
    },
    cn: {
      title: '机械爪速度过大',
      desc: '请点击“确认”重新使能机械爪。如反复报错，请联系技术支持。',
    }
  },
  0x0E: {
    en: {
      title: 'Gripper Position Command Overlimit',
      desc: 'Please click “OK” to re-enable the Gripper. If it reports the same error repeatedly, please contact technical support.',
    },
    cn: {
      title: '机械爪位置指令过大',
      desc: '请点击“确认”重新使能机械爪。如反复报错，请联系技术支持。',
    }
  },
  0x0F: {
    en: {
      title: 'Gripper EEPROM Read and Write Error',
      desc: 'Please click “OK” to re-enable the Gripper. If it reports the same error repeatedly, please contact technical support.',
    },
    cn: {
      title: '机械爪EEPROM读写错误',
      desc: '请点击“确认”重新使能机械爪。如反复报错，请联系技术支持。',
    }
  },
  0x14: {
    en: {
      title: 'Gripper Driver IC Hardware Error',
      desc: 'Please click “OK” to re-enable the Gripper. If it reports the same error repeatedly, please contact technical support.',
    },
    cn: {
      title: '机械爪驱动IC硬件异常',
      desc: '请点击“确认”重新使能机械爪。如反复报错，请联系技术支持。',
    }
  },
  0x15: {
    en: {
      title: 'Gripper Driver IC Initialization Error',
      desc: 'Please click “OK” to re-enable the Gripper. If it reports the same error repeatedly, please contact technical support.',
    },
    cn: {
      title: '机械爪驱动IC初始化异常',
      desc: '请点击“确认”重新使能机械爪。如反复报错，请联系技术支持。',
    }
  },
  0x17: {
    en: {
      title: 'Gripper Large Motor Position Deviation',
      desc: 'Please check if the movement of the Gripper is blocked, if not, please click “OK” to re-enable the Gripper. If it reports the same error repeatedly, please contact technical support.',
    },
    cn: {
      title: '机械爪电机位置偏差过大',
      desc: '请检查机械爪运动是否受阻，如机械爪运动未受阻，请点击“确认”重新使能机械爪。如频繁出现，请联系技术支持。',
    }
  },
  0X19: {
    en: {
      title: 'Gripper Command Over Software Limit',
      desc: 'Please check if the gripper command is set beyond the software limit. If it reports the same error repeatedly, please contact technical support.',
    },
    cn: {
      title: '机械爪指令超软件限位',
      desc: '请检测机械爪指令是否设置超出软件限制。如频繁出现，请联系技术支持。',
    }
  },
  0X1A: {
    en: {
      title: 'Gripper Feedback Position Software Limit',
      desc: 'Please contact technical support.',
    },
    cn: {
      title: '机械爪反馈位置超限软件限位',
      desc: '请联系技术支持。',
    }
  },
  0x21: {
    en: {
      title: 'Gripper Drive Overloaded',
      desc: 'Please contact technical support.',
    },
    cn: {
      title: '机械爪驱动器过载',
      desc: '请联系技术支持。',
    }
  },

  0x22: {
    en: {
      title: 'Gripper Motor Overload',
      desc: 'Please contact technical support.',
    },
    cn: {
      title: '机械爪电机过载',
      desc: '请联系技术支持。',
    }
  },
  0x24: {
    en: {
      title: 'Gripper Driver Type Error',
      desc: 'Please click “OK” to re-enable the Gripper. If it reports the same error repeatedly, please contact technical support.',
    },
    cn: {
      title: '机械爪驱动器类型错误',
      desc: '请点击“确认”重新使能机械爪。如频繁出现，请联系技术支持。',
    }
  },
  failed: {
    en: {
      title: 'Gripper Communication failure',
      desc: 'Please confirm that the mechanical grip is properly installed, or cancel the installation of the mechanical claws on the software.',
    },
    cn: {
      title: '机械爪通信失败',
      desc: '请确认机械爪正确安装，或在软件上取消机械爪的安装',
    }
  }
}

self.showErrorDialog = false;
self.errorDialogTitle = '';
self.errorDialogDesc = '';
self.errorButton = xArmLang === 'cn' ? '关闭' : 'Close';
self.errorHandle = null;
self.errors = [];
self.errorObj = {};
// self.errorObj = {
//   controller: {
//     code: 0x23,
//     title: '控制器错误测试标题',
//     desc: '控制器错误测试详情'
//   },
//   gripper: {
//     code: 0x19,
//     title: '机械爪错误测试标题',
//     desc: '机械爪错误测试详情'
//   },
//   servo: [{
//     code: 0x17,
//     title: '伺服错误测试标题111',
//     desc: '伺服错误测试详情1111',
//     ids: [1, 2]
//   }, {
//     code: 0x22,
//     title: '伺服错误测试标题222',
//     desc: '伺服错误测试详情222',
//     ids: [6]
//   }]
// };


self.handleError = (xarm_error, xarm_servo_error, isGripper) => {
  if (xarm_error.code !== 0 || xarm_servo_error.length > 0) {
    const failedList = [];
    const servoError = {};
    const controllerError = {};
    const gripperError = {};

    if (xarm_servo_error.length > 0) {
      for (const i in xarm_servo_error) {
        if (xarm_servo_error[i].code != 0 || xarm_servo_error[i].status != 0) {
          if (xarm_servo_error[i].status === 3) {
            if (xarm_servo_error[i].servo_id === 8 && !isGripper) {
              continue
            }
            failedList.push(xarm_servo_error[i].servo_id);
          }
          else {
            if (xarm_servo_error[i].servo_id !== 8) {
              if (!(xarm_servo_error[i].code in servoError)) {
                servoError[xarm_servo_error[i].code] = [];
              }
              if (!(xarm_servo_error[i].servo_id in servoError[xarm_servo_error[i].code])) {
                servoError[xarm_servo_error[i].code].push(xarm_servo_error[i].servo_id);
              }
            }
            else {
              gripperError.code = xarm_servo_error[i].code;
              gripperError.ids = [];
              if (Number(xarm_servo_error[i].code) in self.GripperError) {
                gripperError.title = self.GripperError[xarm_servo_error[i].code][xArmLang].title;
                gripperError.desc = self.GripperError[xarm_servo_error[i].code][xArmLang].desc;
              }
              else {
                gripperError.title = '';
                gripperError.desc = '';
              }
            }
          }
        }
      }
    }
    if (xarm_error.code != 0) {
      if (Number(xarm_error.code) in self.ControllerError) {
        controllerError.title = self.ControllerError[xarm_error.code][xArmLang].title;
        controllerError.desc = self.ControllerError[xarm_error.code][xArmLang].desc;
      }
      else {
        controllerError.title = '';
        controllerError.desc = '';
      }
      controllerError.code = xarm_error.code;
      controllerError.ids = [];

      // if (xarm_error.code in self.ControllerError) {
      //   errorTitleList.push(self.ControllerError[xarm_error.code][xArmLang].title);
      //   errorDescList.push(self.ControllerError[xarm_error.code][xArmLang].desc);
      // }
    }

    const errors = [];
    const errorObj = {};

    self.errorButton = xArmLang === 'cn' ? '关闭' : 'Close';
    self.errorHandle = null;
    if (JSON.stringify(controllerError) !== '{}') {
      // errors.push(controllerError);
      errorObj.controller = controllerError;
    }
    if (JSON.stringify(gripperError) !== '{}') {
      self.errorButton = xArmLang === 'cn' ? '使能机械臂' : 'Enable Robot';
      self.errorHandle = () => {
        window.CommandsRobotSocket.cleanErrorWarn();
      }
      // errors.push(gripperError);
      errorObj.gripper = gripperError;
      if ([0x09, 0x19, 0x1A, 0x21, 0x22].includes(Number(gripperError.code))) {
        self.errorButton = xArmLang === 'cn' ? '关闭' : 'Close';
        self.errorHandle = null;
      }
    }

    errorObj.servo = [];

    if (failedList.length > 0) {
      // errors.push({
      //   code: 0,
      //   ids: failedList,
      //   title: xArmLang === 'cn' ? '通信失败' : 'Communication failure',
      //   desc: xArmLang === 'cn' ? '请检查各模块的连接情况，并重新使能' : 'Please check the connection of each module and re-enable it.S',
      // })
      errorObj.servo.push({
        code: 0,
        ids: failedList,
        title: xArmLang === 'cn' ? '通信失败' : 'Communication failure',
        desc: xArmLang === 'cn' ? '请检查各模块的连接情况，并重新使能' : 'Please check the connection of each module and re-enable it.S',
      })
      self.errorButton = xArmLang === 'cn' ? '使能机械臂' : 'Enable Robot';
      self.errorHandle = () => {
        window.CommandsRobotSocket.cleanErrorWarn();
      }
    }

    if (JSON.stringify(servoError) !== '{}') {
      self.errorButton = xArmLang === 'cn' ? '关闭' : 'Close';
      self.errorHandle = null;
      Object.keys(servoError).forEach((key) => {
        if ([0x11, 0x14, 0x17, 0x1A, 0x1B, 0x1C, 0x21, 0x22, 0x27, 0x28].includes(Number(key))) {
          self.errorButton = xArmLang === 'cn' ? '使能机械臂' : 'Enable Robot';
          self.errorHandle = () => {
            window.CommandsRobotSocket.cleanErrorWarn();
          }
        }
        // errors.push({
        //   code: key,
        //   ids: servoError[key],
        //   title: self.ServoError[key][xArmLang].title,
        //   desc: self.ServoError[key][xArmLang].desc
        // })
        if (Number(key) in self.ServoError) {
          errorObj.servo.push({
            code: key,
            ids: servoError[key],
            title: self.ServoError[key][xArmLang].title,
            desc: self.ServoError[key][xArmLang].desc
          })
        }
        else {
          errorObj.servo.push({
            code: key,
            ids: servoError[key],
            title: '',
            desc: ''
          })
        }
      });
    }
    // console.log('errorHandle:', errors);
    // if (JSON.stringify(self.errors) !== JSON.stringify(errors)) {
    //   self.errors = errors;
    //   self.showErrorDialog = true;
    // }

    // console.log('errorHandle:', errorObj);
    if (JSON.stringify(self.errorObj) !== JSON.stringify(errorObj)) {
      self.errorObj = errorObj;
      self.showErrorDialog = true;
    }
  }
  else if (window.GlobalUtil.model.robot.state.error.xarm_error.code != 0 || window.GlobalUtil.model.robot.state.error.xarm_servo_error.length > 0){
    self.showErrorDialog = false;
    self.errorDialogTitle = '';
    self.errorDialogDesc = '';
    self.errorHandle = null;
    self.errors = [];
    self.errorObj = {};
  }
}



export default self;
