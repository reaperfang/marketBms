import Layout from "@/components/layout/Layout";

export default [
	{
		path: "/shop",
		component: Layout,
		redirect: {
			name: "index"
		},
		name: "shopManage",
		meta: {
			roles: ["shop"],
			title: "店铺",
			icon: "icon_shop",
			activeIcon:'icon_shops',
			navType:1
		},
		children: [
			{
				path: "index",
				component: () => import("@/views/shop/shopManage/index"),
				name: "index",
				meta: { title: "店铺", noCache: true}
			},
			{
				path: "m_shopNavIndex",
				component: () => import("@/views/shop/mobileShop/wxShop/shopNavIndex"),
				name: "m_shopNavIndex",
				meta: { title: "店铺导航", noCache: true, tabTitle: '移动店铺',navType:2},
				hidden:true
			},
			

			//移动装修模板相关
			{
				path: "pageManageIndex",
				component: () => import("@/views/shop/shopManage/pageManage/pageManageIndex"),
				name: "pageManageIndex",
				meta: { title: "页面管理", noCache: true }
			},
			{
				path: "shopEditor",
				component: () => import("@/views/shop/shopManage/pageManage/shopEditor"),
				name: "shopEditor",
				meta: { title: "店铺装修编辑器", noCache: true },
				hidden: true
			},
			{
				path: "m_pageManageIndex",
				component: () => import("@/views/shop/mobileDecorate/pages/pageManageIndex"),
				name: "m_pageManageIndex",
				meta: { title: "创意设计", noCache: true, tabTitle: '移动装修',navType:2 }
			},
			{
				path: "templateManageIndex",
				component: () => import("@/views/shop/shopManage/template/templateManageIndex"),
				name: "templateManageIndex",
				meta: { title: "页面模板", noCache: true }
			},
			{
				path: "templateEdit",
				component: () => import("@/views/shop/shopManage/template/templateEdit"),
				name: "templateEdit",
				meta: { title: "模板多页面装修", noCache: true },
				hidden: true
			},
			{
				path: "ADManageIndex",
				component: () => import("@/views/shop/shopManage/startingAD/ADManageIndex"),
				name: "ADManageIndex",
				meta: { title: "启动广告", noCache: true }
			},
			{
				path: "createAD",
				component: () => import("@/views/shop/shopManage/startingAD/createAD"),
				name: "createAD",
				meta: { title: "创建广告", noCache: true },
				hidden: true
			},
			{
				path: "shopNav",
				component: () => import("@/views/shop/shopManage/shopNav/shopNavIndex"),
				name: "shopNav",
				meta: { title: "店铺导航", noCache: true }
			},
			{
				path: "shopStyle",
				component: () => import("@/views/shop/shopManage/shopStyle"),
				name: "shopStyle",
				meta: { title: "店铺风格", noCache: true }
			},
			{
				path: "fileManageIndex",
				component: () => import("@/views/shop/shopManage/myFile/fileManageIndex"),
				name: "fileManageIndex",
				meta: { title: "我的文件", noCache: true }
			},
			{
				path: "generalArticle",
				component: () => import("@/views/shop/shopManage/myFile/generalArticle"),
				name: "generalArticle",
				meta: { title: "创建图文素材", noCache: true },
				hidden: true
			},				

			//PC模板管理相关
			{
				path: "p_templateManageIndex",
				component: () => import("@/views/shop/PCshop/template/templateManageIndex"),
				name: "p_templateManageIndex",
				meta: { title: "页面模板", noCache: true, tabTitle: 'PC店铺',navType:2 }
			},

			//PC栏目内容相关
			{
				path: "p_columnIndex",
				component: () => import("@/views/shop/PCshop/column/columnIndex"),
				name: "p_columnIndex",
				meta: { title: "栏目内容", noCache: true, tabTitle: 'PC店铺',navType:2 }
			},
			{
				path: "1picText",
				component: () => import("@/views/shop/PCshop/column/1picText"),
				name: "1picText",
				meta: { title: "图文广告", noCache: true, tabTitle: 'PC店铺',navType:2 },
				hidden: true
			},
			{
				path: "2goodsSet",
				component: () => import("@/views/shop/PCshop/column/2goodsSet"),
				name: "2goodsSet",
				meta: { title: "商品橱窗", noCache: true, tabTitle: 'PC店铺',navType:2 },
				hidden: true
			},
			{
				path: "3picText",
				component: () => import("@/views/shop/PCshop/column/3picText"),
				name: "3picText",
				meta: { title: "图文广告", noCache: true, tabTitle: 'PC店铺',navType:2 },
				hidden: true
			},
			{
				path: "4goodsSet",
				component: () => import("@/views/shop/PCshop/column/4goodsSet"),
				name: "4goodsSet",
				meta: { title: "商品橱窗", noCache: true, tabTitle: 'PC店铺',navType:2 },
				hidden: true
			},
			{
				path: "5picText",
				component: () => import("@/views/shop/PCshop/column/5picText"),
				name: "5picText",
				meta: { title: "图文广告", noCache: true, tabTitle: 'PC店铺',navType:2 },
				hidden: true
			},
			{
				path: "6infoSet",
				component: () => import("@/views/shop/PCshop/column/6infoSet"),
				name: "6infoSet",
				meta: { title: "资讯设置", noCache: true, tabTitle: 'PC店铺',navType:2 },
				hidden: true
			},

			//PC协议编辑相关
			{
				path: "p_protocolEdit",
				component: () => import("@/views/shop/PCshop/protocolEdit"),
				name: "p_protocolEdit",
				meta: { title: "注册协议", noCache: true, tabTitle: 'PC店铺',navType:2 }
			},

			//PC绑定域名相关
			// {
			// 	path: "p_bindDomain",
			// 	component: () => import("@/views/shop/PCshop/bindDomain"),
			// 	name: "p_bindDomain",
			// 	meta: { title: "绑定域名", noCache: true, tabTitle: 'PC店铺',navType:2 }
			// },

			//PC资讯管理相关
			{
				path: "p_infoManageIndex",
				component: () => import("@/views/shop/infoManage/infoManageIndex"),
				name: "p_infoManageIndex",
				meta: { title: "资讯", noCache: true, tabTitle: '资讯管理',navType:2 }
			},
			{
				path: "p_createInfo",
				component: () => import("@/views/shop/infoManage/createInfo"),
				name: "p_createInfo",
				meta: { title: "新建资讯", noCache: true, tabTitle: '资讯管理',navType:2 },
				hidden: true
			},
			{
				path: "p_previewInfo",
				component: () => import("@/views/shop/infoManage/previewInfo"),
				name: "p_previewInfo",
				meta: { title: "查看资讯", noCache: true, tabTitle: '资讯管理',navType:2 },
				hidden: true
			},
		]
	}
];
