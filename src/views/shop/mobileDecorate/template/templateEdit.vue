<template>
  <div>
    <div v-loading="loading">
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
    </div>
  </div>
</template>

<script>
import Decorate from '@/components/Decorate';
import utils from "@/utils";
import mixinEditor from '@/views/shop/mixins/mixinEditor';
export default {
  name: "templateEdit",
  components: { Decorate },
  mixins: [mixinEditor],
  data() {
    return {
      loading: true,
      id: this.$route.query.id || '',
      saveType: 'save',  //保存类型  save:保存到草稿箱   saveAndApply:保存并应用
      pageId: '',
      /* 装修编辑器配置 */
      config: {
        pageBase: {
          type: 'pageInfo',
          isBase: true,
          hidden: true,
          title: '页面信息'
        },
        components: {
          // 可在此处覆写配置表中的所有组件配置
        },
        buttons: {
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
            show: () => true,
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
        dragable: true,
        widgetCalcHeight: 60, //控件区扣减高度
        renderCalcHeight: 60+10,  //渲染区扣减高度
        propCalcHeight: 60 //属性区扣减高度
      },
      decorateData: null,
      pageList: [],  //页面列表
      pageMaps: {},  //页面数据集合
      decorateRender: false  //装修是否渲染
    };
  },
  created() {
    this.$store.commit("clearEditor");
    this.fetchTemplateStatus();
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

    /* 模板是否已过期 */
    fetchTemplateStatus() {
      this.loading = true;
      this._apis.shop.getTemplateInfo({pageTemplateId: this.id}).then(res => {
        if (res) {
          if(res.templateStatus === 1) {
            if(res.status !== 2) {
              this.getPageList();
            }else {
              this.confirm({
                icon: true,
                showCancelButton: false,
                confirmText: '我知道了',
                text: `模板已过期`
              });
              this.config.buttons.saveData.show = () => false;
              this.config.buttons.saveAndApplyData.show = () => false;
              this.loading = false;
            }
          }else if(res.templateStatus === 2) {
            this.confirm({
              icon: true,
              showCancelButton: false,
              confirmText: '我知道了',
              text: `模板已下架`
            });
            this.config.buttons.saveData.show = () => false;
            this.config.buttons.saveAndApplyData.show = () => false;
            this.loading = false;
          }
          
        } else {  // res == null，未购买 / 不在我的模板里
          this.confirm({
            icon: true,
            showCancelButton: false,
            confirmText: '我知道了',
            text: `模板未付费`
          });
          this.config.buttons.saveData.show = () => false;
          this.config.buttons.saveAndApplyData.show = () => false;
          this.loading = false;
        }
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      })
    },

    /* 获取模板下的页面列表 */
    getPageList() {
      this._apis.goodsOperate.getPagesByTemplateId({pageTemplateId: this.id}).then((response) => {
        if (!response || response.length === 0) {
          this.loading = false
          return
        }

        this.pageList = [response];
        this.loading = false;
        if (!this.pageList || !this.pageList.length) {
          return;
        }
        for (let item of this.pageList) {
          this.pageMaps[item.id] = item;
        }
        this.pageList[0]['active'] = true;
        this.pageId = this.pageList[0].id;
        this.fetch(this.pageList[0].id);
      }).catch((error) => {
        console.error(error);
        this.loading = false;
      });
    },

    /* 获取某个页面的装修数据 */
    fetch(newValue) {
      if(newValue) {
        this.$store.commit("clearEditor");
        this.decorateRender = false;
        setTimeout(()=>{
          this.decorateRender = true;
          this.decorateData = this.pageMaps[newValue];
        },200)
      }
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
        resultData['status'] = '1';
        if(this.checkInput(resultData)) {
          this.washData(resultData);
          this.setLoading(true);
          this.sendRequest({methodName: 'createPage', resultData, tipWord: '保存成功!'});
        };
      }
    },
    /* 保存并生效数据 */
    saveAndApplyData() {
      this.saveType = 'saveAndApply';
      let resultDatas = this.$refs.Decorate.collectData();
      let resultData = utils.deepClone(resultDatas);
      if(resultData && Object.prototype.toString.call(resultData) === '[object Object]') {
        resultData['status'] = '0';
        if(this.checkInput(resultData)) {
          this.washData(resultData);
          this.setLoading(true);
          this.sendRequest({methodName: 'createPage', resultData, tipWord: '保存并上架成功!'});
        };
      }
    },

    /* 检查输入正确性 */
    checkInput(resultData) {
      //检测基础信息
      // if(!this.checkBaseInfo(resultData)){
      //   return false;
      // }

      //检测组件有必填条件的则进行验证
      if(!this.checkComponents(resultData)){
        return false;
      }

      //检测假数据
      if(!this.checkFakeData(resultData)){
        return false;
      }
      
      return true;
    },

    /* 发起请求 */
    sendRequest(params) {
      let pageData = params.resultData.pageData;
      params.resultData.pageData = this.utils.compileStr(JSON.stringify(pageData));
      this._apis.shop[params.methodName](params.resultData).then((response)=>{
          this.$message.success(params.tipWord);
          this.setLoading(false);
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

    tabClick(event, item) {
      this.confirm({
        customClass: 'goods-custom',
        icon: true,
        text: '是否要离开当前页面？离开将不会保存。'
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
      })
    },
    /* 取消保存 */
    cancelSave() {
      this.confirm({
        title: '确认取消？',
        customClass: 'goods-custom',
        icon: true,
        text: `<h3 style="font-size:18px;color:rgba(68,61,74,1);margin-bottom:10px;">确认取消？</h3><span style="font-size:16px;color:rgba(110,110,114,1);">取消后，放弃当前编辑数据，且无法恢复。</span>`
      }).then(() => {
        this._routeTo('m_templateManageIndex');
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
