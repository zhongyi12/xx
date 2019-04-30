<template>
  <div id="app" unselectable="on" onselectstart="return false;">
    <div>
      <ComStop v-if="routeName"></ComStop>
    </div>
    <div class="main-container">
      <router-view>
        <!-- <keep-alive slot="xarm"> -->
          <xarm-model slot="xarm"></xarm-model>
          <!-- <component :is="componentId"></component> -->
        <!-- </keep-alive> -->
      </router-view>
    </div>
    <!-- <div
      @click="clickTest"
      style="position:absolute;left:100px;top:200px;background:yellow;width:50px;height:30px;">
      {{ counter }}
      </div> -->
  </div>
</template>

<script>

import GlobalUtil from '@/store/core/global_util';
import XarmModel from '@/components/common/XarmModel';
import ComStop from '@/components/common/ComStop'
import meshResource from '@/assets/lib/threeJSLoader'
import * as types from '@/store/mutation-types';

window.GlobalUtil = GlobalUtil;

export default {
  name: 'app',
  data() {
    return {
      componentId: 'XarmModel',
      counter: 0,
    }
  },
  mounted() {
    window.xArmVuex = this.$store;
    window.GlobalUtil.store = this.$store;
    this.$store.dispatch('openWebsocket');
    // preload meshs of threeJS
    meshResource.init().then(() => {
      console.log('load geometry promise resolve')
      this.$store.commit(types.XARM_SRC_LOADED)
    })
  },
  components: {
    XarmModel,
    ComStop,
    EmptyComponent: '<template></template>',
  },
  methods: {
    clickTest() {
      console.log('click test click test click test');
      this.counter += 1;
    },
    tabClick() {
      this.componentId = this.componentId === 'XarmModel' ? 'EmptyComponent' : 'XarmModel'
    },
  },
  computed: {
    routeName() {
      return ['Home', 'Emulator', 'Editor', 'Paint', 'Blockly', 'Teach'].includes(this.$route.name);
    },
  },
};
</script>

<style>
/* 加了这句 texterea 无效 */
/* *{
  -webkit-touch-callout:none;
  -webkit-user-select:none;
  -khtml-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
  -moz-touch-callout:none;
  -ms-touch-callout:none;
  touch-callout:none;
} */

input {
  -webkit-user-select:auto; /*webkit浏览器*/
}

input[type=range] {
  -webkit-user-select:none; /*webkit浏览器*/
}

</style>
