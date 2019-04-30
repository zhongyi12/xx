<template>
  <!-- speed -->
  <div class="config-wrapper" >
    <div :class="{'gray-color': !stateOnline}" class="range-speed" v-if="model.robot.state.info.xarm_end_tool_type === 'gripper'">
      <span class="com-font-style title">{{ $t('gripper') }}</span> 
      <div  :style="{opacity: stateOnline && model.robot.state.info.xarm_end_tool_type === 'gripper' ? 1 : 0.6}">
        <!--<el-slider
          :disabled="stateOnline === false || model.robot.state.remote.gripper.enable === false" 
    <div :class="{'gray-color': !stateOnline}" v-if="model.robot.state.info.xarm_end_tool_type === 'gripper'"  class="range-speed">
      <span class="com-font-style title">{{ $t('gripper') }}</span> 
      <div  :style="{opacity: stateOnline && model.robot.state.info.xarm_end_tool_type === 'gripper' ? 1 : 0.6}">
        <el-slider
        :disabled="stateOnline === false || model.robot.state.info.xarm_end_tool_type !== 'gripper'" 
          type="range" 
          :class="{'on-line-range': stateOnline === true}"
          v-model="gripper.pos" 
          @change="setGripperPos" 
          :step="1" 
          :max="1000" 
          :min="-200"
          show-input>
        </el-slider> -->

      <input type="range"  
          :disabled="stateOnline === false || model.robot.state.info.xarm_end_tool_type !== 'gripper'" 
          :class="{'on-line-range': stateOnline === true}"
          v-model="gripper.pos" 
          @change="setGripperPos" 
          :step="1" 
          :max="1000" 
          :min="-200"/>
        
      </div>
      <div class="num-wrapper">
        <span class="com-font-style title">{{$t('gripperPosition')}}</span>  
        <el-input style="width: 100px;"  v-model="gripper.pos"  @blur="setGripperPos()" ></el-input>
      </div>

    </div>
    <div v-else class="uf-logo">
      <img v-if="model.robot.state.info.xarm_axis === 5" src="../../assets/img/home/xarm5.png" draggable="false"/>
      <img v-if="model.robot.state.info.xarm_axis === 6" src="../../assets/img/home/xarm6.png" draggable="false"/>
      <img v-if="model.robot.state.info.xarm_axis === 7" src="../../assets/img/home/xarm7.png" draggable="false"/>
    </div>
      
  </div>
</template>

<script>

export default {
  props: [],
    i18n: {
      messages: {
        en: {
          gripperEnable: 'Enable',
          gripperDisable: 'Disable',
          gripperSpeed: 'Speed',
          gripperPosition: 'Position',
          gripper: "Gripper",
        },
        cn: {
          gripperEnable: '使能',
          gripperDisable: '禁用',
          gripperSpeed: '速度',
          gripperPosition: '位置',
          gripper: "机械爪",
        },
      },
    },
  data() {
    return {
      model: window.GlobalUtil.model,
    }
  },
  mounted() {
    this.model.robot.state.setGripperPos = (e, callback) => {
      this.setGripperPos(e, callback);
    }
    this.model.robot.state.local.gripper.pos = this.model.robot.state.remote.gripper.pos;

  },
  beforeDestroy() {
    this.model.robot.state.setGripperPos = null;
  },
  methods: {
   
    setGripperPos(evt, callback) {
      // console.log('gripper pos:', this.model.robot.state.remote.gripper.pos);
      window.CommandsRobotSocket.setGripperPosition(this.model.robot.state.local.gripper.pos, this.model.robot.state.local.gripper.speed, true, (dict) => {
        if ([0].includes(dict.code)) {
          this.model.robot.state.remote.gripper.pos = this.model.robot.state.local.gripper.pos;
          this.model.robot.state.remote.gripper.speed = this.model.robot.state.local.gripper.speed;
          // if (callback) {
          //   callback(dict);
          // }
        }
        else {
          this.model.robot.state.local.gripper.pos = this.model.robot.state.remote.gripper.pos;
          this.model.robot.state.local.gripper.speed = this.model.robot.state.remote.gripper.speed;
        }
      });
    },

  },
  components: {
  },
  computed: {
    stateOnline() {
      return this.$store.state.robot.info.online === true;
    },
    gripper() {
      return this.model.robot.state.local.gripper;
    },

  },
  watch: {
  },
}
</script>

<style scoped lang="scss">
.config-wrapper {

}
.gray-color {
  color: #c7c7c7;
}
.num-range-wrapper {
  // width: 280px;
  display: flex;
  justify-content: space-between;
}
.title {
  // padding: 10px 10px;
  display: block;
}
.range-speed {
  // padding: 10px;
    position: relative;
    height: 100%;
    width: 80%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.num-wrapper {
  width: 100%;
  margin-top: 2vh;
  display: flex;
  align-items: center; 
  justify-content: space-between;
}
.title {
  // padding: 10px 10px;
  display: block;
}
.uf-logo {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  // background-image: url('../../assets/img/uf_logo.svg');
  height: 62%;
  margin: 5%;
  text-align: center;
  display:flex;
  align-items: center;
  justify-content: center;
  img {
    width: 40%;
  }
}
</style>
