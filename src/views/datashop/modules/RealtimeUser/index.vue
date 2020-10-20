<template>
	<div class="row-4-grid-content flex-box">
		<div class="titile">
			<el-row type="flex" justify="space-between" class="item-title">
				<el-col :span="12">
					<gridtitle :title="'实时交易用户'"></gridtitle>
				</el-col>
				<el-col :span="12"> </el-col>
			</el-row>
		</div>
		<div class="content">
			<vtable class="item-content" :tableData="tableData"></vtable>
		</div>
	</div>
</template>

<script>
import gridtitle from "../..//components/title/index";
import vtable from "./table";
import { mapGetters, mapActions, mapState } from "vuex";

export default {
	watch: {
		"dashboard.realtimeuser"(val) {
			this.tableData = val.map((item, index) => {
				return {
					...item,
					id: index + 1
				};
			});
		}
	},
	props: {
		// data: {
		//   type: Object,
		//   default: false
		// }
	},
	components: { gridtitle, vtable },
	data: function() {
		return {
			//cid: JSON.parse(localStorage.getItem("shopInfos")).id,
			tableData: []
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
		...mapActions(["realtimeuserlist"]),
		async init() {
			let parames = { ...this.invokeType, cid: this.cid };

			//let res = await this._apis.dashboard.realdealuser(parames);
			let res =
				'[{"c_uv_name_rt":"暴躁的小王同学\uD83D\uDE4A","time_rt":"2020-10-20 09:43:03.0","op_rt":"下单","pd_rt":"华为nova7手机华为nova7手机华为nova7手机华为nova7手机华为nova7手机华为nova7手机华为nova","pro_code_rt":"130000","city_code_rt":"130100","county_code_rt":"130102","pro_name_rt":"河北","county_name_rt":"长安区","city_name_rt":"石家庄市"},{"c_uv_name_rt":"暴躁的小王同学\uD83D\uDE4A","time_rt":"2020-10-20 09:42:48.0","op_rt":"支付","pd_rt":"丝蕴洗发水+护发素","pro_code_rt":"130000","city_code_rt":"130100","county_code_rt":"130102","pro_name_rt":"河北","county_name_rt":"长安区","city_name_rt":"石家庄市"},{"c_uv_name_rt":"暴躁的小王同学\uD83D\uDE4A","time_rt":"2020-10-20 09:42:48.0","op_rt":"下单","pd_rt":"丝蕴洗发水+护发素","pro_code_rt":"130000","city_code_rt":"130100","county_code_rt":"130102","pro_name_rt":"河北","county_name_rt":"长安区","city_name_rt":"石家庄市"},{"c_uv_name_rt":"暴躁的小王同学\uD83D\uDE4A","time_rt":"2020-10-20 09:42:34.0","op_rt":"支付","pd_rt":"商品55","pro_code_rt":"130000","city_code_rt":"130100","county_code_rt":"130102","pro_name_rt":"河北","county_name_rt":"长安区","city_name_rt":"石家庄市"},{"c_uv_name_rt":"暴躁的小王同学\uD83D\uDE4A","time_rt":"2020-10-20 09:42:34.0","op_rt":"下单","pd_rt":"商品55","pro_code_rt":"130000","city_code_rt":"130100","county_code_rt":"130102","pro_name_rt":"河北","county_name_rt":"长安区","city_name_rt":"石家庄市"}]';
			this.realtimeuserlist(JSON.parse(res));
		}
	}
};
</script>

<style lang="scss">
.realtime-user {
	height: 100%;

	.el-table,
	.el-table th,
	.el-table tbody,
	.el-table tr {
		background: #000b23;
	}

	// 斑马线背景
	// .el-table--striped .el-table__body tr.el-table__row--striped td {
	// 	background: RGBA(26, 39, 61, 1);
	// }

	//修改表格鼠标悬浮hover背景色
	.el-table--enable-row-hover .el-table__body tr:hover > td {
		background: RGBA(26, 39, 61, 1);
	}

	.el-table thead {
		color: #06c9dd;
	}
	//修改表格内容部分字体颜色
	.el-table {
		color: rgba(255, 255, 255, 1);
	}

	.el-table td,
	.el-table th,
	.building-top .el-table th.is-leaf {
		text-align: center;
		height: 1px;
		border: 1px solid rgba(6, 201, 221, 0.1);
	}
	//修改表格最底部颜色和高度
	.el-table::before {
		height: 0;
	}
}
</style>
