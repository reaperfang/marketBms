import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layout/Layout'
Vue.use(Router)
// import demo from './demo';
import shop from './shop';
import goods from './goods';
import order from './order';
import finance from './finance';
import set from './set';
// import intelligentOperation from './intelligentOperation';
import client from './client';
import datum from './datum';
import profile from './profile';
import apply from './apply';
export const asyncRouterMap = [  //异步路由表
	// ...demo,
  ...profile,
  ...shop,
  ...goods,
  ...order,
  ...client,
  ...datum,
  // ...intelligentOperation,
  ...finance,
  ...apply,
  ...set
]

//由于asyncRouterMap会根据权限变化，所以优先克隆一份完整的路由，以便路由守卫中判断路由是否存在，跳转404页面时使用
export const asyncRouterMapCopy = [...asyncRouterMap]

export const syncRouterMap = [ //同步路由表
  {
    path: '',
    component: Layout,
    // redirect: '/login',
    redirect: '/profile/profile'
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/components/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/components/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/components/errorPage/401'),
    hidden: true
  },
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/index'),
    name:'dashboard',
    hidden: true
  },
  {
    path: '/datashop',
    component: () => import('@/views/datashop/index'),
    name:'datashop',
    hidden: true
  },
  {
    path: 'simpleAddGoods',
    component: () => import('@/views/goods/addGoods'),
    name: 'simpleAddGoods'
    // meta: { title: '新建商品', noCache: true, tabTitle: '商品管理' ,navType:2},
  },
]


const routerConfig = {
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: syncRouterMap
};

// vue-router ≥3.0版本回调形式以及改成promise api的形式了，返回的是一个promise，如果路由地址跳转相同, 且没有捕获到错误，控制台始终会出现错误警告 （注：3.0以下版本则不会出现以下警告！！！，因路由回调问题…）
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

let router = new Router(routerConfig);
router.selfAddRoutes = function (params){  //解决控制台路由警告提示  https://www.cnblogs.com/fqh123/p/11571688.html
  router.matcher = new Router(routerConfig).matcher; //此处清掉之前的路由，创建新的
  router.addRoutes(params)
}
export default router

