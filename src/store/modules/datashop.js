const datashop = {
	state: {
		amount: []
	},
	mutations: {
		MODIFY_AMOUNT: (state, data) => {
			state.amount = data;
		}
	},
	actions: {
		modifyAmount({ commit }, data) {
			commit("MODIFY_AMOUNT", data);
		}
	}
};

export default datashop;
