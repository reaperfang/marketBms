<template>
  <div class="editor-wrapper">
    <widgetView v-if="showWidget"></widgetView>
    <editView :dragable="true" v-if="height > 0" :height="height"></editView>
    <propView :saveData="saveData" :saveAndApplyData="saveAndApplyData" :resetData="resetData" :parentScope="this" :homePageData="homePageData" :saveToTemplate="saveToTemplate"></propView>
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
    componentConfig: {
      type: Object
    },
    saveData: {
      type: Function
    },
    saveAndApplyData: {
      type: Function
    },
    saveToTemplate: {
      type: Function
    },
    resetData: {
      type: Function
    },
    homePageData: {
      type: Object
    },
    showWidget: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      height: 0
    };
  },
  created() {
    const id = uuid();
    this.$store.commit('addComponent', Object.assign({id}, this.componentConfig));
    this.$store.commit('setBasePropertyId', id);
  },
  mounted() {
    this.height = document.body.clientHeight - 145 - 10;
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
    }
  },
  methods: {

  },

};
</script>
<style lang="scss" scoped>
.editor-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

