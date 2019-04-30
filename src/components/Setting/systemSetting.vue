<template>
  <div class="com-module-wrapper motion-wrapper">
    <div class="nav-wrapper">
      <el-button :class="{'selected-model' : visible.language === true}" @click="showModel('language')">{{ $t('langSetting') }}</el-button>
      <el-button :class="{'selected-model' : visible.update === true}" @click="showModel('update')">{{ $t('checkUpdate') }}</el-button>
      <el-button :class="{'selected-model' : visible.sysInfo === true}" @click="showModel('sysInfo')">{{ $t('sysInfo') }}</el-button>
       <el-button :class="{'selected-model' : visible.netSetting === true}" @click="showModel('netSetting')">{{ $t('netSetting') }}</el-button>
      <el-button :class="{'selected-model' : visible.log === true}" @click="showModel('log')">{{ $t('log') }}</el-button>
     
     
     
    </div>

   <div class="sys-setting-block-wrapper  " v-if="visible.language">
   <!-- <h3 class="title">{{ $t('langSetting') }}</h3> -->
     <div>
     <el-radio-group v-model="language" @change="changeLang()" class="language-setting-radios">
      <el-radio label="cn">{{ $t('chinese') }}</el-radio>
      <el-radio label="en">{{ $t('english') }}</el-radio>
    </el-radio-group>
     </div>
   </div>

   <div class="sys-setting-block-wrapper " v-if="visible.update">
    <!-- <h3 class="title">{{ $t('checkUpdate') }}</h3> -->
     <div><SoftwareUpdate></SoftwareUpdate></div>
   </div>

  <div class="sys-setting-block-wrapper  " v-if="visible.sysInfo">
   <!--  <h3 class="title">{{ $t('sysInfo') }}</h3> -->
    <div><StudioInfo></StudioInfo></div>
  </div>

  <div class="sys-setting-block-wrapper  " v-if="visible.netSetting">
   <!--  <h3 class="title">{{ $t('netSetting') }}</h3> -->
    <div><NetWork></NetWork></div>
  </div>

  <div class="sys-setting-block-wrapper  " v-if="visible.log">
   <!--  <h3 class="title">{{ $t('log') }}</h3> -->
    <div><LogInfo></LogInfo></div>
  </div>

 <!-- <div class="sys-setting-block-wrapper  ">
    <h3 class="title">{{ $t('about') }}</h3>
    <div>{{  }}</div>
  </div>

  <div class="sys-setting-block-wrapper  ">
    <h3 class="title">{{ $t('support') }}</h3>
    <div>{{  }}</div>
  </div> -->

  </div> 
</template>

<script>
import StudioInfo from './StudioInfo';
import LogInfo from './LogInfo';
import SoftwareUpdate from './SoftwareUpdate';
import WebSSH from '../WebSSH';
import NetWork from '../NetWork';
export default {
  i18n: {
    messages: {
      en: {
       langSetting: "Language Setting",
       checkUpdate: "Check Update",
       sysInfo: "System Information",
       netSetting: "Network Setting",
       log: "Log",
       chinese: "Chinese",
       english:"English",
       about: "About",
       support: "Support and Feedback",
      },
      cn: {
       langSetting: "语言设置",
       checkUpdate: "检查更新",
       sysInfo: "系统信息",
       netSetting: "网络设置",
       log: "日志",
       chinese: "简体中文",
       english:"英文",
       about: "关于",
       support: "支持与反馈",
      },
    },
  },
  data() {
    return {
      language: window.language.currentLang,
      visible: {
        language: true,
        update: false,
        sysinfo: false,
        netSetting: false,
        log: false,
      }
    };
  },
  components: {
    StudioInfo,
    LogInfo,
    SoftwareUpdate,
    WebSSH,
    NetWork,
  },
  computed: {
    isConnected() {
      return this.$store.state.robot.status.connected === true;
    },

  },
  methods: {
    showModel(value) {
      for (let item in this.visible) {
        this.visible[item] = false;
      }
      this.visible[value] = true;
    },
    changeLang() {
      let newLang = "";
      if(this.language === 'en') {
        newLang = "en";
      }
      else {
        newLang = "cn";
      }
    const oUrl = window.location.href.toString();
    const re=eval('/('+ 'lang'+'=)([^&]*)/gi');
    const nUrl = oUrl.replace(re,'lang'+'='+ newLang);
    window.location = nUrl;
// 　　window.location.href=nUrl
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .motion-wrapper {
   
    height: 92vh;
    overflow-y: scroll;
    .sys-setting-block-wrapper {
      width: 660px;
      margin: 0 auto;
      padding: 5vh 2vw;
      .title {
        font-size: 19px;
        padding-bottom: 3vh;
        font-family: "Gotham-Bold";
      }
    }
    .acce-slider-wrapper {
      display: flex;
      align-items: center;
      margin:16px 0;
      .speed {
        padding-right:30px;
      }
      .speed-slider {
        width: 500px;
      }
    }  
  }


  .nav-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    button {
      margin-left: 2vw;
    }
    .selected-model {
      background: #c1521e;
      color: #fff;
    }
  }
</style>
