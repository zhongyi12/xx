<template>
  <div id="root-joystick">
    <div
      class='joystick-bg'
      ref='joystick'>
      <div
        ref='inner'
        class="inner-joystick-bg">
      </div>
      <div
        ref='innerinner'
        class="inner-inner-joystick-bg">
        <span class="com-absolute-left-right-center label" style="top:0px;">{{ labels[0] }}</span>
        <span class="com-absolute-left-right-center label" style="bottom:0px;">{{ labels[1] }}</span>
        <span class="com-absolute-top-bottom-center label" style="left:0px;">{{ labels[2] }}</span>
        <span class="com-absolute-top-bottom-center label" style="right:0px;">{{ labels[3] }}</span>
      </div>
      <div
        ref='ball'
        class="ball-bg">
      </div>
    </div>
    <!-- <div style="position:absolute;background:lightgreen;width:300px;height:20px;left:0px;top:-100px;z-index:2000;">
      -- {{ moveStr }}
    </div> -->
  </div>
</template>

<script>

export default {
  // touch mouse
  props: ['diameter', 'ballDiameter', 'left', 'top', 'name', 'onmovetimer', 'labels'],
  data() {
    return {
      model: window.GlobalUtil.model,
      moveStr: '',
      counter: 0,
      isTouch: false,
      degree: 0,
      percent: 0.0,
      lastPanPoint: { x: 0, y: 0 },
      ballLeft: 0,
      ballTop: 0,
      isOnBall: false,
    }
  },
  mounted() {
    this.model.robot.state.restCtrls[this.name] = () => {
      this.onend(null);
    };
    const isTouch = !!('ontouchstart' in window);
    this.isTouch = isTouch;

    this.diameter = Number(this.diameter || 160);
    this.$refs.joystick.style.width = `${this.diameter}px`;
    this.$refs.joystick.style.height = `${this.diameter}px`;
    this.$refs.joystick.style.borderRadius = `${this.diameter * 0.5}px`;

    if (this.left) {
      this.left = Number(this.left || 0);
      this.$refs.joystick.style.left = `${this.left}px`;
    }
    if (this.top) {
      this.top = Number(this.top || 0);
      this.$refs.joystick.style.top = `${this.top}px`;
    }

    this.ballDiameter = Number(this.ballDiameter || 60);
    this.$refs.ball.style.width = `${this.ballDiameter}px`;
    this.$refs.ball.style.height = `${this.ballDiameter}px`;
    this.$refs.ball.style.borderRadius = `${this.ballDiameter * 0.5}px`;

    const innerDiameter = this.diameter * 0.8;
    this.$refs.inner.style.width = `${innerDiameter}px`;
    this.$refs.inner.style.height = `${innerDiameter}px`;
    this.$refs.inner.style.borderRadius = `${innerDiameter * 0.5}px`;

    const innerInnerDiameter = innerDiameter * 0.95;
    this.$refs.innerinner.style.width = `${innerInnerDiameter}px`;
    this.$refs.innerinner.style.height = `${innerInnerDiameter}px`;
    this.$refs.innerinner.style.borderRadius = `${innerInnerDiameter * 0.5}px`;

    this.initBallLocation();

    if (this.isTouch === false) {
      window.addEventListener('mouseup', this.mouseup, false);
      //
      this.$refs.ball.addEventListener('mousedown', this.mousedown, false);
    }
    else {
      this.$refs.ball.addEventListener('touchstart', this.touchstart, false);
      this.$refs.ball.addEventListener('touchmove', this.touchmove, false);
      this.$refs.ball.addEventListener('touchend', this.touchend, false);
    }
  },
  beforeDestroy() {
    this.model.robot.state.restCtrls[this.name] = null;
    // if (this.isTouch === false) {
    // }
    window.removeEventListener('mousemove', this.winmousemove);
    window.removeEventListener('mouseup', this.mouseup);
    this.$refs.ball.removeEventListener('mousedown', this.mousedown);
    this.$refs.ball.addEventListener('touchstart', this.touchstart);
    this.$refs.ball.addEventListener('touchmove', this.touchmove);
    this.$refs.ball.addEventListener('touchend', this.touchend);
  },
  methods: {
    getClientPoint(event) {
      let point;
      if (this.isTouch === true) {
        point = this.getTouchClientPoint(event);
      }
      else {
        point = this.getMouseClientPoint(event);
      }
      const ballLeft = this.$refs.ball.offsetLeft;
      const ballTop = this.$refs.ball.offsetTop;

      const x = point.x - this.left - ballLeft;
      const y = point.y - this.top - ballTop;
      return { x: x, y: y };
    },
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
    initBallLocation() {
      const centerLeftTop = (this.diameter - this.ballDiameter) * 0.5;
      this.$refs.ball.style.left = `${centerLeftTop}px`;
      this.$refs.ball.style.top = `${centerLeftTop}px`;
    },
    //
    touchstart($event) {
      const touchPoint = this.getClientPoint($event);
      // const moveStr = `touch start = ${touchPoint.x}, ${touchPoint.y}`;
      // this.moveStr = moveStr;
      // console.log(moveStr);
      this.onstart(touchPoint);
    },
    touchmove($event) {
      const touchPoint = this.getClientPoint($event);
      // const moveStr = `touch move = ${touchPoint.x}, ${touchPoint.y}`;
      // console.log(moveStr);
      // this.moveStr = moveStr;
      this.onmove(touchPoint);
      // this.updateBallLocation($event);
    },
    touchend($event) {
      const touchPoint = this.getClientPoint($event);
      // const moveStr = `touch end = ${touchPoint.x}, ${touchPoint.y}`;
      // console.log(moveStr);
      this.onend(touchPoint);
    },
    //
    mousedown($event) {
      window.addEventListener('mousemove', this.winmousemove, false);
      const touchPoint = this.getClientPoint($event);
      // const moveStr = `mouse down = ${touchPoint.x}, ${touchPoint.y}`;
      // console.log(moveStr);
      this.onstart(touchPoint);
    },
    mouseup() {
      window.removeEventListener('mousemove', this.winmousemove);
      const event = window.event;
      const touchPoint = this.getClientPoint(event);
      // const moveStr = `mouse up = ${touchPoint.x}, ${touchPoint.y}`;
      // console.log(moveStr);
      this.onend(touchPoint);
    },
    winmousemove() {
      const event = window.event;
      const touchPoint = this.getClientPoint(event);
      // const clientX = touchPoint.x;
      // const clientY = touchPoint.y;
      // const moveStr = `clientX = ${clientX}, clientY = ${clientY}`;
      // console.log(moveStr);
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
      // this.updateBallLocation(point);
      this.lastPanPoint = point;
      this.onmovetimer('start');
      this.model.robot.state.func.initInterval(() => {
        this.onmovetimer('move');
      });
    },
    onmove(point) {
      this.moveStr = point;
      // this.updateBallLocation(point);
      const diffX = point.x - this.lastPanPoint.x;
      const diffY = point.y - this.lastPanPoint.y;
      const ballLeft = this.$refs.ball.offsetLeft;
      const ballTop = this.$refs.ball.offsetTop;

      const joystick_r = this.diameter * 0.5;
      const ball_r = this.ballDiameter * 0.5;

      const curBallCenter = { x: ballLeft + this.ballDiameter * 0.5, y: ballTop + this.ballDiameter * 0.5 };

      const targetCenterPoint = { x: curBallCenter.x + diffX - joystick_r, y: curBallCenter.y + diffY - joystick_r };

      const xx = Math.abs(targetCenterPoint.x);
      const yy = Math.abs(targetCenterPoint.y);

      const targetR = Math.sqrt(xx * xx + yy * yy);
      const limitR = joystick_r - ball_r;

      let d_rotate_angle = Math.atan2(yy, xx);
      if (targetCenterPoint.x >= 0) {
        if (targetCenterPoint.y <= 0) {
          // d_rotate_angle = d_rotate_angle;
        }
        else {
          d_rotate_angle = 2 * Math.PI - d_rotate_angle;
        }
      }
      else {
        if (targetCenterPoint.y <= 0) {
          d_rotate_angle = Math.PI - d_rotate_angle;
        }
        else {
          d_rotate_angle = Math.PI + d_rotate_angle;
        }
      }

      if (targetR > limitR) {
        const x = limitR * Math.cos(d_rotate_angle);
        const y = -limitR * Math.sin(d_rotate_angle);
        targetCenterPoint.x = x;
        targetCenterPoint.y = y;
        this.percent = 1.0;
      }
      else {
        this.percent = targetR / limitR;
      }

      this.degree = 180.0 * d_rotate_angle / Math.PI;

      const targetLeft = targetCenterPoint.x + this.diameter * 0.5 - this.ballDiameter * 0.5;
      const targetTop = targetCenterPoint.y + this.diameter * 0.5 - this.ballDiameter * 0.5;

      this.$refs.ball.style.left = `${targetLeft}px`;
      this.$refs.ball.style.top = `${targetTop}px`;

      // set value to global
      this.model.robot.state.intervalInfo[this.name].degree = this.degree;
      this.model.robot.state.intervalInfo[this.name].percent = this.percent;
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
      this.initBallLocation();
      // window.clearInterval(this.model.robot.state.positionInterval);
      // this.model.robot.state.positionInterval = null;
      this.counter = 0;
      this.model.robot.state.intervalInfo[this.name].degree = 0;
      this.model.robot.state.intervalInfo[this.name].percent = 0;
      this.onmovetimer('end');
    },
    // updateBallLocation(event) {
    //   // const centerLeftTop = (this.diameter - this.ballDiameter) * 0.5;
    //   const clientX = event.changedTouches[0].clientX;
    //   const clientY = event.changedTouches[0].clientY;
    //   const left = clientX - this.ballDiameter * 0.5;
    //   const top = clientY - this.ballDiameter * 0.5;
    //   this.$refs.ball.style.left = `${left}px`;
    //   this.$refs.ball.style.top = `${top}px`;
    // },
  },
  components: {
  },
  computed: {
  },
}
</script>

<style scoped>
.joystick-bg {
  position:absolute;
  background: transparent;
}
.inner-joystick-bg {
  position: absolute;
  /* border: 1px solid white; */
  border: 1px solid gray;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  margin: auto;
}
.inner-inner-joystick-bg {
  position: absolute;
  background: white;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  margin: auto;
}
.ball-bg {
  position:absolute;
  background: white;
  box-shadow: darkgrey 0px 0px 5px;
  left: 0px;
  top: 0px;
  z-index: 100;
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
