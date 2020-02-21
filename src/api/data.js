import request from '@/system/request'


/********************************************************** 数据 js ******************************************************/
/*
**访问分析
*/
//浏览量/访客量
export function flowAnalysis(data) {
  return request({
    target: 'ECHART-PV-AND-UV-PROCESSOR',
    method: 'post',
    apiType: 'data',
    data
  })
}
//到店时段
export function uvhour(data) {
  return request({
    target: 'ECHART-UV-HOUR',
    method: 'post',
    apiType: 'data',
    data
  })
}
//访问次数
export function pvady(data) {
  return request({
    target: 'ECHART-PV-DAY',
    method: 'post',
    apiType: 'data',
    data
  })
}
//访问来源
export function channel(data) {
  return request({
    target: 'ECHART-UV-CHANNEL',
    method: 'post',
    apiType: 'data',
    data
  })
}
//平均停留时间
export function residetime(data) {
  return request({
    target: 'ECHART-AVERAGE-RESIDE-TIME',
    method: 'post',
    apiType:'data',
    data
  })
}
//跳出率
export function bouncerate(data) {
  return request({
    target: 'ECHART-BOUNCE-RATE',
    method: 'post',
    apiType:'data',
    data
  })
}
//路径转化
export function transformation(data) {
  return request({
    target: 'ECHART-PATH-TRANSFORMATION',
    method: 'post',
    apiType: 'data',
    data
  })
}
/*
**客户分析
*/
//身份属性-属性比例
export function attributeRatio(data) {
    return request({
      target:'MEMBER-ANALYSIS-ATTRIBUTE-RATIO-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
//身份属性-会员趋势 
export function memberTrend(data) {
    return request({
      target:'MEMBER-ANALYSIS-INCREASE-MEMBER-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
//身份属性-支付趋势
export function paymentTrend(data) {
    return request({
      target:'MEMBER-ANALYSIS-ATTRIBUTE-PAY-COUNT-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
//会员消费
export function memberConsumption(data) {
    return request({
      target:'MEMBER-CONSUME-ANALYSIS-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
/*
**交易分析
*/
// 商品交易-商品总况 
export function generalCondition(data) {
    return request({
      target:'Echart-Data-Product-Today-Statistics',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 商品交易-热销商品  
export function hotGoods(data) {
    return request({
      target:'Echart-Product-Top-Five',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 商品交易-商品详情 
export function productDetails(data) {
    return request({
      target:'Echart-Product-Statistics',
      method: 'post',
      apiType: 'data',
      data
    })
  }
//店铺交易
export function tradingTrend(data) {
  return request({
    target:'ECHART-DATA-SHOP-TRANSACTION-PROCESSOR',
    method: 'post',
    apiType: 'data',
    data
  })
}
// 店铺交易-交易趋势图 
export function tradingTrendchart(data) {
    return request({
      target:'SHOP-TRADING-TREND-ANALYSIS-DATA-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 店铺交易-交易概况 
export function tradingOverview(data) {
    return request({
      target:'SHOP-TRADING-SURVEYVIEW-DATA-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
/**************************************************************智能运营分析********************************************************/
/*
**客单价
 */  
// 实时概况
export function realTimeOverview(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-AVERAGE-ORDER-PAYMENT-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 历史记录
export function historyRecord(data) {
    return request({
      target:'HISTORY-AUTOMATIC-ANALYSE-PAYMENT-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 历史记录导出
export function historyExport(data) {
    return request({
      target:'HISTORY-AUTOMATIC-ANALYSE-PAYMENT-EXPORT-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
/*
**会员分析
 */  
// 会员信息 
export function memberInformation(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-MEMBER-INFO-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 积分消耗 
export function integralconsumption(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-SCORE-PAYMENT-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 积分消耗导出 
export function integralConsumptionExport(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-SCORE-PAYMENT-EXPORT-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 会员信息导出 
export function memberInformationExport(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-MEMBER-INFO-EXPORT-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 渠道转化 
export function channelConversion(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-MEMBER-CHANNEL-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 渠道转化导出 
export function channelConversionExport(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-MEMBER-CHANNEL-EXPORT-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 渠道查询 
export function channelQuery(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-MEMBER-CHANNEL-INFO-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 渠道转化详细信息 
export function channelConversionDetails(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-MEMBER-CHANNEL-DETAIL-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 渠道转化详细信息导出 
export function channelConversionDetailsExport(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-MEMBER-CHANNEL-DETAIL-EXPORT',
      method: 'post',
      apiType: 'data',
      data
    })
  }
/*
** 口碑分析
 */  
// 评价 
export function evaluation(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-APPRAISE-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 评价导出 
export function evaluationExport(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-APPRAISE-EXPORT-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 维权导出 
export function exportOfrights(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-PROTECTION-EXPORT-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 维权 
export function rightsProtection(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-PROTECTION-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 获取维权原因
export function getReasons(data) {
  return request({
    target:'AUTOMATIC-ANALYSE-PROTECTION-REASON-PROCESSOR',
    method: 'post',
    apiType: 'data',
    data
  })
}

// 维权类型查询 
export function rightsTypeQuery(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-PROTECTION-TYPE-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
  }
// 维权原因查询  
export function ownershipReasonQuery(data) {
    return request({
      target:'AUTOMATIC-ANALYSE-PROTECTION-REASON-PROCESSOR',
      method: 'post',
      apiType: 'data',
      data
    })
 }
//获取会员和口碑的过滤数据
export function memberInforNum(data) {
  return request({
    target:'FILTER-SET-DATA-PROCESSOR',
    method: 'post',
    apiType: 'matrix',
    data
  })
}

/*
** 是否开通pc wap
*/ 
export function openPcWap(data) {
  return request({
    target:'TC-PCWAP-APPLY-INFO-PROCESSOR',
    method: 'post',
    apiType: 'matrix',
    data
  })
}

