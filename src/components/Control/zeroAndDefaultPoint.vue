<template>
  <div class="btn-wrapper">
    <button
      type="zero"
      @touchstart="onDown"
      @mousedown="onDown"
      @touchend="onUp"
      @mouseup="onUp"
      class="com-btn">
      {{$t('zeroPoint')}}
    </button>
     <button
      type="default"
      @touchstart="onDown"
      @mousedown="onDown"
      @touchend="onUp"
      @mouseup="onUp"  
      class="com-btn">
      {{$t('defaultPoint')}}
    </button>
     <!-- <el-dialog
        :title="$t('setDefaultPoint')"
        :visible.sync="showSetDefaultPointDialog"
        width="30%"
       >
        <span>{{ $t('initialTip') }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="DontShow()">{{$t('neverShow')}}</el-button>
          <el-button type="primary" @click="goToSetDefault()">{{ $t('confirm') }}</el-button>
        </span>
      </el-dialog> -->
  </div>
</template>

<script>

import * as types from './../../store/mutation-types';


export default {
  props: ['backTitle', 'onBack'],
  i18n: {
    messages: {
      en: {
        zeroPoint: "ZERO POSITION",
        defaultPoint: "INITIAL POSITION",
        initialTip:"The Initial Position is not set, click OK to set Initial Position.",
        setDefaultPoint: 'SET INITIAL POSITION',
        neverShow: "Don’t Remind Again",
        confirm:"OK",
        cancel: "Cancel"
      },
      cn: {
       zeroPoint: "零点",
        defaultPoint: "初始点", 
        initialTip:"初始点未设置，点击“确认”设置初始点。",
        neverShow: "不再提示",
        setDefaultPoint: '设置初始点',
        confirm:"确认",
        cancel: "取消"
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,//
      speed: 0,
      acceleration: 0,
      showSetDefaultPointDialog: false,
      neverShow: false,
    }
  },
  mounted() {
    this.speed = this.model.robot.state.remote.speed;
    this.acceleration = this.model.robot.state.remote.acceleration;
    console.log('isInitialPointEquZero',this.remoteInitialPoint, this.isInitialPointEquZero);
  },
  beforeDestroy() {
  },
  methods: {
    // DontShow() {
    //   this.showSetDefaultPointDialog = false;
    //   this.neverShow = true;
    // },
    // goToSetDefault() {
    //   this.$router.push('Setting1');
    // },
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
    resetDefault() {
      window.GlobalUtil.model.robot.state.func.setRobotMoveAllJoints(this.model.robot.state.remote.initialPoint, false, (dict) => {}, true);
      // window.CommandsRobotSocket.moveAllJoints(this.model.robot.state.remote.initialPoint);
    },
    onDown(evt) {
      evt.preventDefault();
      const type = evt.target.getAttribute('type');
      if (type === 'zero') {
        this.resetEnd();
      }
      else if (type === 'default') {
        this.resetDefault();
      }
    },
    onUp(evt) {
      if (this.stateOnline) {
        window.CommandsRobotSocket.urgentStop();
      }
    },
    setButtonStyle(ele) {
      if (ele !== undefined && ele !== null) {
        ele.style.color = '#409EFF';
        setTimeout(() => {
          ele.style.color = ''
        }, 500)
      }
    },
  },
  components: {

  },
  computed: {
    remoteInitialPoint: {
      get() {
        return this.model.robot.state.remote.initialPoint;
      }
    },
    isInitialPointEquZero() {
     for(let i = 0; i < this.remoteInitialPoint.length; i++) {
       if (this.remoteInitialPoint[i] === 0) {
         return true;
       }else {
         return false;
       }
     }
    },
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
  },
  watch: {
  },
}
</script>

<style scoped lang="scss">
.btn-wrapper {
  display: flex;
  
}
.com-btn {
 width: 135px;
 height: 30px;
 line-height: 30px;
 padding: 0 5px;
 border: none;
 border-radius: 6px;
 font-size: 12px;
 cursor: pointer;
  background-color: #d0d2d3;
  color: #555;
}
.com-btn:active {
  background-color: #e05a24;
   color: #fff;
}

</style>
