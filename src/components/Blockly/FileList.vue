
<template>
  <div class="file-list-wrapper">
    <div class="my-app">
      <div class="list-title" @click="onlist()">
        <i :class="isShowProjList === true ? 'el-icon-caret-bottom':'el-icon-caret-top'"></i>
        <span>{{ $t('myApp') }} — </span>
        <span>{{ curFileName }}</span>
      </div>

      <!--<el-dropdown split-button type="text" size="small" trigger="click" >
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <el-upload
              multiple
              class="app-uploader"
              :data="{path: `${constant.COMMON_PARAMS.userId}/${constant.COMMON_PARAMS.version}/app/myapp`}"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :before-upload="beforeUpload">
              <i class="el-icon-upload2"></i>
              {{ $t('import') }}
            </el-upload>
          </el-dropdown-item>
          <el-dropdown-item>
            <div style="positon:absolute;margin-top: 5px;" @click="downloadApp()"><i class="el-icon-download"></i> {{ $t('export') }}</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->

    </div>
    <div v-if="isShowProjList" style="height: 80vh;">
      <div id="app-list" class="app-list" >
      
        <div class="block-title" style="position:absolute;background: white;">
          <div class="id">{{ $t('ID') }}</div>
          <div class="name-title">{{ $t('title') }}</div>
          <div class="operate">{{ $t('operate') }}</div>
        </div>
        <div style="margin-top: 30px;"></div>
        <div v-for="(item, index) in model.localAppsMgr.appTreeDatas[2].children" :key="item.uuid">
          <div @click="model.localAppsMgr.curProj.label !== item.label ? onselect(item) : null"  class="block" :class="{'selected-block':model.localAppsMgr.curProj.label === item.label}">
            <div class="id">{{ index + 1 }}</div>
            <AppTitle class="name-title" :data='item'></AppTitle>
            <div class="operate" v-if="model.localAppsMgr.curProj.label === item.label">
              <div class="el-icon-download" @click="downloadApp(item.label)"></div>
              <div class="el-icon-document" @click="genPythonCode(item)"></div>   
              <div class="el-icon-delete" @click="onDelete(item.label)"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-edit-wrapper" alt="">
       
        <el-upload
          multiple
          class="app-uploader com-edit-btn"
          :data="{path: `${constant.COMMON_PARAMS.userId}/${constant.COMMON_PARAMS.version}/app/myapp`}"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload">
          <i class="el-icon-upload2"></i>
           <button class=" import-btn"></button>
          {{ $t('import') }}
        </el-upload>
        
        <button class=" el-icon-download com-edit-btn ecport-btn" @click="downloadApp()">{{ $t('export') }}</button >
      </div>
    </div>

  </div>
</template>
<script>

import AppTitle from './../appStore/AppTitle';

export default {
  props: ['selected', 'onselect', 'curFileName','isShowProjList','onlist'],
  i18n: {
    messages: {
      en: {
        myApp: 'My Projects',
        import: 'Import Project',
        export: 'Download All',
        uploadSuccess: 'Upload success',
        uploadFailed: 'Upload failed, content error',
        uploadUnCompatible: 'Engineering is not compatible',
        uploadFmtLimit: 'Only supports .gz or .xml format',
        uploadSizeLimit: 'Upload size can not over 10M',
        downloadSuccess: 'Download success',
        downloadFailed: 'Download failed',
        runningTip: 'Project is running!',
        ID: 'ID',
        title: 'Title',
        operate: 'Operate',
        convertFailed: 'Convert failed',
      },
      cn: {
        myApp: '我的项目',
        import: '导入项目',
        export: '下载全部',
        uploadSuccess: '上传成功',
        uploadFailed: '上传失败, 内容不对',
        uploadUnCompatible: '上传的工程与机械臂不兼容',
        uploadFmtLimit: '只支持.gz或.xml格式',
        uploadSizeLimit: '上传大小不能超过10M',
        downloadSuccess: '下载成功',
        downloadFailed: '下载失败',
        runningTip: '项目正在运行!',
        ID: '序号',
        title: '名字',
        operate: '操作',
        convertFailed: '转换失败',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      constant: window.GlobalConstant,
      uploadUrl: `http://${window.GlobalUtil.socketInfo.host}/project/upload`,
      colorList: ['9CC5F7', 'F8C6DE', 'B8E986', 'D5D5D5', '9EE0D2'],

    };
  },
  mounted() {
    window.CommandsAppsSocket.listLocalApps((dict) => {
      // console.log(dict);
    });
  },
  methods: {

    genPythonCode(data) {
      window.CommandsEditorSocket.blocklyToPython(data.label, (dict) => {
        console.log('genPythonCode', dict);
        if (dict.code === 0) {
          this.$router.push({ name: 'Editor' });
        }
        else if (dict.code === 1000) {
          const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA().data;
          window.open(`http://${window.location.hostname}:18333/convert?userId=${params.userId}&version=${params.version}&category=${data.category}&appName=${data.label}`);
        }
        else {
          this.$message({
            message: this.$t('convertFailed'),
            type: 'warning',
            duration: 2000,
          });
        }
      });
      // const params = window.GlobalConstant.INIT_CMD_PARAMS_COMMON_DATA().data;
      // window.open(`http://${window.location.hostname}:18333/convert?userId=${params.userId}&version=${params.version}&category=${data.category}&appName=${data.label}`);
    },
    onDelete(name) {
      if (window.Blockly.Running) {
        this.$message({
          message: this.$t('runningTip'),
          type: 'warning',
          duration: 1000,
        });
        return;
      }
      const deleteApp = window.language.currentLang === 'en' ? 'Delete App' : '删除应用';
      this.model.localAppsMgr.deleteAppTitle = deleteApp + ` '${name}' ?`;
      this.model.localAppsMgr.deleteAppName = name;
      this.model.localAppsMgr.isDeleteApp = true;
    },
    downloadApp(name) {
      let url = `http://${window.GlobalUtil.socketInfo.host}/project/download?path=${window.GlobalConstant.COMMON_PARAMS.userId}/${window.GlobalConstant.COMMON_PARAMS.version}/app/myapp`
      if (name !== undefined) {
        url += '/' + name
        name += '.tar.gz';
      }
      else {
        name = 'all-apps.tar.gz';
      }
      fetch(url)
        .then((response) => {
          response.blob().then((blob) => {
            const a = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            const filename = 'blockly-' + name;
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
      //   const filename = 'blockly-' + name;
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
      const curProName = this.model.localAppsMgr.curProName;
      const curProj = Object.assign({}, this.model.localAppsMgr.curProj)
      window.CommandsAppsSocket.listLocalApps((dict) => {
        this.model.localAppsMgr.curProName = curProName;
        this.model.localAppsMgr.curProj = Object.assign({}, curProj);
      });
    },
    beforeUpload(file) {
      // const isGZip = file.type === 'application/x-gzip';
      const isGZip = file.type.indexOf('gzip') === -1 ? false : true;
      const isXml = file.type === 'text/xml';
      const isLimit10M = file.size / 1024 / 1024 < 10;
      if (!isGZip && !isXml) {
          this.$message.error(this.$t('uploadFmtLimit'));
        }
        if (!isLimit10M) {
          this.$message.error(this.$t('uploadSizeLimit')); //
        }
        return (isGZip || isXml) && isLimit10M;
    }
  },
  components: {
    AppTitle,
  },
  computed: {
  }
}
</script>


<style scoped lang="scss">
.file-list-wrapper {
  border-left: 1px solid #e3e3e3;
  width: 300px;
  position: relative;
  font-size: 14px;

}
.my-app {
   border-bottom: 1px solid #e3e3e3;
   background: #fff;
   
  .list-title {
    padding: 0 10px;
    color: #444;
    padding: 10px;
  }

}
.app-list {
  height: 70vh;
  overflow-y: auto;
  width: 100%;
  color: #555;
  .block {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 6px 5px;
    width: 100%;
    border-bottom: 1px solid #e3e3e3;
    .id{
      width: 17%;
      text-align: center;
    }
    .name-title{
      width: 50%;

    }
    .operate {
      width: 33%;
     >div {
        padding: 0 5px;
     }
    }
    .file-name {
      padding-top: 6px;
      text-align: center;
      // width: 100%;
      font-size: 14px;

      // text-overflow: ellipsis;
      // white-space: nowrap;
      // overflow: hidden;
    }
  }
  // .block:hover {
  //   background: #463c30;
  //   color: #fff;
  // }
  .selected-block{
    background: #ec8e19;
    color: #fff;
  }
}
.block-title {
  cursor: pointer;
  padding: 6px 5px;
  width: 100%;
  border-bottom: 1px solid #e3e3e3;
  display: flex;
  >div {
    width: 33%;
    padding: 0 20px;
  }
}


.bottom-edit-wrapper {
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  .com-edit-btn {
    border: 1px solid #e3e3e3;
    width: 100%;

    // padding: 10px 0;
    cursor: pointer;
  }
}
.app-list::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.app-list::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #D8D8D8;;
}
.app-list::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(231,231,231,0.4);
  border-radius: 0;
  background: rgba(231,231,231,0.4);
}
</style>
