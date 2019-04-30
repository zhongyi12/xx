// <template>
//   <div id='root' class="root-wrapper">
//     <div class="block end-range config-wrapper">
//       <span class="config-title">{{ $t('speed') }}</span>
//       <img src="./../../assets/img/control/icon_speed3.svg" alt="">
//       <input type="range" v-model="speed" @change="setSpeed" :step="1" :max="model.robot.state.info.xarm_limit_velo[1]" :min="model.robot.state.info.xarm_limit_velo[0]">
//       <img src="./../../assets/img/control/icon_speed2.svg" alt="">
//       <span class="config-value" v-text="speed"></span>
//     </div>
//     <div class="block end-range config-wrapper">
//       <span class="config-title">{{ $t('acceleration') }}</span>
//       <img src="./../../assets/img/control/icon_speed3.svg" alt="">
//       <input type="range" v-model="acceleration" @change="setSpeed" :step="1" :max="model.robot.state.info.xarm_limit_acc[1]" :min="model.robot.state.info.xarm_limit_acc[0]">
//       <img src="./../../assets/img/control/icon_speed2.svg" alt="">
//       <span class="config-value" v-text="acceleration"></span>
//     </div>
//   </div>
// </template>

// <script>

// export default {
//   name: 'PointsEdit',
//   data() {
//     return {
//       model: window.GlobalUtil.model,
//       speed: 0,
//       acceleration: 0,
//     };
//   },
//   mounted() {
//     this.speed = Number(this.model.robot.state.remote.speed);
//     this.acceleration = Number(this.model.robot.state.remote.acceleration);
//   },
//   activated: function() {
//   },
//   beforeDestroy() {
//   },
//   methods: {
//     setSpeed() {
//       console.log('setSpeed setSpeed');
//       this.model.robot.state.local.speed = Number(this.speed);
//       this.model.robot.state.local.acceleration = Number(this.acceleration);
//       window.CommandsRobotSocket.setParamsSpeedAcceleration((dict) => { console.log(dict) });
//     },
//   },
//   watch: {
//   },
//   computed: {
//   },
//   components: {
//   },
// };
// </script>

// <style scoped lang="scss">
// $fontColor: gray; // #FFFFFF;
// .root-wrapper {
//   position: absolute;
//   width: 320px;
//   height: 80px;
//   // border: 1px solid #DCDCDC;
//   background: #D7D7D7;
// }
// .config-title {
//   width: 152px !important;
//   text-align: right !important;
//   padding: 0 !important;
// }
// img {
//   padding: 0 6px;
//   width: 10%;
// }
// input[type=range] {
//   height: 8px;
//   width: 100%;
//   outline: none;
//   border-radius: 100px;
//   background-image: linear-gradient(90deg, #FFFEAD 0%, #FF6868 100%);
// }
// input[type=range]::-webkit-slider-thumb {
//   width: 22px;
//   height: 22px;
//   -webkit-appearance: none;
//   border: none;
//   border-radius: 50%;
//   background: #FEFEFE;
//   box-shadow: 0 0 8px 0 rgba(214,214,214,0.50);
// }
// .block {
//   color: $fontColor;
//   // padding: 30px;
//   // padding-bottom: 30px;
//   // padding: 8px 6px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   height: 35px;
// }
// .config-value {
//   width: 74px !important;
//   padding:6px 0;
//   background: #565656;
//   border-radius: 2px;
//   font-family: Gotham-Book;
//   font-size: 12px;
//   color: #FFF;
//   letter-spacing: -0.75px;
//   text-align: center;
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
// .mm-unit,.end-range sup {
//   color: $fontColor;
//   font-size: 12px;
//   width: 40px;
//   text-align: right;
// }
// sup {
//   margin-top: -12px;
//   text-align: left !important;
// }
// </style>
