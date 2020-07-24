<template>
   <!-- <div> -->
      <!-- <guide-prompt v-if="isGuidePrompt"></guide-prompt> -->
      <!-- <scope v-if="step === 1" :step="step"></scope> -->

      <component :is="currentComponent" :step="step"></component>
   <!-- </div> -->
</template>

<script>
// 开店引导提示页
// shopGuidePrompt
const GuidePrompt = () =>
  import(/* webpackChunkName: "shopGuidePrompt" */ './components/guidePrompt')
// 经营范围
const Scope = () =>
  import(/* webpackChunkName: "shopGuidescope" */ './components/scope')
// 店铺信息
const EasyShopInfo = () =>
  import(/* webpackChunkName: "easyShopInfo" */ './components/easyShopInfo')
export default {
  components: {
    EasyShopInfo,
    GuidePrompt,
    Scope
  },

  data () {
    return {
      isGuidePrompt: false,
      step: 2,
      currentComponent: null
    }
  },

  computed: {},

  watch: {},

  created() {
    this.setCurrentComponent()
  },

  mounted() {},

  methods: {
    setCurrentComponent() {
      const step = this.step
      switch(step) {
        case 1:
          this.currentComponent = 'Scope'
          break
        case 2:
          this.currentComponent = 'easyShopInfo'
          break
        case 3:
          break
        case 4:
          break
        case 5:
          break
        default:
          this.currentComponent = 'GuidePrompt'
          break
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>