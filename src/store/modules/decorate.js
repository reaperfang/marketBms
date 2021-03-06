import Vue from 'vue'
import utils from '@/utils'
const decorate = {
	state: {
		currentComponentId: "",  //当前组件id
		basePropertyId: '',  //基础属性组件id
		baseInfo: {},  //店铺装修页面基础信息
		componentDataIds: [],  //组件列表id序列
		componentDataMap: {},   //组件数据集合映射
		decorateEvents: [],   //事件列表
		checkErrorId: null //最终保存时检测到组件错误时设置id，方便右侧编辑区触发显示错误提示
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
		addComponent: (state, params) => {

			let compTypeCount = 0;
			for(let k in state.componentDataMap) {
				if(state.componentDataMap[k].type === params.component.type) {
					compTypeCount++;
				}
			}
			if(!params.component.hidden && params.component.limit && compTypeCount >= params.component.limit) {
				console.warn(`最多只能添加${params.component.limit}个${params.component.title}组件！`);
				Vue.prototype.confirm({title: '提示', icon: false, iconWarning: true, text: `当前页已添加过${params.component.title}组件，不能再次添加`, showCancelButton: false, confirmText: '我知道了'}).then(() => {

                })
				return;
			}

			if(params.targetId) {
				let index = state.componentDataIds.indexOf(params.targetId);
				if(index < 0) {
					// 添加组件id到ids顺序表
					state.componentDataIds.push(params.component.id);
				}else {
					if(params.after) {
						index++;
					}
					state.componentDataIds.splice(index, 0, params.component.id)
				}
			}else {
				// 添加组件id到ids顺序表
				state.componentDataIds.push(params.component.id);
			}

			// 添加组件数据到数据映射表
			state.componentDataMap[params.component.id] = Object.assign(params.component, {data: null});

			// 设置当前组件id
			state.currentComponentId = params.component.id;

		},


		/* 更新组件数据 */
		updateComponent(state, params) {
			//对基础信息组件特殊处理
			if (params.id === state.basePropertyId) {
				state.baseInfo = params.data;
			}
			//对列表组件处理(一定要深拷贝，否则会出现同类型组件数据污染现象)
			const tempComponentDataMap = utils.deepClone(state.componentDataMap);
			const componentData = tempComponentDataMap[params.id];
			if (componentData) {
				const newComponentData = utils.deepClone(componentData);
				delete tempComponentDataMap[params.id];
				newComponentData['data'] = utils.deepClone(params.data);
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
		clearEditor(state) {
			state.baseInfo = {};
			state.componentDataIds = [];
			state.componentDataMap = {};
		},

		/* 添加事件 */
		addEvent(state, componentType) {
			if(!state.decorateEvents.includes(componentType)) {
				state.decorateEvents.push(componentType);
			}
		},

		/* 移除事件 */
		removeEvent(state, componentType) {
			let index = state.decorateEvents.indexOf(componentType);
			let events = [...state.decorateEvents];
			decorateEvents.splice(index, 1);
			state.decorateEvents = events;
		},

		/* 最终保存时检测到组件错误时设置id，方便右侧编辑区触发显示错误提示 */
		setCheckErrorId: (state, id) => {
			state.checkErrorId = id;
		},
	},
	actions: {}
};

export default decorate;
