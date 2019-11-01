<template>
  <Decorate :componentConfig="componentConfig" :saveData="saveData" :saveAndApplyData="saveAndApplyData" :homePageData="homePageData" :saveToTemplate="saveToTemplate"></Decorate>
</template>

<script>
import Decorate from '@/components/Decorate';
import decorateMixin from '@/components/Decorate/mixins/decorateMixin';
import utils from '@/utils';
export default {
  name: "shopEditor",
  props: ["pageId"],
  mixins: [decorateMixin],
  components: {Decorate},
  data() {
    return {
      loading: false,
      id: this.pageId || this.$route.query.pageId,
      dataLoaded: false,
      homePageData: null,
      componentConfig: {
        type: 'pageInfo',
        isBase: true,
        hidden: true,
        title: '页面信息'
      }
    };
  },
  watch: {
    pageId(newValue) {
      if (newValue) {
        this.id = newValue;
      }
      this.$store.commit("clearAllData");
      this.fetch();
    }
  },
  methods: {

    /* 获取店铺装修数据 */
    fetch() {
      if(!this.id) {
        return;
      }
      this.loading = true;
      this._apis.shop.getPageInfo({id: this.id}).then((response)=>{
         this.loading = false;
         this.dataLoaded = true;
         this.homePageData = response;
         this.convertDecorateData(response);
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
        this.loading = false;
      });
    },

    /* 检查数据可用性 */
    checkData(data) {
      const string = utils.uncompileStr(data.pageData);
      if(string.indexOf('id') < 0) {
        return;
      }
      let pageData = JSON.parse(string);
      if(!Array.isArray(pageData)) {
        return;
      }
      return pageData;
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

    /* 保存数据 */
    saveData() {
      let resultData = this.collectData();
      if(resultData && Object.prototype.toString.call(resultData) === '[object Object]') {
        resultData['status'] = '1';
        this.submit(resultData);
      }
    },

    /* 保存并生效数据 */
    saveAndApplyData() {
      let resultData = this.collectData();
      if(resultData && Object.prototype.toString.call(resultData) === '[object Object]') {
        resultData['status'] = '0';
        this.submit(resultData, 'saveAndApply');
      }
    },

    /* 保存到模板 */
    saveToTemplate() {
      let result = this.baseInfo;
      result['id'] = this.id;
      let pageData = [];
      for(let item of this.componentDataIds) {
        const componentData = this.componentDataMap[item];
        if(componentData) {
          pageData.push(componentData);
        }
      }
      result['pageData'] = utils.compileStr(JSON.stringify(pageData));;
      result['pageTemplateId'] = '1';
      result['sort'] = '1';
      this._apis.shop.saveToTemplate(result).then((response)=>{
          this.$notify({
            title: '成功',
            message: '保存成功！',
            type: 'success'
          });
          this._routeTo('templateManageIndex');
        }).catch((error)=>{
          this.$notify.error({
            title: '错误',
            message: error
          });
        });
    },

    submit(resultData, type) {

      if(!resultData.name || !resultData.title || !resultData.explain) {
         this.$alert('请填写基础信息后重试，点击确认返回编辑页面信息!', '警告', {
          confirmButtonText: '确定',
          callback: action => {
            //打开基础信息面板
            this.$store.commit('setCurrentComponentId', this.basePropertyId);
            if(type === 'saveAndApply') {
              this._globalEvent.$emit('decorateSaveAndApplyLoading', false, this.id);
            }else{
              this._globalEvent.$emit('decorateSaveLoading', false, this.id);
            }
          }
        });
        return;
      }
      if(this.id) {
        this._apis.shop.editPageInfo(resultData).then((response)=>{
          this.$notify({
            title: '成功',
            message: '编辑成功！',
            type: 'success'
          });
          if(type === 'saveAndApply') {
            this._globalEvent.$emit('decorateSaveAndApplyLoading', true, this.id);
          }else{
            this._globalEvent.$emit('decorateSaveLoading', true, this.id);
          }
          this._routeTo('pageManageIndex');
        }).catch((error)=>{
          if(type === 'saveAndApply') {
            this._globalEvent.$emit('decorateSaveAndApplyLoading', false, this.id);
          }else{
            this._globalEvent.$emit('decorateSaveLoading', false, this.id);
          }
          this.$notify.error({
            title: '错误',
            message: error
          });
        });
      }else{
        this._apis.shop.createPage(resultData).then((response)=>{
          this.$notify({
            title: '成功',
            message: '创建成功！',
            type: 'success'
          });
          if(type === 'saveAndApply') {
            this._globalEvent.$emit('decorateSaveAndApplyLoading', true, this.id);
          }else{
            this._globalEvent.$emit('decorateSaveLoading', true, this.id);
          }
          this._routeTo('pageManageIndex');
        }).catch((error)=>{
          this.$notify.error({
            title: '错误',
            message: error
          });
          if(type === 'saveAndApply') {
            this._globalEvent.$emit('decorateSaveAndApplyLoading', false, this.id);
          }else{
            this._globalEvent.$emit('decorateSaveLoading', false, this.id);
          }
        });
      }
    }

  },

};
</script>

