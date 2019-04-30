<template>
  <div style="position:relative;">
   <div style="position:absolute;left:0px;top:20px;z-index:99;">
      <toggle-button
        v-show="model.commonStatusMgr.showToggleBtn"
        style=""
        v-model="model.commonStatusMgr.ControlPositionShow"
        :color="{checked: '#409eff', unchecked: '#13ce66'}"
        :labels="{checked: 'xArm', unchecked: 'Slide'}"
        :width="66" :height="22" :sync="true"
       />
    </div>
    <div style="" v-if="model.commonStatusMgr.ControlPositionShow === true">
      <CommonPositionView></CommonPositionView>
    </div>
    <div style="position: absolute;top:0;right:0;width:500px;background:rgba(255, 255, 255, .6)" v-if="model.commonStatusMgr.ControlPositionShow === false">
      <CommonSetControlEdit :showSideBtn="true">
      </CommonSetControlEdit>
    </div>
  </div>
</template>
<script>

// import * as types from '@/store/mutation-types';
import CommonSetControlEdit from './CommonSetControlEdit';
import CommonPositionView from './CommonPositionView';

export default {
  // props: ['isShowClose', 'isSpeedMode'],
  i18n: {
    messages: {
      en: {
        stop: 'Stop',
        emergencyStop: 'Emergency Stop',
      },
      cn: {
        stop: '停止',
        emergencyStop: '紧急停止',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
    }
  },
  mounted() {
    
  },
  components: {
    CommonSetControlEdit,
    CommonPositionView
  },
  beforeDestroy() {
    
  },
  methods: {
   
  },
  computed: {
    isConnected() {
      return this.$store.state.robot.status.connected;
    },
  },
};
</script>
<style scoped lang="scss">
.container {
 position: relative;
}

</style>

