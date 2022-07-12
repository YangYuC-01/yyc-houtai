import request from '@/utils/request'

// 左侧菜单列表
export const AsideList = () => request({
  url: 'menus',
  method: 'GET'
})
