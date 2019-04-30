<template lang="html">
  <div class="app-container">

    <div v-if="isConnected && getSuccess" class="enp-wrapper">
      <div class="network-list">
        <div class="network-enp1s0 network-enp" v-show="model.commonStatusMgr.settingPanel.networkPage.showEnp1s0">
          <span class="title" v-show="model.commonStatusMgr.settingPanel.networkPage.showEnp2s0">enp1s0</span>
          <el-checkbox type="checkbox" v-model="netInfo.enp1s0.active" v-show="model.commonStatusMgr.settingPanel.networkPage.showEnp2s0 && netInfo.enp2s0.active"></el-checkbox>
          <!-- <div>
            <span class="network-show-text">Active:</span>
            <el-checkbox type="checkbox" v-model="netInfo.enp1s0.active"></el-checkbox>
          </div> -->
          <div v-if="netInfo.enp1s0.active" class="input-wrapper">
            <div v-show="model.commonStatusMgr.settingPanel.networkPage.showDHCP">
              <span class="network-show-text">DHCP:</span>
              <el-checkbox type="checkbox" v-model="netInfo.enp1s0.dhcp"></el-checkbox>
            </div>
            <div class="network-not-dhcp">
              <div>
                <span class="network-show-text">{{$t('ip')}}:</span>
                <input type="text" placeholder="ip" v-model="netInfo.enp1s0.ip" :disabled="netInfo.enp1s0.dhcp">
              </div>
              <div>
                <span>{{$t('netmask')}}:</span>
                <input type="text" placeholder="netmask" v-model="netInfo.enp1s0.netmask" :disabled="netInfo.enp1s0.dhcp">
              </div>
              <div>
                <span>{{$t('broadcast')}}:</span>
                <input type="text" placeholder="broadcast" v-model="netInfo.enp1s0.broadcast" :disabled="netInfo.enp1s0.dhcp">
              </div>
              <div>
                <span>{{$t('routes')}}:</span>
                <input type="text" placeholder="routes" v-model="netInfo.enp1s0.routes" :disabled="netInfo.enp1s0.dhcp">
              </div>
            </div>
            <div class="network-dns">
              <div @click="addDNS(1)" class="btn-dns">DNS <i class="el-icon-circle-plus-outline"></i></div>
              <div v-for="(item, index) in netInfo.enp1s0.dns" class="dns-block">
                <div style="position: relative;">
                  <span>DNS{{ index + 1 }}:</span>
                  <input type="text" placeholder="dns" v-model="netInfo.enp1s0.dns[index]">
                  <i @click="deleteDns(1, index)" class="el-icon-close" style="color: black;cursor: pointer"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="line" v-show="model.commonStatusMgr.settingPanel.networkPage.showEnp1s0 && model.commonStatusMgr.settingPanel.networkPage.showEnp2s0"></div>
        <div class="network-enp2s0 network-enp" v-show="model.commonStatusMgr.settingPanel.networkPage.showEnp2s0">
          <span class="title" v-show="model.commonStatusMgr.settingPanel.networkPage.showEnp1s0">enp2s0</span>
          <el-checkbox type="checkbox" v-model="netInfo.enp2s0.active" v-show="model.commonStatusMgr.settingPanel.networkPage.showEnp1s0 && netInfo.enp1s0.active"></el-checkbox>
          <div v-if="netInfo.enp2s0.active" class="input-wrapper">
            <div v-show="model.commonStatusMgr.settingPanel.networkPage.showDHCP">
              <span class="network-show-text">DHCP:</span>
              <el-checkbox type="checkbox" v-model="netInfo.enp2s0.dhcp"></el-checkbox>
            </div>
            <div class="network-not-dhcp">
              <div>
                <span class="network-show-text">{{$t('ip')}}:</span>
                <input type="text" placeholder="ip" v-model="netInfo.enp2s0.ip" :disabled="netInfo.enp2s0.dhcp">
              </div>
              <div>
                <span>{{$t('netmask')}}:</span>
                <input type="text" placeholder="netmask" v-model="netInfo.enp2s0.netmask" :disabled="netInfo.enp2s0.dhcp">
              </div>
              <div>
                <span>{{$t('broadcast')}}:</span>
                <input type="text" placeholder="broadcast" v-model="netInfo.enp2s0.broadcast" :disabled="netInfo.enp2s0.dhcp">
              </div>
              <div>
                <span>{{$t('routes')}}:</span>
                <input type="text" placeholder="routes" v-model="netInfo.enp2s0.routes" :disabled="netInfo.enp2s0.dhcp">
              </div>
            </div>
            <div class="network-dns">
              <div @click="addDNS(2)" class="btn-dns">DNS <i class="el-icon-circle-plus-outline"></i></div>
              <div v-for="(item, index) in netInfo.enp2s0.dns">
                <div style="position: relative;display: flex;justify-content: flex-start;align-items: center">
                  <span>DNS{{ index + 1 }}:</span>
                  <input type="text" placeholder="dns" v-model="netInfo.enp2s0.dns[index]">
                  <i @click="deleteDns(2, index)" class="el-icon-close" style="color: black;cursor: pointer"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-button v-show="model.commonStatusMgr.settingPanel.networkPage.showEnp1s0 || model.commonStatusMgr.settingPanel.networkPage.showEnp2s0" size="mini" class="save-btn" @click="saveNetWorkInfo()" :disabled="changeValue === 0 || !isConnected">{{$t('save')}}</el-button>
    </div>
     <div v-else style="padding: 30px 50px;color: #555; opacity: 0.6;">{{$t('connecting')}}</div>
    <div v-if="isRstart" class="dialog">
      <div v-if="isRstart" class="restart-result">
        <i class="el-icon-loading"></i>
        <span>{{ $t('restarting') }}</span>
      </div>
    </div>
   
  </div>
</template>

<script>
import CommonBaseTopMenu from './common/CommonBaseTopMenu';

export default {
  name: 'NetWork',
  i18n: {
    messages: {
      en: {
        network: 'NetWork',
        ip: 'IP Address',
        netmask: 'Netmask',
        broadcast: 'BroasCast',
        routes: 'Routes',
        dhcp: 'DHCP',
        save: 'Save',
        restartTitle: 'Restart?',
        restartText: 'Restart to make the network take effect',
        restart: 'Restart',
        restartLater: 'Restart later',
        restarting: 'Restarting, please wait...',
        connecting: 'Please connect xArm at first...',
      },
      cn: {
        network: '网络',
        ip: 'IP地址',
        netmask: '子网掩码',
        broadcast: '广播地址',
        routes: '默认网关',
        dhcp: '自动获取IP地址',
        save: '保存',
        restartTitle: '重启?',
        restartText: '重启使网络生效',
        restart: '马上重启',
        restartLater: '手动重启',
        restarting: '正在重启，请稍后...',
        connecting: '请先连接机械臂...',
      },
    },
  },
  data() {
    return {
      util: window.GlobalUtil,
      model: window.GlobalUtil.model,
      getSuccess: false,
      changeValue: 0,
      isRstart: false,
      isShutdown: false,
      netInfo: {
        enp1s0: {
          active: false,
          dhcp: false,
          ip: '',
          netmask: '',
          broadcat: '',
          routes: '',
          dns: [],
        },
        enp2s0: {
          active: false,
          dhcp: false,
          ip: '',
          netmask: '',
          broadcat: '',
          routes: '',
          dns: [],
        },
      },
      remoteNetInfo: null,
    }
  },
  watch: {
    'netInfo.enp1s0.active': {
      handler(curVal, oldVal) {
        if (this.remoteNetInfo !== null && this.remoteNetInfo.enp1s0.active !== this.netInfo.enp1s0.active) {
          this.changeValue |= 1
        }
        else {
          this.changeValue &= 0x3ffe
        }
      },
    },
    'netInfo.enp1s0.dhcp': {
      handler(curVal, oldVal) {
        if (this.remoteNetInfo !== null && this.remoteNetInfo.enp1s0.dhcp !== this.netInfo.enp1s0.dhcp) {
          this.changeValue |= 1 << 1
        }
        else {
          this.changeValue &= 0x3ffd
        }
      },
    },
    'netInfo.enp1s0.ip': {
      handler(curVal, oldVal) {
        if (this.remoteNetInfo !== null && this.remoteNetInfo.enp1s0.ip !== this.netInfo.enp1s0.ip) {
          this.changeValue |= 1 << 2
        }
        else {
          this.changeValue &= 0x3ffb
        }
      },
    },
    'netInfo.enp1s0.netmask': {
      handler(curVal, oldVal) {
        if (this.remoteNetInfo !== null && this.remoteNetInfo.enp1s0.netmask !== this.netInfo.enp1s0.netmask) {
          this.changeValue |= 1 << 3
        }
        else {
          this.changeValue &= 0x3ff7
        }
      },
    },
    'netInfo.enp1s0.broadcast': {
      handler(curVal, oldVal) {
        if (this.remoteNetInfo !== null && this.remoteNetInfo.enp1s0.broadcast !== this.netInfo.enp1s0.broadcast) {
          this.changeValue |= 1 << 4
        }
        else {
          this.changeValue &= 0x3fef
        }
      },
    },
    'netInfo.enp1s0.routes': {
      handler(curVal, oldVal) {
        if (this.remoteNetInfo !== null && this.remoteNetInfo.enp1s0.routes !== this.netInfo.enp1s0.routes) {
          this.changeValue |= 1 << 5
        }
        else {
          this.changeValue &= 0x3fdf
        }
      },
    },
    'netInfo.enp1s0.dns': {
      handler(curVal, oldVal) {
        this.changeValue &= 0x3fbf;
        if (this.remoteNetInfo !== null) {
          if (this.netInfo.enp1s0.dns.length !== this.remoteNetInfo.enp1s0.dns.length) {
            this.changeValue |= 1 << 6
          }
          else {
            for (let i = 0; i < this.netInfo.enp1s0.dns.length; i++) {
              if (this.remoteNetInfo.enp1s0.dns.indexOf(this.netInfo.enp1s0.dns[i]) === -1) {
                this.changeValue |= 1 << 6
              }
            }
          }
        }
        else {
          this.changeValue &= 0x3fbf
        }
      },
    },
    'netInfo.enp2s0.active': {
      handler(curVal, oldVal) {
        if (this.remoteNetInfo !== null && this.remoteNetInfo.enp2s0.active !== this.netInfo.enp2s0.active) {
          this.changeValue |= 1 << 7
        }
        else {
          this.changeValue &= 0x3f7f
        }
      },
    },
    'netInfo.enp2s0.dhcp': {
      handler(curVal, oldVal) {
        if (this.remoteNetInfo !== null && this.remoteNetInfo.enp2s0.dhcp !== this.netInfo.enp2s0.dhcp) {
          this.changeValue |= 1 << 8
        }
        else {
          this.changeValue &= 0x3eff
        }
      },
    },
    'netInfo.enp2s0.ip': {
      handler(curVal, oldVal) {
        if (this.remoteNetInfo !== null && this.remoteNetInfo.enp2s0.ip !== this.netInfo.enp2s0.ip) {
          this.changeValue |= 1 << 9
        }
        else {
          this.changeValue &= 0x3dff
        }
      },
    },
    'netInfo.enp2s0.netmask': {
      handler(curVal, oldVal) {
        if (this.remoteNetInfo !== null && this.remoteNetInfo.enp2s0.netmask !== this.netInfo.enp2s0.netmask) {
          this.changeValue |= 1 << 10
        }
        else {
          this.changeValue &= 0x3bff
        }
      },
    },
    'netInfo.enp2s0.broadcast': {
      handler(curVal, oldVal) {
        if (this.remoteNetInfo !== null && this.remoteNetInfo.enp2s0.broadcast !== this.netInfo.enp2s0.broadcast) {
          this.changeValue |= 1 << 11
        }
        else {
          this.changeValue &= 0x37ff
        }
      },
    },
    'netInfo.enp2s0.routes': {
      handler(curVal, oldVal) {
        if (this.remoteNetInfo !== null && this.remoteNetInfo.enp2s0.routes !== this.netInfo.enp2s0.routes) {
          this.changeValue |= 1 << 12
        }
        else {
          this.changeValue &= 0x2fff
        }
      },
    },
    'netInfo.enp2s0.dns': {
       handler(curVal, oldVal) {
        this.changeValue &= 0x1fff
        if (this.remoteNetInfo !== null) {
          if (this.netInfo.enp2s0.dns.length !== this.remoteNetInfo.enp2s0.dns.length) {
            this.changeValue |= 1 << 13
          }
          else {
            for (let i = 0; i < this.netInfo.enp2s0.dns.length; i++) {
              if (this.remoteNetInfo.enp2s0.dns.indexOf(this.netInfo.enp2s0.dns[i]) === -1) {
                this.changeValue |= 1 << 13
              }
            }
          }
        }
        else {
          this.changeValue &= 0x1fff
        }
      },
    },
  },
  created() {
    this.getNetWorkInfo();
  },
  mounted() {
//     this.getNetWorkInfo();
  },
  methods: {
    addDNS(index) {
      if (index === 1) {
        this.netInfo.enp1s0.dns.push(this.netInfo.enp1s0.routes);
      }
      else if (index === 2) {
        this.netInfo.enp2s0.dns.push(this.netInfo.enp2s0.routes);
      }
    },
    deleteDns(type, index) {
      if (type === 1) {
        this.netInfo.enp1s0.dns.splice(index, 1);
      }
      else if (type === 2) {
        this.netInfo.enp2s0.dns.splice(index, 1);
      }
//      this.saveNetWorkInfo();
    },
    getNetWorkInfo() {
      window.CommandsRobotSocket.getNetWorkInfo((response) => {
        console.log('debug:', response);
        if (response.code === 0) {
          this.netInfo = response.data;
          this.getSuccess = true;
          this.remoteNetInfo = JSON.parse(JSON.stringify(this.netInfo));
        }
      })
    },
    saveNetWorkInfo() {
      window.CommandsRobotSocket.setNetWorkInfo(this.netInfo, (response) => {
//        window.CommandsRobotSocket.getNetWorkInfo((response) => {
//          console.log('debug:',response)
//          if (response.code === 0) {
//            this.netInfo = response.data;
//            this.remoteNetInfo = JSON.parse(JSON.stringify(this.netInfo));
//          }
//        });
        this.getNetWorkInfo();
        this.$confirm(this.$t('restartText'), this.$t('restartTitle'), {
          confirmButtonText: this.$t('restart'),
          cancelButtonText: this.$t('restartLater'),
          type: 'warning',
        }).then(() => {
          console.log('reboot')
          window.CommandsRobotSocket.reboot(this.netInfo.enp1s0.ip, (response) => {
            this.isShutdown = false;
            this.isRstart = true;
            console.log(response);
            setTimeout(() => {
              if (this.isRstart) {
                this.$message({
                  message: 'timeout',
                  type: 'error',
                });
                this.isRstart = false;
              }
            }, 1000 * 50);
          });
        }).catch((e) => {
          console.log('canceled reboot', e)
        })
      });
    },
  },
  beforeDestroy() {
  },
  computed: {
    isConnected() {
      if (this.$store.state.robot.status.connected) {
//        window.CommandsRobotSocket.getNetWorkInfo((response) => {
//          console.log('debug:',response)
//          if (response.code === 0) {
//            this.netInfo = response.data
//            this.remoteNetInfo = JSON.parse(JSON.stringify(this.netInfo));
//          }
//        });
        // this.isRstart = false;
        if (this.isShutdown) {
          this.isRstart = false;
          this.isShutdown = false;
        }
        // this.getNetWorkInfo();
      }
      else {
        setTimeout(() => {
          this.isShutdown = true;
        }, 3000);
      }
      return this.$store.state.robot.status.connected;
    },
  },
  components: {
    CommonBaseTopMenu,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.app-container {
  width: 100%;
  height:100%;
}
.enp-wrapper {
  // display: flex;
  // flex-direction: column;
  // justify-content: space-between;
  .save-btn {
    margin:0 auto;
    background: #fb7e46;
    color: #fff;
  }
}
.network-list {
  margin: 10px 0;
  .title {
    font-family: 'Gotham-Medium';
    font-size: 18px;
  }
  .network-not-dhcp {
    width: 100%;
    >div {
      width: 49%;
      display: inline-block;
    }
  }
}
.line {
  /*border: 1px solid #e5e5e5;*/
  width: 1px;
  height: auto;
}
.dialog {
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
  .restart-result {
    height: 100px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .el-icon-loading {
      font-size: 30px;
      margin-bottom: 16px;
      color: #dd4444;
    }
  }
}
.network-enp {

  span {
    display: inline-block;
    width: 100px;
    text-align: right;
  }
  .el-checkbox[type="checkbox"] {
    margin: 10px;
  }
  input[type="text"] {
    border: 1px solid #d9d8d8;
    height: 30px;
    width: 123px;
    line-height: 30px;
    padding: 4px;
    margin: 10px;
    color: #666;
  }
  input:focus {
    color: #0aaaff;
  }
  input::-webkit-input-placeholder {
    color: #ababab;
  }
  .input-wrapper {
    width: 100%;
    height: auto;
  }
  .network-dns {
    padding-top: 30px;
     .dns-block {
        width: 49%;
        display: inline-block;
    }
    .btn-dns {
      /*margin-left: 10px;*/
      // width: 85px;
      // height: 40px;
      
    }
    .btn-dns:hover {
      i {
        color: rgb(67, 147, 238);
      }
    }
  }
}
</style>
