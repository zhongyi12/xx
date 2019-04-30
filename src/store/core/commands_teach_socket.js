
const path = require('path')
const merge = require('webpack-merge')

const CommandsTeachSocket = {};
const self = CommandsTeachSocket;
window.CommandsTeachSocket = CommandsTeachSocket;

// self.VERSION = GlobalConstant.VERSION;

//
self.ROOT_DIR = '/teach';

self.sendCmd = (cmdId, data, callback) => {
  self.socketCom.sendCmd(cmdId, data, callback);
};

// self.userId = GlobalConstant.userId;

// self.listProjs = (callback) => {
//   const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
//   Object.assign(params.data, {
//     root: self.ROOT_DIR, // 要获取的目录
//     type: 'detail', // simple: 仅获取当前目录，不包括子目录 detail:包括子目录
//   });
//   self.sendCmd(window.GlobalConstant.FILE_ID_LIST_DIR, params, (dict) => {
//     self.model.localTeach.remoteProjs2Local(dict);
//     if (callback) {
//       callback(dict);
//     }
//   });
// };

self.listProjs = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
  });
  self.sendCmd(window.GlobalConstant.LIST_RECORD_PROJS, params, (dict) => {
    console.log(`listProjs dict = ${JSON.stringify(dict)}`);
    self.model.localTeach.remoteProjs2Local(dict);
    if (callback) {
      callback(dict);
    }
  });
};

self.createProj = (name, recordType, callback) => {
  recordType = 'discontinuous';
  const filePath = path.join(self.ROOT_DIR, name);
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    projectName: name,
    recordType: recordType,
  });
  self.sendCmd(window.GlobalConstant.CREATE_RECORD_PROJ, params, (dict) => {
    if (dict.code === 0) {
      console.log(`create proj end = ${JSON.stringify(dict)}`);
      // const curProjUUID = self.model.localTeach.curProj.uuid;
      // console.log(`create proj end curProjUUID = ${curProjUUID}`);
      // const newProjUUID = path.join(path.dirname(curProjUUID), name);
      // console.log(`create proj end newProjUUID = ${newProjUUID}`);
      const newFileUUID = path.join(`/record/${name}`, 'single');
      console.log(`create proj end newFileUUID = ${newFileUUID}`);
      const curProjUUID = path.dirname(newFileUUID) // self.model.localTeach.curProj.uuid;
      self.model.localTeach.curProj.uuid = curProjUUID;
      self.model.localTeach.curProjExpandedKeys = [];
      self.model.localTeach.addCurProjExpandedKeys(curProjUUID);
      // self.model.localTeach.addCurProjExpandedKeys(newFileUUID);
      self.listProjs(() => {
        if (callback) {
          callback(dict)
        }
      });
    }
  });
};

// self.createProj = (name, proType) => {
//   if (proType === '1') {
//     name = `continuous_${name}`;
//   }
//   else {
//     name = `discontinuous_${name}`;
//   }
//   // if (proType === 'discontinuous') {
//   // }
//   const filePath = path.join(self.ROOT_DIR, name);
//   const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
//   Object.assign(params.data, {
//     root: filePath, // 文件夹的父目录，必须
//     name: '', // 文件夹名称, 可省略
//   });
//   self.sendCmd(window.GlobalConstant.FILE_ID_CREATE_DIR, params, () => {
//     self.listProjs(() => {
//     });
//   });
// };

self.renameProj = (name, callback) => {
  const originName = self.model.localTeach.curProj.name;
  // const newProjUUID = path.join(self.ROOT_DIR, name);
  // const newname = name;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    oldName: originName,
    newName: name,
  });
  self.sendCmd(window.GlobalConstant.RENAME_RECORD_PROJ, params, () => {
    self.listProjs(() => {
      if (callback) {
        callback();
      }
    });
  });
};

self.renameFile = (name, callback) => {
  const projName = self.model.localTeach.curProj.name;
  const oldName = path.basename(self.model.localTeach.curSelectedTreeItem.uuid);
  // const newProjUUID = path.join(self.ROOT_DIR, name);
  // const newname = name;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    projectName: projName,
    oldName: oldName,
    newName: name,
  });
  self.sendCmd(window.GlobalConstant.CHANGE_RECORD_FILE_NAME, params, () => {
    self.listProjs(() => {
      if (callback) {
        callback();
      }
    });
  });
};

// self.renameProj = (name, callback) => {
//   const originName = self.model.localTeach.curProj.name;
//   // const newProjUUID = path.join(self.ROOT_DIR, name);
//   // const newname = name;
//   const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
//   Object.assign(params.data, {
//     root: self.ROOT_DIR, // 文件的父目录，必须
//     old_name: originName, // 原文件（夹）名称
//     new_name: name, // 新文件（夹）名称
//   });
//   self.sendCmd(window.GlobalConstant.FILE_ID_CHANGE_NAME, params, () => {
//     self.listProjs(() => {
//       if (callback) {
//         callback();
//       }
//     });
//   });
// };

self.delProj = (uuid, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    projectName: path.basename(uuid),
  });
  self.sendCmd(window.GlobalConstant.DELETE_RECORD_PROJ, params, (dict) => {
    self.listProjs(() => {
      window.GlobalUtil.model.localTeach.setCurSelectedTreeItem('');
      callback();
    });
  });
};

// self.delProj = (proId, callback) => {
//   const filePath = proId; // path.join(self.ROOT_DIR, name);
//   console.log(`filePath = ${filePath}`);
//   const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
//   Object.assign(params.data, {
//     root: filePath, // 文件夹的父目录，必须
//     file: '', // 文件夹名称, 可省略
//   });
//   self.sendCmd(window.GlobalConstant.FILE_ID_DELETE_DIR, params, () => {
//     window.GlobalUtil.model.localTeach.setCurSelectedTreeItem('');
//     self.listProjs(callback);
//   });
// };

self.createFile = (name, points, callback1, callback2) => {
  const curProj = self.model.localTeach.curProj;
  if (curProj === null || curProj === undefined || curProj === {}) {
    return;
  }
  const filePath = path.join(curProj.uuid, `${name}.json`);
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    projectName: curProj.name,
    fileName: name,
    points: points,
  });
  console.log(`add point isShowControl 1b1 = ${self.model.localTeach.editState}`);
  self.sendCmd(window.GlobalConstant.CREATE_RECORD_FILE, params, (dict) => {
    console.log(`add point isShowControl 1b2 = ${self.model.localTeach.editState}`);
    dict.uuid = filePath;
    // console.log(`TEACH_ID_CREATE_FILE dict = ${JSON.stringify(dict)}`);
    if (callback1) {
      callback1(dict);
    }
    console.log(`add point isShowControl 1b3 = ${self.model.localTeach.editState}`);
    self.listProjs(callback2);
  });
};

self.delFiles = (uuid, callback) => {
  // return;
  const filePath = uuid;
  console.log(`filePath = ${filePath}`);
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    projectName: path.basename(path.dirname(uuid)),
    fileName: path.basename(uuid),
  });
  self.sendCmd(window.GlobalConstant.DELETE_RECORD_FILE, params, (dict) => {
    console.log(`del files = ${JSON.stringify(dict)}`);
    window.GlobalUtil.model.localTeach.setCurSelectedTreeItem('');
    self.listProjs(callback);
  });
};

self.getFile = (uuid, callback) => {
  const filePath = uuid;
  // console.log(`getFile filePath = ${filePath}`);
  // return;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    projectName: path.basename(path.dirname(uuid)),
    fileName: path.basename(uuid),
  });
  self.sendCmd(window.GlobalConstant.GET_RECORD_FILE, params, (dict) => {
    // console.log(`get file = ${JSON.stringify(dict)}`);
    if (callback) {
      callback(dict);
    }
  });
};

self.getProjFiles = (uuid, callback) => {
  // console.log(`getFile filePath = ${filePath}`);
  // return;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    projectName: path.basename(uuid),
  });
  self.sendCmd(window.GlobalConstant.GET_RECORD_PROJECT, params, (dict) => {
    // console.log(`get file = ${JSON.stringify(dict)}`);
    if (callback) {
      callback(dict);
    }
  });
};

self.debugSetBeart = (isOpen, sleepTime, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    isOpen,
    sleepTime,
  });
  self.sendCmd(window.GlobalConstant.DEBUG_SET_BEART, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.runTeach = (uuid, opt, callback) => {
  opt = opt || {};
  const times = opt.times;
  const speed = opt.speed || 20;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    path: uuid,
    times: Number(times),
    speed: Number(speed),
  });
  self.sendCmd(window.GlobalConstant.APP_RUN_TEACH, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.stopTeach = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {});
  self.sendCmd(window.GlobalConstant.APP_STOP_TEACH, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.setParams = (newParams, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, newParams);
  self.sendCmd(window.GlobalConstant.SETTING_XARM_SET_PARAMS, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

export default self;
