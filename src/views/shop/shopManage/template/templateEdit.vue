<template>
  <div>
    <div v-if="pageList.length" v-loading="loading">
      <div class="tabs">
        <span type="primary" v-for="(item, key) of pageList" :key="key" :class="{'myActive': item.active === true}" @click="tabClick($event, item)" plain>{{item.name || '页面'}}</span>
      </div>
      <Decorate panelName="页面编辑" :componentConfig="componentConfig" :saveData="saveData" :homePageData="homePageData" v-if="decorateRender"></Decorate>
    </div>
    <div v-else v-loading="loading" style="padding:50px;">
      暂无可用页面
    </div>
  </div>
</template>

<script>
import Decorate from '@/components/Decorate';
import decorateMixin from '@/components/Decorate/mixins/decorateMixin';
import utils from "@/utils";
export default {
  name: "templateEdit",
  mixins: [decorateMixin],
  components: { Decorate },
  data() {
    return {
      loading: true,
      id: this.$route.query.id || '',
      pageId: '',
      dataLoaded: false,
      homePageData: null,
      componentConfig: {
        type: 'pageInfo',
        isBase: true,
        hidden: true,
        title: '页面信息'
      },
      pageList: [],  //页面列表
      pageMaps: {},  //页面数据集合
      decorateRender: false  //装修是否渲染
    };
  },
  created() {
    this.getPageList();
  },
  watch: {
    pageId(newValue) {

      //异步延迟可以解决一些选中组件的问题
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.fetch(newValue);
        })
      })
    }
  },
  methods: {

    fetch(newValue) {
      if(newValue) {
        this.$store.commit("clearAllData");
        this.decorateRender = false;
        this.$nextTick(() => {
          this.decorateRender = true;
          this.homePageData = this.pageMaps[newValue];
          this.convertDecorateData(this.pageMaps[newValue]);
        })
      }
    },

     /* 拼装基础数据 */
    setBaseInfo(data) {
       //还原页面基础信息
      this.$store.commit('updateComponent', {
        id: this.basePropertyId,
        data: {
          name: data.name,
          title: data.title,
          explain: data.explain,
          pageCategoryInfoId: data.pageCategoryInfoId,
          colorStyle: data.colorStyle,
          pageKey: data.pageKey
        }
      });
    },

    getPageList() {
      this.loading = true;
      this._apis.shop.getPagesByTemplateId({pageTemplateId: this.id}).then((response)=>{
        this.pageList = response;
        this.loading = false;
        if(!response || !response.length) {
          return;
        }
        for(let item of response) {
          this.pageMaps[item.id] = item;
        }
        response[0]['active'] = true;
        this.pageId = response[0].id;
        this.fetch(response[0].id);
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
        this.loading = false;
      });
    },

     /* 保存数据 */
    saveData() {
      let resultData = this.collectData();
      if(resultData && Object.prototype.toString.call(resultData) === '[object Object]') {
        resultData['status'] = '1';
        this.submit(resultData);
      }
    },

    submit(resultData) {
      if(!resultData.name || !resultData.title || !resultData.explain) {
         this.$alert('请填写基础信息后重试，点击确认返回编辑页面信息!', '警告', {
          confirmButtonText: '确定',
          callback: action => {
            //打开基础信息面板
            this.$store.commit('setCurrentComponentId', this.basePropertyId);
            this._globalEvent.$emit('decorateSaveLoading', false);
          }
        });
        return;
      }
      this.loading = true;
      this._apis.shop.createPage(resultData).then((response)=>{
        this.$notify({
          title: '成功',
          message: '创建成功！',
          type: 'success'
        });
        this._globalEvent.$emit('decorateSaveLoading', true);
        // this._routeTo('templateManageIndex');
        this.loading = false;
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
        this._globalEvent.$emit('decorateSaveLoading', false);
        this.loading = false;
      });
    },

    tabClick(event, item) {
      this.$confirm(`是否要离开当前页面，离开将不会保存。`, '提示', {
        confirmButtonText: '离开',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const tempItems = [...this.pageList];
        for(let i=0;i<tempItems.length;i++) {
          if(item === tempItems[i]) {
            tempItems[i].active = true;
          }else{
            tempItems[i].active = false;
          }
        }
        this.pageList = tempItems;

        this.pageId = item.id;
      }).catch(() => {
        
      })
    },

     /* 保存前收集装修数据 */
    collectData(triggerType) {
      let result = this.baseInfo;
      let pageData = [];
      for(let item of this.componentDataIds) {
        const componentData = this.componentDataMap[item];
        if(componentData.type === 'goods') {
          if(componentData.data.ids && !componentData.data.ids.length) {
            this.$alert('请在右侧选择真实商品后重试', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                //打开基础信息面板
                this.$store.commit('setCurrentComponentId', componentData.id);
                this._globalEvent.$emit('decorateSaveLoading', false);
              }
            });
            return;
          }
        }
        if(componentData) {
          pageData.push(componentData);
        }
      }
      result['pageData'] = utils.compileStr(JSON.stringify(pageData));;
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
.tabs{
  margin-bottom:20px;
  padding-bottom:2px;
  span{
    border: 1px solid $btnMainHoverColor;
    padding:5px 10px;
    border-radius:5px;
    margin-right:30px;
    cursor:pointer;
  }
  .myActive{
    background: #5b55e6;
    border-color: #5b55e6;
    color: #FFF;
    outline: 0;
  }
}
</style>
