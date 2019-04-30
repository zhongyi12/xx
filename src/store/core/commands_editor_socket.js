
const path = require('path')
const merge = require('webpack-merge')

const CommandsEditorSocket = {};
const self = CommandsEditorSocket;
window.CommandsEditorSocket = CommandsEditorSocket;

self.ROOT_DIR = '/python';

self.sendCmd = (cmdId, data, callback) => {
  self.socketCom.sendCmd(cmdId, data, callback);
};

self.runPythonScript = (uuid, callback) => {
  const filePath = uuid;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    path: filePath, // 要执行的python文件路径, /python/prj1/test.py
    // "script": "", // 要执行的python代码
  });
  self.sendCmd(window.GlobalConstant.FILE_ID_RUN_PYTHON_SCRIPT, params, (dict) => {
    window.GlobalUtil.model.localProjTree.isCmdRunning = true;
    if (dict.code === 1111 || window.GlobalUtil.model.robot.state.info.socketConnected === false || dict.code === 10086) {
      window.GlobalUtil.model.localProjTree.isCmdRunning = false;
      window.GlobalUtil.model.localProjTree.runningCmdResult = window.GlobalUtil.model.localProjTree.runningCmdResultList.join('\n');
    }
    if (callback) {
      callback(dict);
    }
  });
};

self.stopPythonScript = (callback) => {
  const pID = self.model.localProjTree.runningCmdProgramID;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    program_id: pID, // 该id在上面两个接口都会有返回, null或者不传代表停止所有的
  });
  self.sendCmd(window.GlobalConstant.FILE_ID_STOP_PYTHON_SCRIPT, params, (dict) => {
    window.GlobalUtil.model.localProjTree.isCmdRunning = false;
    window.GlobalUtil.model.localProjTree.runningCmdResult = window.GlobalUtil.model.localProjTree.runningCmdResultList.join('\n');
    if (callback) {
      callback(dict);
    }
  });
};

self.runPipCommand = (command, options, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    command,
    options,
  });
  self.sendCmd(window.GlobalConstant.FILE_ID_RUN_PIP_COMMAND, params, (dict) => {
    window.GlobalUtil.model.localProjTree.isCmdRunning = true;
    if (dict.code === 1111 || window.GlobalUtil.model.robot.state.info.socketConnected === false || dict.code === 10086) {
      window.GlobalUtil.model.localProjTree.isCmdRunning = false;
      window.GlobalUtil.model.localProjTree.runningCmdResult = window.GlobalUtil.model.localProjTree.runningCmdResultList.join('\n');
    }
    if (callback) {
      callback(dict);
    }
  });
};

self.autocompletePython = (source, line, column, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    source, // 整个文本内容
    line, // 行号
    column, // 列号
  });
  self.sendCmd(window.GlobalConstant.FILE_ID_AUTOCOMPLETE_PYTHON, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.listProjs = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    root: self.ROOT_DIR, // 要获取的目录
    type: 'detail', // simple: 仅获取当前目录，不包括子目录 detail:包括子目录
  });
  self.sendCmd(window.GlobalConstant.FILE_ID_LIST_DIR, params, (dict) => {
    // console.log(`remoteProjs2Local = ${JSON.stringify(dict)}`);
    self.model.localProjTree.remoteProjs2Local(dict);
    if (callback) {
      callback();
    }
  });
};

self.createProj = (name) => {
  const filePath = path.join(self.ROOT_DIR, name);
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    root: filePath, // 文件夹的父目录，必须
    name: '', // 文件夹名称, 可省略
  });
  self.sendCmd(window.GlobalConstant.FILE_ID_CREATE_DIR, params, () => {
    self.listProjs(() => {
      // const lastProj = self.model.localProjTree.curProjList[self.model.localProjTree.curProjList.length - 1];
      self.model.localProjTree.changeProj(filePath);
    });
  });
};

self.delProj = (proId, callback) => {
  const filePath = proId;
  console.log(`filePath = ${filePath}`);
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    root: filePath, // 文件夹的父目录，必须
    file: '', // 文件夹名称, 可省略
  });
  self.sendCmd(window.GlobalConstant.FILE_ID_DELETE_DIR, params, () => {
    self.listProjs(callback);
  });
};

self.renameProj = (name) => {
  const originName = self.model.localProjTree.curProj.name;
  // const curProjUUID = self.model.localProjTree.curProj.uuid;
  const newProjUUID = path.join(self.ROOT_DIR, name);
  // const newname = name;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    root: self.ROOT_DIR, // 文件的父目录，必须
    old_name: originName, // 原文件（夹）名称
    new_name: name, // 新文件（夹）名称
  });
  self.sendCmd(window.GlobalConstant.FILE_ID_CHANGE_NAME, params, () => {
    self.model.localProjTree.deleteOpenSonTabs('');
    self.listProjs(() => {
      self.model.localProjTree.changeProj(newProjUUID);
      console.log(`rename change proj = ${JSON.stringify(self.model.localProjTree.curProj)}`);
      // self.model.localProjTree.setSelectedEditor('');
    });
  });
};

self.createFile = (name, isProjFile, callback) => {
  // console.log('createFile 3 file 1');
  let filePath = self.model.localProjTree.getSelectedFileFolder();
  // console.log('createFile 3 file 2');
  filePath = path.join(filePath, name);
  // console.log(`createFile 3 file 3 = ${filePath}`);
  // const isProjFile = name.indexOf('.') > 0;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    root: filePath, // 文件夹的父目录，必须
    file: '', // 文件夹名称, 可省略
    data: '', // 文件内容
  });
  // const proId = self.model.localProjTree.curProj.uuid;
  if (isProjFile === true) {
    self.sendCmd(window.GlobalConstant.FILE_ID_CREATE_FILE, params, () => {
      self.listProjs(() => {
        self.model.localProjTree.onTreeNodeClick(filePath);
        setTimeout(() => {
          self.model.localProjTree.curProjAddExpandedKeys(filePath);
          // console.log(`curProjExpandedKeys = ${JSON.stringify(self.model.localProjTree.curProjExpandedKeys)}`);
        });
        if (callback) {
          callback();
        }
      });
    });
  }
  else {
    self.sendCmd(window.GlobalConstant.FILE_ID_CREATE_DIR, params, () => {
      self.listProjs(() => {
        if (callback) {
          callback();
        }
      });
    });
  }
};

self.saveOrUpdateFile = (uuid, text, callback, completeParams) => {
  // text = 'test test';
  const filePath = uuid;
  console.log(`saveOrUpdateFile filePath = ${filePath}, text = ${text}`);
  // return;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    root: filePath, // 文件夹的父目录，必须
    file: '', // 文件夹名称, 可省略
    data: text, // 文件内容
    config: completeParams === undefined ? {} : completeParams,
  });
  self.sendCmd(window.GlobalConstant.FILE_ID_SAVE_FILE, params, (dict) => {
    // self.listProjs(callback);
    if (callback) {
      callback(dict);
    }
  });
};

self.getFile = (uuid, callback) => {
  const filePath = uuid;
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    root: filePath, // 文件夹的父目录，必须
    file: '', // 文件夹名称, 可省略
  });
  self.sendCmd(window.GlobalConstant.FILE_ID_GET_FILE, params, (dict) => {
    // console.log(`get file = ${JSON.stringify(dict)}`);
    if (callback) {
      callback(dict);
    }
    // self.listProjs(callback);
  });
};

self.delFiles = (uuid) => {
  // return;
  const filePath = uuid; // self.model.localProjTree.getThisFileFullPath(uuid);
  console.log(`filePath = ${filePath}`);
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    root: filePath, // 文件夹的父目录，必须
    file: '', // 文件夹名称, 可省略
  });
  const isProjFile = filePath.indexOf('.') > 0;
  if (isProjFile === true) {
    self.sendCmd(window.GlobalConstant.FILE_ID_DELETE_FILE, params, () => {
      self.model.localProjTree.deleteOpenSonTabs(uuid);
      self.listProjs();
    });
  }
  else {
    self.sendCmd(window.GlobalConstant.FILE_ID_DELETE_DIR, params, () => {
      self.model.localProjTree.deleteOpenSonTabs(uuid);
      self.listProjs();
    });
  }
};

self.renameFile = (uuid, name) => {
  const filePath = uuid; // self.model.localProjTree.getThisFileFullPath(uuid);
  // const file = self.model.localProjTree.getFileInfo(uuid);
  const fatherDir = path.dirname(filePath);
  const basename = path.basename(filePath);
  // const newname = name;
  // const newFilePath = path.join(fatherDir, newname);
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    root: fatherDir, // 文件的父目录，必须
    old_name: basename, // 原文件（夹）名称
    new_name: name, // 新文件（夹）名称
  });
  self.sendCmd(window.GlobalConstant.FILE_ID_CHANGE_NAME, params, () => {
    self.model.localProjTree.deleteOpenSonTabs(uuid);
    self.listProjs();
  });
};

self.isFileSuc = (dict) => {
  if (dict.code === 0 && dict.type === 'response') {
    return true;
  }
  return false;
};

self.getTestPost = () => {
  const a0 = window.GlobalUtil.randomNumber(0, 360);
  const a1 = window.GlobalUtil.randomNumber(0, 360);
  const a2 = window.GlobalUtil.randomNumber(0, 360);
  const a3 = window.GlobalUtil.randomNumber(0, 360);
  const a4 = window.GlobalUtil.randomNumber(0, 360);
  const a5 = window.GlobalUtil.randomNumber(0, 360);
  const a6 = window.GlobalUtil.randomNumber(0, 360);
  return [a0, a1, a2, a3, a4, a5, a6];
};

self.blocklyToPython = (appName, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    appName: appName,
    category: 'myapp'
  });
  self.sendCmd(window.GlobalConstant.BLOCKLY_TO_PYTHON, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
}

export default self;
