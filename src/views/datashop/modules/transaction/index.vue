<template>
	<div class="row-3-grid-content  flex-box">
		<div class="titile">
			<el-row type="flex" justify="space-between">
				<el-col :span="12">
					<gridtitle :title="'总交易金额分布'"></gridtitle>
				</el-col>
				<el-col :span="12">
					<gridtitle :title="'客单价(最近七天)'"></gridtitle>
				</el-col>
			</el-row>
		</div>
		<div class="content">
			<el-row class="item-content">
				<el-col :span="12" class="v-el-col">
					<vhistogram :chartData="left"></vhistogram>
				</el-col>
				<el-col :span="12" class="v-el-col">
					<vhistogram :chartData="right"></vhistogram>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import gridtitle from "../..//components/title/index";
import vhistogram from "../../components/v-chart/histogram/index";
import { mapGetters, mapActions, mapState } from "vuex";
import { toDecimal } from "@/utils/util";

export default {
	watch: {
		"dashboard.transation"(val) {
			this.setChartDataleft(val.left);
			this.setChartDataright(val.right);
		}
	},
	props: {
		// data: {
		//   type: Object,
		//   default: false
		// }
	},
	components: { gridtitle, vhistogram },
	data: function() {
		return {
			//cid: JSON.parse(localStorage.getItem("shopInfos")).id,
			chartData: {
				columns: ["日期", "访问用户"],
				rows: []
				// 	rows: [
				// 		{
				// 			日期: "1/1",
				// 			访问用户: 1393
				// 		},
				// 		{
				// 			日期: "1/2",
				// 			访问用户: 3530
				// 		},
				// 		{
				// 			日期: "1/3",
				// 			访问用户: 2923
				// 		},
				// 		{
				// 			日期: "1/4",
				// 			访问用户: 1723
				// 		},
				// 		{
				// 			日期: "1/5",
				// 			访问用户: 3792
				// 		},
				// 		{
				// 			日期: "1/6",
				// 			访问用户: 4593
				// 		}
				// 	]
			},
			left: {
				columns: ["日期", "数量"],
				rows: []
			},
			right: {
				columns: ["日期", "客单价"],
				rows: []
			},
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
		...mapActions(["trasationlist"]),
		async init() {
			let parames = { ...this.invokeType, cid: this.cid };

			//et left = await this._apis.dashboard.totalamount(parames);
			this.trasationlist({
				left: JSON.parse(
					'{"x":["0-20元","20-50元","50-100元","100-300元","300元以上"],"order_cquantity_price":[1831.0,144.0,24.0,934.0,604.0]}'
				)
			});
			//let right = await this._apis.dashboard.price(parames);
			this.trasationlist({
				right: JSON.parse(
					'{"x":["10.13","10.14","10.15","10.16","10.17","10.18","10.19"],"atv_td_7d":[0.0,2106.61,2798.33333,29979.75,0.0,0.0,841.165]}'
				)
			});
		},
		setChartDataleft(val) {
			this.left = {
				...this.left,
				rows: this.setRowsleft(val)
			};
		},
		setChartDataright(val) {
			this.right = {
				...this.right,
				rows: this.setRowsright(val)
			};
		},
		setRowsleft(val) {
			let result = [];
			let y = val.order_cquantity_price;
			let x = val.x;

			for (var j = 0; j < y.length; j++) {
				result.push({
					日期: x[j],
					数量: y[j]
				});
			}

			return result;
		},
		setRowsright(val) {
			if (!val) {
				return;
			}
			let result = [];
			let y = val.atv_td_7d;
			let x = val.x;

			for (var j = 0; j < y.length; j++) {
				result.push({
					日期: x[j],
					客单价: this.toDecimal(parseFloat(y[j]))
				});
			}

			return result;
		}
	}
};
</script>
