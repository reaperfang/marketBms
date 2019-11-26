import Layout from '@/components/layout/Layout'

export default [
    {
        path: '/intelligentOperation',
        component: Layout,
        name: 'intelligentOperation',
        meta: {
            title: '运营',
            icon: 'icon_opera',
            activeIcon:'icon_operas',
            navType:1
        },
        children: [
            {
                path: 'perPrice',
                component: () => import('@/views/intelligentOperation/perPrice'),
                name: 'perPrice',
                meta: { title: '客单价', noCache: true, tabTitle: '智能运营', navType:2 }
            },
            {
                path: 'memberInfo',
                component: () => import('@/views/intelligentOperation/memberInfo'),
                name: 'memberInfo',
                meta: { title: '客户信息', noCache: true, tabTitle: '会员分析', navType:2  }
            },
            {
                path: 'channel',
                component: () => import('@/views/intelligentOperation/channel'),
                name: 'channel',
                meta: { title: '渠道转化', noCache: true, tabTitle: '会员分析' , navType:2 },
            },
            {
                path: 'channelDetail',
                component: () => import('@/views/intelligentOperation/channelDetail'),
                name: 'channelDetail',
                meta: { title: '渠道转化详情', noCache: true, tabTitle: '会员分析', navType:2  },
                hidden: true
            },
            {
                path: 'integral',
                component: () => import('@/views/intelligentOperation/integral'),
                name: 'integral',
                meta: { title: '积分消耗', noCache: true, tabTitle: '会员分析', navType:2  }
            },
            {
                path: 'evaluate',
                component: () => import('@/views/intelligentOperation/evaluate'),
                name: 'evaluate',
                meta: { title: '评价', noCache: true, tabTitle: '口碑分析', navType:2  }
            },
            {
                path: 'rightsProtection',
                component: () => import('@/views/intelligentOperation/rightsProtection'),
                name: 'rightsProtection',
                meta: { title: '维权', noCache: true, tabTitle: '口碑分析', navType:2  }
            },

        ]
    }
]