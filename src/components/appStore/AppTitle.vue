<template>
  <div>
    <input id="app-title-text-id" class="app-title-text input-focus" v-model="titleEditingStr" type="text" v-if="titleEditing===true" @keydown="onEnter()" @blur="onblur()" />
    <div v-else class="app-title" @dblclick="chanegEdit()">{{ data.label }}</div>

    <DialogAlert
      :title='alertTitle'
      subtitle=''
      :onok='onok'
      v-if="errorAlert===true">
    </DialogAlert>
  </div>
</template>

<script>

import DialogAlert from './../dialog/DialogAlert';

export default {
  props: ['data'],
  i18n: {
    messages: {
      en: {
        successTitle: 'Rename success',
        failTitle1: 'Rename fails',
        failTitle2: 'New name is not correct',
      },
      cn: {
        successTitle: '重命名成功',
        failTitle1: '重命名失败',
        failTitle2: '新名称不正确',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      titleEditing: false,
      titleEditingStr: '',
      errorAlert: false,
      alertTitle: '',
      dataName: '',
    };
  },
  mounted() {
    this.titleEditingStr = this.data.name;
    this.dataName = this.data.name;
    if (!this.titleEditingStr) {
      this.titleEditingStr = this.data.label;
      this.dataName = this.data.label;
    }
  },
  methods: {
    chanegEdit() {
      if (this.data.category === 'myapp' && this.titleEditing === false) {
        this.titleEditing = !this.titleEditing;
        this.titleEditingStr = this.data.name;
        if (!this.titleEditingStr) {
          this.titleEditingStr = this.data.label;
        }
        setTimeout(() => {
          window.GlobalUtil.setInputFocus();
        });
        // setTimeout(() => {
          // document.getElementById('app-title-text-id').focus();
        // });
      }
    },
    onEnter() {
      const e = window.event;
      if (e.keyCode === 13) {
        this.onblur();
      }
    },
    onblur() {
      this.titleEditing = false;
      const checkFileNamePass = window.GlobalUtil.checkFileName(this.titleEditingStr);
      if (!checkFileNamePass) {
        this.$message({
          message: this.$t('failTitle2'),
          duration: 1500,
        })
        this.titleEditingStr = this.dataName;
        // setTimeout(() => {
        //   this.alertTitle = this.$t('failTitle2');
        //   this.errorAlert = true;
        // }, 50);
        return;
      }
      if (this.dataName !== this.titleEditingStr) {
        window.CommandsAppsSocket.renameFile(this.dataName, this.titleEditingStr, (dict) => {
          if (dict.code !== 0) {
            this.$message({
              message: this.$t('failTitle1'),
              duration: 1500,
            })
            this.titleEditingStr = this.dataName;
            // setTimeout(() => {
            //   this.alertTitle = this.$t('failTitle1');
            //   this.errorAlert = true;
            // }, 50);
          }
          else {
            this.$message({
              message: this.$t('successTitle'),
              duration: 1500,
            })
            // setTimeout(() => {
            //   this.alertTitle = this.$t('successTitle');
            //   this.errorAlert = true;
            // }, 50);
          }
        });
      }
    },
    onok() {
      this.errorAlert = false;
      this.titleEditing = false;
    },
  },
  components: {
    DialogAlert,
  },
};
</script>

<style scoped lang="scss">
.app-title {

  font-size: 14px;
  width: 150px;
  text-align: left;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  /*height: 40px;*/
  /*line-height: 40px;*/
  // padding-top: 5px;
}
.app-title-text {

  font-size: 14px;
  color: #4A4A4A;
  height: 25px;
  width: 150px;
  outline: none;
  border: 1px solid #d9d9d9;
}
</style>
