<template lang="html">
  <!-- <div class="line-block-wrapper" :style="{top: + (index % 2 === 0 ? 18 : 55) + 'px'}"> -->
  <div class="line-block-wrapper" :style="{top: + (index % 2 === 0 ? 15 : 15) + 'px'}">
    <!-- button -->

      <!-- 'line-single-timer': (isTimer && index !== model.localTeach.curSelectedIndex),
      'line-single-timer-selected': (isTimer && index === model.localTeach.curSelectedIndex),
      'line-single-ball-selected':(!isTimer && index === model.localTeach.curSelectedIndex),
      'line-single-ball':(!isTimer && index !== model.localTeach.curSelectedIndex)  -->
      <!-- 'line-single-bg-gray': true, -->
      <!-- 'line-single-bg-gray': (index !== model.localTeach.curSelectedIndex),
      'line-single-bg-yellow': (index === model.localTeach.curSelectedIndex), -->
    <div @click='onSelect($event, index)' style="cursor:pointer;" :class="{
      'line-single-bg-com': true,
      'line-single-com': true,
      'line-single-bg-yellow': (!isGripper && !isTimer && model.localTeach.computedIndex(index) % 2 === 0),
      'line-single-bg-orange': (!isGripper && !isTimer && model.localTeach.computedIndex(index) % 2 === 1),
      'line-single-bg-gray': isTimer,
      'line-single-bg-green': isGripper,
      'line-single-com-slected':model.localTeach.curSelectedIndex === index }"
      class="line-single-point-bg">
      <!-- <span v-if="isGripper" class="line-timer-text"> Gripper  {{ computedGripperIndex }} </span>
      <span v-else-if="isTimer" class="line-timer-text">Remain {{ computedTimerIndex }}s </span> -->
      <span class="line-timer-text">
        {{ model.localTeach.computedIndex(index) }}
        <div style="display: inline; position: absolute; left: 30px;">
          <span v-if="model.localTeach.curSelectedIndex !== index">
            {{computedRemarkValue(index) + computedPointValue(index)}}
          </span>
          <input 
            v-if="model.localTeach.curSelectedIndex === index"
            @input="onRemarkChange"
            @blur="onSaveRemark"
            @keyup.enter="onSaveRemark"
            type="text" 
            v-model="model.localTeach.curRemark"
            id="point-remark-input-id"
            class="point-remark-input"
            />
        </div>
        <!-- -- {{ model.localTeach.curPointRemarks[index] -->
      </span>
      <div v-if="model.localTeach.curSelectedIndex === index" style="position:absolute;right: 10px;top: 9px;">
        <span class="rename-btn com-btn" @click="focusPointRemarkInput"></span>
      </div>
    </div>

    <!-- button end -->
    <!-- <div v-if="isShowSaveChange && !isGripper">
      <div class="save-btn" @click='onsave' style="">
      </div>
      <div class="discard-btn" @click="ondiscard" style="">
      </div>
    </div> -->
  </div>
</template>
<script>

// import * as types from './../../store/mutation-types';
// import ListProjCellLastText from './ListProjCellLastText';

export default {
  props: ['file', 'index'],
  i18n: {
    messages: {
      en: {
        editing: 'Points is editing!',
        moving: 'Points is moving!',
      },
      cn: {
        editing: '正在编辑!',
        moving: '正在移动!',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      // isTimerEditing: false,
      timerEditingNum: 0,
      singleShow: true,
      storeIsTimer: null,
      storeIsGripper: null,
      lastPointType: null,
    };
  },
  mounted() {
    const isGripper = this.isGripper;
  },
  methods: {
    computedRemarkValue(index) {
      const remark = this.model.localTeach.curPointRemarks[index] || '';
      const length = 15;
      return remark.length > length ? remark.substring(0, length) + '...' : remark;
    },
    computedPointValue(index) {
      const curEditingFileUUID = window.GlobalUtil.model.localTeach.curEditingFileUUID;
      const uuid = curEditingFileUUID === '' ? 'temp' : curEditingFileUUID;
      const points = window.GlobalUtil.model.localTeach.fileDatas[uuid] || [];
      const point = points[index];
      if (point === undefined) {
        return '';
      }
      if (point.length !== 7) {
        if (point.length === 1) {
          return ` (${point[0].toFixed(1)}s)`;
        }
        else if (point.length === 2) {
          return ` (${point[0]}, ${point[1]})`;
        }
        return '';
      }
      else {
        return '';
      }
    },
    onRemarkChange() {
      console.log('onRemarkChange onRemarkChange');
      // this.model.localTeach.hasChange = true;
      // this.model.localTeach.onSelect(null, this.model.localTeach.curSelectedIndex);
    },
    focusPointRemarkInput() {
      const ele = document.getElementById('point-remark-input-id')
      if (ele !== null) {
        ele.focus();
        ele.select();
      }
    },
    onSaveRemark() {
      this.model.localTeach.onSaveChange(null);
      const ele = document.getElementById('point-remark-input-id')
      if (ele !== null) {
        ele.blur();
      }
    },
    onsave() {
      this.model.localTeach.isClickingCell = true;
      setTimeout(() => {
        this.model.localTeach.isClickingCell = false;
      }, 200);
      this.model.localTeach.onSaveChange(null);
    },
    ondiscard() {
      this.model.localTeach.isClickingCell = true;
      setTimeout(() => {
        this.model.localTeach.isClickingCell = false;
      }, 200);
      this.model.localTeach.hasChange = false;
      this.model.localTeach.onSelect(null, this.index);
    },
    // onTimerBlur(isChangeText) {
    //   this.isTimerEditing = false;
    //   if (!isChangeText) {
    //     return;
    //   }
    //   const curEditingFileUUID = window.GlobalUtil.model.localTeach.curEditingFileUUID;
    //   window.GlobalUtil.model.localTeach.fileDatas[curEditingFileUUID][this.index] = [Number(this.timerEditingNum)];
    //   console.log(`fileDatas = ${JSON.stringify(window.GlobalUtil.model.localTeach.fileDatas[curEditingFileUUID])}`);

    //   const points = window.GlobalUtil.model.localTeach.fileDatas[curEditingFileUUID];

    //   const textDict = {
    //     type: window.GlobalUtil.model.localTeach.curProj.type,
    //     total: points.length,
    //     points: points,
    //   };
    //   const text = JSON.stringify(textDict);

    //   window.CommandsTeachSocket.saveOrUpdateFile(curEditingFileUUID, text, (dict) => {
    //     const ret = JSON.stringify(dict);
    //     console.log(`ret = ${ret}`);
    //     this.model.localTeach.projectListShow = false;
    //     // this.singleShow = false;
    //     setTimeout(() => {
    //       this.model.localTeach.projectListShow = true;
    //       this.model.localTeach.curSelectedIndex = -1;
    //       // this.singleShow = true;
    //     });
    //   });
    //   // this.isTimerEditing = false;
    // },
    onSelect(e, index) {
      if (this.isMoving) {
        console.log('moving moving');
        this.$message({
          message: this.$t('moving'),
          duration: 1000,
        })
        return;
      }
      // this.selectedIndex = index;
      const index1 = this.model.localTeach.curSelectedIndex;
      const isGripper = this.model.localTeach.isGripper(index1);
      console.log(`isGripper = ${isGripper}, lastIndex = ${index1}, index=${index}`);
      if (isGripper) {
        this.model.localTeach.hasChange = false;
      }
      if (this.model.localTeach.hasChange && this.model.localTeach.curSelectedIndex >= 0 && index !== this.model.localTeach.curSelectedIndex) {
        this.$message({
          message: this.$t('editing'),
          duration: 1000,
        })
        return;
      }
      console.log('test cancel onSelect')
      this.model.localTeach.isClickingCell = true;
      setTimeout(() => {
        this.model.localTeach.isClickingCell = false;
      }, 200);
      // if (window.GlobalUtil.model.localTeach.visible.starRecording) {
      //   console.log('onSelect record starting');
      //   return;
      // }
      console.log(`this.model.localTeach.hasChange = ${this.model.localTeach.hasChange}, this.model.localTeach.curProj.type = ${this.model.localTeach.curProj.type}`);
      if (this.model.localTeach.isTeachRunningUUID !== '') {
        return;
      }
      if (this.model.localTeach.hasChange === true) {
        if (this.lastPointType === 'point') {
          console.log(`this.model.localTeach.hasChange = ${this.model.localTeach.hasChange}, editing`);
          return;
        }
        else {
          this.model.localTeach.hasChange = false;
        }
      }
      console.log(`onSelect index = ${index}, type= ${this.model.localTeach.curProj.type}`);
      // if (this.model.localTeach.curSelectedIndex >= 0) {
      //   return;
      // }
      if (this.isTimer) {
        setTimeout(() => {
          // this.isTimerEditing = true;
          this.model.localTeach.onSelect(e, index);
          this.model.localTeach.curSelectedIndex = index;
          this.timerEditingNum = Number(this.computedTimerIndex);
          window.GlobalUtil.setInputFocus();
          this.lastPointType = 'timer';
        }, 100);
        return;
      }
      if (this.isGripper) {
        setTimeout(() => {
          // this.isTimerEditing = true;
          this.model.localTeach.onSelect(e, index);
          this.model.localTeach.curSelectedIndex = index;
          window.GlobalUtil.setInputFocus();
          // this.model.commonStatusMgr.ControlPositionShow = false;
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.ACCESSORY;
          this.model.commonStatusMgr.showToggleBtn = false;
          const List = this.computedGripperIndex;
          this.model.robot.state.local.gripper.pos = List[1];
          this.model.robot.state.local.gripper.speed = List[0];
          if (this.stateOnline && this.model.robot.state.remote.gripper.enable) {
            if (this.model.robot.state.setGripperPos) {
              this.model.robot.state.setGripperPos(null, null);
            }
          }
          this.lastPointType = 'gripper';
        }, 100);
        return;
      }
      if (this.model.localTeach.curProj.type === 'discontinuous') {
        // this.model.commonStatusMgr.ControlPositionShow = false;
        this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.JOINTS;
        this.model.commonStatusMgr.showToggleBtn = true;
        if (this.model.localTeach.hasChange === true) {
          this.model.localTeach.willOnSelectIndex = index;
          this.model.localTeach.changeSelectedShow = true;
        }
        else {
          this.model.localTeach.onSelect(e, index);
          this.model.robot.state.func.setRobotMoveAllJoints(this.model.localTeach.curPoint, true, () => {
          });
        }
        this.lastPointType = 'point';
      }
      this.model.localTeach.projectListShow = false;
      this.model.localTeach.projectListShow = true;
    },
    // mouseover() {
    //   console.log('mouseover mouseover mouseover');
    //   this.model.localTeach.curShowRemark = this.model.localTeach.curPointRemarks[this.index];
    //   if (this.isTimer) {
    //     this.model.localTeach.curShowRemark = '';
    //   }
    // },
    // mouseout() {
    //   console.log('mouseout mouseout mouseout');
    //   this.model.localTeach.curShowRemark = '';
    // },
  },
  beforeDestroy() {
  },
  components: {
    // ListProjCellLastText,
  },
  computed: {
    computedGripperIndex() {
      const curEditingFileUUID = window.GlobalUtil.model.localTeach.curEditingFileUUID;
      // const getFileInfo = window.GlobalUtil.model.localTeach.getFileInfo(curEditingFileUUID);
      // if (window.GlobalUtil.model.localTeach.visible.starRecording === true) {
      //   const point = window.GlobalUtil.model.localTeach.getFileData('temp', this.index) || [];
      //   console.log('computed timer index recording');
      //   return point.length === 2 ? `${point[0].toFixed(1)}` : '0';
      // }
      if (this.isGripper) {
        const point = window.GlobalUtil.model.localTeach.getFileData(curEditingFileUUID, this.index) || [];
        console.log('computed Gripper is Gripper');
        if (point.length === 0) {
          return [8000, 0];
        }
        return [Number(point[0]), Number(point[1])];
      }
      return 0;
    },
    computedTimerIndex() {
      const curEditingFileUUID = window.GlobalUtil.model.localTeach.curEditingFileUUID;
      // const getFileInfo = window.GlobalUtil.model.localTeach.getFileInfo(curEditingFileUUID);
      if (window.GlobalUtil.model.localTeach.visible.starRecording === true) {
        const point = window.GlobalUtil.model.localTeach.getFileData('temp', this.index) || [];
        console.log('computed timer index recording');
        return point.length === 1 ? `${point[0].toFixed(1)}` : '0';
      }
      if (this.isTimer) {
        const point = window.GlobalUtil.model.localTeach.getFileData(curEditingFileUUID, this.index) || [];
        console.log('computed timer is timer');
        if (point.length === 0) {
          return '';
        }
        return `${point[0].toFixed(1)}`;
      }
      return '0';
    },
    isShowSaveChange() {
      return !this.isTimer && window.GlobalUtil.model.localTeach.editState === true && window.GlobalUtil.model.localTeach.hasChange === true && window.GlobalUtil.model.localTeach.curSelectedIndex === this.index;
    },
    isGripper() {
      this.storeIsGripper = window.GlobalUtil.model.localTeach.isGripper(this.index)
      return this.storeIsGripper;
    },
    isTimer() {
      // if (this.storeIsTimer === null) {
      //   this.storeIsTimer = window.GlobalUtil.model.localTeach.isTimer(this.index);
      // }
      this.storeIsTimer = window.GlobalUtil.model.localTeach.isTimer(this.index);
      return this.storeIsTimer;
    },
    stateOnline() {
      return this.$store.state.robot.info.online === true;
    },
    isMoving() {
      return this.model.robot.state.jointRangeMoving === true && this.stateOnline === true;
    },
    remoteGripper() {
      // return this.model.robot.state.remote.gripper.pos;
      return [this.model.robot.state.remote.gripper.speed, this.model.robot.state.remote.gripper.pos];
    },
  },
  watch: {
    remoteGripper(newValue) {
      const index1 = this.model.localTeach.curSelectedIndex;
      console.log(`cur index = ${index1}`);
      // const isGripper = this.model.localTeach.isGripper(index1);
      if (this.storeIsGripper && index1 === this.index) {
        if (!this.model.localTeach.isClickingCell) {
          const curEditingFileUUID = this.model.localTeach.curEditingFileUUID;
          const index = this.model.localTeach.curSelectedIndex;
          const points = this.model.localTeach.fileDatas[curEditingFileUUID];
          let point = points[index];
          // point = [point[0], Number(newValue)];
          if (point[0] === Number(newValue[0]) && point[1] === Number(newValue[1])) {
            return;
          }
          console.log('gripper debug:', point, newValue);
          point = [Number(newValue[0]), Number(newValue[1])];
          this.model.localTeach.fileDatas[curEditingFileUUID][index] = point;
          const points2 = this.model.localTeach.fileDatas[curEditingFileUUID];
          console.log(`remoteGripperPos change = ${newValue}, index = ${index}, points = ${JSON.stringify(points2)}`);
          if (this.model.localTeach.save) {
            this.model.localTeach.save(() => {
            });
          }
        }
        this.model.localTeach.hasChange = false;
      }
    },
  },
};

</script>
<style lang="scss" scoped>
.line-block-wrapper {
  position: absolute;
  width: 100px;
  height: 20px;
  // overflow-y: hidden;
  // opacity: 0.8;
  font-size: 15px;
  // background: yellow;
  transition: .3s;
}

// .line-block-single {
//   position: absolute;
//   // width: 90%;
//   left: 100px;
//   width: 100%;
//   height: 100%;
//   z-index:200;
//   // width:60px;
//   // height:30px;
//   // padding-top: 14px;
//   font-size: 15px;
//   // cursor: pointer;
//   // line-height: 30px;
//   // background: greenyellow;
// }
// .line-block {
//   width:60px;
//   height:30px;
//   border-right: 1px solid #444;
//   color: #fff;
//   line-height: 30px;
// }
// .line-block-color {
//   background:rgba(74,144,226,0.50);
// }
// .line-block-color-selected {
//   background:#52BF53;
// }
// .line-block-text-left {
//   width:60px;
//   height:30px;
//   font-family: 'Gotham-Book';
//   font-size: 14px;
//   color: #FFFFFF;
//   text-align: right;
//   margin-left: -65px;
// }
// .line-single {
//   width: 100%;
//   height: 2px;
//   // position: absolute;
//   top: 15px;
//   // transform: translateY(-50%);
//   /*border-radius:4px;*/
//   // border: 1px solid #4A90E2;
// }
.line-single-com {
  position: absolute;
  // width: 120px;
  width: 296px;
  height: 40px;
  // border-right: 10px solid black;
  // border-left: 10px solid black;
  // border-top: 10px solid white;
  // border-right: 10px solid black;
  // border-bottom: 10px solid white;
  // border: 1px solid #DCDCDC;
}
.line-single-bg-com {
  background-position: center;
  // background-size: 100% 100%;
  background-size: 70px 120px;
  background-repeat: no-repeat;
}
.line-single-bg-green {
  background-image: url('./../../assets/img/edit/recording/point_green.svg');
   background-position: left -80px;
}
.line-single-bg-gray {
  background-image: url('./../../assets/img/edit/recording/point_gray.svg');
  background-position: left -40px;
}
.line-single-bg-yellow {
  background-image: url('./../../assets/img/edit/recording/point_yellow.svg');
   background-position: left 0px;
}
.line-single-bg-orange {
  background-image: url('./../../assets/img/edit/recording/point_orange.svg');
   background-position: left 0px;
}
.line-single-bg-red {
  background-image: url('./../../assets/img/edit/recording/point_red.svg');
}
.line-single-point-bg {
  background-image: url('./../../assets/img/edit/recording/single_point_bg.svg');
}
// .line-single-com:before {
//   border-left: 6px solid transparent;
//   border-right: 6px solid transparent;
// }
// .line-single-com:after {
//   border-top: 10px solid white;
//   border-right: 10px solid black;
//   border-bottom: 10px solid white;
// }
.line-single-timer {
  // background: rgb(135, 136, 137);
  // background: white;
}
.line-single-timer-selected {
  // background: greenyellow;
  // background: rgb(244, 189, 103);
}
.line-single-ball {
  // background: rgb(135, 136, 137);
  // background: white;
}
.line-single-ball-selected {
  // background: greenyellow;
  // background: rgb(244, 189, 103);
}
// .line-number {
//   position: absolute;
//   width: 20px;
//   top: 3px;
//   font-size: 10px;
//   text-align: center;
//   color: black;
//   padding-top: 2px;
//   font-family: 'Gotham-Book';
// }
// .line-number-selected {
//   position: absolute;
//   font-size: 10px;
//   width: 24px;
//   height: 30px;
//   line-height: 26px;
//   color: #444;
//   text-align: center;
//   z-index: 999;
//   background: url('../../assets/img/edit/recording/shape_selected.svg') no-repeat center;
// }
// .line-logo {
//   position: absolute;
//   bottom: 30px;
//   left: -4px;
//   width: 26px;
// }
.line-timer-text {
  position:absolute;
  // width: 120px;
  width: 214px;
  // background: #999;
  left: 52px;
  line-height: 40px;
  // text-align:center;
  // font-family: 'Gotham-Medium';
  font-size: 12px;
  // color: blue;
  letter-spacing: -0.4px;
  transition: .3s;
}

.line-timer-text:hover {
  color: #0984ae;
}
.point-remark-input {
  border:none;
  height:30px;
  width: 190px;
  background-color: #575C62;
  color: #fff;
}
.point-remark-input:focus {
  border: 1px solid #409eff;
}
.line-single-com-slected {
  background-color: #575C62;
  color: #fff;
}
.rename-btn {
  background-image: url('./../../assets/img/edit/recording/icon_rename_white.svg');
  right: 6px;
}
.delete-btn {
  background-image: url('./../../assets/img/edit/recording/btn_trash_white.svg');
  right: 0;
}
.com-btn {
  position: absolute;
  width: 20px;
  height: 20px;
  // background:green;
  // left: 20px;
  // top: 25px;
  cursor:pointer;
  background-position: center;
  background-size: 12px 12px;
  background-repeat: no-repeat;
}
.save-btn {
  position:absolute;
  width: 20px;
  height: 20px;
  // background:green;
  left: 20px;
  top: 25px;
  cursor:pointer;
  background-position: center;
  background-size: 12px 12px;
  background-repeat: no-repeat;
  background-image: url('./../../assets/img/edit/recording/point_save.svg');
}
.discard-btn {
  position:absolute;
  width: 20px;height: 20px;
  // background:red;
  left:80px;
  top: 25px;
  cursor:pointer;
  background-position: center;
  background-size: 12px 12px;
  background-repeat: no-repeat;
  background-image: url('./../../assets/img/edit/recording/point_discard.svg');
}
// .timer-delay-update {
//   position:absolute;
//   width:25px;
//   height:25px;
//   left:48px;
//   top:75px;
//   outline:none;
//   border:0;
//   text-align: center;
//   font-family: 'Gotham-Medium';
//   font-size: 12px;
// }
</style>
