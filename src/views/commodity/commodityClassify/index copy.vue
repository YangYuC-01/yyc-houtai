<template>
  <div class="commodity-classify">
    <!-- 商品分类 -->
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList"></Breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button type="primary" style="margin-bottom: 10px" @click="addDialog = true">添加分类</el-button>

      <el-table :data="classificationList" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效">
          <template v-slot="scope">
            <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color: green"></i>
            <i class="el-icon-error" v-else style="color: red"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template v-slot="scope">
            <el-tag
              :type="
                scope.row.cat_level === 0
                  ? ''
                  : scope.row.cat_level === 1
                  ? 'success'
                  : 'warning'
              "
            >
              {{
              scope.row.cat_level === 0
              ? "一级"
              : scope.row.cat_level === 1
              ? "二级"
              : "三级"
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pagesize - 0"
        :page-sizes="[1, 2, 4, 6, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加弹出层 -->
    <el-dialog title="添加商品分类" :visible.sync="addDialog" width="50%" :before-close="handleClose">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item prop="cat_name" label="分类名称:">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类:">
          <el-cascader
            :options="classificationList"
            v-model="addForm.arr"
            :props="{ checkStrictly: true,label: 'cat_name',value: 'cat_id', }"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { classificationList } from '@/api/commodity/commodityClassify'
import _ from 'lodash'
export default {
  name: 'CommodityClassify',
  created () {
    this.getClassificationList()
  },
  data () {
    return {
      breadList: ['商品分类', '分类列表'], // 面包屑
      classificationList: [], // 分类列表
      pagenum: 1, // 当前页码
      pagesize: 4, // 每页显示条数
      total: 0, // 总条数
      addDialog: false, // 添加弹出框
      addForm: {
        cat_pid: '',
        cat_name: '',
        cat_level: 0,
        arr: []
      },
      addRules: {
        cat_name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 8, message: '长度2~8个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取分类列表
    async getClassificationList () {
      try {
        const { data } = await classificationList({
          type: '',
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        console.log('商品分类列表', data)
        this.classificationList = data.data.result
        this.total = data.data.total
      } catch (err) {
        console.log(err)
      }
    },
    // 编辑
    edit (obj) { },
    // 删除
    del (obj) { },
    // pageSize 改变时会触发
    handleSizeChange (val) {
      this.pagesize = val
      this.getClassificationList()
    },
    // currentPage 改变时会触发
    handleCurrentChange (val) {
      this.pagenum = val
      this.getClassificationList()
    },
    // 关闭弹出层
    handleClose () {
      this.addDialog = false
      this.cascader()
    },
    cascader () {
      const newArr = _.cloneDeep(this.classificationList)

      const fn = (arr) => {
        arr.forEach(item => {
          if (item.children) {
            fn(item.children)
          } else {
            arr = []
          }
        })
      }
      fn(newArr)
      console.log(newArr)
    }
  },
  computed: {
  },
  watch: {},
  filters: {},
  components: {
    Breadcrumb
  }
}
</script>

<style scoped lang="less">
.commodity-classify {
  .el-card {
    margin-top: 15px;
  }
}
</style>
