<template>
  <div class="appStore-wrapper com-module-wrapper">
    <div class="com-big-header-wrapper com-text-center">
      <router-link :to="{name: 'Home'}"><img class="com-icon-back" src="./../assets/img/common/icon_back.svg"/></router-link>
      <span class="com-font-GB-24 com-module-name">{{ $t('appStore') }}</span>
      <img class="com-module-icon" src="./../assets/img/appStore/shopping_bag.svg" />
    </div>
    <section class="section1-wrapper com-font-GM-20">
      <div v-if="$i18n.locale === 'en'" class="tab-wrapper">
        <div class="tab" v-for="(item, index) in tabEN" @click="showTabContain(index)">
          <span class="tab-text" :class="{'active':model.localAppsMgr.showApp === index}">{{ item }}</span>
        </div>
      </div>
      <div v-else class="tab-wrapper">
        <div class="tab" v-for="(item, index) in tabCN" @click="showTabContain(index)">
          <span class="tab-text" :class="{'active':model.localAppsMgr.showApp === index}">{{ item }}</span>
        </div>
      </div>
      <div class="tab-contain-wrapper" v-if="model.localAppsMgr.showApp === 'allApp'">
        <div class="tab-contain" style="height:600px;" v-for="(item,index) in tabContain" :key="index">
          <!-- Default App -->
          <DefaultApp></DefaultApp>
        </div>
        <!-- <div class="tab-contain" style="height:600px;padding-top:40px;font-size: 1.4rem;">
          Third-Party
          <third-party></third-party>
        </div>
        <div class="tab-contain" style="height:600px;padding-top:40px;font-size: 1.4rem;">
          My App
          <my-app></my-app>
        </div> -->
      </div>
      <div class="tab-contain-wrapper" v-else-if="model.localAppsMgr.showApp === 'thirdParty'">
        <third-party></third-party>
      </div>
      <div class="tab-contain-wrapper" v-else="model.localAppsMgr.showApp === 'myApp'">
        <my-app></my-app>
      </div>
    </section>
  </div>
</template>

<script>
import MyApp from './appStore/MyApp';
import ThirdParty from './appStore/ThirdParty';
import DefaultApp from './appStore/DefaultApp';

// import { setTimeout } from 'timers';
export default {
  i18n: {
    messages: {
      en: {
        appStore: 'APP STORE',
      },
      cn: {
        appStore: '应用商店',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      // showApp: 'allApp',
      tabEN: {
        allApp: 'Default App',
        thirdParty: 'Third-Party',
        myApp: 'My App',
      },
      tabCN: {
        allApp: '官方应用',
        thirdParty: '第三方应用',
        myApp: '我的应用',
      },
      shoppingBag: require('@/assets/img/appStore/shopping_bag.svg'),
      tabContain: {
        1: {
          1: {
            img: require('@/assets/img/appStore/shopping_bag.svg'),
            name: 'uStudio',
          },
        },
      },
    };
  },
  mounted() {
    this.afterActivated();
  },
  methods: {
    showTabContain(item) {
      this.model.localAppsMgr.showApp = item;
    },
    afterActivated() {
      window.CommandsAppsSocket.listApps((dict) => {
        console.log(dict);
      });
      window.CommandsAppsSocket.listLocalApps((dict) => {
        console.log(dict);
      });
    },
  },
  activated: function() {
    this.afterActivated();
  },
  components: {
    MyApp,
    ThirdParty,
    DefaultApp,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .appStore-wrapper {
    height: 100%;
    overflow-y: hidden;
    .section1-wrapper {
      height: 90%;
      margin: 0 auto;
      display: flex;
      .tab-wrapper {
        display: flex;
        flex-direction: column;
        height: 600px;
        /*padding-top: 80px;*/
        // width: 20%;
        width: 210px;
        // padding-left: 5%;
        padding-left: 80px;
        .tab {
          height: 30%;
          cursor: pointer;
          font-size: 20px;
          text-align: center;
          display: flex;
          align-items: center;
          .active {
            padding-bottom: 5px;
            border-bottom: 2px solid #E27347;
          }
        }
      }
      .tab-contain-wrapper {
        display: flex;
        flex-direction: column;
        // padding-top: 5rem;
        padding-top: 65px;
        width: 80%;
        height: 100%;
        overflow-y: auto;
        padding-bottom: 3rem;
        position: relative;
      }
    }
  }

  /**common css(AppStore MyApp ThirdParty)**/
  .appStore-wrapper .tab-contain {
    height: 100%;
  }
</style>
