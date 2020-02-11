<template>
  <div class="editor-wrapper">
    <widgetView v-if="config.showWidget"></widgetView>
    <editView v-if="height > 0" :dragable="config.dragable" :height="height"></editView>
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
import editView from "./editView";
import propView from "./propView";
import utils from "@/utils";
import uuid from 'uuid/v4';
export default {
  name: "decorate",
  components: { widgetView, editView, propView },
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
    const id = uuid();
    this.convertDecorateData(this.decoratePageData);
    this.$store.commit('addComponent', Object.assign({id}, this.config.pageBase));
    this.$store.commit('setBasePropertyId', id);
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
      
      //还原组件列表
      let componentDataIds = [];
      let componentDataMap = {};
      const string = utils.uncompileStr(data.pageData);
      if(string.indexOf('id') < 0) {
        return;
      }
      let pageData = JSON.parse(string);
      if(!Array.isArray(pageData)) {
        return;
      }
      for (let item of pageData) {
        componentDataIds.push(item.id);
        componentDataMap[item.id] = item;
        if(item.isBase) {  //设置为基础信息组件
          this.$store.commit('setBasePropertyId', item.id);
        }
      }
      this.$store.commit("setComponentDataIds", componentDataIds);
      this.$store.commit("setComponentDataMap", componentDataMap);

      //设置全局基础信息
      this.$store.commit('updateComponent', {
        id: this.basePropertyId,
        data: this.config.callbacks.setBaseInfo(data)
      });
      this.$store.commit('setCurrentComponentId', this.basePropertyId);
    },

    /* 保存前收集装修数据 */
    collectData() {
      let result = this.baseInfo;
      let pageData = [];
      for(let item of this.componentDataIds) {
        const componentData = this.componentDataMap[item];
        if(componentData) {
          pageData.push(componentData);
        }
      }

      result['pageData'] = utils.compileStr(JSON.stringify(pageData));;
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

