
<template>
  <div id="root-list" class="noselected">
    <div class="dialog-wrap">
      <div class="dialog-cover" @click="onclose"></div>
      <div class="dialog-content">
        <div class="dialog-top">
          <span class="top-title">
            {{ $t('title') }}
          </span>
          <div class="dialog-close" @click="onclose">
          </div>
        </div>
        <div style="height:220px;width:100%;overflow-y:scroll;">
          <table>
            <th width="5" class="table-head"></th>
            <th width="120" class="table-head">{{ $t('projectName') }}</th>
            <th width="180" class="table-head">{{ $t('date') }}</th>
            <th width="100" class="table-head">{{ $t('type') }}</th>
            <th width="100" class="table-head">{{ $t('done') }}</th>
            <template v-for='(data, index) in model.localPaintMgr.projList'>
              <tr @click="selectRow(index)" :style="{background: currentRow === index ? '#A5A7A9' : 'transparent', color: currentRow === index ? 'white' : 'black'}">
                <td>
                  <!-- <div style="position:absolute;width:150px;height:30px;background:yellow;">
                  </div> -->
                  <div class="proj-selected"
                    v-if="model.localPaintMgr.curProj===model.localPaintMgr.projList[index]" @dblclick="onopen(index)">
                  </div>
                </td>
                <td>
                  <div class="table-td" @dblclick="onopen(index)">
                    {{ model.localPaintMgr.projList[index].name }}
                  </div>
                </td>
                <td>
                  <div class="table-td" @dblclick="onopen(index)">
                    {{ model.localPaintMgr.projList[index].created }}
                  </div>
                </td>
                <td>
                  <div class="table-td" @dblclick="onopen(index)">
                    {{ model.localPaintMgr.projList[index].projType }}
                  </div>
                </td>
                <td>
                  <div class="proj-icon-trash float-left" @click="onDelete(index)"></div>
                </td>
              </tr>
            </template>
          </table>
        </div>
        <!-- @current-change="handleCurrentChange" -->
        <!-- <el-table
          id="proj-id"
          height="223"
          ref='singleTable'
          :data="model.localPaintMgr.projList"
          highlight-current-row
          @current-change="handleCurrentChange"
          @cell-mouse-enter="cellMouse"
          @cell-mouse-leave="cellMouse"
          :row-class-name="tableRowClassName"
          style="width:100%;border:0;">
          <el-table-column
            style=""
            prop="name"
            :label="$t('projectName')"
            width="150">
            <template slot-scope="scope">
              <div class="proj-selected"
                v-if="model.localPaintMgr.curProj===model.localPaintMgr.projList[scope.$index]" @dblclick="onopen(currentRow)">
              </div>
              <div class="table-td" @dblclick="onopen(currentRow)">
                {{ model.localPaintMgr.projList[scope.$index].name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="created"
            :label="$t('date')"
            width="180">
            <template slot-scope="scope">
              <div class="table-td" @dblclick="onopen(currentRow)">
                {{ model.localPaintMgr.projList[scope.$index].created }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            :label="$t('type')"
            width="150">
            <template slot-scope="scope">
              <div class="table-td" @dblclick="onopen(currentRow)">
                {{ model.localPaintMgr.projList[scope.$index].projType }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            :label="$t('done')">
            <template slot-scope="scope">
              <div class="proj-icon-trash float-left" @click="onDelete(scope.$index)"></div>
            </template>
          </el-table-column>
        </el-table> -->

        <div v-if="isSelectedApp" class="btn-ok cursor-pointer" @click="onopen(currentRow)">
          {{ $t('open') }}
        </div>
        <div v-else class="btn-ok" style="background:#ECECEC;color: #BABABA;">
          {{ $t('open') }}
        </div>
      </div>
    </div>
  </div>

</template>
<script>

export default {
  props: ['onopen', 'onclose'],
  i18n: {
    messages: {
      en: {
        title: 'Select a Project',
        projectName: 'Project name',
        date: 'Date',
        type: 'Type',
        done: 'Done',
        open: 'Open',
      },
      cn: {
        title: '选择一个项目',
        projectName: '项目名',
        date: '时间',
        type: '类型',
        done: '操作',
        open: '打开',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      currentRow: -1,
    };
  },
  mounted() {
    setTimeout(() => {
      // const html = document.getElementById('proj-id').innerHTML;
      // console.log(`html = ${html}`);
      // const trs = document.getElementsByTag("tr"); // .onmouseover = null;
      // for (let i = 0; i < trs.length; i += 1) {
      //   const tr = trs[i];
      //   tr.onmouseover = null;
      // }
    });
  },
  computed: {
    isSelectedApp() {
      return this.currentRow >= 0;
    },
  },
  methods: {
    test(index) {
      console.log('test:', index);
    },
    onDelete(index) {
      const curProj = this.model.localPaintMgr.projList[index];
      this.model.localPaintMgr.curToDelProj = curProj;
      this.model.localPaintMgr.curToDelProjTitle = `Delete project ${curProj.name} ?`;
      this.model.localPaintMgr.visible.del = true;
    },
    tableRowClassName({ row, rowIndex }) {
      // console.log(`row = ${row}, rowIndex = ${rowIndex}`);
      return rowIndex === this.currentRow ? 'selected' : 'normal';
    },
    // setCurrent(row) {
    //   this.$refs.singleTable.setCurrentRow(row);
    // },
    handleCurrentChange(val) {
      if (val !== null && val !== undefined) {
        this.currentRow = val;
        this.currentRow = val.index;
        console.log(`set Current this.currentRow = ${this.currentRow}`);
        // this.model.localPaintMgr.curProj = val;
      }
    },
    selectRow(index) {
      console.log(`set selectRow = ${index}`);
      this.currentRow = index;
    },
    cellMouse(row, column, cell, event) {
      console.log(`row = ${row}, column = ${column}, cell = ${cell}, event = ${event}`)
      cell.style.backgroundColor = '';
    },
  },
}
</script>

<style lang="scss" scoped>
// .head-text {
//   color: blue;
// }
.dialog-top {
  width: 100%;
  height: 67px;
  background: #484848;
}
.dialog-close {
  position: absolute;
  right: 10px;
  top: 25px;
  width: 20px;
  height: 20px;
  text-align: center;
  cursor: pointer;
  background-position: center;
  background-image: url('./../../assets/img/pop/icon_close.svg');
  background-size: 10px 11px;
  background-repeat: no-repeat;
}
.top-title {
  position: absolute;
  left: 24px;
  top: 30px;
  font-family: 'Gotham-Medium';
  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: -1px;
}
.dialog-content {
  width: 580px;
  height: 330px;
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
.btn-ok {
  position: absolute;
  width: 100%;
  height: 40px;
  bottom: 0px;
  background: #52BF53;
  text-align: center;
  letter-spacing: -0.88px;
  line-height: 40px;
  font-family: 'Gotham-Book';
  font-size: 12px;
  color: #FFFFFF;
  letter-spacing: -0.5px;
  /* cursor: pointer; */
}
// .table-td1{
//   font-family: 'Gotham-Book';
//   font-size: 12px;
//   // color: #3C3C3C;
//   letter-spacing: -0.38px;
//   text-align: center;
// }

// table {
//   width: 600px;
//   height: 100px;
//   overflow-y: hidden;
// }
table td {
  font-family: 'Gotham-Book';
  font-size: 12px;
  color: #3C3C3C;
  letter-spacing: -0.38px;
  text-align: center;
  height: 40px;
  margin: 0px;
  padding: 0px;
  /* background: yellow; */
  cursor: pointer;
  border: 0;
}
table th {
  font-family: 'Gotham-Medium';
  font-size: 13px;
  color: #3C3C3C;
  letter-spacing: -1px;
  text-align: center;
  /* height: 20px; */
}
table .normal {
  background: white;
}
table .normal .table-td {
  color: #3C3C3C;
}
table .selected {
  background: #A5A7A9;
}
table .selected:hover {
  background: #A5A7A9;
}
table .selected .table-td {
  color: white;
}
table-head {
  font-family: 'Gotham-Medium';
  font-size: 12px;
  color: #3C3C3C;
  letter-spacing: -1px;
  text-align: center;
}
.proj-icon-trash {
  margin-left: 20px;
  width: 30px;
  height: 30px;
  background-image: url('./../../assets/img/pop/btn_trash.svg');
  background-size: 8px 10px;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}
.proj-selected {
  // position: absolute;
  width: 10px;
  height: 10px;
  // top: 10px;
  margin-top: 5px;
  margin-left: 30px;
  background-image: url('./../../assets/img/pop/icon_select.svg');
  background-size: 10px 10px;
  background-repeat: no-repeat;
  background-position: center;
  clear: both;
}
</style>
