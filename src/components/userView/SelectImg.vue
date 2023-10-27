<template>
  <el-row>
    <el-col :span="24">
      <el-upload
        drag
        v-loading="loading"
        class="avatarBox"
        action="#"
        ref="imgRef"
        :auto-upload="false"
        :limit="1"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :http-request="uploadAction"
        :class="{ hide: uploadDisabled }"
        :on-change="handleChange"
        list-type="picture-card"
        accept="image/*"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon :size="100" v-else class="avatar-uploader-icon">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          Drop image here or <em>Click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            Only JPEG or PNG file with a size less than 2MB is allowed
          </div>

          <div
            v-if="!isCropped && imageUrl"
            class="el-upload__tip"
            style="font-weight: bold"
          >
            Please crop your image before upload
          </div>
          <el-button
            :disabled="!imageUrl"
            class="uploadBtn"
            @click="uploadAction"
            type="primary"
          >{{ isCropped ? "Update" : "Crop" }}
            {{ capitalizeFirstLetter(props.items) }} image
          </el-button>
        </template>
      </el-upload>

      <el-dialog class="dialogBox" v-model="imgVisible">
        <!-- <img w-full class="previewImg" :src="imageUrl" alt="Preview Image" /> -->
        <cropImg
          :items="props.items"
          :image="imageUrl"
          :cropperVisible="imgVisible"
          @confirmCrop="confirmCrop"
        >
        </cropImg>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script setup>
  import { ref } from "vue";
  import { ElMessage } from "element-plus";
  import { uploadImg } from "@/api/user.js";
  import {
    uploadCover,
    uploadBackground,
    uploadIcon,
    uploadScreenShot,
    uploadCapsule,
  } from "@/api/game.js";
  import cropImg from "./CropImg.vue";

  const props = defineProps({
    items: {
      type: String,
      required: true,
    },
    gameId: { type: String },
  });
  const imgVisible = ref(false);
  const imageUrl = ref("");
  const imgRef = ref("");
  const uploadDisabled = ref(false);
  const imgFile = ref(null);
  const emit = defineEmits(["resetDrawer"]);
  const isCropped = ref(false);
  const loading = ref(false);

  function resetDrawer() {
    loading.value = false;
    isCropped.value = false;
    let open = { content: false };
    emit("resetDrawer", open);
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // upload image with http request
  const uploadAction = () => {
    if (!isCropped.value) {
      ElMessage.error("Please crop your image before upload");
      if (imageUrl.value) {
        imgVisible.value = true;
      }
      return false;
    }
    if (imgFile.value.size / 1024 / 1024 > 2) {
      ElMessage.error("We only accept image size less than 2MB!");
      return false;
    }
    loading.value = true;
    const data = new FormData();
    data.append("file", imgFile.value);
    // for profile image
    if (props.items === "profile") {
      uploadImg(data).then((res) => {
        if (res.success) {
          ElMessage.success("Upload image successful");
          resetDrawer();
        } else {
          uploadFailed(res);
        }
      });
    // for game cover image
    } else if (props.items === "cover") {
      uploadCover(data, props.gameId).then((res) => {
        if (res.success) {
          ElMessage.success("Upload cover image successful");
          resetDrawer();
        } else {
          uploadFailed(res);
        }
      });
    // for game background image
    } else if (props.items === "background") {
      uploadBackground(data, props.gameId).then((res) => {
        if (res.success) {
          ElMessage.success("Upload background image successful");
          resetDrawer();
        } else {
          uploadFailed(res);
        }
      });
    // for game icon image on sidebar
    } else if (props.items === "icon") {
      uploadIcon(data, props.gameId).then((res) => {
        if (res.success) {
          ElMessage.success("Upload icon image successful");
          resetDrawer();
        } else {
          uploadFailed(res);
        }
      });
    // for game screenshots
    } else if (props.items === "screenshot") {
      uploadScreenShot(data, props.gameId).then((res) => {
        if (res.success) {
          ElMessage.success("Upload screenshot successful");
          resetDrawer();
        } else {
          uploadFailed(res);
        }
      });
    } else if (props.items === "capsule") {
      uploadCapsule(data, props.gameId).then((res) => {
        if (res.success) {
          ElMessage.success("Upload capsule successful");
          resetDrawer();
        } else {
          uploadFailed(res);
        }
      });
    }
  };

  function uploadFailed(res) {
    loading.value = false;
    if (res && res.msg) {
      ElMessage.error(res.msg);
    } else {
      ElMessage.error("Upload failed");
    }
  }

  const confirmCrop = (img) => {
    imgVisible.value = false;
    if (img) {
      let imageFile = dataURLtoFile(img.content, "image.jpg");
      imageUrl.value = URL.createObjectURL(imageFile);
      console.log(imageUrl.value);
      document.getElementsByClassName("el-upload-list__item-thumbnail")[0].src =
        imageUrl.value;
      imgFile.value = imageFile;
      isCropped.value = true;
    }
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  // check file size and type
  const handleChange = (file) => {
    isCropped.value = false;
    if (
      file.raw.type !== "image/jpeg" &&
      file.raw.type !== "image/png" &&
      file.raw.type !== "image/PNG" &&
      file.raw.type !== "image/JPG" &&
      file.raw.type !== "image/jpg"
    ) {
      imgRef.value.clearFiles();
      ElMessage.error("We only accept JPEG or PNG format!");
      return false;
    }
    imageUrl.value = URL.createObjectURL(file.raw);
    imgFile.value = file.raw;
    uploadDisabled.value = true;
    console.log(imageUrl.value);
    return true;
  };

  //delete current select image
  const handleRemove = () => {
    imageUrl.value = "";
    uploadDisabled.value = false;
    isCropped.value = false;
    return;
  };

  // view image in larger size
  const handlePreview = () => {
    imgVisible.value = true;
    return;
  };
</script>

<style lang="scss">
@import "/src/styles/gameDisplay.scss";

.el-upload-dragger {
  height: 100%;
  width: 100%;
  border-radius: 30px;
}

.avatar-uploader-icon {
  margin-top: 30%;
}

.hide .el-upload--picture-card {
  display: none !important;
}

.el-dialog__body .previewImg {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  min-width: 80%;
  min-height: 80%;
  max-width: 100%;
  max-height: 100%;
  transform: translate(-50%, -50%);
}

.avatarBox {
  height: 100%;
  text-align: center;
}

.avatarBox .avatar {
  width: 50vw;
  height: 50vh;
  margin: auto;
}

.avatarBox .el-upload:hover {
  border-color: var(--el-color-primary);
}

.uploadBtn {
  text-align: center;
  background-color: grey;
  height: auto;
  width: auto;
  border-radius: 30px;
  font-size: 1rem;
  margin-bottom: 30px;
}

.el-upload-list--picture-card {
  --el-upload-list-picture-card-size: 100%;
  margin-top: auto;
}

.el-upload--picture-card {
  height: 80vw !important;
  width: 80vw !important;
  max-width: 500px;
  max-height: 500px;
  border-radius: 30px !important;
  margin-top: 5%;
}

.el-drawer__title {
  text-align: center;
  font-size: 2vw;
}

.el-dialog {
  --el-dialog-width: 100%;
  height: 100%;
  overflow: auto;
  margin: auto;
}

.dialogBox .el-dialog__body {
  text-align: center;
  height: inherit;
}

.el-upload__tip {
  font-size: 0.8rem;
  text-align: center;
  color: white;
  margin-bottom: 20px;
  margin-top: 20px;
}

.el-row {
  margin-left: auto;
  margin-right: auto;
}

.el-upload-list--picture-card .el-upload-list__item {
  margin-top: 5%;
  margin-right: 0;
  margin-left: 0;
}
</style>
