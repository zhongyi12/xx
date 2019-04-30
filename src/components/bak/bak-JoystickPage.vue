
<template>
  <div id="root-joystick-page" class="noselected">
    <router-link :to="{ name: 'Home'}">
      <button>Back</button>
    </router-link>
    {{ moveStr }}

    <Joystick
      :diameter=300
      :ballDiameter=80
      :left=100
      :top=150>
    </Joystick>

    <Joystick
      :diameter=200
      :ballDiameter=50
      :left=500
      :top=200>
    </Joystick>
  </div>
</template>

<script>

import Joystick from './common/Joystick';

export default {
  data() {
    return {
      model: window.GlobalUtil.model,
      moveStr: '',
    }
  },
  methods: {
    mousemove() {
      this.moveStr = 'mouse move';
      console.log(this.moveStr);
    },
    drop() {
      this.moveStr = 'drop';
      console.log(this.moveStr);
    },
    touchstart($event) {
      const touchPoint = this.getTouchClientPoint($event);
      this.moveStr = `touch start = ${touchPoint[0]}, ${touchPoint[1]}`;
      console.log(this.moveStr);
    },
    touchmove($event) {
      const touchPoint = this.getTouchClientPoint($event);
      this.moveStr = `touch move = ${touchPoint[0]}, ${touchPoint[1]}`;
      console.log(this.moveStr);
    },
    touchend($event) {
      const touchPoint = this.getTouchClientPoint($event);
      this.moveStr = `touch end = ${touchPoint[0]}, ${touchPoint[1]}`;
      console.log(this.moveStr);
    },
    getTouchClientPoint($event) {
      const clientX = $event.changedTouches[0].clientX;
      const clientY = $event.changedTouches[0].clientY;
      return [clientX, clientY];
    },
    mousedown() {
      this.moveStr = 'mouse down';
      console.log(this.moveStr);
    },
    mouseup() {
      this.moveStr = 'mouse up';
      console.log(this.moveStr);
    },
  },
  components: {
    Joystick,
  },
  computed: {
  },
}
</script>

<style scoped>
</style>
