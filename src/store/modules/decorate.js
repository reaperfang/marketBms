
const decorate = {
	state: {
		currentComponentId: "",  //当前组件id
		basePropertyId: '',  //基础属性组件id
		baseInfo: {},  //店铺装修页面基础信息
		componentDataIds: [],  //组件列表id序列
		componentDataMap: {}   //组件数据集合映射
	},
	mutations: {

		/* 设置当前组件id */
		setCurrentComponentId: (state, id) => {
			state.currentComponentId = id;
		},

		/* 设置基础属性组件id */
		setBasePropertyId: (state, id) => {
			state.basePropertyId = id;
		},


		/* 删除组件 */
		deleteComponent(state, id) {
			//删除数据列表中对应项
			const tempComponentDataMap = { ...state.componentDataMap };
			delete tempComponentDataMap[id];
			state.componentDataMap = tempComponentDataMap;

			//删除顺序列表中对应项
			const index = state.componentDataIds.indexOf(id);
			const prevId = state.componentDataIds[index - 1];
			const nextId = state.componentDataIds[index + 1];
			if (nextId) {
				this.commit("setCurrentComponentId", nextId);
			} else if (prevId) {
				this.commit("setCurrentComponentId", prevId);
			} else {
				// 当前组件为基础组件
				this.commit("setCurrentComponentId", state.basePropertyId);
			}
			state.componentDataIds.splice(index, 1);

		},


		/* 添加组件 */
		addComponent: (state, component) => {

			// 添加组件id到ids顺序表
			state.componentDataIds.push(component.id);

			// 添加组件数据到数据映射表
			state.componentDataMap[component.id] = Object.assign(component, {data: null});

			// 设置当前组件id
			state.currentComponentId = component.id;

		},


		/* 更新组件数据 */
		updateComponent(state, params) {
			//对基础信息组件特殊处理
			if (params.id === state.basePropertyId) {
				state.baseInfo = params.data;
			}
			//对列表组件处理(一定要深拷贝，否则会出现同类型组件数据污染现象)
			const tempComponentDataMap = { ...state.componentDataMap };
			const componentData = tempComponentDataMap[params.id];
			if (componentData) {
				const newComponentData = {...componentData};
				delete tempComponentDataMap[params.id];
				newComponentData['data'] = {...params.data};
				tempComponentDataMap[params.id] = newComponentData;
				state.componentDataMap = tempComponentDataMap;
			}
		},

		//设置基本信息
		setBaseInfo(state, baseInfo) {
			state.baseInfo = baseInfo;
		},

		//外部设置ids顺序表
		setComponentDataIds(state, ids) {
			state.componentDataIds = ids;
		},

		//外部设置数据map列表
		setComponentDataMap(state, componentDataMap) {
			state.componentDataMap = componentDataMap;
		},

		//清除所有装修数据
		clearAllData(state) {
			state.baseInfo = {};
			state.componentDataIds = [];
			state.componentDataMap = {};
		}
	},
	actions: {}
};

export default decorate;
