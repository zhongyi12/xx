import Vue from 'vue';
import * as types from './mutation-types';

export const openWebsocket = ({ commit }) => {
  // let i = 0;
  // const ti = setInterval(() => {
  //   commit('ROBOT_MOVE_JOINT', [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6]);
  //   i += 1;
  //   if (i > 170) {
  //     clearInterval(ti);
  //   }
  // }, 2000);
  window.GlobalUtil.socketCom.init_socket(window.GlobalUtil.socketInfo);
  window.GlobalUtil.socketCom.init_onopen(() => {
    console.log('onopen onopen onopen');
    // window.GlobalUtil.model.robot.info.connected = true;
    window.GlobalUtil.model.robot.state.info.socketConnected = true;
    const networkTip = window.GlobalUtil.model.language_manage.currentLang === 'en' ? 'Network is connected' : '网络已连接';
    Vue.prototype.$message({
      message: networkTip,
      duration: 2000,
    });
    window.GlobalUtil.socketCom.clean();
    // window.CommandsEditorSocket.listProjs((dict) => {
    //   console.log(dict);
    // });
    // window.CommandsTeachSocket.listProjs((dict) => {
    //   console.log(dict);
    // });
    // window.CommandsAppsSocket.listApps((dict) => {
    //   console.log(dict);
    // });
    // window.CommandsAppsSocket.listLocalApps((dict) => {
    //   console.log(dict);
    // });
    // window.CommandsPaintSocket.listProjs((dict) => {
    //   console.log(dict);
    // });
    window.CommandsSettingSocket.getInfo((dict) => {
      console.log(dict);
    });
    // commit(types.SET_ERROR, false);
  });
  window.GlobalUtil.socketCom.init_onclose((evt) => {
    console.log('onclose onclose, event:', evt);
    const networkTip = window.GlobalUtil.model.language_manage.currentLang === 'en' ? 'Network is disconnected' : '网络已断开';
    Vue.prototype.$message({
      message: networkTip,
      duration: 2000,
    })
    window.GlobalUtil.model.robot.state.info.socketConnected = false;
    window.GlobalUtil.model.robot.state.status.connected = false;
    window.GlobalUtil.model.robot.state.local.jointLocks = [false, false, false, false, false, false, false]
    window.Blockly.Running = false;
    window.Blockly.AppRunning = false;
    if (window.GlobalUtil.model.robot.state.info.online) {
      window.GlobalUtil.model.robot.state.info.lastOnline = window.GlobalUtil.model.robot.state.info.online;
    }
    window.GlobalUtil.model.robot.state.info.online = false;
  });
  window.GlobalUtil.socketCom.init_onerror((evt) => {
    window.GlobalUtil.model.robot.state.info.socketConnected = false;
    window.GlobalUtil.model.robot.state.status.connected = false;
    // commit(types.SET_ERROR, true);
    console.log(`onerror onerror onerror = ${evt.data}`);
  });
  window.GlobalUtil.socketCom.init_onmessage((evt) => {
    const temp_msg = JSON.parse(evt.data);
    // console.log('temp_msg', temp_msg);
    window.GlobalUtil.socketCom.onmessage(evt);
    if (temp_msg.type === 'report') {
      if (temp_msg.cmd === 'devices_status_report') {
        commit(types.SET_ROBOT_STATUS, temp_msg.data);
      }
      else if (temp_msg.cmd === 'report_gpio_value') {
        commit(types.SET_GPIO_STATUS, temp_msg.data);
      }
      else if (temp_msg.cmd === 'devices_info_report') {
        // commit(types.GET_ROBOT_INFO, temp_msg.data);
        window.GlobalUtil.model.robot.state.func.setRobotInfo(temp_msg.data);
        // commit(types.SET_ERROR, false);
      }
      else if (temp_msg.cmd === 'download_progress') {
        // commit(types.DOWNLOAD_PROGRESS, temp_msg.data);
        window.GlobalUtil.model.robot.state.download.progress = temp_msg.data.progress;
      }
    }
    else if (temp_msg.type === 'response') {
      window.GlobalUtil.socketCom.response = evt.data;
      // commit(types.SET_ERROR, temp_msg.code);
    }
    else if (temp_msg.type === 'broadcast') {
      // commit(types.ROBOT_BROADCAST, temp_msg.data);
      window.GlobalUtil.model.robot.state.printer.progress = temp_msg.data.progress;
    }
  });
};

export const xx = ({
  commit,
}) => {
  console.log(commit);
};
