<template>
  <div class="BlankLayout">
    <v-app>
      <v-app-bar
        color="#62666B"
        elevation="0"
        :priority="priority"
        :class="['v-topbar', '']"
      >
        <div class="">
          <RouterLink to="/">
            <v-img max-height="50" max-width="50" :src="logo"></v-img>
          </RouterLink>
        </div>

        <v-spacer></v-spacer>

        <div class="pa-2">
          <v-btn plain color="white" to="/login">About Us</v-btn>
        </div>

        <div class="pa-2">
          <v-btn plain color="white" to="/login">Sign In</v-btn>
        </div>

        <div class="pa-2">
          <v-btn plain color="white" to="/login">Sign Up</v-btn>
        </div>
      </v-app-bar>
      <v-main>
        <RouterView />
      </v-main>
    </v-app>
  </div>
</template>

<script setup>
  import {} from "vue";
  import logo from "@/assets/logoDark.svg";
</script>

<style lang="scss" scoped></style>
