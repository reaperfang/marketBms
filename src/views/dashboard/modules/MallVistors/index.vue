<template>
	<div class="row-3-grid-content middle-grid-margin flex-box">
		<div class="titile">
			<el-row type="flex" justify="space-between" class="item-title">
				<el-col :span="12">
					<gridtitle :title="'商城访客(最近七天)'"></gridtitle>
				</el-col>
				<el-col :span="12"> </el-col>
			</el-row>
		</div>
		<div class="content">
			<vline
				:chartData="chartData"
				:chartSettings="chartSettings"
				:chartExtend="chartExtend"
			></vline>
		</div>
	</div>
</template>

<script>
import echarts from "echarts";
import gridtitle from "../../components/title/index";
import vline from "../../components/v-chart/line/index";
import { mapGetters, mapActions, mapState } from "vuex";

export default {
	watch: {
		"dashboard.mailvistor"(val) {
			this.setChartData(val);
		}
	},
	props: {
		// data: {
		//   type: Object,
		//   default: false
		// }
	},
	components: { vline, gridtitle },
	data: function() {
		return {
			cid: JSON.parse(localStorage.getItem("shopInfos")).id,
			chartData: {
				columns: ["日期", "访客"],
				rows: [
					// { 日期: "1/1", 访问人数: 1393 },
					// { 日期: "1/2", 访问人数: 3530 },
					// { 日期: "1/3", 访问人数: 2923 },
					// { 日期: "1/4", 访问人数: 1723 },
					// { 日期: "1/5", 访问人数: 3792 },
					// { 日期: "1/6", 访问人数: 4593 },
				]
			},
			chartSettings: {
				area: true,
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(
							0,
							0,
							0,
							1,
							[
								{
									offset: 0,
									color: "#023851"
								},
								{
									offset: 1,

									color: "#000B23"
								}
							],
							false
						)
					}
				}
			},
			chartExtend: {
				color: "rgba(71, 225, 255, 0.15)",
				//color: "#47E1FF",
				grid: {
					top: "30px",
					bottom: "7px"
				},
				series: {
					smooth: false, //平滑曲线
					itemStyle: {
						normal: {
							color: "#47E1FF",
							lineStyle: {
								color: "#47E1FF"
							}
						}
					}
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
					},
					minInterval: 1
				},
				tooltip: {
					formatter: function(params) {
						let item = params[0],
							list = item.data;
						var dotHtml = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color}"></span>`;
						return `${dotHtml}${list[0]} <br/>&nbsp&nbsp&nbsp访客人数: &nbsp${list[1]}人`;
					}
				}
			}
		};
	},
	computed: {
		...mapState(["dashboard"])
	},
	mounted() {
		this.init();
	},
	beforeCreate() {},
	created() {},
	beforeMount() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	destroyed: function() {},
	methods: {
		...mapActions(["maivistorlist"]),
		async init() {
			let parames = { ...this.invokeType, cid: this.cid };

			let res = await this._apis.dashboard.vistor(parames);
			this.maivistorlist(JSON.parse(res));
		},
		setChartData(val) {
			this.chartData = {
				...this.chartData,
				rows: this.getRows(val)
			};

			console.log("this.chartData test", this.chartData);
		},
		getRows(val) {
			let result = [];
			let y = val.uv_7d;
			let x = val.x;

			for (var j = 0; j < y.length; j++) {
				result.push({
					日期: x[j],
					访客: y[j]
				});
			}

			return result;
		}
	}
};
</script>
