<template>
  <div class="user-container">
    <navBar />
    <el-container>
      <el-main style="margin-top: 67px">
        <el-row>
          <el-col :span="24">
            <h1 class="title">Manually Adding Game</h1>
            <el-form
              v-loading="loading"
              ref="gameFormRef"
              :model="gameForm"
              :rules="rules"
              size="large"
              label-position="top"
              label-width="auto"
              class="addGame"
            >
              <el-form-item prop="name" label="Game Name">
                <el-input
                  v-model="gameForm.name"
                  placeholder="Enter Game Name"
                  :autosize="{ minRows: 1 }"
                  type="textarea"
                ></el-input>
              </el-form-item>
              <el-form-item prop="description" label="Game Description">
                <el-input
                  v-model="gameForm.description"
                  placeholder="Enter Game Description"
                  :autosize="{ minRows: 4 }"
                  type="textarea"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button @click="onAdd" type="primary" class="addbtn"
                >Add New Game</el-button
                >
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
  import navBar from "@/components/NavBar.vue";
  import { ref, reactive } from "vue";
  import { addGame } from "@/api/game.js";
  import { ElMessage } from "element-plus";
  import router from "@/router";

  // prepare input game details
  const gameForm = reactive({
    name: "",
    description: "",
  });

  const gameFormRef = ref(null);
  const loading = ref(false);
  // input validation
  const rules = reactive({
    name: [
      { required: true, message: "Please enter game name", trigger: "blur" },
    ],
    description: [
      {
        required: true,
        message: "Please enter game description",
        trigger: "blur",
      },
    ],
  });

  // add game request handler
  const onAdd = () => {
    loading.value = true;
    gameFormRef.value.validate((valid) => {
      if (valid) {
        addGame({
          GameName: gameForm.name,
          Description: gameForm.description,
        }).then((data) => {
          ElMessage({
            message: data.message || "Add new game successfully!",
            type: "success",
            duration: 3 * 1000,
          });
          loading.value = false;
          // back to main page
          router.push("/main");
        });
      } else {
        loading.value = false;
        ElMessage.error("Error occur, please try again");
        return false;
      }
    });
  };
</script>

<style lang="scss">
@import "@/styles/addGame.scss";
</style>
