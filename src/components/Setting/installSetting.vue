<template>
  <div class="com-module-wrapper motion-wrapper">
 

   <div class="com-setting-block-wrapper ">
     <div><span class="com-img-bg floor-bg-img " :class="{'floor-bg-img-active':installType.floor}" @click="chooseInstallType('floor')">{{ $t('floor') }}</span></div>
     <div><span class="com-img-bg wall-bg-img " :class="{'wall-bg-img-active':installType.wall, 'no-use':noUse}" @click="chooseInstallType('wall')">{{ $t('wall')}}</span></div>
     <div><span class="com-img-bg ceil-bg-img " :class="{'ceil-bg-img-active':installType.ceil,'no-use':noUse}" @click="chooseInstallType('ceil')">{{ $t('ceiling') }}</span></div>
     <div><span class="com-img-bg angle-bg-img " :class="{'angle-bg-img-active':installType.angle,'no-use':noUse}" @click="chooseInstallType('angle')">{{ $t('angle') }}</span><input :class="{'no-use':noUse}" type="number" class="input-angle" />°</div>
   </div>

  </div>
</template>

<script>
export default {
  i18n: {
    messages: {
      en: {
        floor: "Floor (0°)",
        wall: "Wall (90°)",
        ceiling: "Ceiling (180°)",
        angle: "倾斜角度"
      },
      cn: {
        floor: "水平 (0°)",
        wall: "壁装 (90°)",
        ceiling: "吊装 (180°)",
        angle: "倾斜角度 "
      },
    },
  },
  data() {
    return {
      value2: true,
      installType: {
        floor: true,
        wall: false,
        ceil: false,
        angle: false,
      },
      noUse: true,


      
    };
  },
  methods: {
    chooseInstallType(type) {
      const installType = this.installType;
      for(let key in installType) {
        installType[key] = false;
      }
        installType[type] = true;

    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .motion-wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding-top: 10%;
    text-align: center;
    .com-setting-block-wrapper {
      >div {
        width:40%;
        // padding-left: 30%;
        padding: 20px 0;
        display: inline-block;
        text-align: left;
      }
      .com-img-bg {
        background-repeat: no-repeat;
        background-size: contain;
        background-position: left center;
        padding-left: 40px;
        text-align: left;
      }
      .floor-bg-img {
        background-image: url('../../assets/img/setting/install_floor.svg');
      }

      .wall-bg-img {
        background-image: url('../../assets/img/setting/install_wall.svg');
      }
      .ceil-bg-img {
        background-image: url('../../assets/img/setting/install_ceil.svg');
      }
      .angle-bg-img {
        background-image: url('../../assets/img/setting/install_other.svg');
      }
      .floor-bg-img-active {
        background-image: url('../../assets/img/setting/install_floor_active.svg');
        color: #e27347;
      }

      .wall-bg-img-active {
        background-image: url('../../assets/img/setting/install_wall_active.svg');
         color: #e27347;
      }
      .ceil-bg-img-active {
        background-image: url('../../assets/img/setting/install_ceil_active.svg');
         color: #e27347;
        
      }
      .angle-bg-img-active {
        background-image: url('../../assets/img/setting/install_other_active.svg');
         color: #e27347;
      }
      .input-angle {
        width: 70px; 
        height: 28px;
        margin-left: 10px;
        padding: 0 4px; 
        border: 1px solid #dad6d6;
      }
      .no-use {
         opacity: .4;
         pointer-events: none;
      }
    }
  }
</style>
