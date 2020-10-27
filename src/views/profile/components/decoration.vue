<template>
  <component v-if="step" :is="currentComponent" @getStep="getStep" :shareUrl="shareUrl" :step="step"></component>
</template>

<script>
const hasBeenRenovated = () =>
  import(/* webpackChunkName: "hasBeenRenovated" */ './hasBeenRenovated')
const beingRenovated = () =>
  import(/* webpackChunkName: "beingRenovated" */ './beingRenovated')
export default {
  components: {
    hasBeenRenovated,
    beingRenovated
  },

  props: {
    step: {
      type: Number,
      default: 5
    }
  },

  data () {
    return {
      currentComponent: null,
      shareUrl: null // 公众号生成二维码需要的地址
    }
  },

  computed: {},

  watch: {},

  created() {
    this.getHomePage()
  },

  mounted() {},

  methods: {
    getStep(step) {
      this.$emit('getStep', step)
    },
    getHomePage() {
      // 6为整个引导步骤走完，显示引导已完成弹窗，否则再去判断是否已经装修
      if (this.step === 6) {
        this.currentComponent = 'beingRenovated'
      } else {
        this._apis.shop.getHomePage({ pageTag: 0 }).then((response)=>{
          // console.log('response', response)
          //没有装修首页
          if(!response) {
            this.currentComponent = 'beingRenovated'
          }else{  //装修了首页
            this.currentComponent = 'hasBeenRenovated'
            this.shareUrl = response && response.shareUrl
          }
        }).catch((error)=>{
          console.error(error)
        });
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>