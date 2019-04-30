<template lang="html">
  <div class="switch-wrapper">
    <div class="recording">
      <div class="recording-time">
        <div v-if="model.localTeach.curSelectedTreeItem.uuid===''">
        </div>
        <div v-if="model.localTeach.curSelectedTreeItem.type==='file' && model.localTeach.curProj.type==='discontinuous'">
          <span v-if="model.localTeach.curSelectedIndex >= 0"> {{ model.localTeach.curSelectedIndex + 1 }} / {{ model.localTeach.showArr.length }} </span>
          <span v-if="model.localTeach.curSelectedIndex < 0"> {{ model.localTeach.showArr.length }} </span>
        </div>
        <div v-if="model.localTeach.curSelectedTreeItem.type==='file' && model.localTeach.curProj.type==='continuous'">
          {{ model.localTeach.showArr.length }}
        </div>
        <div v-if="model.localTeach.curSelectedTreeItem.type==='proj'  && model.localTeach.curProj.type==='discontinuous'">
          <!-- {{ model.localTeach.showArr.length }} -->
          <!-- aaccg  -->
          {{ model.localTeach.projSingleTotalCount }}
        </div>
        <div v-if="model.localTeach.curSelectedTreeItem.type==='proj'  && model.localTeach.curProj.type==='continuous'">
          {{ getTimeLongStr(model.localTeach.showArr.length) }}
        </div>
      </div>
      <div class="recording-name" v-if="model.localTeach.curSelectedTreeItem.type==='file'">
        <span v-if="model.localTeach.curProj.type==='discontinuous'">
          <img src="./../../assets/img/edit/recording/icon_singlepoint_16x16.svg" width="12px" height="12px" />
        </span>
        <span v-if="model.localTeach.curProj.type==='continuous'">
          <img src="./../../assets/img/edit/recording/icon_waypoint_16x16.svg" width="12px" height="12px" />
        </span>
        <span v-if="model.localTeach.curSelectedTreeItem.uuid!==''">
          {{ model.localTeach.getRealFileFileName(model.localTeach.curSelectedTreeItem.uuid) }}
        </span>
      </div>
      <div v-if="model.localTeach.editState===false">
        <div v-if="model.localTeach.curSelectedTreeItem.type==='proj'">
          <RunSetting
            v-if="model.localTeach.isTeachRunningUUID==='' && model.localTeach.visible.starRecording!==true">
          </RunSetting>
          <!-- start btn -->
          <button v-if="model.localTeach.isTeachRunningUUID===''" @click="onstart" class="bottom-btn" v-bind:class="startProjBtn"><i class="el-icon-caret-right"></i></button>
          <button v-else class="bottom-btn edit-cancel-btn" @click="onstop">
            <div>{{ $t('record.stop') }}</div>
          </button>
          <button v-if="model.localTeach.visible.starRecording && model.localTeach.curProj.type==='discontinuous'" class="bottom-btn press-btn" @click='addRecord()'>{{ $t('record.pressToRecord') }}</button>
          <button v-if="model.localTeach.visible.starRecording && model.localTeach.curProj.type==='discontinuous'" class="bottom-btn add-timer-btn" style="left:0px;" @click='addTimer()'>{{ $t('record.timer') }}</button>
        </div>
        <div v-if="model.localTeach.curSelectedTreeItem.type==='file'">
          <RunSetting
            v-if="model.localTeach.isTeachRunningUUID==='' && model.localTeach.visible.starRecording!==true">
          </RunSetting>
          <button v-if="model.localTeach.curProj.type==='discontinuous'" class="bottom-btn eidt-btn" :disabled="model.localTeach.isTeachRunningUUID !=='' " :class="cannotEdit" @click='startEdit'>{{ $t('record.edit') }}</button>
          <!-- start btn -->
          <button v-if="model.localTeach.isTeachRunningUUID===''" class="bottom-btn" v-bind:class="startFileBtn" @click="onstart"><i class="el-icon-caret-right"></i></button>
          <button v-else class="bottom-btn edit-cancel-btn" @click="onstop">
            <div class="">{{ $t('record.stop') }}</div>
          </button>
        </div>
      </div>
      <div v-if="model.localTeach.editState === true">
        <button class="bottom-btn" v-bind:class="saveChange" @click='model.localTeach.onSaveChange(null)'>{{ $t('record.saveChange') }}</button>
        <button class="bottom-btn edit-cancel-btn" @click='cancelEdit()'>{{ $t('record.cancel') }}</button>
      </div>
    </div>
  </div>
</template>

<script>

import RunSetting from './RunSetting';

const path = require('path');

export default {
  props: ['onwinresize', 'cancelEdit', 'scrollTo'],
  i18n: {
    messages: {
      en: {
        times: 'Times',
        speed: 'Speed',
      },
      cn: {
        times: '次数',
        speed: '速度',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      // editState: false,
    };
  },
  mounted() {
  },
  methods: {
    finishRecord() {
      // this.visible.saveDialog = true;
      this.model.localTeach.saveDialogShow = true;
      // this.visible.singlePointRecording = false;
      // this.visible.wayPointRecording = false;
      window.CommandsTeachSocket.debugSetBeart(false, 0.1, (dict) => {
        console.log(`SetBeart false = dict = ${JSON.stringify(dict)}`);
      });
    },
    finishRecordCancle() {
      // this.visible.saveDialog = false;
    },
    getTimeLongStr(length) {
      const msec = length % 10;
      const allsec = Math.floor(length / 10);
      const sec = allsec % 60;
      const min = Math.floor(allsec / 60) % 60;
      const hour = Math.floor(Math.floor(allsec / 60) / 60) % 24;
      const str = `${window.GlobalUtil.pad(hour, 2)} : ${window.GlobalUtil.pad(min, 2)} : ${window.GlobalUtil.pad(sec, 2)} . ${msec}00`;
      // const sec = Math.floor(length / 10) % 60;
      // const min = Math.floor(Math.floor(length / 10) / 60) % 60;
      // const str = `${min}:${sec}.${msec}00`;
      return str;
    },
    addTimer() {
      console.log('add timer');
      // this.model.localTeach.pushFileData('temp', [Number(this.oldDelayTime)]);
      this.model.localTeach.pushFileData('temp', [2]);
      this.model.localTeach.showArr = this.model.localTeach.fileDatas.temp.map((item, i) => {
        return i;
      });
      this.scrollTo(window.GlobalUtil.model.localTeach.fileDatas.temp.length);
    },
    addRecord() {
      // test data
      // const testData = window.GlobalUtil.model.localTeach.getTestData(window.GlobalUtil.model.localTeach.curDuration);
      // window.GlobalUtil.model.localTeach.pushFileData('temp', testData);
      // real data
      const realData = this.$store.getters.localJoints;
      this.model.localTeach.pushFileData('temp', realData);
      this.realData = realData;
      console.log(`realData = ${JSON.stringify(realData)}`);
      this.model.localTeach.showArr = this.model.localTeach.fileDatas.temp.map((item, i) => {
        return i;
      });
      this.scrollTo(window.GlobalUtil.model.localTeach.fileDatas.temp.length);
    },
    startEdit() {
      this.model.localTeach.editState = true;
      this.model.localTeach.hasChange = false;
    },
    onstart() {
      if (!this.isConnected) {
        const errorMessage = window.language.currentLang === 'en' ? 'The xArm is offline, please switch to online mode.' : '机械臂处于离线状态，请切换在线模式。';
        this.$message({
          message: errorMessage,
          type: 'warning',
          duration: 1000,
        });
        return;
      }
      // if (!window.GlobalUtil.store.state.robot.status.connected) {
      //   return;
      // }
      console.log('on start');
      if (this.model.localTeach.curProj.files.length > 0) {
        const uuid = this.model.localTeach.curSelectedTreeItem.uuid;
        console.log(`curSelectedTreeItem.uuid = ${uuid}`);
        const opt = {
          times: Number(this.model.localTeach.runTimes || 1),
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
            setTimeout(() => {
              // this.$refs.tree.setCurrentKey(window.GlobalUtil.model.localTeach.curSelectedTreeItem.uuid);
            }, 100);
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
  },
  beforeDestroy() {
  },
  components: {
    RunSetting,
  },
  computed: {
    isConnected() {
      if (this.$store.state.robot.status.connected && this.$store.state.robot.info.online) {
        return true;
      }
      return false;
    },
    startProjBtn: () => ({
      'start-btn': window.GlobalUtil.model.localTeach.curProj.files.length > 0 && window.GlobalUtil.model.localTeach.visible.starRecording === false && window.GlobalUtil.store.state.robot.status.connected,
      'start-btn-dark': window.GlobalUtil.model.localTeach.curProj.files.length === 0 || window.GlobalUtil.model.localTeach.visible.starRecording === true || !window.GlobalUtil.store.state.robot.status.connected,
    }),
    startFileBtn: () => ({
      'start-btn': window.GlobalUtil.store.state.robot.status.connected,
      'start-btn-dark': !window.GlobalUtil.store.state.robot.status.connected,
    }),
    saveChange: () => ({
      'save-change-btn': window.GlobalUtil.model.localTeach.hasChange === true && window.GlobalUtil.model.localTeach.curSelectedIndex >= 0,
      'save-change-btn-dark': !(window.GlobalUtil.model.localTeach.hasChange === true && window.GlobalUtil.model.localTeach.curSelectedIndex >= 0),
    }),
    cannotEdit: () => ({
      'edit-btn-dark': window.GlobalUtil.model.localTeach.isTeachRunningUUID !== '',
    }),
  },
};

</script>
<style lang="scss" scoped>
.switch-wrapper {
  position: absolute;
  width: 250px;
  height: 280px;
  background: #F3F3F3;
  // background: yellow;
  text-align: center;
  .recording {
    .file-name {
      height: 42px;
      line-height: 42px;
      color: #8B8B8B;
      background: #EFEFEF;
      span {
        padding-left: 38px;
      }
    }
    // .recording-btn {
      /*padding-top: 120px;*/
      // padding-top: 20vh;
      // button {
      //   margin: 0px auto;
      //   display: block;
      // }
    // }
    .bottom-btn {
      height: 42px;
      width: 100%;
      right: 0px;
      line-height: 42px;
      position: absolute;
      transition: all .4s;
      border: none;
      outline: 0;
      font-family: 'Gotham-Book';
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: -0.06px;
    }
    .timer-input {
      position: absolute;
      width: 32px;
      height: 42px;
      border: none;
      outline: 0;
      right: 10px;
      bottom: 0px;
      background: #7b7878;
      color: white;
      font-family: 'Gotham-Book';
      font-size: 14px;
      text-align: center;
    }
    .start-recording-btn {
      bottom: 42px;
      background: #4A90E2;
      cursor: pointer;
    }
    .eidt-btn {
      bottom: 42px;
      background: #4A90E2;
      cursor: pointer;
    }
    .save-change-btn {
      bottom: 42px;
      background: #52BF53;
      cursor: pointer;
    }
    .save-change-btn-dark {
      bottom: 42px;
      background: #BCBDBC;
      // cursor: pointer;
    }
    .edit-cancel-btn {
      bottom: 0px;
      background: #E24D4A;
      cursor: pointer;
    }
    .start-btn {
      bottom: 0;
      background: #52BF53;
      cursor: pointer;
    }
    .finish-recording-btn {
      bottom: 84px;
      background: #52BF53;
      cursor: pointer;
    }
    .press-btn {
      bottom: 42px;
      background: #E24D4A;
      // z-index: 50px;
      cursor: pointer;
    }
    .add-timer-btn {
      bottom: 0;
      background: black;
      // z-index: 50px;
      cursor: pointer;
    }
    .start-btn-dark {
      bottom: 0;
      background: #E3E3E3;;
    }
    .edit-btn-dark {
      background: #E3E3E3;;
      cursor: default;
    }
    /*.start-btn:hover {*/
      /*background: rgba(212,212,212,0.6);*/
    /*}*/
    .recording-time {
      height: 36px;
      line-height: 36px;
      font-family: 'Gotham-Book';
      font-size: 14px;
      color: #444444;
      letter-spacing: -0.78px;
      background: #E5E5E5;
    }
    .recording-name {
      height: 43px;
      line-height: 43px;
      font-family: 'Gotham-Book';
      font-size: 14px;
      color: #6D7175;
      letter-spacing: -0.78px;
      background: #FFFFFF;
    }
  }
}
</style>
