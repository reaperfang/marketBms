import Cookies from "js-cookie";

const dashboard = {
	state: {
		hobby:[],
		member:{}
	},
	mutations: {
		HOBBY_LIST: (state, data) => {
			state.hobby = data;
		},
		MEMBER_LIST: (state, data) => {
			state.member = data;
		}
	},
	actions: {
		hobbylist({ commit },data) {
			commit("HOBBY_LIST",data);
		},
		memberlist({ commit },data) {
			commit("MEMBER_LIST",data);
		}
	}
};

export default dashboard;
