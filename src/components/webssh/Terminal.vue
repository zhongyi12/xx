<template>
  <div class="terminal-wrapper">
    <div class="terminal-header" v-if="term.sockInfo.connected">
        <span class="terminal-title">{{ $t('terminal') }}-({{ term.sockInfo.host }}:{{ term.sockInfo.port }})</span>
        <span class="terminal-time">{{ term.time }}</span>
        <div class="dialog-close el-icon-close" @click="closeTerminal()"></div>
    </div>
    <div class="terminal-console" :id="'terminal-' + term.time"></div>
  </div>
</template>
<script>
import * as fit from 'xterm/lib/addons/fit/fit'
import * as attach from 'xterm/lib/addons/attach/attach'
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import { Terminal } from 'xterm'
import 'xterm/dist/xterm.css';

Terminal.applyAddon(fit)
Terminal.applyAddon(attach)
Terminal.applyAddon(fullscreen)

export default {
  name: 'Terminal',
  props: {
    term: {
      type: Object,
      default: {
        sockInfo: {
          connected: false,
          sock: null,
          host: null,
          port: null,
        },
        term: null,
        time: Date.parse(new Date()),
      },
    },
    currentIndex: {
      type: Number,
      default: -1,
    },
  },
  i18n: {
    messages: {
      en: {
        terminal: 'Terminal',
      },
      cn: {
        terminal: '终端',
      },
    },
  },
  data() {
    return {
      util: window.GlobalUtil,
      terms: window.GlobalUtil.sshInfo.terms,
      termContainer: null,
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    onOpenTerminal() {
      console.log(`ssh onopen: ${this.term.sockInfo.host}, time: ${this.term.time}`)
      this.term.sockInfo.connected = true
      this.term.term.attach(this.term.sockInfo.sock)
      this.term.term._initialized = true
    },
    onErrorTerminal() {
      console.log(`ssh onerror: ${this.term.sockInfo.host}, time: ${this.term.time}`)
      this.term.sockInfo.connected = false
      for (let i = 0; i < this.util.sshInfo.terms.length; i += 1) {
        if (this.util.sshInfo.terms[i].time === this.term.time) {
          this.util.sshInfo.terms[i].term.detach(this.util.sshInfo.terms[i].sockInfo.sock)
          this.util.sshInfo.terms[i].term.destroy()
          this.termContainer.style.display = 'none';
        }
      }
    },
    onCloseTerminal() {
      console.log(`ssh onclose: ${this.term.sockInfo.host}, time: ${this.term.time}`)
      this.term.sockInfo.connected = false
      for (let i = 0; i < this.util.sshInfo.terms.length; i += 1) {
        if (this.util.sshInfo.terms[i].time === this.term.time) {
          this.util.sshInfo.terms[i].term.detach(this.util.sshInfo.terms[i].sockInfo.sock)
          this.util.sshInfo.terms[i].term.destroy()
          this.termContainer.style.display = 'none';
        }
      }
    },
    initTerminal(term) {
      if (term === undefined) {
        term = this.term
      }
      console.log('initTerminal', term.time)
      if (term.sockInfo === null || term.sockInfo.sock === null || term.sockInfo.sock === undefined || !term.sockInfo.connected) {
        term.sockInfo.sock = new WebSocket('ws://' + this.util.socketInfo.host + '/ws?type=webssh&host=' + this.util.sshInfo.host + '&port=' + this.util.sshInfo.port + '&username=' + this.util.sshInfo.username + '&password=' + this.util.sshInfo.password)
        term.sockInfo.host = this.util.sshInfo.host
        term.sockInfo.port = this.util.sshInfo.port
        term.sockInfo.sock.onopen = this.onOpenTerminal
        term.sockInfo.sock.onclose = this.onCloseTerminal
        term.sockInfo.sock.onerror = this.onErrorTerminal
        console.log('connect socket')
      }

      if (term.term === null || term.term === undefined) {
        term.term = new Terminal()
        console.log('create terminal')
      }
      this.termContainer = document.getElementById('terminal-' + term.time)
      term.term.open(this.termContainer)
    },
    closeTerminal() {
      console.log('closeTerminal:', this.term.time)
      if (this.term.sockInfo.sock && this.term.sockInfo.connected) {
        this.term.sockInfo.sock.close()
      }
    },
  },
  mounted() {
    this.initTerminal();
  },
  beforeDestroy() {
    console.log('beforeDestroy: ', this.term.time)
    // if (!this.term.sockInfo.connected) {
    //   this.util.sshInfo.terms.splice(this.currentIndex, 1)
    // }
  },
}
</script>
<style scoped lang="scss">
.terminal-wrapper {
  margin-top: 10px;
  margin-bottom: 20px;
  display: inline-block;
  // margin-left: 10px;
  // margin-right: 20px;
  .terminal-header {
    display: flex;
    margin-bottom: 5px;

    .terminal-title {
      color: rgb(7, 76, 167);
      text-align: left;
      width: 50%;
    }
    .terminal-time {
      margin: auto;
      margin-right: 50px;
      text-align: right;
      color: red;
      font-size: 12px;
    }
    .dialog-close {
      // top: 15px;
      // margin-left: 20%;
      // left: 78%;
      // top: 9%;
      margin: auto;
      margin-right: 0px;
      width: 20px;
      height: 20px;
      // color: #FFFFFF;
      // background-image: url('./../../assets/img/ide/icon_close.svg');
      // background-position: center;
      // background-repeat: no-repeat;
      // background-size: 16px 16px;
    }
    .dialog-close:hover {
      color: red;
    }
  }
  .terminal-console {
    // display: flex;
    // margin-left: 20%;
    // margin-right: 20%;
    // margin-top: 10px;
  }
}
</style>
