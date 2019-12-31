<template>
  <div style="background:rgb(242,242,249);">
    <el-tabs v-model="currentTab">
      <el-tab-pane label="店铺主页" :name="shopMain" v-loading="loading"></el-tab-pane>
      <el-tab-pane label="个人中心" name="personCenter"></el-tab-pane>
      <el-tab-pane label="商品分类" name="goodsGroup"></el-tab-pane>
      <el-tab-pane label="店铺导航" name="shopNavIndex"></el-tab-pane>
    </el-tabs>
    <component :is="currentTab" :decorateData="decorateData"></component>
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
      decorateData: null  //首页装修数据
    }
  },

  created() {
    this.fetch();
  },

  methods: {

    /* 获取首页数据 */
    fetch() {
      this.loading = true;
      this._apis.shop.getHomePage({}).then((response)=>{

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
.el-tabs{
  padding:20px;
  padding-bottom: 0;
}
</style>
