import Vue from "vue";
import Vuex from "vuex";

import { useSetting } from "@/helpers/useSetting.js";

Vue.use(Vuex);

const LINEMODE_LOCAL_STORAGE = "LINEMODE_LOCAL_STORAGE";
const THEME_LOCAL_STORAGE = "THEME_LOCAL_STORAGE";
const NAVBAR_LOCAL_STORAGE = "NAVBAR_LOCAL_STORAGE";

const modules = {};

const req = require.context("@/store/", true, /^((?!index.).)*\.js$/);
req.keys().forEach((fileName) => {
  const moduleDefinition = req(fileName).default;
  modules[fileName.match(/\w+/)[0]] = moduleDefinition;
});

const store = new Vuex.Store({
  state: {
    lineMode: useSetting(LINEMODE_LOCAL_STORAGE, 0, (li) => parseInt(li)),
    theme: useSetting(THEME_LOCAL_STORAGE, "light"),
    navbar: useSetting(NAVBAR_LOCAL_STORAGE, true, (val) => (val === "true" ? true : false)),
    isEmbedded: process.env.VUE_APP_EMBEDDED === "true",
  },
  mutations: {
    setLineMode(state, lineMode) {
      localStorage.setItem(LINEMODE_LOCAL_STORAGE, lineMode);
      state.lineMode = lineMode;
    },
    setDarkTheme(state, theme) {
      localStorage.setItem(THEME_LOCAL_STORAGE, theme);
      state.theme = theme;
    },
    setNavbar(state, status) {
      localStorage.setItem(NAVBAR_LOCAL_STORAGE, status);
      state.navbar = status;
    },
  },
  actions: {},
  modules,
});

export default store;
