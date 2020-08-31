<template>
	<div class="row-3-grid-content middle-grid-margin flex-column">
		<el-row type="flex" justify="space-between" class="item-title">
			<el-col :span="12">
				<gridtitle :title="'支付金额(最近七天'"></gridtitle>
			</el-col>
			<el-col :span="12">
				<gridtitle :title="'商城浏览(最近七天)'"></gridtitle>
			</el-col>
		</el-row>
		<el-row class="item-content">
			<el-col :span="12" class="v-el-col">
				<vline
					:chartData="left"
					:chartSettings="chartSettings"
					:chartExtend="chartExtend"
				></vline>
			</el-col>
			<el-col :span="12" class="v-el-col">
				<vline
					:chartData="right"
					:chartSettings="chartSettings"
					:chartExtend="chartExtend"
				></vline>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import gridtitle from "../../components/title/index";
import vline from "../../components/v-chart/line/index";
import { mapGetters, mapActions, mapState } from "vuex";

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
			cid: JSON.parse(localStorage.getItem("shopInfos")).id,
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
			chartExtend: {
				color: "rgba(71, 225, 255, 0.15)",
				grid: {
					top: "30px",
					bottom: "7px"
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
					}
				}
			},
			left: {},
			right: {}
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
			let parames = { cid: this.cid };
			let left = await this._apis.dashboard.payamount(parames);
			let right = await this._apis.dashboard.mail(parames);
			this.paymaillist({ left: left });
			this.paymaillist({ right: right });
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
					金额: y[j]
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
	}
};
</script>
