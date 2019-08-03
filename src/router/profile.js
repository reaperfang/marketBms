import Layout from '@/components/layout/Layout'

export default [
  {
	path: '/profile',
    component: Layout,
    name: 'profile',
    meta: {
      title: '概况',
      icon: 'icon_profile'
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/profile/profile'),
        name: 'profile',
        meta: { title: '概况首页', noCache: true, tabTitle: '概况' }
      },
      {
        path: 'upgrade',
        component: () => import('@/views/profile/upgrade'),
        name: 'upgrade',
        meta: { title: '套餐升级', noCache: true, tabTitle: '概况' }
      },
      {
        path: 'accountInfo',
        component: () => import('@/views/profile/accountInfo'),
        name: 'accountInfo',
        meta: { title: '账号信息', noCache: true, tabTitle: '概况' }
      },
      {
        path: 'passwordChange',
        component: () => import('@/views/profile/passwordChange'),
        name: 'passwordChange',
        meta: { title: '修改密码', noCache: true, tabTitle: '概况' }
      }
    ]
	}
]