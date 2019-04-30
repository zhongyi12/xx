<template>
  <div class="dialog-content">

     <div class="tab-wrapper">
       <span @click="isJointTab = true" :style="{'margin-left': showSideBtn === true && model.commonStatusMgr.showToggleBtn === true ? '50px' : '0'}" :class="{'tab-selected': isJointTab}">
         {{ $t('joints') }}
         <i v-if="isJointTab" class="el-icon-caret-bottom"></i>
       </span>
       <span @click="isTcpTab = true" :class="{'tab-selected': isTcpTab}"> {{ $t('tcp') }}<i v-if="isTcpTab" class="el-icon-caret-bottom"></i></span>
       <span @click="isAccessoryTab = true" :class="{'tab-selected': isAccessoryTab}"> {{ $t('accessories') }}<i v-if="isAccessoryTab" class="el-icon-caret-bottom"></i></span>
       <span @click="isSettingTab = true" :class="{'tab-selected': isSettingTab}"> {{ $t('settings') }}<i v-if="isSettingTab" class="el-icon-caret-bottom"></i></span>
     </div>

    <!-- <div class="top-bar" v-if="isShowClose"> -->
      <!--<span class="top-title"></span>-->


      <!--<toggle-button style="position:absolute;left:10px;top:10px;" v-model="isTcpTab" :color="{checked: '#52BF53', unchecked: '#52BF53'}" :sync="true"-->
        <!--:labels="{checked: 'TCP', unchecked: 'Joints'}"-->
        <!--:width="100" :height="30"/>-->



      <!-- <toggle-button
        v-if="isTcpTab === false" v-model="isAllJointsLock" style="position:absolute;left:120px;top:10px;" :color="{checked: '#52BF53', unchecked: '#D3D5DB'}" :sync="true"
        :labels="{checked: 'All Locks', unchecked: 'All unlocks'}"
        :width="100" :height="30"/> -->
      <!--<button v-if="isTcpTab === false" :disabled="jointRangeDisable || stateOnline === false" @click="onAllLock" class="lock-btn">Locks</button>-->
      <div  class="dialog-close" @click="closeMyself">
      </div>
  
    <div class="range-wrapper" v-if="isTcpTab || isJointTab">
      <div class="single-range-wrapper">
        <div class="range-number" :style="{'margin-top': isTcpTab ? '-14px' : '0px'}">
          <!-- <span>180</span>
          <span>0</span>
          <span>-180</span> -->
          <!-- <span style="width: 30px; color: #90721e;">{{ getRange().max + getRange().unit }}</span> -->
          <span style="width: 30px; color: #0771de;">{{ getRange().max }}<span style="font-size: 13px;">{{ getRange().unit }}</span></span>
          <span style="width: 30px;"></span>
          <!-- <span style="width: 30px; color: #90721e;">{{ getRange().min + getRange().unit }}</span> -->
          <span style="width: 30px; color: #0771de;">{{ getRange().min }}<span style="font-size: 13px;">{{ getRange().unit }}</span></span>
        </div>
        <template v-for="(param, index) in isTcpTab ? tcpParams : jointParams">
          <div v-if="index < model.robot.state.info.xarm_axis || isTcpTab" class="setting-line" :class="{'selected-line': localSelectedIndex === index && (isJointTab || stateOnline)}" :key="index" @click="selectJoints(index)" :style="{'margin-top': isTcpTab ? '18px' : '32px'}">
            <span class="left-title" :style="{color: isTcpTab && param.name === 'x' ? '#FF0000' : isTcpTab && param.name === 'y' ? '#00FF00' : isTcpTab && param.name === 'z' ? '#0000FF': ''}">
              {{ param.name }}
            </span>
            <toggle-button
              class="lock-toggle"
              @change="onLock(index)"
              :disabled="disableAxis || stateOnline === false || jointRangeDisable || positionRangeDisable || moveIndex != 0 || localSelectedIndex !== index"
              v-if="isJointTab"
              style="font-size: 10px;position:absolute;" :color="{checked: '#52BF53', unchecked: '#D3D5DB'}"
              v-model="model.robot.state.local.jointLocks[index]"
              :sync="true"
              :labels="{checked: $t('lock'), unchecked: $t('unlock')}"
              :width="60" :height="20" />
           

            <input
              v-model="param.value"
              type="range"
              :min="param.name === 'roll' && param.min !== param.max ? param.min * 2 : param.min"
              :max="param.name === 'roll' && param.min !== param.max ? param.max * 2 : param.max"
              step="0.1"
              value="0"
              class="range-input"
              :style="{width: model.robot.state.info.xarm_axis === 5 && isJointTab ? '240%' : model.robot.state.info.xarm_axis === 6  && isJointTab ? '280%' : '320%'}"
              @mousedown="onDown(index)"
              @touchstart="onDown(index)"
              @mouseup="onUp(index)"
              @touchend="onUp(index)"
              @change="sendCmd(index)"
              :disabled="disableAxis || jointRangeDisable || positionRangeDisable || isParamsOut || moveIndex != 0 || (stateOnline && isNotAllLock) || localSelectedIndex !== index"
              :class="{ 'out-params-range': param.isOutRange, 'select-joint-range': localSelectedIndex === index && !param.isOutRange && !disableAxis}">
              <input 
                v-if="param.name === 'roll'"
                class="number-input-value"
                :class="{ 'out-params-number': param.isOutRange, 'select-joint-number': localSelectedIndex === index && !param.isOutRange}"
                :disabled="disableAxis || jointRangeDisable || positionRangeDisable || isParamsOut || moveIndex != 0 || (stateOnline && isNotAllLock) || localSelectedIndex !== index || model.commonStatusMgr.isMobile"
                type="number"
                :min="param.min"
                :max="param.max"
                :step="0.1"
                v-model="rollValue"
                @blur="focusRoll = false;sendCmd(index)"
                @focus="focusRoll = true;">
              <input 
                v-else
                class="number-input-value"
                :class="{ 'out-params-number': param.isOutRange, 'select-joint-number': localSelectedIndex === index && !param.isOutRange}"
                :disabled="disableAxis || jointRangeDisable || positionRangeDisable || isParamsOut || moveIndex != 0 || (stateOnline && isNotAllLock) || localSelectedIndex !== index || model.commonStatusMgr.isMobile"
                type="number"
                :min="param.min"
                :max="param.max"
                :step="0.1"
                v-model="param.value"
                @blur="sendCmd(index)">
              <!-- <input
                v-model="param.value"
                type="range"
                :min="param.min"
                :max="param.max"
                step="0.1"
                value="0"
                @mousedown="onDown(index)"
                @touchstart="onDown(index)"
                @mouseup="onUp(index)"
                @touchend="onUp(index)"
                @change="sendCmd(index)"
                :disabled="jointRangeDisable || positionRangeDisable || isParamsOut || moveIndex != 0 || (stateOnline && isNotAllLock) || localSelectedIndex !== index"
                class="range-input"
                :class="{ 'out-params-range': param.isOutRange, 'select-joint-range': localSelectedIndex === index && !param.isOutRange && !disableAxis}">
              <input 
                class="number-input-value"
                :class="{ 'out-params-number': param.isOutRange, 'select-joint-number': localSelectedIndex === index && !param.isOutRange}"
                :disabled="jointRangeDisable || positionRangeDisable || isParamsOut || moveIndex != 0 || (stateOnline && isNotAllLock) || localSelectedIndex !== index || model.commonStatusMgr.isMobile"
                type="number"
                :min="param.min"
                :max="param.max"
                :step="0.1"
                v-model="param.value"
                @blur="sendCmd(index)"> -->
              <!-- <span class="range-input-value">{{ Number(param.value).toFixed(1) }}</span> -->
              <div class="change-input-value-wrapper" v-if="localSelectedIndex === index">
                <span class="" style="margin-right: 10px;margin-top: 3px;line-height: 24px;">
                  {{ param.name }} :
                </span>
                <template v-for="index2 in [0, 1, 2, 3, 4, 5, 6, 7]">
                  <div class="change-input-value" @click="changeIndex(index, index2)" :key="index2">
                    <div class="input-per-number-style border-number border-arrow" @click="moveArrow(false, index, param.selectedIndex)" v-if="index2 === 0"><i style="font-size: 18px;margin-top: 5px;" class="el-icon-caret-left"></i></div>
                    <!-- <div class="input-per-number-style border-number-transparent" v-if="index2 === 1">{{ param.value < 0 ? '-' : '+' }} </div> -->
                    <div class="input-per-number-style border-number-transparent" v-if="index2 === 1">{{ checkValueSigns(isTcpTab ? index : param.value) }} </div>
                    <div class="input-per-number-style border-number-notselect" v-if="index2 === 2">{{ showInputDotValue2(param.value, index, 0) }}</div>
                    <div class="input-per-number-style border-number" :class="{ 'selected-cell-bg': param.selectedIndex === 3}" v-if="index2 === 3"> {{ showInputDotValue2(param.value, index, 1) }}</div>
                    <div class="input-per-number-style border-number" :class="{ 'selected-cell-bg': param.selectedIndex === 4}" v-if="index2 === 4"> {{ showInputDotValue2(param.value, index, 2) }} </div>
                    <div class="input-per-number-style border-number-transparent" v-if="index2 === 5">.</div>
                    <div class="input-per-number-style border-number" :class="{ 'selected-cell-bg': param.selectedIndex === 6,  }" v-if="index2 === 6">{{ showInputDotValue2(param.value, index, 3) }}</div>
                    <div class="input-per-number-style border-number border-arrow" @click="moveArrow(true, index, param.selectedIndex)" v-if="index2 === 7"><i style="font-size: 18px;margin-top: 5px;" class="el-icon-caret-right"></i></div>
                  </div>
                </template>
                
              </div>
             
            <!-- <div class="position-absolute" style="left:110px;margin-top:5px;width:160px;height:30px;display:flex;"> -->
              <!-- <template v-for="index2 in [0, 1, 2, 3, 4, 5, 6, 7]"> -->
                <!-- <div v-if="isTcpTab && (index === 0 || index === 1 || index === 2)">
                  <span class="range-number-tip" style="left: -100px;">-999.9</span>
                  <span class="range-number-tip" style="left: -36px;">-470</span>
                  <span class="range-number-tip"  style="left: 28px;">0</span>
                  <span class="range-number-tip"  style="right: 63px;">470</span>
                  <span class="range-number-tip"  style="right: 0px;">999.9</span>
                </div>
                <div v-else>
                  <span class="range-number-tip" style="left: -100px;">-180</span>
                  <span class="range-number-tip" style="left: -36px;">-90</span>
                  <span class="range-number-tip"  style="left: 28px;">0</span>
                  <span class="range-number-tip"  style="right: 63px;">90</span>
                  <span class="range-number-tip"  style="right: 0px;">180</span>
                </div> -->
                <!-- <div style="width:20px;height:30px;border-radius:2px;" @click="changeIndex(index, index2)" :key="index2">
                  <div class="input-per-number-style border-number" @click="moveArrow(false, index, param.selectedIndex)" v-if="index2 === 0"><i class="el-icon-caret-left"></i></div>
                  <div class="input-per-number-style border-number-transparent" v-if="index2 === 1">{{ param.value < 0 ? '-' : '+' }}</div>
                  <div class="input-per-number-style border-number-transparent" v-if="index2 === 2">{{ showInputDotValue(param.value, 0) }}</div>
                  <div class="input-per-number-style border-number" :class="{ 'selected-cell-bg': param.selectedIndex === 3}" v-if="index2 === 3">
                    {{ showInputDotValue(param.value, 1) }}
                  </div>
                  <div class="input-per-number-style border-number" :class="{ 'selected-cell-bg': param.selectedIndex === 4}" v-if="index2 === 4">
                    {{ showInputDotValue(param.value, 2) }}
                  </div>
                  <div class="input-per-number-style border-number-transparent" v-if="index2 === 5">.</div>
                  <div class="input-per-number-style border-number" :class="{ 'selected-cell-bg': param.selectedIndex === 6,  }" v-if="index2 === 6">
                    {{ showInputDotValue(param.value, 3) }}
                  </div>
                  <div class="input-per-number-style border-number" @click="moveArrow(true, index, param.selectedIndex)" v-if="index2 === 7"><i class="el-icon-caret-right"></i></div>
                </div>
              </template> -->
            <!-- </div>
          </div> -->
          <!-- <div class="input-numbers"> -->

            <!-- <template v-for="index2 in [0, 1, 2, 3]"> -->

              <!-- <span v-if="param.value < 0" class="position-absolute" style="left:3px;margin-top:8px;font-size:10px;color:#FFFFFF;">-</span> -->
              <!-- <div class="input-per-number" :style="{left: 10 + 30 * index2 + 'px'}"> -->
                <!-- <div v-if="index2 === 1 || index2 === 2 || index2 === 3" class="arrow-size" style="left:-1px;top:-16px;" @click="moveArrow(true, index, index2)">
                  <div class="arrow arrow-top"></div>
                </div> -->
                <!-- <div v-if="index2 === 1 || index2 === 2 || index2 === 3" class="arrow-size" style="left:-1px;top:3px;" @click="moveArrow(false, index, index2)">
                  <div class="arrow arrow-bottom"></div>
                </div> -->
                <!-- {{ showInputDotValue(param.value, index2) }} -->
              <!-- </div> -->
              <!-- <span v-if="index2 === 3" class="position-absolute dot" :style="{left: + 10 + 30 * index2 - 7 + 'px'}"></span> -->
            <!-- </template> -->
            <!-- <span class="unit">
              {{ (index > 2 || !isTcpTab) ? $t('control.degree') : $t('control.millimeter') }}
            </span> -->
          </div>
        </template>
        </div>
        <common-speed-setting :isTcpTab="isTcpTab"></common-speed-setting>
      </div>
      <!-- <common-speed-setting v-if="isAccessoryTab === true"></common-speed-setting> -->
      <div class="range-wrapper" v-if="isAccessoryTab === true">
        <common-accessories></common-accessories>
      </div>
      <div class="range-wrapper" v-if="isSettingTab === true">
        <common-settings></common-settings>
      </div>
    </div>
  </div>
</template>

<script>
import CommonSpeedSetting from '../common/CommonSpeedSetting';
import CommonAccessories from '../common/CommonAccessories';
import CommonSettings from '../common/CommonSettings';
import { join } from 'path';
const model = window.GlobalUtil.model;
export default {
  props: ['isShowClose', 'showSideBtn'],
  i18n: {
    messages: {
      en: {
        lock: 'lock',
        unlock: 'unlock',
        joints: 'Joints',
        tcp: 'Cartesian',
        speed: 'Speed',
        accessories: 'Accessories',
        settings: 'Settings',
        cannotArriveTip: 'In the current stance, the xArm cannot go to the specified location.',
        outRangeTip: 'Some joints exceed the specified value. Please manually adjust the joint to the specified range after unlocking the joint',
        isNotAllLockTip: 'xArm is not ready, please check all joints are locked',
      },
      cn: {
        lock: '锁住',
        unlock: '解锁',
        joints: '关节',
        tcp: '坐标',
        speed: '速度',
        accessories: '配件',
        settings: '设置',
        cannotArriveTip: '当前姿态下，机械臂不能去到指定地方。',
        outRangeTip: '关节超出规定值, 请解锁关节后手动调整到规定范围',
        isNotAllLockTip: 'xArm 没准备好，请检查所有关节是否已锁',
      },
    },
  },
  data() {
    return {
      model: window.GlobalUtil.model,
      resetInterval: null,
      curInputValue: 50,
      moveIndex: 0,
      focusRoll: false,
      roll: 180,
      isMoveArrow: false,
      selectedJointIndex: window.GlobalUtil.model.robot.state.local.selectJointIndex,
      counts: [0, 1, 2, 3, 4],
      tcpParams: [
        { name: 'x', max: model.robot.state.range.position.x.max, min: model.robot.state.range.position.x.min, value: 0, selectedIndex: 4, unit: 'mm' },
        { name: 'y', max: model.robot.state.range.position.y.max, min: model.robot.state.range.position.y.min, value: 0, selectedIndex: 4, unit: 'mm' },
        { name: 'z', max: model.robot.state.range.position.z.max, min: model.robot.state.range.position.z.min, value: 0, selectedIndex: 4, unit: 'mm' },
        { name: 'roll', max: model.robot.state.range.orientation.roll.max, min: model.robot.state.range.orientation.roll.min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'pitch', max: model.robot.state.range.orientation.pitch.max, min: model.robot.state.range.orientation.pitch.min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'yaw', max: model.robot.state.range.orientation.yaw.max, min: model.robot.state.range.orientation.yaw.min, value: 0, selectedIndex: 4, unit: '°' },
      ],
      jointParams: [
        { name: 'J1', max: model.robot.state.range.joint[0].max, min: model.robot.state.range.joint[0].min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'J2', max: model.robot.state.range.joint[1].max, min: model.robot.state.range.joint[1].min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'J3', max: model.robot.state.range.joint[2].max, min: model.robot.state.range.joint[2].min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'J4', max: model.robot.state.range.joint[3].max, min: model.robot.state.range.joint[3].min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'J5', max: model.robot.state.range.joint[4].max, min: model.robot.state.range.joint[4].min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'J6', max: model.robot.state.range.joint[5].max, min: model.robot.state.range.joint[5].min, value: 0, selectedIndex: 4, unit: '°' },
        { name: 'J7', max: model.robot.state.range.joint[6].max, min: model.robot.state.range.joint[6].min, value: 0, selectedIndex: 4, unit: '°' },
      ],
     isParamsOut: false,
    }
  },
  mounted() {
    console.log('reset Params');
    this.resetParams();
    this.model.robot.state.func.setLocalJoints = (points) => {
      this.setLocalJoints(points);
    };
    this.model.robot.state.func.resetParams = () => {
      console.log('reset Params');
      this.resetParams();
    };
    this.checkParamsRangeOut()
    console.log('this.isParamsOut', this.isParamsOut);
  },
  beforeDestroy() {
    this.model.robot.state.local.selectJointIndex = this.selectedJointIndex;
  },
  methods: {
    getRange() {
      if (this.isTcpTab) {
        if (this.model.robot.state.local.selectPosIndex !== -1) {
          return this.tcpParams[this.model.robot.state.local.selectPosIndex];
        }
        else {
          return {max: '', min: '', unit: ''};
        }
      }
      else {
        if (this.model.robot.state.local.selectJointIndex !== -1) {
          return this.jointParams[this.model.robot.state.local.selectJointIndex];
        }
        else {
          return {max: '', min: '', unit: ''};
        }
      }
    },
    onDown(index) {
      console.log('debug down');
      if (this.isTcpTab) {
        this.model.robot.state.local.selectPosIndex = index;
      }
      else {
        this.model.robot.state.local.selectJointIndex = index;
        this.selectedJointIndex = index;
      }
    },
    onUp(index) {
    },
    selectJoints(index) {
      if (this.model.localTeach.isTeachRunningUUID && this.model.localTeach.isTeachRunningUUID.length > 0) {
        return;
      }
      if (this.isTcpTab) {
        this.model.robot.state.local.selectPosIndex = index;
      }
      else {
        this.model.robot.state.local.selectJointIndex = index;
        this.selectedJointIndex = index;
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // setTempJointsValue(values) {
    //   for (let i = 0; i < 7; i += 1) {
    //     this.jointParams[i].value = Number(values[i] || 0);
    //   }
    // },
    changeIndex(index, index2) {
      console.log(`changeIndex index = ${index}, value = ${index2}`);
      if ([3, 4, 6].includes(index2)) {
        const param = this.isTcpTab === true ? this.tcpParams : this.jointParams;
        param[Number(index)].selectedIndex = Number(index2);
      }
    },
    onAllLock() {
      window.CommandsRobotSocket.setServoLock(true, null, (response) => {
        console.log(response);
        if (response.code !== 0) {
          this.model.robot.state.local.jointLocks = this.model.robot.state.remote.jointLocks.concat();
        }
      });
    },
    onLock(index) {
      if (!this.jointRangeDisable) {
        console.log('index = ' + index + ', value = ' + this.model.robot.state.local.jointLocks[index]);
        const value = this.model.robot.state.local.jointLocks[index];
        window.CommandsRobotSocket.setServoLock(value, index + 1, (response) => {
          console.log(response);
          setTimeout(() => {
            this.model.robot.state.local.jointLocks = this.model.robot.state.remote.jointLocks.concat();
          }, 500);
          // if (response.code !== 0) {
          //   this.model.robot.state.local.jointLocks = this.model.robot.state.remote.jointLocks.concat();
          // }
        });
      }
    },
    setLocalJoints(points) {
      this.model.robot.state.local.joints = points.concat();
      for (let i = 0; i < 7; i += 1) {
        this.jointParams[i].value = points[i] || 0;
      }
    },
    resetParams() {
      if (this.moveIndex != 8) {
        this.tcpParams[0].value = this.model.robot.state.local.position.x || 0;
      }
      if (this.moveIndex != 9) {
        this.tcpParams[1].value = this.model.robot.state.local.position.y || 0;
      }
      if (this.moveIndex != 10) {
        this.tcpParams[2].value = this.model.robot.state.local.position.z || 0;
      }
      if (this.moveIndex != 11) {
        this.tcpParams[3].value = this.model.robot.state.local.orientation.roll || 0;
      }
      if (this.moveIndex != 12) {
        this.tcpParams[4].value = this.model.robot.state.local.orientation.pitch || 0;
      }
      if (this.moveIndex != 13) {
        this.tcpParams[5].value = this.model.robot.state.local.orientation.yaw || 0;
      }
      for (let i = 0; i < 7; i += 1) {
        if (this.stateOnline === true) {
          if (this.moveIndex != i + 1 && this.model.robot.state.local.isSetJoint === false) {
            this.jointParams[i].value = this.model.robot.state.remote.joints[i] || 0;
          }
        }
        else {
          this.jointParams[i].value = this.model.robot.state.local.joints[i] || 0;
        }
      }
      // console.log(this.jointParams);
    },
    closeMyself() {
      this.model.robot.state.showSetControlValueDialog = false;
    },
    moveArrow(isAdd, controlIndex, numberIndex) {
      console.log(`moveArrow isAdd = ${isAdd}, controlIndex = ${controlIndex}, numberIndex = ${numberIndex}`);
      if (this.jointRangeDisable === true || this.positionRangeDisable === true) {
        return;
      }
      const params = this.isTcpTab === true ? this.tcpParams : this.jointParams;
      const beforeValue = Number(params[controlIndex].value);
      // const adding = numberIndex === 2 ? 1 : 0.1;
      let adding = 0;
      // if (numberIndex === 1) {
      //   adding = 10;
      // }
      // if (numberIndex === 2) {
      //   adding = 1;
      // }
      // else if (numberIndex === 3) {
      //   adding = 0.1;
      // }
      if (numberIndex === 3) {
        adding = 10;
      }
      if (numberIndex === 4) {
        adding = 1;
      }
      else if (numberIndex === 6) {
        adding = 0.1;
      }
      let afterValue = isAdd === true ? (beforeValue + adding) : (beforeValue - adding);
      afterValue = Math.max(Number(afterValue), Number(params[controlIndex].min));
      afterValue = Math.min(Number(afterValue), Number(params[controlIndex].max));
      params[controlIndex].value = afterValue;
      console.log(`move Arrow = beforeValue = ${beforeValue}, afterValue = ${afterValue}, adding = ${adding}`);
      this.isMoveArrow = true;
      this.sendCmd(controlIndex);
    },
    showInputDotValue(value, index) {
      const str = `0000${Math.round(Math.abs(Number(value * 100)))}`.slice(-5);
      return str[index];
    },
    checkValueSigns(index) {
      if (this.isTcpTab) {
        const tcpParams = [
          this.model.robot.state.remote.position.x,
          this.model.robot.state.remote.position.y,
          this.model.robot.state.remote.position.z,
          this.model.robot.state.remote.orientation.roll,
          this.model.robot.state.remote.orientation.pitch,
          this.model.robot.state.remote.orientation.yaw,
        ]
        return tcpParams[index] < 0 ? '-' : '+';
      }
      else {
        return index < 0 ? '-' : '+';
      }
    },
    showInputDotValue2(value, index1, index2) {
      if (this.isTcpTab) {
        const tcpParams = [
          this.model.robot.state.remote.position.x,
          this.model.robot.state.remote.position.y,
          this.model.robot.state.remote.position.z,
          this.model.robot.state.remote.orientation.roll,
          this.model.robot.state.remote.orientation.pitch,
          this.model.robot.state.remote.orientation.yaw,
        ]
        const str = `0000${Math.round(Math.abs(Number(tcpParams[index1] * 100)))}`.slice(-5);
        return str[index2];
      }
      else {
        const str = `0000${Math.round(Math.abs(Number(value * 100)))}`.slice(-5);
        return str[index2];
      }
    },
    sendCmd(index) {
      if(this.isParamsOut) {
        this.$message({
            message: this.$t('outRangeTip'),
            type: 'warning',
            duration: 1000,
          })
        return;
      }
      if (this.isNotAllLock === true) {
        console.log('this.onAllLock', this.isNotAllLock);
        this.onAllLock();
      }
      this.model.localTeach.hasChange = true;
      // this.model.robot.state.local.position.x = this.tcpParams[0].value;
      if (this.$store.state.robot.info.online === false) {
        return;
      }
      if (this.isTcpTab) {
        this.moveIndex = index + 8;
      }
      else {
        this.moveIndex = index + 1;
      }
      this.model.robot.state.local.isSetJoint = this.isMoveArrow === true ? false : true;
      this.model.robot.state.jointRangeEventTouch = true;
      if (this.isTcpTab === true) {
        this.model.robot.state.local.isSetJoint = false;
        const data = {};
        data.position = {};
        data.orientation = {};
        data.position.x = this.tcpParams[0].value || 0;
        data.position.y = this.tcpParams[1].value || 0;
        data.position.z = this.tcpParams[2].value || 0;
        // data.orientation.roll = this.tcpParams[3].value || 0;
        data.orientation.roll = this.rollValue || 0;
        data.orientation.pitch = this.tcpParams[4].value || 0;
        data.orientation.yaw = this.tcpParams[5].value || 0;
        window.CommandsRobotSocket.moveLine(data, true, (response) => {
          this.moveIndex = 0;
          this.isMoveArrow = false;
          this.model.robot.state.local.isSetJoint = false;
          console.log('roll 4 yaw socket res', response);
          if (response.code === -1) {
           this.$message({
              message: this.$t('isNotAllLockTip'),
              type: 'warning',
              duration: 1000,
              showClose: true,
            })
          }
          if (response.code === -6) {
              this.$message({
              message: this.$t('cannotArriveTip'),
              type: 'info',
              duration: 1000,
            })
            this.moveIndex = 0;
            this.model.robot.state.local.isSetJoint = false;
            // this.resetParams();
          }
          if (response.code !== 0) {
            console.log('reset Params');
            this.resetParams();
          }
        });
      }
      else {
        const points = this.jointParams.map((data) => {
          return data.value;
        });
        // this.model.robot.state.local.joints = points;
        console.log('points 1 = ' + points);
        window.CommandsRobotSocket.moveAllJoints(points, true, (dict) => {
          this.moveIndex = 0;
          this.isMoveArrow = false;
          this.model.robot.state.local.isSetJoint = false;
          console.log('moveAllJoints', dict);
          if (dict.code === -1) {
            this.$message({
              message: this.$t('isNotAllLockTip'),
              type: 'warning',
              duration: 1000,
              showClose: true,
            })
          }
          if (dict.code === -6) {
            console.log('reset Params');
            this.$message({
              message: this.$t('cannotArriveTip'),
              type: 'info',
              duration: 1000,
            })
            this.moveIndex = 0;
            this.model.robot.state.local.isSetJoint = false;
            this.resetParams();
          }
        });
      }
    },
    checkParamsRangeOut() {
      const params = this.isTcpTab === true ? this.tcpParams : this.jointParams;
      // console.log(' const params = this.isTcpTab === true ? this.tcpParams : this.jointParams;', params);
      let tempName = [];
      for (let i = 0; i < params.length; i++) {
       if (params[i].value > params[i].max || params[i].value < params[i].min) {
         tempName.push(params[i].name);
         params[i].isOutRange = true;
       }else {
          params[i].isOutRange = false;
       }
      };
      if (tempName.length > 0) {
        this.isParamsOut = true;
      }else {
         this.isParamsOut = false;
      }
    }
  },
  components: {
    CommonSpeedSetting,
    CommonAccessories,
    CommonSettings,
  },
  computed: {
    mode() {
      return this.model.robot.state.info.xarm_mode;
    },
    rollValue: {
      get() {
        if (!this.focusRoll) {
          let value = Number(this.tcpParams[3].value);
          if (value <= -180) {
            this.roll = (Number(value) + 360).toFixed(1);
          }
          else if (value > 180){
            this.roll = (Number(value) - 360).toFixed(1);
          }
          else {
            this.roll = Number(value).toFixed(1);
          }
        }
        return this.roll;
      },
      set(value) {
        this.roll = value;
        this.tcpParams[3].value = value;
      }
    },
    localSelectedIndex() {
      return this.isTcpTab ? this.model.robot.state.local.selectPosIndex : this.model.robot.state.local.selectJointIndex;
    },
    counter: {
      get() {
        return this.model.robot.state.counter;
      },
      set(value) {
        this.model.robot.state.counter = value;
      },
    },
    isJointTab: {
      get() {
        return this.model.commonStatusMgr.controlPanel.tab.index === this.model.commonStatusMgr.controlPanel.tab.JOINTS;
      },
      set(value) {
        if (this.model.commonStatusMgr.changeControlEditTab === false) {
          return;
        }
        if (value) {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.JOINTS;
        }
        else {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.TCP;
        }
      }
    },
    isTcpTab: {
      get() {
        return this.model.commonStatusMgr.controlPanel.tab.index === this.model.commonStatusMgr.controlPanel.tab.TCP;
      },
      set(value) {
        if (this.model.commonStatusMgr.changeControlEditTab === false) {
          return;
        }
        if (value) {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.TCP;
        }
        else {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.JOINTS;
        }
      }
    },
    isAccessoryTab: {
      get() {
        this.model.robot.state.local.speed = this.model.robot.state.remote.speed;
        this.model.robot.state.local.acceleration = this.model.robot.state.remote.acceleration;
        this.model.robot.state.local.angle_speed = this.model.robot.state.remote.angle_speed;
        this.model.robot.state.local.angle_acceleration = this.model.robot.state.remote.angle_acceleration;
        return this.model.commonStatusMgr.controlPanel.tab.index === this.model.commonStatusMgr.controlPanel.tab.ACCESSORY;
      },
      set(value) {
        if (this.model.commonStatusMgr.changeControlEditTab === false) {
          return;
        }
        if (value) {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.ACCESSORY;
        }
        else {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.JOINTS;
        }
      }
    },
    isSettingTab: {
      get() {
        return this.model.commonStatusMgr.controlPanel.tab.index === this.model.commonStatusMgr.controlPanel.tab.SETTING;
      },
      set(value) {
        if (this.model.commonStatusMgr.changeControlEditTab === false) {
          return;
        }
        if (value) {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.SETTING;
        }
        else {
          this.model.commonStatusMgr.controlPanel.tab.index = this.model.commonStatusMgr.controlPanel.tab.JOINTS;
        }
      }
    },
    jointRangeDisable() {
      const flag = this.model.robot.state.jointRangeMoving === true && this.stateOnline === true;
      // console.log('index1111-:', flag, this.moveIndex);
      // if (!flag) {
      //   this.moveIndex = 0;
      //   // this.resetParams()
      // }
      // console.log('debug:', flag, this.positionRangeDisable;
      return flag;
    },
    positionRangeDisable() {
      const flag1 = this.model.robot.state.jointRangeMoving === true && this.stateOnline === true;
      const flag2 = this.stateOnline === false && this.isTcpTab === true;
      // console.log('index2222:', flag1 || flag2, this.moveIndex);
      // if (!(flag1 || flag2)) {
      //   this.moveIndex = 0;
      //   // this.resetParams();
      // }
      // console.log('debug:', this.jointRangeDisable, flag1 || flag2);
      return flag1 || flag2;
      // return false;
    },
    stateOnline() {
      return this.$store.state.robot.info.online === true;
    },
    localJoints: {
      get() {
        const arr = this.$store.getters.localJoints;
        return arr;
      },
      set(value) {
        value.forEach((joint, index) => {
          this.jointParams[index].value = joint;
        })
      }
    },
    remoteJoints: {
      get() {
        const joints = this.$store.getters.remoteJoints;
        this.resetParams();
        return joints;
      },
    },
    remoteEnd: {
      get() {
        const end = this.$store.getters.end;
        this.resetParams();
        return end;
      }
    },
    tempEndStr: {
      get() {
        return this.tcpParams.map((data) => {
          return data.value;
        }).join(',');
      },
    },
    tempJointsStr: {
      get() {
        return this.jointParams.map((data) => {
          return Number(data.value).toFixed(1);
        }).join(',');
      },
    },
    jointRangeMoving: {
      get() {
        return this.model.robot.state.jointRangeMoving;
      },
    },
    isNotAllLock() {
      return this.model.robot.state.local.jointLocks.some((item) => {
      return item === false });
    },
    disableAxis() {
      if (this.isTcpTab) {
        return false;
      }
      else {
        if (this.selectedJointIndex > this.model.robot.state.info.xarm_axis - 1) {
          return true;
        }
        else {
          return false;
        }
      }
    },
    // isNotReady() {
    //   let isNotAllLock = this.model.robot.state.local.jointLocks.some((item) => {
    //     return item === false });
    //   return isNotAllLock && !this.model.robot.state.info.xarm_is_ready;
    // }
  },
  watch: {
    mode(newValue) {
      console.log('debug mode:', newValue);
    },
    tempJointsStr(newValue) {
      if (this.isMoveArrow === true && this.stateOnline === true) {
        return;
      }
      console.log('tempJointsStr newValue = ' + newValue);
      const joints = newValue.split(',').map((value) => {
        return Number(value).toFixed(1);
      });
      this.model.robot.state.local.joints = joints.concat();
      // if (this.stateOnline === false) {
      //   this.model.robot.state.local.joints = joints.concat();
      // }
    },
    tempEndStr(newValue) {
      // const tempArr = newValue.split(',').map((value) => {
      //   return Number(value);
      // }).concat();
      // this.model.robot.state.local.position = {
      //   x: tempArr[0],
      //   y: tempArr[1],
      //   z: tempArr[2],
      // };
      // this.model.robot.state.local.orientation = {
      //   roll: tempArr[3],
      //   yaw: tempArr[4],
      //   pitch: tempArr[5],
      // };
    },
    stateOnline(newValue) {
      if (newValue === true) {
        this.model.robot.state.func.remote2Local();
        console.log('reset Params');
        this.resetParams();
      }
    },
    remoteJoints(newValue) {
      // console.log('remoteJoints remoteJoints = ' + newValue);
      const jointLocks = this.model.robot.state.local.jointLocks;
      let isLock = true;
      jointLocks.forEach((item, index) => {
        if (item === false) {
          isLock = false;
          if (this.model.localTeach.jointRangeEventTouch === false) {
            if (this.stateOnline === true) {
              this.jointParams[index].value = this.model.robot.state.remote.joints[index] || 0;
            }
            else {
              this.jointParams[index].value = this.model.robot.state.local.joints[index] || 0;
            }
          }
        }
      });
      // for (let i = 0; i < 7; i += 1) {
      //   if (this.stateOnline === true) {
      //     this.jointParams[i].value = this.model.robot.state.remote.joints[i] || 0;
      //   }
      //   else {
      //     this.jointParams[i].value = this.model.robot.state.local.joints[i] || 0;
      //   }
      // }
      if (isLock === false) {
        if (this.stateOnline) {
          this.model.localTeach.hasChange = true;
        }
        this.resetParams();
      }
      // if (this.stateOnline === true && this.model.localTeach.editState === true && this.model.localTeach.jointRangeEventTouch === false) {
      //   this.resetParams();
      // }
      this.checkParamsRangeOut();
    },
    localJoints(newValue) {
      // console.log('localJoints = ', newValue, this.moveIndex);
      if (this.moveIndex === 0 && this.model.robot.state.local.isSetJoint === false) {
        this.localJoints = newValue;
      }
      if (this.model.robot.state.intervalInfo.curIntervals.length > 0) {
        console.log('reset Params');
        this.resetParams();
      }
      window.clearInterval(this.resetInterval);
      this.resetInterval = null;
      this.resetInterval = window.setInterval(() => {
        window.clearInterval(this.resetInterval);
        this.resetInterval = null;
        if (this.stateOnline === true) {
          // this.resetParams();
        }
      }, 2000);
    },
    jointRangeMoving(newValue) {
      console.log('jointRangeMoving ' + newValue);
      if (newValue === false) {
        if (this.stateOnline) {
          this.model.robot.state.func.remote2Local();
        }
        // this.model.robot.state.func.remote2Local();
        console.log('reset Params');
        // this.moveIndex = 0;
        this.model.robot.state.local.isSetJoint = false;
        this.resetParams();
        // this.checkParamsRangeOut();
      }
    },
    isTcpTab(newValue) {
      if (this.stateOnline === true) {
        // this.model.robot.state.func.remote2Local();
      }
      this.checkParamsRangeOut();
      // console.log('isTcpTab = ' + newValue);
      if (!(this.jointRangeDisable || this.positionRangeDisable)) {
        this.moveIndex = 0;
        this.model.robot.state.local.isSetJoint = false;
      }
      // this.resetParams();
    },
    isJointTab(newValue, oldValue) {
      if (newValue) {
        if (this.model.robot.state.local.selectJointIndex === -1) {
          this.model.robot.state.local.selectJointIndex = this.selectedJointIndex;
        }
        else {
          this.selectedJointIndex = this.model.robot.state.local.selectJointIndex;
        }
      }
      else {
        if (this.model.robot.state.local.selectJointIndex !== -1) {
          this.selectedJointIndex = this.model.robot.state.local.selectJointIndex;
          this.model.robot.state.local.selectJointIndex = -1;
        }
      }
    },
    counter(newValue) {
      console.log('counter = ' + newValue);
      console.log('reset Params');
      this.resetParams();
    },
  },
    // stateError(newValue) {
    //   if (newValue === -6) {
    //     window.GlobalUtil.model.robot.state.jointRangeMoving = false;
    //     window.GlobalUtil.model.robot.state.jointRangeEventTouch = false;
    //     this.resetParams();
    //     this.$message('unable to move 2.');
    //   }
    //   // if (newValue < 0) {
    //   //   this.$message('Fail to move');
    //   // }
    // },
}
</script>

<style scoped lang="scss">
/* $fontColor: #FFFFFF; */
$selectedColor:#0771de;
.out-range-message {
  width: 400px;
  height: 300px;
}
.dialog-content {
  // position: absolute;
  // width: 500px;
  width: 100%;
  // height: 100%;
  // height: 88%;
  /*top: 60px;*/
  // top: 10px;
  /*bottom: 0px;*/
  // right: 0px;
  z-index: 10;
  /*font-family: 'Gotham-Medium';*/
  color: #555;
  // margin-top: 28px;
  margin-top: 25px;
  // overflow: auto;
  // background: #fff;
  .tab-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid #e4e4e4;
    height: 46px;
    span {
      padding: 10px 0;
      // width: 100%;
      text-align: center;
      cursor: pointer;
    }
    .tab-selected {
      // background: #4d4d4d ;
      // background: #666;
      color: $selectedColor;
      position: relative;
      display: flex;
      font-size: 16px;
      justify-content: center;
      text-align: center;
      .el-icon-caret-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin-left: 0;
        margin-right: 0;
      }
    }
  }
  .top-bar {
    position: absolute;
    /* background: black; */
    /*background: #434343;*/
    width: 100%;
    height: 50px;
    line-height: 50px;
    /*background: #4d4d4d ;*/
  }
  .range-wrapper {
    position: relative;
    width:100%;
    // height:100%;
    /*top:36px;*/
    // background: #fff;
    // display: flex;
    // height: 370px;
  }
}
.top-title {
  position: absolute;
  left: 25px;
  /* top: 0px;
  bottom: 0px;
  margin: auto; */
  /*font-family: 'Gotham-Medium';*/
  font-size: 14px;
  letter-spacing: -0.78px;
}
.lock-btn {
  position:absolute;
  left: 150px;
  top: 10px;
  width: 50px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  /* border: 1px solid #DCDCDC; */
  border: 0;
  background: #52BF53;
  color:#fff;
  font-family: 'Gotham-Medium';
}
.lock-btn:disabled {
  cursor:not-allowed;
  opacity: 0.6;
}

.dialog-close {
  position: absolute;
  /* top: 15px; */
  right: 0px;
  width: 50px;
  height: 50px;
  color: #FFFFFF;
  text-align:center;
  /* line-height: 40px; */
  cursor: pointer;
  background-image: url('./../../assets/img/edit/recording/icon_close.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 16px 16px;
}
/* .btn-create {
  width: 100%;
  height: 40px;
  bottom: 0px;
  background: #52BF53;
  text-align: center;
  font-family: 'Gotham-Book';
  font-size: 14px;
  color: #FFFFFF;
  letter-spacing: -0.78px;
  line-height: 40px;
} */
.single-range-wrapper {
  display: flex;
  justify-content: space-around;
  width: 100%;
  // height: 344px;
  position: relative;
}
.range-number {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 356px;
}
.setting-line {
  // position: relative;
  // width: 100%;
  // height: 80px;
  // left: 0px;
  // top: 100px;
  // width:100%;
  // height:80px;
  padding: 5px 0;
  // width: 100px;
  // height: 300px;
  display: flex;
  margin-top: 32px;
  height: 290px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: .5;
  /* border-top: 1px solid #DCDCDC; */
  // border-bottom: 1px solid rgba(220, 220, 220, 0.1);
}
.setting-line:last-child {
  border-bottom: none;
}
.selected-line {
  opacity: 1;
  color: $selectedColor;
}
.left-title {
  position: absolute;
  top: 0;
  width: 20px;
  // left: 12px;
  height: 30px;
  line-height: 30px;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  letter-spacing: -0.43px;
  text-align: center;
}
.lock-toggle {
   position: absolute;
   top: 35px;

}
.retmote-value {
  // position: absolute;
  width: 40px;
  top: 30px;
  left: 10px;
  /* height: 30px; */
  /* line-height: 30px; */
  font-family: 'Gotham-Medium';
  font-size: 12px;
  /* color: #555555; */
  color: orange;
  letter-spacing: -0.43px;
  text-align: left;
}
input[type=range] {
  cursor: pointer;
}
input:disabled {
  cursor:not-allowed;
}
input[type=range]:focus {
  outline: none;
}
.range-input {
  // position: absolute;
  /* width: 120%; */
  // left: 14px;
  // margin-top: 44px;
  /* top: 12px; */
  // width: 255px;
  height: 2px;
  width: 320%;
  background: #878787;
  opacity: 1;
  border-radius: 150px;
  cursor: pointer;
  outline: none;
  transform: rotate(-90deg)
}
.range-input::-webkit-slider-thumb {
  /*width: 28px;*/
  /*height: 28px;*/
  /*background-image: url('./../../assets/img/control/btn_slide.svg');*/
  /*background-size: 55px 55px;*/
  /*background-repeat: no-repeat;*/
  /*background-position: center;*/
  /*-webkit-appearance: none;*/
  /*border: none;*/
  /*border-radius: 50%;*/
  /*outline: none;*/
  /*box-shadow: darkgrey 0px 0px 5px;*/
  width: 2px;
  height: 2px;
  -webkit-appearance: none;
  border: none;
  border-radius: 50%;
  background: #aaa;
}
.range-input-value {
  position: absolute;
  bottom: 30px;
}
.number-input-value {
  position: absolute;
  bottom: 30px;
  width: 60px;
  text-align: center;
  border-width: 0px;
}
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[type=number]{
    -moz-appearance: textfield;
}
input[type=number]:disabled {
  background: white;
}
.out-params-number {
  color: #e15151;
}
.select-joint-range::-webkit-slider-thumb {
  width: 25px;
  height: 25px;
}
.select-joint-number {
  color: #0771de;
}
.range-input-selected {
  background: $selectedColor;
}
.change-input-value-wrapper {
  position: absolute;
  bottom: -30px;
  display: flex;
  left: 126px;
  z-index: 999;
  color: $selectedColor;
}
// .change-input-value {
//   width:20px;
//   height:30px;
//   border-radius:2px;
// }
.range-number-tip {
  position: absolute;
  top: 54px;
  font-size: 10px;
  opacity: 0.1;
}
.input-numbers {
  position: absolute;
  width: 120px;
  height: 30px;
  left: 105px;
  margin-top: -70px;
  text-align: center;
  color: #4B4B4B;
}
.input-per-number {
  position: absolute;
  width: 20px;
  height: 10px;
  line-height: 10px;
  left: 270px;
  top: 10px;
  background: #FDFDFD;
  border: 1px solid #D7D7D7;
  border-radius: 2px;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  text-align: center;
  color: #4B4B4B;
  outline: none;
}
.input-per-number-style {
  font-family: 'Gotham-Medium';
  font-size: 12px;
  text-align: center;
  width: 30px;
  height: 30px;
  // color: white;
  /* background: gray; */
  line-height: 30px;
}
.border-number {
  // border: 1px solid #a3a3a3;
  border: 1px solid #aaa;
  border-radius: 2px;
  margin: 0 5px 0 0;
}
.border-number-notselect {
  margin: 0 5px 0 0;
}
.border-number-transparent {
  border: 1px solid transparent;
  border-radius: 2px;
  width: 10px;
}
.border-arrow {
  margin: 0 10px 0 10px;
}
.selected-cell-bg {
  // background: #a3a3a3;
  background: #aaa;
}
.out-params-range {
  background: #e15151;
}
.select-joint-range::-webkit-slider-thumb {
  width: 25px;
  height: 25px;
}
.select-joint-range {
  background: #69f;
}
.dot {
  position: absolute;
  width: 4px;
  height: 4px;
  top: 20px;
  /* background: black; */
  background: #FFFFFF;
  border-radius: 50%;
}
.arrow {
  position:absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin:auto;
  width:20px;
  height:10px;
  background: gray;
  background-position: center;
  background-size: 20px 10px;
  background-repeat: no-repeat;
  /* transform: rotate(90deg); */
  cursor: pointer;
}
.arrow-top {
  background-image: url('./../../assets/img/control/btn_toptriangle.svg');
  left:0px;
}
.arrow-bottom {
  background-image: url('./../../assets/img/control/btn_btmtriangle.svg');
}
.arrow-size {
  position: absolute;
  width: 20px;
  height: 20px;
}
.unit {
  position: absolute;
  width: 30px;
  left: 130px;
  height: 30px;
  line-height: 30px;
  font-family: 'Gotham-Medium';
  font-size: 12px;
  /* color: #555555; */
  color: #FFFFFF;
  letter-spacing: -0.43px;
  text-align: left;
}
input {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  outline: none;
}
</style>
