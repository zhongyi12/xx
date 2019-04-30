<template>
  <div class="">

    <div class="icon-btn" @click='onundo' v-bind:class="undoOpacity">
      <div class="size undo" alt="Undo">
        <div class="icon-text">{{ $t('undo') }}</div>
      </div>
    </div>

    <div class="icon-btn" @click="onredo" v-bind:class="redoOpacity">
      <div class="size redo" alt="Redo">
        <div class="icon-text">{{ $t('redo') }}</div>
      </div>
    </div>

    <div class="icon-btn" @click="ontext">
      <div class="size text" alt="Text">
        <div class="icon-text">{{ $t('text') }}</div>
      </div>
    </div>

    <div class="icon-btn" @click="onimage">
      <div class="size image" alt="Image">
        <div class="icon-text">{{ $t('image') }}</div>
      </div>
    </div>

    <div class="icon-btn" @click="oncopy">
      <div class="size copy" alt="Copy">
        <div class="icon-text">{{ $t('copy') }}</div>
      </div>
    </div>

    <div class="icon-btn" @click="onadd">
      <div class="size add" alt="Add">
        <div class="icon-text">{{ $t('add') }}</div>
      </div>
    </div>

    <div class="icon-btn" @click="ondelete">
      <div class="size delete" alt="Delete">
        <div class="icon-text">{{ $t('delete') }}</div>
      </div>
    </div>

    <div class="icon-btn" @click="onremoveall">
      <div class="size clear" alt="Clear">
        <div class="icon-text">{{ $t('clear') }}</div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  props: ['onimage', 'onadd', 'ontext', 'ondelete', 'oncopy', 'onundo', 'onredo', 'onremoveall'],
  i18n: {
    messages: {
      en: {
        undo: 'Undo',
        redo: 'Redo',
        text: 'Text',
        image: 'Image',
        copy: 'Copy',
        add: 'Add',
        delete: 'Delete',
        clear: 'Clear',
      },
      cn: {
        undo: '撤消',
        redo: '恢复',
        text: '文字',
        image: '图片',
        copy: '复制',
        add: '增加',
        delete: '删除',
        clear: '清除',
      },
    },
  },
  name: 'bottom-tools',
  data() {
    return {
      model: window.GlobalUtil.model,
    };
  },
  mounted() {
  },
  activated: function() {
  },
  methods: {
    // onremoveall() {
    //   console.log('onremoveall onremoveall onremoveall');
    // },
  },
  beforeDestroy() {
  },
  watch: {
  },
  computed: {
    redoOpacity: () => ({
      opacity0: window.GlobalUtil.model.localPaintMgr.state.backStep === 0,
    }),
    undoOpacity: () => ({
      opacity0: window.GlobalUtil.model.localPaintMgr.state.buffer.length - window.GlobalUtil.model.localPaintMgr.state.backStep <= 1,
    }),
  },
  components: {
  },
};
</script>
<style scoped lang="scss">

.opacity0 {
  opacity: 0.4;
}

.icon-btn {
  border: 0;
  // background: yellow;
  width: 45px;
  height: 100%;
  margin-left: 28px;
  float: left;
  cursor: pointer;
  .size {
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: top;
    background-size: 15px 15px;
  }
  .icon-text {
    position: absolute;
    color: white;
    bottom: 10px;
    padding-left: 12px;
    font-family: 'Gotham-Book';
    font-size: 10px;
    color: #787878;
    letter-spacing: -0.8px;
    // text-align: center;
  }
  .undo {
    margin-top: 15px;
    background-image: url('./../../assets/img/paint/tool-undo.svg');
  }
  .redo {
    margin-top: 15px;
    background-image: url('./../../assets/img/paint/tool-redo.svg');
  }
  .text {
    margin-top: 15px;
    background-image: url('./../../assets/img/paint/tool-text.svg');
  }
  .image {
    margin-top: 15px;
    background-image: url('./../../assets/img/paint/tool-image.svg');
  }
  .copy {
    margin-top: 15px;
    background-image: url('./../../assets/img/paint/tool-copy.svg');
  }
  .add {
    margin-top: 15px;
    background-image: url('./../../assets/img/paint/icon_addsticker.svg');
  }
  .delete {
    margin-top: 15px;
    background-image: url('./../../assets/img/paint/tool-delete.svg');
  }
  .clear {
    margin-top: 15px;
    background-image: url('./../../assets/img/paint/tool-clear.svg');
  }
}

</style>
