<template>
  <div class="app-root" id="app" unselectable="on" onselectstart="return false;">
   <!-- <ComNav></ComNav> -->
    <!--<div>-->
      <!--<ComStop v-if="routeName"></ComStop>-->
    <!--</div>-->
    <div class="main-container" @click="hidePanel()">
      <router-view>
        <!-- <keep-alive slot="xarm"> -->
          <template slot="xarm" slot-scope="slotProps">
            <xarm-model :slotProps="slotProps"></xarm-model>
          </template>
          <!-- <component :is="componentId"></component> -->
        <!-- </keep-alive> -->
      </router-view>
      <DialogError v-if="model.exceptionModel.showErrorDialog && isConnected"></DialogError>

    </div>
  </div>
</template>

<script>

import XarmModel from '@/components/common/XarmModel';
import ComStop from '@/components/common/ComStop'
import meshResource from '@/assets/lib/threeJSLoader'
import * as types from '@/store/mutation-types';
import ComNav from '@/components/common/CommonNav';
import DialogError from '@/components/dialog/DialogError';
import 'sweetalert2/dist/sweetalert2.css';

export default {
  name: 'app',
  data() {
    return {
      componentId: 'XarmModel',
      counter: 0,
      model: window.GlobalUtil.model,
    }
  },
  mounted() {
    // 禁用右键菜单
    // document.oncontextmenu = function() {
    //   event.returnValue = false;
    // }
    window.xArmVuex = this.$store;
    window.GlobalUtil.store = this.$store;
    this.$store.dispatch('openWebsocket');
    // preload meshs of threeJS
    meshResource.init().then(() => {
      console.log('load geometry promise resolve')
      this.$store.commit(types.XARM_SRC_LOADED)
    })

    const imgs = document.getElementsByTagName('img');
    for (let i = 0; i < imgs.length; i += 1) {
      const img = imgs[i];
      img.ondragstart = () => {
        return false;
      };
    }
    window.NativeCom.sendCmdToNative({ cmd: 'connect_to', address: window.location.host }, (dict) => {
    });
  },
  components: {
    XarmModel,
    ComStop,
    EmptyComponent: '<template></template>',
    ComNav,
    DialogError,
  },
  methods: {
    hidePanel() {
      if (this.$route.name !== 'Home') {
        window.GlobalUtil.model.commonStatusMgr.panelIsHidden = true;
      }
    },
    // clickTest() {
    //   console.log('click test click test click test');
    //   this.counter += 1;
    // },
    tabClick() {
      this.componentId = this.componentId === 'XarmModel' ? 'EmptyComponent' : 'XarmModel'
    },
  },
  computed: {
    isConnected() {
      return this.$store.state.robot.status.connected === true;
    },
    stateOnline() {
      return this.$store.state.robot.info.online === true;
    },
//    routeName() {
//      return ['Home', 'Emulator', 'Editor', 'Paint', 'Blockly', 'Teach'].includes(this.$route.name);
//    },
  },
};
</script>

<style scoped lang="scss">
.app-root {
  display: flex;
}

// .app-panel {
//   position: absolute;
//   z-index: 90000;
//   background: black;
//   top: 60px;
//   width: 60px;
//   height: 600px;
//   color: white;
//   .app-home {
//     width: 100%;
//     height: 40px;
//     cursor: pointer;
//   }
//   .app-ctrl {
//     width: 100%;
//     height: 40px;
//     cursor: pointer;
//   }
//   .app-blockly {
//     width: 100%;
//     height: 40px;
//     cursor: pointer;
//   }
//   .app-ide {
//     width: 100%;
//     height: 40px;
//     cursor: pointer;
//   }
//   .app-paint {
//     width: 100%;
//     height: 40px;
//     cursor: pointer;
//   }
//   .app-recording {
//     width: 100%;
//     height: 40px;
//     cursor: pointer;
//   }
//   .app-menu {
//     position: absolute;
//     width: 100%;
//     height: 40px;
//     bottom: 0px;
//     cursor: pointer;
//   }
// }

.app-menu-bg-selected {
  background: gray;
}
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

// input[type=range] {
//   -webkit-user-select:none; /*webkit浏览器*/
// }

</style>
