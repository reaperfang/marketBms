<template>
  <div class="pay">
    <el-row class="row">
      <el-col :span="8"><div class="grid-box"></div></el-col>
      <el-col :span="8"><div class="grid-box"></div></el-col>
      <el-col :span="8"><div class="grid-box"></div></el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="8"><div class="grid-box"></div></el-col>
      <el-col :span="8"><div class="grid-box"></div></el-col>
      <el-col :span="8"><div class="grid-box"></div></el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

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
  components: {},
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

<style lang="scss">
.pay {
  height: 100%;
  display: flex;
  flex-direction: column;
  .row {
    flex: 1;

    .grid-box{
        background: red;
        height: 100%;
    }
  }
}
</style>
