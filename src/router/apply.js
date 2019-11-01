import Layout from '@/components/layout/Layout'

export default [
  {
	path: '/apply',
    component: Layout,
    name: 'apply',
    meta: {
      title: '应用',
      icon: 'icon_apply',
      activeIcon:'icon_applys'
    },
    iframe: true,
    children: [
      {
        path: '',
        component: () => import('@/views/apply/index'),
        name: 'index',
        meta: { title: '应用', noCache: true },
      },
    ]
  }
]