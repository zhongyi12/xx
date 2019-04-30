<template>

  <div class="common-header-wrapper">
    <div style="display:flex; align-items: center;">
      <div class="com-back-title" style="display: flex;align-items: center;cursor: pointer;position: absolute;left: 20px;" @click="changeRouter('Home')">
        <a class="el-icon-arrow-left" style="margin-right: 15px;"></a>{{ backTitle }}
        
      </div>



      <!-- <div class="header-btn-wrapper">

          
        <el-button v-if="model.robot.state.info.xarm_mode === 2" :disabled="stateOnline === false" @click="switchMode(0)" class="com-btn ">
          {{$t('jointTeachMode')}}
        </el-button>
        <el-button v-else @click="switchMode(2)" :disabled="stateOnline === false" class="com-btn" style="color:#b4bccc">
          {{$t('openJointTeachMode')}}
        </el-button>
    

        
        <el-button class="com-btn"  @click="changeRouter('Setting1')">
          {{$t('setting')}}
        </el-button>
        <el-button class="com-btn" @click="cleanErrorWarn()">
            {{ $t('clearError') }}
        </el-button>
          <el-button class="com-btn gray-lock-btn " @click="onAllLock()"  v-if="isNotAllLock || !isConnected" :style="{opacity: stateOnline ? 1 : 0.6}" :disabled="stateOnline === false">
            {{$t('lock')}}
        </el-button>
        <el-button class="com-btn lock-btn" v-else @click="onAllUnLock()"  :style="{opacity: stateOnline ? 1 : 0.6}" :disabled="stateOnline === false">
            {{$t('unlock')}}
        </el-button>
          <el-button v-if="$store.state.robot.info.online && isConnected" class="disconnect-btn border-line"  @click="xArmOffline()">
          {{$t('xArmOnline')}}
        </el-button>
        <el-button v-else class="connect-btn border-line" @click="xArmOffline()" style="color:#b4bccc">
          {{$t('xArmOnline')}}
        </el-button>
        
        <el-button  class="reset-btn com-header-btn border-line" v-if="$store.state.robot.info.online && isConnected"  @click="resetEnd()">
            {{$t('reset')}}
        </el-button>
        <el-button class="gray-reset-btn com-header-btn border-line" v-else style="color:#b4bccc"  @click="resetEnd()">
            {{$t('reset')}}
        </el-button>
          <el-button class="com-header-btn gray-lock-btn border-line" @click="onAllLock()"  v-if="isNotAllLock || !isConnected" :style="{opacity: stateOnline ? 1 : 0.6}">
            {{$t('lock')}}
        </el-button>
        <el-button class="com-header-btn lock-btn border-line" v-else @click="onAllUnLock()"  :style="{opacity: stateOnline ? 1 : 0.6}">
            {{$t('lock')}}
        </el-button>
        

      </div>-->
    </div>

    
<!-- 
    <div>
      <span> {{ backTitle }} </span>
    </div>
-->

      <div>
        <div v-if="isConnected && isOnline"  style="color:#52BF53;margin-right: 10px;"><i @click="switchRobot()" class="el-icon-success" style="margin-right: 10px;"></i><span>{{ $t('trueRobot') }}</span></div>
        <div v-if="isConnected && !isOnline" style="color:#eb9e05"><i @click="switchRobot()" class="el-icon-warning" style=";margin-right: 10px;"></i><span>{{$t('simulateRobot')}}</span></div>
        <div v-if="!isConnected" style="color:#959696;"><i  class="el-icon-error" style="margin-right: 10px;"></i><span>{{$t('noConnected')}}</span></div>
      </div>
      <div style="position: absolute;right: 0;top: 0;"><ComStop></ComStop></div>
    

      

  </div>
  
</template>

<script>

import * as types from './../../store/mutation-types';

import ComStop from './ComStop';

export default {
  props: ['backTitle', 'onBack'],
  i18n: {
    messages: {
      en: {
        setting: "Settings",
        jointTeachMode: 'Close Teach',
        openJointTeachMode: "Open Teach",
        xArmOnline: 'LIVE CTRL',
        lock: 'Lock joints',
        unlock: "Unlock Joints",
        reset: 'BACK TO ZERO',
        connect: 'OnLine',
        disconnect: 'OffLine',
        clearError: 'Clear errors',
        unLockConfirmTitle: 'Attention',
        unLockWarnText: 'Are you sure to unlock all joints',
        unLockTipText: 'Please protect the robot arm before unlocking',
        unLockConfirmButtonText: 'One-button unlock',
        unLockCancelButtonText: 'Cancel',
        trueRobot: "Real Robot",
        simulateRobot: "Simulate Robot",
        noConnected: "The robot is not connected"
      },
      cn: {
        setting: "设置",
        jointTeachMode: '关闭示教',
        openJointTeachMode: "打开示教",
        unlock: "解锁关节",
        lock: '锁住关节',
        reset: '回到零点',
        xArmOnline: '实时控制',
        connect: '在线',
        disconnect: '离线',
        clearError: '清除错误',
        unLockConfirmTitle: '注意',
        unLockWarnText: '确定要一键解锁',
        unLockTipText: '解锁前请保护好机械臂',
        unLockConfirmButtonText: '一键解锁',
        unLockCancelButtonText: '取消',
        trueRobot: "真实机械臂",
        simulateRobot: "仿真机械臂",
        noConnected: "未连接机械臂"
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      speed: 0,
      acceleration: 0,
    }
  },
  mounted() {
    this.speed = this.model.robot.state.remote.speed;
    this.acceleration = this.model.robot.state.remote.acceleration;
    console.log('backTitle', this.backTitle);
  },
  beforeDestroy() {
  },
  methods: {
    switchRobot() {
      if (!this.$store.state.robot.info.online) {
        window.GlobalUtil.model.robot.state.func.setRobotStateOnline(true);
      }
      else {
        setTimeout(() => {
          window.GlobalUtil.model.robot.state.func.setRobotStateOnline(false);
        }, 100);
      }
    },
    // switchMode(mode) {
    //   window.CommandsRobotSocket.switch_mode(mode, (res) => {});
    // },
    changeRouter(router) {
      console.log(`change Router this $route name = ${this.$route.name}`);
      if (this.$route.name === 'Teach') {
        if (this.model.localTeach.isTeachRunningUUID !== '') {
          this.$message({
            message: 'Recording is running!',
            duration: 1000,
          })
          return;
        }
        if (this.model.localTeach.hasChange && this.model.localTeach.curSelectedIndex >= 0) {
          this.$message({
            message: this.$t('editing'),
            duration: 1000,
          })
          return;
        }

      }
      this.model.localTeach.editState = false;
      const doSomeThing = () => {

        this.$router.push({ name: router });

      }
      if (this.$route.name === 'Blockly-test') {

        const isBack = this.model.localAppsMgr.quitPage(() => {
          doSomeThing();
        });
        return;
      }

      doSomeThing();
    },
    switchMode(mode) {
      if (!this.isConnected) {
        return;
      }
      window.CommandsRobotSocket.switch_mode(mode, (res) => {});
    },
    setButtonStyle(ele) {
      if (ele !== undefined && ele !== null) {
        ele.style.color = '#409EFF';
        setTimeout(() => {
          ele.style.color = ''
        }, 500)
      }
    },
    cleanErrorWarn() {
      window.CommandsRobotSocket.cleanErrorWarn((res) => {
      });
      const ele = document.getElementsByClassName('clear-btn')[0];
      this.setButtonStyle(ele);
    },
    resetEnd() {
      // vuex reset position&orientation
      this.model.robot.state.tempJoints = [0, 0, 0, 0, 0, 0, 0];
      // this.$store.commit(types.RESET_XARM_POSITION);
      if (this.model.robot.state.info.online === true) {
        this.model.robot.state.func.resetXarmPosition();
      }
      else {
        this.model.robot.state.func.resetLocal();
      }
      if (this.model.robot.state.func.resetParams) {
        this.model.robot.state.func.resetParams();
      }
      this.model.localTeach.hasChange = true;
      if (this.model.robot.state.func.resetXarmModel) {
        this.model.robot.state.func.resetXarmModel();
      }
      const name = this.model.robot.state.info.online ? 'reset-btn' : 'gray-reset-btn'
      const ele = document.getElementsByClassName(name)[0];
      this.setButtonStyle(ele);
    },
    xArmOffline() {
      if (this.$store.state.robot.status.connected) {
        window.GlobalUtil.model.robot.state.func.setRobotStateOnline(!this.$store.state.robot.info.online);
        if (this.$store.state.robot.info.online) {
          this.model.robot.state.local.joints = this.model.robot.state.remote.joints;
        }
      }
      else {
        this.$message({
          message: 'xArm is not connected, can not switch to online mode.',
          duration: 1000,
        });
        setTimeout(() => {
          window.GlobalUtil.model.robot.state.func.setRobotStateOnline(false);
        }, 500);
      }
    },
    onAllLock() {
      if (this.$store.state.robot.status.connected === false) {
        // this.$message({
        //   message: 'xArm is not connected, can not lock the joints.',
        //   duration: 1000,
        // });
        return;
      }
      else if (this.$store.state.robot.info.online === false) {
        // this.$message({
        //   message: 'xArm is not online, can not lock the joints.',
        //   duration: 1000,
        // });
        return;
      }
      console.log('on All Lock 11122');
      if (this.$store.state.robot.status.connected) {
        window.CommandsRobotSocket.setServoLock(true, null, (response) => {
          // console.log(response);
          if (response.code !== 0) {
            this.model.robot.state.local.jointLocks = this.model.robot.state.remote.jointLocks.concat();
          }
        });
      }
      else {
        this.$message('xArm is not connected, can not lock the joints.');
      }
    },
    onAllUnLock() {
      if (this.$store.state.robot.status.connected === false) {
        // this.$message({
        //   message: 'xArm is not connected, can not unlock the joints.',
        //   duration: 1000,
        // });
        return;
      }
      else if (this.$store.state.robot.info.online === false) {
        // this.$message({
        //   message: 'xArm is not online, can not unlock the joints.',
        //   duration: 1000,
        // });
        return;
      }
      let html = '<div style="color: red;">'
      html += `${this.$t("unLockWarnText")}?`
      html += '</div>'
      html += '<div style="color: #409EFF;">'
      html += `(${this.$t("unLockTipText")})`
      html += '</div>'
      this.$confirm(html, this.$t('unLockConfirmTitle'), {
        dangerouslyUseHTMLString: true,
        type: 'warning',
        showClose: true,
        confirmButtonText: this.$t("unLockConfirmButtonText"),
        cancelButtonText: this.$t("unLockCancelButtonText"),
      })
      .then(() => {
        // unlock
        window.CommandsRobotSocket.setServoLock(false, null, (response) => {
          // console.log(response);
          if (response.code !== 0) {
            this.model.robot.state.local.jointLocks = this.model.robot.state.remote.jointLocks.concat();
          }
        });
      })
      .catch(() => {
        // cancel
      });
    },
  },
  components: {

    ComStop,
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
    isOnline() {
      return this.$store.state.robot.info.online === true;
    },
    isNotAllLock() {
      return this.model.robot.state.local.jointLocks.some((item) => {
        return item === false });
    },
  },
  watch: {
  },
}
</script>

<style scoped lang="scss">
.common-header-wrapper {                /**组件的返回包裹层**/
  width: 100%;
  height: 54px;
  /* height: 40px;
  line-height: 40px; */
  /* background: #F8F8F8; */
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ebebeb;
}
.header-btn-wrapper {
  padding-left: 2vw;
}
.back-home-logo {
  display: inline-block;
  // background-repeat: no-repeat;
  // background-size: contain;
  // background-image: url('../../assets/img/uf_logo.svg');
  // width: 150px;
  // height: 70px;
  // background-position: center;
  cursor: pointer;
}
.com-btn {
  border: none;
  border-right: 1px solid rgba(132,132,132,0.2);
  background-color: #ebebeb;
  font-size: 16px;
  padding: 1vh 1vw;
}

.disconnect-btn {
  color: green;
}
.connect-btn {
  color: gray;
}


</style>
