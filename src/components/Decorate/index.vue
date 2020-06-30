<template>
  <div class="editor-wrapper">
    <widgetView v-if="config.showWidget" :componentsConfig="config.components"></widgetView>
    <renderView v-if="height > 0" :dragable="config.dragable" :height="height"></renderView>
    <propView v-if="config.showProp" :buttons="buttonList"></propView>
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
    },
    height: {
      type: Number,
      default: 145 - 10
    }
  },
  data() {
    return {
      buttonList: this.config.buttons,
      decoratePageData:this.decorateData
    };
  },
  created() {

    //创建组件id
    const id = uuidv4();

    //转换接口数据为可识别格式
    this.convertDecorateData(this.decoratePageData);

    //创建基础组件-页面根组件
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

    //设置基础组件id
    this.$store.commit('setBasePropertyId', id);
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
    'config.buttons': {
      handler(newValue) {
        this.buttonList = newValue;
      },
      deep: true
    },
    'decorateData': {
      handler(newValue) {
        this.decoratePageData = newValue;
        this.convertDecorateData(this.decoratePageData);
      },
      deep: true
    },
  },
  methods: {
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
      this.init(result, data);
    },

    //编辑器数据初始化
    init(pageData, originData) {
      let componentDataIds = [];
      let componentDataMap = {};

      //转换为组件顺序表和map数据结构
      for (let item of pageData) {
        componentDataIds.push(item.id);
        componentDataMap[item.id] = item;
        if(componentDataMap[item.id]['data'] && widget.getNeedFakeDataWidgetTypes().includes(componentDataMap[item.id].type)) {
          componentDataMap[item.id]['data']['showFakeData'] = true;
        }
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

