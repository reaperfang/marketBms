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
export function getIntelligentProgress(data) {
  return request({
    target: 'DECORATION_SMART_STORE_OPEN_STEPS_FIND_PROCESSOR',
    method: 'post',
    apiType: 'manager',
    data
  })
}
// 获取行业列表
export function getIntelligentIndustry(data) {
  return request({
    target: 'PUBLIC-SMART-STORE-INDUSTRY-LIST-PROCESSOR',
    method: 'post',
    apiType: 'manager',
    data
  })
}

// 是否显示再次加载弹窗(第三步启用模板是否失败了)
export function getIntelligentEnableStatus(data) {
  return request({
    target: '',
    method: 'post',
    apiType: 'manager',
    data
  })
}

// 获取预览步骤的店铺模板列表
export function getIntelligentPreViewTemplate(data) {
  return request({
    target: 'PUBLIC-SMART-STORE-TEMPLATE-FIND-PROCESSOR',
    method: 'post',
    apiType: 'manager',
    data
  })
}

// 启用模板 / 再次加载
export function intelligentEnableTemplate(data) {
  return request({
    target: '',
    method: 'post',
    apiType: 'manager',
    data
  })
}

// 数据配置实时查询进度的接口
export function intelligentConfigurationStatus(data) {
  return ({
    target: 'DECORATION_STORE_SYNCHRO_RECORD_FIND_PROCESSOR',
    method: 'post',
    apiType: 'manager',
    data
  })
}

//获取小程序和公众号的绑定状态
export function getwxBindStatus (data) {
  return request({
    target: 'SHOP-API-WXBIND-PROCESSOR',
    method: 'post',
    apiType: 'manager',
    data
  })
}

// 保存基础店铺信息表单
export function intelligentSaveBase(data) {
  return request({
    target: '',
    method: 'post',
    apiType: 'manager',
    data
  })
}

// 保存当前步骤状态
export function intelligentUpdateStep (data) {
  return request({
    target: 'DECORATION_SMART_STORE_OPEN_STEPS_UPDATE_PROCESSOR',
    method: 'post',
    apiType: 'manager',
    data
  })
}
