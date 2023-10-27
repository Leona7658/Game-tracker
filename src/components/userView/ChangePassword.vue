<template>
  <el-form
    label-width="auto"
    label-position="left"
    ref="passwordFormRef"
    :model="passwordForm"
    :rules="rules"
    class="pwdForm"
    @keyup.enter="onSubmit"
  >
    <el-form-item label="Current password" prop="old" class="label">
      <el-input v-model="passwordForm.old" :type="oldPwdType">
        <template #suffix>
          <el-icon class="el-input__icon" @click="changeOldPwdView">
            <View v-if="oldPwdType === 'text'" />
            <Hide v-else />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="New password" prop="new" class="label">
      <el-input v-model="passwordForm.new" :type="passwordType">
        <template #suffix>
          <el-icon class="el-input__icon" @click="changePwdView">
            <View v-if="passwordType === 'text'" />
            <Hide v-else />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button class="changebtn" type="primary" @click="onSubmit" round
      >Change Password</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script setup>
  import { ref, reactive } from "vue";
  import { ElMessage } from "element-plus";
  import { useStore } from "vuex";
  import { validatePassword } from "@/utils/inputValidation.js";
  import { changePwd } from "@/api/user.js";
  import router from "@/router";
  // get userinfo
  const store = useStore();
  const data = ref(store.getters.userInfo);
  const passwordType = ref("password");
  const oldPwdType = ref("password");
  const changePwdView = () => {
    passwordType.value = passwordType.value === "password" ? "text" : "password";
  };
  const changeOldPwdView = () => {
    oldPwdType.value = oldPwdType.value === "password" ? "text" : "password";
  };

  // password data form to be posted
  const passwordForm = reactive({
    username: data.value.username,
    new: "",
    old: "",
  });
  // validating
  const rules = reactive({
    new: [{ required: true, trigger: "blur", validator: validatePassword() }],
    old: [
      {
        required: true,
        trigger: "blur",
        message: "Please enter your current password",
      },
    ],
  });
  const passwordFormRef = ref(null);

  // handle request
  const onSubmit = () => {
    passwordFormRef.value.validate((valid) => {
      if (valid) {
        changePwd({
          Username: passwordForm.username,
          Old: passwordForm.old,
          New: passwordForm.new,
        })
          .then(
            (data) => {
              ElMessage({
                message: data.message || "Password has updated! ",
                type: "success",
                duration: 3 * 1000,
              });
              if (data.success) {
                store.dispatch("user/resetToken").then(() => {
                  router.push("/login");
                });
              }
            },
            (passwordForm.old = ""),
            (passwordForm.new = "")
          )
          .catch((res) => {
            console.log(res);
            console.log(res.response);
          });
      } else {
        // error message for user
        ElMessage.error("Error occur, please try again");
        return false;
      }
    });
  };
</script>

<style lang="scss">
.pwdForm {
  background-color: transparent;
  margin: 0;
  width: 90%;
  height: 100%;
  min-height: 50vh;
}

.label {
  max-width: 550px;
}

.label .el-form-item__label {
  justify-content: flex-start;
  color: white;
  font-size: 0.8rem;
}

.el-input {
  padding-left: 5%;
}

.changebtn {
  background: grey;
  border-radius: 30px;
  margin-left: 125px;
  margin-right: auto;
  width: auto;

  @media screen and (max-width: 960px) {
    margin-left: auto;
  }
}
</style>
