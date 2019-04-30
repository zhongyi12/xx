<template lang="html">
 <div class=" test-wrapper">
  <div :class="{'btn-cover':stateOnline === false}"></div>
    <div class="test-container">

       
        <div :style="{'opacity':stateOnline === false? 0.6: 1}">
          <div class="btn-wrapper">
            <button
              id="position-z-decrease"
             
              :disabled="stateOnline === false"
              class="com-btn pos-z-down"
              :class="{'ipad-btn':isIpad}"
              @touchstart="onDown"
              @mousedown="onDown"
              @touchend="onUp"
              @mouseup="onUp"
              ><span>Z-</span></button>
            <button
              id="position-z-increase"
               class="com-btn pos-z-up"
                :class="{'ipad-btn':isIpad}"
              :disabled="stateOnline === false"
              @touchstart="onDown"
              @mousedown="onDown"
              @touchend="onUp"
              @mouseup="onUp"
              ><span >Z+</span></button>
            
          </div>
          <div class="btn-wrapper">
            <button
               class="com-btn up "
                :class="{'ipad-btn':isIpad}"
              id="position-x-increase"
               :disabled="stateOnline === false"
                @touchstart="onDown"
                @mousedown="onDown"
                @touchend="onUp"
                @mouseup="onUp"
              ><span>X+</span>
              
            </button>
          </div>
          <div class="btn-wrapper">
            <button
                class="com-btn left"
                 :class="{'ipad-btn':isIpad}"
                id="position-y-increase"
               :disabled="stateOnline === false"
                @touchstart="onDown"
                @mousedown="onDown"
                @touchend="onUp"
                @mouseup="onUp"
              ><span>Y+</span>
            </button>

            <button
            id="position-y-decrease"
              :disabled="stateOnline === false"
              @touchstart="onDown"
              @mousedown="onDown"
              @touchend="onUp"
              @mouseup="onUp"
              class="com-btn right"
               :class="{'ipad-btn':isIpad}"
              ><span>Y-</span>
            </button>
          </div>
          <div class="btn-wrapper">
            <button
               class="com-btn down"
                :class="{'ipad-btn':isIpad}"
              id="position-x-decrease"
              :disabled="stateOnline === false"
              @touchstart="onDown"
              @mousedown="onDown"
              @touchend="onUp"
              @mouseup="onUp"
              ><span>X-</span>
          </button>
            
          </div>
        </div>
        <div>
          <div class="btn-wrapper" >
            <button
              id="attitude-yaw-decrease"
              :disabled="stateOnline === false"
               class="com-btn rotate-z-left"
                :class="{'ipad-btn':isIpad}"
              @touchstart="onDown"
              @mousedown="onDown"
              @touchend="onUp"
              @mouseup="onUp"
              > <span>Yaw-</span></button>
            <button
              id="attitude-yaw-increase"
              :disabled="stateOnline === false"
              class="com-btn rotate-z-right"
               :class="{'ipad-btn':isIpad}"
              @touchstart="onDown"
              @mousedown="onDown"
              @touchend="onUp"
              @mouseup="onUp"
              ><span>Yaw+</span></button>
          </div>
          <div class="btn-wrapper">
            <button
              id="attitude-pitch-increase"
               :class="{'ipad-btn':isIpad}"
              class="com-btn up"
              :disabled="stateOnline === false"
              @touchstart="onDown"
              @mousedown="onDown"
              @touchend="onUp"
              @mouseup="onUp"
              ><span >Pitch+</span></button>
          </div>
          <div class="btn-wrapper">
            <button
              id="attitude-roll-decrease"
               :class="{'ipad-btn':isIpad}"
              :disabled="stateOnline === false"
               class="com-btn left"
              @touchstart="onDown"
              @mousedown="onDown"
              @touchend="onUp"
              @mouseup="onUp"
              ><span>Roll- </span></button>
            <button
              id="attitude-roll-increase"
               :class="{'ipad-btn':isIpad}"
              :disabled="stateOnline === false"
                class="com-btn right"
              @touchstart="onDown"
              @mousedown="onDown"
              @touchend="onUp"
              @mouseup="onUp"
              ><span>Roll+ </span></button>
          </div>
          <div class="btn-wrapper">
            <button
              id="attitude-pitch-decrease"
               :class="{'ipad-btn':isIpad}"
               class="com-btn down"
              :disabled="stateOnline === false"
              @touchstart="onDown"
              @mousedown="onDown"
              @touchend="onUp"
              @mouseup="onUp"
              ><span>Pitch- </span></button>
          </div>
        </div>

    </div>
  </div>
</template>

<script>


export default {
  data() {
    return {
      model: window.GlobalUtil.model,
      isDown: false,
      isLoop: false,
      interval: null,
      positionStep: 1,
      attitudeStep: 1,
      positionSpeed: 80,
      attitudeSpeed: 30,
      axis: 1,
    };
  },
  created() {
  },
  mounted() {
    document.body.addEventListener('touchstart', function(){ });
  },
  methods: {
    reset() {
      window.CommandsRobotSocket.goHome(true);
    },
    emergencyStop() {
      window.CommandsRobotSocket.urgentStop(false);
    },
    onDown(evt) {
      evt.preventDefault();
      this.isDown = true;
      const self = this;
      // this.moveStep(evt.target.id, false)
      this.interval = setTimeout(() => {
        if (this.isDown) {
          this.isLoop = true;
          this.moveStep(evt.target.id, true);
        }
        else {
          this.moveStep(evt.target.id, false);
        }
      }, 200)
    },
    onUp(evt) {
      // evt.preventDefault();
      this.isDown = false;
      // clearTimeout(this.interval);
      if (this.isLoop) {
        this.isLoop = false;
        clearTimeout(this.interval);
        window.CommandsRobotSocket.moveStepOver();
      }
    },
    moveStep(direction, isLoop) {
      window.CommandsRobotSocket.moveStep({'direction': direction, 'isLoop': isLoop})
    }
  },
  computed: {
    isConnected() {
      return this.$store.state.robot.status.connected;
    },
    stateOnline() {
      return this.$store.state.robot.info.online === true;
    },
    position() {
      const position = this.$store.getters.end.position;
      return position;
    },
    orientation() {
      const orientation = this.$store.getters.end.orientation;
      return orientation;
    },
    remoteJoints() {
      const joints = this.$store.getters.remoteJoints;//
      return joints;
    },
    isIpad() {
      return this.model.commonStatusMgr.isMobile;
    }
  },
  components: {

  }
};
</script>
<style lang="scss" scoped>
.test-wrapper {
  height: 100%;
  position: relative;
}
.btn-cover {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 999;
}
.test-container {
  // margin: 2vh 2vw;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  >div {
    width: 50%;
  }
}

.pos-z-up {
  background-image: url('../../assets/img/control/pos_z+.svg');

  transform: scale(0.7);
  font-size: 22px;
  margin-left: 10%;
}
.pos-z-down {
   background-image: url('../../assets/img/control/pos_z-.svg');

   transform: scale(0.7);
  font-size: 22px;
  margin-right: 10%;

}
.btn-wrapper {
  position: relative;
  height: 24%;
  display: flex;
    justify-content: center;
    align-items: center;
  // display: flex;
  // justify-content: center;
  button {
    border: none;
    cursor: pointer;
    // height: 100%;
    // width: 35%;
    text-align: center;
    position: relative;
    // margin: 1%;
  }
  button:disabled {
    color:#b4bccc;
    cursor: no-drop;
  }
  button:hover{
    // color:red;
  }
    span {pointer-events: none;}
  }
// .com-click-box {
//     height: 6vw;
//     width: 6vw;
//     transform:rotate(45deg);
//     // background: rgba(118, 111, 111, 0.31);
//     position: absolute;
//     top: 0;
//     left: 2%;
// }
.com-btn {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  border: none;
  // width: 10vw;
  // height: 8vh;
      height: 6vw;
    width: 6vw;
  // width: 100%;
  // height: 100%;
  display: block;
  text-align: center;
  position: relative;
  // position: absolute;
  // top: 0;
}
.ipad-btn {
  height: 9vw !important;
  width: 9vw !important;
}

.rotate-z-left {
   background-image: url('../../assets/img/control/rotate_z_left.svg');

   margin-right: 2%;

}
.rotate-z-right {
   background-image: url('../../assets/img/control/rotate_z_right.svg');

   margin-left: 2%;
}

.up {
 background-image: url('../../assets/img/control/pos_up.svg');
     position: absolute !important;
    bottom: -24%;
}
.down {
 background-image: url('../../assets/img/control/pos_down.svg');
 position: absolute !important;
    top: -24%;
}
.right {
 background-image: url('../../assets/img/control/pos_right.svg');
   position: absolute;
  // left: -2vw;
//  width: 7vw;
//  height: 7vh !important;
 margin-left: 5%;
}
.left {
 background-image: url('../../assets/img/control/pos_left.svg');
  position: absolute;
  // right: -2vw;
//   width: 7vw;
//  height: 7vh !important;
 margin-right: 5%;
}

 .up:active {
      background-image: url('../../assets/img/control/pos_up_active.svg');
    }
  .down:active {
    background-image: url('../../assets/img/control/pos_down_active.svg');
  }
  .right:active {
    background-image: url('../../assets/img/control/pos_right_active.svg');
  }
  .left:active {
    background-image: url('../../assets/img/control/pos_left_active.svg');
  }
  .rotate-z-left:active{
    background-image: url('../../assets/img/control/rotate_z_left_active.svg')!important;
  
  }
  .rotate-z-right:active {
    background-image: url('../../assets/img/control/rotate_z_right_active.svg')!important;
  }
  .pos-z-up:active{
    background-image: url('../../assets/img/control/pos_z+_active.svg')!important;
  }
  .pos-z-down:active {
  background-image: url('../../assets/img/control/pos_z-_active.svg')!important;

  }  
</style>