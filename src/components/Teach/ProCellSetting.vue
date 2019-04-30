<template lang="html">
  <div class="root-wrapper">
    <div class="btn-wrapper">
      <button  class="com-btn" @click="onclickbackground"> <i class="el-icon-back"></i></button>
      <button  class="add-btn com-btn" @click="onAddPoint" :title="$t('addMotionPoint')"> </button>
      <button  class="timer-btn com-btn" @click="onAddTimer" :title="$t('addTimerPoint')"></button>
      <button class="gripper-btn com-btn" @click="onAddGripper" :title="$t('addGripperPoint')"> </button>
      <button v-if="model.localTeach.curSelectedIndex >= 0" class="del-btn com-btn" @click="onDelete" :title="$t('deleteSelectPoint')"></button>
      <button v-if="model.localTeach.curSelectedIndex >= 0 && model.localTeach.hasChange && isChange" class="save-btn com-btn" @click="onsave" :title="$t('saveChange')"></button>
      <button v-if="model.localTeach.curSelectedIndex >= 0 && model.localTeach.hasChange && isChange" class="com-btn" @click="ondiscard" :title="$t('discardChange')">
        <i class="el-icon-circle-close-outline" style="color: red;font-size: 20px;position:absolute;top: 11px;right: 29px;"></i>
      </button>
    </div>
    <div>
          <!-- <span v-if="model.localTeach.curSelectedIndex >= 0"> {{ model.localTeach.curSelectedIndex + 1 }} / {{ model.localTeach.showArr.length }} </span>
          <span v-if="model.localTeach.curSelectedIndex < 0"> {{ model.localTeach.showArr.length }} </span> -->
   
   

    <!-- <button v-if="isShowPointEdit === true" class="cancel-btn" @click='cancelEdit()'>
      Cal
    </button> -->

    <div v-if="model.localTeach.curPoint.length === 1 && isShowPointEdit === true"
      style="height:30px;display:flex;align-items: center;justify-content: flex-start; padding-left: 14px;">
      <span style="color:rgb(132, 132, 132);height:30px;line-height:30px;">
        {{ $t('remain') }}:
      </span>
       <div class="timer-icon">
      </div>
      <template v-for="index2 in [0, 1, 2, 3, 4, 5, 6]">
        <div class="input-per-number-style border-number"
          :class="{ 'selected-cell-bg': (timeIntervalSelectedIndex === 0 && index2 === 1) || (timeIntervalSelectedIndex === 1 && index2 === 2) || (timeIntervalSelectedIndex === 2 && index2 === 4) }"
          @click="changeTimeIntervalIndex(index2)">
          <div class="" v-if="index2 === 0">
            <i class="el-icon-caret-left"></i>
          </div>
          <div class="" v-if="index2 === 1">
            {{ showTimeIntervalDotValue(0) }}
          </div>
          <div class="" v-if="index2 === 2">
            {{ showTimeIntervalDotValue(1) }}
          </div>
          <div class="" v-if="index2 === 3">
            .
          </div>
          <div class="" v-if="index2 === 4">
            {{ showTimeIntervalDotValue(2) }}
          </div>
          <div class="" v-if="index2 === 5">
            s
          </div>
          <div class="" v-if="index2 === 6">
            <i class="el-icon-caret-right"></i>
          </div>
        </div>
      </template>
    </div>
</div>

  </div>
</template>

<script>

import RunSetting from './RunSetting';
import { setTimeout } from 'timers';

const path = require('path');

export default {
  props: ['cancelEdit'],
  i18n: {
    messages: {
      en: {
        editing: 'Points is editing!',
        loop: 'Loops',
        infinite: 'Infinite',
        remain: 'Remain',
        moving: 'Points is moving!',
        addMotionPoint: 'Add a point to record motion',
        addTimerPoint: 'Add a point to record time',
        addGripperPoint: 'Add a point to record  gripper',
        deleteSelectPoint: 'Delete selected point',
        saveChange: 'Save changes',
        discardChange: 'Discard changes'
      },
      cn: {
        editing: '正在编辑!',
        loop: '循环次数',
        infinite: '无限循环',
        remain: '停留',
        moving: '正在移动!',
        addMotionPoint: '增加运动记录点',
        addTimerPoint: '增加时间记录点',
        addGripperPoint: '增加机械爪记录点',
        deleteSelectPoint: '删除当前选中点',
        saveChange: '保存修改',
        discardChange: '放弃修改'
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      timeIntervalSelectedIndex: 1,
      runTimesSelectedIndex: 3,
      isRunLoop: false,
      defaultJointRemark: 'J-Mark',
      defaultTimeRemark: 'T-Mark',
      defaultGripperRemark: 'G-Mark',
      isChange: true,
    };
  },
  mounted() {
    this.model.localTeach.save = (callback) => {
      this.save(callback);
    };
    this.model.localTeach.onTimerBlur = (callback) => {
      this.onTimerBlur(callback);
    };
  },
  methods: {
    changeRunLoop(isLoop) {
      this.model.localTeach.isClickingCell = true;
      setTimeout(() => {
        this.model.localTeach.isClickingCell = false;
      }, 200);
      this.isRunLoop = isLoop;
    },
    onclickbackground() {
      const editState = this.model.localTeach.editState;
      if (this.model.localTeach.isClickingCell === false) {
        this.cancelEdit();
      }
      if (editState === false) {
        this.model.localTeach.editState = true;
      }
    },
    changeTimeIntervalIndex(index) {
      this.model.localTeach.isClickingCell = true;
      setTimeout(() => {
        this.model.localTeach.isClickingCell = false;
      }, 200);
      if ([1, 2, 4].includes(index)) {
        this.timeIntervalSelectedIndex = [1, 2, 4].indexOf(index);
      }
      let addTime = 0;
      switch (this.timeIntervalSelectedIndex) {
        case 0: {
          addTime = 10;
          break;
        }
        case 1: {
          addTime = 1;
          break;
        }
        case 2: {
          addTime = 0.1;
          break;
        }
        default:
          break;
      }
      let curTime = this.model.localTeach.curPoint[0];
      if (index === 0) {
        curTime -= addTime;
      }
      if (index === 6) {
        curTime += addTime;
      }
      curTime.toFixed(1)
      curTime = Math.max(0.1, curTime);
      curTime = Math.min(99.9, curTime);
      this.model.localTeach.curPoint = [curTime];
      this.onTimerBlur();
    },
    showTimeIntervalDotValue(index) {
      const curTime = this.model.localTeach.curPoint[0];
      const str = `0000${Math.round(Math.abs(Number(curTime * 10)))}`.slice(-3);
      return str[index];
    },
    showRunTimesDotValue(index) {
      const runTimes = this.model.localTeach.runTimes;
      const str = `0000${Math.abs(Number(runTimes))}`.slice(-4);
      return str[index];
    },
    changeRunTimesIndex(index) {
      this.changeRunLoop(false);
      this.model.localTeach.isClickingCell = true;
      setTimeout(() => {
        this.model.localTeach.isClickingCell = false;
      }, 200);
      if ([1, 2, 3, 4].includes(index)) {
        this.runTimesSelectedIndex = [1, 2, 3, 4].indexOf(index);
      }
      let addRunTime = 0;
      switch (this.runTimesSelectedIndex) {
        case 0: {
          addRunTime = 1000;
          break;
        }
        case 1: {
          addRunTime = 100;
          break;
        }
        case 2: {
          addRunTime = 10;
          break;
        }
        case 3: {
          addRunTime = 1;
          break;
        }
        default:
          break;
      }
      let runTimes = this.model.localTeach.runTimes;
      if (index === 0) {
        runTimes -= addRunTime;
      }
      if (index === 5) {
        runTimes += addRunTime;
      }
      runTimes = Math.max(1, runTimes);
      runTimes = Math.min(9999, runTimes);
      this.model.localTeach.runTimes = runTimes;
    },
    onstart() {
      this.model.localTeach.isClickingCell = true;
      setTimeout(() => {
        this.model.localTeach.isClickingCell = false;
      }, 200);
      if (!window.GlobalUtil.store.state.robot.status.connected) {
        return;
      }
      console.log('on start');
      if (this.model.localTeach.curProj.files.length > 0) {
        const uuid = this.model.localTeach.curSelectedTreeItem.uuid;
        console.log(`curSelectedTreeItem.uuid = ${uuid}`);
        const opt = {
          times: this.isRunLoop ? 0 : Number(this.model.localTeach.runTimes || 1),
          speed: Number(this.model.robot.state.local.speed || 20),
        };
        window.CommandsTeachSocket.runTeach(uuid, opt, (dict) => {
          if (dict.code === 0) {
            console.log(`run teach = ${JSON.stringify(dict)}`);
            this.model.localTeach.isTeachRunningUUID = uuid;
            this.model.localTeach.curSelectedIndex = -1;
          }
          if (dict.code === 1111) {
            console.log(`run teach stop = ${JSON.stringify(dict)}`);
            this.model.localTeach.isTeachRunningUUID = '';
            // setTimeout(() => {
              // this.$refs.tree.setCurrentKey(window.GlobalUtil.model.localTeach.curSelectedTreeItem.uuid);
            // }, 100);
          }
        });
      }
      else {
        // console.log(`proj length 0`);
      }
    },
    onstop() {
      // console.log(`stop teach = 4`);
      window.CommandsTeachSocket.stopTeach((dict) => {
        console.log(`stop teach = ${JSON.stringify(dict)}`);
        if (dict.code === 0) {
          this.model.localTeach.isTeachRunningUUID = '';
          // setTimeout(() => {
            // this.$refs.tree.setCurrentKey(window.GlobalUtil.model.localTeach.curSelectedTreeItem.uuid);
          // }, 100);
        }
      });
    },
    onDelete() {
      if (this.isMoving) {
        console.log('moving moving');
        this.$message({
          message: this.$t('moving'),
          duration: 1000,
        })
        return;
      }
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
      this.model.localTeach.curPointRemarks.splice(index, 1)
      this.save(() => {
        // this.model.localTeach.curSelectedIndex = -1;
        this.model.localTeach.curSelectedIndex -= 1;
        if (this.model.localTeach.curSelectedIndex >= 0) {
          this.model.localTeach.onSelect(null, this.model.localTeach.curSelectedIndex);
        }
      });
    },
    onAddPoint() {
      if (this.isMoving) {
        console.log('moving moving');
        this.$message({
          message: this.$t('moving'),
          duration: 1000,
        })
        return;
      }
      if (this.model.localTeach.hasChange) {
        this.$message({
          message: this.$t('editing'),
          duration: 1000,
        })
        return;
      }
      const curEditingFileUUID = this.model.localTeach.curEditingFileUUID;
      // const index = this.model.localTeach.curSelectedIndex;
      const points = this.model.localTeach.fileDatas[curEditingFileUUID];
      const index = this.model.localTeach.curSelectedIndex === -1 ? points.length - 1 : this.model.localTeach.curSelectedIndex;
      // add point
      let newPoint = [];
      if (this.stateOnline === true) {
        newPoint = this.model.robot.state.remote.joints.concat();
      }
      else {
        newPoint = this.model.robot.state.local.joints.concat();
      }
      // for (let i = 0; i < points.length; i += 1) {
      //   const onePoint = points[i];
      //   if (onePoint.length === 7 && i <= index) {
      //     newPoint = onePoint;
      //   }
      // }
      if (newPoint.length === 7) {
        points.splice(index + 1, 0, newPoint);
      }
      else {
        points.splice(index + 1, 0, this.model.robot.state.resetJoints.concat());
      }
      this.model.localTeach.curPointRemarks.splice(index + 1, 0, this.defaultJointRemark);
      console.log(`add point isShowControl 1 = ${this.model.localTeach.editState}`);
      this.save(() => {
        console.log(`add point isShowControl 2 = ${this.model.localTeach.editState}`);
        this.model.localTeach.onSelect(null, index + 1);
        console.log(`add point isShowControl 3 = ${this.model.localTeach.editState}`);
        this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.JOINTS;
      });
    },
    onAddTimer() {
      if (this.isMoving) {
        console.log('moving moving');
        this.$message({
          message: this.$t('moving'),
          duration: 1000,
        })
        return;
      }
      if (this.model.localTeach.hasChange) {
        this.$message({
          message: this.$t('editing'),
          duration: 1000,
        })
        return;
      }
      const curEditingFileUUID = this.model.localTeach.curEditingFileUUID;
      // const index = this.model.localTeach.curSelectedIndex;
      const points = this.model.localTeach.fileDatas[curEditingFileUUID];
      const index = this.model.localTeach.curSelectedIndex === -1 ? points.length - 1 : this.model.localTeach.curSelectedIndex;
      points.splice(index + 1, 0, [2]);
      this.model.localTeach.curPointRemarks.splice(index + 1, 0, this.defaultTimeRemark);
      this.save(() => {
        this.model.localTeach.onSelect(null, index + 1);
      });
    },
    onAddGripper() {
      if (this.isMoving) {
        console.log('moving moving');
        this.$message({
          message: this.$t('moving'),
          duration: 1000,
        })
        return;
      }
      if (this.model.localTeach.hasChange) {
        this.$message({
          message: this.$t('editing'),
          duration: 1000,
        })
        return;
      }
      const curEditingFileUUID = this.model.localTeach.curEditingFileUUID;
      // const index = this.model.localTeach.curSelectedIndex;
      const points = this.model.localTeach.fileDatas[curEditingFileUUID];
      const index = this.model.localTeach.curSelectedIndex === -1 ? points.length - 1 : this.model.localTeach.curSelectedIndex;
      const pos = this.stateOnline ? this.model.robot.state.remote.gripper.pos : 0;
      const speed = this.stateOnline ? this.model.robot.state.remote.gripper.speed : 8000;
      points.splice(index + 1, 0, [speed, pos]);
      this.model.localTeach.curPointRemarks.splice(index + 1, 0, this.defaultGripperRemark);
      this.save(() => {
        this.model.localTeach.onSelect(null, index + 1);
        this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.ACCESSORY;
      });
    },
    save(callback) {
      this.model.localTeach.isClickingCell = true;
      setTimeout(() => {
        this.model.localTeach.isClickingCell = false;
      }, 200);
      console.log(`add point isShowControl 1a = ${this.model.localTeach.editState}`);
      const curEditingFileUUID = this.model.localTeach.curEditingFileUUID;
      const points = this.model.localTeach.fileDatas[curEditingFileUUID];
      const newPoints = points.map((point, index) => {
        let type = 'joint';
        let remark = this.defaultJointRemark;
        if (point.length === 1) {
          type = 'time';
          remark = this.defaultTimeRemark;
        }
        else if (point.length === 2) {
          type = 'gripper';
          remark = this.defaultGripperRemark;
        }
        if (index < this.model.localTeach.curPointRemarks.length && this.model.localTeach.curPointRemarks[index] !== undefined) {
          remark = this.model.localTeach.curPointRemarks[index];
        }
        const newPoint = {
          type: type, // point.length === 1 ? 'time' : 'joint',
          point: point,
          remark: remark,
        };
        return newPoint;
      });
      console.log(`add point isShowControl 1b = ${this.model.localTeach.editState}`);
      // const text = JSON.stringify(textDict);
      window.CommandsTeachSocket.createFile(path.basename(curEditingFileUUID), newPoints, (dict) => {
        console.log(`add point isShowControl 1c = ${this.model.localTeach.editState}`);
        const ret = JSON.stringify(dict);
        console.log(`ret = ${ret}`);
        this.model.localTeach.showArr = [];
        setTimeout(() => {
          console.log(`add point isShowControl 1d = ${this.model.localTeach.editState}`);
          this.model.localTeach.showArr = [];
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
      if (!curEditingFileUUID) {
        return;
      }
      const index = this.model.localTeach.curSelectedIndex;
      this.model.localTeach.fileDatas[curEditingFileUUID][index] = this.model.localTeach.curPoint; // [Number(this.timerEditingNum)];
      console.log(`fileDatas = ${JSON.stringify(this.model.localTeach.fileDatas[curEditingFileUUID])}`);
      const points = this.model.localTeach.fileDatas[curEditingFileUUID];
      const newPoints = points.map((point) => {
        let type = 'joint';
        let remark = this.defaultJointRemark;
        if (point.length === 1) {
          type = 'time';
          remark = this.defaultTimeRemark;
        }
        else if (point.length === 2) {
          type = 'gripper';
          remark = this.defaultGripperRemark;
        }
        const newPoint = {
          type: type, // point.length === 1 ? 'time' : 'joint',
          point: point,
          remark: remark,
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
    },
    onsave() {
      this.model.localTeach.isClickingCell = true;
      setTimeout(() => {
        this.model.localTeach.isClickingCell = false;
      }, 200);
      this.model.localTeach.onSaveChange(null);
      this.isChange = false;
      const self = this;
      setTimeout(() => {
        self.isChange = true;
      }, 2000);
    },
    ondiscard() {
      const index = this.model.localTeach.curSelectedIndex;
      this.model.localTeach.isClickingCell = true;
      setTimeout(() => {
        this.model.localTeach.isClickingCell = false;
      }, 200);
      this.model.localTeach.hasChange = false;
      this.model.localTeach.onSelect(null, index);
      this.isChange = false;
      const self = this;
      setTimeout(() => {
        self.isChange = true;
      }, 2000);
    },
  },
  beforeDestroy() {
  },
  components: {
    RunSetting,
  },
  computed: {
    isMoving() {
      return this.model.robot.state.jointRangeMoving === true && this.stateOnline === true;
    },
    stateOnline: {
      get() {
        return this.$store.state.robot.info.online;
      },
      set(value) {
      },
    },
    projIndex() {
      if (this.model.localTeach.curSelectedTreeItem.type === 'proj') {
        return this.model.localTeach.curProj.pointCount;
      }
      // model.localTeach.computedIndex(index)
      // return this.model.localTeach.curSelectedIndex >= 0 ? `${this.model.localTeach.curSelectedIndex + 1} / ${this.model.localTeach.showArr.length}` : `${this.model.localTeach.showArr.length}`;
      const index = this.model.localTeach.curSelectedIndex;
      return index >= 0 ? `${this.model.localTeach.computedIndex(index)} / ${this.model.localTeach.showArr.length}` : `${this.model.localTeach.showArr.length}`;
    },
    isShowPointEdit() {
      return (this.model.localTeach.editState === true && this.model.localTeach.curSelectedIndex >= 0) || (this.model.localTeach.showArr.length === 0 && this.model.localTeach.curSelectedTreeItem.type === 'file') && this.model.localTeach.isTeachRunningUUID === '';
    }
  },
};

</script>
<style lang="scss" scoped>
.root-wrapper {
  // position: absolute;
  /*width: 750px;*/
  width: 100%;
  // border-top: 1px solid #d8dce5;
  // border-right: 1px solid #d8dce5;
  // height: 30px;
  .btn-wrapper {
    // height: 40px;
     margin-top: 5px;
    .com-btn {
      height: 30px;
      width: 30px;
      border: none;
      outline: 0;
      background-position: center;
      background-repeat: no-repeat;
      cursor: pointer;
      margin-left: 6px;
      padding-bottom: 10px;
    }
    .add-btn {
      background-size: 17px 22px;
      background-image: url('./../../assets/img/edit/recording/point_icon_add.svg');
    }
    .timer-btn {
     background-size: 24px 24px;
      background-image: url('./../../assets/img/edit/recording/point_icon_time.svg');
    }
    .gripper-btn {
       background-size: 24px 24px;
      background-image: url('./../../assets/img/edit/recording/point_icon_gripper.svg');
    }
    .timer-icon {
      background-image: url('./../../assets/img/edit/recording/point_icon_time.svg');
       background-size: 24px 24px;
    }
    .del-btn {
      background-size: 20px 21px;
      background-image: url('./../../assets/img/edit/recording/point_icon_del.svg');
    }
    .save-btn {
      background-size: 20px 21px;
      background-image: url('./../../assets/img/blockly/btn_save.svg');
    }
    // .cancle-btn {
    //   background-size: 20px 21px;
    //   background-image: url('./../../assets/img/edit/recording/point_icon_del.svg');
    // }
  }
}
.timer-icon {
  height: 30px;
  width: 30px;
  // left: -50px;
  border: none;
  outline: 0;
  background-position: center;
  background-size: 21px 21px;
  background-repeat: no-repeat;
  background-image: url('./../../assets/img/edit/recording/point_icon_time.svg');
}
.unselect {
  background-image: url('./../../assets/img/edit/recording/point_icon_unselected.svg');
}
.select {
  background-image: url('./../../assets/img/edit/recording/point_icon_selected.svg');
}
// .timer-control {
//   position: absolute;
//   left: 55px;
//   top: 15px;
//   width: 100px;
//   height: 10px;
//   background: white;
//   opacity: 1;
//   border-radius: 100px;
//   cursor: pointer;
//   outline: none;
// }
.times-label {
  // position: absolute;
  width: 40px;
  left: 415px;
  line-height: 30px;
  text-align: center;
  // background: yellow;
}
.arrow {
  position:absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  // right: 0px;
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
  height: 30px;
  // background: green;
}
.running-loop-wrapper {
  // position: absolute;
  left: 550px;
  height: 30px;
  display: flex;
  color: #676767;
  font-size: 13px;
}
.input-per-number-style {
  font-family: 'Gotham-Medium';
  font-size: 12px;
  text-align: center;
  width: 23px;
  height: 25px;
  // color: white;
  // color: rgb(132, 132, 132);
  // border-radius: 2px;
  background:rgb(234,234,234);
  /* background: gray; */
  line-height: 23px;
  border: 1px solid rgb(103, 103, 103);
  // border-top: 1px solid rgb(103, 103, 103);
  // border-le: 1px solid rgb(103, 103, 103);
  // border-bottom: 1px solid rgb(103, 103, 103);
  border-radius: 2px;
}
.border-number {
  // border-r
  // border: 1px solid #a3a3a3;
  // border: 1px solid rgb(103, 103, 103);
  // border-radius: 2px;
}
.selected-cell-bg {
  background: #a3a3a3;
}
.running-disable {
  pointer-events: none;
  color:rgba(132, 132, 132, 0.6);
}
</style>
