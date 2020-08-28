

const dashboard = {
	state: {
		hobby:[],
		member:{},
		user:{}
	},
	mutations: {
		HOBBY_LIST: (state, data) => {
			state.hobby = data;
		},
		MEMBER_LIST: (state, data) => {
			state.member = data;
		},
		USER_LIST: (state, data) => {
			state.user = data;
		}
	},
	actions: {
		hobbylist({ commit },data) {
			commit("HOBBY_LIST",data);
		},
		memberlist({ commit },data) {
			commit("MEMBER_LIST",data);
		},
		userlist({ commit },data) {
			commit("USER_LIST",data);
		}
	}
};

export default dashboard;
