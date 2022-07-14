import request from '@/utils/request'
// !商品分类数据列表

//  商品分类数据列表
export const classificationList = ({ type, pagenum, pagesize }) => request({
  url: '/categories',
  method: 'GET',
  params: {
    type: type,
    pagenum: pagenum,
    pagesize: pagesize
  }
})

//  添加分类
// eslint-disable-next-line camelcase
export const addClassificationApi = ({ cat_pid, cat_name, cat_level }) => request({
  url: '/categories',
  method: 'POST',
  data: {
    cat_pid,
    cat_name,
    cat_level
  }
})

//  删除分类
// eslint-disable-next-line camelcase
export const deleteClassificationApi = id => request({
  url: `categories/${id}`,
  method: 'delete'
})

//   编辑提交分类
// eslint-disable-next-line camelcase
export const editClassificationApi = ({ id, cat_name }) => request({
  url: `categories/${id}`,
  method: 'put',
  data: {
    cat_name
  }
})
