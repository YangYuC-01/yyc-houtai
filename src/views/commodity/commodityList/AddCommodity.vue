<template>
  <div class="add-commodity">
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList"></Breadcrumb>

    <el-card class="box-card">
      <el-alert title="添加商品信息" show-icon center type="info" :closable="false"></el-alert>

      <!-- 步骤条 -->
      <el-steps :active="activeSteps - 0" finish-status="success" space="80%" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addForm"
        label-width="100px"
        label-position="top"
      >
        <!-- 标签页 -->
        <el-tabs
          tab-position="left"
          v-model="activeSteps"
          @tab-click="tabClick"
          :before-leave="beforeTabLeave"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>

            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>

            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>

            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                ref="myCascader"
                clearable
                @change="handleChange"
                :options="categoriesList"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                }"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyList" :key="item.attr_id">
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="str"
                  v-for="(str, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyList" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- action 图片要上传的地址 -->
            <el-upload
              action="http://liufusong.top:8899/api/private/v1/upload"
              :headers="headersObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="imgSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">

            <!-- 富文本编辑器 -->
            <quill-editor
              v-model="addForm.goods_introduce"
              ref="myQuillEditor"
            ></quill-editor>

            <el-button type="primary" style="margin-top:15px" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览弹出层 -->
    <el-dialog title="提示" :visible.sync="previewImgDialog" width="50%" :before-close="handleClose">
      <span>预览图片</span>
      <img :src="previewImgUrl" alt class="preview-img" />
    </el-dialog>
  </div>
</template>

<script>
import { categoriesList, parameterList, addGoods } from '@/api/commodity/commodityList'
import Breadcrumb from '@/components/Breadcrumb'
import _ from 'lodash'
export default {
  name: 'AddCommodity',
  created () {
    this.getCategoriesList()
  },
  data () {
    // 不能为空
    const noEmpty = {
      required: true,
      message: '不可为空',
      trigger: 'blur'
    }
    // 值大于等于0
    const validatorFn = (rule, value, callback) => {
      if (value >= 0) {
        callback()
      } else {
        callback(new Error('值必须大于等于0'))
      }
    }
    return {
      breadList: ['商品管理', '添加商品'], // 面包屑
      activeSteps: '0', // 选中步骤条
      addForm: {
        goods_name: '', // 商品名
        goods_price: '0', // 商品价格
        goods_weight: '0', // 商品重量
        goods_number: '0', // 商品价格
        goods_cat: [], // 商品分类
        pics: [], // 图片路径
        goods_introduce: '', // 商品介绍
        attrs: []
      },
      addFormRules: {
        goods_name: [
          noEmpty,
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        goods_price: [noEmpty, { validator: validatorFn, trigger: 'blur' }],
        goods_weight: [noEmpty, { validator: validatorFn, trigger: 'blur' }],
        goods_number: [noEmpty, { validator: validatorFn, trigger: 'blur' }],
        goods_cat: [noEmpty]
      },
      categoriesList: [], // 商品分类列表
      categoriesId: '', // 选中的商品分类ID
      manyList: [], // 商品参数列表
      onlyList: [], // 属性列表
      headersObj: { // 图片上传组件的headers 请求头对象
        Authorization: this.$store.state.token
      },
      previewImgUrl: '', // 点击的图片文件的地址
      previewImgDialog: false // 图片预览弹出层
    }
  },
  methods: {
    // 获取商品分类列表
    async getCategoriesList () {
      try {
        const { data } = await categoriesList({
          type: '',
          pagenum: '',
          pagesiz: ''
        })
        console.log('商品分类列表', data)
        this.categoriesList = data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 选中商品分类 ID  级联选择器选中项变化触发
    handleChange (value) {
      console.log(value)
      if (value.length < 3) {
        this.addForm.goods_cat = []
      } else {
        this.categoriesId = value[2]
      }
    },
    // 获取商品参数列表
    async tabClick (tab) {
      // 访问的是商品参数列表
      if (tab.name === '1') {
        try {
          const { data } = await parameterList({
            id: this.categoriesId,
            sel: 'many'
          })
          console.log(data)
          if (data.meta.status !== 200) {
            return this.$message.error('获取参数失败')
          }
          this.manyList = data.data
          this.manyList.forEach((item) => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [''] : item.attr_vals.split(' ')
          })
          console.log(this.manyList)
          this.$message.success('获取参数列表成功')
        } catch (err) {
          this.$message.error('获取参数列表失败')
          console.log(err)
        }
      } else if (tab.name === '2') {
        // 访问的是商品属性列表
        try {
          const { data } = await parameterList({
            id: this.categoriesId,
            sel: 'only'
          })
          console.log(data)
          if (data.meta.status !== 200) {
            return this.$message.error('获取属性列表失败')
          }
          this.onlyList = data.data
        } catch (err) {
          console.log(err)
        }
      }
    },
    // 切换标签页的钩子
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length < 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 关闭图片dialog
    handleClose () {
      this.previewImgDialog = false
    },
    // 处理图片预览效果
    handlePreview (file) {
      console.log(file)
      this.previewImgDialog = true
      this.previewImgUrl = file.response.data.url
    },
    // 处理移除图片的操作
    handleRemove (file) {
      const index = this.addForm.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path
      })
      this.addForm.pics.splice(index, 1)
    },
    // 图片上传成功的函数
    imgSuccess (response) {
      const imgObj = { pic: response.data.tmp_path }
      this.addForm.pics.push(imgObj)
    },
    // 添加商品
    add () {
      console.log(this.addForm)
      this.$refs.addForm.validate(async isOk => {
        if (!isOk) {
          return this.$message.error('请填写必要的表单项')
        }
        // 深拷贝上传表单  不能直接操作
        const cloneAddForm = _.cloneDeep(this.addForm)
        cloneAddForm.goods_cat = cloneAddForm.goods_cat.join(',')

        // 处理动态参数和静态属性
        this.manyList.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(newInfo)
        })

        this.onlyList.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })

        cloneAddForm.attrs = this.addForm.attrs
        console.log(cloneAddForm)

        // 发送添加商品的请求
        try {
          const { data } = await addGoods(cloneAddForm)
          console.log(data)
          this.$message.success('添加成功')
          this.$router.push({ name: 'goods' })
        } catch (err) {
          this.$message.error('添加失败')
          console.log(err)
        }
      })
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

<style scoped lang="less">
.add-commodity {
  .el-card {
    margin-top: 15px;

    .el-steps {
      margin: 10px 0;
    }

    .el-checkbox {
      margin: 0 10px 0 0 !important;
    }

    :deep(.ql-editor ){
      min-height: 300px !important;
    }
  }

  .preview-img {
    width: 100%;
    height: 100%;
  }
}
</style>
