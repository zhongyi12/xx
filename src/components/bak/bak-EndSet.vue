// <template>
//   <div class="end-container">
//     <!-- <div class="container-title">TCP</div> -->
//     <ul :class="['position-set', { comDisableEvent: false }]">
//       <li v-for="li in config.position.nameArray" :key="li">
//         <div class="left-title">
//           {{li}}
//         </div>
//         <span class="input-value">{{ position[li] || 0 }}</span>
//         <span class="unit">{{ $t('control.millimeter') }}</span>
//       </li>
//       <li v-for="li in config.orientation.nameArray" :key="li">
//         <div class="left-title">
//           {{li}}
//         </div>
//         <span class="input-value">{{ orientation[li] || 0 }}</span>
//         <span class="unit">{{ $t('control.degree') }} </span>
//       </li>
//     </ul>
//     <div class="set-button">
//       <button @click="setValueDialog" :class="['confirm', { comDisableEvent: isOnline === false }]">{{ $t('control.edit') }}</button>
//       <!-- <button class="confirm" @click="resetEnd">{{ $t('control.reset') }}</button> -->
//     </div>
//   </div>
// </template>
// <script>
// import * as types from '../../store/mutation-types';

// export default {
//   data() {
//     return {
//       model: window.GlobalUtil.model,
//       config: {
//         position: {
//           nameArray: ['x', 'y', 'z'],
//           max: window.GlobalUtil.model.robot.state.range.position.max,
//           min: window.GlobalUtil.model.robot.state.range.position.min,
//         },
//         orientation: {
//           nameArray: ['roll', 'yaw', 'pitch'],
//           max: window.GlobalUtil.model.robot.state.range.orientation.max,
//           min: window.GlobalUtil.model.robot.state.range.orientation.min,
//         },
//       },
//     }
//   },
//   methods: {
//     validatePosition(index) {
//       if (this.position[index] > this.config.position.max) {
//         this.$set(this.position, index, this.config.position.max)
//       }
//       if (this.position[index] < this.config.position.min) {
//         this.$set(this.position, index, this.config.position.min)
//       }
//       console.log(this.position[index])
//       // if (window.isNaN(this.position[index])) {
//       //   this.$set(this.position, index, 0)
//       // }
//     },
//     // validateOrientation(index) {
//     //   if (this.orientation[index] > this.config.orientation.max) {
//     //     this.$set(this.orientation, index, this.config.orientation.max)
//     //   }
//     //   if (this.orientation[index] < this.config.orientation.min) {
//     //     this.$set(this.orientation, index, this.config.orientation.min)
//     //   }
//     // },
//     resetEnd() {
//       this.model.robot.state.jointRangeMoving = false;
//       this.model.robot.state.jointRangeEventTouch = false;
//       this.$store.commit(types.RESET_XARM_POSITION);
//       console.log('reset action local joint = ' + this.model.robot.state.local.joints);
//     },
//     setEnd() {
//       if (this.$store.state.robot.info.online === true) {
//         window.CommandsRobotSocket.moveLineFromLocal(true, (response) => {
//           console.log('roll yaw socket res', response);
//         });
//       }
//       // const sendData = {
//       //   position: this.position,
//       //   orientation: this.orientation,
//       // }
//       // Object.keys(sendData.position).forEach((index) => {
//       //   if (sendData.position[index] === '') {
//       //     sendData.position[index] = 0
//       //   }
//       // })
//       // Object.keys(sendData.orientation).forEach((index) => {
//       //   if (sendData.orientation[index] === '') {
//       //     sendData.orientation[index] = 0
//       //   }
//       // })
//       // this.$store.commit(types.MOVE_END, sendData);
//     },
//     setValueDialog() {
//       console.log('setValueDialog');
//       this.model.robot.state.showSetControlValueDialog = true;
//     },
//   },
//   computed: {
//     position() {
//       const position = this.$store.getters.end.position;
//       Object.keys(position).forEach((key) => {
//         let t = position[key]
//         if (position[key] === undefined) {
//           t = position[key]
//         }
//         else if (typeof position[key] !== 'number') {
//           t = Number(position[key])
//         }
//         position[key] = position[key] ? Number(t.toFixed(2)) : position[key];
//       });
//       return position;
//     },
//     orientation() {
//       const orientation = this.$store.getters.end.orientation;
//       Object.keys(orientation).forEach((key) => {
//         let t = orientation[key]
//         if (orientation[key] === undefined) {
//           t = orientation[key]
//         }
//         else if (typeof orientation[key] !== 'number') {
//           t = Number(orientation[key])
//         }
//         orientation[key] = orientation[key] ? Number(t.toFixed(2)) : orientation[key];
//       });
//       return orientation;
//     },
//     isOnline() {
//       return this.$store.state.robot.info.online === true;
//     },
//     // end: {
//     //   get() {
//     //     const end = this.$store.getters.end;
//     //     Object.keys(end.position).forEach((key) => {
//     //       this.state.position[key] = Number(end.position[key].toFixed(2));
//     //     });
//     //     Object.keys(end.orientation).forEach((key) => {
//     //       this.state.orientation[key] = Number(end.orientation[key].toFixed(2));
//     //     });
//     //     return end;
//     //   },
//     //   set(value) {
//     //     console.log('SET');
//     //     console.table(value);
//     //     // this.$store.commit();
//     //   },
//     // },
//   },
// };
// </script>
// <style scoped lang="scss">

// $liDivWidth : 25%;
// $liInputWidth : 50%;

// .end-container {
//   // background: #434343;
//   // height: 100%;
//   height: 230px;
//   position: relative;
//   font-family: 'Gotham-book';
//   // .container-title {
//   //   padding: 1vh 1vw .6vh;
//   //   font-size: 14px;
//   //   color: #fff;
//   //   letter-spacing: -0.58px;
//   // }
//   .position-set {
//     // background: yellow;
//     // width: 270px;
//     display: flex;
//     // margin-left: 10px;
//     flex-direction: column;
//     justify-content: space-between;
//     // background: yellow;
//     /*height: 62%;*/
//   }
//   .set-button {
//     // margin-left: $liDivWidth;
//     // width: $liInputWidth;
//     position: absolute;
//     // bottom: 0px;
//     top: -25px;
//     right: 0px;
//     width: 50px;
//     height: 30px;
//     // width: 100%;
//     // display: flex;
//     // justify-content: space-between;
//     button {
//       border: none;
//       background: #3E3E3E;
//       cursor: pointer;
//       height: 32px;
//       // width: 50%;
//       width: 100%;
//       color: #fff;
//       letter-spacing: -0.42px;
//       font-size: 10px;
//       font-family: "Gotham-Book";
//       outline: none;
//       // border-left: 1px solid #343232;
//       border: 1px solid #343232;
//     }
//     button.cancel {
//       color: #BEBEBE;
//       background: #F2F3F5;
//     }
//   }

// }

// ul.position-set li{
//   // margin: 0.8vh 28px;
//   // margin: 3px 20px;
//   width:200px;
//   margin-left: auto;
//   margin-right: auto;
//   // margin-top: 5px;
//   margin-top: 8px;
//   background: #3D3D3D;
//   border-radius: 20px;
//   height: 25px;
//   line-height: 30px;
//   position: relative;
//   .left-title {
//     width: 30px;
//     font-family: "Gotham-Book";
//     // font-size: .9rem;
//     font-size: 12px;
//     color: #FFf;
//     right: -98px;
//     letter-spacing: -0.67px;
//     display: inline-block;
//     text-align: center;
//   }
//   input[type=number]::-webkit-outer-spin-button,
//   input[type=number]::-webkit-inner-spin-button {
//     -webkit-appearance: none;
//   }
//   input[type=number] {
//     width: 200px; //$liInputWidth;
//     // color: #B1B1B1;
//     background: #3D3D3D;
//     // font-size: 10px;
//     // border: none;
//     // text-align: center;
//     outline: none;
//     -moz-appearance: textfield;
//   }
//   .input-value {
//     position: absolute;
//     width:50px;
//     left: 0px;
//     right: 0px;
//     margin: auto;
//     color: #B1B1B1;
//     // background: #3D3D3D;
//     // background: yellow;
//     font-size: 10px;
//     border: none;
//     text-align: center;
//     // cursor: pointer;
//   }
//   .unit{
//     position: absolute;
//     width: 20px;
//     right: 20px;
//     font-size: 10px;
//     color: #AEAEAE;
//   }
// }
// // .arrow {
// //   position:absolute;
// //   top: 6px;
// //   margin:auto;
// //   width:16px;
// //   height:24px;
// //   cursor: pointer;
// //   background-position: center;
// //   background-size: 8px 4px;
// //   background-repeat: no-repeat;
// //   transform: rotate(90deg);
// // }
// // .arrow-up {
// //   background-image: url('./../../assets/img/control/btn_toptriangle.svg');
// //   left: 68%;
// // }
// // .arrow-down {
// //   background-image: url('./../../assets/img/control/btn_btmtriangle.svg');
// //   left: 28%;
// // }
// </style>
