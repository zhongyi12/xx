<template lang="html">
  <div class="start-info-field">
    <!-- times -->
    <div class="setting-times-line">
      <span class="left-title">
        {{ $t('times') }}
      </span>
      <input
        v-model="model.localTeach.runTimes"
        type="range"
        min="1"
        max="9999"
        value="1"
        class="slider-control">
      <div class="arrow-size" style="right:60px;" @click="moveArrow(false, 'times')">
        <div class="arrow arrow-left"></div>
      </div>
      <div class="arrow-size" style="right:0px;" @click="moveArrow(true, 'times')">
        <div class="arrow arrow-right"></div>
      </div>
      <input
        v-model="model.localTeach.runTimes"
        disabled
        class="slider-show-input" />
    </div>
  </div>
</template>
<script>

export default {
  name: 'RunSetting',
  props: ['file', 'index'],
  i18n: {
    messages: {
      en: {
        times: 'Times',
        speed: 'Speed',
      },
      cn: {
        times: '次数',
        speed: '速度',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      oldRunTimes: 0,
      oldRunSpeed: 0,
    };
  },
  mounted() {
    this.model.robot.state.local.speed = this.model.robot.state.remote.speed;
    this.model.robot.state.local.acceleration = this.model.robot.state.remote.acceleration;
  },
  methods: {
    moveArrow(isAdd, location) {
      switch (location) {
        default:
          break;
        case 'times': {
          let runTimes = Number(this.model.localTeach.runTimes);
          runTimes = isAdd ? (runTimes + 1) : (runTimes - 1);
          runTimes = Math.max(1, runTimes);
          runTimes = Math.min(9999, runTimes);
          this.model.localTeach.runTimes = runTimes;
          break;
        }
        case 'speed': {
          let speed = Number(this.model.robot.state.local.speed);
          speed = isAdd ? (speed + 1) : (speed - 1);
          const min = this.model.robot.state.info.xarm_limit_velo[0];
          const max = this.model.robot.state.info.xarm_limit_velo[1];
          speed = Math.max(min, speed);
          speed = Math.min(max, speed);
          this.model.robot.state.local.speed = speed;
        }
      }
      // this.sendCmd();
    },
    sendCmd() {
      window.CommandsRobotSocket.setParamsSpeedAcceleration((dict) => { console.log(dict) });
    },
  },
  beforeDestroy() {
  },
  components: {
  },
  computed: {
  },
};

</script>
<style lang="scss" scoped>
* {
  outline: none;
}
.start-info-field {
  position: absolute;
  height: 30px;
  width: 250px;
  // bottom: 84px;
  // bottom: 100px;
  // background: yellow;
  // border: 1px solid #D7D7D7;
}
input[type=range] {
  cursor: pointer;
}
input:disabled {
  cursor:not-allowed;
}
input[type=range]:focus {
  outline: none;
  background: transparent;
}
.left-title {
  position: absolute;
  width: 25%;
  height: 30px;
  left: 0px;
  line-height: 30px;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  color: #555555;
  letter-spacing: -0.43px;
  text-align: center;
}
.slider-control {
  position: absolute;
  // appearance: slider-vertical; // abandoned, can not set width with css
  /* width: 120%; */
  left: 65px;
  // right: 0px;
  // margin: auto;
  // top: 180px;
  top: 0px;
  bottom: 0px;
  margin: auto;
  width: 80px;
  height: 10px;
  // background: #F2F4F7;
  background: white;
  opacity: 1;
  // transform: rotate(-90deg);
  border-radius: 100px;
  // border: #5A93D7 solid 1px;
  cursor: pointer;
  outline: none;
}
.slider-control::-webkit-slider-thumb {
  width: 20px;
  height: 20px;
  background-image: url('./../../assets/img/control/btn_slide.svg');
  background-size: 30px 30px;
  background-repeat: no-repeat;
  background-position: center;
  -webkit-appearance: none;
  border: none;
  border-radius: 50%;
  outline: none;
//  background: #5A93D7;
  // box-shadow: 0 0 8px 0 rgba(45,73,67,0.17);
  box-shadow: darkgrey 0px 0px 2px;
}
.setting-times-line {
  position: absolute;
  width: 100%;
  height: 30px;
  // background: yellow;
  // top: 42px;
}
.slider-show-input {
  position: absolute;
  width: 35px;
  height: 42px;
  // top: 175px;
  top: 0px;
  bottom: 0px;
  margin: auto;
  right: 30px;
  // background: #FDFDFD;
  // border: 1px solid #D7D7D7;
  background: transparent;
  border: 0;
  border-radius: 2px;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  text-align: center;
  // color: #4B4B4B;
  // color: black;
  outline: none;
}
.slider-show-input:disabled {
  color: #000;
  // color: blue;
}
.arrow {
  position:absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin:auto;
  width:16px;
  height:24px;
  background-position: center;
  background-size: 12px 6px;
  background-repeat: no-repeat;
  transform: rotate(90deg);
  cursor: pointer;
}
.arrow-right {
  background-image: url('./../../assets/img/control/btn_toptriangle.svg');
  // right: 0px;
}
.arrow-left {
  background-image: url('./../../assets/img/control/btn_btmtriangle.svg');
  // left: 55px;
}
.arrow-size {
  position: absolute;
  width: 30px;
  height: 42px;
  top: 0px;
  bottom: 0px;
  margin: auto;
  // background: yellow;
}
</style>
