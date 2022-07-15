import request from '@/utils/request'

// 订单数据列表
export const getOrdersList = params => request({
  url: 'orders',
  method: 'get',
  params
})

// 查看订单详情
export const orderDetails = id => request({
  url: `orders/${id}`,
  method: 'get'
})
