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
	props: ["chartData"],
	mixins: [list],
	data() {
		return {
			// chartData: {
			// 	columns: ["日期", "访问用户"],
			// 	rows: [
			// 		{
			// 			日期: "1/1",
			// 			访问用户: 1393
			// 		},
			// 		{
			// 			日期: "1/2",
			// 			访问用户: 3530
			// 		},
			// 		{
			// 			日期: "1/3",
			// 			访问用户: 2923
			// 		},
			// 		{
			// 			日期: "1/4",
			// 			访问用户: 1723
			// 		},
			// 		{
			// 			日期: "1/5",
			// 			访问用户: 3792
			// 		},
			// 		{
			// 			日期: "1/6",
			// 			访问用户: 4593
			// 		}
			// 	]
			// },
			chartExtend: {
				color: ["#3FCEEF"],
				grid: {
					top: "30px",
					bottom: "7px"
				},
				xAxis: {
					axisLine: {
						lineStyle: {
							color: "rgba(255,255,255,0.8)"
						}
					},
					axisLabel: {
						interval: 0,
						rotate: 35
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
				},
				tooltip: {
					trigger: "axis",
					axisPointer: {
						// 坐标轴指示器，坐标轴触发有效
						type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
					},
					formatter: function(params) {
						console.log(params);
						let item = params[0],
							list = item.data;
						var dotHtml = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color}"></span>`;
						return `${dotHtml}${item.name} <br/>&nbsp&nbsp&nbsp${
							item.seriesName == "数量"
								? "交易数量"
								: "客单价金额"
						}: &nbsp${item.value}`;
					}
				},
				series: {
					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(
								0,
								0,
								0,
								1,
								// [
								// 	{ offset: 0, color: "#06B5D7" }, //柱图渐变色
								// 	{ offset: 0.5, color: "#44C0C1" }, //柱图渐变色
								// 	{ offset: 1, color: "#71C8B1" } //柱图渐变色
								// ]
								[
									{ offset: 0, color: "#6AEEFF" }, //柱图渐变色
									{ offset: 1, color: "#009FD7" } //柱图渐变色
								]
							)
						}
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
