<template>
  <div class="common-layout">
    <navBar />
    <GameList />
  </div>
</template>

<script setup>
  import navBar from "@/components/NavBar.vue";
  import GameList from "@/components/userView/gameList.vue";
  import { listGame } from "@/api/tags";
  import { ref, onMounted } from "vue";
  import { ElMessage } from "element-plus";
  const games = ref();
  // add tags prepare for render
  onMounted(async () => {
    await listGame()
      .then((response) => {
        if (response.data.length > 0) {
          games.value = response.data;
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        ElMessage.error("Oops something went wrong. Please try again!");
      });

  /* listTags()
    .then(
        data => {
            if (data.data.length > 0) {
                allTags.value = data.data
            }
        },
    )
    .catch((error) => {
        console.log('error:', error)
        ElMessage.error('Oops something went wrong, please try again')
    }) */
  });
</script>

<style lang="scss" scoped>
@import "@/styles/mainPage.scss";
</style>
