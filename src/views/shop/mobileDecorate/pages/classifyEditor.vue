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
import dialogDecoratePreview from '@/components/Decorate/dialogs/dialogDecoratePreview';
import SAVE_BLACK_LIST from '@/components/Decorate/config/saveBlackList'
import widget from '@/components/Decorate/config/widgetConfig';
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
          type: 'classify'
        },
        components: {
          // 可在此处覆写配置表中的所有组件配置
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
          },
          cancel: {
            title: '取消',
            function: this.cancelSave,
            type: '',
            show: () => true,
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
          this.washData(resultData);
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
    },

    /* 取消保存 */
    cancelSave() {
      this.confirm({
        title: '确认取消？', 
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
        const keys = Object.keys(item.data);
        for(let item2 of keys) {
          if(SAVE_BLACK_LIST.includes(item2)) {
            delete item.data[item2];
          }
        }
      }
      data.pageData = copyData;
    },

    /* 检测基础信息 */
    checkBaseInfo(data) {
      if (this.baseInfo.vError || !data.name || !data.explain) {
        this.$alert('请填写基础信息后重试，点击确认返回编辑分类信息!', '警告', {
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

  }
};
</script>
<style lang="scss" scoped>
/deep/.view {
    .phone-body {
      background:#fff;
    }
}
</style>
