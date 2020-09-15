<template>
	<div class="realtime-user">
		<!-- <el-table :data="newtable" :row-style="{ height: '20px' }">
			<el-table-column prop="id" label="ID" width="50"> </el-table-column>
			<el-table-column prop="c_uv_name_rt" label="姓名" width="130">
			</el-table-column>
			<el-table-column prop="pd_rt" label="商品" width="200">
			</el-table-column>
			<el-table-column prop="op_rt" label="操作"> </el-table-column>
		</el-table> -->

		<el-table :data="newtable" :row-style="{ height: '20px' }">
			<!-- <el-table-column prop="id" label="ID" width="45"> </el-table-column> -->
			<el-table-column prop="c_uv_name_rt" label="用户名" width="120">
			</el-table-column>
			<el-table-column label="时间" width="120">
				<template slot-scope="scope">
					<span class="time-text">{{ scope.row.time_rt }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="op_rt" label="操作"> </el-table-column>
			<el-table-column label="商品" width="160">
				<template slot-scope="scope">
					<span class="time-text">{{ scope.row.pd_rt }}</span>
				</template>
			</el-table-column>
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
	props: ["tableData"],
	components: {},
	data: function() {
		return {
			// tableData: [
			//   {
			//     date: "2016-05-02",
			//     name: "王小虎1",
			//     address: "上海路 1518 弄",
			//     id: 1,
			//   },
			//   {
			//     date: "2016-05-04",
			//     name: "王小虎2",
			//     address: "上海市路 1517 弄",
			//     id: 2,
			//   },
			//   {
			//     date: "2016-05-01",
			//     name: "王小虎3",
			//     address: "上海市",
			//     id: 3,
			//   },
			//   {
			//     date: "2016-05-03",
			//     name: "王小虎4",
			//     address: "上海市普江路 1516 弄",
			//     id: 4,
			//   },
			//   {
			//     date: "2016-05-02",
			//     name: "王小虎5",
			//     address: "上海路 1518 弄",
			//     id: 5,
			//   },
			//   {
			//     date: "2016-05-04",
			//     name: "王小虎6",
			//     address: "上海市路 1517 弄",
			//     id: 6,
			//   },
			//   {
			//     date: "2016-05-01",
			//     name: "王小虎7",
			//     address: "上海市",
			//     id: 7,
			//   },
			//   {
			//     date: "2016-05-03",
			//     name: "王小虎8",
			//     address: "上海市普江路 1516 弄",
			//     id: 8,
			//   },
			// ],

			newtable: []
		};
	},
	computed: {
		//...mapState([""])
	},
	mounted() {
		setInterval(this.scroll, 1000);
	},
	beforeCreate() {},
	created() {},
	beforeMount() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	destroyed: function() {},
	methods: {
		//...mapActions([""]),
		scroll() {
			//this.animate = true; // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
			setTimeout(() => {
				//  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
				this.tableData.push(this.tableData[0]); // 将数组的第一个元素添加到数组的
				this.tableData.shift(); //删除数组的第一个元素
				//this.animate = false; // margin-top 为0 的时候取消过渡动画，实现无缝滚动

				this.newtable = this.tableData.slice(0, 4);
			}, 1000);
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
		width: 100% !important;
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
	.anim {
		transition: all 0.5s;
		margin-top: -30px;
	}

	.time-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
