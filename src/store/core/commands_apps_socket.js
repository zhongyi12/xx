import Vue from 'vue';
// const path = require('path')
const merge = require('webpack-merge')

const CommandsAppsSocket = {};
const self = CommandsAppsSocket;
window.CommandsAppsSocket = CommandsAppsSocket;

self.sendCmd = (cmdId, data, callback) => {
  self.socketCom.sendCmd(cmdId, data, callback);
};

self.listApps = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd(window.GlobalConstant.APPSTORE_GET_APPS, params, (dict) => {
    window.GlobalUtil.model.localAppsMgr.remoteProjs2Local(dict);
    if (callback) {
      callback(dict);
    }
  });
};

self.createFile = (name, content, callback1) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    appName: name, // 文件夹名称, 可省略
    xmlData: content, // 文件内容
  });
  self.sendCmd(window.GlobalConstant.APPSTORE_APP_CREATE, params, () => {
    self.listLocalApps(callback1);
  });
};

self.renameFile = (oldName, newName, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    oldName,
    newName,
  });
  self.sendCmd(window.GlobalConstant.APPSTORE_APP_RENAME, params, () => {
    self.listLocalApps(callback);
  });
};

self.delFile = (name, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    appName: name,
  });
  self.sendCmd(window.GlobalConstant.APPSTORE_APP_REMOVE, params, () => {
    self.listLocalApps(callback);
  });
};

self.uploadFile = (name, appInfo, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    appName: name,
    appInfo: appInfo,
  });
  self.sendCmd(window.GlobalConstant.APPSTORE_APP_UPLOAD, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.listLocalApps = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd(window.GlobalConstant.APPSTORE_GET_LOCAL_APPS, params, (dict) => {
    // GlobalUtil.model.localAppsMgr.remoteProjs2Local(dict);
    window.GlobalUtil.model.localAppsMgr.remoteMyProjs2Local(dict);
    if (callback) {
      callback(dict);
    }
  });
};

const runTaskApp = (path, category) => new Promise((resolve) => {
  if (!window.GlobalUtil.model.robot.state.info.online) {
    window.Blockly.AppRunning = false;
    resolve(1111)
    return;
  }
  const CMD_LIST = {
    python: window.GlobalConstant.APP_RUN_PYTHON,
    teach: window.GlobalConstant.APP_RUN_TEACH,
  };
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    appName: window.GlobalUtil.model.localAppsMgr.curProj.label,
    projectPath: path,
  });
  self.sendCmd(CMD_LIST[category], params, (dict) => {
    if (dict.code === 1111) {
      window.Blockly.AppRunning = false;
      resolve(1111)
      console.log('app run compeleted')
      Vue.prototype.$message({
        message: `${category}: ${dict.data.stdout}`,
        duration: 1000,
      });
    }
    else {
      console.log(`app is running, ${dict.code}, ${path}`)
    }
  })
})

self.runTeach = path => runTaskApp(path, 'teach')

self.runPython = path => runTaskApp(path, 'python')

self.runCsvFile = (type, radian, offset, speed, acc, filename) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    appName: window.GlobalUtil.model.localAppsMgr.curProj.label,
    fileName: filename,
    type: type,
    radian: radian,
    offset: offset,
    speed: speed,
    acc: acc,
  });
  self.sendCmd('app_run_csv_file', params, (dict) => {
    if (dict.code === 1111) {
      window.Blockly.AppRunning = false;
      resolve(1111)
      console.log('app run compeleted')
    }
    else {
      console.log(`app is running, ${dict.code}, ${path}`)
    }
  })
}

self.getBlockXml = path => new Promise((resolve, reject) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    currentAppName: path.project,
    insertCategory: path.category,
    insertAppName: path.name,
  });
  self.sendCmd(window.GlobalConstant.APP_GET_INSERT_XML, params, (dict) => {
    if (dict.code === 0) {
      resolve(dict.data)
    }
    else {
      reject(dict)
    }
  })
})

self.getProject = data => new Promise((resolve, reject) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    category: data.category, // 'myapp',
    appName: data.name,
  });
  self.sendCmd(window.GlobalConstant.APP_GET_XML, params, (dict) => {
    if (dict.code === 0) {
      resolve(dict.data)
    }
    else {
      reject(dict)
    }
  })
})

self.appControl = (appControl, category, appName, appVersion, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    category,
    appName,
    appVersion,
    appControl,
  });
  self.sendCmd(window.GlobalConstant.APPSTORE_APP_INSTALL, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.appInstall = (category, appName, appVersion, callback) => {
  self.appControl('install', category, appName, appVersion, callback);
};

self.appUninstall = (category, appName, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    category, // 'default', 'thirdparty', 'myapp'
    appName,
  });
  self.sendCmd(window.GlobalConstant.APPSTORE_APP_UNINSTALL, params, (dict) => {
    if (callback) {
      callback(dict);
    }
  });
};

self.appReinstall = (category, appName, appVersion, callback) => {
  self.appControl('reinstall', category, appName, appVersion, callback);
};

self.genPythonCode = (data, callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  Object.assign(params.data, {
    category: data.category, // 'myapp',
    appName: data.label,
  });
  self.sendCmd(window.GlobalConstant.CONVERT_BLOCKLY_TO_PYTHON, params, (dict) => {
    if (dict.code === 0) {
      if (callback) {
        callback(dict.data);
      }
    }
    else {
    }
  })
};

export default self;
