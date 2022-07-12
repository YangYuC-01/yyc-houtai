<template>
  <div class="classifyData">
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList"></Breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 头部警告 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>

      <!-- 选择商品分类 -->
      <el-form :model="classifyForm">
        <!-- 级联器 -->
        <el-form-item label="选择商品分类:">
          <el-cascader
            v-model="classifyForm.goods_cat"
            :options="categoriesList"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- tabs栏 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            :disabled="categoriesId===''"
            @click="manyOnlyDialog=true"
          >添加参数</el-button>
          <!-- 表格 -->
          <el-table :data="canShuDate" stripe style="width: 100%" border>
            <el-table-column type="expand">
              <template v-slot></template>
            </el-table-column>

            <el-table-column label="#" type="index"></el-table-column>

            <el-table-column label="分类名称" prop="attr_name"></el-table-column>

            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="editManyOnly(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="deleteManyOnly(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="small"
            :disabled="categoriesId===''"
            @click="manyOnlyDialog=true"
          >添加属性</el-button>
          <!-- 表格 -->
          <el-table :data="shuXingDate" stripe style="width: 100%" border>
            <el-table-column type="expand">
              <template v-slot></template>
            </el-table-column>

            <el-table-column label="#" type="index"></el-table-column>

            <el-table-column label="分类名称" prop="attr_name"></el-table-column>

            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="editManyOnly(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="deleteManyOnly(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加 -->
    <el-dialog
      :title="activeName==='many' ?'添加动态参数' :'添加静态属性'"
      :visible.sync="manyOnlyDialog"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :model="manyOnlyForm" :rules="manyOnlyRules" ref="manyOnlyFormRef">
        <el-form-item prop="attr_name" :label="activeName==='many' ?'动态参数' :'静态属性'">
          <el-input v-model="manyOnlyForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="manyOnlyDialog = false">取 消</el-button>
        <el-button type="primary" @click="addManyOnly">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog
      :title="activeName==='many' ?'修改动态参数' :'修改静态属性'"
      :visible.sync="editDialog"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :model="editForm" :rules="editRules" ref="editFormRef">
        <el-form-item prop="attr_name" :label="activeName==='many' ?'参数名称' :'属性名称'">
          <el-input v-model="editForm.attr_name"></el-input>
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
import { categoriesList, parameterList } from '@/api/commodity/commodityList'
import { addManyOnly, deleteManyOnly, editManyOnly } from '@/api/commodity/classifyData'

export default {
  name: 'ClassifyData',
  created () {
    this.getCategoriesList()
  },
  data () {
    return {
      breadList: ['分类参数', '参数列表'], // 面包屑
      categoriesList: [], // 商品分类数据列表
      type: '', // 分类层级
      pagenum: '', // 页码
      pagesize: '', // 每页多少数据
      classifyForm: { // 商品分类表单
        goods_cat: [] // 商品分类
      },
      categoriesId: '', // 分类id
      activeName: 'many', // 默认选中的tabs栏
      canShuDate: [], // 动态参数列表
      shuXingDate: [], // 静态熟悉参数列表
      manyOnlyForm: { // 增加的表单
        attr_name: ''
      },
      manyOnlyRules: { // 增加表单的规则
        attr_name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 7, message: '长度2-7', trigger: 'blur' }
        ]
      },
      manyOnlyDialog: false, // 添加弹出框
      editDialog: false, // 修改弹出框
      editForm: { // 编辑的表单
        attr_name: ''
      },
      editRules: { // 编辑表单的规则
        attr_name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 7, message: '长度2-7', trigger: 'blur' }
        ]
      },
      editAttrId: '' // 编辑修改的属性，参数ID
    }
  },
  methods: {
    // 获取分类列表
    async getCategoriesList () {
      try {
        const { data } = await categoriesList({
          type: this.type,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        console.log(data)
        this.categoriesList = data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 级联器发生变化
    handleChange (value) {
      if (this.classifyForm.goods_cat.length < 3) {
        this.classifyForm.goods_cat = []
        this.$message.error('请选择三级分类')
      } else {
        this.categoriesId = this.classifyForm.goods_cat[2]
      }
    },
    // 点击tabs栏
    async handleClick (tab) {
      if (this.classifyForm.goods_cat.length === 0) {
        return this.$message.error('请选择三级分类')
      } else if (this.activeName === 'many' && this.canShuDate.length) {
        // eslint-disable-next-line no-useless-return
        return
      } else if (this.activeName === 'only' && this.shuXingDate.length) {
        // eslint-disable-next-line no-useless-return
        return
      } else {
        try {
          const { data } = await parameterList({
            id: this.categoriesId,
            sel: this.activeName
          })
          if (this.activeName === 'many') {
            this.canShuDate = data.data
          } else if (this.activeName === 'only') {
            this.shuXingDate = data.data
          }
          console.log(data)
        } catch (err) {
          console.log(err)
        }
      }
    },
    // 编辑
    editManyOnly (obj) {
      this.editDialog = true
      this.editAttrId = obj.attr_id
      this.editForm.attr_name = obj.attr_name
    },
    // 确认修改编辑
    editConfirm () {
      this.$refs.editFormRef.validate(async isOk => {
        if (isOk) {
          try {
            const { data } = await editManyOnly({
              id: this.categoriesId,
              attrid: this.editAttrId,
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName,
              attr_vals: ''
            })
            console.log(data)
            this.$message.success('修改成功')
          } catch (err) {
            console.log(err)
            this.$message.error('修改失败')
          }
          this.editDialog = false
          this.editForm.attr_name = ''
          if (this.activeName === 'many') {
            this.canShuDate = []
          } else if (this.activeName === 'only') {
            this.shuXingDate = []
          }
          this.handleClick()
        }
      })
    },
    // 关闭dialog
    handleClose () {
      this.manyOnlyDialog = this.editDialog = false
    },
    // 添加参数
    addManyOnly () {
      this.$refs.manyOnlyFormRef.validate(async isOk => {
        if (isOk) {
          try {
            const { data } = await addManyOnly({
              id: this.categoriesId,
              attr_name: this.manyOnlyForm.attr_name,
              attr_sel: this.activeName,
              attr_vals: '1,2,3'
            })
            this.$message.success('添加成功')
            console.log(data)
          } catch (err) {
            console.log(err)
            this.$message.success('添加失败')
          }
          this.handleClick()
          this.manyOnlyDialog = false
          this.manyOnlyForm.attr_name = ''
        }
      })
    },
    // 删除参数
    async deleteManyOnly (obj) {
      console.log(obj)
      try {
        const { data } = await deleteManyOnly({ id: this.categoriesId, attrid: obj.attr_id })
        console.log(data)
        this.$message.success('删除成功')
        let index = ''
        if (this.activeName === 'many') {
          index = this.canShuDate.forEach(item => {
            return item.attr_id === obj.attr_id
          })
          this.canShuDate.splice(index, 1)
        } else if (this.activeName === 'only') {
          index = this.shuXingDate.forEach(item => {
            return item.attr_id === obj.attr_id
          })
          this.shuXingDate.splice(index, 1)
        }
      } catch (err) {
        this.$message.error('删除失败')
        console.log(err)
      }
    }
  },
  computed: {},
  watch: {
    // 分类更新
    async categoriesId () {
      try {
        const { data } = await parameterList({
          id: this.categoriesId,
          sel: this.activeName
        })
        if (this.activeName === 'many') {
          this.canShuDate = data.data
        } else if (this.activeName === 'only') {
          this.shuXingDate = data.data
        }
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
  },
  filters: {},
  components: {
    Breadcrumb
  }
}
</script>

<style scoped lang='less'>
.classifyData {
  .el-card {
    margin-top: 15px;
    .el-alert {
      margin-bottom: 10px;
    }
  }
}
</style>
