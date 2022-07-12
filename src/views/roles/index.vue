<template>
  <div class="roles">
    <!-- 面包屑 -->
    <Breadcrumb :breadList="breadList"></Breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addRolesDialog = true">添加角色</el-button>

      <el-table :data="rolesList" style="width: 100%" border stripe  @expand-change="tagFather">
        <el-table-column type="expand" label="#">
          <template v-slot="scope">
            <el-table class="tag-table" :data="scope.row.children" :show-header="false">
              <!-- 第一列 -->
              <el-table-column width="270px">
                <template v-slot="scope">
                  <el-tag>{{scope.row.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </template>
              </el-table-column>
              <!-- 第二列 -->
              <el-table-column>
                <template v-slot="scope">
                  <el-table :data="scope.row.children" :show-header="false">
                    <el-table-column>
                      <template v-slot="scope">
                        <el-tag type="success">{{scope.row.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </template>
                    </el-table-column>

                    <!-- 多标签 -->
                    <el-table-column width="640px">
                      <template v-slot="scope">
                        <el-tag
                        @close="tagDelete(scope.row,index)"
                          v-for="(item,index) in scope.row.children"
                          :key="item.id"
                          closable
                          style="margin: 8px;"
                        >{{item.authName}}</el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" prop="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="bianjiRoles(scope.row)">编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteRoles(scope.row)"
            >删除</el-button>

            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="assignmentRoles(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 权限分配弹出层 -->
    <el-dialog title="分配权限" :visible.sync="rolesDialog" width="50%" :before-close="handleClose">
      <el-tree
        ref="tree"
        :data="allTreeList"
        show-checkbox
        :props="defaultProps"
        node-key="id"
        :default-expanded-keys="defaultList"
        :default-checked-keys="defaultList"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色弹出层 -->
    <el-dialog title="添加角色" :visible.sync="addRolesDialog" width="50%" :before-close="handleClose">
      <el-form :model="addRolesForm" :rules="rules" ref="addRolesForm">
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>

        <el-form-item prop="roleDesc" label="角色描述">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色弹出层 -->
    <el-dialog title="编辑角色" :visible.sync="bianjiRolesDialog" width="50%" :before-close="handleClose">
      <el-form :model="bianjiForm" :rules="rules" ref="bianjiForm">
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="bianjiForm.roleName"></el-input>
        </el-form-item>

        <el-form-item prop="roleDesc" label="角色描述">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="bianjiForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bianjiRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="bianjiBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import { rolesList } from '@/api/users'
import { deleteRoles, allTreeList, editRoles, addRoles, deleteDesignate, bianjiRoles } from '@/api/roles'

export default {
  name: 'Roles',
  created () {
    this.getRolesList()
  },
  data () {
    return {
      breadList: ['权限管理', '角色列表'], // 面包屑
      rolesList: [], // 角色列表
      rolesDialog: false, // 分配权限弹出框
      allTreeList: [], // 属性图列表
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defaultList: [], // 默认选中和打开的树
      roleId: '', // 要修改的角色ID
      addRolesDialog: false, // 添加角色弹出框
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      designateRolesId: '', // 删除指定权限的角色ID
      designateRightsId: '', // 指定权限ID
      bianjiRolesDialog: false, // 编辑角色弹出
      bianjiId: '', // 编辑角色的ID
      bianjiForm: { // 编辑角色表单
        roleName: '',
        roleDesc: ''
      }
    }
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { data } = await rolesList()
        console.log(data)
        this.rolesList = data.data
        loading.close()
      } catch (err) {
        console.log(err)
      }
    },
    // 删除角色
    async deleteRoles (obj) {
      try {
        const { data } = await deleteRoles(obj.id)
        console.log(data)
        this.$message.success('删除成功')
        this.getRolesList()
      } catch (err) {
        console.log(err)
        this.$message.error('删除失败')
      }
    },
    // × 关闭
    handleClose () {
      this.rolesDialog = this.addRolesDialog = this.bianjiRolesDialog = false
      this.defaultList = []
      this.addRolesForm.roleName = ''
      this.addRolesForm.roleDesc = ''
      this.bianjiId = ''
    },
    // 分配权限
    assignmentRoles (obj) {
      // 获取当前角色全部权限
      const allDefaultList = (obj) => {
        if (obj.children) {
          obj.children.forEach(item => {
            this.defaultList.push(item.id)
            allDefaultList(item)
          })
        } else {
          // eslint-disable-next-line no-useless-return
          return
        }
      }
      this.getAllTreeList()
      allDefaultList(obj)
      this.roleId = obj.id
      this.rolesDialog = true
    },
    // 获取权限列表
    async getAllTreeList () {
      try {
        const { data } = await allTreeList('tree')
        console.log(data)
        this.allTreeList = data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 确认角色修改权限
    async editRoles () {
      const arr = this.$refs.tree.getCheckedKeys()
      console.log(arr)
      try {
        await editRoles({
          roleId: this.roleId,
          rids: arr.join(',')
        })
        this.$message.success('分配权限更新成功')
      } catch (err) {
        console.log(err)
        this.$message.error('分配权限更新失败')
      }
      this.getRolesList()
      this.rolesDialog = false
    },
    // 添加角色
    addRoles () {
      this.$refs.addRolesForm.validate(async (isOk) => {
        if (isOk) {
          try {
            const { data } = await addRoles({
              roleName: this.addRolesForm.roleName,
              roleDesc: this.addRolesForm.roleDesc
            })
            console.log(data)
            this.$message.success('添加角色成功')
          } catch (err) {
            console.log(err)
            this.$message.error('添加角色失败')
          }
          this.addRolesForm.roleName = ''
          this.addRolesForm.roleDesc = ''
          this.addRolesDialog = false
          this.getRolesList()
        }
      })
    },
    // 删除指定权限
    async tagDelete (obj, index) {
      this.designateRightsId = obj.children[index].id
      console.log(obj.children[index].id)
      try {
        const { data } = await deleteDesignate({ roleId: this.designateRolesId, rightId: this.designateRightsId })
        console.log(data)

        const fn = (arr) => {
          arr.forEach((item, index1) => {
            if (obj.children[index] && item.id === obj.children[index].id) {
              return arr.splice(index1, 1)
            } else if (item.children) {
              fn(item.children)
            }
          })
        }
        fn(this.rolesList)
        this.$message.success('取消权限成功')
      } catch (err) {
        console.log(err)
        this.$message.error('取消权限失败')
      }
    },
    tagFather (row) {
      this.designateRolesId = row.id
    },
    // 编辑角色弹出层显示
    bianjiRoles (obj) {
      this.bianjiRolesDialog = true
      this.bianjiForm.roleName = obj.roleName
      this.bianjiForm.roleDesc = obj.roleDesc
      this.bianjiId = obj.id
      console.log(obj)
    },
    // 确定编辑按钮
    bianjiBtn () {
      this.$refs.bianjiForm.validate(async (isOk) => {
        if (isOk) {
          try {
            const { data } = await bianjiRoles({
              id: this.bianjiId,
              roleName: this.bianjiForm.roleName,
              roleDesc: this.bianjiForm.roleDesc
            })
            console.log(data)
            this.$message.success('编辑角色成功')
          } catch (err) {
            console.log(err)
            this.$message.error('编辑角色失败')
          }
          this.bianjiForm.roleName = ''
          this.bianjiForm.roleDesc = ''
          this.bianjiId = ''
          this.bianjiRolesDialog = false
          this.getRolesList()
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

<style scoped lang='less'>
.roles {
  .el-card {
    margin-top: 15px;
  }
  .el-table {
    margin-top: 15px;
    .tag-table {
      margin-top: 0;
      padding: 0 50px 20px;

      :deep(tbody tr:hover > td) {
        background-color: unset !important;
      }

      :deep(.el-table__cell) {
        border-right: none;
        padding: 0;
      }
    }
  }
}
</style>
