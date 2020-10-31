export default {
  namespaced: true,
  state: {
    drawer: false,
    panel: [],
    sections: [],
  },
  getters: {
    name(state) {
      return state.name;
    },
  },
  mutations: {
    SET_DRAWER(state, drawer) {
      state.drawer = drawer;
    },
    SET_PANEL(state, panel) {
      state.panel = panel;
    },
    OPEN_PANEL(state, panelIdx) {
      if (
        state.panel.find(i => {
          return i === panelIdx;
        }) === undefined
      ) {
        state.panel.push(panelIdx);
      }
    },
    ADD_SECTION(state, { ref, index }) {
      const sectionIdx = state.sections.findIndex(s => {
        return s.index === index;
      });
      if (sectionIdx !== -1) {
        state.sections.splice(sectionIdx, 1);
      }
      state.sections.push({ ref, index });
    },
  },
  actions: {},
};
