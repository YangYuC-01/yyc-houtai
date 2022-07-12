<template>
  <el-container class="home">
    <!-- 头部 -->
    <el-header>
      <div class="left-logo">
        <img src="@/assets/logo.png" alt />
        <span>YYC后台管理系统</span>
      </div>
      <el-button @click="editFn">退出</el-button>
    </el-header>
    <!-- 侧边栏  主体 -->
    <el-container class="content">
      <!-- 侧边栏 -->
      <!-- 展开折叠 -->
      <el-aside :style="{width:asideWidth}">
        <Aside @fold="foldFn"></Aside>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from '@/views/Aside'
export default {
  name: 'Home',
  created () { },
  data () {
    return {
      asideWidth: '200px'
    }
  },
  methods: {
    // 退出
    editFn () {
      this.$store.commit('setToken', null)
      this.$router.push({ name: 'login' })
    },
    // 展开折叠
    foldFn (flag) {
      if (flag) {
        // 展开
        this.asideWidth = '200px'
      } else {
        this.asideWidth = '64px'
      }
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {
    Aside
  }
}
</script>

<style scoped lang='less'>
.home {
  height: 100vh;
  .el-header {
    height: 60px;
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 22px;
    :deep(.left-logo) {
      span {
        margin-left:10px;
      }
      img {
        width: 61px;
        height: 56px;
      }
    }
  }

  .el-aside {
    background-color: #373d41;
    transition:.6s all;
  }

  .el-main {
    background-color: #eaedf1;
  }
  .content {
    height: calc(100vh - 90px);
  }
}
</style>
