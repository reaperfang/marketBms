/* 权限控制文件 */
import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { isLogin, getAuthList } from '@/system/user.js' // getToken from cookie
// import { getShopInfos } from '@/system/shop.js' // getToken from cookie
import { asyncRouterMapCopy, syncRouterMap } from '@/router'




NProgress.configure({ showSpinner: false })// NProgress Configuration

function hasPermission(msfList, route) {
  if (route && route.path) {
    let title =  route.meta.title;
    return msfList.some(item => title == item.name) || route.name == 'profile' || route.path == '/401' || route.path == '/404' || route.path == '/login' || (route.matched[0] && route.matched[0].path == '/shop') || route.name == 'accountInfo' || route.name == 'passwordChange' || route.name == 'guidePrompt' || route.name == 'shopGuide' || route.name == 'intelligent' || route.name == 'intelligentGuide'
  } else {
    return true
  }
}

//组合所有路由的path
function eachRouterList(routerList, pathArr, paths) {
  routerList.forEach(item => {
    let path = item.path;
    if(paths){
      path = paths + path;
    }
    if(item.children){
      eachRouterList(item.children, pathArr, path);
    }else{
      pathArr.push(path.replace(/\//g,''));
    }
  })
}

//是否包含路由
function hasRouter(routerList, route) {
  let pathArr = [];
  eachRouterList(routerList, pathArr);
  const path = route.path.replace(/\//g,'');
  return pathArr.includes(path)
}

const whiteList = ['/login', '/auth-redirect','/datashop']// no redirect whitelist

let flag = 0
router.beforeEach((to, from, next) => {
  // console.log('go router')
  NProgress.start() // start progress bar
  //  if (true) { // determine if there has token  
  if(isLogin()){
    // const localMsfList = getShopInfo();
    let msfList = getAuthList()
    let enable = 0

    enable = +localStorage.getItem('anotherAuthEnable') // 订单导入权限
    // if(localMsfList && JSON.parse(localMsfList) && JSON.parse(localMsfList).data && JSON.parse(localMsfList).data.msfList) {
    //   msfList = JSON.parse(localMsfList).data.msfList
    // }
    /* has token*/
    if (to.path === '/login') {
      if(msfList.length) {
        next({ path: '/' })
        NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
      }else {
        next()
        NProgress.done() //
      }
    } else {
        if(flag == 0){
          store.dispatch('getShopStyle');
          store.dispatch('GenerateRoutes', {data: msfList, enable}).then(() => { // 根据roles权限生成可访问的路由表
            if(store.getters.addRouters.length != 0){
              router.selfAddRoutes(store.getters.addRouters) // 动态添加可访问路由表
              // console.log('GenerateRoutes',to)
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            }else{
              next({ path: '/401'})
            }
            flag++
          })
        // }).catch((err) => {
        //   store.dispatch('FedLogOut').then(() => {
        //     Message.error(err || 'Verification failed, please login again')
        //     next({ path: '/' })
        //   })
        // })
      } else {
        //如果有路由权限，则直接进入
        if (hasPermission(msfList, to)) {
          next()
        } else { //如果没有路由权限，则在判断是404错误页面或者是401无权限
          const allRouter = [...asyncRouterMapCopy, ...syncRouterMap];
          if(hasRouter(allRouter, to)) {
            next({ path: '/401', replace: true})
          }else { //跳转至404错误页面
            next({ path: '/404', replace: true})
          }
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
  console.log('enter: afterEach')
})
