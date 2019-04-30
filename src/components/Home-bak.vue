<template>
  <div class="home-wrapper com-text-center com-module-wrapper">
    <section class="home-header">
      <div>
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
      <!--<div>-->
        <!--<ComStop></ComStop>-->
      <!--</div>-->
    </section>
    <section class="section1-wrapper com-text-center com-gradual-middle">
      <img class="img-block" :src="fileIcon.img_xarm"/>
    </section>
    <section class="section2-wrapper com-font-GB-22 com-text-center">
      <div class="box1-wrapper ">
        <router-link class="com-text-center" :to="{ name: 'AppStore'}"><img :src="fileIcon.icon_shopping" alt="shopping"/>{{ $t('appStore') }}</router-link>
        <router-link class="com-text-center" :to="{ name: 'EditHome'}"><img :src="fileIcon.icon_developers" alt="developers"/>{{ $t('edit') }}</router-link>
        <router-link class="com-text-center" :to="{ name: 'Setting'}"><img :src="fileIcon.icon_setting" alt="setting"/>{{ $t('setting') }}</router-link>
      </div>
    </section>
    <!-- <router-link :to="{ name: 'Joystick'}">
      <button>Joystick</button>
    </router-link> -->
  </div>
</template>

<script>
import ComStop from './common/ComStop';
// import * as types from '../store/mutation-types';

export default {
  i18n: {
    messages: {
      en: {
        connect: 'Connect',
        disconnect: 'Disonnect',
        appStore: 'APP STORE',
        edit: 'EDITOR',
        setting: 'SETTING',
      },
      cn: {
        connect: '连接',
        disconnect: '断开',
        appStore: '应用商店',
        edit: '编辑',
        setting: '设置',
      },
    },
  },
  data() {
    return {
      // xArmAddress: this.$store.state.robot.info.port,
      addressList: [],
      model: window.GlobalUtil.model,
      showAddress: false,
      fileIcon: {
        img_xarm: require('@/assets/img/home/img_xarm.png'),
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
  },
  methods: {
    searchAddress() {
      console.log('sffff');
      window.GlobalUtil.socketCom.sendCmd('get_list_ports', { data: '' }, (response) => {
        const listPort = response.data;
        if (listPort.length > 0) {
          this.addressList = listPort;
          console.log('addressList', this.addressList);
          this.showAddress = true;
        }
        else {
          console.log('listPort error===', response);
        }
      });
    },
    selectAdress(value) {
      this.xArmAddress = value;
      this.showAddress = false;
    },
    disconnect() {
      window.GlobalUtil.socketCom.sendCmd('disconnect_port', { data: '' }, (response) => {
        const disconnect = response.data;
        if (disconnect) {
          console.log('disconnect_port', disconnect);
        }
        else {
          console.log('disconnect error', response);
        }
      });
    },
    connect(port) {
      window.GlobalUtil.socketCom.sendCmd('connect_port', { data: { port: port } }, (response) => {
        const connect = response.data;
        if (connect) {
          console.log('connect_port', connect);
        }
        else {
          console.log('connect error', response);
        }
      });
    },
  },
  computed: {
    isConnected() {
      return this.$store.state.robot.status.connected;
    },
    xArmAddress: {
      get() {
        return this.$store.state.robot.info.port;
      },
      set(value) {
        const data = this.$store.state.robot.info;
        data.port = value;
        // this.$store.commit(types.SET_ROBOT_INFO, data);
        window.GlobalUtil.model.robot.state.info = data;
      },
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
      .search-wrapper {
        display: flex;
        justify-content: space-between;
        border-radius: 100px;
        background-color: #fff;
        position: absolute;
        top: 0;
        .search-btn {
          border: none;
          outline: none;
          width: 40px;
          height: 40px;
          cursor: pointer;
        }
        .search-black-icon {
          background: url("../assets/img/home/icon_search_active.svg") no-repeat 14px 20px;
        }
        .search-gray-icon {
          background: url("../assets/img/home/icon_search_inactive.svg") no-repeat 14px 20px;
          pointer-events: none;
        }
        .search-input {
          border: none;
          outline: none;
          padding: 0 6px;
          width: 160px;
          font-size: 12px;
        }
        .connect-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          font-size: 9px;
          color: #fff;
          padding-top: 18px;
          border: none;
          outline: none;
          cursor: pointer;
        }
        .connected {
          background: #E24D4A url("../assets/img/home/icon_disconnect.svg") no-repeat center 10px;
        }
        .disconnect {
          background: #52BF53 url("../assets/img/home/icon_connecting.svg") no-repeat center 10px;
        }
      }
      .xArm-list {
        position: absolute;
        left: 16px;
        top: 58px;
        opacity: 0.49;
        font-family: 'Gotham-Book';
        font-size: 10px;
        color: #444;
        text-align: center;
        width: 206px;
        max-height: 30vh;
        overflow-y: auto;
        li {
          height: 28px;
          line-height: 28px;
          cursor: pointer;
          background: #E1E2E2;
        }
        li:hover {
          background: #DCDCDC;
        }
      }
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
      /*height: 82%;*/
      background: radial-gradient(48% 135%, #FFFFFF 50%, #E7E7E7 100%);
      img {
        width: 30%;
        margin:0 auto;
      }
    }
    .section2-wrapper {
      width: 80%;
      height: 18%;
      min-height: 140px;
      .box1-wrapper {
        width: 100%;
        display: flex;
        justify-content: space-around;
        /*margin: 2rem 0;*/
        &>a {
          flex-direction: column;
          justify-content: space-around;
          border-right: 1px solid #979797;
          width: 100%;
          color: #444;
          font-family: 'Gotham-Bold';
          cursor: pointer;
          transition: all .2s;
          img {
            width: 3.6rem;
            padding-bottom: 1.4rem;
          }
        }
        &>a:last-child{
          border-right: none;
        }
        a:hover {
          /*transform: scale(1.1,1.1);*/
          color: #4a90e2;
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
