<template>
<div class="blockly-wrapper">
  <div class="blockly-header header-wrapper">
    <CommonTopMenu
      :title="$t('title')"
      :isFileSelected='model.localAppsMgr.enableRun'
      :issaved='saveStatus'
      :curFileName='model.localAppsMgr.curProName + notSaved'
      :onback='quitPage'
      :onsave='saveProject'
      :onnew='newProject'
      :isRunning='blockly.Running===true'
      :onstop='stopRun'
      :onlist='onlist'
      :onstart='startRun'
      :onCancle='onCancle'>
    </CommonTopMenu>
    <CommonTopMenu2 style="z-index: 40;position: absolute;right: 0;"></CommonTopMenu2>
  </div>
  <div class="main-wrapper" @click="controlProjList(false)">
    <div id="blockly-area" class="blockly-workspace" v-bind:class="{'div-disable': divDisable}" tabindex="0">
      <div id="tab-blocks"></div>
      <!--<div @click="toggleSideShow" class="hide-button el-icon-arrow-right" v-bind:class="{rotate: !model.commonStatusMgr.blocklyRobotShow}" ></div>-->
      <!-- <div @click="toggleSideShow" class="hide-button" >
        <i class=" el-icon-arrow-right" v-bind:class="{rotate: !model.commonStatusMgr.blocklyRobotShow}"></i>
      </div> -->
      <div @click="toggleSideShow2" class="hide-control-button" >
        <i class=" el-icon-arrow-right" v-bind:class="{rotate: !model.robot.state.showSetControlValueDialog}"></i>
      </div>
    </div>
    <!-- <div id="slide-area" v-show="uiData.sideShow">
      <div class="emulator-wrapper">
        <slot name="xarm"></slot>
      </div>
      <div class="file-list">
        <file-list
          :onselect="loadProject">
        </file-list>
      </div>
    </div> -->
  </div>
  <!-- <div v-show="uiData.sideShow === true" style="position:absolute;width:400px;height:350px;top:82px;right:20px;z-index:1000;">
    <slot name="xarm"></slot>
  </div>
  <div v-if="uiData.sideShow === true && model.robot.state.showSetControlValueDialog" class="com-side-control-wrapper" style="position:absolute;right:420px;top:0px;z-index:51;background:white;">
    <CommonSetControlEdit
      :isShowClose=true
    >
    </CommonSetControlEdit>
  </div>
  <div v-if="uiData.sideShow === false && model.robot.state.showSetControlValueDialog" class="com-side-control-wrapper" style="position:absolute;right:20px;top:82px;z-index:50;background:white;">
    <CommonSetControlEdit
      :isShowClose=true
      >
      </CommonSetControlEdit>
    </div>
  </div> -->
  <div v-if=" model.robot.state.showSetControlValueDialog" class="com-side-control-wrapper" style="position:absolute;right:16px;top:70px;z-index:50;background:#fff;width:500px;height:86%;overflow:hidden;">

    <!-- <div class="emulator-wrapper" style="width:40%;" v-if="model.commonStatusMgr.ControlPositionShow === false">
      <slot name="xarm" :size=smallWidth></slot>
    </div>
    <div class="emulator-wrapper" v-if="model.commonStatusMgr.ControlPositionShow === true">
      <slot name="xarm" :size=bigWidth></slot>
    </div> -->

    <div class="emulator-wrapper">
      <slot name="xarm" :controlsParams="{enableDrag: model.commonStatusMgr.ControlPositionShow === true}"></slot>
    </div>
    <div style="position: absolute;top:0;right:0;width:500px;background:rgba(255, 255, 255, 0)">
     <commonxArmControlModel></commonxArmControlModel>
    </div>
   
     
  </div>
  <div v-if="isShowProjList" style="position:absolute;width:600px;height:300px;top:82px;right:0px;z-index:2000;" @click="controlProjList(true)">
    <file-list
      :onselect="loadProject">
    </file-list>
  </div>
  <DialogBlocklyProjs v-if="model.localAppsMgr.isProjListDialogShow===true" @insertProject="insertProject"></DialogBlocklyProjs>
  <dialog-blockly-input-name v-if="uiData.inputName" @hideInput="uiData.inputName = false" @saveProject="saveProject"></dialog-blockly-input-name>

  <DialogTeachAlert
    :title='model.localAppsMgr.deleteAppTitle'
    cancel='Cancel'
    ok='Delete'
    :onok='delAppOK'
    :isdelete=true
    :oncover='closeAlert'
    :oncancel='closeAlert'
    v-if="model.localAppsMgr.isDeleteApp===true">
  </DialogTeachAlert>

  <DialogQuitPage
    :onunsave='onunsave'
    :onsave='onsave'
    v-if="model.commonStatusMgr.quitPageShow === true">
  </DialogQuitPage>

</div>
</template>
<script>

import BlocklyCom from '@/store/core/blockly/blocklyCom';
import DialogBlocklyProjs from './dialog/DialogBlocklyProjs';
import DialogBlocklyInputName from './dialog/DialogBlocklyInputName';
import DialogTeachAlert from './dialog/DialogTeachAlert';
import DialogQuitPage from './dialog/DialogQuitPage';
import CommonSetControlEdit from './common/CommonSetControlEdit';
import FileList from './Blockly/FileList';
import CommonTopMenu from './common/CommonTopMenu';
import CommonTopMenu2 from './common/CommonTopMenu2';
import commonxArmControlModel from './common/commonxArmControlModel';

const Blockly = BlocklyCom.blockly;
const BlocklyLib = BlocklyCom.blocklyLib;

const BLOCK_TYPES = {
  python: 'studio_run_python',
  record: 'studio_play_recording',
  record_copy: 'studio_copy_recording',
  app: 'studio_run_app',
}

export default {
  props: ['blocklyData', 'moduleName'],
  i18n: {
    messages: {
      en: {
        title: 'App Editor',
        runningTip: 'Project is running!',
        robotIsNotOnline: 'Current mode is offline, please set on line',
        cannotArriveTip: 'In the current stance, the xArm cannot go to the specified location.',
      },
      cn: {
        title: '应用编辑器',
         runningTip: '项目正在运行!',
         robotIsNotOnline: '当前模式是离线, 请打开在线开关',
         cannotArriveTip: '当前姿态下，机械臂不能去到指定地方。',
      },
    },
  },
  data() {
    return {
      // enableRun: false,
      blockly: window.Blockly, // .Running,
      curPositionEditingBlock: null,
      divDisable: false,
      saveStatus: true,
      pre: '',
      category: 'myapp',
      xmlLoaded: true,
      toCreateBlock: {},
      model: window.GlobalUtil.model,
      jsCode: '',
      xmlCode: '',
      myAppData: {},
      backStr: 'EditHome',
      constData: {
        tabName: {
          JS: 'Javascript',
          XML: 'XML',
          BLOCKS: 'Blocks',
        },
        untitledProject: this.$t('untitledProject'),
      },
      uiData: {
        // snackbar: false,
        // snackbarMessage: '',
        // projectNameEdit: false,
        sideShow: true,
        inputName: false,
      },
      isShowProjList: false,
      activeTab: null,
      projectNameEditing: false,
      currentBlock: null,
      // currentBlockTemp: null,
      currentBlockId: 0,
      sideToggle: true,
      toggleSideVisible: true,
      dialog: {
        [BLOCK_TYPES.python]: () => {
          this.onIDE()
        },
        [BLOCK_TYPES.record]: () => {
          this.onTeach()
        },
        [BLOCK_TYPES.record_copy]: () => {
          this.onTeachCopy()
        },
        [BLOCK_TYPES.app]: () => {
          this.onApp()
          // console.log('open other app')
        },
      },
      isMove: false,
      isUpdate: false,
      createFlag: 0,
      createBlockId: null,
    };
  },
  beforeDestroy() {
    this.setOnline(false)
    Blockly.removeEndListener(this.endCallback);
    window.removeEventListener('resize', self.resizeWorkspace, false); // avoid fire event listener twice or more
    // BlocklyCom.BlockWorkspace.removeChangeListener(self.onChangeEvent);
  },
  activated: function() {
    this.afterActivated();
  },
  deactivated() {
    this.setOnline(false)
    this.divDisable = false
  },
  components: {
    DialogBlocklyProjs,
    FileList,
    DialogTeachAlert,
    DialogBlocklyInputName,
    DialogQuitPage,
    CommonSetControlEdit,
    CommonTopMenu,
    CommonTopMenu2,
    commonxArmControlModel,
  },
  mounted() {
    this.model.localAppsMgr.quitPage = (callback) => {
      return this.quitPage(callback);
    };
    this.model.commonStatusMgr.quitPageShow = false;
    this.model.robot.state.showSetControlValueDialog = false;
    this.curPositionEditingBlock = null;
    this.model.commonStatusMgr.showToggleBtn = true;
    const self = this;
    // console.log(`window.GlobalUtil.model.robot.state.status.paused = ${window.GlobalUtil.model.robot.state.status.paused}`);
    this.model.localAppsMgr.curProName = ''
    // setTimeout(() => {
    //   window.Blockly.Running = false; // !window.GlobalUtil.model.robot.state.status.paused;
    // });
    this.setOnline(true)
    if (this.uarmConnectStatus) {
      window.UArm.set_acceleration({
        printingMoves: 200,
        travelMoves: 200,
        retractMoves: 200,
      });
    }
    // init Blockly
    this.initBlocklyDiv().then(() => {
      self.resizeWorkspace();
      this.afterActivated();
    });
    window.addEventListener('resize', self.resizeWorkspace, false);
    BlocklyCom.BlockWorkspace.addChangeListener(self.onChangeEvent);

    Blockly.Blocks[BLOCK_TYPES.python].onchange = (event) => {
      // console.log('event change', event)
      // console.log('event type', event.type) // move change ui
      const blockId = event.blockId
      const block = BlocklyCom.BlockWorkspace.getBlockById(blockId)
      // console.log('event block', block)
      if (block && event.type === 'ui') {
        this.toCreateBlock = block
        this.popDialog(block.type)
        console.log('onchange 1.1')
      }
    }
    Blockly.Blocks[BLOCK_TYPES.record].onchange = (event) => {
      // console.log('event change', event)
      // console.log('event type', event.type) // move change ui
      const blockId = event.blockId
      const block = BlocklyCom.BlockWorkspace.getBlockById(blockId)
      // console.log('event block', block)
      if (block && event.type === 'ui') {
        this.toCreateBlock = block
        this.popDialog(block.type)
        console.log('onchange 1.2')
      }
    }
//    Blockly.addEndListener(this.endCallback);
    self.activeTab = self.constData.tabName.BLOCKS;
    // load project
    setTimeout(() => {
      this.uiData.sideShow = this.model.commonStatusMgr.blocklyRobotShow;
    });
  },
  methods: {
    closeAlert() {
      this.model.localAppsMgr.isDeleteApp = false;
    },
    delAppOK() {
      this.model.localAppsMgr.isDeleteApp = false;
      window.CommandsAppsSocket.delFile(this.model.localAppsMgr.deleteAppName, () => {
         this.clearBlockly();
         console.log('model.localAppsMgr.appTreeDatas[2].children', this.model.localAppsMgr.appTreeDatas[2].children[0]);
         if (this.model.localAppsMgr.appTreeDatas[2].children.length > 0) {
           this.loadProject(this.model.localAppsMgr.appTreeDatas[2].children[0]);
         }
        //  this.loadProject();
      });
    },
    onCancle() {
      if (this.isNewPrj === true) {
        this.clearBlockly();
        return;
      }
      this.loadProject(this.model.localAppsMgr.curProj);
      console.log('this.model.localAppsMgr.curProj', this.model.localAppsMgr.curProj);
    },
    onlist() {
      this.isShowProjList = !this.isShowProjList;
      // this.isShowProjList = true;
    },
    stopRun() {
      const self = this;
      this.model.commonStatusMgr.blocklyCanUpdate = false;
      // this.model.robot.state.showSetControlValueDialog = false;
      // this.curPositionEditingBlock = null;
      window.Blockly.Running = false;
      this.model.localAppsMgr.enableRun = true;
      // this.$store.commit(types.XARM_URGENT_STOP, false);
      window.CommandsRobotSocket.urgentStop(false, () => {
        self.model.commonStatusMgr.blocklyCanUpdate = true;
      });
      this.endCallback();
    },
    afterActivated() {
      console.log(`params = ${JSON.stringify(this.$route.params.data)}`);
      this.category = 'myapp';
      if (this.$route.params.data !== undefined) {
        this.myAppData = this.$route.params.data;
        console.log(`this.myAppData = ${JSON.stringify(this.myAppData)}`);
        const name = this.myAppData.name;
        this.backStr = 'AppStore';
        this.category = this.myAppData.category;
        const params = {
          name: name,
          label: name,
          category: this.category,
        };
        window.CommandsAppsSocket.listLocalApps((dict) => {
          console.log(dict);
          this.getProject(params);
        });
        if (this.category !== 'myapp') {
          this.divDisable = true
        }
        this.model.localAppsMgr.enableRun = this.blocksNotEmpty()
      }
      else {
        setTimeout(() => {
          if (this.model.localAppsMgr.curProj.label) {
            const params = {
              name: this.model.localAppsMgr.curProj.label,
              label: this.model.localAppsMgr.curProj.label,
              category: this.model.localAppsMgr.curProj.category,
            };
            window.CommandsAppsSocket.listLocalApps((dict) => {
              console.log(dict);
              this.getProject(params);
            });
          }
        }, 100);
      }
      this.setOnline(true)
    },
    backToEdit() {
      this.model.localAppsMgr.enableRun = this.blocksNotEmpty()
      this.category = 'myapp'
      this.divDisable = false
    },
    setOnline(value) {
      // const data = {
      //   index: 'online',
      //   value,
      // };
      // this.$store.commit(types.SET_ROBOT_PARAM, data);
      // this.model.robot.state.info.online = value;
      // test
      // this.model.robot.state.info.online = false;
    },
    startRun() {
      console.log('start run');
      if (!this.saveStatus) {
        this.saveProject(() => {
          this.runProject();
        });
      }
      else {
        this.runProject();
      }
    },
    onsave() {
    },
    onunsave() {
    },
    quitPage(callback) {
      console.log(`quitPage Blockly.Running = ${window.Blockly.Running}`);
      if (window.Blockly.Running) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        });
        return;
      }
      // this.clearBlockly();
      if (this.saveStatus || this.emptyProject()) {
        // this.$router.push({ name: this.backStr });
        // this.$router.go(-1);
        this.clearBlockly();
        if (callback) {
          callback();
        }
      }
      else {
        this.model.commonStatusMgr.quitPageShow = true;
        this.onsave = () => {
          this.model.commonStatusMgr.quitPageShow = false;
          console.log('quit onsave');
          this.saveProject(() => {
            this.clearBlockly();
            if (callback) {
              callback();
            }
          })
        }
        this.onunsave = () => {
          console.log('quit onunsave');
          this.clearBlockly();
          if (callback) {
            callback();
          }
        }
        // this.$confirm('Are you quit without save or save?', 'Warning', {
        //   confirmButtonText: 'Quit and save',
        //   cancelButtonText: 'Quit without save',
        //   type: 'warning',
        // }).then(() => {
        //   // this.$router.push({ name: this.backStr });
        //   // this.$router.go(-1);
        //   this.saveProject(() => {
        //     this.clearBlockly();
        //     if (callback) {
        //       callback();
        //     }
        //   })
        // }).catch(() => {
        //   // console.log('quit canceled')
        //   // this.clearBlockly();
        //   // if (callback) {
        //   //   callback();
        //   // }
        // })
      }
    },
    insertProject(path) {
      if (path.name) {
        path.project = this.model.localAppsMgr.curProName
      }
      console.log(path)
      if (this.toCreateBlock.type === BLOCK_TYPES.app) {
        if (this.toCreateBlock.dispose) {
          this.toCreateBlock.dispose(false);
        }
        window.CommandsAppsSocket.getBlockXml(path).then((xml) => {
          console.log('get xml text', xml.xmlData)
          BlocklyCom.appendXML(xml.xmlData)
          this.toCreateBlock = {}
          // this.enableRun = this.blocksNotEmpty() // ReferenceError: blocksNotEmpty is not defined FileList,vue
        }, (data) => {
          this.$message({
            type: 'info',
            message: `get app xml failed, code${data.code}`,
            duration: 1000,
          })
        })
      }
      else if (this.toCreateBlock.type === BLOCK_TYPES.record_copy) {
        console.log('toCreateBlock type');
        console.log(this.toCreateBlock.type);
        // const newBlock = new Blockly.Block; // s.move_7.init();
        // const newBlock = new Blockly.Block(BlocklyCom.BlockWorkspace, 'move_7');
        // const newBlock = BlocklyCom.BlockWorkspace.newBlock('move_7');
        // newBlock.init();
        // BlocklyCom.BlockWorkspace.addTopBlock(newBlock)
        if (this.toCreateBlock.dispose) {
          this.toCreateBlock.dispose(false);
        }
        window.CommandsTeachSocket.getFile(path, (dict) => {
          // console.log(`total = ${total}`);
          console.log('debug:', dict);
          if (dict.code === 0) {
            // // const data = JSON.parse(dict.data);
            // const points = dict.data.points.map((point) => { return point.point });
            // const text = BlocklyCom.record2Text(points);
            // BlocklyCom.appendXML(text);
            BlocklyCom.record2Block(dict.data.points);
          }
        });
        // console.log(newBlock);
        this.toCreateBlock = {};
      }
      else {
        console.log('toCreateBlock type')
        console.log(this.toCreateBlock.type)
        const children = this.toCreateBlock.childBlocks_;
        const inputField = children[0].inputList[0].fieldRow[1];
        inputField.setText(path);
        this.toCreateBlock = {};
      }
      window.setTimeout(() => {
        this.xmlLoaded = true
        this.model.localAppsMgr.enableRun = this.blocksNotEmpty()
      }, 1600);
    },
    popDialog(type) {
      if (Object.prototype.hasOwnProperty.call(this.dialog, type)) {
        this.dialog[type]()
      }
    },
    saveProject(callback) {
      const name = this.model.localAppsMgr.curProName
      if (!name) {
        this.uiData.inputName = true
      }
      else {
        window.CommandsAppsSocket.createFile(name, this.projectContent(), () => {
          this.$message({
            message: 'Saved',
            type: 'success',
            duration: 1000,
          })
          this.uiData.inputName = false
          this.saveStatus = true
          if (typeof callback === 'function') {
            callback();
          }
        })
      }
      this.isNewPrj = false;
    },
    runProject() {
      if (this.blocksLength() > 0) {
        this.model.robot.state.showSetControlValueDialog = false;
        this.curPositionEditingBlock = null;
        Blockly.setBlocksDeletable(false);
        Blockly.onBlocklyProjectStart();
        Blockly.executeCode().then(() => {
        }).catch((err) => {
          this.$message({
            message: `excute error${err}`,
            type: 'error',
            duration: 1000,
          });
          console.log(err);
        });
      }
    },
    onIDE() {
      this.model.localAppsMgr.setProjListDialogType('ide');
    },
    onTeach() {
      this.model.localAppsMgr.setProjListDialogType('teach');
    },
    onTeachCopy() {
      this.model.localAppsMgr.setProjListDialogType('teach_copy');
    },
    onApp() {
      this.model.localAppsMgr.setProjListDialogType('app');
    },
    clearBlockly() {
      Blockly.clearWorkspace().then(() => {
        // this.uiData.inputName = true
        this.model.localAppsMgr.curProName = ''
        this.saveStatus = true
        console.log('workspace cleared')
      });
    },
    newProject() {
      // if (this.divDisable) {
      //   return false
      // }
      if (this.saveStatus || this.emptyProject()) {
        this.model.localAppsMgr.curProj = {};
        this.clearBlockly()
        this.isNewPrj = true;
        // this.model.localAppsMgr.curProName = ''
      }
      else {
        this.$confirm('Discard current changes and create new?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }).then(() => {
          this.model.localAppsMgr.curProj = {};
          this.clearBlockly()
        }).catch(() => {
          console.log('quit canceled')
        })
      }
    },
    genxml() {
      this.xmlCode = this.projectContent()
    },
    setPosition(data, wait, callback) {
      this.isMove = true;
      this.model.commonStatusMgr.blocklyCanUpdate = true;
      const self = this;
      window.CommandsRobotSocket.moveArcLine(data, true, (response) => {
        self.isMove = false;
        if (response.code === -6) {
          this.$message({
            message: self.$t('cannotArriveTip'),
            type: 'info',
            duration: 1000,
          })
        }
        else {
          callback();
        }
      });
    },
    setJoints(data, wait, callback) {
      this.isMove = true;
      this.model.commonStatusMgr.blocklyCanUpdate = true;
      const self = this;
      window.GlobalUtil.model.robot.state.func.setRobotMoveAllJoints(data, true, (dict) => {
        self.isMove = false;
        if (dict.code === -6) {
          this.$message({
            message: self.$t('cannotArriveTip'),
            type: 'info',
            duration: 1000,
          })
        }
        else  {
          callback();
        }
      });
    },
    onChangeEvent(event) {
      if (window.Blockly.Running) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        });
        return;
      }
      // this.isShowProjList = false;
      const blockId = event.blockId;
      const block = BlocklyCom.BlockWorkspace.getBlockById(blockId);
      const element = event.element;
      this.backToEdit();
      
      if (event.type === 'ui' && event.element === 'category') {
        this.createFlag = 1;
        // console.log('debug111:', event.type, block, element);
      }
      else if (event.type === 'create') {
        // console.log('debug222:', event.type, block.type, element);
        this.createFlag += 1;
        this.createBlockId = blockId;
      }

      if (event.type === 'move' && this.createFlag === 2) {
        const createBlock = BlocklyCom.BlockWorkspace.getBlockById(this.createBlockId);
        // console.log('debug333:', event.type, block.type, element);
        let values = [];
        // console.log('>>>', childBlocks[0]);
        if (createBlock.type === 'move_arc_to') {
          values.push(this.model.robot.state.local.position.x);
          values.push(this.model.robot.state.local.position.y);
          values.push(this.model.robot.state.local.position.z);
          values.push(this.model.robot.state.local.orientation.roll);
          values.push(this.model.robot.state.local.orientation.yaw);
          values.push(this.model.robot.state.local.orientation.pitch);
          values.push(-1);
        }
        else if (createBlock.type === 'move_7') {
          values = this.localJoints;
        }
        else if (createBlock.type === 'gripper_set') {
          const childBlocks = createBlock.getChildren();
          childBlocks[0].setFieldValue(this.model.robot.state.remote.gripper.pos, 'NUM');
          childBlocks[1].setFieldValue(this.model.robot.state.remote.gripper.speed, 'NUM');
        }
        else if (createBlock.type === 'gripper_speed') {
          const childBlocks = createBlock.getChildren();
          childBlocks[0].setFieldValue(this.model.robot.state.remote.gripper.speed, 'NUM');
        }
        else if (createBlock.type === 'gripper_position') {
          const childBlocks = createBlock.getChildren();
          childBlocks[0].setFieldValue(this.model.robot.state.remote.gripper.pos, 'NUM');
        }
        else if (createBlock.type === 'set_speed') {
          const childBlocks = createBlock.getChildren();
          childBlocks[0].setFieldValue(this.model.robot.state.remote.speed, 'NUM');
        }
        else if (createBlock.type === 'set_acceleration') {
          const childBlocks = createBlock.getChildren();
          childBlocks[0].setFieldValue(this.model.robot.state.remote.acceleration, 'NUM');
        }
        else if (createBlock.type === 'set_angle_speed') {
          const childBlocks = createBlock.getChildren();
          childBlocks[0].setFieldValue(this.model.robot.state.remote.angle_speed, 'NUM');
        }
        else if (createBlock.type === 'set_angle_acceleration') {
          const childBlocks = createBlock.getChildren();
          childBlocks[0].setFieldValue(this.model.robot.state.remote.angle_acceleration, 'NUM');
        }
        if (createBlock.type === 'move_7' || createBlock.type === 'move_arc_to') {
          const childBlocks = createBlock.getChildren()[0].getChildren();
          for (let i = 0; i < values.length; i += 1) {
            childBlocks[i].setFieldValue(values[i], 'NUM');
          }
        }
        this.createFlag = 0;
        this.createBlockId = null;
      }
      if (event.type !== 'create' && !(event.type === 'ui' && event.element === 'category') && !(event.type === 'ui' && event.element === 'selected')) {
        this.createFlag = 0;
        this.createBlockId = null;
      }

      if (block !== null && element === 'click') {
        const type = block.type;
        if (block.type === 'btn' && this.isMove === false) {
          this.isMove = true;
          // console.log('debug:', event.type, block.type, element);
          const curType = block.parentBlock_.type;
          this.curPositionEditingBlock = block.parentBlock_;
          if (curType === 'position7' || curType === 'position' || curType === 'position_r') {
            const curClickJoints = [];
            const childBlocks = block.parentBlock_.getChildren();
            for (let i = 0; i < 7; i += 1) {
              const childBlock = childBlocks[i];
              const number = childBlock.getFieldValue('NUM');
              curClickJoints[i] = Number(number);
            }
            const wait = childBlocks[7].getFieldValue('BOOL') === 'TRUE' ? true: false;
            if (curType === 'position7') {
              this.model.robot.state.isTcp = false;
              this.model.robot.state.isFittingMode = false;
              if (true) {
                const self = this;
                self.model.robot.state.showSetControlValueDialog = true;
                self.isUpdate = false;
                this.setJoints(curClickJoints, wait, () => {
                  self.isUpdate = true;
                });
              }
              else {
                // this.model.robot.state.showSetControlValueDialog = true;
                this.$message({
                  message: this.$t('robotIsNotOnline'),
                  type: 'info',
                  duration: 1000,
                });
                this.isMove = false;
              }
            }
            else if (curType === 'position' || curType === 'position_r') {
              this.model.robot.state.isTcp = true;
              this.model.robot.state.isFittingMode = false;
              if (this.stateOnline) {
                const data = {};
                data.position = {};
                data.orientation = {};
                data.position.x = curClickJoints[0] || 0;
                data.position.y = curClickJoints[1] || 0;
                data.position.z = curClickJoints[2] || 0;
                data.orientation.roll = curClickJoints[3] || 0;
                data.orientation.yaw = curClickJoints[4] || 0;
                data.orientation.pitch = curClickJoints[5] || 0;
                data.orientation.r = curClickJoints[6] || -1;
                const self = this;
                self.model.robot.state.showSetControlValueDialog = true;
                self.isUpdate = false;
                this.setPosition(data, wait, () => {
                  self.isUpdate = true;
                });
              }
              else {
                // this.model.robot.state.showSetControlValueDialog = true;
                this.$message({
                  message: this.$t('robotIsNotOnline'),
                  type: 'info',
                  duration: 1000,
                });
                this.isMove = false;
              }
            }
            else {
              this.isMove = false;
            }
          }
          else if (curType === 'gripper_set') {
            this.model.robot.state.isFittingMode = true;
            this.model.robot.state.showSetControlValueDialog = true;
            const childBlocks = block.parentBlock_.getChildren();
            setTimeout(() => {
              this.model.robot.state.local.gripper.pos = childBlocks[0].getFieldValue('NUM');
              this.model.robot.state.local.gripper.speed = childBlocks[1].getFieldValue('NUM');
              if (this.stateOnline) {
                window.CommandsRobotSocket.setGripperPosition(this.model.robot.state.local.gripper.pos, this.model.robot.state.local.gripper.speed, true, (dict) => {
                  this.isMove = false;
                  if (dict.code === 0) {
                    this.model.robot.state.local.gripper.enable = true;
                    this.model.robot.state.remote.gripper.enable = true;
                    this.model.robot.state.remote.gripper.speed = this.model.robot.state.local.gripper.speed;
                    this.model.robot.state.remote.gripper.pos = this.model.robot.state.local.gripper.pos;
                  }
                });
              }
              else {
                this.$message({
                  message: this.$t('robotIsNotOnline'),
                  type: 'info',
                  duration: 1000,
                });
                this.isMove = false;
              }
            }, 0);
          }
          else {
            this.isMove = false;
          }
          return;
        }
        // console.log('click type = ', type);
        // console.log(block);
        // const includeTypes = ['move_to', 'move_arc_to', 'position', 'position_r', 'move_7', 'position7'];
        const includeTypes = ['position', 'position_r', 'position7', 'gripper_position', 'gripper_speed'];
        this.model.robot.state.showSetControlValueDialog = false;
        this.curPositionEditingBlock = null;
        if (type === 'studio_copy_recording' || type === 'studio_run_app' ) {
          this.popDialog(type);
          return;
        }
        if (includeTypes.includes(type)) {
          // this.curPositionEditingBlock = block;
          // if (type === 'move_to' || type === 'move_arc_to' || type === 'move_7') {
          //   this.curPositionEditingBlock = block.getChildren()[0];
          // }
          const curType = block.type;
          if (curType === 'position7' || curType === 'position' || curType === 'position_r') {
            const curClickJoints = [];
            const childBlocks = block.getChildren();
            for (let i = 0; i < 7; i += 1) {
              const childBlock = childBlocks[i];
              const number = childBlock.getFieldValue('NUM');
              // console.log(`number = ${JSON.stringify(childBlock)}`);
              // console.log(`number = ${i}`);
              // console.log(`number = ${number}`);
              // console.log(childBlock);
              curClickJoints[i] = Number(number);
            }
            if (curType === 'position7') {
              this.model.robot.state.showSetControlValueDialog = true;
              this.model.robot.state.isTcp = false;
              this.model.robot.state.isFittingMode = false;
              // this.model.robot.state.isTcp = false;
              // // this.model.robot.state.local.joints = curClickJoints.concat();
              setTimeout(() => {
                this.model.robot.state.func.setLocalJoints(curClickJoints);
              });
              // // this.model.robot.state.func.resetParams();
            }
            else if (curType === 'position' || curType === 'position_r') {
              // this.model.robot.state.isTcp = true;
              // const joints = curClickJoints.concat();
              // this.model.robot.state.local.position = {
              //   x: joints[0],
              //   y: joints[1],
              //   z: joints[2],
              // };
              // this.model.robot.state.local.orientation = {
              //   roll: joints[3],
              //   yaw: joints[4],
              //   pitch: joints[5],
              // };
            }
          }
          else if (curType === 'gripper_position' || curType === 'gripper_speed') {
            this.model.robot.state.isFittingMode = true;
            this.model.robot.state.showSetControlValueDialog = true;
            this.model.commonStatusMgr.showToggleBtn = true;
            this.model.commonStatusMgr.ControlPositionShow = false;
            if (curType === 'gripper_position') {
              this.curPositionEditingBlock = block;
              const childBlocks = block.getChildren();
              setTimeout(() => {
                this.model.robot.state.local.gripper.pos = childBlocks[0].getFieldValue('NUM');
                if (this.stateOnline) {
                  window.CommandsRobotSocket.setGripperPosition(this.model.robot.state.local.gripper.pos, this.model.robot.state.local.gripper.speed, true, (dict) => {
                    if (dict.code === 0) {
                      this.model.robot.state.local.gripper.enable = true;
                      this.model.robot.state.remote.gripper.enable = true;
                      this.model.robot.state.remote.gripper.speed = this.model.robot.state.local.gripper.speed;
                      this.model.robot.state.remote.gripper.pos = this.model.robot.state.local.gripper.pos;
                    }
                  });
                }
                else {
                  this.$message({
                    message: this.$t('robotIsNotOnline'),
                    type: 'info',
                    duration: 1000,
                  });
                }
              }, 0);
            }
            else if (curType === 'gripper_speed') {
              this.curPositionEditingBlock = block;
              const childBlocks = block.getChildren();
              setTimeout(() => {
                this.model.robot.state.local.gripper.speed = childBlocks[0].getFieldValue('NUM');
              }, 0)
            }
          }
          // this.model.robot.state.showSetControlValueDialog = true;
        }
      }
      else if (element !== 'field') {
        // if (this.curPositionEditingBlock !== null) {
        //   this.model.robot.state.showSetControlValueDialog = false;
        //   this.curPositionEditingBlock = null;
        // }
        this.model.robot.state.showSetControlValueDialog = false;
        this.curPositionEditingBlock = null;
        // this.isShowProjList = false;
      }
      if (block !== null && event.type === Blockly.Events.CREATE && this.xmlLoaded) {
        const type = block.type
        if (!Object.is(block, {})) {
          if (!this.disableLoadProject) {
            this.popDialog(type)
          }
        }
        console.log('sss', type, block)
        if (type === BLOCK_TYPES.app || type === BLOCK_TYPES.record_copy) {
          console.log('delete block type: APP')
          this.toCreateBlock = {}
          this.toCreateBlock.type = type
          block.dispose(false)
          this.xmlLoaded = false
        }
        else {
          this.toCreateBlock = block
          console.log('onchange 2')
        }
      }
      else if (this.blocksLength() >= 0 && event.type !== 'ui') {
        if (this.isNewPrj !== true) {
          this.saveStatus = false;
        }
        else {
          this.isNewPrj = false;
        }
        console.log(this.blocksLength())
        if (!this.model.localAppsMgr.curProName) {
          this.pre = 'Untitled'
        }
        else {
          this.pre = ''
        }
        console.log(`event ${event.type} emit change save status to false`)
      }
      else {
        console.log('not handled', event)
      }
    },
    // toggleSideShow() {
    //   this.model.commonStatusMgr.blocklyRobotShow = !this.model.commonStatusMgr.blocklyRobotShow;
    //   this.uiData.sideShow = !this.uiData.sideShow
    //   // window.setTimeout(this.resizeWorkspace, 0)
    // },
    toggleSideShow2() {
      this.model.robot.state.showSetControlValueDialog = !this.model.robot.state.showSetControlValueDialog;
      if (!this.model.robot.state.showSetControlValueDialog) {
        this.curPositionEditingBlock = null;
        this.model.commonStatusMgr.blocklyCanUpdate = true;
      }
    },
    initBlocklyDiv() {
      return new Promise((resolve) => {
        BlocklyCom.init(this.$i18n.locale);
        const blocklyDiv = document.getElementById('tab-blocks');
        Blockly.initBlockly(blocklyDiv);
        resolve();
      });
    },
    endCallback() {
      Blockly.setBlocksDeletable(true);
      Blockly.onBlocklyProjectStop();
      // window.UArm.stop_all();
      BlocklyLib.KeyPressEvent.clearEventListener();
      Blockly.Running = false;
      this.model.localAppsMgr.enableRun = true;
    },
    // loadProject(projectName) {
    //   return new Promise((resolve, reject) => {
    //     window.FileManager.loadProject(this.moduleName, projectName).then((xmlText) => {
    //       window.UserConfig.setItem(this.moduleName, 'LastProjectName', projectName);
    //       Blockly.loadWorkspace(xmlText, this.onChangeEvent);
    //       // this.containVisionBlock();
    //       resolve();
    //     }).catch(err => reject(err));
    //   });
    // },
    loadProject(item) {
      console.log(`item item = ${JSON.stringify(item)}, ${this.model.localAppsMgr.curProj.label}`);
      if (this.model.localAppsMgr.curProj.label && window.GlobalUtil.model.localAppsMgr.enableRun === false && this.blocksNotEmpty()) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        })
        return;
      }
      this.backToEdit()
      const path = item.label;
      // if (path === this.model.localAppsMgr.curProj.label) {
      //   console.log('selected')
      // }
      if (this.disableLoadProject) {
        this.$message({
          message: 'Click too fast',
          duration: 1000,
        })
      }
      else if (this.saveStatus || this.emptyProject()) {
        this.getProject(item)
      }
      else {
        this.$confirm('Are you sure load app without save?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }).then(() => {
          this.model.robot.state.showSetControlValueDialog = false;
          this.curPositionEditingBlock = null;
          this.model.commonStatusMgr.blocklyCanUpdate = true;
          this.getProject(item)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'load app canceled',
            duration: 1000,
          })
        })
      }
    },
    controlProjList(show) {
      this.isShowProjList = show;
    },
    getProject(item) {
      console.log('type of item', typeof item, item);
      const path = item.label;
      const self = this;
      this.disableLoadProject = true;
      this.isNewPrj = false;
      // window.setTimeout(() => {
      //   this.disableLoadProject = false
      //   this.model.localAppsMgr.enableRun = self.blocksNotEmpty()
      // }, 1500)
      const data = {
        category: this.category,
        name: path,
      }
      console.log(`path = ${path}, category = ${this.category}`);
      window.CommandsAppsSocket.getProject(data).then((xml) => {
        // console.log('get xml return', xml.xmlData)
        Blockly.clearWorkspace().then(() => {
          Blockly.loadWorkspace(xml.xmlData, this.onChangeEvent)
          this.model.localAppsMgr.curProName = path
          this.model.localAppsMgr.curProj = item;
          window.setTimeout(() => {
            this.saveStatus = true;
            this.disableLoadProject = false;
            this.model.localAppsMgr.enableRun = self.blocksNotEmpty()
          })
        })
      }, (error) => {
        this.disableLoadProject = false;
        this.$message({
          message: `get xml error code${error.code}`,
          duration: 1000,
        })
      })
    },
    resizeWorkspace() {
      const blocklyArea = document.getElementById('blockly-area');
      const blocklyDiv = document.getElementById('tab-blocks');
      let element = blocklyArea;
      if (blocklyArea === null || blocklyDiv === null) {
        return;
      }
      // console.log('resize', blocklyArea.offsetWidth, blocklyArea.offsetHeight)
      let x = 0;
      let y = 0;
      if (element === null) {
        return;
      }
      do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
      } while (element);
      blocklyDiv.style.left = `${x}px`;
      blocklyDiv.style.top = `${y}px`;
      blocklyDiv.style.width = `${blocklyArea.offsetWidth}px`;
      blocklyDiv.style.height = `${blocklyArea.offsetHeight - 1}px`;
      Blockly.svgResize(BlocklyCom.BlockWorkspace);
    },
    // handleTabChange(val) {
    //   this.activeTab = val;
    //   if (this.activeTab === this.constData.tabName.BLOCKS) {
    //     BlocklyCom.BlockWorkspace.setVisible(true);
    //     setTimeout(() => {
    //       Blockly.svgResize(BlocklyCom.BlockWorkspace);
    //     }, 0);
    //   }
    //   else {
    //     BlocklyCom.BlockWorkspace.setVisible(false);
    //   }
    // },
    projectContent() {
      const xml = Blockly.generateXML();
      if (xml !== '') {
        return xml;
      }
      return null;
    },
    emptyProject() {
      return !this.blocksLength() && !this.model.localAppsMgr.curProj.label;
    },
    blocksNotEmpty() {
      // console.log('block length', this.blocksLength());
      return this.blocksLength() > 0;
    },
    blocksLength() {
      if (BlocklyCom.BlockWorkspace) {
        return BlocklyCom.BlockWorkspace.getAllBlocks().length;
      }
      return 0;
    },
    projectSaveStatus() {
      const self = this;
      const projectContent = self.blocklyData.projectFileContent;
      let status;
      if (BlocklyCom.BlockWorkspace !== null) {
        if (projectContent === null && self.blocksLength() <= 0) {
          status = true;
        }
        else if (projectContent === null && self.blocksLength() > 0) {
          status = false;
        }
        else {
          status = self.projectContent() === projectContent;
        }
      }
      else {
        status = true;
      }
      return status;
    },
  },
  computed: {
    stateOnline() {
      return this.$store.state.robot.info.online === true;
    },
    displayProjectTitle() {
      return this.blocklyData.projectName !== null ?
        this.blocklyData.projectName : this.constData.untitledProject;
    },
    notSaved() {
      console.log('block length', this.blocksLength())
      return this.saveStatus ? '' : `${this.pre}*`
    },
    localJoints: {
      get() {
        const arr = this.$store.getters.localJoints;
        return arr;
      },
    },
    localEnd: {
      get() {
        return this.$store.getters.end;
      },
    },
    localGripper: {
      get() {
        const gripper = {};
        gripper.pos = this.model.robot.state.local.gripper.pos;
        gripper.speed = this.model.robot.state.local.gripper.speed;
        return gripper;
      }
    }
  },
  watch: {
    'model.localAppsMgr.curProName'() {
      if (this.model.localAppsMgr.curProName) {
        this.pre = ''
      }
    },
    uarmConnectStatus() {
      if (this.uarmConnectStatus) setTimeout(Blockly.onUArmConnect, 5000);
    },
    localGripper(newValue) {
      if (this.model.robot.state.showSetControlValueDialog === true && this.curPositionEditingBlock !== null && this.model.robot.state.remote.gripper.enable) {
        if (this.curPositionEditingBlock.type === 'gripper_set') {
          const childBlocks = this.curPositionEditingBlock.getChildren();
          childBlocks[0].setFieldValue(newValue.pos, 'NUM');
          childBlocks[1].setFieldValue(newValue.speed, 'NUM');
        }
        else if (this.curPositionEditingBlock.type === 'gripper_speed') {
          const childBlocks = this.curPositionEditingBlock.getChildren();
          childBlocks[0].setFieldValue(newValue.speed, 'NUM');
        }
        else if (this.curPositionEditingBlock.type === 'gripper_position') {
          const childBlocks = this.curPositionEditingBlock.getChildren();
          childBlocks[0].setFieldValue(newValue.pos, 'NUM');
        }
      }
    },
    localEnd(newValue) {
      console.log(`blockly localEnd(newValue) = ${JSON.stringify(newValue)}`);
      const tempNums = [];
      tempNums[0] = newValue.position.x;
      tempNums[1] = newValue.position.y;
      tempNums[2] = newValue.position.z;
      tempNums[3] = newValue.orientation.roll;
      tempNums[4] = newValue.orientation.yaw;
      tempNums[5] = newValue.orientation.pitch;
      tempNums[6] = 0; // R
      if (this.model.robot.state.showSetControlValueDialog === true && this.curPositionEditingBlock !== null && this.isMove === false && this.isUpdate === true && this.model.commonStatusMgr.blocklyCanUpdate) {
        const curType = this.curPositionEditingBlock.type;
        if (curType === 'position' || curType === 'position_r') {
          const childBlocks = this.curPositionEditingBlock.getChildren(); // math_number
          for (let i = 0; i < 7; i += 1) {
            const childBlock = childBlocks[i];
            console.log(childBlock.type);
            if (curType === 'position_r' && i >= 7 - 1) {
            }
            else {
              childBlock.setFieldValue(tempNums[i], 'NUM');
            }
          }
        }
      }
    },
    localJoints(newValue) {
      // console.log('debug:', newValue);
      if (this.model.robot.state.showSetControlValueDialog === true && this.curPositionEditingBlock !== null && this.isMove === false && this.isUpdate === true && this.model.commonStatusMgr.blocklyCanUpdate) {
        if (this.curPositionEditingBlock.type === 'position7') {
          const childBlocks = this.curPositionEditingBlock.getChildren(); // math_number
          for (let i = 0; i < 7; i += 1) {
            const childBlock = childBlocks[i];
            console.log(childBlock.type);
            childBlock.setFieldValue(newValue[i], 'NUM');
          }
        }
      }
    },
  },
};

</script>
<style lang="scss" src="@/assets/css/blockly.scss"></style>
<style lang="scss" scoped>
  $themeOrange:#D95E2E;
  .div-disable {
    pointer-events: none;
    opacity: 0.8;
  }
  .main-wrapper {
    display: flex;
    flex-direction: row;
    height: 90%;
    overflow: hidden;
    #blockly-area {
      width: 66.2%;
      min-height: 500px;
      position: relative;
      .hide-button {
        position: absolute;
        /*height: 40px;*/
        width: 10px;
        border-bottom: 8px solid transparent;
        border-right: 12px solid #F5F5F5;
        border-top: 8px solid transparent;
        line-height: 30px;
        right: 0;
        top: 0;
        z-index: 39;
        cursor: pointer;
        text-align: center;
        color: #767676;
      }
      .hide-button .rotate {
        transform: rotate(-180deg);
      }
      .hide-control-button {
        position: absolute;
        /*height: 40px;*/
        width: 10px;
        border-bottom: 8px solid transparent;
        border-right: 12px solid #F5F5F5;
        border-top: 8px solid transparent;
        line-height: 30px;
        right: 0;
        top: 20px;
        z-index: 39;
        cursor: pointer;
        text-align: center;
        color: #767676;
      }
      .hide-control-button .rotate {
        transform: rotate(-180deg);
      }
    }
    #slide-area {
      background: #ccc;
      width: 33.8%;
      position: relative;
      .file-list {
        height: 55%;
      }
    }
  }
  /*==========*/
  .blockly-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .blockly-wrapper.notfull{
    width: 80%;
  }
  .blockly-header {
    display: flex;
  }
  .page-main {
    display: flex;
    width: 100%;
    flex: 1;
  }

  .project-name {
    display: table-cell;
    width: 10%;
  }

  .content-code {
    padding-bottom:1vw;
    height:94%;
    width:100%;
    overflow: auto;
  }

  .blockoy-workspace {
    flex: 1;
  }

  .blockly-sidebar {
    flex: 0;
  }

  pre.blockoy-workspace {
    border: 1px solid #ccc;
    overflow: scroll;
  }

  #blocklyDiv {
    position: absolute;
  }

  .farSide {
    text-align: right;
  }

  /* Buttons */


  #blockly-page h1 {
    font-weight: normal;
    font-size: 140%;
    margin-left: 5px;
    margin-right: 5px;
  }

  .content {
    visibility: hidden;
    margin: 0;
    padding: 1ex;
    position: absolute;
    direction: ltr;
  }

  pre.content {
    border: 1px solid #ccc;
    overflow: scroll;
  }

  #content_blocks {
    padding: 0;
  }

  .blocklySvg {
    border-top: none !important;
  }

  #content_xml {
    resize: none;
    outline: none;
    border: 1px solid #ccc;
    font-family: monospace;
    overflow: scroll;
  }

  #languageMenu {
    vertical-align: top;
    margin-top: 15px;
    margin-right: 15px;
  }

  /* Sprited icons. */

  .trash {
    background-position: 0px 0px;
  }

  .link {
    background-position: -21px 0px;
  }

  .run {
    background-position: -42px 0px;
  }

  /* add for uarm studio */

  .app-container {
    background: #F6F6F6;
    height: 100%;
    color: #222;
    display: flex;
    flex-direction: row;
  }

  .modal .modal-footer {
    text-align: center;
  }


  .uarm-name img {
    width: 50%;
    margin-top: 14%;
    padding-bottom: 7%;
  }

  input:not([type]) {
    height: auto;
    margin: 0;
    border: none;
    background-color: aliceblue;
  }


  #wrist-canvas:active, #turn-canvas:active, #wrist-canvas:hover, #turn-canvas:hover {
    cursor: move;
  }

  #modal-turn .modal-content, #modal-wrist .modal-content {
    padding-bottom: 0;
  }

  .light-green, .label-success {
    background-color: #B0D586 !important;
    font-size: 90% !important;
    padding: 6px 17px;
    border-radius: 100px;
    font-weight: normal;
    color: white;
  }

  .label-default {
    font-size: 75% !important;
    padding: 6px 17px;
    border-radius: 100px;
    font-weight: normal;
  }

  .sidebar-wrapper button, .hardware-wrapper button {
    width: 52%;
  }

  .sidebar-wrapper table, .hardware-wrapper table {
    margin: 0 20%;
    width: 60%;
    word-wrap: normal;
  }
  .mu-overlay {
    background-color: transparent !important;
  }

  .switch label input[type=checkbox]:checked + .lever {
    background-color: #ccc;
    &:after {
      background-color: #52BF53;
    }
  }

  .mu-menu-list {
    padding: 0;
    overflow: hidden;
    width: 240px;
    .mu-menu-item-wrapper {
      height: 44px;
      font-size: 12px;
      line-height: 44px;
      border-bottom: 1px solid #e6e6e6;
    }
  }

  #blockly-page {
    .mu-card .mu-card-header {
      padding: 10px 16px;
      .mu-card-title {
        font-size: 14px;
        color: #E95516;
        letter-spacing: 0.89px;
      }
    }

    .tabs-bar {
      display: flex;
      background-color: #555;
      color:white;
      min-height: 45px;
      align-items: center;
      justify-content: space-between;
      min-height: 45px;
      .mu-flat-button-label{
        color:white;
      }
    }
    .tab-title {
      height: 45px;
      line-height: 45px;
      text-align: center;
      color: #f9f9f9;
      cursor: pointer;
      .mu-flat-button-label{
        font-size: 14px;
        color:white !important;
        font-family: 'PingFangSC-Light','sans-serif';
      }
      .demo-flat-button{
        margin-right:3vw;
      }
    }
    .tabs {
      height: 45px;
      width: 35%;
      background-color: #555;
      .tab {
        line-height: 45px;
        height: 45px;
        a {
          font-size: 12px;
          color: #555;
          opacity: 0.8;
          &:hover, &.active {
            color: #E95516;
          }
        }
      }
      .indicator {
        background-color: #E95516;
      }
      button {
        color: #fff;
        padding-top: 8px;
        padding-bottom: 8px;
        .mu-tab-text {
          font-size: 12px;
          color:white !important;
          font-family: 'Microsoft YaHei','STXihei';
        }
        .mu-flat-button-label{
          color:white !important;
          font-family: 'Microsoft YaHei','STXihei';
        }
      }
    }
  }

  [type="checkbox"] {
    + label {
      width: 100%;
      padding-left: 0px 16%;
      color: #555;
      font-size: 12px;
      height: 40px;
      line-height: 40px;
      &:before {
        width: 12px;
        height: 12px;
        border: 2px solid #777;
        margin-top: 6px;
        margin: 14px 6%;
      }
    }
    &:not(.filled-in) + label:after {
      width: 12px;
      height: 12px;
      border: 2px solid #777;
      margin-top: 6px;
      margin: 14px 6%;
    }
    &:checked + label {
      color: white;
      background: #5A93D7;
      &:before {
        width: 8px;
        height: 16px;
        border-right: 2px solid white;
        border-bottom: 2px solid white;
      }
    }
  }

  #modal-move img {
    cursor: pointer;
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  }

  .swal2-modal {
    .swal2-title {
      font-size: 12px;
      color: #555555;
      font-weight: 200;
    }
    .swal2-input {
      height: 30px;
      padding: 0 12px;
    }
    .swal2-styled {
      padding: 1px 10px;
      font-size: 12px;
      font-weight: 300;
    }
    .swal2-confirm {
      background-color: #52BF53;
      border-left-color: #52BF53;
      border-right-color: #52BF53;
    }
  }

  .mu-dialog {
    height: 100%;
    background-color: #fff;
    display:flex;
    flex-direction:column;
    .mu-dialog-title {
      flex-direction: column;
      font-size: 14px;
    }
    .mu-dialog-actions {
      justify-content: center;
    }
  }
  .blockly-workspace {
    flex: 1;
    height:100%;
    width:100%;
  }

  .blockly-sidebar {
    flex: 0;
  }

  pre.blockly-workspace {
    border: 1px solid #ccc;
    overflow: scroll;
  }

  .back-button {
    padding-right: 10px;
    border-right: 2px #505050 solid;
    cursor: pointer;
  }

  .runButton-running {
    border-radius: 0;
    background-color: #0a5;
    &:hover {
      background-color: #dd4b39;
    }
  }

  .runButton-stop {
    border-radius: 0;
    background-color: transparent;
    &:hover {
      background-color: #0a5;
    }
  }
</style>
