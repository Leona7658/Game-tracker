<template>
  <div class="home container">
    <navBar />

    <el-container>
      <el-main>
        <el-row>
          <el-col :lg="12" :md="18" :xs="24">
            <div class="title">Not sure what to play next ?</div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :lg="12" :md="18" :xs="24">
            <div class="subtitle">Don't worry, we've got your covered.</div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :lg="12" :md="18" :xs="24">
            <div class="text">
              Discover new games, and keep track of the ones you want to play.
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :lg="12" :md="18" :xs="24">
            <div style="padding-left: 3vw">
              <router-link to="/register" custom v-slot="{ navigate }">
                <el-button @click="navigate" class="button" type="primary" round
                >Sign Up</el-button
                >
              </router-link>
            </div>
          </el-col>
        </el-row>

        <el-row justify="space-evenly">
          <HomeInfo :items="info" />
        </el-row>

        <div class="trending_games">
          <div class="trending_title">Trending Games</div>

          <div
            style="
              display: grid;
              grid-auto-rows: 1fr;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              gap: 1rem;
            "
          >
            <div
              class="box"
              style="padding-bottom: 150%"
              :style="{
                'background-image': `url(${require('@/assets/trending_game/amongUs.jpg')})`,
              }"
            ></div>

            <div
              class="box"
              style="padding-bottom: 150%"
              :style="{
                'background-image': `url(${require('@/assets/trending_game/overCooked.jpg')})`,
              }"
            ></div>

            <div
              class="box"
              style="padding-bottom: 150%"
              :style="{
                'background-image': `url(${require('@/assets/trending_game/itTakesTwo.jpg')})`,
              }"
            ></div>

            <div
              class="box"
              style="padding-bottom: 150%"
              :style="{
                'background-image': `url(${require('@/assets/trending_game/civilizationVI.jpg')})`,
              }"
            ></div>

            <div
              class="box"
              style="padding-bottom: 150%"
              :style="{
                'background-image': `url(${require('@/assets/trending_game/apexLegends.jpg')})`,
              }"
            ></div>

            <div
              class="box"
              style="padding-bottom: 150%"
              :style="{
                'background-image': `url(${require('@/assets/trending_game/csgo.jpg')})`,
              }"
            ></div>

            <div
              class="box"
              style="padding-bottom: 150%"
              :style="{
                'background-image': `url(${require('@/assets/trending_game/seaOfThieves.jpg')})`,
              }"
            ></div>

            <div
              class="box"
              style="padding-bottom: 150%"
              :style="{
                'background-image': `url(${require('@/assets/trending_game/tombRaider.jpg')})`,
              }"
            ></div>
          </div>
        </div>

        <el-footer>
          <div class="footer">Copyright © 2022 KyByte Team All rights reserved</div>
        </el-footer>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
// import BlankLayout from "@/layouts/blank/BlankLayout";
  import navBar from "@/components/NavBar.vue";
  import HomeInfo from "@/components/HomeInfo.vue";
  import { ref } from "vue";

  // prepare information for child component HomeInfo
  const info = ref([
    {
      name: "Game Collection",
      imgPath: require("@/assets/addIcon.png"),
      msg: "Add games you want to play and see the details of game.",
    },
    {
      name: "Game Tracking",
      imgPath: require("@/assets/timerIcon.png"),
      msg: "Keep track of your games and record the duration of the game.",
    },
    {
      name: "Game Rating",
      imgPath: require("@/assets/listIcon.png"),
      msg: "Rating and add tags to your games.",
    },
  ]);
</script>

<style lang="scss" scoped>
@import "../styles/homePage";
</style>
