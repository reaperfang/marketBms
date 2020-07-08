<template>
  <div>

    <!-- 装修编辑器 -->
    <Decorate ref="Decorate" :decorateData="decorateData" :config="config" :height="66 + 64 + 20"></Decorate>

    <!-- 动态弹窗 预览 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :decorateData="decorateData"></component>
  </div>
</template>

<script>
import Decorate from '@/components/Decorate';
import utils from '@/utils';
import dialogDecoratePreview from '@/components/Decorate/dialogs/dialogDecoratePreview';
import SAVE_BLACK_LIST from '@/components/Decorate/config/saveBlackList'
import widget from '@/components/Decorate/config/widgetConfig';
export default {
  name: "shopEditor",
  props: ["pageId"],
  components: {Decorate, dialogDecoratePreview},
  data() {
    return {
      loading: false,
      id: this.pageId || this.$route.query.pageId,
      dialogVisible: false,
      currentDialog: '',
      saveType: 'save',  //保存类型  save:保存到草稿箱   saveAndApply:保存并应用

      
      /* 装修编辑器配置 */
      config: {
        pageBase: {  //装修页面基础信息
          type: 'pageInfo'
        },
        components: {
          // 可在此处覆写配置表中的所有组件配置
        },
        buttons: {  //按钮组
          saveData: {
            title: '保存草稿',
            function: this.saveData,
            type: 'primary',
            show: () => {
              return !this.decorateData || (this.decorateData && this.decorateData.isHomePage !== 1);
            },
            loading: false
          },
          saveAndApplyData: {
            title: '保存并生效',
            function: this.saveAndApplyData,
            type: 'primary',
            show: () => true,
            loading: false
          },
          resetData: {
            title: '重   置',
            function: this.resetData,
            type: '',
            show: () => true,
            loading: false
          },
          preview: {
            title: '预览',
            function: this.preview,
            type: '',
            show: () => !!this.id,
            loading: false
          },
          cancel: {
            title: '取消',
            function: this.cancelSave,
            type: '',
            show: () => true,
            loading: false
          }
        },
        callbacks: {  //对外开放的函数接口
          setBaseInfo: this.setBaseInfo
        },
        showWidget: true,  //是否显示左侧控件面板
        showProp: true,  //是否显示右侧属性面板
        dragable: true   //是否可拖拽排序
      },
      decorateData: null
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
  created() {
    this.$store.commit("clearAllData");
    this.fetch();
  },
  computed: {
    baseInfo() {
      return this.$store.getters.baseInfo;
    },
    componentDataIds() {
      return this.$store.getters.componentDataIds;
    },
    componentDataMap() {
      return this.$store.getters.componentDataMap;
    },
    basePropertyId() {
      return this.$store.getters.basePropertyId;
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
         this.decorateData = response;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

     /* 拼装基础数据 */
    setBaseInfo(data) {
      return {
        name: data.name,
        title: data.title,
        explain: data.explain,
        pageCategoryInfoId: data.pageCategoryInfoId,
        colorStyle: data.colorStyle,
        pageKey: data.pageKey,
        pageTemplateId: data.pageTemplateId
      }
    },

    /* 保存数据 */
    saveData() {
      this.saveType = 'save';
      let resultData = this.$refs.Decorate.collectData();
      if(resultData && Object.prototype.toString.call(resultData) === '[object Object]') {
        this.id && (resultData['id'] = this.id);
        resultData['status'] = '1';
        if(this.checkInput(resultData)) {
          this.washData(resultData);
          this.setLoading(true);
          if(this.id) {
            this.sendRequest({methodName: 'editPageInfo', resultData, tipWord: '编辑成功!'});
          }else{
            this.sendRequest({methodName: 'createPage', resultData, tipWord: '创建成功!'});
          }
        };
      }
    },

    /* 保存并生效数据 */
    saveAndApplyData() {
      this.saveType = 'saveAndApply';
      let resultData = this.$refs.Decorate.collectData();
      if(resultData && Object.prototype.toString.call(resultData) === '[object Object]') {
        this.id && (resultData['id'] = this.id);
        resultData['status'] = '0';
        if(this.checkInput(resultData)) {
          this.washData(resultData);
          this.setLoading(true);
          if(this.id) {
            this.sendRequest({methodName: 'editPageInfo', resultData, tipWord: '编辑成功!'});
          }else{
            this.sendRequest({methodName: 'createPage', resultData, tipWord: '保存并上架成功!'});
          }
        };
      }
    },

    /* 检查输入正确性 */
    checkInput(resultData) {
      return this.checkBaseInfo(resultData);
    },

    /* 发起请求 */
    sendRequest(params) {
      let pageData = params.resultData.pageData;
      params.resultData.pageData = this.utils.compileStr(JSON.stringify(pageData));
      this._apis.shop[params.methodName](params.resultData).then((response)=>{
          this.$message.success(params.tipWord);
          this.setLoading(false);
          this._routeTo('m_pageManageIndex');
        }).catch((error)=>{
          this.$message.error(error);
          this.setLoading(false);
        });
    },

    /* 设置loading */
    setLoading(status) {
      if(this.saveType === 'saveAndApply') {
        this.config.buttons.saveAndApplyData.loading = status;
      }else{
        this.config.buttons.saveData.loading = status;
      }
    },

    /* 打开预览 */
    preview() {
      this.dialogVisible=true;
      this.currentDialog='dialogDecoratePreview';
    },

    /* 取消保存 */
    cancelSave() {
      this.confirm({
        title: '提示', 
        subTitle: '确认取消？',
        customClass: 'goods-custom', 
        icon: true, 
        text: `<h3 style="font-size:18px;color:rgba(68,61,74,1);margin-bottom:10px;">确认取消？</h3><span style="font-size:16px;color:rgba(110,110,114,1);">取消后，放弃当前编辑数据，且无法恢复。</span>`
      }).then(() => {
        this._routeTo('m_pageManageIndex');
      })
    },

    /* 清洗数据 */
    washData(data) {
      let copyData = [...data.pageData];
      for(let item of copyData) {

        /* 图片广告清除无图片或者图片地址无效的数据（临时需求2020/7/7）start  */
        if(item.type === 'articleAD') {
          this.deleteEmptyArticleAD(item);
        }
        /* 图片广告清除无图片或者图片地址无效的数据（临时需求2020/7/  end  */

        const keys = Object.keys(item.data);
        for(let item2 of keys) {
          if(SAVE_BLACK_LIST.includes(item2)) {
            delete item.data[item2];
          }
        }
      }
      data.pageData = copyData;
    },

    /* 删除空的图文广告（临时需求） */
    deleteEmptyArticleAD(data) {
      const templateItemList = [...data.data.itemList];
      for(let i=0;i<templateItemList.length;i++) {
        if(!templateItemList[i].url || !this.utils.validate.isURL(templateItemList[i].url) || !this.utils.validate.isPic(templateItemList[i].url)) {
          templateItemList.splice(i, 1);
          i--;
        }
      }
      data.data.itemList = templateItemList;
    },

    /* 检测基础信息 */
    checkBaseInfo(data) {
      if (this.baseInfo.vError || !data.name || !data.title || !data.explain) {
        this.$alert('请填写基础信息后重试，点击确认返回编辑页面信息!', '警告', {
          confirmButtonText: '确定',
          callback: action => {
            //打开基础信息面板
            this.$store.commit('setCurrentComponentId', this.basePropertyId);
            this.setLoading(false);
          }
        });
        return false;
      }
      return true;
    }

  },

};
</script>
<style lang="scss">
  .app-main .content-box .content-main.m_shopEditor {
    padding: 0;
    overflow: hidden;
  }
</style>

