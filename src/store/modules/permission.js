import { asyncRouterMap, syncRouterMap } from '@/router'

/**
 * 通过meta.title判断是否与当前用户权限匹配
 * @param msfList
 * @param route
 */
function hasPermission(msfList, route) {
  if (route && route.meta.title) {
    return msfList.some(item => route.meta.title == item.name) || route.meta.title == '概况首页' || route.meta.title == '概况'
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param msfList
 */
function filterAsyncRouter(routes, msfList) {
  for(let i=0; i<routes.length; i++) {
    const tmp = { ...routes[i] }
    if (!hasPermission(msfList, tmp)) {
      routes.splice(i,1)
      i--;
    }else{
      if (tmp.children && tmp.meta.title != '店铺') {
        tmp.children = filterAsyncRouter(tmp.children, msfList)
      }
    }
  }
  return routes
}


const permission = {
  state: {
    routers: syncRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = syncRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const msfList = data
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        const type = userInfo.type
        let accessedRouters
        if (type == 'admin') {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, msfList)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
