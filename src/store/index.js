import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const modules = {};

const req = require.context("@/store/", true, /^((?!index.).)*\.js$/);
req.keys().forEach((fileName) => {
  const moduleDefinition = req(fileName).default;
  modules[fileName.match(/\w+/)[0]] = moduleDefinition;
});

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules,
});

export default store;
