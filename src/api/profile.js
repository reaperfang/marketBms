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
    url: '/news?dept=aiyouyi.cn&cat=shushangdongtai&pagenum=8',
    method: 'get',
    baseURL: process.env.ZX_API,
    data
  })
}

// 获取智能开店的进度步骤以及总首次登录状态
export function getIntelligentProgress (data) {
  return request({
    target: '',
    method: 'post',
    apiType: 'manager',
    data
  })
}
// 获取行业列表
export function getIntelligentIndustry(data) {
  return request({
    target: '',
    method: 'post',
    apiType: 'manager',
    data
  })
}

// 是否显示再次加载弹窗(第三步启用模板是否失败了)
export function getIntelligent(data) {
  return request({
    target: '',
    method: 'post',
    apiType: 'manager',
    data
  })
}
