<template>
  <div class="home-wrapper com-text-center com-module-wrapper">
    <!-- <section class="home-header">
      <div>.home-slogan
        <div class="search-wrapper" v-if="!isConnected">
          <button class="search-btn search-black-icon" @click="searchAddress()"></button>
          <input class="search-input" v-model="xArmAddress" type="text"/>
          <button class="connect-btn connected" @click="connect(xArmAddress)">{{ $t('connect') }}</button>
        </div>
        <div class="search-wrapper" v-else style="background-color: #e4e4e4">
          <button class="search-btn search-gray-icon"></button>
          <input class="search-input" v-model="xArmAddress" disabled type="text"/>
          <button class="connect-btn disconnect" @click="disconnect()">{{ $t('disconnect') }}</button>
        </div>
        <ul class="xArm-list" v-show="showAddress">
          <li @click="selectAdress(value.device)" v-for="(value, index) in addressList" :key="index">{{ index }}: {{ value.device }}</li>
        </ul>
      </div>
      <router-link :to="{name: 'Emulator'}" class="emulator-icon">
      </router-link>
    </section> -->
    <section class="section1-wrapper com-text-center com-gradual-middle">
      <!-- <img class="img-block" :src="fileIcon.img_xarm" draggable="false"/>-->
      <div class="home-slogan">
        <img v-if="model.robot.state.info.xarm_axis === 5" src="../assets/img/home/xarm5.png" draggable="false"/>
        <img v-if="model.robot.state.info.xarm_axis === 6" src="../assets/img/home/xarm6.png" draggable="false"/>
        <img v-if="model.robot.state.info.xarm_axis === 7" src="../assets/img/home/xarm7.png" draggable="false"/>
        <img src="../assets/img/home/explore_life.svg" draggable="false"/>
     
        <!--<div class="connect-state" style="border: 1px solid rgba(16,167,25,0.75);" v-if="isConnected" @click="model.commonStatusMgr.visibleNavInfoListMenu = true">{{ $t('connected') }}</div>
        <div class="connect-state" v-else style="border: 1px solid rgba(85,85,85,0.32);color: rgba(85,85,85,0.32)" @click="model.commonStatusMgr.visibleNavInfoListMenu = true">{{$t('unconnect')}}</div> -->
        <CommonSearchIp></CommonSearchIp>
      </div>
    </section>
    <section class="section2-wrapper com-text-center">
      <div class="box1-wrapper ">
      
        <router-link class=" btn_control" :to="{ name: 'Control'}">{{ $t('control') }}</router-link>
        <router-link class=" btn_blockly" :to="{ name: 'Blockly-test'}">{{ $t('blockly') }}</router-link>
        <router-link class=" btn_setting" :to="{ name: 'Setting1'}">{{ $t('setting') }}</router-link>
        <a class=" btn_power" @click="showPowerOffDialog()">{{ $t('powerOff') }}</a>
      </div>
    </section>
     <DialogPowerOff v-if="powerOffVisible" :showPowerOffDialog="showPowerOffDialog"></DialogPowerOff>
   
  </div>
</template>

<script>
import ComStop from './common/ComStop';
import DialogPowerOff from './dialog/DialogPowerOff';
import CommonSearchIp from './common/CommonSearchIp';

// import * as types from '../store/mutation-types';

export default {
  i18n: {
    messages: {
      en: {
        connected: 'Connected',
        unconnect: 'Not Connected',
        home_slogan: 'EXPLORE THE FUTURE LIFE',
        axesMsg: 'The current arm is ',
        axes: ' axes.',
        control: "Live Control",
        blockly: "Blockly",
        setting: "Settings",
        powerOff: "Power OFF/Restart"
      },
      cn: {
        connected: '连接成功',
        unconnect: '未连接',
        home_slogan: '未来，集于一身',
        axesMsg: '当前机械臂是',
        axes: '轴.', //
        control: "实时控制",
        blockly: "Blockly",
        setting: "设置",
        powerOff: "关机/重启"
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      powerOffVisible: false,
      // xArmAddress: this.$store.state.robot.info.port,
      profile: window.profile,
      userId: window.GlobalConstant.userId,
      fileIcon: {
        img_xarm: require('@/assets/img/home/img_xarm.jpg'),
        icon_shopping: require('@/assets/img/home/icon_shopping.svg'),
        icon_developers: require('@/assets/img/home/icon_developers.svg'),
        icon_setting: require('@/assets/img/home/icon_setting.svg'),
      },
    };
  },
  created() {
    // if (this.$store.state.robot.info.port !== null || this.$store.state.robot.info.port !== '' || this.$store.state.robot.info.port !== undefined) {
    //   // this.xArmAddress = this.$store.state.robot.info.port;
    //   console.log('ssdfddddddf', this.$store.state.robot.info.port);
    // }
  },
  mounted() {
    const data = this.$route.params.data;
    if (data === 'reload') {
      window.location.reload();
    }
    this.userId = window.GlobalConstant.userId;
    // if (this.model.commonStatusMgr.showAxisMsg) {
    //   this.model.commonStatusMgr.showAxisMsg = false;
    //   if (this.model.commonStatusMgr.notifyInstance !== undefined && this.model.commonStatusMgr.notifyInstance !== null) {
    //     this.model.commonStatusMgr.notifyInstance.close();
    //     this.model.commonStatusMgr.notifyInstance = null;
    //   }
    //   setTimeout(() => {
    //     if (this.model.commonStatusMgr.notifyInstance !== undefined && this.model.commonStatusMgr.notifyInstance !== null) {
    //       this.model.commonStatusMgr.notifyInstance.close();
    //       this.model.commonStatusMgr.notifyInstance = null;
    //     }
    //     this.model.commonStatusMgr.notifyInstance = this.$message({
    //       type: 'info',
    //       showClose: true,
    //       duration: 0,
    //       message: `${this.$t('axesMsg')}${this.model.robot.state.info.xarm_axis}${this.$t('axes')}`,
    //     });
    //     this.model.commonStatusMgr.showAxisMsg = false;
    //   }, 500);
    // }
  },
  methods: {
   showPowerOffDialog() {
     this.powerOffVisible = !this.powerOffVisible;
      // this.model.commonStatusMgr.panelIsHidden = true;
    },
  },
  computed: {
    isConnected() {
      return this.$store.state.robot.status.connected;
    },
//    searchBtn: () => ({
//      'search-black-icon': window.GlobalUtil.store.state !== undefined ? !window.GlobalUtil.store.state.robot.status.connected : false,
//      'search-gray-icon': window.GlobalUtil.store.state !== undefined ? window.GlobalUtil.store.state.robot.status.connected : false,
//    }),
    // xArmAddress: {
    //   get() {
    //     // return this.$store.state.robot.status.connected
    //     // this.xArmAddress = this.$store.state.robot.info.port;
    //     return  window.GlobalUtil.store.state !== undefined? window.GlobalUtil.store.state.robot.info.port : '';
    //   },
    //   set(value) {
    //   },
    // },
  },
  components: {
    ComStop,
    DialogPowerOff,
    CommonSearchIp,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.home-wrapper {
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  .home-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: #EAEAEA;
    height: 60px;
    position: relative;
    .emulator-icon {
      display: inline-block;
      box-shadow: 0 2px 0 0 rgba(185,185,185,0.50);
      border-radius: 2px;
      width: 32px;
      height: 32px;
      background: #3E3E3E url("../assets/img/home/btn_control.svg") no-repeat center;
      margin-right: 80px;
    }
  }
  .section1-wrapper {
    width: 100%;
    height: 100%;
    // background: radial-gradient(48% 135%, #FFFFFF 50%, #E7E7E7 100%);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../assets/img/home/img_xarm.jpg");
    background-repeat: no-repeat;
    background-position: center right;
    background-size: cover;
    .img-block {
      width: 600px;
      margin-left: -100px;
    }
    .home-slogan {
      // margin-left: -100px;
      position: absolute;
      top: 12%;
      left: 10%;
      img {
        width: 335px;
        display: block;
        margin-bottom: 5vh;
      }
      .home-slogan-text {
        color: #595757;
        font-size: 24px;
        padding-bottom: 30px;
        line-height: 30px;
        display: block;
        font-weight: 600;
        font-family: 'Gotham-Medium';
        letter-spacing: -0.4px;
      }
    }
    .connect-state {
      width: 140px;
      padding: 10px;
      text-align: center;
      /*color: #fff;*/
      /*border:1px solid rgba(85, 85, 85, 0.8);*/
      border-radius: 10px;
    }
  }
  .section2-wrapper {
    width: 100%;
    height: 200px;
    // background-image: url("../assets/img/home/home_bg.svg");
    // background-repeat: no-repeat;
    // background-position: center right;
    // background-size: contain;

   
    .box1-wrapper {
      width: 100%;
      display: flex;
      justify-content: space-around;
      height: 100%;
      /*margin: 2rem 0;*/
      background: linear-gradient(0deg,#727272,#727272,#727272,#727272, #727272,#727272,#727272,#727272,#a8a8a8);
      border-radius: 20px 20px 0 0;
      &>a {
        flex-direction: column;
        justify-content: space-around;
        border-right: 1px solid #979797;
        width: 100%;
        // color: #fff;
       
        cursor: pointer;
        transition: all .2s;
        background-repeat: no-repeat;
        background-position: center 20px;
        background-size: 70px;
        padding: 110px 0 10px;
        text-align: center;
        color: #fff;
         
  
      }
      &>a:last-child{
        border-right: none;
      }
      a:hover {
        /*transform: scale(1.1,1.1);*/
        // background-color: rgba(85,85,85,0.9);
      }
      .btn_control {
        background-image:url("../assets/img/home/icon_control.svg")
      }
      .btn_blockly {
        background-image:url("../assets/img/home/icon_blockly.svg")
      }
      .btn_setting {
        background-image:url("../assets/img/home/icon_setting.svg")
      }
      .btn_power {
        background-image:url("../assets/img/home/icon_power.svg")
      }
    }
  }
}
input[disabled]{ background: #e4e4e4}

@media screen and (max-width:1200px) {
  .section1-wrapper {height: 75%}
}
@media screen and (min-width: 1200px) {
  .section1-wrapper {height: 80%}
}



</style>
