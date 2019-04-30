<template>
  <div class="com-module-wrapper motion-wrapper">
   <div class="com-setting-block-wrapper ">
    <h3 class="title">{{ $t('gripper') }}</h3>
    <div  class="acce-slider-wrapper"><span style="width: 180px;display: inline-block;">{{ $t('gripperTip') }}</span>
       <toggle-button
        style="font-size: 10px;margin-left: 266px;" 
        :color="{checked: '#c1521e', unchecked: '#D3D5DB'}"
        v-model="isInsallGripper"
        :sync="true"
        :labels="{checked: $t('yes'), unchecked: $t('no')}"
        :width="60" :height="20" 
        :disabled="!isConnected"
        />
    </div>
    <div class="acce-slider-wrapper">
      <span class="speed">{{ $t('speed') }}</span> 
      <div class="speed-slider">
       <!-- <el-slider show-input
        v-model="gripper.speed" 
        @change="setGripperSpeed" 
        :step="gripper.step" 
        :max="gripper.max" 
        :min="gripper.min"
        :disabled="!isInsallGripper || !isConnected"
        ></el-slider> -->
        <input 
        type="range"
         v-model="gripper.speed" 
        @change="setGripperSpeed" 
        :step="gripper.step" 
        :max="gripper.max" 
        :min="gripper.min"
        :disabled="!isInsallGripper || !isConnected"
        />

      </div>
    </div>
   </div>
   <!--
   <div class="com-setting-block-wrapper ">
    <h3 class="title">{{ $t('SuctionCup') }}</h3>
     <div><span style="width: 180px;display: inline-block;">{{ $t('suctionTip') }}</span>
      <toggle-button
        class="lock-toggle"
        
        style="font-size: 10px;margin-left: 266px;" 
        :color="{checked: '#c1521e', unchecked: '#D3D5DB'}"
        v-model="isInsallSuction"
        :sync="true"
        :labels="{checked: $t('yes'), unchecked: $t('no')}"
        :width="60" :height="20" />
    </div>
   </div>
  -->
  </div>
</template>

<script>
const model = window.GlobalUtil.model;
export default {
  i18n: {
    messages: {
      en: {
       gripper: "Gripper",
       gripperTip: "Is Gripper Installed",
       suctionTip: "Is Suction Cup Installed",
       speed: "Speed",
       SuctionCup: "Suction Cup",
       yes: "Yes",
       no: "No",
      },
      cn: {
        gripper: "机械爪",
        gripperTip: "是否安装机械爪",
        suctionTip: "是否安装吸头",
        speed: "速度",
        SuctionCup: "吸头",
        yes: "Yes",
        no: "No",
      },
    },
  },
  data() {
    return {
      model: model,
      gripper: {
        speed: model.robot.state.local.gripper.speed,
        step: 1,
        max: 1000,
        min:1,
      },
      isInstall: {
        gripper: false,
        SuctionCup: false,
      },
    };
  },
  mounted() {
  },
  methods: {
  setEnable() {
    
    window.CommandsRobotSocket.setGripperEnable(this.model.robot.state.local.gripper.enable, (dict) => {
      if (dict.code === 0) {
        this.model.robot.state.remote.gripper.enable = this.model.robot.state.local.gripper.enable;
        if (this.model.robot.state.local.gripper.enable) {
          window.CommandsRobotSocket.getGripperPosition((dict) => {
            if (dict.code === 0) {
              this.model.robot.state.local.gripper.pos = dict.data;
              this.model.robot.state.remote.gripper.pos = this.model.robot.state.local.gripper.pos;
            }
          }); 
        }
      }
      else {
        this.model.robot.state.local.gripper.enable = this.model.robot.state.remote.gripper.enable;
      }
    });
      console.log('online', this.stateOnline, 'enable', this.model.robot.state.remote.gripper.enable);
    
      
    },
   installTool() {

    if(this.isInstall.gripper) {
      this.isInstall.gripper = false;
    }else {
      this.isInstall.gripper = false;
    }
     console.log("this.isShowInControl.gripper",this.isInstall.gripper)
     if(this.isInstall.SuctionCup === true) {
      this.isInstall.SuctionCup = false;
     }
    
   }, 
   setGripperSpeed(evt) {
      // console.log('gripper speed:', this.model.robot.state.remote.gripper.speed);
      window.CommandsRobotSocket.setGripperSpeed(this.model.robot.state.local.gripper.speed, (dict) => {
        if (dict.code === 0) {
          this.model.robot.state.remote.gripper.speed = this.model.robot.state.local.gripper.speed;
        }
        else {
          this.model.robot.state.local.gripper.speed = this.model.robot.state.remote.gripper.speed;
        }
      });
    },
  },
  computed: {
    isGripperEnable() {
      return this.model.robot.state.info.xarm_gripper_is_enable;
    },
    isInsallGripper: {
      get() {
        return this.model.robot.state.info.xarm_end_tool_type === 'gripper';
        // return this.model.robot.state.local.gripper.enable;
      },
      set(value){
        // if(this.isInsallSuction === true) {
        //   this.isInsallSuction = false;
        // }
        // this.model.robot.state.local.gripper.enable = !this.model.robot.state.local.gripper.enable
        console.log('isInsallGripper:', value);
        window.CommandsRobotSocket.setEndType('gripper', value);
      }
    },
    isInsallSuction: {
      get() {
        return this.model.robot.state.info.xarm_end_tool_type === 'suction';
        // return this.isInstall.SuctionCup
      },
      set(value){
        window.CommandsRobotSocket.setEndType('suction', value);
        // if(this.isInsallGripper === true) {
        //   this.isInsallGripper = false;
        // }
        // this.isInstall.SuctionCup = !this.isInstall.SuctionCup;
      }
    },
    isConnected() {
      return this.$store.state.robot.status.connected === true;
    },
  },
  watched: {

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .motion-wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .acce-slider-wrapper {
      display: flex;
      align-items: center;
      margin:16px 0;
      
      .speed {
        padding-right:30px;
      }
      .speed-slider {
        width: 500px;

      }
    }


   
  }
</style>
