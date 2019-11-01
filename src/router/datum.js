import Layout from '@/components/layout/Layout'

export default [
  {
	path: '/datum',
    component: Layout,
    name: 'datum',
    meta: {
      title: '数据',
      icon: 'icon_datum',
      activeIcon:'icon_datums'
    },
    children: [
      {
        path: 'passengerFlow',
        component: () => import('@/views/datum/passengerFlow'),
        name: 'passengerFlow',
        meta: { title: '客流分析', noCache: true, tabTitle: '访问' }
      },
      {
        path: 'accessPath',
        component: () => import('@/views/datum/accessPath'),
        name: 'accessPath',
        meta: { title: '访问路径', noCache: true, tabTitle: '访问' }
      },
      {
        path: 'identityProperty',
        component: () => import('@/views/datum/identityProperty'),
        name: 'identityProperty',
        meta: { title: '身份属性', noCache: true, tabTitle: '客户' }
      },
      {
        path: 'memberConsumption',
        component: () => import('@/views/datum/memberConsumption'),
        name: 'memberConsumption',
        meta: { title: '会员消费', noCache: true, tabTitle: '客户' }
      },
      {
        path: 'commodityTransaction',
        component: () => import('@/views/datum/commodityTransaction'),
        name: 'commodityTransaction',
        meta: { title: '商品交易', noCache: true, tabTitle: '交易' }
      },
      {
        path: 'purchaseOrder',
        component: () => import('@/views/datum/purchaseOrder'),
        name: 'purchaseOrder',
        meta: { title: '订单交易', noCache: true, tabTitle: '交易' }
      }
    ]
	}
]