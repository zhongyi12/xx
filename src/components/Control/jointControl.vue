<template>
  <div class="dialog-content">

  
    <div class="range-wrapper">
      <div class="single-range-wrapper">

        <template v-for="(param, index) in  jointParams">
          <div v-if="index < model.robot.state.info.xarm_axis" class="setting-line" :key="index" >
            <div class="slider-wrapper">

              <span class="left-title">
              {{ param.name }}
              </span>
              <toggle-button
              class="lock-toggle"
              @change="onLock(index)"
              :disabled="stateOnline === false"
              :color="{checked: '#52BF53', unchecked: '#D3D5DB'}"
              v-model="model.robot.state.local.jointLocks[index]"
              :sync="true"
              :labels="{checked: $t('lock'), unchecked: $t('unlock')}"
              :width="60" :height="20" />
            
             <!-- <el-slider
                
                style="width:40%;margin: 0 4%;"
                :class="{ 'out-params-number': param.isOutRange, 'select-joint-number': !param.isOutRange}"
                type="number"
                :min="param.min"
                :max="param.max"
                :step="0.1"
                v-model="param.value"
                @change="sendCmd(index)"
              >
              </el-slider>  -->
              <div style="width:40%;margin: 0 4%;display: flex;justify-content: center;align-items: center;" > 
                <input 
                
                  :class="{ 'out-params-number': param.isOutRange, 'select-joint-number': !param.isOutRange}"
                  
                  type="range"
                  :min="param.min"
                  :max="param.max"
                  :step="0.1"
                  v-model="param.value"
                  @change="sendCmd(index)"/>
              </div>
              
              <div class="joint-btn-wrapper">
                <button
                  id="joint-angle-decrease"
                  class="el-icon-minus joint-btn"
                  :axis="index"
                  @touchstart="onDown"
                  @mousedown="onDown"
                  @touchend="onUp"
                  @mouseup="onUp"
                  :disabled="stateOnline === false"
                  ></button>
                 <div class="input-box"><input  v-model="param.value" type="number" @blur="sendCmd(index)"/><span style="padding: 4px;">°</span></div>

                <button 
                  id="joint-angle-increase"
                  class="el-icon-plus joint-btn"
                  :axis="index"
                  @touchstart="onDown"
                  @mousedown="onDown"
                  @touchend="onUp"
                  @mouseup="onUp"
                  :disabled="stateOnline === false"
                  ></button>
              </div>

            </div>

          </div>
        </template>
           

      </div>

    </div>
  </div>
</template>

<script>
import CommonSpeedSetting from '../common/CommonSpeedSetting';
import CommonAccessories from '../common/CommonAccessories';
import CommonSettings from '../common/CommonSettings';
import { join } from 'path';
const model = window.GlobalUtil.model;
export default {
  props: ['isShowClose', 'showSideBtn'],
  i18n: {
    messages: {
      en: {
        lock: 'lock',
        unlock: 'unlock',
        joints: 'Joints',
        tcp: 'Cartesian',
        speed: 'Speed',
        accessories: 'Accessories',
        settings: 'Settings',
        cannotArriveTip: 'In the current stance, the xArm cannot go to the specified location.',
        outRangeTip: 'Some joints exceed the specified value. Please manually adjust the joint to the specified range after unlocking the joint',
        isNotAllLockTip: 'xArm is not ready, please check all joints are locked',
      },
      cn: {
        lock: '锁住',
        unlock: '解锁',
        joints: '关节',
        tcp: '坐标',
        speed: '速度',
        accessories: '配件',
        settings: '设置',
        cannotArriveTip: '当前姿态下，机械臂不能去到指定地方。',
        outRangeTip: '关节超出规定值, 请解锁关节后手动调整到规定范围',
        isNotAllLockTip: 'xArm 没准备好，请检查所有关节是否已锁',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      resetInterval: null,
      curInputValue: 50,
      moveIndex: 0,
      focusRoll: false,
      roll: 180,
      isMoveArrow: false,
      selectedJointIndex: window.GlobalUtil.model.robot.state.local.selectJointIndex,
      counts: [0, 1, 2, 3, 4],
      tcpParams: [
        { name: 'x', max: model.robot.state.range.position.x.max, min: model.robot.state.range.position.x.min, value: 0, selectedIndex: 4, unit: 'mm' },
        { name: 'y', max: model.robot.state.range.position.y.max, min: model.robot.state.range.position.y.min, value: 0, selectedIndex: 4, unit: 'mm' },
        { name: 'z', max: model.robot.state.range.position.z.max, min: model.robot.state.range.position.z.min, value: 0, selectedIndex: 4, unit: 'mm' },
        { name: 'roll', max: model.robot.state.range.orientation.roll.max, min: model.robot.state.range.orientation.roll.min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'pitch', max: model.robot.state.range.orientation.pitch.max, min: model.robot.state.range.orientation.pitch.min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'yaw', max: model.robot.state.range.orientation.yaw.max, min: model.robot.state.range.orientation.yaw.min, value: 0, selectedIndex: 4, unit: '°' },
      ],
      jointParams: [
        { name: 'J1', max: model.robot.state.range.joint[0].max, min: model.robot.state.range.joint[0].min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'J2', max: model.robot.state.range.joint[1].max, min: model.robot.state.range.joint[1].min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'J3', max: model.robot.state.range.joint[2].max, min: model.robot.state.range.joint[2].min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'J4', max: model.robot.state.range.joint[3].max, min: model.robot.state.range.joint[3].min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'J5', max: model.robot.state.range.joint[4].max, min: model.robot.state.range.joint[4].min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'J6', max: model.robot.state.range.joint[5].max, min: model.robot.state.range.joint[5].min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'J7', max: model.robot.state.range.joint[6].max, min: model.robot.state.range.joint[6].min, value: 0, selectedIndex: 4, unit: '°' },
      ],
     isParamsOut: false,
      isDown: false,
      isLoop: false,
      axis: 1,
    }
  },
  mounted() {
    console.log('isSettingRouter', this.isSettingRouter, this.$route.name);
    this.localInitialPoint = this.remoteInitialPoint;
    console.log('reset Params');
    this.resetParams();
    this.model.robot.state.func.setLocalJoints = (points) => {
      this.setLocalJoints(points);
    };
    this.model.robot.state.func.resetParams = () => {
      console.log('reset Params');
      this.resetParams();
    };
    this.checkParamsRangeOut()
    console.log('this.isParamsOut', this.isParamsOut);
  },
  beforeDestroy() {
    this.model.robot.state.local.selectJointIndex = this.selectedJointIndex;
  },
  methods: {
    onDown(evt) {
      this.axis = Number( evt.target.getAttribute('axis')) + 1;
      evt.preventDefault();
      this.isDown = true;
      this.interval = setTimeout(() => {
        if (this.isDown) {
          this.isLoop = true;
          this.moveStep(evt.target.id, true);
          // console.log('evt.target.id', evt.target.id)
          
        }
        else {
          this.moveStep(evt.target.id, false);
          // console.log('evt.target.id false', evt.target.id)
        }
      }, 200)
    },
    onUp(evt) {
      // evt.preventDefault();
      this.isDown = false;
      // clearTimeout(this.interval);
      if (this.isLoop) {
        this.isLoop = false;
        clearTimeout(this.interval);
        window.CommandsRobotSocket.moveStepOver();
      }
    },
    moveStep(direction, isLoop) {
      let distance = 1;
      
      if(this.stateOnline){
        window.CommandsRobotSocket.moveStep({'direction': direction, 'distance': distance, 'isLoop': isLoop, 'axis': this.axis})
      }

      console.log('axisaxisaxis', this.axis);
    },


    saveJointPoint() {
      window.CommandsRobotSocket.setInitialPoint(this.localInitialPoint, () => {
      });
    },



    getRange() {
      if (this.isTcpTab) {
        if (this.model.robot.state.local.selectPosIndex !== -1) {
          return this.tcpParams[this.model.robot.state.local.selectPosIndex];
        }
        else {
          return {max: '', min: '', unit: ''};
        }
      }
      else {
        if (this.model.robot.state.local.selectJointIndex !== -1) {
          return this.jointParams[this.model.robot.state.local.selectJointIndex];
        }
        else {
          return {max: '', min: '', unit: ''};
        }
      }
    },
    // onDown(index) {
    //   console.log('debug down');
    //   if (this.isTcpTab) {
    //     this.model.robot.state.local.selectPosIndex = index;
    //   }
    //   else {
    //     this.model.robot.state.local.selectJointIndex = index;
    //     this.selectedJointIndex = index;
    //   }
    // },
    // onUp(index) {
    // },
    selectJoints(index) {
      if (this.model.localTeach.isTeachRunningUUID && this.model.localTeach.isTeachRunningUUID.length > 0) {
        return;
      }
      if (this.isTcpTab) {
        this.model.robot.state.local.selectPosIndex = index;
      }
      else {
        this.model.robot.state.local.selectJointIndex = index;
        this.selectedJointIndex = index;
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // setTempJointsValue(values) {
    //   for (let i = 0; i < 7; i += 1) {
    //     this.jointParams[i].value = Number(values[i] || 0);
    //   }
    // },
    changeIndex(index, index2) {
      console.log(`changeIndex index = ${index}, value = ${index2}`);
      if ([3, 4, 6].includes(index2)) {
        const param = this.isTcpTab === true ? this.tcpParams : this.jointParams;
        param[Number(index)].selectedIndex = Number(index2);
      }
    },
    onAllLock() {
      window.CommandsRobotSocket.setServoLock(true, null, (response) => {
        console.log(response);
        if (response.code !== 0) {
          this.model.robot.state.local.jointLocks = this.model.robot.state.remote.jointLocks.concat();
        }
      });
    },
    onLock(index) {
      if (!this.jointRangeDisable) {
        console.log('index = ' + index + ', value = ' + this.model.robot.state.local.jointLocks[index]);
        const value = this.model.robot.state.local.jointLocks[index];
        window.CommandsRobotSocket.setServoLock(value, index + 1, (response) => {
          console.log(response);
          setTimeout(() => {
            this.model.robot.state.local.jointLocks = this.model.robot.state.remote.jointLocks.concat();
          }, 500);
          // if (response.code !== 0) {
          //   this.model.robot.state.local.jointLocks = this.model.robot.state.remote.jointLocks.concat();
          // }
        });
      }
    },
    setLocalJoints(points) {
      this.model.robot.state.local.joints = points.concat();
      for (let i = 0; i < 7; i += 1) {
        this.jointParams[i].value = Number(points[i]) || 0;
      }
    },
    resetParams() {
      if (this.moveIndex != 8) {
        this.tcpParams[0].value = this.model.robot.state.local.position.x || 0;
      }
      if (this.moveIndex != 9) {
        this.tcpParams[1].value = this.model.robot.state.local.position.y || 0;
      }
      if (this.moveIndex != 10) {
        this.tcpParams[2].value = this.model.robot.state.local.position.z || 0;
      }
      if (this.moveIndex != 11) {
        this.tcpParams[3].value = this.model.robot.state.local.orientation.roll || 0;
      }
      if (this.moveIndex != 12) {
        this.tcpParams[4].value = this.model.robot.state.local.orientation.pitch || 0;
      }
      if (this.moveIndex != 13) {
        this.tcpParams[5].value = this.model.robot.state.local.orientation.yaw || 0;
      }
      for (let i = 0; i < 7; i += 1) {
        if (this.stateOnline === true) {
          if (this.moveIndex != i + 1 && this.model.robot.state.local.isSetJoint === false) {
            this.jointParams[i].value = Number(this.model.robot.state.remote.joints[i]) || 0;
          }
        }
        else {
          this.jointParams[i].value = Number(this.model.robot.state.local.joints[i]) || 0;
        }
      }
      // console.log(this.jointParams);
    },
    closeMyself() {
      this.model.robot.state.showSetControlValueDialog = false;
    },
    moveArrow(isAdd, controlIndex, numberIndex) {
      console.log(`moveArrow isAdd = ${isAdd}, controlIndex = ${controlIndex}, numberIndex = ${numberIndex}`);
      if (this.jointRangeDisable === true || this.positionRangeDisable === true) {
        return;
      }
      const params = this.isTcpTab === true ? this.tcpParams : this.jointParams;
      const beforeValue = Number(params[controlIndex].value);
      // const adding = numberIndex === 2 ? 1 : 0.1;
      let adding = 0;
      // if (numberIndex === 1) {
      //   adding = 10;
      // }
      // if (numberIndex === 2) {
      //   adding = 1;
      // }
      // else if (numberIndex === 3) {
      //   adding = 0.1;
      // }
      if (numberIndex === 3) {
        adding = 10;
      }
      if (numberIndex === 4) {
        adding = 1;
      }
      else if (numberIndex === 6) {
        adding = 0.1;
      }
      let afterValue = isAdd === true ? (beforeValue + adding) : (beforeValue - adding);
      afterValue = Math.max(Number(afterValue), Number(params[controlIndex].min));
      afterValue = Math.min(Number(afterValue), Number(params[controlIndex].max));
      params[controlIndex].value = afterValue;
      console.log(`move Arrow = beforeValue = ${beforeValue}, afterValue = ${afterValue}, adding = ${adding}`);
      this.isMoveArrow = true;
      this.sendCmd(controlIndex);
    },
    showInputDotValue(value, index) {
      const str = `0000${Math.round(Math.abs(Number(value * 100)))}`.slice(-5);
      return str[index];
    },
    checkValueSigns(index) {
      if (this.isTcpTab) {
        const tcpParams = [
          this.model.robot.state.remote.position.x,
          this.model.robot.state.remote.position.y,
          this.model.robot.state.remote.position.z,
          this.model.robot.state.remote.orientation.roll,
          this.model.robot.state.remote.orientation.pitch,
          this.model.robot.state.remote.orientation.yaw,
        ]
        return tcpParams[index] < 0 ? '-' : '+';
      }
      else {
        return index < 0 ? '-' : '+';
      }
    },
    showInputDotValue2(value, index1, index2) {
      if (this.isTcpTab) {
        const tcpParams = [
          this.model.robot.state.remote.position.x,
          this.model.robot.state.remote.position.y,
          this.model.robot.state.remote.position.z,
          this.model.robot.state.remote.orientation.roll,
          this.model.robot.state.remote.orientation.pitch,
          this.model.robot.state.remote.orientation.yaw,
        ]
        const str = `0000${Math.round(Math.abs(Number(tcpParams[index1] * 100)))}`.slice(-5);
        return str[index2];
      }
      else {
        const str = `0000${Math.round(Math.abs(Number(value * 100)))}`.slice(-5);
        return str[index2];
      }
    },
    sendCmd(index) {
      if(this.isParamsOut) {
        this.$message({
            message: this.$t('outRangeTip'),
            type: 'warning',
            duration: 1000,
          })
        return;
      }
      if (this.isNotAllLock === true && this.isConnected) {
        console.log('this.onAllLock', this.isNotAllLock);
        this.onAllLock();
      }
      this.model.localTeach.hasChange = true;
      // this.model.robot.state.local.position.x = this.tcpParams[0].value;
      if (this.$store.state.robot.info.online === false) {
        return;
      }
  
      this.moveIndex = index + 1;
      this.model.robot.state.local.isSetJoint = this.isMoveArrow === true ? false : true;
      this.model.robot.state.jointRangeEventTouch = true;
      const points = this.jointParams.map((data) => {
        return data.value;
      });
      // this.model.robot.state.local.joints = points;
      console.log('points 1 = ' + points);
      window.CommandsRobotSocket.moveAllJoints(points, true, (dict) => {
        this.moveIndex = 0;
        this.isMoveArrow = false;
        this.model.robot.state.local.isSetJoint = false;
        console.log('moveAllJoints', dict);
        if (dict.code === -1) {
          this.$message({
            message: this.$t('isNotAllLockTip'),
            type: 'warning',
            duration: 3000,
            showClose: true,
          })
        }
        if (dict.code === -6) {
          console.log('reset Params');
          this.$message({
            message: this.$t('cannotArriveTip'),
            type: 'info',
            duration: 3000,
          })
          this.moveIndex = 0;
          this.model.robot.state.local.isSetJoint = false;
          this.resetParams();
        }
      }, true);

      
    },
    checkParamsRangeOut() {
      // const params = this.isTcpTab === true ? this.tcpParams : this.jointParams;
      const params = this.jointParams;
      // console.log(' const params = this.isTcpTab === true ? this.tcpParams : this.jointParams;', params);
      let tempName = [];
      console.log('checkParamsRangeOut', params);
      for (let i = 0; i < params.length; i++) {
       if (params[i].value > params[i].max || params[i].value < params[i].min) {
         tempName.push(params[i].name);
         params[i].isOutRange = true;
       }else {
          params[i].isOutRange = false;
       }
      };
      if (tempName.length > 0) {
        this.isParamsOut = true;
      }else {
         this.isParamsOut = false;
      }
    }
  },
  components: {
    CommonSpeedSetting,
    CommonAccessories,
    CommonSettings,
  },
  computed: {
    isIpad() {
      return this.model.commonStatusMgr.isMobile;
    },
    mode() {
      return this.model.robot.state.info.xarm_mode;
    },
    rollValue: {
      get() {
        if (!this.focusRoll) {
          let value = Number(this.tcpParams[3].value);
          if (value <= -180) {
            this.roll = (Number(value) + 360).toFixed(1);
          }
          else if (value > 180){
            this.roll = (Number(value) - 360).toFixed(1);
          }
          else {
            this.roll = Number(value).toFixed(1);
          }
        }
        return this.roll;
      },
      set(value) {
        this.roll = value;
        this.tcpParams[3].value = value;
      }
    },
    localSelectedIndex() {
      return this.isTcpTab ? this.model.robot.state.local.selectPosIndex : this.model.robot.state.local.selectJointIndex;
    },
    counter: {
      get() {
        return this.model.robot.state.counter;
      },
      set(value) {
        this.model.robot.state.counter = value;
      },
    },
    isJointTab: {
      get() {
        return this.model.commonStatusMgr.controlPanel.tab.index === this.model.commonStatusMgr.controlPanel.tab.JOINTS;
      },
      set(value) {
        if (this.model.commonStatusMgr.changeControlEditTab === false) {
          return;
        }
        if (value) {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.JOINTS;
        }
        else {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.TCP;
        }
      }
    },
    isTcpTab: {
      get() {
        return this.model.commonStatusMgr.controlPanel.tab.index === this.model.commonStatusMgr.controlPanel.tab.TCP;
      },
      set(value) {
        if (this.model.commonStatusMgr.changeControlEditTab === false) {
          return;
        }
        if (value) {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.TCP;
        }
        else {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.JOINTS;
        }
      }
    },
    isAccessoryTab: {
      get() {
        this.model.robot.state.local.speed = this.model.robot.state.remote.speed;
        this.model.robot.state.local.acceleration = this.model.robot.state.remote.acceleration;
        this.model.robot.state.local.angle_speed = this.model.robot.state.remote.angle_speed;
        this.model.robot.state.local.angle_acceleration = this.model.robot.state.remote.angle_acceleration;
        return this.model.commonStatusMgr.controlPanel.tab.index === this.model.commonStatusMgr.controlPanel.tab.ACCESSORY;
      },
      set(value) {
        if (this.model.commonStatusMgr.changeControlEditTab === false) {
          return;
        }
        if (value) {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.ACCESSORY;
        }
        else {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.JOINTS;
        }
      }
    },
    isSettingTab: {
      get() {
        return this.model.commonStatusMgr.controlPanel.tab.index === this.model.commonStatusMgr.controlPanel.tab.SETTING;
      },
      set(value) {
        if (this.model.commonStatusMgr.changeControlEditTab === false) {
          return;
        }
        if (value) {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.SETTING;
        }
        else {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.JOINTS;
        }
      }
    },
    jointRangeDisable() {
      const flag = this.model.robot.state.jointRangeMoving === true && this.stateOnline === true;
      // console.log('index1111-:', flag, this.moveIndex);
      // if (!flag) {
      //   this.moveIndex = 0;
      //   // this.resetParams()
      // }
      // console.log('debug:', flag, this.positionRangeDisable;
      return flag;
    },
    positionRangeDisable() {
      const flag1 = this.model.robot.state.jointRangeMoving === true && this.stateOnline === true;
      const flag2 = this.stateOnline === false && this.isTcpTab === true;
      // console.log('index2222:', flag1 || flag2, this.moveIndex);
      // if (!(flag1 || flag2)) {
      //   this.moveIndex = 0;
      //   // this.resetParams();
      // }
      // console.log('debug:', this.jointRangeDisable, flag1 || flag2);
      return flag1 || flag2;
      // return false;
    },
    stateOnline() {
      return this.$store.state.robot.info.online === true;
    },
    isConnected() {
      return this.$store.state.robot.status.connected === true;
    },
    localJoints: {
      get() {
        const arr = this.$store.getters.localJoints;
        return arr;
      },
      set(value) {
        value.forEach((joint, index) => {
          this.jointParams[index].value = Number(joint);
        })
      }
    },
    remoteJoints: {
      get() {
        const joints = this.$store.getters.remoteJoints;
        this.resetParams();
        return joints;
      },
    },
    remoteEnd: {
      get() {
        const end = this.$store.getters.end;
        this.resetParams();
        return end;
      }
    },
    tempEndStr: {
      get() {
        return this.tcpParams.map((data) => {
          return data.value;
        }).join(',');
      },
    },
    tempJointsStr: {
      get() {
        return this.jointParams.map((data) => {
          return Number(data.value).toFixed(1);
        }).join(',');
      },
    },
    jointRangeMoving: {
      get() {
        return this.model.robot.state.jointRangeMoving;
      },
    },
    isNotAllLock() {
      return this.model.robot.state.local.jointLocks.some((item) => {
      return item === false });
    },
    disableAxis() {
      if (this.isTcpTab) {
        return false;
      }
      else {
        if (this.selectedJointIndex > this.model.robot.state.info.xarm_axis - 1) {
          return true;
        }
        else {
          return false;
        }
      }
    },
    // isNotReady() {
    //   let isNotAllLock = this.model.robot.state.local.jointLocks.some((item) => {
    //     return item === false });
    //   return isNotAllLock && !this.model.robot.state.info.xarm_is_ready;
    // }
  },
  watch: {
    remoteInitialPoint(newValue) {
      this.localInitialPoint = newValue;
    },
    mode(newValue) {
      console.log('debug mode:', newValue);
    },
    tempJointsStr(newValue) {
      if (this.isMoveArrow === true && this.stateOnline === true) {
        return;
      }
      console.log('tempJointsStr newValue = ' + newValue);
      const joints = newValue.split(',').map((value) => {
        return Number(value).toFixed(1);
      });
      this.model.robot.state.local.joints = joints.concat();
      // if (this.stateOnline === false) {
      //   this.model.robot.state.local.joints = joints.concat();
      // }
    },
    tempEndStr(newValue) {
      // const tempArr = newValue.split(',').map((value) => {
      //   return Number(value);
      // }).concat();
      // this.model.robot.state.local.position = {
      //   x: tempArr[0],
      //   y: tempArr[1],
      //   z: tempArr[2],
      // };
      // this.model.robot.state.local.orientation = {
      //   roll: tempArr[3],
      //   yaw: tempArr[4],
      //   pitch: tempArr[5],
      // };
    },
    stateOnline(newValue) {
      if (newValue === true) {
        this.model.robot.state.func.remote2Local();
        console.log('reset Params');
        this.resetParams();
      }
    },
    remoteJoints(newValue) {
      // console.log('remoteJoints remoteJoints = ' + newValue);
      const jointLocks = this.model.robot.state.local.jointLocks;
      let isLock = true;
      jointLocks.forEach((item, index) => {
        if (item === false) {
          isLock = false;
          if (this.model.localTeach.jointRangeEventTouch === false) {
            if (this.stateOnline === true) {
              this.jointParams[index].value = Number(this.model.robot.state.remote.joints[index]) || 0;
            }
            else {
              this.jointParams[index].value = Number(this.model.robot.state.local.joints[index]) || 0;
            }
          }
        }
      });
      // for (let i = 0; i < 7; i += 1) {
      //   if (this.stateOnline === true) {
      //     this.jointParams[i].value = this.model.robot.state.remote.joints[i] || 0;
      //   }
      //   else {
      //     this.jointParams[i].value = this.model.robot.state.local.joints[i] || 0;
      //   }
      // }
      if (isLock === false) {
        if (this.stateOnline) {
          this.model.localTeach.hasChange = true;
        }
        this.resetParams();
      }
      // if (this.stateOnline === true && this.model.localTeach.editState === true && this.model.localTeach.jointRangeEventTouch === false) {
      //   this.resetParams();
      // }
      this.checkParamsRangeOut();
    },
    localJoints(newValue) {
      // console.log('localJoints = ', newValue, this.moveIndex);
      if (this.moveIndex === 0 && this.model.robot.state.local.isSetJoint === false) {
        this.localJoints = newValue;
      }
      if (this.model.robot.state.intervalInfo.curIntervals.length > 0) {
        console.log('reset Params');
        this.resetParams();
      }
      window.clearInterval(this.resetInterval);
      this.resetInterval = null;
      this.resetInterval = window.setInterval(() => {
        window.clearInterval(this.resetInterval);
        this.resetInterval = null;
        if (this.stateOnline === true) {
          // this.resetParams();
        }
      }, 2000);
    },
    jointRangeMoving(newValue) {
      console.log('jointRangeMoving ' + newValue);
      if (newValue === false) {
        if (this.stateOnline) {
          this.model.robot.state.func.remote2Local();
        }
        // this.model.robot.state.func.remote2Local();
        console.log('reset Params');
        // this.moveIndex = 0;
        this.model.robot.state.local.isSetJoint = false;
        this.resetParams();
        // this.checkParamsRangeOut();
      }
    },
    isTcpTab(newValue) {
      if (this.stateOnline === true) {
        // this.model.robot.state.func.remote2Local();
      }
      this.checkParamsRangeOut();
      // console.log('isTcpTab = ' + newValue);
      if (!(this.jointRangeDisable || this.positionRangeDisable)) {
        this.moveIndex = 0;
        this.model.robot.state.local.isSetJoint = false;
      }
      // this.resetParams();
    },
    isJointTab(newValue, oldValue) {
      if (newValue) {
        if (this.model.robot.state.local.selectJointIndex === -1) {
          this.model.robot.state.local.selectJointIndex = this.selectedJointIndex;
        }
        else {
          this.selectedJointIndex = this.model.robot.state.local.selectJointIndex;
        }
      }
      else {
        if (this.model.robot.state.local.selectJointIndex !== -1) {
          this.selectedJointIndex = this.model.robot.state.local.selectJointIndex;
          this.model.robot.state.local.selectJointIndex = -1;
        }
      }
    },
    counter(newValue) {
      console.log('counter = ' + newValue);
      console.log('reset Params');
      this.resetParams();
    },
  },
    // stateError(newValue) {
    //   if (newValue === -6) {
    //     window.GlobalUtil.model.robot.state.jointRangeMoving = false;
    //     window.GlobalUtil.model.robot.state.jointRangeEventTouch = false;
    //     this.resetParams();
    //     this.$message('unable to move 2.');
    //   }
    //   // if (newValue < 0) {
    //   //   this.$message('Fail to move');
    //   // }
    // },
}
</script>

<style>
.out-params-number .el-slider__bar {
  background-color:#e15151;
}
.out-params-number .el-slider__button {
  border: 2px solid #e15151;
}
.select-joint-number .el-slider__bar {
  background-color:#da7141;
}
.select-joint-number .el-slider__button {
  border: 2px solid #da7141;
}
</style>

<style scoped lang="scss">
/* $fontColor: #FFFFFF; */
$selectedColor:#0771de;
.out-range-message {
  width: 400px;
  height: 300px;
}
.dialog-content {
  // position: absolute;
  // width: 500px;
  width: 100%;
  height: 100%;
  // height: 88%;
  /*top: 60px;*/
  // top: 10px;
  /*bottom: 0px;*/
  // right: 0px;
  z-index: 10;
  /*font-family: 'Gotham-Medium';*/
  color: #555;
  // margin-top: 28px;

  // overflow: auto;
  // background: #fff;
  .tab-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid #e4e4e4;
    height: 46px;
    span {
      padding: 10px 0;
      // width: 100%;
      text-align: center;
      cursor: pointer;
    }
    .tab-selected {
      // background: #4d4d4d ;
      // background: #666;
      color: $selectedColor;
      position: relative;
      display: flex;
      font-size: 16px;
      justify-content: center;
      text-align: center;
      .el-icon-caret-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin-left: 0;
        margin-right: 0;
      }
    }
  }
  .top-bar {
    position: absolute;
    /* background: black; */
    /*background: #434343;*/
    width: 100%;
    height: 50px;
    line-height: 50px;
    /*background: #4d4d4d ;*/
  }
  .range-wrapper {
    position: relative;
    width:100%;
    height: 100%;
    // height:100%;
    /*top:36px;*/
    // background: #fff;
    // display: flex;
    // height: 370px;
  }
}
.top-title {
  position: absolute;
  left: 25px;
  /* top: 0px;
  bottom: 0px;
  margin: auto; */
  /*font-family: 'Gotham-Medium';*/
  font-size: 14px;
  letter-spacing: -0.78px;
}
.lock-btn {
  position:absolute;
  left: 150px;
  top: 10px;
  width: 50px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  /* border: 1px solid #DCDCDC; */
  border: 0;
  background: #52BF53;
  color:#fff;
  font-family: 'Gotham-Medium';
}
.lock-btn:disabled {
  cursor:not-allowed;
  opacity: 0.6;
}

.dialog-close {
  position: absolute;
  /* top: 15px; */
  right: 0px;
  width: 50px;
  height: 50px;
  color: #FFFFFF;
  text-align:center;
  /* line-height: 40px; */
  cursor: pointer;
  background-image: url('./../../assets/img/edit/recording/icon_close.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 16px 16px;
}
/* .btn-create {
  width: 100%;
  height: 40px;
  bottom: 0px;
  background: #52BF53;
  text-align: center;
  font-family: 'Gotham-Book';
  font-size: 14px;
  color: #FFFFFF;
  letter-spacing: -0.78px;
  line-height: 40px;
} */
.single-range-wrapper {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 100%;

  flex-direction: column;
  // height: 344px;
  position: relative;
}
.range-number {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  // height: 356px;
}
.setting-line {
  // position: relative;
  // width: 100%;
  // height: 80px;
  // left: 0px;
  // top: 100px;
  // width:100%;
  // height:80px;
  // padding: 5px 0;
  // width: 100px;
  // height: 300px;
  display: flex;
  // margin-top: 32px;
  // height: 290px;
  // flex-direction: column;
  align-items: center;
  justify-content: space-between;
  // margin: 1vh 1vw;
  /* border-top: 1px solid #DCDCDC; */
  // border-bottom: 1px solid rgba(220, 220, 220, 0.1);
}
.joint-btn-wrapper {
  display: flex;
}
.input-box {
  border: 1px solid #e8e8e8;
  display: flex;
  input {
    border: none;
    width:100%;
    height: 40px;
    line-height: 40px;
    padding: 4px;
    text-align: center;
  }
}
.joint-btn {
  // width: 5vw;
  // line-height: 3vh;
  text-align:center;
  border: 1px solid #e8e8e8;
  cursor: pointer;
  width: 100%;
}
.joint-btn:active{
  background: #d87046;
}
button:disabled {
  color:#b4bccc;
  cursor: no-drop;
}

.setting-line:last-child {
  border-bottom: none;
}
.selected-line {
  opacity: 1;
  color: $selectedColor;
}
.slider-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 2px 0;
}

.left-title {
  // position: absolute;
  // top: 0;
    width: 8%;
  // margin-right: 1vw;
  // left: 12px;
  height: 30px;
  line-height: 30px;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  letter-spacing: -0.43px;
  text-align: center;
}
.lock-toggle {
  //  position: absolute;
  //  top: 35px;
  // margin: 0 1vw;

}
.retmote-value {
  // position: absolute;
  width: 40px;
  top: 30px;
  left: 10px;
  /* height: 30px; */
  /* line-height: 30px; */
  font-family: 'Gotham-Medium';
  font-size: 12px;
  /* color: #555555; */
  color: orange;
  letter-spacing: -0.43px;
  text-align: left;
}
input[type=range] {
  cursor: pointer;
}
input:disabled {
  cursor:not-allowed;
}
input[type=range]:focus {
  outline: none;
}
.range-input {
  // position: absolute;
  /* width: 120%; */
  // left: 14px;
  // margin-top: 44px;
  /* top: 12px; */
  // width: 255px;
  height: 2px;
  // width: 320%;
  background: #878787;
  opacity: 1;
  border-radius: 150px;
  cursor: pointer;
  outline: none;
  transform: rotate(-90deg)
}
.range-input::-webkit-slider-thumb {
  /*width: 28px;*/
  /*height: 28px;*/
  /*background-image: url('./../../assets/img/control/btn_slide.svg');*/
  /*background-size: 55px 55px;*/
  /*background-repeat: no-repeat;*/
  /*background-position: center;*/
  /*-webkit-appearance: none;*/
  /*border: none;*/
  /*border-radius: 50%;*/
  /*outline: none;*/
  /*box-shadow: darkgrey 0px 0px 5px;*/
  width: 2px;
  height: 2px;
  -webkit-appearance: none;
  border: none;
  border-radius: 50%;
  background: #aaa;
}
.range-input-value {
  // position: absolute;
  // bottom: 30px;
}
.number-input-value {
  // position: absolute;
  // bottom: 30px;
  // width: 60px;
  text-align: center;
  border-width: 0px;
}
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[type=number]{
    -moz-appearance: textfield;
}
input[type=number]:disabled {
  background: white;
}
/* .out-params-number {
  color: #e15151;
} */
.com-block-wrapper {
  background-color: #fff;
}


</style>
