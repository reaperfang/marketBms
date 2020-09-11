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
		//this.showChart(this.chartData);
		// window.addEventListener("resize", ev => {
		// 	this.chart.resize();
		// });
	},
	methods: {
		showChart(val) {
			let lineargroup = val.chart;
			let youcejiantouData = val.youcejiantouData;
			this.chart = echarts.init(this.$refs.chartContentPie);
			var rightArrow =
				"image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAABNBAMAAAAYzFT5AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAElBMVEUAAACZmZmZmZmqqqqZmZkAAAClqsN/AAAAA3RSTlMAf4C/aSLHAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAFdJREFUSMftzbENgCAYROEDHMCCASwYwMQFKNh/JkOhHfnPxuq9+sud9FSuZac+qnUFhUKhUKi3raNQqJ/U7qgU7k1VHZWGo+qI62qWyvHjrFkqW0pHTG6J1zAklFuGvAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wMi0wM1QxODo0OTo1NyswODowMJLTpqcAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDItMDNUMTg6NDk6NTcrMDg6MDDjjh4bAAAAAElFTkSuQmCC";
			var uploadedDataURL =
				"/asset/get/s/data-1576742942370-X6JMK0GY.png";
			var colors = ["#5F5EFF", "#026DFF", "#06C9DD"];
			var url =
				"image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAARCAMAAACLgl7OAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAaVBMVEUAAADBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcEAAAD45xibAAAAInRSTlMAmT6WJYwSfBMGZAFHmEgtkBeCCW0KAlI1k5QeiA10A1tc7ah1owAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAB7SURBVCjPtZDZDoAgDAQXvA+8bwX1/3/SGKIBEd+cx07TdgtIiAF0/mygDvnAoYDr2b3nnjP8wOaDUG6J4ncfR9cdScpMzbJECZEXT1/kesyy0n1VPv6AulF908Kg6+9DWN/hjWGUfhpgYV5Ov8ywwgUhguODddtXvXIAjuUEs/70/t4AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMTItMTZUMTU6MzM6MDkrMDg6MDCzL2BEAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTEyLTE2VDE1OjMzOjA5KzA4OjAwwnLY+AAAAABJRU5ErkJggg==";
			var markLineSetting = {
				// 折线文本
				normal: {
					show: true,
					//   backgroundColor: "#e4f5da",
					borderRadius: 4,
					color: "#FFFFFFFF",
					verticalAlign: "middle",
					offset: [40, 0, 0, 0],
					fontSize: 14,
					//   padding: [3, 10, 5, 10],
					formatter: function(d) {
						if (d.value) {
							//   var ins = "{img1|} " + "{words|" + d.data.itemValue + "}";
							var ins = d.data.name + d.data.itemValue;
							return ins;
						}
					},
					rich: {
						// img1: {
						//   backgroundColor: {
						//     // image: uploadedDataURL,
						//   },
						//   width: 18,
						//   height: 16,
						// },
						words: {
							// color: "#FFFFFFFF",
							// position: "right",
							// fontSize: 14,
							// lineHeight: 20,
							// padding: [0, 0, 5, 0],
						}
					}
				}
			};
			// var lineargroup = [
			// 	{
			// 		value: 60,
			// 		name: "商務率",
			// 		oriname: "商務",
			// 		number: 78756,
			// 		color: ["rgba(255,198,82,0.6)", "rgba(255,198,82,0)"]
			// 	},
			// 	{
			// 		value: 40,
			// 		name: "成交率",
			// 		oriname: "即將成交",
			// 		number: 68756,
			// 		color: ["rgba(255,110,115,0.5)", "rgba(255,110,115,0)"]
			// 	},
			// 	{
			// 		value: 20,
			// 		name: "贏單率",
			// 		oriname: "贏單",
			// 		number: 58756,
			// 		color: ["rgba(134,131,230,0.4)", "rgba(134,131,230,0)"]
			// 	}
			// ];
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
					// show: this.progress != 0,
					//formatter: "{data.name} <br/>{b}: {c} ({d}%)"
					formatter: params => {
						var dotHtml = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color}"></span>`;
						return `${dotHtml}${params.name} <br/> &nbsp&nbsp&nbsp人数: &nbsp${params.data.num}`;
					}
				},
				//折线
				grid: {
					// top: "35",
					// left: "4%",
					right: 20,
					height: "135",
					bottom: "-10"
				},
				xAxis: [
					{
						show: true,
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
						top: 25,
						// bottom:30,
						type: "funnel",
						height: "150",
						gap: 20,
						minSize: 150,
						left: "20%",
						width: "60%",
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

					{
						top: "50%",
						name: "youcejiantou",
						type: "pictorialBar",
						symbolPosition: "center",
						symbolSize: ["65", "55"],
						symbol: rightArrow,
						symbolClip: true,
						xAxisIndex: "1",
						z: 1,
						data: [
							{
								value: 361,
								itemValue:
									youcejiantouData.order_c_uv_7dco + "%",
								show: true,
								label: markLineSetting,
								name: "下单转化率"
							},
							{
								value: 351,
								itemValue:
									youcejiantouData.paid_c_order_7dco + "%",
								label: markLineSetting,
								name: "下单支付转化率"
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
