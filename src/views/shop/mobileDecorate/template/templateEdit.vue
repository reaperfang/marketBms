<template>
  <div>
    <div v-loading="loading">
      <!-- 装修编辑器 -->
      <Decorate ref="Decorate" :decorateData="decorateData" :config="config"></Decorate>
    </div>
  </div>
</template>

<script>
import Decorate from '@/components/Decorate';
import utils from "@/utils";
import SAVE_BLACK_LIST from '@/components/Decorate/config/saveBlackList'
export default {
  name: "templateEdit",
  components: { Decorate },
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
        dragable: true
      },
      decorateData: null,
      pageList: [],  //页面列表
      pageMaps: {},  //页面数据集合
      decorateRender: false  //装修是否渲染
    };
  },
  created() {
    this.fetchTemplateStatus();
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

    /* 模板是否已过期 */
    fetchTemplateStatus() {
      this._apis.shop.getTemplateInfo({pageTemplateId: this.id}).then(res => {
        if(res && res.status === 2){ // 已过期2
          this.confirm({
            title: '提示',
            icon: true,
            showCancelButton: false,
            confirmText: '我知道了',
            text: `模板已过期`
          });
        }
      })
    },

    /* 获取模板下的页面列表 */
    getPageList() {
      this.loading = true;
      this._apis.goodsOperate.getPagesByTemplateId({pageTemplateId: this.id}).then((response) => {
        if (response === null || response === undefined || response === '' || response.length === 0 || !response) {
          this.$store.commit("clearAllData");
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
        this.$store.commit("clearAllData");
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
    /* 保存并生效数据 */
    saveAndApplyData() {
      this.saveType = 'saveAndApply';
      let resultData = this.$refs.Decorate.collectData();
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
      if (this.baseInfo.vError) {
        this.$alert('请填写基础信息后重试，点击确认返回编辑页面信息!', '警告', {
            confirmButtonText: '确定',
            callback: action => {
              //打开基础信息面板
              this.$store.commit('setCurrentComponentId', this.basePropertyId);
              this.setLoading(false);
            }
          });
        // this.$message({ message: '请填写正确信息', type: 'warning' });
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
          for(let item of this.componentDataIds) {
            const componentData = this.componentDataMap[item];
            if(componentData.data.list && !componentData.data.list.length) {
              this.$alert(`${componentData.title}组件【${componentData.id.substring(componentData.id.length - 6)}】尚未更换真实数据，请在右侧选择真实数据后重试`, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  //打开基础信息面板
                  this.$store.commit('setCurrentComponentId', componentData.id);
                  this.setLoading(false);
                }
              });
              return false;
            }
          }
          return true;
        }
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

    /* 清洗数据 */
    washData(data) {
      let copyData = {...data.pageData};
      for(let k in copyData) {
        const keys = Object.keys(copyData[k].data);
        for(let item of keys) {
          if(SAVE_BLACK_LIST.includes(item)) {
            delete copyData[k].data[item];
          }
        }
      }
      return copyData;
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
