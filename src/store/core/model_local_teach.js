
const path = require('path')

const LocalTeach = {};
const self = LocalTeach;

self.showArr = [];
self.curProjList = [];
self.curProj = {};
self.curProj.files = [];
self.curProjExpandedKeys = [];
self.curSelectedIndex = -1;
self.runTimes = 1;
self.projSingleTotalCount = 0;
self.editState = false;
self.pointCellsWidth = 40;
// self.runSpeed = 10;
// self.acceleration = 400;
// self.curSelectedTimerIndex = -1;
self.isTeachRunningUUID = '';
self.projectListShow = true;
self.curSelectedTreeItem = {
  uuid: '',
  type: '',
};
self.PROJ_TREE_TYPE = {
  FOLDER: 'folder',
  FILE: 'file',
};
self.hasChange = false;
self.curEditingFileUUID = '';
self.fileDatas = {};
// self.lastFileData = [];
// self.isContinus = false;
self.visible = {
  starRecording: false,
}
self.projTypeSelected = '2';
self.projTypeSelectedShow = false;
self.projRenameShow = false;
self.willOnSelectIndex = -1;
self.changeSelectedShow = false;
self.saveDialogShow = false
self.curDialogProjInputText = '';
self.dialogErrorTips = '';
self.isClickingCell = false;
self.curProTreeDatas = [];
self.pushFileData = (uuid, datas) => {
  const dict = self.fileDatas[uuid];
  if (dict === null || dict === undefined) {
    self.fileDatas[uuid] = [];
  }
  if (self.fileDatas[uuid].length > self.msMax) {
    return;
  }
  self.fileDatas[uuid].push(datas);
};

self.computedIndex = (index) => {
  const curEditingFileUUID = window.GlobalUtil.model.localTeach.curEditingFileUUID;
  // const getFileInfo = window.GlobalUtil.model.localTeach.getFileInfo(curEditingFileUUID);
  if (window.GlobalUtil.model.localTeach.visible.starRecording === true) {
    // const point = window.GlobalUtil.model.localTeach.getFileData('temp', this.index);
    return '';
  }
  // if (this.isTimer) {
  //   return '';
  // }
  const uuid = curEditingFileUUID === '' ? 'temp' : curEditingFileUUID;
  const points = window.GlobalUtil.model.localTeach.fileDatas[uuid] || [];
  let counter = 0;
  for (let i = 0; i < points.length; i += 1) {
    // if (points[i].length === 1 && i < index) {
    //   counter += 1;
    // }
    // if (points[i].length >= 6 && i <= index) {
    //   counter += 1;
    // }
    if (i <= index) {
      counter += 1;
    }
  }
  return counter;
  // return index + 1 - counter;
};

// self.addOrRemoveCurProjExpandedKeys = (key) => {
//   if (self.curProjExpandedKeys.indexOf(key) >= 0) {
//     self.curProjExpandedKeys.splice(self.curProjExpandedKeys.findIndex(item => item === key), 1)
//   }
//   else {
//     self.curProjExpandedKeys.push(key);
//   }
// };

self.addCurProjExpandedKeys = (key) => {
  if (self.curProjExpandedKeys.indexOf(key) < 0) {
    // self.curProjExpandedKeys.splice(self.curProjExpandedKeys.findIndex(item => item === key), 1)
    self.curProjExpandedKeys.push(key);
  }
  // self.curProjExpandedKeys.splice(self.curProjExpandedKeys.findIndex(item => item === key), 1)
  // self.curProjExpandedKeys.push(key);
};

self.removeCurProjExpandedKeys = (key) => {
  self.curProjExpandedKeys.splice(self.curProjExpandedKeys.findIndex(item => item === key), 1)
};

self.isGripper = (index) => {
  console.log(`isGripper ${index}`);
  const curEditingFileUUID = window.GlobalUtil.model.localTeach.curEditingFileUUID;
  const getFileInfo = window.GlobalUtil.model.localTeach.getFileInfo(curEditingFileUUID);
  if (curEditingFileUUID === '') {
    const point = window.GlobalUtil.model.localTeach.getFileData('temp', index);
    return point && point.length === 2;
  }
  if (getFileInfo !== null) {
    const point = window.GlobalUtil.model.localTeach.getFileData(curEditingFileUUID, index);
    return point && point.length === 2;
  }
  return false;
};

self.isTimer = (index) => {
  console.log(`isTimer ${index}`);
  const curEditingFileUUID = window.GlobalUtil.model.localTeach.curEditingFileUUID;
  const getFileInfo = window.GlobalUtil.model.localTeach.getFileInfo(curEditingFileUUID);
  if (curEditingFileUUID === '') {
    const point = window.GlobalUtil.model.localTeach.getFileData('temp', index);
    return point && point.length === 1;
  }
  if (getFileInfo !== null) {
    const point = window.GlobalUtil.model.localTeach.getFileData(curEditingFileUUID, index);
    return point && point.length === 1;
  }
  return false;
};

self.setCurSelectedTreeItem = (uuid) => {
  if (uuid === null || uuid === '') {
    self.curSelectedTreeItem.uuid = ''
    self.curSelectedTreeItem.type = '';
    return;
  }
  self.curSelectedTreeItem.uuid = uuid;
  const aProj = self.getCurProj(uuid);
  const thisProj = self.getProjInfo(uuid);
  if (aProj !== null) {
    self.curSelectedTreeItem.type = 'proj';
  }
  else {
    const aFile = self.getTeachFileInfo(thisProj, uuid);
    if (aFile !== null) {
      self.curSelectedTreeItem.type = 'file';
    }
    else {
      self.curSelectedTreeItem.type = '';
    }
  }
};

self.getFileData = (uuid, index) => {
  if (self.fileDatas[uuid] === undefined) {
    self.fileDatas[uuid] = [];
  }
  return self.fileDatas[uuid][index];
};

self.getFileInfo = (uuid) => {
  if (self.curProj === null || self.curProj === undefined) {
    return null;
  }
  const files = self.curProj.files;
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    if (file.uuid === uuid) {
      return file;
    }
  }
  return null;
};

self.updateFileData = (uuid, index, ch, value) => {
  self.fileDatas[uuid][index][ch] = value;
};

self.getCurProj = (uuid) => {
  for (let i = 0; i < self.curProjList.length; i += 1) {
    const proj = self.curProjList[i];
    if (proj.uuid === uuid) {
      return proj;
    }
  }
  return null;
};

self.getRealProjFileName = (name) => {
  name = name.replace('discontinuous_', '');
  name = name.replace('continuous_', '');
  return name;
};

self.getRealFileFileName = (name) => {
  name = path.basename(name);
  // name = name.split('.')[0];
  // const year = name.substring(0, 4);
  // const month = name.substring(4, 6)
  // const day = name.substring(6, 8);
  // const hour = name.substring(8, 10);
  // const min = name.substring(10, 12);
  // const sec = name.substring(12, 14);
  // return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  return name;
};

self.getProjInfo = (uuid) => {
  for (let i = 0; i < self.curProjList.length; i += 1) {
    const proj = self.curProjList[i];
    if (proj.uuid === uuid) {
      return proj;
    }
    console.log('getProjInfo uuid = ' + uuid);
    for (let i = 0; i < proj.files.length; i += 1) {
      const file = proj.files[i];
      if (file.uuid === uuid) {
        return self.getProjInfo(file.proId);
      }
    }
  }
  return null;
};

self.isHasProj = (name) => {
  // const projTypeSelected = window.GlobalUtil.model.localTeach.projTypeSelected;
  // const pre = projTypeSelected === '1' ? 'continuous_' : 'discontinuous_';
  for (let i = 0; i < self.curProjList.length; i += 1) {
    // if (self.curProjList[i].name === `${pre}${name}`) {
    if (self.curProjList[i].name === `${name}`) {
      self.dialogErrorTips = window.language.currentLang === 'en' ? 'Project name can not be the same' : '项目名不能一样';
      return false;
    }
  }
  self.dialogErrorTips = '';
  return true;
};

self.isHasFile = (name) => {
  const curProj = self.curProj;
  const files = self.curProj.files;
  console.log(`proj name = ${curProj.name} all names = ${files.map((file) => { return file.name }).join(',')}`)
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    if (file.name === `${name}`) {
      self.dialogErrorTips =  window.language.currentLang === 'en' ? 'File name can not be the same' : '文件名不能一样';
      return false;
    }
  }
  self.dialogErrorTips = '';
  return true;
};

self.onSaveChange = (callback) => {
  // console.log(`on Save Change`);
  const model = window.GlobalUtil.model;
  const uuid = model.localTeach.curEditingFileUUID;
  const index = model.localTeach.curSelectedIndex;
  const point = model.localTeach.curPoint;
  const points = model.localTeach.fileDatas[uuid];
  points[index] = point;

  // const textDict = {
  //   type: model.localTeach.curProj.type,
  //   total: points.length,
  //   points: points,
  // };
  // const text = JSON.stringify(textDict);

  model.localTeach.curPointRemarks[index] = model.localTeach.curRemark;
  const newPoints = points.map((point, i) => {
    const newPoint = {
      type: point.length === 1 ? 'time' : 'joint',
      point: point,
      // remark: 'remark',
      remark: model.localTeach.curPointRemarks[i],
    };
    if (point.length === 2) {
      newPoint.type = 'gripper'
    }
    return newPoint;
  });

  window.CommandsTeachSocket.createFile(path.basename(uuid), newPoints, (dict) => {
    if (dict.code === 0) {
      model.localTeach.hasChange = false;
    }
    if (callback) {
      callback();
    }
  });
};

self.getTeachFileInfo = (proj, uuid) => {
  if (!proj) {
    return null;
  }
  const files = proj.files;
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const fileId = file.uuid;
    if (fileId === uuid) {
      return file;
    }
  }
  return null;
};

self.remoteProjs2Local = (dict) => {
  if (dict.code !== 0) {
    console.log('datas is not array');
    return;
  }
  const lastOpenProj = {
    lastAccessTime: 0,
    lastAccessFile: '',
    lastAccessProjUUID: '',
  };
  // let tempLastAccessTime = 0;
  const projs = [];
  const datas = dict.data;
  for (let i = 0; i < datas.length; i += 1) {
    const dataProj = datas[i];
    const aProj = {};
    aProj.files = [];
    aProj.name = dataProj.name;
    aProj.ctime = dataProj.ctime;
    aProj.pointCount = dataProj.pointCount;
    console.log('pointCount pointCount proj = ' + dataProj.pointCount);
    aProj.type = dataProj.type;
    aProj.uuid = path.join('/record', aProj.name);
    const projLastAccessTime = dataProj.lastAccessTime;
    const projLastAccessFile = dataProj.lastAccessFile;
    if (projLastAccessTime > lastOpenProj.lastAccessTime) {
      lastOpenProj.lastAccessTime = projLastAccessTime;
      lastOpenProj.lastAccessFile = projLastAccessFile;
      lastOpenProj.lastAccessProjUUID = aProj.uuid;
    }
    for (let j = 0; j < dataProj.files.length; j += 1) {
      const dataFile = dataProj.files[j];
      const aFile = {};
      aFile.name = dataFile.name;
      aFile.pointCount = dataFile.pointCount;
      console.log('pointCount pointCount file = ' + dataFile.pointCount);
      aFile.type = aProj.type;
      aFile.proId = aProj.uuid;
      aFile.uuid = path.join(aProj.uuid, aFile.name);
      aProj.files.push(aFile);
    }
    projs.push(aProj);
  }
  self.curProjList = projs;
  if (self.curProj === null || self.curProj === undefined || self.curProj === {} || self.curProj.uuid === undefined) {
    if (self.curProjList.length > 0) {
      self.curProj = self.curProjList[0];
    }
  }
  const lastSelected = path.join(lastOpenProj.lastAccessProjUUID, lastOpenProj.lastAccessFile);
  console.log(self.curProjList);
  console.log(self.curProj);
  console.log('lastSelected lastSelected uuid = ' + lastSelected);
  self.setCurSelectedTreeItem(lastSelected);
  self.addCurProjExpandedKeys(lastSelected);
  self.curPro2Tree();
  if (lastOpenProj.lastAccessTime > 0) {
    setTimeout(() => {
      if (self.tree) {
        // this.model.localTeach.setCurSelectedTreeItem(uuid);
        self.tree.setCurrentKey(lastSelected);
      }
    }, 200);
  }
};

self.onSelect = (e, index) => {
  window.GlobalUtil.model.localTeach.curSelectedIndex = index;
  const point = window.GlobalUtil.model.localTeach.getFileData(self.curEditingFileUUID, index);
  if (point === null || point === undefined) {
    // GlobalUtil.model.localTeach.curSelectedIndex = -1;
    console.log(`point null null null cur id = ${window.GlobalUtil.model.localTeach.curEditingFileUUID}`);
    return;
  }
  // if (point.length === 1) {
  //   return;
  // }
  self.curSelectedIndex = index;
  console.log(`on Select = ${index}, point = ${JSON.stringify(point)}, remark=${self.curPointRemarks[index]}`);
  self.curPoint = point;
  self.curRemark = self.curPointRemarks[index];
  if (point.length === 7 && window.GlobalUtil.model.robot.state.info.online === false) {
    window.GlobalUtil.model.robot.state.local.joints = point;
  }
  window.GlobalUtil.model.robot.state.counter += 1;
  if (index >= 0) {
    window.GlobalUtil.model.localTeach.editState = true;
  }
  else {
    window.GlobalUtil.model.localTeach.editState = false;
  }
  // window.GlobalUtil.model.localTeach.editState = index >= 0 ? true : false;
};

self.curPro2Tree = () => {
  const tempDatas = [];
  for (let i = 0; i < self.curProjList.length; i += 1) {
    const proj = self.curProjList[i];
    const aChild = {};
    aChild.label = proj.name;
    aChild.uuid = proj.uuid;
    aChild.proType = proj.type;
    aChild.pointCount = proj.pointCount;
    aChild.type = 'proj';
    aChild.ctime = proj.ctime;
    aChild.children = [];
    tempDatas.push(aChild);
    for (let j = 0; j < proj.files.length; j += 1) {
      const file = proj.files[j];
      const bChild = {};
      bChild.label = file.name;
      bChild.uuid = file.uuid;
      bChild.pointCount = file.pointCount;
      bChild.type = 'file';
      aChild.children.push(bChild);
    }
  }
  self.curProTreeDatas = tempDatas;
};

self.curPoint = [
  360,
  360,
  360,
  360,
  360,
  360,
  360,
];

self.curPointRemarks = [];
self.curRemark = '';
self.curShowRemark = '';

self.curDuration = 0;
self.msMin = 0;
self.msMax = 1800;
const allX = [];
for (let i = 0; i <= self.msMax; i += 1) {
  allX.push(i);
}

export default self;
