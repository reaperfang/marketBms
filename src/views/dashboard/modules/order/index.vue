<template>
	<div class="row-3-grid-content flex-column">
		<el-row type="flex" justify="space-between" class="item-title">
			<el-col :span="24">
				<gridtitle :title="'下单转换漏斗(最近七天)'"></gridtitle>
			</el-col>
		</el-row>
		<el-row class="item-content">
			<vfunnel
				:chartData="chartData"
				:chartSettings="chartSettings"
				:chartExtend="chartExtend"
			></vfunnel>
		</el-row>
	</div>
</template>

<script>
import gridtitle from "../../components/title/index";
import vfunnel from "../../components/v-chart/funnel/index";
import { mapGetters, mapActions, mapState } from "vuex";

export default {
	watch: {
		"dashboard.order"(val) {}
	},
	props: {
		// data: {
		//   type: Object,
		//   default: false
		// }
	},
	components: { vfunnel, gridtitle },
	data: function() {
		return {
			cid: JSON.parse(localStorage.getItem("shopInfos")).id,
			chartData: {
				columns: ["状态", "数值"],
				rows: [
					{ 状态: "展示", 数值: 900 },
					{ 状态: "访问", 数值: 600 },
					{ 状态: "点击", 数值: 300 },
					{ 状态: "订单", 数值: 100 }
				]
			},
			chartSettings: {
				// label: {
				// 	show: true,
				// 	position: "inside"
				// }
			},
			chartExtend: {}
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
		...mapActions(["orderlist"]),
		async init() {
			let parames = { cid: this.cid };
			let res = await this._apis.dashboard.order(parames);
		    console.log("order res",res);
		}
	}
};
</script>
