<template>
  <div class="orders">
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList"></Breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 顶部搜索 -->
      <el-input
        placeholder="请输入订单ID"
        v-model.trim="searchInput"
        class="input-with-select"
        style="width:420px;margin-bottom:10px"
        @keyup.enter.native="searchOrder"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
      </el-input>

      <!-- 表格 -->
      <el-table :data="ordersList" style="width: 100%" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="scope">
            <el-tag type="danger" effect="dark" v-if="scope.row.pay_status === '0'">未支付</el-tag>
            <el-tag type="success" effect="dark" v-else>已支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">{{scope.row.create_time | relativeTime}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="edit(scope.rwo)" size="small"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1, 2, 5,8]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 弹出层 -->
    <el-dialog title="修改收货地址" :visible.sync="editDialog" width="50%" :before-close="handleClose">
      <el-cascader v-model="editCityList" :options="cityList" @change="handleChange"></el-cascader>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { getOrdersList, orderDetails } from '@/api/orders'
import cityList from '@/utils/city_data2017_element'
export default {
  name: 'Orders',
  created () {
    this.getOrdersList()
  },
  data () {
    return {
      breadList: ['订单管理', '订单列表'], // 面包屑
      searchInput: '', // 搜索框
      ordersList: [], // 订单列表
      query: '',
      pagenum: 1, // 第几页
      pagesize: 8, // 每页条数
      total: 0, // 总页数
      cityList: cityList, // 城市列表
      editDialog: false, // 编辑弹出层
      editCityList: []
    }
  },
  methods: {
    // 获取订单列表
    async getOrdersList () {
      try {
        const { data } = await getOrdersList({
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        console.log(data)
        this.ordersList = data.data.goods
        this.total = data.data.total
      } catch (err) {
        console.log(err)
      }
    },
    // 编辑
    edit (obj) {
      this.editDialog = true
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getOrdersList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getOrdersList()
    },
    // 根据ID查询订单
    async searchOrder () {
      if (this.searchInput !== '') {
        try {
          const { data } = await orderDetails(this.searchInput)
          console.log(data)
          if (data.meta.status !== 200) {
            return this.$message.error('获取订单失败,请重新确认订单ID')
          }
          this.ordersList = []
          this.ordersList.push(data.data)
        } catch (err) {
          console.log(err)
        }
      } else {
        this.$message.error('请输入订单ID')
      }
    },
    // 关闭弹出层
    handleClose () {
      this.editDialog = false
    },
    // 级联框状态改变
    handleChange () {
      console.log(this.editCityList)
    },
    // 确认修改
    editConfirm () {
      this.editDialog = false
      this.$message.success('地址已成功修改为' + '  ' + this.editCityList.join('-'))
      this.editCityList = []
    }
  },
  computed: {},
  watch: {
    searchInput () {
      if (this.searchInput === '') {
        this.getOrdersList()
      }
    }
  },
  filters: {},
  components: {
    Breadcrumb
  }
}
</script>

<style scoped lang="less">
.orders {
  .el-card {
    margin-top: 15px;
  }
}
</style>
