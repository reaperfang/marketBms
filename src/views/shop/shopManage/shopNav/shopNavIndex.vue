<template>
  <div>
    <el-tabs v-model="navigation_type" @tab-click="handleClick">
      <el-tab-pane label="店铺导航" name="0"></el-tab-pane>
      <el-tab-pane label="小程序导航" name="1"></el-tab-pane>
    </el-tabs>
    <div class="on_off">
      <p>店铺的各个页面可以通过导航串联起来。通过精心设置的导航，方便买家在栏目间快速切换，引导买家前往你期望的页面。  </p>
      <el-switch
        v-model="openNav"
        active-color="#13ce66"
        @change="switchStatusChange"
        inactive-color="#ff4949">
      </el-switch>
    </div>
    <component :is="navigation_type === '0' ? 'h5NavEdit' : 'miniNavEdit'" :apiNavData="apiNavData" @submitNavData="submit" @resetNavData="resetData"></component>
  </div>
</template>

<script>
import h5NavEdit from "./h5NavEdit";
import miniNavEdit from "./miniNavEdit";
import utils from "@/utils";
import uuid from 'uuid/v4';
export default {
  name: "shopNavIndex",
  components: { h5NavEdit, miniNavEdit },
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
        let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
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
      this._apis.shop.changeSwitchStatus({
        id:this.cid, 
        shopNavigation: value === true ? 1 : 0
      }).then((response)=>{
        this.$notify({
          title: '成功',
          message: '修改成功！',
          type: 'success'
        });
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
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
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
        this.loading = false;
      });
    },

    submit(params, callback) {
      this._apis.shop.editShopNav(params).then((response)=>{
        this.$notify({
          title: '成功',
          message: '编辑成功！',
          type: 'success'
        });
        callback && callback(true);
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
        callback && callback(false)
      });
    },

    /* 重置 */
    resetData(params, callback) {
      this._apis.shop.resetShopNav(params).then((response)=>{
        this.$notify({
          title: '成功',
          message: '重置成功！',
          type: 'success'
        });
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
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
        callback && callback(false);
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.el-tabs {
  background: #fff;
  padding: 20px;
}
.on_off{
  height:36px;
  background: rgb(255,233,210);
  margin-bottom:20px;
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 9px;
  p{
    color:rgba(146,146,155,1);
  }
}
</style>
