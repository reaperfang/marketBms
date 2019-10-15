import request from '@/system/request'


// 获取标签列表
export function fetchTagsList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-LABEL-PAGE-LIST-PROCESSOR',
    data
  })
}

// 获取标签列表(不分页)
export function fetchAllTagsList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-LABEL-LIST-PROCESSOR',
    data
  })
}

// 添加标签
export function addTag(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-LABEL-NEW-PROCESSOR',
    data
  })
}

// 商品标签删除(批量删除)
export function deleteTag(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-LABEL-DELETE-PROCESSOR',
    data
  })
}

// 商品标签删除(批量删除)
export function enableTag(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-LABEL-ENABLE-PROCESSOR',
    data
  })
}


// 商品标签修改
export function editorTag(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-LABEL-UPDATE-PROCESSOR',
    data
  })
}

// 商品分类列表
export function fetchCategoryList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CATALOG-LIST-PROCESSOR',
    data
  })
}

// 商品分类详情
export function getCategoryDetail(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CATALOG-DETAIL-PROCESSOR',
    data
  })
}

// 商品分类添加
export function addCategory(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CATALOG-NEW-PROCESSOR',
    data
  })
}

// 商品分类修改
export function editorCategory(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CATALOG-EDIT-PROCESSOR',
    data
  })
}

// 商品分类删除
export function deleteCategory(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CATALOG-DELETE-PROCESSOR',
    data
  })
}

// 商品分类启用或禁用
export function enableCategory(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CATALOG-ENABLE-PROCESSOR',
    data
  })
}

// sku商品分页列表
export function fetchGoodsList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-SKU-PAGE-LIST-PROCESSOR',
    data
  })
}

// 新增商品
export function addGoods(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-NEW-PROCESSOR',
    data
  })
}

// 获取商品详情
export function getGoodsDetail(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-DETAIL-PROCESSOR',
    data
  })
}

// 编辑商品
export function editorGoods(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-EDIT-PROCESSOR',
    data
  })
}

// 修改售价
export function changePrice(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CHANGE-PRICE-PROCESSOR',
    data
  })
}

// 单条修改库存
export function updateStock(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-UPDATE-STOCK-PROCESSOR',
    data
  })
}

// 商品上下架(批量)
export function upperOrLower(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-UPPER-OR-LOWER-PROCESSOR',
    data
  })
}

// 商品删除(批量)
export function allDelete(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-DELETE-PROCESSOR',
    data
  })
}

// 批量改价
export function allUpdatePrice(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-BATCH-CHANGE-PRICE-PROCESSOR',
    data
  })
}

// 商品导入分页列表
export function getImportPageList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-IMPORT-PAGE-LIST-PROCESSOR',
    data
  })
}

// spu商品分页列表
export function fetchSpuGoodsList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-SPU-PAGE-LIST-PROCESSOR',
    data
  })
}

// spu商品无分页列表
export function fetchAllSpuGoodsList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-SPU-LIST-PROCESSOR',
    data
  })
}

// 商品批量导入
export function importGoods(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    timeout: 100000,
    target: 'PRODUCT-IMPORT-PROCESSOR',
    data
  })
}

// spu商品分页列表
export function getSPUGoodsList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-SPU-PAGE-LIST-PROCESSOR',
    data
  })
}

// 转移商品
export function transferGoods(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-TRANSFER-PROCESSOR',
    data
  })
}

// 商品分类树形列表
export function fetchTreeCategoryList(data) {
  return request({
    apiType: 'goods',
    method: 'post',
    target: 'PRODUCT-CATALOG-TREE-LIST-PROCESSOR',
    data
  })
}





