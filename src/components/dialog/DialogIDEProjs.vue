<template>
  <div class="dialog-wrap">
    <div class="dialog-cover" @click="closeMyself"></div>
    <div class="dialog-content">
      <div class="dialog-top">
        <span class="proj-top-title">{{ $t('title') }}</span>
        <el-dropdown split-button type="text" size="small" trigger="click" style="left: 150px;top: 20px;">
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-upload
                  multiple
                  class="ide-uploader"
                  :data="{path: `${constant.COMMON_PARAMS.userId}/${constant.COMMON_PARAMS.version}/python`}"
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
        <div class="dialog-close" @click="closeMyself">
        </div>
      </div>
      <table>
        <tr>
          <th class="dialog-table-head">{{ $t('projectName')}}</th>
          <th class="dialog-table-head">{{ $t('date') }}</th>
          <th class="dialog-table-head">{{ $t('option') }}</th>
        </tr>
      </table>
      <div class="dialog-table">
        <table>
          <template v-for='(data,index) in model.localProjTree.curProjList'>
            <tr @dblclick="onSelect(data.uuid)">
              <td>{{ data.name }}<div class="el-icon-download" style="margin-left: 10px;" @click="download(data)"></div></td>
              <td>{{ data.ctime }}</td>
              <td>
                <div class="float-left proj-selected" v-if="model.localProjTree.curProj.uuid===data.uuid"></div>
                <div class="float-left proj-open" v-if="model.localProjTree.curProj.uuid!==data.uuid" @click="onSelect(data.uuid)">Open</div>
                <!-- btn_trash.svg -->
                <div class="proj-icon-trash float-left" v-if="model.localProjTree.curProj.uuid!==data.uuid" @click="onDelete(data.uuid)"></div>
              </td>
            </tr>
          </template>
        </table>
      </div>
      <div class="dialog-add">
        <div class="dialog-add-content" @click="addProj()">
          <span>+</span>
          <span>{{ $t('newProject') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const path = require('path');

export default {
  i18n: {
    messages: {
      en: {
        title: 'Select a Project',
        projectName: 'Project name',
        date: 'Date',
        type: 'Type',
        Delete: 'Delete',
        option: 'Option',
        newProject: 'New Project',
        deletePro: 'Are you sure delete Project',
        newProName: 'New project name',
        export: 'Export',
        import: 'Import',
        uploadSuccess: 'Upload success',
        uploadFailed: 'Upload failed, content error',
        uploadUnCompatible: 'Engineering is not compatible',
        uploadFmtLimit: 'Only supports .gz format',
        uploadSizeLimit: 'Upload size can not over 10M'
      },
      cn: {
        title: '请选择一个项目',
        projectName: '项目名',
        date: '时间',
        type: '类型',
        Delete: '删除',
        option: '选择',
        newProject: '新建项目',
        deletePro: '确定删除项目',
        newProName: '新建项目名',
        export: '导出',
        import: '导入',
        uploadSuccess: '上传成功',
        uploadFailed: '上传失败, 内容不对',
        uploadUnCompatible: '上传的工程与机械臂不兼容',
        uploadFmtLimit: '只支持.gz格式',
        uploadSizeLimit: '上传大小不能超过10M'
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      constant: window.GlobalConstant,
      uploadUrl: `http://${window.GlobalUtil.socketInfo.host}/project/upload`,
    }
  },
  mounted() {
    window.CommandsEditorSocket.listProjs(() => {
    });
  },
  methods: {
    closeMyself() {
      // this.$emit('on-close')
      this.model.localProjTree.projsDialogShow = false;
    },
    addProj() {
      this.model.localProjTree.folderOrFile = 'proj';
      this.model.localProjTree.curDialogTitle = this.$t('newProName');
      window.GlobalUtil.model.localProjTree.dialogErrorTips = '';
      this.model.localProjTree.fileDialogShow = true;
      // setTimeout(() => {
      //   document.getElementById('input-text').focus();
      // });
      window.GlobalUtil.setInputFocus();
    },
    onSelect(uuid) {
      console.log(uuid);
      this.model.localProjTree.changeProj(uuid);
      this.model.localProjTree.projsDialogShow = false;
    },
    onDelete(uuid) {
      const name = path.basename(uuid);
      this.model.localProjTree.curDialogTitle = this.$t('deletePro') + `'${name}' ?`;
      this.model.localProjTree.dialogErrorTips = '';
      this.model.localProjTree.deleteDialogShow = true;
      this.model.localProjTree.onDeleteDialog = () => {
        window.CommandsEditorSocket.delProj(uuid, (dict) => {
          // GlobalUtil.model.localProjTree.deleteDialogShow = false;
          console.log(`localTeach.delProj = ${uuid}, dict = ${JSON.stringify(dict)}`);
        });
      };
    },
    download(data) {
      if (data === undefined) {
        data = {
          uuid: '/python',
          name: 'all-projects'
        }
      }
      let name = data.name;
      let url = `http://${window.GlobalUtil.socketInfo.host}/project/download?path=${window.GlobalConstant.COMMON_PARAMS.userId}/${window.GlobalConstant.COMMON_PARAMS.version}${data.uuid}`
      name += '.tar.gz';
      // if (data.type === 'file') {
      //   name += '.json';
      // }
      // else {
      //   name += '.tar.gz';
      // }
      fetch(url).then(response => response.blob().then((blob) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        const filename = 'python-' + name;
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      }))
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
      window.CommandsEditorSocket.listProjs(() => {
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

<style scoped>
.proj-top-title {
  position: absolute;
  left: 24px;
  top: 25px;
  /* height: 67px; */
  font-family: 'Gotham-Medium';
  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: -1px;
  /* background-color: yellow; */
  /* line-height: 16px; */
}
.dialog-content {
  width: 580px;
  position: fixed;
  height: 340px;
  top: 20%;
  left: 0px;
  right: 0px;
  margin-left:auto;
  margin-right:auto;
  z-index: 10;
  background: #303030;
  overflow: hidden;
}
.dialog-top {
  width: 100%;
  height: 67px;
  background: #3F4955;
}
.dialog-table {
  /* width: 100%; */
  width: 600px;
  height: 160px;
  overflow-y: scroll;
}
.dialog-table-head {
  width: 194px;
  height: 66px;
  font-family: 'Gotham-Medium';
  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: -1px;
  text-align: center;
  line-height: 16px;
}
.dialog-table td {
  width: 194px;
  height: 40px;
  font-family: 'Gotham-Book';
  font-size: 12px;
  color: #FFFFFF;
  /*padding-left: 50px;*/
  letter-spacing: -0.38px;
   text-align: center;
  line-height: 12px;
}
.dialog-table tr:hover {
  background: rgba(255, 255, 255, 0.1);
}
.dialog-table tr:hover td {
  /* color: black; */
  font-size: 13px;
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
.dialog-close:hover {
  color: #4fc08d;
}
.dialog-add {
  width: 100%;
  height: 100px;
  /* background-color: yellow; */

}
.dialog-add-content {
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  margin: auto;
  /* background-color: yellow; */
  width: 496px;
  height: 26px;
  font-family: 'Gotham-Book';
  text-align: center;
  line-height: 10px;
  letter-spacing: -0.5px;
  color: #FFFFFF;
  padding-top: 8px;
  border:1px dashed #5C5C5C;
  cursor: pointer;
}
.proj-icon-trash {
  margin-left: 20px;
  width: 30px;
  height: 30px;
  background-image: url('./../../assets/img/pop/btn_trash.svg');
  background-size: 12px 16px;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}
.proj-open {
  font-family: 'Gotham-Book';
  font-size: 12px;
  color: #FFFFFF;
  letter-spacing: -0.38px;
  line-height: 26px;
  height: 26px;
  margin-left: 68px;
  cursor: pointer;
}
.proj-selected {
  width: 30px;
  height: 30px;
  margin-left: 68px;
  background-image: url('./../../assets/img/pop/icon_select.svg');
  background-size: 16px 16px;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
