<template>
  <div>
    <div>
      <div class="el-drawer__title">Crop Image</div>
      <div class="cropperWrapper">
        <div
          :style="{ backgroundImage: 'url(' + props.image + ')' }"
          class="imageBackground"
        ></div>
        <Cropper
          ref="cropper"
          class="cropper"
          background-class="cropperBackground"
          :src="imageUrl"
          :stencil-props="{
            aspectRatio: aspectRatioNumber,
          }"
          :resizeImage="{
            touch: true,
            wheel: false,
          }"
        />
      </div>
      <el-button
        :disabled="!props.image"
        class="confirmBtn"
        type="primary"
        @click="confirmCrop"
      >Confirm</el-button
      >
    </div>
  </div>
</template>

<style scoped>
@import "vue-advanced-cropper/dist/style.css";
</style>

<script setup>
  import { ref, onMounted, watch } from "vue";
  import { Cropper } from "vue-advanced-cropper";
  import "vue-advanced-cropper/dist/theme.bubble.css";

  const props = defineProps({
    items: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    cropperVisible: {
      type: Boolean,
      required: true,
    },
  });
  const emit = defineEmits(["confirmCrop"]);
  const cropper = ref();
  const imageUrl = ref("");

  function confirmCrop() {
    let newImage = {
      content: cropper.value.getResult().canvas.toDataURL("image/jpeg"),
    };
    emit("confirmCrop", newImage);
  }

  function determineRatio() {
    if (props.items === "cover") {
      aspectRatioNumber.value = 6 / 9;
    } else if (props.items === "capsule") {
      aspectRatioNumber.value = 616 / 353;
    } else if (props.items === "background") {
      aspectRatioNumber.value = 16 / 9;
    } else if (props.items === "screenshot") {
      aspectRatioNumber.value = 16 / 9;
    } else {
      aspectRatioNumber.value = 1.0;
    }
  }

  const aspectRatioNumber = ref();
  onMounted(() => {
    console.log("cropImg mounted");
    determineRatio();
    imageUrl.value = props.image;
  });

  watch(
    () => props.cropperVisible,
    (val) => {
      if (val) {
        console.log("cropping image:", props.image);
        determineRatio();
        imageUrl.value = props.image;
      }
    }
  );
</script>

<style>
.vue-advanced-cropper__foreground {
  border-radius: 5px;
}

.cropper {
  border: solid 1px #eee;
  width: 100%;
  height: auto;
}

.confirmBtn {
  margin-top: 20px;
  text-align: center;
  background-color: grey;
  height: auto;
  width: auto;
  border-radius: 30px;
  font-size: 1rem;
  margin-bottom: 30px;
}

.cropperWrapper {
  border-radius: 5px;
  margin-top: 5%;
  width: 100%;
  height: 100%;
  position: relative;
  background: black;
}

.cropperBackground {
  background: none;
}

.imageBackground {
  position: absolute;
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  left: -10px;
  top: -10px;
  background-size: cover;
  background-position: 50%;
  filter: blur(5px);
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
}
</style>
