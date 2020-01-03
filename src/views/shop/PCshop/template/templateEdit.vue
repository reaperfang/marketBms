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
      this._apis.shop.getPagesByTemplateId({pageTemplateId: this.id}).then((response)=>{
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
        pageKey: data.pageKey
      }
    },

     /* 保存数据 */
    saveData() {
      let resultData = this.$refs.Decorate.collectData();
      if(resultData && Object.prototype.toString.call(resultData) === '[object Object]') {
        resultData['status'] = '1';
        if(this.checkInput(resultData)) {
          this.setLoading(true);
          this.sendRequest({methodName: 'createPage', resultData, tipWord: '保存成功!'});
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
          for(let item of this.componentDataIds) {
            const componentData = this.componentDataMap[item];
            if(componentData.type === 'goods') {
              if(componentData.data.ids && !componentData.data.ids.length) {
                this.$alert('请在右侧选择真实商品后重试', '提示', {
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
          }
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

    tabClick(event, item) {
      this.$confirm(`是否要离开当前页面，离开将不会保存。`, '提示', {
        confirmButtonText: '离开',
        cancelButtonText: '取消',
        type: 'warning'
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
