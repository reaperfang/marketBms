/*普通快递 */
<template>
  <div>
    <el-tabs v-model="currentTab" @tab-click="handleClick" class="tabs">
      <el-tab-pane label="快递设置" name="courierSettings"></el-tab-pane>
      <el-tab-pane label="运费模版" name="quickDelivery"></el-tab-pane>
      <el-tab-pane label="电子面单" name="electronicFaceSheet"></el-tab-pane>
    </el-tabs>
    <component :is="currentTab"></component>
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
    
  },
  created() {
    const currentTab = this.$route.query.currentTab
    if (currentTab) {
      this.currentTab = currentTab
    }
  },
  destroyed() {
  },
  methods: {
    handleClick(comp) {
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
}
.main{
  width: 100%;
  padding: 20px;
  background: #fff;
}
</style>