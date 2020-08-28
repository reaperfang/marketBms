<template>
  <div class="icon-pie">
    <p class="p-end">{{ city }}</p>
    <p class="p-start">{{ progress }}%</p>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  watch: {
    // flowData(val) {
    // }
  },
  props: ["progress", "city"],
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
.icon-pie {
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 70px;
  width: 100px;
  text-align: center;
  .p-start {
    font-size: 28px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 40px;
  }

  .p-end {
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    line-height: 20px;
    margin-bottom: 3px;
  }
}
</style>
