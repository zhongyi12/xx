// <template>
//   <div class="root-wrapper">
//     <!-- end set -->
//     <div class="end-col">
//       <div class="container-title">TCP</div>
//       <end-set></end-set>
//     </div>
//     <!-- joint -->
//     <div class="joint-control">
//       <div class="" style="position:absolute;width:270px;height:100%;left:0;right:0;margin:auto;">
//         <div class="header-text " id="testtest">{{ $t('jointsControl') }} </div>
//         <div class="degree-text">{{ $t('degree') }}</div>
//         <JointControl style=""></JointControl>
//       </div>
//     </div>
//   </div>
// </template>
// <script>

// import * as types from '../../store/mutation-types';
// import JointControl from '../Control/JointControl';
// import EndSet from '../Control/EndSet';
// import EditPoints from './../Teach/EditPoints';
// // import EditSpeed from './../Teach/EditSpeed';

// export default {
//   name: 'EmulatorControl',
//   // props: ['name'],
//   data() {
//     return {
//       model: window.GlobalUtil.model,
//     };
//   },
//   mounted() {
//     setTimeout(() => {
//       window.GlobalUtil.setInputFocus();
//     });
//   },
//   methods: {
//   },
//   computed: {
//     rangeDisable() {
//       return this.model.robot.state.jointRangeMoving === true && this.stateOnline === true; // && !this.stateError;
//     },
//     stateOnline() {
//       return this.$store.state.robot.info.online === true;
//     },
//     isOnline() {
//       return this.$store.state.robot.info.online === true;
//     },
//     isTimer() {
//       const index = window.GlobalUtil.model.localTeach.curSelectedIndex;
//       return index < 0 ? false : window.GlobalUtil.model.localTeach.isTimer(index);
//     },
//   },
//   components: {
//     JointControl,
//     EndSet,
//     EditPoints,
//     // EditSpeed,
//   },
// };
// </script>
// <style scoped lang="scss">
// .root-wrapper {
//   position: absolute;
//   width: 276px;
//   // height: 100%;
//   height: 350px;
// }
// .end-col {
//   position: absolute;
//   right: 0px;
//   /*width: 20vw;*/
//   // width: 276px;
//   // height: 100%;
//   // height: 350px;
//   width: 100%;
//   height: 260px;
//   background: #434343;
// }
// // .dark-backgroud {
// //   background: #434343;
// //   /*height: 36vh;*/
// // }
// .header-text {
//   // font-size: 1rem;
//   font-size: 13px;
//   color: white;
//   letter-spacing: -1px;
//   height: 39px;
//   line-height: 39px;
//   padding-left: 12px;
// }
// .degree-text {
//   color: white;
//   text-align: right;
//   font-size: 10px;
//   position: absolute;
//   top: 14px;
//   right: 14px;
//   font-family: 'Gotham-Medium';
// }
// .joint-control {
//   // width: 270px;
//   width: 100%;
//   display: flex;
//   // right: 0px;
//   left: 0px;
//   // margin: auto;
//   flex-direction: column;
//   // justify-content: space-between;
//   // position: relative;
//   position: absolute;
//   margin-top: 256px;
//   height: 100%;
//   background: #434343;
// }
// // .block {
// //   padding: 0.2vw 1vw;
// // }
// .title-ide {
//   font-family: 'Gotham-Bold';
//   font-size: 36px;
//   color: #444;
//   letter-spacing: -1px;
//   padding-left: 2%;
//   width: 100%;
// }
// .title-online {
//   margin-right: 1vw;
//   font-size: 1.2rem;
//   font-family: Gotham-Medium;
//   color: #434343;
//   letter-spacing: -0.5px;
// }
// .container-title {
//   padding: 1vh 1vw .6vh;
//   font-size: 14px;
//   color: #fff;
//   letter-spacing: -0.58px;
// }
// </style>
