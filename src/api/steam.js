import request from "@/request/index";
const qs = require("qs");

// connect with steam games
export const addSteamGame = (data) =>
  request.post("/steam/owned_game", {
    data: qs.stringify(data),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
