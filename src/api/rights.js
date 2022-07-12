import request from '@/utils/request'

// 所有权限列表
export const allRightsList = type => request({
  url: `rights/${type}`,
  method: 'get'
})
