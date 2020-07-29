import request from '@/system/request'




    // 行业列表
export function getIndustry(data) {
    return request({
      url: '/news?dept=aiyouyi.cn&cat=hangye&pagenum=3',
      method: 'get',
      baseURL: process.env.ZX_API,
      data
    })
  }
export function getNews(data) {
  return request({
    url: '/news?dept=aiyouyi.cn&cat=news&pagenum=3',
    method: 'get',
    baseURL: process.env.ZX_API,
    data
  })
}
// 产品动态
export function getProductNews(data) {
  return request({
    url: '/news?dept=aiyouyi.cn&cat=shushangdongtai&pagenum=6',
    method: 'get',
    baseURL: process.env.ZX_API,
    data
  })
}

// 帮助中心
export function getHelpNews(data) {
  return request({
    url: '/news?dept=aiyouyi.cn&cat=yidongshangcheng&pagenum=8',
    method: 'get',
    baseURL: process.env.ZX_API,
    data
  })
}
// 获取签名列表 不分页
export function getSignatureList (params) {
  return request({
    url: `/v1/b/sms/signature/pagelist`,
    baseURL: process.env.SALE_API,
    method: 'get',
    params
  })
}

// 获取小程序太阳码
export function getWXQrcode(data) {
  return request({
    target: 'SHOP-API-APPMAURL-PROCESSOR',
    method: 'post',
    apiType: 'manager',
    data
  })
}

//判断移动商城是否授权 
export function isEmpower(data) {
  return request({
    target: 'SHOP-API-WXBIND-PROCESSOR',
    method: 'post',
    apiType: 'manager',
    data
  })
}
