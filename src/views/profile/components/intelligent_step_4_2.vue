<template>
  <div class="base_wxpay">
    <span class="b_w_set" v-if="wechatPay === 0" @click="linkToWxPay"> 开启支付 </span>
    <span class="b_w_on" v-else> 已开启支付 </span>
    <p class="b_w_title">按照系统要求设置您店铺的支付信息</p>
  </div>
</template>

<script>
  export default {
    name: "intelligent_base_wx",
    data() {
      return {
        wechatPay: 0,  // 是否开启微信支付 0:否 1:是
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
          this.$emit('wxpay-status', this.wechatPay);
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

  .b_w_set {
    display: inline-block;
    width: 80px;
    height: 30px;
    border-radius: 4px;
    border: 1px solid $globalMainColor;
    font-size: 14px;
    font-weight: 400;
    color: $globalMainColor;
    line-height: 28px;
    text-align: center;
    cursor: pointer;
    user-select: none;
  }

  .b_w_on {
    display: inline-block;
    width: 94px;
    height: 30px;
    border-radius: 4px;
    opacity: 0.5;
    border: 1px solid #DADAE3;
    font-size: 14px;
    font-weight: 400;
    color: $contentColor;
    line-height: 28px;
    text-align: center;
    cursor: default;
    user-select: none;
  }

  .b_w_title {
    margin-top: 10px;
  }
  
</style>
