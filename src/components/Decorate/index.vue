<template>
  <div class="editor-wrapper">
    <widgetView 
      v-if="config.showWidget" 
      :widgetCalcHeight="config.widgetCalcHeight"
      :componentsConfig="config.components" 
      @widgetPanelInited="widgetPanelInited"
    ></widgetView>
    <renderView 
      :renderCalcHeight="config.renderCalcHeight" 
      :dragable="config.dragable" 
      @renderPanelInited="renderPanelInited"
      @dataLoadProgress="dataLoadProgress"
      @allDataLoaded="finished"
    ></renderView>
    <propView 
      v-if="config.showProp" 
      :propCalcHeight="config.propCalcHeight"
      :buttons="config.buttons"
      @propsPanelInited="propsPanelInited"
      @propDataChanged="propDataChanged"
    ></propView>
    <!-- <div style="width:600px;">
      页面基础数据：
      <el-tag type="primary" style="width: 100%;overflow-x: auto;">{{baseInfo}}</el-tag>
      <hr />组件数据映射：
      <ul style="height:770px;overflow-y:auto;">
        <li v-for="(item,key) of componentDataIds" :key="key" style="overflow-x: auto;">
          <el-tag type="success">{{componentDataMap[item].title}}</el-tag>
          <el-tag type="success">{{componentDataMap[item].data}}</el-tag>
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script>
import widgetView from "./widgetView";
import renderView from "./renderView";
import propView from "./propView";
import utils from "@/utils";
import widget from './config/widgetConfig';
export default {
  name: "decorate",
  components: { widgetView, renderView, propView },
  props: {
    decorateData: {
      type: Object
    },
    config: {
      type: Object
    }
  },
  data() {
    return {
      decoratePageData:this.decorateData
    };
  },
  created() {
    this.init();
    this.$store.dispatch('getShopStyle');
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
    'decorateData': {
      handler(newValue) {
        this.updateDecorateData(newValue);
      },
      deep: true
    },
  },
  methods: {

    init() {

      //创建组件id
      const id = uuidv4();

      //转换接口数据为可识别格式
      const result = this.convertDecorateData(this.decoratePageData);

      //初始化编辑器数据
      this.initData(result, this.decoratePageData);

      //创建基础组件-页面根组件
      this.createBaseComponent(id);

      //设置基础组件id
      this.$store.commit('setBasePropertyId', id);

      //设置选中高亮的组件id
      this.$store.commit('setCurrentComponentId', this.basePropertyId);

      //发送请求数据初始化事件
      this.responseDataInited();
    },

    /* 转换接口获取的装修数据 */
    convertDecorateData(data) {
      if(!data) {
        return;
      }
      
      //解析接口数据
      const string = utils.uncompileStr(data.pageData);
      if(string.indexOf('id') < 0) {
        return;
      }
      let pageData = JSON.parse(string);
      let result = [];
      if(Object.prototype.toString.call(pageData) === '[object Object]') {
        for(let k in pageData) {
          result.push(pageData[k]);
        }
      }else {
        result = pageData;
      }
      if(!Array.isArray(result)) {
        return;
      }
      return result;
    },

    //编辑器数据初始化
    initData(pageData, originData) {
      if(!pageData) {
        return;
      }
      let componentDataIds = [];
      let componentDataMap = {};

      //转换为组件顺序表和map数据结构
      for (let item of pageData) {
        componentDataIds.push(item.id);
        componentDataMap[item.id] = item;
        if(item.isBase) {  //设置为基础信息组件
          this.$store.commit('setBasePropertyId', item.id);
        }
      }

      //设置组件顺序表
      this.$store.commit("setComponentDataIds", componentDataIds);

      //设置组件数据映射表
      this.$store.commit("setComponentDataMap", componentDataMap);

      //更新基础组件数据,用来回显页面信息
      this.$store.commit('updateComponent', {
        id: this.basePropertyId,
        data: this.config.callbacks.setBaseInfo(originData)
      });
    },

    /*创建基础组件-页面根组件 */
    createBaseComponent(id) {
      this.$store.commit('addComponent', {
        component: Object.assign({id}, (()=>{
          for(let item of widget.getWidgetList()) { 
            if(item.type === this.config.pageBase.type) {
              return Object.assign(item, this.config.pageBase);
              break;
            }
          }
        })())
      });
    },

    /* 更新装修数据 */
    updateDecorateData(newValue) {
      this.decoratePageData = newValue;

      //转换接口数据为可识别格式
      const result = this.convertDecorateData(this.decoratePageData);

      //初始化编辑器数据
      this.initData(result, this.decoratePageData);

      //设置选中高亮的组件id
      this.$store.commit('setCurrentComponentId', this.basePropertyId);
    },

    /* 保存前收集装修数据 */
    collectData() {
      let result = this.baseInfo;
      let pageData = [];
      for(let item of this.componentDataIds) {
        let componentData = this.componentDataMap[item];
        if(componentData) {
          pageData.push(componentData);
        }
      }

      result['pageData'] = pageData;
      return result;
    },

     /* 控件面板初始化事件 */
    widgetPanelInited() {
      this.$emit('widgetPanelInited', this);
    },
    
    /* 渲染面板初始化事件 */
    renderPanelInited() {
      this.$emit('renderPanelInited', this);
    },
    
    /* 属性面板初始化事件 */
    propsPanelInited() {
      this.$emit('propsPanelInited', this);
    },

    /* 请求数据转换初始化事件 */
    responseDataInited() {
      this.$emit('responseDataInited', this);
    },

    /* 组件数据发生改变事件 */
    propDataChanged(id, data) {
      this.$emit('propDataChanged', this, id, data);
    },

    /* 组件数据加载进度事件 */
    dataLoadProgress(value, component) {
      this.$emit('dataLoadProgress', this, value, component);
    },

    /* 编辑器整体加载完毕事件 */
    finished() {
      this.$emit('finished', this);
      console.log('编辑器整体加载完毕！')
    }
  }

};
</script>
<style lang="scss" scoped>
.editor-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

