

const dashboard = {
	state: {
		hobby:[],
		member:{},
		user:{},
		sexage:{},
		phone:{},
		top3:[],
		transation:{},
		mailvistor:{},
		paymail:{},
		order:{},
		amount:{}
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
		},
		SETTOP_LIST:(state,data)=>{
			state.top3=data;
		},
		MAILVISTOR_LIST:(state,data)=>{
			state.mailvistor=data;
		},
		SETTRA_LIST:(state,data)=>{
			state.transation={
				...state.transation,
				...data
			};
		},
		PAYMAIL_LIST:(state,data)=>{
			state.paymail={
				...state.paymail,
				...data
			};
		},
		ORDER_LIST:(state,data)=>{
			state.order=data;
		},
		AMOUNT_LIST: (state, data) => {
			state.amount = data;
		},
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
		},
		toplist({ commit },data) {
			commit("SETTOP_LIST",data);
		},
		trasationlist({ commit },data) {
			commit("SETTRA_LIST",data);
		},
		maivistorlist({ commit },data) {
			commit("MAILVISTOR_LIST",data);
		},
		paymaillist({ commit },data) {
			commit("PAYMAIL_LIST",data);
		},
		orderlist({ commit },data) {
			commit("ORDER_LIST",data);
		},
		amoountlist({ commit },data) {
			commit("AMOUNT_LIST",data);
		}
	}
};

export default dashboard;
