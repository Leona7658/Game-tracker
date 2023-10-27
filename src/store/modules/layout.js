// import storage from '@/request/storage'
// import router from '@/router'
const getDefaultState = () => {
  return {
    bSidebar: true,
    bCustomizer: false,
    sidebarColor: "white",
    miniSidebar: true,
    navbarColor: "#f6f6f6",
    darkTheme: true,
    gameList: [],
    lastModified: new Date().getTime(),
  };
};

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    SET_SIDEBAR(state) {
      state.bSidebar = !state.bSidebar;
    },
    SET_MINI_SIDEBAR(state) {
      state.miniSidebar = !state.miniSidebar;
    },
    SET_CUSTOMIZER(state, payload) {
      state.bCustomizer = payload;
    },
    SET_SIDEBAR_COLOR(state, payload) {
      state.sidebarColor = payload;
    },
    SET_NAVBAR_COLOR(state, payload) {
      state.navbarColor = payload;
    },
    SET_GAME_LIST(state, payload) {
      state.gameList = payload;
    },
    SET_LAST_MODIFIED(state) {
      state.lastModified = new Date().getTime();
    },
  },
  actions: {},
};
