<template>
	<div class="row-3-grid-content  flex-column">
		<el-row type="flex" justify="space-between" class="item-title">
			<el-col :span="12">
				<gridtitle :title="'总交易金额分布'"></gridtitle>
			</el-col>
			<el-col :span="12">
				<gridtitle :title="'客单价(最近七天)'"></gridtitle>
			</el-col>
		</el-row>
		<el-row class="item-content">
			<el-col :span="12" class="v-el-col">
				<vhistogram :chartData="left"></vhistogram>
			</el-col>
			<el-col :span="12" class="v-el-col">
				<vhistogram :chartData="right"></vhistogram>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import gridtitle from "../..//components/title/index";
import vhistogram from "../../components/v-chart/histogram/index";
import { mapGetters, mapActions, mapState } from "vuex";

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
			cid: JSON.parse(localStorage.getItem("shopInfos")).id,
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
				columns: ["日期", "金额"],
				rows: []
			},
			right: {
				columns: ["日期", "客单价"],
				rows: []
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
		...mapActions(["trasationlist"]),
		async init() {
			let parames = { cid: this.cid };

			let left = await this._apis.dashboard.totalamount(parames);
			this.trasationlist({ left: left });
			let right = await this._apis.dashboard.price(parames);
			this.trasationlist({ right: right });
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
					金额: y[j]
				});
			}

			return result;
		},
		setRowsright(val) {
			console.log('setRowsright(val) {',val);
			if(!val){
				return;
			}
			let result = [];
			let y = val.atv_td_7d;
			let x = val.x;

			for (var j = 0; j < y.length; j++) {
				result.push({
					日期: x[j],
					客单价: parseFloat(y[j])
				});
			}

			return result;
		}
	}
};
</script>
