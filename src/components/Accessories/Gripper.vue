<template>
  <!-- speed -->
  <div class="config-wrapper">

    <!-- gripper -->


    <div style="margin-top: 20px;">
      <toggle-button
        :disabled="stateOnline === false"
        @change="setEnable"
        :color="{checked: '#52BF53', unchecked: '#D3D5DB'}"
        :sync="true"
        v-model="model.robot.state.local.gripper.enable"
        :labels="{checked: $t('gripperEnable'), unchecked: $t('gripperDisable')}"
        :width="80" :height="20" />
    </div>
    <div class="range-speed"  :style="{opacity: stateOnline && model.robot.state.remote.gripper.enable ? 1 : 0.6}">
      <div class="num-wrapper">
        <span class="com-font-style speed-title">{{$t('gripperSpeed')}}</span> 
        <!-- <span class="com-font-style speed-location" v-text="gripper.speed"></span> -->
        <div class="position-absolute change-input-value">
          <template v-for="index in [0, 1, 2, 3, 4, 5, 6, 7]">
            <div class="per-number-style" @click="changeGripperSpeedIndex(index)" :key="index" :class="{'disabled': stateOnline === false || model.robot.state.remote.gripper.enable === false}">
              <div class="input-per-number-style border-number" v-if="index === 0"  @click="moveGripperSpeedArrow(false, controlGripperSpeedNum)"><i class="el-icon-caret-left"></i></div>
              <!-- number -->
              <div class="input-per-number-style" v-if="index === 1" >
                +
              </div>
              <div class="input-per-number-style" v-if="index === 2">
                {{ showInputDotValueGripperSpeed(gripper.speed, 0) }} 
              </div>
              <div class="input-per-number-style border-number" v-if="index === 3" :class="{ 'selected-cell-bg': controlGripperSpeedNum === 3 }">
                {{ showInputDotValueGripperSpeed(gripper.speed, 1) }} 
              </div>
              <div class="input-per-number-style border-number" v-if="index === 4" :class="{ 'selected-cell-bg': controlGripperSpeedNum === 4 }">
                {{ showInputDotValueGripperSpeed(gripper.speed, 2) }} 
              </div>
              <div class="input-per-number-style border-number" v-if="index === 5" :class="{ 'selected-cell-bg': controlGripperSpeedNum === 5 }">
                {{ showInputDotValueGripperSpeed(gripper.speed, 3) }} 
              </div>
              <div class="input-per-number-style border-number" v-if="index === 6" :class="{ 'selected-cell-bg': controlGripperSpeedNum === 6 }">
                {{ showInputDotValueGripperSpeed(gripper.speed, 4) }} 
              </div>
                <!-- {{ showInputDotValueGripperSpeed(param.value, 1) }} -->
              <div class="input-per-number-style border-number" v-if="index === 7"  @click="moveGripperSpeedArrow(true, controlGripperSpeedNum)"><i class="el-icon-caret-right"></i></div>
            </div>
          </template>
        </div>
      </div>
      <input 
        :disabled="stateOnline === false || model.robot.state.remote.gripper.enable === false" 
        type="range" 
        :class="{'on-line-range': stateOnline === true}"
        v-model="gripper.speed" 
        @change="setGripperSpeed" 
        :step="1" 
        :max="10000" 
        :min="1">
      <div class="num-range-wrapper ">
        <span class="com-font-style">1</span>
        <span class="com-font-style remote-value">10000</span>
      </div>
    </div>
    <div class="range-speed"  :style="{opacity: stateOnline && model.robot.state.remote.gripper.enable ? 1 : 0.6}">
      <div class="num-wrapper">
        <span class="com-font-style speed-title">{{$t('gripperPosition')}}</span> 
        <!-- <span class="com-font-style speed-location" v-text="gripper.pos"></span> -->
        <div class="position-absolute change-input-value">
          <template v-for="index in [0, 1, 2, 3, 4, 5, 6]">
            <div class="per-num-style" @click="changeGripperPosIndex(index)" :key="index" :class="{'disabled': stateOnline === false || model.robot.state.remote.gripper.enable === false}">
              <div class="input-per-number-style border-number" v-if="index === 0"  @click="moveGripperPosArrow(false, controlGripperPosNum)"><i class="el-icon-caret-left"></i></div>
              <!-- number -->
              <div class="input-per-number-style" v-if="index === 1" >
                {{ gripper.pos > 0 ? '+' : '-' }}
              </div>
              <div class="input-per-number-style" v-if="index === 2">
                {{ showInputDotValueGripperPos(gripper.pos, 0) }} 
              </div>
              <div class="input-per-number-style border-number" v-if="index === 3" :class="{ 'selected-cell-bg': controlGripperPosNum === 3 }">
                {{ showInputDotValueGripperPos(gripper.pos, 1) }} 
              </div>
              <div class="input-per-number-style border-number" v-if="index === 4" :class="{ 'selected-cell-bg': controlGripperPosNum === 4 }">
                {{ showInputDotValueGripperPos(gripper.pos, 2) }} 
              </div>
              <div class="input-per-number-style border-number" v-if="index === 5" :class="{ 'selected-cell-bg': controlGripperPosNum === 5 }">
                {{ showInputDotValueGripperPos(gripper.pos, 3) }} 
              </div>
              <!-- <div class="input-per-number-style border-number" v-if="index === 6" :class="{ 'selected-cell-bg': controlGripperPosNum === 6 }">
                {{ showInputDotValue(gripper.pos, 4) }} 
              </div> -->
                <!-- {{ showInputDotValue(param.value, 1) }} -->
              <div class="input-per-number-style border-number" v-if="index === 6"  @click="moveGripperPosArrow(true, controlGripperPosNum)"><i class="el-icon-caret-right"></i></div>
            </div>
          </template>
        </div>
      </div>
      <input 
        :disabled="stateOnline === false || model.robot.state.remote.gripper.enable === false" 
        type="range" 
        :class="{'on-line-range': stateOnline === true}"
        v-model="gripper.pos" 
        @change="setGripperPos" 
        :step="1" 
        :max="1000" 
        :min="-200">
      <div>
        <div class="num-range-wrapper">
          <span>-200</span>
          <span class="com-font-style remote-value">1000</span>
        </div>
      </div>
    </div>

    
  </div>
</template>

<script>

export default {
  props: [],
    i18n: {
    messages: {
      en: {
        gripperEnable: 'Enable',
        gripperDisable: 'Disable',
        gripperSpeed: 'Speed',
        gripperPosition: 'Position',
      },
      cn: {
        gripperEnable: '使能',
        gripperDisable: '禁用',
        gripperSpeed: '速度',
        gripperPosition: '位置',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      // gripper: {
      //   speed: 8000,
      //   pos: 0,
      //   enable: false,
      // },
      controlGripperSpeedNum: 6,
      controlGripperPosNum: 5,
    }
  },
  mounted() {
    this.model.robot.state.setGripperPos = (e, callback) => {
      this.setGripperPos(e, callback);
    }
    this.model.robot.state.local.gripper.enable = this.model.robot.state.remote.gripper.enable;
    this.model.robot.state.local.gripper.pos = this.model.robot.state.remote.gripper.pos;
    this.model.robot.state.local.gripper.speed = this.model.robot.state.remote.gripper.speed;
  },
  beforeDestroy() {
    this.model.robot.state.setGripperPos = null;
  },
  methods: {
    changeGripperSpeedIndex(index) {
     if ([3,4,5,6].includes(index)) {
       this.controlGripperSpeedNum = index;
     }
    },
    changeGripperPosIndex(index) {
     if ([3,4,5].includes(index)) {
       this.controlGripperPosNum = index;
     }
    },

    moveGripperSpeedArrow(isAdd, numberIndex) {
      console.log(`moveArrow isAdd = ${isAdd}, numberIndex = ${numberIndex}`);
      let params = this.gripper.speed;
      const beforeValue = Number(params);
      // const adding = numberIndex === 2 ? 1 : 0.1;
      let adding = 0;
      if (numberIndex === 3) {
        adding = 1000;
      }
      if (numberIndex === 4) {
        adding = 100;
      }
      if (numberIndex === 5) {
        adding = 10;
      }
      else if (numberIndex === 6) {
        adding = 1;
      }
      let afterValue = isAdd === true ? (beforeValue + adding) : (beforeValue - adding);
      afterValue = Math.max(Number(afterValue), 1);
      afterValue = Math.min(Number(afterValue), 10000);
      this.gripper.speed = afterValue;
      // console.log(`move Arrow = beforeValue = ${beforeValue}, afterValue = ${afterValue}, adding = ${adding}`);
      this.setGripperSpeed();
    },
    moveGripperPosArrow(isAdd, numberIndex) {
      // console.log(`moveArrow isAdd = ${isAdd}, numberIndex = ${numberIndex}`);
      let params = this.gripper.pos;
      const beforeValue = Number(params);
      // const adding = numberIndex === 2 ? 1 : 0.1;
      let adding = 0;
      if (numberIndex === 3) {
        adding = 100;
      }
      if (numberIndex === 4) {
        adding = 10;
      }
      if (numberIndex === 5) {
        adding = 1;
      }
      let afterValue = isAdd === true ? (beforeValue + adding) : (beforeValue - adding);
      // console.log(`move Arrow = beforeValue = ${beforeValue}, afterValue = ${afterValue}, isADD = ${isAdd}`);
      afterValue = Math.max(Number(afterValue), -200);
      afterValue = Math.min(Number(afterValue), 1000);
      this.gripper.pos = afterValue;
      // console.log(`move Arrow = beforeValue = ${beforeValue}, afterValue = ${afterValue}, adding = ${adding}`);
      this.setGripperPos();
    },

    showInputDotValueGripperSpeed(value, index) {
      const str = `00000${Math.round(Math.abs(Number(value)))}`.slice(-5);
      // console.log(' str[index]', str, value);
      return str[index];
    },
    showInputDotValueGripperPos(value, index) {
      const str = `000${Math.round(Math.abs(Number(value)))}`.slice(-4);
      // console.log(' str[index1]', str, value);
      return str[index];
    },

    setEnable() {
      window.CommandsRobotSocket.setGripperEnable(this.model.robot.state.local.gripper.enable, (dict) => {
        if (dict.code === 0) {
          this.model.robot.state.remote.gripper.enable = this.model.robot.state.local.gripper.enable;
          if (this.model.robot.state.local.gripper.enable) {
            window.CommandsRobotSocket.getGripperPosition((dict) => {
              if (dict.code === 0) {
                this.model.robot.state.local.gripper.pos = dict.data;
                this.model.robot.state.remote.gripper.pos = this.model.robot.state.local.gripper.pos;
              }
            }); 
          }
        }
        else {
          this.model.robot.state.local.gripper.enable = this.model.robot.state.remote.gripper.enable;
        }
      });
       console.log('online', this.stateOnline, 'enable', this.model.robot.state.remote.gripper.enable);
    },
    setGripperSpeed(evt) {
      // console.log('gripper speed:', this.model.robot.state.remote.gripper.speed);
      window.CommandsRobotSocket.setGripperSpeed(this.model.robot.state.local.gripper.speed, (dict) => {
        if (dict.code === 0) {
          this.model.robot.state.remote.gripper.speed = this.model.robot.state.local.gripper.speed;
        }
        else {
          this.model.robot.state.local.gripper.speed = this.model.robot.state.remote.gripper.speed;
        }
      });
    },
    setGripperPos(evt, callback) {
      // console.log('gripper pos:', this.model.robot.state.remote.gripper.pos);
      window.CommandsRobotSocket.setGripperPosition(this.model.robot.state.local.gripper.pos, this.model.robot.state.local.gripper.speed, true, (dict) => {
        if ([0].includes(dict.code)) {
          this.model.robot.state.remote.gripper.pos = this.model.robot.state.local.gripper.pos;
          this.model.robot.state.remote.gripper.speed = this.model.robot.state.local.gripper.speed;
          // if (callback) {
          //   callback(dict);
          // }
        }
        else {
          this.model.robot.state.local.gripper.pos = this.model.robot.state.remote.gripper.pos;
          this.model.robot.state.remote.gripper.speed = this.model.robot.state.local.gripper.speed;
        }
      });
    },

  },
  components: {
  },
  computed: {
    stateOnline() {
      return this.$store.state.robot.info.online === true;
    },
    gripper() {
      return this.model.robot.state.local.gripper;
    },

  },
  watch: {
  },
}
</script>

<style scoped lang="scss">
.config-wrapper {
  /*position: absolute;*/
  /*width: 450px;*/
  /*height: 50px;*/
  /*right: 350px;*/
  color: #555;
  .range-speed {
    position: relative;
    // margin-bottom: 10px;
    // border-bottom: 1px solid rgba(128, 128, 128, 0.4);
    padding: 20px 10px;
    /*width: 200px;*/
    /*height: 100%;*/
    /*right: 0px;*/
  }
  .num-wrapper {
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    span {
      font-size: 12px;
    }
    .change-input-value {
      left: 272px;
      display:flex;
      bottom: 8px;
    }
  }
  .num-range-wrapper {
    position: absolute;
    left: 20px;
    bottom: -10px;
    width: 248px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }
  input[type=range] {
    position: absolute;
    left: 20px;

    width: 246px;
    height: 2px;
    background: #878787;
    opacity: 1;
    border-radius: 150px;
    cursor: pointer;
    outline: none;
  }
  // input[type=range]::-webkit-slider-thumb {
  //   width: 32px;
  //   height: 32px;
  //   -webkit-appearance: none;
  //   border: none;
  //   border-radius: 50%;
  //   background: #999;
  //   // background: rgba(225,225,225,0.9);
  //   /*box-shadow: 0 0 8px 0 gray;*/
  // }
  input[type=range]::-webkit-slider-thumb {
    width: 12px;
    height: 12px;
    -webkit-appearance: none;
    border: none;
    border-radius: 50%;
    // background: rgba(225,225,225,0.9);
    background: #aaa;
    /*box-shadow: 0 0 8px 0 gray;*/
  }
  input:disabled {
    cursor:not-allowed;
  }
  .on-line-range {
    // background: #69f !important;
  }
  .on-line-range::-webkit-slider-thumb {
    width: 25px !important;
    height: 25px !important;
    background: #999 !important;
  }
  input:disabled {
    cursor:not-allowed;
  }
  .com-font-style {
    font-family: 'Gotham-Book';
    font-size: 12px;
    text-align: left;
  }
  .speed-location {
    /*position: absolute;*/
    /*right: 0px;*/
    /*top: 3px;*/
    background: #7b7b7b;
    // color: #fff;
    padding: 2px;
    border-radius: 4px;
  }
}
.disabled { pointer-events: none; }

.input-per-number-style {
  font-family: 'Gotham-Medium';
  font-size: 12px;
  text-align: center;
  width: 25px;
  height: 25px;
  // color: white;
  /* background: gray; */
  line-height: 25px;
  margin-left: 2px;
}
.border-number {
  // border: 1px solid #a3a3a3;
  border: 1px solid #aaa;
  border-radius: 2px;
}
.border-number-transparent {
  border: 1px solid transparent;
  border-radius: 2px;
}
.selected-cell-bg {
  // background: #a3a3a3;
  background: #aaa;
}
</style>
