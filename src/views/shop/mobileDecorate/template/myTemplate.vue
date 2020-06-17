<template>
	<div class="template_wrapper">
		<ul class="clearFix" v-loading="loading">
			<li>
				<div class="inner">
					<div class="view">
						<div style="width:100%;height:100%;background:rgb(230,228,255)"></div>
					</div>
					<div class="info">
						<div class="top">
							<span>空白模板</span>
						</div>
						<div class="bottom apply_now">
							<span class="price"></span>
							<el-button type="primary" plain  @click="_routeTo('m_shopEditor')">立即创建</el-button>
						</div>
					</div>
				</div>
			</li>
			<li v-for="(item, key) of templateList" :key="key">
				<div class="inner">
					<div class="inner-tag" v-show="item.status === 1 || item.status === 0">
						<div class="inner-tag-tag" :style="{borderColor: item.status === 0 ? 'transparent #FD932B' : 'transparent #3EB488'}">
						</div>
						<span>{{item.status === 0 ? '未使用' : '已使用'}}</span>
					</div>
					<div class="view">
						<img :src="item.photoHalfUrl" alt="">
						<div class="cover_small">
							<div class="cover_button" v-show="item.status === 2 && item.templateStatus === 1">已过期</div>
							<div class="cover_button" v-show="item.templateStatus === 2">已下架</div>
							<div class="cover_button_pre" @click="preview(item)" v-show="item.status !== 2 && item.templateStatus === 1">预览模板</div>
							<el-button type="primary" class="cover_button_apply" @click="apply(item)" v-show="item.status !== 2 && item.templateStatus === 1">使用模板</el-button>
						</div>
					</div>
					<div class="info">
						<div class="top">
							<div class="price" v-show="item.chargeType !== 1">
								<div class="price-left">
									￥{{item.price}}<span style="color:rgba(146,146,155,1);">/</span>
								</div>
								<div class="price-right">
									{{getChangeType(item.chargeType)}}
								</div>
							</div>
							<div class="free"  v-show="item.chargeType === 1">
								<div class="free-left">
									免费
								</div>
								<div class="free-right">
									永久使用
								</div>
							</div>
							<div class="expiration" v-show="item.chargeType !== 1">
								到期日：{{item.limitDate | formatDate('yyyy-MM-dd')}}
							</div>
						</div>
						<div class="body">
							<span>{{item.name || '页面模板'}}</span>
						</div>
						<div class="bottom">
							<div class="bottom-left">
								<i class="mini_program"></i>
								<i class="wechat"></i>
							</div>
							<div class="bottom-right" v-show="item.status === 2" @click="apply(item)">
								继续使用
							</div>
						</div>
					</div>
				</div>
			</li>
		</ul>

		<div class="big_preview animated fadeInDown faster" v-if="showBigPreview">
			<div class="img_wrapper">
				<img :src="currentTemplate && currentTemplate.photoDetailsUrl" alt="" ref="bigImage">
			</div>
			<i class="close_preview" @click="close"></i>
			<div class="zoom">
				<i class="plus" @click="plus"></i>
				<i class="reduce" @click="reduce"></i>
			</div>
			<div class="apply" @click="apply(currentTemplate)">立即应用</div>
		</div>

		<div v-show="templateList.length > 0" class="pagination" v-if="templateList.length || (!templateList.length && startIndex != 1)">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="Number(startIndex) || 1"
				:page-size="pageSize*1"
				:page-sizes="[12]"
				:total="total*1"
				layout="total, sizes, prev, pager, next, jumper"
			>
			</el-pagination>
		</div>
		<template-pay :dialogVisible="dialogVisible" :tempInfo="tempInfo" :qrCodeInfo="qrCodeInfo" @closePay="closePay"></template-pay>
	</div>
</template>

<script>
	import tableBase from '@/components/TableBase';
	import templatePay from './components/templatePay';
	export default {
		name: 'templateManage',
		extends: tableBase,
		components: {templatePay},
		data () {
			return {
				dialogVisible: false,
				tempInfo: {},
				qrCodeInfo: {},
				pageSize: 12,
				loading: true,
				templateList: [],
				showBigPreview: false,
				currentTemplate: null,
				zoomRatio: 1, //缩放比
				imgNow: 0,  //当前预加载的第几张
				preLoadObj: null,  //预加载对象
				maxWidth: 550,  //最大宽度
				mode: null
			}
		},
		created() {
			this.fetch();
			this.preLoadObj = new Image();
		},
		watch: {
			zoomRatio(newValue) {
				let width = this.$refs.bigImage.clientWidth;
				if(this.mode === 'plus') {
					this.$refs.bigImage.style.width = width * this.zoomRatio + 'px';
				}else if(this.mode === 'reduce') {
					this.$refs.bigImage.style.width = width / this.zoomRatio + 'px';
				}
				if(this.zoomRatio > 1) {
					this.$refs.bigImage.style.height = 'auto';
				}else{
					this.$refs.bigImage.style.width = 'auto';
					this.$refs.bigImage.style.height = '100%';
				}
			},
		},
		methods: {
			fetch() {
				this.loading = true;
				this._apis.shop.getMyTemplateList({
					startIndex: this.startIndex,
					pageSize: this.pageSize
				}).then((response)=>{
					this.total = response.total;
					this.templateList = response.list;
					this.imgNow = 0;
					this.preload(this.templateList, 'photoDetailsUrl');
					this.loading = false;
				}).catch((error)=>{
					console.error(error);
					this.templateList = [];
					this.loading = false;
				});
			},

			/* 预加载 */
			preload(data, name) {
				const _self = this;
				if(!data.length) {
					//全部加载失败
					return;
				}
				this.preLoadObj.src = data[this.imgNow][name];
				this.preLoadObj.onerror = function () {
					console.log("图片加载失败");
					_self.imgNow++;
					if ( _self.imgNow < data.length ) {  //  如果还没有加载到最后一张
						_self.preload(data, name);          //  递归调用自己
					} else {                            //  已经加载到最后一张
						//全部加载完成
						return;
					}
				}
				this.preLoadObj.onload = function () {
					console.log(this.clientWidth)
					console.log(this.clientHeight)
					_self.imgNow++;
					if ( _self.imgNow < data.length ) {  //  如果还没有加载到最后一张
						_self.preload(data, name);          //  递归调用自己
					} else {                            //  已经加载到最后一张
						//全部加载完成
						return;
					}
				};

			},

			/* 预览模板 */
			preview(item) {
				this.showBigPreview=true;
				this.currentTemplate = item;
				this.zoomRatio = 1;
			},

			/* 放大 */
			plus() {
				this.mode = 'plus';
				if(this.$refs.bigImage.clientWidth <= this.maxWidth * 0.9) {
					this.zoomRatio += 0.1;
				}
			},

			/* 缩小 */
			reduce() {
				this.mode = 'reduce';
				// if(this.$refs.bigImage.clientWidth >= this.maxWidth) {
				//    this.zoomRatio = 1.1;
				// }
				if(this.zoomRatio >= 1.1) {
					this.zoomRatio -= 0.1;
				}
			},

			/* 关闭预览 */
			close() {
				this.showBigPreview=false;
			},

			/* 应用模板 */
			apply(item) {
				if (item.chargeType !== 1 && item.status === 2) {
					this._apis.templatePay.getOrcode({
						orderSource: 1,
						orderType: 1,
						shopName: JSON.parse(localStorage.getItem('shopInfos')).shopName,
						templateChargeType: item.chargeType,
						templateId: item.id,
						templateName: item.name,
						templatePrice: item.price
					}).then(res => {
						this.qrCodeInfo = res
						this.dialogVisible = true
						this.tempInfo = item
					})
				} else {
					this.confirm({
						title: '提示',
						customClass: 'goods-custom',
						icon: true,
						text: `部分私有数据需要您自行配置<br/>我们为您预置了这些组件的装修样式！`
					}).then(() => {
						this._routeTo('m_templateEdit', {id: item.id});
					})
				}
			},
			getChangeType(code) {
				if (code === 1) {
					return ''
				} else if (code === 1) {
					return '永久免费'
				} else if (code === 2) {
					return '30天'
				} else if (code === 3) {
					return '90天'
				} else if (code === 4) {
					return '180天'
				} else if (code === 5) {
					return '360天'
				} else if (code === 6) {

				}
			},
			closePay() {
				this.dialogVisible = false
				this.fetch()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.template_wrapper{
		// min-width:1650px;
		background: #fff;
		padding-bottom:20px;
		ul{
			display:flex;
			flex-direction: row;
			justify-content: flex-start;
			flex-wrap: wrap;
			background: #fff;
			padding: 20px;
			padding-right:0;
			box-sizing: border-box;
			li{
				width:255px;
				margin-right: 10px;
				margin-bottom: 10px;
				.inner{
					width:255px!important;
					height:421px!important;
					padding: 15px;
					background: #fff;
					box-shadow:0px 2px 10px 0px rgba(232,231,255,1);
					position:relative;
					&-tag {
						position: absolute;
						top: 0;
						right: 0;
						z-index: 100;
						width: 68px;
						height: 68px;
						&-tag {
							position: absolute;
							top: 0;
							right: 0;
							z-index: 101;
							width: 0;
							height: 0;
							border-width: 0 68px 68px 0;
							border-style: solid;
							border-color: transparent #3EB488;
						}
						span {
							top: 14px;
							right: 2px;
							z-index: 102;
							font-size:12px;
							position: absolute;
							font-family:PingFangSC-Regular,PingFang SC;
							font-weight:400;
							color:rgba(255,255,255,1);
						}
					}
					.view{
						width:100%;
						height:300px;
						position: relative;
						img{
							width:100%;
							height:100%;
							object-fit: cover;
						}
						.cover_small{
							width:100%;
							height:100%;
							position:absolute;
							top:0;
							left:0;
							background: rgba(0,0,0,0.6);
							display:flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							opacity: 0;
							transition: all 0.4s;
							&:hover{
								opacity: 1;
							}
							.cover_button{
								width:78px;
								height:78px;
								background:rgba(255,255,255,1);
								font-size:14px;
								border-radius: 78px;
								font-family:MicrosoftYaHei;
								color:rgba(68,67,75,1);
								line-height:70px;
								padding:6px 17px;
								border:1px solid rgba(255,255,255,1);
								cursor: pointer;
								transition: all 0.4s;
								/*&:hover{*/
									/*background:rgba(101,94,255,1);*/
									/*border:1px solid rgba(101,94,255,1);*/
								/*}*/
							}
							.cover_button_pre{
								font-size:14px;
								font-family:MicrosoftYaHei;
								color:rgba(255,255,255,1);
								line-height:19px;
								padding:6px 17px;
								border-radius:4px;
								border:1px solid rgba(255,255,255,1);
								cursor: pointer;
								transition: all 0.4s;
								&:hover{
									background:rgba(101,94,255,1);
									border:1px solid rgba(101,94,255,1);
								}
							}
							.cover_button_apply {
								width:90px;
								height:34px;
								margin-top: 16px;
								font-size:14px;
								font-family:MicrosoftYaHei;
								color:rgba(255,255,255,1);
								line-height:19px;
								padding:6px 17px;
								border-radius:4px;
								/*background:rgba(101,94,255,1);*/
								/*border:1px solid rgba(101,94,255,1);*/
								/*cursor: pointer;*/
								/*transition: all 0.4s;*/
								/*&:hover{*/
									/*background:rgba(101,94,255,1);*/
									/*border:1px solid rgba(101,94,255,1);*/
								/*}*/
							}
						}
					}
					.info{
						margin-top:10px;
						.top{
							display:flex;
							flex-direction: row;
							justify-content: space-between;
							align-items: center;
							height:23px;
							.price {
								display:flex;
								flex-direction: row;
								justify-content: start;
								align-items: flex-end;
								height: 18px;
							}
							.price-left {
								font-size:18px;
								font-family:MicrosoftYaHei;
								color:rgba(240,80,39,1);
								height: 18px;
								line-height: 18px;
							}
							.price-right {
								font-size:12px;
								font-family:MicrosoftYaHei;
								color:rgba(146,146,155,1);
								height: 13px;
								line-height: 13px;
							}
							.free {
								width: 108px;
								height: 22px;
								border:1px solid rgba(62,180,136,1);
								border-radius: 4px;
								display:flex;
								flex-direction: row;
								justify-content: center;
								align-items: center;
							}
							.free-left {
								text-align: center;
								width: 40px;
								height: 22px;
								border-radius: 4px 0 0 4px;
								background: rgba(62,180,136,1);
								font-size:14px;
								font-family:MicrosoftYaHei;
								color:rgba(255,255,255,1);
								line-height: 22px;
							}
							.free-right {
								text-align: center;
								width: 68px;
								height: 22px;
								border-radius: 0 4px 4px 0;
								font-size:14px;
								font-family:MicrosoftYaHei;
								color:rgba(62,180,136,1);
								line-height: 22px;
							}
							.expiration {
								height:10px;
								font-size:10px;
								font-family:MicrosoftYaHei;
								color:rgba(146,146,155,1);
								line-height:10px;
							}
						}
						.body {
							width: 225px;
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
							margin-top: 10px;
						}
						.bottom{
							display:flex;
							flex-direction: row;
							justify-content: space-between;
							align-items: center;
							&-left {
								display:flex;
								flex-direction: row;
								justify-content: start;
								margin-top:10px;
								align-items: center;
								i{
									width:23px;
									height:23px;
									border-radius:50%;
									margin-right:10px;
									&.mini_program{
										background:url('../../../../assets/images/shop/xiaochengxu.png') no-repeat 0 0;
									}
									&.wechat{
										background:url('../../../../assets/images/shop/weixin.png') no-repeat 0 0;
									}
								}
							}
							&-right {
								text-align: center;
								cursor: pointer;
								width:80px;
								height:30px;
								border-radius:4px;
								border:1px solid rgba(253,147,43,1);
								font-size:14px;
								font-family:MicrosoftYaHei;
								color:rgba(253,147,43,1);
								line-height:30px;
							}
						}
					}
				}
			}
		}
		.big_preview{
			position:fixed;
			top:0;
			left:0;
			background:rgba(0,0,0,0.5);
			width:100%;
			height:100%;
			display:flex;
			justify-content: center;
			align-items: center;
			z-index: 1001;
			.img_wrapper{
				height:100%;
				overflow-y: auto;
				img{
					transition: all 0.4s;
					max-width:550px;
					height:100%;
				}
			}
			.close_preview{
				position: absolute;
				top:50px;
				right:59px;
				display:block;
				background: rgba(255,255,255,0.3) url('../../../../assets/images/shop/tempClose.png') no-repeat 15px 15px;
				width:50px;
				height:50px;
				border-radius:50%;
				transition: all 0.4s;
				cursor: pointer;
				&:hover{
					background: rgba(255,255,255,0.5) url('../../../../assets/images/shop/tempClose.png') no-repeat 15px 15px;
				}
			}
			.zoom{
				position:absolute;
				bottom:144px;
				right:59px;
				.plus,.reduce{
					width:50px;
					height:50px;
					display:block;
					border-radius:4px;
					transition: all 0.4s;
					cursor: pointer;
				}
				.plus{
					background: rgba(255,255,255,0.3) url('../../../../assets/images/shop/plus.png') no-repeat 3px 3px;
					margin-bottom: 14px;
					&:hover{
						background: rgba(255,255,255,0.5) url('../../../../assets/images/shop/plus.png') no-repeat 3px 3px;
					}
				}
				.reduce{
					background: rgba(255,255,255,0.3) url('../../../../assets/images/shop/reduce.png') no-repeat 3px 3px;
					&:hover{
						background: rgba(255,255,255,0.5) url('../../../../assets/images/shop/reduce.png') no-repeat 3px 3px;
					}
				}
			}
			.apply{
				position:absolute;
				bottom:60px;
				right:40px;
				font-size:15px;
				font-family:PingFangSC-Medium,PingFang SC;
				color:rgba(255,255,255,1);
				padding:9px 10px;
				background:rgba(255,255,255,0.3);
				border-radius:4px;
				transition: all 0.4s;
				cursor: pointer;
				&:hover{
					background: rgba(255,255,255,0.5);
				}
			}
		}
	}
	.apply_now {
		.el-button--small{
			padding:9px 12px!important;
			background: #fff!important;
			border-radius:4px!important;
		}
		.el-button--success{
			border:1px solid rgba(62,180,136,1)!important;
			color: rgba(62,180,136,1)!important;

		}
		.el-button--primary{
			color: #655EFF!important;
		}
	}
</style>
