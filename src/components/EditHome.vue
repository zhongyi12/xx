<template>
  <div class="edit-home-wrapper com-module-wrapper">
    <div class="com-big-header-wrapper com-text-center">
      <router-link :to="{name: 'Home'}"><img class="com-icon-back" src="./../assets/img/common/icon_back.svg" alt="back"/></router-link>
      <span class="com-font-GB-24 com-module-name">{{ $t('editor') }}</span>
      <img class="com-module-icon" src="./../assets/img/edit/edit-home/icon_developers.svg" alt="developers" />
    </div>
    <!-- <button @click="back()">backtoselect</button> -->
    <section class="section1-wrapper com-font-GB-22">
      <div class="box1-wrapper com-text-center">
        <router-link class="com-text-center"  :to="{ name: 'Teach'}">{{ $t('recording') }}</router-link>
        <router-link class="com-text-center" :to="{ name: 'Blockly'}">{{ $t('appEditor') }}</router-link>
        <router-link class="com-text-center"  :to="{ name: 'Editor'}">{{ $t('ide') }}</router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  i18n: {
    messages: {
      en: {
        editor: 'EDITOR',
        recording: 'RECORDING',
        appEditor: 'APP EDITOR',
        ide: 'IDE',
      },
      cn: {
        editor: '编辑器',
        recording: '录制',
        appEditor: '应用编辑器',
        ide: '集成开发环境',
      },
    },
  },
  data() {
    return {
    };
  },
  methods: {
    back() {
      window.location = 'web/index.html';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .edit-home-wrapper {
    .section1-wrapper {
      height: 88%;
      .box1-wrapper {
        width: 100%;
        height: 100%;
        flex-direction: column;
        &>a {
          width: 30%;
          height: 100%;
          margin: 0 auto;
          border-bottom: 1px solid #979797;
          justify-content: center;
          color: #444;
          cursor: pointer;
          transition: all .2s;
          img {
            width: 2.6rem;
            margin-right: 2rem;
          }
        }
        &>a:last-child{
          border-bottom: none;
        }
        a:hover {
          color: #4a90e2;
        }
      }
    }

  }
</style>
