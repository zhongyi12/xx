
<template>
  <div id="root-dialog1" class="noselected">
    <div class="dialog-wrap">
      <div class="dialog-cover" @click="closeMyself"></div>
      <div class="dialog-content" id="dialog-content">
        <div class="position-absolute top-bar">
          <span class="top-title">{{ title }}</span>
          <div class="position-absolute dialog-close" @click="closeMyself">
          </div>
        </div>
        <span v-if="showSelected===true">
          <!-- 暂时不要waypoint -->
          <!-- <div class="position-absolute point-selected-bg" v-bind:class="classObject1" style="left:110px;" @click="typeSelect('1')">
            Waypoint
            <div class="position-absolute waypoint-icon">
            </div>
          </div> -->
          <!-- right:110px; cursor-pointer -->
          <div class="position-absolute point-selected-bg" v-bind:class="classObject2" style="left:0;right:0;margin:auto;" @click="typeSelect('2')">
            {{$t('singlePoint')}}
            <div class="position-absolute single-icon">
            </div>
          </div>
        </span>
        <input
          @keyup.enter="onOkClick"
          id="teach-input-text"
          v-model="model.localTeach.curDialogProjInputText"
          type="text" class="position-absolute dialog-input input-focus"
          :placeholder="$t('placeholderName')"/>
        <div class="position-absolute dialog-error"> {{ model.localTeach.dialogErrorTips }} </div>
        <span v-if="isFileNameCorrect">
          <div class="position-absolute btn-create cursor-pointer" @click="onOkClick">
            {{$t('ok')}}
          </div>
        </span>
        <span v-else>
          <div class="position-absolute btn-create-opacity">
            {{$t('ok')}}
          </div>
        </span>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  props: ['width', 'height', 'title', 'title_type', 'show_selected', 'input_top', 'onok'],
    i18n: {
    messages: {
      en: {
       singlePoint: 'Single Point',
       ok: 'OK',
       placeholderName: 'Please enter project name',
      },
      cn: {
        singlePoint: '单点',
        ok: '确定',
        placeholderName: '请输入项目名',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      showSelected: true,
    }
  },
  mounted() {
    const dialogContent = document.getElementById('dialog-content');
    const inputText = document.getElementById('teach-input-text');
    if (this.width !== undefined) {
      dialogContent.style.width = `${this.width}px`;
    }
    if (this.height !== undefined) {
      dialogContent.style.height = `${this.height}px`;
    }
    if (this.input_top !== undefined) {
      inputText.style.top = `${this.input_top}px`;
    }
    this.showSelected = true;
    if (this.show_selected === false || this.show_selected === 'false') {
      this.showSelected = false;
    }
    console.log(`dialogContent width = ${this.width}, height = ${this.height}`);
    window.GlobalUtil.setInputFocus();
  },
  methods: {
    onOkClick() {
      if (!this.isFileNameCorrect) {
        return;
      }
      this.onok();
    },
    typeSelect(type) {
      window.GlobalUtil.model.localTeach.projTypeSelected = type;
    },
    closeMyself() {
      window.GlobalUtil.model.localTeach.projTypeSelectedShow = false;
      window.GlobalUtil.model.localTeach.projRenameShow = false;
    },
  },
  components: {
  },
  computed: {
    isFileNameCorrect() {
      const text = this.model.localTeach.curDialogProjInputText;
      if (text === null || text === '') {
        window.GlobalUtil.model.localTeach.dialogErrorTips = '';
        return false;
      }
      const checkStrIsLegal = this.model.utilModel.checkStrIsLegal(text, true, true);
      console.log(`check Str Is Legal = ${checkStrIsLegal}`);
      if (checkStrIsLegal !== true) {
        this.model.localTeach.dialogErrorTips = checkStrIsLegal;
        return false;
      }
      if (this.title_type === 'file') {
        return this.model.localTeach.isHasFile(text);
      }
      const isHasProj = this.model.localTeach.isHasProj(text);
      if (!isHasProj) {
        return false;
      }
      const isFileStr = window.GlobalUtil.isFileStr(text);
      if (isFileStr === false) {
        return false;
      }
      return isFileStr && isHasProj;
    },
    classObject1: () => ({
      'point-selected-selected0': window.GlobalUtil.model.localTeach.projTypeSelected !== '1',
      'point-selected-selected1': window.GlobalUtil.model.localTeach.projTypeSelected === '1',
    }),
    classObject2: () => ({
      'point-selected-selected0': window.GlobalUtil.model.localTeach.projTypeSelected === '1',
      'point-selected-selected1': window.GlobalUtil.model.localTeach.projTypeSelected !== '1',
    }),
  },
}
</script>

<style scoped>
.top-title {
  position: absolute;
  left: 25px;
  top: 30px;
  font-family: 'Gotham-Medium';
  font-size: 14px;
  color: #FFFFFF;
  letter-spacing: -0.78px;
}
.dialog-content {
  width: 580px;
  height: 400px;
  position: fixed;
  top: 20%;
  left: 0px;
  right: 0px;
  margin-left:auto;
  margin-right:auto;
  z-index: 10;
  background: white;
  overflow: hidden;
}
.top-bar {
  background: black;
  width: 100%;
  height: 68px;
}
.dialog-close {
  top: 15px;
  right: 0px;
  width: 40px;
  height: 40px;
  color: white;
  text-align:center;
  line-height: 40px;
  cursor: pointer;
  background-image: url('./../../assets/img/edit/recording/icon_close.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 16px 16px;
}
.dialog-input {
  width:350px;
  height:40px;
  top:285px;
  /* left:118px; */
  left: 0px;
  right: 0px;
  margin: auto;
  padding-left: 15px;
  border: 1px solid #575C62;
  outline:none;
}
.dialog-error {
  left: 25px;
  /* top:335px; */
  bottom: 50px;
  width: 400px;
  font-family: 'Gotham-Book';
  font-size: 9px;
  color: #b2180e;
  letter-spacing: -0.56px;
}
.point-selected-bg {
  background: #ECECEC;
  width: 130px;
  height: 130px;
  top: 110px;
  font-family: Gotham-Medium;
  font-size: 14px;
  color: #444444;
  letter-spacing: -0.78px;
  padding-top: 75px;
  text-align: center;
}
.waypoint-icon {
  top: 48px;
  left: 0px;
  right: 0px;
  margin: auto;
  width: 16px;
  height: 16px;
  background-image: url('./../../assets/img/edit/recording/icon_waypoint_16x16.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 16px 16px;
}
.single-icon {
  top: 48px;
  left: 0px;
  right: 0px;
  margin: auto;
  width: 16px;
  height: 16px;
  background-image: url('./../../assets/img/edit/recording/icon_singlepoint_16x16.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 16px 16px;
}
.point-selected-selected1 {
  border: 2px solid #5A93D7;
}
.point-selected-selected0 {
  border: 0px;
}
.btn-create-opacity {
  width: 100%;
  height: 40px;
  bottom: 0px;
  text-align: center;
  font-family: 'Gotham-Book';
  font-size: 14px;
  color: #BABABA;
  letter-spacing: -0.78px;
  line-height: 40px;
  background: #ECECEC;
}
.btn-create {
  width: 100%;
  height: 40px;
  bottom: 0px;
  background: #52BF53;
  text-align: center;
  font-family: 'Gotham-Book';
  font-size: 14px;
  color: #FFFFFF;
  letter-spacing: -0.78px;
  line-height: 40px;
}
input::-webkit-input-placeholder{ /*WebKit browsers*/
  font-family: Gotham-Book;
  font-size: 12px;
  color: #D4D4D4;
  letter-spacing: -0.5px;
  text-align: center;
}
input::-moz-input-placeholder{ /*Mozilla Firefox*/
  font-family: Gotham-Book;
  font-size: 12px;
  color: #D4D4D4;
  letter-spacing: -0.5px;
  text-align: center;
}
input::-ms-input-placeholder{ /*Internet Explorer*/ 
  font-family: Gotham-Book;
  font-size: 12px;
  color: #D4D4D4;
  letter-spacing: -0.5px;
  text-align: center;
}
</style>
