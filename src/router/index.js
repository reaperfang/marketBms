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

let router = new Router(routerConfig);
router.selfAddRoutes = function (params){  //解决控制台路由警告提示  https://www.cnblogs.com/fqh123/p/11571688.html
  router.matcher = new Router(routerConfig).matcher; //此处清掉之前的路由，创建新的
  router.addRoutes(params)
}
export default router

