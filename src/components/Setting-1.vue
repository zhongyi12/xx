<template>
  <div class="setting-wrapper com-module-wrapper">
    <div>
      <!--<router-link :to="{name: 'Home'}"><img class="com-icon-back" src="./../assets/img/common/icon_back.svg"/></router-link>
      <span class="back-icon" v-if="model.commonStatusMgr.panelIsHidden === true"><i class=" el-icon-arrow-left"><</i></span>-->
      <!-- <router-link  class="back-icon"  :to="{ name: 'Home'}"><i class=" el-icon-arrow-left"></i></router-link > 
      <router-link  class="back-home-logo"  :to="{ name: 'Home'}"></router-link >
      <i v-if="isXArmConnected" class="el-icon-success" style="color:#52BF53;position:absolute;left: 170px;"></i>
      <i v-else class="el-icon-success" style="color:#d1d1d1;position:absolute;left: 170px;"></i>
      <span class="title"> {{ showTabName }}</span>
      <img class="" src="./../assets/img/setting/icon_setting.svg" />-->
      <CommonTopMenuLeft :backTitle="$t('setting')"></CommonTopMenuLeft>
    </div>
    <div class="setting-panel-wrapper">
      <el-tabs tab-position="left" style="height: 100%;" @tab-click="showTab"  class="motion-pane">
        <el-tab-pane :label="categoriesSetting.motion"><span class="left-pane-label sport_pane sport_pane_active" slot="label"> {{ categoriesSetting.motion }}</span><motionSetting></motionSetting></el-tab-pane>
        <el-tab-pane :label="categoriesSetting.tcp"><span class="left-pane-label tcp_pane tcp_pane_active" slot="label"> {{ categoriesSetting.tcp }}</span><tcpSetting></tcpSetting></el-tab-pane>
       <!-- <el-tab-pane :label="categoriesSetting.tool"><span class="left-pane-label tool_pane tool_pane_active" slot="label"> {{ categoriesSetting.tool }}</span><toolSetting></toolSetting></el-tab-pane> -->
        <el-tab-pane :label="categoriesSetting.install"><span class="left-pane-label install_pane install_pane_active" slot="label"> {{ categoriesSetting.install }}</span><installSetting></installSetting></el-tab-pane>
        <!--  <el-tab-pane :label="categoriesSetting.io"><span class="left-pane-label io_pane io_pane_active" slot="label"> {{ categoriesSetting.io }}</span></el-tab-pane> -->
        <el-tab-pane :label="categoriesSetting.system"><span class="left-pane-label sys_pane sys_pane_active" slot="label"> {{ categoriesSetting.system }}</span><systemSetting></systemSetting></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import tcpSetting from './Setting/tcpSetting';
import toolSetting from './Setting/toolSetting';
import motionSetting from './Setting/motionSetting';
import systemSetting from './Setting/systemSetting';
import installSetting from './Setting/installSetting';
import CommonTopMenuLeft from './common/CommonTopMenuLeft';


export default {
  i18n: {
    messages: {
      en: {
        setting: 'Setting',
          categoriesSetting: {
            motion: "Motion Settings",
            tcp: "TCP Settings",
            tool: "Tool Settings",
            install: "Mounting Settings",
            io: "I/O",
            sensitivity: "Sensitivity",
            system: "System Settings"
          },
        },
      
      cn: {
        setting: '设置',
        categoriesSetting: {
          motion: "运动设置",
          tcp: "TCP 设置",
          tool: "工具设置",
          install: "安装设置",
          io: "I/O 设置",
          sensitivity: "灵敏度设置",
          system: "系统设置"
        },
      },
    },
  },
  data() {
    return {
      showTabName: '',
      count: 0,
      interval: null,
      model: window.GlobalUtil.model,
      categoriesSetting: {
        motion: this.$t('categoriesSetting.motion'),
        tcp: this.$t('categoriesSetting.tcp'),
        tool: this.$t('categoriesSetting.tool'),
        install: this.$t('categoriesSetting.install'),
        io: this.$t('categoriesSetting.io'),
        sensitivity: this.$t('categoriesSetting.sensitivity'),
        system: this.$t('categoriesSetting.system'), 
      },
    };
  },
  mounted() {
    this.showTabName = this.$t('categoriesSetting.motion');
    console.log(' this.categoriesSetting---', typeof(this.categoriesSetting)); //
    
  },
  computed: {
    isXArmConnected() {
      return this.$store.state.robot.status.connected;
    }
  },
  methods: {
    showTab(tab) {
      this.showTabName = tab.label;
      console.log(tab)
    },

  },
  components: {
    motionSetting,
    tcpSetting,
    toolSetting,
    systemSetting,
    installSetting,
    CommonTopMenuLeft
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .back-home-logo {
    display: inline-block;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url('../assets/img/uf_logo.svg');
    width: 150px;
    height: 70px;
    background-position: center;
    cursor: pointer;
    position: absolute;
    left: 1rem;
  }
  .setting-wrapper {
    color: #666;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .setting-panel-wrapper {
      height: 92%;
      .motion-pane {
        color: #555;
        .left-pane-label {
          background-repeat: no-repeat;
          background-size: 20px;
          background-position: center left;
          padding-left: 30px;
        }
        .sport_pane {
           background-image: url('../assets/img/setting/sport_set.svg');
        }
        .el-tabs__item.is-active .sport_pane_active {
           background-image: url('../assets/img/setting/sport_set_active.svg');
        }
        .tcp_pane {
           background-image: url('../assets/img/setting/tcp_set.svg');
        }
        .el-tabs__item.is-active .tcp_pane_active {
           background-image: url('../assets/img/setting/tcp_set_active.svg');
        }
        .tool_pane {
           background-image: url('../assets/img/setting/tool_set.svg');
        }
        .el-tabs__item.is-active .tool_pane_active {
           background-image: url('../assets/img/setting/tool_set_active.svg');
        }
        .install_pane {
           background-image: url('../assets/img/setting/install_set.svg');
        }
        .el-tabs__item.is-active .install_pane_active {
           background-image: url('../assets/img/setting/install_set_active.svg');
        }
        .io_pane {
           background-image: url('../assets/img/setting/io_set.svg');
        }
        .el-tabs__item.is-active .io_pane_active {
           background-image: url('../assets/img/setting/io_set_active.svg');
        }
        .sys_pane {
           background-image: url('../assets/img/setting/sys_set.svg');
        }
        .el-tabs__item.is-active .sys_pane_active {
           background-image: url('../assets/img/setting/sys_set_active.svg');
        }
      }
    }
  }


</style>
