<template>
	<div class="mall">
		<vhead></vhead>
		<el-row class="row-2">
			<el-col :span="7">
				<useragemobilemember></useragemobilemember>
			</el-col>
			<el-col :span="10">
				<todayuserdeal></todayuserdeal>
			</el-col>
			<el-col :span="7">
				<paymalldeal></paymalldeal>
			</el-col>
		</el-row>

		<el-row class="row-3">
			<el-col :span="7">
				<div class="row-3-grid-content">
					<el-row type="flex" justify="space-between" class="item">
						<el-col :span="12">
							<gridtitle :title="'用户交易偏好'"></gridtitle>
						</el-col>
						<el-col :span="12"> </el-col>
					</el-row>
				</div>
			</el-col>
			<el-col :span="10">
				<mallvistors></mallvistors>
			</el-col>
			<el-col :span="7">
				<transaction></transaction>
			</el-col>
		</el-row>

		<el-row class="row-4">
			<el-col :span="7">
				<!-- <div class="row-4-grid-content">
					<el-row type="flex" justify="space-between" class="item">
						<el-col :span="12">
							<gridtitle
								:title="'下单转换漏斗(最近七天)'"
							></gridtitle>
						</el-col>
						<el-col :span="12"> </el-col>
					</el-row>
				</div> -->
				<order></order>
			</el-col>
			<el-col :span="10">
				<mallhistory></mallhistory>
			</el-col>
			<el-col :span="7">
				<realtimeuser></realtimeuser>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import vhead from "./components/head/index";
import gridtitle from "./components/title/index";

//module

import useragemobilemember from "./modules/UserAgeMobileMember/index"

//今日交易金额 用户交易分别
import todayuserdeal from "./modules/TodayUserDeal/index";

// 支付 商城交易分布
import paymalldeal from "./modules/PayMallDeal/index"
//实时交易用户
import realtimeuser from "./modules/RealtimeUser/index";

//商城访客(最近七天)
import mallvistors from "./modules/MallVistors/index";

//总交易金额分布 客单价近七天
import transaction from "./modules/transaction/index";

import mallhistory from "./modules/MallHistory/index"


//下单转换漏斗最近七天
import order from "./modules/order/index"
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
		order
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss">
.mall {
	$grid-content-h: 500px;
	$row-3-grid-content: 300px;
	// $row-4-grid-content:250px;
	$grid-map-h: calc(500px - 150px);
	min-height: 100%;
	width: 100%;
	overflow: hidden;
	background: #000b23;

	.row-2,
	.row-3,
	.row-4 {
		margin: 20px 35px;
	}

	.grid-content,
	.row-3-grid-content,
	.row-4-grid-content {
		height: $row-3-grid-content;
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
		margin: 0 10px;
	}

	.grid-map {
		height: $grid-map-h;
	}

	.flex-column {
		display: flex;
		flex-direction: column;

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
}
</style>
