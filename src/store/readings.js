import formatDate from "../helpers/formatDate";
import http from "../utils/http";

const state = {
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
    }
  },
  actions: {
    async getReadings({ commit }, date) {
      const formatedDate = formatDate(new Date());
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
