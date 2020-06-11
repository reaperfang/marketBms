<template>
	<div>
		<div class="template_wrapper-head">
			<div class="template_wrapper-head-tags">
				<el-tag
					v-for="(item, index) of checkboxGroup1"
					:key="index + 'checkboxGroup1'"
					closable
					@close="handleSelectItems(item)"
					effect="plain">
					{{ getIndustryName(item) }}
				</el-tag>
			</div>
			<div class="template_wrapper-head-industries">
				<div class="template_wrapper-head-industries-items" :style="ifShowAll ? styleShow : styleHidden">
					<div class="template_wrapper-head-industries-item" @click="handleSelectAll" :style="{background: checkboxGroup1.length ===  industries.length ? '#655EFF' : '#ffffff',color: checkboxGroup1.length ===  industries.length ? '#ffffff' : '#B6B5C8'}">
						全部
					</div>
					<div class="template_wrapper-head-industries-item" v-for="(item, index) of industries" :key="index + 'industries'" @click="handleSelectItems(item.id)" :style="{background: checkboxGroup1.indexOf(item.id) > -1 ? '#655EFF' : '#ffffff',color: checkboxGroup1.indexOf(item.id) > -1 ? '#ffffff' : '#B6B5C8'}">
						{{item.name}}
					</div>
				</div>
				<div class="template_wrapper-head-industries-option" @click="showAllIndustries">
					{{ifShowAll ? '收起' : '全部显示'}}<i :class="ifShowAll ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
				</div>
			</div>
			<div class="template_wrapper-head-conditions">
				<div class="template_wrapper-head-conditions-left">

				</div>
				<div class="template_wrapper-head-conditions-center">
					<el-form ref="ruleForm" :model="ruleForm" :inline="true">
						<el-form-item label="" prop="name">
							<el-radio-group v-model="ruleForm.sortBy" size="small" @change="sortByChange">
								<el-radio-button :value="0" :label="0">综合排序</el-radio-button>
								<el-radio-button :value="1" :label="1">价格<i class="el-icon-top"></i></el-radio-button>
								<el-radio-button :value="2" :label="2">价格<i class="el-icon-bottom"></i></el-radio-button>
								<el-radio-button :value="3" :label="3">人气从高到低</el-radio-button>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="" prop="name">
							<el-checkbox v-model="checked">只看免费模板</el-checkbox>
						</el-form-item>
						<el-form-item label="" prop="name">
							<el-input-number v-model="ruleForm.lowPrice" controls-position="right" :precision="2"></el-input-number><span> &nbsp;-</span>
							<el-input-number v-model="ruleForm.highPrice" controls-position="right" :precision="2"></el-input-number>
						</el-form-item>
					</el-form>
				</div>
				<div class="template_wrapper-head-conditions-left">

				</div>
			</div>
		</div>
		<div class="template_wrapper">
			<ul v-show="templateList.length > 0" class="clearFix" v-loading="loading">
				<li v-for="(item, key) of templateList" :key="key">
					<div class="inner">
						<div class="inner-tag">
							<img src="@/assets/images/template-tag-icon.png"/>
							<span>使用人数：{{item.useCount}}</span>
						</div>
						<div class="view">
							<img :src="item.photoHalfUrl" alt="">
							<div class="cover_small">
								<div class="cover_button" @click="preview(item)">预览模板</div>
								<div class="cover_button_apply" @click="apply(item)">使用模板</div>
							</div>
						</div>
						<div class="info">
							<div class="top">
								<div class="price"  v-show="item.chargeType !== 1">
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
							</div>
							<div class="body">
								<span>{{item.name || '页面模板'}}</span>
							</div>
							<!-- <div class="bottom">
                              <el-button type="success" size="mini" v-if="item.price === 0" plain>免费</el-button>
                              <span class="price" v-if="item.price !== 0">￥{{item.price}}</span>
                              <el-button type="success" plain v-if="item.state === 2" @click="_routeTo('m_templateEdit', {id: scope.row.id})">立即应用</el-button>
                              <el-button type="warning" plain v-if="item.state === 1">立即购买</el-button>
                            </div> -->
							<div class="bottom">
								<i class="mini_program"></i>
								<i class="wechat"></i>
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
				<!--<div class="apply" @click="apply(currentTemplate)">立即应用</div>-->
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
			<empty-list v-show="templateList.length === 0"></empty-list>
			<template-pay :dialogVisible="dialogVisible" :tempInfo="tempInfo"></template-pay>
		</div>
	</div>
</template>

<script>
	import tableBase from '@/components/TableBase';
	import emptyList from './components/emptyList';
	import templatePay from './components/templatePay';
	export default {
		name: 'templateManage',
		extends: tableBase,
		components: { templatePay, emptyList },
		data () {
			return {
				tempInfo: {},
				dialogVisible: false,
				checkboxGroup1: [],
				styleShow: {
					flexFlow: 'row wrap'
				},
				styleHidden: {
					height: '50px',
					overflow: 'hidden'
				},
				ifShowAll: false,
				ruleForm: {
					sortBy: 0,
					lowPrice: undefined,
					highPrice: undefined,
					industryIds: [],
					chargeType: 0,
					type: 1
				},
				num: 0,
				orderType: '',
				industries: [],
				checked: false,
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
			this.effIndustryList()
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
			'checked': function (v) {
				if (v) {
					this.ruleForm.chargeType = 1
				} else {
					this.ruleForm.chargeType = 0
				}
			}
		},
		methods: {
			resetfetch() {
				this.checked = false
				this.ruleForm = {
					sortBy: 0,
					lowPrice: undefined,
					highPrice: undefined,
					industryIds: [],
					chargeType: 0,
					type: 1
				}
				this.checkboxGroup1 = []
				this.startIndex = 1
				this.fetch()
			},
			fetch() {
				this.loading = true;
				this.ruleForm.industryIds = this.checkboxGroup1
				this._apis.goodsOperate.getEffTemplateList({
					startIndex: this.startIndex,
					pageSize: this.pageSize,
					...this.ruleForm
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
				this.dialogVisible = true
				this.tempInfo = item
				// this.confirm({
				// 	title: '提示',
				// 	customClass: 'goods-custom',
				// 	icon: true,
				// 	text: `部分私有数据需要您自行配置<br/>我们为您预置了这些组件的装修样式！`
				// }).then(() => {
				// 	this._routeTo('m_templateEdit', {id: item.id});
				// })
			},
			showAllIndustries() {
				this.ifShowAll = !this.ifShowAll
			},
			// 选择
			handleSelectItems(value) {
				if (this.checkboxGroup1.indexOf(value) > -1) {
					var index = this.checkboxGroup1.indexOf(value)
					this.checkboxGroup1.splice(index, 1);
				}else {
					this.checkboxGroup1.push(value)
				}
			},
			// 全选
			handleSelectAll() {
				if (this.checkboxGroup1.length === this.industries.length) {
					this.checkboxGroup1 = []
				} else {
					this.checkboxGroup1.length = 0
					this.industries.map(item => {
						this.checkboxGroup1.push(item.id)
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
			sortByChange(v) {
				this.fetch()
			},
			// 有效行业列表
			effIndustryList(){
				console.log(3243214321)
				this._apis.industry.effIndustryList({}).then((response)=>{
					console.log(response)
					this.industries = response
				}).catch((error)=>{
					console.error(error);
				});
			},
			// 获取行业名称
			getIndustryName(id) {
				let name = ''
				this.industries.map(item => {
					if (item.id == id) {
						name =  item.name
					}
				})
				return name
			}
		}
	}
</script>

<style lang="scss" scoped>
	.template_wrapper-head {
		background: #fff;
		padding-bottom:20px;
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: start;
		flex-flow:row wrap;
		&-tags {
			display: flex;
			flex-direction: row;
			justify-content: start;
			align-items: start;
			flex-flow:row wrap;
			padding-left: 20px;
			padding-right: 20px;
			.el-tag {
				min-width:67px;
				height:24px;
				border-radius:2px;
				border:1px dashed rgba(101,94,255,1);
				font-size:14px;
				margin-right: 16px;
				margin-top: 15px;
				font-family:MicrosoftYaHei;
				color:rgba(101,94,255,1);
				line-height:24px;
				padding-right: 10px;
				padding-left: 10px;
			}
		}
		&-industries {
			padding-left: 20px;
			padding-right: 20px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: start;
			flex-flow:row wrap;
			width: 100%;
			&-items {
				flex: 1;
				display: flex;
				flex-direction: row;
				justify-content: start;
				align-items: start;
				flex-flow:row wrap;
			}
			&-option {
				margin-top: 16px;
				width: 170px;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				flex-flow:row wrap;
			}
			&-item {
				min-width:80px;
				padding-left: 10px;
				padding-right: 10px;
				height:34px;
				border-radius:2px;
				border:1px solid rgba(182,181,200,1);
				margin-right: 16px;
				margin-top: 14px;
				font-size:14px;
				font-family:MicrosoftYaHei;
				text-align: center;
				color:rgba(182,181,200,1);
				line-height:34px;
			}
		}
		&-conditions {
			width: 100%;
			height: 100px;
			margin-top: 16px;
			display: flex;
			flex-direction: row;
			justify-content: start;
			align-items: center;
			flex-flow:row wrap;
			.el-radio-group label:last-child {
				margin-left: 0!important;
			}
			/deep/ .is-active span{
				background: #ffffff;
				color: rgba(24,144,255,1);;
			}
			/deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
				border-color: #1890FF;
				-webkit-box-shadow: -1px 0 0 0 #1890FF;
			}
			&-left {
				width: 15px;
				height: 100px;
			}
			&-center {
				flex: 1;
				height: 100px;
				display: flex;
				flex-direction: row;
				justify-content: start;
				align-items: center;
				flex-flow:row wrap;
				border-top: 1px solid rgba(242,242,249,1);
			}
		}
	}
	.template_wrapper{
		// min-width:1650px;
		margin-top: 20px;
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
						width:117px;
						height:26px;
						position: absolute;
						top: 0;
						right: 0;
						z-index: 100;
						line-height: 26px;
						text-align: center;
						font-size:12px;
						font-family:PingFangSC-Medium,PingFang SC;
						font-weight:500;
						color:rgba(255,255,255,1);
						img {
							position: absolute;
							height: 100%;
							top: 0;
							right: 0;
							z-index: 101;
						}
						span {
							position: absolute;
							height: 100%;
							top: 0;
							right: 10px;
							z-index: 102;
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
								margin-top: 16px;
								font-size:14px;
								font-family:MicrosoftYaHei;
								color:rgba(255,255,255,1);
								line-height:19px;
								padding:6px 17px;
								border-radius:4px;
								background:rgba(101,94,255,1);
								border:1px solid rgba(101,94,255,1);
								cursor: pointer;
								transition: all 0.4s;
								&:hover{
									background:rgba(101,94,255,1);
									border:1px solid rgba(101,94,255,1);
								}
							}
						}
					}
					.info{
						margin-top:10px;
						.top{
							display:flex;
							flex-direction: row;
							justify-content: start;
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
	/deep/.el-button--small{
		padding:9px 12px!important;
		background: #fff!important;
		border-radius:4px!important;
	}
	/deep/.el-button--success{
		border:1px solid rgba(62,180,136,1)!important;
		color: rgba(62,180,136,1)!important;

	}
	/deep/.el-button--primary{
		color: #655EFF!important;
	}
</style>
