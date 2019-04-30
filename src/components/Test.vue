<template lang="html">
 <div class="main-wrapper test-wrapper">
    <common-top-menu2
      backTitle="测试">
    </common-top-menu2>
    <div class="test-container">
      <div style="margin-top:20px;">
        <button
          id="btn-reset"
          style="width:100px;height:60px;"
          @click="reset"
          >复位</button>
        <button
          id="btn-stop"
          style="margin-left:100px;width:100px;height:60px;"
          @click="emergencyStop"
          >停止</button>
      </div>
      <div style="margin-top:20px;">
        <button
          style="width:200px;height:80px;"
          @click="startRecording"
          >开始录制(会开启关节示教，并把之前录制的清除)</button>
        <button
          style="margin-left:100px;width:100px;height:80px;"
          @click="stopRecording"
          >停止录制(会关闭关节示教)</button>
        <button
          style="margin-left:100px;width:100px;height:80px;"
          @click="playRecording"
          >运行录制轨迹</button>
      </div>
    </div>
  </div>
</template>

<script>
import CommonTopMenu2 from './common/CommonTopMenu2';

export default {
  data() {
    return {
      model: window.GlobalUtil.model,
    };
  },
  created() {
  },
  mounted() {
  },
  methods: {
    reset() {
      window.CommandsRobotSocket.goHome(true);
    },
    emergencyStop() {
      window.CommandsRobotSocket.urgentStop(false);
    },
    startRecording() {
      window.CommandsRobotSocket.startRecording();
    },
    stopRecording() {
      window.CommandsRobotSocket.stopRecording();
    },
    playRecording() {
      window.CommandsRobotSocket.playRecording();
    }
  },
  computed: {
    isConnected() {
      return this.$store.state.robot.status.connected;
    },
    position() {
      const position = this.$store.getters.end.position;
      return position;
    },
    orientation() {
      const orientation = this.$store.getters.end.orientation;
      return orientation;
    },
    remoteJoints() {
      const joints = this.$store.getters.remoteJoints;
      return joints;
    }
  },
  components: {
    CommonTopMenu2,
  }
};
</script>
<style lang="scss" scoped>
.test-container {
  margin-top: 20px;
  text-align: center;
}
</style>