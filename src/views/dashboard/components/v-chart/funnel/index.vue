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
import echarts from "echarts";
export default {
	props: ["barColor", "progress", "city", "chartData"],
	name: "TEMPLATE",
	data() {
		return {};
	},
	mounted() {
		this.showChart(this.chartData);

		window.addEventListener("resize", ev => {
			//   this.$dt.start({
			//     type: "debounce",
			//     immediate: true,
			//     time: 100,
			//     success: () => {
			//       this.chart.resize();
			//     },
			//   });

			this.chart.resize();
		});
	},
	methods: {
		showChart(lineargroup) {
			this.chart = echarts.init(this.$refs.chartContentPie);

			var colors = [
				"#1cd389",
				"#668eff",
				"#ffc751",
				"#ff6e73",
				"#8683e6",
				"#9692ff"
			];

			// var lineargroup = [
			// 	{
			// 		value: 60,// 转换率
			// 		name: "商務率",// 转换率名称
			// 		oriname: "商務",
			// 		number: 78756
			// 		// color: ["rgba(255,198,82,0.6)", "rgba(255,198,82,0)"]
			// 	},
			// 	{
			// 		value: 40,
			// 		name: "成交率",
			// 		oriname: "即將成交",
			// 		number: 68756
			// 		// color: ["rgba(255,110,115,0.5)", "rgba(255,110,115,0)"]
			// 	},
			// 	{
			// 		value: 20,
			// 		name: "贏單率",
			// 		oriname: "贏單",
			// 		number: 58756
			// 		//  color: ["rgba(134,131,230,0.4)", "rgba(134,131,230,0)"]
			// 	}
			// ];

			var data1 = [];
			var data2 = [];

			for (var i = 0; i < lineargroup.length; i++) {
				var obj1 = {
					value: lineargroup[i].value,
					num: lineargroup[i].number,
					name: lineargroup[i].oriname
				};

				var obj2 = {
					value: lineargroup[i].value,
					name: lineargroup[i].name,
					itemStyle: {
						opacity: 0
						/*normal: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                    offset: 0,
                    color: lineargroup[i].color[1]
                }, {
                    offset: 1,
                    color: lineargroup[i].color[0]
                }]),
                borderWidth: 0,
                opacity: 1
            }*/
					}
				};
				data1.push(obj1);
				data2.push(obj2);
			}

			console.log("data1", data1);
			console.log("data2", data2);

			var option = {
				color: colors,
				series: [
					{
						top: 30,
						type: "funnel",
						height: "150",
						gap: 0,
						minSize: 150,
						left: "20%",
						width: "60%",
						label: {
							show: true,
							position: "inside",
							fontSize: "14",
							formatter: function(d) {
								var ins = d.name + "{aa|}\n" + d.data.num;
								return ins;
							},
							rich: {
								aa: {
									padding: [8, 0, 6, 0]
								}
							}
						},
						data: data1
					},
					{
						top: 30,
						type: "funnel",
						height: "150",
						gap: -1,
						minSize: 150,
						left: "20%",
						width: "60%",
						z: 2,
						label: {
							normal: {
								color: "#FFFFFF",
								position: "right",
								formatter: function(d) {
									var ins =
										"{aa|" +
										d.name +
										"}\n{bb|" +
										d.percent +
										"%}";
									return ins;
								},
								rich: {
									aa: {
										align: "center",
										color: "#FFFFFF",
										fontSize: "12",
										lineHeight: "30"
									},
									bb: {
										align: "center",
										color: "#FFFFFF",
										fontSize: "15"
									}
								}
							}
						},
						labelLine: {
							show: false
						},
						data: data2
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
