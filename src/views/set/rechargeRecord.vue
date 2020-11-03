<template>
	<div class="recharge recharge-top">
		<h1 class="top">充值</h1>
		<div class="tip">
			说明：充值金额将直接充入您在达达快送的账户中，您可以登录达达开放平台（
			<a
				href="https://newopen.imdada.cn"
				target="_blank"
				ref="nofollow"
			>https://newopen.imdada.cn</a>）-管理中心-商户中心-运费服务-运费账户中查看，开发票请联系达达客服申请。
		</div>
		<div class="rechangeBox clearfix">
			<div class="fl">
				<div class="price-title">账户余额（元）</div>
				<div class="price-info">
					<span class="price">{{price}}</span>
					<span class="price-tip" v-if="price === '0.00' && price !== null">账户余额不足，不能发单，无法使用达达配送</span>
				</div>
			</div>
			<div class="fr recharge-btn">
				<el-button @click="onRecharge" type="" plain size="small">充值</el-button>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'rechargeRecord',
		data() {
			return {
				price: null,
				dataList: [],
				loading:true,
			}
		},
		created() {
			this.getBalancRecord()
		},
		methods: {
			onRecharge() {
				this.$router.push({
					name: 'recharge',
					params: {
						sourceId: this.$route.params.sourceId
					}
				})
			},
			//余额
			getBalancRecord() {
				this._apis.set
					.getBalance({
						type: 1 //达达
					})
					.then(response => {
						this.price = response.deliverBalance
					})
					.catch(error => {
						console.error(error)
						this.loading = false;
					});
			}
		}
	};

</script>

<style lang="scss" scoped>
	.recharge {
		width: 100%;
		height: 100%;
		background: #fff;
		padding: 20px;
		border-radius: 4px;

		.top {
			height: 52px;
			line-height: 52px;
			font-size: 16px;
			color: #3d434a;
			border-bottom: 1px solid #D9DEE9;
		}
		.tip {
			padding: 12px 20px;
			margin-top: 10px;
			line-height: 24px;
			font-size: 12px;
			color: #44434b;
			background: rgba(253, 147, 43, 0.08);
			a {
				color: #44434b;
			}
			a:hover {
				text-decoration: underline;
			}
		}

		.rechangeBox {
			height: 117px;
			padding: 0 20px;
			.price-title {
				padding-top: 25px;
				font-size: 16px;
				font-weight: 400;
				color: #a7abc3;
				line-height: 22px;
			}
			.price {
				font-size: 32px;
				font-weight: 500;
				color: #655eff;
				line-height: 45px;
				font-family: PingFangSC-Medium, PingFang SC;
			}
			.price-tip {
				margin-left: 15px;
				font-size: 12px;
				color: #FD4C2B;
			}
		}

		.recharge-btn {
			padding-top: 41px;
			/deep/ .el-button--small {
				width: 80px;
				height: 34px;
				padding: 0;
				line-height: 34px;
				border-radius: 4px;
			}

			/deep/ .el-button {
				color: #655EFF;
				font-size: 14px;
				border: 1px solid #655EFF;
			}
		}
	}
	.recharge-top {
		padding-top: 0;
		padding-bottom: 0;
	}
	.recharge-con {
		margin-top: 20px;
		padding-bottom: 50px;
	}
	/deep/ .el-table--small td, /deep/.el-table--small th{
		padding:8px 10px;
	}

</style>
