<template>
	<div class="panel-content">
		<div class="chartContentPie" ref="chartContentPie"></div>
		<icon :progress="progress" :city="city" class="icon"></icon>
	</div>
</template>

<script>
import echarts from "echarts";
import icon from "./icon";
export default {
	props: ["barColor", "progress", "city", "top"],
	name: "TEMPLATE",
	data() {
		return {
			chartData: "71.23",
			chart: ""
		};
	},
	mounted() {
		this.showChart();

		window.addEventListener("resize", ev => {
			this.chart.resize();
		});

		// window.addEventListener("resize", ev => {
		// 	//   this.$dt.start({
		// 	//     type: "debounce",
		// 	//     immediate: true,
		// 	//     time: 100,
		// 	//     success: () => {
		// 	//       this.chart.resize();
		// 	//     },
		// 	//   });

		// 	this.chart.resize();
		// });
	},
	methods: {
		showChart() {
			this.chart = echarts.init(this.$refs.chartContentPie);
			var data = {
				value: this.progress,
				company: "年度能耗",
				// name: this.city,
				// ringColor: [{
				//   offset: 0,
				//   color: '#02d6fc' // 0% 处的颜色
				// }, {
				//   offset: 1,
				//   color: '#367bec' // 100% 处的颜色
				// }]

				ringColor: [
					{
						offset: 0,
						color: this.barColor // 0% 处的颜色
					}
				]
			};
			let option = {
				// title: {
				//   text: data.value + "%\n" + data.company,
				//   x: "center",
				//   y: "center",
				//   textStyle: {
				//     color: "#fff",
				//     fontSize: "18",
				//   },
				// },
				tooltip: {
					show: this.progress != 0,
					//formatter: "{data.name} <br/>{b}: {c} ({d}%)"
					formatter: params => {
						var dotHtml = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
							params.data.progress == 0
								? "#1A273D"
								: this.barColor
						}"></span>`;
						return `${dotHtml}TOP${params.data.top} ${params.data.name} <br/> &nbsp&nbsp&nbsp交易金额占比: &nbsp${params.data.progress}%`;
						//return `TOP${params.data.top} ${params.data.name} <br/> 交易金额占比:${params.data.progress}%`;
					}
				},
				color: ["#1A273D"],
				legend: {
					show: false,
					data: []
				},

				series: [
					{
						name: this.city,
						progress: this.progress,
						type: "pie",
						clockWise: true,
						//radius: ['55', '65'],//设置圆环的半径
						radius: ["55", "65"], //设置圆环的半径
						itemStyle: {
							normal: {
								label: {
									show: false
								},
								labelLine: {
									show: false
								}
							}
						},
						hoverAnimation: false,
						data: [
							{
								value: data.value,
								name: this.city,
								progress: this.progress,
								top: this.top,
								itemStyle: {
									normal: {
										color: {
											// 完成的圆环的颜色
											colorStops: data.ringColor
										},
										label: {
											show: false
										},
										labelLine: {
											show: false
										}
									}
								}
							},
							{
								name: this.city,
								progress: this.progress,
								top: this.top,
								value: 100 - data.value
							}
						]
					}
				]
			};
			this.chart.clear();
			this.chart.setOption(option);
		}
	},
	components: {
		icon
	}
};
</script>

<style lang="scss" scoped>
.panel-content {
	position: relative;
	//background: red;
	//min-width: 400px;

	.chartContentPie {
		width: 150px;
		height: 150px;
	}

	// .chartContentPie:hover {
	// 	transform: scale(1.2);
	// 	-webkit-transform: scale(1.2); /*兼容-webkit-引擎浏览器*/
	// 	-moz-transform: scale(1.2); /*兼容-moz-引擎浏览器*/
	// }

	// .chartContentPie {
	// 	width: 100px;
	// 	height: 100px;
	// }
}

// @media screen and (min-width: 1511px) {
// 	.panel-content {
// 		position: relative;
// 		background: yellow;

// 		.chartContentPie {
// 			width: 150px;
// 			height: 150px;
// 		}
// 	}
// }
</style>
