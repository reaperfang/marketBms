<template>
   <div style="height: 100%;background:#fff;" v-loading="isLoading" element-loading-background="rgba(255,255,255,1)" >
      <!-- <guide-prompt v-if="isGuidePrompt"></guide-prompt> -->
      <!-- <scope v-if="step === 1" :step="step"></scope> -->

      <component v-if="step" :is="currentComponent" @getStep="setStep" :step="step"></component>
   </div>
</template>

<script>
// 开店引导提示页
// shopGuidePrompt
// const GuidePrompt = () =>
//   import(/* webpackChunkName: "shopGuidePrompt" */ './components/guidePrompt')
// 经营范围
const Scope = () =>
  import(/* webpackChunkName: "shopGuidescope" */ './components/scope')
// 店铺信息
const EasyShopInfo = () =>
  import(/* webpackChunkName: "easyShopInfo" */ './components/easyShopInfo')
// 渠道绑定及支付
const ChannelBindAndPay = () =>
  import(/* webpackChunkName: "channelBindAndPay" */ './components/channelBindAndPay')
// 运营交易配置operativeDealConfig
const OperativeDealConfig = () =>
  import(/* webpackChunkName: "operativeDealConfig" */ './components/operativeDealConfig')
// 店铺装修 decoration
const decoration = () =>
  import(/* webpackChunkName: "decoration" */ './components/decoration')
export default {
  components: {
    OperativeDealConfig,
    ChannelBindAndPay,
    EasyShopInfo,
    // GuidePrompt,
    decoration,
    Scope
  },

  data () {
    return {
      step: null,
      currentComponent: null,
      isLoading: true
    }
  },

  computed: {
    cid() {
      let shopInfo = this.$store.getters.shopInfos;
      return shopInfo.id;
    }
  },

  watch: {},

  created() {
    this.init()
  },

  mounted() {},

  methods: {
    setStep(step) {
      this.step = step
      this.setCurrentComponent()
    },
    getStep() {
      const req = {
        cid: this.cid
      }
      this._apis.shop.getStep(req).then((res) => {
        // console.log('--getStep---',res)
        this.step = res && res.step
        this.setCurrentComponent()
        
      }).catch((err) => {
        console.error(err)
        this.$message.error(err)
      }).finally(() => {
        this.isLoading = false
      })
    },
    init() {
      this.getStep()
    },
    setCurrentComponent() {
      const step = this.step
      switch(step) {
        case 1:
          this.currentComponent = 'Scope'
          break
        case 2:
          this.currentComponent = 'EasyShopInfo'
          break
        case 3:
          this.currentComponent = 'ChannelBindAndPay'
          break
        case 4:
          this.currentComponent = 'OperativeDealConfig'
          break
        case 5:
          this.currentComponent = 'decoration'
          break
        case 6:
          this.currentComponent = 'decoration'
          break
        // default:
        //   this.currentComponent = 'GuidePrompt'
        //   break
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>