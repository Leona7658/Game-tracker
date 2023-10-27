import request from "@/request/index";
const qs = require("qs");
// http request for user

// before login
export const login = (data) =>
  request.post("/user/login", {
    data: qs.stringify(data),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
export const logout = () => request.post("/user/logout");
export const getUserInfo = () => request.get("/user/info");
export const register = (data) =>
  request.post("/user/register", {
    data: qs.stringify(data),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
export const resend = (username) =>
  request.post("/user/resend?username=" + username, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
export const sendCode = (data) =>
  request.post("/event", {
    data: qs.stringify(data),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
export const resetPwd = (data) =>
  request.post("/user/reset", {
    data: qs.stringify(data),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

// after login
export const uploadImg = (data) => request.post("/user/avatar", { data });
export const changePwd = (data) =>
  request.post("/user/change", {
    data: qs.stringify(data),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
export const changeNickname = (data) =>
  request.post("user/nickname", {
    data: qs.stringify(data),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
