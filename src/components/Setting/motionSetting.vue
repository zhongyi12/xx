<template>
  <div class="com-module-wrapper motion-wrapper">
   <div class="com-setting-block-wrapper ">
    <h3 class="title">{{ $t('lineMotion') }}</h3>
    <div class="acce-slider-wrapper"><span class="acce">{{ $t('acce') }}</span> 
      <div class="acce-slider">
        <!--<el-slider @change="setAcceleration('tcp')" v-model="line_acceleration" :max="limit_line_acc[1]" :min="limit_line_acc[0]" show-input :disabled="!isConnected"></el-slider> -->
        <input type="range"  @change="setAcceleration('tcp')" v-model="line_acceleration" :max="limit_line_acc[1]" :min="limit_line_acc[0]":disabled="!isConnected"/>
        
      </div>
      <input  type="number" @blur="setAcceleration('tcp')" v-model="line_acceleration" :max="limit_line_acc[1]" :min="limit_line_acc[0]":disabled="!isConnected"></input>
      <span style="margin-left: 10px;">mm/s^2</span>
    </div>
    <div class="acce-slider-wrapper"><span class="acce">{{ $t('positionStep') }}</span> 
      <div class="acce-slider">
        <input type="range" @change="setStepParam('position')"  v-model="localPositionStep" :max="100" :min="0.1" :step="0.1" :disabled="!isConnected"/> 
       </div> 
       <input type="number" @blur="setStepParam('position')"  v-model="localPositionStep" :max="100" :min="0.1" :step="0.1" :disabled="!isConnected"/>
       <span style="margin-left: 10px;">mm</span>
    </div>
    <div class="acce-slider-wrapper"><span class="acce">{{ $t('attitudeStep') }}</span> 
      <div class="acce-slider">
        <input type="range" @change="setStepParam('attitude')"  v-model="localAttitudeStep" :max="100" :min="0.1" :step="0.1"  :disabled="!isConnected" /> 
       </div>
        <input type="number" @blur="setStepParam('attitude')"  v-model="localAttitudeStep" :max="100" :min="0.1" :step="0.1"  :disabled="!isConnected" />
       <span style="margin-left: 10px;">°</span>
    </div>
   </div>


  <div class="com-setting-block-wrapper ">
    <h3 class="title">{{ $t('jointMotion') }}</h3>
    <div class="acce-slider-wrapper"><span class="acce">{{ $t('acce') }}</span> <div class="acce-slider">
       <input type="range" @change="setAcceleration('joint')"  v-model="angle_acceleration" :max="limit_angle_acc[1]" :min="limit_angle_acc[0]" show-input :disabled="!isConnected" />
     </div>
      <input type="number" @blur="setAcceleration('joint')"  v-model="angle_acceleration" :max="limit_angle_acc[1]" :min="limit_angle_acc[0]" show-input :disabled="!isConnected" />
      <span style="margin-left: 10px;">°/^2</span>
    </div>
    <div class="acce-slider-wrapper"><span class="acce">{{ $t('jointStep') }}</span> <div class="acce-slider">
      <input type="range" @change="setStepParam('joint')" v-model="localJointStep" :max="20" :min="0.1" :step="0.1" show-input :disabled="!isConnected" />
     </div>
      <input type="number" @blur="setStepParam('joint')" v-model="localJointStep" :max="20" :min="0.1" :step="0.1" show-input :disabled="!isConnected" />
     <span style="margin-left: 10px;">°</span>
    </div>
  </div>

  <div class="com-setting-block-wrapper ">
    <h3 class="title">{{ $t('sensitivitySetting') }}</h3>

   <!-- <div class="acce-slider-wrapper"><span class="acce">{{ $t('teachSensitivity') }}</span>
      <div class="acce-slider">
        <input type="range"  v-model="sensitivity.teach.value" :step="sensitivity.teach.step" :max="sensitivity.teach.max"  :min="sensitivity.teach.min" @change="onTeachSensitivityChange" :disabled="!isConnected"/>
        <input type="number"  v-model="sensitivity.teach.value" :step="sensitivity.teach.step" :max="sensitivity.teach.max"  :min="sensitivity.teach.min" @blur="onTeachSensitivityChange" :disabled="!isConnected"/>
      </div>
    </div>  -->

    <div class="acce-slider-wrapper"><span class="acce">{{ $t('collisionSensitivity') }}</span> 
      <div class="acce-slider">
       <div class="num-wrapper"><span v-for="(item, index) in [1,2,3,4,5]"></span></div>
        <input type="range" v-model="sensitivity.collision.value" 
          :step="sensitivity.collision.step" 
          :max="sensitivity.collision.max" 
          :min="sensitivity.collision.min"
          @change="onCollisionSensitivityChange"
          :disabled="!isConnected"
          style=" margin: 15px 0;"/>
        <div class="num-wrapper"><span v-for="(item, index) in [1,2,3,4,5]"></span></div>
      </div>
      <input type="number" v-model="sensitivity.collision.value" 
          :step="sensitivity.collision.step" 
          :max="sensitivity.collision.max" 
          :min="sensitivity.collision.min"
          @blur="onCollisionSensitivityChange"
          :disabled="!isConnected"/>
   </div>
  </div>

  <div class="com-setting-block-wrapper " style="position: relative;">
    <h3 class="title">{{ $t('initialPoint') }}
      <button class="btn-go-initial-position" @click="goAndEditInitialPoint()">{{ $t('gotoInitialPosition') }}</button>
    </h3>
    <!--<toggle-button
        class="lock-toggle"
        :disabled="stateOnline === false"
        @change="onLockInitialPoint()"
        :color="{checked: '#52BF53', unchecked: '#D3D5DB'}"
        v-model="isLockInitialPoint"
        :sync="true"
        :labels="{checked: $t('Edit'), unchecked: $t('Edit')}"
        :width="60" :height="20" /> -->
    <div class="com-setting-input-wrapper">
      <div class="com-joint-block" v-for="(item, index) in jointParams" :key="index">
        <div class="com-joint-block" v-if="index < model.robot.state.info.xarm_axis">
        <span class="name">{{ item.name }} </span>
       
       <!--  <input type="range"  
          v-model="localInitialPoint[index]" 
        :step="item.step" 
        :max="item.max" 
        :min="item.min"
        :disabled="!isConnected"
        @change="saveJointPoint()"/> -->


        


       <div style="display: flex;">
          <button
            id="joint-angle-decrease"
            class="el-icon-minus joint-btn"
            :axis="index"
            @touchstart="onDown"
            @mousedown="onDown"
            @touchend="onUp"
            @mouseup="onUp"
            :disabled="stateOnline === false || isLockInitialPoint"
            ></button>
                  
        <input type="number"  
          v-model="isLockInitialPoint ? localInitialPoint[index] : remoteJoints[index]" 
          :step="item.step" 
          :max="item.max" 
          :min="item.min"
          :disabled="!isConnected || isLockInitialPoint"
        />

        <button 
          id="joint-angle-increase"
          :axis="index"
          class="el-icon-plus joint-btn"
          
          @touchstart="onDown"
          @mousedown="onDown"
          @touchend="onUp"
          @mouseup="onUp"
          :disabled="stateOnline === false || isLockInitialPoint"
          ></button>
          
        </div>
        <span style="margin-left: 10px;">°</span>
      </div>
      </div>
    </div>
    <div class="btn-group" v-if="initialPointIsChange">
      <button class="btn btn-cancel" @click="onCancel()">{{ $t('cancel') }}</button>
      <button class="btn btn-save" @click="onSave()">{{ $t('save') }}</button>
    </div>
    <!-- <button class="btn-set-initial-point" @click="setCurPointToInitialPoint()">{{ $t('setCurPointToInitialPoint') }}</button> -->

    
   </div>
  </div>
</template>

<script>
import { stat } from 'fs';
const model = window.GlobalUtil.model;
export default {
  i18n: {
    messages: {
      en: {
       lineMotion: "Line Motion",
       acce: "Acceleration",
       jointMotion: "Joint Motion",
       initialPoint: "Initial Position",
       teachSensitivity: "Teach Sensitivity",
       collisionSensitivity:" Collision Sensitivity",
       sensitivitySetting:"Sensitivity Setting",
       jointStep: "Joint Step",
       positionStep: "Position Step",
       attitudeStep: "Attitude Step",
       setCurPointToInitialPoint: 'Set the current robot position as the initial point',
       gotoInitialPosition: 'Move to initial position',
       save: 'Save',
       cancel: 'Cancel',
      },
      cn: {
        lineMotion: "直线运动",
        acce: "加速度",
        jointMotion: "关节运动",
        initialPoint: "初始点位置",
        teachSensitivity: "示教灵敏度",
        collisionSensitivity:"碰撞灵敏度",
        sensitivitySetting:"灵敏度设置",
        jointStep: "关节步长",
        positionStep: "位置步长",
        attitudeStep: "姿态步长",
        setCurPointToInitialPoint: '把当前机械臂位置设为初始点',
        gotoInitialPosition: '移动到初始点位置',
        save: '保存',
        cancel: '取消',
      },
    },
  },
  data() {
    return {
      model: model,
      isLockInitialPoint: true,
      sensitivity: {
        teach: {
          value: model.robot.state.info.xarm_teach_sensitivity, 
          min: 0, 
          max: 5, 
          step: 1
        },
        collision: {
           value: model.robot.state.info.xarm_collision_sensitivity,
           min: 0, 
           max: 5, 
           step: 1
        },
      },
      jointParams: [
        { name: 'J1', max: model.robot.state.range.joint[0].max, min: model.robot.state.range.joint[0].min, value: 0, unit: '°', step: 0.1 },
        { name: 'J2', max: model.robot.state.range.joint[1].max, min: model.robot.state.range.joint[1].min, value: 0, unit: '°', step: 0.1 },
        { name: 'J3', max: model.robot.state.range.joint[2].max, min: model.robot.state.range.joint[2].min, value: 0, unit: '°', step: 0.1 },
        { name: 'J4', max: model.robot.state.range.joint[3].max, min: model.robot.state.range.joint[3].min, value: 0, unit: '°', step: 0.1 },
        { name: 'J5', max: model.robot.state.range.joint[4].max, min: model.robot.state.range.joint[4].min, value: 0, unit: '°', step: 0.1 },
        { name: 'J6', max: model.robot.state.range.joint[5].max, min: model.robot.state.range.joint[5].min, value: 0, unit: '°', step: 0.1 },
        { name: 'J7', max: model.robot.state.range.joint[6].max, min: model.robot.state.range.joint[6].min, value: 0, unit: '°', step: 0.1 },
      ],
      isDown: false,
      isLoop: false,
      axis: 1,
    };
  },
  mounted() {
    this.localPositionStep = this.remotePositionStep;
    this.localAttitudeStep = this.remoteAttitudeStep;
    this.localJointStep = this.remoteJointStep;
    this.localInitialPoint = this.remoteInitialPoint;
  },
  beforeDestroy() {
    this.isLockInitialPoint = true;
  },
  methods: {
    onCancel() {
      this.isLockInitialPoint = true;
    },
    onSave() {
      this.saveJointPoint(this.remoteJoints);
      this.isLockInitialPoint = true;
    },
    goAndEditInitialPoint() {
      this.isLockInitialPoint = true;
      const self = this;
      this.model.robot.state.func.setRobotMoveAllJoints(this.model.robot.state.remote.initialPoint, true, (dict) => {
        if (dict.code === 0) {
          self.isLockInitialPoint = false;
        }
      }, true);
    },
    onDown(evt) {
      this.axis = Number( evt.target.getAttribute('axis')) + 1;
      evt.preventDefault();
      this.isDown = true;
      this.interval = setTimeout(() => {
        if (this.isDown) {
          this.isLoop = true;
          this.moveStep(evt.target.id, true);
          // console.log('evt.target.id', evt.target.id)
          
        }
        else {
          this.moveStep(evt.target.id, false);
          // this.setCurPointToInitialPoint();
          // console.log('evt.target.id false', evt.target.id)
        }
      }, 200)
    },
    onUp(evt) {
      // evt.preventDefault();
      this.isDown = false;
      // clearTimeout(this.interval);
      if (this.isLoop) {
        this.isLoop = false;
        clearTimeout(this.interval);
        window.CommandsRobotSocket.moveStepOver(() => {
        });
      }
    },
    moveStep(direction, isLoop) {
      let distance = 1;
      
      if(this.stateOnline){
        window.CommandsRobotSocket.moveStep({'direction': direction, 'distance': distance, 'isLoop': isLoop, 'axis': this.axis})
      }
    },
    saveJointPoint(joints) {
      let points = this.localInitialPoint;
      if (joints !== undefined) {
        points = joints;
      }
      window.CommandsRobotSocket.setInitialPoint(points, undefined, () => {
      });
    },
    setStepParam(type) {
      let distance = 0;
      // if(type === 'position') {
      //   distance = this.positionStep;
      //   window.CommandsRobotSocket.moveStep({'distance': distance})
      // }else {
      //   distance = this.attitudeStep;
      //   window.CommandsRobotSocket.moveStep({'distance': distance})
      // }
      let step = 1;
      if (type === 'position') {
        step = this.localPositionStep;
      }
      else if (type === 'attitude') {
        step = this.localAttitudeStep;
      }
      else if (type === 'joint') {
        step = this.localJointStep;
      }
      window.CommandsRobotSocket.setStepParam(type, step);
    },
    setAcceleration(evt, isTcp) {
      if (isTcp == "tcp") {
        this.model.robot.state.local.acceleration = this.line_acceleration;
      }
      else {
        this.model.robot.state.local.angle_acceleration = this.angle_acceleration;
      }
      // this.model.robot.state.local.acceleration = this.acceleration;
      window.CommandsRobotSocket.setParamsAcceleration((dict) => { console.log(dict) });//
    },
    // switchMode(mode) {
    //   window.CommandsRobotSocket.switch_mode(mode, (res) => {});
    // },
    // saveConfig() {
    //   window.CommandsRobotSocket.save_config((res) => {
    //   });
    // },
    // restoreConfig() {
    //   window.CommandsRobotSocket.restore_default_config((res) => {
    //   });
    // },
    onCollisionSensitivityChange(value) {
      // const sensitivity = Number(this.sensitivity.collision.value);
      //  console.log("sensitivity1collision", sensitivity);
      window.CommandsRobotSocket.set_collision_sensitivity(Number(this.sensitivity.collision.value), true, (res) => {
        setTimeout(() => {
          this.sensitivity.collision.value = Number(this.remoteCollisionSensitivity);
        }, 300);
      });
    },
    onTeachSensitivityChange() {
      // console.log('Sensitivity:', this.teachSensitivity);
      // const sensitivity = Number(this.sensitivity.teach.value);
      // console.log("sensitivity1", sensitivity);
      window.CommandsRobotSocket.set_teach_sensitivity(Number(this.sensitivity.teach.value), true, (res) => {
        setTimeout(() => {
          this.sensitivity.teach.value = this.remoteTeachSensitivity;
        }, 300);
      });
    },
  },
  components: {
  },
  computed: {
    remoteJoints() {
      return this.$store.getters.remoteJoints;
    },
    angle_acceleration: {
      get() {
        return this.model.robot.state.local.angle_acceleration;
        // return this.model.robot.state.local.acceleration;
      },
      set(value) {
        this.model.robot.state.local.angle_acceleration = value;
        // this.model.robot.state.local.acceleration = value;
      }
    },
    line_acceleration: {
      get() {
        return this.model.robot.state.local.acceleration;
        // return this.model.robot.state.local.acceleration;
      },
      set(value) {
        this.model.robot.state.local.acceleration = value;
        // this.model.robot.state.local.acceleration = value;
      }
    },
    limit_angle_acc() {
      return this.model.robot.state.info.xarm_limit_angle_acc;
    },
    limit_line_acc() {
      return this.model.robot.state.info.xarm_limit_acc;
    },
    stateOnline() {
      return this.$store.state.robot.info.online === true;
    },
    isConnected() {
      return this.$store.state.robot.status.connected === true;
    },
    remoteCollisionSensitivity() {
      return this.model.robot.state.info.xarm_collision_sensitivity;
    },
    remoteTeachSensitivity() {
      return this.model.robot.state.info.xarm_teach_sensitivity;
    },
    localInitialPoint: {
      get() {
        return this.model.robot.state.local.initialPoint;
      },
      set(value) {
        this.model.robot.state.local.initialPoint = value;
      }
    },
    remoteInitialPoint: {
      get() {
        return this.model.robot.state.remote.initialPoint;
      }
    },
    initialPointIsChange() {
      if (this.isLockInitialPoint) {
        return false;
      }
      return this.remoteJoints.toString() !== this.remoteInitialPoint.toString();
    },
    localPositionStep: {
      get() {
        return this.model.robot.state.local.positionStep;
      },
      set(value) {
        this.model.robot.state.local.positionStep = value;
      }
    },
    remotePositionStep: {
      get() {
        return this.model.robot.state.remote.positionStep;
      }
    },
    localAttitudeStep: {
      get() {
        return this.model.robot.state.local.attitudeStep;
      },
      set(value) {
        this.model.robot.state.local.attitudeStep = value;
      }
    },
    remoteAttitudeStep: {
      get() {
        return this.model.robot.state.remote.attitudeStep;
      }
    },
    localJointStep: {
      get() {
        return this.model.robot.state.local.jointStep;
      },
      set(value) {
        this.model.robot.state.local.jointStep = value;
      }
    },
    remoteJointStep: {
      get() {
        return this.model.robot.state.remote.jointStep;
      }
    }
  },

  watch: {
    remoteCollisionSensitivity(newValue) {
      this.sensitivity.collision.value = newValue;
    },
    remoteTeachSensitivity(newValue) {
      this.sensitivity.teach.value = newValue;
    },
    remoteInitialPoint(newValue) {
      this.localInitialPoint = newValue;
    },
    remoteAttitudeStep(newValue) {
      this.localAttitudeStep = newValue;
    },
    remotePositionStep(newValue) {
      this.localPositionStep = newValue;
    },
    remoteJointStep(newValue) {
      this.localJointStep = newValue;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .btn-go-initial-position {
    background: #e27347;
    padding: 5px 10px;
    // border-radius: 10px;
    font-size: 13px;
    
    // width: 82px;
    // width: 170px;
   
    outline: none;
    cursor: pointer;
    border: none;
    color: #fff;
    margin-left: 20px;
    height: 30px;
    // right: 20%;
    // bottom: 5%;
    position: absolute;
  }
  .btn-group {
    left: 0;
    right: 0;
    text-align: center;
  }
  .btn {
    background: #e27347;
    padding: 5px 10px;
    font-size: 13px;
    outline: none;
    cursor: pointer;
    border: none;
    color: #fff;
    height: 30px;
    margin-top: 20px;
    width: 80px;
  }
  .btn-cancel {
    margin-right: 50px;
  }
  .btn-save {
    margin-left: 50px;
  }
  .btn-set-initial-point {
    background: #e27347;
    padding: 5px 10px;
    // border-radius: 10px;
    font-size: 13px;
    
    // width: 82px;
    // width: 170px;
   
    outline: none;
    cursor: pointer;
    border: none;
    color: #fff;
    margin-left: 20px;
    height: 30px;
    right: 20%;
    bottom: 5%;
    position: absolute;
  }
  .btn-set-initial-point:hover {
    background-color: rgba(226, 115, 71, 0.74);
  }
  .motion-wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .acce-slider-wrapper {
      display: flex;
      align-items: center;
      margin: 1vh 0;
     
      .acce {
        // padding-right:10px;
        width: 160px;
        text-align: right;
      }
      .acce-slider {
        width: 400px;
         margin: 0 1vw;
         display: flex;
         align-items: center;
          flex-direction: column;
      }
      .num-wrapper {
        display: flex;
        width: 94%;
        justify-content: space-between;
        span {
         
          border-right: 1px solid #c7c3c3;
          width: 20%;
          height: 8px;
         
        }
        span:first-child {
          border-left: 1px solid #c7c3c3;
        }
        
      }
    }
  .com-setting-input-wrapper {
     margin-left: 3vw;
  }
  .com-setting-input-wrapper .com-joint-block {
    margin-right: 20px;
    padding-top: 5px;
    display: inline-flex;
    align-items: center;
    .name {
      margin-right: 10px;
      width: 20px;
      text-align: left;
    }
  }
  input[type="number"] {
    width: 100px;
    line-height: 24px;
    border: 1px solid #d1d1d1;
    // margin-left: 20px;
    padding: 1px;
    text-align: center;
  }
   
  }

.joint-btn {
  // width: 5vw;
  // line-height: 3vh;
  text-align:center;
  border: 1px solid #e8e8e8;
  cursor: pointer;
  width: 80px;
  line-height: 36px;
}
.joint-btn:active{
  background: #d87046;
}
button:disabled {
  color:#b4bccc;
  cursor: no-drop;
}
</style>
