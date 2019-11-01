<template>
  <div style="background:rgb(242,242,249);">
    <el-tabs v-model="currentTab">
      <el-tab-pane label="店铺主页" :name="shopMain" v-loading="loading"></el-tab-pane>
      <el-tab-pane label="个人中心" name="personCenter"></el-tab-pane>
      <el-tab-pane label="商品分类" name="goodsGroup"></el-tab-pane>
    </el-tabs>
    <component :is="currentTab" :homePageData="homePageData"></component>
  </div>
</template>

<script>
import shopMainDefault from './moduleManage/shopMainDefault';
import shopMainDecorated from './moduleManage/shopMainDecorated';
import personCenter from './moduleManage/personCenter';
import goodsGroup from './moduleManage/goodsGroup';
import utils from "@/utils";
import decorateMixin from '@/components/Decorate/mixins/decorateMixin';
export default {
  name: 'index',
  mixins: [decorateMixin],
  components: {shopMainDefault, shopMainDecorated, personCenter, goodsGroup},
  data () {
    return {
      currentTab: 'shopMainDefault',  //当前页签
      shopMain: 'shopMainDefault',  //当前主页类型
      loading: true,
      hasHomePage: false,  //是否有首页装修数据
      homePageData: null  //首页装修数据
    }
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
          this.homePageData = response;
          this.convertDecorateData(response);
        }
        this.loading = false;
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
        this.loading = false;
      });
    },

     /* 拼装基础数据 */
    setBaseInfo(data) {
       //还原页面基础信息
      this.$store.commit("setBaseInfo", {
        name: data.name,
        title: data.title,
        explain: data.explain,
        pageCategoryInfoId: data.pageCategoryInfoId,
        colorStyle: data.colorStyle,
        pageKey: data.pageKey
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
