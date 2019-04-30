<template>
  <div class="setting-wrapper">
   <div v-if="isLangStep">
    <h2 class="initial-title">{{ $t('initialLang') }}</h2>
    <langSetting></langSetting>
    <button class="com-initial-btn next-step" @click="nextStep()">{{ $t('nextStep') }} >> </button>
   </div>
   <div v-else>
     <h2  class="initial-title">{{ $t('initialInstall') }}</h2>
    <installSetting></installSetting>
    <div class="btn-wrapper">
      <button class="com-initial-btn" @click="preStep()">{{  $t('preStep') }} >> </button>
      <button class="com-initial-btn" @click="finishInitial()">{{  $t('finish') }} >></button>
    </div>
   </div>
  </div>
</template>

<script>
import langSetting from './langSetting';
import installSetting from './installSetting';


export default {
  i18n: {
    messages: {
      en: {
        nextStep: "Next Step",
        preStep: "Previous Step",
        finish: "Finish",
        initialLang: "Initialization Settings-Language",
        initialInstall: "Initialization Robot-Mounting Settings",
      },
      
      cn: {
        nextStep: "下一步",
        preStep: "上一步",
        finish: "完成",
        initialLang: "初始化语言设置",
        initialInstall: "初始化设置-机械臂安装设置",
      },
    },
  },
  data() {
    return {
      isLangStep: false, 
      model: window.GlobalUtil.model,
    };
  },
  mounted() {

    
  },
  computed: {
    isXArmConnected() {
      return this.$store.state.robot.status.connected;
    },
    nextStep() {
      this.isLangStep = false;
    },
    preStep () {
      this.isLangStep = true;
    },
    finishInitial() {
      this.$router.push('/');
    }

  },
  methods: {


  },
  components: {
    langSetting,
    installSetting
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .setting-wrapper {
    text-align:center;
    position: relative;
    height: 100%;
    padding-top: 100px;
    width:1000px;
    margin: 0 auto;
    .initial-title {
      // padding: 30px;
      font-size: 20px;
    }
    .btn-wrapper {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items:center;
      position: absolute;
      right: 0;
      bottom: 20%;
    }
    .next-step {
      position: absolute;
      right: 100px;
      bottom: 20%;
    }
    .com-initial-btn {
      height: 40px;
      width: 150px;
      line-height: 40px;
      text-align: center;
      border: none;
      font-size: 14px;
      color: #fff;
      cursor: pointer;
      transition: all .3s;
      color: #555;
      border: 1px solid #d0cccc;
      border-radius: 5px;
      padding: 0 10px;
      background: #fff;
    }
  }


</style>
