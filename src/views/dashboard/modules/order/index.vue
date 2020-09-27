<template>
	<div class="row-3-grid-content flex-box">
		<div class="titile">
			<el-row type="flex" justify="space-between" class="item-title">
				<el-col :span="12">
					<gridtitle :title="'下单转化漏斗(最近七天)'"></gridtitle>
				</el-col>
				<el-col :span="12"> </el-col>
			</el-row>
		</div>
		<div class="content">
			<vfunnel
				:chartData="lineargroup"
				:chartSettings="chartSettings"
				:chartExtend="chartExtend"
				ref="vfunnel"
				class="item-content"
			></vfunnel>
		</div>
	</div>
</template>

<script>
import gridtitle from "../../components/title/index";
import vfunnel from "../../components/v-chart/funnel/index";
import { mapGetters, mapActions, mapState } from "vuex";

export default {
	watch: {
		"dashboard.order"(val) {
			this.lineargroup = val;
			this.$refs.vfunnel.showChart(this.lineargroup);
		}
	},
	props: {
		// data: {
		//   type: Object,
		//   default: false
		// }
	},
	components: { vfunnel, gridtitle },
	data: function() {
		return {
			cid: JSON.parse(localStorage.getItem("shopInfos")).id,
			chartData: {
				columns: ["状态", "数值"],
				rows: [
					{ 状态: "展示", 数值: 900 },
					{ 状态: "访问", 数值: 600 },
					{ 状态: "点击", 数值: 300 },
					{ 状态: "订单", 数值: 100 }
				]
			},
			chartSettings: {
				// label: {
				// 	show: true,
				// 	position: "inside"
				// }
			},
			chartExtend: {},
			lineargroup: []
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
		...mapActions(["orderlist"]),
		async init() {
			let parames = { ...this.invokeType, cid: this.cid };
			let data = await this._apis.dashboard.order(parames);
			let res = JSON.parse(data);

			var chart = [
				{
					value: 60, // 转换率
					name: "下单转换率", // 转换率名称
					oriname: "访问人数",
					number: res.uv_7d
					// color: ["rgba(255,198,82,0.6)", "rgba(255,198,82,0)"]
				},
				{
					value: 40, //paid_c_order_7dco
					name: "下单支付转化率",
					oriname: "下单人数",
					number: res.order_c_uv_7d
					// color: ["rgba(255,110,115,0.5)", "rgba(255,110,115,0)"]
				},
				{
					value: 20, //paid_c_uv_7dco
					name: "支付转化率",
					oriname: "支付人数",
					number: res.paid_order_number_7d
					//  color: ["rgba(134,131,230,0.4)", "rgba(134,131,230,0)"]
				}
			];

			// 				参数名称 参数说明 类型 schema
			// order_c_uv_7d 下单人数 integer(int32) integer(int32)
			// order_c_uv_7dco 下单转化率 number(float) number(float)
			// paid_c_order_7dco 下单支付转化率 number(float) number(float)
			// paid_c_uv_7dco 支付转化率 number(float) number(float)
			// paid_order_number_7d 支付人数 integer(int32) integer(int32)
			// uv_7d 访问人数 integer(int32) integer(int32)



			// this.orderlist({
			// 	chart: chart,
			// 	youcejiantouData: {
			// 		order_c_uv_7dco: parseInt(
			// 			res.order_c_uv_7dco.toFixed(2) * 100
			// 		),
			// 		paid_c_order_7dco: parseInt(
			// 			res.paid_c_order_7dco == -9999
			// 				? 0
			// 				: res.paid_c_order_7dco.toFixed(2) * 100
			// 		),
			// 		paid_c_uv_7dco: parseInt(
			// 			res.paid_c_uv_7dco.toFixed(2) * 100
			// 		)
			// 	}
			// });


					this.orderlist({
				chart: chart,
				youcejiantouData: {
					order_c_uv_7dco:
						(res.order_c_uv_7dco*100).toFixed(2)
					,
					paid_c_order_7dco: 
						res.paid_c_order_7dco == -9999
							? 0
							: (res.paid_c_order_7dco*100).toFixed(2)
					,
					paid_c_uv_7dco: 
						(res.paid_c_uv_7dco*100).toFixed(2)
					
				}
			});
		}
	}
};
</script>
