<template>
  <el-container class="hello emulator-container">
    <CommonTopMenuLeft v-if="isControl"
      :backTitle="$t('control')"
      :onBack="onBack">
    </CommonTopMenuLeft>
    <!-- <div :class="isIpad?'ipad-control-wrapper':'pc-control-wrapper'">
    <div style="width:23%;height:26%;position: absolute;z-index:999;top: 11%;left:4%"><slot name="xarm" :size="98"></slot></div>
    <togetherControl></togetherControl></div> -->
    <div :class="isIpad ? 'ipad-control-wrapper' : 'pc-control-wrapper'">
      <togetherControl>
        <div slot="xarm" slot-scope="slotProps" style="height: 100%">
          <slot name="xarm" :slotProps="slotProps" style="height: 100%"></slot>
        </div>
      </togetherControl>
    </div>
    
  </el-container>
</template>

<script>
import Vue from 'vue';
import ToggleButton from 'vue-js-toggle-button';

import CommonTopMenuLeft from './common/CommonTopMenuLeft';

import togetherControl from './Control/togetherControl';//

Vue.use(ToggleButton);
export default {
  name: 'Emulator',
  i18n: {
    messages: {
      en: {
        control: 'Control',
        off: 'OFF',
        on: 'ON',
        liveControl: 'Live Control',
      },
      cn: {
        control: '控制',
        off: '关闭',
        on: '打开',
        liveControl: '实时控制',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      test: null,
      backStr: 'Home',
      msg: 'Emulator',
    };
  },
  mounted() {
    this.getModelCotainerSize();
    window.addEventListener('resize', this.getModelCotainerSize);//
    this.afterActivated();
    this.model.robot.state.showSetControlValueDialog = true;
  },
  activated: function() {
    this.afterActivated();
  },
  beforeDestroy() {
    console.log('before Destroy before Destroy');
    window.removeEventListener('resize', this.getModelCotainerSize, false);
    // this.model.robot.state.showSetControlValueDialog = false;
  },
  methods: {
    controlShow() {
      this.model.commonStatusMgr.controlShow = !this.model.commonStatusMgr.controlShow;
//      console.log('sd');
    },
    onmovetimer(state) {
      this.moveStr = `${JSON.stringify(this.model.robot.state.intervalInfo)}`;
      const data = this.model.robot.state.func.intervalInfo2ArcParams();
      console.log(`on move timer intervalInfo = ${JSON.stringify(this.model.robot.state.intervalInfo)}`);
      console.log(`on move timer parmas = ${JSON.stringify(data)}, state = ${state}`);
      if (this.model.robot.state.func.reset() === true) {
        window.CommandsRobotSocket.setMoveArcLine({ enable: false }, (dict) => { console.log(dict) });
        return;
      }
      data['enable'] = true;
      window.CommandsRobotSocket.setMoveArcLine(data, (dict) => {
        console.log('roll yaw socket res', dict);
      });
    },
    onBack() {
      // this.$router.push(this.backStr);
      // this.$router.push({ name: this.backStr });
      this.$router.go(-1);
    },
    afterActivated() {
      this.backStr = 'Home';
      if (this.$route.params.data !== undefined) {
        this.backStr = 'AppStore';
      }
      this.getModelCotainerSize();
    },
    getModelCotainerSize() {
      const docWidth = document.body.clientWidth;
      const docHeight = document.body.clientHeight;
      // this.model.robot.state.size.modelCotainerWidth = docWidth - 276;
      // this.model.robot.state.size.modelCotainerHeight = docHeight - 327;
      this.model.robot.state.size.modelCotainerWidth = docWidth - 500;
      this.model.robot.state.size.modelCotainerHeight = docHeight;
      this.model.robot.state.size.leftControlWidth = this.model.robot.state.size.modelCotainerWidth;
    },
  },
  watch: {
  },
  computed: {
    isControl() {
      if(this.$route.name === 'Control') {
        return true;
      }else {
        return false;
      }
    },
    stateOnline: {
      get() {
        return this.$store.state.robot.info.online
      },
      set(value) {
        // this.setRobotState('online', value);
        window.GlobalUtil.model.robot.state.func.setRobotStateOnline(value);
        // window.GlobalUtil.model.robot.state.info.online = value;
        // if (value) {
        //   this.$store.commit(types.GET_ROBOT_STATUS, value);
        // }
        // console.log(`control xarm connected: ${this.$store.state.robot.status.connected}`);
        if (!this.$store.state.robot.status.connected) {
          setTimeout(() => {
            console.log('can not connect xArm');
            // this.setRobotState('online', false);
            // window.GlobalUtil.model.robot.state.info.online = false;
            window.GlobalUtil.model.robot.state.func.setRobotStateOnline(false);
            // if (value) {
            //   this.$store.commit(types.GET_ROBOT_STATUS, value);
            // }
          }, 500);
        }
        // this.$store.commit('test', value);
      },
    },
    isIpad() {
      return this.model.commonStatusMgr.isMobile;
    }
  },
  components: {
    togetherControl,
    CommonTopMenuLeft,

  },
};
</script>

<style scoped lang="scss">
header {
  flex: 0 0 auto;
}
footer {
  flex: 0 0 auto;
  height: 263px;
}
.hello {
  /*font-family:'Gotham-Medium';*/
  display: flex;
  flex-direction: column;
}
.emulator-container {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;

  background-color: #d8d7d7;
  position: relative;
  .header-wrapper{
    display: flex;
    align-items: center;
    height: 100%;
    & > div {
      display: flex;
      align-items: center;
    }
    .control-toggle {
      display: flex;
      justify-content: flex-end;
    }
  }
}
.ipad-control-wrapper {
  width: 96%;
  margin: 2%;
  height: 87%;
}
.pc-control-wrapper {
  width: 96%;
  height: 86%;
  margin: 2% auto;
}
</style>
