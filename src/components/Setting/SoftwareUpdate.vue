<template>
  <div class="update-wrapper com-module-wrapper">
    <!--<div class="com-header-wrapper com-text-center update-head">-->
      <!--&lt;!&ndash;<router-link :to="{name:'Setting'}"><img class="com-icon-back" src="./../../assets/img/common/icon_back.svg"/></router-link>&ndash;&gt;-->
      <!--&lt;!&ndash;<span class="com-font-GB-24 com-module-name">{{ $t('softwareUpdate') }}</span>&ndash;&gt;-->
      <!--<div class="update-tip">-->
        <!--<span v-if="countUpdates.boolean" class="have-update">{{ countUpdates.number }} {{ $t('numUpdate') }}</span>-->
        <!--&lt;!&ndash;<span v-else>{{ $t('noUpdate') }}</span>&ndash;&gt;-->
      <!--</div>-->
    <!--</div>-->
    <div class="conten-wrapper">
      <div class="update-content" v-for="(item, index) in haveUpdate" v-if="index === 'Software' || (isXArmConnected && reMounted)">
        <div class="update-info">
          <span class="name">{{ index === 'Software' ? $t('software') : index === 'Firmware' ? $t('firmware') : $t('hardware')}}</span>
          <span class="version">{{ item.version}}</span>
          <span class="time">{{ item.published }}</span>
         
          <div class="update-btn-wrapper">
            <el-button class="update-button" v-if="item.update" @click="startDownload(index === 'Software' ? 1 : index === 'Firmware' ? 2 : 3)">{{ $t('btnUpdate') }}</el-button>
            <el-button class="update-button" v-else style="background:#CFCFCF;" disabled>{{ $t('btnUpdate') }}</el-button>
            <!--<p v-if="item.update">Restart Required</p>-->
          </div>
        </div>
        <div class="update-text">
          <span v-if="item.update">{{ $t('updateContent') }}</span>
          <span v-else class="name">{{ $t('updatedContent') }}</span>
          <ul v-if="$i18n.locale === 'cn'">
            <template v-for="(itemText, indexText, i) in item.updateInfo">
              <li v-if="typeof itemText.cn === 'string'">{{ itemText.cn || '没有描述信息' }}</li>
              <li v-else v-for="(msg, j) in itemText.cn" :key="i * 20 + j">{{ msg }}</li>
            </template>
            <!-- <li v-for="(itemText, indexText, i) in item.updateInfo" :key="index" style="margin-left: 20px;">
              {{ itemText.cn || '没有描述信息' }}
            </li> -->
          </ul>
          <ul v-else>
            <template v-for="(itemText, indexText, i) in item.updateInfo">
              <li v-if="typeof itemText.en === 'string'">{{ itemText.en || 'no description' }}</li>
              <li v-else v-for="(msg, j) in itemText.en" :key="i * 20 + j">{{ msg }}</li>
            </template>
            <!-- <li v-for="(itemText, indexText, i) in item.updateInfo" :key="index" style="margin-left: 20px;">
              {{ itemText.en || 'no description' }}
            </li> -->
          </ul>
        </div>
      </div>
    </div>
    <div class="download-dialog-wrapper" v-if="visible.downloadDialog">
      <div v-if="visible.downloadProgress" class="progress-wrapper">
        <span class="progress-text">{{ $t('downloading') }}</span>
        <el-progress class="progress" :text-inside="true" :stroke-width="12" :percentage="getDownloadProgress"></el-progress>
      </div>
      <div v-else >
        <span class="close-wrapper" @click="installLater()"><i class="el-icon-close"></i></span>
        <div v-if="visible.downloadSuccess" class="download-result">
          <h3>{{ $t('downloaded') }}</h3>
          <button @click="startInstall()">→ {{ $t('install') }}</button>
          <button @click="installLater()">→ {{ $t('noInstall') }}</button>
        </div>
        <div v-if="visible.downloadError" class="download-result">
          <h3>{{ $t('downloadFail') }}</h3>
          <button @click="startDownload()">{{ $t('redownload') }}</button>
          <button @click="installLater()">{{ $t('cancelDownload') }}</button>
        </div>
        <div v-if="visible.installing" class="download-result">
          <i class="el-icon-loading"></i>
          <span>{{ $t('installing') }}</span>
        </div>
        <div v-if="visible.installFinish" class="download-result">
          <div><i class="el-icon-success"></i></div>
          <span>{{ $t('installed') }}<router-link :to="{name: 'Home', params: {data: 'reload'}}" class="restart">{{ $t('restart') }}</router-link></span>
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
        softwareUpdate: 'Software Update',
        noUpdate: 'You are using the latest version, no updates available',
        numUpdate: 'updates avaliable',
        updateContent: 'Version Updates：',
        updatedContent: 'Version Infomation',
        btnUpdate: 'Update',
        downloading: 'Downloading , Please wait...',
        downloaded: 'Thank you. Your download is complete. ',
        install: 'Install Now',
        noInstall: 'Later',
        installSuccess: 'Install Success',
        installFail: 'Install Failed',
        downloadFail: 'Download Failed',
        redownload: 'Retry',
        cancelDownload: 'Pause',
        installing: 'Please be patient and wait for the installation to complete.',
        installed: 'xArm Studio Setup needs to restart your PC to complete installation. ',
        restart: 'Restart',
        software: 'Software',
        firmware: 'Firmware',
        hardware: 'Hardware'
      },
      cn: {
        softwareUpdate: '软件更新',
        noUpdate: '没有版本更新',
        numUpdate: '个更新',
        updateContent: '版本更新信息',
        updatedContent: '版本信息',
        btnUpdate: '更新',
        downloading: '下载中，请稍后...',
        downloaded: '下载已完成，是否要立即安装？',
        install: '是，现在安装',
        noInstall: '否，下次安装',
        installSuccess: '安装成功',
        installFail: '安装失败',
        downloadFail: '下载失败',
        redownload: '重新下载',
        cancelDownload: '取消下载',
        installing: '请耐心等待安装完成...',
        installed: '安装完成请',
        restart: '重启',
        software: '软件',
        firmware: '固件',
        hardware: '硬件'
      },
    },
  },
  data() {
    return {
      langData: {},
      updateType: 1, // 1: software, 2: firmware, 3: hardware
      reMounted: false,
      haveUpdate: {
        Software: {
        },
        Firmware: {
        },
      },
      visible: {
        downloadDialog: false,
        downloadProgress: false,
        downloadSuccess: false,
        downloadError: false,
        installing: false,
        installFinish: false,
      },
      downloadProgress: 0,
    };
  },
  created() {
    this.checkUpdate();
  },
  mounted() {
  },
  methods: {
    checkUpdate() {
      window.GlobalUtil.socketCom.sendCmd(window.GlobalConstant.SETTING_CHECK_SOFTWARE_UPDATE, { data: '' }, (response) => {
        const checkUpdateResponse = (response.data !== undefined) ? response.data : response;
        console.log('CHECK_SOFTWARE_UPDATE', checkUpdateResponse);
        if (checkUpdateResponse) {
          const tempJson = {};
          const firmJson = {};
          for (const attr in checkUpdateResponse) {
            let softwareUpdate = checkUpdateResponse.update;
            let firmwareUpdate = false;
            if (attr === 'Firmware') {
              this.haveUpdate.Firmware = checkUpdateResponse[attr];
              delete checkUpdateResponse[attr];
              firmwareUpdate = this.haveUpdate.Firmware.update;
              for (const attr2 in this.haveUpdate.Firmware) {
                if (this.haveUpdate.Firmware[attr2] !== null && typeof this.haveUpdate.Firmware[attr2] === 'object') {
                  firmJson[attr2] = this.haveUpdate.Firmware[attr2].updateInfo;
                }
              }
            }
            else if (checkUpdateResponse[attr] !== null && typeof checkUpdateResponse[attr] === 'object') {
              if (softwareUpdate && checkUpdateResponse[attr].update) {
                tempJson[attr] = checkUpdateResponse[attr].updateInfo;
              }
              else if (!softwareUpdate) {
                tempJson[attr] = checkUpdateResponse[attr].updateInfo;
              }
            }
          }
          // if (checkUpdateResponse.update) {
          //   console.log('CHECK_SOFTWARE_UPDATE11', checkUpdateResponse)
          //   for (const attr in checkUpdateResponse) {
          //     if (typeof checkUpdateResponse[attr] === 'object' && checkUpdateResponse[attr].update) {
          //       if (attr === 'Firmware') {
          //         this.haveUpdate.Firmware = checkUpdateResponse[attr];
          //         delete checkUpdateResponse[attr];
          //         for (const attr2 in this.haveUpdate.Firmware) {
          //           if (typeof this.haveUpdate.Firmware[attr2] === 'object') {
          //             firmJson[attr2] = this.haveUpdate.Firmware[attr2].updateInfo;
          //           }
          //         }
          //       }
          //       else {
          //         tempJson[attr] = checkUpdateResponse[attr].updateInfo;
          //       }
          //     }
          //   }
          // }
          // else {
          //   console.log('CHECK_SOFTWARE_UPDATE22', checkUpdateResponse)
          //   for (const attr in checkUpdateResponse) {
          //     if (typeof checkUpdateResponse[attr] === 'object') {
          //       if (attr === 'Firmware') {
          //         this.haveUpdate.Firmware = checkUpdateResponse[attr];
          //         delete checkUpdateResponse[attr];
          //         for (const attr2 in this.haveUpdate.Firmware) {
          //           if (typeof this.haveUpdate.Firmware[attr2] === 'object') {
          //             firmJson[attr2] = this.haveUpdate.Firmware[attr2].updateInfo;
          //           }
          //         }
          //       }
          //       else {
          //         tempJson[attr] = checkUpdateResponse[attr].updateInfo;
          //       }
          //       // tempJson[attr] = checkUpdateResponse[attr].updateInfo;
          //     }
          //   }
          // }
          this.haveUpdate.Software = checkUpdateResponse;
          this.haveUpdate.Software.updateInfo = tempJson;
          this.haveUpdate.Firmware.updateInfo = firmJson;
          if (this.$store.state.robot.status.connected) {
            this.reMounted = true;
          }
        }
      });
    },
    startDownload(type) {
      if (type !== undefined) {
        this.updateType = type;
      } 
      this.visible.downloadDialog = true;
      if ((this.haveUpdate.Software.isDownload && this.updateType == 1) || (this.updateType === 2 && this.haveUpdate.Firmware.isDownload)) {
        this.visible.downloadSuccess = true;
      }
      else {
        this.visible.downloadProgress = true;
        window.GlobalUtil.socketCom.sendCmd(window.GlobalConstant.SETTING_START_DOWNLOAD_UPDATE, { data: '' }, (response) => {
          const downloadCode = (response.code !== undefined) ? response.code : response;
          console.log('START_DOWNLOAD_UPDATE', downloadCode);
          if (downloadCode === 1122) {
            console.log('下载成功');
            this.visible.downloadProgress = false;
            this.visible.downloadSuccess = true;
            this.visible.downloadError = false;
            this.checkUpdate();
          }
          else if (downloadCode === 1121) {
            console.log('下载失败');
            this.visible.downloadProgress = false;
            this.visible.downloadSuccess = false;
            this.visible.downloadError = true;
            this.checkUpdate();
          }
        });
      }
    },
    startInstall() {
      this.visible.downloadSuccess = false;
      this.visible.installing = true;
      const cmd = this.updateType === 1 ? window.GlobalConstant.SETTING_START_INSTALL_UPDATE : this.updateType === 2 ? window.GlobalConstant.SETTING_START_INSTALL_FIRMWARE_UPDATE : null;
      if (cmd === null) {
        return;
      }
      window.GlobalUtil.socketCom.sendCmd(cmd, { data: this.updateType }, (response) => {
        console.log('install: START_INSTALL_UPDATE', response);
        if (response.code === 1133) {
          console.log('install: install success');
          // TODO dialog => install success
          // re check update
          this.$message({
            message: this.$t('installSuccess'),
            type: 'success',
          });
          this.visible.installing = false;
          this.visible.downloadDialog = false;
          this.checkUpdate();
//          setTimeout(function() {
//          }, 600);
        }
        else if (response.code === 10086) {
          // TODO dialog => install success
          // restart go home
          this.checkUpdate();
          this.visible.installing = false;
          this.visible.installFinish = true;
        }
        else {
          this.$message({
            message: this.$t('installFail'),
            type: 'error',
          });
        }
      });
    },
    installLater() {
      this.visible.downloadError = false;
      this.visible.downloadESuccess = false;
      this.visible.downloadDialog = false;
    },
  },
  computed: {
    isXArmConnected() {
      if (!this.$store.state.robot.status.connected) {
        this.reMounted = false;
      }
      else {
        if (!this.reMounted) {
          this.checkUpdate();
        }
      }
      return this.$store.state.robot.status.connected;
    },
    countUpdates() {
      const softWare = this.haveUpdate.Software.update;
      const hardware = this.haveUpdate.Hardware.update;
      if (softWare && hardware) {
        return {
          number: 2,
          boolean: true,
        }
      }
      else if (softWare || hardware) {
        return {
          number: 1,
          boolean: true,
        }
      }
      return {
        boolean: false,
      }
    },
    getDownloadProgress() {
      console.log('this.$store.state.download.progress', this.$store.state.robot.download.progress);
      return Number(this.$store.state.robot.download.progress * 100).toFixed(2);
    },
  },
  watch: {
    $route() {
      if (this.$route.name === 'SoftwareUpdate') {
        this.checkUpdate();
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .update-wrapper {
   
    .update-head {
      position: relative;
      .update-tip {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 40px;
        display: flex;
        align-items: center;
        span {
          font-family: 'Gotham-Bold';
          font-size: 1.4rem;
        }
        .have-update {
          color: #E24D4A;
        }
      }
    }
    .conten-wrapper {
      display: flex;
      align-items: center;
      flex-direction: column;
      /*width: 100%;*/
      /*height: 80%;*/
    
    }
    .update-content:last-child {
      border: none;
    }
    .update-content {
      width: 100%;
      display: flex;
      // align-items: center;
      justify-content: space-between;
      // border-bottom:  1px solid #979797;
      padding-bottom: 16px;
      .update-info {
        display: flex;
        flex-direction: column;
        width: 30%;
        .version {
          padding: 5px 0;
        }
        .time {
          padding: 5px 0;
        }

        .update-btn-wrapper {
          margin-top: 20px;
          .update-button {
            width: 80px;
            height: 27px;
            line-height: 27px;
            border-radius: 5px;
            color: #fff;
            background: #fb7e46;
            outline: none;
            padding: 0;
          }
        }
      }
      .update-text {
        padding: 5px;
        color: #444;
        width: 50%;
        span {
        }
        li {
          list-style: disc;
          padding-top: 10px;
        }
        // li:nth-of-type(odd){ background:#fff;}
        li:nth-of-type(even) {
          list-style: circle;
          // color: #826d5b;
        }
      }
      .name {
        padding-bottom: 5px;
       
      }
    }
    .download-dialog-wrapper {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      z-index: 99;
      background: rgba(36, 33, 34, 0.87);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;
      > div {
        width: 400px;
        height: 150px;
        background: #fff;
        position: relative;
        .close-wrapper {
          position: absolute;
          right: 10px;
          top: 6px;
          color: #444;
          width: 10px;
          height: 10px;
          cursor: pointer;
        }
      }
      .progress-wrapper {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .progress-text {
          color: #444;
          display: block;
          padding-bottom: 30px;
        }
        .progress {
          font-size: 6px;
          width: 80%;
        }
      }
      .download-result {
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        button {
          cursor: pointer;
          color: #239afa;
          height: 30px;
          line-height: 30px;
          border: none;
          text-align: left;
          display: block;
          margin-top: 10px;
        }
        .restart {
          color: red;
        }
        .el-icon-loading, .el-icon-success {
          font-size: 30px;
          margin-bottom: 16px;
        }
        .el-icon-loading {
          color: #dd4444;
        }
        .el-icon-success {
          color: green;
        }
      }
    }
  }
</style>
