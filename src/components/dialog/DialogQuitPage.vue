
<template>
  <div id="root-delete" class="noselected">
    <div class="dialog-wrap">
      <div class="dialog-cover" @click="closeMyself"></div>
      <div class="dialog-content">
        <span class="top-title">{{ $t('quitTip') }}</span>
        <div style="margin-top:156px;">
          <div class="float-left btn-cancel" @click="onunsave">
            {{ $t('cancel') }}
          </div>
          <div class="float-left btn-delete cursor-pointer" @click="onsave">
            {{ $t('save') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// const path = require('path')
export default {
  props: ['onunsave', 'onsave'],
  i18n: {
    messages: {
      en: {
        quitTip: 'Are you quit without save or save ?',
        cancel: 'Quit without save',
        save: 'Quit and save',
      },
      cn: {
        quitTip: '不保存文件直接退出吗？',
        cancel: '退出',
        save: '保存',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
    }
  },
  methods: {
    closeMyself() {
      this.model.commonStatusMgr.quitPageShow = false;
    },
  },
  components: {
  },
  mounted() {
    // const div = document.getElementById('root-delete');
    // div.addEventListener('keydown', 'GlobalUtil.model.localProjTree.show');
  },
  computed: {
  },
}
</script>

<style scoped>
.top-title {
  position: absolute;
  width: 300px;
  /* left: 130px; */
  top: 70px;
  /* background: yellow; */
  text-align: center;
  /* text-align: center; */
  /* height: 67px; */
  font-family: 'Gotham-Medium';
  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: -1px;
  left: 0px;
  right: 0px;
  margin-left:auto;
  margin-right:auto;
  /* background-color: yellow; */
  /* line-height: 16px; */
}
.dialog-content {
  width: 356px;
  position: fixed;
  height: 196px;
  top: 20%;
  left: 0px;
  right: 0px;
  margin-left:auto;
  margin-right:auto;
  z-index: 10;
  background: #303030;
  overflow: hidden;
  /* text-align: center; */
}
.dialog-close:hover {
  color: #4fc08d;
}
.dialog-add {
  width: 100%;
  height: 100px;
  /* background-color: yellow; */
}
.btn-cancel {
  width: 178px;
  height: 40px;
  /* margin-top: 230px; */
  /* background-color: yellow; */
  background: #484848;
  text-align: center;
  font-family: 'Gotham-Book';
  font-size: 14px;
  color: #7B7B7B;
  letter-spacing: -0.88px;
  line-height: 40px;
  cursor: pointer;
}
.btn-delete {
  width: 178px;
  height: 40px;
  /* margin-top: 230px; */
  /* margin-left: 178px; */
  /* background-color: green; */
  background: #E24D4A;
  text-align: center;
  font-family: 'Gotham-Book';
  font-size: 14px;
  color: #FFFFFF;
  letter-spacing: -0.88px;
  line-height: 40px;
  /* cursor: pointer; */
}
</style>
