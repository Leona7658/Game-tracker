<template>
  <div class="Sidebar">
    <SidebarInner :games="games" v-if="loadData"> </SidebarInner>
  </div>
</template>

<script setup>
  import SidebarInner from "./SidebarInner";
  import { ref, onMounted, watch } from "vue";
  import { useStore } from "vuex";
  import { listGame } from "@/api/game";
  import { ElMessage } from "element-plus";
  const games = ref();
  const loadData = ref(false);
  const store = useStore();
  onMounted(async () => {
    await listGame()
      .then((response) => {
        games.value = response.data;
        store.commit("layout/SET_GAME_LIST", response.data);
        loadData.value = true;
      })
      .catch((error) => {
        console.log("error:", error);
        ElMessage.error("Oops something went wrong. Please try again");
      });
  });

  watch(
    () => store.getters.gamelist,
    (val) => {
      games.value = val;
    //console.log("Update sidebar", val)
    }
  );

  watch(
    () => store.getters.lastModified,
    async () => {
      await listGame()
        .then((response) => {
          games.value = response.data;
          store.commit("layout/SET_GAME_LIST", response.data);
        })
        .catch((error) => {
          console.log("error:", error);
          ElMessage.error("Oops something went wrong. Please try again");
        });
    }
  );
</script>

<style lang="scss" scoped></style>
