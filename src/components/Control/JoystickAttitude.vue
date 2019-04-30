<template>
  <div style="position:absolute;width:250px;height:250px;" :class="[{ comDisableEvent: isOnline === false }]">
    <CircularRing
      style="position:absolute;width:250px;height:30px;left:0;right:0;margin:auto;top:20px;"
      name='angle'
      :onmovetimer='onmovetimer'>
    </CircularRing>
    <Joystick
      style="position:absolute;width:200px;left:0;right:0;margin:auto;top:60px;"
      :labels="['+Yaw', '-Yaw', '-Pitch', '+Pitch']"
      name='orientation'
      :onmovetimer='onmovetimer'
      :diameter=200
      :ballDiameter=60
      :left=0
      :top=0>
    </Joystick>
    <span class="position-absolute label" style="top:35px;left;">
      -Roll
    </span>
    <span class="position-absolute label" style="top:35px;left:230px;">
      +Roll
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
    };
  },
  mounted() {
  },
  methods: {
  },
  beforeDestroy() {
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
.label {
  width: 40px;
  height: 20px;
  line-height: 20px;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  text-align:left;
}
</style>
