<template>
  <div class="setting-wrapper com-module-wrapper">
    <div class="com-header-wrapper" style="height: 68px;">
      <!--<router-link :to="{name: 'Home'}"><img class="com-icon-back" src="./../assets/img/common/icon_back.svg"/></router-link>-->
      <span class="com-back-title" v-if="model.commonStatusMgr.panelIsHidden === true"><i class=" el-icon-arrow-left"></i> {{ $t('setting') }}</span>
      <!--<img class="" src="./../assets/img/setting/icon_setting.svg" />-->
    </div>
    <section class="section1-wrapper ">
      <div class="box1-wrapper ">
        <!-- <a class="com-text-center">General</a> -->
        <span class="com-text-center" v-show="model.commonStatusMgr.settingPanel.infoPage.show" @click="showTab('studioInfo')" :class="{'setting-tab-selected': showTabName === 'studioInfo'}">{{ $t('studioInfo') }}</span>
        <span class="com-text-center" v-show="model.commonStatusMgr.settingPanel.updatePage.show" @click="showTab('softwareUpdate')" :class="{'setting-tab-selected': showTabName === 'softwareUpdate'}">{{ $t('softwareUpdate') }}</span>
        <span class="com-text-center" v-show="model.commonStatusMgr.settingPanel.logPage.show" @click="showTab('logInfo')" :class="{'setting-tab-selected': showTabName === 'logInfo'}">{{ $t('studioLog') }}</span>
        <span class="com-text-center" v-show="model.commonStatusMgr.settingPanel.networkPage.show && isXArmConnected" @click="showTab('network')" :class="{'setting-tab-selected': showTabName === 'network'}">{{ $t('network') }}</span>
        <span class="com-text-center" v-show="model.commonStatusMgr.settingPanel.terminalPage.show" @click="showTab('terminal')" :class="{'setting-tab-selected': showTabName === 'terminal'}">{{ $t('terminal') }}</span>
        <span class="com-text-center" v-show="model.commonStatusMgr.settingPanel.debugPage.show && isXArmConnected" @click="showTab('debug')" :class="{'setting-tab-selected': showTabName === 'debug'}">{{ $t('debug') }}</span>
      </div>
      <div class="box2-wrapper">
        <studio-info v-if="showTabName === 'studioInfo'"></studio-info>
        <software-update v-if="showTabName === 'softwareUpdate'"></software-update>
        <log-info v-if="showTabName === 'logInfo'"></log-info>
        <NetWork v-if="showTabName === 'network'"></NetWork>
        <WebSSH v-if="showTabName === 'terminal'"></WebSSH>
        <keep-alive><Debug v-if="showTabName === 'debug'"></Debug></keep-alive>
      </div>
    </section>
  </div>
</template>

<script>
import StudioInfo from './Setting/StudioInfo';
import LogInfo from './Setting/LogInfo';
import SoftwareUpdate from './Setting/SoftwareUpdate';
import WebSSH from './WebSSH';
import NetWork from './NetWork';
import Debug from './Setting/Debug';

export default {
  i18n: {
    messages: {
      en: {
        setting: 'Setting',
        general: 'General',
        terminal: 'SSH Tool',
        studioInfo: 'Studio Info',
        studioLog: 'Studio Log',
        softwareUpdate: 'Studio Update',
        network: 'NetWork',
        debug: 'Debug',
      },
      cn: {
        setting: '设置',
        general: 'General',
        terminal: 'SSH工具',
        studioInfo: '软件信息',
        studioLog: '软件日志',
        softwareUpdate: '软件更新',
        network: '网络配置',
        debug: '调试',
      },
    },
  },
  data() {
    return {
      showTabName: '',
      count: 0,
      interval: null,
      model: window.GlobalUtil.model,
    };
  },
  mounted() {
    this.showTabName = 'studioInfo';
  },
  computed: {
    isXArmConnected() {
      return this.$store.state.robot.status.connected;
    }
  },
  methods: {
    showTab(name) {
      if (name === 'network') {
        if (name === this.showTabName) {
          this.count += 1;
        }
        else {
          this.count = 0;
        }
        if (this.interval) {
          clearTimeout(this.interval);
          this.interval = null;
        }
        
        if (this.count == 5) {
          this.model.commonStatusMgr.settingPanel.networkPage.showDHCP = !this.model.commonStatusMgr.settingPanel.networkPage.showDHCP;
        }
        else if (this.count >= 7) {
          this.model.commonStatusMgr.settingPanel.networkPage.showEnp2s0 = !this.model.commonStatusMgr.settingPanel.networkPage.showEnp2s0;
          this.count = 0;
        }
        this.interval = setTimeout(() => {
          this.count = 0;
          this.interval = null;
        }, 2000)
      }
      this.showTabName = name;
    },
  },
  components: {
    StudioInfo,
    LogInfo,
    SoftwareUpdate,
    WebSSH,
    NetWork,
    Debug,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .setting-wrapper {
    background: #f4f4f4;
    color: #666;
    display: flex;
    flex-direction: column;
    overflow: hidden;
     .com-header-wrapper {
      height: 50px;
      line-height: 50px;
    }
    .section1-wrapper {
      display: flex;
      height: 100%;
      .box1-wrapper {
        /*width: 100%;*/
        /*height: 100%;*/
        flex-direction: column;
        display: flex;
        width: 200px;
        &>span {
          border-bottom: 1px solid rgba(137, 137, 137, 0.35);
          border-right: 4px solid transparent;
          justify-content: center;
          cursor: pointer;
          transition: all .2s;
          height: 100px;
        }
        &>a:last-child{
          border-bottom: none;
        }
        a:hover {
          color: #4a90e2;
        }
      }
      .box2-wrapper {
        width: 100%;
      }
    }
  .setting-tab-selected {
    /*background: grey;*/
    border-right: 4px solid #fb7e46 !important;
    }
  }
</style>
