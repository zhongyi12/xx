<template>
  <div id="root-menu" class="noselected">
    <div class="base-header-wrapper com-header-wrapper">
      <div>
        <span class="back-title" v-if="model.commonStatusMgr.panelIsHidden === true"> {{ backTitle }} </span>
      </div>
    </div>
  </div>
</template>

<script>

import * as types from './../../store/mutation-types';

export default {
  props: ['backTitle'],
  i18n: {
    messages: {
      en: {
        xArmOnline: 'Live Control',
        lock: 'Lock the Joints',
        reset: 'Reset Position',
        emergencyStop: 'Emergency Stop',
      },
      cn: {
        emergencyStop: '紧急停止',
        lock: '锁住所有关节',
        reset: '重置位置',
        xArmOnline: '实时控制',
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
  beforeDestroy() {
  },
  methods: {
  },
  components: {
  },
  computed: {
  },
  watch: {
  },
}
</script>

<style scoped lang="scss">
.base-header-wrapper {
  background: #F8F8F8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .back-title {
    margin-left: 1rem;
    font-family: 'Gotham-Bold';
    font-size: 18px;
    color: #444;
    letter-spacing: -1px;
  }
}
</style>
