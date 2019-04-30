<template>
    <div class="main-wrapper">
      <div class="main-view top-block-wrapper">
        <div  class="select-xarm-model">
          <div class="model-container com-block-wrapper com-padding">
            <slot name="xarm" :size="98"></slot>
          </div>
          <div class="com-block-wrapper robot-select com-padding"><trueRobotOrVir></trueRobotOrVir></div>
        </div>
        <div class="joint-control com-padding" > <jointControl></jointControl></div>
      </div>


      <div  class="main-view bottom-block-wrapper">
         <PositionView class="position-view com-block-wrapper com-padding" ></PositionView>
      
        <div class="position-control"><PositionControl></PositionControl></div>

        <div class="left-block-wrapper">
          <zeroAndDefaultPoint class="com-block-wrapper com-height point-default" :class="{ 'justify-content' : isIpad }"></zeroAndDefaultPoint>
          <speed class="com-height speed-wrapper com-padding"></speed>
          <gripper class="com-block-wrapper com-height gripper-wrapper com-padding"></gripper>
        </div>
        
    </div>
  </div>

</template>

<script>
import Vue from 'vue';
import ToggleButton from 'vue-js-toggle-button';

import CommonSetControlEdit from '../common/CommonSetControlEdit'
import CommonPositionView from '../common/CommonPositionView'


import trueRobotOrVir from './trueRobotOrVir';
import zeroAndDefaultPoint from './zeroAndDefaultPoint';
import speed from './speed';
import gripper from './Gripper';
import jointControl from './jointControl';
import PositionView from './PositionView';
import PositionControl from './PositionControl';

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
    window.addEventListener('resize', this.getModelCotainerSize);
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
    isIpad() {
      return this.model.commonStatusMgr.isMobile;
    },
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
  },
  components: {

    CommonPositionView,
    trueRobotOrVir,
    zeroAndDefaultPoint,
    speed,
    gripper,
    jointControl,
    PositionView,
    PositionControl,

    // EmulatorControl,
  },
};
</script>

<style scoped lang="scss">

.hello {
  /*font-family:'Gotham-Medium';*/
  display: flex;
  flex-direction: column;
}
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
  .main-wrapper {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #d8d7d7;
    position: relative;   
    justify-content: center;
    width: 100%;
  }
  .main-view {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    height: 50%;
  }
.top-block-wrapper {
  // height: 46vh;
  margin-bottom: 2%;
}
.bottom-block-wrapper {
  // height: 46vh;
}
.left-block-wrapper {
  // width: 22vw;
  width: 30%;
  display:flex;
  flex-direction: column;
  justify-content: space-between;
  // width: 414px;
}
.com-block-wrapper {
  background-color: #fff;
  border-radius: 10px;
  // margin: 1vh 1vw;
}
.model-container {
  // width: 33vw;
  // height: 37vh;
  margin-bottom: 2%;
  height: 84%;
}
.robot-select {
  // height: 7vh;
  height: 14%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.point-default{
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 20%;
}
.select-xarm-model {
  width: 28%;
  margin-right: 2%;
  // height: 100%;
}
.joint-control {
  background-color: #fff;
  border-radius: 10px;
  width: 70%;
  // margin-top: 1vh;
  // margin-right: 1vw;
}
.speed-wrapper {
  // margin-left: 1vw;
  background-color: #fff;
  border-radius: 10px;
  height: 30%;
}
.gripper-wrapper {
  height: 40%;
}
.position-view {
  // width: 8vw;
  text-align: center;
  width: 12%;
  // padding: 2vh 0;
}

.position-control {
  background-color: #fff;
  border-radius: 10px;
  // margin: 1vh 0;
  // width: 62vw;
  width: 54%;
  margin: 0 2%;
}
.com-height {
  // padding: 2.4vh 1vw;
  // width: 16vw;
}
.com-padding{
  padding: 1%;
}
.justify-content {
    justify-content: space-between !important;
    padding: 0 2px;
}

</style>
