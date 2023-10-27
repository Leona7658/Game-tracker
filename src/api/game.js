import request from "@/request/index";
import store from "@/store";
const qs = require("qs");

// request under gameInfo api
export const addGame = (data) => {
  store.commit("layout/SET_LAST_MODIFIED");
  return request.post("/gameinfo/add", {
    data: qs.stringify(data),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};
export const deleteGame = (data) => {
  store.commit("layout/SET_LAST_MODIFIED");
  return request.delete("/gameinfo/" + data.gameId + "/game", {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export const listGame = () =>
  request.get("/gameinfo/list", {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
export const allGame = () =>
  request.get("/gameinfo/all", {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
export const recentGame = () =>
  request.get("/gameinfo/recent", {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
export const gameDetails = (data) => {
  store.commit("layout/SET_LAST_MODIFIED");
  return request.get("/gameinfo/" + data.gameId + "/detail", {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export const addTagToGame = (data) => {
  store.commit("layout/SET_LAST_MODIFIED");
  return request.post(
    "/gameinfo/" + data.gameId + "/" + data.tagId + "/addtag",
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
};
export const removeTag = (data) => {
  store.commit("layout/SET_LAST_MODIFIED");
  return request.post(
    "/gameinfo/" + data.gameId + "/" + data.tagId + "/deletetag",
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
};
export const editGame = (data) => {
  store.commit("layout/SET_LAST_MODIFIED");
  return request.patch("/gameinfo/update", {
    data: qs.stringify(data),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};
export const uploadCover = (data, gameId) =>
  request.post("/gameinfo/" + gameId + "/cover", { data });
export const uploadBackground = (data, gameId) =>
  request.post("/gameinfo/" + gameId + "/background", { data });
export const uploadIcon = (data, gameId) => {
  store.commit("layout/SET_LAST_MODIFIED");
  return request.post("/gameinfo/" + gameId + "/icon", { data });
};
export const uploadScreenShot = (data, gameId) =>
  request.post("/gameinfo/" + gameId + "/screenshot", { data });
export const uploadCapsule = (data, gameId) =>
  request.post("/gameinfo/" + gameId + "/capsule", { data });

export const deleteScreenShot = (data) =>
  request.delete("/gameinfo/" + data.Id + "/screenshot");
export const startRecord = (data) =>
  request.post("/gameinfo/" + data.Id + "/start");
export const endRecord = (data) =>
  request.post("/gameinfo/" + data.Id + "/end");
export const fullRecord = (data) =>
  request.post("/gameinfo/fullrecord", {
    data: qs.stringify(data),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
