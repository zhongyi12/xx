<template>
  <div class="main-wrapper" id="paint-wrapper">
    <div class="paint-header header-wrapper">
    <CommonTopMenu
      type='paint'
      :onlist='listProjects'
      :isFileSelected="model.localPaintMgr.curProj !== null && model.robot.state.status.connected === true"
      :title="$t('title')"
      :issaved='model.localPaintMgr.state.saved === true'
      :curFileName="model.localPaintMgr.state.saved === true ? curProj.name : curProj.name + '*'"
      :onback='onBack'
      :onsave='saveProject'
      :onnew='newProject'
      :isRunning='model.localPaintMgr.state.isRunnningPrint === true'
      :onstart='startPrint'
      :onstop='stopPrint'
      :onCancle='onCancle'>
    </CommonTopMenu>
    <CommonTopMenu2 style="position: absolute;right: 0;"></CommonTopMenu2>
    </div>
    <div style="" class="fabric-container" v-show="model.localPaintMgr.curProj!==null">
      <canvas style="" id="fabric" tabindex='1' width="900" height="450"></canvas>
    </div>

    <div
      v-if="model.localPaintMgr.state.isRunnningPrint"
      style="position:absolute;width:900px;height:450px;background:white;opacity:0.8;left:0px;right:0px;margin-left:auto;margin-right:auto;top:100px;">
    </div>

    <div class="float-type" style="" v-show="model.localPaintMgr.curProj!==null">
      <span class="point">
      </span>
      {{ $t('mode') }}: {{ curProj.projType }}
    </div>

    <div @click="setRobotShow" class="hide-button" >
      <i class=" el-icon-arrow-right" v-bind:class="{rotate: !model.commonStatusMgr.paintRobotShow}"></i>
    </div>

    <!-- <div v-show="robotShow === true" style="position:absolute;width:400px;height:350px;;top:65px;right:20px;z-index:1000;">
      <slot name="xarm"></slot>
    </div> -->
    <div v-show="robotShow === true" style="position:absolute;width:400px;height:350px;bottom:30px;right:20px;z-index:9;">
      <slot name="xarm"></slot>
    </div>

  <div style="position:absolute;width:280px;top:0px;right:420px;">
    <CommonSetControlEdit
      :isShowClose=true
      v-if="model.commonStatusMgr.paintControlShow">
    </CommonSetControlEdit>
  </div>

    <div class="bottom-progress" v-if="model.localPaintMgr.state.isRunnningPrint && 1===2">
      {{ Number(progressNum) * 1 }} %
    </div>

    <BottomTools
      class="paint-bottom"
      v-if="model.localPaintMgr.curProj!==null"
      :onredo='onredo'
      :onundo='onundo'
      :onimage="openImage"
      :onadd="addIconsDialog"
      :ondelete="removeSelected"
      :oncopy="duplicate"
      :onremoveall='removeAll'
      :ontext="textDialog">
    </BottomTools>

    <DialogNewProj
      :onclose='closeDialog'
      :onok='createProj'
      v-if="model.localPaintMgr.visible.pattern">
    </DialogNewProj>

    <DialogPaintProjs
      :onclose='closeDialog'
      :onopen='selectProj'
      v-if="model.localPaintMgr.visible.projs">
    </DialogPaintProjs>

    <DialogIcons
      :onclose='closeDialog'
      :onok='addEmotion'
      v-if="model.localPaintMgr.visible.icons">
    </DialogIcons>

    <DialogFontSelect
      :onclose='closeDialog'
      :onopen='addTextAsPath'
      v-if="model.localPaintMgr.visible.text">
    </DialogFontSelect>

    <DialogTeachAlert
      :title="$t('dialogTeachAlert.clearAll')"
      :cancel="$t('dialogTeachAlert.cancel')"
      :ok="$t('dialogTeachAlert.clear')"
      :onok='removeAllOK'
      :isdelete=true
      :oncover='closeDialog'
      :oncancel='closeDialog'
      v-if="model.localPaintMgr.visible.clear">
    </DialogTeachAlert>

    <DialogPaintSetting
      :onclose='closeDialog'
      :onok='startPrintOK'
      v-if="model.localPaintMgr.visible.setting">
    </DialogPaintSetting>

    <DialogTeachAlert
      :title='model.localPaintMgr.curToDelProjTitle'
      cancel='Cancel'
      ok='Delete'
      :onok='onDeleteOK'
      :isdelete=true
      :oncover='closeDel'
      :oncancel='closeDel'
      v-if="model.localPaintMgr.visible.del">
    </DialogTeachAlert>

    <DialogQuitPage
      :onunsave='onunsave'
      :onsave='onsave'
      v-if="model.commonStatusMgr.quitPageShow === true">
    </DialogQuitPage>

    <input type="file" v-show="false" ref="addFile" @change="addImage()"/>​​​​​​​​​

  </div>
</template>

<script>
import { fabric } from 'fabric-webpack';
import opentype from 'opentype.js';
import Potrace from '../assets/lib/potrace';
import CommonTopMenu from './common/CommonTopMenu';
import CommonTopMenu2 from './common/CommonTopMenu2';
import CommonSetControlEdit from './common/CommonSetControlEdit';
import BottomTools from './Paint/BottomTools';
import DialogNewProj from './Paint/DialogNewProj';
import DialogPaintProjs from './Paint/DialogPaintProjs';
import DialogIcons from './Paint/DialogIcons';
import DialogFontSelect from './Paint/DialogFontSelect';
import DialogTeachAlert from './dialog/DialogTeachAlert';
import DialogQuitPage from './dialog/DialogQuitPage';
import DialogPaintSetting from './Paint/DialogPaintSetting';

const CONFIG = {
  addPosition: {
    left: 350,
    top: 70,
    width: 100,
    fontSize: 20,
  },
};
export default {
  i18n: {
    messages: {
      en: {
        before_delete_msg: 'You must select before delete.',
        before_duplicate_msg: 'You must select before duplicate.',
        title: 'Draw',
        mode: 'Mode',
        dialogTeachAlert: {
          clear: 'Clear',
          clearAll: 'Clear all pictures?',
          cancel: 'Cancel',
        },
        runningTip: 'Project is running!',
      },
      cn: {
        before_delete_msg: '删除前请选中',
        before_duplicate_msg: '复制前请选中',
        title: '画图',
        mode: '模式',
        dialogTeachAlert: {
          clear: '清除',
          clearAll: '删除所有图案？',
          cancel: '取消',
        },
        runningTip: '项目正在运行！',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      playground: null,
      // backStr: 'AppStore',
      emotions: {},
      progressNum: '0',
      robotShow: true,
    };
  },
  mounted() {
    this.model.commonStatusMgr.quitPageShow = false;
    this.model.localPaintMgr.quitPage = (callback) => {
       return this.quitPage(callback);
    }
    setTimeout(() => {
      window.CommandsPaintSocket.listProjs((dict) => {
        console.log(dict);
      });
      this.initFabric();
      // this.fabricModified();
      this.loadEmotions();
      // console.log(this.playground.toSVG());
      setTimeout(() => {
        this.model.localPaintMgr.state.saved = true;
        this.robotShow = this.model.commonStatusMgr.paintRobotShow;
      });
      this.aftetActivated();
    }, 200);
  },
  activated: function() {
    this.aftetActivated();
  },
  methods: {
    onCancle() {
      const filePath = this.model.localPaintMgr.curProj.uuid;
      const curProjIndex = this.model.localPaintMgr.findProjIndex(filePath);
      this.selectProj(curProjIndex);
    },
    onsave() {
    },
    onunsave() {
    },
    quitPage(callback) {
      if (this.model.localPaintMgr.state.isRunnningPrint) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        });
      }
      else if (this.model.localPaintMgr.state.saved === true) {
        if (callback) {
          callback();
        }
      }
      else {
        this.model.commonStatusMgr.quitPageShow = true;
        this.onsave = () => {
          console.log('quit onsave');
          this.saveProject();
          if (callback) {
            callback();
          }
        }
        this.onunsave = () => {
          console.log('quit onunsave');
          if (callback) {
            callback();
          }
        }
      }
    },
    setRobotShow() {
      this.model.commonStatusMgr.paintRobotShow = !this.model.commonStatusMgr.paintRobotShow;
      this.robotShow = !this.robotShow;
    },
    aftetActivated() {
      setTimeout(() => {
        if (this.model.localPaintMgr.projList.length === 0) {
          this.newProject();
        }
        else if (this.model.localPaintMgr.curProj === null) {
          // this.listProjects();
          this.selectProj(0);
        }
        else {
          const filePath = this.model.localPaintMgr.curProj.uuid;
          const curProjIndex = this.model.localPaintMgr.findProjIndex(filePath);
          console.log(`curProjIndex = ${curProjIndex}`);
          this.selectProj(curProjIndex);
        }
      }, 500);
    },
    onDeleteOK() {
      this.closeDel();
      const toDelProj = this.model.localPaintMgr.curToDelProj;
      const toDelUUID = toDelProj.uuid;
      console.log(`toDelProj uuid = ${toDelUUID}`);
      window.CommandsPaintSocket.delProj(toDelUUID, () => {
        if (this.model.localPaintMgr.curProj !== null) {
          if (toDelUUID === this.model.localPaintMgr.curProj.uuid) {
            this.model.localPaintMgr.curProj = null;
          }
        }
      });
    },
    closeDel() {
      this.model.localPaintMgr.visible.del = false;
    },
    closeDialog() {
      this.model.localPaintMgr.visible.text = false;
      this.model.localPaintMgr.visible.setting = false;
      this.model.localPaintMgr.visible.pattern = false;
      this.model.localPaintMgr.visible.projs = false;
      this.model.localPaintMgr.visible.icons = false;
      this.model.localPaintMgr.visible.text = false;
      this.model.localPaintMgr.visible.clear = false;
      this.model.localPaintMgr.visible.del = false;
    },
    addIconsDialog() {
      if (this.model.localPaintMgr.state.isRunnningPrint) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        });
        return;
      }
      this.model.localPaintMgr.selectedIcon = null;
      this.model.localPaintMgr.visible.icons = true;
    },
    textDialog() {
      if (this.model.localPaintMgr.state.isRunnningPrint) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        });
        return;
      }
      this.model.localPaintMgr.curDialogFontInputText = '';
      this.model.localPaintMgr.visible.text = true;
    },
    listProjects() {
      // console.log('list projects');
      this.model.localPaintMgr.curProj = this.model.localPaintMgr.curProj;
      this.model.localPaintMgr.visible.projs = true;
    },
    saveProject() {
      // console.log('save project');
      if (this.model.localPaintMgr.state.isRunnningPrint) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        })
        return;
      }
      const jsonStr = JSON.stringify(this.playground);
      console.log(jsonStr);
      window.CommandsPaintSocket.saveOrUpdateFile(this.model.localPaintMgr.curProj.uuid, jsonStr, () => {
        // console.log(`dict = ${JSON.stringify(dict)}`);
        this.model.localPaintMgr.state.saved = true;
      });
    },
    selectProj(index) {
      if (this.model.localPaintMgr.state.isRunnningPrint) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        })
        return;
      }
      // console.log(`select project = ${JSON.stringify(this.model.localPaintMgr.curProj)}`);
      this.closeDialog();
      const curProj = this.model.localPaintMgr.projList[index];
      window.CommandsPaintSocket.getFile(curProj.uuid, (dict) => {
        // console.log(`dict = ${JSON.stringify(dict)}`);
        if (dict.code === 0) {
          this.model.localPaintMgr.state.buffer = [];
          const canvas = this.playground;
          this.removeAllOK();
          const jsonStr = dict.data; // GlobalUtil.decode(dict.data);
          // console.log(`jsonStr = ${jsonStr}`);
          canvas.loadFromJSON(jsonStr, canvas.renderAll.bind(canvas));
          this.model.localPaintMgr.curProj = curProj;
          setTimeout(() => {
            this.model.localPaintMgr.state.saved = true;
          });
        }
      });
    },
    // startPrinting(setting) {
    //   setting.canvasMode = this.ui_data.canvasMode;
    //   // console.log(setting);
    //   let sendData;
    //   if (setting.mode === '0') { // pen / outline mode
    //     setting.zero = setting.zero0;
    //   }
    //   else { // laser mode
    //     setting.zero = setting.zero1;
    //   }
    //   if (setting.canvasMode === '1') { // black white mode
    //     sendData = this.mainCanvas.toDataURL('png');
    //   }
    //   else { // outline mode setting.canvasMode === 2
    //     sendData = this.mainCanvas.toSVG();
    //   }
    //   // console.log(sendData, setting);
    //   window.CommandsAppsSocket.startPrinting(sendData, setting, (dict) => {
    //     console.log(`start printing = ${JSON.stringify(dict)}`);
    //   });
    //   sendData = null;
    // },
    startPrint() {
//      console.log('startPrint startPrint');
//      if (this.model.localPaintMgr.state.isRunnningPrint === true) {
//        return false;
//      }
      if (!this.isConnected) {
        const errorMessage = window.language.currentLang === 'en' ? 'The xArm is offline, please switch to online mode.' : '机械臂处于离线状态，请切换在线模式。';
        this.$message({
          message: errorMessage,
          type: 'warning',
          duration: 1000,
        });
      }
      else if (this.model.localPaintMgr.state.isRunnningPrint === true) {
        const errorMessage = window.language.currentLang === 'en' ? 'In print... Please later.' : '正在打印中...请稍后。';
        this.$message({
          message: errorMessage,
          type: 'warning',
          duration: 1000,
        });
      }
      else {
        window.CommandsPaintSocket.getZeroConfig((dict) => {
          console.log(dict);
          if (dict.code === 0) {
            this.model.localPaintMgr.state.zero = dict.data;
            this.model.localPaintMgr.visible.setting = true;
          }
        });
      }
    },
    startPrintOK() {
      this.closeDialog();
      const projType = this.model.localPaintMgr.curProj.projType;
      const sendData = projType === 'outline' ? this.playground.toSVG() : this.playground.toDataURL('png');
      const end_type = 'pen'; // 0: 'pen', 1: 'laser',
      const zeroHeightDict = projType === 'outline' ? this.model.localPaintMgr.state.zero.outline : this.model.localPaintMgr.state.zero.grayscale;
      const config = {
        speed: this.model.localPaintMgr.state.speed || 100,
        canvasMode: projType === 'outline' ? 2 : 1, // 2. outline 1. gray
        zeropoint_height: end_type === 'pen' ? zeroHeightDict.pen : zeroHeightDict.laser, // Number(this.model.localPaintMgr.state.zero),
        end_type: end_type,
        drawing_feedrate: 500,
        times: Number(this.model.localPaintMgr.state.runTimes) || 1,
      };
      window.CommandsPaintSocket.startPrinting(sendData, config, (dict) => {
        // console.log(`start printing = ${JSON.stringify(dict)}`);
        if (dict.code === 0) {
          this.model.localPaintMgr.state.isRunnningPrint = true;
        }
        if (dict.code === 1) {
          this.progressNum = dict.data.progress;
        }
        if (dict.code === 1111) {
          this.model.localPaintMgr.state.isRunnningPrint = false;
        }
      });
    },
    stopPrint() {
      console.log('stop print');
      window.CommandsPaintSocket.stopPrinting((dict) => {
        if (dict.code === 0) {
          this.model.localPaintMgr.state.isRunnningPrint = false;
        }
      });
    },
    createProj() {
      // console.log('create proj');
      this.closeDialog();
      const projType = this.model.localPaintMgr.projTypeSelected;
      window.CommandsPaintSocket.createProj(this.model.localPaintMgr.curDialogProjInputText, projType, (dict, filePath) => {
        console.log(`dict = ${JSON.stringify(dict)}`);
        this.model.localPaintMgr.state.saved = true;
        const curProjIndex = this.model.localPaintMgr.findProjIndex(filePath);
        console.log(`curProjIndex = ${curProjIndex}`);
        this.selectProj(curProjIndex);
      });
    },
    newProject() {
      // this.playground.clear().renderAll();
      if (this.model.localPaintMgr.state.isRunnningPrint) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        })
        return;
      }
      this.model.localPaintMgr.state.buffer = [];
      this.model.localPaintMgr.curDialogProjInputText = '';
      this.model.localPaintMgr.visible.pattern = true;
      window.GlobalUtil.setInputFocus();
    },
    initFabric() {
      this.playground = new fabric.Canvas('fabric', {
        fireRightClick: true,
        backgroundColor: '#ECEFF1',
        // selectionBorderColor: 'yellow',
      });
      this.playground.on({
        'object:modified': () => {
          console.log('object:modified');
          this.fabricModified();
        },
        'object:added': (options) => {
          console.log('object:added');
          options.target.bringToFront();
          // this.fabricModified();
        },
      });
    },
    addEmotion() {
      this.closeDialog();
      const data = this.model.localPaintMgr.selectedIcon;
      fabric.loadSVGFromURL(data, (objects, options) => {
        Object.keys(objects).forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(objects, 'key')) {
            objects[key].set({ strokeWidth: 0.3 });
          }
        });
        // this code lag in windows
        const obj = fabric.util.groupSVGElements(objects, options);
        const scale = 150 / obj.width;
        obj.set({
          left: CONFIG.addPosition.left,
          top: CONFIG.addPosition.top,
          scaleX: scale,
          scaleY: scale,
          viewBox: {
            x: 0,
            y: 0,
            width: 36,
            height: 35,
          },
        });
        this.playground.add(obj);
        this.fabricModified();
        this.visible.pattern = false;
      });
    },
    openImage() {
      if (this.model.localPaintMgr.state.isRunnningPrint) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        });
        return;
      }
      this.$refs.addFile.click();
    },
    addImage() {
      const file = this.$refs.addFile.files[0];
      this.$refs.addFile.value = '';
      if (file) {
        const fileType = file.type;
        if (fileType === 'image/svg+xml') { // svg
          const url = URL.createObjectURL(file);
          fabric.loadSVGFromURL(url, (objects, options) => {
            const svg = fabric.util.groupSVGElements(objects, options);
            svg.scaleToWidth(CONFIG.addPosition.width);
            svg.scaleToHeight(CONFIG.addPosition.width);
            svg.set({ left: CONFIG.addPosition.left, top: CONFIG.addPosition.top });
            this.playground.add(svg);
            this.fabricModified();
          });
        }
        else if (fileType.match('image.*')) { // not svg
          const edge = (this.model.localPaintMgr.curProj.projType === 'outline');
          Potrace.loadImageFromFile(file);
          Potrace.setParameter({
            optcurve: true,
            opttolerance: 0.8,
            alphamax: 5,
            edge,
            // greyscale: true,
          });
          Potrace.process(() => {
            const pathstr = Potrace.getSVGPath(1);
            const path = new fabric.Path(pathstr);
            const scale = 100 / path.width;
            path.set({
              left: CONFIG.addPosition.left,
              top: CONFIG.addPosition.top,
              scaleX: scale,
              scaleY: scale,
              fill: 'black',
            });
            this.playground.add(path);
            this.fabricModified();
          });
        }
        else {
          this.$message({
            message: this.$t('paintApp.dailog.onlysvg'),
            duration: 1000,
          });
        }
      }
    },
    addTextAsPath() {
      this.closeDialog();
      const text = this.model.localPaintMgr.curDialogFontInputText;
      const fontList = this.model.localPaintMgr.FONT_LIST;
      const fontSelect = this.model.localPaintMgr.dialog.fontSelect;
      if (text.trim()) {
        opentype.load(fontList[fontSelect].src, (err, font) => {
          if (err) {
            this.$message({
              message: `Could not load font: ${err}`,
              duration: 1000,
            });
          }
          else {
            const textpath = font.getPath(text, 0, 150, 72);
            // console.log(textpath)
            const path = new fabric.Path(textpath.toPathData(2));
            // const scale = 100 / path.width;
            path.set({
              left: CONFIG.addPosition.left,
              top: CONFIG.addPosition.top,
              fontSize: CONFIG.addPosition.fontSize,
              // scaleX: scale,
              // scaleY: scale,
              fill: 'black',
              stroke: 'black',
              strokeWidth: 1,
            });
            this.playground.add(path);
            this.fabricModified();
            // this.visible.text = false; // close dialog
          }
          // console.log(font);
        });
      }
      else {
        this.$message({
          message: this.$t('recordApp.dialog.name.emptyAlert'),
          duration: 1000,
        });
      }
    },
    fabricModified() {
      console.log('fabric modified');
      const backStep = this.model.localPaintMgr.state.backStep;
      const size = this.model.localPaintMgr.state.buffer.length;
      const last = this.model.localPaintMgr.state.buffer[size - 1];
      const current = JSON.stringify(this.playground);
      console.log(`current = ${current}`);
      if (backStep > 0) {
        this.model.localPaintMgr.state.buffer = this.model.localPaintMgr.state.buffer.slice(0, size - backStep);
        this.model.localPaintMgr.state.backStep = 0;
      }
      if (last !== current) {
        this.model.localPaintMgr.state.buffer.push(current);
        this.model.localPaintMgr.state.saved = false;
        // fabric.log(myjson);
        this.model.localPaintMgr.state.empty = this.playground.isEmpty();
        // console.log(this.state.buffer.length, this.state.backStep);
      }
    },
    undoEvent(reverse = false) { // do redo when reverse is true
      const canvas = this.playground;
      const size = this.model.localPaintMgr.state.buffer.length;
      let checkValid;
      let nextStep;
      if (reverse) { // redo
        checkValid = this.model.localPaintMgr.state.backStep > 0;
        nextStep = this.model.localPaintMgr.state.backStep - 1;
      }
      else { // undo
        checkValid = this.model.localPaintMgr.state.backStep < (size - 1);
        nextStep = this.model.localPaintMgr.state.backStep + 1;
      }
      const backStep = this.model.localPaintMgr.state.backStep;
      console.log(`model.localPaintMgr.state.buffer size = ${size}, backStep = ${backStep}, checkValid = ${checkValid}, reverse = ${reverse}`);
      if (checkValid) {
        canvas.clear().renderAll();
        this.model.localPaintMgr.state.backStep = nextStep;
        const loadJsonStr = this.model.localPaintMgr.state.buffer[size - nextStep - 1];
        canvas.loadFromJSON(loadJsonStr, canvas.renderAll.bind(canvas));
        this.model.localPaintMgr.state.saved = false;
      }
    },
    onundo() {
      if (this.model.localPaintMgr.state.isRunnningPrint) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        });
        return;
      }
      this.undoEvent(false);
    },
    onredo() {
      if (this.model.localPaintMgr.state.isRunnningPrint) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        });
        return;
      }
      this.undoEvent(true);
    },
    duplicate() {
      if (this.model.localPaintMgr.state.isRunnningPrint) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        });
        return;
      }
      const activeObject = this.playground.getActiveObject();
      const activeGroup = this.playground.getActiveGroup();
      if (activeObject) {
        activeObject.clone((obj) => {
          obj.set('left', obj.left + 8);
          obj.set('top', obj.top + 8);
          this.playground.add(obj);
          this.fabricModified();
        });
      }
      else if (activeGroup) {
        const objects = activeGroup.getObjects();
        this.playground.discardActiveGroup();
        objects.forEach((obj) => {
          const objTop = obj.originalTop + 5;
          const objLeft = obj.originalLeft + 5;
          obj.clone((o) => {
            o.set('left', objLeft);
            o.set('top', objTop);
            this.playground.add(o);
            this.playground.discardActiveGroup();
          });
        });
        this.playground.discardActiveGroup().renderAll();
        this.fabricModified();
      }
      else {
        this.$message({
          message: this.$t('before_duplicate_msg'),
          duration: 1000,
        });
      }
    },
    removeSelected() {
      if (this.model.localPaintMgr.state.isRunnningPrint) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        });
        return;
      }
      const deleteObj = this.playground.getActiveObject();
      const deleteGroup = this.playground.getActiveGroup();
      if (deleteObj) {
        this.playground.remove(deleteObj);
        this.fabricModified();
      }
      else if (deleteGroup) {
        // console.log(deleteGroup);
        const objs = deleteGroup.getObjects();
        this.playground.discardActiveGroup();
        objs.forEach((obj) => {
          this.playground.remove(obj);
        });
        this.fabricModified();
      }
      else {
        this.$message({
          message: this.$t('before_delete_msg'),
          duration: 1000,
        });
      }
    },
    removeAll() {
      if (this.model.localPaintMgr.state.isRunnningPrint) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        });
        return;
      }
      this.model.localPaintMgr.visible.clear = true;
    },
    removeAllOK() {
      this.model.localPaintMgr.visible.clear = false;
      if (this.playground) {
        this.playground.clear().renderAll();
      }
      this.fabricModified();
    },
    loadEmotions() {
      // [1, 2, 3].findIndex(() => 0);
      // this.emotions.list2 = SVG_LIST2;
      // this.emotions.list1 = SVG_LIST1;
      // SVG_LIST2.keys().forEach(key => this.emotions.list2 = SVG_LIST2(key));
      // SVG_LIST1.keys().forEach(key => this.emotions[key] = SVG_LIST1(key));
      // console.log(`this.emotions = ${JSON.stringify(this.emotions)}`);
    },
    onBack() {
      if (this.model.localPaintMgr.state.isRunnningPrint) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        })
        return;
      }
      // this.$router.push({ name: 'AppStore' });
      this.$router.go(-1);
    },
  },
  beforeDestroy() {
    this.playground = null;
  },
  watch: {
  },
  computed: {
    curProj: {
      get() {
        return this.model.localPaintMgr.curProj || {};
      },
      set(value) {
        this.model.localPaintMgr.curProj = value;
      },
    },
    topTitle() {
      const fullname = `${this.curProj.name}`;
      return this.curProj.name !== undefined ? fullname : '';
    },
    isConnected() {
      if (this.$store.state.robot.status.connected && this.$store.state.robot.info.online) {
        return true;
      }
      return false;
    },
  },
  components: {
    CommonTopMenu,
    BottomTools,
    DialogNewProj,
    DialogPaintProjs,
    DialogIcons,
    DialogFontSelect,
    DialogTeachAlert,
    DialogPaintSetting,
    DialogQuitPage,
    CommonSetControlEdit,
    CommonTopMenu2,
  },
};
</script>
<style scoped lang="scss">
#paint-wrapper {
  #fabric {
    background: '#ECEFF1';
    // background: white; #D95E2E 100%
    // box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }
}
/*.main-wrapper {*/
  /*position: relative;*/
/*}*/
.paint-header {
  display: flex;
}
.fabric-container {
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  // margin: auto;
  width: fit-content;
}
a {
  color: white;
}
.emotion-wrapper {
  max-height: 50vh;
  overflow-y: scroll;
  img{
    width: 10%;
    padding: 2%;
    cursor: pointer;
  }
  img:hover{
    background-color: #eee;
  }
}

.paint-header-wrapper {
  height: 60px;
  line-height: 60px;
  background: #575C62;
  display: flex;
  justify-content: space-between;
  img {
    width: 1.6rem;
  }
  span {
    margin-left: 1rem;
    font-family: 'Gotham-Bold';
    font-size: 2rem;
    color: #fff;
    letter-spacing: -1px;
  }
}
.back-wrapper {
  .btn {
    cursor: pointer;
  }
  padding-left: 1vw;
}
.menu-wrapper {
  display: flex;
  & > div {
    padding: 0 1vw;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    span {
      font-size: 0.7em;
      padding: 0;
      margin: 0;
      line-height: 1.2vw;
      text-transform: capitalize;
    }
  }
  .run-btn {
    background-color: #52BF53;
    line-height: 0.2;
    padding: 1.2vw;
    img{
      width: 120%;
    }
  }
}

.bottom-progress {
  position:absolute;
  width: 100px;
  height: 30px;
  line-height: 30px;
  left: 0px;
  right: 0px;
  bottom: 100px;
  margin: auto;
  border: 1px solid #D8D8D8;
  text-align: center;
}

.float-type {
  position:absolute;
  left:0;
  right:0;
  bottom:110px;
  margin:auto;
  width:145px;
  height:30px;
  line-height: 30px;
  font-family: 'Gotham-Medium';
  font-size: 14px;
  color: #4A4A4A;
  letter-spacing: -0.58px;
  text-align: center;
  background: #FFFFFF;
  border-radius: 100px;
  // border: 1px solid gray;
  box-shadow: 0 0 4px 0 rgba(192,192,192,0.50);
  // #D95E2E 100%  #E27347;
  .point {
    position: absolute;
    left: 15px;
    width: 4px;
    height: 4px;
    top: 13px;
    border-radius: 2px;
    background: #D95E2E
  }
}

.paint-bottom {
  position:absolute;
  width:621px;
  height:63px;
  left: 0px;
  right: 0px;
  z-index: 10;
  bottom: 30px;
  margin:auto;
  border: 1px solid #D8D8D8;
  // background:lightgreen;
}
// .blockly-wrapper {
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   position: relative;
// }
// .blockly-wrapper.notfull{
//   width: 80%;
// }
.hide-button {
  position: absolute;
  /*height: 40px;*/
  width: 10px;
  border-bottom: 8px solid transparent;
  border-right: 12px solid #F5F5F5;
  border-top: 8px solid transparent;
  line-height: 30px;
  right: 4px;
  // top: 70px;
  bottom: 340px;
  z-index: 39;
  cursor: pointer;
  text-align: center;
  color: #767676;
}
.hide-button .rotate {
  transform: rotate(-180deg);
}
</style>
