
<template>
  <div class="noselected">
    <div class="dialog-wrap">
      <div class="dialog-cover" @click="showAboutDialog"></div>
      <div class="dialog-content">
        <span class="top-title">
          <img src="../../assets/img/logo_xarm.png"/>
          <div>{{ $t('version') }}: {{ version }}</div>
        </span>
        <div class="save-dialog-text">
          <!-- <p><i  class="el-icon-message" style="margin-right: 10px;margin-bottom: 6px;"></i>info@ufactory.cc</p> -->
          <p><a :href="'mailto:info@ufactory.cc?subject=xArmStudio&body=' + genEmailContent()"><i class="el-icon-message" style="margin-right: 10px;margin-bottom: 6px;"></i>info@ufactory.cc</a></p>
          <p>© 2019 <a href="#" @click="openWindow('https://www.ufactory.cc/')">UFACTORY</a> All Rights Reserved </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // const path = require('path');
  // import * as types from './../store/mutation-types';
  export default {
    props: ['showAboutDialog'],
    i18n: {
      messages: {
        en: {
          title: 'About Ufactory',
          version: 'Version',
        },
        cn: {
          title: '关于Ufactory',
          version: '版本',
        },
      },
    },
    data() {
      return {
        model: window.GlobalUtil.model,
        version: ' ',
      }
    },
    created() {
      if (this.model.localSettingMgr.infoDatas.studioInfo || this.model.localSettingMgr.infoDatas.studioInfo !== undefined) {
        this.version = this.model.localSettingMgr.infoDatas.studioInfo.version;
      }
      else {
        this.version = ' ';
      }
    },
    mounted() {
      // document.onkeydown = () => {
      //   if (window.event.keyCode === 13) {
      //     this.showAboutDialog();
      //   }
      // };
    },
    methods: {
      openWindow(url) {
        window.open(url);
      },
      genEmailContent() {
        const dict = {
          studioInfo: this.model.localSettingMgr.infoDatas.studioInfo,
          deviceInfo: this.model.localSettingMgr.infoDatas.deviceInfo,
        };
        return `*************************xArmStudio*************************%0A${JSON.stringify(dict)}%0A========================================%0A%0A`;
      },
      // closeMyself() {
      //   window.GlobalUtil.model.localTeach.saveDialogShow = false;
      // },
    },
    components: {
    },
    computed: {
    },
  }
</script>

<style scoped lang="scss">
  .top-title {
    text-align: center;
    display: block;
    padding-top: 26px;
    img {
      width: 34px;
    }
  }
  .dialog-content {
    width: 400px;
    position: fixed;
    height: 160px;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 0px;
    right: 0px;
    z-index: 10;
    background: #FFFFFF;
    overflow: hidden;
  }
  .dialog-close:hover {
    color: #4fc08d;
  }
  .save-dialog-text {
    text-align: center;
    position: absolute;
    bottom:10px;
    left: 0;
    right: 0;
    margin-left: 0;
    margin-right: 0;
  }
  .save-dialog-text p {
    color: #666;
    font-size: 12px;
  }
</style>
