import request from '@/system/request'


/********************************************************** demo  开始 ******************************************************/
// 获取详情
export function getDemoDetail(data) {
  return request({
    url: '/admin/coupon/detail',
    method: 'post',
    baseURL: process.env.SALE_API,
    data
  })
}

