<template>
	<el-dialog
		title="模板缴费"
		:visible.sync="dialogVisible"
		:before-close="closePay">
		<div class="templage-pay-content">
			<div class="templage-pay-content-left">
				<img :src="tempInfo.photoDetailsUrl" alt="预览图"/>
			</div>
			<div class="templage-pay-content-right">
				<div class="templage-pay-content-right-title">
					{{tempInfo.name}}
				</div>
				<div class="templage-pay-content-right-industry">
          <template v-if="industriesNames.length">
            <span v-for="(industry, index) in industriesNames" :key="index">  {{industry.name}}  </span>
          </template>
          <template v-else> 暂无所属行业 </template>
				</div>
				<div class="templage-pay-content-right-scope">
					<img src="@/assets/images/shop/xiaochengxu.png"/><img src="@/assets/images/shop/weixin.png"/>
				</div>
				<div class="templage-pay-content-right-price">
					<span class="templage-pay-content-right-price-left">
						{{tempInfo.chargeType === 2 ? '一口价' : chargeTypeConstant[tempInfo.chargeType]}}:
					</span>
					<span class="templage-pay-content-right-price-right">
						￥{{tempInfo.price}}元
					</span>
				</div>
				<div class="templage-pay-content-right-codeTitle">
					手机扫描二维码支付
				</div>
				<div class="templage-pay-content-right-code" id="qrcode" ref="qrcode">
<!--					<div class="templage-pay-content-right-code-cover" v-show="!intervalFlag" @click="refreshQrCode">-->
<!--						<i class="el-icon-refresh"></i>-->
<!--						<span class="templage-pay-content-right-code-cover-tip">二维码过期，刷新重试！</span>-->
<!--					</div>-->
          <img class="templage-pay-content-right-code-pic" :src="qrCodeInfo.billQRCode" alt="支付码">
				</div>
				<div class="templage-pay-content-right-btn">
					<el-button @click="closePay" class="templage-pay-content-right-btn-left">取 消</el-button>
					<el-button @click="apply" type="primary" class="templage-pay-content-right-btn-right" :disabled="disabled">使用模版</el-button>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<script>
  import templateConstant from '@/system/constant/template';
  export default {
    name: "templatePay",
    props: {
      dialogVisible: {
        type: Boolean,
        default() {
          return false
        }
      },
      tempInfo: {
        type: Object,
        default() {
          return {}
        }
      },
      qrCodeInfo: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        time: 0,
        timeInterval: '',
        intervalFlag: false,
        disabled: true,
        industriesNames: [], // 需要从模板详情接口获取
      }
    },
    computed: {
      chargeTypeConstant() {
        return templateConstant.chargeType
      },
    },
    methods: {
      handleClose() {
        this.dialogVisible = false
      },
      qrcode() {
        this.time = 0;
        this.disabled = true;
        this.intervalFlag = true;
        this.getPayInfo()
      },
      getPayInfo() {
        let that = this;
        this.timeInterval = window.setTimeout(function () {
          that._apis.templatePay.getPayInfo({
            billDate: that.qrCodeInfo.billDate,
            billNo: that.qrCodeInfo.billNo,
            orderCode: that.qrCodeInfo.orderCode
          }).then(res => {
            if (res.orderStatus === 1) {
              // if(that.intervalFlag && that.time < 120) {
              //   that.time = that.time + 3;
                that.getPayInfo()
              // }else {
              //   that.time = 0;
              //   that.intervalFlag = false;
              //   window.clearTimeout(that.timeInterval)
              // }
            } else if (res.orderStatus === 2) {
              that.disabled = false;
              that.time = 0;
              that.intervalFlag = true;
              window.clearTimeout(that.timeInterval);
              that.confirm({
                title: '支付成功',
                customClass: 'know-custom',
                showCancelButton: false,
                confirmText: '我知道了',
                text: `支付成功，您的装修模版已经重新启用！`
              }).then(() => {})
            }
          }).catch(error => {
            console.error(error)
          })
        }, 3000)
      },
      refreshQrCode() {
        this.time = 0;
        this.intervalFlag = true;
        this.getPayInfo();
      },
      apply() {
        if (this.disabled) return;
        this.confirm({
          customClass: 'goods-custom',
          icon: true,
          text: `部分私有数据需要您自行配置<br/>我们为您预置了这些组件的装修样式！`
        }).then(() => {
          this._routeTo('m_templateEdit', {id: this.tempInfo.id});
        })
      },
      closePay() {
        this.$emit('closePay')
      },

      /* 获取当前模板所属行业 */
      getIndustries() {
        if(!this.tempInfo.id) return;
         this._apis.goodsOperate.getTemplateIndustries({id: this.tempInfo.id}).then(res => {
          this.industriesNames = res.industrys || [];
        }).catch(error => {
          console.error(error)
         })
      },
    },
    watch: {
      'dialogVisible': function (v) {
        if (v) {
          this.$nextTick(() => {
            this.qrcode();
            this.getIndustries();
          })
        } else {
          this.time = 0;
          this.intervalFlag = false;
          this.disabled = true;
          window.clearTimeout(this.timeInterval)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
/deep/ .el-dialog {
	background: #fff;
	/*box-shadow:0 5px 20px 0 rgba(208,214,228,1);*/
	border-radius:10px;
	border:1px solid rgba(204,204,204,1);
	width: 510px;
	.el-dialog__header {
		height:60px;
		background:rgba(101,94,255,0.09);
		border-radius:10px 10px 0 0;
		/*opacity:0.09;*/
		.el-dialog__title {
			font-size:22px;
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
    overflow-y: scroll;

    img {
      width: 100%;
    }
  }

  &-right {
    width: 182px;
    height: 500px;

    &-title {
      width: 182px;
      color: $contentColor;
      line-height: 16px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      word-wrap: break-word;
    }

    &-industry {
      width: 182px;
      height: 16px;
      font-size: 12px;
      color: $grayColor;
      line-height: 16px;
      margin-top: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      word-wrap: break-word;
    }

    &-scope {
      width: 182px;
      height: 20px;
      margin-top: 10px;

      img {
        margin-right: 10px;
        width: 20px;
        height: 20px;
      }
    }

    &-price {
      width: 182px;
      height: 20px;
      line-height: 20px;
      margin-top: 10px;

      &-left {
        font-size: 12px;
        color: $grayColor;
      }

      &-right {
        font-size: 18px;
        color: #F05027;
      }
    }
		&-codeTitle {
			margin-top: 40px;
			width: 182px;
			height:16px;
			font-size:12px;
			color:rgba(146,146,155,1);
			line-height:16px;
		}
		&-code {
			width:150px;
			height:150px;
			margin-top: 8px;
			position: relative;
			&-cover {
				position: absolute;
				cursor: pointer;
				width: 100%;
				height: 100%;
				background: rgba(0,0,0,0.65);
				z-index: 100;
				top: 0;
				left: 0;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 60px;
				color: #ffffff;
				&-tip {
					font-size: 12px;
					line-height: 20px;
				}
			}
      &-pic {
        width: 100%;
        height: 100%;
      }
		}
		&-btn {
      margin-top: 162px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: start;
      flex-flow: row wrap;

      &-left {
        background: #fff;
        border-radius: 4px;
        border: 1px solid rgba(146, 146, 155, 1);
        font-size: 14px;
        font-weight: 400;
        color: rgba(68, 67, 75, 1);
      }

      .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
        color: #fff;
        background-color: #92929B;
      }

			&-right {
        border-radius: 4px;
        font-size: 14px;
			}
		}
	}
}
</style>
