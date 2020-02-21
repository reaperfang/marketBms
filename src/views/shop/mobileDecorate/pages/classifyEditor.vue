<template>
    <div>
      <!-- 装修编辑器 -->
      <Decorate ref="Decorate" :decorateData="decorateData" :config="config" :height="146+10"></Decorate>

      <!-- 动态弹窗 预览 -->
      <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :decorateData="decorateData"></component>
    </div>
</template>

<script>
import utils from "@/utils";
import Decorate from '@/components/Decorate';
import dialogDecoratePreview from '@/views/shop/dialogs/decorateDialogs/dialogDecoratePreview';
export default {
  name: "classifyEditor",
  components: {Decorate, dialogDecoratePreview},
  data() {
    return {
      loading: false,
      id: this.$route.query.pageId,
      dialogVisible: false,
      currentDialog: '',
      /* 装修编辑器配置 */
      config: {
        pageBase: {
          type: 'classify',
          isBase: true,
          hidden: false,
          title: '微页面分类信息',
          colorStyle: '#ffffff'
        },
        buttons: {
          saveData: {
            title: '保存',
            function: this.saveData,
            type: 'primary',
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
        callbacks: {
          setBaseInfo: this.setBaseInfo
        },
        showWidget: true,
        showProp: true,
        dragable: true
      },
      decorateData: null
    };
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

    /* 获取分类装修数据 */
    fetch() {
      if(!this.id) {
        return;
      };
      this.loading = true;
      this._apis.shop.getClassifyInfo({id: this.id}).then((response)=>{
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
        sortType: data.sortType,
        explain: utils.uncompileStr(data.explain),
        showType: data.showType,
        pageInfos: data.pageInfos
      }
    },

    /* 保存数据 */
    saveData() {
      let resultData = this.$refs.Decorate.collectData();
      if(resultData && Object.prototype.toString.call(resultData) === '[object Object]') {
        this.id && (resultData['id'] = this.id);
        const copyResultData = {...resultData};
        copyResultData['explain'] = utils.compileStr(copyResultData.explain);
        if(this.checkInput(copyResultData)) {
          this.setLoading(true);
          if(this.id) {
            this.sendRequest({methodName: 'editClassifyInfo', resultData: copyResultData, tipWord: '编辑成功!'});
          }else{
            this.sendRequest({methodName: 'createClassify', resultData: copyResultData, tipWord: '创建成功!'});
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
        if(!resultData.name || !resultData.explain) {
          this.$alert('请填写基础信息后重试，点击确认返回编辑分类信息!', '警告', {
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
      this.config.buttons.saveData.loading = status;
    },

    /* 打开预览 */
    preview() {
      this.dialogVisible=true;
      this.currentDialog='dialogDecoratePreview';
    }

  }
};
</script>
