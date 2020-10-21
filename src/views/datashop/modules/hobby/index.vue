<template>
	<div class="row-3-grid-content flex-column flex-box">
		<div class="title">
			<el-row type="flex" justify="space-between" class="item-title">
				<el-col :span="12">
					<gridtitle :title="'用户交易偏好'"></gridtitle>
				</el-col>
				<el-col :span="12"> </el-col>
			</el-row>
		</div>
		<div class="content">
			<vcap></vcap>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import gridtitle from "../../components/title/index";
import vcap from "../../components/v-chart/cap/index";

export default {
	watch: {
		// flowData(val) {
		// }
	},
	props: {
		// data: {
		//   type: Object,
		//   default: false
		// }
	},
	components: { gridtitle, vcap },
	data: function() {
		return {
			//cid: JSON.parse(localStorage.getItem("shopInfos")).id,
			boddy: []
		};
	},
	computed: {
		//...mapState([""])
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
		...mapActions(["hobbylist"]),
		async init() {
			let parames = { ...this.invokeType, cid: this.cid };
			//let resstatistics = await this._apis.dashboard.statistics(parames);
			this.hobbylist(
				JSON.parse(
					'{"goods_type_name":[{"goods_type_name":"果蔬生鲜","paid_order_am_cl":1.135859E7},{"goods_type_name":"休闲食品","paid_order_am_cl":9274995.0},{"goods_type_name":"家具装饰","paid_order_am_cl":6001397.0},{"goods_type_name":"大小家电","paid_order_am_cl":603498.0},{"goods_type_name":"酒水茶叶","paid_order_am_cl":249874.77}],"c_uv":1480.0,"c_uv_phone":1193.0,"c_uv_share_phone":0.80608}'
				)
			);
		}
	}
};
</script>
<style lang="scss">
// .main-box {
// 	position: relative;
// 	width: 100%;
// 	height: 100%;
// 	.title {
// 		width: 100%;
// 		height: 43px;
// 		// background: #29f0bf;
// 	}
// 	.content {
// 		width: 100%;
// 		position: absolute;
// 		top: 43px;
// 		bottom: 0px;
// 		left: 0px;
// 		// background: #f09529;
// 	}
// }
</style>
