<template>
  <div class="app-root">
    <div class="icon-expand" @click="showPanel()" v-if="$route.name !== 'Home'" :style="{height: model.commonStatusMgr.panelIsHidden === true ? '60px': '20px'}"></div>
    <div  class="app-panel" v-if="model.commonStatusMgr.panelIsHidden === false" >
      <div id="app-panel-id" @click="model.commonStatusMgr.visibleNavInfoListMenu = false">
        <!-- <div style="background: #323232;text-align: right;font-size: 10px;" @click="showPanel()"><i class="el-icon-caret-left"></i></div> -->

      <!--<div class="icon-expand" @click="showPanel()" v-if="$route.name !== 'Home'"></div>-->
      <!--<div id="app-panel-id" class="app-panel" v-if="model.commonStatusMgr.panelIsHidden === false">-->
        <!--<div style="background: #323232;text-align: right;font-size: 10px;" @click="showPanel()"  v-if="$route.name !== 'Home'"><i class="el-icon-caret-left"></i></div>-->

        <el-tooltip class="item" effect="dark" :content="$t('home')" placement="right" :manual="model.commonStatusMgr.isMobile">
          <div @click="changeRouter('Home')" class="icon-wrapper" :class="{'app-menu-bg-selected': curRouteName === 'Home'}">
            <span class="app-home com-icon"></span>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('control')" placement="right" :manual="model.commonStatusMgr.isMobile">
          <div @click="changeRouter('Emulator')" class="icon-wrapper"  :class="{'app-menu-bg-selected': curRouteName === 'Emulator'}">
            <span class="app-ctrl com-icon"></span>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('blockly')" placement="right" :manual="model.commonStatusMgr.isMobile">
          <div @click="changeRouter('Blockly')" class="icon-wrapper" :class="{'app-menu-bg-selected': curRouteName === 'Blockly'}">
            <span class="app-blockly com-icon" ></span>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('recording')" placement="right" :manual="model.commonStatusMgr.isMobile">
          <div @click="changeRouter('Teach')" class="icon-wrapper" :class="{'app-menu-bg-selected': curRouteName === 'Teach'}">
            <span class="app-recording com-icon"></span>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('ide')" placement="right" :manual="model.commonStatusMgr.isMobile">
          <div @click="changeRouter('Editor')" class="icon-wrapper" :class="{'app-menu-bg-selected': curRouteName === 'Editor'}">
            <span class="app-ide com-icon" ></span>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('paint')" placement="right" :manual="model.commonStatusMgr.isMobile">
          <div @click="changeRouter('Paint')" class="icon-wrapper" :class="{'app-menu-bg-selected': curRouteName === 'Paint'}">
            <span class="app-paint com-icon"></span>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="Test" placement="right" :manual="model.commonStatusMgr.isMobile">
          <div @click="changeRouter('Test')" class="icon-wrapper" :class="{'app-menu-bg-selected': curRouteName === 'Test'}">
            <span class="com-icon">TEST</span>
          </div>
        </el-tooltip>
        <!--<div @click="changeRouter('StudioInfo')" class="app-recording com-icon" :class="{'app-menu-bg-selected': curRouteName === 'StudioInfo'}">StudioInfo</div>-->
        <!--<div @click="changeRouter('LogInfo')" class="app-recording com-icon" :class="{'app-menu-bg-selected': curRouteName === 'LogInfo'}">LogInfo</div>-->
        <!--<div @click="changeRouter('SoftwareUpdate')" class="app-recording com-icon" :class="{'app-menu-bg-selected': curRouteName === 'SoftwareUpdate'}">SoftwareUpdate</div>-->
        <!--<div @click="showMenu()">-->
          <!--<span class="app-menu com-icon"></span>-->
        <!--</div>-->
      </div>
      <!-- <div @click="changeRouter('Profile')" class="" v-if="hasProfile !== ''">
        <span class="app-profile com-icon"></span>
      </div> -->
      <el-popover
        class="app-menu-popover com-icon"
        placement="right"
        trigger="click"
        v-model="model.commonStatusMgr.visibleNavInfoListMenu"
        popper-class="info-list"
      >
        <div>
          <!--<div class="avatar"></div>-->
          <!--<div class="username">-->
          <!--{{ username }}-->
          <!--</div>-->
          <div class="search-wrapper">
            <div v-if="!isConnected" class="sub-search-wrapper">
              <!--<span>xArm IP:</span>-->
              <div class="input-wrapper">
                <input class="search-input" v-model="xArmAddress" type="text"/>
                <button class="search-btn" :class="isSearch ? 'el-icon-loading' : 'el-icon-search'" @click="searchAddress()" style="color: #fff;cursor: pointer;"></button>
              </div>
              <button class="connect-btn connected" @click="connect(xArmAddress)">{{ $t('connect') }}</button>
            </div>
            <div class="sub-search-wrapper" v-else>
              <!--<span>xArm IP:</span>-->
              <div class="input-wrapper">
                <input class="search-input" v-model="xArmAddress" disabled type="text"/>
                <button class="search-btn el-icon-search" style="color: rgba(223,223,223,0.85);;pointer-events: none;"></button>
              </div>
              <button class="connect-btn disconnect" @click="disconnect()">{{ $t('disconnect') }}</button>
            </div>
            <ul class="xArm-list" v-show="showAddress">
              <li @click="selectAdress(value.device)" v-for="(value, index) in addressList" :key="index">{{ index % 2 == 0 ? '☆' : '★' }}: {{ value.device }}</li>
            </ul>

          </div>
          <ul class="info-list-ul" @click="model.commonStatusMgr.visibleNavInfoListMenu = false">
            <li class="setting" @click="changeRouter('Setting')">{{ $t('setting') }}</li>
            <!-- <li class="teach">{{ $t('teach') }}</li>
            <li class="feedback">{{ $t('feedback') }}</li> -->
            <a :href="'mailto:info@ufactory.cc?subject=xArmStudio&body=' + genEmailContent()"><li class="feedback">{{ $t('feedback') }}</li></a>
            <!-- <li class="feedback"><a :href="'mailto:info@ufactory.cc?subject=xArmStudio&body=' + genEmailContent()">{{ $t('feedback') }}</a></li> -->
            <li v-if="isConnected" class="power_off" @click="showPowerOffDialog()">{{ $t('powerOff') }}</li>
            <li class="about" @click="showAboutDialog()">{{ $t('about') }}</li>
          </ul>
        </div>
        <!--<el-button slot="reference">click 激活</el-button>-->
        <div slot="reference">
          <span class="app-menu"></span>
        </div>
      </el-popover>
    </div>
    <dialog-about v-if="aboutDialogVisible" :showAboutDialog="showAboutDialog"></dialog-about>
    <DialogPowerOff v-if="powerOffVisible" :showPowerOffDialog="showPowerOffDialog"></DialogPowerOff>
  </div>
</template>

<script>
import DialogAbout from '../dialog/DialogAbout';
import DialogPowerOff from '../dialog/DialogPowerOff';
export default {
  i18n: {
    messages: {
      en: {
        editing: 'Points is editing!',
        connect: 'xArmConnect',
        disconnect: 'xArmDisconnect',
        setting: 'Setting Information',
        teach: 'Teaching Example',
        feedback: 'Feedback',
        about: 'About UFACTORY',
        home: 'Home',
        control: 'Control',
        blockly: 'AppEditor',
        recording: 'Recording',
        ide: 'IDE',
        paint: 'Paint',
        terminal: 'Terminal',
        powerOff: 'Power Off',
        runningTip: 'Project is running!'
      },
      cn: {
        editing: '正在编辑!',
        connect: '连接机械臂',
        disconnect: '断开机械臂',
        setting: '配置信息',
        teach: '示例教程',
        feedback: '反馈',
        about: '关于 UFACTORY',
        home: '主页',
        control: '控制',
        blockly: '应用编辑器',
        recording: '录制',
        ide: '集成开发环境',
        paint: '画板',
        terminal: '终端',
        powerOff: '关机',
        runningTip: '项目正在运行！',
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
    DialogAbout,
    DialogPowerOff,
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
    changeRouter(router) {
      console.log(`change Router this $route name = ${this.$route.name}`);
      if (this.$route.name === 'Teach') {
        if (this.model.localTeach.isTeachRunningUUID !== '') {
          this.$message({
            message: 'Recording is running!',
            duration: 1000,
          })
          return;
        }
        if (this.model.localTeach.hasChange && this.model.localTeach.curSelectedIndex >= 0) {
          this.$message({
            message: this.$t('editing'),
            duration: 1000,
          })
          return;
        }
        if (router === 'Teach') {
          this.model.commonStatusMgr.panelIsHidden = true;
          return;
        }
      }
      this.model.localTeach.editState = false;
      const doSomeThing = () => {
        if (router === this.$route.name) {
          if (router === 'Home') {
            this.model.commonStatusMgr.panelIsHidden = false;
          }
          else {
            this.model.commonStatusMgr.panelIsHidden = true;
          }
          return;
        }
        this.$router.push({ name: router });
        this.model.commonStatusMgr.visibleNavInfoListMenu = false;
        if (router === 'Home') {
          this.model.commonStatusMgr.panelIsHidden = false;
        }
        else {
          this.model.commonStatusMgr.panelIsHidden = true;
        }
      }
      if (this.$route.name === 'Blockly') {
        if (router === 'Blockly') {
          this.model.commonStatusMgr.panelIsHidden = true;
          return;
        }
        const isBack = this.model.localAppsMgr.quitPage(() => {
          doSomeThing();
        });
        return;
      }
      if (this.$route.name === 'Paint') {
        if (this.model.localPaintMgr.state.isRunnningPrint) {
          this.$message({
            message: this.$t('runningTip'),
            type: 'warning',
            duration: 1000,
          });
          return;
        }
        if (router === 'Paint') {
          this.model.commonStatusMgr.panelIsHidden = true;
          return;
        }
        this.model.localPaintMgr.quitPage(() => {
          doSomeThing();
        });
        return;
      }
      // if (this.$route.name === 'Editor') {
      //   if ((this.model.ideModel.consoleItems || []).some((element) => { return element.run === true })) {
      //     this.$message({
      //       message: this.$t('runningTip'),
      //       type: 'warning',
      //       duration: 1000,
      //     });
      //     return;
      //   }
      //   if (router === 'Editor') {
      //     this.model.commonStatusMgr.panelIsHidden = true;
      //     return;
      //   }
      // }
      doSomeThing();
    },
    showMenu() {
      this.model.commonStatusMgr.visibleNavInfoListMenu = !this.model.commonStatusMgr.visibleNavInfoListMenu;
    },
    showPanel() {
      this.model.commonStatusMgr.panelIsHidden = !this.model.commonStatusMgr.panelIsHidden;
      this.model.commonStatusMgr.visibleNavInfoListMenu = false;
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
    curRouteName() {
      return this.$route.name;
    },
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

<style scoped lang="scss">
.app-root {
  position: absolute;
  // width: 60px;
  z-index: 5000;
  /*height: 550px;*/
  height: 100%;
  display: flex;
  .icon-expand {
    /*height: 10px;*/
    width: 100px;
    height: 60px;
    display: inline-flex;
    justify-content: flex-end;
    z-index: 999;
    position: fixed;
    top: 0;
    cursor: pointer;
  }
  .app-panel {
    // background: #666;
    background: #707070;
    width: 60px;
    /*width: 30px;*/
    height: 100%;
    color: white;
    z-index: 99;
    // margin-top: 36px;
    .icon-wrapper {
      border-bottom: 1px solid #616161;
      cursor: pointer;
    }
    .com-icon {
      display: block;
      height: 30px;
      width: 30px;
      padding: 36px 0;
      margin: 0 auto;
      cursor: pointer;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 30px 30px;
    }
    .app-home {
      background-image: url("../../assets/img/comNav/nav_home.svg");
    }
    .app-ctrl {
      background-image: url("../../assets/img/comNav/nav_control.svg");
    }
    .app-blockly {
      background-image: url("../../assets/img/comNav/nav_blockly.svg");
    }
    .app-ide {
      background-image: url("../../assets/img/comNav/nav_ide.svg");
    }
    .app-paint {
      background-image: url("../../assets/img/comNav/nav_paint.svg");
    }
    .app-recording {
      background-image: url("../../assets/img/comNav/nav_recording.svg");
    }
    .app-profile {
      /*background-image: url("../../assets/img/comNav/nav_recording.svg");*/
      position: absolute;
      bottom: 55px;
      left: 14px;
      border-radius: 50%;
      background-color: #e4e4e4;
      padding: 0;
    }
  }
  .app-menu-popover {
    position: absolute;
    bottom: 10px;
    left: 14px;
    padding: 0 !important;
    background-image: url("../../assets/img/comNav/nav_menu.svg");
    cursor: pointer;
    z-index: 999;
    .app-menu {
      display: block;
      height: 30px;
      width: 30px;
      margin: 0 auto;
      cursor: pointer;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 30px 30px;
    }
  }
}
.app-menu-bg-selected {
  background: #888;
}
</style>
<style lang="scss">
  .info-list {
    left: 47px !important;
    // background: #6f6f6f;
    background: #777777;
    border: none;
    width: 300px;
    height: 230px;
    z-index: 99;
    color: #fff;
    padding: 10px 0;
    .avatar {
      background: yellow;
      width: 80px;
      height: 80px;
    }
    .username {
    }
    .info-list-ul {
      position: absolute;
      bottom: 5px;
      width: 100%;
      li {
        padding-left: 70px;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        background-repeat: no-repeat;
        background-position: 20px;
        background-size: auto;
      }
      li:hover {
        background-color: #555;
        }
      .setting {
        background-image: url("../../assets/img/comNav/nav_setting.svg");
      }
      .teach {
        background-image: url("../../assets/img/comNav/nav_teach.svg");
      }
      .feedback {
        background-image: url("../../assets/img/comNav/nav_feedback.svg");
        color: white;
        // a {
        //   color: white;
        // }
      }
      .about {
        background-image: url("../../assets/img/comNav/nav_about.svg");
      }
      .power_off {
        background-image: url("../../assets/img/comNav/nav_power_off.svg");
      }
    }
    .robot-setting {
      position: absolute;
      left: 300px;
      bottom: 0;
    }
    .search-wrapper {
      display: flex;
      justify-content: space-between;
      .sub-search-wrapper {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        .input-wrapper {
          position: relative;
          border: 1px solid #fff;
          .search-btn {
            border: none;
            outline: none;
            width: 40px;
            height: 40px;
            position: absolute;
            right: 0;
            top: 0;
          }
          .search-btn:active ,search-btn:hover{
            background: #939292;
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
            color:#fff;
            background: #6e6d6d;
            height: 40px;
            line-height: 40px;
        }
        .search-input:disabled {
          color: #fff;
          background: #6e6d6d;
        }
      }
    }

      .connect-btn {
        padding: 5px 10px;
        border-radius: 10px;
        font-size: 13px;
        color: #fff;
        // width: 82px;
        width: 120px;
        height: 40px;
        outline: none;
        cursor: pointer;
        border: 1px solid #fff;
    }
    .connect-btn:hover {
      background-color: #555;
    }
      .connected {
        /*background: #E24D4A url("../../assets/img/home/icon_disconnect.svg") no-repeat center 10px;*/
        background: #5b5b5b;
    }
      .disconnect {
      /*background: #52BF53 url("../../assets/img/home/icon_connecting.svg") no-repeat center 10px;*/
    }
  }
    .xArm-list {
      position: absolute;
      /*left: 16px;*/
      top: 58px;
      opacity: 0.99;
      font-family: 'Gotham-Book';
      font-size: 10px;
      color: #fff;
      text-align: left;
      /*width: 206px;*/
      width: 100%;
      max-height: 210px;
      overflow-y: auto;
      background: #666;
      z-index: 999;
      li {
        height: 28px;
        line-height: 28px;
        cursor: pointer;
        padding-left: 20px;
        /*background: #E1E2E2;*/
    }
      li:hover {
        background: #969696;
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
