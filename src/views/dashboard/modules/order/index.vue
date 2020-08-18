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
		// flowData(val) {
		// }
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
		//...mapState([""])
	},
	mounted() {},
	beforeCreate() {},
	created() {},
	beforeMount() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	destroyed: function() {},
	methods: {
		//...mapActions([""]),
	}
};
</script>
