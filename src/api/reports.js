import request from '@/utils/request'

// 基于时间统计的折线图
export const getLineGraph = () => request({
  url: 'reports/type/1',
  method: 'get'
})
