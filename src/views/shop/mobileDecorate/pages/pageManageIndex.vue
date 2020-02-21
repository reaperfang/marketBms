<template>
  <div>
    <el-tabs v-model="currentTab" @tab-click="handleClick">
      <el-tab-pane label="页面管理" name="pageList"></el-tab-pane>
      <el-tab-pane label="分类管理" name="classifyList"></el-tab-pane>
      <el-tab-pane label="草稿箱" name="draftList"></el-tab-pane>
    </el-tabs>
    <component :is="currentTab"></component>
  </div>
</template>

<script>
import pageList from "./list/pageList";
import classifyList from "./list/classifyList";
import draftList from "./list/draftList";
export default {
  name: "pageManageIndex",
  components: { pageList, classifyList, draftList },
  data() {
    return {
      currentTab: "pageList"
    };
  },
  created() {},
  methods: {
    handleClick(comp) {
      this.currentTab = comp.name;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tabs {
  background: #fff;
  padding: 20px;
}
</style>
