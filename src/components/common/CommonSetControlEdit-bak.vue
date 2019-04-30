
<template>
  <div class="dialog-content noselected">
    <div class="top-bar">
      <span class="top-title"></span>
      <toggle-button style="position:absolute;left:10px;top:10px;" v-model="isTcp" :color="{checked: '#52BF53', unchecked: '#52BF53'}" :sync="true"
        :labels="{checked: 'TCP', unchecked: 'Joints'}"
        :width="100" :height="30"/>
      <!-- <toggle-button
        v-if="isTcp === false" v-model="isAllJointsLock" style="position:absolute;left:120px;top:10px;" :color="{checked: '#52BF53', unchecked: '#D3D5DB'}" :sync="true"
        :labels="{checked: 'All Locks', unchecked: 'All unlocks'}"
        :width="100" :height="30"/> -->
      <button v-if="isTcp === false" :disabled="jointRangeDisable || stateOnline === false" @click="onAllLock" class="lock-btn">Locks</button>
      <div v-if="isShowClose" class="dialog-close" @click="closeMyself">
      </div>
    </div>
    <div style="position:absolute;width:100%;height:100%;top:50px;">
      <template v-for="(param, index) in isTcp ? tcpParams : jointParams" >
        <div class="setting-line"  style="">
          <toggle-button
            @change="onLock(index)"
            :disabled="jointRangeDisable || stateOnline === false"
            v-if="isTcp === false"
            style="position:absolute;left:25px;margin-top:8px;" :color="{checked: '#52BF53', unchecked: '#D3D5DB'}"
            v-model="model.robot.state.local.jointLocks[index]"
            :sync="true"
            :labels="{checked: 'LOCK', unchecked: 'UNLOCK'}"
            :width="60" :height="20" />
          <span class="left-title">
            {{ param.name }}
          </span>
          <input
            v-model="param.value"
            type="range"
            :min="param.min"
            :max="param.max"
            step="0.01"
            value="0"
            @change="sendCmd()"
            :disabled="jointRangeDisable || positionRangeDisable"
            class="range-input">
        </div>
        <div class="input-numbers">
          <template v-for="index2 in [0, 1, 2, 3]">
            <span v-if="param.value < 0" class="position-absolute" style="left:3px;margin-top:8px;font-size:10px;color:#FFFFFF;">-</span>
            <div class="input-per-number" :style="{left: 10 + 30 * index2 + 'px'}">
              <div v-if="index2 === 1 || index2 === 2 || index2 === 3" class="arrow-size" style="left:-1px;top:-16px;" @click="moveArrow(true, index, index2)">
                <div class="arrow arrow-top"></div>
              </div>
              <div v-if="index2 === 1 || index2 === 2 || index2 === 3" class="arrow-size" style="left:-1px;top:3px;" @click="moveArrow(false, index, index2)">
                <div class="arrow arrow-bottom"></div>
              </div>
              {{ showInputDotValue(param.value, index2) }}
            </div>
            <span v-if="index2 === 3" class="position-absolute dot" :style="{left: + 10 + 30 * index2 - 7 + 'px'}"></span>
          </template>
          <!-- <span class="unit">
            {{ (index > 2 || !isTcp) ? $t('control.degree') : $t('control.millimeter') }}
          </span> -->
        </div>
      </template>
    </div>
  </div>
</template>

<script>

const model = window.GlobalUtil.model;

export default {
  props: ['isShowClose'],
  data() {
    return {
      model: window.GlobalUtil.model,
      resetInterval: null,
      curInputValue: 50,
      counts: [0, 1, 2, 3, 4],
      // isTcp: false,
      tcpParams: [
        { name: 'x', max: model.robot.state.range.position.max, min: model.robot.state.range.position.min, value: 0 },
        { name: 'y', max: model.robot.state.range.position.max, min: model.robot.state.range.position.min, value: 0 },
        { name: 'z', max: model.robot.state.range.position.max, min: model.robot.state.range.position.min, value: 0 },
        { name: 'roll', max: model.robot.state.range.orientation.max, min: model.robot.state.range.orientation.min, value: 0 },
        { name: 'yaw', max: model.robot.state.range.orientation.max, min: model.robot.state.range.orientation.min, value: 0 },
        { name: 'pitch', max: model.robot.state.range.orientation.max, min: model.robot.state.range.orientation.min, value: 0 },
      ],
      jointParams: [
        { name: 'J1', max: model.robot.state.range.joint.max, min: model.robot.state.range.joint.min, value: 0, index: 0 },
        { name: 'J2', max: model.robot.state.range.joint.max, min: model.robot.state.range.joint.min, value: 0 },
        { name: 'J3', max: model.robot.state.range.joint.max, min: model.robot.state.range.joint.min, value: 0 },
        { name: 'J4', max: model.robot.state.range.joint.max, min: model.robot.state.range.joint.min, value: 0 },
        { name: 'J5', max: model.robot.state.range.joint.max, min: model.robot.state.range.joint.min, value: 0 },
        { name: 'J6', max: model.robot.state.range.joint.max, min: model.robot.state.range.joint.min, value: 0 },
        { name: 'J7', max: model.robot.state.range.joint.max, min: model.robot.state.range.joint.min, value: 0 },
      ],
    }
  },
  mounted() {
    this.resetParams();
  },
  methods: {
    // setTempJointsValue(values) {
    //   for (let i = 0; i < 7; i += 1) {
    //     this.jointParams[i].value = Number(values[i] || 0);
    //   }
    // },
    onAllLock() {
      window.CommandsRobotSocket.setServoLock(true, null, (response) => {
        console.log(response);
        if (response.code !== 0) {
          this.model.robot.state.local.jointLocks = this.model.robot.state.remote.jointLocks.concat();
        }
      });
    },
    onLock(index) {
      console.log('index = ' + index + ', value = ' + this.model.robot.state.local.jointLocks[index]);
      const value = this.model.robot.state.local.jointLocks[index];
      window.CommandsRobotSocket.setServoLock(value, index + 1, (response) => {
        console.log(response);
        if (response.code !== 0) {
          this.model.robot.state.local.jointLocks = this.model.robot.state.remote.jointLocks.concat();
        }
      });
    },
    resetParams() {
      this.tcpParams[0].value = this.model.robot.state.local.position.x || 0;
      this.tcpParams[1].value = this.model.robot.state.local.position.y || 0;
      this.tcpParams[2].value = this.model.robot.state.local.position.z || 0;
      this.tcpParams[3].value = this.model.robot.state.local.orientation.roll || 0;
      this.tcpParams[4].value = this.model.robot.state.local.orientation.yaw || 0;
      this.tcpParams[5].value = this.model.robot.state.local.orientation.pitch || 0;
      for (let i = 0; i < 7; i += 1) {
        if (this.stateOnline === true) {
          this.jointParams[i].value = this.model.robot.state.remote.joints[i] || 0;
        }
        else {
          this.jointParams[i].value = this.model.robot.state.local.joints[i] || 0;
        }
      }
      console.log(this.jointParams);
    },
    closeMyself() {
      this.model.robot.state.showSetControlValueDialog = false;
    },
    moveArrow(isAdd, controlIndex, numberIndex) {
      if (this.jointRangeDisable === true || this.positionRangeDisable === true) {
        return;
      }
      const params = this.isTcp === true ? this.tcpParams : this.jointParams;
      const beforeValue = Number(params[controlIndex].value);
      // const adding = numberIndex === 2 ? 1 : 0.1;
      let adding = 0;
      if (numberIndex === 1) {
        adding = 10;
      }
      if (numberIndex === 2) {
        adding = 1;
      }
      else if (numberIndex === 3) {
        adding = 0.1;
      }
      let afterValue = isAdd === true ? (beforeValue + adding) : (beforeValue - adding);
      afterValue = Math.max(Number(afterValue), Number(params[controlIndex].min));
      afterValue = Math.min(Number(afterValue), Number(params[controlIndex].max));
      params[controlIndex].value = afterValue;
      console.log(`move Arrow = beforeValue = ${beforeValue}, afterValue = ${afterValue}, adding = ${adding}`);
      this.sendCmd();
    },
    showInputDotValue(value, index) {
      const str = `0000${Math.round(Math.abs(Number(value * 100)))}`.slice(-5);
      return str[index];
    },
    sendCmd() {
      this.model.localTeach.hasChange = true;
      // this.model.robot.state.local.position.x = this.tcpParams[0].value;
      if (this.$store.state.robot.info.online === false) {
        return;
      }
      if (this.isTcp === true) {
        const data = {};
        data.position = {};
        data.orientation = {};
        data.position.x = this.tcpParams[0].value || 0;
        data.position.y = this.tcpParams[1].value || 0;
        data.position.z = this.tcpParams[2].value || 0;
        data.orientation.roll = this.tcpParams[3].value || 0;
        data.orientation.yaw = this.tcpParams[4].value || 0;
        data.orientation.pitch = this.tcpParams[5].value || 0;
        window.CommandsRobotSocket.moveLine(data, true, (response) => {
          console.log('roll 4 yaw socket res', response);
          // if (response.code === -6) {
          //   this.resetParams();
          // }
          if (response.code !== 0) {
            this.resetParams();
          }
        });
      }
      else {
        const points = this.jointParams.map((data) => {
          return data.value;
        });
        // this.model.robot.state.local.joints = points;
        console.log('points 1 = ' + points);
        window.CommandsRobotSocket.moveAllJoints(points, true, (dict) => {
          console.log(dict);
          if (dict.code === -6) {
            this.resetParams();
          }
        });
      }
    },
  },
  components: {
  },
  computed: {
    counter: {
      get() {
        return this.model.robot.state.counter;
      },
      set(value) {
        this.model.robot.state.counter = value;
      },
    },
    isTcp: {
      get() {
        return this.model.robot.state.isTcp === true;
      },
      set(value) {
        this.model.robot.state.isTcp = value;
      },
    },
    jointRangeDisable() {
      return this.model.robot.state.jointRangeMoving === true && this.stateOnline === true;
    },
    positionRangeDisable() {
      const flag1 = this.model.robot.state.jointRangeMoving === true && this.stateOnline === true;
      const flag2 = this.stateOnline === false && this.isTcp === true;
      return flag1 || flag2;
      // return false;
    },
    stateOnline() {
      return this.$store.state.robot.info.online === true;
    },
    localJoints: {
      get() {
        const arr = this.$store.getters.localJoints;
        return arr;
      },
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
          return data.value;
        }).join(',');
      },
    },
    jointRangeMoving: {
      get() {
        return this.model.robot.state.jointRangeMoving;
      },
    },
  },
  watch: {
    tempJointsStr(newValue) {
      // console.log('tempJointsStr newValue = ' + newValue);
      const joints = newValue.split(',').map((value) => {
        return Number(value);
      });
      if (this.stateOnline === false) {
        this.model.robot.state.local.joints = joints.concat();
      }
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
        this.resetParams();
      }
    },
    localJoints(newValue) {
      // console.log('localJoints = ' + newValue);
      if (this.model.robot.state.intervalInfo.curIntervals.length > 0) {
        this.resetParams();
      }
      window.clearInterval(this.resetInterval);
      this.resetInterval = null;
      this.resetInterval = window.setInterval(() => {
        window.clearInterval(this.resetInterval);
        this.resetInterval = null;
        if (this.stateOnline === true) {
          this.resetParams();
        }
      }, 2000);
    },
    jointRangeMoving(newValue) {
      console.log('jointRangeMoving ' + newValue);
      if (newValue === false) {
        this.model.robot.state.func.remote2Local();
        this.resetParams();
      }
    },
    isTcp(newValue) {
      if (this.stateOnline === true) {
        this.model.robot.state.func.remote2Local();
      }
      console.log('isTcp = ' + newValue);
      this.resetParams();
    },
    counter(newValue) {
      console.log('counter = ' + newValue);
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

<style scoped>
/* $fontColor: #FFFFFF; */
.top-title {
  position: absolute;
  left: 25px;
  /* top: 0px;
  bottom: 0px;
  margin: auto; */
  font-family: 'Gotham-Medium';
  font-size: 14px;
  color: #FFFFFF;
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
.dialog-content {
  position: absolute;
  width: 280px;
  height: 580px;
  top: 60px;
  bottom: 0px;
  right: 0px;
  z-index: 10;
  background: #4d4d4d;
  font-family: 'Gotham-Medium';
  color: #FFFFFF;
  overflow: hidden;
}
.top-bar {
  position: absolute;
  /* background: black; */
  background: #434343;
  width: 100%;
  height: 50px;
  line-height: 50px;
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
.setting-line {
  /* position: absolute;
  width: 100%;
  height: 80px;
  left: 0px;
  top: 100px; */
  width:100%;
  height:75px;
  /* border-top: 1px solid #DCDCDC; */
  border-bottom: 1px dashed #DCDCDC;
}
.left-title {
  position: absolute;
  width: 20px;
  left: 0px;
  height: 30px;
  line-height: 30px;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  /* color: #555555; */
  color: #FFFFFF;
  letter-spacing: -0.43px;
  text-align: right;
}
.retmote-value {
  position: absolute;
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
  position: absolute;
  /* width: 120%; */
  left: 10px;
  margin-top: 50px;
  /* top: 12px; */
  width: 255px;
  height: 5px;
  background: #F2F4F7;
  opacity: 1;
  border-radius: 150px;
  cursor: pointer;
  outline: none;
}
.range-input::-webkit-slider-thumb {
  width: 30px;
  height: 30px;
  background-image: url('./../../assets/img/control/btn_slide.svg');
  background-size: 55px 55px;
  background-repeat: no-repeat;
  background-position: center;
  -webkit-appearance: none;
  border: none;
  border-radius: 50%;
  outline: none;
  box-shadow: darkgrey 0px 0px 5px;
}
.input-numbers {
  position: absolute;
  width: 120px;
  height: 30px;
  left: 105px;
  margin-top: -70px;
  text-align: center;
  color: #4B4B4B;
}
.input-per-number {
  position: absolute;
  width: 20px;
  height: 10px;
  line-height: 10px;
  left: 270px;
  top: 10px;
  background: #FDFDFD;
  border: 1px solid #D7D7D7;
  border-radius: 2px;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  text-align: center;
  color: #4B4B4B;
  outline: none;
}
.dot {
  position: absolute;
  width: 4px;
  height: 4px;
  top: 20px;
  /* background: black; */
  background: #FFFFFF;
  border-radius: 50%;
}
.arrow {
  position:absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin:auto;
  width:20px;
  height:10px;
  background: gray;
  background-position: center;
  background-size: 20px 10px;
  background-repeat: no-repeat;
  /* transform: rotate(90deg); */
  cursor: pointer;
}
.arrow-top {
  background-image: url('./../../assets/img/control/btn_toptriangle.svg');
  left:0px;
}
.arrow-bottom {
  background-image: url('./../../assets/img/control/btn_btmtriangle.svg');
}
.arrow-size {
  position: absolute;
  width: 20px;
  height: 20px;
}
.unit {
  position: absolute;
  width: 30px;
  left: 130px;
  height: 30px;
  line-height: 30px;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  /* color: #555555; */
  color: #FFFFFF;
  letter-spacing: -0.43px;
  text-align: left;
}
</style>
