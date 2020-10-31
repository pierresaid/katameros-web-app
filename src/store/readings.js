import formatDate from "../helpers/formatDate";
import http from "../utils/http";

const state = {
  date: new Date(),
  sections: null,
  title: null,
};

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
    },
    SET_READINGS(state, { title, sections }) {
      state.sections = sections;
      state.title = title;
    },
    SET_DATE(state, date) {
      state.date = date;
    },
  },
  actions: {
    setDate({ commit }, date) {
      commit("SET_DATE", date);
    },
    async getReadings({ commit }, date) {
      commit("RESET_READINGS");
      const formatedDate = formatDate(date);
      const res = await http.get(`/readings/gregorian/${formatedDate}`).catch(error => {
        throw { status: error.response.status, message: error.response.data };
      });
      commit("SET_READINGS", res.data);
      return res;
    },
  },
};
