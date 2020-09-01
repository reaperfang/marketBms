<template>
  <div class="base_wxpay">
    <div class="b_w_wrap">
      <el-button type="primary" plain v-if="wechatPay == 0" @click="linkToWxPay"> 开启支付 </el-button>
      <el-button type="primary" plain disabled v-else> 已开启支付 </el-button>
      <p class="b_w_title">按照系统要求设置您店铺的支付信息</p>
    </div>
    
  </div>
</template>

<script>
  export default {
    name: "intelligent_base_wx",
    data() {
      return {
        wechatPay: '',  // 是否开启微信支付 0:否 1:是
      }
    },
    computed:{
      cid(){
        let shopInfo = JSON.parse(localStorage.getItem('shopInfos'));
        return shopInfo.id;
      }
    },
    created() {
      this.getShopPayInfo()
    },
    methods:{
      /** 店铺支付信息 */
      getShopPayInfo(){
        let query = {
          id: this.cid,
          cid: this.cid,
        }
        this._apis.shop.getShopInfo(query).then(response => {
          this.wechatPay = response.wechatPay;
        }).catch(error => {
          this.$message.warning(error);
        })
      },

      // 开启支付 
      linkToWxPay(){
        let routeUrl = this.$router.resolve({name: 'wxSet'});
        window.open(routeUrl.href, '_blank');
      },

    }
  }
</script>

<style lang="scss" scope>
  .base_wxpay {
    position: relative;
  }

  .b_w_wrap {
    min-height: 400px;
    padding: 80px 20px 20px;
    background: #FBFBFC;
  }

  .b_w_title {
    margin-top: 10px;
  }
</style>
