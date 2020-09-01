import request from '@/system/request'

//  实时概况--数据总览
export function dataView(data) {
  return request({
    target:'RTOV-DATA-OVERVIEW-PROCESSOR',
    method: 'post',
    apiType: 'data',
    data
  })
}
//  实时概况--交易看板
export function transactionView(data) {
  return request({
    target:'RTOV-TRANSACTION-KANBAN-PROCESSOR',
    method: 'post',
    apiType: 'data',
    data
  })
}
//  实时概况--交易分布
export function tradeDistribution(data) {
    return request({
      target:'RTOV-TRANSACTION-DISTRIBUTION-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }

//  实时概况--用户概览
export function userView(data) {
    return request({
      target:'RTOV-USER-OVERVIEW-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }  
//  实时概况--渠道转化
export function channelView(data) {
    return request({
      target:'RTOV-CHANNEL-TRANSFOR-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
}

//  实时概况--商品看板
export function goodsView(data) {
    return request({
      target:'RTOV-GOOD-KANBAN-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
}

//  实时概况--移动商城数据是否完成准备接口
export function dataReady(data) {
    return request({
      target:'RTOV-DATA-READY-FINISHFLAG-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
}
  