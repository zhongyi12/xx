<!-- 传递参数control（数组，index: 0-6）, 离线模式下控制机械臂, <keep-alive>
     默认高度为窗口宽度的52%
     传递参数size = {width: xx, heigth: xx}, 数值为百分比（0.01-0.99）窗口宽高占当前总窗口的百分比-->
<template>
  <div class="hello" id="model-wrapper">
    <!-- <div class="block">
      <el-select v-model="select" placeholder="Select" @change="changeJoint">
        <el-option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div> -->
    <!-- <div class="hello-row">
      <div class="block">
        <span class="text">Group-X</span>
        <el-slider v-model="state.test.x" :step="config.step" :max="config.debugMax" :min="config.debugMin" show-input></el-slider>
      </div>
      <div class="block">
        <span class="text">Group-Y</span>
        <el-slider v-model="state.test.y" :step="config.step" :max="config.debugMax" :min="config.debugMin" show-input></el-slider>
      </div>
      <div class="block">
        <span class="text">Group-Z</span>
        <el-slider v-model="state.test.z" :step="config.step" :max="config.debugMax" :min="config.debugMin" show-input></el-slider>
      </div>
      <div class="block">
        <span class="text">Joint-X</span>
        <el-slider v-model="state.test.jx" :step="config.step" :max="config.debugMax" :min="config.debugMin" show-input></el-slider>
      </div>
      <div class="block">
        <span class="text">Joint-Y</span>
        <el-slider v-model="state.test.jy" :step="config.step" :max="config.debugMax" :min="config.debugMin" show-input></el-slider>
      </div>
      <div class="block">
        <span class="text">Joint-Z</span>
        <el-slider v-model="state.test.jz" :step="config.step" :max="config.debugMax" :min="config.debugMin" show-input></el-slider>
      </div>
      <div class="block">
        <span class="text">Scale</span>
        <el-slider v-model="state.test.scale" :step="config.step" :max="config.debugMax" :min="config.debugMin" show-input></el-slider>
      </div>
    </div> -->
    <div class="hello-row">
      <div id="emulator-overlay">
          <!-- <input v-model="testtest"/> -->
        <!-- <span v-for="j in 7" :key="j" class="text">#{{j-1}}:{{localJoints[j-1]}}</span> -->
        <!-- <el-slider v-model="localJoints[j-1]" :step="config.step" :max="config.jointMax" :min="config.jointMin"></el-slider> -->
      </div>
      <!-- <CommonPositionView v-if="model.commonStatusMgr.ControlPositionShow === true"></CommonPositionView> -->
      <!-- <div style="position:absolute;right:20px;">Polar</div> -->
      <div id="emulator-container"></div>
    </div>
    <!--
    <div class="block">{{ msg }}-debugTest-{{localJoints}}</div>
    step<input v-model="config.step"/>> -->

  </div>
</template>

<script>
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import TransformControls from 'three-transformcontrols';
// import DragControls from 'three-dragcontrols';
import baseg from '@/assets/lib/threeJSLoader'
import CommonPositionView from './CommonPositionView';
import { sep } from 'path';

// import * as types from '../../store/mutation-types';
THREE.Cache.enabled = true;

// const JOINT_POSITION = [
//   null,
//   [42, 4.6, 0],
//   [-0.3, 4.7, -24.2],
//   [42.05, 4.2, 0],
//   [0.45, -1.2, -52.8],
//   [42, -7.3, -60.7],
//   [7.36, -35.85, -60.7],
//   [42, -42.2, 0],
// ];
// const GROUP_POSITION = [
//   [0.1, 0.04, -0.04],
//   [42.4, -0.1, 24.2],
//   [-42.35, 0.5, -24],
//   [41.51, 5.38, 52.72],
//   [-41.4, 6.16, 7.9],
//   [35.47, 27.6, -0.05],
//   [-34.6, 6.4, -60.8],
// ];
const JOINT_POSITION = [
  null,
  [42, 4.6, 0],
  [0, 4.8, -24.2],
  [42.0, 4.15, 0],
  [0, -1.2, -52.8],
  [42, 0, -60.7],
  [0, -34.91, -60.7],
  [42, -42.2, 0],
];
const GROUP_POSITION = [
  [0.055, 0.045, -0.07],
  [43.5, -0.1, 24.2],
  [-41.99, 0.6, -24.35],
  [41.95, 5.28, 52.72],
  [-42.0, -1.19, 7.83],
  [42.75, 34.85, 0],
  [-42.0, 7.35, -60.75],
];
const SCENE_ZOOM = 50; // 64

export default {
  name: 'XarmModel',
  props: ['control', 'size', 'slotProps'],
  i18n: {
    messages: {
      en: {
        cannotArriveTip: 'In the current stance, the xArm cannot go to the specified location.',
        isAllLockTip: 'xArm is not ready, please check all joints are locked',
      },
      cn: {
        cannotArriveTip: '当前姿态下，机械臂不能去到指定地方。',
        isAllLockTip: 'xArm 没准备好，请检查所有关节是否已锁',
      },
    },
  },
  watch: {
    // 'slotProps.size' : {
    //   handler(newValue) {
    //     console.log('debug:222', newValue);
    //     const sizeArray = [newValue.width, newValue.height]
    //     if (this.three.renderer) {
    //       this.three.renderer.setSize(...sizeArray)
    //     }
    //     if (this.three.camera) {
    //       const halfSize = sizeArray.map(value => value / SCENE_ZOOM);
    //       this.three.camera.left = -halfSize[0];
    //       this.three.camera.right = halfSize[0];
    //       this.three.camera.top = halfSize[1];
    //       this.three.camera.bottom = -halfSize[1];
    //       // camera.aspect = this.getCameraAspect();
    //       this.three.camera.updateProjectionMatrix();
    //     }
    //   }
    // },
    // isTcpTab(newValue) {
    //   if (window.baseTransformControls) {
    //     window.baseTransformControls.visible = newValue;
    //     window.axisHelper.visible = !newValue;
    //     window.controls.update();
    //     window.renderer.render(window.scene, window.camera);
    //   }
    // },
    slotProps(newValue) {
      console.log('debug param slot:', newValue);
    },
    isTcpTab(newValue) {
      if (newValue) {
        const selectPosIndex = this.model.robot.state.local.selectPosIndex;
        this.transformControlsParams.base.scale.x = this.model.robot.state.local.selectPosIndex % 3 === 0 ? 3 : 2;
        this.transformControlsParams.base.scale.y = this.model.robot.state.local.selectPosIndex % 3 === 1 ? 3 : 2;
        this.transformControlsParams.base.scale.z = this.model.robot.state.local.selectPosIndex % 3 === 2 ? 3 : 2;
      }
      else {
        this.transformControlsParams.base.scale.x = 2;
        this.transformControlsParams.base.scale.y = 2;
        this.transformControlsParams.base.scale.z = 2;
      }
    },
    selectPosIndex(newValue) {
      this.transformControlsParams.base.scale.x = this.model.robot.state.local.selectPosIndex % 3 === 0 ? 3 : 2;
      this.transformControlsParams.base.scale.y = this.model.robot.state.local.selectPosIndex % 3 === 1 ? 3 : 2;
      this.transformControlsParams.base.scale.z = this.model.robot.state.local.selectPosIndex % 3 === 2 ? 3 : 2;
    },
    selectJointIndex(newValue) {
      // console.log('debug index:', newValue);
      newValue = this.model.robot.state.info.xarm_axis === 5 && newValue >= 5 ? -1 : this.model.robot.state.info.xarm_axis === 6 && newValue >= 6 ? -1 : newValue
      baseg.geometryList.forEach((geometry, index) => {
        if (index === newValue + 1 && newValue !== -1) {
          geometry.material.color.set('#69f');
          this.selectedObject = geometry;
        }
        else {
          geometry.material.color.set('#fff');
        }
      });
      if (this.model.robot.state.info.xarm_axis === 5) {
        switch (newValue) {
          case 1:
            baseg.geometryList[1].material.color.set('#fff');
            baseg.geometryList[2].material.color.set('#69f');
            baseg.geometryList[3].material.color.set('#69f');
            baseg.geometryList[4].material.color.set('#fff');
            baseg.geometryList[5].material.color.set('#fff');
            baseg.geometryList[6].material.color.set('#fff');
            baseg.geometryList[7].material.color.set('#fff');
            this.selectedObject = baseg.geometryList[2];
            break;
          case 2:
            baseg.geometryList[1].material.color.set('#fff');
            baseg.geometryList[2].material.color.set('#fff');
            baseg.geometryList[3].material.color.set('#fff');
            baseg.geometryList[4].material.color.set('#69f');
            baseg.geometryList[5].material.color.set('#69f');
            baseg.geometryList[6].material.color.set('#fff');
            baseg.geometryList[7].material.color.set('#fff');
            this.selectedObject = baseg.geometryList[4];
            break;
          case 3:
            baseg.geometryList[1].material.color.set('#fff');
            baseg.geometryList[2].material.color.set('#fff');
            baseg.geometryList[3].material.color.set('#fff');
            baseg.geometryList[4].material.color.set('#fff');
            baseg.geometryList[5].material.color.set('#fff');
            baseg.geometryList[6].material.color.set('#69f');
            baseg.geometryList[7].material.color.set('#fff');
            this.selectedObject = baseg.geometryList[6];
            break;
          case 4:
            baseg.geometryList[1].material.color.set('#fff');
            baseg.geometryList[2].material.color.set('#fff');
            baseg.geometryList[3].material.color.set('#fff');
            baseg.geometryList[4].material.color.set('#fff');
            baseg.geometryList[5].material.color.set('#fff');
            baseg.geometryList[6].material.color.set('#fff');
            baseg.geometryList[7].material.color.set('#69f');
            this.selectedObject = baseg.geometryList[7];
            break;
        }
      }
      else if (this.model.robot.state.info.xarm_axis === 6) {
        switch (newValue) {
          case 1:
            baseg.geometryList[1].material.color.set('#fff');
            baseg.geometryList[2].material.color.set('#69f');
            baseg.geometryList[3].material.color.set('#69f');
            baseg.geometryList[4].material.color.set('#fff');
            baseg.geometryList[5].material.color.set('#fff');
            baseg.geometryList[6].material.color.set('#fff');
            baseg.geometryList[7].material.color.set('#fff');
            this.selectedObject = baseg.geometryList[2];
            break;
          case 2:
            baseg.geometryList[1].material.color.set('#fff');
            baseg.geometryList[2].material.color.set('#fff');
            baseg.geometryList[3].material.color.set('#fff');
            baseg.geometryList[4].material.color.set('#69f');
            baseg.geometryList[5].material.color.set('#fff');
            baseg.geometryList[6].material.color.set('#fff');
            baseg.geometryList[7].material.color.set('#fff');
            this.selectedObject = baseg.geometryList[4];
            break;
          case 3:
            baseg.geometryList[1].material.color.set('#fff');
            baseg.geometryList[2].material.color.set('#fff');
            baseg.geometryList[3].material.color.set('#fff');
            baseg.geometryList[4].material.color.set('#fff');
            baseg.geometryList[5].material.color.set('#69f');
            baseg.geometryList[6].material.color.set('#fff');
            baseg.geometryList[7].material.color.set('#fff');
            this.selectedObject = baseg.geometryList[5];
            break;
          case 4:
            baseg.geometryList[1].material.color.set('#fff');
            baseg.geometryList[2].material.color.set('#fff');
            baseg.geometryList[3].material.color.set('#fff');
            baseg.geometryList[4].material.color.set('#fff');
            baseg.geometryList[5].material.color.set('#fff');
            baseg.geometryList[6].material.color.set('#69f');
            baseg.geometryList[7].material.color.set('#fff');
            this.selectedObject = baseg.geometryList[6];
            break;
          case 5:
            baseg.geometryList[1].material.color.set('#fff');
            baseg.geometryList[2].material.color.set('#fff');
            baseg.geometryList[3].material.color.set('#fff');
            baseg.geometryList[4].material.color.set('#fff');
            baseg.geometryList[5].material.color.set('#fff');
            baseg.geometryList[6].material.color.set('#fff');
            baseg.geometryList[7].material.color.set('#69f');
            this.selectedObject = baseg.geometryList[7];
            break;
        }
      }
      if (newValue === -1) {
        this.selectedObject = null;
      }
      this.three.selectedChange = true;
      // if (this.three.selectedObject) {
      //   this.three.selectedObject.material.color.set('#fff');
      //   this.three.selectedChange = true;
      // }
      // if (this.model.robot.state.local.selectJointIndex !== -1) {
      //   this.three.selectedObject = baseg.geometryList[this.model.robot.state.local.selectJointIndex + 1];
      //   this.three.selectedObject.material.color.set('#69f');
      //   this.three.selectedChange = true;
      // }
    },
    control(newValue) {
      // console.log('watch posi print:');
      console.table(newValue);
    },
    size(newValue) {
      const sizeArray = this.getRenderSize()
      // console.log('watch new size', newValue, sizeArray)
      if (sizeArray !== null) {
        if (this.three.renderer) {
          this.three.renderer.setSize(...sizeArray)
        }
        if (this.three.camera) {
          const halfSize = sizeArray.map(value => value / SCENE_ZOOM);
          this.three.camera.left = -halfSize[0];
          this.three.camera.right = halfSize[0];
          this.three.camera.top = halfSize[1];
          this.three.camera.bottom = -halfSize[1];
          // camera.aspect = this.getCameraAspect();
          this.three.camera.updateProjectionMatrix();
        }
      }
    },
    shouldLoad() {
      this.createRobotModel()
      // if (this.model.robot.state.local.selectJointIndex === -1) {
      //   this.model.robot.state.local.selectJointIndex = 0;
      //   this.three.selectedObject = baseg.geometryList[this.model.robot.state.local.selectJointIndex + 1];
      //   window.controls.enableRotate = false;
      //   // window.controls.enableDamping = false;
      //   // window.controls.enableZoom = false;
      //   this.three.selectedObject.material.color.set('#69f');
      //   this.three.selectedChange = true;
      // }
    },
    // robotJointsAngle() {
    //   this.$set(this.robotJointsAngle, 0, this.robotJointsAngle[0]);
    // },
  },
  computed: {
    isTcpTab: {
      get() {
        return this.model.commonStatusMgr.controlPanel.tab.index === this.model.commonStatusMgr.controlPanel.tab.TCP;
      }
    },
    controlsParams() {
      const params = {
        enableDrag: true, // 是否支持拖动
        enableRotate: true, // 是否可旋转
        rotateSpeed: 1, // 旋转速度
        enableDamping: true, // 是否有惯性
        dampingFactor: 1, // 惯性系数
        autoRotate: false, // 是否自动旋转
        autoRotateSpeed: 2.0, // 自动旋转速度
        enableZoom: true, // 是否可以缩放
        zoomSpeed: 0.5, // 缩放速度
        maxZoom: 10, // 最大放大倍数
        minZoom: 10, // 最大缩放倍数
        enablePan: false, // 是否开启右键拖拽
        keyPanSpeed: 7.0, // 右键拖拽速度
        minPolarAngle: 0, // 垂直方向上的最小视角(弧度)
        maxPolarAngle: Math.PI, // 垂直方向上的最大视角(弧度)
        minAzimuthAngle: -Infinity, // 水平方向上最小视角(弧度) 
        maxAzimuthAngle: Infinity, // 水平方向上最大视角(弧度)
      };
      if (this.slotProps !== undefined && this.slotProps.controlsParams !== undefined) {
        Object.assign(params, this.slotProps.controlsParams);
      }
      return params;
    },
    selectJointIndex() {
      return this.model.robot.state.local.selectJointIndex;
    },
    selectPosIndex() {
      return this.model.robot.state.local.selectPosIndex;
    },
    notAllLock() {
      return this.model.robot.state.local.jointLocks.some((item) => {
      return item === false });
    },
    shouldLoad() {
      return this.$store.state.geometry.preloaded
    },
    localJoints: {
      get() {
        const arr = this.$store.getters.localJoints;
        // console.log('get ax', arr);
        if (arr && (arr.length === 7)) {
          const values = arr.map(str => Number(str));
          // console.log('arr posi print:', values.length);
          // console.table(values);
          this.test = values[1];
          return values.slice();
        }
        return [0, 0, 0, 0, 0, 0, 0];
      },
      set(value) {
        console.log('SET');
        console.table(value);
      },
    },
    online() {
      return this.$store.state.robot.info.online === true;
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      resizeTick: true,
      container: null,
      isDown: false,
      isMove: false,
      interval: null,
      curPos: {
        x: 0, 
        y: 0,
        dx: 0,
        dy: 0,
        ex: 0,
        ey: 0,
      },
      test: null,
      testtest: 0,
      config: {
        debugMax: 200,
        debugMin: -300,
        jointMax: window.GlobalUtil.model.robot.state.range.joint[0].max,
        jointMin: window.GlobalUtil.model.robot.state.range.joint[0].min,
        step: 0.1,
        offsetY: -5,
      },
      options: [0, 1, 2, 3, 4, 5, 6, 7],
      select: 7,
      state: {
        speed: 50,
        acceleration: 50,
        online: false,
        joint: {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
        },
        rott: 5,
        test: {
          x: 0,
          y: 0,
          z: 0,
          jx: 0,
          jy: 0,
          jz: 0,
          scale: 1,
        },
      },
      msg: 'Emulator',
      three: {
        scene: null,
        groups: null,
        render: null,
        camera: null,
        controls: null,
        raycaster: null,
        mouseVector: null,
        selectedObject: null,
        selectedChange: false,
      },
      loading: null,
      lastJoints: null,
      quit: false,
      azimuthalAngle: 0,
      polarAngle: 0,
      camZoom: 1,
      transformControlsParams: {
        base: {
          scale: {
            x: 2,
            y: 2,
            z: 2,
          }
        },
        end: {
          scale: {
            x: 1,
            y: 1,
            z: 1,
          }
        },
      }
    };
  },
  mounted() {
    if (this.shouldLoad) {
      this.createRobotModel();
    }
    if (this.model.robot.state.local.selectJointIndex !== -1) {
      this.three.selectedObject = baseg.geometryList[this.model.robot.state.local.selectJointIndex + 1];
      // window.controls.enableRotate = false;
      // window.controls.enableDamping = false;
      // window.controls.enableZoom = false;
    }
    this.model.robot.state.func.resetXarmModel = () => {
      this.resetXarmModel();
    }
  },
  activated() {
    // const sizeArray = this.getRenderSize();
    // this.three.renderer.setSize(...sizeArray);
    setTimeout(() => {
      if (this.$route.name === 'Paint') {
        this.model.robot.state.local.selectJointIndex = -1;
      }
    })
  },
  beforeDestroy() {
    this.quit = true;
    if (this.three.scene) {
      this.three.scene.remove();
      this.three.scene.remove(this.three.groups[0]);
    }
    window.removeEventListener('resize', this.onWindowResize, false)
    // if (this.container !== undefined && this.container !== null) {
    //   this.container.removeEventListener("mousedown", this.onDown);
    //   this.container.removeEventListener("touchstart", this.onDown);

    //   this.container.removeEventListener("mousemove", this.onMove);
    //   this.container.removeEventListener("touchmove", this.onMove);
      
    //   this.container.removeEventListener("touchend", this.onUp);
    //   this.container.removeEventListener("mouseup", this.onUp);
    // }
    // // this.container.removeEventListener( "mouseout", this.onUp);
    // // this.container.removeEventListener( "touchcancel", this.onUp);
    // // this.container.removeEventListener( "touchleave", this.onUp);
    // // document.body.removeEventListener("touchend", this.onUp);
    // // document.body.removeEventListener("mouseup", this.onUp);
    // // this.three.scene.remove(this.three.groups[0]);
  },
  activated() {
    this.onWindowResize()
    window.addEventListener('resize', this.onWindowResize, false)
  },
  deactivated() {
    window.removeEventListener('resize', this.onWindowResize, false)
  },
  methods: {
    resetXarmModel() {
      if (window.controls) {
        window.controls.minPolarAngle = Math.PI / 2;
        window.controls.maxPolarAngle = Math.PI / 2;
        window.controls.minAzimuthAngle = 0;
        window.controls.maxAzimuthAngle = 0;
        window.controls.reset();
        window.controls.minPolarAngle = 0;
        window.controls.maxPolarAngle = Math.PI;
        window.controls.minAzimuthAngle = -Infinity;
        window.controls.maxAzimuthAngle = Infinity;
      }
    },
    createRobotModel() {
      // this.loading = this.$loading({
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)',
      // });
      // console.log(materialList);
      this.three.raycaster = window.raycaster || new THREE.Raycaster();
      window.raycaster = this.raycaster;
      this.three.mouseVector = window.mouseVector || new THREE.Vector3();
      window.mouseVector = this.three.mouseVector;
      const scene = window.scene || new THREE.Scene();
      window.scene = scene;
      // console.log(this.three.scene, scene);
      scene.background = window.background || new THREE.Color(0xffffff); // c0c0c0
      window.background = scene.background;
      // const camera = new THREE.PerspectiveCamera(105, this.getCameraAspect(), 0.1, 1000);
      let sizeArray = this.getRenderSize();
      if (sizeArray === null) {
        sizeArray = this.getRenderSize();
      }
      console.log('get size', sizeArray)
      const halfSize = sizeArray.map(value => value / SCENE_ZOOM);
      const camera = window.camera || new THREE.OrthographicCamera(-halfSize[0], halfSize[0], halfSize[1], -halfSize[1], -50, 50);
      window.camera = camera;
      this.three.camera = camera
      // camera.position.z = -50;
      // camera.up = new THREE.Vector3(-1, -1, -1);
      camera.position.set(3, 1, 3); // camera position
      camera.lookAt(scene.position); // camera look at
      // const light = window.light || new THREE.PointLight(0xffffff, 1, 100); // light
      // window.light = light;
      // light.position.set(5, 14, 20);
      // const lightBottomBack = window.lightBottomBack || new THREE.PointLight(0xffffff, 1, 100); // light
      // window.lightBottomBack = lightBottomBack;
      // const lightBottomFront = window.lightBottomFront || new THREE.PointLight(0xeeeeee, 1, 100); // light
      // window.lightBottomFront = lightBottomFront;
      // lightBottomBack.position.set(-12, 0, 0);
      // lightBottomFront.position.set(22, 0, -10);
      // scene.add(lightBottomBack);
      // scene.add(lightBottomFront);
      // scene.add(light);

      const light1 = window.light1 || new THREE.PointLight(0xffffff, 1, 100);
      light1.position.set(0, 0, 30);
      const light2 = window.light2 || new THREE.PointLight(0xffffff, 1, 50);
      light2.position.set(0, 0, -40);
      const light3 = window.light3 || new THREE.PointLight(0xffffff, 1, 100);
      light3.position.set(-20, 20, -10);
      const light4 = window.light4 || new THREE.PointLight(0xffffff, 1, 100);
      light4.position.set(20, -20, -10);
      const light5 = window.light5 || new THREE.PointLight(0xffffff, 1, 50);
      light5.position.set(0, 40, -10);
      window.light1 = light1;
      window.light2 = light2;
      window.light3 = light3;
      window.light4 = light4;
      window.light5 = light5;
      scene.add(light1);
      scene.add(light2);
      scene.add(light3);
      scene.add(light4);
      scene.add(light5);

      // camera.position.set(25, 25, 25);
      const renderer = window.renderer || new THREE.WebGLRenderer({ antialias: true });
      window.renderer = renderer;
      this.three.renderer = renderer
      const controls = window.controls || new OrbitControls(camera, renderer.domElement);
      this.three.controls = controls;
      window.controls = controls;

      const baseTransformControls = window.baseTransformControls || new TransformControls(camera, renderer.domElement);
      window.baseTransformControls = baseTransformControls;
      baseTransformControls.setMode( "translate" )
      baseTransformControls.position.set(...[0, -5, 0])
      baseTransformControls.scale.set(...[this.transformControlsParams.base.scale.x, this.transformControlsParams.base.scale.y, this.transformControlsParams.base.scale.z]);
      baseTransformControls.rotation.x = Math.PI / 2;
      baseTransformControls.rotation.y = Math.PI;
      baseTransformControls.rotation.z = -Math.PI / 2;
      // baseTransformControls.visible = false;
      scene.add(baseTransformControls);
      // // load Transform Controls
      // setTimeout(() => {
      //   baseTransformControls.dispose();
      //   baseTransformControls.attach(baseg.geometryList[0]);
      // }, 500)

      // const endTransformControls = window.endTransformControls || new TransformControls(camera, renderer.domElement);
      // window.endTransformControls = endTransformControls;
      // endTransformControls.setMode( "translate" )
      // endTransformControls.setSpace("world")
      // // endTransformControls.setMode( "rotate" )
      // // endTransformControls.position.set(...[0.2, -2.75, -3.85])
      // // endTransformControls.position.set(...[0.2826805727156696, -12.443021215969168 + 9.7, -3.8543922924643814])
      // // endTransformControls.scale.set(...[0.18, 0.18, 0.18]);
      // endTransformControls.rotation.x = -Math.PI / 2;
      // endTransformControls.rotation.y = Math.PI;
      // endTransformControls.rotation.z = Math.PI / 2;
      // endTransformControls.dispose();
      // endTransformControls.attach(baseg.geometryList[7]);
      // transformControls.visible = true;
      // scene.add(endTransformControls);

      // 是否可旋转
      const controlsParams = this.controlsParams;
      controls.enableRotate = controlsParams.enableRotate;
      controls.rotateSpeed = controlsParams.rotateSpeed;
      
      // 使动画循环使用时阻尼或自转，意思是否有惯性
      controls.enableDamping = controlsParams.enableDamping;
      // 动态阻尼系数，就是鼠标拖拽灵敏度
      controls.dampingFactor = controlsParams.dampingFactor;
      
      // 是否自动旋转
      controls.autoRotate = controlsParams.autoRotate;
      controls.autoRotateSpeed = controlsParams.autoRotateSpeed;
      
      // 是否可以缩放
      controls.enableZoom = controlsParams.enableZoom;
      controls.zoomSpeed = controlsParams.zoomSpeed;
      controls.maxZoom = controlsParams.maxZoom;
      controls.minZoom = 1 / controlsParams.minZoom;
      
      // 是否开启右键拖拽
      controls.enablePan = controlsParams.enablePan; // disable keyboard camera control
      controls.keyPanSpeed = controlsParams.keyPanSpeed;


      // 固定初始视角
      controls.minPolarAngle = Math.PI / 2;
      controls.maxPolarAngle = Math.PI / 2;
      controls.minAzimuthAngle = 0;
      controls.maxAzimuthAngle = 0;

      controls.update();
      // renderer.setSize(...sizeArray);
      this.container = document.getElementById('emulator-container')
      this.container.appendChild(renderer.domElement);
      // new THREE.CylinderGeometry(0.5, 0.5, 2, 4, 4);
      // load first model
      const base = baseg.geometryList[0]
      window.baseg = baseg;
      // base = new THREE.Mesh(baseg.geometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
      window.setTimeout(() => {
        // const position = [7.66, 0.04 + this.config.offsetY, -0.86];
        const position = [7.66, 0.04 + this.config.offsetY, -0.04];
        base.position.set(...position);
        this.setDiff(base);
        base.rotation.z = this.valueToRotation(-6.5);
        scene.add(base)
      }, 0)
      const groups = window.groups || [];
      const localJoints = [];
      // const geometry1 = new THREE.CylinderGeometry(0.3, 0.3, 1, 4, 4);
      // localJoints[0] = new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial({ color: 0x4B0082 }));
      // const geometry7 = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 4, 4);
      // localJoints[7] = new THREE.Mesh(geometry7, new THREE.MeshPhongMaterial({ color: 0xffffff }));
      // scene.add(localJoints[0]);
      if (groups.length === 0) {
        for (let i = 0; i < 7; i += 1) {
          groups[i] = new THREE.Group();
        }
      }
      this.three.groups = groups;
      window.groups = groups;
      // groups[6].add(localJoints[7]);
      // let startSleepTime = new Date().getTime();
      const getAngle = () => {
        let angle_values = this.localJoints.concat();
        if (this.model.robot.state.info.xarm_axis === 5) {
          angle_values[6] = angle_values[4];
          angle_values[5] = angle_values[3];
          angle_values[3] = angle_values[2];
          angle_values[2] = 0;
          angle_values[4] = 0;
        }
        else if (this.model.robot.state.info.xarm_axis === 6) {
          angle_values[6] = angle_values[5];
          angle_values[5] = angle_values[4];
          angle_values[4] = angle_values[3];
          angle_values[3] = angle_values[2];
          angle_values[2] = 0
        }
        return angle_values;
      }
      const animate = () => {
        if (this.quit) {
          return
        }
        baseTransformControls.position.set(...[0, -5, 0])
        baseTransformControls.scale.set(...[this.transformControlsParams.base.scale.x, this.transformControlsParams.base.scale.y, this.transformControlsParams.base.scale.z]);
        const angles = getAngle();

        if (camera.zoom !== this.camZoom || controls.getAzimuthalAngle() !== this.azimuthalAngle || controls.getPolarAngle() !== this.polarAngle || this.three.selectedChange) {
          // console.log(`zoom: ${camera.zoom}, getAzimuthalAngle: ${controls.getAzimuthalAngle()}, getPolarAngle: ${controls.getPolarAngle()}`);
          controls.update();
          renderer.render(scene, camera);
          this.camZoom = camera.zoom;
          this.azimuthalAngle = controls.getAzimuthalAngle();
          this.polarAngle = controls.getPolarAngle();
          this.three.selectedChange = false;
        }
        if (this.lastJoints === angles && this.isDown === false) {
          // if (new Date().getTime() - startSleepTime > 5000) {
          //   setTimeout(animate, 1000)
          // }
          // else {
          //   requestAnimationFrame(animate);
          // }
          requestAnimationFrame(animate);
          return
        }
        if (this.isSet) {
          requestAnimationFrame(animate);
          return
        }
        if (this.model.robot.state.local.isSetJoint) {
          requestAnimationFrame(animate);
          return;
        }
        controls.update();
        renderer.render(scene, camera);
        // groups[0].rotation.z = this.valueToRotation(angles[0] + 45);
        groups[0].rotation.z = this.valueToRotation(angles[0] - 1);
        groups[1].rotation.x = -this.valueToRotation(angles[1] - 1);
        groups[2].rotation.z = this.valueToRotation(angles[2] + 4.2);
        groups[3].rotation.x = -this.valueToRotation(angles[3] + 90);
        groups[4].rotation.y = this.valueToRotation(angles[4] + 1);
        groups[5].rotation.x = -this.valueToRotation(angles[5] - 89);
        groups[6].rotation.z = this.valueToRotation(angles[6] + 100);

        // // let position = baseg.geometryList[7].getWorldPosition();
        // // // position.x = position.x - 4.4444444;
        // // // position.y = position.y - 2.7777777;
        // // // position.z = position.z - 8.3333333;
        // // endTransformControls.position.set(...[position.x * 0.05, position.y * 0.21, position.z * 0.3])
        // endTransformControls.scale.set(...[1.0, 1.0, 1.0]);
        // endTransformControls.position.set(...[0, 0, 0])

        // if (this.$store.state.robot.info.online) {
        //   endTransformControls.visible = true;
        //   let orientation = this.model.robot.state.remote.orientation;
        //   // endTransformControls.rotation.x = -this.valueToRotation(orientation.pitch) - Math.PI / 2;
        //   // endTransformControls.rotation.y = -this.valueToRotation(orientation.roll);
        //   // endTransformControls.rotation.z = Math.PI / 2 - this.valueToRotation(orientation.yaw);
        //   endTransformControls.quaternion.setFromEuler(new THREE.Euler(
        //     -this.valueToRotation(orientation.pitch) - Math.PI / 2,
        //     this.valueToRotation(orientation.roll),
        //     -this.valueToRotation(orientation.yaw) + Math.PI / 2,
        //     'XYZ'
        //   ))
        // }
        // else {
        //   endTransformControls.visible = false;
        // }
        
        controls.update();
        renderer.render(scene, camera);
        this.lastJoints = angles;
        // startSleepTime = new Date().getTime();
        requestAnimationFrame(animate);
        // groups[this.select].rotation.set(this.state.test.jx, this.state.test.jy, this.state.test.jz);
        // base.position.set(this.state.test.x, this.state.test.y, this.state.test.z);
        // base.rotation.set(this.state.test.jx, this.state.test.jy, this.state.test.jz);
        // base.scale.set(this.state.test.scale, this.state.test.scale, this.state.test.scale);
        // if (groups[this.select]) {
        //   groups[this.select].position.set(this.state.test.x, this.state.test.y, this.state.test.z);
        // }
        // if (localJoints[this.select + 1]) {
        //   localJoints[this.select + 1].position.set(this.state.test.jx, this.state.test.jy, this.state.test.jz);
        // }
      };
      const addMesh = (index, geometry) => {
        return new Promise((resolve) => {
          // localJoints[index] = new THREE.Mesh(geometry, materialList[index - 1]);
          localJoints[index] = geometry;
          localJoints[index].position.set(...JOINT_POSITION[index]);
          if (index < 7) {
            groups[index - 1].add(localJoints[index], groups[index]);
          }
          else {
            groups[index - 1].add(localJoints[index]);
          }
          groups[index - 1].position.set(...GROUP_POSITION[index - 1]);
          resolve()
        })
      }
      const loadModel = (index) => { // model index: 1-6
        // return new Promise((resolve) => {
        // })
        if (index < 8) {
          addMesh(index, baseg.geometryList[index])
          window.setTimeout(() => {
            console.log(`NO.${index} mesh loaded.`, baseg.geometryList[index]);
            // const mesh = new THREE.Mesh(baseg.geometryList[index], materialList[index - 1]);
            loadModel(index + 1); // load next model
          }, 0)
        }
        else {
          console.log('loading all');
          this.setDiff(groups[0]);
          groups[0].position.y += this.config.offsetY;
          // window.GlobalUtil.xarm = groups[0];
          scene.add(groups[0]);
          // load Transform Controls
          setTimeout(() => {
            baseTransformControls.dispose();
            baseTransformControls.attach(baseg.geometryList[0]);
          }, 100)
          animate();
          renderer.render(scene, camera);
          // this.loading.close(); // hide loading overlay
        }
      };
      loadModel(1);
      const gridplaneSize = 50;
      const gridstep = 30;
      const gridcolor = 0xdddddd; // e27347
      const gridHelper_xy = window.gridHelper_xy || new THREE.GridHelper(gridplaneSize, gridstep, gridcolor, gridcolor);
      window.gridHelper_xy = gridHelper_xy;
      gridHelper_xy.position.set(0, this.config.offsetY, 0);
      // gridHelper_xy.setColors(new THREE.Color(gridcolor), new THREE.Color(gridcolor));
      scene.add(gridHelper_xy);
      // const axisHelper = window.axisHelper || new THREE.AxesHelper(5);
      // window.axisHelper = axisHelper;
      // axisHelper.position.y = this.config.offsetY;
      // axisHelper.rotation.x = Math.PI / 2;
      // axisHelper.rotation.y = Math.PI;
      // axisHelper.rotation.z = -Math.PI / 2;
      // scene.add(axisHelper);
      // // this.changeJoint(this.select);
      this.onWindowResize()
      window.addEventListener('resize', this.onWindowResize, false)
      // this.container.addEventListener("mousedown", this.onDown, false );
      // this.container.addEventListener("touchstart", this.onDown, false );
      
      // this.container.addEventListener("mousemove", this.onMove, true);
      // this.container.addEventListener("touchmove", this.onMove, true);

      // this.container.addEventListener("touchend", this.onUp, false);
      // this.container.addEventListener("mouseup", this.onUp, false);
      // this.container.addEventListener( "mouseout", this.onLeave, false);
      // this.container.addEventListener( "touchcancel", this.onLeave, false);
      // // this.container.addEventListener( "touchleave", this.onUp, false);
      // // document.body.addEventListener("touchend", this.onUp, false);
      // // document.body.addEventListener("mouseup", this.onUp, false);
      
      controls.minPolarAngle = controlsParams.minPolarAngle;
      controls.maxPolarAngle = controlsParams.maxPolarAngle;
      controls.minAzimuthAngle = controlsParams.minAzimuthAngle;
      controls.maxAzimuthAngle = controlsParams.maxAzimuthAngle;
    },
    onWindowResize() {
      this.three.camera.aspect = window.innerWidth / window.innerHeight;
      this.three.camera.updateProjectionMatrix();
      this.three.renderer.setSize( window.innerWidth, window.innerHeight);
      if (this.resizeTick) {
        requestAnimationFrame(this.updateWindow)
        this.resizeTick = false;
        setTimeout(() => {
          window.controls.update();
          window.renderer.render(window.scene, window.camera);
        }, 50);
      }
    },
    setJoints(callback) {
      const self = this;
      this.isSet = true;
      this.model.robot.state.local.isSetJoint = true;
      this.model.robot.state.func.setRobotMoveAllJoints(this.localJoints, true, (dict) => {
        self.isSet = false;
        this.model.robot.state.local.isSetJoint = false;
        if (dict.code === -6) {
          if (this.$store.state.robot.info.online) {
            this.model.robot.state.local.joints = this.model.robot.state.remote.joints;
          }
          this.$message({
            message: self.$t('cannotArriveTip'),
            type: 'info',
            duration: 1000,
          })
        }
        if (callback) {
          callback();
        }
      });
    },
    onLeave() {
      if (this.$route.name === 'Paint') {
        this.model.robot.state.local.selectJointIndex = -1;
        return;
      }
      if (this.model.localTeach.isTeachRunningUUID !== '') {
        return;
      }
      if (window.Blockly.Running) {
        return;
      }
      console.log('debug: leave')
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      if (this.isDown) {
        this.localJoints[this.model.robot.state.local.selectJointIndex] = this.dragJointAngle;
        this.model.robot.state.local.joints = this.localJoints.concat();
      }
      this.isDown = false;
      this.isDrag = false;
      // window.controls.enableRotate = this.controlsParams.enableRotate;
    },
    onUp() {
      if (this.$route.name === 'Paint') {
        this.model.robot.state.local.selectJointIndex = -1;
        return;
      }
      if (this.model.localTeach.isTeachRunningUUID !== '') {
        return;
      }
      if (window.Blockly.Running) {
        return;
      }
      console.log('debug: up')
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      this.isDown = false;
      this.isDrag = false;
      window.controls.enableRotate = this.controlsParams.enableRotate;
      // setTimeout(() => {
      //   window.controls.enableRotate = this.controlsParams.enableRotate;
      //   window.controls.enableDamping = this.controlsParams.enableDamping;
      //   window.controls.enableZoom = this.controlsParams.enableZoom;
      // }, 1000);
      // window.controls.enableRotate = this.controlsParams.enableRotate;
      // window.controls.enableDamping = this.controlsParams.enableDamping;
      // window.controls.enableZoom = this.controlsParams.enableZoom;
      // console.log('debug:', this.localJoints);
      if (this.online) {
        const self = this;
        if (this.model.robot.state.local.isSetJoint) {
          return;
        }
        if (this.notAllLock && this.model.robot.state.local.selectJointIndex != -1 && this.isMove) {
          this.$message({
            message: self.$t('isAllLockTip'),
            type: 'info',
            duration: 1000,
          })
          this.localJoints[this.model.robot.state.local.selectJointIndex] = this.dragJointAngle;
          this.model.robot.state.local.joints = this.localJoints.concat();
          return;
        }
        if (this.isMove) {
          this.setJoints(() => {
            self.isMove = false;
          });
        }
      }
    },
    onMove(event) {
      // if (event.touches) {
      //   this.touch = event.touches[0];
      // }
      // else {
      //   this.touch = event;
      // }
      if (event.changedTouches) {
        this.touch = event.changedTouches[0];
      }
      else {
        this.touch = event;
      }
      if (this.model.robot.state.local.isSetJoint) {
        return;
      }
      if (this.isDown && this.isDrag && this.controlsParams.enableDrag === true && this.three.selectedObject && this.model.localTeach.isTeachRunningUUID === '') {
        // if (this.three.controls.getPolarAngle() > 1.64) {
        //   return;
        // }
        // console.log('debug: move');
        const nx = this.touch.clientX - this.curPos.x;//记录在鼠标|手指x轴移动的数据
        const ny = this.touch.clientY - this.curPos.y;//记录在鼠标|手指y轴移动的数据
        // // console.log('debug:', nx, ny, this.three.controls.getPolarAngle());
        // let x = this.curPos.dx + nx; //div在x轴的偏移量加上鼠标|手指在x轴移动的距离
        // let y = this.curPos.dy + ny; //div在y轴的偏移量加上鼠标|手指在y轴移动的距离
        const max = this.model.robot.state.range.joint[this.model.robot.state.local.selectJointIndex].max;
        const min = this.model.robot.state.range.joint[this.model.robot.state.local.selectJointIndex].min;
        this.localJoints[this.model.robot.state.local.selectJointIndex] = Number(Math.max(Math.min(nx + this.curPos.dx, max), min)).toFixed(1);
        this.model.robot.state.local.joints = this.localJoints.concat();
        // if ([0, 2, 6].includes(this.model.robot.state.local.selectJointIndex)) {
        //   // this.model.robot.state.local.joints[this.model.robot.state.local.selectJointIndex] = x;
        //   this.localJoints[this.model.robot.state.local.selectJointIndex] = Number(Math.max(Math.min(nx + this.curPos.dx, max), min)).toFixed(1);
        //   this.model.robot.state.local.joints = this.localJoints.concat();
        // }
        // else if ([1, 3, 5].includes(this.model.robot.state.local.selectJointIndex)) {
        //   // this.model.robot.state.local.joints[this.model.robot.state.local.selectJointIndex] = y;
        //   this.localJoints[this.model.robot.state.local.selectJointIndex] = Number(Number(Math.max(Math.min(-ny + this.curPos.dy, max), min)).toFixed(1));
        //   this.model.robot.state.local.joints = this.localJoints.concat();
        // }
        // else if([4].includes(this.model.robot.state.local.selectJointIndex)) {
        //   // this.model.robot.state.local.joints[this.model.robot.state.local.selectJointIndex] = -x;
        //   this.localJoints[this.model.robot.state.local.selectJointIndex] = Number(Math.max(Math.min(-nx + this.curPos.dx, max), min)).toFixed(1);
        //   this.model.robot.state.local.joints = this.localJoints.concat();
        // }
        this.isMove = true;
        //阻止页面的滑动默认事件
        document.addEventListener("touchmove",function(){
          event.preventDefault();
        }, false);
        this.model.localTeach.hasChange = true;
      }
    },
    onDown(event) {
      if (this.$route.name === 'Paint') {
        this.model.robot.state.local.selectJointIndex = -1;
        return;
      }
      if (this.model.localTeach.isTeachRunningUUID !== '') {
        return;
      }
      if (window.Blockly.Running) {
        return;
      }
      // console.log('debug: down');
      event.preventDefault();
      this.isDrag = false;
      if (event.changedTouches) {
        this.touch = event.changedTouches[0];
      }
      else {
        this.touch = event;
      }
      this.model.commonStatusMgr.panelIsHidden = true;

			const intersects = this.getIntersects( event.layerX, event.layerY );
			if ( intersects.length > 0 ) {
				const res = intersects.filter((res) => {
					return res && res.object;
        })[0];
        if (res && res.object) {
          let timeout = 200;
          const selectedObject = this.three.selectedObject;
          if (this.model.robot.state.local.isSetJoint) {
            return;
          }
          let newIndex = baseg.geometryList.indexOf(res.object);
          if (this.model.robot.state.info.xarm_axis === 5) {
            newIndex = newIndex === 3 ? 2 : newIndex;
            newIndex = newIndex === 4 ? 3 : newIndex;
            newIndex = newIndex === 5 ? 3 : newIndex;
            newIndex = newIndex === 6 ? 4 : newIndex;
            newIndex = newIndex === 7 ? 5 : newIndex;
          }
          else if (this.model.robot.state.info.xarm_axis === 6) {
            newIndex = newIndex === 3 ? 2 : newIndex;
            newIndex = newIndex === 4 ? 3 : newIndex;
            newIndex = newIndex === 5 ? 4 : newIndex;
            newIndex = newIndex === 6 ? 5 : newIndex;
            newIndex = newIndex === 7 ? 6 : newIndex;
          }
          if ( this.three.selectedObject ) {
            const oldIndex = baseg.geometryList.indexOf(this.three.selectedObject)
            if (newIndex != oldIndex) {
              this.model.robot.state.local.selectJointIndex = -1;
            }
            // else {
            //   timeout = 0;
            // }
            this.three.selectedObject = null;
            this.isSet = false;
            this.model.robot.state.local.isSetJoint = false;
            window.controls.enableRotate = this.controlsParams.enableRotate;
          }
          this.isDown = true;
          const pos = {
            x: this.touch.clientX,
            y: this.touch.clientY,
          }
          // this.model.robot.state.local.selectJointIndex = baseg.geometryList.indexOf(res.object) - 1;
          this.model.robot.state.local.selectJointIndex = newIndex - 1;
          this.three.selectedChange = true;
          if (this.interval) {
            clearInterval(this.interval);
          }
          this.interval = setTimeout(() => {
            if (Math.abs(this.touch.clientX - pos.x) > 10 || Math.abs(this.touch.clientY - pos.y) > 10) {
              // if (selectedObject) {
              //   this.model.robot.state.local.selectJointIndex = -1;
              // }
              this.three.selectedObject = null;
              this.isSet = false;
              this.model.robot.state.local.isSetJoint = false;
              window.controls.enableRotate = this.controlsParams.enableRotate;
              this.isDrag = false;
              return;
            }
            this.isDrag = true;
            this.dragJointAngle = this.localJoints[this.model.robot.state.local.selectJointIndex];
            // this.three.selectedObject = res.object;
            this.three.selectedObject = baseg.geometryList[newIndex];
            this.isSet = false;
            this.model.robot.state.local.isSetJoint = false;
            this.curPos.x = this.touch.clientX;
            this.curPos.y = this.touch.clientY;
            this.curPos.dx = this.container.offsetLeft + this.localJoints[this.model.robot.state.local.selectJointIndex];
            this.curPos.dy = this.container.offsetTop + this.localJoints[this.model.robot.state.local.selectJointIndex];
            window.controls.enableRotate = false;
          }, timeout);
				}
				// if (res && res.object) {
        //   // const index = baseg.geometryList.indexOf(res.object) - 1;
        //   // if (index === this.model.robot.state.local.selectJointIndex && this.three.selectedObject) {
        //   //   this.three.selectedObject.material.color.set('#fff');
        //   //   this.three.selectedObject = null;
        //   //   this.three.selectedChange = true;
        //   //   this.model.robot.state.local.selectJointIndex = -1;
        //   // }
        //   // else {
        //   //   if (this.three.selectedObject) {
        //   //     this.three.selectedObject.material.color.set('#fff');
        //   //   }
        //   //   this.three.selectedObject = res.object;
        //   //   this.three.selectedObject.material.color.set('#69f');
        //   //   this.three.selectedChange = true;
        //   //   this.model.robot.state.local.selectJointIndex = index;
        //   // }
				// 	this.three.selectedObject = res.object;
        //   this.three.selectedObject.material.color.set('#69f');
        //   this.three.selectedChange = true;
        //   this.model.robot.state.local.selectJointIndex = baseg.geometryList.indexOf(this.three.selectedObject) - 1;
        //   // console.log('debug select:', baseg.geometryList.indexOf(this.three.selectedObject));
        //   // if (event.touches) {
        //   //   this.touch = event.touches[0];
        //   // }
        //   // else {
        //   //   this.touch = event;
        //   // }
        //   this.isDown = true;
        //   this.isSet = false;
        //   this.model.robot.state.local.isSetJoint = false;
        //   // console.log('debug getAzimuthalAngle:', window.controls.getAzimuthalAngle())
        //   // console.log('debug getPolarAngle:', window.controls.getPolarAngle())
        //   this.curPos.x = this.touch.clientX;
        //   this.curPos.y = this.touch.clientY;
        //   this.curPos.dx = this.container.offsetLeft + this.localJoints[this.model.robot.state.local.selectJointIndex];
        //   this.curPos.dy = this.container.offsetTop + this.localJoints[this.model.robot.state.local.selectJointIndex];
        //   window.controls.enableRotate = false;
        //   // window.controls.enableDamping = false;
        //   // window.controls.enableZoom = false;
				// }
      }
      else {
        this.model.robot.state.local.selectJointIndex = -1;
        // if ( this.three.selectedObject ) {
        //   this.three.selectedObject.material.color.set('#fff');
        //   this.three.selectedObject = null;
        //   this.three.selectedChange = true;
        //   this.isDown = false;
        //    this.three.selectedObject = null;
        //   this.three.selectedChange = true;
        //   // window.controls.enableDamping = true;
        //   // window.controls.enableZoom = true;
        // }
      }
    },
    getIntersects(x, y) {
      const sizeArray = this.getRenderSize();
      if (sizeArray !== null) {
        x = ( x / sizeArray[0]) * 2 - 1;
        y = - ( y / sizeArray[1]) * 2 + 1;
        // x = ( x / window.innerWidth ) * 2 - 1;
        // y = - ( y / window.innerHeight ) * 2 + 1;
        this.three.mouseVector.set( x, y, 0.5 );
        this.three.raycaster.setFromCamera(this.three.mouseVector, this.three.camera);
        return this.three.raycaster.intersectObject(window.groups[0], true);
      }
    },
    updateWindow() {
      const sizeArray = this.getRenderSize();
      if (sizeArray !== null) {
        this.three.renderer.setSize(...sizeArray);
        const halfSize = sizeArray.map(value => value / SCENE_ZOOM);
        this.three.camera.left = -halfSize[0];
        this.three.camera.right = halfSize[0];
        this.three.camera.top = halfSize[1];
        this.three.camera.bottom = -halfSize[1];
        // camera.aspect = this.getCameraAspect();
        this.three.camera.updateProjectionMatrix();
        this.resizeTick = true
      }
    },
    // getCameraAspect() {
    //   if (this.size) {
    //     return (window.innerWidth / window.innerHeight) * (this.size.width / this.size.height);
    //   }
    //   return 1 / 0.52; // default
    // },
    getRenderSize() {
      const rootDiv = document.getElementById('model-wrapper');
      if (rootDiv === null || rootDiv === undefined) {
        return null;
      }
      let height;
      // console.log('size', this.size, rootDiv.clientHeight, rootDiv.clientWidth)
      if (this.size) {
        height = this.size;
      }
      else {
        height = rootDiv.clientHeight; // rootDiv.clientWidth * 0.52;
      }
      // const height = rootDiv.clientWidth / this.getCameraAspect();
      // const height = rootDiv.clientWidth * 0.52;
      return [rootDiv.clientWidth, height];
    },
    setDiff(mesh) {
      const STL_DIFF = {
        rotation: [-1.5708, 0, 0],
        scale: [0.18, 0.18, 0.18],
      };
      mesh.rotation.set(...STL_DIFF.rotation);
      mesh.scale.set(...STL_DIFF.scale);
    },
    changeJoint(value) {
      this.state.test.jx = JOINT_POSITION[value + 1][0];
      this.state.test.jy = JOINT_POSITION[value + 1][1];
      this.state.test.jz = JOINT_POSITION[value + 1][2];
      this.state.test.x = GROUP_POSITION[value][0];
      this.state.test.y = GROUP_POSITION[value][1];
      this.state.test.z = GROUP_POSITION[value][2];
    },
    valueToRotation(value) {
      return (value * Math.PI) / 180;
    },
  },
  components: {
    CommonPositionView,
  },
  // testtest: {
  //   get() {
  //     return this.$store.state.robot.info.test;
  //   },
  //   set(value) {
  //     this.$store.commit('test', value);
  //   },
  // },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.hello-row {
  display: inline-block;
  height: 100%;
}
.block {
  width: 30%;
  padding: 0.2vw 1vw;
  display: inline-block;
}
span.text {
  display: block;
  float: left;
}
#emulator-overlay {
  position: absolute;
}
#emulator-container > *{
  border-radius: 8px;
}
#model-wrapper {
  /* box-shadow: 0 0 6px 0 rgba(205,205,205,0.50); */
  -webkit-box-shadow: none;
}
</style>
