<template>
	<div class="v-chart-line">
		<ve-line
			:data="chartData"
			:settings="chartSettings"
			:extend="chartExtend"
			v-bind="pubSetting"
			:tooltip-visible="true"
			:legend-visible="false"
		></ve-line>
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
				//backgroundColor: "#25242a"
				//backgroundColor: "rgba(128, 128, 128, 0.1)", //设置背景色canvas 画布透明
				color: "rgba(71, 225, 255, 0.15)",
				grid: {
					// left: "1%",
					// right: "6%",
					// bottom: "80px",
					// containLabel: true
					top: "10px",
					bottom: "0px"
				},
				// dataZoom: {
				// 	show: true
				// },

				xAxis: {
					axisLine: {
						lineStyle: {
							color: "rgba(255,255,255,0.8)"
						}
					}
					// splitLine: {
					// 	show: false
					// },
					// axisLabel: {
					// 	// rotate:-20,
					// 	interval: 0,
					// 	// align:'center',
					// 	margin: 14,
					// 	interval: 0,
					// 	textStyle: {
					// 		color: "#65abe7"
					// 	}
					// }
				},
				yAxis: {
					// nameTextStyle: {
					// 	color: "#65abe7"
					// },
					splitLine: {
						lineStyle: {
							color: "#26353a"
						}
					},
					// axisLabel: {
					// 	textStyle: {
					// 		// 轴文字
					// 		color: "#65abe7",
					// 		fontSize: 12
					// 	},
					// 	formatter: "{value}",
					// 	color: "#65abe7"
					// },
					axisLine: {
						lineStyle: {
							color: "rgba(255,255,255,0.8)"
						},
						show: false
					}
				},
				// tooltip: {
				// 	trigger: "axis",
				// 	axisPointer: {
				// 		type: "cross",
				// 		animation: false,
				// 		label: {
				// 			backgroundColor: "#ccc",
				// 			borderColor: "#aaa",
				// 			borderWidth: 1,
				// 			shadowBlur: 0,
				// 			shadowOffsetX: 0,
				// 			shadowOffsetY: 0,
				// 			textStyle: {
				// 				color: "#65abe7"
				// 			}
				// 		}
				// 	},
				// 	// formatter: function(params) {
				// 	// 	return `时间：${params[0].data.value[0]}<br />${
				// 	// 		type == 1 ? "增长量：" : "速率："
				// 	// 	}${params[0].data.value[1]}`;
				// 	// }
				// }
				// dataZoom: {
				// 	show: true,
				// 	start: 0,
				// 	textStyle: "#65abe7",
				// 	backgroundColor: new echarts.graphic.LinearGradient(
				// 		0,
				// 		0,
				// 		0,
				// 		1,
				// 		[
				// 			{
				// 				offset: 0,
				// 				color: "#2a6496"
				// 			},
				// 			{
				// 				offset: 1,
				// 				color: "#2e4456"
				// 			}
				// 		]
				// 	),
				// 	borderColor: "",

				// 	// fillerColor:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				// 	//     offset: 0,
				// 	//     color: '#2a6496'
				// 	// }, {
				// 	//     offset: 1,
				// 	//     color: '#2e4456'
				// 	// }]),
				// 	dataBackground: {
				// 		//数据阴影的样式。
				// 		lineStyle: "red"
				// 	}
				// }
				// series: [

				// 	{
				//          data:this.chartData,
				// 		type: "line",
				// 		areaStyle: {
				// 			normal: {
				// 				color: new echarts.graphic.LinearGradient(
				// 					0,
				// 					0,
				// 					0,
				// 					1,
				// 					[
				// 						{
				// 							offset: 0,
				// 							color: "#2a6496"
				// 						},
				// 						{
				// 							offset: 1,
				// 							color: "#2e4456"
				// 						}
				// 					]
				// 				)
				// 			}
				// 		}
				// 	}
				// ]
			}
		};
	}
};
</script>

<style lang="scss" scoped>
.v-chart-line {
	height: 100%;
	// background: yellow;
}
</style>
