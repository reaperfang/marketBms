import { asyncRouterMap, syncRouterMap } from '@/router'

/**
 * 通过meta.title判断是否与当前用户权限匹配
 * @param msfList
 * @param route
 */
function hasPermission(msfList, route) {
  if(msfList){
    if (route && route.meta.title) {
      return msfList.some(item => route.meta.title == item.name && route.meta.navType == item.navType ) || route.meta.title == '概况首页' || route.meta.title == '概况' || route.meta.title == '账号信息'
    }else{
      return true
    }
  }else {
    return route.meta.title == '概况首页' || route.meta.title == '概况' || route.meta.title == '账号信息' ? true : false 
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

function filterAnotherAuthAsyncRouter(routes, enable) {
  if(typeof enable == 'undefined') return routes

  let hasPermission = (item) => {
    if(!item.meta) {
      return true
    } else {
      if(item.meta.anotherAuth) {
        if(enable == 1) {
          return false
        } else if(enable == 0) {
          return true
        }
      } else {
        return true
      }
    }
  }

  for(let i=0; i<routes.length; i++) {
    //const tmp = { ...routes[i] }
    const tmp = routes[i]
    if (!hasPermission(tmp)) {
      // routes.splice(i,1)
      // i--;
      tmp.hidden = true
    }else{
      if(tmp.meta.anotherAuth) {
        tmp.hidden = false
      }
      if (tmp.children) {
        tmp.children = filterAnotherAuthAsyncRouter(tmp.children, enable)
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
    GenerateRoutes({ commit }, { data, enable }) {
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

        let flag = true

        if(localStorage.getItem('authDebug')) {
          flag = false
        }
        if(flag && (typeof enable != 'undefined')) {
          let _accessedRouters = [...accessedRouters]
          //let _accessedRouters = JSON.parse(JSON.stringify(accessedRouters))

          accessedRouters = filterAnotherAuthAsyncRouter(_accessedRouters, enable)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    GenerateAuthRouter({ commit }, enable) {
      let _asyncRouterMap

      return new Promise((resolve, reject) => {
        console.log(asyncRouterMap)
        _asyncRouterMap = filterAnotherAuthAsyncRouter(asyncRouterMap, enable)
        console.log(_asyncRouterMap)

        commit('SET_ROUTERS', _asyncRouterMap)
        resolve()
      })
    }
  }
}

export default permission
