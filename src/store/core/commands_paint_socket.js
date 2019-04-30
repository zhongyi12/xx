
const path = require('path')
const merge = require('webpack-merge')

const CommandsPaintSocket = {};
const self = CommandsPaintSocket;
window.CommandsPaintSocket = CommandsPaintSocket;

//
self.ROOT_DIR = '/paint';

self.sendCmd = (cmdId, data, callback) => {
  self.socketCom.sendCmd(cmdId, data, callback);
};

// self.userId = GlobalConstant.userId;

self.listProjs = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {});
  self.sendCmd(window.GlobalConstant.LIST_PAINT_PROJS, params, (dict) => {
    // console.log(`list paint projs = ${JSON.stringify(dict)}`);
    self.model.localPaintMgr.remoteProjs2Local(dict);
    if (callback) {
      callback(dict);
    }
  });
};

self.createProj = (name, proType, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    projectName: name,
    paintType: proType,
  });
  self.sendCmd(window.GlobalConstant.CREATE_PAINT_PROJ, params, () => {
    self.listProjs((dict) => {
      if (callback) {
        callback(dict, path.join('/paint', name));
      }
    });
  });
};

self.renameProj = (originName, name, callback) => {
  // const originName = self.model.localTeach.curProj.name;
  // const newProjUUID = path.join(self.ROOT_DIR, name);
  // const newname = name;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    oldName: originName, // 原文件（夹）名称
    newName: name, // 新文件（夹）名称
  });
  self.sendCmd(window.GlobalConstant.RENAME_PAINT_PROJ, params, () => {
    self.listProjs(() => {
      if (callback) {
        callback();
      }
    });
  });
};

self.delProj = (proId, callback) => {
  const filePath = proId;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    projectName: path.basename(filePath),
  });
  self.sendCmd(window.GlobalConstant.DELETE_PAINT_PROJ, params, () => {
    self.listProjs(callback);
  });
};

self.saveOrUpdateFile = (uuid, text, callback) => {
  const filePath = uuid;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    projectName: path.basename(filePath),
    paintData: text, // 文件内容
  });
  self.sendCmd(window.GlobalConstant.SAVE_PAINT_PROJ, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.getFile = (uuid, callback) => {
  const filePath = uuid;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    projectName: path.basename(filePath),
  });
  self.sendCmd(window.GlobalConstant.GET_PAINT_PROJECT, params, (dict) => {
    if (callback) {
      if (dict && dict.data) {
        dict.data = dict.data.paintData;
      }
      callback(dict);
    }
  });
};
// add by Jeffrey --- start
// self.svgToGcode = (data, callback) => {
//   const msg = {
//     cmd: 'svg_to_gcode',
//     data,
//   };
//   UArm.send_and_callback(msg, callback);
// }
self.startPrinting = (data, config, callback) => {
  // if (config.mode === '0') {
  //   config.drawing_feedrate = 500;
  // }
  // else {
  //   config.drawing_feedrate = config.speed + 50;
  // }
  const cmdList = {
    1: window.GlobalConstant.PAINT_GREYSCALE_PRINT, // 黑白
    2: window.GlobalConstant.PAINT_OUTLINE_PRINT, // 轮廓
  };
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params, {
    data,
    config,
  });
  // const params = {
  //   data,
  //   config,
  // };
  self.sendCmd(cmdList[config.canvasMode], params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
  // UArm.printing.state = true;
}
self.stopPrinting = (callback) => {
  // UArm.printing.state = false;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  console.log(`stopPrinting params = ${JSON.stringify(params)}`);
  self.sendCmd(window.GlobalConstant.PAINT_STOP_PRINT, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.getZeroConfig = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd(window.GlobalConstant.PAINT_GET_ZERO_CONFIG, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

self.setZeroHeight = (height, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();

  Object.assign(params.data, {
    X: 300,
    Y: 0,
    Z: Number(height),
    A: -180,
    B: 0,
    C: 0,
  });

  const send_zero_cmd = () => {
    self.sendCmd(window.GlobalConstant.MOVE_LINE, params, (dict) => {
      if (callback) {
        callback(dict);
      }
    });
  }

  const is_axis5_reset_1 = Math.abs(Number(self.model.robot.state.remote.orientation.roll) - 180) <= 0;
  const is_axis5_reset_2 = Math.abs(Number(self.model.robot.state.remote.orientation.pitch) - 0) <= 0;
  // const is_axis5_reset_3 = Math.abs(Number(self.model.robot.state.remote.position.x) - 300) <= 0; // 201.5
  const is_axis5_reset_4 = Math.abs(Number(self.model.robot.state.remote.position.y) - 0) <= 0;

  console.log(`set Zero Height = ${self.model.robot.state.info.xarm_axis}, is_axis5_reset_1 = ${is_axis5_reset_1}, is_axis5_reset_2 = ${is_axis5_reset_2}`)
  console.log(`set Zero Height, roll = ${self.model.robot.state.remote.orientation.roll}, pitch = ${self.model.robot.state.remote.orientation.pitch}`)

  if (self.model.robot.state.info.xarm_axis === 5 && (!is_axis5_reset_1 || !is_axis5_reset_2 /*|| !is_axis5_reset_3*/ || !is_axis5_reset_4)) {
    window.CommandsRobotSocket.goHome(true, () => {
      send_zero_cmd();
    });
  }
  else {
    send_zero_cmd();
  }
};

// add by Jeffrey --- end
export default self;
