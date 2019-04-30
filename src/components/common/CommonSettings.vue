<template>
  <div class="config-wrapper noselected">
    <div class="mode-container" v-show="!model.robot.state.info.isOldProcotol">
      <el-button v-if="model.robot.state.info.xarm_mode === 2" :disabled="stateOnline === false" @click="switchMode(0)" class="com-header-btn border-line mode-enable">
        {{$t('jointTeachMode')}}
      </el-button>
      <el-button v-else @click="switchMode(2)" :disabled="stateOnline === false" class="com-header-btn border-line mode-disable" style="color:#b4bccc">
        {{$t('jointTeachMode')}}
      </el-button>
      <el-button v-if="model.robot.state.info.xarm_mode === 3" :disabled="stateOnline === false" @click="switchMode(0)" class="com-header-btn border-line mode-enable">
        {{$t('cartesianTeachMode')}}
      </el-button>
      <el-button v-else  @click="switchMode(3)" :disabled="stateOnline === false" class="com-header-btn border-line mode-disable" style="color:#b4bccc">
        {{$t('cartesianTeachMode')}}
      </el-button>
    </div>
    <!-- <div class="num-wrapper" style="margin-top: 20px">
      <span class="com-font-style lable-line">{{$t('collisionSensitivity')}}</span>
      <div class="num-input-wrapper">
        <input 
          :disabled="stateOnline === false" 
          type="range"
          @change="onCollisionSensitivityChange" 
          :class="{'on-line-range': stateOnline === true}"
          v-model="collisionSensitivity" 
          :step="1" 
          :max="255" 
          :min="0">
        <el-input-number :disabled="stateOnline === false" class="input-number" v-model="collisionSensitivity" @change="onCollisionSensitivityChange" size="mini" :min="0" :max="255" :label="$t('collisionSensitivity')"></el-input-number>
        <div class="num-range-wrapper ">
          <span class="com-font-style">0</span>
          <span class="com-font-style">255</span>
        </div>
      </div>
    </div>
    <div class="num-wrapper">
      <span class="com-font-style lable-line">{{$t('teachSensitivity')}}</span>
      <div class="num-input-wrapper">
        <input 
          :disabled="stateOnline === false" 
          type="range" 
          @change="onTeachSensitivityChange"
          :class="{'on-line-range': stateOnline === true}"
          v-model="teachSensitivity" 
          :step="1" 
          :max="255" 
          :min="0">
        <el-input-number :disabled="stateOnline === false" class="input-number" v-model="teachSensitivity" @change="onTeachSensitivityChange" size="mini" :min="0" :max="255" :label="$t('teachSensitivity')"></el-input-number>
        <div class="num-range-wrapper ">
          <span class="com-font-style">0</span>
          <span class="com-font-style">255</span>
        </div>
      </div>
    </div> -->

    <div class='sensitivity-container' :style="{'pointer-events': stateOnline === false ? 'none' : ''}" v-show="!model.robot.state.info.isOldProcotol">
      <div class="sensitivity-container-menu">
        <span class="com-font-style lable-line">{{$t('sensitivity')}}</span>
        <div style="display:inline-flex;margin-left:-1px;" :style="{'margin-left': $i18n.locale === 'cn' ? '18px' : '-1px'}">
          <div
            v-for="(param, index) in sensitivity.params"
            :key="param.name"
            @click="sensitivity.selectIndex = sensitivity.selectIndex !== index ? index : -1;tcp_load.selectIndex = -1;tcp_offset.selectIndex = -1;gravity_direction.selectIndex = -1;" 
            class="input-per-number-style border-number" 
            style="width: 190px;"
            :class="{ 'selected-cell-bg': sensitivity.selectIndex === index }">
            {{ param.alias }}:{{ Number(param.value).toFixed(0) }}
          </div>
        </div>
      </div>
      <div style="margin-top: 10px;" v-if="sensitivity.selectIndex !== -1 && stateOnline === true">
        <input 
          :disabled="stateOnline === false" 
          type="range" 
          :class="{'on-line-range': stateOnline === true}"
          v-model="sensitivity.params[sensitivity.selectIndex].value" 
          :step="sensitivity.params[sensitivity.selectIndex].step" 
          :max="sensitivity.params[sensitivity.selectIndex].max" 
          :min="sensitivity.params[sensitivity.selectIndex].min"
          @change="onSensitivityChange">
        <el-input-number
          :disabled="stateOnline === false"
          class="input-number"
          v-model="sensitivity.params[sensitivity.selectIndex].value" 
          size="mini" 
          :step="sensitivity.params[sensitivity.selectIndex].step"
          :min="sensitivity.params[sensitivity.selectIndex].min" 
          :max="sensitivity.params[sensitivity.selectIndex].max" 
          :label="sensitivity.params[sensitivity.selectIndex].name"
          @change="onSensitivityChange">
        </el-input-number>
      </div>
    </div>

    <div class='tcp-load-container' :style="{'pointer-events': stateOnline === false ? 'none' : ''}">
      <div class="tcp-container-menu">
        <span class="com-font-style lable-line">{{$t('tcpLoad')}}</span>
        <div style="display:inline-flex;margin-left:16px;margin-top:-5px;" :style="{'margin-left': $i18n.locale === 'cn' ? '10px' : '16px'}">
          <div
            v-for="(param, index) in tcp_load.params"
            :key="param.name"
            @click="tcp_load.selectIndex = tcp_load.selectIndex !== index ? index : -1;sensitivity.selectIndex = -1;tcp_offset.selectIndex = -1;gravity_direction.selectIndex = -1;" 
            class="input-per-number-style border-number" 
            style="width: 92.5px;"
            :class="{ 'selected-cell-bg': tcp_load.selectIndex === index }">
            {{ param.alias }}:{{ Number(param.value).toFixed(1) }}
          </div>
        </div>
      </div>
      <div style="margin-top: 10px;" v-if="tcp_load.selectIndex !== -1 && stateOnline === true">
        <input 
          :disabled="stateOnline === false" 
          type="range" 
          :class="{'on-line-range': stateOnline === true}"
          v-model="tcp_load.params[tcp_load.selectIndex].value" 
          :step="tcp_load.params[tcp_load.selectIndex].step" 
          :max="tcp_load.params[tcp_load.selectIndex].max" 
          :min="tcp_load.params[tcp_load.selectIndex].min"
          @change="onTcpLoadChange">
        <el-input-number
          :disabled="stateOnline === false"
          class="input-number"
          v-model="tcp_load.params[tcp_load.selectIndex].value" 
          size="mini" 
          :step="tcp_load.params[tcp_load.selectIndex].step"
          :min="tcp_load.params[tcp_load.selectIndex].min" 
          :max="tcp_load.params[tcp_load.selectIndex].max" 
          :label="tcp_load.params[tcp_load.selectIndex].name"
          @change="onTcpLoadChange">
        </el-input-number>
      </div>
    </div>

    <div class='tcp-offset-container' :style="{'pointer-events': stateOnline === false ? 'none' : ''}">
      <div class="tcp-container-menu">
        <span class="com-font-style lable-line">{{$t('tcpOffset')}}</span>
        <div style="display:inline-flex;margin-left:2px;margin-top:-5px;" :style="{'margin-left': $i18n.locale === 'cn' ? '10px' : '2px'}">
          <div
            v-for="(param, index) in tcp_offset.params"
            :key="param.name"
            @click="tcp_offset.selectIndex = tcp_offset.selectIndex !== index ? index : -1;sensitivity.selectIndex = -1;tcp_load.selectIndex = -1;gravity_direction.selectIndex = -1;" 
            class="input-per-number-style border-number"
            :style="{width: index < 3 ? '50px' : '70px'}"
            :class="{ 'selected-cell-bg': tcp_offset.selectIndex === index }">
            {{ param.alias }}:{{ Number(param.value).toFixed(1) }}
          </div>
        </div>
      </div>
      <div style="margin-top: 10px;" v-if="tcp_offset.selectIndex !== -1 && stateOnline === true">
        <input 
          :disabled="stateOnline === false" 
          type="range" 
          :class="{'on-line-range': stateOnline === true}"
          v-model="tcp_offset.params[tcp_offset.selectIndex].value" 
          :step="tcp_offset.params[tcp_offset.selectIndex].step" 
          :max="tcp_offset.params[tcp_offset.selectIndex].max" 
          :min="tcp_offset.params[tcp_offset.selectIndex].min"
          @change="onTcpOffsetChange">
        <el-input-number
          :disabled="stateOnline === false"
          class="input-number"
          v-model="tcp_offset.params[tcp_offset.selectIndex].value" 
          size="mini" 
          :step="tcp_offset.params[tcp_offset.selectIndex].step"
          :min="tcp_offset.params[tcp_offset.selectIndex].min" 
          :max="tcp_offset.params[tcp_offset.selectIndex].max" 
          :label="tcp_offset.params[tcp_offset.selectIndex].name"
          @change="onTcpOffsetChange">
        </el-input-number>
      </div>
    </div>

    <div class='gravity-dir-container' :style="{'pointer-events': stateOnline === false ? 'none' : ''}">
      <div class="tcp-container-menu">
        <span class="com-font-style lable-line">{{$t('gravityDir')}}</span>
        <div style="display:inline-flex;margin-left:16px;margin-top:-5px;" :style="{'margin-left': $i18n.locale === 'cn' ? '10px' : '16px'}">
          <div
            v-for="(param, index) in gravity_direction.params"
            :key="param.name"
            @click="gravity_direction.selectIndex = gravity_direction.selectIndex !== index ? index : -1;sensitivity.selectIndex = -1;tcp_load.selectIndex = -1;tcp_offset.selectIndex = -1;" 
            class="input-per-number-style border-number" 
            style="width: 92.5px;"
            :class="{ 'selected-cell-bg': gravity_direction.selectIndex === index }">
            {{ param.alias }}:{{ Number(param.value).toFixed(1) }}
          </div>
        </div>
      </div>
      <div style="margin-top: 10px;" v-if="gravity_direction.selectIndex !== -1 && stateOnline === true">
        <input 
          :disabled="stateOnline === false" 
          type="range" 
          :class="{'on-line-range': stateOnline === true}"
          v-model="gravity_direction.params[gravity_direction.selectIndex].value" 
          :step="gravity_direction.params[gravity_direction.selectIndex].step" 
          :max="gravity_direction.params[gravity_direction.selectIndex].max" 
          :min="gravity_direction.params[gravity_direction.selectIndex].min"
          @change="onGravityDirChange">
        <el-input-number
          :disabled="stateOnline === false"
          class="input-number"
          v-model="gravity_direction.params[gravity_direction.selectIndex].value" 
          size="mini" 
          :step="gravity_direction.params[gravity_direction.selectIndex].step"
          :min="gravity_direction.params[gravity_direction.selectIndex].min" 
          :max="gravity_direction.params[gravity_direction.selectIndex].max" 
          :label="gravity_direction.params[gravity_direction.selectIndex].name"
          @change="onGravityDirChange">
        </el-input-number>
      </div>
    </div>

    <div class="config-container">
      <el-button type="success" plain :disabled="stateOnline === false" @click="saveConfig(0)" class="config-save">
        {{$t('saveConfig')}}
      </el-button>
      <el-button type="danger" plain @click="restoreConfig(2)" :disabled="stateOnline === false" class="config-restore">
        {{$t('restoreConfig')}}
      </el-button>
    </div>
  </div>
</template>

<script>

export default {
  props: [],
    i18n: {
    messages: {
      en: {
        jointTeachMode: 'TEACH(JOINT)',
        cartesianTeachMode: 'TEACH(CARTESIAN)',
        sensitivity: 'SENSITIVITY',
        collision: 'COLLISION',
        teach: 'TEACH',
        collisionSensitivity: 'SENSITIVITY(Collision)',
        teachSensitivity: 'SENSITIVITY(Teach)',
        tcpLoad: 'TCP LOAD',
        tcpOffset: 'TCP OFFSET',
        gravityDir: 'GRAVITY DIRECTION',
        saveConfig: 'Save Configuration',
        restoreConfig: 'Restore Default Configuration',
      },
      cn: {
        jointTeachMode: '示教(关节)',
        cartesianTeachMode: '示教(笛卡尔)',
        sensitivity: '灵敏度',
        collision: '碰撞',
        teach: '示教',
        collisionSensitivity: '碰撞灵敏度',
        teachSensitivity: '示教灵敏度',
        tcpLoad: '末端负载',
        tcpOffset: '末端偏移',
        gravityDir: '重力方向',
        saveConfig: '保存配置',
        restoreConfig: '重置默认配置',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      collisionSensitivity: 0,
      teachSensitivity: 0,
      sensitivity: {
        selectIndex: -1,
        params: [
          {name: 'Collision-Sensitivity', alias: 'COLLISION', value: 0, min: 0, max: 255, step: 1},
          {name: 'Teach-Sensitivity', alias: 'TEACH', value: 0, min: 0, max: 255, step: 1},
        ]
      },
      tcp_load: {
        selectIndex: -1,
        params: [
          {name: 'Weight', alias: 'W', value: 0, min: 0, max: 10, step: 0.01},
          {name: 'Center-X', alias: 'O(X)', value: 0, min: -300, max: 300, step: 0.1},
          {name: 'Center-Y', alias: 'O(Y)', value: 0, min: -300, max: 300, step: 0.1},
          {name: 'Center-Z', alias: 'O(Z)', value: 0, min: -200, max: 400, step: 0.1},
        ]
      },
      tcp_offset: {
        selectIndex: -1,
        params: [
          {name: 'Offset-X', alias: 'X', value: 0, min: -300, max: 300, step: 0.1},
          {name: 'Offset-Y', alias: 'Y', value: 0, min: -300, max: 300, step: 0.1},
          {name: 'Offset-Z', alias: 'Z', value: 0, min: -300, max: 300, step: 0.1},
          {name: 'Offset-Roll', alias: 'Roll', value: 0, min: -180, max: 180, step: 0.1},
          {name: 'Offset-Pitch', alias: 'Pitch', value: 0, min: -180, max: 180, step: 0.1},
          {name: 'Offset-Yaw', alias: 'Yaw', value: 0, min: -180, max: 180, step: 0.1},
        ]
      },
      gravity_direction: {
        selectIndex: -1,
        params: [
          {name: 'Direction-X', alias: 'X', value: 0, min: -1, max: 1, step: 1},
          {name: 'Direction-Y', alias: 'Y', value: 0, min: -1, max: 1, step: 1},
          {name: 'Direction-Z', alias: 'Z', value: -1, min: -1, max: 1, step: 1},
        ]
      }
    }
  },
  mounted() {
    this.collisionSensitivity = this.remoteCollisionSensitivity;
    this.teachSensitivity = this.remoteTeachSensitivity;

    this.sensitivity.params[0].value = this.remoteCollisionSensitivity;
    this.sensitivity.params[1].value = this.remoteTeachSensitivity;
    this.sensitivity.params[0].alias = this.$t('collision');
    this.sensitivity.params[1].alias = this.$t('teach');

    this.tcp_load.params[0].value = Number(this.remoteTcpLoad[0]).toFixed(1);
    this.tcp_load.params[1].value = Number(this.remoteTcpLoad[1][0]).toFixed(1);
    this.tcp_load.params[2].value = Number(this.remoteTcpLoad[1][1]).toFixed(1);
    this.tcp_load.params[3].value = Number(this.remoteTcpLoad[1][2]).toFixed(1);

    this.gravity_direction.params[0].value = Number(this.remoteGravityDir[0]).toFixed(1);
    this.gravity_direction.params[1].value = Number(this.remoteGravityDir[1]).toFixed(1);
    this.gravity_direction.params[2].value = Number(this.remoteGravityDir[2]).toFixed(1);

    for (let i = 0;  i < this.tcp_offset.params.length; i++) {
      this.tcp_offset.params[i].value = Number(this.remoteTcpOffset[i]).toFixed(1);
    }
  },
  beforeDestroy() {
  },
  methods: {
    switchMode(mode) {
      window.CommandsRobotSocket.switch_mode(mode, (res) => {});
    },
    saveConfig() {
      window.CommandsRobotSocket.save_config((res) => {
      });
    },
    restoreConfig() {
      window.CommandsRobotSocket.restore_default_config((res) => {
      });
    },
    onCollisionSensitivityChange(value) {
      if (typeof value === 'number') {
        this.collisionSensitivity = value;
      }
      // console.log('Sensitivity:', this.collisionSensitivity);
      window.CommandsRobotSocket.set_collision_sensitivity(Number(this.collisionSensitivity), false, (res) => {
        setTimeout(() => {
          this.collisionSensitivity = this.remoteCollisionSensitivity;
        }, 300);
      });
    },
    onTeachSensitivityChange(value) {
      if (typeof value === 'number') {
        this.teachSensitivity = value;
      }
      // console.log('Sensitivity:', this.teachSensitivity);
      window.CommandsRobotSocket.set_teach_sensitivity(Number(this.teachSensitivity), false, (res) => {
        setTimeout(() => {
          this.teachSensitivity = this.remoteTeachSensitivity;
        }, 300);
      });
    },
    onSensitivityChange(value) {
      if (typeof value === 'number') {
        this.sensitivity.params[this.sensitivity.selectIndex].value = value;
      }
      const sensitivity = Number(this.sensitivity.params[this.sensitivity.selectIndex].value);
      if (this.sensitivity.selectIndex === 0) {
        window.CommandsRobotSocket.set_collision_sensitivity(sensitivity, false, (res) => {
          setTimeout(() => {
            this.sensitivity.params[0].value = Number(this.remoteCollisionSensitivity).toFixed(0);
          }, 300);
        });
      }
      else {
        window.CommandsRobotSocket.set_teach_sensitivity(sensitivity, false, (res) => {
          setTimeout(() => {
            this.sensitivity.params[1].value = Number(this.remoteTeachSensitivity).toFixed(0);
          }, 300);
        });
      }
    },
    onGravityDirChange(value) {
      if (typeof value === 'number') {
        this.gravity_direction.params[this.gravity_direction.selectIndex].value = value;
      }
      const gravity_direction = [
        Number(this.gravity_direction.params[0].value),
        Number(this.gravity_direction.params[1].value),
        Number(this.gravity_direction.params[2].value)
      ]
      window.CommandsRobotSocket.set_gravity_direction(gravity_direction, false, (res) => {
        setTimeout(() => {
          this.gravity_direction.params[0].value = Number(this.remoteGravityDir[0]).toFixed(1);
          this.gravity_direction.params[1].value = Number(this.remoteGravityDir[1]).toFixed(1);
          this.gravity_direction.params[2].value = Number(this.remoteGravityDir[2]).toFixed(1);
        }, 300);
      });
    },
    onTcpLoadChange(value) {
      if (typeof value === 'number') {
        this.tcp_load.params[this.tcp_load.selectIndex].value = value;
      }
      const weight = Number(this.tcp_load.params[0].value);
      const center = [
        Number(this.tcp_load.params[1].value),
        Number(this.tcp_load.params[2].value),
        Number(this.tcp_load.params[3].value)
      ]
      window.CommandsRobotSocket.set_tcp_load(weight, center, false, (res) => {
        setTimeout(() => {
          this.tcp_load.params[0].value = Number(this.remoteTcpLoad[0]).toFixed(1);
          this.tcp_load.params[1].value = Number(this.remoteTcpLoad[1][0]).toFixed(1);
          this.tcp_load.params[2].value = Number(this.remoteTcpLoad[1][1]).toFixed(1);
          this.tcp_load.params[3].value = Number(this.remoteTcpLoad[1][2]).toFixed(1);
        }, 300);
      });
    },
    onTcpOffsetChange(value) {
      if (typeof value === 'number') {
        this.tcp_offset.params[this.tcp_offset.selectIndex].value = value;
      }
      const offset = [
        Number(this.tcp_offset.params[0].value),
        Number(this.tcp_offset.params[1].value),
        Number(this.tcp_offset.params[2].value),
        Number(this.tcp_offset.params[3].value),
        Number(this.tcp_offset.params[4].value),
        Number(this.tcp_offset.params[5].value)
      ]
      window.CommandsRobotSocket.set_tcp_offset(offset, false, (res) => {
        setTimeout(() => {
          for (let i = 0;  i < this.tcp_offset.params.length; i++) {
            this.tcp_offset.params[i].value = Number(this.remoteTcpOffset[i]).toFixed(1);
          }
        }, 300);
      });
    }
  },
  components: {
  },
  computed: {
    stateOnline() {
      return this.$store.state.robot.info.online === true;
    },
    remoteCollisionSensitivity() {
      return this.model.robot.state.info.xarm_collision_sensitivity;
    },
    remoteTeachSensitivity() {
      return this.model.robot.state.info.xarm_teach_sensitivity;
    },
    remoteTcpLoad() {
      return this.model.robot.state.info.xarm_tcp_load;
    },
    remoteTcpOffset() {
      return this.model.robot.state.info.xarm_tcp_offset;
    },
    remoteGravityDir() {
      return this.model.robot.state.info.xarm_gravity_direction;
    }
  },
  watch: {
    remoteCollisionSensitivity(newValue) {
      this.collisionSensitivity = newValue;
    },
    remoteTeachSensitivity(newValue) {
      this.teachSensitivity = newValue;
    },
    remoteTcpLoad() {
      this.tcp_load.params[0].value = Number(this.remoteTcpLoad[0]).toFixed(1);
      this.tcp_load.params[1].value = Number(this.remoteTcpLoad[1][0]).toFixed(1);
      this.tcp_load.params[2].value = Number(this.remoteTcpLoad[1][1]).toFixed(1);
      this.tcp_load.params[3].value = Number(this.remoteTcpLoad[1][2]).toFixed(1);
    },
    remoteTcpOffset() {
      for (let i = 0;  i < this.tcp_offset.params.length; i++) {
        this.tcp_offset.params[i].value = Number(this.remoteTcpOffset[i]).toFixed(1);
      }
    },
    remoteGravityDir() {
      this.gravity_direction.params[0].value = Number(this.remoteGravityDir[0]).toFixed(1);
      this.gravity_direction.params[1].value = Number(this.remoteGravityDir[1]).toFixed(1);
      this.gravity_direction.params[2].value = Number(this.remoteGravityDir[2]).toFixed(1);
    }
  },
}
</script>

<style scoped lang="scss">
.mode-container {
  .el-input-number--mini {
    width: 100px;
  }
  .el-button:focus,.el-button:hover {
    // color: #409EFF;
    // border-color: white;
    background-color: white;
  }
  .el-button:active {
    background-color: #ecf5ff;
  }
}
// .el-input-number--mini {
//   width: 100px;
// }
// .el-button:focus,.el-button:hover {
//   background-color: white;
// }
// .el-button:active {
//   background-color: #ecf5ff;
// }
$grayColor: #94979c;
$greenClor: #65c068;
.config-wrapper {
  background: white;
  /*position: absolute;*/
  /*width: 450px;*/
  /*height: 50px;*/
  /*right: 350px;*/
  color: #555;
  .sensitivity-container {
    margin-top: 20px;
    .input-number {
      float: right;
      margin-right: 50px;
    }
  }
  .tcp-container-menu {
    display:inline-flex;
  }
  .tcp-load-container {
    margin-top: 18px;
    .input-number {
      float: right;
      margin-right: 50px;
    }
  }
  .tcp-offset-container {
    margin-top: 18px;
    .input-number {
      float: right;
      margin-right: 50px;
    }
  }
  .gravity-dir-container {
    margin-top: 18px;
    .input-number {
      float: right;
      margin-right: 50px;
    }
  }
  .jerk-container {
    margin-top: 18px;
    .input-number {
      float: right;
      margin-right: 50px;
    }
  }
  .config-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 20px;
  }
  .mode-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-top: 10px;
    .mode-enable {
      background-image: url("../../assets/img/control/btn_lock_green.png");
      color: $greenClor;
      background-repeat:no-repeat;
    }
    .mode-disable {
      background-image: url("../../assets/img/control/btn_lock_gray.png");
      color: $grayColor;
      background-repeat:no-repeat;
    }
  }
  .num-wrapper {
    padding: 5px 0;
    // display: flex;
    justify-content: space-between;
    span {
      font-size: 12px;
    }
    .num-range-min {
      float: right;
      margin-right: 150px;
    }
    .num-range-max {
      float: right;
      margin-right: 150px;
    }
    .num-input-wrapper {
      .input-number {
        float: right;
        margin-right: 50px;
      }
    }
  }
  .num-range-wrapper {
    // position: absolute;
    margin-top: 8px;
    margin-left: 45px;
    // left: 20px;
    bottom: -10px;
    width: 275px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }
  input[type=range] {
    // position: relative;
    margin-left: 60px;
    width: 250px;
    height: 2px;
    background: #878787;
    opacity: 1;
    border-radius: 150px;
    cursor: pointer;
    outline: none;
  }
  input[type=range]::-webkit-slider-thumb {
    width: 12px;
    height: 12px;
    -webkit-appearance: none;
    border: none;
    border-radius: 50%;
    // background: rgba(225,225,225,0.9);
    background: #aaa;
    /*box-shadow: 0 0 8px 0 gray;*/
  }
  input:disabled {
    cursor:not-allowed;
  }
  .on-line-range {
    // background: #69f !important;
  }
  .on-line-range::-webkit-slider-thumb {
    width: 25px !important;
    height: 25px !important;
    background: #999 !important;
  }
  input:disabled {
    cursor:not-allowed;
  }
  .com-font-style {
    font-family: 'Gotham-Book';
    font-size: 12px;
    text-align: left;
    margin-left: 20px;
  }
}
.disabled { pointer-events: none; }

.input-per-number-style {
  font-family: 'Gotham-Medium';
  font-size: 12px;
  text-align: center;
  width: 80px;
  height: 25px;
  // color: white;
  /* background: gray; */
  line-height: 25px;
  margin-left: 5px;
}
.border-number {
  // border: 1px solid #a3a3a3;
  border: 1px solid #aaa;
  border-radius: 2px;
}
.border-number-transparent {
  border: 1px solid transparent;
  border-radius: 2px;
}
.selected-cell-bg {
  // background: #a3a3a3;
  background: #aaa;
}
</style>
