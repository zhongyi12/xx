<template lang="html">
  <div class="list-project-wrapper" v-if="isShowList === true">
    <ProCellSetting :cancelEdit="cancelEdit" ></ProCellSetting>
    <!-- <div class="scroll-container" :style="{width: listWidth}" v-if="model.localTeach.getFileInfo(model.localTeach.curEditingFileUUID)!==null || model.localTeach.curEditingFileUUID===''"> -->
      <div class="block-cell"  @scroll="checkscroll()">
        <!-- <div v-if="model.localTeach.curProj.type==='continuous'" style="width:40px;">
        </div> -->
        <!-- width: + (index === visableList.length - 1 ?  model.localTeach.pointCellsWidth * 2 : model.localTeach.pointCellsWidth) + 'px', -->
        <div v-if="model.localTeach.projectListShow" class="cell-wrapper" v-for='index in visableList' :style="{
          top: (scrollTop + (index - firstCellInView) * model.localTeach.pointCellsWidth) + 'px'
        }">
          <ListProjCell :index='index' :file='model.localTeach.getFileInfo(model.localTeach.curEditingFileUUID)'></ListProjCell>
        </div>
        <!-- this.model.localTeach.showArr.length -->
        <div :style="{
          position: 'absolute',
          background: 'transparent',
          width: '100px',
          height: '80px',
          top: (scrollTop + (visableList.length - firstCellInView) * model.localTeach.pointCellsWidth) + 'px',
        }">
        </div>
        <div class="triangle-up"
          :style="{
            top: (30+scrollTop + (model.localTeach.curSelectedIndex - firstCellInView) * model.localTeach.pointCellsWidth) + 'px',
            'z-index': 3000,
          }"
          v-if="model.localTeach.curSelectedIndex >= 0"
        >
        </div>
      </div>
    <!-- </div> -->
    <!-- scroll timer end -->
  </div>
</template>
<script>

import ListProjCell from './ListProjCell';
import ProCellSetting from './ProCellSetting';

export default {
  props: ['cancelEdit'],
  data() {
    return {
      model: window.GlobalUtil.model,
      firstCellInView: 0,
      scrollLeft: 0,
      scrollTop: 0,
      zIndexTotal: 2000,
    };
  },
  mounted() {
  },
  methods: {
    // test_get_pos() {
    //   window.GlobalUtil.model.localTeach.genAndPushTestPoints();
    // },
    // onClick(e, uuid) {
    //   const attr = e.currentTarget.value;
    //   console.log(`attr = ${attr}, uuid = ${uuid}`);
    //   // const file = window.GlobalUtil.model.localTeach.getTeachFileInfo(window.GlobalUtil.model.localTeach.curProj, uuid);
    // },
    onclickbackground() {
      console.log(`test cancel onclickbackground = ${this.model.localTeach.isClickingCell}`);
      if (this.model.localTeach.isClickingCell === false) {
        this.cancelEdit();
      }
    },
    checkscroll() {
      this.scrollLeft = document.getElementById('bottom-right-frame').scrollLeft - 0;  // visiable padding left
      console.log(`check scroll = ${this.scrollLeft}, index = ${parseInt(this.scrollLeft / this.model.localTeach.pointCellsWidth)}`);
      this.firstCellInView = this.scrollTop / this.model.localTeach.pointCellsWidth;

      this.scrollTop = document.getElementById('bottom-right-frame').scrollTop - 0;
    },
    // onSelect(e, index) {
    //   window.GlobalUtil.model.localTeach.onSelect(e, index);
    // },
  },
  beforeDestroy() {
  },
  components: {
    ListProjCell,
    ProCellSetting,
    // EditPoints,
    // EditSpeed,
  },
  computed: {
    // classObject: () => ({
    //   'bgcolor0': !window.GlobalUtil.model.localProjTree.hasOpenFileInCurPro,
    //   'bgcolor1': window.GlobalUtil.model.localProjTree.hasOpenFileInCurPro,
    // }),
    isShowList() {
      return (this.model.localTeach.getFileInfo(this.model.localTeach.curEditingFileUUID) !== null || this.model.localTeach.curEditingFileUUID === '') && this.model.localTeach.curSelectedTreeItem.uuid !== '';
    },
    listWidth() {
      return `${this.model.localTeach.showArr.length * 80}px`
    },
    visableList() {
      if (this.model.localTeach.showArr) {
        return this.model.localTeach.showArr.slice(this.firstCellInView, this.firstCellInView + this.visableCount)
      }
      return []
    },
    visableCount() {
      const clientWidth = document.body.clientWidth;
      // return Number(clientWidth) / this.model.localTeach.pointCellsWidth + 1;
      return Number(clientWidth) / (this.model.localTeach.pointCellsWidth + 0.0) + 1;
    },
    isShowPointEdit() {
      return (this.model.localTeach.editState === true && this.model.localTeach.curSelectedIndex >= 0) || (this.model.localTeach.showArr.length === 0 && this.model.localTeach.curSelectedTreeItem.type === 'file') && this.model.localTeach.isTeachRunningUUID === '';
    },
  },
};

</script>
<style lang="scss" scoped>
.list-project-wrapper {
  position: absolute;
  // width: 70%;
  // overflow-x: auto;
  overflow-x: hidden;
  overflow-y: hidden;
  // background: rgba(230,231,232,1);
  height: 100px;
  // background: #434343;
  // display: flex;
  // justify-content: flex-start;
  // height: 40px;
  // background: yellow;
  // .scroll-container {
  //   position: absolute;
  //   background: yellow;
  //   width: 100px;
  //   height: 100px;
  //   top: -60px;

  .block-cell {
    // display:flex;
    // justify-content: flex-start;
    // align-items: center;
    // font-size: 5px;
    // position: relative;
    position: absolute;
    height: 86%;
    width: 300px;
    overflow-y: auto;
    top: 72px;
    .cell-wrapper {
      position: absolute;
    }
    .cell-selected {
      position: absolute;
      width: 2px;
      height: 50px;
      top: 0px;
      left: 10px;
      background: red;
    }
    .triangle-up {
      position: absolute;
      width: 10px;
      height: 10px;
      left: 30px;
      background: #ecf5ff;
      border-radius: 50%;
      // top: 45px;
      z-index: 0 !important;
      // border-left: 5px solid transparent;
      // border-right: 5px solid transparent;
      // border-bottom: 10px solid rgb(244, 189, 103);
      // border: 1px solid #DCDCDC;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 10px 9px;
      // background-image: url('./../../assets/img/edit/recording/triangle_up.svg');
    }
    // .cell-last-padding {
    //   position:absolute;
    //   width:100px;
    //   height:20px;
    //   background:yellow;
    // }
    // text-align: center;
  }
  // }
  // height: 250px;
  // align-items: center;
}
.block-cell::-webkit-scrollbar {/*滚动条整体样式*/
  width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 12px;
}
.block-cell::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 6px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #7E7E7E;
}
.block-cell::-webkit-scrollbar-track {/*滚动条里面轨道*/
  box-shadow: inset 0 0 5px transparent;
  border-radius: 0;
  // background: #434343;
  background: rgba(230,231,232,1);
  // background: yellow;
}

</style>
