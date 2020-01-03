<template>
  <div>
    <el-tabs v-model="currentTab" @tab-click="handleClick">
      <el-tab-pane label="发布中" name="releasedList"></el-tab-pane>
      <el-tab-pane label="草稿箱" name="draftList"></el-tab-pane>
    </el-tabs>
    <component :is="currentTab"></component>
  </div>
</template>

<script>
import releasedList from "./list/releasedList";
import draftList from "./list/draftList";
export default {
  name: "pageManageIndex",
  components: { releasedList, draftList },
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
