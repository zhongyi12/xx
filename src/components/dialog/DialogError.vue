
<template>
  <div class="noselected">
    <div class="dialog-wrap">
      <div class="dialog-cover" ></div>
      <div class="dialog-content">
        <i class="el-icon-warning"></i>
        <div>
          <div v-if="model.exceptionModel.errorObj.controller">
            <span class="error-item-title">{{ $t('controllerError') }}</span>
            <div>
              <span  class="code-detial">{{ $t('code') }}: <span class="code">0x{{ Number(model.exceptionModel.errorObj.controller.code).toString(16) }}</span>
              <span>({{ model.exceptionModel.errorObj.controller.code }})</span></span>
              <span style="color:#6a6969; ">{{ model.exceptionModel.errorObj.controller.title }}</span>
              <div class="error-item-desc">{{ model.exceptionModel.errorObj.controller.desc }}</div>
            </div>
          </div>
          <div v-if="model.exceptionModel.errorObj.gripper">
            <span class="error-item-title">{{ $t('gripperError') }}</span>
            <div>
              <span class="code-detial">{{ $t('code') }}: <span class="code">0x{{ Number(model.exceptionModel.errorObj.gripper.code).toString(16) }}</span>
              <span>({{ model.exceptionModel.errorObj.gripper.code }})</span></span>
              <span style="color:#6a6969; ">{{ model.exceptionModel.errorObj.gripper.title }}</span>
              <div class="error-item-desc">{{ model.exceptionModel.errorObj.gripper.desc }}</div>
            </div>
          </div>
          <div v-if="model.exceptionModel.errorObj.servo && model.exceptionModel.errorObj.servo.length > 0">
            <span class="error-item-title">{{ $t('servoError') }}</span>
            <div v-for="(item, index) in model.exceptionModel.errorObj.servo" :key="index">
              <div  class="code-detial"> 
                <span>{{ $t('code') }}: <span class="code">0x{{ Number(item.code).toString(16) }}</span>
                <span>({{ item.code }})</span></span>
                <span class="error-id">ID: {{ item.ids }}</span>
              </div>
             
              <div style="color:#6a6969; ">{{ item.title }}</div>
              <div class="error-item-desc">{{ item.desc }}</div>
            </div>
          </div>
        </div>
        <div>
          <el-button @click="handleError" class="confirm-btn">{{ model.exceptionModel.errorButton }}</el-button>
        </div>
        <!-- <div v-for="(error, index) in model.exceptionModel.errors">
          <p class="error-item-title">
            {{ error.title }}
          </p>
          <p class="error-item-state">
            <span>ID: {{ error.ids }}</span>
            <span style="margin-left: 20px;">Code: {{ error.code }}</span>
          </p>
          <p v-html="error.desc" class="error-item-desc"></p>
        </div>
        <div>
          <el-button @click="handleError" class="confirm-btn">{{ model.exceptionModel.errorButton }}</el-button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>


  export default {
    props: [],
    i18n: {
      messages: {
        en: {
         confirm: "Confirm",
         controllerError: 'ControllerError',
         gripperError: 'GripperError',
         servoError: 'ServoError',
         code: 'Code',
        },
        cn: {
          confirm: "确认",
          controllerError: '控制器错误',
          gripperError: '机械爪错误',
          servoError: '伺服错误',
          code: '错误码',
        },
      },
    },
    data() {
      return {
        model: window.GlobalUtil.model,
      }
    },
    mounted() {
      document.onkeydown = () => {
        if (window.event.keyCode === 13) {
          this.showAboutDialog();
        }
      };
    },
    methods: {
      handleError() {
        if (this.model.exceptionModel.errorHandle) {
          this.model.exceptionModel.errorHandle();
          this.model.exceptionModel.errorHandle = null;
          this.model.exceptionModel.errorObj = {};
        }
        this.model.exceptionModel.showErrorDialog = false;
      },
    },
    components: {
    },
    computed: {
      isConnected() {
        return this.$store.state.robot.status.connected;
      },
    },
    watch: {
      isConnected(curVal, newVal) {
        if (!this.$store.state.robot.status.connected) {
          this.showPowerOffDialog();
        }
      }
    }
  }
</script>

<style scoped lang="scss">

  .error-item-title {
    line-height: 30px;
    font-size: 20px;
    padding: 10px 0 6px;
    display: block;
    color: #5e5d5d;
  }
  .code-detial {
    font-size: 14px;
    color: #6a6969;
    padding-bottom: 10px;
    display: block;
    .code {
      
    }
   
  }
   .error-id {
      margin-left: 20px;
    }
  .error-item-state {
    margin-left: 20px;
  }
  .error-item-desc {
    // margin-left: 20px;
    padding: 10px 0;
    color: #6a6969;
  }
 
  .confirm-btn {
    // background-image: url("../../assets/img/dialog/reboot.png");
    // background-position: left;
    // background-repeat: no-repeat;
    // background-size: 16px 16px;
    // position: absolute;
    // top: 100px;
    // left: 150px;
    margin-top: 10px;
    background: #e28432;
    color: #fff;
  }
  .confirm-btn:hover {
    background: rgba(226, 132, 50, 0.76)
  }
  .top-title {
    text-align: center;
    display: block;
    line-height: 40px;
    font-size: 22px;
     padding-top: 10px;
    img {
      width: 34px;
    }
  }
  .dialog-content {
    width: 566px;
    position: fixed;
    height: 400px;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 0px;
    right: 0px;
    z-index: 10;
    background: #FFFFFF;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1vw;
    .el-icon-warning {
      font-size: 40px;
      color: #e28432;
    }
  }

  .save-dialog-text {
    text-align: center;
    width: 100%;
  }
  .save-dialog-text p {
    padding: 3% 5% 7%;
    cursor: pointer;
    font-size: 14px;
  }

</style>
