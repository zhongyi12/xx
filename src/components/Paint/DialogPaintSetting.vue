
<template>
  <div id="root-list" class="noselected">
    <!-- <div class="dialog-wrap"> -->
      <!-- <div class="dialog-cover1"></div> -->
    <div class="dialog-content">
      <div class="dialog-top">
        <span class="top-title" v-html="$t('adjustTip')">
          <!-- {{ $t('setting') }} -->
        </span>
        <div class="position-absolute dialog-close" @click="onclose">
        </div>
        <!-- <div class="dialog-close" @click="onclose">
        </div> -->
      </div>

      <!-- <div class="adjust-tips"  v-html="$t('adjustTip')">
      </div> -->
      <!-- zero -->
      <div class="setting-zero-line">
        <span class="left-title" style="top:0px;">
          {{ $t('adjustZero') }}
        </span>
        <input
          v-model="curZeroHeight"
          type="range"
          min="-100"
          max="200"
          value="180"
          @change="onZeroUp"
          class="zero-control">
        <div class="arrow-size" style="" @click="moveArrow(false, 'zero')">
          <div class="arrow arrow-left"></div>
        </div>
        <div class="arrow-size" style="" @click="moveArrow(true, 'zero')">
          <div class="arrow arrow-right"></div>
        </div>
        <input
          v-model="curZeroHeight"
          disabled
          class="zero-show-input" />
        <span style="position: absolute;left: 153px;font-size: 12px; bottom: 22px;" v-html="$t('resetTip')"></span>
      </div>
      <!-- times -->
      <div class="setting-times-line">
        <span class="left-title" style="top:0px;">
          {{ $t('times') }}
        </span>
        <input
          v-model="model.localPaintMgr.state.runTimes"
          type="range"
          min="1"
          max="9999"
          value="1"
          class="zero-control">
        <div class="arrow-size" style="" @click="moveArrow(false, 'times')">
          <div class="arrow arrow-left"></div>
        </div>
        <div class="arrow-size" style="" @click="moveArrow(true, 'times')">
          <div class="arrow arrow-right"></div>
        </div>
        <input
          v-model="model.localPaintMgr.state.runTimes"
          disabled
          class="zero-show-input" />
      </div>
      <!-- speed -->
      <div class="setting-speed-line">
        <span class="left-title" style="top:0px;">
          {{ $t('speed') }}
        </span>
        <input
          v-model="model.localPaintMgr.state.speed"
          type="range"
          :min="model.robot.state.info.xarm_limit_velo[0]"
          :max="model.robot.state.info.xarm_limit_velo[1]"
          value="model.localPaintMgr.state.speed"
          class="zero-control">
        <div class="arrow-size" style="" @click="moveArrow(false, 'speed')">
          <div class="arrow arrow-left"></div>
        </div>
        <div class="arrow-size" style="" @click="moveArrow(true, 'speed')">
          <div class="arrow arrow-right"></div>
        </div>
        <input
          v-model="model.localPaintMgr.state.speed"
          disabled
          class="zero-show-input" />
      </div>

      <div class="btn-ok cursor-pointer" @click="onok">
        {{ $t('print') }}
      </div>
    </div>
    <!-- </div> -->
  </div>

</template>
<script>

export default {
  props: ['onok', 'onclose'],
  i18n: {
    messages: {
      en: {
        setting: 'Setting',
        adjustTip: 'Please adjust the <span style="color:rgba(191,71,61,1)">zero point</span> before start draw',
        adjustZero: 'Adjust Zero Point',
        times: 'Draw Times',
        speed: 'Draw Speed',
        print: 'Start Draw',
        resetTip: `Please <span style="color:rgba(191,71,61,1)">reset</span> position in case of you can't adjust zero point.`
      },
      cn: {
        setting: '设置',
        adjustTip: '请在开始画图前调整<span style="color:rgba(191,71,61,1)">零点</span> ',
        adjustZero: '调整零点',
        times: '画图次数',
        speed: '画图速度',
        print: '开始画图',
        resetTip: '如果不能调整零点，请<span style="color:rgba(191,71,61,1)">重置</span>机械臂位置。<span style="color:rgba(191,71,61,1)">0是水平面的分界点</span>'
      },
    },
  },
  name: 'dialog-paint-setting',
  data() {
    return {
      model: window.GlobalUtil.model,
      testStr: '',
      oldRunTimes: 0,
      oldRunSpeed: 0,
    };
  },
  mounted() {
    this.oldRunTimes = this.model.localPaintMgr.state.runTimes;
    this.oldRunSpeed = this.model.localPaintMgr.state.speed;
    console.log('curZeroHeightcurZeroHeightcurZeroHeight', this.curZeroHeight);
  },
  computed: {
    curZeroHeight: {
      get() {
        const projType = window.GlobalUtil.model.localPaintMgr.curProj.projType;
        const end_type = 'pen'; // 0: 'pen', 1: 'laser',
        const zeroHeightDict = projType === 'outline' ? window.GlobalUtil.model.localPaintMgr.state.zero.outline : window.GlobalUtil.model.localPaintMgr.state.zero.grayscale;
        const zeropoint_height = end_type === 'pen' ? zeroHeightDict.pen : zeroHeightDict.laser;
        console.log(`curZeroHeight projType = ${projType}, get height = ${zeropoint_height}, zeroHeightDict = ${JSON.stringify(zeroHeightDict)}`);
        return zeropoint_height;
      },
      set(value) {
        const projType = window.GlobalUtil.model.localPaintMgr.curProj.projType;
        const end_type = 'pen'; // 0: 'pen', 1: 'laser',
        const zeroHeightDict = projType === 'outline' ? window.GlobalUtil.model.localPaintMgr.state.zero.outline : window.GlobalUtil.model.localPaintMgr.state.zero.grayscale;
        switch (end_type) {
          case 'pen':
            zeroHeightDict.pen = value;
            break;
          case 'laser':
            zeroHeightDict.laser = value;
            break;
          default:
            break;
        }
        console.log(`curZeroHeight set = ${value}, zeroHeightDict = ${JSON.stringify(zeroHeightDict)}`);
      },
    },
  },
  methods: {
    moveArrow(isAdd, location) {
      switch (location) {
        default:
          break;
        case 'zero': {
          let curZeroHeight = Number(this.curZeroHeight);
          curZeroHeight = isAdd ? (curZeroHeight + 1) : (curZeroHeight - 1);
          curZeroHeight = Math.max(-100, curZeroHeight);
          curZeroHeight = Math.min(200, curZeroHeight);
          this.curZeroHeight = curZeroHeight;
          this.onZeroUp();
          break;
        }
        case 'times': {
          let runTimes = Number(this.model.localPaintMgr.state.runTimes);
          runTimes = isAdd ? (runTimes + 1) : (runTimes - 1);
          runTimes = Math.max(1, runTimes);
          runTimes = Math.min(9999, runTimes);
          this.model.localPaintMgr.state.runTimes = runTimes;
          break;
        }
        case 'speed': {
          let speed = Number(this.model.localPaintMgr.state.speed);
          speed = isAdd ? (speed + 1) : (speed - 1);
          const min = this.model.robot.state.info.xarm_limit_velo[0];
          const max = this.model.robot.state.info.xarm_limit_velo[1];
          speed = Math.max(min, speed);
          speed = Math.min(max, speed);
          this.model.localPaintMgr.state.speed = speed;
        }
      }
    },
    checkNum() {
      setTimeout(() => {
        this.model.localPaintMgr.state.runTimes = Number(this.model.localPaintMgr.state.runTimes) || this.oldRunTimes;
        this.model.localPaintMgr.state.speed = Number(this.model.localPaintMgr.state.speed) || this.oldRunSpeed;
        this.oldRunTimes = this.model.localPaintMgr.state.runTimes;
        this.oldRunSpeed = this.model.localPaintMgr.state.speed;
      });
    },
    onZeroUp() {
      this.testStr = 'on Zero Up';
      console.log(`on Zero Up on Zero Up 1 = ${this.curZeroHeight}`);
      window.CommandsPaintSocket.setZeroHeight(this.curZeroHeight, (dict) => {
        console.log(`on Zero Up on Zero Up 2 = ${JSON.stringify(dict)}`);
      });
    },
  },
  // activated: function() {
  //   console.log(`activated model.localPaintMgr.state.zero = ${this.model.localPaintMgr.state.zero}`);
  // },
}
</script>

<style lang="scss" scoped>

.dialog-top {
  width: 100%;
  height: 67px;
  background: #484848;
}
.dialog-cover1 {
  // background: #000;
  // opacity: .3;
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.dialog-close {
  position: absolute;
  right: 10px;
  top: 25px;
  width: 20px;
  height: 20px;
  text-align: center;
  cursor: pointer;
  background-position: center;
  background-image: url('./../../assets/img/pop/icon_close.svg');
  background-size: 10px 11px;
  background-repeat: no-repeat;
}
.top-title {
  position: absolute;
  left: 24px;
  top: 25px;
  font-family: 'Gotham-Medium';
  font-size: 16px;
  color: #FFF;
}
.dialog-content {
  width: 580px;
  height: 330px;
  position: fixed;
  top: 20%;
  left: 0px;
  right: 0px;
  margin-left:auto;
  margin-right:auto;
  z-index: 10;
  background: white;
  overflow: hidden;
}
.adjust-tips {
  position: absolute;
  font-family: Gotham-Medium;
  font-size: 16px;
  color: #444;
  width: 100%;
  top: 80px;
  text-align: center;
}
.btn-cancel {
  position: absolute;
  width: 290px;
  height: 40px;
  background: #EBEBEB;
  line-height: 40px;
  bottom: 0px;
  left: 0;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Gotham-Book';
  color: #BABABA;
  letter-spacing: -0.88px;
  text-align: center;
}
.btn-ok {
  position: absolute;
  // width: 290px;
  width: 100%;
  height: 40px;
  bottom: 0px;
  right: 0;
  background: #52BF53;
  text-align: center;
  letter-spacing: -0.88px;
  line-height: 40px;
  font-family: 'Gotham-Book';
  font-size: 12px;
  color: #FFFFFF;
  letter-spacing: -0.5px;
  /* cursor: pointer; */
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

.left-title {
  position: absolute;
  width: 140px;
  // height: 24px;
  height: 30px;
  line-height: 30px;
  // top: 180px;
  // background: yellow;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  color: #555555;
  letter-spacing: -0.43px;
  text-align: right;
}

.zero-show-input {
  position: absolute;
  width: 35px;
  height: 30px;
  // top: 175px;
  right: 42px;
  background: #FDFDFD;
  border: 1px solid #D7D7D7;
  border-radius: 2px;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  text-align: center;
  color: #4B4B4B;
  outline: none;
}

// .times-input {
//   position: absolute;
//   width: 60px;
//   height: 30px;
//   // top: 230px;
//   left: 165px;
//   background: #FDFDFD;
//   border: 1px solid #D7D7D7;
//   border-radius: 2px;
//   font-family: 'Gotham-Medium';
//   font-size: 12px;
//   text-align: center;
//   color: #4B4B4B;
//   outline: none;
// }

// .speed-input {
//   position: absolute;
//   width: 100px;
//   height: 30px;
//   // top: 230px;
//   left: 360px;
//   background: #FDFDFD;
//   border: 1px solid #D7D7D7;
//   border-radius: 2px;
//   font-family: 'Gotham-Medium';
//   font-size: 12px;
//   text-align: center;
//   color: #4B4B4B;
//   outline: none;
// }

.zero-control {
  position: absolute;
  // appearance: slider-vertical; // abandoned, can not set width with css
  /* width: 120%; */
  left: 155px;
  // right: 0px;
  // margin: auto;
  // top: 180px;
  top: 10px;
  width: 300px;
  height: 10px;
  background: #F2F4F7;
  opacity: 1;
  // transform: rotate(-90deg);
  border-radius: 100px;
  // border: #5A93D7 solid 1px;
  cursor: pointer;
  outline: none;
}
.zero-control::-webkit-slider-thumb {
  width: 40px;
  height: 40px;
  background-image: url('./../../assets/img/control/btn_slide.svg');
  background-size: 55px 55px;
  background-repeat: no-repeat;
  background-position: center;
  -webkit-appearance: none;
  border: none;
  border-radius: 50%;
  outline: none;
//  background: #5A93D7;
  // box-shadow: 0 0 8px 0 rgba(45,73,67,0.17);
  box-shadow: darkgrey 0px 0px 5px;
}
.setting-speed-line {
  position: absolute;
  width: 100%;
  height: 30px;
  // background: yellow;
  top: 230px;
}
.setting-zero-line {
  position: absolute;
  width: 100%;
  height: 84px;
  // background: yellow;
  top: 80px;
  border-bottom: 1px solid #b5b0b17a;
}
.setting-times-line {
  position: absolute;
  width: 100%;
  height: 30px;
  // background: yellow;
  top: 180px;
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
  left:545px;
}
.arrow-left {
  background-image: url('./../../assets/img/control/btn_btmtriangle.svg');
  left:480px;
}
.arrow-size {
  position: absolute;
  width: 20px;
  height: 30px;
}
</style>
