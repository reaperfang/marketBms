/* 移动H5导航首页装修 */
<template>
  <div>
    <el-tabs class="el-tabs--button" v-model="navigation_type" @tab-click="handleClick">
      <el-tab-pane label="移动H5导航" name="0"></el-tab-pane>
    </el-tabs>
    <div class="on_off">
      <p>店铺的各个页面可以通过导航串联起来。通过精心设置的导航，方便买家在栏目间快速切换，引导买家前往你期望的页面。  </p>
      <el-switch
        v-model="openNav"
        active-color="#13ce66"
        inactive-color="#CACACF"
        @change="switchStatusChange">
      </el-switch>
    </div>
    <component :is="'h5NavEdit'" :apiNavData="apiNavData" @submitNavData="submit" @resetNavData="resetData"></component>
  </div>
</template>
<script>
import h5NavEdit from "./shopNav/h5NavEdit";
import utils from "@/utils";
export default {
  name: "shopNavIndex",
  components: { h5NavEdit },
  data() {
    return {
      navigation_type: "0",
      openNav: true,   //系统-是否打开导航
      utils,
      apiNavData: null,  //导航数据
      loading: false
    };
  },
  created() {
    this.$store.dispatch('getShopInfo');
    this.fetch();
  },
  computed: {
    shopInfo() {
      this.openNav = this.$store.getters.shopInfo.shopNavigation === 1;
      return this.$store.getters.shopInfo || {};
    },
    cid(){
        let shopInfo = this.$store.getters.shopInfos
        return shopInfo.id
    }
  },
  watch: {
    navigation_type(newValue) {
      this.fetch();
    },
    shopInfo: {
      handler(newValue) {
        this.openNav = newValue.shopNavigation === 1;
      },
      depp: true
    }
  },
  methods: {
    handleClick(comp) {
      this.navigation_type = comp.name;
    },

    /* 开关状态切换 */
    switchStatusChange(value) {
      this._apis.shopInfo.updateShopInfo({
        id:this.cid, 
        shopNavigation: value === true ? 1 : 0
      }).then((response)=>{
        this.$store.dispatch('getShopInfo');
        this.$message.success('修改成功！')
      }).catch((error)=>{
        this.$message.error(error);
      });
    },

    fetch() {
      this.loading = true;
      this._apis.shop.getShopNav({
        navigationType: this.navigation_type
      }).then((response)=>{
        if(!response || !response.navigationJson) {
          return;
        }
        const string = utils.uncompileStr(response.navigationJson);
        if(string.indexOf('navIds') < 0) {
          return;
        }
        let pageData = JSON.parse(string);
        if(Object.prototype.toString.call(pageData) !== '[object Object]') {
          return;
        }
        if(pageData && pageData.navIds) {
          this.apiNavData = pageData;
          this.apiNavData['status'] = response.status;
          this._globalEvent.$emit('apiNavDataChange', this.apiNavData, this.navigation_type);
        }
        this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

    submit(params, callback) {
      this._apis.shop.editShopNav(params).then((response)=>{
        this.$message.success('编辑成功！')
        callback && callback(true);
      }).catch((error)=>{
        this.$message.error(error);
        callback && callback(false)
      });
    },

    /* 重置 */
    resetData(params, callback) {
      this._apis.shop.resetShopNav(params).then((response)=>{
        if(response !== null) {
          this.$message.success('重置成功！')
          if(!response || !response.navigationJson) {
            return;
          }
          const string = utils.uncompileStr(response.navigationJson);
          if(string.indexOf('navIds') < 0) {
            return;
          }
          let pageData = JSON.parse(string);
          if(Object.prototype.toString.call(pageData) !== '[object Object]') {
            return;
          }
          if(pageData && pageData.navIds) {
            this.apiNavData = pageData;
            this.apiNavData['status'] = response.status;
            this._globalEvent.$emit('apiNavDataChange', this.apiNavData, this.navigation_type);
          }
          callback && callback(true);
        }else{
          callback && callback(true);
        }
      }).catch((error)=>{
        this.$message.error(error);
        callback && callback(false);
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.el-tabs {
  background: #fff;
  padding: 20px 0;
}
.on_off{
  background:rgba(253,147,43,0.08);
  margin-bottom:20px;
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 20px;
  line-height: 24px;
  p{
    color:#FD932B;
  }
  .el-switch {
    margin-top: 2px;
  }
}
.el-tabs--button {
  /deep/ .el-tabs__item.is-active:last-child::after {
      left: -1px;
      width: calc(100% + 2px);
      border-radius: 4px;
    }
}
</style>