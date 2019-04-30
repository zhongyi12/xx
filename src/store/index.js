import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import robot from './modules/robot';
import geometry from './modules/geometry';
import model from './modules/model';
import * as getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    robot,
    geometry,
    model,
  },
  strict: false,
});
