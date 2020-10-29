<template>
	<div class="panel-content">
		<!-- <div style="width:100%;height:350px;" ref="chartContentPie"></div> -->
		<div
			style="display:inline-block;width:100%;height:100%;"
			ref="chartContentPie"
		></div>
	</div>
</template>

<script>
import dashboard from "@/system/constant/dashboard";
import echarts from "echarts";
export default {
	props: ["barColor", "progress", "city", "chartData"],
	name: "TEMPLATE",
	data() {
		return {
			// screenWidth: document.body.clientWidth,
		};
	},
	mounted() {
		//this.showChart(this.chartData);
		window.addEventListener("resize", ev => {
			this.chart.resize();
		});
		// window.onresize = () => {
		// return (() => {
		// 	this.screenWidth = document.body.clientWidth;
		// })()
		// }
	},
	methods: {
		showChart(val) {
			let lineargroup = val.chart;
			let youcejiantouData = val.youcejiantouData;
			this.chart = echarts.init(this.$refs.chartContentPie);
			var colors = ["#5F5EFF", "#026DFF", "#06C9DD"];
			var markLineSettingleft = {
				// 折线文本
				normal: {
					show: true,
					backgroundColor: "#010F27",
					borderRadius: 4,
					color: "#FFFFFF",
					verticalAlign: "center",
					offset: screen.width==1280 || screen.width==1366 ? [-10, 52, 0, 0] : screen.width==1440 || screen.width==1600 ? [-10, 32, 0, 0] : [15, 32, 0, 0],
					fontSize: screen.width==1280 ? 9 : screen.width==1920 ? 12: 10,
					//   padding: [3, 10, 5, 10],
					formatter: function(d) {
						if (d.value) {
							//   var ins = "{img1|} " + "{words|" + d.data.itemValue + "}";
							var ins = d.data.name + d.data.itemValue;
							return ins;
						}
					}
				}
			};
			var markLineSetting = {
				// 折线文本
				normal: {
					show: true,
					backgroundColor: "#010F27",
					borderRadius: 4,
					color: "#FFFFFF",
					verticalAlign: "center",
					offset: screen.width==1600 ? [45, 0, 0, 0] : [50, 0, 0, 0],
					fontSize: screen.width==1280 ? 9 : screen.width==1920 ? 12: 10,
					//   padding: [3, 10, 5, 10],
					formatter: function(d) {
						if(screen.width==1280 || screen.width==1366) {
						 	d.data.label.offset = d.name=="下单转化率" ? [25, 30, 0, 0] : [44, 3, 0, 0];
						}
						if (d.value) {
							//   var ins = "{img1|} " + "{words|" + d.data.itemValue + "}";
							var ins = d.data.name + d.data.itemValue;
							return ins;
						}
					}
				}
			};
			var data1 = [];
			for (var i = 0; i < lineargroup.length; i++) {
				var obj1 = {
					value: lineargroup[i].value,
					num: lineargroup[i].number,
					name: lineargroup[i].oriname
				};
				data1.push(obj1);
			}
			var option = {
				backgroundColor: "#000B23",
				color: colors,
				tooltip: {
					// show: params.data.num ? true : false,
					//formatter: "{data.name} <br/>{b}: {c} ({d}%)"
					formatter: params => {
						if (!params.data.num) {
							return;
						}
						var dotHtml = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color}"></span>`;
						return `${dotHtml}${params.name} <br/> &nbsp&nbsp&nbsp人数: &nbsp${params.data.num}`;
					}
				},
				//折线
				grid: {
					// top: "35",
					// left: "4%",
					right: 17,
					height: "135",
					bottom: screen.width > 1600 ? "-2" : "-15"
				},
				xAxis: [
					{
						show: false,
						inverse: true,
						position: "top"
					},
					{
						position: "bottom",
						show: false,
						min: 100,
						max: 200
					}
				],
				yAxis: [
					{
						// position: "right",
						top: "105",
						show: false,
						boundaryGap: false,
						inverse: true,
						type: "category",
						min: "转化率1",
						data: ["转化率1", "转化率2", "转化率3"]
					}
				],
				series: [
					{
						itemStyle: {
							borderColor: "red",
							borderWidth: 0
						},

						top: screen.width==1280 ? 20 : screen.width==1920 ? 25 : 10,
						// bottom:30,
						type: "funnel",
						height: screen.width==1280 || screen.width==1366 ? "100" : "150",
						gap: screen.width==1280 || screen.width==1366 ? 11 : 20,
						minSize: 150,
						left: screen.width==1280 || screen.width==1366 ? "23%" : "20%",
						width: screen.width==1280 || screen.width==1366 ? "48%" : "60%",
						label: {
							show: true,
							position: "inside",
							fontSize: "14",
							formatter: function(d) {
								// var ins = d.name + "{aa|}\n" + d.data.num;
								var ins = d.name;
								return ins;
							}
							// rich: {
							//   aa: {
							//     padding: [8, 0, 6, 0],
							//   },
							// },
						},
						data: data1
					},

					// //right
					// {
					// 	top: "50%",
					// 	name: "youcejiantou",
					// 	type: "pictorialBar",
					// 	symbolPosition: "center",
					// 	symbolSize: ["65", "55"],
					// 	symbol: "image://" + dashboard.rightArrow,
					// 	symbolClip: true,
					// 	xAxisIndex: "1",
					// 	z: 1,
					// 	data: [
					// 		{
					// 			value: 361,
					// 			itemValue:
					// 				youcejiantouData.order_c_uv_7dco + "%",
					// 			show: true,
					// 			label: markLineSetting,
					// 			name: "下单转化率"
					// 		},
					// 		{
					// 			value: 351,
					// 			itemValue:
					// 				youcejiantouData.paid_c_order_7dco + "%",
					// 			label: markLineSetting,
					// 			name: "下单支付转化率"
					// 		}
					// 	]
					// },
					// // left
					// {
					// 	symbolOffset: [45, 37, 0, 0],
					// 	type: "pictorialBar",
					// 	symbolPosition: "center",
					// 	symbolSize: ["95", "126"],
					// 	symbol: "image://" + dashboard.leftArrow,
					// 	symbolClip: false,
					// 	xAxisIndex: "1",
					// 	barCategoryGap: "10%",

					// 	z: 1,
					// 	y: 100,
					// 	data: [
					// 		{
					// 			value: 210,
					// 			itemValue:
					// 				youcejiantouData.paid_c_uv_7dco + "%",
					// 			label: markLineSettingleft,
					// 			name: "支付转化率"
					// 		}
					// 	]
					// }

					//right

					{
						top: "70%",
						name: "youcejiantou",
						type: "pictorialBar",
						symbolPosition: "center",
						symbolSize: screen.width==1280 || screen.width==1366 ? ["65", "40"] : ["65", "55"],
						symbol: "image://" + dashboard.rightArrow,
						symbolClip: true,
						xAxisIndex: "1",
						z: 1,
						//-999900
						data: [
							{
								symbolOffset: screen.width==1280 || screen.width==1366 ? ["-15%", "80%"] : [0, 0],
								value: screen.width == 1440 ? 354 : 361,
								itemValue:
									youcejiantouData.order_c_uv_7dco == -999900
										? "0%"
										: youcejiantouData.order_c_uv_7dco +
										  "%",
								show: true,
								label: markLineSetting,
								name: "下单转化率",
							},
							{
								symbolOffset: screen.width==1280 || screen.width==1366 ? ["0%", "12%"] : [0, 0],
								value: 348,
								itemValue:
									youcejiantouData.paid_c_order_7dco + "%",
								label: markLineSetting,
								name: "下单支付转化率"
							}
						],
					},

					// left
					{
						// 图形偏移
						symbolOffset: screen.width==1280 || screen.width==1366 ? ["30%", "70%"] : [52, 35, 0, 0],
						type: "pictorialBar",
						symbolPosition: "center",
						symbolSize: screen.width==1280 || screen.width==1366 ? ["75", "75"] : ["75", "116"],
						// symbol: leftArrow,
						//图形类型
						symbol: "image://" + dashboard.leftArrow,
						//裁剪图形
						symbolClip: false,
						xAxisIndex: "1",
						barCategoryGap: "10%",

						z: 1,
						y: 100,
						data: [
							{
								value: 210,
								itemValue:
									youcejiantouData.paid_c_uv_7dco == -999900
										? "0%"
										: youcejiantouData.paid_c_uv_7dco + "%",
								label: markLineSettingleft,
								name: "支付转化率",
							}
						],
					}
				]
			};

			this.chart.clear();
			this.chart.setOption(option);
		}
	},
	watch: {
		// screenWidth: {
		// 	immediate: true,
		// 	handler: function (newVal) {
		// 		console.log(newVal)
		// 		if(newVal == 1280) {
		// 			console.log(this,'this')
		// 		}else if(newVal == 1360) {

		// 		}else if(newVal == 1440) {
					
		// 		}else if(newVal == 1600) {

		// 		}
		// 	}
		// }
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
