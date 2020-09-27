<template>
	<div class="v-chart-progress">
		<div
			style="width:100%;height:100%;	position: absolute;"
			ref="chartContentPie"
		></div>

		<icon :progress="progress" :city="city"></icon>
	</div>
</template>

<script>
import echarts from "echarts";
import icon from "./icon";
export default {
	watch: {
		progress(val) {
			this.showChart();
		}
	},
	props: ["barColor", "progress", "city"],
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
			this.chart = echarts.init(this.$refs.chartContentPie);
			var data = {
				value: this.progress,
				company: "年度能耗",
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
				center: ["40%", "50%"],
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
					formatter: params => {
						console.log("formatter: params => {", params);
						var dotHtml = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
							params.data.progress == 0
								? "#1A273D"
								: this.barColor
						}"></span>`;
						return `${dotHtml}${params.data.name} <br/> &nbsp&nbsp&nbsp占比: &nbsp${params.data.value}%`;
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
						type: "pie",
						// clockWise: true,
						//radius: ['60', '70'],//设置圆环的半径
						radius: ["50", "60"], //设置圆环的半径
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
								name: "",
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

<style scoped>
.v-chart-progress {
	height: 100%;
	position: relative;
	/* display: flex;
  align-items: center;
  justify-content: center; */
}
</style>
