/*普通快递 */
<template>
  <div>
    <el-tabs v-model="currentTab" @tab-click="handleClick" class="tabs">
      <el-tab-pane name="courierSettings" >
        <span slot="label" v-permission="['设置','普通快递','快递设置']">快递设置</span>
        <component v-if="currentTab === 'courierSettings'"  v-permission="['设置','普通快递','快递设置']" :is="currentTab"></component>
      </el-tab-pane>
      <el-tab-pane name="quickDelivery">
        <span slot="label" v-permission="['设置','普通快递','运费模版']">运费模版</span>
        <component v-if="currentTab === 'quickDelivery'"  v-permission="['设置','普通快递','运费模版']" :is="currentTab"></component>
      </el-tab-pane>
      <el-tab-pane name="electronicFaceSheet">
        <span slot="label" v-permission="['设置','普通快递','电子面单']">电子面单</span>
        <component v-if="currentTab === 'electronicFaceSheet'" v-permission="['设置','普通快递','电子面单']" :is="currentTab"></component>
      </el-tab-pane>
    </el-tabs>
  </div>     
</template>

<script>
// import preSale from './components/preSale'
// import afterSale from './components/afterSale'
import courierSettings from './components/courierSettings'
import quickDelivery from './components/quickDelivery'
import electronicFaceSheet from './components/electronicFaceSheet'
export default {
  name: 'ordinaryExpress',
  data() {
    return {
      currentTab: 'courierSettings',
    }
  },
  components: {
    quickDelivery,
    courierSettings,
    electronicFaceSheet
  },
  watch: {
    currentTab(curr) {
      console.log(curr)
      // this.init()
    }
  },
  created() {
    this.init()
  },
  destroyed() {
  },
  methods: {
    init() {
      // this.currentTab = 'quickDelivery'
      // this.$nextTick(() => {
        const currentTab = this.$route.query.currentTab
        console.log('--currentTab---', currentTab)
        if (currentTab) {
          this.currentTab = currentTab
        }
      // })
    },
    handleClick(comp) {
      // console.log(comp)
      this.currentTab = comp.name;
      this.$router.replace({path: '/set/ordinaryExpress', query:{currentTab: comp.name }})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.tabs{
  background:#fff; 
  padding:10px 20px 0 20px;
  >>> .el-tabs__item {
    padding: 0;
    span {
      padding: 0 20px;
    }
  }
}
.main{
  width: 100%;
  padding: 20px;
  background: #fff;
}
</style>