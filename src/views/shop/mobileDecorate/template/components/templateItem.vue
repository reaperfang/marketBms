<template>
    <div class="template-item">
		<div class="template-item-img">
			<div class="template-item-img-tag">
				使用人数：9999
			</div>
			<div class="template-item-img-dismount" v-if="!templateItem.status">
				<div class="template-item-img-dismount-flag">
					已下架
				</div>
			</div>
		</div>
		<div class="template-item-price">
			<span class="template-item-price-price">￥119</span><span class="template-item-price-validity">90天</span>
		</div>
		<div class="template-item-title">
			免费模版免费模版名字免费模版名字模免费模版免费模版名字免费模版名字模免费模版免费模版名字免费模版名字模
		</div>
		<div class="template-item-industry">
			<div class="template-item-industry-title">
				所属行业：
			</div>
			<div class="template-item-industry-item">
				女装
			</div>
			<div class="template-item-industry-item">
				美食
			</div>
			<div class="template-item-industry-item">
				生鲜水果
			</div>
			<div class="template-item-industry-item">
				男装
			</div>
			<div class="template-item-industry-item">
				外贸服饰
			</div>
		</div>
		<div class="template-item-type">
			<div class="template-item-type-title">
				模板类型：
			</div>
			<div class="template-item-type-text">
				首页模板
			</div>
		</div>
		<div class="template-item-foot">
			<div class="template-item-foot-left">
				<span class="template-item-foot-left-label">{{templateItem.status ? '上架' : '下架'}}</span>
				<el-switch
					style="display: block"
					v-model="templateItem.status"
					active-color="#87D068"
					inactive-color="#CCCCCC">
				</el-switch>
			</div>
			<div class="template-item-foot-right">
				<div class="template-item-foot-right-line">
				</div>
				<img class="template-item-foot-right-icon" src="@/assets/images/shop/edit-icon2x.png"/>
				<div class="template-item-foot-right-btn">
					编辑
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    export default {
        name: "templateItem",
		props: {
			templateItem: {
				type: Object,
				default () {
					return {
						status: true
					}
				}
			}
		},
		data() {
        	return {
				value2: true
			}
		}
    }
</script>

<style scoped lang="scss">
.template-item {
	width: 252px;
	height: 458px;
	background:rgba(255,255,255,1);
	border:1px solid rgba(233,233,233,1);
	margin-right: 24px;
	margin-top: 25px;
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: center;
	padding-top: 10px;
	&-img {
		width:232px;
		height:250px;
		background:rgba(231,240,255,1);
		position: relative;
		&-tag {
			width:120px;
			height:26px;
			background:rgba(24,144,255,1);
			border-radius:0px 0px 9px 0px;
			opacity:0.65;
			font-size:12px;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(255,255,255,1);
			text-align: center;
			line-height: 26px;
			position: absolute;
			z-index: 10;
			top: 0;
			left: 0;
		}
		&-dismount {
			width:232px;
			height:250px;
			background:rgba(0,0,0,1);
			opacity:0.35;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 20;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			&-flag {
				width:80px;
				height:80px;
				border-radius: 80px;
				background:rgba(246,246,246,1);
				font-size:16px;
				font-family:PingFangSC-Medium,PingFang SC;
				font-weight:500;
				color:rgba(51,51,51,1);
				line-height: 80px;
				text-align: center;
			}
		}
	}
	&-price {
		width:232px;
		height:18px;
		line-height:18px;
		margin-top: 10px;
		&-price {
			font-size:18px;
			font-family:Helvetica;
			color:rgba(240,80,39,1);
			margin-top: 12px;
			margin-right: 5px;
		}
		&-validity {
			font-size:12px;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(153,153,153,1);
		}
	}
	&-title {
		margin-top: 10px;
		width:232px;
		height:16px;
		font-size:12px;
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:500;
		color:rgba(68,67,75,1);
		line-height:14px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		word-wrap:break-word;
	}
	&-industry {
		margin-top: 10px;
		width:232px;
		height: 50px;
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: start;
		flex-flow:row wrap;
		&-title {
			width:60px;
			height:22px;
			font-size:12px;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(0,0,0,0.65);
			line-height:22px;
		}
		&-item {
			height:20px;
			background:rgba(245,245,245,1);
			border-radius:4px;
			padding-left: 8px;
			padding-right: 8px;
			font-size:12px;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(0,0,0,0.65);
			line-height:20px;
			margin-right: 8px;
		}
	}
	&-type {
		margin-top: 10px;
		width:232px;
		height:22px;
		font-size:12px;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(0,0,0,0.65);
		line-height:22px;
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		&-title {
			width:60px;
			height:22px;
			font-size:12px;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(0,0,0,0.65);
			line-height:22px;
		}
		&-text {
			margin-left: 10px;
			width:48px;
			height:22px;
			font-size:12px;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(0,0,0,0.65);
			line-height:22px;
		}
	}
	&-foot {
		margin-top: 10px;
		width:250px;
		height:40px;
		background:rgba(247,249,250,1);
		border-radius:0px 0px 2px 2px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		&-left {
			margin-left: 10px;
			display: flex;
			flex-direction: row;
			justify-content: start;
			align-items: center;
			&-label {
				width:26px;
				height:18px;
				font-size:13px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(0,0,0,0.65);
				line-height:18px;
				margin-right: 6px;
			}
		}
		&-right {
			margin-right: 10px;
			display: flex;
			flex-direction: row;
			justify-content: end;
			align-items: center;
			&-line {
				width:1px;
				height:16px;
				background:rgba(232,232,232,1);
				margin-right: 10px;
			}
			&-icon {
				width: 16px;
				height: 16px;
				margin-right: 5px;
			}
			&-ben {
				width:26px;
				height:18px;
				font-size:13px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(0,0,0,0.65);
				line-height:18px;
			}
		}
	}
}
</style>
