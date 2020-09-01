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
					<el-col :span="24">
						<gridtitle :title="'商城成交来源TOP3'"></gridtitle>
					</el-col>
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
			endVal: 1000000,
			chartData: [
				// { progress: 75, barColor: "RGBA(255, 0, 139, 1)", city: "北京" },
				// { progress: 70, barColor: "RGBA(255, 92, 49, 1)", city: "上海" },
				// { progress: 95, barColor: "RGBA(245, 159, 0, 1)", city: "深圳" },
			],
			cid: JSON.parse(localStorage.getItem("shopInfos")).id,
			payData: {}
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
		...mapActions(["toplist", "amoountlist"]),
		async init() {
			let parames = { cid: this.cid };

			let resTop = await this._apis.dashboard.top3(parames);
			this.toplist(resTop.top3);

			let resPay = await this._apis.dashboard.realtimedealamount(parames);
			this.amoountlist(resPay);
		},
		setPieData(val) {
			this.chartData = val.map(res => {
				return {
					progress: parseFloat(res.place_order_am_s) * 100,
					barColor: "RGBA(255, 0, 139, 1)",
					city: res.area_name
				};
			});
		},
		setPayData(val) {
			this.payData = [
				{
					children: [
						{ title: "支付人数", content: val.paid_order_nu_rt },
						{ title: "支付金额", content: val.paid_order_am_rt },
						{ title: "客单价", content: val.atv_rt }
					]
				},
				{
					children: [
						{ title: "支付订单数", content: val.paid_order_cq_rt },
						{ title: "退款金额", content: val.refund_am_rt },
						{ title: "退款订单数", content: val.refund_cq_rt }
					]
				}
			];
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
