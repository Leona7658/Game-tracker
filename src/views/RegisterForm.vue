<template>
  <div class="register container">
    <navBar />
    <el-container>
      <el-main>
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="rules"
          class="form"
          v-loading="loading"
          @keyup.enter="onRegister"
        >
          <h1>Register</h1>
          <h2>Please fill in the information below.</h2>
          <h3>An activation email will be sent to your account.</h3>

          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="Username"
              type="text"
              :disabled="resend"
            >
            </el-input>
          </el-form-item>

          <el-form-item prop="nickname">
            <el-input
              v-model="registerForm.nickname"
              placeholder="Nickname"
              type="text"
              :disabled="resend"
            >
            </el-input>
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="Email"
              type="text"
              :disabled="resend"
            >
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              placeholder="Password"
              :type="passwordType"
              :disabled="resend"
            >
              <template #suffix>
                <el-icon class="el-input__icon" @click="changePwdView">
                  <View v-if="passwordType === 'text'" />
                  <Hide v-else />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <router-link to="/login" custom v-slot="{ navigate }">
            <div class="link" @click="navigate">Already Have an Account?</div>
          </router-link>

          <el-form-item v-if="resend">
            <el-button
              type="primary"
              @click="onResend"
              :loading="disabled"
              :disabled="disabled"
              round
              :loading-icon="Eleme"
            >
              {{ text }}
            </el-button>
          </el-form-item>

          <el-form-item v-else>
            <el-button type="primary" @click="onRegister" round
            >Register</el-button
            >
          </el-form-item>
        </el-form>
      </el-main>

      <el-footer>
        <div class="footer">Copyright © 2022 KyByte Team All rights reserved</div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
  import { useStore } from "vuex";
  import { ref, reactive, toRefs } from "vue";
  import { ElMessage } from "element-plus";
  import navBar from "@/components/NavBar.vue";
  import { validatePassword } from "@/utils/inputValidation.js";
  import { Eleme } from "@element-plus/icons-vue";
  // prepare input form and binding data
  const resend = ref(false);
  const passwordType = ref("password");
  const loading = ref(false);
  const resendBtn = reactive({
    duration: 10,
    timer: null,
    disabled: true,
    text: "Resend Email",
  });

  const changePwdView = () => {
    passwordType.value = passwordType.value === "password" ? "text" : "password";
  };

  const registerForm = reactive({
    username: "",
    nickname: "",
    email: "",
    password: "",
  });

  // validation of input
  const rules = reactive({
    username: [
      { required: true, message: "Please enter your username", trigger: "blur" },
    ],
    email: [
      { required: true, message: "Please enter your email", trigger: "blur" },
    ],
    password: [
      { required: true, trigger: "blur", validator: validatePassword() },
    ],
    nickname: [{ required: true, trigger: "blur" }],
  });
  // user registration handler
  const store = useStore();
  const registerFormRef = ref(null);
  const onRegister = () => {
    registerFormRef.value.validate((valid) => {
      if (valid) {
        loading.value = true;
        setTimer();
        store
          .dispatch("user/register", registerForm)
          .then((data) => {
            ElMessage({
              message: "Email sent!",
              type: "success",
              duration: 3 * 1000,
            });
            if (data.success) {
              loading.value = false;
            }
            resend.value = true;
          })
          .catch((res) => {
            console.log(res);
            console.log(res.response);
            loading.value = false;
          });
      } else {
        ElMessage.error("Error occur, please try again");
        loading.value = false;
        return false;
      }
    });
  };

  // resend request handler
  const onResend = () => {
    setTimer();

    store
      .dispatch("user/resend", registerForm.username)
      .then((data) => {
        ElMessage({
          message: data.message || "Successfully resended!",
          type: "success",
          duration: 3 * 1000,
        });
      }, (resend.value = true))
      .catch((res) => {
        console.log(res);
        console.log(res.response);
      });
  };

  // only allow resend email after 10 second
  const setTimer = () => {
    // clear timer
    resendBtn.timer && clearInterval(resendBtn.timer);
    // start timer
    resendBtn.timer = setInterval(() => {
      const tmp = resendBtn.duration--;
      resendBtn.text = `${tmp} second`;
      resendBtn.disabled = true;
      if (tmp <= 0) {
        // clear timer
        clearInterval(resendBtn.timer);
        resendBtn.duration = 10;
        resendBtn.text = "Resend activation email";
        // enable button
        resendBtn.disabled = false;
      }
    }, 1000);
  };
  const { disabled, text } = toRefs(resendBtn);
</script>

<style lang="scss" scoped>
@import "/src/styles/register.scss";
</style>
