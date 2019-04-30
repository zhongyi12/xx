
// const path = require('path')
const merge = require('webpack-merge')

const CommandsSettingSocket = {};
const self = CommandsSettingSocket;
window.CommandsSettingSocket = CommandsSettingSocket;

self.sendCmd = (cmdId, data, callback) => {
  self.socketCom.sendCmd(cmdId, data, callback);
};
self.getInfo = (callback) => {
  self.getDeviceInfo();
  self.getStudioInfo();
  if (callback) {
    callback();
  }
}
self.getDeviceInfo = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd(window.GlobalConstant.SETTING_GET_DEVICE_INFO, params, (dict) => {
    window.GlobalUtil.model.localSettingMgr.pushDeviceData(dict);
    if (callback) {
      callback(dict);
    }
  });
};

self.getStudioInfo = (callback) => {
  const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA();
  self.sendCmd(window.GlobalConstant.SETTING_GET_STUDIO_INFO, params, (dict) => {
    window.GlobalUtil.model.localSettingMgr.pushStudioData(dict);
    if (callback) {
      callback(dict);
    }
  });
};

export default self;
