<template>
	<div class="row-3-grid-content middle-grid-margin flex-box">
		<div class="titile">
			<el-row type="flex" justify="space-between" class="item-title">
				<el-col :span="12">
					<gridtitle :title="'支付金额(最近七天)'"></gridtitle>
				</el-col>
				<el-col :span="12">
					<gridtitle :title="'商城浏览(最近七天)'"></gridtitle>
				</el-col>
			</el-row>
		</div>
		<div class="content">
			<el-row class="item-content">
				<el-col :span="12" class="v-el-col">
					<vline
						:chartData="left"
						:chartSettings="chartSettings"
						:chartExtend="leftchartExtend"
					></vline>
				</el-col>
				<el-col :span="12" class="v-el-col">
					<vline
						:chartData="right"
						:chartSettings="chartSettings"
						:chartExtend="rightchartExtend"
					></vline>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import gridtitle from "../../components/title/index";
import vline from "../../components/v-chart/line/index";
import { mapGetters, mapActions, mapState } from "vuex";

import { toDecimal } from "@/utils/util";

export default {
	watch: {
		"dashboard.paymail"(val) {
			this.setLeftData(val.left);
			this.setRightData(val.right);
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
			cid: this.$store.getters.shopInfos.id,
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
				// area: false
			},
			leftchartExtend: {
				tooltip: "test",
				color: "rgba(71, 225, 255, 0.15)",
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
						},
					},
					axisLabel: {
						fontSize: screen.width==1280 || screen.width==1366 ? 8 : screen.width==1440 || screen.width==1600 ? 10 : 12,
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
					axisLabel: {
						fontSize: screen.width==1280 || screen.width==1366 ? 8 : screen.width==1440 || screen.width==1600 ? 10 : 12,
					}
					// minInterval: 1
				},
				tooltip: {
					formatter: params => {
						let item = params[0],
							list = item.data;
						var dotHtml = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color}"></span>`;
						return `${dotHtml}${list[0]} <br/>&nbsp&nbsp&nbsp${
							item.seriesName == "金额" ? "支付金额" : "浏览次数"
						}: &nbsp${list[1]}`;
					}
				}
			},
			rightchartExtend: {
				tooltip: "test",
				color: "rgba(71, 225, 255, 0.15)",
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
					},
					axisLabel: {
						fontSize: screen.width==1280 || screen.width==1366 ? 8 : screen.width==1440 || screen.width==1600 ? 10 : 12,
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
					axisLabel: {
						fontSize: screen.width==1280 || screen.width==1366 ? 8 : screen.width==1440 || screen.width==1600 ? 10 : 12,
					},
					minInterval: 1
				},
				tooltip: {
					formatter: params => {
						let item = params[0],
							list = item.data;
						var dotHtml = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color}"></span>`;
						return `${dotHtml}${list[0]} <br/>&nbsp&nbsp&nbsp${
							item.seriesName == "金额" ? "支付金额" : "浏览次数"
						}: &nbsp${list[1]}`;
					}
				}
			},
			left: {},
			right: {},
			toDecimal: toDecimal
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
		...mapActions(["paymaillist"]),
		async init() {
			let parames = { ...this.invokeType, cid: this.cid };
			let left = await this._apis.dashboard.payamount(parames);
			let right = await this._apis.dashboard.mail(parames);
			this.paymaillist({ left: JSON.parse(left) });
			this.paymaillist({ right: JSON.parse(right) });
		},
		setLeftData(val) {
			let result = {
				columns: ["日期", "金额"]
			};

			this.left = {
				...result,
				rows: this.setRowsleft(val)
			};
		},
		setRowsleft(val) {
			let rows = [];
			let y = val.paid_order_am_td_7d;
			let x = val.x;
			for (var j = 0; j < y.length; j++) {
				rows.push({
					日期: x[j],
					金额: toDecimal(y[j])
				});
			}

			return rows;
		},
		setRightData(val) {
			let result = {
				columns: ["日期", "访客"]
			};

			this.right = {
				...result,
				rows: this.setRowsright(val)
			};
		},
		setRowsright(val) {
			let rows = [];
			let y = val.pv_7d;
			let x = val.x;
			for (var j = 0; j < y.length; j++) {
				rows.push({
					日期: x[j],
					访客: y[j]
				});
			}

			return rows;
		}
		// toDecimal(x) {
		// 	var f = parseFloat(x);
		// 	if (isNaN(f)) {
		// 		return false;
		// 	}
		// 	var f = Math.round(x * 100) / 100;
		// 	var s = f.toString();
		// 	var rs = s.indexOf(".");
		// 	if (rs < 0) {
		// 		rs = s.length;
		// 		s += ".";
		// 	}
		// 	while (s.length <= rs + 2) {
		// 		s += "0";
		// 	}
		// 	return s;
		// }
	}
};
</script>
