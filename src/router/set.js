import Layout from '@/components/layout/Layout'

export default [
    {
        path: '/set',
        component: Layout,
        name: 'set',
        meta: {
            title: '设置',
            icon: 'icon_set',
            activeIcon:'icon_sets',
            navType:1
        },
        children: [
            {
                path: 'shopInfo',
                component: () => import('@/views/set/shopInfo'),
                name: 'shopInfo',
                meta: { title: '店铺信息', noCache: true, tabTitle: '通用设置' , navType:2 }
            },
            {
                path: 'messageSet',
                component: () => import('@/views/set/messageSet'),
                name: 'messageSet',
                meta: { title: '消息设置', noCache: true, tabTitle: '通用设置' , navType:2 }
            },
            {
                path: 'tradeSet',
                component: () => import('@/views/set/tradeSet'),
                name: 'tradeSet',
                meta: { title: '交易设置', noCache: true, tabTitle: '通用设置' , navType:2 }
            },
            {
                path: 'memberSet',
                component: () => import('@/views/set/memberSet'),
                name: 'memberSet',
                meta: { title: '会员设置', noCache: true, tabTitle: '通用设置' , navType:2 }
            },
            {
                path: 'payType',
                component: () => import('@/views/set/payType'),
                name: 'payType',
                meta: { title: '支付方式', noCache: true, tabTitle: '资产设置', navType:2  }
            },
            {
                path: 'wxSet',
                component: () => import('@/views/set/wxSet'),
                name: 'wxSet',
                meta: { title: '设置支付信息', noCache: true, tabTitle: '资产设置' , navType:4},
                hidden: true
            },
            {
                path: 'withdrawSet',
                component: () => import('@/views/set/withdrawSet'),
                name: 'withdrawSet',
                meta: { title: '提现设置', noCache: true, tabTitle: '资产设置', navType:2  }
            },
            // {
            //     path: 'shopManages',
            //     component: () => import('@/views/set/shopManage'),
            //     name: 'shopManages',
            //     meta: { title: '店铺管理', noCache: true, tabTitle: '权限管理' }
            // },
            // {
            //     path: 'shopDistribute',
            //     component: () => import('@/views/set/shopDistribute'),
            //     name: 'shopDistribute',
            //     meta: { title: '店铺分配', noCache: true, tabTitle: '权限管理' },
            //     hidden:true
            // },
            {
                path: 'subaccountManage',
                component: () => import('@/views/set/subaccountManage'),
                name: 'subaccountManage',
                meta: { title: '子账号管理', noCache: true, tabTitle: '权限管理', navType:2  }
            },
            {
                path: 'createAccount',
                component: () => import('@/views/set/createAccount'),
                name: 'createAccount',
                meta: { title: '默认页面', noCache: true, tabTitle: '权限管理', navType:3 },
                hidden: true
            },
            {
                path: 'roleManage',
                component: () => import('@/views/set/roleManage'),
                name: 'roleManage',
                meta: { title: '角色管理', noCache: true, tabTitle: '权限管理', navType:2  }
            },
            {
                path: 'createRole',
                component: () => import('@/views/set/createRole'),
                name: 'createRole',
                meta: { title: '默认页面', noCache: true, tabTitle: '权限管理', navType:3  },
                hidden: true
            }
        ]
    }
]