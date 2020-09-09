<template>
  <div class="recharge">
    <!-- 充值 -->
    <h1 class="top">请输入充值金额</h1>
    <div class="tip">
      说明：充值金额将直接充入您在达达快送的账户中，您可以登录达达开放平台（
      <a
        href="https://newopen.imdada.cn"
        target="_blank"
        ref="nofollow"
      >https://newopen.imdada.cn</a>）-管理中心-商户中心-运费服务-运费账户中查看，开发票请联系达达客服申请。
    </div>
    <div class="store_box">
      <el-form
        ref="ruleForm"
        :rules="rules"
        label-position="left"
        :model="ruleForm"
        label-width="73px"
        class="formBox"
      >
        <el-form-item label="充值对象：">{{ address }}</el-form-item>
        <el-form-item label="充值金额：" prop="price">
          <numberInput
            style="width: 193px;"
            v-model="ruleForm.price"
            :max="99999999"
            placeholder="请输入充值金额"
          ></numberInput>
          <span>元</span>
        </el-form-item>
        <el-button class="recharge-btn" type="primary" size="small" @click="getRechargeNum">下一步</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
import numberInput from "@/components/NumberInput";
export default {
  name: "recharge",
  components: {
    numberInput,
  },
  data() {
    var validatePrice = (rule, value, callback) => {
      if (value === "" || value === 0) {
        callback(
          new Error(
            "请输入有效的金额值，充值金额不能为0，小数点前不能超过8位数字，小数点后不能超过2位数字。"
          )
        );
      } else {
        callback();
      }
    };
    return {
      address: "达疆网络科技(上海)有限公司（新达达）",
      ruleForm: {
        price: "",
      },
      rules: {
        price: [{ validator: validatePrice, trigger: "blur" }],
      },
    };
  },
  mounted() {},
  methods: {
    //充值
    getRechargeNum() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          let param = {
            sourceId: this.$route.params.sourceId,
            rechargeMoney: this.ruleForm.price,
            category: "PC",
          };
          this._apis.set
            .getRecharge(param)
            .then((response) => {
              let url = response.payUrl;
              if (url) {
				window.open(url);
				this.confirm({
					title: "请确认支持状态",
					text: "请在新打开的页面中完成支付",
					showCancelButton: false,
					customClass: "recharge-confirm",
					confirmText: "已完成支付",
					beforeClose: (action, instance, done) => {
					if (action === "confirm") {
						instance.confirmButtonLoading = true;
						//instance.confirmButtonText = '执行中...';
						this._apis.set
						.getRecharge(param)
						.then((response) => {
							done();
							setTimeout(() => {
							instance.confirmButtonLoading = false;
							}, 300);
							//跳转到充值记录页面
							this.$router.push({
							name: "rechargeRecord",
							params: {
								sourceId: this.$route.params.sourceId,
							},
							});
						})
						.catch((error) => {
							done();
							setTimeout(() => {
							instance.confirmButtonLoading = false;
							}, 300);
							this.$message.error(error);
						});
					} else {
						done();
					}
					},
				}).then(() => {});
              }
            })
            .catch((error) => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.recharge {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  background: #fff;
  padding: 0 20px 35px 20px;
  border-radius: 4px;

  .top {
    height: 52px;
    line-height: 52px;
    font-size: 16px;
    color: #3d434a;
    border-bottom: 1px solid #d9dee9;
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

  .formBox {
    margin: 25px 0 0 20px;
  }
  .recharge-btn {
    position: absolute;
    left: 50%;
    bottom: 35px;
    width: 88px;
    margin-left: -44px;
  }
}

.store_box {
  h1 {
    color: #3d434a;
    font-size: 14px;
    margin-bottom: 20px;
  }
  /deep/ .el-form-item__label {
    padding-right: 0;
  }

  .info {
    background: #f2f2f2;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;

    p {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 24px;
    }
  }
}

.proText {
  font-size: 14px;
  color: #44434b !important;
}
</style>

<style lang="scss">
.recharge-confirm {
  /deep/ .el-message-box__headerbtn {
    display: none;
  }
  /deep/ .el-icon-loading {
    letter-spacing: 0;
  }
}
</style>
