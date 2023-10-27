<template>
  <div class="SidebarInner">
    <v-navigation-drawer
      left
      permanent
      v-model="bSidebar"
      elevation="10"
      :class="store.getters.sidebarColor === 'white' ? '' : 'text-white'"
      :color="store.getters.darkTheme ? '' : store.getters.sidebarColor"
      :rail-width="railWidth"
      app
      class="leftSidebar"
      :rail="bMini"
    >
      <!-- ---------------------------------------------- -->
      <!---Logo part -->
      <!-- ---------------------------------------------- -->
      <!--      TODO Logo-->
      <div class="">
        <RouterLink to="/" @click="backTop">
          <img class="sidebarLogo" :src="logo" />
          <!--                    <img class="logo" src="../../assets/logoDark.svg" alt="" width="100"/>-->
        </RouterLink>
      </div>

      <!-- ---------------------------------------------- -->
      <!---Navigation -->
      <!-- ---------------------------------------------- -->
      <perfect-scrollbar
        id="scrollnavbar"
        class="scrollnavbar"
        :style="scrollbarHeight"
        ref="scrollnavbar"
      >
        <v-list class="pa-4" color="transparent">
          <!-- ---------------------------------------------- -->
          <!---Menu Loop -->
          <!-- ---------------------------------------------- -->
          <!--          <v-list-subheader >Games</v-list-subheader>-->
          <template v-for="game in props.games" :key="game.ID">
            <v-list-item
              :to="{ name: 'details', params: { id: game.ID } }"
              rounded="lg"
              class="mb-1"
            >
              <template v-slot:prepend>
                <el-avatar :size="20" :src="game.Icon" />
              </template>
              <v-list-item-title
                v-text="game.Name"
                class="pa-2"
              ></v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </perfect-scrollbar>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
  import { onMounted } from "vue";
  import { ref, watch } from "vue";
  import { useStore } from "vuex";
  import logo from "@/assets/logoDark.svg";
  const store = useStore();
  const props = defineProps({
    games: {
      type: Object,
      required: true,
    },
  });
  const mobileSize = ref(960);
  const bSidebar = ref(true);
  const bMini = ref(true);
  const scrollbarHeight = ref("height: var(--app-height);");
  const scrollnavbar = ref();

  function backTop() {
    scrollnavbar.value.$el.scrollTop = 0;
  }

  watch(
    () => store.getters.miniSidebar,
    (val) => {
      bMini.value = val;
      if (isMobile.value) {
        bSidebar.value = bMini.value;
      }
      calcScrollbarHeight();
    }
  );

  watch(
    () => store.getters.bSidebar,
    (val) => {
      bSidebar.value = val;
    }
  );

  function calcScrollbarHeight() {
    if (bMini.value ^ isMobile.value) {
      scrollbarHeight.value = "height: calc(var(--app-height) - 119px);";
    } else {
      scrollbarHeight.value = "height: calc(var(--app-height) - 213px);";
    }
  }

  const isMobile = ref(false);
  onMounted(() => {
    if (window.innerWidth <= mobileSize.value) {
      isMobile.value = true;
    }
    calcScrollbarHeight();
  });
  onresize = () => {
    isMobile.value = window.innerWidth <= mobileSize.value;
  };

  const railWidth = ref(75);
  watch(
    () => isMobile.value,
    () => {
      if (isMobile.value) {
        railWidth.value = 0;
        bSidebar.value = bMini.value;
      } else {
        railWidth.value = 75;
        bSidebar.value = store.getters.bSidebar;
      }
      calcScrollbarHeight();
    }
  );
</script>

<style lang="scss" scoped>
:deep(.v-navigation-drawer) {
  z-index: 100 !important;
  @media screen and (max-width: 960px) {
    width: 100% !important;
  }
}

:deep(.v-navigation-drawer__content) {
  overflow-y: hidden;
}

:deep(.scrollnavbar) {
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
      background: #414040;
    }
  }
}
</style>
