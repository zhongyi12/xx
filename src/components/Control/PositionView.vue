<template>
  <div class="">


    <div class="block-wrapper" style="display: inline-flex;padding-top: 1vh;">

      <ul>
         <li class="" >{{ $t('xyz') }}</li> 
        <li v-for="li in config.position.nameArray" :key="li" >
          <div class="left-title" :class="{'left-title-emulator-recording': $route.name === 'Emulator' || $route.name === 'Teach'}">
            {{ li }}:
          </div>
          <span class="input-value" >{{ position[li] || 0 }}</span>
          <span class="unit">mm</span>
        </li>
        <li class="" style="margin-top: 2vh;">{{ $t('rpy') }}</li> 
        <li v-for="li in config.orientation.nameArray" :key="li" >
          <div class="left-title":class="{'left-title-emulator-recording': $route.name === 'Emulator' || $route.name === 'Teach'}">
            {{ li }}:
          </div>
          <span class="input-value">{{ orientation[li] || 0 }}</span>
          <span class="unit">°</span>
        </li>
      </ul>


    </div>


  </div>
</template>
<script>

import * as types from '@/store/mutation-types';


export default {
  props: [''],
  i18n: {
    messages: {
      en: {
        xyz: "Position",
        rpy: "Attitude",
      },
      cn: {
        xyz: "位置",
        rpy: "姿态",
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
  font-family: "Gotham-Book";
  /*background: gray;*/
  display: inline-flex;
  pointer-events: none;
  // opacity: 0.4;
  font-size: 14px;
}
.block-wrapper {
  position: relative;
  // margin-left: 10px;
  display: inline-flex;
}
ul li {
  // width: 110px;
  /*margin-left: 0px;*/
  // margin-right: auto;
  // margin-top: 5px;
  /*margin-top: 0px;*/
  // background: #3D3D3D;
  // border-radius: 20px;
  line-height: 30px;
  position: relative;
  // display: flex;
  /*margin: 0 10px;*/
  span {
    display: inline-block;
  }
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
  // width: 38px;
  text-transform:capitalize
}
.left-title-emulator-recording {
  width: 56px;
}
.input-value {
  width: 46px;
  // left: 0px;
  // margin: auto;
  // color: #B1B1B1;
  // color: $textColor;
  color: #0e5caf;
  // background: #3D3D3D;
  // background: yellow;
  border: none;
  text-align: center;
  // margin-left: 10px;
  // text-align: center;
  // cursor: pointer;
}
.unit {
  // position: absolute;
  // width: 30px;
  right: -20px;
  font-size: 15px;
  // color: #AEAEAE;
  color: $textColor;
}
</style>
