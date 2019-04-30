// <template>
//   <div style="position:absolute;width:260px;height:600px;" :class="['dark-backgroud', { comDisableEvent: isOnline === false }]">
//     <!-- <div class="header-text" style="height:30px;">{{ $t('attitudeControl') }}</div> -->
//     <div style="position:absolute;width:100%;height:50%;">
//       <div class="header-text" style="height:30px;">{{ $t('attitudeControl') }}</div>
//       <!-- <CircularRing
//         style="position:absolute;width:250px;height:30px;left:0;right:0;margin:auto;margin-top:20px;"
//         name='angle'
//         :onmovetimer='onmovetimer'>
//       </CircularRing> -->
//       <Joystick
//         style="position:absolute;width:200px;left:0;right:0;margin:auto;top:100px;"
//         :labels="['+Yaw', '-Yaw', '-Roll', '+Roll']"
//         name='orientation'
//         :onmovetimer='onmovetimer'
//         :diameter=200
//         :ballDiameter=60
//         :left=0
//         :top=0>
//       </Joystick>
//     </div>
//     <div style="position:absolute;width:100%;height:50%;top:50%;">
//       <div class="header-text" style="height:30px;">{{ $t('positionControl') }}</div>
//       <input
//         class="z-control"
//         v-model="zPercent"
//         type="range" min="0" max="100" value="50"
//         @mousedown="setPositionZStart('positionZ')"
//         @mousemove="setPositionZ('positionZ')"
//         @mouseup="resetPositionZ('positionZ')"
//         @touchstart="setPositionZStart('positionZ')"
//         @touchmove="setPositionZ('positionZ')"
//         @touchend="resetPositionZ('positionZ')" />
//         <Joystick
//           style="position:absolute;width:200px;right:0px;top:60px;"
//           :labels="['+X', '-X', '+Y', '-Y']"
//           name='position'
//           :onmovetimer='onmovetimer'
//           :diameter=200
//           :ballDiameter=60
//           :left=0
//           :top=0>
//         </Joystick>
//     </div>
//   </div>
// </template>

// <script>
// import * as types from '../../store/mutation-types';
// import Joystick from './Joystick';
// import CircularRing from './CircularRing';

// export default {
//   name: 'EmulatorAppControl',
//   data() {
//     return {
//       model: window.GlobalUtil.model,
//       moveStr: '',
//       zPercent: 50,
//       speed: 0,
//       acceleration: 0,
//       // currentMoveIndex: null,
//       leftControlWidth: '',
//       rightPaddingStyleStr: 0,
//       headPaddingStyleStr: 0,
//     };
//   },
//   mounted() {
//     this.speed = this.model.robot.state.remote.speed;
//     this.acceleration = this.model.robot.state.remote.acceleration;
//     const onWindowResize = () => {
//       const clientWidth = document.body.clientWidth;
//       this.setLeftControlSize();
//     };
//     onWindowResize();
//     window.addEventListener('resize', onWindowResize, false);
//   },
//   methods: {
//     setLeftControlSize() {
//     },
//     onmovetimer(state) {
//       this.moveStr = `${JSON.stringify(this.model.robot.state.intervalInfo)}`;
//       const data = this.model.robot.state.func.intervalInfo2ArcParams();
//       console.log(`on move timer parmas = ${JSON.stringify(data)}, state = ${state}`);
//       if (this.model.robot.state.func.reset() === true) {
//         window.CommandsRobotSocket.setMoveArcLine({ enable: false }, (dict) => { console.log(dict) });
//         return;
//       }
//       data['enable'] = true;
//       window.CommandsRobotSocket.setMoveArcLine(data, (dict) => {
//         console.log('roll yaw socket res', dict);
//       });
//     },
//     setSpeed(evt) {
//       // console.log(evt.target.value);
//       this.model.robot.state.local.speed = this.speed;
//       window.CommandsRobotSocket.setParamsSpeed((dict) => { console.log(dict) });
//     },
//     setAcceleration(evt) {
//       this.model.robot.state.local.acceleration = this.acceleration;
//       window.CommandsRobotSocket.setParamsAcceleration((dict) => { console.log(dict) });
//     },
//     setPositionZStart(name) {
//       let curIntervals = this.model.robot.state.intervalInfo.curIntervals;
//       curIntervals.push(name);
//       curIntervals = Array.from(new Set(curIntervals));
//       console.log(curIntervals);

//       this.model.robot.state.intervalInfo.positionZ.percent = this.zPercent * 0.01;
//       this.model.robot.state.func.initInterval(() => {
//         this.onmovetimer('move');
//       });
//     },
//     setPositionZ() {
//       this.model.robot.state.intervalInfo.positionZ.percent = this.zPercent * 0.01;
//     },
//     resetPositionZ(name) {
//       let curIntervals = this.model.robot.state.intervalInfo.curIntervals;
//       curIntervals.splice(curIntervals.findIndex(item => item === name), 1)
//       curIntervals = Array.from(new Set(curIntervals));
//       console.log(curIntervals);

//       this.zPercent = 50;
//       this.model.robot.state.intervalInfo.positionZ.percent = this.zPercent * 0.01;
//       this.onmovetimer('end');
//     },
//   },
//   beforeDestroy() {
//   },
//   watch: {
//     isControlLeftPadding(newValue) {
//       // console.log('isControlLeftPadding = ' + newValue);
//       if (newValue === true) {
//         this.rightPaddingStyleStr = 250;
//         this.headPaddingStyleStr = 250;
//       }
//       else {
//         this.rightPaddingStyleStr = 0;
//         this.headPaddingStyleStr = 0;
//       }
//     },
//   },
//   components: {
//     Joystick,
//     CircularRing,
//   },
//   computed: {
//     isOnline() {
//       return this.$store.state.robot.info.online === true;
//     },
//     isControlLeftPadding() {
//       return this.model.robot.state.showSetControlValueDialog === true;
//     },
//   },
// };
// </script>

// <style scoped lang="scss">
// .left-control {
//   padding-right: 3px;
//   width: 100%;
// }
// input[type=range] {
//   cursor: pointer;
// }
// input:disabled {
//   cursor:not-allowed;
// }
// input[type=range]:focus {
//   outline: none;
// }
// .control-wrapper {
//   display: flex;
//   position: relative;
//   justify-content: space-around;
//   flex-direction: column;
//   .control-header {
//     width: 100%;
//     display: flex;
//     justify-content: space-around;
//     background: #4d4d4d;
//   }
//   .control-body {
//     position: relative;
//     display: flex;
//     justify-content: space-around;
//     .control-position {
//       width: 300px;
//       position: relative;
//     }
//     .control-attitude {
//       width: 38%;
//       // width: 250px;
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//       position: relative;
//       align-items: center;
//       .yaw-wrapper {
//         padding-bottom: 142px;
//         padding-right: 11px;
//       }
//     }
//   }
// }
// .dark-backgroud {
//   background: #434343;
//   /*height: 36vh;*/
// }
// .header-text {
//   // font-size: 1rem;
//   font-size: 13px;
//   color: white;
//   letter-spacing: -1px;
//   width: 100%;
//   background: #4d4d4d;
//   height: 39px;
//   line-height: 39px;
//   // padding-left: 12px;
//   text-align: center;
// }
// .z-control {
//   // position: absolute;
//   left: -50px;
//   // appearance: slider-vertical; // abandoned, can not set width with css
//   width: 171px;
//   height: 23px;
//   background: #fff;
//   opacity: 1;
//   transform: rotate(-90deg);
//   border-radius: 100px;
//   margin-left: -50px;
//   margin-top: 120px;
//   // top: 50px;
//   // bottom: 0px;
//   // margin: auto;
//   cursor: default;
// }
// .z-control::-webkit-slider-thumb {
//   width: 34px;
//   height: 34px;
//   background-image: url('./../../assets/img/control/btn_slide02.svg');
//   background-repeat: no-repeat;
//   background-position: center center;
//   -webkit-appearance: none;
//   border: none;
//   border-radius: 50%;
//   transform: rotate(-90deg);
//   box-shadow: 0 0 2px 0 rgba(45,73,67,0.17);
// }
// </style>
