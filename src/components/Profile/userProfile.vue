
<template>
  <div class="profile-wrapper">
    <div class=" com-header-wrapper">
      <span class="com-back-title" v-if="model.commonStatusMgr.panelIsHidden === true">{{ $t('profile') }}</span>
    </div>
    <div class="profile-form-wrapper">
      <el-upload
        class="avatar-uploader"
        action=""
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="profile.avatar" :src="profile.avatar" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-form ref="form" :model="profile" label-width="100px" class="profile-form">
        <el-form-item >
          <el-input v-model="profile.nickname" @blur="updateProfileInfo(profile.nickname)"></el-input>
        </el-form-item>
        <el-form-item prop="email" :label="$t('email')" >
          <el-input v-model="profile.email" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('gender')" class="com-icon">
          <el-select v-model="profile.gender" :placeholder="$t('select')" @change="updateProfileInfo(profile.gender)">
            <el-option :label="$t('man')" value="man"></el-option>
            <el-option :label="$t('female')" value="female"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('birthday')" class="com-icon">
          <el-col :span="11">
            <el-date-picker type="date" :placeholder="$t('date')" v-model="profile.birthday" style="width: 100%;" @click="updateProfileInfo(profile.birthday)"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('country')" class="com-icon">
          <el-select v-model="profile.country" :placeholder="$t('select')" @change="updateProfileInfo(profile.country)">
            <el-option :label="$t('China')" value="country"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('city')">
          <el-input v-model="profile.city" @blur="updateProfileInfo(profile.city)"></el-input>
        </el-form-item>
      </el-form>
      <el-collapse v-model="activeNames">
        <el-collapse-item :title="$t('changePassword')" name="1">
          <el-form status-icon ref="ruleForm2" label-width="140px" class="demo-ruleForm">
            <el-form-item :label="$t('password')" prop="pass">
              <el-input type="password" auto-complete="off" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('comfirmPassword')" prop="checkPass">
              <el-input type="password" auto-complete="off"  style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">提交</el-button>
              <el-button @click="resetForm('ruleForm2')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <div style="margin: 20px;text-align: center">
        <el-button type="primary">{{ $t('logOut') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    i18n: {
      messages: {
        en: {
          profile: 'Profile',
          userName: 'Name',
          email: 'Email',
          birthday: 'Birthday',
          gender: 'Gender',
          country: 'Country',
          city: 'City',
          changePassword: 'Change Password',
          man: 'Male',
          female: 'Female',
          date: 'Date',
          logOut: 'Log out',
          select: 'Select',
          password: 'Password',
          comfirmPassword: 'Comfirm Password',
        },
        cn: {
          profile: '个人信息',
          userName: '用户名',
          email: '邮箱',
          birthday: '生日',
          gender: '性别',
          country: '国家',
          city: '城市',
          changePassword: '修改密码',
          man: '男',
          female: '女',
          date: '日期',
          logOut: '退出登录',
          select: '选择',
          password: '密码',
          comfirmPassword: '确认密码',
        },
      },
    },
    data() {
      return {
        model: window.GlobalUtil.model,
        profile: {
          nickname: '',
          email: '',
          phone: '',
          city: '',
          birthday: '',
          gender: '',
          country: '',
          avatar: '',
        },
        activeNames: [],
      }
    },
    created() {
//      this.profile = window.profile;
//      this.profile = this.localProfileMgr.profileData;
      this.profile = window.GlobalUtil.model.localProfileMgr.profileData;
    },
    mounted() {
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      updateProfileInfo(dict) {
        window.CommandsProfileHttp.updateProfileData(dict, () => {
        });
      },
    },
    components: {
    },
    computed: {
    },
    watch: {
    },
  }
</script>

<style scoped lang="scss">
.profile-wrapper {
  .profile-form-wrapper {
    width: 600px;
    margin: 20px auto;
    position: relative;
    .avatar-uploader {
      position: absolute;
      left: 10px;
      width: 60px;
      height: 60px;
      background-color: #ddd;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #b4afaf;
    }
    .avatar {
      width: 60px;
      height: 60px;
    }
    .com-icon {
      background-repeat: no-repeat;
      background-position: left;
      background-size: 30px 30px;
      background-image: url("../../assets/img/comNav/nav_home.svg");
      border-bottom: 1px solid rgba(230, 230, 230, 0.6);
      padding: 0 20px;
    }
  }
}
</style>
