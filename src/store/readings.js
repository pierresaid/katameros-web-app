import formatDate from "../helpers/formatDate";
import http from "../utils/http";
import { useSetting } from "@/helpers/useSetting.js";
import json from "./db.json";
import router from "../router";
const LANGUAGE_LOCAL_STORAGE = "LANGUAGE_LOCAL_STORAGE";

const today = new Date();

const state = {
  date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
  sections: null,
  title: null,
  periodInfo: null,
  loading: false,
  language: useSetting(LANGUAGE_LOCAL_STORAGE, 1, (la) => parseInt(la)),
};

//if (today.getHours() > 17)
//  state.date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

export default {
  namespaced: true,
  state,
  getters: {
    name(state) {
      return state.name;
    },
  },
  mutations: {
    RESET_READINGS(state) {
      state.sections = null;
      state.title = null;
      state.periodInfo = null;
    },
    SET_READINGS(state, { title, sections, periodInfo }) {
      state.sections = sections;
      state.title = title;
      state.periodInfo = periodInfo;
    },
    SET_DATE(state, date) {
      state.date = date;
      router.push({
        query: {
          date: formatDate(date),
        },
      });
    },
    SET_DATE_PARAM(state, date) {
      state.date = date;
    },
    SET_LANGUAGE(state, language) {
      localStorage.setItem(LANGUAGE_LOCAL_STORAGE, language);
      state.language = language;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
  },
  actions: {
    setDate({ commit }, date) {
      commit("SET_DATE", new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    },
    async setLanguage({ state, commit, dispatch }, language) {
      commit("SET_LANGUAGE", language);
      dispatch("getReadings", state.date);
      dispatch("feasts/getFeasts", null, { root: true });
    },
    async getReadings({ state, commit }) {
      commit("RESET_READINGS");
      const formatedDate = formatDate(state.date);
      const formatWithLang = `${formatedDate}-${state.language}`;
      if (json[formatWithLang]) {
        commit("SET_READINGS", json[formatWithLang]);
        return { data: json[formatWithLang] };
      }
      commit("SET_LOADING", true);
      const res = await http
        .get(`/readings/gregorian/${formatedDate}`, { params: { languageId: state.language } })
        .catch((error) => {
          throw { status: error.response.status, message: error.response.data };
        });
      commit("SET_LOADING", false);
      commit("SET_READINGS", res.data);
      return res;
    },
  },
};
