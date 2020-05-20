import request from '@/system/request'




    // 行业列表
export function getIndustry(data) {
    return request({
      url: '/news?dept=aiyouyi.cn&cat=hangye',
      method: 'get',
      baseURL: process.env.ZX_API,
      data
    })
  }
  export function getNews(data) {
    return request({
      url: '/news?dept=aiyouyi.cn&cat=news',
      method: 'get',
      baseURL: process.env.ZX_API,
      data
    })
  }