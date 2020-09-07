<template>
  <div class="shopExpress shopInfoBox">
    <!-- 充值 -->
    <h1 class="top">请输入充值金额</h1>
    <div class="store_box">
      <el-form
        ref="ruleForm"
        :rules="rules"
        label-position="left"
        :model="ruleForm"
        label-width="90px"
        class="formBox"
      >
        <el-form-item label="充值对象：">
          <!-- <label>取货地址：</label> -->
          {{ address }}
        </el-form-item>
        <el-form-item label="充值金额：" prop="price">
          <el-input
            v-model.number="ruleForm.price"
            style="width: 131px;"
            placeholder="请输入充值金额"
            @input="handleChange"
          ></el-input>&nbsp;&nbsp;
          <span>元</span>
        </el-form-item>
        <el-button
          type="primary"
          size="small"
          @click="getRechargeNum"
          style="marginLeft:90px;marginTop:20px"
        >下一步</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name:"recharge",
  data() {
    return {
      address: "达疆网络科技(上海)有限公司（新达达）",
      ruleForm: {
        price: null
      },
      rules: {
        price: [{ type: "number", min: 1, message: "必须为整数" }]
      }
    };
  },
  mounted() {
    //this.getRechargeNum()
  },
  methods: {
    handleChange() {
      console.log(11);
      if (String(this.ruleForm.price).length > 8) {
        this.ruleForm.price = 99999999;
      }
    },
    //充值
    getRechargeNum() {
      if(this.ruleForm.price==null){
          this.$message.error("请输入充值金额");
          return false
      }
      let param = {
        sourceId: this.$route.params.sourceId,
        rechargeMoney: this.ruleForm.price,
        category: "PC"
      };
      this._apis.set
        .getRecharge(param)
        .then(response => {
          let url = response.payUrl;
          if (url) {
            window.open(url);
          }

          console.log("response", response);
        })
        .catch(error => {
          this.loading = false;
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
  .formBox {
    margin: 30px 0 0 30px;
  }
}
.store_box {
  h1 {
    color: #3d434a;
    font-size: 14px;
    margin-bottom: 20px;
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