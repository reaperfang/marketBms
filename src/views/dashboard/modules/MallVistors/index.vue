<template>
	<div class="row-3-grid-content middle-grid-margin flex-column">
		<el-row type="flex" justify="space-between" class="item-title">
			<el-col :span="24">
				<gridtitle :title="'商城访客(最近七天)'"></gridtitle>
			</el-col>
		</el-row>
		<el-row class="item-content">
			<vline :chartData="chartData" :chartSettings="chartSettings" :chartExtend="chartExtend"></vline>
		</el-row>
	</div>
</template>

<script>
import gridtitle from "../../components/title/index";
import vline from "../../components/v-chart/line/index";
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
	components: { vline, gridtitle },
	data: function() {
		return {
			chartData: {
				columns: ["日期", "访问人数"],
				rows: [
					{ 日期: "1/1", 访问人数: 1393 },
					{ 日期: "1/2", 访问人数: 3530 },
					{ 日期: "1/3", 访问人数: 2923 },
					{ 日期: "1/4", 访问人数: 1723 },
					{ 日期: "1/5", 访问人数: 3792 },
					{ 日期: "1/6", 访问人数: 4593 }
				]
			},
			chartSettings: {
				area: true
			},
			chartExtend: {
				color: "rgba(71, 225, 255, 0.15)",
				grid: {
					top: "10px",
					bottom: "7px"
				},
				xAxis: {
					axisLine: {
						lineStyle: {
							color: "rgba(255,255,255,0.8)"
						}
					}
				},
				yAxis: {
					splitLine: {
						lineStyle: {
							color: "#26353a"
						}
					},
					axisLine: {
						lineStyle: {
							color: "rgba(255,255,255,0.8)"
						},
						show: false
					}
				}
			}
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
