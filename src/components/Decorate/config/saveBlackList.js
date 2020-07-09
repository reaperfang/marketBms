/* 
 * 保存时的字段黑名单(跳过保存这些字段)
 */
export default [
      'fakeList',  //来自运营端的假数据列表
      'displayList',  //在编辑器内显示的真实数据(不保存到装修页面中)
      'showFakeData',  //显示假数据标识
      'hasRealData',  //有真数据
      'hasFakeData',  //有假数据
      'needReplace',  //需要替换
]