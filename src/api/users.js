import request from '@/utils/request'

// 用户数据列表
export const getUsersList = params => request({
  url: 'users',
  method: 'Get',
  params
})

// 用户数据列表
export const addUser = data => request({
  url: 'users',
  method: 'POST',
  data
})

// 修改用户状态
export const putUserType = (obj) => request({
  url: `users/${obj.uId}/state/${obj.type}`,
  method: 'put'
})

// 修改用户提交
export const editUser = (obj) => request({
  url: `users/${obj.id}`,
  method: 'put',
  data: {
    email: obj.email,
    mobile: obj.mobile
  }
})

//  删除单个用户
export const deleteUser = (id) => request({
  url: `users/${id}`,
  method: 'delete'
})

// 获取角色列表
export const rolesList = () => request({
  url: 'roles',
  method: 'Get'
})

// 修改用户角色
export const setUserRole = (obj) => request({
  url: `users/${obj.id}/role`,
  method: 'put',
  data: {
    rid: obj.rid
  }
})
