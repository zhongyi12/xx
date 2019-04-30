<template>
  <div id="root-menu" class="noselected">
   <el-radio-group v-model="robot" @change="switchRobot()" >
    <el-radio :disabled="!isConnected" label="trueRobot"> {{$t('trueRobot')}}</el-radio>
    <el-radio label="simuRobot"> {{$t('simulateRobot')}}</el-radio>
   </el-radio-group>
   </div>

</template>

<script>

import * as types from './../../store/mutation-types';


export default {

  i18n: {
    messages: {
      en: {
        trueRobot: "Real Robot",
        simulateRobot: "Simulation Robot",
        trueRobotTip: "You have switched to a real robot",
        simuRobotTip: "You have switched to simulate robot",
  
      },
      cn: {
        trueRobot: "真实机械臂",
        simulateRobot: "仿真机械臂",
        trueRobotTip: "已切换到真实机械臂",
        simuRobotTip: "已切换到仿真机械臂",
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      robot: '',
    }
  },
  mounted() {

    if(this.$store.state.robot.info.online) {
      this.robot = 'trueRobot';
    }else {
      this.robot = 'simuRobot';
    }
    
  },
  beforeDestroy() {
  },
  methods: {

    switchRobot() {
      if (this.robot === "trueRobot" ) {
        window.GlobalUtil.model.robot.state.func.setRobotStateOnline(true);
        if (this.$store.state.robot.info.online) {
          this.model.robot.state.local.joints = this.model.robot.state.remote.joints;
        }
        // this.$message({
        //   message: this.$t('trueRobotTip'),
        //   duration: 3000,
        // });
       
      }
      else {
        setTimeout(() => {
          window.GlobalUtil.model.robot.state.func.setRobotStateOnline(false);
          
        }, 100);
        
        // this.$message({
        //   message: this.$t('simuRobotTip'),
        //   duration: 3000,
        // });
      }
    },

  },
  components: {
  },
  computed: {
    // stateOnline: {
    //   get() {
    //     return this.$store.state.robot.info.online;
    //   },
    //   set(value) {
    //     // this.setRobotState('online', value);
    //     window.GlobalUtil.model.robot.state.func.setRobotStateOnline(value);
    //     if (value) {
    //       this.$store.commit(types.GET_ROBOT_STATUS, value);
    //     }
    //     if (!this.$store.state.robot.status.connected) {
    //       setTimeout(() => {
    //         console.log('can not connect xArm');
    //         window.GlobalUtil.model.robot.state.func.setRobotStateOnline(false);
    //         if (value) {
    //           this.$store.commit(types.GET_ROBOT_STATUS, value);
    //         }
    //       }, 500);
    //     }
    //   },
    // },

    stateOnline: {
      get() {
        return this.$store.state.robot.info.online;
      },
      set(value) {
        // this.setRobotState('online', value);
        window.GlobalUtil.model.robot.state.func.setRobotStateOnline(value);
        if (value) {
          // this.$store.commit(types.GET_ROBOT_STATUS, value);
        }
        // if (value) {
        //   this.$store.commit(types.GET_ROBOT_STATUS, value);
        // }
        if (!this.$store.state.robot.status.connected) {
          setTimeout(() => {
            console.log('can not connect xArm');
            window.GlobalUtil.model.robot.state.func.setRobotStateOnline(false);
            // if (value) {
            // this.$store.commit(types.GET_ROBOT_STATUS, value);
            //   this.$store.commit(types.GET_ROBOT_STATUS, value);
            // }
          }, 500);
        }
      },
    },
    isConnected() {
      return this.$store.state.robot.status.connected === true;
    },
    isNotAllLock() {
      return this.model.robot.state.local.jointLocks.some((item) => {
        return item === false });
    },

  },
  watch: {
    stateOnline(newValue) {
      if (newValue) {
        this.robot = 'trueRobot'
      }
      else {
        this.robot = 'simuRobot'
      }
    },
  },
}
</script>

<style scoped lang="scss">



.disconnect-btn {
  background-image: url(../../assets/img/control/btn_connect_green.png);
  color: green;
}
.connect-btn {
  background-image: url(../../assets/img/control/btn_connect_gray.png);
  color: gray;
}

</style>
