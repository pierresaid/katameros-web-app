import formatDate from "../helpers/formatDate";
import http from "../utils/http";

const state = {
  date: new Date(),
  sections: null
};

export default {
  namespaced: true,
  state,
  getters: {
    name(state) {
      return state.name;
    }
  },
  mutations: {
    SET_READINGS(state, sections) {
      state.sections = sections;
    },
    SET_DATE(state, date) {
      state.date = date;
    }
  },
  actions: {
    setDate({ commit }, date) {
      commit("SET_DATE", date);
    },
    async getReadings({ commit }, date) {
      const formatedDate = formatDate(date);
      const res = await http
        .get(`/readings/gregorian/${formatedDate}`)
        .catch(error => {
          throw { status: error.response.status, message: error.response.data };
        });
      commit("SET_READINGS", res.data.sections);
      return res;
    }
  }
};
