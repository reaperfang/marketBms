<template>
  <!-- 公告 -->
  <div class="component_wrapper" :style="{cursor: dragable ? 'pointer' : 'text'}">
    <div class="componentNotice" v-if="currentComponentData && currentComponentData.data">
      <van-notice-bar
        v-if="currentComponentData.data.notice"
        :text="currentComponentData.data.notice"
        left-icon="volume-o"
        :color="currentComponentData.data.fontColor "
        :background="currentComponentData.data.backgroundColor"
      />
      <componentEmpty v-else :componentData="currentComponentData"></componentEmpty>
    </div>
  </div>
</template>

<script>
import mixinCompsBase from "../mixins/mixinCompsBase";
export default {
  name: "componentNotice",
  mixins: [mixinCompsBase],
  components: {},
  data() {
    return {};
  },
  created() {},
  computed: {},
  mounted() {
    this.dataLoaded = true;
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.componentNotice {
  .van-notice-bar {
    height: 29px;
  }
  /deep/ .van-notice-bar__wrap {
    font-size: 12px;
    padding-left: 10px;
  }
  /deep/ .van-icon {
    color: #fc3d42;
  }
  /deep/ .van-icon-volume-o:before {
    font-size: 14px;
  }
}
</style>
