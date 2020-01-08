import request from '@/system/request'

let token = '09255c7724fe9b8df952aa2f7e3ec7189f2a9d376c5ae50fc5676c5dd898ffa7'


// 获取标签列表
export function fetchTagsList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-LABEL-PAGE-LIST-PROCESSOR',
    data,
    token
  })
}

// 获取标签列表(不分页)
export function fetchAllTagsList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-LABEL-LIST-PROCESSOR',
    data,
    token
  })
}

// 添加标签
export function addTag(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-LABEL-NEW-PROCESSOR',
    data,
    token
  })
}

// 商品标签删除(批量删除)
export function deleteTag(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-LABEL-DELETE-PROCESSOR',
    data,
    token
  })
}

// 商品标签删除(批量删除)
export function enableTag(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-LABEL-ENABLE-PROCESSOR',
    data,
    token
  })
}


// 商品标签修改
export function editorTag(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-LABEL-UPDATE-PROCESSOR',
    data,
    token
  })
}

// 商品分类列表
export function fetchCategoryList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CATALOG-LIST-PROCESSOR',
    data,
    token
  })
}

// 商品分类详情
export function getCategoryDetail(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CATALOG-DETAIL-PROCESSOR',
    data,
    token
  })
}

// 商品分类添加
export function addCategory(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CATALOG-NEW-PROCESSOR',
    data,
    token
  })
}

// 商品分类修改
export function editorCategory(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CATALOG-EDIT-PROCESSOR',
    data,
    token
  })
}

// 商品分类删除
export function deleteCategory(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CATALOG-DELETE-PROCESSOR',
    data,
    token
  })
}

// 商品分类启用或禁用
export function enableCategory(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CATALOG-ENABLE-PROCESSOR',
    data,
    token
  })
}

// sku商品分页列表
export function fetchGoodsList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-SKU-PAGE-LIST-PROCESSOR',
    data,
    token
  })
}

// sku商品分页列表(无分页)
export function fetchGoodsSKUList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-SKU-LIST-PROCESSOR',
    data,
    token
  })
}

// 新增商品
export function addGoods(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-NEW-PROCESSOR',
    data,
    token
  })
}

// 获取商品详情
export function getGoodsDetail(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-DETAIL-PROCESSOR',
    data,
    token
  })
}

// 编辑商品
export function editorGoods(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-EDIT-PROCESSOR',
    data,
    token
  })
}

// 修改售价
export function changePrice(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CHANGE-PRICE-PROCESSOR',
    data,
    token
  })
}

// 单条修改库存
export function updateStock(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-UPDATE-STOCK-PROCESSOR',
    data,
    token
  })
}

// 商品上下架(批量)
export function upperOrLower(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-UPPER-OR-LOWER-PROCESSOR',
    data,
    token
  })
}

// 商品删除(批量)
export function allDelete(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-DELETE-PROCESSOR',
    data,
    token
  })
}

// 批量改价
export function allUpdatePrice(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-BATCH-CHANGE-PRICE-PROCESSOR',
    data,
    token
  })
}

// 商品导入分页列表
export function getImportPageList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-IMPORT-PAGE-LIST-PROCESSOR',
    data,
    token
  })
}

// spu商品分页列表
export function fetchSpuGoodsList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-SPU-PAGE-LIST-PROCESSOR',
    data,
    token
  })
}

// spu商品无分页列表
export function fetchAllSpuGoodsList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-SPU-LIST-PROCESSOR',
    data,
    token
  })
}

// 商品批量导入
export function importGoods(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    timeout: 100000,
    target: 'PRODUCT-IMPORT-PROCESSOR',
    data,
    token
  })
}

// spu商品分页列表
export function getSPUGoodsList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-SPU-PAGE-LIST-PROCESSOR',
    data,
    token
  })
}

// 转移商品
export function transferGoods(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-TRANSFER-PROCESSOR',
    data,
    token
  })
}

// 商品分类树形列表
export function fetchTreeCategoryList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CATALOG-TREE-LIST-PROCESSOR',
    data,
    token
  })
}

// 商品分类推荐或取消
export function recommend(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CATALOG-ISRECOMMEND-PROCESSOR',
    data,
    token
  })
}






