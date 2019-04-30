<template>
  <el-container class="hello emulator-container">
    <CommonTopMenuLeft
      :backTitle="$t('control')"
      :onBack="onBack">
    </CommonTopMenuLeft>
    <!-- emulator -->
    <div class="main-wrapper">
      <div class="main-view">
        <div class="model-container" :style="{width: model.robot.state.size.modelCotainerWidth + 'px', height: model.robot.state.size.modelCotainerHeight + 'px'}">
          <!-- <xarm-model></xarm-model> -->
          <CommonPositionView style="left:10%;"></CommonPositionView>
          <slot name="xarm" :size="98"></slot>
        </div>
      </div>
      <!-- end set -->
      <!-- joint -->
      <!-- <div style="position:absolute;width:276px;height:100%;right:0px;">
        <ComEmulatorControl></ComEmulatorControl>
      </div> -->
      <!-- joystick -->
      <!-- <JoystickControl style="left:0px;top:0px;"></JoystickControl> -->
      <!-- <div style="position:absolute;width:300;height:800px;"> -->
        <!-- <JoystickControl style="left:0px;bottom:0px;"></JoystickControl> -->
        <!-- <EndJointControl></EndJointControl> -->
      <!-- </div> -->
       <div  v-if="!model.commonStatusMgr.controlShow">
        <JoystickAttitude
          style="bottom:35%;left:14px;"
          :onmovetimer='onmovetimer'>
        </JoystickAttitude>

        <JoystickPosition
          style="bottom:35%;right:0px;"
          :onmovetimer='onmovetimer'>
        </JoystickPosition>
      </div>
      <CommonSetControlEdit
        v-if="model.commonStatusMgr.controlShow">
      </CommonSetControlEdit>
    </div>

   
    <!-- <JoystickPosition v-else
      style="bottom:20px;right:280px;"
      :onmovetimer='onmovetimer'>>
    </JoystickPosition> -->

    <!-- <div class="" style="position:absolute;width:250px;height:250px;bottom:5px;left:100px;background:yellow;">
    </div> -->

    <!-- dialog -->
    <!--<span v-if="model.commonStatusMgr.controlShow" @click="controlShow()" class="hide-button" style="right: 280px;"><i class="el-icon-caret-right"></i></span>-->
    <!--<span v-else @click="controlShow()" class="show-control" style="right: 0px;"><i class="el-icon-caret-left"></i></span>-->


    <!-- <div @click="controlShow" class="hide-button" v-bind:class="{'right-280': model.commonStatusMgr.controlShow}">
      <span class="inside-circle" v-bind:class="{rotate: !model.commonStatusMgr.controlShow}"></span>
    </div> -->
    
  </el-container>
</template>

<script>
import Vue from 'vue';
import ToggleButton from 'vue-js-toggle-button';
// import EndSet from './Control/EndSet';
// import EndJointControl from './Control/EndJointControl';
// import JoystickControl from './Control/JoystickControl';
// import JointControl from './Control/JointControl';
import JoystickAttitude from './Control/JoystickAttitude';
import JoystickPosition from './Control/JoystickPosition';
import CommonTopMenu2 from './common/CommonTopMenu2';
import CommonTopMenuLeft from './common/CommonTopMenuLeft';
// import ComEmulatorControl from './Control/ComEmulatorControl';
import CommonSetControlEdit from './common/CommonSetControlEdit'
import CommonPositionView from './common/CommonPositionView'
// import EmulatorControl from './common/EmulatorControl';
import * as types from '../store/mutation-types';

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
    this.model.robot.state.showSetControlValueDialog = false;
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
    // EndSet,
    // EndJointControl,
    // JointControl,
    CommonSetControlEdit,
    // JoystickControl,
    JoystickAttitude,
    JoystickPosition,
    // ComEmulatorControl,
    CommonTopMenu2,
    CommonTopMenuLeft,
    CommonPositionView,
    // EmulatorControl,
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
  // background-color: #F8F8F8;
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
  .main-wrapper {
    flex: 1 0 auto;
    position: relative;
    overflow: hidden;
    width: 100%;
    display: flex;
    justify-content: space-between;
    .main-view {
      // display: flex;
      // align-items: flex-start;
      // justify-content: space-between;
      // overflow: hidden;
      height: 100%;
      // position: absolute;
      /*width: 100%;*/
      width: 100%;
      margin: 0 auto;
      // padding-bottom: 4px;
    }
  }
}
.model-container {
  // position: absolute;
  // padding-right: 1vw;
  padding-right: 10px;
  border-radius: 0px;
  /*width: 78vw;*/
  height: 100%;
  position: relative;
}
.title-ide {
  font-family: 'Gotham-Bold';
  font-size: 36px;
  color: #444;
  letter-spacing: -1px;
  padding-left: 2%;
  width: 100%;
}
.title-online {
  margin-right: 1vw;
  font-size: 1.2rem;
  font-family: Gotham-Medium;
  color: #434343;
  letter-spacing: -0.5px;
}
.show-control {
  position: fixed;
  top: 40px;
  width:15px;
  height: 60px;
  background: #555;
  line-height: 56px;
  color: #fff;
  outline: none;
  text-align: center;
  border-radius: 20px 0 0 20px;
  i {
    font-size: 10px;
  }
}
.hide-button {
  position: absolute;
  /*height: 40px;*/
  /*width: 10px;*/
  /*border-bottom: 8px solid transparent;*/
  /*border-right: 12px solid #666;*/
  /*border-top: 8px solid transparent;*/
  /*line-height: 30px;*/
  right: 0;
  top: 40px;
  z-index: 39;
  cursor: pointer;
  text-align: center;
  font-size: 12px;
  width: 48px;
  height: 48px;
  background: rgba(102, 102, 102, 0.42);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  .inside-circle {
    width: 28px;
    height: 28px;
    display: inline-block;
    background: #e6e5e5;
    border: 4px solid #dcdbdb;
    border-radius: 50%;
  }
}
.hide-button .rotate {
  transform: rotate(-180deg);
}
.right-280 {
  right: 280px !important;
}
</style>
