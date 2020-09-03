<!--物流对账-->
<template>
  <div>
    <el-tabs v-model="currentTab" @tab-click="handleClick" class="tabs">
      <el-tab-pane label="电子面单" name="faceSheet"></el-tab-pane>
      <el-tab-pane v-if="showTab" label="物流查询" name="logisticsInquiry"></el-tab-pane>
    </el-tabs>
    <component :is="currentTab"></component>
  </div>
</template>

<script>
import faceSheet from './components/faceSheet';
import logisticsInquiry from './components/logisticsInquiry';
export default {
  name: 'revenueSituation',
  components: {faceSheet, logisticsInquiry},
  data() {
    return {
      currentTab: 'faceSheet',
      showTab: false,
    }
  },
  watch: {

  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
    this._apis.finance.getListFs({
        version:0,
        queryType:1,
        relationSn:'',
        expressSn:'',
        expressCompany:'',
        businessType:'',
        startTime:'',
        endTime:'',
        startIndex:1,
        pageSize:1,
        sort:'desc'
    }).then((response)=>{
      if (response.total > 0) {
        this.showTab = true
      }
    }).catch((error)=>{
    })
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
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
  padding:10px 20px;
}
</style>
