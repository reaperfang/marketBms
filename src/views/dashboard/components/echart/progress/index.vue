<template>
	<div class="panel-content">
		<div
			style="  position: absolute;display:inline-block;width:100%;height:100%;"
			ref="chart"
		></div>
	</div>
</template>

<script>
import echarts from "echarts";
export default {
	props: [],
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
	},
	methods: {
		showChart() {
			this.chart = echarts.init(this.$refs.chart);
			let option = {
				backgroundColor: "#0E0E40",
				title: {
					text: "{a|换届完成率}",
					textStyle: {
						color: "#fff",
						fontWeight: "normal",
						fontSize: 40,
						fontFamily: "MittelNeu",
						rich: {
							a: {
								color: "#fff",
								fontWeight: "normal",
								fontSize: 40,
								fontFamily: "MittelNeu",
								lineHeight: 50
							}
						}
					},
					x: "center",
					y: "70%"
				},
				series: [
					{
						type: "pie",
						clockWise: false,
						radius: ["38%", "62%"],
						hoverAnimation: true,
						silent: true,
						startAngle: 55,
						center: ["50%", "40%"],
						itemStyle: {
							normal: {
								labelLine: {
									show: false
								}
							}
						},
						z: 3,
						data: [
							{
								value: 20,
								label: {
									normal: {
										show: true,
										position: "center",
										formatter: "{c}{a|%}",
										fontSize: 78,
										fontFamily: "MittelNeu",
										fontWeight: "normal",
										color: "white",
										rich: {
											a: {
												fontFamily: "din",
												fontSize: 50,
												color: "white"
											}
										}
									}
								},
								itemStyle: {
									normal: {
										color: "#FFDE00",
										shadowColor: "#0E0E40",
										shadowBlur: 30
									}
								}
							},
							{
								value: 100 - 20,
								itemStyle: {
									normal: {
										color: "transparent"
									}
								}
							}
						]
					},
					{
						type: "pie",
						clockWise: false,
						radius: ["45%", "54%"],
						hoverAnimation: true,
						silent: true,
						center: ["50%", "40%"],
						itemStyle: {
							normal: {
								labelLine: {
									show: false
								}
							}
						},
						data: [
							{
								value: 0
							},
							{
								value: 100,
								itemStyle: {
									normal: {
										color: "#877620"
									}
								}
							}
						]
					}
				]
			};
			this.chart.clear();
			this.chart.setOption(option);
		}
	},
	components: {}
};
</script>

<style scoped>
.panel-content {
	position: relative;
	height: 100%;
}
</style>
