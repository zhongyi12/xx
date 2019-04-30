<template lang="html">
  <div class="app-container">
    <!-- <CommonBaseTopMenu
      :backTitle="$t('terminal')">
    </CommonBaseTopMenu> -->
    <!--<div class="robot-setting">-->
      <!--<button @click="shutdown()">Shutdown</button>-->
      <!--<button @click="reboot()">Reboot</button>-->
    <!--</div>-->
    <div class="webssh-area">
      <div class="webssh-control">
        <div>
          <span class="webssh-show-text">{{$t('host')}}:</span>
          <input type="text" placeholder="host" v-model="sshHost">
        </div>
        <div>
          <span>{{$t('post')}}:</span>
          <input type="text" placeholder="port" v-model="sshPort">
        </div>
        <div>
          <span>{{$t('username')}}:</span>
          <input type="text" placeholder="username" v-model="sshUsername">
        </div>
        <div>
          <span>{{$t('password')}}:</span>
          <input type="text" placeholder="password" v-model="sshPassword" v-if="util.sshInfo.showPassword === true">
          <input v-else type="password" placeholder="password" v-model="sshPassword">
        </div>
        <el-button type="primary" class="webssh-btn" @click="connectSSH()">{{$t('connectSsh')}}</el-button>
      </div>
      <div v-model="termsCount" class="terminal-group">
        <template v-for="(term, index) in util.sshInfo.terms">
          <Terminal :term="term" :currentIndex="index"></Terminal>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import CommonBaseTopMenu from './common/CommonBaseTopMenu';
import Terminal from './webssh/Terminal'

export default {
  name: 'WebSSH',
  i18n: {
    messages: {
      en: {
        terminal: 'Terminal',
        host: 'Host',
        port: 'Port',
        username: 'Username',
        password: 'Password',
        connectSsh: 'Connect SSH',
        terminalLimit: 'Open up to 3 terminals at the same time',
      },
      cn: {
        terminal: '终端',
        host: '主机',
        port: '端口',
        username: '用户名',
        password: '密码',
        connectSsh: '连接 SSH',
        terminalLimit: '最多同时打开3个终端',
      },
    },
  },
  data() {
    return {
      util: window.GlobalUtil,
    }
  },
  methods: {
    connectSSH() {
      // if (!this.$store.state.robot.status.connected) {
      //   this.$message('xArm is not connected, can\'t connect with ssh.')
      //   return;
      // }
      let count = 0;
      for (let i = 0; i < this.util.sshInfo.terms.length; i += 1) {
        if (this.util.sshInfo.terms[i].sockInfo.connected) {
          count += 1;
        }
      }
      if (count >= 3) {
        this.$message({
          message: this.$t('terminalLimit'),
          duration: 1000,
        })
        return
      }
      // if (this.util.sshInfo.terms.length >= 5) {
      //   this.$message('terminal limit')
      //   return
      // }
      this.util.sshInfo.terms.push({
        sockInfo: {
          connected: false,
          sock: null,
          host: null,
          port: null,
        },
        term: null,
        time: (new Date()).toLocaleString(),
      })
    },
    shutdown() {
      this.$confirm('你确定要关机吗?', 'Warning', {
        confirmButtonText: '关机',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        console.log('shutdown')
        window.CommandsRobotSocket.shutdown((response) => {
          console.log(response);
        });
      }).catch(() => {
        console.log('canceled shutdown')
      })
    },
    reboot() {
      this.$confirm('你确定要重启吗?', 'Warning', {
        confirmButtonText: '重启',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        console.log('reboot')
        window.CommandsRobotSocket.reboot((response) => {
          console.log(response);
        });
      }).catch(() => {
        console.log('canceled reboot')
      })
    },
  },
  beforeDestroy() {
    console.log('beforeDestroy')
    const terms = []
    for (let i = 0; i < this.util.sshInfo.terms.length; i += 1) {
      if (this.util.sshInfo.terms[i].sockInfo.connected) {
        terms.push(this.util.sshInfo.terms[i])
      }
    }
    this.util.sshInfo.terms = terms;
  },
  computed: {
    sshHost: {
      get() {
        if (this.util.sshInfo.host === 'localhost') {
          this.util.sshInfo.host = this.util.store.state !== undefined ? this.util.store.state.robot.info.port : this.util.sshInfo.host;
        }
        return this.util.sshInfo.host;
      },
      set(value) {
        this.util.sshInfo.host = value;
      },
    },
    sshPort: {
      get() {
        return this.util.sshInfo.port;
      },
      set(value) {
        this.util.sshInfo.port = value;
      },
    },
    sshUsername: {
      get() {
        return this.util.sshInfo.username;
      },
      set(value) {
        this.util.sshInfo.username = value;
      },
    },
    sshPassword: {
      get() {
        return this.util.sshInfo.password;
      },
      set(value) {
        this.util.sshInfo.password = value;
      },
    },
    termsCount: {
      get() {
        return this.util.sshInfo.terms.length;
      },
      set(value) {
        // this.util.sshInfo.password = value;
      },
    },
  },
  components: {
    Terminal,
    CommonBaseTopMenu,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.app-container {
  width: 100%;
  height:100%;
  border-left: 1px solid rgba(137, 137, 137, 0.35);
  overflow: auto;
}
.robot-setting {
  margin-top: 10px;
  margin-bottom: 20px;
  margin-left: 30%;
}
.webssh-area {
  // margin: auto;
  /*display: flex;*/
  .webssh-control {
    margin-top: 10px;
    /*display: flex;*/
    /*width: 19%;*/
    /*justify-content: flex-start;*/
    /*align-items: center;*/
    /*flex-direction: column;*/
    text-align: left;
    &>div {
     margin: 5px;
     display: inline-block;
    }
    span {
      margin: 6px;
      padding: 6px 0;
      width: 65px;
      display: inline-block;
      text-align: right;
    }
    input[type=text],input[type=password] {
      border: none;
      padding: 8px 10px;
      color: #666;
    }
    .webssh-btn {
      line-height: 30px;
      padding: 0 14px;
      margin-left: 50px;
    }
  }
  .terminal-group {
    text-align: center;
  }
}
.app-container::-webkit-scrollbar {/*滚动条整体样式*/
  width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.app-container::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #D8D8D8;;
}
.app-container::-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(231,231,231,0.4);
  border-radius: 0;
  background: rgba(231,231,231,0.4);
}
</style>
