<template>
  <div class="rights">
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList"></Breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <el-table :data="rightsList" stripe style="width: 100%" border>
        <el-table-column label='#' type=index></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template v-slot="scope">
            <el-tag :type="scope.row.level === '0'?'':scope.row.level === '1'? 'success':'warning'">
                等级{{scope.row.level === '0'?'一':scope.row.level === '1'? '二':'三'}}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { allRightsList } from '@/api/rights'
export default {
  name: 'Rights',
  created () {
    this.getAllRightsList()
  },
  data () {
    return {
      breadList: ['权限管理', '权限列表'], // 面包屑
      rightsList: [] // 权限列表
    }
  },
  methods: {
    async getAllRightsList () {
      try {
        const { data } = await allRightsList('list')
        console.log(data)
        this.rightsList = data.data
      } catch (err) {
        console.log(err)
      }
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {
    Breadcrumb
  }
}
</script>

<style scoped lang='less'>
.rights {
  .el-card {
    margin-top: 15px;
  }
}
</style>
