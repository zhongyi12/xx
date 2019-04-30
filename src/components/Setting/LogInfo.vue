<template>
  <div class="log-wrapper com-module-wrapper">
    <!--<div class="com-header-wrapper com-text-center" style="position: relative">-->
      <!--&lt;!&ndash;<a @click="goBack()"><img class="com-icon-back" src="./../../assets/img/common/icon_back.svg"/></a>&ndash;&gt;-->
      <!--&lt;!&ndash;<span class="com-font-GB-24 com-module-name">{{ $t('studioLog') }}</span>&ndash;&gt;-->
    <!--</div>-->
   
    <div class="log-content" id="log-content" @scroll="scrollToBottom()" :style="{top: model.commonStatusMgr.isMobile ? '26px' : '56px'}">
      <ul>
        <li v-for="(item, index) in logInfo" :key="index">{{ item }}</li>
      </ul>
    </div>
     <el-button :disabled="!isConnected" v-if="!model.commonStatusMgr.isMobile" icon="el-icon-download" size="mini" style="background: #fb7e46;color: #fff;" @click="downloadDoc()">{{ $t('download') }}</el-button>
  </div>
</template>

<script>
export default {
  i18n: {
    messages: {
      en: {
        studioLog: 'Studio Log',
        download: 'Download',
        downloadStart: 'Download start, please waiting...',
        downloadSuccess: 'Download success',
        downloadFailed: 'Download failed',
      },
      cn: {
        studioLog: 'Studio 日志',
        download: '下载',
        downloadStart: '开始下载, 请耐心等待...',
        downloadSuccess: '下载成功',
        downloadFailed: '下载失败',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      logInfo: '',
      number: 50,
    };
  },
  created() {
    this.getLogInfo();
  },
  mounted() {
  },
  computed: {
    isConnected() {
      return this.$store.state.robot.status.connected === true;
    },
  },
  methods: {
    goBack() {
      this.number = 50;
      // this.$router.push('Setting');
      // this.$router.push({ name: 'Setting' });
      this.$router.go(-1);
    },
    getLogInfo() {
      const params = {
        data: {
          count: this.number,
        },
      };
      window.GlobalUtil.socketCom.sendCmd(window.GlobalConstant.SETTING_GET_LOG_INFO, params, (response) => {
        if (response.code === 0) {
          const logInfoData = response.data;
          if (logInfoData.length > 0) {
            this.logInfo = logInfoData.reverse();
            this.number += 50;
          }
          else {
  //          console.log('logInfo2', response);
          }
        }
      });
    },

    scrollToBottom() {
      const logContenId = document.getElementById('log-content');
      if (logContenId.scrollHeight - logContenId.scrollTop - logContenId.clientHeight < 1) {
        setTimeout(this.getLogInfo(), 2000);
      }
    },
    downloadDoc() {
      const msgInstance = this.$message({
        message: `${this.$t('downloadStart')}`,
        type: 'info',
        duration: 0,
        showClose: true,
      });
      fetch(`http://${window.GlobalUtil.socketInfo.host}/handler/log/download`)
        .then((response) => {
          response.blob().then((blob) => {
            const a = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            const filename = 'studio-log.tar.gz';
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
            msgInstance.close();
            this.$message({
              message: `${this.$t('downloadSuccess')}: ${filename}`,
              type: 'success',
              duration: 0,
              showClose: true,
            });
            // this.$message.success(`${this.$t('downloadSuccess')}: ${filename}`);
          }).catch((e) => {
            msgInstance.close();
            this.$message.error(`${this.$t('downloadFailed')}: ${e}`);
          })
        })
        .catch((e) => {
          msgInstance.close();
          this.$message.error(`${this.$t('downloadFailed')}: ${e}`);
        })
      // fetch(`http://${window.GlobalUtil.socketInfo.host}/handler/log/download`).then(response => response.blob().then((blob) => {
      //   const a = document.createElement('a');
      //   const url = window.URL.createObjectURL(blob);
      //   const filename = 'studio-log.tar.gz';
      //   a.href = url;
      //   a.download = filename;
      //   a.click();
      //   window.URL.revokeObjectURL(url);
      // }))
    },
//    getScrollTop() {
//      let bodyScrollTop = 0;
//      let documentScrollTop = 0;
//      if (document.body) {
//        bodyScrollTop = document.body.scrollTop;
//      }
//      if (document.documentElement) {
//        documentScrollTop = document.documentElement.scrollTop;
//      }
//      return Math.max(bodyScrollTop, documentScrollTop);
//    },
//    getClientHeight() {
//      let windowHeight = 0;
//      if (document.compatMode === 'CSS1Compat') {
//        windowHeight = document.documentElement.clientHeight;
//      }
//      else {
//        windowHeight = document.body.clientHeight;
//      }
//      return windowHeight;
//    },
//    getScrollHeight() {
//      return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
//    },
  },
  watch: {
    $route() {
      if (this.$route.name === 'LogInfo') {
        this.getLogInfo();
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .log-wrapper {
    .log-content {
      width: 100%;
      height: 70vh;
      padding: 0 1vw;
      font-size: 14px;
      overflow-y: auto;
      border: 1px solid #efefef;
      margin-bottom: 20px;
      ul {
        li {
          width: 100%;
          word-break: keep-all;
          overflow: hidden;
        }
      }
    }
  }
</style>
