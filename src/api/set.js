import request from '@/system/request'

/* 获取店铺信息 */
export function getShopInfo(data) {
  return request({
    target: 'SHOP-API-100-PROCESSOR',
    method: 'post',
    apiType: 'manager',
    data
  })
}

/* 更新店铺信息 */
export function updateShopInfo(data) {
  return request({
    target: 'SHOP-API-102-PROCESSOR',
    method: 'post',
    apiType: 'manager',
    data
  })
}

/* 店铺支付信息 */
export function getShopPayInfo(data) {
  return request({
    target: 'PAYMENT-106-PROCESSOR',
    method: 'post',
    apiType: 'pay',
    data
  })
}

/* 添加店铺支付信息 */
export function addShopPayInfo(data) {
  return request({
    target: 'PAYMENT-104-PROCESSOR',
    method: 'post',
    apiType: 'pay',
    data
  })
}

/* 更新店铺支付信息 */
export function updateShopPayInfo(data) {
  return request({
    target: 'PAYMENT-105-PROCESSOR',
    method: 'post',
    apiType: 'pay',
    data
  })
}

/* 获取店铺交易物流信息 */
export function getShopLogistics(data) {
  return request({
    target: 'SHOP-KDNIAO-DETAIL-PROCESSOR',
    method: 'post',
    apiType: 'order',
    data
  })
}

/* 更新店铺交易物流信息 */
export function updateShopLogistics(data) {
  return request({
    target: 'SHOP-KDNIAO-ADD-PROCESSOR',
    method: 'post',
    apiType: 'order',
    data
  })
}

/* 获取店铺消息列表 */
export function getShopMessage(data) {
  return request({
    target: 'SHOP-API-107-PROCESSOR',
    method: 'post',
    apiType: 'manager',
    data
  })
}

/* 设置店铺消息列表 */
export function setShopMessage(data) {
  return request({
    target: 'SHOP-API-108-PROCESSOR',
    method: 'post',
    apiType: 'manager',
    data
  })
}

/* 获取子账号列表 */
export function getSubAccount(data) {
  return request({
    target: 'MANAGER-API-143',
    method: 'post',
    apiType: 'manager',
    data
  })
}

/* 新建子账号 */
export function newSubAccount(data) {
  return request({
    target: 'MANAGER-API-144',
    method: 'post',
    apiType: 'manager',
    data
  })
}

/* 编辑子账号 */
export function editSubAccount(data) {
  return request({
    target: 'MANAGER-API-145',
    method: 'post',
    apiType: 'manager',
    data
  })
}

/* 删除子账号 */
export function deleteAccount(data) {
  return request({
    target: 'MANAGER-API-146',
    method: 'post',
    apiType: 'manager',
    data
  })
}


/* 获取角色列表 */
export function getRoleList(data) {
  return request({
    target: 'MANAGER-API-147',
    method: 'post',
    apiType: 'manager',
    data
  })
}

/* 新建角色 */
export function newRole(data) {
  return request({
    target: 'MANAGER-API-148',
    method: 'post',
    apiType: 'manager',
    data
  })
}

/* 删除角色 */
export function deleteRole(data) {
  return request({
    target: 'MANAGER-API-149',
    method: 'post',
    apiType: 'manager',
    data
  })
}

/* 根据角色名称查询角色详情 */
export function getRoleInfo(data) {
  return request({
    target: 'MANAGER-API-151',
    method: 'post',
    apiType: 'manager',
    data
  })
}

/* 上传图片 */
export function uploadImage(data) {
  return request({
    url: '',
    method: 'post',
    apiType: 'uploadImage',
    headers:{
      "Content-Type":'multipart/form-data'
    },
    data
  })
}


