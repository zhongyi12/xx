<template>
  <div class="com-header-wrapper ">
    <div class="back-wrapper ">
      <span class="com-back-title el-icon-arrow-left"  v-if="model.commonStatusMgr.panelIsHidden === true">
        {{ title }}
      </span>
    </div>
    <div class="file-name" v-text="curFileName"></div>
    <div class="menu-wrapper" style="position: absolute;left: 150px;width: 250px;">
      <div v-if="issaved === false" @click="onCancle">
        <i class="el-icon-circle-close " style="color: red;font-size: 16px;cursor: pointer;margin-right: 15px;"></i>
      </div>
      <div v-if="issaved===false" @click='onsave'>
        <!--<span>{{ $t('save') }}</span>-->
        <el-tooltip class="item" effect="dark" :content="$t('save')" placement="bottom" :manual="model.commonStatusMgr.isMobile">
          <div class="save-btn com-icon-btn"></div>
        </el-tooltip>
      </div>
      <div v-else style="opacity: 0.3;">

        <!--<span>{{ $t('save') }}</span>-->
        <el-tooltip class="item" effect="dark" :content="$t('save')" placement="bottom" :manual="model.commonStatusMgr.isMobile">
          <div class="save-btn com-icon-btn"></div>
        </el-tooltip>
      </div>
      <div @click='onnew'>

        <!--<span>{{ $t('new') }}</span>-->
        <el-tooltip class="item" effect="dark" :content="$t('new')" placement="bottom" :manual="model.commonStatusMgr.isMobile">
          <div class="add-btn com-icon-btn"></div>
        </el-tooltip>
      </div>
      <div @click='onlist'>

        <!--<span>{{ $t('list') }}</span>-->
        <el-tooltip class="item" effect="dark" :content="$t('list')" placement="bottom" :manual="model.commonStatusMgr.isMobile">
          <div class="list-btn com-icon-btn"></div>
        </el-tooltip>
      </div>
      <div v-if="isRunning===false">
        <el-tooltip class="item" effect="dark" :content="$t('run')" placement="bottom" :manual="model.commonStatusMgr.isMobile">
          <div v-if="isFileSelected" class="run-btn com-icon-btn" @click="onrun"></div>
          <div v-else class="run-btn com-icon-btn" style="opacity:0.4;"></div>
        </el-tooltip>
      </div>
      <div v-else @click="onstop()">
        <el-tooltip class="item" effect="dark" :content="$t('top')" placement="bottom" :manual="model.commonStatusMgr.isMobile">
          <div class="stop-btn com-icon-btn"></div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['type', 'title', 'onback', 'onsave', 'onnew', 'onstart', 'onstop', 'onlist', 'curFileName', 'issaved', 'isRunning', 'isFileSelected','onCancle'],
  name: 'common-top-menu',
  i18n: {
    messages: {
      en: {
        save: 'Save',
        new: 'New',
        list: 'List',
        run: 'Run',
        stop: 'Stop',
        offlineTips: 'The xArm is offline, please switch to online mode.',
      },
      cn: {
        save: '保存',
        new: '新建',
        list: '列表',
        run: '运行',
        stop: '停止',
        offlineTips: '机械臂处于离线状态，请切换在线模式。',
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
    }
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

// .opacity0 {
//   opacity: 0.4;
// }

// .opacity1 {
//   opacity: 1;
//   cursor: pointer;
// }

.com-header-wrapper {
  background: white;
  position: relative;
  span {
    margin-left: 1rem;
    // font-family: 'Gotham-Bold';
    font-size: 18px;
    /*color: #fff;*/
    letter-spacing: -1px;
  }
  .file-name {
    /*color: white;*/
    font-family: 'Gotham-Bold';
    position: absolute;
    left: 16%;
    // right: 0;
    // width: 173px;
    // margin: 0 auto;
  }
}

.menu-wrapper {
  // position: absolute;
  // right: 426px;
  // top: 2px;
  display: flex;
  // border-right: 1px solid rgba(128, 128, 128, 0.49);
  height: 36px;
  // width: 202px;
  display: flex;
  justify-content: space-around;
  position: absolute;
  right: 0;
  & > div {
    // padding: 0 1vw;
    // padding-left: 5px;
    // padding-right: 10px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    cursor: pointer;
    margin-right: 15px;

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
}

</style>
