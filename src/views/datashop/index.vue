<template>
	<div class="mall" id="mall">
		<vhead></vhead>
		<el-row class="row-2">
			<el-col :span="7" class="el-col">
				<useragemobilemember></useragemobilemember>
			</el-col>
			<el-col :span="10" class="el-col">
				<todayuserdeal></todayuserdeal>
			</el-col>
			<el-col :span="7" class="el-col">
				<paymalldeal></paymalldeal>
			</el-col>
		</el-row>

		<!-- <el-row class="row-3">
			<el-col :span="7">
				<boddy></boddy>
			</el-col>
			<el-col :span="10">
				<mallvistors></mallvistors>
			</el-col>
			<el-col :span="7">
				<transaction></transaction>
			</el-col>
		</el-row> -->

		<!-- <el-row class="row-4">
			<el-col :span="7">
				<order></order>
			</el-col>
			<el-col :span="10">
				<mallhistory></mallhistory>
			</el-col>
			<el-col :span="7">
				<realtimeuser></realtimeuser>
			</el-col>
		</el-row> -->
	</div>
</template>

<script>
import vhead from "./components/head/index";
import gridtitle from "./components/title/index";

//module

import useragemobilemember from "./modules/UserAgeMobileMember/index";

//今日交易金额 用户交易分别
import todayuserdeal from "./modules/TodayUserDeal/index";

// 支付 商城交易分布 商城成交来源TOP3
import paymalldeal from "./modules/PayMallDeal/index";
//实时交易用户
import realtimeuser from "./modules/RealtimeUser/index";

//商城访客(最近七天)
import mallvistors from "./modules/MallVistors/index";

//总交易金额分布 客单价近七天
import transaction from "./modules/transaction/index";

import mallhistory from "./modules/MallHistory/index";

//用户交易偏好

import boddy from "./modules/hobby/index";

//下单转换漏斗最近七天
import order from "./modules/order/index";
export default {
	name: "mall",
	components: {
		vhead,
		useragemobilemember,
		gridtitle,
		realtimeuser,
		mallvistors,
		transaction,
		todayuserdeal,
		paymalldeal,
		mallhistory,
		order,
		boddy
	},
	data() {
		return {};
	}
	// 组件内守卫
	// 因为这个钩子调用的时候，组件实例还没有被创建出来，因此获取不到this
	// beforeRouteEnter(to, from, next) {
	// 	next();
	// }
	// 路由即将要离开的时候调用此方法
	// 比如说，用户编辑了一个东西，但是还么有保存，这时候他要离开这个页面，就要提醒他一下，还没保存，是否要离开
	// beforeRouteLeave(to, from, next) {
	// 	//const leave = confirm("确定要离开吗？");
	// 	//if (leave) next();
	// 	// 离开
	// 	//else next(false); // 不离开
	// }
};
</script>

<style lang="scss">
.mall {
	// $grid-content-h: 500px;
	// $row-3-grid-content: 40vh;
	// $row-4-grid-content: 350px;

	// $grid-content-h: 450px;
	// $row-3-grid-content: 250px;
	$row-4-grid-content: 250px;
	$grid-content-h: 450px;
	$row-3-grid-content: 20vh;
	// $row-4-grid-content: 25vh;
	$grid-map-h: calc(450px - 150px);
	width: 100%;
	height: 100%;
	overflow-y: scroll;
	background: #000b23;

	.row-2,
	.row-3 {
		// margin: 20px 35px;
		margin: 20px;
	}

	.row-4 {
		// margin: 20px 35px 0 35px;
		margin: 20px 20px 0 20px;
	}

	.row-3 {
		height: $row-3-grid-content;

		.el-col {
			height: 100%;
		}

		min-height: 220px;
	}

	.row-4 {
		height: $row-4-grid-content;

		.el-col {
			height: 100%;
		}
	}
	.grid-content,
	.row-3-grid-content,
	.row-4-grid-content {
		// height: $row-3-grid-content;
		height: 100%;
		background: rgba(71, 225, 255, 0.02);
		box-shadow: 0px 1px 20px 0px rgba(71, 225, 255, 0.1);
		border: 1px solid rgba(71, 225, 255, 0.15);
	}

	.grid-content {
		height: $grid-content-h;
		.grid-title-end {
			margin: 8px 8px 0 0;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			span {
				font-size: 14px;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				span {
					color: #ffe14b;
				}
			}
		}
	}

	.middle-grid-margin {
		// margin: 0 10px;
		margin: 0 20px;
	}

	.grid-map {
		height: $grid-map-h;
	}

	.flex-column {
		display: flex;
		flex-direction: column;

		.item-four-section {
			height: $grid-content-h/2;
		}

		.item {
			flex: 1;
		}

		.item-start {
			flex: 190;
		}

		.item-end {
			flex: 310;
		}

		.item-title {
			height: 50px;
		}

		.item-content {
			height: 100%;
			margin: 0 5px;

			.v-el-col {
				height: 100%;
			}
		}
	}

	.flex-box {
		// box-sizing: border-box;
		// margin: 0 10px;

		position: relative;
		// width: 100%;
		height: 100%;
		.title {
			width: 100%;
			height: 43px;
			// background: #29f0bf;
		}
		.content {
			width: 100%;
			position: absolute;
			top: 43px;
			bottom: 0px;
			left: 0px;
			right: 0px;
			// margin-left: 8px;
			// background: #f09529;

			.item-content {
				height: 100%;
				margin: 0 8px;

				.v-el-col {
					height: 100%;
				}
			}
		}
	}
}
// html {
// 	zoom: 80%;
// }

@media screen and (max-width: 1600px) {
	// html {
	// 	//zoom: 0.8;

	// 	// transform: scale(0.8333333333333, 0.8333333333333);

	// 	// height: 100%;
	// 	// width: 100%;
	// 	// transform: scale(0.86, 0.93);
	// }

	// body {
	// 	zoom: 80%;
	// 	z-index: -2;
	// }

	.mall {
		overflow-y: auto;
		min-width: 1850px;
	}

	// *::-webkit-scrollbar {
	// 	/*滚动条整体样式*/
	// 	width: 10px; /*定义纵向滚动条宽度*/
	// 	height: 10px; /*定义横向滚动条高度*/
	// }

	// *::-webkit-scrollbar-thumb {
	// 	/*滚动条内部滑块*/
	// 	border-radius: 8px;
	// 	background-color: green;
	// 	transition: background-color 0.3s;
	// }

	// *::-webkit-scrollbar-thumb:hover {
	// 	/*鼠标悬停滚动条内部滑块*/
	// 	background: red;
	// }

	// *::-webkit-scrollbar-track {
	// 	/*滚动条内部轨道*/
	// 	background: yellow;
	// }

	*::-webkit-scrollbar {
		/*滚动条整体样式*/
		width: 0px; /*定义纵向滚动条宽度*/
		height: 7px; /*定义横向滚动条高度*/
	}

	*::-webkit-scrollbar-thumb {
		/*滚动条内部滑块*/
		border-radius: 8px;
		background-color: #000b23;
		transition: background-color 0.3s;
		opacity: 0.1;
	}

	*::-webkit-scrollbar-thumb:hover {
		/*鼠标悬停滚动条内部滑块*/
		background: #ffffff;
		opacity: 0.5;
	}

	*::-webkit-scrollbar-track {
		//::-webkit-scrollbar-track
		/*滚动条内部轨道*/
		background: #000b23;
	}

	*::-webkit-scrollbar-track-piece {
		background: #000b23;
	}

	// 	::-webkit-scrollbar — 整个滚动条
	// ::-webkit-scrollbar-track — 滚动条轨道
	// ::-webkit-scrollbar-thumb — 滚动条上的滚动滑块
	// ::-webkit-scrollbar-button — 滚动条上的按钮 (上下箭头)
	// ::-webkit-scrollbar-track-piece — 滚动条没有滑块的轨道部分
	// ::-webkit-scrollbar-corner — 边角，即当同时有垂直滚动条和水平滚动条时交汇的部分
	// ::-webkit-resizer — 某些元素的corner部分的部分样式(例:textarea的可拖动按钮)
}
</style>
