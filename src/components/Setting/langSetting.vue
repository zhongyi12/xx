<template>
  <div class="com-module-wrapper motion-wrapper">

   <div class="com-setting-block-wrapper ">
    <h3 class="title">{{ $t('langSetting') }}</h3>
     <div>
     <el-radio-group v-model="language" @change="changeLang()" class="language-setting-radios">
      <el-radio label="cn">{{ $t('chinese') }}</el-radio>
      <el-radio label="en">{{ $t('english') }}</el-radio>
    </el-radio-group>
     </div>
   </div>



  </div>
</template>

<script>

export default {
  i18n: {
    messages: {
      en: {
       langSetting: "Language Setting",
       checkUpdate: "Check Update",

      },
      cn: {
       langSetting: "语言设置",
       checkUpdate: "检查更新",

      },
    },
  },
  data() {
    return {
      language: window.language.currentLang,
    };
  },
  components: {
  
  },
  computed: {
  },
  methods: {
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
   height:100%;
  }
</style>
