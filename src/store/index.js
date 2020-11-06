import Vue from "vue";
import Vuex from "vuex";
// 注意命名
import state from "./state";
import mutations from "./mutation";
import actons from "./action";
import getters from "./getter";
Vue.use(Vuex);

// vuex 存储对外抛出
export default new Vuex.Store({
  state,
  mutations,
  getters,
  actons
});
