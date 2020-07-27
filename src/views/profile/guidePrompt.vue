<template>
  <div>
   <div v-if="isFirstLogin" class="shopGuidePrompt">
     <p class="prompt-txt">为了早日线上营业，请您完成以下必要操作</p>
     <img class="prompt-bg" src="@/assets/images/profile/b_shop_guide.png">
     <div class="prompt-btn">
       <el-button size="small" class="btn cancel" @click="goPage">先体验</el-button>
       <el-button size="small" type="primary" class="btn confirm" @click="goStep">我已准备好</el-button>
     </div>
   </div>
  </div>
</template>

<script>
export default {
  components: {
  },

  data () {
    return {
      isFirstLogin: false
    }
  },

  computed: {
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    },
    storeGuide() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.storeGuide || null;
    }
  },

  watch: {},

  created() {
    if (this.storeGuide) {
      console.log('---2121-', this.storeGuide)
      this.isFirstLogin = this.storeGuide && this.storeGuide === -1
      if (!this.isFirstLogin) this.$router.push({ path: '/profile/profile'})
    } else {
      his.getShopInfo()
    }
  },

  mounted() {},

  methods: {
    updateStep() {
      const cid = this.cid;
      const step = 1
      this._apis.shop
        .updateStep({ cid, step })
        .then(response => {
          this.$router.push({ path: '/profile/shopGuide'})
        }).catch((err) => {
          console.log(err)
        })
    },
    getShopInfo() {
      let id = this.cid;
      this._apis.set
        .getShopInfo({ id: id })
        .then(response => {
          console.log('---',response && response.storeGuide === -1)
          this.isFirstLogin = response && response.storeGuide === -1
          if (!this.isFirstLogin) this.$router.push({ path: '/profile/profile'})
        })
    },
    goPage() {
      this.$router.push({ path: '/profile/profile'})
    },
    goStep() {
      // 设置tep 1
      this.updateStep()
      
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.shopGuidePrompt {
  padding: 34px 26px;
  background: #fff;
  .prompt {
    &-txt {
      font-size:16px;
      font-weight:500;
      color:rgba(22,22,23,1);
      line-height:22px;
    }
    &-bg {
      display: block;
      max-width: 930px;
      max-height: 503px;
      margin: 0 auto;
      margin-top: 74px;
      // background: url('~@/assets/images/profile/b_shop_guide.png') no-repeat;
    }
    &-btn {
      padding-top: 83px;
      text-align: center;
      .btn {
        width: 90px;
        margin: 0 auto;
        font-size:12px;
        font-weight:400;
      }
      .cancel {
        color:rgba(101,94,255,1);
        margin-right: 45px;
      }
      .confirm {
        color:rgba(255,255,255,1);
      }
    }
  }
}
</style>