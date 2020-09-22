/*交易设置 */
<template>
  <div>
    <el-tabs v-model="currentTab" @tab-click="handleClick" class="tabs">
      <el-tab-pane label="售前相关" name="preSale"></el-tab-pane>
      <el-tab-pane label="售后相关" name="afterSale"></el-tab-pane>
    </el-tabs>
    <component :is="currentTab"></component>
  </div>     
</template>

<script>
import preSale from './components/preSale'
import afterSale from './components/afterSale'
export default {
  name: 'tradeSet',
  data() {
    return {
      currentTab: 'preSale',
    }
  },
  components: {preSale,afterSale},
  watch: {
    
  },
  created() {

  },
  destroyed() {
    
  },
  methods: {
    handleClick(comp) {
      this.currentTab = comp.name;
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.tabs{
  background:#fff; 
  padding:0 20px;
}
.main{
  width: 100%;
  padding: 20px;
  background: #fff;
}
</style>