<template>
  <div>

    <!-- 装修编辑器 -->
    <Decorate 
      ref="Decorate" 
      :decorateData="decorateData" 
      :config="config" 
      @widgetPanelInited="widgetPanelInited"
      @renderPanelInited="renderPanelInited"
      @propsPanelInited="propsPanelInited"
      @responseDataInited="responseDataInited"
      @propDataChanged="propDataChanged"
      @dataLoadProgress="dataLoadProgress"
      @finished="finished"
    ></Decorate>

    <!-- 动态弹窗 预览 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :decorateData="decorateData"></component>
  </div>
</template>

<script>
import Decorate from '@/components/Decorate';
import utils from '@/utils';
import dialogDecoratePreview from '@/components/Decorate/dialogs/dialogDecoratePreview';
import widget from '@/components/Decorate/config/widgetConfig';
import mixinEditor from '@/views/shop/mixins/mixinEditor';
export default {
  name: "shopEditor",
  props: ["pageId"],
  components: {Decorate, dialogDecoratePreview},
  mixins: [mixinEditor],
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
        dragable: true,   //是否可拖拽排序
        widgetCalcHeight: 60, //控件区扣减高度
        renderCalcHeight: 60+10,  //渲染区扣减高度
        propCalcHeight: 60 //属性区扣减高度
      },
      decorateData: null
    };
  },
  watch: {
    pageId(newValue) {
      if (newValue) {
        this.id = newValue;
      }
      this.$store.commit("clearEditor");
      this.fetch();
    }
  },
  created() {
    this.$store.commit("clearEditor");
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
      let resultDatas = this.$refs.Decorate.collectData();
      let resultData = utils.deepClone(resultDatas);
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
      let resultDatas = this.$refs.Decorate.collectData();
      let resultData = utils.deepClone(resultDatas);
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
      //检测组件有必填条件的则进行验证
      if(!this.checkComponents(resultData)){
        return false;
      }
      return true;
    },

    /* 发起请求 */
    sendRequest(params) {
      let pageData = params.resultData.pageData;
      params.resultData.pageData = this.utils.compileStr(JSON.stringify(pageData));
      const string = utils.uncompileStr(params.resultData.pageData);
      this._apis.shop[params.methodName](params.resultData).then((response)=>{
          this.$message.success(params.tipWord);
          this.setLoading(false);
          this._routeTo('m_pageManageIndex');
        }).catch((error)=>{
          if(error === '微页面名称已存在') {
            //打开基础信息面板
            this.$store.commit('setCurrentComponentId', this.basePropertyId);
          }
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
        subTitle: '确认取消？',
        customClass: 'goods-custom', 
        icon: true, 
        text: `<h3 style="font-size:18px;color:rgba(68,61,74,1);margin-bottom:10px;">确认取消？</h3><span style="font-size:16px;color:rgba(110,110,114,1);">取消后，放弃当前编辑数据，且无法恢复。</span>`
      }).then(() => {
        this._routeTo('m_pageManageIndex');
      })
    },



    /* 控件面板初始化 */
    widgetPanelInited(scope) {
      // console.log('控件面板初始化结束');
    },
    
    /* 渲染面板初始化 */
    renderPanelInited(scope) {
      // console.log('渲染面板初始化结束');
    },
    
    /* 属性面板初始化 */
    propsPanelInited(scope) {
      // console.log('属性面板初始化结束');
    },

    /* 请求数据转换初始化事件 */
    responseDataInited(scope) {
      // console.log('请求数据转换初始化结束');
    },

    /* 组件数据发生改变事件 */
    propDataChanged(scope, id, data) {
      // console.log('组件数据发生改变');
    },

    /* 组件数据加载进度事件 */
    dataLoadProgress(scope, value, component) {
      // console.log('组件数据加载进度');
    },

    /* 编辑器整体加载完毕事件 */
    finished(scope) {
      // console.log('编辑器整体加载完毕');
    }

  },

};
</script>
<style lang="scss">
</style>

