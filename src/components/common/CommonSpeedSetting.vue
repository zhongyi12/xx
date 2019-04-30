<template>
  <!-- speed -->
  <div class="config-wrapper" :style="{'opacity': stateOnline ? 1 : 0.5}">
    <div class="range-speed">
      <div class="num-wrapper">
        <span class="com-font-style speed-title">{{ $t('speed') }}{{ isTcpTab ? '(mm/s)' : '(°/s)' }}</span> 
        <!-- <span class="com-font-style speed-location" v-text="speed"></span> -->
        <div class="position-absolute change-input-value">
          <template v-for="index in [0, 1, 2, 3, 4, 5]">
            <div class="per-num-style" @click="changeSpeedIndex(index)" :key="index" :class="{'disabled': stateOnline === false}">
              <div class="input-per-number-style border-number" v-if="index === 0"  @click="moveSpeedArrow(false, controlSpeedNum)"><i class="el-icon-caret-left"></i></div>
              <!-- <div class="input-per-number-style" v-if="index === 1" >
                {{ speed > 0 ? '+' : '-' }}
              </div> -->
              <div class="input-per-number-style border-number" v-if="index === 2" :class="{ 'selected-cell-bg': controlSpeedNum === 2 }">
                {{ showInputDotValueSpeed(speed, 0) }} 
              </div>
              <div class="input-per-number-style border-number" v-if="index === 3" :class="{ 'selected-cell-bg': controlSpeedNum === 3 }">
                {{ showInputDotValueSpeed(speed, 1) }} 
              </div>
              <div class="input-per-number-style border-number" v-if="index === 4" :class="{ 'selected-cell-bg': controlSpeedNum === 4 }">
                {{ showInputDotValueSpeed(speed, 2) }} 
              </div>
             
              <div class="input-per-number-style border-number" v-if="index === 5"  @click="moveSpeedArrow(true, controlSpeedNum)"><i class="el-icon-caret-right"></i></div>
            </div>
          </template>
        </div>
      </div>
      <input 
        type="range" 
        :disabled="stateOnline === false" 
        :class="{'on-line-range': stateOnline === true}" 
        v-model="speed" 
        @change="setSpeed"
        :step="1" 
        :max="limit_mvvelo[1]" 
        :min="limit_mvvelo[0]">
      <div class="range-wrapper">
        <span class="com-font-style remote-value">{{ limit_mvvelo[0] }}</span>
        <span class="com-font-style remote-value">{{ limit_mvvelo[1] }}</span>
      </div>
    </div>
    <div class="range-speed">
      <div class="num-wrapper">
        <span class="com-font-style speed-title">{{ $t('acceleration') }}{{ isTcpTab ? '(mm/s²)' : '(°/s²)' }}</span> 
        <!-- <span class="com-font-style speed-location" v-text="acceleration"></span> -->
         <div class="position-absolute change-input-value">
          <template v-for="index in [0, 1, 2, 3, 4, 5, 6, 7]">
            <div class="per-num-style" @click="changeAccelerationIndex(index)" :key="index" :class="{'disabled': stateOnline === false}">
              <div class="input-per-number-style border-number" v-if="index === 0"  @click="moveAccelerationArrow(false, controlAccelerationNum)"><i class="el-icon-caret-left"></i></div>
              <!-- <div class="input-per-number-style" v-if="index === 1" >
                {{ speed > 0 ? '+' : '-' }}
              </div> -->
              <div class="input-per-number-style border-number" v-if="index === 2" :class="{ 'selected-cell-bg': controlAccelerationNum === 2 }">
                {{ showInputDotValueAcceleration(acceleration, 0) }} 
              </div>
              <div class="input-per-number-style border-number" v-if="index === 3" :class="{ 'selected-cell-bg': controlAccelerationNum === 3 }">
                {{ showInputDotValueAcceleration(acceleration, 1) }} 
              </div>
              <div class="input-per-number-style border-number" v-if="index === 4" :class="{ 'selected-cell-bg': controlAccelerationNum === 4 }">
                {{ showInputDotValueAcceleration(acceleration, 2) }} 
              </div>
             <div class="input-per-number-style border-number" v-if="index === 5" :class="{ 'selected-cell-bg': controlAccelerationNum === 5 }">
                {{ showInputDotValueAcceleration(acceleration, 3) }} 
              </div>
              <div class="input-per-number-style border-number" v-if="index === 6" :class="{ 'selected-cell-bg': controlAccelerationNum === 6 }">
                {{ showInputDotValueAcceleration(acceleration, 4) }} 
              </div>
              <div class="input-per-number-style border-number" v-if="index === 7"  @click="moveAccelerationArrow(true, controlAccelerationNum)"><i class="el-icon-caret-right"></i></div>
            </div>
          </template>
        </div>
      </div>
      <input type="range" :disabled="stateOnline === false" :class="{'on-line-range': stateOnline === true}" v-model="acceleration" @change="setAcceleration" :step="1" :max="limit_acc[1]" :min="limit_acc[0]">
      <div class="range-wrapper">
        <span class="com-font-style remote-value">{{ limit_acc[0] }}</span>
        <span class="com-font-style remote-value">{{ limit_acc[1] }}</span>
      </div>
    </div>



    <!-- gripper -->


    

    
  </div>
</template>

<script>

export default {
  props: ['isTcpTab'],
  i18n: {
    messages: {
      en: {
        speed: 'Speed',
        acceleration: 'Acceleration',
      },
      cn: {
        speed: '速度',
        acceleration: '加速度',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      // speed: 0,
      // acceleration: 0,
      // gripper: {
      //   speed: 8000,
      //   pos: 0,
      //   enable: false,
      // },
      controlGripperSpeedNum: 6,
      controlGripperPosNum: 5,
      controlSpeedNum: 4,
      controlAccelerationNum: 6,
    }
  },
  mounted() {
    this.model.robot.state.setGripperPos = (e, callback) => {
      this.setGripperPos(e, callback);
    }
    // this.speed = this.model.robot.state.remote.speed;
    // this.acceleration = this.model.robot.state.remote.acceleration;
    this.model.robot.state.local.speed = this.model.robot.state.remote.speed;
    this.model.robot.state.local.acceleration = this.model.robot.state.remote.acceleration;
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
    changeSpeedIndex(index) {
     if ([2, 3, 4].includes(index)) {
       this.controlSpeedNum = index;
     }
    },
    changeAccelerationIndex(index) {
     if ([2,3,4,5,6].includes(index)) {
       this.controlAccelerationNum = index;
     }
    },
    moveGripperSpeedArrow(isAdd, numberIndex) {
      console.log(`moveArrow isAdd = ${isAdd}, numberIndex = ${numberIndex}`);
      let params = this.gripper.speed;
      const beforeValue = params;
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
      console.log(`move Arrow = beforeValue = ${beforeValue}, afterValue = ${afterValue}, adding = ${adding}`);
      this.setGripperSpeed();
    },
    moveGripperPosArrow(isAdd, numberIndex) {
      console.log(`moveArrow isAdd = ${isAdd}, numberIndex = ${numberIndex}`);
      let params = this.gripper.pos;
      const beforeValue = params;
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
      afterValue = Math.max(Number(afterValue), -200);
      afterValue = Math.min(Number(afterValue), 1000);
      this.gripper.pos = afterValue;
      console.log(`move Arrow = beforeValue = ${beforeValue}, afterValue = ${afterValue}, adding = ${adding}`);
      this.setGripperPos();
    },
    moveSpeedArrow(isAdd, numberIndex) {
      console.log(`moveArrow isAdd = ${isAdd}, numberIndex = ${numberIndex}`);
      let params = this.speed;
      const beforeValue = params;
      // const adding = numberIndex === 2 ? 1 : 0.1;
      let adding = 0;
      if (numberIndex === 2) {
        adding = 100;
      }
      if (numberIndex === 3) {
        adding = 10;
      }
      if (numberIndex === 4) {
        adding = 1;
      }
      let afterValue = isAdd === true ? (beforeValue + adding) : (beforeValue - adding);
      const max = this.isTcpTab ? 999 : 180;
      afterValue = Math.max(Number(afterValue), 1);
      afterValue = Math.min(Number(afterValue), max);
      this.speed = afterValue;
      console.log(`move Arrow = beforeValue = ${beforeValue}, afterValue = ${afterValue}, adding = ${adding}`);
      this.setSpeed();
    },
    moveAccelerationArrow(isAdd, numberIndex) {
      console.log(`moveArrow isAdd = ${isAdd}, numberIndex = ${numberIndex}`);
      let params = this.acceleration;
      const beforeValue = params;
      // const adding = numberIndex === 2 ? 1 : 0.1;
      let adding = 0;
      if (numberIndex === 2) {
        adding = 10000;
      }
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
      afterValue = Math.min(Number(afterValue), 50000);
      this.acceleration = afterValue;
      // console.log(`move Arrow = beforeValue = ${beforeValue}, afterValue = ${afterValue}, adding = ${adding}`);
      this.setAcceleration();
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
    showInputDotValueSpeed(value, index) {
      const str = `00${Math.round(Math.abs(Number(value)))}`.slice(-3);
      // console.log(' str[index1]', str, value);
      return str[index];
    },
   showInputDotValueAcceleration(value, index) {
      const str = `00000${Math.round(Math.abs(Number(value)))}`.slice(-5);
      // console.log(' str[index]', str, value);
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
          // if (callback) {
          //   callback(dict);
          // }
        }
        else {
          this.model.robot.state.local.gripper.pos = this.model.robot.state.remote.gripper.pos;
        }
      });
    },
    // setGripperPosCallback(evt, callback) {
    // },
    setSpeed(evt) {
      // console.log(evt.target.value);
      if (this.isTcpTab) {
        this.model.robot.state.local.speed = this.speed;
      }
      else {
        this.model.robot.state.local.angle_speed = this.speed;
      }
      // this.model.robot.state.local.speed = this.speed;
      window.CommandsRobotSocket.setParamsSpeed((dict) => { console.log('speed', dict) });
    },
    setAcceleration(evt) {
      if (this.isTcpTab) {
        this.model.robot.state.local.acceleration = this.acceleration;
      }
      else {
        this.model.robot.state.local.angle_acceleration = this.acceleration;
      }
      // this.model.robot.state.local.acceleration = this.acceleration;
      window.CommandsRobotSocket.setParamsAcceleration((dict) => { console.log(dict) });
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
    speed: {
      get() {
        if (this.isTcpTab) {
          return this.model.robot.state.local.speed;
        }
        else {
          return this.model.robot.state.local.angle_speed;
        }
        // return this.model.robot.state.local.speed;
      },
      set(value) {
        if (this.isTcpTab) {
          this.model.robot.state.local.speed = value;
        }
        else {
          this.model.robot.state.local.angle_speed = value;
        }
        // this.model.robot.state.local.speed = value;
      }
    },
    acceleration: {
      get() {
        if (this.isTcpTab) {
          return this.model.robot.state.local.acceleration;
        }
        else {
          return this.model.robot.state.local.angle_acceleration;
        }
        // return this.model.robot.state.local.acceleration;
      },
      set(value) {
        if (this.isTcpTab) {
          this.model.robot.state.local.acceleration = value;
        }
        else {
          this.model.robot.state.local.angle_acceleration = value;
        }
        // this.model.robot.state.local.acceleration = value;
      }
    },
    limit_mvvelo() {
      if (this.isTcpTab) {
        return this.model.robot.state.info.xarm_limit_velo;
      }
      else {
        return this.model.robot.state.info.xarm_limit_angle_velo;
      }
    },
    limit_acc() {
      if (this.isTcpTab) {
        return this.model.robot.state.info.xarm_limit_acc;
      }
      else {
        return this.model.robot.state.info.xarm_limit_angle_acc;
      }
    }
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
  margin-top: 20px;
  // margin-top: 50px;
  .range-speed {
    position: relative;
    // margin-bottom: 10px;
    // border-bottom: 1px solid rgba(128, 128, 128, 0.4);
    padding: 12px 10px;
    /*width: 200px;*/
    /*height: 100%;*/
    /*right: 0px;*/
  }
  .num-wrapper {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;

    span {
      font-size: 12px;
    }
    .change-input-value {
      // left: 320px;
      left: 280px;
      display:flex;
      bottom: 0px;
    }
  }
  .range-wrapper {
    // width: 260px;
    width: 248px;
    display: flex;
    justify-content: space-between;
    position: absolute;
    left: 20px;
    bottom: -8px;
  }
  input[type=range] {
    position: absolute;
    left: 20px;
    // width: 255px;
    width: 246px;
    height: 2px;
    background: #878787;
    opacity: 1;
    border-radius: 150px;
    cursor: pointer;
    outline: none;
  }
  input[type=range]::-webkit-slider-thumb {
    width: 12px;
    height: 12px;
    -webkit-appearance: none;
    border: none;
    border-radius: 50%;
    // background: rgba(225,225,225,0.9);
    background: #999;
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
    background: #aaa !important;
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
  .speed-title {
    /*position: absolute;*/
    /*left: 0px;*/
    /*bottom:0px;*/
    // padding-bottom: 12px;
  }
  .remote-value {
    /*position: absolute;*/
    /*right: 0px;*/
  }
}
.disabled { pointer-events: none; }
.per-number-style {
  // width: 20px;
  // height: 30px; 
  // border-radius: 2px;
}
.input-per-number-style {
  font-family: 'Gotham-Medium';
  font-size: 12px;
  text-align: center;
  width: 25px;
  height: 25px;
  // color: white;
  /* background: gray; */
  line-height: 25px;
}
.border-number {
  // border: 1px solid #a3a3a3;
  border: 1px solid #aaa;
  border-radius: 2px;
  margin: 0 5px 0 0;
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
