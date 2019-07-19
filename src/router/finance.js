import Layout from '@/components/layout/Layout'

export default [
  {
		path: '/finance',
    component: Layout,
    name: 'finance',
    meta: {
      title: '财务',
      icon: 'el-icon-setting'
    },
    children: [
      {
        path: 'revenueSituation',
        component: () => import('@/views/finance/revenueSituation'),
        name: 'revenueSituation',
        meta: { title: '营收状况', noCache: true, tabTitle: '财务管理' }
      },
      {
        path: 'revenueExpenditureDetails',
        component: () => import('@/views/finance/revenueExpenditureDetail'),
        name: 'revenueExpenditureDetails',
        meta: { title: '收支明细', noCache: true, tabTitle: '财务管理' },
      },
      {
        path: 'dailyRevenue',
        component: () => import('@/views/finance/dailyRevenue'),
        name: 'dailyRevenue',
        meta: { title: '每日营收', noCache: true, tabTitle: '财务管理' }
      },
      {
        path: 'withdrawalDetails',
        component: () => import('@/views/finance/withdrawalDetails'),
        name: 'withdrawalDetails',
        meta: { title: '提现明细', noCache: true, tabTitle: '财务管理' }
      },
    	{
        path: 'customerBalance',
        component: () => import('@/views/finance/customerBalance'),
        name: 'customerBalance',
        meta: { title: '客户ID余额', noCache: true, tabTitle: '成本核算' }
      },
      {
        path: 'integralDetails',
        component: () => import('@/views/finance/integralDetails'),
        name: 'integralDetails',
        meta: { title: '积分明细', noCache: true, tabTitle: '成本核算' }
      },
      {
        path: 'twitterAward',
        component: () => import('@/views/finance/twitterAward'),
        name: 'twitterAward',
        meta: { title: '推客奖励', noCache: true, tabTitle: '成本核算' }
      },
      {
        path: 'logisticsReconciliation',
        component: () => import('@/views/finance/logisticsReconciliation'),
        name: 'logisticsReconciliation',
        meta: { title: '物流对账', noCache: true, tabTitle: '成本核算' }
      },
      {
        path: 'smsGroupSends',
        component: () => import('@/views/finance/smsGroupSends'),
        name: 'smsGroupSends',
        meta: { title: '短信群发', noCache: true, tabTitle: '成本核算' }
      },
    ]
	}
]