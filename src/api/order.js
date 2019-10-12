import request from '@/system/request'


// 获取标签列表
export function fetchOrderList(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-PAGE-LIST-PROCESSOR',
    data
  })
}

// 订单详情
export function fetchOrderDetail(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-DETAIL-PROCESSOR',
    data
  })
}

// 订单导出
export function exportOrders(data) {
  return request({
    apiType: 'order',
    method: 'post',
    timeout: 22000,
    target: 'ORDER-INFO-EXPORT-PROCESSOR',
    data
  })
}

// 订单发货列表
export function orderSendPageList(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-SEND-PAGE-LIST-PROCESSOR',
    data
  })
}

// 售后单发货列表
export function SendPageList(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-AFTER-SALE-SEND-INFO-LIST-PROCESSOR',
    data
  })
}

// 订单确认收款
export function makeCollections(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-INFO-RECEIVE-MONEY-PROCESSOR',
    data
  })
}

// 订单关闭
export function orderClose(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-CLOSE-PROCESSOR',
    data
  })
}

// 订单备注--商家备注
export function orderRemark(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-SELLER-ADD-REMARK-PROCESSOR',
    data
  })
}

// 订单收货信息--商家修改
export function orderUpdateReceive(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-UPDATE-RECEIVED-PROCESSOR',
    data
  })
}

// 订单改价
export function orderPriceChange(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-PRICE-CHANGE-PROCESSOR',
    data
  })
}

// 评论列表查询（分页）
export function getCommentList(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-PRODUCT-COMMENT-PAGE-LIST-PROCESSOR',
    data
  })
}

// 查看评论详情
export function getCommentInfo(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-PRODUCT-COMMENT-INFO-PROCESSOR',
    data
  })
}

// 回复 / 批量回复
export function replyComment(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-PRODUCT-COMMENT-REPLYP-ROCESSOR',
    data
  })
}

// 设为/取消精选
export function setChoiceness(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-PRODUCT-COMMENT-CHOICENESS-PROCESSOR',
    data
  })
}

// 审核 / 批量审核
export function orderCommentAuth(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-PRODUCT-COMMENT-AUTH-PROCESSOR',
    data
  })
}

//  商家自定义敏感词列表查询
export function getSensitiveWordList(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'SENSITIVE-WORD-LIST-PROCESSOR',
    data
  })
}

//  商家自定义敏感词删除
export function deleteSensitiveWord(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'SENSITIVE-WORD-DELETE-PROCESSOR',
    data
  })
}

//  商家自定义敏感词添加
export function addSensitiveWord(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'SENSITIVE-WORD-ADD-PROCESSOR',
    data
  })
}

//  售后单列表
export function getOrderAfterSalePageList(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-AFTER-SALE-PAGE-LIST-PROCESSOR',
    data
  })
}

//  售后单详情
export function getOrderAfterSaleDetail(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-AFTER-SALE-INFO-PROCESSOR',
    data
  })
}

//  审核/批量审核
export function orderAfterSaleUpdateStatus(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-AFTER-SALE-UPDATE-STATUS-PROCESSOR',
    data
  })
}

//  导出
export function orderAfterSaleExport(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-AFTERSALE-EXPORT-EXCEL-PROCESS',
    data
  })
}

//  换货确认
export function orderAfterConfirmExchange(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-AFTER-SALE-CONFIRM-EXCHANGE-PROCESSOR',
    data
  })
}

//  订单支付信息
export function getOrderPayRecordList(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-PAY-RECORD-LIST-PROCESSOR',
    data
  })
}

//  订单发货 / 批量发货
export function orderSendGoods(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDERSENDINFOBATCHPROCESS',
    data
  })
}

//  获取快递公司
export function fetchExpressCompanyList(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'EXPRESS-COMPANY-LIST-PROCESSOR',
    data
  })
}

//  获取电子面单列表
export function fetchElectronicFaceSheetList(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'EXPRESS-ELECTRONIC-SHEET-PAGELIST-PROCESSOR',
    data
  })
}

//  查看电子面单
export function getElectronicFaceSheetDetail(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'EXPRESS-ELECTRONIC-SHEET-DETAIL-PROCESS',
    data
  })
}

//  新增电子面单
export function addElectronicFaceSheet(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-EXPRESS-ELECTRONIC-SHEET-ADD-PROCESSOR',
    data
  })
}

//  修改电子面单
export function editorElectronicFaceSheet(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'EDIT-EXPRESS-ELECTRONIC-SHEET-PROCESSOR',
    data
  })
}

//  删除电子面单
export function deleteElectronicFaceSheet(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'DELETE-EXPRESS-ELE-SHEET-PROCESSOR',
    data
  })
}

//  获取物流管理列表
export function fetchTemplatePageList(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'FREIGHT-TEMPLATE-PAGE-LIST-PROCESSOR',
    data
  })
}

//  物流模板详情查看
export function getTemplatePageDetail(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'FREIGHT-TEMPLATE-DETAIL-PROCESSOR',
    data
  })
}

// 获取省市区
export function getArea(data) {
  return request({
    apiType: 'goodsOperate',
    method: 'post',
    target: 'PUBLIC-CITY-ALLLIST-PROCESSOR',
    data
  })
}

// 新建物流模板
export function addFreightTemplate(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'FREIGHT-TEMPLATE-ADD-PROCESSOR',
    data
  })
}

// 物流模板修改
export function editorFreightTemplate(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'FREIGHT-TEMPLATE-EDIT-PROCESSOR',
    data
  })
}

// 售后单列表
export function getOrderAfterSaleList(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-AFTER-SALE-PAGE-LIST-PROCESSOR',
    data
  })
}

// 打印配送单
export function orderSendInfoPrint(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-SEND-INFO-PRINT-PROCESSOR',
    data
  })
}

// 批量打印电子面单
export function printElectronicForm(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'EXPRESS-ELECTRONIC-TEMPLATE-LIST-PROCESSOR',
    data
  })
}

// 售后单打印配送单
export function afterSalePrintSendInfo(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-AFTER-SALE-BATCH-PRINT-DELIVERY-PROCESSOR',
    data
  })
}

// 售后单打印电子面单
export function afterSalePrintElectronicForm(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-AFTER-EXPRESS-ELE-TEMPLATE-LIST-PROCESSOR',
    data
  })
}

// 售后单批量发货
export function orderAfterSaleSend(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-AFTER-SALE-BATCH-SEND-PROCESSOR',
    data
  })
}

// 换货确认
export function orderAfterSaleConfirmExchange(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-AFTER-SALE-CONFIRM-EXCHANGE-PROCESSOR',
    data
  })
}

// 退款
export function orderAfterSaleDrawback(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-AFTER-SALE-REFUND-PROCESSOR',
    data
  })
}

// 售后发货详情列表
export function orderAfterSaleDetail(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-AFTER-SALE-SEND-INFO-DETIAL-LIST-PROCESSOR',
    data
  })
}

// 订单批量发货详情
export function orderSendDetail(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-SEND-LISTP-ROCESSOR',
    data
  })
}

// 获取补填物流详情
export function orderSendInfoFillUpExpressPage(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-SENDINFO-FILLUP-EXPRESS-PAGE-PROCESS',
    data
  })
}

// 单个/批量补填物流
export function orderSendInfoFillUpExpress(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDERSENDINFOBATCHPROCESS',
    data
  })
}

// 查询物流轨迹
export function orderLogistics(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-EXPRESSINFOTRACE-EXPRESSCODE-PROCESS',
    data
  })
}

// 确认收货
export function orderConfirmReceived(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-AFTER-SALE-CONFIRM-RECEIVED-PROCESSOR',
    data
  })
}

// 批量导入订单发货
export function orderSendInfoImportBatchDelever(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-SENDINFO-IMPORT-BATCH-DELIVER-PROCESSOR',
    data
  })
}

// 批量导入售后发货
export function orderSendInfoImportAfterSaleBatchDelever(data) {
  return request({
    apiType: 'order',
    method: 'post',
    target: 'ORDER-AFTER-SALE-IMPORT-BATCH-DELIVER-PROCESSOR',
    data
  })
}

//获取公告信息(装修首页显示)
  export function getBuyNotice(data) {
      return request({
        target: 'ORDER-BUY-BULLETIN-PROCESS',
        method: 'post',
        apiType: 'order',
        data
      })
  }

  //订单删除
  export function deleteOrder(data) {
    return request({
      target: 'ORDER-EDIT-PROCESSOR',
      method: 'post',
      apiType: 'order',
      data
    })
}

 //修改发货地址
 export function orderUpdateAddress(data) {
  return request({
    //token: '09255c7724fe9b8df952aa2f7e3ec718768b8ae62e74d1ef2214c0aead86a36b',
    target: 'SHOP-API-102-PROCESSOR',
    method: 'post',
    apiType: 'manager',
    data
  })
}

 //修改发货地址
 export function fetchOrderAddress(data) {
  return request({
    target: 'SHOP-API-100-PROCESSOR',
    method: 'post',
    apiType: 'manager',
    data
  })
}

 //电子面单 获取快递公司
 export function getElectronicFaceSheetExpressCompanyList(data) {
  return request({
    target: 'PUBLIC-EXPRESS-COMPANY-LIST-PROCESSOR',
    method: 'post',
    apiType: 'goodsOperate',
    data
  })
}

 //快递鸟-详情
 export function getIsTrace(data) {
  return request({
    target: 'SHOP-KDNIAO-DETAIL-PROCESSOR',
    method: 'post',
    apiType: 'order',
    data
  })
}














