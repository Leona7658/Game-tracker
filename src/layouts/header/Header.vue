<template>
  <div class="Header">
    <v-app-bar
      color=""
      elevation="0"
      :priority="priority"
      :class="['v-topbar', '']"
    >
      <v-btn
        class=""
        color="inherit"
        icon
        @click="store.commit('layout/SET_MINI_SIDEBAR')"
      >
        <vue-feather type="menu" size="20"></vue-feather>
      </v-btn>

      <!-- ---------------------------------------------- -->
      <!---Search part -->
      <!-- ---------------------------------------------- -->

      <v-btn text icon color="lighten-2" @click="searchbox">
        <vue-feather type="search" class="feather-sm"></vue-feather>
      </v-btn>
      <v-sheet
        v-if="showSearch"
        v-click-outside="searchbox"
        class="searchinput pa-2"
        elevation="10"
      >
        <v-autocomplete
          auto-select-first
          dense
          clearable
          item-title="name"
          item-value="id"
          v-model="searchKeyword"
          return-object
          :custom-filter="searchFilter"
          :disabled="!loadData"
          color="success"
          label="Search"
          placeholder="Search and Click a Game to Submit"
          variant="outlined"
          append-icon="mdi-close"
          id="searchBar"
          no-data-text="Oops, we cannot find the game that you're looking for :("
          single-line
          class="mt-5"
          @click:append="searchbox"
          :items="searchItems"
          :menu-props="{ maxHeight: 300, maxWidth: 320 }"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :prepend-avatar="item.raw.icon"
              :title="item.raw.name"
              :subtitle="
                `<span class='tagText'>` +
                  item.raw.tags +
                  `</span>` +
                  ` &mdash; ` +
                  item.raw.description
              "
              @click="search"
            >
              <template v-slot:subtitle="{ subtitle }">
                <div v-html="subtitle"></div>
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-sheet>
      <!---/Search part -->

      <v-spacer />
      <el-dropdown trigger="hover" style="color: inherit">
        <v-btn class="" color="inherit" icon>
          <vue-feather type="plus-square" size="20"></vue-feather>
        </v-btn>
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
      <v-btn class="" color="inherit" icon @click="router.go(-1)">
        <vue-feather type="arrow-left" size="20"></vue-feather>
      </v-btn>
      <!-- ---------------------------------------------- -->
      <!-- User Profile -->
      <!-- ---------------------------------------------- -->
      <v-menu anchor="bottom end" origin="auto" min-width="300">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="pa-0 px-1"
            elevation="0"
            color="transparent"
            plain
            :ripple="false"
          >
            <v-avatar size="35">
              <img :src="store.getters.userInfo.avatar" alt="" width="35" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list class="pa-6" elevation="10" rounded="lg">
          <h4 class="font-weight-medium fs-18">User Profile</h4>
          <div class="d-flex align-center my-4">
            <img
              :src="store.getters.userInfo.avatar"
              alt=""
              class="rounded-circle"
              width="90"
            />
            <div class="ml-4">
              <h4 class="font-weight-medium fs-18">
                {{ store.getters.userInfo.nickname }}
              </h4>
              <div class="d-flex align-center">
                <vue-feather
                  type="mail"
                  size="20"
                  class="d-flex grey--text"
                ></vue-feather>
                <span class="subtitle-2 font-weight-light ml-1">{{
                  store.getters.userInfo.email
                }}</span>
              </div>
            </div>
          </div>
          <v-list-item
            class="pa-3 mb-2"
            v-for="(item, i) in userprofile"
            :key="i"
            :value="item"
            :title="item.title"
            :subtitle="item.desc"
            :to="item.path"
            rounded="lg"
          >
            <template v-slot:prepend>
              <v-avatar start class="profileIcon">
                <v-btn
                  :color="item.color"
                  variant="flat"
                  icon
                  elevation="0"
                  size="small"
                  class="mr-3"
                >
                  <vue-feather :type="item.icon" size="18"></vue-feather>
                </v-btn>
              </v-avatar>
            </template>
          </v-list-item>
          <v-btn
            :loading="logoutLoading"
            :disabled="logoutLoading"
            block
            color="secondary"
            variant="flat"
            class="mt-4 py-4"
            @click="logout"
          >Log Out
            <v-icon right dark> mdi-logout </v-icon>
          </v-btn>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from "vue";
  import { useStore } from "vuex";
  import router from "@/router";
  import { allGame } from "@/api/game";
  import { ElMessage } from "element-plus";
  import { useRouter } from "vue-router";

  const games = ref();
  const loadData = ref(false);
  const store = useStore();
  const priority = ref(0);
  const showSearch = ref(false);
  const logoutLoading = ref(false);
  const searchItems = ref([]);
  const searchKeyword = ref();
  const thisRouter = useRouter();

  function searchbox() {
    showSearch.value = !showSearch.value;
  }

  onMounted(async () => {
    await allGame()
      .then((response) => {
        games.value = response.data;
        loadData.value = true;
        parseGames();
      })
      .catch((error) => {
        console.log("Error:", error);
        ElMessage.error("Oops something went wrong, please try again");
      });
  });

  watch(
    () => store.getters.lastModified,
    async () => {
      await allGame()
        .then((response) => {
          games.value = response.data;
          loadData.value = true;
          parseGames();
        })
        .catch((error) => {
          console.log("Error:", error);
          ElMessage.error("Oops something went wrong, please try again");
        });
    }
  );

  function parseGames() {
    if (games.value && Object.keys(games).length > 0) {
      let items = [];
      let gamesList = JSON.parse(JSON.stringify(games.value));
      if (gamesList && gamesList.length > 0) {
        gamesList.forEach((game) => {
          let tags = "";
          if (game.UserTagInfo != null) {
            game.UserTagInfo.forEach((tag) => {
              tags = tags + tag.Name + " ";
            });
          } else {
            tags = "No Tag";
          }
          items.push({
            name: game.Name,
            id: game.ID,
            icon: game.Icon,
            description: game.Description,
            tags: tags.trim(),
          });
        });
        searchItems.value = items;
      }
    }
  }

  function searchFilter(itemText, queryText, item) {
    const textOne = item.raw.name.toLowerCase();
    const textTwo = item.raw.description.toLowerCase();
    const textThree = item.raw.tags.toLowerCase();
    const searchText = queryText.toLowerCase();

    return (
      textOne.indexOf(searchText) > -1 ||
      textTwo.indexOf(searchText) > -1 ||
      textThree.indexOf(searchText) > -1
    );
  }

  const logout = () => {
    logoutLoading.value = true;
    setTimeout(() => {
      console.log("logout");
      store.dispatch("user/logout").then(() => {
        logoutLoading.value = false;
      });
    }, 500);
  };
  const ProfileTrigger = [
    {
      color: "success",
      icon: "user",
      title: "My Profile",
      desc: "Account Settings",
      path: "/profile",
    },
  ];
  const search = () => {
    if (searchKeyword.value && searchKeyword.value.id) {
      thisRouter.push({
        name: "details",
        params: { id: searchKeyword.value.id },
      });
      searchbox();
    }
  };
  const userprofile = ref(ProfileTrigger);
</script>

<style lang="scss" scoped>
:deep(.v-toolbar) {
  z-index: 999;
}

:deep(.profileIcon) {
  border-radius: 25%;
  width: auto !important;
  height: auto !important;
}

:deep(.tagText) {
  color: #4ca0fc;
}

.routerLink {
  text-decoration: none;
  color: #213547;
}
</style>
