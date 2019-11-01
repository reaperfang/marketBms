<template>
  <Decorate :componentConfig="componentConfig" :saveData="saveData" :homePageData="homePageData"></Decorate>
</template>

<script>
import utils from "@/utils";
import Decorate from '@/components/Decorate';
import decorateMixin from '@/components/Decorate/mixins/decorateMixin';
export default {
  name: "classifyEditor",
  mixins: [decorateMixin],
  components: {Decorate},
  data() {
    return {
      loading: false,
      id: this.$route.query.pageId,
      homePageData: null,
      componentConfig: {
        type: 'classify',
        isBase: true,
        hidden: false,
        title: '微页面分类信息'
      }
    };
  },
  methods: {

    /* 获取分类装修数据 */
    fetch() {
      if(!this.id) {
        return;
      };
      this.loading = true;
      this._apis.shop.getClassifyInfo({id: this.id}).then((response)=>{
         this.loading = false;
         this.homePageData = response;
         this.convertDecorateData(response);
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        this.loading = false;
        console.error(error);
      });
    },

     /* 检查数据可用性 */
    checkData(data) {
      const string = utils.uncompileStr(data.pageData);
      if(string.indexOf('id') < 0) {
        return null;
      }
      let pageData = JSON.parse(string);
      if(!Array.isArray(pageData)) {
        return null;
      }
      return pageData;
    },

     /* 拼装基础数据 */
    setBaseInfo(data) {

      this.$store.commit('updateComponent', {
        id: this.basePropertyId,
        data: {
          name: data.name,
          sortType: data.sortType,
          explain: utils.uncompileStr(data.explain),
          showType: data.showType,
          pageInfos: data.pageInfos
        }
      });
    },

    /* 保存数据 */
    saveData() {
      const resultData = this.collectData();
      if(resultData && Object.prototype.toString.call(resultData) === '[object Object]') {
        const copyResultData = {...resultData};
        copyResultData['explain'] = utils.compileStr(copyResultData.explain);
        if(!resultData.name || !resultData.explain) {
          this.$alert('请填写基础信息后重试，点击确认返回编辑分类信息!', '警告', {
            confirmButtonText: '确定',
            callback: action => {
              //打开基础信息面板
              this.$store.commit('setCurrentComponentId', this.basePropertyId);
              this._globalEvent.$emit('decorateSaveLoading', false, this.id);
            }
          });
          return;
        }
        if(this.id) {
          this._apis.shop.editClassifyInfo(copyResultData).then((response)=>{
            this.$notify({
              title: '成功',
              message: '编辑成功！',
              type: 'success'
            });
            this._routeTo('pageManageIndex');
            this._globalEvent.$emit('decorateSaveLoading', true, this.id);
          }).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: error
            });
            this._globalEvent.$emit('decorateSaveLoading', false, this.id);
          });
        }else{
          this._apis.shop.createClassify(copyResultData).then((response)=>{
            this.$notify({
              title: '成功',
              message: '创建成功！',
              type: 'success'
            });
            this._routeTo('pageManageIndex');
            this._globalEvent.$emit('decorateSaveLoading', true, this.id);
          }).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: error
            });
            this._globalEvent.$emit('decorateSaveLoading', false, this.id);
          });
        }
      }
    }

  }
};
</script>
