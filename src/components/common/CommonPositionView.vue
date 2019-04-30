<template>
  <div class="end-container">
    <!-- <div style="width:50%;height:100%;background:yellow;">
    </div>
    <div style="width:50%;height:100%;float:left;background:green;">
    </div> -->

    <div class="block-wrapper" style="display: inline-flex">
      <ul>
        <li v-for="index in model.robot.state.info.xarm_axis" :key="index">
          <div class="left-title" :class="{'left-title-emulator-recording': $route.name === 'Emulator' || $route.name === 'Teach'}">
            J{{ index }}:
          </div>
          <span class="input-value">{{ localJoints[index - 1] || 0 }}</span>
          <!-- <span class="unit" style="font-size:15px;">°</span> -->
        </li>
      </ul>
      <ul>
        <!-- <li class="" style="width:100%;text-align:right;padding-right:150px;">TCP</li> -->
        <li v-for="li in config.position.nameArray" :key="li">
          <div class="left-title" :class="{'left-title-emulator-recording': $route.name === 'Emulator' || $route.name === 'Teach'}">
            {{ li }}:
          </div>
          <span class="input-value" >{{ position[li] || 0 }}</span>
          <!-- <span class="unit">mm</span> -->
        </li>
        <li v-for="li in config.orientation.nameArray" :key="li">
          <div class="left-title" :class="{'left-title-emulator-recording': $route.name === 'Emulator' || $route.name === 'Teach'}">
            {{ li }}:
          </div>
          <span class="input-value">{{ orientation[li] || 0 }}</span>
          <!-- <span class="unit" style="font-size:15px;">°</span> -->
        </li>
      </ul>
      <ul>
        <li>
          <div class="left-title" :class="{'left-title-emulator-recording': $route.name === 'Emulator' || $route.name === 'Teach'}">{{ $t('speed') }}:</div>
          <span class="input-value">{{ model.robot.state.remote.speed }}</span>
        </li>
        <li>
          <div class="left-title" :class="{'left-title-emulator-recording': $route.name === 'Emulator' || $route.name === 'Teach'}">{{ $t('acceleration') }}:</div>
          <span class="input-value">{{ model.robot.state.remote.acceleration }}</span>
        </li>
        <li>
          <div class="left-title" :class="{'left-title-emulator-recording': $route.name === 'Emulator' || $route.name === 'Teach'}">{{ $t('angle_speed') }}:</div>
          <span class="input-value">{{ model.robot.state.remote.angle_speed }}</span>
        </li>
        <li>
          <div class="left-title" :class="{'left-title-emulator-recording': $route.name === 'Emulator' || $route.name === 'Teach'}">{{ $t('angle_acceleration') }}:</div>
          <span class="input-value">{{ model.robot.state.remote.angle_acceleration }}</span>
        </li>
      </ul>
      <!-- <div class="" style="width:100%;text-align:center;">JOINTS</div> -->
    </div>
    <!-- <div>{{ model.robot.state.remote.last_used_position }}</div> -->

    <!--<div class="block-wrapper">-->
      <!--<button v-if="model.robot.state.isRobotShowEditBtn === true" @click="setValueDialog" :class="['com-circle-btn edit-btn', { comDisableEvent: false /*isOnline === false*/ }]">{{ $t('control.edit') }}</button>-->
      <!--<toggle-button v-model="stateOnline" :color="{checked: '#52BF53', unchecked: '#D3D5DB'}" :sync="true"-->
                     <!--:labels="{checked: 'ONLINE', unchecked: 'OFFLINE'}"-->
                     <!--:width="80" :height="30" />-->
      <!--<button class="reset-btn com-circle-btn" round @click="resetEnd()">{{ $t('record.reset') }}</button>-->
      <!--<com-stop></com-stop>-->
    <!--</div>-->

  </div>
</template>
<script>

import * as types from '@/store/mutation-types';
import ComStop from '../common/ComStop';

export default {
  props: [''],
  i18n: {
    messages: {
      en: {
        speed: 'S',
        acceleration: 'A',
        angle_speed: 'S(J)',
        angle_acceleration: 'A(J)',
      },
      cn: {
        speed: 'S',
        acceleration: 'A',
        angle_speed: 'S(J)',
        angle_acceleration: 'A(J)',
      },
    },
  },
  data() {
    return {
      isShwoEdit: false,
      model: window.GlobalUtil.model,
      config: {
        position: {
          nameArray: ['x', 'y', 'z'],
          // max: window.GlobalUtil.model.robot.state.range.position.x.max,
          // min: window.GlobalUtil.model.robot.state.range.position.y.min,
        },
        orientation: {
          nameArray: ['roll', 'pitch', 'yaw'],
          // max: window.GlobalUtil.model.robot.state.range.orientation.roll.max,
          // min: window.GlobalUtil.model.robot.state.range.orientation.pitch.min,
        },
      },
    }
  },
  mounted() {
  },
  methods: {
    setValueDialog() {
      console.log('setValueDialog');
      this.model.robot.state.showSetControlValueDialog = true;
    },
  },
  components: {
    ComStop,
  },
  computed: {
    stateOnline: {
      get() {
        return this.$store.state.robot.info.online;
      },
      set(value) {
        // this.setRobotState('online', value);
        window.GlobalUtil.model.robot.state.func.setRobotStateOnline(value);
        // if (value) {
        //   this.$store.commit(types.GET_ROBOT_STATUS, value);
        // }
        if (!this.$store.state.robot.status.connected) {
          setTimeout(() => {
            console.log('can not connect xArm');
            window.GlobalUtil.model.robot.state.func.setRobotStateOnline(false);
            // if (value) {
              // this.$store.commit(types.GET_ROBOT_STATUS, value);
            // }
          }, 500);
        }
      },
    },
    position() {
      const position = this.$store.getters.end.position;
      Object.keys(position).forEach((key) => {
        let t = position[key]
        if (position[key] === undefined) {
          t = position[key]
        }
        else if (typeof position[key] !== 'number') {
          t = Number(position[key])
        }
        position[key] = position[key] ? Number(t.toFixed(2)) : position[key];
      });
      return position;
    },
    orientation() {
      const orientation = this.$store.getters.end.orientation;
      Object.keys(orientation).forEach((key) => {
        let t = orientation[key]
        if (orientation[key] === undefined) {
          t = orientation[key]
        }
        else if (typeof orientation[key] !== 'number') {
          t = Number(orientation[key])
        }
        orientation[key] = orientation[key] ? Number(t.toFixed(2)) : orientation[key];
      });
      return orientation;
    },
    localJoints: {
      get() {
        const arr = this.$store.getters.localJoints;
        return arr;
      },
    },
    isOnline() {
      return this.$store.state.robot.info.online === true;
    },
  },
};
</script>
<style scoped lang="scss">

$liDivWidth : 25%;
$liInputWidth : 50%;
$textColor: #555;

.end-container {
  position: absolute;
  top: 40px;
  right: 20%;
  font-family: "Gotham-Book";
  /*background: gray;*/
  display: inline-flex;
  pointer-events: none;
  // opacity: 0.4;
  font-size: 14px;
}
.block-wrapper {
  position: relative;
  margin-left: 10px;
  display: inline-flex;
}
ul li {
  width: 110px;
  /*margin-left: 0px;*/
  // margin-right: auto;
  // margin-top: 5px;
  /*margin-top: 0px;*/
  // background: #3D3D3D;
  // border-radius: 20px;
  line-height: 24px;
  position: relative;
  display: flex;
  /*margin: 0 10px;*/
}
.left-title {
  // width: 5px;
  // font-size: .9rem;
  // color: #FFF;
  // color: $textColor;
  color: #727171;
  // right: -98px;
  letter-spacing: -0.67px;
  display: inline-block;
  text-align: right;
}
.left-title-emulator-recording {
  width: 56px;
}
.input-value {
  width: 40px;
  // left: 0px;
  // margin: auto;
  // color: #B1B1B1;
  // color: $textColor;
  color: #0e5caf;
  // background: #3D3D3D;
  // background: yellow;
  border: none;
  text-align: left;
  margin-left: 10px;
  // text-align: center;
  // cursor: pointer;
}
.unit {
  position: absolute;
  width: 30px;
  right: 10px;
  font-size: 10px;
  // color: #AEAEAE;
  color: $textColor;
}
</style>
