<template>
  <v-app
    :theme="'dark'"
    :class="[
      store.getters.miniSidebar ? 'mini-sidebar' : '',
      'verticalLayout',
    ]"
  >
    <!--    <VerticalSidebarVue  />-->
    <Sidebar />
    <Header />

    <v-main>
      <RouterView />
      <v-container fluid class="page-wrapper"> </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { useStore } from "vuex";
  import Header from "./header/Header";
  import Sidebar from "./sidebar/SideBar";
  const store = useStore();
</script>

<style lang="scss" scoped></style>
