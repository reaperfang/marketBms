<template>
	<div>
		<div class="recharge recharge-top">
			<!-- 充值记录 -->
			<h1 class="top">充值</h1>
			<div class="rechangeBox clearfix">
				<div class="fl">
					<div class="price-title">账户余额（元）</div>
					<div class="price-info">
						<span class="price">{{price}}</span>
						<span class="price-tip" v-if="!price && price !== null">账户余额不足，不能发单，无法使用达达配送</span>
					</div>
				</div>
				<div class="fr recharge-btn">
					<el-button @click="onRecharge" type="" plain size="small">充值</el-button>
				</div>
			</div>
		</div>
		<div class="recharge recharge-con">
			<el-table
				ref="multipleTable"
				v-loading="loading"
				:data="dataList"
				style="width: 100%"
				:header-cell-style="{background:'rgba(208, 214, 228, .2)', color:'#44434B', fontSize: '14px', fontWeight: '500'}"
				>
				<el-table-column
				prop="roleName"
				label="充值对象">
				</el-table-column>
				<el-table-column
				prop="roleDesc"
				label="充值金额">
				</el-table-column>
				<el-table-column
				width="195"
				align="center"
				prop="createTime"
				label="充值时间">
				</el-table-column>
			</el-table>
			<div class="pagination" v-if="dataList.length">
				<el-pagination
				:background="true"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="Number(startIndex) || 1"
				:page-sizes="[5, 10, 20, 50, 100, 200, 500]"
				:page-size="pageSize*1"
				:total="total*1"
				layout="prev, pager, next, sizes"
				>
				</el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
	import tableBase from '@/components/TableBase';
	export default {
		name: 'rechargeRecord',
		extends: tableBase,
		data() {
			return {
				price: null,
				dataList: [],
				loading:true,
			}
		},
		created() {
			this.getBalancRecord()
			this.fetch();
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
			fetch(){
				let query = Object.assign({cid:2},this.ruleForm)
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
	.recharge {
		width: 100%;
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
		padding-bottom: 35px;
	}
	/deep/ .el-table--small td, /deep/.el-table--small th{
		padding:8px 10px;
	}

</style>
