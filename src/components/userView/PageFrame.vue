<template>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '250px'">
      <el-menu
        default-active="1"
        active-text-color="#fff"
        background-color="#272727"
        class="el-menu-vertical-demo"
        text-color="#ccc"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <div @click="toggleCollapse">
          <el-icon color="#ffffff" class="no-inherit" :size="30">
            <Expand />
          </el-icon>
        </div>
        <router-link to="/main">
          <el-menu-item index="1">
            <el-icon>
              <House />
            </el-icon>
            <template #title>Home</template>
          </el-menu-item>
        </router-link>

        <router-link to="/profile">
          <el-menu-item index="2">
            <el-icon>
              <User />
            </el-icon>
            <template #title>User profile</template>
          </el-menu-item>
        </router-link>

        <el-menu-item index="3">
          <el-icon color="#fff" class="no-inherit" :size="25">
            <InfoFilled />
          </el-icon>
          <template #title>
            About
            <router-link to="/about">
              <el-button type="info" size="small">Leaving this page</el-button>
            </router-link>
          </template>
        </el-menu-item>

        <router-link
          :to="{ name: 'details', params: { id: game.ID } }"
          v-for="game in props.games"
          :key="game.ID"
        >
          <el-menu-item index="4">
            <el-avatar :size="20" :src="game.Icon" />
            <template #title>{{ game.Name }}</template>
          </el-menu-item>
        </router-link>
      </el-menu>
    </el-aside>
    <slot></slot>
  </el-container>
</template>

<script setup>
  import { ref } from "vue";
  // accepting data passed from parents
  const props = defineProps({
    games: {
      type: Array,
      required: true,
    },
  });

  const isCollapse = ref(false);
  // sidebar controller
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  // width: 200px;
  min-height: 400px;
}

.el-header {
  line-height: 20px;
  margin: 8px;
  border-radius: 5px;
  padding: 8px 20px;
  height: 50px;
  background-color: black;

  // Navbar left
  .header_left {
    display: flex;

    .header_text {
      margin-left: 20px;
      font-size: 25px;
    }

    .inputs {
      .el-input {
        border-radius: 20px;
      }

      margin-left: 20px;
      width: 25rem;
    }
  }

  // Navbar right
  .header_right {
    padding-top: 5px;
    display: flex;

    .loginRegister {
      margin-left: 10%;

      .login {
        width: 2.875rem;
        padding-top: 5px;
      }

      line-height: 20px;
      display: flex;

      div {
        margin-left: 4%;
      }
    }

    .line {
      margin-left: 20px;
      padding-right: 2px;
      height: 28px;
      width: 1px;
      background-color: RGB(58, 58, 58);
    }

    .header_right_icon {
      display: flex;
      margin-left: 10%;

      div {
        margin-left: 10px;
      }
    }

    .example-showcase .el-dropdown-link {
      cursor: pointer;
      color: var(--el-color-primary);
      display: flex;
      align-items: center;
    }
  }
}

// Sidebar
.el-aside {
  background-color: RGB(39, 39, 39);
  height: var(--app-height);
  margin-left: 10px;
  padding: 10px;

  .tablist {
    cursor: pointer;
    display: flex;
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 3px solid transparent;

    div:last-child {
      padding-top: 5px;
      margin-left: 20px;
    }
  }

  .active {
    color: RGB(230, 162, 60);
    border-left: 3px solid RGB(230, 162, 60);
    padding-left: 10px;

    .el-icon {
      color: RGB(230, 162, 60);
    }
  }

  .active:hover {
    border-left: 3px solid #fff;
  }

  .tablist:hover {
    color: #fff;

    .el-icon {
      color: #fff;
    }
  }
}

.el-aside {
  background-color: RGB(39, 39, 39);
  height: var(--app-height);
  margin-left: 10px;
  margin-top: 10px;

  .tablist {
    cursor: pointer;
    display: flex;
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 3px solid transparent;

    div:last-child {
      padding-top: 5px;
      margin-left: 20px;
    }
  }

  .active {
    color: RGB(230, 162, 60);
    border-left: 3px solid RGB(230, 162, 60);
    padding-left: 10px;

    .el-icon {
      color: RGB(230, 162, 60);
    }
  }

  .active:hover {
    border-left: 3px solid #fff;
  }

  .tablist:hover {
    color: #fff;

    .el-icon {
      color: #fff;
    }
  }
}
</style>
