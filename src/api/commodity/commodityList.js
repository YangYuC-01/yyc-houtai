import request from '@/utils/request'
// !商品列表

//  商品列表
export const commodityList = obj => request({
  url: 'goods',
  method: 'GET',
  params: {
    query: obj.query,
    pagenum: obj.pagenum,
    pagesize: obj.pagesize
  }
})

//  编辑提交商品
export const editCommodity = obj => request({
  url: `goods/${obj.id}`,
  method: 'put',
  data: {
    goods_name: obj.goods_name,
    goods_price: obj.goods_price,
    goods_number: obj.goods_number,
    goods_weight: obj.goods_weight,
    goods_introduce: obj.goods_introduce,
    pics: obj.pics,
    attrs: obj.attrs
  }
})

//  删除商品
export const deleteCommodity = id => request({
  url: `goods/${id}`,
  method: 'delete'
})

//  商品分类数据列表
export const categoriesList = ({ type, pagenum, pagesize }) => request({
  url: 'categories',
  method: 'get',
  params: {
    type,
    pagenum,
    pagesize
  }
})

//  商品分类参数列表
export const parameterList = ({ id, sel }) => request({
  url: `categories/${id}/attributes`,
  method: 'get',
  params: {
    sel: sel
  }
})

//  添加商品
export const addGoods = data => request({
  url: 'goods',
  method: 'POST',
  data
})
