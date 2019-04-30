
import Base64 from '@/assets/lib/Base64';

// const Base64 = require('base64-min');

const NativeCom = {}
window.NativeCom = NativeCom
const self = NativeCom

let counter = 0
const requestCallbacks = {}

self.sendToNative = (obj) => {
  const u = navigator.userAgent.toLowerCase()
  const isApple = /iphone|ipad|ipod|ios/i.test(u)
  const isAndroid = /android/i.test(u)
  try {
    if (isApple === true) {
      window.webkit.messageHandlers.GlobalViewControllerCallback.postMessage(obj)
    }
    if (isAndroid === true) {
      const jsonStr = JSON.stringify(obj)
      window.messageHandlers.jsCallWebView(Base64.btoa(jsonStr))
    }
  } catch (e) {
    console.log('this is web: ' + JSON.stringify(obj))
  }
}

self.sendCmdToNative = (dict, callback) => {
  const params = dict || {}
  params.type = 'request'
  counter += 1
  params.wid = `w${counter}`
  if (callback !== undefined && callback !== null) {
    requestCallbacks[params.wid] = callback
  }
  self.sendToNative(params)
}

self.sendFromNative = (paramsStr) => {
  paramsStr = Base64.atob(paramsStr)
  const params = JSON.parse(paramsStr) || {}
  try {
    const id = params.id
    const cmd = params.cmd
    const response = {}
    response.id = id
    response.code = 0
    response.msg = ''
    switch (cmd) {
      case 'ip-list': {
        const list = params.list
        window.iplist = list
        response.msg = `${cmd} success`
        response.type = 'response'
        break
      }
      case 'enter_foreground': {
        response.msg = `${cmd} arm success`;
        response.type = 'response';
        break;
      }
      case 'enter_background': {
        response.msg = `${cmd} arm success`;
        response.type = 'response';
        const resetFuncs = Object.values(window.GlobalUtil.model.robot.state.restCtrls);
        for (let i = 0; i < resetFuncs.length; i += 1) {
          const resetFunc = resetFuncs[i];
          if (resetFunc) {
            resetFunc();
          }
        }
        break;
      }
      default: {
        break
      }
    }
    if (params.wid !== undefined) {
      const callback = requestCallbacks[params.wid]
      if (callback !== null && callback !== undefined) {
        callback(params)
      }
      window.GlobalUtil.model.robot.state.comStop();
      return
    }
    self.sendToNative(response)
  } catch (e) {
    const response = {}
    response.type = 'error'
    response.msg = JSON.stringify(e)
    response.id = params.id
    response.requestData = params
    self.sendToNative(response)
  }
}

export default NativeCom;
