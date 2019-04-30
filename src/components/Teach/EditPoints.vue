<template>
  <div id='root' class="root-wrapper">
    <button class="btnText addPointBtn" @click="onAddPoint">Add Point</button>
    <button class="btnText addTimerBtn" @click="onAddTimer">Add Timer</button>
    <button class="deleteBtn" @click="onDelete">Delete</button>

    <!-- times -->
    <div class="setting-timer-line" v-if="model.localTeach.curPoint.length === 1">
      <span class="left-timer-title" style="">
        Timer
      </span>
      <input
        v-model="model.localTeach.curPoint[0]"
        @change="onTimerBlur()"
        type="range"
        min="1"
        max="99"
        value="1"
        class="timer-control">
      <div class="arrow-size" style="left:175px;" @click="moveArrow(false, 'timer')">
        <div class="arrow arrow-left"></div>
      </div>
      <div class="arrow-size" style="left:240px;" @click="moveArrow(true, 'timer')">
        <div class="arrow arrow-right"></div>
      </div>
      <input
        v-model="model.localTeach.curPoint[0]"
        disabled
        class="timer-show-input" />
    </div>
  </div>
</template>

<script>

const path = require('path');

export default {
  name: 'EditPoints',
  data() {
    return {
      model: window.GlobalUtil.model,
    };
  },
  mounted() {
  },
  activated: function() {
  },
  beforeDestroy() {
  },
  methods: {
    moveArrow(isAdd, location) {
      console.log(`location 1 = ${location}, isAdd = ${isAdd}`);
      switch (location) {
        default:
          break;
        case 'timer': {
          let secs = Number(this.model.localTeach.curPoint[0]);
          secs = isAdd ? (secs + 1) : (secs - 1);
          secs = Math.max(1, secs);
          secs = Math.min(99, secs);
          this.model.localTeach.curPoint = [secs];
          console.log(`location 2 = ${location}, isAdd = ${isAdd}, cur = ${this.model.localTeach.curPoint}`);
          this.onTimerBlur();
          break;
        }
      }
    },
    onDelete() {
      if (this.model.localTeach.curSelectedIndex < 0) {
        return;
      }
      const curEditingFileUUID = this.model.localTeach.curEditingFileUUID;
      const index = this.model.localTeach.curSelectedIndex;
      const points = this.model.localTeach.fileDatas[curEditingFileUUID];
      if (points.length <= 1) {
        this.$message({
          message: 'Only one point!',
          duration: 1000,
        });
        return;
      }
      points.splice(index, 1);
      this.save(() => {
        this.model.localTeach.curSelectedIndex = -1;
      });
    },
    onAddPoint() {
      const curEditingFileUUID = this.model.localTeach.curEditingFileUUID;
      const index = this.model.localTeach.curSelectedIndex;
      const points = this.model.localTeach.fileDatas[curEditingFileUUID];
      // add point
      let newPoint = [];
      for (let i = 0; i < points.length; i += 1) {
        const onePoint = points[i];
        if (onePoint.length === 7 && i <= index) {
          newPoint = onePoint;
        }
      }
      if (newPoint.length === 7) {
        points.splice(index + 1, 0, newPoint);
      }
      else {
        points.splice(index + 1, 0, this.model.robot.state.resetJoints.concat());
      }
      this.save(() => {
        this.model.localTeach.onSelect(null, this.model.localTeach.curSelectedIndex + 1);
      });
    },
    onAddTimer() {
      const curEditingFileUUID = this.model.localTeach.curEditingFileUUID;
      const index = this.model.localTeach.curSelectedIndex;
      const points = this.model.localTeach.fileDatas[curEditingFileUUID];
      points.splice(index + 1, 0, [2]);
      this.save(() => {
        this.model.localTeach.onSelect(null, this.model.localTeach.curSelectedIndex + 1);
      });
    },
    save(callback) {
      const curEditingFileUUID = this.model.localTeach.curEditingFileUUID;
      const points = this.model.localTeach.fileDatas[curEditingFileUUID];
      const newPoints = points.map((point) => {
        const newPoint = {
          type: point.length === 1 ? 'time' : 'joint',
          point: point,
          remark: 'remark',
        };
        return newPoint;
      });

      // const text = JSON.stringify(textDict);
      window.CommandsTeachSocket.createFile(path.basename(curEditingFileUUID), newPoints, (dict) => {
        const ret = JSON.stringify(dict);
        console.log(`ret = ${ret}`);
        this.model.localTeach.showArr = [];
        setTimeout(() => {
          this.model.localTeach.showArr = (this.model.localTeach.fileDatas[curEditingFileUUID] || []).map((item, i) => {
            return i;
          });
          if (callback) {
            callback();
          }
        });
      });
    },
    onTimerBlur() {
      const curEditingFileUUID = this.model.localTeach.curEditingFileUUID;
      const index = this.model.localTeach.curSelectedIndex;
      this.model.localTeach.fileDatas[curEditingFileUUID][index] = this.model.localTeach.curPoint; // [Number(this.timerEditingNum)];
      console.log(`fileDatas = ${JSON.stringify(this.model.localTeach.fileDatas[curEditingFileUUID])}`);
      const points = this.model.localTeach.fileDatas[curEditingFileUUID];
      const newPoints = points.map((point) => {
        const newPoint = {
          type: point.length === 1 ? 'time' : 'joint',
          point: point,
          remark: 'remark',
        };
        return newPoint;
      });

      // const text = JSON.stringify(textDict);
      window.CommandsTeachSocket.createFile(path.basename(curEditingFileUUID), newPoints, (dict) => {
        const ret = JSON.stringify(dict);
        console.log(`ret = ${ret}`);
        this.model.localTeach.showArr = [];
        setTimeout(() => {
          this.model.localTeach.showArr = (this.model.localTeach.fileDatas[curEditingFileUUID] || []).map((item, i) => {
            return i;
          });
        });
      });
      // const textDict = {
      //   type: this.model.localTeach.curProj.type,
      //   total: points.length,
      //   points: points,
      // };
      // const text = JSON.stringify(textDict);
      // window.CommandsTeachSocket.saveOrUpdateFile(curEditingFileUUID, text, (dict) => {
      //   const ret = JSON.stringify(dict);
      //   console.log(`ret = ${ret}`);
      //   this.model.localTeach.projectListShow = false;
      //   // this.singleShow = false;
      //   setTimeout(() => {
      //     this.model.localTeach.projectListShow = true;
      //   });
      // });
    },
  },
  watch: {
  },
  computed: {
  },
  components: {
  },
};
</script>

<style scoped lang="scss">
.root-wrapper {
  position: absolute;
  width: 320px;
  height: 114px;
}
.btnText {
  position: absolute;
  font-family: 'Gotham-Book';
  font-size: 12px;
  color: black; // #FFFFFF;
  letter-spacing: -0.28px;
  text-align: center;
  width: 230px;
  height: 36px;
  border: 0;
  background: #D7D7D7;
  // border: 1px solid #D7D7D7;
  cursor: pointer;
}
.addPointBtn {
  // left: 0px;
  // top: 0px;
  // border: 0;
  // border: 1px solid #DCDCDC;
  border-bottom: 1px solid gray;
  border-top: 1px solid gray;
}
.addTimerBtn {
  margin-top: 36px;
  border-bottom: 1px solid gray;
}
.deleteBtn {
  position: absolute;
  background: #E24D4A;
  width: 92px;
  height: 72px;
  border: 0;
  right: 0px;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  color: #FFFFFF;
  letter-spacing: -0.28px;
  text-align: center;
  cursor: pointer;
}
.setting-timer-line {
  position: absolute;
  width: 320px;
  height: 42px;
  // background: yellow;
  background: darkgrey;
  // top: 84px;
  margin-top: 72px;
}
.left-timer-title {
  position: absolute;
  // width: 25%;
  width: 50px;
  height: 42px;
  left: 0px;
  line-height: 42px;
  // top: 180px;
  // background: green;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  color: #555555;
  letter-spacing: -0.43px;
  text-align: right;
}
.timer-show-input {
  position: absolute;
  width: 35px;
  height: 42px;
  // top: 175px;
  left: 200px;
  background: #FDFDFD;
  border: 1px solid #D7D7D7;
  border-radius: 2px;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  text-align: center;
  color: #4B4B4B;
  outline: none;
}
.arrow {
  position:absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin:auto;
  width:16px;
  height:24px;
  background-position: center;
  background-size: 12px 6px;
  background-repeat: no-repeat;
  transform: rotate(90deg);
  // background: darkgrey;
  cursor: pointer;
}
.arrow-right {
  background-image: url('./../../assets/img/control/btn_toptriangle.svg');
  // right: 0px;
}
.arrow-left {
  background-image: url('./../../assets/img/control/btn_btmtriangle.svg');
  // left: 55px;
}
.arrow-size {
  position: absolute;
  width: 20px;
  height: 42px;
  // background: green;
}
input[type=range] {
  cursor: pointer;
}
input:disabled {
  cursor:not-allowed;
}
input[type=range]:focus {
  outline: none;
}
.timer-control {
  position: absolute;
  // appearance: slider-vertical; // abandoned, can not set width with css
  /* width: 120%; */
  left: 55px;
  // right: 0px;
  // margin: auto;
  // top: 180px;
  top: 15px;
  width: 100px;
  height: 10px;
  // background: #F2F4F7;
  background: white;
  opacity: 1;
  // transform: rotate(-90deg);
  border-radius: 100px;
  // border: #5A93D7 solid 1px;
  cursor: pointer;
  outline: none;
}
.timer-control::-webkit-slider-thumb {
  width: 20px;
  height: 20px;
  background-image: url('./../../assets/img/control/btn_slide.svg');
  background-size: 30px 30px;
  background-repeat: no-repeat;
  background-position: center;
  -webkit-appearance: none;
  border: none;
  border-radius: 50%;
  outline: none;
//  background: #5A93D7;
  // box-shadow: 0 0 8px 0 rgba(45,73,67,0.17);
  box-shadow: darkgrey 0px 0px 5px;
}
</style>
