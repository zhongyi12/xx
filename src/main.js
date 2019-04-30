// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import 'element-ui/lib/theme-chalk/index.css';
import GlobalUtil from '@/store/core/global_util';
import store from './store';
import App from './App';
import router from './router';
import axios from 'axios';

// import robot from '@/assets/lib/robot';
require('@/assets/css/global.css');
require('@/assets/css/reseet.css');
require('@/assets/css/common.css');

console.log(Vue.config);

Vue.use(ElementUI);
Vue.use(VueI18n);
window.GlobalUtil = GlobalUtil;
Vue.prototype.$http = axios;
// robot.connect();
Vue.config.productionTip = false;

function setPanelStyle() {
  const ele = document.getElementById('app-panel-id');
  if (ele !== undefined && ele !== null) {
    ele.style.marginTop = 0;
  }
  else {
    setTimeout(setPanelStyle, 50)
  }
}

router.beforeEach((to, from, next) => {
  if ((to.query.lang !== 'cn' && to.query.lang !== 'en') || (to.query.channel !== 'prod' && to.query.channel !== 'dev')) {
    if (to.query.lang !== 'cn' && to.query.lang !== 'en') {
      if (from.query.lang === 'cn' || from.query.lang === 'en') {
        to.query.lang = from.query.lang
      }
      else {
        to.query.lang = 'en'
      }
    }
    if (to.query.channel !== 'prod' && to.query.channel !== 'dev') {
      if (from.query.channel === 'prod' || from.query.channel === 'dev') {
        to.query.channel = from.query.channel
      }
      else {
        to.query.channel = 'prod'
      }
    }
    to.query.profile = from.query.profile;
    // to.query._ = Date.parse(new Date())
    next({
      path: to.path,
      name: to.name,
      query: to.query,
      params: to.params,
    })
  }
  else {
    if (to.path === '/') {
      window.GlobalUtil.model.commonStatusMgr.panelIsHidden = false;
      // setPanelStyle();
    }
    else {
      window.GlobalUtil.model.commonStatusMgr.panelIsHidden = true;
    }
    next()
  }
});

const profile = GlobalUtil.getUrlParam('profile');
if (profile !== '') {
  window.profile = JSON.parse(profile);
  if (window.profile.email !== null && window.profile.email !== undefined) {
    window.GlobalConstant.userId = window.profile.email.replace('@', '').replace('.', '');
  }
}

/* get lang */
const xArmLang = window.location.search.includes('lang=cn') ? 'cn' : 'en';  // test
// const xArmLang = window.location.search.includes('lang') && window.location.search.slice(-2) === 'cn' ? 'cn' : 'en'
console.log('lang', window.location.search, window.location.search.slice(-2));
const i18n = new VueI18n({
  locale: xArmLang,
  silentTranslationWarn: true,
  messages: {
    en: require('@/assets/i18n/en'),
    cn: require('@/assets/i18n/cn'),
  },
});

/* eslint-disable no-new */
new Vue({
  i18n,
  el: '#app',
  router,
  store,
  // template: '<App/>',
  // components: { App },
  template: '<App />',
  components: { App },
});

