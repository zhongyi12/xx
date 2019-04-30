<template>
  <div class="position-absolute" style="width:250px;height:250px;" :class="[{ comDisableEvent: isOnline === false }]">
    <input
      class="z-control"
      v-model="zPercent"
      type="range" min="0" max="100" value="50"
      @mousedown="setPositionZStart('positionZ')"
      @mousemove="setPositionZ('positionZ')"
      @mouseup="resetPositionZ('positionZ')"
      @touchstart="setPositionZStart('positionZ')"
      @touchmove="setPositionZ('positionZ')"
      @touchend="resetPositionZ('positionZ')" />
      <Joystick
        style="position:absolute;width:200px;right:0px;top:60px;"
        :labels="['+X', '-X', '+Y', '-Y']"
        name='position'
        :onmovetimer='onmovetimer'
        :diameter=200
        :ballDiameter=60
        :left=0
        :top=0>
      </Joystick>
      <span class="position-absolute label" style="top:25px;">
        +Z
      </span>
      <span class="position-absolute label" style="bottom:-10px;">
        -Z
      </span>
  </div>
</template>

<script>

import Joystick from './Joystick';
import CircularRing from './CircularRing';

export default {
  props: ['onmovetimer'],
  data() {
    return {
      model: window.GlobalUtil.model,
      zPercent: 50,
    };
  },
  mounted() {
    this.model.robot.state.restCtrls['z_ctrl'] = () => {
      this.resetPositionZ('positionZ');
    };
  },
  methods: {
    setPositionZStart(name) {
      let curIntervals = this.model.robot.state.intervalInfo.curIntervals;
      curIntervals.push(name);
      curIntervals = Array.from(new Set(curIntervals));
      console.log(curIntervals);

      this.model.robot.state.intervalInfo.positionZ.percent = this.zPercent * 0.01;
      this.model.robot.state.func.initInterval(() => {
        this.onmovetimer('move');
      });
    },
    setPositionZ() {
      this.model.robot.state.intervalInfo.positionZ.percent = this.zPercent * 0.01;
    },
    resetPositionZ(name) {
      let curIntervals = this.model.robot.state.intervalInfo.curIntervals;
      curIntervals.splice(curIntervals.findIndex(item => item === name), 1)
      curIntervals = Array.from(new Set(curIntervals));
      console.log(curIntervals);

      this.zPercent = 50;
      this.model.robot.state.intervalInfo.positionZ.percent = this.zPercent * 0.01;
      this.onmovetimer('end');
    },
  },
  beforeDestroy() {
    this.model.robot.state.restCtrls['z_ctrl'] = null;
  },
  watch: {
  },
  components: {
    Joystick,
    CircularRing,
  },
  computed: {
    isOnline() {
      return this.$store.state.robot.info.online === true;
    },
  },
};
</script>

<style scoped lang="scss">
input[type=range] {
  cursor: pointer;
}
input:disabled {
  cursor:not-allowed;
}
input[type=range]:focus {
  outline: none;
}
.z-control {
  position: absolute;
  left: -50px;
  // appearance: slider-vertical; // abandoned, can not set width with css
  width: 200px;
  height: 20px;
  background: #fff;
  opacity: 1;
  transform: rotate(-90deg);
  border-radius: 100px;
  left: -80px;
  top: 130px;
  // top: 50px;
  // bottom: 0px;
  // margin: auto;
  cursor: default;
  border: 1px solid #DCDCDC;
}
.z-control::-webkit-slider-thumb {
  width: 34px;
  height: 34px;
  background-image: url('./../../assets/img/control/btn_slide02.svg');
  background-repeat: no-repeat;
  background-position: center center;
  -webkit-appearance: none;
  border: none;
  border-radius: 50%;
  transform: rotate(-90deg);
  box-shadow: 0 0 2px 0 rgba(45,73,67,0.17);
}
.label {
  width: 40px;
  height: 20px;
  line-height: 20px;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  text-align:center;
}
</style>
