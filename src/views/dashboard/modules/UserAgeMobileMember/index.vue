<template>
	<div class="grid-content flex-column">
		<el-row type="flex" justify="space-between" class="item-four-section">
			<el-col :span="12">
				<vitem
					:title="'用户渠道分布'"
					:chartData="userData.chartData"
					:total="userData.total"
					:icon="'0'"
					:barColor="barColorUser"
				></vitem>
			</el-col>
			<el-col :span="12">
				<vitem
					:title="'渠道会员转化'"
					:chartData="memberData.chartData"
					:total="memberData.total"
					:icon="'1'"
					:barColor="barColorUser"
				></vitem>
			</el-col>
		</el-row>
		<el-row type="flex" justify="space-between" class="item-four-section">
			<el-col :span="12">
				<vitem
					:title="'性别年龄分布'"
					:chartData="sexageData.ageData"
					:sexData="sexageData.sexData"
					:icon="'2'"
					:barColor="barColorSexAge"
				></vitem>
			</el-col>
			<el-col :span="12">
				<pchart
					:title="'绑定手机号'"
					:progress="phoneData.progress"
					:city="phoneData.city"
					:barColor="phoneData.barColor"
				></pchart>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import gridtitle from "../../components/title/index";
import vitem from "./item";
import pchart from "./mobile/item"; //v-chart
import { mapGetters, mapActions, mapState } from "vuex";
import { toDecimal } from "@/utils/util";

export default {
	watch: {
		"dashboard.member"(val) {
			this.setMember(val);
		},
		"dashboard.user"(val) {
			this.setUser(val);
		},
		"dashboard.sexage"(val) {
			this.setSexage(val);
		},
		"dashboard.phone"(val) {
			this.setPhone(val);
		}
	},
	props: {
		// data: {
		//   type: Object,
		//   default: false
		// }
	},
	components: { gridtitle, vitem, pchart },
	data: function() {
		return {
			cid: this.$store.getters.shopInfos.id,
			chartData: {
				columns: ["日期", "访问用户"],
				rows: [
					{ 日期: "1/1", 访问用户: 1393 },
					{ 日期: "1/2", 访问用户: 3530 },
					{ 日期: "1/3", 访问用户: 2923 },
					{ 日期: "1/4", 访问用户: 1723 },
					{ 日期: "1/5", 访问用户: 3792 },
					{ 日期: "1/6", 访问用户: 4593 }
				]
			},
			mobile: { progress: 75, barColor: "#06C9DD", city: "绑定手机号" },

			memberData: {},
			userData: {},
			sexageData: {},
			phoneData: {},
			barColorUser: ["#026DFF", "#F59F00"],
			// barColorSexAge: ["#6D7896", "#026DFFF", "#06C9DD", "#FFF5C31"]
			barColorSexAge: ["#6D7986", "#026DFF", "#06C9DD", "#FF5C31"]
		};
	},
	computed: {
		...mapState(["dashboard"])
	},
	mounted() {
		this.init();
	},
	beforeCreate() {},
	created() {},
	beforeMount() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	destroyed: function() {},
	methods: {
		...mapActions(["memberlist", "userlist", "sexagelist", "phonelist"]),
		async init() {
			let parames = { ...this.invokeType, cid: this.cid };

			let resMember = await this._apis.dashboard.member(parames);
			this.memberlist(JSON.parse(resMember));
			let resUserDis = await this._apis.dashboard.userdistributed(
				parames
			);
			this.userlist(JSON.parse(resUserDis));
			let resSexAage = await this._apis.dashboard.sexage(parames);
			this.sexagelist(JSON.parse(resSexAage));

			let resPhone = await this._apis.dashboard.statistics(parames);
			this.phonelist(JSON.parse(resPhone));
		},
		setMember(val) {
			let result = {
				columns: ["类别", "用户数量"],
				rows: [
					{ 类别: "公众号", 用户数量: val.member_channel_gzh },
					{ 类别: "小程序", 用户数量: val.member_channel_xcx }
				]
			};

			this.memberData = {
				chartData: result,
				total: val.member
			};
		},
		setUser(val) {
			let result = {
				columns: ["类别", "用户数量"],
				rows: [
					{ 类别: "公众号", 用户数量: val.c_uv_channel_gzh },
					{ 类别: "小程序", 用户数量: val.c_uv_channel_xcx }
				]
			};

			this.userData = {
				chartData: result,
				total: val.c_uv
			};
		},
		setSexage(val) {
			// let result = {
			// 	columns: ["类别", "数量"],
			// 	rows: [
			// 		{ 类别: "未知", 数量: val.c_uv_age_0 },
			// 		{ 类别: "< 25", 数量: val.c_uv_age_25 },
			// 		{ 类别: "25-50", 数量: val.c_uv_age_25_50 },
			// 		{ 类别: "> 50 ", 数量: val.c_uv_age_50 }
			// 	]
			// };

			let result = {
				columns: ["类别", "数量"],
				rows: [
					{ 类别: "未知", 数量: val.c_uv_age_0 },
					{ 类别: "< 25岁", 数量: val.c_uv_age_25 },
					{ 类别: "25-50岁", 数量: val.c_uv_age_25_50 },
					{ 类别: "> 50岁 ", 数量: val.c_uv_age_50 }
				]
			};

			let rows = result.rows;

			result = {
				...result,
				rows: rows.filter(item => {
					return item["数量"] > 0;
				})
			};

			if (result.rows.length == 0) {
				result = {
					...result,
					rows: [
						{ 类别: "未知", 数量: 0 },
						{ 类别: "< 25", 数量: 0 },
						{ 类别: "25-50", 数量: 0 },
						{ 类别: "> 50 ", 数量: 0 }
					]
				};
			}

			this.sexageData = {
				ageData: result,
				// sexData: {
				// 	female:
				// 		val.c_uv_share_sex_female == -9999
				// 			? "0.00"
				// 			: (val.c_uv_share_sex_female * 100).toFixed(2), //c_uv_sex_female
				// 	gender:
				// 		val.c_uv_share_sex_gender == -9999
				// 			? "0.00"
				// 			: (val.c_uv_share_sex_gender * 100).toFixed(2)
				// }
				sexData: {
					female:
						val.c_uv_share_sex_female == -9999
							? "0.00"
							: toDecimal(val.c_uv_share_sex_female * 100), //c_uv_sex_female
					gender:
						val.c_uv_share_sex_gender == -9999
							? "0.00"
							: toDecimal(val.c_uv_share_sex_gender * 100)
				}
			};
		},
		setPhone(val) {
			let result =
				val.c_uv_share_phone == -9999 ? 0 : val.c_uv_share_phone;
			this.phoneData = {
				...this.mobile,
				// progress: parseInt(parseFloat(result) * 100)
				progress: (result * 100).toFixed(2)
			};
		}
	}
};
</script>
