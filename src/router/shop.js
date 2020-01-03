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

			//移动店铺首页
			{
				path: "m_wxShopIndex",
				component: () => import("@/views/shop/mobileShop/wxShop/wxShopIndex"),
				name: "m_wxShopIndex",
				meta: { title: "微信店铺", noCache: true, tabTitle: '移动店铺',navType:2}
			},

			//移动装修模板相关
			{
				path: "m_templateManageIndex",
				component: () => import("@/views/shop/mobileDecorate/template/templateManageIndex"),
				name: "m_templateManageIndex",
				meta: { title: "模板管理", noCache: true, tabTitle: '移动装修',navType:2 }
			},
			{
				path: "m_templateEdit",
				component: () => import("@/views/shop/mobileDecorate/template/templateEdit"),
				name: "m_templateEdit",
				meta: { title: "模板编辑", noCache: true, tabTitle: '移动装修',navType:2 },
				hidden: true
			},


			//移动装修页面相关
			{
				path: "m_pageManageIndex",
				component: () => import("@/views/shop/mobileDecorate/pages/pageManageIndex"),
				name: "m_pageManageIndex",
				meta: { title: "自定义页面", noCache: true, tabTitle: '移动装修',navType:2 }
			},
			{
				path: "m_classifyEditor",
				component: () => import("@/views/shop/mobileDecorate/pages/classifyEditor"),
				name: "m_classifyEditor",
				meta: { title: "微页面分类编辑", noCache: true, tabTitle: '移动装修',navType:2 },
				hidden: true
			},
			{
				path: "m_decorateClassifyPreview",
				component: () => import("@/views/shop/mobileDecorate/pages/decorateClassifyPreview"),
				name: "m_decorateClassifyPreview",
				meta: { title: "微页面分类预览", noCache: true, tabTitle: '移动装修',navType:2 },
				hidden: true
			},
			{
				path: "m_shopEditor",
				component: () => import("@/views/shop/mobileDecorate/pages/shopEditor"),
				name: "m_shopEditor",
				meta: { title: "微页面编辑", noCache: true, tabTitle: '移动装修',navType:2 },
				hidden: true
			},				
			{
				path: "m_decoratePreview",
				component: () => import("@/views/shop/mobileDecorate/pages/decoratePreview"),
				name: "m_decoratePreview",
				meta: { title: "微页面预览", noCache: true, tabTitle: '移动装修',navType:2 },
				hidden: true
			},		

			//移动启动广告相关
			{
				path: "m_ADManageIndex",
				component: () => import("@/views/shop/mobileDecorate/startingAD/ADManageIndex"),
				name: "m_ADManageIndex",
				meta: { title: "启动广告", noCache: true, tabTitle: '移动装修',navType:2 }
			},
			{
				path: "m_createAD",
				component: () => import("@/views/shop/mobileDecorate/startingAD/createAD"),
				name: "m_createAD",
				meta: { title: "启动广告", noCache: true, tabTitle: '移动装修',navType:2 },
				hidden: true
			},		

			//移动店铺风格相关	
			{
				path: "m_shopStyle",
				component: () => import("@/views/shop/mobileDecorate/shopStyle"),
				name: "m_shopStyle",
				meta: { title: "店铺风格", noCache: true, tabTitle: '移动装修',navType:2 }
			},

			//通用文件素材相关
			{
				path: "fileManageIndex",
				component: () => import("@/views/shop/myFile/fileManageIndex"),
				name: "fileManageIndex",
				meta: { title: "素材管理", noCache: true, tabTitle: '素材管理',navType:2 }
			},
			{
				path: "generalArticle",
				component: () => import("@/views/shop/myFile/generalArticle"),
				name: "generalArticle",
				meta: { title: "图文素材", noCache: true, tabTitle: '素材管理',navType:2 },
				hidden: true
			},				

			//PC模板管理相关
			// {
			// 	path: "p_templateManageIndex",
			// 	component: () => import("@/views/shop/PCshop/template/templateManageIndex"),
			// 	name: "p_templateManageIndex",
			// 	meta: { title: "页面模板", noCache: true, tabTitle: 'PC店铺',navType:2 }
			// },

			// //PC栏目内容相关
			// {
			// 	path: "p_columnIndex",
			// 	component: () => import("@/views/shop/PCshop/column/columnIndex"),
			// 	name: "p_columnIndex",
			// 	meta: { title: "栏目内容", noCache: true, tabTitle: 'PC店铺',navType:2 }
			// },

			// //PC协议编辑相关
			// {
			// 	path: "p_protocolEdit",
			// 	component: () => import("@/views/shop/PCshop/protocolEdit"),
			// 	name: "p_protocolEdit",
			// 	meta: { title: "会员注册协议", noCache: true, tabTitle: 'PC店铺',navType:2 }
			// },

			// //PC绑定域名相关
			// {
			// 	path: "p_bindDomain",
			// 	component: () => import("@/views/shop/PCshop/bindDomain"),
			// 	name: "p_bindDomain",
			// 	meta: { title: "绑定域名", noCache: true, tabTitle: 'PC店铺',navType:2 }
			// },

			// //PC资讯管理相关
			// {
			// 	path: "p_infoManageIndex",
			// 	component: () => import("@/views/shop/infoManage/infoManageIndex"),
			// 	name: "p_infoManageIndex",
			// 	meta: { title: "资讯", noCache: true, tabTitle: '资讯管理',navType:2 }
			// },
			// {
			// 	path: "p_createInfo",
			// 	component: () => import("@/views/shop/infoManage/createInfo"),
			// 	name: "p_createInfo",
			// 	meta: { title: "新建资讯", noCache: true, tabTitle: '资讯管理',navType:2 },
			// 	hidden: true
			// },
			// {
			// 	path: "p_previewInfo",
			// 	component: () => import("@/views/shop/infoManage/previewInfo"),
			// 	name: "p_previewInfo",
			// 	meta: { title: "查看资讯", noCache: true, tabTitle: '资讯管理',navType:2 },
			// 	hidden: true
			// },
		]
	}
];
