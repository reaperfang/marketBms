<template>
  <div class="row-3-grid-content flex-column">
    <el-row type="flex" justify="space-between" class="item">
      <el-col :span="24">
        <gridtitle :title="'用户交易偏好'"></gridtitle>
      </el-col>
    </el-row>
    <el-row class="item-content">
        <vcap></vcap>
        
         </el-row>
  </div>
</template>

<script>
import gridtitle from "../../components/title/index";
import vcap from "../../components/v-chart/cap/index";

export default {
  watch: {
    // flowData(val) {
    // }
  },
  props: {
    // data: {
    //   type: Object,
    //   default: false
    // }
  },
  components: { gridtitle, vcap },
  data: function() {
    return {};
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
