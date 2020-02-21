<template>
  <div>

    <!-- 装修编辑器 -->
    <Decorate ref="Decorate" :decorateData="decorateData" :config="config" :height="146+10"></Decorate>

    <!-- 动态弹窗 预览 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :decorateData="decorateData"></component>
  </div>
</template>

<script>
import Decorate from '@/components/Decorate';
import utils from '@/utils';
import dialogDecoratePreview from '@/views/shop/dialogs/decorateDialogs/dialogDecoratePreview';
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
          type: 'pageInfo',
          isBase: true,
          hidden: true,
          title: '页面信息'
        },
        buttons: {  //按钮组
          saveData: {
            title: '保存草稿',
            function: this.saveData,
            type: 'primary',
            show: () => true,
            loading: false
          },
          saveAndApplyData: {
            title: '保存并生效',
            function: this.saveAndApplyData,
            type: 'primary',
            show: () => !!this.id,
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
        pageKey: data.pageKey
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
          this.setLoading(true);
          if(this.id) {
            this.sendRequest({methodName: 'editPageInfo', resultData, tipWord: '编辑成功!'});
          }else{
            this.sendRequest({methodName: 'createPage', resultData, tipWord: '创建成功!'});
          }
        };
      }
    },

    /* 检查输入正确性 */
    checkInput(resultData) {
      if (this.baseInfo.vError) {
        this.$message({ message: '请填写正确信息', type: 'warning' });
        return false;
      }else{
        if(!resultData.name || !resultData.title || !resultData.explain) {
          this.$alert('请填写基础信息后重试，点击确认返回编辑页面信息!', '警告', {
            confirmButtonText: '确定',
            callback: action => {
              //打开基础信息面板
              this.$store.commit('setCurrentComponentId', this.basePropertyId);
              this.setLoading(false);
            }
          });
          return false;
        }else{
          return true;
        }
      }
      return true;
    },

    /* 发起请求 */
    sendRequest(params) {
      this._apis.shop[params.methodName](params.resultData).then((response)=>{
          this.$notify({
            title: '成功',
            message: params.tipWord,
            type: 'success'
          });
          this.setLoading(false);
          this._routeTo('m_pageManageIndex');
        }).catch((error)=>{
          this.$notify.error({
            title: '错误',
            message: error
          });
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
    }

  },

};
</script>

