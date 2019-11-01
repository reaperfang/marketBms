import Layout from '@/components/layout/Layout'

export default [
  {
		path: '/client',
    component: Layout,
    name: 'client',
    meta: {
      title: '客户',
      icon: 'icon_client',
      activeIcon:'icon_clients'
    },
    children: [
      {
        path: 'allClient',
        component: () => import('@/views/client/allClient'),
        name: 'allClient',
        meta: { title: '全部客户', noCache: true, tabTitle: '客户管理' }
      },
      {
        path: 'clientInfo',
        component: () => import('@/views/client/clientInfo'),
        name: 'clientInfo',
        hidden: true, 
        meta: { title: '全部客户', noCache: true, tabTitle: '客户管理' }
      },
      {
        path: 'clientImport',
        component: () => import('@/views/client/clientImport'),
        name: 'clientImport',
        hidden: true, 
        meta: { title: '全部客户', noCache: true, tabTitle: '客户管理' }
      },
      {
        path: 'clientLabel',
        component: () => import('@/views/client/clientLabel'),
        name: 'clientLabel',
        meta: { title: '客户标签', noCache: true, tabTitle: '客户管理' }
      },
      {
        path: 'batchImport',
        component: () => import('@/views/client/batchLead'),
        name: 'batchImport',
        hidden: true,
        meta: { title: '客户标签', noCache: true, tabTitle: '客户管理' }
      },
      {
        path: 'creditsManage',
        component: () => import('@/views/client/creditsManage'),
        name: 'creditsManage',
        meta: { title: '积分管理', noCache: true, tabTitle: '客户管理' }
      },
      {
        path: 'clientLevel',
        component: () => import('@/views/client/clientLevel'),
        name: 'clientLevel',
        meta: { title: '会员等级', noCache: true, tabTitle: '会员权益' }
      },
      {
        path: 'levelInfo',
        component: () => import('@/views/client/levelInfo'),
        name: 'levelInfo',
        hidden: true,
        meta: { title: '会员等级', noCache: true, tabTitle: '会员权益' }
      },
      {
        path: 'cardManage',
        component: () => import('@/views/client/cardManage'),
        name: 'cardManage',
        meta: { title: '会员卡', noCache: true, tabTitle: '会员权益' }
      },
      {
        path: 'createCard',
        component: () => import('@/views/client/createCard'),
        name: 'createCard',
        hidden: true,
        meta: { title: '会员卡', noCache: true, tabTitle: '会员权益' }
      }
    ]
	}
]