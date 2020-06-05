<template>
	<el-dialog
		title="模板缴费"
		:visible.sync="dialogVisible"
		:before-close="handleClose">
		<div class="templage-pay-content">
			<div class="templage-pay-content-left">
				<img :src="tempInfo.photoDetailsUrl"/>
			</div>
			<div class="templage-pay-content-right">
				<div class="templage-pay-content-right-title">
					{{tempInfo.name}}
				</div>
				<div class="templage-pay-content-right-industry">
					水果生蔬水果生蔬水果生蔬水果生蔬水果生蔬水果生蔬水果生蔬水果生蔬水果生蔬水果生蔬
				</div>
				<div class="templage-pay-content-right-scope">
					<img src="@/assets/images/shop/xiaochengxu.png"/><img src="@/assets/images/shop/weixin.png"/>
				</div>
				<div class="templage-pay-content-right-price">
					<span class="templage-pay-content-right-price-left">
						一口价：
					</span>
					<span class="templage-pay-content-right-price-right">
						￥{{tempInfo.price}}元
					</span>
				</div>
				<div class="templage-pay-content-right-codeTitle">
					手机扫描二维码支付
				</div>
				<div class="templage-pay-content-right-code">

				</div>
				<div class="templage-pay-content-right-btn">
					<el-button @click="dialogVisible = false" class="templage-pay-content-right-btn-left">取 消</el-button>
					<el-button @click="dialogVisible = false" class="templage-pay-content-right-btn-right">使用模版</el-button>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<script>
    export default {
        name: "templatePay",
		props: {
			dialogVisible: {
				type: Boolean,
				default () {
					return false
				}
			},
			tempInfo: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
        	return {

			}
		},
		methods: {
			handleClose() {
				this.dialogVisible = false
			}
		}
    }
</script>

<style scoped lang="scss">
/deep/ .el-dialog {
	background:rgba(255,255,255,1);
	box-shadow:0px 5px 20px 0px rgba(208,214,228,1);
	border-radius:10px;
	border:1px solid rgba(204,204,204,1);
	width: 510px;
	.el-dialog__header {
		height:60px;
		background:rgba(101,94,255,0.09);
		border-radius:10px 10px 0px 0px;
		/*opacity:0.09;*/
		.el-dialog__title {
			font-size:22px;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(68,67,75,1);
		}
	}
}
.templage-pay-content {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: start;
	flex-flow:row wrap;
	&-left {
		width: 271px;
		height: 500px;
		background:rgba(0,0,0,0.19);
		overflow-y: scroll;
		img {
			width: 100%;
		}
	}
	&-right {
		width: 182px;
		height: 500px;
		&-title {
			width:182px;
			height:16px;
			font-size:14px;
			font-family:MicrosoftYaHei;
			color:rgba(68,67,75,1);
			line-height:16px;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
			word-wrap:break-word;
		}
		&-industry {
			width:182px;
			height:16px;
			font-size:12px;
			font-family:MicrosoftYaHei;
			color:rgba(146,146,155,1);
			line-height:16px;
			margin-top: 10px;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
			word-wrap:break-word;
		}
		&-scope {
			width:182px;
			height:20px;
			margin-top: 10px;
			img {
				margin-right: 10px;
				width: 20px;
				height: 20px;
			}
		}
		&-price {
			width: 182px;
			height:20px;
			line-height:20px;
			&-left {
				font-size:12px;
				font-family:MicrosoftYaHei;
				color:rgba(146,146,155,1);
			}
			&-right {
				font-size:18px;
				font-family:MicrosoftYaHei;
				color:rgba(240,80,39,1);
			}
		}
		&-codeTitle {
			margin-top: 40px;
			width: 182px;
			height:16px;
			font-size:12px;
			font-family:MicrosoftYaHei;
			color:rgba(146,146,155,1);
			line-height:16px;
		}
		&-code {
			width:182px;
			height:150px;
			margin-top: 8px;
		}
		&-btn {
			margin-top: 162px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: start;
			flex-flow:row wrap;
			&-left {
				background:rgba(255,255,255,1);
				border-radius:4px;
				border:1px solid rgba(146,146,155,1);
				font-size:14px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(68,67,75,1);
			}
			&-right {
				border: 1px solid rgba(146,146,155,1);
				background:rgba(146,146,155,1);
				border-radius:4px;
				font-size:14px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(255,255,255,1);
			}
		}
	}
}
</style>
