<template lang="html">
  <div class="app-container com-module-wrapper">
    <CommonTopMenu2
      :backTitle="$t('record.recording')"
      :onBack="onBack">
    </CommonTopMenu2>

    <div class="emulator-area"  style="z-index:0;" :style="{left: isShowControl && model.commonStatusMgr.ControlPositionShow === false ? 0 : 100 + 'px'}">
      <slot name="xarm" :size="emulatorHeight" :controlsParams="{enableDrag: isShowControl !== true || model.commonStatusMgr.ControlPositionShow === true}"></slot>
    </div>

    <!--<div style="position:absolute;height:20px;bottom:150px;color:blue;font-size:8px;">-->
      <!--{{ model.localTeach.curShowRemark }}-->
      <!--&lt;!&ndash; 备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注 &ndash;&gt;-->
    <!--</div>-->
    <ListProj
      :cancelEdit="cancelEdit"
      class="cell-list-wrapper"
      :style="{'left': isShowControl ? 0 : 300 + 'px' }"
      id="bottom-right-frame"
      v-if="isSelectFile"
     >
    </ListProj>

    <!-- <ProjRunSetting
      :cancelEdit="cancelEdit"
      style="position:absolute;left:1px;bottom:100px;">
    </ProjRunSetting> -->

    <!-- <ProjSetting
      v-if="model.localTeach.curProj && model.localTeach.curProj.uuid !== undefined"
      style="left:80px;bottom:350px;"
      :scrollTo="scrollTo"
      :cancelEdit="cancelEdit"
      :onwinresize="onwinresize">
    </ProjSetting> -->

    
    <!-- <div class="point-remark tag" v-if="model.localTeach.curShowRemark !== '' || !model.localTeach.isTimer(model.localTeach.curSelectedIndex) && model.localTeach.curSelectedIndex >= 0">
      <div  v-if="!model.localTeach.isTimer(model.localTeach.curSelectedIndex) && model.localTeach.curSelectedIndex >= 0 && model.localTeach.curShowRemark == ''">
        <button class="point-remark-icon" @click="focusPointRemarkInput()"></button>
        <textarea
          @input="onRemarkChange"
          v-model="model.localTeach.curRemark"
          class="point-remark-input"
          id="point-remark-input-id"
        />
      </div>
       <span v-else class="remark-tip">{{ model.localTeach.curShowRemark }}</span>
    </div> -->
    
    <div
      class="com-side-control-wrapper"
      v-show="isShowControl === true && !model.localTeach.isTimer(model.localTeach.curSelectedIndex) || model.localTeach.isTeachRunningUUID !== ''"
      id="control-wrapper"
      style="right:0px;">
      <!-- <ComEmulatorControl></ComEmulatorControl> -->
      <!-- window.GlobalUtil.model.localTeach.isTimer(this.index) -->
      <commonxArmControlModel
        :isSpeedMode="model.localTeach.isTeachRunningUUID !== ''"
        style="top:0px;">
      </commonxArmControlModel>
    </div>
    <div class="projects-list-wrapper">
      <ProjRunSetting
        :cancelEdit="cancelEdit"
        style="">
      </ProjRunSetting>
      <div v-show="isShowControl === false">
        <h3>
          {{ $t('record.myProject') }}
          <el-dropdown split-button type="text" size="small" trigger="click" >
            <button class="add-file" @click="newProj()"><i class="el-icon-circle-plus"></i>{{ $t('record.project') }}</button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-upload
                  multiple
                  class="record-uploader"
                  :data="{path: `${constant.COMMON_PARAMS.userId}/${constant.COMMON_PARAMS.version}/record`}"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="handleUploadSuccess"
                  :before-upload="beforeUpload">
                  <i class="el-icon-upload2"></i>
                  {{ $t('import') }}
                </el-upload>
              </el-dropdown-item>
              <el-dropdown-item>
                <div style="positon:absolute;margin-top: 5px;" @click="download()"><i class="el-icon-download"></i> {{ $t('export') }}</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </h3>
        <div class="tree-wrapper" id="tree-wrapper">
          <!-- style="pointer-events:none;background:yellow;" -->
          <el-tree
            class="recording-project-list"
            :data="model.localTeach.curProTreeDatas"
            node-key="uuid"
            :class="{'disableDiv': model.localTeach.isTeachRunningUUID !== ''}"
            ref="tree"
            :default-expanded-keys="model.localTeach.curProjExpandedKeys"
            :expand-on-click-node="false"
            @node-expand="nodeExpand"
            @node-collapse="nodeCollapse"
            @node-click="handleNodeClick"
            :render-content="renderContent"
          >
          </el-tree>
        </div>
      </div>
    </div>

    <DialogTeachProjName
      :title="$t('proTitile')"
      :onok='oncreateok'
      v-if="model.localTeach.projTypeSelectedShow">
    </DialogTeachProjName>

    <DialogTeachProjName
      :title="renameTitle"
      :title_type="renameType"
      :onok='onrenameok'
      width='400'
      height='200'
      input_top='90'
      show_selected='false'
      v-if="model.localTeach.projRenameShow">
    </DialogTeachProjName>

    <DialogTeachAlert
      title='Your changes will be lost if you don’t save them.'
      cancel='Discard'
      ok='Save Change'
      :onok='onsave'
      :oncover='closeAlert'
      :oncancel='closeAlert'
      v-if="model.localTeach.changeSelectedShow===true">
    </DialogTeachAlert>

    <DialogTeachAlert
      :title='deleteFileDialogTitle'
      cancel='Cancel'
      ok='Delete'
      :onok='delProjOK'
      :isdelete=true
      :oncover='closeAlert'
      :oncancel='closeAlert'
      v-if="isDeleteFileDialogShow===true">
    </DialogTeachAlert>
  </div>
</template>
<script>

import Vue from 'vue';
import ToggleButton from 'vue-js-toggle-button';
// import OnePointSetting from './Teach/OnePointSetting';
import RunSetting from './Teach/RunSetting';
import ListProj from './Teach/ListProj';
import ProjSetting from './Teach/ProjSetting';
// import ElButton from "../../node_modules/element-ui/packages/button/src/button";
import DialogTeachProjName from './dialog/DialogTeachProjName';
// import XarmModel from './common/XarmModel';
// import ComEmulatorControl from './Control/ComEmulatorControl';
import CommonTopMenu2 from './common/CommonTopMenu2';
import EditPoints from './Teach/EditPoints';
import ProjRunSetting from './Teach/ProjRunSetting';
// import EditSpeed from './Teach/EditSpeed';
// import { constants } from 'perf_hooks';
import * as types from './../store/mutation-types';
import DialogTeachAlert from './dialog/DialogTeachAlert';
import DialogAlert from './dialog/DialogAlert';
import CommonSetControlEdit from './common/CommonSetControlEdit'
import commonxArmControlModel from './common/commonxArmControlModel'

Vue.use(ToggleButton);
const path = require('path');

export default {
  i18n: {
    messages: {
      en: {
        deleteTip: 'Are you sure you want to delete',
        proTitile: 'Create a new single point recording project',
        renameProTitle: 'Please rename your project',
        renameFileTitle: 'Please rename your file',
        editing: 'Points is editing!',
        export: 'Export',
        import: 'Import',
        uploadSuccess: 'Upload success',
        uploadFailed: 'Upload failed, content error',
        uploadUnCompatible: 'Engineering is not compatible',
        uploadFmtLimit: 'Only supports .gz format',
        uploadSizeLimit: 'Upload size can not over 10M',
        downloadSuccess: 'Download success',
        downloadFailed: 'Download failed',
      },
      cn: {
        deleteTip: '你确定要删除',
        proTitile: '新建单点录制项目',
        renameProTitle: '修改项目名',
        renameFileTitle: '修改文件名',
        editing: '正在编辑!',
        export: '导出',
        import: '导入',
        uploadSuccess: '上传成功',
        uploadFailed: '上传失败, 内容不对',
        uploadUnCompatible: '上传的工程与机械臂不兼容',
        uploadFmtLimit: '只支持.gz格式',
        uploadSizeLimit: '上传大小不能超过10M',
        downloadSuccess: '下载成功',
        downloadFailed: '下载失败',
      },
    },
  },
  data() {
    return {
      socketCom: window.GlobalUtil.socketCom,
      model: window.GlobalUtil.model,
      constant: window.GlobalConstant,
      uploadUrl: `http://${window.GlobalUtil.socketInfo.host}/project/upload`,
      realData: [],
      disableDiv: false,
      oldDelayTime: 2,
      protype: '',
      folderOrFile: '',
      title: '',
      renameTitle: '',
      renameType: '',
      inputText: '',
      // clientWidth: 100,
      // clientHeight: 200,
      // rightFrameWidth: 320,
      rightFrameWidth: 276,
      bottomLeftWidth: 200,
      bottomRightWidth: 0,
      // editState: false,
      isDeleteFileDialogShow: false,
      deleteFileDialogTitle: '',
      delProjOK: null,
      // curProjTotal: 0,
      fileIcon: {
        front: require('../assets/img/edit/recording/icon_pathfile_grey.svg'),
        discontinuous: require('../assets/img/edit/recording/icon_singlepoint_14x14_dark.svg'),
        continuous: require('../assets/img/edit/recording/icon_waypoint_14x14_dark.svg'),
        discontinuous_white: require('../assets/img/edit/recording/icon_singlepoint_14x14_white.svg'),
        continuous_white: require('../assets/img/edit/recording/icon_waypoint_14x14_white.svg'),
        pathFileGrey: require('../assets/img/edit/recording/icon_pathfile_grey.svg'),
        rename: require('../assets/img/edit/recording/icon_rename_white.svg'),
        delete: require('../assets/img/edit/recording/btn_trash_white.svg'),
        file: require('../assets/img/ide/icon_addfile.svg'),
      },
      emulatorHeight: null,
      listHeight: '480px',
      treeHeight: '408px',
    };
  },
  mounted() {
    this.model.commonStatusMgr.changeControlEditTab = true;
    console.log('isSelectFile', this.isSelectFile);
    this.model.localTeach.tree = this.$refs.tree;
    this.model.localTeach.hasChange = false;
    this.model.robot.state.showSetControlValueDialog = true;
    this.model.commonStatusMgr.showToggleBtn = true;
    window.addEventListener('resize', this.onwinresize, false);
    this.onwinresize();
    setTimeout(() => {
      this.onwinresize();
    });
    const self = this;
    setTimeout(() => {
      window.CommandsTeachSocket.listProjs((dict) => {
        // this.$refs.tree.setCurrentKey(this.model.localTeach.curSelectedTreeItem.uuid);
        const uuid = this.model.localTeach.curSelectedTreeItem.uuid;
        console.log('curSelectedTreeItem.uuid = 1 = ' + uuid);
        setTimeout(() => {
          if (uuid) {
            console.log('curSelectedTreeItem.uuid = 2 = ' + uuid);
            this.getFile(uuid);
            this.handleNodeClick({ uuid: uuid });
            console.log('curSelectedTreeItem.uuid = 3 = ' + uuid);
          }
        }, 200);
      });
      console.log('sssaaa', self.model.localTeach.curProTreeDatas);
    }, 200);
  },
  activated: function() {
    this.onwinresize();
  },
  deactivated: function() {
    this.onwinresize();
  },
  methods: {
    focusPointRemarkInput() {
      const ele = document.getElementById('point-remark-input-id')
      if (ele !== null) {
        ele.focus();
        ele.select();
      }
    },
    onBack() {
      if (this.model.localTeach.isTeachRunningUUID !== '') {
        this.$message({
          message: this.$t('editing'),
          duration: 1000,
        })
        return;
      }
      if (this.model.localTeach.editState) {
        this.$message({
          message:  this.$t('editing'),
          duration: 1000,
        })
        return;
      }
      // this.$router.push('EditHome');
      // this.$router.push({ name: 'EditHome' });
      this.$router.go(-1);
    },
    oncreateok() {
      const text = this.model.localTeach.curDialogProjInputText;
      window.CommandsTeachSocket.createProj(text, window.GlobalUtil.model.localTeach.projTypeSelected, (dict) => {
        if (dict.code === 0) {
          const newProjUUID = this.model.localTeach.curProj.uuid;
          const proj = this.model.localTeach.getProjInfo(newProjUUID);
          this.model.localTeach.curProj = proj;
          console.log(proj);
          setTimeout(() => {
            const newProjUUID = this.model.localTeach.curProj.uuid;
            const newFileUUID = path.join(newProjUUID, 'single');
            this.handleNodeClick({ uuid: newFileUUID });
          }, 200);
        }
      });
      window.GlobalUtil.model.localTeach.projTypeSelectedShow = false;
    },
    onRemarkChange() {
      console.log('onRemarkChange onRemarkChange');
      this.model.localTeach.hasChange = true;
      // this.model.localTeach.onSelect(null, this.model.localTeach.curSelectedIndex);
    },
    createNewFile() {
      const self = this;
      // const point = {
      //   type: 'joint',
      //   point: [],
      //   remark: 'remark',
      // };
      // const text = JSON.stringify(textDict);
      const dateStr = window.GlobalUtil.getTimeString();
      const curProj = self.model.localTeach.curProj;
      const filePath = path.join(curProj.uuid, dateStr);
      // self.model.localTeach.addCurProjExpandedKeys(curProj.uuid);
      this.model.localTeach.addCurProjExpandedKeys(curProj.uuid);
      this.model.localTeach.addCurProjExpandedKeys(filePath);
      window.CommandsTeachSocket.createFile(dateStr, [], () => {
      }, () => {
        window.GlobalUtil.model.localTeach.saveDialogShow = false;
        setTimeout(() => {
          // self.$refs.tree.setCurrentKey(filePath);
          this.model.localTeach.curEditingFileUUID = filePath;
          if (this.$refs.tree) {
            this.$refs.tree.setCurrentKey(filePath);
          }
          this.model.localTeach.setCurSelectedTreeItem(filePath);
          self.handleNodeClick({ uuid: filePath });
          this.scrollTo(0);
        }, 200);
      });
    },
    cancelEdit() {
      if (this.model.localTeach.hasChange && this.model.localTeach.curSelectedIndex >= 0) {
        this.$message({
          message:  this.$t('editing'),
          duration: 1000,
        })
        return;
      }
      console.log('cancelEdit cancel Edit')
      const self = this;
      this.model.localTeach.editState = false;
      this.model.localTeach.hasChange = false;
      this.model.localTeach.onSelect(null, -1);
    },
    onsave() {
      this.model.localTeach.onSaveChange(() => {
        this.model.localTeach.changeSelectedShow = false;
        this.model.localTeach.hasChange = false;
        this.model.localTeach.onSelect(null, this.model.localTeach.willOnSelectIndex);
        this.model.robot.state.func.setRobotMoveAllJoints(this.model.localTeach.curPoint, true, () => {
        });
      });
    },
    closeAlert() {
      this.isDeleteFileDialogShow = false;
      this.model.localTeach.changeSelectedShow = false;
      this.model.localTeach.saveDialogShow = false;
      this.model.localTeach.hasChange = false;
      this.model.localTeach.onSelect(null, window.GlobalUtil.model.localTeach.willOnSelectIndex);
      this.model.robot.state.func.setRobotMoveAllJoints(this.model.localTeach.curPoint, true, () => {
      });
    },
    onrenameok() {
      const self = this;
      const text = this.model.localTeach.curDialogProjInputText;
      this.model.localTeach.projRenameShow = false;
      const projTypeSelected = this.model.localTeach.projTypeSelected;
      // const pre = projTypeSelected === '1' ? 'continuous_' : 'discontinuous_';
      // text = `${pre}${text}`;
      console.log(`onrename text = ${text}`);
      const curProjUUID = this.model.localTeach.curProj.uuid;
      if (this.model.localTeach.projTypeSelected === '0') {
        const filePath = path.join(curProjUUID, text);
        // rename file
        window.CommandsTeachSocket.renameFile(text, () => {
          setTimeout(() => {
            if (self.$refs.tree) {
              self.$refs.tree.setCurrentKey(filePath);
            }
            this.model.localTeach.setCurSelectedTreeItem(filePath);
            this.handleNodeClick({ uuid: filePath });
          });
        });
      }
      else {
        const filePath = path.join(path.dirname(curProjUUID), text);
        // rename proj
        window.CommandsTeachSocket.renameProj(text, () => {
          this.model.localTeach.addCurProjExpandedKeys(filePath);
          setTimeout(() => {
            if (self.$refs.tree) {
              self.$refs.tree.setCurrentKey(filePath);
            }
            this.model.localTeach.setCurSelectedTreeItem(filePath);
            this.handleNodeClick({ uuid: filePath });
          });
        });
      }
    },
    onrename(data) {
      console.log('test test onrename');
      // this.disableDiv = true;
      // setTimeout(() => {
      // });
      const uuid = data.uuid;
      console.log(`rename data uuid = ${uuid}`)
      this.model.localTeach.projRenameShow = true;
      this.model.localTeach.curDialogProjInputText = this.model.localTeach.getRealProjFileName(path.basename(uuid));
      this.model.localTeach.projTypeSelected = '2';
      // if (uuid.indexOf('discontinuous_') >= 0) {
      //   this.model.localTeach.projTypeSelected = '2';
      // }
      // else {
      //   this.model.localTeach.projTypeSelected = '1';
      // }
      if (uuid !== this.model.localTeach.curProj.uuid) {
        console.log('is file');
        this.renameType = 'file';
        this.renameTitle = this.$t('renameFileTitle');
        this.model.localTeach.projTypeSelected = '0';
        this.model.localTeach.curDialogProjInputText = path.basename(uuid);
      }
      else {
        this.renameType = 'proj';
        this.renameTitle = this.$t('renameProTitle');
        console.log('is proj');
      }
      window.GlobalUtil.setInputFocus();
    },
    scrollTo(time) {
      const bottomRightFrame = document.getElementById('bottom-right-frame');
      if (bottomRightFrame) {
        bottomRightFrame.scrollTop = 1800 * time; // 60 * (parseInt(time / 10) * 10);
        console.log('scrollTop', bottomRightFrame.scrollTop);
      }
    },
    delProj(uuid) {
      const realName = this.model.localTeach.getRealFileFileName(uuid)
      // const curProjUUID = this.model.localTeach.curProj.uuid;
      if (this.model.localTeach.curProj.uuid !== uuid) {
        this.isDeleteFileDialogShow = true;
        this.delProjOK = () => {
          this.isDeleteFileDialogShow = false;
          window.CommandsTeachSocket.delFiles(uuid, (dict) => {
            console.log(`localTeach del file = ${uuid}, dict = ${JSON.stringify(dict)}`);
            const dirname = path.dirname(uuid);
            // this.handleNodeClick({ uuid: dirname });
            this.model.localTeach.showArr = [];
            setTimeout(() => {
              if (this.$refs.tree) {
                this.$refs.tree.setCurrentKey(dirname);
              }
              this.model.localTeach.setCurSelectedTreeItem(dirname);
              this.handleNodeClick({ uuid: dirname });
            }, 200);
          });
        };
        this.deleteFileDialogTitle = this.$t('deleteTip') + ` ${realName}?`;
        return;
      }
      const curProj = this.model.localTeach.curProj;
      this.deleteFileDialogTitle = this.$t('deleteTip') + ` ${curProj.name}?`;
      this.delProjOK = () => {
        this.isDeleteFileDialogShow = false;
        window.CommandsTeachSocket.delProj(curProj.uuid, () => {
          this.model.localTeach.showArr = [];
          setTimeout(() => {
            const proList = this.model.localTeach.curProjList;
            if (proList.length > 0) {
              const proj = proList[0];
              this.model.localTeach.curProj = proj;
              if (this.$refs.tree) {
                this.$refs.tree.setCurrentKey(proj.uuid);
              }
              this.model.localTeach.setCurSelectedTreeItem(proj.uuid);
              this.handleNodeClick({ uuid: proj.uuid });
            }
          }, 200);
        });
      };
      this.isDeleteFileDialogShow = true;
    },
    newProj() {
      window.GlobalUtil.model.localTeach.curDialogProjInputText = '';
      window.GlobalUtil.model.localTeach.projTypeSelectedShow = true;
      window.GlobalUtil.setInputFocus();
    },
    addFile() {
      console.log('add file');
      // this.folderOrFile = 'file';
      this.title = 'add file';
      this.inputText = '';
    },
    onwinresize() {
      const clientWidth = document.body.clientWidth;
      const clientHeight = document.body.clientHeight;
      // const leftFrame = document.getElementById('left-teach-frame');
      // const bottomRightFrame = document.getElementById('bottom-right-frame');
      const totalFrameWidth = clientWidth - 0; // 8;
      const totalFrameHeight = clientHeight - 120;

      // const leftBottomArea = document.getElementById('left-bottom-area');
      // const rightFrame = document.getElementById('tree-wrapper');
      const controlWrapper = document.getElementById('control-wrapper');
      // const leftControl = document.getElementById('left-control');
      // const leftShow = document.getElementById('left-show');
      const leftPanelWidth = 0; // 0; //
      const leftFrameWidth = totalFrameWidth - 0; // this.rightFrameWidth;

      // if (leftFrame) {
      //   leftFrame.style.width = `${leftFrameWidth - leftPanelWidth}px`;
      // }
      // if (bottomRightFrame) {
      //   this.bottomRightWidth = totalFrameWidth - 0;//this.rightFrameWidth; // - this.bottomLeftWidth
      //   bottomRightFrame.style.width = `${this.bottomRightWidth - leftPanelWidth}px`; // '100%'; //
      // }
      const bottomHeight = 100;
      const leftTopHeight = (totalFrameHeight - bottomHeight) + 50; // 50;
      // if (leftTopArea) {
        // leftTopArea.style.height = `${leftTopHeight}px`;
        // leftTopArea.style.width = `${leftFrameWidth - leftPanelWidth}px`;
        // this.emulatorHeight = leftTopHeight
      // }
      // if (rightFrame) {
      //   rightFrame.style.height = `${totalFrameHeight - 0}px`;
      // }
      if (controlWrapper) {
        // controlWrapper.style.height = `${totalFrameHeight + 50}px`;
        // controlWrapper.style.height = `${totalFrameHeight + 60}px`;
      }
      console.log('debug:', window.innerHeight, window.innerWidth, clientHeight, clientWidth);
      this.listHeight = clientHeight - 170 + 'px';
      this.treeHeight = clientHeight - 250 + 'px';
      if (document.getElementsByClassName('tree-wrapper')[0] !== undefined) {
        document.getElementsByClassName('tree-wrapper')[0].style.height = clientHeight - 190 + 'px';
      }
      if (document.getElementsByClassName('cell-list-wrapper')[0] !== undefined) {
        document.getElementsByClassName('cell-list-wrapper')[0].style.height = clientHeight - 125 + 'px';
      }
    },
    nodeExpand(data) {
      console.log('nodeExpand = ' + JSON.stringify(data));
      this.model.localTeach.addCurProjExpandedKeys(data.uuid);
    },
    nodeCollapse(data) {
      console.log('nodeCollapse = ' + JSON.stringify(data));
      this.model.localTeach.removeCurProjExpandedKeys(data.uuid);
    },
    handleNodeClick(data) {
      console.log('test test handle node click');
      setTimeout(() => {
        this.onwinresize();
      }, 200);
      console.log('handleNodeClick = ' + data);
      if (this.model.localTeach.projRenameShow === true) {
        return;
      }
      this.cancelEdit();
      const uuid = data.uuid;
      console.log('handleNodeClick uuid = ' + data.uuid);
      this.model.localTeach.setCurSelectedTreeItem(uuid);
      const proj = this.model.localTeach.getProjInfo(uuid);
      if (proj === null) {
        return;
      }
      this.model.localTeach.curProj = proj;
      const file = this.model.localTeach.getTeachFileInfo(proj, uuid);

      this.protype = proj.type;

      const curProj = this.model.localTeach.getCurProj(uuid);
      if (curProj) {
        this.model.localTeach.curProj = curProj;
        console.log('this is proj');
        // this.model.localTeach.addOrRemoveCurProjExpandedKeys(uuid);
        this.model.localTeach.showArr = [];
        window.CommandsTeachSocket.getProjFiles(uuid, (dict) => {
          console.log('get proj files = ' + JSON.stringify(dict));
          if (dict.code === 0) {
            console.log(`total = ${dict.data.pointCount}`);
            this.model.localTeach.projSingleTotalCount = dict.data.pointCount;
          }
        });
      }
      if (file !== null && file !== undefined) {
        this.getFile(uuid);
      }
    },
    getFile(uuid) {
      window.CommandsTeachSocket.getFile(uuid, (dict) => {
        console.log(`CommandsTeachSocket getFile dict = ${JSON.stringify(dict)}`);
        if (dict.code === 0) {
          const data = dict.data;
          if (data === '' || data === undefined || data === null) {
            this.model.localTeach.fileDatas[uuid] = [];
          }
          else {
            // data = JSON.parse(data);
            // const isContinus = data.type === 'continuous';
            const points = data.points.map((point) => { return point.point });
            this.model.localTeach.curPointRemarks = data.points.map((point) => { return point.remark });
            // const type = data.tpye;
            // file.storeType = 'discontinuous'; //data.type;
            // file.isContinus = isContinus;
            this.model.localTeach.fileDatas[uuid] = points;
          }
          this.model.localTeach.projSingleTotalCount = this.model.localTeach.fileDatas[uuid].length;
          this.model.localTeach.showArr = this.model.localTeach.fileDatas[uuid].map((item, i) => {
            return i;
          });
          this.model.localTeach.curEditingFileUUID = uuid;
          this.model.localTeach.onSelect(null, -1);
        }
      });
    },
    renderContent(h, { node, data, store }) {
      // console.log(data + node + store);
      // console.log(node);
      // console.log(store);
      // console.log(data);
      console.log(`render content data = ${JSON.stringify(data)}`);
      let iconUrl = '';
      if (data.proType === 'continuous') {
        iconUrl = `background:url('${this.fileIcon.continuous}')`;
        if (this.model.localTeach.curSelectedTreeItem.uuid === data.uuid) {
          iconUrl = `background:url('${this.fileIcon.continuous_white}')`;
        }
      }
      if (data.proType === 'discontinuous') {
        iconUrl = `background:url('${this.fileIcon.discontinuous}')`;
        if (window.GlobalUtil.model.localTeach.curSelectedTreeItem.uuid === data.uuid) {
          iconUrl = `background:url('${this.fileIcon.discontinuous_white}')`;
        }
      }
      const isFile = data.type === 'file';
      const iconStyle = `${iconUrl} no-repeat center left;padding-left: ${isFile ? 0 : 20}px;`;
      const label = window.GlobalUtil.model.localTeach.getRealProjFileName(data.label);
      console.log('pointCount pointCount data = ' + data.pointCount);
      const createFile = `background:url('${this.fileIcon.file}') no-repeat center;width:15px;height:15px;`;
      const renameFile = `background:url('${this.fileIcon.rename}') no-repeat center;width:15px;height:15px;margin: 0 10px;`;
      const deleteFile = `background:url('${this.fileIcon.delete}') no-repeat center;width:15px;height:15px;margin-right: 10px;`;
      const downloadStyle = 'width:20px;height:20px;margin-right:15px;positon:absolute;margin-top: 5px;'
      return (
        <span class="tree-list" style="">
          <span style={iconStyle}>{label}({data.pointCount})</span>
          <span class="display-none" style="line-height: 8px;">
            { (isFile === false) ? <div style={downloadStyle}  on-click={ () => this.download(data) }><i class="el-icon-download"></i></div> : <span style="display:none"></span> }
            { (isFile === false) ? <el-button style={createFile} size="medium" type="text" on-click={ () => this.createNewFile() }></el-button> : <span style="display:none"></span> }
            <el-button style={renameFile} size="medium" type="text" on-click={ () => this.onrename(data) }></el-button>
            <el-button style={deleteFile} size="medium" type="text" on-click={ () => this.delProj(data.uuid) }></el-button>
          </span>
      </span>);
    },
    download(data) {
      if (data === undefined) {
        data = {
          uuid: '/record',
          label: 'all-projects'
        }
      }
      let name = data.label;
      let url = `http://${window.GlobalUtil.socketInfo.host}/project/download?path=${window.GlobalConstant.COMMON_PARAMS.userId}/${window.GlobalConstant.COMMON_PARAMS.version}${data.uuid}`
      name += '.tar.gz';
      // if (data.type === 'file') {
      //   name += '.json';
      // }
      // else {
      //   name += '.tar.gz';
      // }
      fetch(url)
        .then((response) => {
          response.blob().then((blob) => {
            const a = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            const filename = 'record-' + name;
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
            this.$message({
              message: `${this.$t('downloadSuccess')}: ${filename}`,
              type: 'success',
              duration: 0,
              showClose: true,
            });
            // this.$message.success(`${this.$t('downloadSuccess')}: ${filename}`);
          }).catch((e) => {
            this.$message.error(`${this.$t('downloadFailed')}: ${e}`);
          })
        })
        .catch((e) => {
          this.$message.error(`${this.$t('downloadFailed')}: ${e}`);
        })
      // fetch(url).then(response => response.blob().then((blob) => {
      //   const a = document.createElement('a');
      //   const url = window.URL.createObjectURL(blob);
      //   const filename = 'record-' + name;
      //   a.href = url;
      //   a.download = filename;
      //   a.click();
      //   window.URL.revokeObjectURL(url);
      // }))
    },
    handleUploadSuccess(res, file) {
      if (res.success === undefined || res.success === -2) {
        this.$message.error(this.$t('uploadFailed'));
        return;
      }
      else if (res.success === -1) {
        this.$message.error(this.$t('uploadUnCompatible'));
        return;
      }
      this.$message.success(this.$t('uploadSuccess'))
      window.CommandsTeachSocket.listProjs((dict) => {
        const uuid = this.model.localTeach.curSelectedTreeItem.uuid;
        setTimeout(() => {
          if (uuid) {
            this.getFile(uuid);
            this.handleNodeClick({ uuid: uuid });
          }
        }, 200);
      });
    },
    beforeUpload(file) {
      // const isGZip = file.type === 'application/x-gzip';
      const isGZip = file.type.indexOf('gzip') === -1 ? false : true;
      // const isXml = file.type === 'text/xml';
      const isLimit10M = file.size / 1024 / 1024 < 10;
      if (!isGZip) {
          this.$message.error(this.$t('uploadFmtLimit'));
        }
        if (!isLimit10M) {
          this.$message.error(this.$t('uploadSizeLimit'));
        }
        return isGZip && isLimit10M;
    }
  },
  beforeDestroy() {
    this.model.commonStatusMgr.changeControlEditTab = true;
  },
  components: {
    // OnePointSetting,
    ListProj,
    DialogTeachProjName,
    // ComEmulatorControl,
    DialogTeachAlert,
    DialogAlert,
    CommonSetControlEdit,
    RunSetting,
    ProjSetting,
    CommonTopMenu2,
    EditPoints,
    ProjRunSetting,
    commonxArmControlModel
    // EditSpeed,
  },
  computed: {
    localJoints: {
      get() {
        const arr = this.$store.getters.localJoints;
        return arr;
      },
    },
    isShowControl() {
      const model = window.GlobalUtil.model;
      return model.localTeach.editState === true;
    },
    isRunning() {
      return this.model.localTeach.isTeachRunningUUID !== '';
    },
    isSelectFile: {
      get() {
        return this.model.localTeach.curSelectedTreeItem.type === 'file';
      },
      set(value) {
        this.model.localTeach.curSelectedTreeItem.type = value;
      },
    },
  },
  watch: {
    localJoints(newValue) {
      // console.log('teach watch local joints = ' + newValue);
      this.model.localTeach.curPoint = newValue;
    },
  },
};

</script>
<style lang="scss" scoped>
.app-container {
  position: absolute;
  left: 0px;
  top: 0px;
  overflow: hidden;
  // display: flex;
  // flex-direction: column;
  .emulator-area {
    position: absolute;
    // box-shadow: 0 0 6px 0 rgba(205,205,205,0.50);
    border-radius: 8px;
    width: 100%;
    height: 100%;
    // height: 300px;
  }
  .cell-list-wrapper {
    position:absolute;
    height:85%;
    width:300px;
    display:flex;
    left: 300px;
    top: 126px;
    z-index: 99;
    // border: 1px solid #d8dce5;
    background: rgba(212, 213, 215, 0.5);
  }
  .point-remark {
    position: absolute;
    width: 260px;
    height: 100px;
    // height: 30px;
    left: 160px;
    bottom: 160px;
    border: 1px solid #c8c8c8;
    border-radius: 10px;
    // color: gray;
    // background-color: gray;
    .point-remark-icon {
      width: 20px;
      height: 20px;
      border: 0px;
      background: url("../assets/img/edit/recording/btn_info.svg") no-repeat center;
      cursor: pointer;
      position: absolute;
      top: 10px;
      left: 6px;
    }
    textarea {
      height: 85px;
      width: 210px;
      color: gray;
      border: 0px;
      background: transparent;
      position: absolute;
      top: 10px;
      left: 36px;
    }
    textarea:focus {
      color: rgb(73, 142, 245);
    }
    .remark-tip {
      width: 100%;
      height: 100%;
      display: block;
      padding: 10px;
      color: gray;
    }
  }
}
.tag{
  /*width:300px;*/
  /*height:100px;*/
  /*border:5px solid #09F;*/
  position:relative;
  background-color:#FFF;
}
.tag:before,.tag:after{
  content:"";
  display:block;
  border-width:20px;
  position:absolute;
  bottom:-40px;
  left:80px;
  border-style: solid dashed dashed;
  border-color: #c8c8c8 transparent transparent;
  font-size:0;
  line-height:0;
}
.tag:after{
  bottom:-38px;
  border-color:#FFF transparent transparent;
}

.projects-list-wrapper {
  // width: 320px;
  // width: 276px;
  // height: 480px;
  height: 90%;
  width: 300px;
  // top: 40px;
  // top: 100px;
  left: 0;
  // right: 0px;
  // left: 0;
  /*min-width: 300px;*/
  /*max-width: 400px;*/
  // background: #EDEDED;
  /*z-index: 9000;*/
  background: white;
  // height: 450px;
  // overflow-x: scroll;
  overflow-x: hidden;
  overflow-y: hidden;
  // border: 1px solid #DFDFDF;
  // position: relative;
  position: absolute;
  // border-bottom: 1px solid #d8dce5;
  h3 {
    height: 58px;
    line-height: 58px;
    font-family: 'Gotham-Bold';
    font-size: 1.1rem;
    color: #444;
    letter-spacing: -1.33px;
    padding: 0 22px;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid  #d8dce5;
    .add-file {
      border: none;
      outline: 0;
      cursor: pointer;
      font-size: 14px;
      color: #8E959D;
      font-family: 'Gotham-Book';
      .el-icon-circle-plus {
        margin-right: 6px;
      }
    }
  }
  .tree-wrapper {
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 13px;
    height: 80vh;
  }
}
.display-none {
  display: none;
}

.tree-wrapper::-webkit-scrollbar {/*滚动条整体样式*/
  width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 12px;
}
.tree-wrapper::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #7E7E7E;
}
.tree-wrapper::-webkit-scrollbar-track {/*滚动条里面轨道*/
   box-shadow: inset 0 0 5px transparent;
  border-radius: 0;
  // background: #434343;
  background: rgba(230,231,232,1);
}
</style>
<style lang="scss">
.tree-list {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-family: 'Gotham-Book';
}
.recording-project-list {
  background: #fff;
  // width: 276px;
}
.recording-project-list .el-tree-node__content {
  height: 36px;
}
/*.recording-project-list .el-tree-node.is-expanded>.el-tree-node__children {*/
  /*background: #E8E8E8;*/
/*}*/
/*.recording-project-list .el-tree-node__expand-icon.is-leaf:before{*/
  /*background: url("../assets/img/edit/recording/icon_pathfile_grey.svg") no-repeat center left;*/
  /*padding: 10px;*/
/*}*/
/*.recording-project-list .el-tree-node.is-current >.el-tree-node__content .el-tree-node__expand-icon.is-leaf:before{*/
  /*background: url("../assets/img/edit/recording/icon_pathfile_white.svg") no-repeat center left;*/
/*}*/
.recording-project-list .el-tree-node.is-current>.el-tree-node__content {
  background-color: #575C62;
  color: #fff;
}
.recording-project-list .el-tree-node.is-current>.el-tree-node__content .display-none {
  display: flex;
}
.disableDiv {
  pointer-events: none;
}
</style>
