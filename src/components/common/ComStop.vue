<template>
   <button class="stop-active" :style="{color: isConnected ? '#c62533' : 'gray'}" @click="xArmUrgentStop()">
  
  </button>
  <!-- <div class="container" id="stop-div-id">
    <button class="com-circle-btn stop-inactive" v-if="!isConnected"></button>
    <button class="com-circle-btn stop-active" v-else @click="xArmUrgentStop()"></button>
  </div> -->
</template>
<script>

// import * as types from '@/store/mutation-types';

export default {
  i18n: {
    messages: {
      en: {
        stop: 'Stop',
        emergencyStop: 'EMERGENCY STOP',
      },
      cn: {
        stop: '停止',
        emergencyStop: '紧急停止',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      touch: null,
      isDown: false,
      dbDown: false,
      div: null,
      curPos: {
        x: 0, 
        y: 0,
        dx: 0,
        dy: 0,
        ex: 0,
        ey: 0,
      },
      lastPos: {
        x: 0,
        y: 0,
      },
      width: 50,
      height: 50,
    }
  },
  mounted() {
    console.log('this.$store.state', this.$store.state);
    this.model.robot.state.comStop = (dontSendCmd) => {
      this.xArmUrgentStop(dontSendCmd);
    };
    document.body.addEventListener('touchstart', function(){ });
    // this.width = this.model.commonStatusMgr.comStop.width;
    // this.height = this.model.commonStatusMgr.comStop.height;
    // this.div = document.getElementById('stop-div-id');
    // this.lastPos.x = this.model.commonStatusMgr.comStop.x;
    // this.lastPos.y = this.model.commonStatusMgr.comStop.y;
    // this.div.style.left = this.model.commonStatusMgr.comStop.x + 'px';
    // this.div.style.top = this.model.commonStatusMgr.comStop.y + 'px';
    // if (this.model.commonStatusMgr.comStop.x > window.innerWidth - this.width / 2 * 3 && this.model.commonStatusMgr.comStop.y < this.height / 2) {
    //   this.model.commonStatusMgr.comStop.x = window.innerWidth - this.width - 4;
    //   this.model.commonStatusMgr.comStop.y = -1;
    //   this.model.commonStatusMgr.comStop.width = 44;
    //   this.model.commonStatusMgr.comStop.height = 44;
    //   document.getElementById('stop-div-id').style.width = this.model.commonStatusMgr.comStop.width + 2 + 'px';
    //   document.getElementById('stop-div-id').style.width = this.model.commonStatusMgr.comStop.height + 2 + 'px';
    //   const eles = document.getElementsByClassName('com-circle-btn');
    //   for (let i = 0; i < eles.length; i++) {
    //     eles[i].style.width = this.model.commonStatusMgr.comStop.width + 'px';
    //     eles[i].style.height = this.model.commonStatusMgr.comStop.height + 'px';
    //   };
    // }
    // else {
    //   this.model.commonStatusMgr.comStop.width = 60;
    //   this.model.commonStatusMgr.comStop.height = 60;
    //   document.getElementById('stop-div-id').style.width = this.model.commonStatusMgr.comStop.width + 2 + 'px';
    //   document.getElementById('stop-div-id').style.width = this.model.commonStatusMgr.comStop.height + 2 + 'px';
    //   const eles = document.getElementsByClassName('com-circle-btn');
    //   for (let i = 0; i < eles.length; i++) {
    //     eles[i].style.width = this.model.commonStatusMgr.comStop.width + 'px';
    //     eles[i].style.height = this.model.commonStatusMgr.comStop.height + 'px';
    //   };
    // }
    // this.div.addEventListener("mousedown", this.down, false);
    // this.div.addEventListener("touchstart", this.down, false);
    
    // window.addEventListener("mousemove", this.move, false);
    // window.addEventListener("touchmove", this.move, false);

    // this.div.addEventListener("touchend", this.end, false);
    // this.div.addEventListener("mouseup", this.end, false);
    // document.body.addEventListener("touchend", this.end, false);
    // document.body.addEventListener("mouseup", this.end, false);
    // // this.div.addEventListener( "mouseout", this.end, false);
    // // this.div.addEventListener( "touchcancel", this.end, false);
    // // this.div.addEventListener( "touchleave", this.end, false);
    // window.addEventListener('resize', this.resize, false);
  },
  beforeDestroy() {
    // this.div.removeEventListener('mousedown', this.down);
    // this.div.removeEventListener('touchstart', this.down);
    
    // window.removeEventListener('mousemove', this.move);
    // window.removeEventListener('touchmove', this.move);

    // this.div.removeEventListener('touchend', this.end);
    // this.div.removeEventListener('mouseup', this.end);
    // document.body.removeEventListener('touchend', this.end);
    // document.body.removeEventListener('mouseup', this.end);
    // // this.div.removeEventListener( "mouseout", this.end);
    // // this.div.removeEventListener( "touchcancel", this.end);
    // // this.div.removeEventListener( "touchleave", this.end);
  },
  methods: {
    xArmUrgentStop(dontSendCmd) {
      // if (Math.abs(this.lastPos.x - this.model.commonStatusMgr.comStop.x) > 2 || Math.abs(this.lastPos.y - this.model.commonStatusMgr.comStop.y) > 2) {
      //   this.lastPos.x = this.model.commonStatusMgr.comStop.x;
      //   this.lastPos.y = this.model.commonStatusMgr.comStop.y;
      //   return;
      // }
      // this.lastPos.x = this.model.commonStatusMgr.comStop.x;
      // this.lastPos.y = this.model.commonStatusMgr.comStop.y;
      // if (this.dbDown) {
      //   return;
      // }
      // this.$message({
      //   duration: 500,
      //   type: 'info',
      //   showClose: true,
      //   message: 'stop'
      // });
      window.Blockly.Running = false;
      if (dontSendCmd !== true) {
        window.CommandsRobotSocket.urgentStop(false);
      }
      // window.CommandsRobotSocket.urgentStop(false);
      try {
        window.Blockly.setBlocksDeletable(true);
        window.Blockly.setBlocksEditable(true);
        window.Blockly.setBlocksMovable(true);
        window.Blockly.onBlocklyProjectStop();
      } catch (e) {}
      this.model.localAppsMgr.enableRun = true;
      // this.model.robot.state.jointRangeMoved.state = false;
      // this.$store.commit(types.XARM_URGENT_STOP, false);
      // this.model.robot.state.jointRangeMoving = false;
      if (this.model.robot.state.info.online) {
        this.model.robot.state.jointRangeMoving = false;
      }
      Blockly.Running = false;
      this.model.localAppsMgr.enableRun = true;
      const ele = document.getElementsByClassName('stop-active')[0];
      if (ele !== undefined && ele !== null) {
        ele.style.color = '#409EFF';
        setTimeout(() => {
          ele.style.color = ''
        }, 500)
      }
    },
    onFocus(evt) {
      console.log('debug: focus,', evt);
    },
    resize(event) {
      this.model.commonStatusMgr.comStop.width = 44;
      this.model.commonStatusMgr.comStop.height = 44;
      this.width = this.model.commonStatusMgr.comStop.width;
      this.height = this.model.commonStatusMgr.comStop.height;
      this.model.commonStatusMgr.comStop.x = window.innerWidth - this.width - 4;
      this.model.commonStatusMgr.comStop.y = -1;
      this.lastPos.x = this.model.commonStatusMgr.comStop.x;
      this.lastPos.y = this.model.commonStatusMgr.comStop.y;
      document.getElementById('stop-div-id').style.width = this.model.commonStatusMgr.comStop.width + 2 + 'px';
      document.getElementById('stop-div-id').style.width = this.model.commonStatusMgr.comStop.height + 2 + 'px';
      const eles = document.getElementsByClassName('com-circle-btn');
      for (let i = 0; i < eles.length; i++) {
        eles[i].style.width = this.model.commonStatusMgr.comStop.width + 'px';
        eles[i].style.height = this.model.commonStatusMgr.comStop.height + 'px';
      };
      this.div.style.left = this.model.commonStatusMgr.comStop.x + "px";
      this.div.style.top = this.model.commonStatusMgr.comStop.y + "px";
    },
    down(event) {
      if (this.isDown) {
        this.dbDown = true;
      }
      else {
        this.dbDown = false;
      }
      // console.log('debug: down');
      this.lastPos.x = this.model.commonStatusMgr.comStop.x;
      this.lastPos.y = this.model.commonStatusMgr.comStop.y;
      if (event.touches) {
        this.touch = event.touches[0];
      }
      else {
        this.touch = event;
      }
      this.isDown = true;
      this.curPos.x = this.touch.clientX;
      this.curPos.y = this.touch.clientY;
      this.curPos.dx = this.div.offsetLeft;
      this.curPos.dy = this.div.offsetTop;
      this.curPos.ex = this.curPos.x - this.model.commonStatusMgr.comStop.x;
      this.curPos.ey = this.curPos.y - this.model.commonStatusMgr.comStop.y;
    },
    move(event) {
      if (event.touches) {
        this.touch = event.touches[0];
      }
      else {
        this.touch = event;
      }
      if (this.isDown) {
        // console.log('debug: move');
        const nx = this.touch.clientX - this.curPos.x;//记录在鼠标|手指x轴移动的数据
        const ny = this.touch.clientY - this.curPos.y;//记录在鼠标|手指y轴移动的数据
        let x = this.curPos.dx + nx; //div在x轴的偏移量加上鼠标|手指在x轴移动的距离
        let y = this.curPos.dy + ny; //div在y轴的偏移量加上鼠标|手指在y轴移动的距离
        if (x < 0) {
          x = 0;
          // this.isDown = false;
        }
        else if (x > window.innerWidth - this.width) {
          // x = window.innerWidth - this.width - this.curPos.ex;
          x = window.innerWidth - this.width;
          // this.isDown = false;
        }
        if (y < 0) {
          y = 0;
          // this.isDown = false;
        }
        else if (y > window.innerHeight - this.height) {
          // y = window.innerHeight - this.heigth - this.curPos.ey;
          y = window.innerHeight - this.heigth;
          // this.isDown = false;
        }
        this.model.commonStatusMgr.comStop.x = x;
        this.model.commonStatusMgr.comStop.y = y;
        // this.model.commonStatusMgr.comStop.x = x <= window.innerWidth - this.width ? x : window.innerWidth - this.width;
        // this.model.commonStatusMgr.comStop.y = y <= window.innerHeight - this.height ? y : window.innerHeight - this.heigth;
        // if (this.model.commonStatusMgr.comStop.x > window.innerWidth - this.width / 2 * 3) {
        //   this.model.commonStatusMgr.comStop.x = window.innerWidth - this.width - 5;
        // }
        if (this.model.commonStatusMgr.comStop.y < this.height / 2) {
          this.model.commonStatusMgr.comStop.y = -1;
          this.model.commonStatusMgr.comStop.width = 44;
          this.model.commonStatusMgr.comStop.height = 44;
        }
        else {
          this.model.commonStatusMgr.comStop.width = 60;
          this.model.commonStatusMgr.comStop.height = 60;
          document.getElementById('stop-div-id').style.width = this.model.commonStatusMgr.comStop.width + 2 + 'px';
          document.getElementById('stop-div-id').style.width = this.model.commonStatusMgr.comStop.height + 2 + 'px';
        }

        this.div.style.left = this.model.commonStatusMgr.comStop.x + "px";
        this.div.style.top = this.model.commonStatusMgr.comStop.y + "px";
        const eles = document.getElementsByClassName('com-circle-btn1');
        for (let i = 0; i < eles.length; i++) {
          eles[i].style.width = this.model.commonStatusMgr.comStop.width + 'px';
          eles[i].style.height = this.model.commonStatusMgr.comStop.height + 'px';
        };
        //阻止页面的滑动默认事件
        document.addEventListener("touchmove",function(){
            event.preventDefault();
        },false);
      }
    },
    end(event) {
      // console.log('debug: up');
      this.isDown = false;
    }
  },
  computed: {
    isConnected() {
      return this.$store.state.robot.status.connected;
    },
//    stopBtn: () => ({
//      'stop-inactive': window.GlobalUtil.store.state !== undefined ? !window.GlobalUtil.store.state.robot.status.connected : false,
//      'stop-active': window.GlobalUtil.store.state !== undefined ? window.GlobalUtil.store.state.robot.status.connected : false,
//    }),
  },
};
</script>
<style scoped lang="scss">

.el-button:active {
  background-color: #ecf5ff;
}
.container {
  display: flex;
  align-items: center;
  z-index: 9999;
  position: absolute;
  top: 0;
  right: 0;
}
  .stop-inactive {
    background-image: url("./../../assets/img/control/em_stop_en.png");
    pointer-events: none;
    cursor: default;
    background-repeat:no-repeat; 
    background-size:100% 100%;
    background-size: 30px 30px;
    -moz-background-size:100% 100%;
  }
  .stop-active {
     background-image:  url("./../../assets/img/control/em_stop_en.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border: none;
    padding: 26px 158px;
    background-position: center;
    transition: 0.3s;
  }
  
  .stop-active:active {
    transform: scale(0.90);
  
   
 }
</style>

