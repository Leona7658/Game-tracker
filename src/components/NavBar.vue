<template>
  <el-menu class="navBar" mode="horizontal" :ellipsis="false" router>
    <el-menu-item index="/">
      <img class="logo" :src="require('@/assets/logoDark.svg')" alt="logo" />
    </el-menu-item>

    <div class="flex-grow" />
    <el-menu-item v-show="$store.getters.showLoggedIn == false" index="/main"
    >Game</el-menu-item
    >
    <el-menu-item index="/about">About</el-menu-item>
    <el-menu-item v-show="$store.getters.showLoggedIn" index="/login"
    >Login</el-menu-item
    >
    <el-menu-item v-show="$store.getters.showLoggedIn" index="/register"
    >Register</el-menu-item
    >
    <el-menu-item
      v-show="$store.getters.showLoggedIn == false"
      index="1"
      @click="logOut"
    >Log Out</el-menu-item
    >
    <el-menu-item
      v-show="$store.getters.showLoggedIn == false"
      index="2"
      @click="goBack"
    >
      <el-icon :size="55">
        <Back />
      </el-icon>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
  import { useStore } from "vuex";
  import router from "@/router";

  const store = useStore();

  const logOut = () => {
    store.dispatch("user/logout");
  };

  const goBack = () => {
    return router.go(-1);
  };
</script>

<style lang="scss" scoped>
@media screen and (max-width: 960px) {
  * {
    font-size: 2vw !important;
  }
}

.navBar {
  background-color: transparent;
  position: fixed;
  width: 100%;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  -moz-backdrop-filter: blur(10px);
  -o-backdrop-filter: blur(10px);
  -ms-backdrop-filter: blur(10px);
  z-index: 100;
}

.logo {
  width: 100px;
  height: 60px;
  //margin-left: -60px;
  text-align: left;
  margin-top: 4px;
  object-fit: cover;
}

.flex-grow {
  flex-grow: 1;
}

.el-menu-item {
  --el-menu-text-color: white;
  font-size: 0.8vw;
  height: auto;
  @media screen and (max-width: 960px) {
    font-size: 2vw !important;
  }
}
</style>
