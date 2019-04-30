<template>
  <div class="side-wrapper ">

    <div v-if="!isEditBlock || !model.robot.state.showSetControlValueDialog" class="menu-wrapper">
      <div @click="toggleControl()" :class="{'slected-color':model.robot.state.showSetControlValueDialog}">
      <el-tooltip class="item" effect="dark" :content="$t('control')" placement="left-start" :manual="model.commonStatusMgr.isMobile">
        <div class="control-btn com-icon-btn">
          
        </div>
      </el-tooltip>
      </div>


      <div v-if="isRunning===false">
        <el-tooltip class="item" effect="dark" :content="$t('run')" placement="left-start" :manual="model.commonStatusMgr.isMobile">
          <div v-if="isFileSelected" class="run-btn com-icon-btn" @click="onrun"></div>
          <div v-else class="run-btn com-icon-btn" style="opacity:0.4;"></div>
        </el-tooltip>
      </div>

      <div v-else @click="onstop()">
        <el-tooltip class="item" effect="dark" :content="$t('top')" placement="left-start" :manual="model.commonStatusMgr.isMobile">
          <div class="stop-btn com-icon-btn"></div>
        </el-tooltip>
      </div>

     <!-- <div @click='onlist'>
        <el-tooltip class="item" effect="dark" :content="$t('list')" placement="top" :manual="model.commonStatusMgr.isMobile">
          <div class="list-btn com-icon-btn"></div>
        </el-tooltip>
      </div>  -->


      <div @click='onnew' v-if="!model.robot.state.showSetControlValueDialog">
        <el-tooltip class="item" effect="dark" :content="$t('new')" placement="left-start" :manual="model.commonStatusMgr.isMobile">
          <div class="add-btn com-icon-btn"></div>
        </el-tooltip>
      </div>


      <div v-if="issaved===false" @click='onsave'>
        <el-tooltip class="item" effect="dark" :content="$t('save')" placement="left-start" :manual="model.commonStatusMgr.isMobile">
          <div class="save-btn com-icon-btn"></div>
        </el-tooltip>
      </div>

      <div v-if="issaved === false" @click="onCancle">
       
        <el-tooltip class="item" effect="dark" :content="$t('cancle')" placement="left-start" :manual="model.commonStatusMgr.isMobile">
          <i class="el-icon-circle-close " style="color: red;font-size: 20px;cursor: pointer;"></i>
        </el-tooltip>
      </div>

     <!-- <div v-else style="opacity: 0.3;">
        <el-tooltip class="item" effect="dark" :content="$t('save')" placement="top" :manual="model.commonStatusMgr.isMobile">
          <div class="save-btn com-icon-btn"></div>
        </el-tooltip>
      </div> -->



    </div>
    <div v-else class="menu-wrapper">
      <button class="simple-btn" @click="onConfirmEditBlock()" type="primary" style="margin: 20px 0;background:#d87046;color: #fff;" plain>{{ $t('confirm') }}</button>
      <button class="simple-btn" @click="onCancleEditBlock()"  type="info" plain>{{ $t('giveUp') }}</button>
    </div>
  </div>
</template>

<script>

export default {
  props: ['type', 'title', 'onback', 'onsave', 'onnew', 'onstart', 'onstop', 'onlist', 'curFileName', 'issaved', 'isRunning', 'isFileSelected','onCancle',
    'isEditBlock', 'onConfirmEditBlock', 'onCancleEditBlock'
  ],
  name: 'common-top-menu',
  i18n: {
    messages: {
      en: {
        control: 'Control',
        save: 'Save',
        new: 'New',
        list: 'List',
        run: 'Run',
        stop: 'Stop',
        // cancle: 'No Save',
        offlineTips: 'The xArm is offline, please switch to online mode.',
        cancle: "Cancel",
        confirm: "Save",
        giveUp: "Cancel",
      },
      cn: {
        control: '控制',
        save: '保存',
        new: '新建',
        list: '列表',
        run: '运行',
        stop: '停止',
        cancle: '取消保存',
        offlineTips: '机械臂处于离线状态，请切换在线模式。',
        cancle: "取消",
        confirm: "保存",
        giveUp: "放弃",
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
    };
  },
  mounted() {
  },
  activated: function() {
  },
  methods: {
    confirmEdit() {
      this.model.robot.state.showSetControlValueDialog = false;
      this.model.commonStatusMgr.blocklyCanUpdate = true;
    },
    cancleEdit() {
      this.model.robot.state.showSetControlValueDialog = false;
      this.model.commonStatusMgr.blocklyCanUpdate = false;
    },
    onrun() {
      if (!this.isConnected) {
        const errorMessage = this.$t('offlineTips'); // window.language.currentLang === 'en' ? 'The xArm is offline, please switch to online mode.' : '机械臂处于离线状态，请切换在线模式。';
        this.$message({
          message: errorMessage,
          type: 'warning',
          duration: 1000, 
        });
        return;
      }
      this.onstart();
    },
    toggleControl() {
      this.model.robot.state.showSetControlValueDialog = !this.model.robot.state.showSetControlValueDialog;
      // this.model.commonStatusMgr.showToggleBtn = true;
      if (!this.model.robot.state.showSetControlValueDialog) {
        this.curPositionEditingBlock = null;
        this.model.commonStatusMgr.blocklyCanUpdate = true;
      }
    },
  },
  beforeDestroy() {
  },
  watch: {
  },
  computed: {

    isConnected() {
      if (this.$store.state.robot.status.connected && this.$store.state.robot.info.online) {
        return true;
      }
      return false;
    },
    // classObject1: () => ({
    //   'opacity0': this.isFileSelected === '0',
    //   'opacity1': this.isFileSelected === '1',
    // }),
  },
  components: {
  },
};
</script>
<style scoped lang="scss">

.side-wrapper  {
  height:100%;
  width: 70px;
  border-left: 1px solid #e3e3e3;
}

.menu-wrapper {

  display: flex;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  & > div {
    // padding: 0 1vw;
    // padding-left: 5px;
    // padding-right: 10px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 10px;
    span {
      // font-size: 0.7em;
      font-size: 10px;
      padding-top: 3px;
      margin: 0;
      line-height: 1.2vw;
      text-transform: capitalize;
    }
  }
  .com-icon-btn {
    width: 32px;
    height: 32px;
    border: 0;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 26px 26px;
    position: relative;
    cursor: pointer;
  }
  .save-btn {
    background-image: url("./../../assets/img/blockly/btn_save.svg");
  }
  .add-btn {
    background-image: url("./../../assets/img/blockly/btn_addfile.svg");
  }
  .list-btn {
    background-image: url("./../../assets/img/blockly/btn_list.svg");
  }
  .run-btn {
    background-image: url('./../../assets/img/blockly/btn_start.svg');
  }
  .stop-btn {
    background-image: url('./../../assets/img/blockly/btn_stop.svg');
  }
  .control-btn {
     background-image: url('./../../assets/img/blockly/btn_control.svg');
  }
  .simple-btn {
    border: 1px solid #eae4e4;
    padding: 10px 2px;
    border-radius: 6px;
    cursor: pointer;
   
  }
}

.slected-color {
  background: #d8d7d7;
}
</style>
