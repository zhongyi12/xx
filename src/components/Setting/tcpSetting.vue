<template>
  <div class="com-module-wrapper motion-wrapper">

  <div class="com-setting-block-wrapper">
    <h3 class="title">{{ $t('tcpPayLoad') }}</h3>
    <div class="com-setting-input-wrapper">
      <div class="com-block" v-for = "(item, index) in tcpPayLoad" :key="index" style="margin-right: -50px;">
        <span class="name"> {{ item.alias }}</span>
        <el-input type="number" 
          v-model="item.value" 
          :min="item.min" 
          :max="item.max"
          :step="item.step"
          style="width: 90px;"
          :disabled="!isConnected"
          @change="onTcpLoadChange(item.value,index)"></el-input>  
        <span class="unit">{{ item.unit }}</span>
      </div>
    </div>
   </div>

 <!-- <div class="com-setting-block-wrapper">
    <h3 class="title">{{ $t('tcpGravityDirectory') }}</h3>
    <div class="com-setting-input-wrapper">
      <div class="com-block" v-for = "(item, index) in tcpGravityDirectory" :key="index">
        <span class="name"> {{ item.alias }}</span>
        <el-input type="number" 
          v-model="item.value" 
          :min="item.min" 
          :max="item.max"
          :step="item.step"
          :disabled="!isConnected"
          @change="onTcpGravityDirectoryChange(item.value,index)"></el-input>  
        <span class="unit">{{ item.unit }}</span>
      </div>
  
    </div>
   </div> -->

  <div class="com-setting-block-wrapper">
    <h3 class="title">{{ $t('tcpOffset') }}</h3>
    <div class="com-setting-input-wrapper">
      <div class="com-block" v-for="(item, index) in tcpOffset" :key=index>
        <span class="name">{{ item.alias }}</span>
        <el-input  type="number" 
          v-model="item.value" 
          :min="item.min" 
          :max="item.max"
          :step="item.step"
          :disabled="!isConnected"
          @change="onTcpOffsetChange(item.value,index)"></el-input> 
        <span class="unit">{{ item.unit }}</span>
      </div>
    </div>
   </div>

  </div>
</template>

<script>
export default {
  i18n: {
    messages: {
      en: {
        tcpPayLoad: 'TCP PayLoad',
        tcpPayLoadWeight: 'Weight',
        tcpPayLoadX: 'X',
        tcpPayLoadY: 'Y',
        tcpPayLoadZ: 'Z',
        payLoad: "Payload",
        tcpGravityDirectory: "TCP Gravity Directory",
        tcpOffset: "TCP Offset",
      },
      cn: {
        tcpPayLoad: 'TCP 负载',
        tcpPayLoadWeight: '负载重量',
        tcpPayLoadX: 'X',
        tcpPayLoadY: 'Y',
        tcpPayLoadZ: 'Z',
        payLoad: "有效负载",
        tcpGravityDirectory: "TCP 重力方向",
        tcpOffset: "TCP 偏移",
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      tcpPayLoad: [
        {alias: this.$t('tcpPayLoadWeight'), value: 0.00, min: 0.00, max: 10.00, step: 0.01, unit: 'kg'},
        {alias: this.$t('tcpPayLoadX'), value: 0.0, min: -300.0, max: 300, step: 0.1, unit: 'mm'},
        {alias: this.$t('tcpPayLoadY'), value: 0.0, min: -300, max: 300, step: 0.1, unit: 'mm'},
        {alias: this.$t('tcpPayLoadZ'), value: 0.0, min: -200, max: 400, step: 0.1, unit: 'mm'},
      ],
      tcpGravityDirectory: [
        {alias: 'X', value: 0, min: -1, max: 1, step: 1},
        {alias: 'Y', value: 0, min: -1, max: 1, step: 1},
        {alias: 'Z', value: -1, min: -1, max: 1, step: 1},
      ],
      
      tcpOffset: [
        {alias: 'X', value: 0, min: -300, max: 300, step: 0.1, unit: 'mm'},
        {alias: 'Y', value: 0, min: -300, max: 300, step: 0.1, unit: 'mm'},
        {alias: 'Z', value: 0, min: -300, max: 300, step: 0.1, unit: 'mm'},
        {alias: 'Roll', value: 0, min: -180, max: 180, step: 0.1, unit: '°'},
        {alias: 'Pitch', value: 0, min: -180, max: 180, step: 0.1, unit: '°'},
        {alias: 'Yaw', value: 0, min: -180, max: 180, step: 0.1, unit: '°'},
      ],
    };
  },
  mounted() {
   
    this.tcpPayLoad[0].value = Number(this.remoteTcpLoad[0]).toFixed(2);
    this.tcpPayLoad[1].value = Number(this.remoteTcpLoad[1][0]).toFixed(1);
    this.tcpPayLoad[2].value = Number(this.remoteTcpLoad[1][1]).toFixed(1);
    this.tcpPayLoad[3].value = Number(this.remoteTcpLoad[1][2]).toFixed(1);
   
    for(let i=0; i < this.tcpGravityDirectory.length; i++) {
      this.tcpGravityDirectory[i].value = Number(this.remoteGravityDirection[i]).toFixed(0);
    }

    for (let i = 0;  i < this.tcpOffset.length; i++) {
      this.tcpOffset[i].value = Number(this.remoteTcpOffset[i]).toFixed(1);
    }
  },
  methods: {
    
    onTcpLoadChange(value, index) {
      if (typeof value === 'number') {
        this.tcpPayLoad[index].value = value;
      }
      const weight = Number(this.tcpPayLoad[0].value);
      const center = [
        Number(this.tcpPayLoad[1].value),
        Number(this.tcpPayLoad[2].value),
        Number(this.tcpPayLoad[3].value),
      ]
      window.CommandsRobotSocket.set_tcp_load(weight, center, true, (res) => {
        setTimeout(() => {
          this.tcpPayLoad[0].value = Number(this.remoteTcpLoad[0]).toFixed(2);
          this.tcpPayLoad[1].value = Number(this.remoteTcpLoad[1][0]).toFixed(1);
          this.tcpPayLoad[2].value = Number(this.remoteTcpLoad[1][1]).toFixed(1);
          this.tcpPayLoad[3].value = Number(this.remoteTcpLoad[1][2]).toFixed(1);
        }, 300);
      });
    },
    onTcpGravityDirectoryChange(value, index) {
      if (typeof value === 'number') {
        this.tcpGravityDirectory[index].value = value;
      }
      const direction = []
      for(let i=0; i < this.tcpGravityDirectory.length;i++) {
        direction.push(Number(this.tcpGravityDirectory[i].value))
      }
     
      window.CommandsRobotSocket.set_gravity_direction(direction, true, (res) => {
        setTimeout(() => {
          for(let i=0; i < this.tcpGravityDirectory.length; i++) {
            this.tcpGravityDirectory[i].value = Number(this.remoteGravityDirection[i]).toFixed(0);
          }
        }, 300);
      });
    },
    onTcpOffsetChange(value, index) {
      if (typeof value === 'number') {
        this.tcpOffset[index].value = value;
      }

      const offset = [];
      for(let i = 0;  i < this.tcpOffset.length; i++) {
        offset.push( Number(this.tcpOffset[i].value),)
      }
      window.CommandsRobotSocket.set_tcp_offset(offset, true, (res) => {
        setTimeout(() => {
          for (let i = 0;  i < this.tcpOffset.length; i++) {
            this.tcpOffset[i].value = Number(this.remoteTcpOffset[i]).toFixed(1);
          }
        }, 300);
      });
    }
  },
  computed: {
    remoteTcpLoad() {
      return this.model.robot.state.info.xarm_tcp_load;
    },
    remoteTcpOffset() {
      return this.model.robot.state.info.xarm_tcp_offset;
    },
    remoteGravityDirection() {
      return this.model.robot.state.info.xarm_gravity_direction;
    },
    isConnected() {
      return this.$store.state.robot.status.connected === true;
    },
  },
  
  watch: {
    remoteCollisionSensitivity(newValue) {
      this.sensitivity.collision.value = newValue;
    },
    remoteTeachSensitivity(newValue) {
      this.sensitivity.teach.value = newValue;
    },
    remoteTcpLoad(newValue) {
      this.tcpPayLoad[0].value = Number(this.remoteTcpLoad[0]).toFixed(2);
      this.tcpPayLoad[1].value = Number(this.remoteTcpLoad[1][0]).toFixed(1);
      this.tcpPayLoad[2].value = Number(this.remoteTcpLoad[1][1]).toFixed(1);
      this.tcpPayLoad[3].value = Number(this.remoteTcpLoad[1][2]).toFixed(1);
    },
    remoteTcpOffset(newValue) {
      for (let i = 0;  i < this.tcpOffset.length; i++) {
        this.tcpOffset[i].value = Number(this.remoteTcpOffset[i]).toFixed(1);
      }
    },
    remoteGravityDirection(newValue) {
      for (let i = 0;  i < this.tcpGravityDirectory.length; i++) {
        this.tcpGravityDirectory[i].value = Number(this.remoteGravityDirection[i]).toFixed(0);
      }
    }
  },
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
      .acce {
        padding-right:30px;
      }
      .acce-slider {
        width: 500px;

      }
    }
   .unit {
     padding-left: 14px;
   }
  }

  .com-setting-input-wrapper .com-block {
    margin-right: 20px;
    width:30%;
    .name {
      margin-right: 14px;
      width: 66px;
      text-align: right;
    }
  }
</style>
