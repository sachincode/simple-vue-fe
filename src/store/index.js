import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    ssoData: null,
    user: null,
  },
  mutations: {
    handleSsoData(state, res) {
      state.ssoData = res.ssoData;
    },
    handleUser(state, res) {
      state.user = res.user;
    },
  },
  actions: {
    updateSsoData({commit}, res) {
      commit('handleSsoData', res);
    },
    updateUser({commit}, res) {
      commit('handleUser', res);
    },
  },
});

export default store;
