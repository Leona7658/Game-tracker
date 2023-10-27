import { createStore } from "vuex";

import getters from "./getters";
import user from "./modules/user";
import layout from "./modules/layout";
const store = createStore({
  getters,
  modules: {
    user,
    layout,
  },
});
export default store;
