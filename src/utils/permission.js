import router from "@/router";
import store from "@/store";

import { ElMessage } from "element-plus";
const whiteList = ["/login", "/", "/about", "/register", "/forgot"];
const loginBlackList = ["/login", "/register", "/forgot"];
/**
 * Navigation guard
 */
router.beforeEach(async (to, from, next) => {
  console.log(to.path);
  if (whiteList.indexOf(to.path) > -1) {
    if (store.getters.token) {
      if (to.path === "/") {
        next("/main");
      }
      if (loginBlackList.indexOf(to.path) > -1) {
        ElMessage.info("You are logged in ");
        next("/main");
      }
      return next();
    }
    next();
  } else {
    if (store.getters.token) {
      if (to.path === "/login") {
        ElMessage.info("You are logged in ");
        next("/main");
      } else {
        // check if userinfo is stored, get userinfo if not stored
        if (!store.getters.hasUserInfo) {
          await store.dispatch("user/getUserInfo");
          return next(to.path);
        }
        next();
      }
    } else {
      ElMessage.warning("Please login to gain access");
      next("/login");
    }
  }
});
