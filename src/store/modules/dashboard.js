import Cookies from "js-cookie";

const dashboard = {
	state: {
		hobby:[]
	},
	mutations: {
		HOBBY_LIST: (state, data) => {
			state.hobby = data;
		}
	},
	actions: {
		hobbylist({ commit },data) {
			commit("HOBBY_LIST",data);
		}
	}
};

export default dashboard;
