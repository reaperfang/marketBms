<template>
  <div>
    <div v-if="pageList.length" v-loading="loading">
      <div class="tabs">
        <span type="primary" v-for="(item, key) of pageList" :key="key" :class="{'myActive': item.active === true}" @click="tabClick($event, item)" plain>{{item.name || '页面'}}</span>
      </div>

      <!-- 装修编辑器 -->
      <Decorate 
        v-if="decorateRender"
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
    <div v-else v-loading="loading" style="padding:50px;">
      暂无可用页面
    </div>
  </div>
</template>

<script>
import Decorate from '@/components/Decorate';
import mixinEditor from '@/views/shop/mixins/mixinEditor';
import utils from "@/utils";
export default {
  name: "templateEdit",
  components: { Decorate },
  mixins: [mixinEditor],
  data() {
    return {
      loading: true,
      id: this.$route.query.id || '',
      pageId: '',
      /* 装修编辑器配置 */
      config: {
        pageBase: {
          type: 'pageInfo',
          isBase: true,
          hidden: true,
          title: '页面信息'
        },
        buttons: {
          saveData: {
            title: '保存草稿',
            function: this.saveData,
            type: 'primary',
            show: () => true,
            loading: false
          }
        },
        components: {
          // 可在此处覆写配置表中的所有组件配置
        },
        callbacks: {
          setBaseInfo: this.setBaseInfo
        },
        showWidget: true,
        showProp: true,
        dragable: true,
        widgetCalcHeight: 66, //控件区扣减高度
        renderCalcHeight: 66+10,  //渲染区扣减高度
        propCalcHeight: 66 //属性区扣减高度
      },
      decorateData: null,
      pageList: [],  //页面列表
      pageMaps: {},  //页面数据集合
      decorateRender: false,  //装修是否渲染
    };
  },
  created() {
    this.getPageList();
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

    /* 获取模板下的页面列表 */
    getPageList() {
      this.loading = true;
      this._apis.goodsOperate.getPagesByTemplateId({pageTemplateId: this.id}).then((response)=>{
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
        console.error(error);
        this.loading = false;
      });
    },

    /* 获取某个页面的装修数据 */
    fetch(newValue) {
      if(newValue) {
        this.$store.commit("clearEditor");
        this.decorateRender = false;
        this.$nextTick(() => {
          this.decorateRender = true;
          this.decorateData = this.pageMaps[newValue];
        })
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

    /* 检查输入正确性 */
    checkInput(resultData) {
      //检测基础信息
      if(!this.checkBaseInfo(resultData)){
        return false;
      }
      //检测假数据
      if(!this.checkFakeData(resultData)){
        return false;
      }
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
      this._apis.shop[params.methodName](params.resultData).then((response)=>{
          this.$message.success(params.tipWord)
          this.setLoading(false);
        }).catch((error)=>{
          this.$message.error(error);
          this.setLoading(false);
        });
    },

    /* 设置loading */
    setLoading(status) {
      this.config.buttons.saveData.loading = status;
    },

    tabClick(event, item) {
      this.confirm({
        title: '提示', 
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
