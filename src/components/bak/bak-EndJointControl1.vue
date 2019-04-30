// <template>
//   <div style="display: flex; justify-content: space-between">
//     <div :style="{width: + model.robot.state.size.leftControlWidth + 'px'}" :class="['left-control', { comDisableEvent: isOnline }]">
//       <div class="control-wrapper dark-backgroud">
//         <div class="control-header">
//           <div class="header-text" style="width: 38%">{{ $t('attitudeControl') }}</div>
//           <div class="header-text" style="width: 38%">{{ $t('positionControl') }}</div>
//           <div class="header-text" style="width: 24%">{{ $t('speedControl') }}</div>
//         </div>
//         <div class="control-body">
//           <div class="control-right">
//             <div class="yaw-wrapper">
//               <CircularRing
//                 name='angle'
//                 :onmovetimer='onmovetimer'>
//               </CircularRing>
//             </div>
//             <div style="position:absolute;width:200px;height:250px;">
//               <Joystick
//                 name='orientation'
//                 :onmovetimer='onmovetimer'
//                 :diameter=200
//                 :ballDiameter=60
//                 :left=0
//                 :top=40>
//               </Joystick>
//             </div>
//           </div>
//           <div class="control-left" style="">
//             <div class="height-wrapper">
//               <input
//                 v-model="zPercent"
//                 type="range" min="0" max="100" value="50" id="z-control"
//                 @mousedown="setPositionZStart('positionZ')"
//                 @mousemove="setPositionZ('positionZ')"
//                 @mouseup="resetPositionZ('positionZ')"
//                 @touchstart="setPositionZStart('positionZ')"
//                 @touchmove="setPositionZ('positionZ')"
//                 @touchend="resetPositionZ('positionZ')">
//             </div>
//             <div style="position:absolute;width:200px;height:250px;right:0px;">
//               <Joystick
//                 name='position'
//                 :onmovetimer='onmovetimer'
//                 :diameter=200
//                 :ballDiameter=60
//                 :left=0
//                 :top=40>
//               </Joystick>
//             </div>
//           </div>
//           <div class="config-wrapper">
//             <div class="range-right">
//               <span class="config-value" v-text="model.robot.state.info.speed"></span>
//               <input type="range" v-model="model.robot.state.info.speed" @change="setSpeed" :step="1" :max="model.robot.state.info.xarm_limit_velo[1]" :min="model.robot.state.info.xarm_limit_velo[0]">
//               <span class="config-title">{{ $t('speed') }}</span>
//             </div>
//             <div class="img-middle">
//               <img class="img2" src="./../../assets/img/control/icon_speed2.svg" alt="">
//               <img class="img1" src="./../../assets/img/control/icon_speed.svg" alt="">
//             </div>
//             <div class="range-left">
//               <span class="config-value" v-text="model.robot.state.info.acceleration"></span>
//               <input type="range" v-model="model.robot.state.info.acceleration" @change="setAcceleration" :step="1" :max="model.robot.state.info.xarm_limit_acc[1]" :min="model.robot.state.info.xarm_limit_acc[0]">
//               <span class="config-title">{{ $t('acceleration') }}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//     <!-- <div class="dark-backgroud joint-control">
//       <div class="header-text " id="testtest">{{ $t('jointsControl') }}</div>
//       <div class="degree-text">{{ $t('degree') }}</div>
//       <div class="joint-range-wrapper">
//         <div class="block joint-range" v-for="j in 7" :key="j">
//           <span class="text j-text">J{{j}}</span>
//           <div class="range-wrapper">
//             <input :id="'joint' + j" v-model.number="joints[j-1]" type="range" :step="config.step"
//             :max="config.jointMax" :min="config.jointMin"
//             @input="setJointOffline(j-1)" @change="setJointOnline(j-1)" :disabled="rangeDisable">
//             <p :id="'mask' + j" class="mask-bar"></p>
//           </div>
//           <span class="joints-number">
//             <input :id="'joint-input' + j" type="number" onfocus="this.select()" v-model.number="joints[j-1]"
//             @input="setJointOffline(j-1)" @change="setJointOnline(j-1)" :disabled="rangeDisable"
//             :max="config.jointMax" :min="config.jointMin">
//           </span>
//         </div>
//       </div>
//     </div> -->

//     <!-- <div style="position:absolute;background:lightgreen;width:800px;height:20px;left:0px;top:200px;z-index:2000;">
//       -- {{ moveStr }}
//     </div> -->

//   </div>
// </template>

// <script>
// import * as types from '../../store/mutation-types';
// import Joystick from './Joystick';
// import CircularRing from './CircularRing';

// export default {
//   name: 'EmulatorAppControl',
//   // i18n: {
//   //   messages: {
//   //     en: {
//   //       control: 'Control',
//   //       liveControl: 'Live Control',
//   //       off: 'OFF',
//   //       on: 'ON',
//   //       attitudeControl: 'Attitude Control',
//   //       positionControl: 'Position Control',
//   //       speedControl: 'Speed Control',
//   //       speed: 'Speed',
//   //       acceleration: 'Acceleration',
//   //       jointsControl: 'Joints Control',
//   //       positionAttitude: 'Position and Attitude Control',
//   //       degree: 'Degree',
//   //     },
//   //     cn: {
//   //       control: '控制器',
//   //       liveControl: '实时控制',
//   //       off: '关闭',
//   //       on: '打开',
//   //       attitudeControl: '姿态调整',
//   //       positionControl: '位置调整',
//   //       speedControl: '调速',
//   //       speed: '速度',
//   //       acceleration: '加速度',
//   //       jointsControl: '关节控制',
//   //       positionAttitude: '姿态和位置调整',
//   //       degree: '度数',
//   //     },
//   //   },
//   // },
//   data() {
//     return {
//       model: window.GlobalUtil.model,
//       moveStr: '',
//       zPercent: 50,
//       // testindex: 6,
//       // radianAngle: -(Math.PI / 2),
//       // test: null,
//       // testtest: [],
//       attitudeLeft: 50,
//       // config: {
//       //   debugMax: 10,
//       //   debugMin: -10,
//       //   jointMax: 180,
//       //   jointMin: -180,
//       //   step: 0.01,
//       //   joint: {
//       //     max: [179.9, 30, 34.8, 7.2, 50.4, 102.1, 179.9],
//       //     min: [-179.9, -120, -179.9, -220, -118.6, -99.9, -179.9],
//       //   },
//       // },
//       // jointRangeMoved: {
//       //   state: false,
//       //   index: null,
//       //   value: null,
//       // },
//       currentMoveIndex: null,
//       leftControlWidth: '',
//       // animation: true,
//     };
//   },
//   mounted() {
//     const onWindowResize = () => {
//       // this.joints.forEach((value, index) => {
//       //   this.setRangeMask(index, value);
//       // });
//       // this.attitudeLeft
//       const clientWidth = document.body.clientWidth;
//       // console.log(`clientWidth = ${clientWidth}`);
//       this.attitudeLeft = clientWidth * 0.1;
//       this.setLeftControlSize();
//     };
//     onWindowResize();
//     window.addEventListener('resize', onWindowResize, false);
//     // window.addEventListener('resize', this.setLeftControlSize, false);
//   },
//   methods: {
//     setLeftControlSize() {
//       const docWidth = document.body.clientWidth;
//       console.log(`setLeftControlSize docWidth = ${docWidth}`);
//       // this.leftControlWidth = docWidth - 327;
//       // this.model.robot.state.size.leftControlWidth = docWidth - 300;
//     },
//     onmovetimer(state) {
//       this.moveStr = `${JSON.stringify(this.model.robot.state.intervalInfo)}`;
//       // console.log(`on move timer intervalInfo = ${JSON.stringify(this.model.robot.state.intervalInfo)}`);
//       const data = this.model.robot.state.func.intervalInfo2ArcParams();
//       console.log(`on move timer parmas = ${JSON.stringify(data)}, state = ${state}`);
//       if (this.model.robot.state.func.reset() === true) {
//         window.CommandsRobotSocket.setStateStop((dict) => { console.log(dict) });
//         return;
//       }
//       window.CommandsRobotSocket.moveArcLine(data, (dict) => {
//         console.log('roll yaw socket res', dict);
//       });
//     },
//     setSpeed(evt) {
//       // console.log(evt.target.value);
//       this.model.robot.state.info.speed = evt.target.value;
//       window.CommandsRobotSocket.setParamsSpeed((dict) => { console.log(dict) });
//     },
//     setAcceleration(evt) {
//       this.model.robot.state.info.acceleration = evt.target.value;
//       window.CommandsRobotSocket.setParamsAcceleration((dict) => { console.log(dict) });
//     },
//     // setJointOffline(index) {
//     //   // on input event
//     //   // console.log('test', index, value);
//     //   if (this.joints[index] > this.config.jointMax) {
//     //     this.$set(this.joints, index, this.config.jointMax)
//     //   }
//     //   if (this.joints[index] < this.config.jointMin) {
//     //     this.$set(this.joints, index, this.config.jointMin)
//     //   }
//     //   this.setRangeMask(index, this.joints[index])
//     //   if (!this.stateOnline) {
//     //     console.log('offline')
//     //     this.setJointCmd(index);
//     //   }
//     //   // if (this.stateError < 0) {
//     //   //   this.$set(this.joints, index, this.$store.getters.joints[index])
//     //   //   this.$message('unable to move.')
//     //   //   console.log('unun2', this.$store.getters.joints[index])
//     //   // }
//     // },
//     // setJointOnline(index) {
//     //   // on change event
//     //   if (this.stateOnline) {
//     //     this.currentMoveIndex = index
//     //     let data = this.joints[index];
//     //     console.log('online')
//     //     console.log(this.joints[index]);
//     //     if (!this.checkNumber(data)) {
//     //       console.log('not nnnnn')
//     //       const beforeValue = this.$store.getters.joints[index]
//     //       this.$set(this.joints, index, beforeValue);
//     //       data = beforeValue;
//     //       this.jointRangeMoved.state = false
//     //     }
//     //     else {
//     //       this.jointRangeMoved = {
//     //         state: true,
//     //         index,
//     //         value: data,
//     //       };
//     //       // window.setTimeout(() => {
//     //       //   this.jointRangeMoved.state = false;
//     //       // }, 5000);
//     //       this.setJointCmd();
//     //     }
//     //   }
//     // },
//     // setJointCmd() {
//     //   // this.$store.commit(types.MOVE_ONE_JOINT, {
//     //   //   index,
//     //   //   value: this.joints[index],
//     //   // });
//     //   // this.$store.commit(types.ROBOT_MOVE_JOINT, this.joints);
//     //   this.model.robot.state.func.moveAllJoints(this.joints);
//     //   // if (this.model.robot.state.info.online === true) {
//     //   //   window.CommandsRobotSocket.moveAllJoints(this.joints, true, (dict) => {
//     //   //     console.log(`dict = ${JSON.stringify(dict)}`);
//     //   //   });
//     //   // }
//     //   // else { // offline mode
//     //   //   this.model.robot.state.info.axis = this.joints.slice();
//     //   // }
//     // },
//     setPositionZStart(name) {
//       let curIntervals = this.model.robot.state.intervalInfo.curIntervals;
//       curIntervals.push(name);
//       curIntervals = Array.from(new Set(curIntervals));
//       console.log(curIntervals);

//       // const percent = //(this.model.robot.state.joystick.step.position.z - (-10)) / 20.0;
//       this.model.robot.state.intervalInfo.positionZ.percent = this.zPercent * 0.01;
//       this.model.robot.state.func.initInterval(() => {
//         this.onmovetimer('move');
//       });
//     },
//     setPositionZ() {
//       // const percent = (this.model.robot.state.joystick.step.position.z - (-10)) / 20.0;
//       this.model.robot.state.intervalInfo.positionZ.percent = this.zPercent * 0.01;
//       // this.model.robot.state.joystick.step.position.z;
//       // this.interval = setInterval(() => {
//       //   console.log('z:', this.model.robot.state.joystick.step.position.z);
//       //   // this.$store.commit(types.MOVE_END_Z, Number(this.model.robot.state.joystick.step.position.z));
//       // }, 500);
//     },
//     resetPositionZ(name) {
//       let curIntervals = this.model.robot.state.intervalInfo.curIntervals;
//       curIntervals.splice(curIntervals.findIndex(item => item === name), 1)
//       curIntervals = Array.from(new Set(curIntervals));
//       console.log(curIntervals);

//       // this.model.robot.state.joystick.step.position.z = 0;
//       this.zPercent = 50;
//       this.model.robot.state.intervalInfo.positionZ.percent = this.zPercent * 0.01;
//       this.onmovetimer('end');
//       // window.clearInterval(this.model.robot.state.positionInterval);
//       // clearInterval(this.interval);
//     },
//     // setRangeMask(index, value) {
//     //   // const dom = document.getElementById(`joint${index}`);
//     //   // const maskBar = document.getElementById(`mask${index}`);
//     //   if (this.model.robot.state.rangeMask.maskBar.length === 0) {
//     //     console.log('dom not get');
//     //     return;
//     //   }
//     //   const inputWidth = Number(this.model.robot.state.rangeMask.dom[index].clientWidth);
//     //   const rangeLength = this.model.robot.state.rangeMask.rangeLength[index];
//     //   const getWidth = inputWidth * (Math.abs(Number(value)) / rangeLength);
//     //   if (value > 0) {
//     //     this.model.robot.state.rangeMask.maskBar[index].style.transform = 'none';
//     //   }
//     //   else {
//     //     this.model.robot.state.rangeMask.maskBar[index].style.transform = 'rotate(180deg)';
//     //   }
//     //   this.model.robot.state.rangeMask.maskBar[index].style.width = `${getWidth}px`;
//     // },
//     checkNumber(num) {
//       if (!/^[-]?[0-9]*\.?[0-9]+(eE?[0-9]+)?$/.test(num)) {
//         return false
//       }
//       return true
//     },
//   },
//   beforeDestroy() {
//     // for (let i = 1; i < 8; i += 1) {
//     //   this.removeRangeColor(i);
//     // }
//   },
//   watch: {
//     // stateError(newValue) {
//     //   this.jointRangeMoved.state = false;
//     //   if (newValue === -6) {
//     //     this.$message('unable to move.');
//     //   }
//     //   else if (newValue < 0) {
//     //     this.$message('Fail to move');
//     //     // this.$alert('Response Error', 'Fail to move', {
//     //     //   confirmButtonText: 'OK',
//     //     //   callback: (action) => {
//     //     //     this.$message({
//     //     //       type: 'info',
//     //     //       message: `TODO: ${action}`,
//     //     //     });
//     //     //   },
//     //     // });
//     //   }
//     //   // else {
//     //   //   this.$message('Connected.');
//     //   // }
//     // },
//     // 'state.joint': (newValue) => {
//     //   console.log('watch posi print:');
//     //   console.table(newValue);
//     // },
//     // robotJointsAngle() {
//     //   this.$set(this.robotJointsAngle, 0, this.robotJointsAngle[0]);
//     // },
//     // joints(newValue) {
//     //   newValue.forEach((value, index) => {
//     //     this.setRangeMask(index, value);
//     //   });
//     // },
//     stateErrorCount() {
//       if (this.stateError === -6) {
//         this.$set(this.joints, this.currentMoveIndex, this.$store.getters.joints[this.currentMoveIndex])
//         // this.$message('unable to move.')
//         console.log('unun2', this.$store.getters.joints[this.currentMoveIndex])
//       }
//     },
//   },
//   components: {
//     Joystick,
//     CircularRing,
//   },
//   computed: {
//     stateSpeed: {
//       get() {
//         return this.$store.state.robot.info.speed
//       },
//       set() {
//       },
//     },
//     stateAcceleration: {
//       get() {
//         return this.$store.state.robot.info.acceleration
//       },
//       set() {
//       },
//     },
//     stateErrorCount() {
//       return this.$store.state.robot.status.errorCount
//     },
//     stateError() {
//       return this.$store.state.robot.status.error;
//     },
//     // rangeDisable() {
//     //   return this.jointRangeMoved.state && this.stateOnline && !this.stateError;
//     // },
//     // stateOnline() {
//     //   return this.$store.state.robot.info.online;
//     // },
//     // joints: {
//     //   get() {
//     //     const arr = this.$store.getters.joints;
//     //     // console.log('get ax', arr, this.state.joints);
//     //     const values = arr.map(str => Number(str));
//     //     if (this.jointRangeMoved.state && this.stateOnline) {
//     //       if (arr[this.jointRangeMoved.index] === this.jointRangeMoved.value) {
//     //         this.jointRangeMoved.state = false;
//     //         console.log('get final joint angle');
//     //       }
//     //       else {
//     //         values[this.jointRangeMoved.index] = Number(this.jointRangeMoved.value);
//     //       }
//     //       return values.slice();
//     //     }
//     //     else if (arr && (arr.length > 0)) {
//     //       // console.log('arr posi print:', values.length);
//     //       // console.table(values);
//     //       // this.test = values[1];
//     //       return values.slice();
//     //     }
//     //     return [0, 0, 0, 0, 0, 0, 0];
//     //   },
//     // },
//     // testtest: {
//     //   get() {
//     //     return this.$store.state.robot.info.test;
//     //   },
//     //   set(value) {
//     //     this.$store.commit('test', value);
//     //   },
//     // },
//     isOnline() {
//       return !this.$store.state.robot.info.online;
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
// .block {
//   /*padding: 0.2vw 1vw;*/
// }
// // span.text {
// //   display: block;
// //   float: left;
// //   text-align: center;
// // }
// .control-wrapper {
//   display: flex;
//   position: relative;
//   justify-content: space-around;
//   flex-direction: column;
//   .control-header {
//     display: flex;
//     justify-content: space-around;
//     background: #4d4d4d;
//     .header-text {
//       text-align: center;
//     }
//   }
//   .control-body {
//     position: relative;
//     display: flex;
//     justify-content: space-around;
//     & > div {
//       .joystick-wrapper {
//         margin: 0;
//         width: 169px;
//         height: 169px;
//         background: url("./../../assets/img/control/outside_circle.svg") no-repeat center;
//       }
//     }
//     .control-left {
//       width: 38%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       position: relative;
//       .joystick-wrapper {
//         /*margin-left: 40px;*/
//         position: absolute;
//       }
//       // .height-wrapper {
//         /*display: flex;*/
//         /*flex-direction: column;*/
//         /*align-items: center;*/
//         // margin-right: 238px;
//       // }
//       // .el-slider {
//       //   padding-bottom: 0;
//       //   margin-left: 15%;
//       // }
//     }
//     .control-right {
//       width: 38%;
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//       position: relative;
//       align-items: center;
//       .joystick-wrapper {
//         position: absolute;
//         bottom: 14px;
//       }
//       // .el-slider {
//       //   padding: 0 10%;
//       //   position: absolute;
//       //   width: 80%;
//       //   top: 0;
//       //   left: 10%;
//       // }
//       .yaw-wrapper {
//         padding-bottom: 142px;
//         padding-right: 11px;
//         input {
//           // appearance: slider-vertical; // abandoned, can not set width with css
//           width: 100%;
//           height: 18px;
//           background: #fff;
//           opacity: 1;
//           border-radius: 100px;
//           border: none;
//         }
//         input::-webkit-slider-thumb {
//           width: 25px;
//           height: 25px;
//           background-image: gradient(right, #222, #eee);
//           -webkit-appearance: none;
//           border: none;
//           border-radius: 50%;
//           background: #5A93D7;
//           box-shadow: 0 0 2px 0 rgba(45,73,67,0.17);
//         }
//       }
//     }
//   }

// }
// .config-wrapper {
//   display: flex;
//   justify-content: center;
//   width: 24%;
//   position: relative;
//   background: #484848;
//   .range-right {
//     /*right: 130px;*/
//   }
//   .img-middle {
//     padding: 40px 0;
//   }
//   .range-left {
//     /*left: 130px;*/
//   }
//   & > div {
//     /*width: 50%;*/
//     /*padding: 2% 4%;*/
//     height: 100%;
//     color: white;
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     flex-direction: column;
//     /*position: absolute;*/
//     width: 34px;
//     .img1 {
//       width: 8px;
//     }
//     .img2 {
//       width: 18px
//     }
//     input[type=range] {
//       border-radius: 100px;
//       background-image: linear-gradient(90deg, #8FFF94 0%, #FF6868 100%);
//       transform: rotate(-90deg);
//       -webkit-appearance: none;
//       height: 36px;
//       width: 168px;
//     }
//     input[type=range]::-webkit-slider-thumb {
//       width: 50px;
//       height: 32px;
//       -webkit-appearance: none;
//       border: none;
//       border-radius: 100px;
//       background: #FEFEFE;
//       box-shadow: 0 0 8px 0 rgba(214,214,214,0.50);
//     }
//     span {
//       font-family: 'Gotham-Book';
//       font-size: 9px;
//       color: #FFF;
//       text-align: center;
//     }
//     .config-value {
//       padding-top: 10px;
//     }
//     .config-title {
//       padding-bottom: 10px;
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
//   height: 39px;
//   line-height: 39px;
//   padding-left: 12px;
// }
// .joint-control {
//   width: 276px;
//   display: flex;
//   right: 0px;
//   flex-direction: column;
//   justify-content: space-between;
//   // position: relative;
//   position: absolute;
//   margin-top: 0px;
//   height: 100px;
//   // .header-text {
//   //   padding-left: 12px;
//   // }
//   // .degree-text {
//   //   color: white;
//   //   text-align: right;
//   //   font-size: 10px;
//   //   position: absolute;
//   //   top: 14px;
//   //   right: 14px;
//   //   font-family: 'Gotham-Medium';
//   // }
//   // .joint-range-wrapper {
//   //   display: flex;
//   //   flex-direction: column;
//   //   align-items: center;
//   //   justify-content: space-around;
//   //   height: 233px;
//   // }
//   // .joint-range:last-child {
//   //   padding-bottom: 18px;
//   // }
//   // .joint-range {
//   //   color: white;
//   //   display: flex;
//   //   align-items: center;
//   //   justify-content: space-between;
//   //   width: 100%;
//   //   /*padding: 6px 0;*/
//   //   span {
//   //     font-size: 10px;
//   //     font-family: "Gotham-Book";
//   //   }
//   //   .j-text {
//   //     padding:0 12px;
//   //   }
//   //   .range-wrapper {
//   //     position: relative;
//   //     width: 218px;
//   //     background: #353535;
//   //     height: 4px;
//   //     border-radius: 10px;
//   //     input[type=range] {
//   //       height: 4px;
//   //       background: transparent;
//   //       width: 100%;
//   //       vertical-align: middle;
//   //       z-index: 5;
//   //       padding: 0;
//   //       margin: 0;
//   //       position: absolute;
//   //     }
//   //     input[type=range]::-webkit-slider-thumb {
//   //       width: 15px;
//   //       height: 15px;
//   //       -webkit-appearance: none;
//   //       border: none;
//   //       border-radius: 50%;
//   //       background: #fff;
//   //     }
//   //     .mask-bar {
//   //       position: absolute;
//   //       background-color: #E27347;
//   //       height: 4px;
//   //       line-height: 4px;
//   //       /*z-index: 200;*/
//   //       border-radius: 100px;
//   //       padding: 0;
//   //       margin: 0;
//   //       pointer-events: none;
//   //       transform-origin: left;
//   //     }
//   //   }
//   //   .joints-number {
//   //     /*width: 5vw;*/
//   //     input[type=number] {
//   //       border: none;
//   //       background: #434343;
//   //       text-align: center;
//   //       color: #fff;
//   //       letter-spacing: -0.5px;
//   //       font-size: 12px;
//   //       outline:none;
//   //       padding-right: 1px;
//   //       width: 56px;
//   //     }
//   //     input::-webkit-outer-spin-button,
//   //     input::-webkit-inner-spin-button{
//   //       -webkit-appearance: textfield;
//   //     }
//   //   }
//   // }
// }
// // .data-display {
// //   background: blue;
// //   color: yellow;
// // }
// #z-control {
//   position: absolute;
//   left: -50px;
//   // appearance: slider-vertical; // abandoned, can not set width with css
//   width: 171px;
//   height: 23px;
//   background: #fff;
//   opacity: 1;
//   transform: rotate(-90deg);
//   border-radius: 100px;
//   cursor: default;
// }
// #z-control::-webkit-slider-thumb {
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
