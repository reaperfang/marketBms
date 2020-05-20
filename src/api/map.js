import request from '@/system/request'

//  腾讯地图-逆地址解析
export function getGeocoder(data) {
    return request({
      target:'PUBLIC-TENCENT-MAP-GEO-CODER-PROCESSOR',
      method: 'post',
      apiType: 'goodsOperate',
      data
    })
}