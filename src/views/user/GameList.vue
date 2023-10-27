<template>
  <div>
    <div class="common-layout">
      <!--      <navBar />-->
      <el-container>
        <PerfectScrollbar
          class="scrollbar"
          ref="scrollbar"
          @ps-scroll-y="onScroll"
        >
          <el-main>
            <div class="main_header">
              <el-row class="row-bg" justify="space-between">
                <el-col :span="6">Welcome Back {{ user.nickname }}!</el-col>
                <el-col :span="6">
                  <div class="main_header_list">
                    <div class="recommend actives">Featured</div>
                  </div>
                </el-col>

                <el-col :span="2"> </el-col>
              </el-row>
            </div>
            <div class="main_content">
              <div class="gamelib" v-if="recents">
                <div class="recent_game_header">
                  <span class="main_content_whats"> Recently Played </span> -
                  Your Recently Played Games
                </div>
                <el-row class="gamelib_list_parent">
                  <el-col
                    v-for="recent in recents"
                    :key="recent.ID"
                    :span="spanNum"
                  >
                    <div class="gamelib_list">
                      <div class="gamelib_list_img">
                        <div>
                          <router-link
                            :to="{ name: 'details', params: { id: recent.ID } }"
                          >
                            <img
                              class="gamelib_list_img_photo"
                              v-lazy="recent.CapsuleImage"
                              alt="Capsule Image"
                            />
                          </router-link>
                        </div>
                        <div>
                          <img class="game" :src="PC_PNG" alt="" />
                        </div>
                      </div>
                      <div class="gamelib_list_text">
                        <div v-if="!isMobile">{{ recent.Name }}</div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div v-loading="loading" class="detail">
                <div class="detail_title">
                  <span class="main_content_whats"> Game Library </span>- All Of
                  Your Games
                </div>
                <div class="detail_list">
                  <el-row>
                    <el-col :span="spanNum">
                      <!-- direct to add game pages -->
                      <el-dropdown trigger="hover">
                        <div class="detail_content">
                          <div class="detail_photo" style="margin-bottom: 12px">
                            <div
                              style="
                                margin-bottom: calc(
                                  var(--app-height) * -0.0008
                                );
                              "
                            >
                              <img class="detailposter" :src="ADDPNG" alt="" />
                            </div>
                          </div>
                          <div>Add Game</div>
                        </div>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item>
                              <router-link class="routerLink" to="/addGame"
                              >Manually Add Game</router-link
                              >
                            </el-dropdown-item>
                            <el-dropdown-item>
                              <router-link class="routerLink" to="/addSteam"
                              >Add Steam Games</router-link
                              >
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </el-col>
                    <el-col
                      v-for="game in games"
                      :key="game.ID"
                      :span="spanNum"
                    >
                      <div class="detail_content">
                        <router-link
                          :to="{ name: 'details', params: { id: game.ID } }"
                        >
                          <div class="detail_photo">
                            <div>
                              <img
                                class="detailposter"
                                v-lazy="game.CoverImage"
                                alt="Cover Image"
                              />
                            </div>
                            <div>
                              <img class="playbutton" :src="GAMEPNG" alt="" />
                            </div>
                          </div>
                        </router-link>
                        <div v-if="!isMobile">{{ game.Name }}</div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </el-main>
          <v-btn
            v-if="backTopVisible"
            elevation="4"
            class="backTopBtn"
            rounded
            fab
            x-large
            @click="backTop"
            color="#282424"
          ><v-icon>mdi-navigation</v-icon></v-btn
          >
        </PerfectScrollbar>
      </el-container>
    </div>
    <div class="backcolor"></div>
  </div>
</template>

<script setup>
  import { useStore } from "vuex";
  import { ref, onMounted } from "vue";
  import { listGame, recentGame } from "@/api/game.js";
  import { ElMessage } from "element-plus";
  import { PerfectScrollbar } from "vue3-perfect-scrollbar";
  import ADDPNG from "@/assets/default/coverAdd.png";
  import GAMEPNG from "@/assets/default/play.png";
  import PC_PNG from "@/assets/default/playOrange.png";

  // data container
  const store = useStore();
  const user = ref(store.getters.userInfo);
  const games = ref();
  const recents = ref();
  const loading = ref(true);
  const loadData = ref(false);
  const isMobile = ref(false);
  const mobileSize = ref(960);
  const mobileSpan = ref(6);
  const normalSpan = ref(3);
  const spanNum = ref(normalSpan.value);
  const scrollbar = ref();
  const backTopVisible = ref(false);

  function backTop() {
    backTopVisible.value = false;
    scrollbar.value.$el.scrollTop = 0;
  }

  function onScroll() {
    if (scrollbar.value.$el.scrollTop >= 20) {
      backTopVisible.value = true;
    } else {
      backTopVisible.value = false;
    }
  }

  const sidebarWidth = () => {
    const sidebar = document.getElementById("scrollnavbar");
    const sidebarWidth =
      sidebar && sidebar.clientWidth < window.innerWidth - 30
        ? sidebar.clientWidth
        : 0;
    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${sidebarWidth}px`
    );
  };

  const observer = new MutationObserver(function () {
    if (document.getElementById("scrollnavbar")) {
      new ResizeObserver(sidebarWidth).observe(
        document.getElementById("scrollnavbar")
      );
      observer.disconnect();
    }
  });

  onMounted(async () => {
    sidebarWidth();
    observer.observe(document.body, { childList: true, subtree: true });
    // determine if window is mobile size
    if (window.innerWidth <= mobileSize.value) {
      isMobile.value = true;
      spanNum.value = mobileSpan.value;
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth <= mobileSize.value) {
        isMobile.value = true;
        spanNum.value = mobileSpan.value;
      } else {
        isMobile.value = false;
        spanNum.value = normalSpan.value;
      }
    });
    // get data for all games
    await listGame()
      .then((response) => {
        if (JSON.stringify(response.data) !== "{}") {
          games.value = response.data;
          store.commit("layout/SET_GAME_LIST", response.data);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        ElMessage.error("Oops something went wrong, please try again");
      });
    await recentGame()
      .then((response) => {
        if (JSON.stringify(response.data) !== "{}") {
          recents.value = response.data;
        }
        loading.value = false;
        loadData.value = true;
      })
      .catch((error) => {
        loading.value = false;
        console.log("Error:", error);
        ElMessage.error("Oops something went wrong, please try again");
      });
  });
</script>

<style lang="scss" scoped>
@import "@/styles/mainPage.scss";

* {
  font-size: 1vw;
  width: auto;
  height: auto;
  overflow: hidden;

  @media screen and (max-width: 960px) {
    font-size: 3vw;
  }
}

.backTopBtn {
  position: fixed;
  bottom: 10px;
  right: 25px;
}

:deep(.scrollbar) {
  height: calc(var(--app-height) - 64px);
  position: fixed;
  right: 0px;

  .v-list--one-line {
    .smallCap {
      padding: 0px;
      font-size: 14px;
    }

    .v-list-group__items .v-list-item,
    .v-list-item {
      padding-inline-start: 12px !important;
      padding-left: 12px;

      .v-list-item__prepend > .v-icon {
        margin-inline-end: 15px;
      }
    }

    .v-list-group__items .v-list-item .v-avatar.v-avatar--density-default,
    .v-avatar.v-avatar--density-default {
      width: 20px;
      height: 34px;
    }

    .first-level-item .v-icon--size-default {
      font-size: 1rem;
    }

    .v-list-item--active {
      background: rgb(var(--v-theme-secondary));
      color: white !important;
    }

    .v-theme--dark.bg-white {
      background: #212121;
    }
  }
}

.backcolor {
  width: 100%;
  height: var(--app-height);
  background-color: #323232;
  z-index: -12;
  position: fixed;
  top: 0;
  left: 0;
}

.common-layout {
  background-color: #323232;
}

// Index
.el-main {
  margin-left: 30px;
  width: calc(100vw - 30px - var(--sidebar-width));
  .main_header {
    // display: flex;
    .main_home {
      color: #ccc;
    }

    .main_header_list {
      display: flex;
      .recommend {
        width: auto;
        text-align: center;
      }

      .focuson {
        width: 100px;
        text-align: center;
      }

      .actives {
        border-bottom: 1px solid RGB(230, 162, 60);
      }
    }
  }

  .main_content {
    margin: 20px 0;

    .main_content_whats {
      color: #fff;
    }

    .gamelib {
      margin-top: 10px;
      margin-bottom: 20px;

      .gamelib_list {
        margin-right: 21px;
        position: relative;

        .gamelib_list_img {
          border: 1px solid transparent;

          div {
            margin-bottom: calc(var(--app-height) * -0.003);
          }

          .gamelib_list_img_photo {
            width: 100%;
            border-radius: 5px;
          }

          .game {
            z-index: 88;
            display: block;
            position: absolute;
            top: 40%;
            left: 45%;
            width: 8%;
            display: none;
          }
        }

        .gamelib_list_img:hover {
          border: 1px solid #e6a23c;
          border-radius: 5px;
          cursor: pointer;

          .gamelib_list_img_photo {
            opacity: 0.6;
            border-radius: 8px;
          }

          .game {
            display: block;

            img {
              border: none;
              object-fit: cover;
            }
          }
        }
      }

      .gamelib_list_text {
        margin-top: 10px;
        padding-left: 10px;

        div:first-child {
          color: #fff;
          padding-bottom: 5px;
        }
      }
    }

    .detail {
      .detail_title {
        margin-bottom: 20px;
      }

      .detail_list {
        .el-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }

        @media screen and (max-width: 960px) {
          .el-col {
            margin-right: 10px !important;
          }
        }

        .el-col {
          border-radius: 5px;
          margin-right: 20px;
        }
      }

      .detail_content {
        margin-bottom: 20px;
        .detail_photo img {
          object-fit: cover;
          border-radius: 5px;
          object-position: center;
        }

        .detail_photo {
          border-radius: 5px;
          position: relative;
          border: 1px solid transparent;
          margin-bottom: 10px;

          div {
            margin-bottom: calc(var(--app-height) * -0.003);
          }

          .detailposter {
            width: 100%;
          }

          .playbutton {
            display: none;
            position: absolute;
            top: 45%;
            left: 41%;
            width: 18%;
          }
        }

        .detail_photo:hover {
          cursor: pointer;
          border: 1px solid #e6a23c;

          .detailposter {
            opacity: 0.6;
          }

          .playbutton {
            display: block;
          }
        }

        div:last-child {
          color: #fff;
        }
      }
    }
  }
}

.recent_game_header {
  margin-bottom: 20px;
}

.gamelib_list_parent {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .el-col {
    max-width: 33%;
    flex: 0 0 33%;
  }
}

.routerLink {
  text-decoration: none;
  color: #213547;
}
</style>
