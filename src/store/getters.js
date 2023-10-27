const getters = {
  token: (state) => state.user.token,
  hasUserInfo: (state) => {
    return JSON.stringify(state.user.userInfo) !== "{}";
  },
  userInfo: (state) => state.user.userInfo,
  showLoggedIn: (state) => state.user.showLogIn,

  bSidebar: (state) => state.layout.bSidebar,
  bCustomizer: (state) => state.layout.bCustomizer,
  sidebarColor: (state) => state.layout.sidebarColor,
  miniSidebar: (state) => state.layout.miniSidebar,
  navbarColor: (state) => state.layout.navbarColor,
  darkTheme: (state) => state.layout.darkTheme,
  gamelist: (state) => state.layout.gameList,
  bNeedGame: (state) => state.layout.gameList.length === 0,
  lastModified: (state) => state.layout.lastModified,
};
export default getters;
