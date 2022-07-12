<template>
  <div class="users">
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList"></Breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 输入框  按钮 -->
      <div class="top">
        <el-input v-model="inputValue" placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search" @click="searchFn"></el-button>
        </el-input>
        <el-button type="primary" @click="addDialogShow = true">添加用户</el-button>
      </div>

      <!-- 表格 -->
      <div class="bottom">
        <el-table :data="usersList" border stripe>
          <el-table-column prop="index" type="index" label="#"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态">
            <template v-slot="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="switchChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="setEditDialogShow(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="setDeleteDialogShow(scope.row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
                @click="setRoleDialogShow(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加用户弹出框 -->
    <el-dialog
      title="添加用户对话框"
      :visible.sync="addDialogShow"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :model="usersForm" :rules="usersRules" label-width="100px" ref="usersForm">
        <el-form-item prop="userName" label="用户名">
          <el-input v-model="usersForm.userName"></el-input>
        </el-form-item>

        <el-form-item prop="password" label="密码">
          <el-input v-model="usersForm.password"></el-input>
        </el-form-item>

        <el-form-item prop="email" label="邮箱">
          <el-input v-model="usersForm.email"></el-input>
        </el-form-item>

        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="usersForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogShow" width="50%" :before-close="handleClose">
      <el-form label-width="100px" :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="用户名">
          <el-input v-model="editForm.editUserName" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="editEmail">
          <el-input v-model="editForm.editEmail"></el-input>
        </el-form-item>
        <el-form-item label="电话号" prop="editMobile">
          <el-input v-model="editForm.editMobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除用户弹出框 -->
    <el-dialog
      class="delete-dialog"
      title="提示"
      :visible.sync="deleteDialogShow"
      width="30%"
      :before-close="handleClose"
    >
      <i class="el-icon-warning"></i>
      <p>此操作将永久删除该用户, 是否继续?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="deleteConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色弹出框 -->
    <el-dialog title="分配角色" width="50%" :visible.sync="roleDialogShow" :before-close="handleClose">
      <el-input v-model="roleName" disabled>
        <template #prepend>当前的用户</template>
      </el-input>
      <el-input v-model="nowRole" disabled>
        <template #prepend>当前的角色</template>
      </el-input>

      <el-select v-model="roleValue" placeholder="请选择">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        ></el-option>
      </el-select>

      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="roleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { getUsersList, addUser, putUserType, editUser, deleteUser, rolesList, setUserRole } from '@/api/users'

export default {
  name: 'Users',
  created () {
    this.getUsersList()
  },
  data () {
    return {
      breadList: ['用户管理', '用户列表'], // 面包屑
      inputValue: '', // 输入框内容
      usersList: [],
      pagenum: 1, // 当前页码
      pagesize: 5, // 每页显示条数
      total: 0, // 总条数
      addDialogShow: false, // 添加用户弹出框显示
      usersForm: {
        userName: '',
        password: '',
        email: '',
        mobile: ''
      },
      usersRules: {
        userName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 7, message: '用户名长度2-7之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, max: 7, message: '密码长度2-7之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          {
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          {
            pattern: /^(?:(?:\+|00)86)?1\d{10}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ]
      },
      userType: { // 修改用户状态
        uId: '',
        type: ''
      },
      editDialogShow: false, // 修改用户弹出框
      editForm: {
        id: '',
        editUserName: '', // 修改框用户名
        editEmail: '',
        editMobile: ''
      },
      editRules: {
        editEmail: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          {
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        editMobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          {
            pattern: /^(?:(?:\+|00)86)?1\d{10}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ]
      },
      deleteDialogShow: false, // 删除用户弹出框
      deleteId: '', // 删除用户ID
      roleDialogShow: false, // 分配用户角色弹出框
      roleName: '', // 分配角色用户名
      nowRole: '', // 当前角色
      roleId: '', // 当前要修改的用户id
      roleList: [], // 角色列表
      roleValue: '' // 选中的角色id
    }
  },
  methods: {
    // 获取用户资料列表
    async getUsersList () {
      try {
        const { data } = await getUsersList({
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        console.log(data)
        this.usersList = data.data.users
        this.total = data.data.total
      } catch (err) {
        console.log(err)
      }
    },
    // 修改每页显示条数
    handleSizeChange (val) {
      this.pagesize = val
      this.getUsersList()
    },
    // 修改当前页码
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUsersList()
    },
    // 关闭弹出层
    handleClose (done) {
      this.addDialogShow = this.editDialogShow = this.deleteDialogShow = this.roleDialogShow = false
    },
    // 确认添加
    addConfirm () {
      this.$refs.usersForm.validate(async (isOk) => {
        if (isOk) {
          // 成功
          try {
            const { data } = await addUser({
              username: this.usersForm.userName,
              password: this.usersForm.password,
              email: this.usersForm.email,
              mobile: this.usersForm.mobile
            })
            console.log(data)
            this.$message.success('添加成功')
            this.getUsersList()
          } catch (err) {
            this.$message.error('添加失败')
          }
          this.addDialogShow = false
          this.usersForm.userName = ''
          this.usersForm.password = ''
          this.usersForm.email = ''
          this.usersForm.mobile = ''
        }
      })
    },
    // 搜索
    async searchFn () {
      try {
        const { data } = await getUsersList({
          query: this.inputValue,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        console.log(data)
        this.usersList = data.data.users
        this.total = data.data.total
      } catch (err) {
        console.log(err)
      }
    },
    // 修改用户状态
    async switchChange (obj) {
      this.userType.uId = obj.id
      this.userType.type = obj.mg_state
      try {
        await putUserType(this.userType)
      } catch (err) {
        console.log(err)
      }
    },
    // 修改用户资料弹出框
    setEditDialogShow (obj) {
      this.editDialogShow = true
      this.editForm.editUserName = obj.username
      this.editForm.id = obj.id
      this.editForm.editEmail = obj.email
      this.editForm.editMobile = obj.mobile
    },
    // 确认修改用户资料
    editConfirm () {
      this.$refs.editForm.validate(async (isOk) => {
        if (isOk) {
          try {
            await editUser({
              id: this.editForm.id,
              email: this.editForm.editEmail,
              mobile: this.editForm.editMobile
            })
            this.$message.success('修改成功')
            this.getUsersList()
          } catch (err) {
            console.log(err)
            this.$message.error('修改失败')
          }
          this.editDialogShow = false
          this.editForm.id = ''
          this.editForm.editUserName = ''
          this.editForm.editEmail = ''
          this.editForm.editMobile = ''
        }
      })
    },
    // 删除用户弹出框
    setDeleteDialogShow (obj) {
      this.deleteDialogShow = true
      this.deleteId = obj.id
    },
    // 删除用户
    async deleteConfirm () {
      try {
        await deleteUser(this.deleteId)
        this.getUsersList()
        this.$message.success('删除成功')
      } catch (err) {
        console.log(err)
        this.$message.error('删除失败')
      }
      this.deleteDialogShow = false
      this.deleteId = ''
    },
    // 修改用户角色弹出框 获取角色列表
    async setRoleDialogShow (obj) {
      this.roleName = obj.username
      this.nowRole = obj.role_name
      this.roleId = obj.id
      this.roleDialogShow = true
      // 获取角色列表
      try {
        const { data } = await rolesList()
        console.log(data)
        this.roleList = data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 修改用户角色
    async roleConfirm () {
      if (this.roleValue === '') {
        return this.$message('请选择用户角色')
      }
      try {
        const { data } = await setUserRole({
          id: this.roleId,
          rid: this.roleValue
        })
        if (data.meta.status === 400) {
          return this.$message.error('分配失败')
        }
        this.$message.success('分配成功')
        this.roleDialogShow = false
        this.getUsersList()
        console.log(data)
      } catch (err) {
        console.log(err)
        this.$message.error('分配失败')
      }
      this.roleName = ''
      this.nowRole = ''
      this.roleId = ''
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
.users {
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

  :deep(.delete-dialog) {
    .el-dialog__body {
      display: flex;
      align-items: center;
      .el-icon-warning {
        color: #e6a23c;
        font-size: 23px;
        margin-right: 10px;
      }
      p {
        font-size: 18px;
      }
    }
  }
}
</style>
