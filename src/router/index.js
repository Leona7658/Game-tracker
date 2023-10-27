import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/main",
    name: "Main",
    redirect: "/main/game",
    component: () => import("../layouts/full/FullLayout"),
    children: [
      {
        path: "/main/game",
        name: "game",
        component: () => import("../views/user/GameList.vue"),
      },
      {
        path: "/main/details/:id",
        name: "details",
        props: true,
        component: () => import("../views/user/GameDetails.vue"),
      },
    ],
  },
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomePage.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginForm.vue"),
    props: (route) => ({ query: route.query.activate }),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/RegisterForm.vue"),
  },
  {
    path: "/forgot",
    name: "forgot",
    component: () => import("../views/ForgotPassword.vue"),
  },

  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/user/EditProfile.vue"),
  },
  {
    path: "/addGame",
    name: "addGame",
    component: () => import("../views/user/AddGame.vue"),
  },
  {
    path: "/addSteam",
    name: "addSteam",
    component: () => import("../views/user/SteamGame.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
