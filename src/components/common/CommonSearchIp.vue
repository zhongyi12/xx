<template>
  <div class="app-root">
    
      <div class="search-wrapper">
        <div v-if="!isConnected" class="sub-search-wrapper">
      
          <div class="input-wrapper">
          <button class="search-btn" :class="isSearch ? 'el-icon-loading' : 'el-icon-search'" @click="searchAddress()" style="color: #67c23a;cursor: pointer;"></button>
            <input class="search-input" v-model="xArmAddress" type="text"/>
            
          </div>
          <button class="connect-btn connected" @click="connect(xArmAddress)">{{ $t('connect') }}</button>
        </div>
        <div class="sub-search-wrapper" v-else>
      
          <div class="input-wrapper">
            <button class="search-btn el-icon-search" style="color: #d1d1d1"></button>
            <input class="search-input" v-model="xArmAddress" disabled type="text"/>
          
          </div>
          <button class="connect-btn disconnect" @click="disconnect()">{{ $t('disconnect') }}</button>
        </div>
        <ul class="xArm-list" v-show="showAddress">
          <li @click="selectAdress(value.device)" v-for="(value, index) in addressList" :key="index">{{ index % 2 == 0 ? '☆' : '★' }}: {{ value.device }}</li>
        </ul>

      </div>

  </div>
</template>

<script>

export default {
  i18n: {
    messages: {
      en: {
        connect: 'xArm Connect',
        disconnect: 'xArm Disconnect',
      },
      cn: {
        
        connect: '连接机械臂',
        disconnect: '断开机械臂',
    
      },
    },
  },
  data() {
    return {
      addressList: [],
      model: window.GlobalUtil.model,
      showAddress: false,
      username: window.GlobalConstant.userId,
      aboutDialogVisible: false,
      powerOffVisible: false,
      isSearch: false,
    }
  },
  crested() {
  },
  mounted() {
    console.log('name', this.model.commonStatusMgr.isMobile);
  },
  components: {

  },
  methods: {
    genEmailContent() {
      const dict = {
        studioInfo: this.model.localSettingMgr.infoDatas.studioInfo,
        deviceInfo: this.model.localSettingMgr.infoDatas.deviceInfo,
      };
      return `*************************xArmStudio*************************%0A${JSON.stringify(dict)}%0A========================================%0A%0A`;
    },
    showAboutDialog() {
      this.aboutDialogVisible = !this.aboutDialogVisible;
      if (this.$route.name !== 'Home') {
        this.model.commonStatusMgr.panelIsHidden = true;
      }
    },
    showPowerOffDialog() {
      this.powerOffVisible = !this.powerOffVisible;
      if (this.$route.name !== 'Home') {
        this.model.commonStatusMgr.panelIsHidden = true;
      }
    },

    showMenu() {
      this.model.commonStatusMgr.visibleNavInfoListMenu = !this.model.commonStatusMgr.visibleNavInfoListMenu;
    },

    searchAddress() {
      if (this.isSearch) {
        return;
      }
      this.isSearch = true;
      const self = this;
      setTimeout( () => {
        self.isSearch = false;
      }, 5000)
      this.showAddress = true;
      window.GlobalUtil.socketCom.sendCmd('get_list_ports', { data: '' }, (response) => {
        const listPort = response.data;
        this.isSearch = false;
        if (listPort !== undefined && listPort !== null && listPort.length > 0) {
          this.addressList = listPort;
          console.log('addressList', this.addressList);
          if (!this.isConnected) {
            this.showAddress = true;
          }
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
      this.showAddress = false;
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
      if (this.$store.state.robot.status.connected) {
        window.CommandsSettingSocket.getDeviceInfo();
      }
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
    hasProfile() {
      const profile = GlobalUtil.getUrlParam('profile');
      return profile;
    }
  },
};
</script>

<style lang="scss">
    .search-wrapper {
      display: flex;
      justify-content: space-between;
      color: #555;
      position: relative;
      .sub-search-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        border: 1px solid #dcdcdc;
        border-radius: 6px;
        overflow: hidden;
       
       

        .input-wrapper {
          position: relative;
          background: #fff;
          width: 100%;
         
          // border-radius: 10px;
          .search-btn {
            border: none;
            outline: none;
            width: 40px;
            height: 40px;
           
          
          }
          .search-btn:active ,search-btn:hover{
            
          }
          .search-black-icon {
            background: url("../../assets/img/home/icon_search_active.svg") no-repeat 14px 10px;
          }
          .search-gray-icon {
            background: url("../../assets/img/home/icon_search_inactive.svg") no-repeat 14px 10px;
            pointer-events: none;
          }
          .search-input {
            border: none;
            outline: none;
            padding: 0 6px;
            width: 160px;
            font-size: 13px;
            background: none;
           
            height: 40px;
            line-height: 40px;
        }
        .search-input:disabled {
         
         
        }
      }
  

      .connect-btn {
        padding: 5px 10px;
        // border-radius: 10px;
        font-size: 13px;
       
        // width: 82px;
        width: 170px;
        height: 100%;
        outline: none;
        cursor: pointer;
        border: none;
        color: #fff;
    }
    // .connect-btn:hover {
    //   background-color: rgba(82, 191, 83, 0.6);
    // }
      .connected {
        background: #d1d1d1;

    }
    .connected:hover {
      background-color: rgba(209, 209, 209, 0.71);
    }
    .disconnect {
      background: #e27347;
    }
     .disconnect:hover {
       background-color: rgba(226, 115, 71, 0.74);
    }
  }
    .xArm-list {
      position: absolute;
      top: 42px;
      left: 0;
      opacity: 0.99;
     
      font-size: 10px;

      text-align: left;
      /*width: 206px;*/
      width: 100%;
      max-height: 210px;
      overflow-y: auto;
      background: #e8e8e8;
      z-index: 999;
      li {
        height: 28px;
        line-height: 28px;
        cursor: pointer;
        padding-left: 20px;
        /*background: #E1E2E2;*/
    }
      li:hover {
        background: #bbb;
    }
  }
    .xArm-list::-webkit-scrollbar {/*滚动条整体样式*/
      width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
    }
    .xArm-list::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: #D8D8D8;;
    }
    .xArm-list::-webkit-scrollbar-track {/*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(231,231,231,0.4);
      border-radius: 0;
      background: rgba(231,231,231,0.4);
    }
  }
</style>
