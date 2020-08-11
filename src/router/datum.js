import Layout from '@/components/layout/Layout'

export default [
  {
    path: '/datum',
      component: Layout,
      name: 'datum',
      meta: {
        title: '数据',
        icon: 'icon_datum',
        activeIcon:'icon_datums',
        navType:1
      },
      children: [
        {
          path: 'realTimeView',
          component: () => import('@/views/datum/realTimeView'),
          name: 'realTimeView',
          meta: { title: '实时概况', noCache: true, tabTitle: '实时概况', navType:2}
        },
        {
          path: 'purchaseOrder',
          component: () => import('@/views/datum/purchaseOrder'),
          name: 'purchaseOrder',
          meta: { title: '订单交易', noCache: true, tabTitle: '交易分析', navType:2 }
        },
        {
          path: 'commodityTransaction',
          component: () => import('@/views/datum/commodityTransaction'),
          name: 'commodityTransaction',
          meta: { title: '商品交易', noCache: true, tabTitle: '交易分析', navType:2 }
        },
        {
          path: 'perPrice',
          component: () => import('@/views/intelligentOperation/perPrice'),
          name: 'perPrice',
          meta: { title: '客单价', noCache: true, tabTitle: '交易分析', navType:2 }
        },
        {
          path: 'rightsProtection',
          component: () => import('@/views/intelligentOperation/rightsProtection'),
          name: 'rightsProtection',
          meta: { title: '维权分析', noCache: true, tabTitle: '交易分析', navType:2  }
        },
        {
          path: 'evaluate',
          component: () => import('@/views/intelligentOperation/evaluate'),
          name: 'evaluate',
          meta: { title: '评价分析', noCache: true, tabTitle: '交易分析', navType:2  }
        },
        {
          path: 'memberInfo',
          component: () => import('@/views/intelligentOperation/memberInfo'),
          name: 'memberInfo',
          meta: { title: '用户信息', noCache: true, tabTitle: '用户分析', navType:2  }
        },
        {
          path: 'memberConsumption',
          component: () => import('@/views/datum/memberConsumption'),
          name: 'memberConsumption',
          meta: { title: '会员消费', noCache: true, tabTitle: '用户分析', navType:2}
        },
        {
          path: 'integral',
          component: () => import('@/views/intelligentOperation/integral'),
          name: 'integral',
          meta: { title: '积分消耗', noCache: true, tabTitle: '用户分析', navType:2  }
        },
        {
          path: 'identityProperty',
          component: () => import('@/views/datum/identityProperty'),
          name: 'identityProperty',
          meta: { title: '身份属性', noCache: true, tabTitle: '用户分析', navType:2}
        },
        {
            path: 'channel',
            component: () => import('@/views/intelligentOperation/channel'),
            name: 'channel',
            meta: { title: '渠道转化', noCache: true, tabTitle: '流量分析' , navType:2 },
        },
        {
            path: 'channelDetail',
            component: () => import('@/views/intelligentOperation/channelDetail'),
            name: 'channelDetail',
            meta: { title: '渠道转化详情', noCache: true, tabTitle: '流量分析', navType:2  },
            hidden: true
        },
        {
          path: 'passengerFlow',
          component: () => import('@/views/datum/passengerFlow'),
          name: 'passengerFlow',
          meta: { title: '客流分析', noCache: true, tabTitle: '流量分析', navType:2}
        },
        {
          path: 'accessPath',
          component: () => import('@/views/datum/accessPath'),
          name: 'accessPath',
          meta: { title: '路径转化', noCache: true, tabTitle: '流量分析', navType:2 }
        },
      ]
  },
]