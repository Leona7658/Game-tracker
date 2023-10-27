<template>
  <div class="user-container">
    <navBar />
    <el-container style="margin-top: 67px">
      <el-main>
        <el-row>
          <el-col :span="24">
            <h1>Instruction for Adding Steam Games to Our System</h1>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form
              v-loading="loading"
              ref="steamFormRef"
              :model="steamForm"
              :rules="rules"
              size="large"
              label-position="top"
              label-width="auto"
              class="addAPI"
            >
              <el-form-item prop="steamId" label="Steam Id">
                <el-input
                  v-model="steamForm.steamId"
                  placeholder="Enter Steam Id"
                  type="text"
                  autosize
                >
                </el-input>
              </el-form-item>
              <el-form-item prop="token" label="Steam API Key">
                <el-input
                  v-model="steamForm.token"
                  placeholder="Enter Steam API Key"
                  autosize
                  type="text"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button @click="onAdd" type="primary" class="addbtn"
                >Add Steam Games</el-button
                >
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <el-row v-if="submitted">
          <el-col :span="24">
            <h1>
              Adding steam games will take a few minutes, please feel free to
              leave this page by clicking the link below
            </h1>
            <el-button class="addbtn" type="primary" @click="leavePage"
            >Back to Main Page</el-button
            >
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :lg="12" :md="12" :xs="24">
            <div class="instruction">
              <h3>Steam ID can be found under steam database:</h3>
              <a class="click" target="_blank" href="https://steamid.io/lookup/"
              >Click to Get Steam Id</a
              >
              <a :href="STEAM_ID" target="_blank">
                <img class="infoImg" :src="STEAM_ID" />
              </a>
            </div>
          </el-col>

          <el-col :lg="12" :md="18" :xs="24">
            <div class="instruction">
              <h3>Steam API Key can be found under Steam Website:</h3>
              <a
                class="click"
                target="_blank"
                href="https://steamcommunity.com/dev/apikey"
              >Click to Get Steam API</a
              >
              <a :href="STEAM_TOKEN" target="_blank">
                <img class="infoImg" :src="STEAM_TOKEN" />
              </a>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
  import navBar from "@/components/NavBar.vue";
  import { ref, reactive } from "vue";
  import { addSteamGame } from "@/api/steam.js";
  import { ElMessage } from "element-plus";
  import router from "@/router";
  import STEAM_ID from "@/assets/steam/steamId.png";
  import STEAM_TOKEN from "@/assets/steam/steamToken.png";
  // prepare input steam information
  const steamForm = reactive({
    token: "",
    steamId: "",
  });

  // input validation
  const rules = reactive({
    token: [
      {
        required: true,
        message: "Please enter your steam api key",
        trigger: "blur",
      },
    ],
    steamId: [
      { required: true, message: "Please enter your steam id", trigger: "blur" },
    ],
  });
  const steamFormRef = ref(null);
  const loading = ref(false);
  const submitted = ref(false);

  // add steam games request handler
  const onAdd = () => {
    loading.value = true;
    steamFormRef.value.validate((valid) => {
      if (valid) {
        submitted.value = true;
        addSteamGame({
          Token: steamForm.token,
          Steamid: steamForm.steamId,
        }).then((data) => {
          ElMessage({
            message: data.message || "Add steam games successfully!",
            type: "success",
            duration: 3 * 1000,
          });
          loading.value = false;
          // back to main page
          router.push("/main");
        });
      } else {
        ElMessage.error("Error occur, please try again");
        return false;
      }
    });
  };

  const leavePage = () => {
    router.push("/main/game");
  };
</script>

<style lang="scss">
@import "/src/styles/steamGame.scss";
</style>
