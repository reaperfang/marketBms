import Layout from '@/components/layout/Layout'

export default [
  {
		path: '/goods',
    component: Layout,
    name: 'goods',
    meta: {
      title: '商品',
      icon: 'icon_goods',
      activeIcon:'icon_goodss',
      navType:1
    },
    children: [
    	{
        path: 'goodsList',
        component: () => import('@/views/goods/goodsList'),
        name: 'goodsList',
        meta: { title: '商品列表', noCache: true, tabTitle: '商品管理',navType:2 },
      },
      {
        path: 'classify',
        component: () => import('@/views/goods/classify'),
        name: 'classify',
        meta: { title: '商品分类', noCache: true, tabTitle: '商品管理', classify: true ,navType:2},
      },
      {
        path: 'tag',
        component: () => import('@/views/goods/tag'),
        name: 'tag',
        meta: { title: '商品标签', noCache: true, tabTitle: '商品管理' ,navType:2},
      },
      {
        path: 'addGoods',
        component: () => import('@/views/goods/addGoods'),
        name: 'addGoods',
        hidden: true,
        meta: { title: '新建商品', noCache: true, tabTitle: '商品管理' ,navType:2},
      },
      // {
      //   path: 'classify',
      //   component: () => import('@/views/goods/classify'),
      //   name: 'classify',
      //   meta: { title: '商品分类', noCache: true, tabTitle: '分类管理' },
      // },
      // {
      //   path: 'tag',
      //   component: () => import('@/views/goods/tag'),
      //   name: 'tag',
      //   meta: { title: '商品标签', noCache: true, tabTitle: '标签管理' },
      // },
      {
        path: 'import',
        component: () => import('@/views/goods/import'),
        name: 'import',
        meta: { title: '商品导入', noCache: true, tabTitle: '商品工具' ,navType:2},
      },
      {
        path: 'batchPriceChange',
        component: () => import('@/views/goods/batchPriceChange'),
        name: 'batchPriceChange',
        meta: { title: '批量改价', noCache: true, tabTitle: '商品工具' ,navType:2},
      },
    ]
	}
]