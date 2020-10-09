<template>
	<div class="panel-content">
		<div
			style="display:inline-block;width:100%;height:100%;padding-bottom:25px;"
			ref="chartContentPietest"
		></div>
	</div>
</template>

<script>
import echarts from "echarts";
import chinaData from "../../../data/china.json";
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
export default {
	watch: {
		// "dashboard.realtimeuser"(val) {
		// 	let result = val.map(item => {
		// 		return {
		// 			name: item.pro_name_rt,
		// 			value: 1
		// 		};
		// 	});
		// 	console.log("dashboard.realtiemuser", result);
		// 	this.$refs.chart.setSeriesData(result);
		// }
		"dashboard.highlight"(newVal, oldVal) {
			let difference = _.difference(newVal, oldVal);
			if (difference.length == 0) {
				return;
			}
			this.setHightlight(newVal);
		}
	},
	computed: {
		...mapState(["dashboard"])
	},
	props: ["barColor", "progress", "city", "mapData"],
	name: "TEMPLATE",
	data() {
		return {
			chartData: "71.23",
			chart: "",
			interval: "",
			option: "",
			hightlightgeoCoordMap: {}
		};
	},
	mounted() {
		this.showChart();

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
		showChart(data) {
			if (!data) {
				return;
			}
			this.chart = echarts.init(this.$refs.chartContentPietest);

			//var name_title = "新型冠状病毒累计确诊·中国"
			var name_title = "全国疫情每日累计确诊数据";
			//var subname = '信科学生居住地分布图'
			var subname = "截止至2020-04-07";
			var nameColor = " rgb(0, 0, 0)";
			var name_fontFamily = "汉仪简菱心";
			var subname_fontSize = 15;
			var name_fontSize = 30;
			var mapName = "china";

			// let geoCoordMap = this.geoCoordMap ? this.geoCoordMap : {};
			let geoCoordMap = {};
			var toolTipData = [];

			/*获取地图数据*/
			let geoJSON = this.prepareChartMap("china");
			geoJSON.features.forEach(v => {
				const name = v.properties.name;
				geoCoordMap[name] = v.properties.cp;
			});

			this.hightlightgeoCoordMap = geoCoordMap;

			var max = 44,
				min = 0; // todo
			var maxSize4Pin = 50,
				minSize4Pin = 0;

			var convertData = function(data) {
				var res = [];
				for (var i = 0; i < data.length; i++) {
					// document.write(data[i].value[0]);
					// document.write('\t');
					// document.write(data[i].value[1]);
					// document.write('\t\t');
					var geoCoord = geoCoordMap[data[i].name];
					if (geoCoord) {
						res.push({
							name: data[i].name,
							value: geoCoord.concat(data[i].value)
						});
					}
				}
				return res;
			};

			this.option = {
				// //backgroundColor: "#FF010F27", //背景色
				tooltip: {
					show: true,
					trigger: "item",
					formatter: val => {
						let { name, data } = val;
						if (data) {
							const {
								name,
								/*value,*/ confirmed,
								dead,
								cured,
								increased,
								insick
							} = data;
							var dotHtml = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${val.color};"></span>`;
							// const tip = `<b>${name}</b><br />${getTextForKey('现存确诊：')}${insick}<br />${getTextForKey('累计确诊：')}${confirmed}<br />${getTextForKey('治愈人数：')}${cured}<br />${getTextForKey('死亡人数：')}${dead}<br />${getTextForKey('新增确诊：')}${increased}`;
							// const tip = `${dotHtml}<b>${name}</b><br /> &nbsp&nbsp&nbsp${"订单总数："}${
							// 	data.value[2]
							// }<br />`;

							if (val.color == "#FFFF00") {
								return `${dotHtml}<b>${name}</b>`;
							} else {
								return `${dotHtml}<b>${name}</b><br /> &nbsp&nbsp&nbsp${"订单总数："}${
									data.value[2]
								}<br />`;
							}
						}
						return `<b>${name}</b><br />${"暂无数据"}`;
					}
				},
				visualMap: {
					hoverLink: false,
					show: true,
					textStyle: {
						fontSize: 12,
						color: "#FFFFFF"
					},
					min: 1,
					max: 3000,
					right: 10,
					bottom: 25,
					showLabel: !0,
					//text: ['高', '低'], // 文本，默认为数值文本

					//calculable: true,

					seriesIndex: [1],
					pieces: [
						{ min: 3000, label: "> 3000 ", color: "#003C87" },
						{
							min: 2001,
							max: 3000,
							label: "2001 - 3000 ",
							color: "#003C87"
						},
						{
							min: 1001,
							max: 2000,
							label: "1001 - 2000 ",
							color: "#0373FF"
						},
						{
							min: 1,
							max: 1000,
							label: "1 - 1000 ",
							color: "#5EC6F9"
						},
						{ min: -10, max: 0, label: "未下单 ", color: "#86FEFC" }
					]
				},
				geo: {
					roam: true,
					show: true,
					map: mapName,
					label: {
						normal: {
							show: false
						},
						emphasis: {
							show: false
						}
					},
					itemStyle: {
						normal: {
							areaColor: "#031525",
							borderColor: "#3B5077"
						},
						emphasis: {
							areaColor: "#2B91B7" // 地图
						}
					}
				},
				series: [
					{
						name: "散点",
						type: "scatter",
						coordinateSystem: "geo",
						//data: convertData(data.slice(0,5)),
						data: [],
						symbolSize: 17,
						// label: {
						// 	normal: {
						// 		formatter: "{b}",
						// 		//position: 'right',
						// 		color: "#000000",
						// 		textStyle: {
						// 			fontSize: "10", //字体大小
						// 			fontWeight: "bolder" //字体加粗
						// 		},

						// 		show: true
						// 	}
						// },
						itemStyle: {
							normal: {
								color: "#FFFF00",
								// color: '#05C3F9', // 无效 //有效了
								show: false
							}
						}
					},
					{
						// roam: true,
						type: "map",
						map: mapName,
						geoIndex: 0,
						aspectScale: 0.75, //长宽比
						aspectScale: 0.5, //长宽比
						showLegendSymbol: true, // 存在legend时显示
						label: {
							normal: {
								color: "#ff00ff",
								show: true
							},
							emphasis: {
								show: true,
								textStyle: {
									color: "#000000"
								}
							}
						},

						itemStyle: {
							normal: {
								areaColor: "#031525",
								borderColor: "#3B5077"
							},
							emphasis: {
								areaColor: "#2B91B7"
							}
						},
						animation: true,
						data: convertData(data)
					}
				]
			};
			this.chart.clear();
			this.chart.setOption(this.option);

			this.setHightlight([
				JSON.stringify({ pro_name_rt: "北京", value: 1 }),
				JSON.stringify({ pro_name_rt: "北京", value: 1 }),
				JSON.stringify({ pro_name_rt: "北京", value: 1 }),
				JSON.stringify({ pro_name_rt: "北京", value: 1 }),
				JSON.stringify({ pro_name_rt: "北京", value: 1 })
			]);

			// this.chart.on("mouseover", params => {
			// 	this.chart.dispatchAction({
			// 		type: "downplay"
			// 	});
			// 	// if (params.data.value == undefined) {
			// 	// 	this.chart.dispatchAction({
			// 	// 		type: "downplay"
			// 	// 	});
			// 	// }
			// });

			// if (this.interval) {
			// 	this.clearInterval();
			// }
			// if (!this.$store.state.dashboard.realtimeuser.length) {
			// 	return;
			// }

			// let res = this.$store.state.dashboard.realtimeuser.map(item => {
			// 	return {
			// 		name: item.pro_name_rt,
			// 		value: 1
			// 	};
			// });

			// var seriesData = data.filter(item => {
			// 	return item.value > 0;
			// });

			// let seriesData = this.$store.state.dashboard.highlight.map(item => {
			// 	let row = JSON.parse(item);
			// 	return {
			// 		name: row.pro_name_rt,
			// 		value: 1
			// 	};
			// });

			// var seriesData = res.filter(item => {
			// 	return item.value > 0;
			// });

			// var j = 0;

			// console.log("seriesData", seriesData);

			// this.interval = this.setInterval(() => {
			// 	if (j == seriesData.length) j = 0;
			// 	// topCity数组就是top的这个5个城市.
			// 	this.option.series[0].data = [convertData(seriesData)[j]];
			// 	console.log(
			// 		"this.option.series[0].data",
			// 		this.option.series[0].data
			// 	);
			// 	console.log("geoCoordMap", geoCoordMap);
			// 	this.chart.setOption(this.option);
			// 	j++;
			// }, 1000);

			// var j = 0;
			// var IntervalId = window.setInterval(() => {
			// 	if (j == 30) j = 0;
			// 	// topCity数组就是top的这个5个城市.
			// 	option.series[0].data = [convertData(data)[j]];
			// 	this.chart.setOption(option);
			// 	j++;
			// }, 1000);
		},

		prepareChartMap(mapName) {
			let geoJSON = null;
			if (!echarts.getMap(mapName)) {
				// geoJSON = (await axios.get("static/data/china.json")).data;
				geoJSON = chinaData;
				echarts.registerMap(mapName, geoJSON);
			} else {
				geoJSON = echarts.getMap(mapName).geoJson;
			}
			return geoJSON;
		},
		convertData(geoCoordMap, data) {
			var res = [];
			for (var i = 0; i < data.length; i++) {
				// document.write(data[i].value[0]);
				// document.write('\t');
				// document.write(data[i].value[1]);
				// document.write('\t\t');
				var geoCoord = geoCoordMap[data[i].name];
				if (geoCoord) {
					res.push({
						name: data[i].name,
						value: geoCoord.concat(data[i].value)
					});
				}
			}
			return res;
		},
		setInterval(callback, time) {
			return window.setInterval(() => {
				callback();
			}, time);
		},
		clearInterval() {
			window.clearInterval(this.interval);
		},
		setHightlight(val) {
			this.chart.clear();
			this.chart.setOption(this.option);
			if (val.length == 0) {
				window.clearInterval(this.interval);
				return;
			}
			let seriesData = val.map(item => {
				let row = JSON.parse(item);
				return {
					name: row.pro_name_rt,
					value: 1
				};
			});

			// for (let j = 0; j < res.length; j++) {
			// 	this.option.series[0].data = [
			// 		this.convertData(this.hightlightgeoCoordMap, res)[j]
			// 	];
			// 	this.chart.setOption(this.option);
			// }

			var j = 0;

			this.interval = this.setInterval(() => {
				if (j == seriesData.length) {
					return;
				}
				// topCity数组就是top的这个5个城市.
				this.option.series[0].data = [
					this.convertData(this.hightlightgeoCoordMap, seriesData)[j]
				];

				this.chart.setOption(this.option);
				j++;
			}, 1000);
		}
	},
	components: {}
};
</script>

<style scoped>
.panel-content {
	height: 100%;
}
</style>
