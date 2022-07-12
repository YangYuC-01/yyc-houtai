import request from '@/utils/request'

// 登录验证接口
export const login = data => request({
  url: 'login',
  method: 'POST',
  data
})
