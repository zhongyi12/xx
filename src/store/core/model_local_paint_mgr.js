
import localPaintMgrData from './model_local_paint_mgr_data';

const path = require('path')

const LocalPaintMgr = {};
const self = LocalPaintMgr;

self.visible = {
  text: false,
  setting: false,
  pattern: false,
  projs: false,
  icons: false,
  clear: false,
  del: false,
};

self.curToDelProj = null;
self.curToDelProjTitle = '';

// self.runTimes = 1;
// self.runSpeed = 20;

self.state = {
  isRunnningPrint: false,
  buffer: [],
  saved: true,
  empty: true,
  backStep: 0,
  // mode: 'outline',
  zero: {
    grayscale: {
      laser: 21,
      pen: 22,
    },
    outline: {
      laser: 33,
      pen: 42,
    },
  },
  runTimes: 1,
  speed: 20,
};

self.curDialogProjInputText = '';
self.dialogErrorTips = '';
self.curDialogFontInputText = '';

self.projTypeSelected = 'outline'; // outline gray

self.projList = [];
self.curProj = null;

self.isHasProj = (name) => {
  const projType = self.projTypeSelected;
  const basename = projType === 'outline' ? 'outline.json' : 'gray.json';
  name = path.join(name, basename);
  const filePath = path.join(window.CommandsPaintSocket.ROOT_DIR, name);
  // console.log(`is has proj filePath 1 = ${filePath}`);
  for (let i = 0; i < self.projList.length; i += 1) {
    const uuid = self.projList[i].uuid;
    const projType = self.projList[i].projType;
    const uuid_path = path.join(uuid, `${projType}.json`);
    // console.log(`is has proj filePath 2 = ${uuid_path}`);
    if (uuid_path === filePath) {
      return true;
    }
  }
  return false;
};

self.realProjName = (proj) => {
  if (proj === null || proj === undefined) {
    return '';
  }
  const dirname = path.dirname(proj.uuid);
  return path.basename(dirname);
};

// self.curProjName = () => {
//   if (self.curProj === null || self.curProj === undefined) {
//     return '';
//   }
//   return self.curProj.name;
// }

self.createProj = (params) => {
  return {
    uuid: params.uuid,
    created: params.created,
  }
};

self.remoteProjs2Local = (dict) => {
  if (dict.code !== 0) {
    console.log('datas is not right');
    return;
  }
  const lastOpenProj = {
    lastAccessTime: 0,
    lastAccessProjUUID: '',
  };
  self.projList = [];
  const datas = dict.data;
  const projs = [];
  // let index = 0;
  for (let i = 0; i < datas.length; i += 1) {
    const dataProj = datas[i];
    const aProj = {};
    aProj.name = dataProj.name;
    aProj.type = dataProj.type;
    aProj.uuid = path.join('/paint', aProj.name);
    aProj.created = dataProj.ctime;
    aProj.projType = dataProj.type;
    const projLastAccessTime = dataProj.lastAccessTime;
    if (projLastAccessTime > lastOpenProj.lastAccessTime) {
      lastOpenProj.lastAccessTime = projLastAccessTime;
      lastOpenProj.lastAccessProjUUID = aProj.uuid;
      self.curProj = aProj;
    }
    projs.push(aProj);
  }
  const sortedProjs = window.GlobalUtil.bubbleSort(projs, (a, b) => {
    return a.createTimeSecs < b.createTimeSecs;
  });
  let index = 0;
  for (let i = 0; i < sortedProjs.length; i += 1) {
    const oneProj = sortedProjs[i];
    oneProj.index = index;
    index += 1;
  }
  self.projList = sortedProjs;
};

self.findProjIndex = (uuid) => {
  for (let i = 0; i < self.projList.length; i += 1) {
    const proj = self.projList[i];
    if (proj.uuid === uuid) {
      return i;
    }
  }
  return -1;
};

self.dialog = {
  textInput: '', // text value
  fontSelect: 0, // select font
};

self.selectedIcon = null;

self.emotions = [
  {
    name: 'shape',
    list: localPaintMgrData.shapes1,
  },
  {
    name: 'emoji',
    list: localPaintMgrData.icons01,
  },
  {
    name: 'automobile',
    list: localPaintMgrData.icons02,
  },
  {
    name: 'fastfood',
    list: localPaintMgrData.icons03,
  },
  {
    name: 'outdoor',
    list: localPaintMgrData.icons04,
  },
  {
    name: 'starwar',
    list: localPaintMgrData.icons05,
  },
  {
    name: 'universe',
    list: localPaintMgrData.icons06,
  },
];

export default self;
