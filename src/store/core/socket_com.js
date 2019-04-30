
import ReconnectingWebSocket from '@/assets/lib/reconnecting-websocket';

const SocketCom = {};
const self = SocketCom;

self.socket_info = {
  socket: null,
  host: null,
  port: null,
  socket_connected: false,
};

self.init_socket = (args) => {
  const self = SocketCom;
  // if (self.socket_info.socket !== null) return;
  args = args || {};
  args.logger = args.logger || console;
  // args.host = args.host || 'localhost';
  // args.port = args.port || '18321';
  // self.socket_info.host = args.host;
  // self.socket_info.port = args.port;
  // const ws_url = `ws:${self.socket_info.host}:${self.socket_info.port}/ws`;
  const lang = window.location.search.includes('lang=cn') ? 'cn' : 'en';
  const channel = window.location.search.includes('channel=dev') ? 'dev' : 'prod';
  const ws_url = `ws:${args.host}/ws?channel=${channel}&lang=${lang}`;
  // const ws_url = `ws:${self.socket_info.host}/ws`;
  console.log(`ws_url ws_url = ${ws_url}`);
  self.socket_info.socket = new ReconnectingWebSocket(ws_url, null, {
    debug: false,
    logger: args.logger,
    reconnectInterval: 1000,
  });
};

self.init_onopen = (onopen) => {
  // console.log('init onpoen');
  self.socket_info.socket.onopen = onopen;
};

self.init_onclose = (onclose) => {
  // console.log('init onclose');
  self.socket_info.socket.onclose = onclose;
};

self.init_onmessage = (onmessage) => {
  // console.log('init onmessage');
  self.socket_info.socket.onmessage = onmessage;
};

self.init_onerror = (onerror) => {
  self.socket_info.socket.onerror = onerror;
};

self.msgid = 0;
self.response = '';
self.penddingCmds = {};
self.send_msg = (msg, callback, id) => {
  const self = SocketCom;
  if (self.socket_info.socket === null || self.socket_info.socket === undefined) {
    console.log('self.socket_info.socket.readyState is not init');
    return -1;
  }
  if (self.socket_info.socket.readyState !== ReconnectingWebSocket.OPEN) {
    console.log('self.socket_info.socket.readyState is not open');
    return -1;
  }
  self.startTime = new Date().getTime();
  if (id !== undefined) {
    msg.id = id;
  }
  else {
    if (self.msgid > 10000) { // restart from 100000
      self.msgid = 0;
    }
    self.msgid += 1;
    msg.id = `${self.msgid}`;
  }
  if (callback) {
    self.penddingCmds[msg.id] = callback;
  }
  const js_msg = JSON.stringify(msg);
  console.log(`msg.id = ${msg.id}, js_msg = ${js_msg}`);
  self.socket_info.socket.send(js_msg);
  return msg.id;
};

self.sendCmd = (cmdId, data, callback, id) => {
  const self = SocketCom;
  data = data || {};
  data.cmd = cmdId;
  self.send_msg(data, callback, id);
};

self.onmessage = (evt) => {
  const dict = JSON.parse(evt.data) || {};
  // console.log(`onmessage = ${JSON.stringify(dict)}`);
  const callback = self.penddingCmds[dict.id];
  const endTime2 = new Date().getTime();
  const diff = endTime2 - self.startTime;
  self.diff = `time diff = ${diff} ms`;
  if (dict.type === 'beart') {
    if (callback) {
      callback(dict);
    }
    return;
  }
  if (dict.type !== 'response') {
    return;
  }
  if (dict.id === null) {
    return;
  }
  if (callback) {
    // console.log(`send response = ${JSON.stringify(dict)}`);
    callback(dict);
  }
};

self.clean = () => {
  // console.log('onclean onclean');
  for (const key in self.penddingCmds) {
    const callback = self.penddingCmds[key];
    delete self.penddingCmds[key];
    if (callback) {
      // console.log('on callback');
      callback({
        code: 10086,
      });
    }
  }
};

// self.handleResponse = (dict) => {
//   const self = SocketCom;
//   dict = dict || {};
//   if (dict.type !== 'response') {
//     return;
//   }
//   if (dict.id === null) {
//     return;
//   }
//   const callback = self.penddingCmds[dict.id];
//   if (callback) {
//     callback(dict);
//   }
// };

export default self;
