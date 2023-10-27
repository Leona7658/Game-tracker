import axios from "axios";

import { ElMessage, ElMessageBox } from "element-plus";
import store from "@/store";
import router from "@/router";
const service = axios.create({
  // all request prefix
  baseURL: "/api/v1",
  // request timeout millisecond
  timeout: 60000,
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers.token = store.getters.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const data = response.data;
    let newToken = response.headers["newtoken"];
    if (newToken) {
      console.log("newToken:", newToken);
      store.commit("user/SET_TOKEN", newToken);
    }
    if (!data.success) {
      ElMessage({
        message: data.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });
    }
    console.log(data);
    return Promise.resolve(data);
  },
  (error) => {
    const { response } = error;
    console.log("error: ", response);
    if (response.data) {
      const { data } = response;
      // 400000: Illegal token; 400001: Other clients logged in; 400002: Token expired;
      if (
        data.status === 400000 ||
        data.status === 400001 ||
        data.status === 400002
      ) {
        // to re-login
        ElMessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        )
          .then(() => {
            store.dispatch("user/resetToken").then(() => {
              router.push("/login");
            });
          })
          .catch(() => {
            store.dispatch("user/resetToken").then(() => {
              router.push("/");
            });
          });
      }
      let msg = data.message || "Error";
      let statuscode = data.status || 99999;
      ElMessage({
        message: "[" + statuscode + "]" + msg,
        type: "error",
        duration: 5 * 1000,
      });
    } else {
      ElMessage({
        message: error.message,
        type: "error",
        duration: 5 * 1000,
      });
    }
    return Promise.reject(error);
  }
);
function request(options) {
  options.method = options.method || "get";
  if (options.method.toLowerCase() === "get") {
    options.params = options.data;
  }
  return service(options);
}

["get", "post", "put", "delete", "patch"].forEach((method) => {
  request[method] = (url, options) => request({ url, method, ...options });
});

export default request;
