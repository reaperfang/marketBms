/*消息设置 */
<template>
  <div>
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
    this.getShopMessage()
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

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.tabs{
  background:#fff; 
  padding:10px 20px;
}
</style>