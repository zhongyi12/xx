<template>
  <div class="log-wrapper com-module-wrapper">
    <div style="display: flex">
      <el-input
        style="width: 90%;" 
        :placeholder="$t('cmdPlaceholder')" 
        v-model="cmd" 
        @keyup.enter.native="sendCommand">
        <template slot="prepend">{{ $t('command') }}</template>
      </el-input>
      <el-button @click="sendCommand()">{{ $t('send') }}</el-button>
    </div>
    <el-button style="position: absolute;left: 1vw;top: 50px;background: #fb7e46;color: #fff;" @click="getErrorWarnCode()">{{ $t('getErrorWarnCode') }}</el-button>
    <el-button style="position: absolute;left: 13vw;top: 50px;background: #fb7e46;color: #fff;" @click="getServoDebugMsg()">{{ $t('getServoDebugMsg') }}</el-button>
    <el-button style="position: absolute;left: 26vw;top: 50px;background: #fb7e46;color: #fff;" @click="clearErrorWarn()">{{ $t('clearErrorWarn') }}</el-button>
    <el-button style="position: absolute;left: 39vw;top: 50px;background: #fb7e46;color: #fff;" @click="emergencyStop()">{{ $t('emergencyStop') }}</el-button>
    <!-- <el-button style="position: absolute;left: 40vw;top: 50px;background: #fb7e46;color: #fff;" @click="clearError()">{{ $t('clearError') }}</el-button>
    <el-button style="position: absolute;left: 49vw;top: 50px;background: #fb7e46;color: #fff;" @click="clearWarn()">{{ $t('clearWarn') }}</el-button> -->
    <el-button style="position: absolute;right: 5vw;top: 50px;background: #fb7e46;color: #fff;" @click="clearLog()">{{ $t('clearLog') }}</el-button>
    <div class="log-content" id="debug-log-content">
    </div>
  </div>
</template>

<script>
export default {
  i18n: {
    messages: {
      en: {
        studioLog: 'Debug',
        cmdPlaceholder: 'Please enter a command',
        command: 'Command',
        send: 'Send',
        getErrorWarnCode: 'getErrorWarnCode',
        getServoDebugMsg: 'getServoDebugMsg',
        clearErrorWarn: 'ClearErrorWarn',
        clearError: 'ClearError',
        clearWarn: 'ClearWarn',
        clearLog: 'ClearLog',
        emergencyStop: 'EMERGENCY STOP',
      },
      cn: {
        studioLog: '调试',
        cmdPlaceholder: '请输入命令',
        command: '命令',
        send: '发送',
        getErrorWarnCode: '错误警告码',
        getServoDebugMsg: '电机调试信息',
        clearErrorWarn: '清除错误警告',
        clearError: '清除错误',
        clearWarn: '清除警告',
        clearLog: '清除输出',
        emergencyStop: '紧急停止',
      },
    },
  },
  data() {
    return {
      logInfo: '',
      number: 50,
      cmd: 'help',
    };
  },
  created() {
  },
  mounted() {
  },
  methods: {
    goBack() {
      this.number = 50;
      // this.$router.push('Setting');
      // this.$router.push({ name: 'Setting' });
      this.$router.go(-1);
    },
    emergencyStop() {
      window.CommandsRobotSocket.urgentStop(false);
    },
    sendCommand() {
      if (!this.cmd) {
        return;
      }
      window.GlobalUtil.socketCom.sendCmd('xarm_send_command', {
        data: {
          command: this.cmd
        }
      }, (response) => {
        if (response.data === null || response.data === undefined) {
          return;
        }
        let logStr = '';
        const debugLogEle = document.getElementById('debug-log-content');
        if (this.cmd === 'help' || this.cmd === 'HELP') {
          const obj = response.data;
          logStr += `<p style="font-weight: bold">[命令大全/help] code: ${response.code}</p>`
          Object.keys(response.data).sort().forEach((key) => {
            logStr += `<p style="margin-left: 20px;"><span style="color: blue;">${key}</span>: ${obj[key]}</p>`
          })
        }
        else if (this.cmd == 'H106') {
          if ([0, 1, 2].includes(response.code)) {
            const data = response.data;
            const code = response.code;
            debugLogEle.innerHTML += `<p style="font-weight: bold">[H106] code: ${code}</p>`;
            for (let i = 0; i < data.length; i++) {
              const servo = data[i];
              this.logServoInfo(debugLogEle, servo);
            }
            return;
          }
          else {
            logStr = `<span style="font-weight: bold">[${this.cmd}] code: ${response.code}</span>, data: ${JSON.stringify(response.data)}`
          }
        }
        else {
          logStr = `<p style="font-weight: bold">[${this.cmd}] code: ${response.code}</p>`;
          logStr += `<p style="margin-left: 20px;">data: ${JSON.stringify(response.data)}</p>`;
          // logStr = `[${this.cmd}] code: ${response.code}, data: ${JSON.stringify(response.data)}`;
        }
        debugLogEle.innerHTML += `<p>${logStr}</p>`;
        debugLogEle.scrollTop = debugLogEle.scrollHeight;
      });
    },
    getErrorWarnCode() {
      window.GlobalUtil.socketCom.sendCmd(window.GlobalConstant.GET_ERROR_WARN_CODE, {}, (response) => {
        if (response.data === null || response.data === undefined) {
          return;
        }
        const debugLogEle = document.getElementById('debug-log-content');
        let logStr = `[获取控制器错误警告码] code: ${response.code}, 错误码: ${response.data[0]}, 警告码: ${response.data[1]}`;
        debugLogEle.innerHTML += `<p style="font-weight: bold">${logStr}</p>`;
        debugLogEle.scrollTop = debugLogEle.scrollHeight;
      });
    },
    getServoDebugMsg() {
      window.GlobalUtil.socketCom.sendCmd(window.GlobalConstant.GET_SERVO_DEBUG_MSG, {}, (response) => {
        if (response.data === null || response.data === undefined) {
          return;
        }
        const debugLogEle = document.getElementById('debug-log-content');
        if ([0, 1, 2].includes(response.code)) {
          const data = response.data;
          console.log(data);
          const code = response.code;
          debugLogEle.innerHTML += `<p style="font-weight: bold">[电机调试信息] code: ${code}</p>`;
          for (let i = 0; i < data.length; i++) {
            const servo = data[i];
            this.logServoInfo(debugLogEle, servo);
          }
        }
        debugLogEle.scrollTop = debugLogEle.scrollHeight;
      });
    },
    logServoInfo(ele, servo) {
      let codeColor = 'black';
      let statusColor = 'block';
      if (servo.error.code !== 0) {
        codeColor = 'red';
      }
      if (servo.status !== 0) {
        statusColor = 'red';
      }
      ele.innerHTML += `<p style="margin-left: 20px;">${servo.name},  状态: <span style="color: ${statusColor};">${servo.status}</span>, 报警代码: <span style="color: ${codeColor};">0x${servo.error.code.toString(16)} (${servo.error.code})</span></p>`;
      if (servo.error.code !== 0 || servo.status !== 0) {
        ele.innerHTML += `<p style="margin-left: 30px;">错误信息: ${servo.error.desc}</p>`;
      }
    },
    clearErrorWarn() {
      window.CommandsRobotSocket.cleanErrorWarn((response) => {
        const debugLogEle = document.getElementById('debug-log-content');
        let logStr = `[清除控制器错误警告] code: ${response.code}`;
        debugLogEle.innerHTML += `<p style="font-weight: bold">${logStr}</p>`;
        debugLogEle.scrollTop = debugLogEle.scrollHeight;
      });
    },
    clearError() {
      window.CommandsRobotSocket.cleanError((response) => {
        const debugLogEle = document.getElementById('debug-log-content');
        let logStr = `[清除错误] code: ${response.code}`;
        debugLogEle.innerHTML += `<p style="font-weight: bold">${logStr}</p>`;
        debugLogEle.scrollTop = debugLogEle.scrollHeight;
      });
    },
    clearWarn() {
      window.CommandsRobotSocket.cleanWarn((response) => {
        const debugLogEle = document.getElementById('debug-log-content');
        let logStr = `[清除警告] code: ${response.code}`;
        debugLogEle.innerHTML += `<p style="font-weight: bold">${logStr}</p>`;
        debugLogEle.scrollTop = debugLogEle.scrollHeight;
      });
    },
    clearLog() {
      const debugLogEle = document.getElementById('debug-log-content');
      debugLogEle.innerHTML = '';
    }
  },
  watch: {
    $route() {
      // if (this.$route.name === 'LogInfo') {
      //   this.getLogInfo();
      // }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .log-wrapper {
    background: #f0f0f0;
    border-left: 1px solid rgba(137, 137, 137, 0.35);
    .log-content {
      position: absolute;
      top: 106px;
      bottom: 20px;
      width: 95%;
      // height: 86vh;
      padding: 0 5vw;
      font-size: 14px;
      overflow-y: auto;
    }
  }
</style>
