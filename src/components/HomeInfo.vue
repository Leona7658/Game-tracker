<template>
  <el-col
    class="box"
    v-for="item in props.items"
    :key="item.name"
    :lg="6"
    :md="10"
    :xs="22"
  >
    <div>
      <img :src="item.imgPath" alt="/" />
      <p>{{ item.name }}</p>
      <div class="msg">{{ item.msg }}</div>
    </div>
  </el-col>
</template>

<script setup>
  const props = defineProps({
    items: {
      type: Array,
      required: true,
    },
  });
</script>

<style lang="scss" scoped>
img {
  width: 60px;
  height: 60px;
  margin-top: 2vh;
}

.el-col {
  margin-bottom: 5vh;
}

.box {
  border-radius: 30px;
  max-width: 500px;
  min-width: 310px;
  width: 15vw;
  height: 25vh;
  background-color: #62666b;
  text-align: center;
}

p {
  font-size: max(20px, 1vw);
}

.msg {
  font-size: 1.2rem;
  margin-top: 1vh;
  margin-bottom: 1vh;
  margin-left: 3vw;
  margin-right: 3vw;

  @media screen and (max-width: 960px) {
    font-size: 1.0rem;
  }
}
</style>
