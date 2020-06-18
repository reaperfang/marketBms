const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userInfo: state => state.userInfo || localStorage.getItem('userInfo'),
  roles: state => state.user.roles,
  shopInfos: state => state.user.shopInfos,
  permission_routers: state => state.permission.routers,
  permission_routers_tree: state => state.permission.routers && state.permission.routers.filter(val => !val.hidden && val.children),
  addRouters: state => state.permission.addRouters,

  mapLoaded: state => state.app.mapLoaded,

  shopInfo: state => state.shop.shopInfo,   //店铺信息
  colorStyle: state => state.shop.colorStyle,   //店铺风格
  
  currentComponentId: state => state.decorate.currentComponentId,   //当前装修组件id
  componentDataIds: state => state.decorate.componentDataIds,   //装修组件顺序列表
  componentDataMap: state => state.decorate.componentDataMap,   //装修组件数据映射
  basePropertyId: state => state.decorate.basePropertyId,   //基础属性类型
  baseInfo: state => state.decorate.baseInfo   //店铺装修页面基础信息
}
export default getters
