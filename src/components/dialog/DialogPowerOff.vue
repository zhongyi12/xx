
<template>
  <div class="noselected">
    <div class="dialog-wrap">
      <div class="dialog-cover" @click="showPowerOffDialog"></div>
      <div class="dialog-content">
        <span class="top-title">
          {{ $t('title') }}
        </span>
        <div class="save-dialog-text">
          <div class="robot-setting">
            <!-- <p @click="shutdown()" style="color: #d68711;"><i class="shutdown-icon"></i>{{$t('shutDown')}}</p>
            <p @click="reboot()" style="color:red;"><i class="reboot-icon"></i>{{$t('reboot')}}</p> -->
            <div>
              <el-button @click="shutdown()" class="shutdown-icon" style="color: #bd422e;">{{$t('shutDown')}}</el-button>
            </div>
            <div>
              <el-button @click="reboot()" class="reboot-icon" style="color: #749223;">{{$t('reboot')}}</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // const path = require('path');
  // import * as types from './../store/mutation-types';
  import config from '../../config';

  export default {
    props: ['showPowerOffDialog'],
    i18n: {
      messages: {
        en: {
          title: 'What are you going to do?',
          shutDown: 'xArm Shutdown',
          reboot: 'xArm Reboot',
          xArmIsNotConnected: 'xArm is not connected, please connect to xArm at first.',
        },
        cn: {
          title: '希望做什么？',
          shutDown: 'xArm 关机',
          reboot: 'xArm 重启',
          xArmIsNotConnected: '机械臂没有连接，请先连接机械臂.',
        },
      },
    },
    data() {
      return {
        model: window.GlobalUtil.model,
      }
    },
    mounted() {
      document.onkeydown = () => {
        if (window.event.keyCode === 13) {
          this.showAboutDialog();
        }
      };
    },
    methods: {
      shutdown() {
        if (!this.$store.state.robot.status.connected) {
          this.$message({
            message: this.$t('xArmIsNotConnected'),
            duration: 1000,
          })
          return
        }
        window.CommandsRobotSocket.shutdown((response) => {
//          console.log(response);
//          console.log('debug code:', response.code);
          if (response.code === 0) {
            window.GlobalUtil.goSearchPage();
          }
        });
      },
      reboot() {
        if (!this.$store.state.robot.status.connected) {
          this.$message({
            message: this.$t('xArmIsNotConnected'),
            duration: 1000,
          })
          return
        }
        window.CommandsRobotSocket.reboot((response) => {
//          console.log(response);
        //  console.log('debug code:', response.code);
          if (response.code === 0) {
            window.GlobalUtil.goSearchPage();
          }
        });
      },
//      shutdown() {
//        this.$confirm('你确定要关机吗?', 'Warning', {
//          confirmButtonText: '关机',
//          cancelButtonText: '取消',
//          type: 'warning',
//        }).then(() => {
//          console.log('shutdown')
//          window.CommandsRobotSocket.shutdown((response) => {
//            console.log(response);
//          });
//        }).catch(() => {
//          console.log('canceled shutdown')
//        })
//      },
//      reboot() {
//        this.$confirm('你确定要重启吗?', 'Warning', {
//          confirmButtonText: '重启',
//          cancelButtonText: '取消',
//          type: 'warning',
//        }).then(() => {
//          console.log('reboot')
//          window.CommandsRobotSocket.reboot((response) => {
//            console.log(response);
//          });
//        }).catch(() => {
//          console.log('canceled reboot')
//        })
//      },
    },
    components: {
    },
    computed: {
      isConnected() {
        return this.$store.state.robot.status.connected;
      },
    },
    watch: {
      isConnected(curVal, newVal) {
        if (!this.$store.state.robot.status.connected) {
          this.showPowerOffDialog();
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .shutdown-icon {
    background-image: url("../../assets/img/dialog/shutdown.png");
    background-position: left;
    background-repeat: no-repeat;
    background-size: 16px 16px;
    position: absolute;
    left: 150px;
  }
  .reboot-icon {
    background-image: url("../../assets/img/dialog/reboot.png");
    background-position: left;
    background-repeat: no-repeat;
    background-size: 16px 16px;
    position: absolute;
    top: 100px;
    left: 150px;
  }
  .el-button {
    border: none;
  }
  .top-title {
    text-align: center;
    display: block;
    line-height: 40px;
    font-size: 16px;
    background: #9d9d9d;
    color: #fff;
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
    padding-top: 20px;
  }
  .save-dialog-text p {
    color: #0ba0d3;
    margin: 6px auto 0;
    padding: 6px;
    cursor: pointer;
    width: 152px;
    text-align: left;
    font-size: 14px;
    .el-icon-back {
      transform: rotate(-180deg);
      margin-right: 10px;
    }
  }
  .save-dialog-text p:hover, .save-dialog-text p:active {
    background: #dedede;
  }
</style>
