// <template>
//   <div class="control-container">
//     <div :class="['control-block', { comDisableEvent: isOnline === false || model.localTeach.isTeachRunningUUID !== '' }]">
//       <!-- end set -->
//       <div class="block-title">{{ $t('record.positionAttitude') }}</div>
//       <div class="control-wrapper">
//         <EndSet style=""></EndSet>
//       </div>
//     </div>
//     <div style="width:100%;height:2px;background:#F8F8F8;"></div>
//     <!-- joint -->
//     <div :class="['control-block', { comDisableEvent: model.localTeach.isTeachRunningUUID !== '' || isTimer }]">
//       <div class="block-title">
//         {{ $t('record.jointsControl') }}
//       </div>
//       <div class="control-wrapper" style="height:280px;margin-left:20px;margin-bottom:10px;">
//         <JointControl></JointControl>
//       </div>
//     </div>
//     <div style="width:100%;height:5px;background:#F8F8F8;"></div>
//     <!-- speed -->
//     <div :class="['control-block', { comDisableEvent: false }]" v-if="model.localTeach.isTeachRunningUUID !== ''">
//       <div class="control-wrapper">
//         <EditSpeed></EditSpeed>
//       </div>
//     </div>
//     <!-- edit button -->
//     <div v-if="model.localTeach.curSelectedIndex >= 0">
//       <EditPoints></EditPoints>
//     </div>
//   </div>
// </template>
// <script>

// import * as types from '../../store/mutation-types';
// import JointControl from './JointControl';
// import EndSet from './EndSet';
// import EditPoints from './../Teach/EditPoints';
// import EditSpeed from './../Teach/EditSpeed';

// export default {
//   name: 'EmulatorControl',
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
//     EditSpeed,
//   },
// };
// </script>
// <style scoped lang="scss">

// // $fontColor : #444;
// $fontColor: #FFFFFF;
// .block-title {
//   width: 100%;
//   height: 30px;
//   line-height: 30px;
//   background: #3C3C3C;
//   font-family: 'Gotham-Medium';
//   font-size: 12px;
//   color: #FFFFFF;
//   letter-spacing: -0.28px;
//   text-align: center;
// }
// .control-container {
//   background: #434343;
//   color: #444;
//   height: 100%;
//   overflow: hidden;
// }
// </style>

