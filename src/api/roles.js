import request from '@/utils/request'

// 删除角色
export const deleteRoles = id => request({
  url: `roles/${id}`,
  method: 'delete'
})

// 所有权限列表
export const allTreeList = type => request({
  url: `rights/${type}`,
  method: 'get'
})

// 角色授权修改
export const editRoles = (obj) => request({
  url: `roles/${obj.roleId}/rights`,
  method: 'post',
  data: {
    rids: obj.rids
  }
})

// 添加角色
export const addRoles = (obj) => request({
  url: 'roles',
  method: 'post',
  data: {
    roleName: obj.roleName,
    roleDesc: obj.roleDesc
  }
})

// 删除角色指定权限
export const deleteDesignate = (obj) => request({
  url: `roles/${obj.roleId}/rights/${obj.rightId}`,
  method: 'delete'
})

// 编辑提交角色
export const bianjiRoles = (obj) => request({
  url: `roles/${obj.id}`,
  method: 'put',
  data: {
    roleName: obj.roleName,
    roleDesc: obj.roleDesc
  }
})
