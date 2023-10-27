<template>
  <div class="login container">
    <navBar />
    <el-container>
      <el-main>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          class="form"
          @keyup.enter="onLogin"
          v-loading="loading"
        >
          <h1>Login</h1>
          <h3>Please enter your username and password</h3>

          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="Username"
              type="text"
            >
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="Password"
              :type="passwordType"
            >
              <template #suffix>
                <el-icon class="el-input__icon" @click="changePwdView">
                  <View v-if="passwordType === 'text'" />
                  <Hide v-else />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <router-link to="/forgot" custom v-slot="{ navigate }">
            <div class="link" @click="navigate">Forgot password?</div>
          </router-link>

          <el-form-item>
            <el-button type="primary" @click="onLogin" round>Login</el-button>
          </el-form-item>
        </el-form>

        <el-footer>
          <div class="footer">Copyright © 2022 KyByte Team All rights reserved</div>
        </el-footer>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
  import { useStore } from "vuex";
  import { ref, reactive, onMounted } from "vue";
  import { ElMessage } from "element-plus";
  import router from "@/router";
  import navBar from "@/components/NavBar.vue";
  import { validatePassword } from "@/utils/inputValidation.js";
  import { addDefaultTags } from "@/utils/addDefaultTags";
  import { listTags } from "@/api/tags";
  import { useRoute } from "vue-router";

  const route = useRoute();
  const passwordType = ref("password");

  const changePwdView = () => {
    passwordType.value = passwordType.value === "password" ? "text" : "password";
  };
  // show loading when submit request
  const loading = ref(false);
  // prepare input data form binding
  const loginForm = reactive({
    username: "",
    password: "",
  });

  // validate input is not empty and follow password format
  const rules = reactive({
    username: [
      { required: true, message: "Please enter your username", trigger: "blur" },
    ],
    password: [
      { required: true, trigger: "blur", validator: validatePassword() },
    ],
  });
  const store = useStore();
  const loginFormRef = ref(null);

  // login request handler
  const onLogin = () => {
    // validte user input
    loginFormRef.value.validate((valid) => {
      if (valid) {
        loading.value = true;
        // send input to do http post
        store
          .dispatch("user/login", loginForm)
          .then((data) => {
            ElMessage({
              message: data.message || "Login Successful!",
              type: "success",
              duration: 3 * 1000,
            });
            // add default tags for each new user
            if (data.success) {
              updateTags();
            }
          })
          .catch((res) => {
            loading.value = false;
            console.log(res);
            console.log(res.response);
          });
      } else {
        ElMessage.error("Error occur, please try again");
        return false;
      }
    });
  };

  // add default tags handler
  async function updateTags() {
    const response = await listTags();
    // check if it is a first user by inspecting the tag list
    if (JSON.stringify(response.data) === "{}") {
      await addDefaultTags();
    }
    loading.value = false;
    router.push("/main");
  }

  onMounted(() => {
    console.log("Watching", route.query);
    if (Object.keys(route.query).length > 0) {
      const activation = decodeURIComponent(route.query.activate);
      const msg = decodeURIComponent(route.query.message);
      if (activation === "success") {
        ElMessage.success(msg);
      } else {
        ElMessage.error(msg);
      }
    }
  });
</script>

<style lang="scss" scoped>
@import "/src/styles/login.scss";
</style>
