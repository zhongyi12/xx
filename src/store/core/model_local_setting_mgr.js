
const path = require('path')

const LocalSettingMgr = {};
const self = LocalSettingMgr;

self.infoDatas = {};
self.pushDeviceData = (dict) => {
  self.infoDatas.deviceInfo = dict.data;
};
self.pushStudioData = (dict) => {
  self.infoDatas.studioInfo = dict.data;
};

export default self;
