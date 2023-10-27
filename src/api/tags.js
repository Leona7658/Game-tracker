import request from "@/request/index";
const qs = require("qs");

// request under tag api
export const addTag = (data) =>
  request.post("/tag/add", {
    data: qs.stringify(data),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
export const deleteTag = (data) =>
  request.delete("/tag/" + data.id + "/delete", {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
export const listTags = () =>
  request.get("/tag/list", {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
