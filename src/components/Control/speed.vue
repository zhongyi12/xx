<template>
  <!-- speed -->
  <div class="config-wrapper" :style="{'opacity': stateOnline ? 1 : 0.6}">
    <div class="range-speed" >
     <!-- <el-slider
      v-model="localSpeedPercent"
      :disabled="stateOnline === false" 
      :class="{'on-line-range': stateOnline === true}" 
      @change="setSpeedPercent"
      :step="0.01" 
      :max="1" 
      :min="0"
      :format-tooltip="formatTooltip"

      show-input>
     </el-slider>  -->
    

      <input type="range"  
        v-model="localSpeedPercent"
        :disabled="stateOnline === false" 
        :class="{'on-line-range': stateOnline === true}" 
        @change="setSpeedPercent"
        :step="0.01" 
        :max="1" 
        :min="0.01"
        
      />
      <div class="speed-title" >
        <span class=" ">{{ $t('speed') }}</span> 
        <el-input v-model="localSpeedPercent" style="width:100px;"></el-input>
      </div>
     
    </div>
   
    
  </div>
</template>

<script>

export default {
  props: ['isTcpTab'],
  i18n: {
    messages: {
      en: {
        speed: 'Speed',
        acceleration: 'Acceleration',
      },
      cn: {
        speed: '速度',
        acceleration: '加速度',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,

    }
  },
  mounted() {
    this.localSpeedPercent = this.remoteSpeedPercent;
  },
  methods: {
    setSpeedPercent(evt) {
      window.CommandsRobotSocket.setSpeedPercent(this.localSpeedPercent, (dict) => {
        this.localSpeedPercent = this.remoteSpeedPercent;
      });
    },
    formatTooltip(val) {
      return `${val * 100}%`;
    }
  },
  components: {
  },
  computed: {
    stateOnline() {
      return this.$store.state.robot.info.online === true;
    },
    localSpeedPercent: {
      get() {
        return this.model.robot.state.local.speedPercent;
      },
      set(value) {
        this.model.robot.state.local.speedPercent = value;
      }
    },
    remoteSpeedPercent: {
      get() {
        return this.model.robot.state.remote.speedPercent;
      }
    }
  },
  watch: {
    remoteSpeedPercent(newValue) {
      this.localSpeedPercent = newValue;
    }
  },
}
</script>

<style scoped lang="scss">
.config-wrapper {
  .gray-color {
    color: #c7c7c7;
  }
  // margin-top: 50px;
  .range-speed {
    position: relative;
    height: 100%;
    width: 80%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // padding: 3%;

    // padding: 26px 10px;
    .speed-title {
      // margin-top: 7px;
      display: flex;
      justify-content: space-between;
       align-items: center;
      margin-top: 2vh;
      width: 100%;
    }

  }
  .num-wrapper {
    // padding: 10px 0;
    display: flex;
    justify-content: space-between;
  }
  .range-wrapper {

    // width: 248px;
    display: flex;
    justify-content: space-between;
    position: absolute;
    left: 20px;
    bottom: -8px;
  }
}

</style>
