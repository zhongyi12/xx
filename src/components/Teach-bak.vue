<template lang="html">
  <div class="app-container com-module-wrapper">
    <CommonTopMenu2
      :backTitle="$t('record.recording')"
      :onBack="onBack">
    </CommonTopMenu2>
    <div class="main-contain">
      <div class="recording-area-wrapper" id="left-teach-frame">
        <!-- emulator -->
        <div class="left-top-area" id="left-top-area">
          <slot name="xarm" :size="emulatorHeight"></slot>
          <!-- <div class="left-emulator" id="left-emulator"> -->
            <!-- <XarmModel :size="emulatorHeight"></XarmModel> -->
          <!-- </div> -->
          <ProjSetting
            v-if="model.localTeach.curProj && model.localTeach.curProj.uuid !== undefined"
            style="left:0px;bottom:280px;"
            :scrollTo="scrollTo"
            :finishRecordOK="finishRecordOK"
            :cancelEdit="cancelEdit"
            :onwinresize="onwinresize">
          </ProjSetting>
        </div>
        <!-- left bottom -->
        <div class="left-bottom-area" id="left-bottom-area">
          <ListProj style="height:100px;bottom:0px;" id="bottom-right-frame" :parentWidth="bottomRightWidth"></ListProj>
          <div style="position:absolute;width:320px;height:100px;right:284px;bottom:113px;">
            <div v-if="model.localTeach.editState === true && (model.localTeach.curSelectedIndex >= 0 || model.localTeach.showArr.length === 0)" class="position-absolute" style="">
              <EditPoints></EditPoints>
            </div>
          </div>
        </div>
        <!-- left bottom end -->
      </div>
      <!-- right -->
      <!-- <div v-show="isShowControl === true" id="control-wrapper" style="position:absolute;width:276px;height:100%;right:0px;overflow:hidden">
        <CommonSetControlEdit style="top:0px;"></CommonSetControlEdit>
      </div> -->
      <div v-show="isShowControl === false" class="projects-list-wrapper">
        <h3>{{ $t('record.myProject') }}<button class="add-file" @click="newProj()"><i class="el-icon-circle-plus"></i>{{ $t('record.project') }}</button></h3>
        <div class="tree-wrapper" id="tree-wrapper">
          <el-tree
            class="recording-project-list"
            :data="model.localTeach.curProTreeDatas"
            node-key="uuid"
            ref="tree"
            :default-expanded-keys="model.localTeach.curProjExpandedKeys"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            :render-content="renderContent"
          >
          </el-tree>
        </div>
      </div>
      <!-- right end -->
    </div>

    <DialogTeachProjName
      title="Please choose the way you want to record with xArm in this project"
      :onok='oncreate'
      v-if="model.localTeach.projTypeSelectedShow">
    </DialogTeachProjName>

    <DialogTeachProjName
      title="Please rename your project"
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

    <DialogTeachAlert
      title='Stop Recording and save automatically.'
      subtitle='The recording file will be saved to my project list'
      cancel='Discard'
      ok='OK'
      :onok='finishRecordOK'
      :isdelete=false
      :oncover='closeAlert'
      :oncancel='closeSaveAlert'
      v-if="model.localTeach.saveDialogShow===true">
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
// import EditSpeed from './Teach/EditSpeed';
// import { constants } from 'perf_hooks';
import * as types from './../store/mutation-types';
import DialogTeachAlert from './dialog/DialogTeachAlert';
import DialogAlert from './dialog/DialogAlert';
import CommonSetControlEdit from './common/CommonSetControlEdit'

Vue.use(ToggleButton);
const path = require('path');

export default {
  data() {
    return {
      socketCom: window.GlobalUtil.socketCom,
      model: window.GlobalUtil.model,
      realData: [],
      oldDelayTime: 2,
      protype: '',
      folderOrFile: '',
      title: '',
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
    };
  },
  mounted() {
    this.model.robot.state.showSetControlValueDialog = true;
    window.addEventListener('resize', this.onwinresize, false);
    this.onwinresize();
    setTimeout(() => {
      this.onwinresize();
    });
    const self = this;
    window.CommandsTeachSocket.listProjs((dict) => {
      setTimeout(() => {
        // const uuid = window.GlobalUtil.model.localTeach.curSelectedTreeItem.uuid;
        const filePath = this.model.localTeach.curProj.uuid;
        self.$refs.tree.setCurrentKey(filePath);
        self.handleNodeClick({ uuid: filePath });
      }, 100);
    });
    console.log('sssaaa', self.model.localTeach.curProTreeDatas)
  },
  activated: function() {
    this.onwinresize();
  },
  deactivated: function() {
    this.onwinresize();
  },
  methods: {
    onBack() {
      if (this.model.localTeach.isTeachRunningUUID !== '') {
        this.$message('Recording is running!')
        return;
      }
      if (this.model.localTeach.editState) {
        this.$message('Points is editing!')
        return;
      }
      // this.$router.push('EditHome');
      // this.$router.push({ name: 'EditHome' });
      this.$router.go(-1);
    },
    oncreate() {
      const text = this.model.localTeach.curDialogProjInputText;
      window.CommandsTeachSocket.createProj(text, window.GlobalUtil.model.localTeach.projTypeSelected);
      window.GlobalUtil.model.localTeach.projTypeSelectedShow = false;
    },
    createNewFile() {
      const self = this;
      const point = {
        type: 'joint', // this.model.localTeach.curProj.type,
        point: [0, 0, 0, 0, 0, 0, 0],
        remark: 'remark',
      };
      // const text = JSON.stringify(textDict);
      const dateStr = window.GlobalUtil.getTimeString();
      window.CommandsTeachSocket.createFile(dateStr, [point], () => {
      }, () => {
        const curProj = self.model.localTeach.curProj;
        const filePath = path.join(curProj.uuid, dateStr);
        window.GlobalUtil.model.localTeach.saveDialogShow = false;
        setTimeout(() => {
          self.$refs.tree.setCurrentKey(filePath);
          window.GlobalUtil.model.localTeach.setCurSelectedTreeItem(filePath);
          self.handleNodeClick({ uuid: filePath });
          this.scrollTo(0);
        });
      });
    },
    finishRecordOK() {
      const self = this;
      window.GlobalUtil.model.localTeach.visible.starRecording = false;

      const curFileDatas = window.GlobalUtil.model.localTeach.fileDatas.temp;
      const textDict = {
        type: this.model.localTeach.curProj.type,
        total: curFileDatas.length,
        points: curFileDatas,
      };
      const text = JSON.stringify(textDict);
      const dateStr = window.GlobalUtil.getTimeString();
      // window.CommandsTeachSocket.createFile(dateStr, text, () => {
      // }, () => {
      //   const curProj = self.model.localTeach.curProj;
      //   const filePath = path.join(curProj.uuid, `${dateStr}.json`);
      //   window.GlobalUtil.model.localTeach.saveDialogShow = false;
      //   setTimeout(() => {
      //     self.$refs.tree.setCurrentKey(filePath);
      //     window.GlobalUtil.model.localTeach.setCurSelectedTreeItem(filePath);
      //     self.handleNodeClick({ uuid: filePath });
      //     this.scrollTo(0);
      //   });
      // });
      // window.CommandsTeachSocket.debugSetBeart(false, 0.1, (dict) => {
      //   console.log(`SetBeart false = dict = ${JSON.stringify(dict)}`);
      // });
    },
    cancelEdit() {
      const self = this;
      this.model.localTeach.editState = false;
      window.GlobalUtil.model.localTeach.hasChange = false;
      window.GlobalUtil.model.localTeach.onSelect(null, -1);
      // this.$store.commit(types.ROBOT_MOVE_JOINT, GlobalUtil.model.localTeach.curPoint);
      document.getElementById('bottom-right-frame').scrollLeft = 0;
      this.onwinresize();
      // setTimeout(() => {
      //   this.onwinresize();
      //   // self.$refs.tree.setCurrentKey(window.GlobalUtil.model.localTeach.curSelectedTreeItem.uuid);
      // }, 100);
    },
    onsave() {
      this.model.localTeach.onSaveChange(() => {
        this.model.localTeach.changeSelectedShow = false;
        this.model.localTeach.hasChange = false;
        this.model.localTeach.onSelect(null, this.model.localTeach.willOnSelectIndex);
        this.$store.commit(types.ROBOT_MOVE_JOINT, this.model.localTeach.curPoint);
      });
    },
    closeSaveAlert() {
      this.model.localTeach.saveDialogShow = false;
      this.model.localTeach.changeSelectedShow = false;
      this.model.localTeach.hasChange = false;
      this.model.localTeach.visible.starRecording = false;
      this.model.localTeach.curDuration = 0;
      this.model.localTeach.fileDatas.temp = [];
      // GlobalUtil.model.localTeach.curFileDatas = [];
      window.CommandsTeachSocket.debugSetBeart(false, 0.1, () => {
      });
      setTimeout(() => {
        const curProj = this.model.localTeach.curProj;
        this.handleNodeClick({ uuid: curProj.uuid });
      }, 100);
      this.$store.commit(types.ROBOT_MOVE_JOINT, this.model.localTeach.curPoint);
    },
    closeAlert() {
      this.isDeleteFileDialogShow = false;
      this.model.localTeach.changeSelectedShow = false;
      this.model.localTeach.saveDialogShow = false;
      this.model.localTeach.hasChange = false;
      this.model.localTeach.onSelect(null, window.GlobalUtil.model.localTeach.willOnSelectIndex);
      this.$store.commit(types.ROBOT_MOVE_JOINT, window.GlobalUtil.model.localTeach.curPoint);
    },
    onrenameok() {
      const self = this;
      const text = this.model.localTeach.curDialogProjInputText;
      this.model.localTeach.projRenameShow = false;
      const projTypeSelected = this.model.localTeach.projTypeSelected;
      // const pre = projTypeSelected === '1' ? 'continuous_' : 'discontinuous_';
      // text = `${pre}${text}`;
      console.log(`onrename text = ${text}`);
      const filePath = path.join(window.CommandsTeachSocket.ROOT_DIR, text);
      if (this.model.localTeach.projTypeSelected === '0') {
        window.CommandsTeachSocket.renameFile(text, () => {
          setTimeout(() => {
            self.$refs.tree.setCurrentKey(filePath);
            this.model.localTeach.setCurSelectedTreeItem(filePath);
          });
        });
      }
      else {
        window.CommandsTeachSocket.renameProj(text, () => {
          setTimeout(() => {
            self.$refs.tree.setCurrentKey(filePath);
            this.model.localTeach.setCurSelectedTreeItem(filePath);
          });
        });
      }
    },
    onrename(data) {
      const uuid = data.uuid;
      console.log(`rename data uuid = ${uuid}`)
      this.model.localTeach.projRenameShow = true;
      this.model.localTeach.curDialogProjInputText = this.model.localTeach.getRealProjFileName(path.basename(uuid));
      this.model.localTeach.projTypeSelected = '2';
      if (uuid.indexOf('discontinuous_') >= 0) {
        this.model.localTeach.projTypeSelected = '2';
      }
      else {
        this.model.localTeach.projTypeSelected = '1';
      }
      if (uuid !== this.model.localTeach.curProj.uuid) {
        console.log('is file');
        this.model.localTeach.projTypeSelected = '0';
        this.model.localTeach.curDialogProjInputText = path.basename(uuid);
      }
      else {
        console.log('is proj');
      }
      window.GlobalUtil.setInputFocus();
    },
    scrollTo(time) {
      document.getElementById('bottom-right-frame').scrollLeft = 1800 * time; // 60 * (parseInt(time / 10) * 10);
    },
    delProj(uuid) {
      const realName = this.model.localTeach.getRealFileFileName(uuid)
      if (this.model.localTeach.curProj.uuid !== uuid) {
        this.isDeleteFileDialogShow = true;
        this.delProjOK = () => {
          this.isDeleteFileDialogShow = false;
          window.CommandsTeachSocket.delFiles(uuid, () => {
            // console.log(`localTeach.delProj = ${curProj.uuid}, dict = ${JSON.stringify(dict)}`);
            const dirname = path.dirname(uuid);
            this.handleNodeClick({ uuid: dirname });
          });
        };
        this.deleteFileDialogTitle = `Are you sure you want to delete ${realName}?`;
        return;
      }
      const curProj = window.GlobalUtil.model.localTeach.curProj;
      this.deleteFileDialogTitle = `Are you sure you want to delete ${curProj.name}?`;
      this.delProjOK = () => {
        this.isDeleteFileDialogShow = false;
        window.CommandsTeachSocket.delProj(curProj.uuid, () => {
          // console.log(`localTeach.delProj = ${curProj.uuid}, dict = ${JSON.stringify(dict)}`);
          if (window.GlobalUtil.model.localTeach.curProjList.length > 0) {
            const firstProj = window.GlobalUtil.model.localTeach.curProjList[0];
            this.handleNodeClick({ uuid: firstProj.uuid });
          }
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
      const leftFrame = document.getElementById('left-teach-frame');
      const bottomRightFrame = document.getElementById('bottom-right-frame');
      const totalFrameWidth = clientWidth - 8;
      const totalFrameHeight = clientHeight - 120;
      const leftTopArea = document.getElementById('left-top-area');
      const leftBottomArea = document.getElementById('left-bottom-area');
      const rightFrame = document.getElementById('tree-wrapper');
      const controlWrapper = document.getElementById('control-wrapper');
      // const leftControl = document.getElementById('left-control');
      // const leftEmulator = document.getElementById('left-emulator');
      // const leftShow = document.getElementById('left-show');
      const leftFrameWidth = totalFrameWidth - this.rightFrameWidth;
      if (leftFrame !== null && leftFrame !== undefined) {
        leftFrame.style.width = `${leftFrameWidth}px`;
      }
      if (bottomRightFrame !== null && bottomRightFrame !== undefined) {
        this.bottomRightWidth = totalFrameWidth - this.rightFrameWidth; // - this.bottomLeftWidth
        bottomRightFrame.style.width = `${this.bottomRightWidth}px`; // '100%'; //
      }
      const bottomHeight = 100;
      if (leftBottomArea !== null && leftBottomArea !== undefined) {
        leftBottomArea.style.height = `${bottomHeight}px`;
      }
      const leftTopHeight = (totalFrameHeight - bottomHeight) + 60; // 50;
      if (leftTopArea !== null && leftTopArea !== undefined) {
        leftTopArea.style.height = `${leftTopHeight}px`;
        this.emulatorHeight = leftTopHeight
      }
      if (rightFrame !== null && rightFrame !== undefined) {
        rightFrame.style.height = `${totalFrameHeight - 0}px`;
      }
      if (controlWrapper !== null && controlWrapper !== undefined) {
        // controlWrapper.style.height = `${totalFrameHeight + 50}px`;
        controlWrapper.style.height = `${totalFrameHeight + 60}px`;
      }
    },
    handleNodeClick(data) {
      console.log('handleNodeClick = ' + data);
      this.cancelEdit();
      const uuid = data.uuid;
      console.log('handleNodeClick uuid = ' + data.uuid);
      this.model.localTeach.setCurSelectedTreeItem(uuid);
      const proj = window.GlobalUtil.model.localTeach.getProjInfo(uuid);
      this.model.localTeach.curProj = proj;
      const file = this.model.localTeach.getTeachFileInfo(proj, uuid);

      this.protype = proj.type;

      const curProj = window.GlobalUtil.model.localTeach.getCurProj(uuid);
      if (curProj !== null && curProj !== undefined) {
        this.model.localTeach.showArr = [];
        window.CommandsTeachSocket.getProjFiles(uuid, (dict) => {
          console.log('get proj files = ' + JSON.stringify(dict));
          if (dict.code === 0) {
            // const total = dict.data.files.length;
            // console.log(`total = ${total}`);
            // let total = 0;
            // const fileCounts = dict.data.files.map((file) => { return file.pointCount });
            // for (let i = 0; i < fileCounts.length; i += 1) {
            //   total += Number(fileCounts[i]);
            // }
            console.log(`total = ${dict.data.pointCount}`);
            this.model.localTeach.projSingleTotalCount = dict.data.pointCount;
          }
          // const total = dict.data.total;
          // console.log(`total = ${total}`);
          // this.model.localTeach.projSingleTotalCount = total;
        });
      }
      if (file !== null && file !== undefined) {
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
            // this.$store.commit(types.ROBOT_MOVE_JOINT, GlobalUtil.model.localTeach.curPoint);
          }
        });
      }
    },
    renderContent(h, { node, data, store }) {
      console.log(data + node + store);
      // console.log(node);
      // console.log(store);
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
      const iconStyle = `${iconUrl} no-repeat center left;padding-left: 20px;`;
      const label = window.GlobalUtil.model.localTeach.getRealProjFileName(data.label);
      const isFile = data.type === 'file'; // (data.uuid || '').indexOf('.json');
      // const isProj = (indexOfJson >= 0 ? false : true);
//       .file-icon {
//   margin-left: 10px;
//   margin-top: 6px;
//   width: 24px;
//   height: 24px;
//   background-image: url('./../../assets/img/ide/icon_addfile.svg');
//   cursor: pointer;
// }
// { (isFile === true) ? <el-button style="mini" size="mini" type="text" on-click={ () => this.onrename(data) }><img style="margin-right: 10px" src={this.fileIcon.rename} /></el-button> : <span style="display:none">1</span> }
      return (
        <span class="tree-list">
          <span style={iconStyle}>{label}</span>
          <span class="display-none" style="margin-right: 20px">
            { (isFile === true) ? <el-button style="mini" size="mini" type="text" on-click={ () => this.createNewFile() }><img style="margin-right: 10px" src={this.fileIcon.file} /></el-button> : <span style="display:none">1</span> }
            <el-button style="mini" size="mini" type="text" on-click={ () => this.onrename(data) }><img style="margin-right: 10px" src={this.fileIcon.rename} /></el-button>
            <el-button size="mini" type="text" on-click={ () => this.delProj(data.uuid) }><img src={this.fileIcon.delete} /></el-button>
          </span>
      </span>);
    },
  },
  beforeDestroy() {
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
      return model.localTeach.visible.starRecording === true || model.localTeach.editState === true || model.localTeach.isTeachRunningUUID !== '';
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
  display: flex;
  flex-direction: column;
  // .recording-header-wrapper {
  //   background: #F8F8F8;
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   img {
  //     width: 1.6rem;
  //   }
  //   span {
  //     margin-left: 1rem;
  //     font-family: 'Gotham-Bold';
  //     font-size: 2rem;
  //     color: #444;
  //     letter-spacing: -1px;
  //   }
  //   .control-toggle {
  //     display: flex;
  //     justify-content: center;
  //     align-items: center;
  //     .title-online {
  //       padding-right: 5px;
  //       font-family: 'Gotham-Medium';
  //       font-size: 12px;
  //       color: #434343;
  //       letter-spacing: -0.5px;
  //     }
  //     button {
  //       width: 63px;
  //       height: 29px;
  //       padding: 0;
  //       margin-left: 20px;
  //       background: #555;
  //       font-size: 10px;
  //       color: #fff;
  //       font-family: 'Gotham-Book';
  //     }
  //   }
  // }
  .main-contain {
    width: 100%;
    height: 92%;
    /*padding: 0 14px;*/
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    background: #F8F8F8;
    .recording-area-wrapper {
      /*width: 80%;*/
      /*margin: 0 12px;*/
      font-size: 14px;
      .left-top-area {
        box-shadow: 0 0 6px 0 rgba(205,205,205,0.50);
        border-radius: 8px;
        height: 300px;
      }
      .left-bottom-area {
        display: flex;
        justify-content: space-between;
        padding-top: 20px;
        height: 100px;
      }
      .left-emulator {
        float: left;
        width: 100%;
        height: 100%;
        background: #fff;
        // background: yellow;
        // padding-bottom:5px;
      }
      .left-show {
        float: right;
        width: 200px;
        height:200px;
        background: lightgray;
      }
      .left-control {
        float: left;
        // margin-top: 10px;
        width: 100%;
        height:200px;
        // height: 100%;
        // bottom: 0px;
        background: gray;
        // background: transparent;
      }
      .switch-wrapper {
        position: relative;
        width: 250px;
        background: #F3F3F3;
        text-align: center;
        .recording {
          .file-name {
            height: 42px;
            line-height: 42px;
            color: #8B8B8B;
            background: #EFEFEF;
            span {
              padding-left: 38px;
            }
          }
          .recording-btn {
            /*padding-top: 120px;*/
            // padding-top: 20vh;
            // button {
            //   margin: 0px auto;
            //   display: block;
            // }
          }
          .bottom-btn {
            height: 42px;
            width: 100%;
            right: 0px;
            line-height: 42px;
            position: absolute;
            transition: all .4s;
            border: none;
            outline: 0;
            font-family: 'Gotham-Book';
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: -0.06px;
          }
          .timer-input {
            position: absolute;
            width: 32px;
            height: 42px;
            border: none;
            outline: 0;
            right: 10px;
            bottom: 0px;
            background: #7b7878;
            color: white;
            font-family: 'Gotham-Book';
            font-size: 14px;
            text-align: center;
          }
          .start-recording-btn {
            bottom: 42px;
            background: #4A90E2;
            cursor: pointer;
          }
          .eidt-btn {
            bottom: 42px;
            background: #4A90E2;
            cursor: pointer;
          }
          .save-change-btn {
            bottom: 42px;
            background: #52BF53;
            cursor: pointer;
          }
          .save-change-btn-dark {
            bottom: 42px;
            background: #BCBDBC;
            // cursor: pointer;
          }
          .edit-cancel-btn {
            bottom: 0px;
            background: #E24D4A;
            cursor: pointer;
          }
          .start-btn {
            bottom: 0;
            background: #52BF53;
            cursor: pointer;
          }
          .finish-recording-btn {
            bottom: 84px;
            background: #52BF53;
            cursor: pointer;
          }
          .press-btn {
            bottom: 42px;
            background: #E24D4A;
            // z-index: 50px;
            cursor: pointer;
          }
          .add-timer-btn {
            bottom: 0;
            background: black;
            // z-index: 50px;
            cursor: pointer;
          }
          .start-btn-dark {
            bottom: 0;
            background: #E3E3E3;;
          }
          .edit-btn-dark {
            background: #E3E3E3;;
            cursor: default;
          }
          /*.start-btn:hover {*/
            /*background: rgba(212,212,212,0.6);*/
          /*}*/
          .recording-time {
            height: 36px;
            line-height: 36px;
            font-family: 'Gotham-Book';
            font-size: 14px;
            color: #444444;
            letter-spacing: -0.78px;
            background: #E5E5E5;
          }
          .recording-name {
            height: 43px;
            line-height: 43px;
            font-family: 'Gotham-Book';
            font-size: 14px;
            color: #6D7175;
            letter-spacing: -0.78px;
            background: #FFFFFF;
          }
        }
      }
    }
    .control-wrapper {
      // width: 320px;
      width: 276px;
      // height: 100%;
    }
    .projects-list-wrapper {
      // width: 320px;
      width: 276px;
      /*min-width: 300px;*/
      /*max-width: 400px;*/
      background: #EDEDED;
      border: 1px solid #DFDFDF;
      position: relative;
      h3 {
        height: 58px;
        line-height: 58px;
        font-family: 'Gotham-Bold';
        font-size: 1.4rem;
        color: #444;
        letter-spacing: -1.33px;
        padding: 0 22px;
        display: flex;
        justify-content: space-between;
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
        height: inherit;
        overflow-y: scroll;
        height: 92%;
        font-size: 14px;
      }
    }
  }
}
.com-btn {
  width: 168px;
  height: 40px;
  border-radius: 100px;
}
.background-color-transparent {
  background-color: transparent;
}

.background-color-green {
  background-color: green;
}

.block {
  span{
    width: 150px;
  }
  display: flex;
  align-items: center;
  .teach-slider {
    width: 400px;
  }
}

.chart {
  margin-top: 50px;
  margin-left: 50px;
  background-color: white;
  width: 1000px;
  height: 200px;
}
.total-frame {
  /*background-color:gray;*/
  width:100%;
  height:600px;
  top: 90px;
  // left: 10px;
  border:1px solid #96c2f1;
  background:#eff7ff;
  /*top: 200px;
  left: 100px;*/
}
.left-frame {
  width:200px;
  height: 100%;
  overflow: scroll;
}
.right-frame {
  left: 250px;
  // width:85%;
  /*width:100%;*/
  height: 100%;
  /*background-color:#e9e6d3;*/
  background-color:#f6f6f6;
  overflow-y: scroll;
}
.display-none {
  display: none;
}
.tree-wrapper::-webkit-scrollbar {/*滚动条整体样式*/
  width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.tree-wrapper::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #D8D8D8;;
}
.tree-wrapper::-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(231,231,231,0.4);
  border-radius: 0;
  background: rgba(231,231,231,0.4);
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
  display: inline-block;
}
</style>
