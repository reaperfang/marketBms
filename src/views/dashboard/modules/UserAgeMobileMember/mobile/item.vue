<template>
  <div class="item-ring flex-column">
    <el-row type="flex" justify="space-between" class="item-title">
      <el-col :span="24">
        <gridtitle :title="title"></gridtitle>
      </el-col>
    </el-row>
    <el-row class="item-content">
      <pchart
        :progress="item.progress"
        :city="item.city"
        :barColor="item.barColor"
      ></pchart>
    </el-row>
  </div>
</template>

<script>
import gridtitle from "../../../components/title/index";
import pchart from "./progress/index";
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  watch: {
    // flowData(val) {
    // }
  },
  props: ["title", "chartData", "icon"],
  components: { gridtitle, pchart },
  data: function() {
    return {
      item: { progress: 95, barColor: "#06C9DD", city: "手机号绑定" },
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    //...mapActions([""]),
  },
};
</script>

<style lang="scss">
.item-ring {
  height: 100%;
}
</style>
