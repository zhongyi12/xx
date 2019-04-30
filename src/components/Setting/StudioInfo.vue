<template>
  <div class="studio-wrapper com-module-wrapper">
    <!--<div class="com-header-wrapper com-text-center update-head">-->
      <!--<router-link :to="{name:'Setting'}"><img class="com-icon-back" src="./../../assets/img/common/icon_back.svg"/></router-link>-->
      <!--<span class="com-font-GB-24 com-module-name">{{ $t('studioInfo') }}</span>-->
    <!--</div>-->
    <div class="content-wrapper">
      <div v-for="(item, index) in info" class="info-wrapper">
        <h2 v-if="$i18n.locale === 'en'" class="title"><span class="title-line"></span>{{ item.titleEN }}<span class="title-line"></span></h2>
        <h2 v-else style="font-size: 16px;font-weight: 700;padding-bottom: 10px;">{{ item.titleCN }}</h2>
        <div class="content" v-for="itemName in item.data">
          <div class="left">
            <span v-if="$i18n.locale === 'en'" class="name">{{ itemName.nameEN }} :</span>
            <span v-else class="name">{{ itemName.nameCN }} :</span>
          </div>
          <div class="right">
            <span class="name" v-if="itemName.nameEN === 'Version'" @click="onClick">{{ itemName.nameValue }}</span>
            <span class="name" v-if="itemName.nameEN === 'Language'">{{ $t('language') }}</span>
            <span class="name" v-if="itemName.nameEN !== 'Version' && itemName.nameEN !== 'Language'">{{ itemName.nameValue }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  i18n: {
    messages: {
      en: {
        studioInfo: 'Studio Info',
        language: 'English',
      },
      cn: {
        studioInfo: 'Studio 信息',
        language: '简体中文',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      count: 0,
      interval: null,
      info: {
        deviceInfo: {
          titleEN: 'Device information',
          titleCN: '设备信息',
          data: {
            // portNumber: {
            //   nameEN: 'Port Number',
            //   nameCN: '端口号',
            // },
            // serialNumber: {
            //   nameEN: 'Serial Number',
            //   nameCN: '序列号',
            // },
            device: {
              nameEN: 'Device Address',
              nameCN: '设备地址',
              nameValue: '',
            },
            // deviceVersion: {
            //   nameEN: 'Device Version',
            //   nameCN: '设备版本',
            // },
            // machineUnique: {
            //   nameEN: 'Machine Unique',
            //   nameCN: 'Machine Unique',
            // },
            firmwareVersion: {
              nameEN: 'Firmware Version',
              nameCN: '固件版本',
            },
          },
        },
        studioInfo: {
          titleEN: 'Studio information',
          titleCN: '软件信息',
          data: {
            // studioLanguage: {
            //   nameEN: 'Language',
            //   nameCN: '软件语言',
            // },
            version: {
              nameEN: 'Version',
              nameCN: '软件版本',
              nameValue: '',
            },
            // xArmStudioVersion: {
            //   nameEN: 'UI Version',
            //   nameCN: 'UI 版本',
            // },
            // xArmPythonSDKVersion: {
            //   nameEN: 'SDK Version',
            //   nameCN: 'SDK 版本',
            // },
            // xArmCoreVersion: {
            //   nameEN: 'Core Version',
            //   nameCN: '核心服务版本',
            // },
            // xArmJediVersion: {
            //   nameEN: 'Codes Version',
            //   nameCN: '代码服务版本',
            // },
            // xArmDaemonVersion: {
            //   nameEN: 'Daemon Version',
            //   nameCN: '守护服务版本',
            // },
          },
        },
      },
    };
  },
  created() {
  },
  mounted() {
    window.CommandsSettingSocket.getStudioInfo((dict) => {
      console.log('this.info.studioInfo.data', this.info.studioInfo.data);
      this.getInfo(this.info.studioInfo.data, this.model.localSettingMgr.infoDatas.studioInfo);
    });
    window.CommandsSettingSocket.getDeviceInfo((dict) => {
      this.getInfo(this.info.deviceInfo.data, this.model.localSettingMgr.infoDatas.deviceInfo);
    });
  },
  computed: {
    isSocketConnected() {
      return this.model.robot.state.info.socketConnected;
    },
    isXArmConnected() {
      return this.$store.state.robot.status.connected;
    }
  },
  methods: {
    onClick() {
      this.count += 1;
      if (this.interval) {
        clearTimeout(this.interval);
      }
      if (this.count >= 5) {
        this.model.commonStatusMgr.settingPanel.debugPage.show = !this.model.commonStatusMgr.settingPanel.debugPage.show;
        this.model.commonStatusMgr.settingPanel.terminalPage.show = this.model.commonStatusMgr.settingPanel.debugPage.show;
        this.count = 0;
      }
      // else if (this.count >= 10) {
      //   window.location.href = window.location.href.replace('prod', 'dev');
      //   this.count = 0;
      // }
      this.interval = setTimeout(() => {
        this.count = 0;
      }, 2000)
    },
    getInfo(type, model) {
      for (const key in model) {
        for (const key2 in type) {
          if (key === key2) {
            type[key2].nameValue = model[key];
          }
        }
      }
    },
  },
  watch: {
    isSocketConnected(curVal, newVal) {
      window.CommandsSettingSocket.getStudioInfo((dict) => {
        this.getInfo(this.info.studioInfo.data, this.model.localSettingMgr.infoDatas.studioInfo);
      });
    },
    isXArmConnected(curVal, newVal) {
      window.CommandsSettingSocket.getDeviceInfo((dict) => {
        this.getInfo(this.info.deviceInfo.data, this.model.localSettingMgr.infoDatas.deviceInfo);
      });        
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .studio-wrapper {
    
    .content-wrapper {
      /*height: 90%;*/
      align-items: center;
    }
    .info-wrapper {
      /*border-bottom:  1px solid #979797;*/
      /*height: 50%;*/
      width: 100%;
      padding-bottom: 16px;
    }
    .info-wrapper:last-child {
      border: none;
    }
    .title {
      padding-bottom: 2%;
      font-weight: 700;
      // .title-line {
      //   width: 100px;
      //   height: 2px;
      //   background: rgba(102, 102, 102, 0.6);
      //   display: inline-block;
      //   margin: 0 40px;
      //   /*margin: 5px 20px;*/
      // }
    }
    .content {
      display: flex;
      justify-content: space-between;
      .left {
        display: flex;
        flex-direction: column;
        padding-right: 4%;
        text-align: right;
        span {
          padding: 1% 0;
        }
      }
      .right {
        width: 40%;
        display: flex;
        flex-direction: column;
        text-align: left;
        padding-left: 4%;
        span {
          padding: 1% 0;
        }
      }
    }
  }
  .com-flex-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
