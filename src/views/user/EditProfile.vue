<template>
  <div class="user-container">
    <navBar />

    <el-container class="contentBox" style="margin-top: 67px; color: white">
      <el-main>
        <el-row :gutter="40">
          <el-col :lg="12" :md="12" :xs="24">
            <el-row>
              <el-col :span="24">
                <img
                  class="imgBox"
                  :src="data.avatar"
                  alt="profile image"
                  :key="data"
                />
              </el-col>
            </el-row>

            <el-row>
              <el-row>
                <div class="nickname">
                  <h1>{{ data.nickname }}</h1>

                  <el-button class="editBtn" type="primary" @click="onEdit">
                    <el-icon :size="15">
                      <EditPen />
                    </el-icon>
                  </el-button>
                </div>
              </el-row>
            </el-row>
          </el-col>

          <el-col :lg="12" :md="12" :xs="24">
            <el-row>
              <el-col :span="24">
                <div class="title">Details</div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <div class="detail">Email: {{ data.email }}</div>
                <div class="detail">Username: {{ data.username }}</div>
                <div v-if="!updateName" class="detail">
                  Nickname: {{ data.nickname }}
                </div>
                <div v-else class="inputNickname">
                  <el-input
                    v-model="nickname"
                    placeholder="Update Nickname"
                  ></el-input>
                </div>
                <div v-if="!updateName" class="detailBottom">
                  <el-button @click="changeName"> Update</el-button>
                </div>
                <div v-else class="detailBottom">
                  <el-button @click="onUpdate"> Submit</el-button>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <div class="title">Change Password</div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <ChangePwd />
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <ImageWindow v-if="edit" @resetParent="onReset" :items="info" />
  </div>
</template>

<script setup>
  import navBar from "@/components/NavBar.vue";
  import ChangePwd from "@/components/userView/ChangePassword.vue";
  import ImageWindow from "@/components/userView/ImageWindow.vue";
  import { changeNickname } from "@/api/user";
  import { useStore } from "vuex";
  import { ref } from "vue";
  import { ElMessage } from "element-plus";

  // get userinfo from store vuex
  const store = useStore();
  const data = ref(store.getters.userInfo);
  const edit = ref(false);
  const updateName = ref(false);
  const nickname = ref("");
  const info = ref("profile");

  // open upload image drawer
  const onEdit = () => {
    edit.value = !edit.value;
  };

  const changeName = () => {
    updateName.value = !updateName.value;
  };

  const onUpdate = () => {
    if (nickname.value !== data.value.nickname && nickname.value !== "") {
      changeNickname({
        Nickname: nickname.value,
      }).then((data) => {
        ElMessage({
          message: data.message || "Update nickname Successfully!",
          type: "success",
          duration: 3 * 1000,
        });
        updateName.value = false;
        nickname.value = "";
        onRefresh();
      });
    } else {
      ElMessage({
        message: "New nickname cannot be the same as old nickname or empty",
        type: "error",
        duration: 3 * 1000,
      });
    }
  };

  // disable image drawer
  const onReset = async (val) => {
    edit.value = val.content;
    store.dispatch("user/getUserInfo").then(() => {
      data.value = store.getters.userInfo;
      if (document.getElementById("avatar")) {
        document.getElementById("avatar").src = store.getters.userInfo.avatar;
      }
    });
  };

  const onRefresh = () => {
    store.dispatch("user/getUserInfo").then(() => {
      data.value = store.getters.userInfo;
      if (document.getElementById("nickname")) {
        document.getElementById("nickname").value =
          store.getters.userInfo.nickname;
      }
    });
  };
</script>

<style lang="scss">
@import "/src/styles/gameDisplay.scss";
</style>
