

const dashboard = {
	state: {
		hobby:[],
		member:{},
		user:{},
		sexage:{},
	    phone:{}
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
		},
		SEXAGE_LIST: (state, data) => {
			state.sexage = data;
		},
		SETPHONE_LIST:(state,data)=>{
			state.phone=data;
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
		},
		sexagelist({ commit },data) {
			commit("SEXAGE_LIST",data);
		},
		phonelist({ commit },data) {
			commit("SETPHONE_LIST",data);
		}
	}
};

export default dashboard;
