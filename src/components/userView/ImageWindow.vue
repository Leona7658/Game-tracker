<template>
  <el-drawer
    v-model="drawer"
    title="Upload Image"
    :before-close="handleClose"
    direction="ltr"
    :destroy-on-close="true"
    size="100%"
  >
    <div>
      <SelectImg
        @resetDrawer="resetDrawer"
        :items="props.items"
        :gameId="gameId"
      />
    </div>
  </el-drawer>
</template>

<script setup>
  import { ref } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import SelectImg from "@/components/userView/SelectImg.vue";

  const props = defineProps({
    items: {
      type: String,
      required: true,
    },
    gameId: { type: String },
  });
  const emit = defineEmits(["resetParent"]);

  //reset edit settings so drawer don't open
  function resetParent() {
    let open = { content: false };
    emit("resetParent", open);
  }

  const drawer = ref(true);

  //closing drawer with message reminder
  const handleClose = () => {
    ElMessageBox.confirm("Are you sure you want to close this?", "Warning", {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    })
      .then(() => {
        //reset all values used
        cancelForm();
        ElMessage({
          type: "success",
          message: "Welcome back",
        });
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "Continue",
        });
      });
  };

  // reset all values
  const cancelForm = () => {
    drawer.value = false;
    resetParent();
  };

  const resetDrawer = () => {
    drawer.value = false;
    resetParent();
  };
</script>

<style lang="scss">
.el-drawer__header {
  color: white;
  font-size: 2vw !important;
}

.el-drawer.ltr {
  background-color: #36393f;
}
</style>
