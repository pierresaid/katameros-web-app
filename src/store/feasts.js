import http from "../utils/http";

const state = {
  feasts: null,
  loading: false,
};

export default {
  namespaced: true,
  state,
  mutations: {
    SET_FEASTS(state, feasts) {
      state.feasts = feasts;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
  },
  actions: {
    async getFeasts({ commit, rootState }) {
      commit("SET_LOADING", true);
      const res = await http
        .get(`/feasts/${rootState.readings.date.getFullYear()}/${rootState.readings.language}`)
        .catch((error) => {
          throw { status: error.response.status, message: error.response.data };
        });
      commit("SET_LOADING", false);
      commit(
        "SET_FEASTS",
        res.data.sort((a, b) => new Date(a.date) - new Date(b.date))
      );
      return res;
    },
  },
};
