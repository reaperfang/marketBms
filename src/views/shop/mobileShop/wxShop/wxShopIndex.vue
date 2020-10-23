<template>
  <div class="wrapper" :class="{'shopMain-wrapper': currentTab === 'shopMainDecorated'}">
    <el-tabs v-model="currentTab">
      <el-tab-pane label="店铺主页" :name="shopMain"></el-tab-pane>
      <el-tab-pane label="个人中心" name="personCenter"></el-tab-pane>
      <el-tab-pane label="商品分类" name="goodsGroup"></el-tab-pane>
      <el-tab-pane label="店铺导航" name="shopNavIndex"></el-tab-pane>
    </el-tabs>
    <div v-if="loading && currentTab === 'shopMainDefault'" class="loading_wrapper" v-calcHeight="160" v-loading="loading"></div>
    <template v-if="!loading">
      <!-- <transition name="fade" :duration="{ enter: 10, leave: 10 }"> -->
        <component :is="currentTab" :decorateData="decorateData" :webPageStatus="webPageStatus" :statusLoading="statusLoading"></component>
      <!-- </transition> -->
    </template>
  </div>
</template>

<script>
import shopMainDefault from './shopMainDefault';
import shopMainDecorated from './shopMainDecorated';
import personCenter from './personCenter';
import goodsGroup from './goodsGroup';
import shopNavIndex from './shopNavIndex';
import utils from "@/utils";
export default {
  name: 'index',
  components: {shopMainDefault, shopMainDecorated, personCenter, goodsGroup, shopNavIndex},
  data () {
    return {
      currentTab: 'shopMainDefault',  //当前页签
      shopMain: 'shopMainDefault',  //当前主页类型
      loading: true,
      hasHomePage: false,  //是否有首页装修数据
      decorateData: null,  //首页装修数据
      ruleForm: {
        pageTag: 0
      },
      statusLoading: true,
      webPageStatus: null //未绑定过域名
    }
  },

  created() {
    this.fetch();
  },

  methods: {

    /* 获取首页数据 */
    fetch() {
      this.loading = true;
      this._apis.shop.getHomePage(this.ruleForm).then((response)=>{
        //没有装修首页
        if(!response) {
          this.hasHomePage = false;
          this.shopMain = 'shopMainDefault';
          this.currentTab = 'shopMainDefault';
        }else{  //装修了首页
          this.hasHomePage = true;
          this.shopMain = 'shopMainDecorated';
          this.currentTab = 'shopMainDecorated';
          this.decorateData = response;
        }
        //this.currentTab = 'shopNavIndex';
        
        this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  background: #fff;
  padding: 0 20px 20px 20px;
  border-radius: 4px;
}
.el-tabs{
  background: rgb(255, 255, 255);
}
/deep/ .el-tabs__header {
  margin: 0;
}
.loading_wrapper{
  width:100%;
}
</style>
<style lang="scss">
  .shopMain-wrapper {
    /deep/ .phone-body {
      height: calc(100% - 64px) !important;
    }
  }
</style>
