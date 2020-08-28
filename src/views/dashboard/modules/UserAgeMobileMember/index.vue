<template>
	<div class="grid-content flex-column">
		<el-row type="flex" justify="space-between" class="item-four-section">
			<el-col :span="12">
				<vitem
					:title="'用户渠道分别'"
					:chartData="chartData"
					:icon="'0'"
				></vitem>
			</el-col>
			<el-col :span="12">
				<vitem
					:title="'渠道会员转换'"
					:chartData="memberData.chartData"
					:total="memberData.total"
					:icon="'1'"
				></vitem>
			</el-col>
		</el-row>
		<el-row type="flex" justify="space-between" class="item-four-section">
			<el-col :span="12">
				<vitem
					:title="'性别年龄分布'"
					:chartData="chartData"
					:icon="'2'"
				></vitem>
			</el-col>
			<el-col :span="12">
				<!-- <vitem :title="'绑定手机号'" :chartData="chartData" :icon="'3'"></vitem> -->
				<pchart
					:title="'绑定手机号'"
					:progress="mobile.progress"
					:city="mobile.city"
					:barColor="mobile.barColor"
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

export default {
	watch: {
		"dashboard.member"(val) {
			this.setMember(val);
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
			cid: JSON.parse(localStorage.getItem("shopInfos")).id,
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

			memberData: {}
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
		...mapActions(["memberlist"]),
		init() {
			this._apis.dashboard.member({ cid: this.cid }).then(res => {
				console.log("member", res);
				this.memberlist(res);
				//this.hobbylist(res);
			});
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
		}
	}
};
</script>
