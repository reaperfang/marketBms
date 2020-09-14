/*消息设置 */
<template>
  <div class="messageSet">
   <el-tabs v-model="currentTab" @tab-click="handleClick" class="tabs">
      <el-tab-pane label="用户通知" name="seller"></el-tab-pane>
      <el-tab-pane label="客户通知" name="buyer"></el-tab-pane>
    </el-tabs>
    <component :is="currentTab"></component>
  </div>     
</template>

<script>
import buyer from "./components/buyer";
import seller from "./components/seller";
export default {
  name: 'messageSet',
  data() {
    return {
      currentTab: 'seller'
    }
  },
  components: {buyer, seller},
  watch: {
    
  },
  computed: {
  }, 
  created() { 

  },
  methods: {
    handleClick(comp) {
      this.currentTab = comp.name;
    }
  },
  mounted() {

  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
.messageSet {
  .el-tabs__item {
    height: 45px;
    line-height: 45px;
    font-size:16px;
    font-weight:400;
    color:rgba(68,67,75,1);
    &.is-active {
      color:rgba(101,94,255,1);
      font-weight:500;
    }
  }
  .table {
    th>.cell {
      font-weight:500;
      color:rgba(146,146,155,1);
    }
    td>.cell {
      font-weight:400;
      color:rgba(22,22,23,1);
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.tabs{
  background:#fff; 
  padding:10px 20px;
}
</style>