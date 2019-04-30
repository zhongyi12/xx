<template>
 <div>
   <el-dropdown class="accessory-dropdown" size="small" type="primary" style="width:100%;" @command="selectAccessories" trigger="click" placement="bottom">
    <!-- {{ $t(model.commonStatusMgr.selectAccessory) }} -->
    <el-button type="primary" style="width:100%;">
      {{ $t(model.commonStatusMgr.selectAccessory) }}<i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <el-dropdown-menu class="accessory-dropdown-menu" slot="dropdown">
      <el-dropdown-item command="gripper">{{ $t("gripper") }} </el-dropdown-item>
      <!-- <el-dropdown-item command="pump" divided>{{ $t("pump") }} </el-dropdown-item> -->
      <el-dropdown-item command="support" divided>{{ $t("support") }} </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
  <gripper v-if="model.commonStatusMgr.selectAccessory === 'gripper'"></gripper>
</div>
</template>

<script>
import Gripper from '../Accessories/Gripper';

export default {
  i18n: {
    messages: {
      en: {
        gripper: 'Gripper',
        pump: 'Pump',
        support: 'More accessories, stay tuned!',
      },
      cn: {
        gripper: '机械爪',
        pump: '吸头',
        support: '更多配件, 敬请期待!',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
    };
  },
  mounted() {
    if (this.model.commonStatusMgr.selectAccessory === 'auto') {
      this.model.commonStatusMgr.selectAccessory = 'gripper';
    }
  },
  methods: {
    selectAccessories(command) {
      if (command !== 'support') {
        this.model.commonStatusMgr.selectAccessory = command;
      }
    }
  },
  components: {
   Gripper,
  },
};
</script>
<style>
/* .accessory-dropdown .el-button-group .el-button--primary:first-child {
  width: 460px;
  height: 30px;
  padding-top: 7px;
} */
/* .accessory-dropdown .el-button--primary:last-child {
  width: 500px;
  height: 30px;
  padding-top: 7px;
}
.accessory-dropdown .el-button--primary:last-child {
  width: 40px;
  height: 30px;
  padding-top: 7px;
} */
.accessory-dropdown .el-button--primary {
  width: 500px;
  height: 30px;
  padding-top: 7px;
  color: #0771de;
  font-size: 15px;
  background-color: rgb(241, 246, 248);
  border-color: rgb(241, 246, 248);
}
.accessory-dropdown {
  margin-top: -1px;
}
.accessory-dropdown-menu {
  /* background-color: rgb(241, 246, 248);
  border-color: rgb(241, 246, 248); */
  /* padding: 5px; */
}
.accessory-dropdown-menu .el-dropdown-menu__item {
  /* line-height: 20px; */
  text-align: center;
  width: 490px;
  margin-top: -5px;
}
.el-popper[x-placement^=bottom] {
  /* width: 490px; */
  margin-top: 6px;
  /* margin-left: -200px; */
}
</style>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
