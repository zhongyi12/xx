<template>
  <div id="root-menu" class="noselected">
    <div class="com-header-wrapper">
      <div>
        <!--<img @click="onBack" class="cursor-pointer" src="./../../assets/img/common/icon_back.svg" alt="back"/>-->
        <!-- </router-link> -->
        <span class="com-back-title" v-if="model.commonStatusMgr.panelIsHidden === true"><i class=" el-icon-arrow-left" v-if="backTitle !== undefined"></i> {{ backTitle }} </span>

      </div>
      <!-- speed -->
      <!--<CommonSpeedSetting></CommonSpeedSetting>-->
      <div class="control-toggle">
        <!-- <div class="title-online">{{ $t('record.liveControl') }}</div> -->
        <!-- <el-button round @click="resetEnd()">{{ $t('record.reset') }}</el-button> -->

          <!--<button v-if="model.robot.state.isRobotShowEditBtn === true" @click="setValueDialog" :class="['com-circle-btn edit-btn', { comDisableEvent: false /*isOnline === false*/ }]">{{ $t('control.edit') }}</button>-->

          <!--<toggle-button v-model="stateOnline" :color="{checked: '#52BF53', unchecked: '#D3D5DB'}" :sync="true"-->
                         <!--:labels="{checked: 'ONLINE', unchecked: 'OFFLINE'}"-->
                         <!--:width="80" :height="30" />-->
            
            <!-- <el-button v-if="$store.state.robot.info.xarm_mode === 2 && isConnected" class="com-header-btn lock-btn border-line"  @click="switchMode(0)">
              {{$t('xArmTeach')}}
            </el-button>
            <el-button v-else class="com-header-btn gray-lock-btn border-line" @click="switchMode(2)" style="color:#b4bccc">
              {{$t('xArmTeach')}}
            </el-button> -->
            <el-button v-if="$store.state.robot.info.online && isConnected" class="com-header-btn disconnect-btn border-line"  @click="xArmOffline()">
              <!-- <i class="el-icon-sort com-header-btn-icon" style="color: green;"></i> -->
              {{$t('xArmOnline')}}
            </el-button>
            <el-button v-else class="com-header-btn connect-btn border-line" @click="xArmOffline()" style="color:#b4bccc">
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
            <!-- <el-button class="clear-btn com-header-btn border-line" @click="cleanErrorWarn()">
               {{ $t('clearError') }}
            </el-button> -->
         
            <ComStop></ComStop>
         
        
        
         
       
         <!-- <com-stop></com-stop> -->
        
      </div>
    </div>
  </div>
</template>

<script>

import * as types from './../../store/mutation-types';
import CommonSpeedSetting from './CommonSpeedSetting';
import ComStop from './ComStop';

export default {
  props: ['backTitle', 'onBack'],
  i18n: {
    messages: {
      en: {
        xArmTeach: 'TEACH',
        xArmOnline: 'LIVE CTRL',
        lock: 'LOCK JOINTS',
        reset: 'BACK TO ZERO',
        connect: 'OnLine',
        disconnect: 'OffLine',
        clearError: 'CLEAR ERROR',
        unLockConfirmTitle: 'Attention',
        unLockWarnText: 'Are you sure to unlock all joints',
        unLockTipText: 'Please protect the robot arm before unlocking',
        unLockConfirmButtonText: 'One-button unlock',
        unLockCancelButtonText: 'Cancel',
      },
      cn: {
        xArmTeach: '示教',
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
    CommonSpeedSetting,
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
.el-button:focus,.el-button:hover {
  // color: #409EFF;
  // border-color: white;
  background-color: white;
}
.el-button:active {
  background-color: #ecf5ff;
}
$grayColor: #94979c;
$greenClor: #65c068;
.com-header-wrapper {
  background: white;
  /*background: #F8F8F8;*/
  /*display: flex;*/
  /*justify-content: space-between;*/
  /*align-items: center;*/
  img {
    width: 1.6rem;
  }
  .back-title {
    margin-left: 1rem;
    // font-family: 'Gotham-Bold';
    font-size: 18px;
    color: #444;
    letter-spacing: -1px;
  }
  // span {
  //   margin-left: 1rem;
  //   font-family: 'Gotham-Bold';
  //   font-size: 2rem;
  //   color: #444;
  //   letter-spacing: -1px;
  // }
  .control-toggle {
    display: flex;
    justify-content: space-around;
    align-items: center;
    // padding-top: 10px;
    min-width: 500px;
    // width: 192px;
    .title-online {
      padding-right: 5px;
      font-family: 'Gotham-Medium';
      font-size: 12px;
      color: #434343;
      letter-spacing: -0.5px;
    }
    .btn-wrapper {
      // display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: 100%;
    }
    // button {
    //   width: 63px;
    //   height: 29px;
    //   padding: 0;
    //   margin-left: 20px;
    //   background: #555;
    //   font-size: 10px;
    //   color: #fff;
    //   font-family: 'Gotham-Book';
    // }
  }
}

.config-wrapper {
  position: absolute;
  width: 500px;
  height: 50px;
  right: 350px;
  .range-speed {
    position: absolute;
    width: 200px;
    height: 100%;
    right: 0px;
  }
  .range-acc {
    position: absolute;
    width: 200px;
    height: 100%;
    left: 0px;
  }
  input[type=range] {
    position: absolute;
    border-radius: 100px;
    background-image: linear-gradient(90deg, #8FFF94 0%, #FF6868 100%);
    -webkit-appearance: none;
    height: 10px;
    width: 200px;
    left: 0px;
    top: 0px;
    bottom: 0px;
    margin: auto;
  }
  input[type=range]::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
    -webkit-appearance: none;
    border: none;
    border-radius: 100px;
    background: #FEFEFE;
    box-shadow: 0 0 8px 0 gray;
  }
  .com-font-style {
    font-family: 'Gotham-Book';
    font-size: 9px;
    color: black;
    text-align: left;
  }
  .speed-location {
    position: absolute;
    left: 0px;
    top: 0px;
  }
  .speed-title {
    position: absolute;
    left: 0px;
    bottom:0px;
  }
  .remote-value {
    position: absolute;
    color: orange;
    right: 0px;
  }
}
.edit-btn {
  background: #555;
}
.disconnect-btn {
  background-image: url(../../assets/img/control/btn_connect_green.png);
  color: $greenClor;
}
.connect-btn {
  background-image: url(../../assets/img/control/btn_connect_gray.png);
  color: $grayColor;
}
.gray-lock-btn {
  background-image: url("../../assets/img/control/btn_lock_gray.png");
   color: $grayColor;
}
.lock-btn {
  background-image: url("../../assets/img/control/btn_lock_green.png");
  color: $greenClor;
}
.reset-btn {
  background-image: url("../../assets/img/control/btn_reset_green.png");
  color: $greenClor;
}
.gray-reset-btn {
  background-image: url("../../assets/img/control/btn_reset_gray.png");
  color: $grayColor;
}
.clear-btn {
  background-image: url("../../assets/img/control/btn_clear_green.png");
   color: $greenClor;
}
.gray-clear-btn {
  background-image: url("../../assets/img/control/btn_clear_gray.png");
   color: $grayColor;
}
.border-line {
  border-right: 1px solid rgba(132,132,132,0.2);
}
</style>
