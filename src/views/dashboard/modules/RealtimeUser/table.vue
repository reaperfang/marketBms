<template>
	<div class="realtime-user">
		<el-table
			:data="newtable"
			:row-style="{ height: '10px' }"
			:cell-style="{ padding: '3px 0' }"
		>
			<el-table-column label="用户名" width="100">
				<template slot-scope="scope">
					<span class="time-text">{{ scope.row.c_uv_name_rt }}</span>
				</template>
			</el-table-column>
			<el-table-column label="时间" width="100">
				<template slot-scope="scope">
					<span class="time-text">{{ scope.row.time_rt }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="op_rt" label="操作" width="70">
			</el-table-column>
			<el-table-column label="商品">
				<template slot-scope="scope">
					<span
						class="time-text"
						v-tooltip.left="{
							content: scope.row.pd_rt,
							class: 'tooltip-custom tooltip-other-custom'
						}"
						>{{ scope.row.pd_rt }}</span
					>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";

export default {
	watch: {
		tableData(newVal, oldVal) {
			this.newtable = this.setNewTable(newVal);
			this.setHightLight(newVal, oldVal);
		}
	},
	props: ["tableData"],
	components: {},
	data: function() {
		return {
			newtable: []
		};
	},
	computed: {
		...mapState(["dashboard"])
	},
	mounted() {
		//setInterval(this.scroll, 1000);
	},
	beforeCreate() {},
	created() {},
	beforeMount() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	destroyed: function() {},
	methods: {
		...mapActions(["hightlist"]),
		setNewTable(val) {
			return val.slice(0, 5).map(item => {
				return {
					...item,
					time_rt: item.time_rt.split(" ")[1].substring(0, 8)
				};
			});
		},
		setHightLight(newtable, oldTable) {
			let newOrder = newtable
				.filter(item => {
					return item.op_rt == "下单";
				})
				.map(item => {
					return JSON.stringify(item);
				});

			let oldOrder = oldTable
				.filter(item => {
					return item.op_rt == "下单";
				})
				.map(item => {
					return JSON.stringify(item);
				});

			let difference = _.difference(newOrder, oldOrder);

			if (difference.length == 0) {
				return;
			}
			this.hightlist(difference);
		},
		scroll() {
			//this.animate = true; // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
			setTimeout(() => {
				//  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
				this.tableData.push(this.tableData[0]); // 将数组的第一个元素添加到数组的
				this.tableData.shift(); //删除数组的第一个元素
				// this.tableData.push(this.tableData[this.tableData.length - 1]);
				// this.tableData.pop();
				//this.animate = false; // margin-top 为0 的时候取消过渡动画，实现无缝滚动

				// this.newtable = this.tableData.slice(0, 4);

				this.newtable = this.tableData.slice(0, 4).map(item => {
					return {
						...item,
						time_rt: item.time_rt.split(" ")[1]
					};
				});
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

		// .atooltip.el-tooltip__popper[x-placement^="top"] .popper__arrow {
		// 	border-top-color: pink;
		// }
		// .atooltip.el-tooltip__popper[x-placement^="top"] .popper__arrow:after {
		// 	border-top-color: pink;
		// }
		// .atooltip {
		// 	background: pink !important;
		// }
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
		font-size: 12px;
	}
}

// /* custom CSS */
// .vue-tooltip.tooltip-custom {
// 	background-color: red;
// }

// .vue-tooltip.tooltip-custom .tooltip-arrow {
// 	border-color: red;
// }

@media screen and(max-width: 1920px) and(max-height: 1080px){
	.realtime-user {
		/* margin-top: -6px!important; */
		.el-table__header th .cell{
			font-size: 12px;
		}
		.el-table__body td .cell{
			font-size: 12px;
		}
	}
	.el-table--small th {
		padding: 0;
	}
}

@media screen and(max-width: 1600px) and(max-height: 900px){
	.realtime-user {
		.el-table__header th .cell{
			font-size: 12px;
			transform: scale(0.83);
		}
		.el-table__body td .cell{
			font-size: 12px;
			transform: scale(0.83);
		}
	}
	.el-table--small th {
		padding: 0;
	}
}

@media screen and(max-width: 1440px) and(max-height: 900px){
	.realtime-user {
		.el-table__header th .cell{
			font-size: 12px;
			transform: scale(0.83);
		}
		.el-table__body td .cell{
			font-size: 12px;
			transform: scale(0.83);
			height: 17px;
		}
	}
	.el-table--small th {
		padding: 0;
	}
}

@media screen and(max-width: 1366px){
	.realtime-user {
		.el-table .cell {
			line-height: 15px;
		}
		.el-table__header th .cell{
			font-size: 12px;
			transform: scale(0.83);
		}
		.el-table__body td .cell{
			font-size: 12px;
			transform: scale(0.83);
			transform-origin: top;
			height: 13px;
		}
	}
}

@media screen and(max-width: 1280px){
	/* .realtime-user {
		.el-table .cell {
			line-height: 15px;
		}
		.el-table__header th .cell{
			font-size: 12px;
			transform: scale(0.83);
		}
		.el-table__body td .cell{
			font-size: 12px;
			transform: scale(0.83);
			transform-origin: top;
			height: 13px;
		}
	} */
}
</style>
