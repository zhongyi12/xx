<template>
  <div id="root-angle">
    <canvas
      id="angle-canvas"
      width="250"
      height="80">
    </canvas>
    <div style="position:absolute;top:0px;width:250px;height:80px;z-index:2000;" ref='angle'>
    </div>
  </div>
</template>

<script>

const cx = 130;
const cy = 200;
const sRadius = 180;
const strokewidth = 20;
// const thumbAngle = Math.PI / 100;
const value_from = (Math.PI * 4) / 3;
const value_to = (Math.PI * 5) / 3;
let mouseX;
let mouseY;
const indicatorSize = 40;

export default {
  props: ['name', 'onmovetimer'],
  data() {
    return {
      model: window.GlobalUtil.model,
      moveStr: '',
      counter: 0,
      // animation: true,
      radianAngle: -(Math.PI / 2),
      maxAngle: Math.PI / -3.0,
      minAngle: -2.0 * Math.PI / 3.0,
      isTouch: false,
      isOnBall: false,
      sCanvas: null,
      sCtx: null,
      indicator: null,
    }
  },
  mounted() {
    this.model.robot.state.restCtrls[this.name] = () => {
      this.onend(null);
    };
    this.initCanvas();

    this.isTouch = !!('ontouchstart' in window);

    if (this.isTouch === false) {
      window.addEventListener('mousedown', this.mousedown, false);
      window.addEventListener('mouseup', this.mouseup, false);
    }
    else {
      const rootAngle = this.$refs.angle;
      rootAngle.addEventListener('touchstart', this.touchstart, false);
      rootAngle.addEventListener('touchend', this.touchend, false);
    }
  },
  beforeDestroy() {
    console.log('before destroy');
    this.model.robot.state.restCtrls[this.name] = null;
    window.removeEventListener('mousedown', this.mousedown);
    window.removeEventListener('mousemove', this.winmousemove);
    window.removeEventListener('mouseup', this.mouseup);
    const rootAngle = this.$refs.angle;
    rootAngle.removeEventListener('touchstart', this.touchstart);
    rootAngle.removeEventListener('touchmove', this.touchmove);
    rootAngle.removeEventListener('touchend', this.touchend);
  },
  methods: {
    initCanvas() {
      const sCanvas = document.getElementById('angle-canvas');
      this.sCanvas = sCanvas;

      const sCtx = sCanvas.getContext('2d');
      this.sCtx = sCtx;

      sCtx.lineCap = 'round';
      sCtx.font = '24px arial';
      sCtx.lineWidth = 3;

      const indicator = new Image();
      this.indicator = indicator;
      indicator.src = require('@/assets/img/control/btn_slide.svg');

      if (indicator.complete) {
        this.drawAngle();
        // this.animation = false;
      }
      else {
        indicator.onload = () => {
          this.drawAngle();
          // this.animation = false;
        };
      }
    },
    drawAngle() { // draw uarm angle select
      const sCanvas = this.sCanvas;
      const sCtx = this.sCtx;
      const indicator = this.indicator;
      const self = this;

      // clear
      sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
      sCtx.save();
      // circle
      sCtx.beginPath();
      sCtx.arc(cx, cy, sRadius, value_from, value_to);
//      sCtx.strokeStyle = '#5A93D7';
      sCtx.lineWidth = strokewidth - 2;
      sCtx.strokeStyle = '#000000';
      sCtx.stroke();
      // circle border
      sCtx.beginPath();
      sCtx.arc(cx, cy, sRadius, value_from, value_to);
      // sCtx.strokeStyle = '#aeaeae'; // 'gray'; // '#ffffff';
      sCtx.strokeStyle = '#ffffff';
      sCtx.lineWidth = strokewidth - 3;
      sCtx.stroke();
      // indicator
      let x;
      let y;
      if (self.radianAngle >= ((-2 * Math.PI) / 3) && self.radianAngle <= (Math.PI / -2)) {
        const thelta = self.radianAngle + Math.PI;
        x = cx - (sRadius * Math.cos(thelta));
        y = cy - (sRadius * Math.sin(thelta));
      }
      else if (self.radianAngle <= (Math.PI / -3) && self.radianAngle > (Math.PI / -2)) {
        const thelta = -self.radianAngle;
        x = cx + (sRadius * Math.cos(thelta));
        y = cy - (sRadius * Math.sin(thelta));
      }
      x -= (indicatorSize / 2);
      y -= (indicatorSize / 2);
      sCtx.drawImage(indicator, x, y, indicatorSize, indicatorSize);
    },
    resetYaw() {
      this.radianAngle = Math.PI / -2;
      console.log('cleared');
    },
    setYaw() {
    },
    //
    isClickInPoint(event) {
      const touchPoint = this.getClientPoint(event);
      const rootAngle = this.$refs.angle;
      if (!rootAngle) {
        return false;
      }
      const clientLeft = rootAngle.getBoundingClientRect().left;
      const clientTop = rootAngle.getBoundingClientRect().top;
      const clientWidth = rootAngle.getBoundingClientRect().width;
      const clientHeight = rootAngle.getBoundingClientRect().height;

      const centerPointX = clientLeft + clientWidth * 0.5;
      const centerPointY = clientTop + clientHeight * 0.5;

      const xRange = 20;
      const limitX = (touchPoint.x > centerPointX - xRange) && (touchPoint.x < centerPointX + xRange);
      const limitY = (touchPoint.y > clientTop) && (touchPoint.y < centerPointY);
      return (limitX === true && limitY === true);
    },
    //
    getTouchClientPoint(event) {
      const clientX = event.changedTouches[0].clientX;
      const clientY = event.changedTouches[0].clientY;
      return { x: clientX, y: clientY };
    },
    getMouseClientPoint(event) {
      const clientX = event.clientX;
      const clientY = event.clientY;
      return { x: clientX, y: clientY };
    },
    getClientPoint(event) {
      let point;
      if (this.isTouch === true) {
        point = this.getTouchClientPoint(event);
      }
      else {
        point = this.getMouseClientPoint(event);
      }
      return point;
    },
    //
    touchstart($event) {
      const touchPoint = this.getClientPoint($event);
      const isClick = this.isClickInPoint($event);
      if (isClick === true) {
        const rootAngle = this.$refs.angle;
        rootAngle.addEventListener('touchmove', this.touchmove, false);
        this.onstart(touchPoint);
      }
    },
    touchmove($event) {
      const touchPoint = this.getClientPoint($event);
      this.onmove(touchPoint);
    },
    touchend($event) {
      const touchPoint = this.getClientPoint($event);
      const rootAngle = this.$refs.angle;
      rootAngle.removeEventListener('touchmove', this.touchmove);
      this.onend(touchPoint);
    },
    //
    mousedown($event) {
      const touchPoint = this.getClientPoint($event);
      const isClick = this.isClickInPoint($event);
      if (isClick === true) {
        window.addEventListener('mousemove', this.winmousemove, false);
        this.onstart(touchPoint);
      }
      else {
        console.log('no in limit');
      }
    },
    mouseup() {
      window.removeEventListener('mousemove', this.winmousemove);
      const event = window.event;
      const touchPoint = this.getClientPoint(event);
      this.onend(touchPoint);
    },
    winmousemove() {
      const event = window.event;
      const touchPoint = this.getClientPoint(event);
      this.onmove(touchPoint);
    },
    //
    onstart(point) {
      this.isOnBall = true;
      let curIntervals = this.model.robot.state.intervalInfo.curIntervals;
      curIntervals.push(this.name);
      curIntervals = Array.from(new Set(curIntervals));
      console.log(curIntervals);

      this.moveStr = point;
      this.lastPanPoint = point;
      this.model.robot.state.func.initInterval(() => {
        this.onmovetimer('move');
      });
      console.log(`on start = ${JSON.stringify(point)}`);
    },
    onmove(point) {
      this.moveStr = point;
      mouseX = parseInt(point.x - this.sCanvas.getBoundingClientRect().left);
      mouseY = parseInt(point.y - this.sCanvas.getBoundingClientRect().top);
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      let newAngle = Math.atan2(dy, dx);
      newAngle = Math.max(this.minAngle, newAngle);
      newAngle = Math.min(this.maxAngle, newAngle);
      this.radianAngle = newAngle;
      this.setYaw();
      this.drawAngle();

      const percent = (this.radianAngle - this.minAngle) / (this.maxAngle - this.minAngle);
      this.model.robot.state.intervalInfo[this.name].percent = percent;
    },
    onend(point) {
      if (this.isOnBall === false) {
        return;
      }
      this.isOnBall = false;
      let curIntervals = this.model.robot.state.intervalInfo.curIntervals;
      curIntervals.splice(curIntervals.findIndex(item => item === this.name), 1)
      curIntervals = Array.from(new Set(curIntervals));
      console.log(curIntervals);

      this.moveStr = point;
      this.counter = 0;
      this.resetYaw();
      this.drawAngle();
      // window.clearInterval(positionInterval);
      console.log(`on end = ${JSON.stringify(point)}`);
      // const percent = (this.radianAngle - this.minAngle) / (this.maxAngle - this.minAngle);
      this.model.robot.state.intervalInfo[this.name].percent = 0.5;
      this.onmovetimer('end');
    },
  },
  components: {
  },
  computed: {
  },
}
</script>

<style scoped>

</style>
