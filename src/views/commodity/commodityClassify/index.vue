<template>
  <div class="commodity-classify">
    <!-- 商品分类 -->
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList"></Breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button type="primary" style="margin-bottom: 10px" @click="addDialogShow">添加分类</el-button>

      <!-- 表格 -->
      <tableTree
        :data="classificationList"
        :show-row-hover="false"
        stripe
        border
        :selection-type="false"
        :expand-type="false"
        show-index
        :tree-type="true"
        :columns="columns"
        index-text="#"
      >
        <!-- 是否有效 -->
        <template slot="isOk" scope="scope">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color: green"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <!-- 排序 -->
        <template slot="sort" scope="scope">
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

        <!-- 操作 -->
        <template slot="operation" scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="del(scope.row)">删除</el-button>
        </template>
      </tableTree>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pagesize - 0"
        :page-sizes="[1, 2, 4, 6, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加弹出层 -->
      <el-dialog title="添加商品分类" :visible.sync="addDialog" width="50%" :before-close="handleClose">
        <el-form :model="addForm" :rules="addRules" label-width="100px" ref="addFormRef">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>

          <el-form-item label="父级分类:">
            <el-cascader
             @change="handleChange"
              :options="addClassificationList"
              v-model="cascaderArr"
              :props="{ checkStrictly: true,label: 'cat_name',value: 'cat_id', }"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>

        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="addClassification">确定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑弹出层 -->
      <el-dialog title="添加商品分类" :visible.sync="editDialog" width="50%" :before-close="handleClose">
        <el-form :model="editForm" :rules="editRules" ref="editFormRef">
          <el-form-item prop="editInput" label="编辑分类">
            <el-input v-model="editForm.editInput"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="editConfirm">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { classificationList, addClassificationApi, deleteClassificationApi, editClassificationApi } from '@/api/commodity/commodityClassify'
export default {
  name: 'CommodityClassify',
  created () {
    this.getClassificationList()
  },
  data () {
    return {
      breadList: ['商品分类', '分类列表'], // 面包屑
      classificationList: [], // 分类列表
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          template: 'isOk',
          type: 'template'
        },
        {
          label: '排序',
          prop: 'cat_level',
          template: 'sort',
          type: 'template'
        },
        {
          label: '操作',
          template: 'operation',
          type: 'template'
        }
      ],
      pagenum: 1, // 当前页码
      pagesize: 4, // 每页显示条数
      total: 0, // 总条数
      addDialog: false, // 添加弹出框
      addForm: {
        cat_pid: 0, // 父级id
        cat_name: '', // 新增分类名
        cat_level: 0 // 新增等级

      },
      addRules: {
        cat_name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 8, message: '长度2~8个字符', trigger: 'blur' }
        ]
      },
      cascaderArr: [], // 级联框
      addClassificationList: [], // 添加的分类表单（二级）
      editDialog: false, // 编辑弹出框
      editId: '', //  编辑的分类id
      editForm: {
        editInput: ''
      },
      editRules: {
        editInput: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 8, message: '长度2~8个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取分类列表
    async getClassificationList () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { data } = await classificationList({
          type: '',
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        console.log('商品分类列表', data)
        this.classificationList = data.data.result
        this.total = data.data.total
        loading.close()
      } catch (err) {
        console.log(err)
        loading.close()
      }
    },
    // 编辑
    edit (obj) {
      this.editDialog = true
      this.editId = obj.cat_id
    },
    // 确认编辑
    async editConfirm () {
      try {
        await this.$refs.editFormRef.validate()
        const { data } = await editClassificationApi({
          id: this.editId,
          cat_name: this.editForm.editInput
        })
        console.log(data)
        this.editDialog = false
        this.$refs.editFormRef.resetFields()
        this.getClassificationList()
      } catch (err) {
        console.log(err)
      }
    },
    // 删除
    async del (obj) {
      try {
        const { data } = await deleteClassificationApi(obj.cat_id)
        console.log(data)
        this.getClassificationList()
        this.$message.success('删除成功')
      } catch (err) {
        console.log(err)
        this.$message.error('删除失败')
      }
    },
    // 分页器pageSize 改变时会触发
    handleSizeChange (val) {
      this.pagesize = val
      this.getClassificationList()
    },
    // 分页器currentPage 改变时会触发
    handleCurrentChange (val) {
      this.pagenum = val
      this.getClassificationList()
    },
    // 添加弹出层显示
    addDialogShow () {
      this.addDialog = true
      this.getLeaveTwoClassificationList()
    },
    // 关闭弹出层
    handleClose () {
      this.editDialog = false
      this.editForm.editInput = ''
      this.addDialog = false
      this.addForm.cat_name = ''
      this.addForm.cat_level = 0
      this.addForm.cat_pid = 0
      this.cascaderArr = []
    },
    // 确认添加
    addClassification () {
      this.$refs.addFormRef.validate(async isOk => {
        if (isOk) {
          try {
            const { data } = await addClassificationApi(this.addForm)
            console.log(data)
            if (data.meta.status !== 201) {
              return this.$message.error('添加失败')
            }
            this.$message.success('添加成功')
          } catch (err) {
            this.$message.error('添加失败')
            console.log(err)
          }
          this.addDialog = false
          this.addForm.cat_name = ''
          this.addForm.cat_level = 0
          this.addForm.cat_pid = 0
          this.cascaderArr = []
          this.getClassificationList()
        }
      })
    },
    // 获取添加的分类列表（二级）
    async getLeaveTwoClassificationList () {
      try {
        const { data } = await classificationList({
          type: 2,
          pagenum: '',
          pagesize: ''
        })
        console.log(data)
        this.addClassificationList = data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 级联框选中
    handleChange () {
      this.addForm.cat_pid = this.cascaderArr[this.cascaderArr.length - 1]
      this.addForm.cat_level = this.cascaderArr.length
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
