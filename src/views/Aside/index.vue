<template>
  <div class="aside">
    <div class="topButton" @click="topButton">|||</div>
    <el-menu
      unique-opened
      class="el-menu-vertical-demo"
      :collapse="!isCollapse"
      background-color="#373d41"
      text-color="#fff"
      router
    >
      <el-submenu :index="index1+''" v-for="(item1,index1) in asideList" :key="item1.id">
        <template #title>
          <i :class="item1.icon"></i>
          <span>{{item1.authName}}</span>
        </template>
        <el-menu-item
          :index="item2.path"
          v-for="(item2) in item1.children"
          :key="item2.id"
        >
          <i class="el-icon-menu"></i>
          {{item2.authName}}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { AsideList } from '@/api/Aside'
export default {
  name: 'Aside',
  created () {
    this.getAsideList()
  },
  data () {
    return {
      isCollapse: true,
      asideList: [],
      iconList: ['el-icon-user-solid', 'el-icon-s-tools', 'el-icon-s-goods', 'el-icon-document-copy', 'el-icon-s-platform']
    }
  },
  methods: {
    async getAsideList () {
      try {
        const { data } = await AsideList()
        this.asideList = data.data
        this.asideList.forEach((item, index) => {
          item.icon = this.iconList[index]
        })
      } catch (err) {
        console.log(err)
      }
    },
    topButton () {
      this.isCollapse === true ? this.isCollapse = false : this.isCollapse = true
      this.$emit('fold', this.isCollapse)
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.aside {
  .topButton {
    width: 100%;
    height: 40px;
    background-color: #ff69b4;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
    user-select: none;
    letter-spacing: 5px;
    color: #fff;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-menu {
    border: none;
  }

}
</style>
