import Layout from '@/components/layout/Layout'

export default [
  {
	path: '/profile',
    component: Layout,
    name: 'profile',
    iframe: true,
    meta: {
      title: '概况',
      icon: 'icon_profile',
      activeIcon:'icon_profiles',
      navType:1
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/profile/profile'),
        name: 'profile',
        meta: { title: '概况首页', noCache: true, tabTitle: '概况',navType:2 }
      },
      {
        path: 'guidePrompt',
        component: () => import('@/views/profile/guidePrompt'),
        name: 'guidePrompt',
        hidden: false,
        meta: { title: '开店引导入口', noCache: true, tabTitle: '开店引导',navType:2 }
      },
      {
        path: 'upgrade',
        component: () => import('@/views/profile/upgrade'),
        name: 'upgrade',
        hidden: false,
        meta: { title: '套餐升级', noCache: true, tabTitle: '概况',navType:2 }
      },
      {
        path: 'accountInfo',
        component: () => import('@/views/profile/accountInfo'),
        name: 'accountInfo',
        hidden: false,
        meta: { title: '账号信息', noCache: true, tabTitle: '概况',navType:2 }
      },
      {
        path: 'passwordChange',
        component: () => import('@/views/profile/passwordChange'),
        name: 'passwordChange',
        hidden: false,
        meta: { title: '修改密码', noCache: true, tabTitle: '概况',navType:2 }
      },
      {
        path: 'intelligent',
        component: () => import('@/views/profile/intelligent'),
        name: 'intelligent',
        hidden: false,
        meta: {title: '智能开店', noCache: true, tabTitle: '概况', navType: 2}
      },
      {
        path: 'intelligentGuide',
        component: () => import('@/views/profile/intelligentGuide'),
        name: 'intelligentGuide',
        hidden: false,
        meta: {title: '智能开店引导', noCache: true, tabTitle: '概况', navType: 2}
      },
      {
        path: 'shopGuide',
        component: () => import('@/views/profile/shopGuide'),
        name: 'shopGuide',
        hidden: false,
        meta: { title: '开店引导', noCache: true, tabTitle: '开店引导',navType:2 }
      }
    ]
	}
]
