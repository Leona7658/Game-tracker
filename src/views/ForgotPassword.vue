<template>
  <div class="forgot container">
    <navBar />
    <el-container>
      <el-main>
        <el-form
          v-if="!codeSent"
          ref="codeFormRef"
          :model="codeForm"
          :rules="rules"
          class="form"
        >
          <h1>Forgot Password</h1>
          <h3>Please Enter Your Username</h3>
          <el-form-item prop="username">
            <el-input
              v-model="codeForm.username"
              placeholder="Username"
              type="text"
              @keydown.enter="sendCode"
            >
            </el-input>
          </el-form-item>

          <router-link to="/login" custom v-slot="{ navigate }">
            <div class="link" @click="navigate">Remember Your Password?</div>
          </router-link>

          <el-form-item>
            <el-button type="primary" @click="sendCode" round>Send</el-button>
          </el-form-item>
        </el-form>

        <el-form
          v-else
          ref="forgotFormRef"
          :model="forgotForm"
          :rules="rules"
          class="form"
          @keyup.enter="onSubmit"
        >
          <h1>Forgot Password</h1>
          <h3>Please enter your new password and verification code</h3>

          <el-form-item prop="code">
            <el-input
              v-model="forgotForm.code"
              placeholder="Enter the verification code"
              type="text"
            >
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="forgotForm.password"
              placeholder="Enter new password"
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

          <router-link to="/login" custom v-slot="{ navigate }">
            <div class="link" @click="navigate">Remember Your Password?</div>
          </router-link>

          <el-form-item>
            <el-button type="primary" @click="onSubmit" round>Submit</el-button>
          </el-form-item>
        </el-form>

        <el-form
          v-if="codeSent"
          ref="codeFormRef"
          :model="codeForm"
          :rules="rules"
        >
          <el-form-item>
            <el-button
              type="primary"
              @click="sendCode"
              :loading="disabled"
              :disabled="disabled"
              :loading-icon="Eleme"
              round
            >{{ text }}</el-button
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
  import { ref, reactive, toRefs } from "vue";
  import { ElMessage } from "element-plus";
  import navBar from "@/components/NavBar.vue";
  import { validatePassword, validateCode } from "@/utils/inputValidation.js";
  import { useStore } from "vuex";
  import { Eleme } from "@element-plus/icons-vue";
  import router from "@/router";

  // prepare for sending verification code to user
  const codeSent = ref(false);
  const passwordType = ref("password");
  const changePwdView = () => {
    passwordType.value = passwordType.value === "password" ? "text" : "password";
  };
  const resendBtn = reactive({
    duration: 10,
    timer: null,
    disabled: true,
    text: "Resend Email",
  });

  const codeForm = reactive({
    username: "",
    eventType: "forgot_password",
  });
  const forgotForm = reactive({
    password: "",
    code: "",
    eventId: "",
  });

  //checking new password and code enter is valid
  const rules = reactive({
    password: [
      {
        required: true,
        message: "Please enter your new password",
        trigger: "blur",
        validator: validatePassword(),
      },
    ],
    code: [
      {
        required: true,
        message: "Please enter the verification code",
        trigger: "blur",
        validator: validateCode(),
      },
    ],
    username: [
      { required: true, message: "Please enter your username", trigger: "blur" },
    ],
  });

  const codeFormRef = ref(null);
  const forgotFormRef = ref(null);
  const store = useStore();
  // prepare to record event id sent back by server

  // send code to user email
  const sendCode = () => {
    console.log("code:", codeForm.username);
    codeFormRef.value.validate((valid) => {
      if (valid) {
        codeSent.value = true;
        setTimer();
        store.dispatch("user/sendCode", codeForm).then((data) => {
          //console.log("data: ", data)
          ElMessage({
            message: data.message || "Code sent Successfully!",
            type: "success",
            duration: 3 * 1000,
          }),
          (forgotForm.eventId = data.data.ID);
        });
      } else {
        ElMessage.error("Error occur, please try again");
        return false;
      }
    });
  };

  // reset new password
  const onSubmit = () => {
    forgotFormRef.value.validate((valid) => {
      if (valid) {
        store.dispatch("user/resetPwd", forgotForm).then((data) => {
          //console.log("data: ", data)
          ElMessage({
            message: data.message || "Reset password Successfully!",
            type: "success",
            duration: 3 * 1000,
          });
          (forgotForm.code = ""), (forgotForm.password = "");
          forgotForm.eventId = "";
          if (data.success) {
            router.push("/login");
          }
        });
      } else {
        ElMessage.error("Error occur, please try again");
        return false;
      }
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
        resendBtn.text = "Resend verification code";
        // enable button
        resendBtn.disabled = false;
      }
    }, 1000);
  };
  const { disabled, text } = toRefs(resendBtn);
</script>

<style lang="scss" scoped>
@import "/src/styles/forgotPassword.scss";
</style>
