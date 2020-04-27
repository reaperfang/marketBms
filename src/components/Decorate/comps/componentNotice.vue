<template>
  <!-- 公告 -->
  <div class="component_wrapper">
    <div class="componentNotice" v-if="currentComponentData && currentComponentData.data">
      <van-notice-bar
        :text="currentComponentData.data.notice"
        left-icon="volume-o"
        :color="currentComponentData.data.fontColor "
        :background="currentComponentData.data.backgroundColor"
      />
    </div>
  </div>
</template>

<script>
import componentMixin from "../mixins/mixinComps";
export default {
  name: "componentNotice",
  mixins: [componentMixin],
  components: {},
  data() {
    return {};
  },
  created() {},
  computed: {},
  mounted() {},
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
