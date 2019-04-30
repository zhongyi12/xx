
<template>
  <div id="root-list" class="noselected">
    <div class="dialog-wrap">
      <div class="dialog-cover" @click="onclose"></div>
      <div class="dialog-content">
        <div class="dialog-top">
          <span class="top-title">
            {{ $t('title') }}
          </span>
          <!-- add-start -->
          <el-dropdown split-button type="text" size="small" trigger="click" style="left: 150px;top: 20px;">
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-upload
                  multiple
                  class="paint-uploader"
                  :data="{path: `${constant.COMMON_PARAMS.userId}/${constant.COMMON_PARAMS.version}/paint`}"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="handleUploadSuccess"
                  :before-upload="beforeUpload">
                  <i class="el-icon-upload2"></i>
                  {{ $t('import') }}
                </el-upload>
              </el-dropdown-item>
              <el-dropdown-item>
                <div style="positon:absolute;margin-top: 5px;" @click="download()"><i class="el-icon-download"></i> {{ $t('export') }}</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- add-over -->
          <div class="dialog-close" @click="onclose">
          </div>
        </div>
        <!-- @current-change="handleCurrentChange" -->
        <el-table
          id="proj-id"
          height="223"
          ref='singleTable'
          :data="model.localPaintMgr.projList"
          highlight-current-row
          @current-change="handleCurrentChange"
          @cell-mouse-enter="cellMouse"
          @cell-mouse-leave="cellMouse"
          :row-class-name="tableRowClassName"
          @row-dblclick="onopen(currentRow)"
          style="width:100%;border:0;">
          <el-table-column
            style=""
            prop="name"
            :label="$t('projectName')"
            width="150">
            <template slot-scope="scope">
              <!-- <div class="proj-selected"
                v-if="model.localPaintMgr.curProj===model.localPaintMgr.projList[scope.$index]">
              </div> -->
              <div class="table-td">
                {{ model.localPaintMgr.projList[scope.$index].name }}
                <!-- add-start -->
                <div class="el-icon-download" style="margin-left: 10px;" @click="download(model.localPaintMgr.projList[scope.$index].name)"></div>
                <!-- add-over -->
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="created"
            :label="$t('date')"
            width="180">
            <template slot-scope="scope">
              <div class="table-td">
                {{ model.localPaintMgr.projList[scope.$index].created }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            :label="$t('type')"
            width="150">
            <template slot-scope="scope">
              <div class="table-td">
                {{ model.localPaintMgr.projList[scope.$index].projType }}
                <!-- add-start -->
                <div class="proj-selected" v-if="model.localPaintMgr.curProj===model.localPaintMgr.projList[scope.$index]"></div>
                <!-- add-over -->
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="delete"
            :label="$t('done')">
            <template slot-scope="scope">
              <div v-if="model.localPaintMgr.curProj!==model.localPaintMgr.projList[scope.$index]" class="proj-icon-trash float-left" @click="onDelete(scope.$index, scope.row)"></div>
            </template>
          </el-table-column>
        </el-table>

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
        deleteTip: 'Delete project',
        export: 'Export',
        import: 'Import',
        uploadSuccess: 'Upload success',
        uploadFailed: 'Upload failed, content error',
        uploadUnCompatible: 'Engineering is not compatible',
        uploadFmtLimit: 'Only supports .gz format',
        uploadSizeLimit: 'Upload size can not over 10M',
        downloadSuccess: 'Download success',
        downloadFailed: 'Download failed',
      },
      cn: {
        title: '选择一个项目',
        projectName: '项目名',
        date: '时间',
        type: '模式',
        done: '操作',
        open: '打开',
        deleteTip: '删除项目',
        export: '导出',
        import: '导入',
        uploadSuccess: '上传成功',
        uploadFailed: '上传失败, 内容不对',
        uploadUnCompatible: '上传的工程与机械臂不兼容',
        uploadFmtLimit: '只支持.gz格式',
        uploadSizeLimit: '上传大小不能超过10M',
        downloadSuccess: '下载成功',
        downloadFailed: '下载失败',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      constant: window.GlobalConstant,
      uploadUrl: `http://${window.GlobalUtil.socketInfo.host}/project/upload`,
      currentRow: -1,
    };
  },
  mounted() {
    window.CommandsPaintSocket.listProjs((dict) => {
      // console.log(dict);
    });
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
      console.log('delete', curProj);
      this.model.localPaintMgr.curToDelProj = curProj;
      this.model.localPaintMgr.curToDelProjTitle = this.$t('deleteTip') + ` ${curProj.name} ?`;
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
    cellMouse(row, column, cell, event) {
      console.log(`row = ${row}, column = ${column}, cell = ${cell}, event = ${event}`)
      cell.style.backgroundColor = '';
    },
    download(name) {
      const data = {};
      if (name === undefined) {
        data.uuid = '/paint';
        data.name = 'all-projects';
      }
      else {
        data.uuid = '/paint/' + name;
        data.name = name;
      }
      let url = `http://${window.GlobalUtil.socketInfo.host}/project/download?path=${window.GlobalConstant.COMMON_PARAMS.userId}/${window.GlobalConstant.COMMON_PARAMS.version}${data.uuid}`
      let full_name = data.name + '.tar.gz';
      // if (data.type === 'file') {
      //   name += '.json';
      // }
      // else {
      //   name += '.tar.gz';
      // }
      fetch(url)
        .then((response) => {
          response.blob().then((blob) => {
            const a = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            const filename = 'paint-' + full_name;
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
            this.$message({
              message: `${this.$t('downloadSuccess')}: ${filename}`,
              type: 'success',
              duration: 0,
              showClose: true,
            });
            // this.$message.success(`${this.$t('downloadSuccess')}: ${filename}`);
          }).catch((e) => {
            this.$message.error(`${this.$t('downloadFailed')}: ${e}`);
          })
        })
        .catch((e) => {
          this.$message.error(`${this.$t('downloadFailed')}: ${e}`);
        })
      // fetch(url).then(response => response.blob().then((blob) => {
      //   const a = document.createElement('a');
      //   const url = window.URL.createObjectURL(blob);
      //   const filename = 'paint-' + full_name;
      //   a.href = url;
      //   a.download = filename;
      //   a.click();
      //   window.URL.revokeObjectURL(url);
      // }))
    },
    handleUploadSuccess(res, file) {
      if (res.success === undefined || res.success === -2) {
        this.$message.error(this.$t('uploadFailed'));
        return;
      }
      else if (res.success === -1) {
        this.$message.error(this.$t('uploadUnCompatible'));
        return;
      }
      this.$message.success(this.$t('uploadSuccess'))
      const uuid = this.model.localProjTree.curProj.uuid;
      window.CommandsPaintSocket.listProjs(() => {
        // this.model.localProjTree.changeProj(uuid);
        // this.model.localProjTree.curProj.uuid = uuid;
      });
    },
    beforeUpload(file) {
      // const isGZip = file.type === 'application/x-gzip';
      const isGZip = file.type.indexOf('gzip') === -1 ? false : true;
      // const isXml = file.type === 'text/xml';
      const isLimit10M = file.size / 1024 / 1024 < 10;
      if (!isGZip) {
          this.$message.error(this.$t('uploadFmtLimit'));
        }
        if (!isLimit10M) {
          this.$message.error(this.$t('uploadSizeLimit'));
        }
        return isGZip && isLimit10M;
    }
  },
}
</script>

<style>
/* .el-table .selected {
  background: gray;
} */
/* .el-table .normal {
  background: rgb(194, 223, 68);
} */
.el-table__body tr:hover>td {
  background-color: initial !important;
}
.el-table__body tr.current-row>td {
  background-color: initial !important;
}
</style>

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
.table-head {
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
  position: absolute;
  width: 10px;
  height: 10px;
  top: 10px;
  right: 30px;
  background-image: url('./../../assets/img/pop/icon_select.svg');
  background-size: 10px 10px;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
