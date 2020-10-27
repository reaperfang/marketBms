<template>
  <div>
   <div v-if="isFirstLogin" class="shopGuidePrompt">
     <p class="prompt-txt">为了早日线上营业，请您完成以下必要操作</p>
     <div class="prompt-bg">
       <!-- <img src="@/assets/images/profile/b_shop_guide.jpg"> -->
     </div>
     <div class="prompt-btn">
       <el-button size="small" class="btn guidePrompt-cancel" @click="goPage">先体验</el-button>
       <el-button size="small" type="primary" class="btn guidePrompt-confirm" @click="goStep">我已准备好</el-button>
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
      isFirstLogin: false,
      // storeGuide: null,
      isClick: false, // 为了解决在初始化设置引导状态时，后端未返回结果的情况，用户直接操作后，导致bug
    }
  },

  computed: {
    cid() {
      let shopInfo = this.$store.getters.shopInfos;
      return shopInfo.id;
    },
    storeGuide() {
      return this.$store.state.shop.storeGuide || null
      // let shopInfo = this.$store.getters.shopInfos;
      // return shopInfo.storeGuide || null;
    }
  },

  watch: {},

  created() {
    this.init()
  },

  mounted() {},

  methods: {
    setStoreGuide(storeGuide) {
      let id = this.cid
      let data = {
        id,
        storeGuide
      }
      this._apis.shopInfo.updateShopInfo(data).then(response =>{
        this.$store.dispatch('getShopInfo');
        const storeGuide = response && response.storeGuide || storeGuide
        this.$store.commit('setStoreGuide', storeGuide)
        this.isClick = true
        // this.$nextTick(()=> {
        //   this.$refs.shopInfoMap.clearSearchResultList()
        //   this.$refs.shopInfoMap.clearKeyword()
        // })
      }).catch(error =>{
        console.error('updateShopInfo:error', error)
        // this.$message.error('保存失败');
      })
    },
    init() {
      this.isFirstLogin = this.storeGuide && this.storeGuide === -1
      if (!this.isFirstLogin) {
        this.isClick = true
        this.$router.push({ path: '/profile/profile'}) 
      } else {
        this.setStoreGuide(0)
      }
    },
    updateStep() {
      const cid = this.cid;
      const step = 1
      this._apis.shop
        .updateStep({ cid, step })
        .then(response => {
          this.$router.push({ path: '/profile/shopGuide'})
        }).catch((err) => {
          console.error(err)
        })
    },
    getShopInfo() {
      this.$store.dispatch('getShopInfo').then(response => {
          // this.storeGuide = response && response.storeGuide
          this.init()
        })
    },
    goPage() {
      if (this.isClick) this.$router.push({ path: '/profile/profile'}) 
    },
    goStep() {
      // 设置tep 1
      if (this.isClick) this.updateStep()
      
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
      width: 100%;
      height: 503px;
      margin: 0 auto;
      margin-top: 74px;
      text-align: center;
      background-size: contain;
      background-image: url('~@/assets/images/profile/b_shop_guide.jpg');
      background-repeat: no-repeat;
      background-position: center;
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
      .guidePrompt-cancel {
        color:rgba(101,94,255,1);
        margin-right: 45px;
      }
      .guidePrompt-confirm {
        color:rgba(255,255,255,1);
        padding: 9px 15px;
      }
    }
  }
}
</style>
