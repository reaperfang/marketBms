import request from '@/system/request'


// 获取商品类目列表
export function fetchCategoryList(data) {
  return request({
    apiType: 'goodsOperate',
    method: 'post',
    target: 'PUBLIC-PRODUCT-CATEGORYLIST-QUERYPROCESSOR',
    data
  })
}

// 获取单位计量列表
export function fetchUnitList(data) {
    return request({
      apiType: 'goodsOperate',
      method: 'post',
      target: 'PUBLIC-PRODUCT-UNITINFO-LIST-QUERY-PROCESSOR',
      data
    })
  }

  // 获取品牌管理列表
export function fetchBrandList(data) {
    return request({
        apiType: 'goodsOperate',
        method: 'post',
        target: 'PUBLIC-PRODUCT-BRANDINFO-LIST-QUERY-PROCESSOR',
        data
    })
}

// 获取商品规格列表
export function fetchSpecsList(data) {
    return request({
      apiType: 'goodsOperate',
      method: 'post',
      target: 'PUBLIC-PRODUCT-SPECS-DETAIL-LIST-PROCESSOR',
      data
    })
  }

  // 获取敏感词列表
export function fetchPublicSensitiveList(data) {
  return request({
    apiType: 'goodsOperate',
    method: 'post',
    target: 'PUBLIC-SENSITIVE-LIST-PROCESSOR',
    data
  })
}

