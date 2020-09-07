<template>
	<div class="shopExpress shopInfoBox">
		<!-- 充值记录 -->
		<h1 class="top">充值</h1>
		<div class="rechangeBox">
			<div>
				<span>账户余额（元）</span>
				<p class="price">{{price}}</p>
				<p class="price-tip">账户余额不足，不能发单，无法使用达达配送</p>
			</div>
			<i></i>
			<el-button @click="onRecharge" type="" plain size="small">充值</el-button>
		</div>

		<el-table
			ref="multipleTable"
			v-loading="loading"
			:data="dataList"
			style="width: 100%"
			:header-cell-style="{background:'rgba(208, 214, 228, .2)', color:'#44434B', fontSize: '14px', fontWeight: '500'}"
			>
			<el-table-column
			type="selection"
			width="55">
			</el-table-column>
			<el-table-column
			prop="roleName"
			label="充值对象">
			</el-table-column>
			<el-table-column
			prop="roleDesc"
			label="角色描述">
			</el-table-column>
			<el-table-column
			prop="createUserName"
			label="创建人">
			</el-table-column>
			<el-table-column
			prop="createTime"
			label="创建时间">
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				price: 100,
				dataList: []
			};
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
						sourceId: this.$route.params.sourceId
					})
					.then(response => {
						this.price = response.deliverBalance
					})
					.catch(error => {
						this.loading = false;
					});
			},
			//获取充值记录列表
			getRechargeRecordList(){
				let query = Object.assign({cid:this.cid},this.form)
				this._apis.set.getRoleList(query).then(response =>{
					this.dataList = response.list
					this.total = response.total
					this.loading = false
				}).catch(error =>{
					this.loading = false
				})
			},
		}
	};

</script>

<style lang="scss" scoped>
	.shopInfoBox {
		width: 100%;
		height: 100%;
		background: #fff;
		padding: 20px;

		.top {
			font-size: 16px;
			color: #3d434a;
			padding: 15px 0;
			border-bottom: 1px solid #cacfcb;
		}

		.rechangeBox {
			display: flex;
			align-items: center;
			margin: 20px 0 0 25px;

			div {
				width: 200px;
        		padding-right: 10px;
			}

			span {
				font-size: 16px;
				font-weight: 400;
				color: #a7abc3;
				line-height: 22px;
			}

			i {
				display: inline-block;
				width: 1px;
				height: 34px;
				background: #D5D9D5;
				margin-right: 30px;
			}

			.price {
				font-size: 32px;
				font-weight: 500;
				color: #655eff;
				line-height: 45px;
			}
			.price-tip {
				color: #FD4C2B;
			}
		}

		/deep/ .el-button--small {
			width: 80px;
			height: 34px;
			padding: 0;
			line-height: 34px;
			;
		}

		/deep/ .el-button {
			color: #655EFF;
			font-size: 14px;
			border: 1px solid #655EFF;
		}
	}

</style>
