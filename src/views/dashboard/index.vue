<template>
	<div class="mall">
		<vhead></vhead>
		<el-row class="row-2">
			<el-col :span="7">
				<div class="grid-content flex-column">
					<el-row type="flex" justify="space-between" class="item">
						<el-col :span="12">
							<gridtitle :title="'用户渠道分别'"></gridtitle>
						</el-col>
						<el-col :span="12">
							<gridtitle :title="'渠道会员转换'"></gridtitle>
						</el-col>
					</el-row>
					<el-row type="flex" justify="space-between" class="item">
						<el-col :span="12">
							<gridtitle :title="'性别年龄分布'"></gridtitle>
						</el-col>
						<el-col :span="12">
							<gridtitle :title="'绑定手机号'"></gridtitle>
						</el-col>
					</el-row>
				</div>
			</el-col>
			<el-col :span="10">
				<div class="grid-content middle-grid-margin">
					<el-row type="flex" justify="space-between">
						<el-col :span="12">
							<gridtitle :title="'今日交易金额'"></gridtitle>
						</el-col>
						<el-col :span="12">
							<div class="grid-title-end">
								<span>
									同比昨日
									<span>增长20%</span>
								</span>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<countTo
								:startVal="startVal"
								:endVal="endVal"
								:duration="7000"
							></countTo>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="12">
							<gridtitle :title="'用户交易分布'"></gridtitle>
						</el-col>
					</el-row>

					<el-row class="grid-map">
						<chinamap></chinamap>
					</el-row>
				</div>
			</el-col>
			<el-col :span="7">
				<div class="grid-content flex-column">
					<el-row
						type="flex"
						justify="space-between"
						class="item-start"
					>
						<el-col :span="24">
							<vpay></vpay>
						</el-col>
					</el-row>
					<el-row
						type="flex"
						justify="space-between"
						class="item-end"
					>
						<el-col :span="12">
							<gridtitle :title="'商城成交来源TOP3'"></gridtitle>
						</el-col>
						<el-col :span="12"> </el-col>
					</el-row>
				</div>
			</el-col>
		</el-row>

		<el-row class="row-3">
			<el-col :span="7">
				<div class="row-3-grid-content">
					<el-row type="flex" justify="space-between" class="item">
						<el-col :span="12">
							<gridtitle :title="'用户交易偏好'"></gridtitle>
						</el-col>
						<el-col :span="12">
							<!-- <gridtitle :title="'渠道会员转换'"></gridtitle> -->
						</el-col>
					</el-row>
				</div>
			</el-col>
			<el-col :span="10">
				<div class="row-3-grid-content middle-grid-margin">
					<el-row type="flex" justify="space-between" class="item">
						<el-col :span="12">
							<gridtitle
								:title="'商城访客(最近七天)'"
							></gridtitle>
						</el-col>
						<el-col :span="12">
							<!-- <gridtitle :title="'渠道会员转换'"></gridtitle> -->
						</el-col>
					</el-row>
				</div>
			</el-col>
			<el-col :span="7">
				<div class="row-3-grid-content">
					<el-row type="flex" justify="space-between" class="item">
						<el-col :span="12">
							<gridtitle :title="'总交易金额分布'"></gridtitle>
						</el-col>
						<el-col :span="12">
							<gridtitle :title="'客单价(最近七天)'"></gridtitle>
						</el-col>
					</el-row>
				</div>
			</el-col>
		</el-row>

		<el-row class="row-4">
			<el-col :span="7">
				<div class="row-4-grid-content">
					<el-row type="flex" justify="space-between" class="item">
						<el-col :span="12">
							<gridtitle
								:title="'下单转换漏斗(最近七天)'"
							></gridtitle>
						</el-col>
						<el-col :span="12">
							<!-- <gridtitle :title="'客单价(最近七天)'"></gridtitle> -->
						</el-col>
					</el-row>
				</div>
			</el-col>
			<el-col :span="10">
				<div class="row-4-grid-content middle-grid-margin">
					<el-row type="flex" justify="space-between" class="item">
						<el-col :span="12">
							<gridtitle
								:title="'支付金额(最近七天)'"
							></gridtitle>
						</el-col>
						<el-col :span="12">
							<gridtitle
								:title="'商城浏览(最近七天)'"
							></gridtitle>
						</el-col>
					</el-row>
				</div>
			</el-col>
			<el-col :span="7">
				<div class="row-4-grid-content flex-column">
					<el-row
						type="flex"
						justify="space-between"
						class="item-title"
					>
						<el-col :span="12">
							<gridtitle :title="'实时交易用户'"></gridtitle>
						</el-col>
						<el-col :span="12"> </el-col>
					</el-row>
					<el-row class="item-content">
						<realtimeuser></realtimeuser>
					</el-row>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import countTo from "./components/CountTo/index";
import vhead from "./components/head/index";
import chinamap from "./components/map/china/index";
import gridtitle from "./components/title/index";
import vpay from "./components/pay/index";

//module
import realtimeuser from "./modules/RealtimeUser/index";
export default {
	name: "mall",
	components: { countTo, vhead, chinamap, gridtitle, vpay, realtimeuser },
	data() {
		return {
			startVal: 0,
			endVal: 1000000
		};
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
      margin:0 8px;
		}
	}
}
</style>
