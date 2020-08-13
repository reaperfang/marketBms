<template>
	<div class="realtime-user">
		<el-table :data="tableData">
			<el-table-column prop="date" label="日期" width="180">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="180">
			</el-table-column>
			<el-table-column prop="address" label="地址"> </el-table-column>
		</el-table>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

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
	components: {},
	data: function() {
		return {
			tableData: [
				{
					date: "2016-05-02",
					name: "王小虎",
					address: "上海路 1518 弄"
				},
				{
					date: "2016-05-04",
					name: "王小虎",
					address: "上海市路 1517 弄"
				},
				{
					date: "2016-05-01",
					name: "王小虎",
					address: "上海市"
				},
				{
					date: "2016-05-03",
					name: "王小虎",
					address: "上海市普江路 1516 弄"
				}
			]
		};
	},
	computed: {
		//...mapState([""])
	},
	mounted() {},
	beforeCreate() {},
	created() {},
	beforeMount() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	destroyed: function() {},
	methods: {
		//...mapActions([""]),
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
