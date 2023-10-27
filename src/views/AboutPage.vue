<template>
  <div class="about container">
    <el-container>
      <navBar />

      <el-main>
        <el-row>
          <el-col :lg="12" :md="18" :xs="24">
            <div class="title">
              Track your game progress and your gaming time
            </div>
            <div class="subtitle">
              KyByte will record a range of details for each game and including
              time you have spent on each game...
            </div>
          </el-col>

          <el-col :lg="12" :md="18" :xs="24">
            <div class="team-box">
              <div class="team-title">Our Team</div>
              <div class="wrapper">
                <div>
                  <img
                    :src="require('@/assets/team/1.jpg')"
                    alt="team member"
                  />
                  <h3>David</h3>
                </div>
                <div>
                  <img
                    :src="require('@/assets/team/2.jpg')"
                    alt="team member"
                  />
                  <h3>Jack</h3>
                </div>
                <div>
                  <img
                    :src="require('@/assets/team/3.jpg')"
                    alt="team member"
                  />
                  <h3>Leona</h3>
                </div>
              </div>
              <div class="wrapper">
                <div>
                  <img
                    :src="require('@/assets/team/4.jpg')"
                    alt="team member"
                  />
                  <h3>Steve</h3>
                </div>
                <div>
                  <img
                    :src="require('@/assets/team/5.jpg')"
                    alt="team member"
                  />
                  <h3>Kimberly</h3>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>

      <el-footer>
        <div class="footer">Copyright © 2022 KyByte Team All rights reserved</div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
  import navBar from "@/components/NavBar.vue";
</script>

<style lang="scss" scoped>
@import "../styles/aboutPage";
</style>
