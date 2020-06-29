<template>
  <div>
    <div v-if="pageList.length" v-loading="loading">
      <div class="tabs">
        <span type="primary" v-for="(item, key) of pageList" :key="key" :class="{'myActive': item.active === true}" @click="tabClick($event, item)" plain>{{item.name || '页面'}}</span>
      </div>

      <!-- 装修编辑器 -->
      <Decorate ref="Decorate" :decorateData="decorateData" :config="config" v-if="decorateRender"></Decorate>
    </div>
    <div v-else v-loading="loading" style="padding:50px;">
      暂无可用页面
    </div>
  </div>
</template>

<script>
import Decorate from '@/components/Decorate';
import SAVE_BLACK_LIST from '@/components/Decorate/config/saveBlackList'
import widget from '@/components/Decorate/config/widgetConfig';
import utils from "@/utils";
export default {
  name: "templateEdit",
  components: { Decorate },
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
        dragable: true
      },
      decorateData: null,
      pageList: [],  //页面列表
      pageMaps: {},  //页面数据集合
      decorateRender: false  //装修是否渲染
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
        this.$store.commit("clearAllData");
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
      let resultData = this.$refs.Decorate.collectData();
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
      const baseFlag = this.checkBaseInfo(resultData);
      if(baseFlag) {
        return this.checkFakeData(resultData);
      }else {
        return false;
      }
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
    },

    /* 检测假数据 */
    checkFakeData(data) {
      let needFakeDataWidget = [];
      widget.getNeedFakeDataWidget().forEach((item)=>{
        needFakeDataWidget.push(item.type);
      });

      for(let item of this.componentDataIds) {
        const componentData = this.componentDataMap[item];
        if(needFakeDataWidget.includes(componentData.type)) {
          const list = componentData.data.displayList || componentData.data.list;
          if(list && !list.length) {
            this.$store.commit('setCurrentComponentId', componentData.id);
            this.$alert(`【${componentData.title} - ${componentData.id.substring(componentData.id.length - 6)}】组件尚未更换真实数据，请在右侧选择真实数据后重试`, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                //打开基础信息面板
                this.setLoading(false);
              }
            });
            return false;
          }
        }
      }
      return true;
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
