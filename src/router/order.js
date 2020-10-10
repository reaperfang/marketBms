import Layout from '@/components/layout/Layout'

export default [
  {
    path: '/order',
    component: Layout,
    name: 'order',
    meta: {
      title: '订单',
      icon: 'icon_order',
      activeIcon:'icon_orders',
      navType:1
    },
    children: [
      {
        path: 'query',
        component: () => import('@/views/order/query'),
        name: 'query',
        meta: { title: '订单查询', noCache: true, tabTitle: '订单管理',navType:2 },
      },
      {
        path: 'orderDetail',
        component: () => import('@/views/order/orderDetail'),
        name: 'orderDetail',
        hidden: true,
        meta: { title: '查看详情', noCache: true, tabTitle: '订单管理',navType:5 },
      },
      {
        path: 'deliverGoods',
        component: () => import('@/views/order/deliverGoods'),
        name: 'deliverGoods',
        hidden: true,
        meta: { title: '发货', noCache: true, tabTitle: '订单管理' ,navType:5},
      },
      {
        path: 'richLogistics',
        component: () => import('@/views/order/richLogistics'),
        name: 'richLogistics',
        hidden: true,
        meta: { title: '自动发货', noCache: true, tabTitle: '订单管理' ,navType:5},
      },
      {
        path: 'deliveryManagement',
        component: () => import('@/views/order/deliveryManagement'),
        name: 'deliveryManagement',
        meta: { title: '发货管理', noCache: true, tabTitle: '订单处理' ,navType:2, anotherAuth: true},
      },
      {
        path: 'afterSalesManagement',
        component: () => import('@/views/order/afterSalesManagement'),
        name: 'afterSalesManagement',
        meta: { title: '售后管理', noCache: true, tabTitle: '订单处理',navType:2 },
      },
      {
        path: 'afterSalesDetails',
        component: () => import('@/views/order/afterSalesDetails'),
        name: 'afterSalesDetails',
        hidden: true,
        meta: { title: '售后详情', noCache: true, tabTitle: '订单处理' ,navType:2},
      },
      {
        path: 'printDistributionSheet',
        component: () => import('@/views/order/printDistributionSheet'),
        name: 'printDistributionSheet',
        hidden: true,
        meta: { title: '查看物流', noCache: true, tabTitle: '订单处理' ,navType:5},
      },
		{
			path: 'printerSeting',
			component: () => import('@/views/order/printerSeting'),
			name: 'printerSeting',
			hidden: true,
			meta: { title: '打印机设置', noCache: true, tabTitle: '订单处理' ,navType:5},
    },
    {
			path: 'yilianyunCheck',
			component: () => import('@/views/order/yilianyunCheck'),
			name: 'yilianyunCheck',
			hidden: true,
			meta: { title: '易联云授权确认', noCache: true, tabTitle: '订单处理' ,navType:5},
		},
      {
        path: 'reviews',
        component: () => import('@/views/order/reviews'),
        name: 'reviews',
        meta: { title: '评价管理', noCache: true, tabTitle: '订单处理' ,navType:2},
      },
      {
        path: 'reviewsDetail',
        component: () => import('@/views/order/reviewsDetail'),
        name: 'reviewsDetail',
        hidden: true,
        meta: { title: '查看', noCache: true, tabTitle: '订单处理',navType:4 },
      },
      {
        path: 'sensitiveWords',
        component: () => import('@/views/order/sensitiveWords'),
        name: 'sensitiveWords',
        hidden: true,
        meta: { title: '敏感词设置', noCache: true, tabTitle: '订单处理',navType:5 },
      },
      {
        path: 'batchImportAndDelivery',
        component: () => import('@/views/order/batchImportAndDelivery'),
        name: 'batchImportAndDelivery',
        hidden: true,
        meta: { title: '批量导入发货', noCache: true, tabTitle: '订单处理', navType:5 },
      },
      {
        path: 'printingElectronicForm',
        component: () => import('@/views/order/printingElectronicForm'),
        name: 'printingElectronicForm',
        hidden: true,
        meta: { title: '批量打印电子面单', noCache: true, tabTitle: '订单处理', navType:5 },
      },
      {
        path: 'bulkDelivery',
        component: () => import('@/views/order/bulkDelivery'),
        name: 'bulkDelivery',
        hidden: true,
        meta: { title: '批量发货', noCache: true, tabTitle: '订单处理' , navType:5},
      },
      {
        path: 'afterSaleBulkDelivery',
        component: () => import('@/views/order/afterSaleBulkDelivery'),
        name: 'afterSaleBulkDelivery',
        hidden: true,
        meta: { title: '批量发货', noCache: true, tabTitle: '订单处理', navType:5 },
      },
      {
        path: 'orderAfterDeliverGoods',
        component: () => import('@/views/order/orderAfterDeliverGoods'),
        name: 'orderAfterDeliverGoods',
        hidden: true,
        meta: { title: '发货', noCache: true, tabTitle: '订单处理' , navType:5},
      },
      {
        path: 'orderBulkDelivery',
        component: () => import('@/views/order/orderBulkDelivery'),
        name: 'orderBulkDelivery',
        hidden: true,
        meta: { title: '批量发货', noCache: true, tabTitle: '订单处理' , navType:5},
      },
      {
        path: 'supplementaryLogistics',
        component: () => import('@/views/order/supplementaryLogistics'),
        name: 'supplementaryLogistics',
        hidden: true,
        meta: { title: '批量补填物流', noCache: true, tabTitle: '订单处理' , navType:5},
      },
      {
        path: 'batchSupplementaryLogistics',
        component: () => import('@/views/order/batchSupplementaryLogistics'),
        name: 'batchSupplementaryLogistics',
        hidden: true,
        meta: { title: '批量补填物流', noCache: true, tabTitle: '订单处理', navType:5 },
      },
      {
        path: 'deliverGoodsSuccess',
        component: () => import('@/views/order/deliverGoodsSuccess'),
        name: 'deliverGoodsSuccess',
        hidden: true,
        meta: { title: '发货成功', noCache: true, tabTitle: '订单处理' , navType:5},
      },
      {
        path: 'printPreview',
        component: () => import('@/views/order/printPreview'),
        name: 'printPreview',
        hidden: true,
        meta: { title: '打印配送单小票', noCache: true, tabTitle: '订单处理' , navType:5},
      },
		{
			path: 'tradeSet',
			component: () => import('@/views/set/tradeSet'),
			name: 'tradeSet',
			meta: { title: '交易设置', noCache: true, tabTitle: '分割线' ,navType:2},
		},
		{
			path: 'ordinaryExpress',
			component: () => import('@/views/set/ordinaryExpress'),
			name: 'ordinaryExpress',
			meta: { title: '普通快递', noCache: true, tabTitle: '配送设置', navType:2  }
		},
		{
			path: 'shopExpress',
			component: () => import('@/views/set/shopExpress'),
			name: 'shopExpress',
			meta: { title: '同城配送', noCache: true, tabTitle: '配送设置', navType:2  }
		},
		{
			path: 'selfLift',
			component: () => import('@/views/set/selfLift'),
			name: 'selfLift',
			meta: { title: '上门自提', noCache: true, tabTitle: '配送设置' ,navType:2},
		},
      // {
      //   path: 'quickDelivery',
      //   component: () => import('@/views/order/quickDelivery'),
      //   name: 'quickDelivery',
      //   meta: { title: '快递发货', noCache: true, tabTitle: '物流配送' ,navType:2},
      // },
      // {
      //   path: 'newTemplate',
      //   component: () => import('@/views/order/newTemplate'),
      //   name: 'newTemplate',
      //   hidden: true,
      //   meta: { title: '新建模板', noCache: true, tabTitle: '物流配送' ,navType:5},
      // },
      // {
      //   path: 'electronicFaceSheet',
      //   component: () => import('@/views/order/electronicFaceSheet'),
      //   name: 'electronicFaceSheet',
      //   hidden: false,
      //   meta: { title: '电子面单', noCache: true, tabTitle: '物流配送' ,navType:2, anotherAuth: true},
      // },
      // {
      //   path: 'newElectronicFaceSheet',
      //   component: () => import('@/views/order/newElectronicFaceSheet'),
      //   name: 'newElectronicFaceSheet',
      //   hidden: true,
      //   meta: { title: '新建', noCache: true, tabTitle: '物流配送' ,navType:5},
      // },
    ]
  }
]
