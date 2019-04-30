<template lang="html">
  <div class="line-block-wrapper" :id="'cell_id_' + index" >
    <!-- button -->
    <div style="margin-top:130px;" v-if="singleShow">
      <!-- isContinus true -->
      <div v-if="model.localTeach.curProj.type==='continuous'" class="line-block line-block-color">
        <div v-if="index % 10 === 0" style="background:#52BF53;">
          <div class="line-block-text-left"> {{ parseInt(index / 10) }}.0s </div>
          <ListProjCellLastText :index="index" :file='file'></ListProjCellLastText>
        </div>
        <div v-else>
          <div v-if="model.localTeach.curEditingFileUUID===''">
            <div v-if="index < (model.localTeach.fileDatas['temp'] || []).length">
              <div class="line-block-text-left"> .{{ index % 10 }} </div>
              <ListProjCellLastText :index="index" :file='file'></ListProjCellLastText>
            </div>
          </div>
          <div v-else>
            <div v-if="index < (model.localTeach.fileDatas[file.uuid] || []).length">
              <div class="line-block-text-left"> .{{ index % 10 }} </div>
              <ListProjCellLastText :index="index" :file='file'></ListProjCellLastText>
            </div>
          </div>
        </div>
      </div>
      <!-- isContinus true end -->

      <!-- isContinus false -->
      <div v-else class="line-block-single">
        <div v-if="isTimer" class="line-timer-text"> {{ computedTimerIndex }}s </div>
        <!-- <div v-if="index!==0" class="line-single" style="background: #4A90E2;">
        </div>
        <div v-else class="line-single" style="">
        </div> -->
        <!-- <div v-if="model.localTeach.visible.starRecording===true">
          <div @click='onSelect($event, index)' style="position:relative;z-index:200;" :class="{
            'cursor-pointer': model.localTeach.isTeachRunningUUID === '',
            'line-single-timer': (isTimer && index !== model.localTeach.curSelectedIndex),
            'line-single-timer-selected': (isTimer && index === model.localTeach.curSelectedIndex),
            'line-single-ball-recording': (!isTimer && index === model.localTeach.showArr.length - 1),
            'line-single-ball': (!isTimer && index !== model.localTeach.showArr.length - 1)
          }">
            <img v-if="index===model.localTeach.showArr.length-1" class="line-logo" src="./../../assets/img/edit/recording/logo_st.svg">
            <span class="line-number">{{ computedIndex }}</span>
          </div>
        </div> -->
        <!-- <div v-else> -->
        <div>
          <div @click='onSelect($event, index)' style="position:relative;z-index:200;" :class="{
            'cursor-pointer': model.localTeach.isTeachRunningUUID === '',
            'line-single-timer': (isTimer && index !== model.localTeach.curSelectedIndex),
            'line-single-timer-selected': (isTimer && index === model.localTeach.curSelectedIndex),
            'line-single-ball-selected':(!isTimer && index === model.localTeach.curSelectedIndex),
            'line-single-ball-end':(!isTimer && index === model.localTeach.showArr.length - 1 && index !== model.localTeach.curSelectedIndex),
            'line-single-ball':(!isTimer && index !== model.localTeach.showArr.length - 1 && index !== model.localTeach.curSelectedIndex) }">
            <span :class="{
              'line-number-selected': !isTimer && index === model.localTeach.curSelectedIndex,
              'line-number': !isTimer && index !== model.localTeach.curSelectedIndex }">
              {{ computedIndex }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- button end -->
  </div>
</template>
<script>

import * as types from './../../store/mutation-types';
import ListProjCellLastText from './ListProjCellLastText';

export default {
  props: ['file', 'index'],
  data() {
    return {
      model: window.GlobalUtil.model,
      // isTimerEditing: false,
      timerEditingNum: 0,
      singleShow: true,
    };
  },
  mounted() {
    // console.log(`cell mounted index = ${this.index}`);
    // const cell = document.getElementById(`cell_id_${this.index}`);
    // cell.style.left = `${250 + 60 * this.index}px`;
  },
  methods: {
    // checkIsTimer(index) {
    //   // return index % 3 === 0;
    //   const curEditingFileUUID = window.GlobalUtil.model.localTeach.curEditingFileUUID;
    //   // const getFileInfo = window.GlobalUtil.model.localTeach.getFileInfo(curEditingFileUUID);
    //   if (window.GlobalUtil.model.localTeach.visible.starRecording === true) {
    //     const point = window.GlobalUtil.model.localTeach.getFileData('temp', index) || [];
    //     return (point.length === 1);
    //   }
    //   if (this.isTimer) {
    //     const point = window.GlobalUtil.model.localTeach.getFileData(curEditingFileUUID, this.index) || [];
    //     return `${point[0]} Ts`;
    //   }
    //   return this.index + 1;
    // },
    onTimerBlur(isChangeText) {
      this.isTimerEditing = false;
      if (!isChangeText) {
        return;
      }
      const curEditingFileUUID = window.GlobalUtil.model.localTeach.curEditingFileUUID;
      window.GlobalUtil.model.localTeach.fileDatas[curEditingFileUUID][this.index] = [Number(this.timerEditingNum)];
      console.log(`fileDatas = ${JSON.stringify(window.GlobalUtil.model.localTeach.fileDatas[curEditingFileUUID])}`);

      const points = window.GlobalUtil.model.localTeach.fileDatas[curEditingFileUUID];

      const textDict = {
        type: window.GlobalUtil.model.localTeach.curProj.type,
        total: points.length,
        points: points,
      };
      const text = JSON.stringify(textDict);

      window.CommandsTeachSocket.saveOrUpdateFile(curEditingFileUUID, text, (dict) => {
        const ret = JSON.stringify(dict);
        console.log(`ret = ${ret}`);
        this.model.localTeach.projectListShow = false;
        // this.singleShow = false;
        setTimeout(() => {
          this.model.localTeach.projectListShow = true;
          this.model.localTeach.curSelectedIndex = -1;
          // this.singleShow = true;
        });
      });
      // this.isTimerEditing = false;
    },
    onNumChange() {
      const e = window.event;
      if (e.keyCode === 13) {
        // this.isTimerEditing = false;
        this.model.localTeach.curSelectedIndex = -1;
        this.onTimerBlur(true);
        return;
      }
      const old = this.timerEditingNum;
      setTimeout(() => {
        if (this.timerEditingNum === undefined || this.timerEditingNum === '') {
          this.timerEditingNum = 0;
        }
        if (`${this.timerEditingNum[0]}` === '0' && this.timerEditingNum.length > 1) {
          this.timerEditingNum = Number(this.timerEditingNum.slice(1));
        }
        if (isNaN(this.timerEditingNum)) {
          this.timerEditingNum = old;
        }
        if (this.timerEditingNum.length > 2) {
          this.timerEditingNum = Number(this.timerEditingNum.slice(0, 2));
        }
      });
    },
    onSelect(e, index) {
      if (window.GlobalUtil.model.localTeach.visible.starRecording) {
        console.log('onSelect record starting');
        return;
      }
      if (this.model.localTeach.isTeachRunningUUID !== '') {
        return;
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
        }, 100);
        return;
      }
      if (this.model.localTeach.curProj.type === 'discontinuous') {
        if (this.model.localTeach.hasChange === true) {
          this.model.localTeach.willOnSelectIndex = index;
          this.model.localTeach.changeSelectedShow = true;
        }
        else {
          this.model.localTeach.onSelect(e, index);
          this.$store.commit(types.ROBOT_MOVE_JOINT, this.model.localTeach.curPoint);
          this.model.localTeach.hasChange = false;
        }
      }
      this.model.localTeach.projectListShow = false;
      this.model.localTeach.projectListShow = true;
    },
  },
  beforeDestroy() {
  },
  components: {
    ListProjCellLastText,
  },
  computed: {
    computedTimerIndex() {
      const curEditingFileUUID = window.GlobalUtil.model.localTeach.curEditingFileUUID;
      // const getFileInfo = window.GlobalUtil.model.localTeach.getFileInfo(curEditingFileUUID);
      if (window.GlobalUtil.model.localTeach.visible.starRecording === true) {
        const point = window.GlobalUtil.model.localTeach.getFileData('temp', this.index) || [];
        console.log('computed timer index recording');
        return point.length === 1 ? `${point[0]}` : '0';
      }
      if (this.isTimer) {
        const point = window.GlobalUtil.model.localTeach.getFileData(curEditingFileUUID, this.index) || [];
        console.log('computed timer is timer');
        if (point.length === 0) {
          return '';
        }
        return `${point[0]}`;
      }
      return '0';
    },
    computedIndex() {
      const curEditingFileUUID = window.GlobalUtil.model.localTeach.curEditingFileUUID;
      // const getFileInfo = window.GlobalUtil.model.localTeach.getFileInfo(curEditingFileUUID);
      if (window.GlobalUtil.model.localTeach.visible.starRecording === true) {
        // const point = window.GlobalUtil.model.localTeach.getFileData('temp', this.index);
        return '';
      }
      if (this.isTimer) {
        return '';
      }
      const uuid = curEditingFileUUID === '' ? 'temp' : curEditingFileUUID;
      const points = window.GlobalUtil.model.localTeach.fileDatas[uuid] || [];
      let counter = 0;
      for (let i = 0; i < points.length; i += 1) {
        if (points[i].length === 1 && i < this.index) {
          counter += 1;
        }
      }
      return this.index + 1 - counter;
    },
    isTimer() {
      return window.GlobalUtil.model.localTeach.isTimer(this.index);
    },
  },
};

</script>
<style lang="scss" scoped>
.line-block-wrapper {
  width:60px;
  height:30px;
}
.rule-style {
  width:1px;
  height:10px;
  background:white;
  float:left;
  margin-left:5px;
}
.line-block {
  width:60px;
  height:30px;
  border-right: 1px solid #444;
  color: #fff;
  line-height: 30px;
}
.line-block-color {
  background:rgba(74,144,226,0.50);
}
.line-block-color-selected {
  background:#52BF53;
}
.line-block-text-left {
  width:60px;
  height:30px;
  font-family: 'Gotham-Book';
  font-size: 14px;
  color: #FFFFFF;
  text-align: right;
  margin-left: -65px;
}
.line-block-single {
  // position: absolute;
  width:60px;
  height:30px;
  padding-top: 14px;
  font-size: 15px;
  // cursor: pointer;
  // line-height: 30px;
  // background-color: yellow;
}
.line-single {
  width: 100%;
  height: 2px;
  // position: absolute;
  top: 15px;
  // transform: translateY(-50%);
  /*border-radius:4px;*/
  // border: 1px solid #4A90E2;
}
.line-single-timer {
  margin-left:48px;
  margin-top:-35px;
  width:22px;
  height:22px;
  // background: yellow
  background-position: center;
  background-repeat: no-repeat;
  background-size: 22px 22px;
  background-image: url('./../../assets/img/edit/recording/icon_timer.svg');
}
.line-single-timer-selected {
  margin-left:46px;
  margin-top:-37px;
  width:26px;
  height:26px;
  // background: yellow;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 26px 26px;
  background-image: url('./../../assets/img/edit/recording/icon_timer_selected.svg');
}
.line-single-ball, .line-single-ball-recording, .line-single-ball-end {
  margin-left:50px;
  margin-top:-40px;
  width:20px;
  height:20px;
  border-radius: 50%;
  position: relative;
  transform: scale(1,1);
  // border-radius:3px;
}
.line-single-ball:after, .line-single-ball-recording:after, .line-single-ball-end:after {
  content: '';
  width: 0;
  height: 0;
  border-top: 14px solid;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  transform: scale(1.3,0.7);
  position: absolute;
  bottom: -8px;
  left: 4px;
}
.line-single-ball {
  background:white;
  color: #444;
  font-size: 10px;
  // text-align: center;
  padding-top: 3px;
  z-index: 9;
  // cursor: pointer;
}
.line-single-ball:after {
  border-top-color: #fff;
}
.line-single-ball-recording {
  background:#E27347;
}
.line-single-ball-recording:after {
  border-top-color: #E27347;
}
.line-single-ball-end {
  // background:#FF5469 ;
  background: #E24D4A;
  span {
    color:white;
  }
}
.line-single-ball-end:after {
  // border-top-color: #FF5469 ;
  border-top-color: #E24D4A;
}
.line-single-ball-selected {
  // margin-left:50px;
  margin-left:48px;
  margin-top:-42px;
  width:24px;
  position: relative;
  // cursor: pointer;
}
.line-number {
  position: absolute;
  width: 20px;
  top: 3px;
  font-size: 10px;
  text-align: center;
  // color: #fff;
  color: black;
  padding-top: 2px;
  font-family: 'Gotham-Book';
}
.line-number-selected {
  position: absolute;
  font-size: 10px;
  width: 24px;
  height: 30px;
  line-height: 26px;
  color: #444;
  text-align: center;
  /*left: 6px;*/
  /*top: 2px;*/
  z-index: 999;
  background: url('../../assets/img/edit/recording/shape_selected.svg') no-repeat center;
}
.line-logo {
  position: absolute;
  bottom: 30px;
  left: -4px;
  width: 26px;
}
.line-timer-text {
  position:absolute;
  color:white;
  width:50px;
  left:35px;
  top:92px;
  text-align:center;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  color: #FFFFFF;
  letter-spacing: -0.4px;
}
.timer-delay-update {
  position:absolute;
  width:25px;
  height:25px;
  left:48px;
  top:75px;
  outline:none;
  border:0;
  text-align: center;
  font-family: 'Gotham-Medium';
  font-size: 12px;
}
</style>
