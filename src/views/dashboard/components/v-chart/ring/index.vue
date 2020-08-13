<template>
	<div class="v-chart-ring">
		<ve-ring
			:data="chartData"
			:settings="chartSettings"
			:extend="chartExtend"
			v-bind="pubSetting"
			:tooltip-visible="true"
			:legend-visible="false"
		></ve-ring>
	</div>
</template>

<script>
import list from "../../_mixin/index.js";
import echarts from "echarts";
export default {
	// props: ["chartData", "chartSettings", "chartExtend"],
	props: ["chartData"],
	mixins: [list],
	data() {
		return {
			chartSettings: {
				// area: false
				radius: [60, 70],
				offsetY: 95
			},
			chartExtend: {
				// color: "rgba(71, 225, 255, 0.15)",
				// xAxis: {
				// 	axisLine: {
				// 		lineStyle: {
				// 			color: "rgba(255,255,255,0.8)"
				// 		}
				// 	}
				// },
				// yAxis: {
				// 	splitLine: {
				// 		lineStyle: {
				// 			color: "#26353a"
				// 		}
				// 	},
				// 	axisLine: {
				// 		lineStyle: {
				// 			color: "rgba(255,255,255,0.8)"
				// 		},
				// 		show: false
				// 	}
				// }
			}
		};
	}
};
</script>

<style lang="scss" scoped>
.v-chart-ring {
	height: 100%;
}
</style>
