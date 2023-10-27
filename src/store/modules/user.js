import {
  login,
  getUserInfo,
  logout,
  register,
  resend,
  sendCode,
  resetPwd,
} from "@/api/user";
import storage from "@/request/storage";
const TOKEN = "IT_PROJECT_TOKEN";
import router from "@/router";
import { ElMessage } from "element-plus";
const getDefaultState = () => {
  return {
    token: storage.getItem(TOKEN) || "",
    userInfo: {},
    showLogIn: true,
  };
};

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      storage.setItem(TOKEN, token);
      console.log("SET_TOKEN:", token);
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
      console.log("SET_USER_INFO:", userInfo);
    },
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultState());
    },
    SET_SHOW_LOGIN(state, condition) {
      state.showLogIn = condition;
      console.log("SET_SHOW_LOGIN:", condition);
    },
  },
  actions: {
    // handle login request and transform data to requied params
    login(context, userInfo) {
      const { username, password } = userInfo;
      return new Promise((resolve, reject) => {
        login({
          Username: username,
          Password: password,
        })
          .then((response) => {
            const { data } = response;
            const { token } = data;
            // store token to storage
            this.commit("user/SET_TOKEN", token);
            this.commit("user/SET_SHOW_LOGIN", false);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // get user token and data
    async getUserInfo() {
      const res = await getUserInfo();
      this.commit("user/SET_USER_INFO", res.data);
      this.commit("user/SET_SHOW_LOGIN", false);
      return res;
    },
    // remove token
    resetToken({ commit }) {
      return new Promise((resolve) => {
        this.commit("user/SET_TOKEN", "");
        this.commit("user/SET_USER_INFO", {});
        this.commit("user/SET_SHOW_LOGIN", true);
        storage.clearAll();
        commit("RESET_STATE");
        resolve();
      });
    },
    logout() {
      logout()
        .then((response) => {
          // empty token and user data
          if (response.status === 0) {
            this.commit("user/SET_TOKEN", "");
            this.commit("user/SET_USER_INFO", {});
            this.commit("user/SET_SHOW_LOGIN", true);
            storage.clearAll();
            ElMessage.success("Sign Out Successful!");
            // back to home page
            router.push("/");
          }
        })
        .catch((error) => {
          console.log("logout: ", error);
          ElMessage({
            message: "Server Error, please try again",
            type: "Error",
            duration: 3 * 1000,
          });
          // location.reload()
        });
    },
    // register handler
    register(context, userInfo) {
      const { username, nickname, email, password } = userInfo;
      return new Promise((resolve, reject) => {
        register({
          Username: username,
          Password: password,
          Nickname: nickname,
          Email: email,
        })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            console.log("error in register");
            reject(error);
          });
      });
    },
    // resend activation email handler
    resend(context, userInfo) {
      return new Promise((resolve, reject) => {
        resend(userInfo)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            console.log("error in resend activation email");
            reject(error);
          });
      });
    },
    // verifcation code for forgot password handler
    sendCode(context, userInfo) {
      const { username, eventType } = userInfo;
      return new Promise((resolve, reject) => {
        sendCode({
          Username: username,
          EventType: eventType,
        })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            console.log("error in resend activation email");
            reject(error);
          });
      });
    },
    // change new password in forgot password handler
    resetPwd(context, userInfo) {
      const { password, eventId, code } = userInfo;
      return new Promise((resolve, reject) => {
        resetPwd({
          NewPassword: password,
          EventId: eventId,
          EventCode: code,
        })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            console.log("error in reset password");
            reject(error);
          });
      });
    },
  },
};
