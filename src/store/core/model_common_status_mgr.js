const commonStatusMgr = {};
const self = commonStatusMgr;

self.panelIsHidden = false;
self.paintRobotShow = true;
self.paintControlShow = false;

self.blocklyRobotShow = false;
self.ControlPositionShow = false;
self.showToggleBtn = true;
self.blocklyCanUpdate = true;
self.quitPageShow = false;
self.changeControlEditTab = true;
self.visibleNavInfoListMenu = false;
self.showAxisMsg = true;

self.controlPanel = {
  tab: {
    index: 0,
    JOINTS: 0,
    TCP: 1,
    ACCESSORY: 2,
    SETTING: 3,
  }
};

self.controlShow = true;
self.settingPanel = {
  infoPage: {
    show: true,
  },
  logPage: {
    show: true,
  },
  updatePage: {
    show: true,
  },
  networkPage: {
    show: true,
    showDHCP: false,
    showEnp1s0: true,
    showEnp2s0: false,
  },
  terminalPage: {
    show: false,
  },
  debugPage: {
    show: false,
  }
};

self.isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) ? true : false;

self.comStop = {
  x: window.innerWidth - 46,
  y: -1,
  width: 44,
  height: 44,
};

self.selectAccessory = 'auto';
self.notifyInstance = null;


export default self;
