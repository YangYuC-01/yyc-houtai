<template>
<div class="commodity-classify">
      <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList"></Breadcrumb>

     <!-- 卡片 -->
    <el-card class="box-card">
    </el-card>
</div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
export default {
  name: 'CommodityClassify',
  created () {},
  data () {
    return {
      breadList: ['商品分类', '分类列表'] // 面包屑
    }
  },
  methods: {},
  computed: {},
  watch: {},
  filters: {},
  components: {
    Breadcrumb
  }
}
</script>

<style scoped lang='less'>
.commodity-classify {
  .el-card {
    margin-top: 15px;
  }
}
</style>
