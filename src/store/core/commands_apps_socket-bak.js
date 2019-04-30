
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
      resolve(1111)
      console.log('app run compeleted')
    }
    else {
      console.log(`app is running, ${dict.code}, ${path}`)
    }
  })
})

self.runTeach = path => runTaskApp(path, 'teach')

self.runPython = path => runTaskApp(path, 'python')

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

export default self;
