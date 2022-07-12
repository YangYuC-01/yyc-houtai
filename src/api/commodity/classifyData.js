import request from '@/utils/request'
// !分类参数

//  添加动态参数或者静态属性
export const addManyOnly = (obj) => request({
  url: `categories/${obj.id}/attributes`,
  method: 'post',
  data: {
    attr_name: obj.attr_name,
    attr_sel: obj.attr_sel,
    attr_vals: obj.attr_vals
  }
})

//  删除参数
export const deleteManyOnly = ({ id, attrid }) => request({
  url: `categories/${id}/attributes/${attrid}`,
  method: 'delete'
})

//  编辑提交参数
// eslint-disable-next-line camelcase
export const editManyOnly = ({ id, attrid, attr_name, attr_sel, attr_vals }) => request({
  url: `categories/${id}/attributes/${attrid}`,
  method: 'put',
  data: {
    attr_name,
    attr_sel,
    attr_vals
  }
})
