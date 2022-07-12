<template>
  <div class="commodity-list">
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList"></Breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card" >
      <!-- 输入框  按钮 -->
      <div class="top">
        <el-input v-model="inputValue" placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="goAddPage">添加商品</el-button>
      </div>

      <div class="bottom">
        <el-table :data="commodityList" stripe style="width: 100%" border>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称" width="600px"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
          <el-table-column label="创建时间">
            <template v-slot="scope">{{scope.row.add_time | relativeTime}}</template>
          </el-table-column>
          <el-table-column label="操作" width="190px">
            <template v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="editFn(scope.row)"
              >编辑</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="deleteFn(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1, 5, 10, 15]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑商品" :visible.sync="editDialog" width="50%" :before-close="handleClose">
      <el-form :model="editForm" :rules="editRules" label-width="100px" ref="editForm">
        <el-form-item prop="goods_name" label="商品名称">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>

        <el-form-item prop="goods_price" label="价格">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>

        <el-form-item prop="goods_number" label="数量">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>

        <el-form-item prop="goods_weight" label="重量">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>

        <el-form-item prop="goods_introduce" label="介绍">
          <el-input v-model="editForm.goods_introduce" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { commodityList, editCommodity, deleteCommodity } from '@/api/commodity/commodityList'
export default {
  name: 'CommodityList',
  created () {
    this.getCommodityList()
  },
  data () {
    return {
      breadList: ['商品管理', '商品列表'], // 面包屑
      inputValue: '', // 搜索输入框内容
      query: '', // 获取分类列表等级
      pagenum: '1', // 当前页码
      pagesize: '5', // 每页多少条数据
      commodityList: [], // 商品列表
      total: 0, // 总条数
      editDialog: false, // 编辑商品弹出
      editForm: { // 编辑表单
        id: '',
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: ''
      },
      editRules: { // 编辑表单验证
        goods_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        goods_price: [{ required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[0-9]{0,8}/, message: '商品价格不能超过100万', trigger: 'blur' }],
        goods_number: [{ required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[0-9]{0,8}/, message: '商品数量不能超过100万', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[0-9]{0,8}/, message: '请输入争取商品质量', trigger: 'blur' }]
      },
      deleteId: '' // 删除的商品ID
    }
  },
  methods: {
    // 获取列表数据
    async getCommodityList () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { data } = await commodityList({
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        console.log(data)
        this.commodityList = data.data.goods
        this.total = data.data.total
        loading.close()
        this.$message.success('获取数据成功')
      } catch (err) {
        console.log(err)
        this.$message.error('获取数据失败')
        loading.close()
      }
    },
    // 关闭弹出层
    handleClose () {
      this.editDialog = false
    },
    // 编辑
    editFn (obj) {
      this.editDialog = true
      this.editForm.id = obj.goods_id
      this.editForm.goods_name = obj.goods_name
      this.editForm.goods_price = obj.goods_price
      this.editForm.goods_number = obj.goods_number
      this.editForm.goods_weight = obj.goods_weight
      this.editForm.goods_introduce = obj.goods_introduce
    },
    // 页码大小改变
    handleSizeChange (val) {
      this.pagesize = val
      this.getCommodityList()
    },
    // 当前页改变
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCommodityList()
    },
    // 确认编辑修改
    editConfirm () {
      this.$refs.editForm.validate(async (isOk) => {
        if (isOk) {
          try {
            const { data } = await editCommodity(this.editForm)
            console.log(data)
            if (data.meta.status === 400) {
              return this.$message.error('编辑失败')
            }
            this.$message.success('编辑成功')
            this.getCommodityList()
          } catch (err) {
            this.$message.error('编辑失败')
            console.log(err)
          }
          this.editDialog = false

          this.editForm.id = ''
          this.editForm.goods_name = ''
          this.editForm.goods_price = ''
          this.editForm.goods_number = ''
          this.editForm.goods_weight = ''
          this.editForm.goods_introduce = ''
        }
      })
    },
    // 删除
    async deleteFn (obj) {
      this.deleteId = obj.goods_id
      try {
        const { data } = await deleteCommodity(this.deleteId)
        console.log(data)
        this.$message.success('删除成功')
        this.getCommodityList()
      } catch (err) {
        console.log(err)
        this.$message.error('删除失败')
      }
    },
    // 搜索
    searchFn () {
      this.query = this.inputValue
      this.getCommodityList()
    },
    // 跳转到添加页面
    goAddPage () {
      this.$router.push({ name: 'add' })
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
.commodity-list {
  .el-card {
    margin-top: 15px;
    .top {
      display: flex;
      margin-bottom: 15px;
      .el-input {
        width: 380px;
        margin-right: 20px;
      }
    }
  }
}
</style>
