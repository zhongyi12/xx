
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
self.lastFileData = [];
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

self.isTimer = (index) => {
  const curEditingFileUUID = window.GlobalUtil.model.localTeach.curEditingFileUUID;
  const getFileInfo = window.GlobalUtil.model.localTeach.getFileInfo(curEditingFileUUID);
  if (curEditingFileUUID === '') {
    const point = window.GlobalUtil.model.localTeach.getFileData('temp', index);
    return point.length === 1;
  }
  if (getFileInfo !== null) {
    const point = window.GlobalUtil.model.localTeach.getFileData(curEditingFileUUID, index);
    return point.length === 1;
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

// self.setSelectedTreeItem = (file) => {
//   const nodes = document.getElementsByClassName('el-tree-node__label');
//   for (let i = 0; i < nodes.length; i += 1) {
//     const node = nodes[i];
//     if (file !== null && file.name === node.innerHTML) {
//       node.style.color = 'blue';
//     }
//     else {
//       node.style.color = 'gray';
//     }
//   }
// };

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

self.createFile = (uuid, superid, proId, type, name, content) => {
  const file = {
    // index: indexCounter += 1,
    uuid: uuid,
    superid: superid,
    type: type,
    name: name,
    localContent: content,
    remoteContent: content,
    proId: proId,
  };
  const dict = self.fileDatas[uuid];
  if (dict === null || dict === undefined) {
    self.fileDatas[uuid] = [];
  }
  return file;
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
  const projTypeSelected = window.GlobalUtil.model.localTeach.projTypeSelected;
  const pre = projTypeSelected === '1' ? 'continuous_' : 'discontinuous_';
  for (let i = 0; i < self.curProjList.length; i += 1) {
    if (self.curProjList[i].name === `${pre}${name}`) {
      self.dialogErrorTips = 'Project name can not be the same';
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

  const newPoints = points.map((point) => {
    const newPoint = {
      type: point.length === 1 ? 'time' : 'joint',
      point: point,
      remark: 'remark',
    };
    return newPoint;
  });

  window.CommandsTeachSocket.createFile(path.basename(uuid), newPoints, () => {
    model.localTeach.hasChange = false;
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
  const projs = [];
  const datas = dict.data;
  for (let i = 0; i < datas.length; i += 1) {
    const dataProj = datas[i];
    const aProj = {};
    aProj.files = [];
    aProj.name = dataProj.name;
    aProj.type = dataProj.type;
    aProj.uuid = path.join('/record', aProj.name);
    for (let j = 0; j < dataProj.files.length; j += 1) {
      const dataFile = dataProj.files[j];
      const aFile = {};
      aFile.name = dataFile.name;
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
    // self.curProjExpandedKeys = [self.curProj.uuid];
  }
  self.curPro2Tree();
};

// self.remoteProjs2Local = (dict) => {
//   if (dict.code !== 0) {
//     console.log('datas is not array');
//     return;
//   }
//   const projs = [];
//   const datas = dict.data;
//   // console.log(`dict.data = ${JSON.stringify(dict.data)}`);
//   const filesDict = {};
//   // console.log(`datas = ${datas}`);
//   self.curProjExpandedKeys = [];
//   for (let i = 0; i < datas.length; i += 1) {
//     const aFileRecord = datas[i];
//     const filepath = aFileRecord.path;
//     const ctime = aFileRecord.ctime;
//     if (path.basename(filepath).indexOf('.') === 0) {
//       continue;
//     }
//     // check which project
//     const projName = filepath.replace(`${window.CommandsTeachSocket.ROOT_DIR}/`, '').split('/')[0];
//     const projPath = path.join(window.CommandsTeachSocket.ROOT_DIR, projName);
//     self.curProjExpandedKeys.push(projPath);
//     let curProj = null;
//     for (let i = 0; i < projs.length; i += 1) {
//       const proj = projs[i];
//       if (proj.name === projName) {
//         curProj = proj;
//       }
//     }
//     if (curProj === null) {
//       curProj = {};
//       curProj.uuid = projPath;
//       const name = projName;
//       // name = name.replace("continuous_", "");
//       // name = name.replace("discontinuous_", "")
//       curProj.name = name;
//       curProj.ctime = ctime;
//       const type = projName.split('_')[0];
//       if (type === 'discontinuous') {
//         curProj.type = 'discontinuous';
//       }
//       else {
//         curProj.type = 'continuous';
//       }
//       curProj.files = [];
//       projs.push(curProj);
//     }
//     let tempPath = filepath;
//     while (tempPath !== projPath && tempPath !== window.CommandsTeachSocket.ROOT_DIR) {
//       const isExistFile = filesDict[tempPath] !== undefined && filesDict[tempPath] !== null;
//       filesDict[tempPath] = ''; // tempPath; //
//       const uuid = tempPath; // Base64.btoa(tempPath);
//       let superpath = path.dirname(tempPath);
//       if (superpath === projPath || superpath === window.CommandsTeachSocket.ROOT_DIR) {
//         superpath = '';
//       }
//       const name = `${aFileRecord.name}(aFileRecord.total)`; // self.getRealFileFileName(tempPath);
//       const superid = superpath;
//       const isProFile = path.basename(tempPath).indexOf('.') > 0;
//       const fileType = isProFile ? self.PROJ_TREE_TYPE.FILE : self.PROJ_TREE_TYPE.FOLDER;
//       // console.log(`isProFile = ${isProFile}, isExistFile = ${isExistFile}`);
//       if (isExistFile === false) {
//         const file = self.createFile(uuid, superid, curProj.uuid, fileType, name, '');
//         file.isContinus = curProj.type === 'continuous';
//         curProj.files.push(file);
//         self.curProjExpandedKeys.push(uuid);
//       }
//       tempPath = path.dirname(tempPath);
//     }
//   }
//   self.curProjList = projs;
//   // console.log(`self.curProjList = ${JSON.stringify(self.curProjList)}`);
//   if (self.curProj === null || self.curProj === undefined || self.curProj === {} || self.curProj.uuid === undefined) {
//     if (self.curProjList.length > 0) {
//       self.curProj = self.curProjList[0];
//     }
//     // self.curProjExpandedKeys = [self.curProj.uuid];
//   }
//   self.curPro2Tree();
// };

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
  console.log(`onSelect = ${index}, point = ${JSON.stringify(point)}`);
  self.curPoint = point;
  if (point.length === 7 && window.GlobalUtil.model.robot.state.info.online === false) {
    window.GlobalUtil.model.robot.state.local.joints = point;
  }
  // window.GlobalUtil.model.robot.state.isTcp = true;
  window.GlobalUtil.model.robot.state.counter += 1;
};

self.curPro2Tree = () => {
  const tempDatas = [];
  for (let i = 0; i < self.curProjList.length; i += 1) {
    const proj = self.curProjList[i];
    const aChild = {};
    aChild.label = proj.name;
    aChild.uuid = proj.uuid;
    aChild.proType = proj.type;
    aChild.type = 'proj';
    aChild.ctime = proj.ctime;
    // const type = proj.name.split('_')[0];
    // if (type === 'continuous' || type === 'discontinuous') {
    //   aChild.proType = type;
    // }
    // else {
    //   aChild.proType = 'continuous';
    // }
    // // 先把 waypoint 去掉
    // if (aChild.proType === 'continuous') {
    //   continue;
    // }
    aChild.type = 'discontinuous';
    aChild.children = [];
    tempDatas.push(aChild);
    for (let j = 0; j < proj.files.length; j += 1) {
      const file = proj.files[j];
      const bChild = {};
      bChild.label = file.name;
      bChild.uuid = file.uuid;
      aChild.type = 'file';
      aChild.children.push(bChild);
    }
  }
  self.curProTreeDatas = tempDatas;
};

// self.curPoint = {
//   a0: 360,
//   a1: 360,
//   a2: 360,
//   a3: 360,
//   a4: 360,
//   a5: 360,
//   a6: 360,
// };

self.curPoint = [
  360,
  360,
  360,
  360,
  360,
  360,
  360,
];

self.curDuration = 0;
self.msMin = 0;
self.msMax = 1800;
const allX = [];
for (let i = 0; i <= self.msMax; i += 1) {
  allX.push(i);
}

// chart option
self.ch0 = {};
self.ch0.color = 'pink';

self.ch1 = {};
self.ch1.color = 'red';

self.ch2 = {};
self.ch2.color = 'lightgreen';

self.ch3 = {};
self.ch3.color = 'lightblue';

self.ch4 = {};
self.ch4.color = 'yellow';

self.ch5 = {};
self.ch5.color = 'blue';

self.ch6 = {};
self.ch6.color = 'lightpink';

self.chartOption = {
  title: {
    text: '',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c}',
  },
  legend: {
    left: 'left',
    data: ['CH0', 'CH1', 'CH2', 'CH3', 'CH4', 'CH5', 'CH6'],
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    name: 'x',
    // min: 0,
    // max: 5000,
    // nameLocation: 'start',
    splitLine: { show: true },
    data: allX,
  },
  yAxis: {
    type: 'value',
    // type: 'log',
    name: 'y',
    min: 0,
    max: 360,
    // nameLocation: 'start',
    splitLine: { show: true },
    // data: [-5000, -4000, -3000, -2000, -1000, 0, 1000, 2000, 3000, 4000, 5000],
  },
  grid: {
    // show: true,
    left: '5%',
    right: '5%',
    bottom: '5%',
    top: '10%',
    containLabel: true,
  },
  color: [self.ch0.color, self.ch1.color, self.ch2.color, self.ch3.color, self.ch4.color, self.ch5.color, self.ch6.color],
  series: [
    {
      name: 'CH0',
      type: 'line',
      data: [],
    },
    {
      name: 'CH1',
      type: 'line',
      data: [],
    },
    {
      name: 'CH2',
      type: 'line',
      data: [],
    },
    {
      name: 'CH3',
      type: 'line',
      data: [],
    },
    {
      name: 'CH4',
      type: 'line',
      data: [],
    },
    {
      name: 'CH5',
      type: 'line',
      data: [],
    },
    {
      name: 'CH6',
      type: 'line',
      data: [],
    },
  ],
};

self.pushPoint = (points) => {
  self.chartOption.series[0].data.push(points[0]);
  self.chartOption.series[1].data.push(points[1]);
  self.chartOption.series[2].data.push(points[2]);
  self.chartOption.series[3].data.push(points[3]);
  self.chartOption.series[4].data.push(points[4]);
  self.chartOption.series[5].data.push(points[5]);
  self.chartOption.series[6].data.push(points[6]);
}

self.fileData2ChartSeries = (uuid) => {
  const fileData = self.fileDatas[uuid];
  const fileDataLength = fileData.length;
  self.chartOption.series[0].data = [];
  self.chartOption.series[1].data = [];
  self.chartOption.series[2].data = [];
  self.chartOption.series[3].data = [];
  self.chartOption.series[4].data = [];
  self.chartOption.series[5].data = [];
  self.chartOption.series[6].data = [];
  for (let i = 0; i < fileDataLength; i += 1) {
    const oneData = fileData[i];
    self.chartOption.series[0].data.push(oneData[0]);
    self.chartOption.series[1].data.push(oneData[1]);
    self.chartOption.series[2].data.push(oneData[2]);
    self.chartOption.series[3].data.push(oneData[3]);
    self.chartOption.series[4].data.push(oneData[4]);
    self.chartOption.series[5].data.push(oneData[5]);
    self.chartOption.series[6].data.push(oneData[6]);
  }
};

// self.setPoint = (ch, index, value) => {
//   self.chartOption.series[ch].data[index] = value;
// };
//
// self.getPoint = (index) => {
//   const a0 = self.chartOption.series[0].data[index];
//   const a1 = self.chartOption.series[1].data[index];
//   const a2 = self.chartOption.series[2].data[index];
//   const a3 = self.chartOption.series[3].data[index];
//   const a4 = self.chartOption.series[4].data[index];
//   const a5 = self.chartOption.series[5].data[index];
//   const a6 = self.chartOption.series[6].data[index];
//   return [a0, a1, a2, a3, a4, a5, a6];
// };

// let isA0Add = true;
// let isA1Add = true;
// let isA2Add = true;
// let isA3Add = true;
// let isA4Add = true;
// let isA5Add = true;
// let isA6Add = true;

const isChAdd = [true, false, true, false, true, false];

self.pushTestData = (ch) => {
  // ch0
  const data = self.chartOption.series[ch].data;
  let diff = window.GlobalUtil.randomNumber(0, 10);
  const lastData = data[data.length - 1];
  if (lastData >= 360) {
    isChAdd[ch] = false;
  }
  else if (lastData <= 0) {
    isChAdd[ch] = true;
  }
  if (isChAdd[ch] === false) {
    diff = -diff;
  }
  data.push(lastData + diff);
};

self.genAndPushTestPoints = () => {
  self.chartOption.series[0].data.push(window.CommandsEditorSocket.getTestPost());
  self.chartOption.series[1].data.push(window.CommandsEditorSocket.getTestPost());
  self.chartOption.series[2].data.push(window.CommandsEditorSocket.getTestPost());
  self.chartOption.series[3].data.push(window.CommandsEditorSocket.getTestPost());
  self.chartOption.series[4].data.push(window.CommandsEditorSocket.getTestPost());
  self.chartOption.series[5].data.push(window.CommandsEditorSocket.getTestPost());
  self.chartOption.series[6].data.push(window.CommandsEditorSocket.getTestPost());
  // if (1 == 2) {
  //   self.chartOption.series[0].data.push(CommandsEditorSocket.getTestPost());
  //   self.chartOption.series[1].data.push(CommandsEditorSocket.getTestPost());
  //   self.chartOption.series[2].data.push(CommandsEditorSocket.getTestPost());
  //   self.chartOption.series[3].data.push(CommandsEditorSocket.getTestPost());
  //   self.chartOption.series[4].data.push(CommandsEditorSocket.getTestPost());
  //   self.chartOption.series[5].data.push(CommandsEditorSocket.getTestPost());
  //   self.chartOption.series[6].data.push(CommandsEditorSocket.getTestPost());
  // }
  // else {
  //   self.pushTestData(0);
  //   self.pushTestData(1);
  //   self.pushTestData(2);
  //   self.pushTestData(3);
  //   self.pushTestData(4);
  //   self.pushTestData(5);
  //   self.pushTestData(6);
  // }
};

self.testData = {};
self.testData.ch0 = [20];
self.testData.ch1 = [80];
self.testData.ch2 = [140];
self.testData.ch3 = [190];
self.testData.ch4 = [260];
self.testData.ch5 = [300];
self.testData.ch6 = [330];
self.randomNumber = (begin, end) => {
  return Math.floor(Math.random() * (end - begin)) + begin;
}
self.chs = [self.testData.ch0, self.testData.ch1, self.testData.ch2, self.testData.ch3, self.testData.ch4, self.testData.ch5, self.testData.ch6];
for (let i = 1; i < self.msMax; i += 1) {
  for (let j = 0; j < self.chs.length; j += 1) {
    const ch = self.chs[j];
    ch.push((ch[i - 1] + self.randomNumber(1, 3)) % 360);
  }
}

self.getTestData = (index) => {
  return [
    self.testData.ch0[index],
    self.testData.ch1[index],
    self.testData.ch2[index],
    self.testData.ch3[index],
    self.testData.ch4[index],
    self.testData.ch5[index],
    self.testData.ch6[index],
  ];
};

// end of chart option

export default self;
