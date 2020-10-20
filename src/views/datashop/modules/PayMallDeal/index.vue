<template>
	<div class="grid-content  flex-column">
		<el-row type="flex" justify="space-between" class="item-start">
			<el-col :span="24">
				<vpay :payData="payData"></vpay>
			</el-col>
		</el-row>
		<el-row class="item-end">
			<div class="maill-deal-s">
				<el-row class="box-item-start">
					<el-col :span="12">
						<gridtitle :title="'商城成交来源TOP3'"></gridtitle>
					</el-col>
					<el-col :span="12"> </el-col>
				</el-row>
				<div class="box-item-end">
					<el-row class="fill-height">
						<el-col
							v-for="(item, index) in chartData"
							:key="index"
							:span="8"
							class="v-el-col"
							><div
								class="grid-content-box bg-purple"
								:style="index == 2 ? '' : 'margin-right:3px'"
							>
								<pchart
									:progress="item.progress"
									:city="item.city"
									:barColor="item.barColor"
									:top="index + 1"
								></pchart>
								<!-- <echartprogress></echartprogress> -->
							</div></el-col
						>
					</el-row>
				</div>
			</div>
		</el-row>
	</div>
</template>

<script>
import gridtitle from "../../components/title/index";
import vpay from "../../components/pay/index";
// import pchart from "../../components/v-chart/canvaspersent/index";
import pchart from "../../components/v-chart/pie/index"; //v-chart
import echartprogress from "../../components/echart/progress/index";
import { mapGetters, mapActions, mapState } from "vuex";

import { toDecimal } from "@/utils/util";

export default {
	watch: {
		"dashboard.top3"(val) {
			this.setPieData(val);
		},
		"dashboard.amount"(val) {
			this.setPayData(val);
		}
	},
	props: {
		// data: {
		//   type: Object,
		//   default: false
		// }
	},
	components: { gridtitle, vpay, pchart, echartprogress },
	data: function() {
		return {
			startVal: 0,
			endVal: 0,
			chartData: [
				// { progress: 75, barColor: "RGBA(255, 0, 139, 1)", city: "北京" },
				// { progress: 70, barColor: "RGBA(255, 92, 49, 1)", city: "上海" },
				// { progress: 95, barColor: "RGBA(245, 159, 0, 1)", city: "深圳" },
			],
			//cid: JSON.parse(localStorage.getItem("shopInfos")).id,
			payData: {},
			defaultChart: [
				{
					progress: 0,
					barColor: "RGBA(255, 0, 139, 1)",
					city: "北京"
				},
				{
					progress: 0,
					barColor: "RGBA(255, 92, 49, 1)",
					city: "上海"
				},
				{
					progress: 0,
					barColor: "RGBA(245, 159, 0, 1)",
					city: "广州"
				}
			],
			toDecimal: toDecimal
		};
	},
	computed: {
		...mapState(["dashboard"])
	},
	mounted() {
		this.init();
		var IntervalId = window.setInterval(() => {
			this.init();
		}, 10000);
	},
	beforeCreate() {},
	created() {},
	beforeMount() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	destroyed: function() {},
	methods: {
		...mapActions(["toplist", "amoountlist"]),
		async init() {
			let parames = { ...this.invokeType, cid: this.cid };

			//let resTop = await this._apis.dashboard.top3(parames);
			let resTop =
				'{"top3":[{"place_order_am":2.2908659977E8,"area_name":"北京","place_order_area":1.9547335971E8,"place_order_am_s":0.85327},{"place_order_am":2.2908659977E8,"area_name":"内蒙古","place_order_area":3.288671007E7,"place_order_am_s":0.14356},{"place_order_am":2.2908659977E8,"area_name":"四川","place_order_area":419874.01,"place_order_am_s":0.00183}]}';
			this.toplist(JSON.parse(resTop).top3);

			//let resPay = await this._apis.dashboard.realtimedealamount(parames);
			let resPay =
				'{"place_order_am_rt":9952.0,"place_order_am_rgrt":1.52675,"paid_order_nu_rt":1,"paid_order_am_rt":2952.0,"atv_rt":2952.0,"paid_order_cq_rt":9,"refund_am_rt":0.0,"refund_cq_rt":0.0}';
			this.amoountlist(JSON.parse(resPay));
		},
		setPieData(val) {
			if (!val) {
				this.chartData = this.defaultChart;
				return;
			}
			this.chartData = val.map((item, index) => {
				return {
					// progress: parseInt(res.place_order_am_s.toFixed(2) * 100),
					// progress: (res.place_order_am_s.toFixed(2) * 100).toFixed(
					// 	2
					// ),
					progress: (item.place_order_am_s * 100).toFixed(2),
					//barColor: "RGBA(255, 0, 139, 1)",
					barColor: this.setbarColor(index),
					city: item.area_name
				};
			});
		},
		setPayData(val) {
			this.payData = [
				{
					children: [
						{ title: "支付人数", content: val.paid_order_nu_rt },
						{
							title: "支付金额",
							content: this.toDecimal(val.paid_order_am_rt)
						},
						{
							title: "客单价",
							content: this.toDecimal(val.atv_rt)
						}
					]
				},
				{
					children: [
						{ title: "支付订单数", content: val.paid_order_cq_rt },
						{
							title: "退款金额",
							content: this.toDecimal(val.refund_am_rt)
						},
						{ title: "退款订单数", content: val.refund_cq_rt }
					]
				}
			];
		},
		setbarColor(val) {
			let result = "";
			switch (val) {
				case 0:
					result = "#FF008B";
					break;
				case 1:
					result = "#FF5C31";
					break;
				case 2:
					result = "#F59f00";
					break;
				default:
			}

			return result;
		}
	}
};
</script>
<style lang="scss" scoped>
.maill-deal-s {
	// background: yellow;
	height: 100%;
	.box-item-start {
		height: 43px;
	}

	.box-item-end {
		// background: red;
		margin: 0 8px;
		position: absolute;
		top: 43px;
		left: 0;
		bottom: 0;
		right: 0;

		// .bg-purple {
		// 	background: #d3dce6;
		// }
		// .bg-purple-light {
		// 	background: #e5e9f2;
		// }

		.grid-content-box {
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.v-el-col {
			height: 100%;
		}

		.fill-height {
			height: 100%;
		}
	}
}
</style>
