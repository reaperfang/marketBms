<template>
	<div class="v-chart-histogram">
		<ve-histogram
			:extend="chartExtend"
			:data="chartData"
			v-bind="pubSetting"
			:legend-visible="false"
		></ve-histogram>
	</div>
</template>

<script>
import list from "../../_mixin/index.js";
import echarts from "echarts";
export default {
	mixins: [list],
	data() {
		return {
			chartData: {
				columns: ["日期", "访问用户"],
				rows: [
					{
						日期: "1/1",
						访问用户: 1393
					},
					{
						日期: "1/2",
						访问用户: 3530
					},
					{
						日期: "1/3",
						访问用户: 2923
					},
					{
						日期: "1/4",
						访问用户: 1723
					},
					{
						日期: "1/5",
						访问用户: 3792
					},
					{
						日期: "1/6",
						访问用户: 4593
					}
				]
			},
			chartExtend: {
				grid: {
					top: "30px",
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
	}
};
</script>

<style lang="scss" scoped>
.v-chart-histogram {
	height: 100%;
	// background: yellow;
}
</style>
