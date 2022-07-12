
import dayjs from 'dayjs'
import Vue from 'vue'

import relativeTime from 'dayjs/plugin/relativeTime'

// dayjs 默认语言是英文  配置为中文
import 'dayjs/locale/zh-cn'
// 配置使用除了相对事件的插件
dayjs.extend(relativeTime)
// 全局使用
dayjs.locale('zh-cn')

// 定义全局过滤器 在任何组件内使用
// 参数1 过滤器名称
// 参数2 过滤器函数
Vue.filter('relativeTime', value => {
  return dayjs(value * 1000).format('YYYY-M-D')
})
