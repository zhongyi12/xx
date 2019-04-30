// <template>
//   <div id="root-joint" class="noselected">
//     <div class="joint-range-wrapper" :class="{ comDisableEvent: comDisableEvent }">
//       <div style="position:absolute;margin:auto;">
//         <div class="joint-per-range" v-for="j in 7" :key="j">
//           <span class="j-text">J{{j}}</span>
//           <div class="range-per-wrapper" :style="{opacity: + rangeDisable ? 0.6 : 1}">
//             <span class="range-bg"></span>
//             <div class="ruler-line" :style="{left: + getRulerLeft(j-1) + 'px'}"></div>
//             <input
//               v-show="false"
//               :id="'joint' + j"
//               v-model.number="model.robot.state.tempJoints[j-1]"
//               type="range"
//               :step="config.step"
//               :max="config.jointMax"
//               :min="config.jointMin"
//               @input="setJointOffline(j-1)"
//               @change="setJointOnline(j-1)"
//               :disabled="rangeDisable">
//             <span v-show="false" :id="'mask' + j" class="mask-bar"></span>
//           </div>
//           <span class="joints-number" style="color:orange;">{{ localJoints[j-1] }}</span>
//           <!-- <span class="joints-number" style="line-height:70px;">{{ model.robot.state.tempJoints[j-1] }}</span> -->
//         </div>
//       </div>
//     </div>
//   </div>
// </template>

// <script>

// export default {
//   props: [],
//   data() {
//     return {
//       model: window.GlobalUtil.model,
//       config: {
//         debugMax: 10,
//         debugMin: -10,
//         jointMax: 180,
//         jointMin: -180,
//         step: 0.01,
//       },
//       // lastTempJoints: [0, 0, 0, 0, 0, 0, 0],
//       comDisableEvent: false,
//       resetInterval: null,
//     }
//   },
//   mounted() {
//     const joints = this.$store.getters.remoteJoints;
//     this.model.robot.state.local.joints = joints.concat();
//     for (let i = 0; i < 7; i += 1) {
//       this.initRangeMask(`${i + 1}`);
//     }
//     this.model.robot.state.tempJoints = joints.concat();
//     this.onresize();
//     window.addEventListener('resize', this.onresize, false);
//   },
//   beforeDestroy() {
//     window.removeEventListener('resize', this.onresize);
//   },
//   methods: {
//     getRulerLeft(index) {
//       const percent = (this.localJoints[index] - this.config.jointMin) / 360.0;
//       const realValue = 13.00 + (200.00 - 26.00) * percent;
//       // return Math.round(realValue * 100) / 100;
//       return realValue;
//     },
//     onresize() {
//       const _innerHeight = window.innerHeight;
//       // console.log(`_innerHeight = ${_innerHeight}`);
//       const perCells = document.getElementsByClassName('joint-per-range');
//       for (let i = 0; i < perCells.length; i += 1) {
//         const perCell = perCells[i];
//         if (perCell) {
//           const _minHeight = 650;
//           // const height = _innerHeight < _minHeight ? 40 : (40 + (_innerHeight - _minHeight) / 8.0);
//           const height = 40;
//           perCell.style.height = `${height}px`;
//         }
//       }
//     },
//     initRangeMask(index) {
//       // TODO: use $refs instead of getElementById
//       const dom = document.getElementById(`joint${index}`);
//       this.model.robot.state.rangeMask.dom[index - 1] = dom;
//       this.model.robot.state.rangeMask.maskBar[index - 1] = document.getElementById(`mask${index}`);
//       this.model.robot.state.rangeMask.rangeLength[index - 1] = Number(dom.max) - Number(dom.min);
//       this.model.robot.state.rangeMask.maskBar[index - 1].style.left = `${((-Number(dom.min) * 100) / this.model.robot.state.rangeMask.rangeLength[index - 1])}%`;
//     },
//     setJointCmd() {
//       console.log('set Joint Cmd')
//       this.model.robot.state.jointRangeEventTouch = true;
//       this.model.robot.state.func.moveAllJoints(this.model.robot.state.tempJoints, (Response) => {
//         console.log(`move All Joints dict = ${JSON.stringify(Response)}`);
//       });
//     },
//     setAllRangeMasks() {
//       const joints = this.model.robot.state.tempJoints;
//       for (let i = 0; i < joints.length; i += 1) {
//         const joint = joints[i];
//         this.setRangeMask(i, joint)
//       }
//     },
//     setRangeMask(index, value) {
//       // const dom = document.getElementById(`joint${index}`);
//       // const maskBar = document.getElementById(`mask${index}`);
//       if (this.model.robot.state.rangeMask.maskBar.length === 0) {
//         console.log('dom not get');
//         return;
//       }
//       const inputWidth = Number(this.model.robot.state.rangeMask.dom[index].clientWidth);
//       const rangeLength = this.model.robot.state.rangeMask.rangeLength[index];
//       const getWidth = inputWidth * (Math.abs(Number(value)) / rangeLength);
//       if (value > 0) {
//         this.model.robot.state.rangeMask.maskBar[index].style.transform = 'none';
//       }
//       else {
//         this.model.robot.state.rangeMask.maskBar[index].style.transform = 'rotate(180deg)';
//       }
//       this.model.robot.state.rangeMask.maskBar[index].style.width = `${getWidth - 0}px`;
//     },
//     setJointOffline(index) {
//       this.model.localTeach.hasChange = true;
//       console.log('set Joint Offline');
//       this.setRangeMask(index, this.model.robot.state.tempJoints[index]);
//       if (!this.stateOnline) {
//         console.log('offline')
//         this.model.robot.state.local.joints = this.model.robot.state.tempJoints.concat();
//         this.setJointCmd(index);
//       }
//     },
//     setJointOnline(index) {
//       this.model.localTeach.hasChange = true;
//       console.log(`set Joint On line = ${this.stateOnline}`);
//       if (this.stateOnline === false) {
//         return;
//       }
//       // on change event
//       this.model.robot.state.currentMoveIndex = index;
//       let data = this.localJoints[index];
//       console.log('online');
//       console.log(this.localJoints[index]);
//       if (!this.checkNumber(data)) {
//         console.log('not nnnnn');
//         const beforeValue = this.$store.getters.localJoints[index];
//         this.$set(this.localJoints, index, beforeValue);
//         data = beforeValue;
//         // this.model.robot.state.jointRangeMoved.state = false;
//         this.model.robot.state.jointRangeMoving = false;
//         this.model.robot.state.jointRangeEventTouch = false;
//       }
//       else {
//         // this.model.robot.state.jointRangeMoved = {
//         //   state: true,
//         //   index,
//         //   // value: data,
//         //   value: this.tempJoints[index],
//         // };
//         this.model.robot.state.jointRangeMoving = true;
//         this.setJointCmd();
//       }
//     },
//     checkNumber(num) {
//       if (!/^[-]?[0-9]*\.?[0-9]+(eE?[0-9]+)?$/.test(num)) {
//         return false
//       }
//       return true
//     },
//     resetLastPoint() {
//       const joints = this.$store.getters.remoteJoints;
//       this.model.robot.state.local.joints = joints.concat();
//       this.model.robot.state.tempJoints = joints.concat();
//     },
//   },
//   components: {
//   },
//   computed: {
//     stateErrorCount() {
//       return this.$store.state.robot.status.errorCount;
//     },
//     stateError() {
//       return this.$store.state.robot.status.error;
//     },
//     rangeDisable() {
//       // return this.model.robot.state.jointRangeMoved.state === true && this.stateOnline === true; // && !this.stateError;
//       return this.model.robot.state.jointRangeMoving === true && this.stateOnline === true;
//     },
//     stateOnline() {
//       return this.$store.state.robot.info.online === true;
//     },
//     localJoints: {
//       get() {
//         const arr = this.$store.getters.localJoints;
//         return arr;
//       },
//     },
//     tempJoints() {
//       return this.model.robot.state.tempJoints;
//     },
//   },
//   watch: {
//     stateOnline() {
//       console.log(`stateOnline = ${this.stateOnline}`);
//       if (this.stateOnline === true) {
//         const joints = this.$store.getters.remoteJoints;
//         this.model.robot.state.local.joints = joints.concat();
//         this.model.robot.state.tempJoints = joints.concat();
//       }
//     },
//     stateErrorCount() {
//       console.log(`stateError count = ${this.stateError}`);
//       if (this.stateError === -6) {
//         // window.GlobalUtil.model.robot.state.jointRangeMoved.state = false;
//         // window.GlobalUtil.model.robot.state.jointRangeMoving = false;
//         // window.GlobalUtil.model.robot.state.jointRangeEventTouch = false;
//         // const curIndex = window.GlobalUtil.model.robot.state.currentMoveIndex;
//         // this.resetLastPoint();
//         // this.$message('unable to move.');
//       }
//     },
//     stateError(newValue) {
//       console.log(`stateError new value = ${newValue}`);
//       // window.GlobalUtil.model.robot.state.jointRangeMoved.state = false;
//       if (newValue === -6) {
//         window.GlobalUtil.model.robot.state.jointRangeMoving = false;
//         window.GlobalUtil.model.robot.state.jointRangeEventTouch = false;
//         this.resetLastPoint();
//         this.$message('unable to move.');
//       }
//       if (newValue < 0) {
//         this.$message('Fail to move');
//       }
//     },
//     tempJoints() {
//       this.setAllRangeMasks();
//     },
//     localJoints(newValue) {
//       // console.log(`mounted app detail route = ${JSON.stringify(this.$route)}`);
//       // console.log('watch local joints = ' + newValue + ' -- ' + window.GlobalUtil.model.robot.state.jointRangeEventTouch);
//       // return;
//       this.comDisableEvent = false;
//       const isAllZero = newValue.join('') === '0000000';
//       const recordEdting = this.model.localTeach.editState === true;
//       if (recordEdting === true) {
//         if (newValue.length !== 7) {
//           this.model.robot.state.tempJoints = [0, 0, 0, 0, 0, 0, 0];
//           this.comDisableEvent = true;
//         }
//         else if (this.stateOnline === true && window.GlobalUtil.model.robot.state.jointRangeEventTouch === false) {
//           // this.tempJoints = newValue;
//         }
//       }
//       else if (this.stateOnline === true && window.GlobalUtil.model.robot.state.jointRangeEventTouch === false || isAllZero === true) {
//         // this.tempJoints = newValue;
//       }
//       if (this.stateOnline === false) {
//         this.model.robot.state.tempJoints = newValue.concat();
//       }
//       window.clearInterval(this.resetInterval);
//       this.resetInterval = null;
//       this.resetInterval = window.setInterval(() => {
//         window.clearInterval(this.resetInterval);
//         this.resetInterval = null;
//         this.model.robot.state.tempJoints = newValue.concat();
//       }, 5000);
//     },
//   },
// }
// </script>

// <style scoped lang="scss">
// .joint-range-wrapper {
//   height: 300px;
//   width: 280px;
// }
// .joint-per-range {
//   // position: absolute;
//   color: white;
//   height: 40px;
//   // width: 280px;
//   width: 100%;
// }
// .ruler-line {
//   position:absolute;
//   background:orange;
//   width:2px;
//   height:50px;
//   top:0px;
//   z-index:1;
//   border-radius: 2px;
// }
// .range-per-wrapper {
//   position: absolute;
//   width: 200px;
//   height: 50px;
//   left: 30px;
//   .range-bg {
//     position: absolute;
//     width: 100%;
//     height: 4px;
//     background: #353535;
//     border-radius: 2px;
//     top: 0px;
//     bottom: 0px;
//     z-index: 0;
//     margin: auto;
//   }
//   input[type=range] {
//     position: absolute;
//     width: 100%;
//     height: 0px;
//     top: 0px;
//     bottom: 0px;
//     margin: auto;
//     // background: #353535;
//     background: transparent;
//     opacity: 1;
//     z-index: 5;
//     cursor: pointer;
//     outline: none;
//   }
//   input[type=range]::-webkit-slider-thumb {
//     width: 26px;
//     height: 26px;
//     -webkit-appearance: none;
//     border: none;
//     background: #fff;
//     border-radius: 13px;
//   }
//   input:disabled {
//     cursor:not-allowed;
//   }
//   input[type=range]:focus {
//     outline: none;
//     background: transparent;
//   }
// }
// input {
//   outline: none;
// }
// .mask-bar {
//   position: absolute;
//   background-color: #E27347;
//   // background: red;
//   left: 0px;
//   height: 4px;
//   line-height: 4px;
//   // z-index: 200;
//   // border-radius: 100px;
//   border-radius: 2px;
//   // padding: 0;
//   // margin: 0;
//   top: 0px;
//   bottom: 0px;
//   margin: auto;
//   pointer-events: none;
//   transform-origin: left;
//   width: 200px;
//   outline: none;
// }
// .j-text {
//   position: absolute;
//   text-align: right;
//   width: 20px;
//   height: 50px;
//   line-height: 50px;
//   color: #fff;
//   letter-spacing: -0.5px;
//   font-size: 12px;
//   font-family: "Gotham-Book";
// }
// .joints-number {
//   position: absolute;
//   left: 230px;
//   border: none;
//   // background: #434343;
//   // text-align: center;
//   text-align: right;
//   color: #fff;
//   letter-spacing: -0.5px;
//   font-size: 12px;
//   font-family: "Gotham-Book";
//   outline:none;
//   width: 30px;
//   height: 50px;
//   line-height: 50px;
// }
// </style>
