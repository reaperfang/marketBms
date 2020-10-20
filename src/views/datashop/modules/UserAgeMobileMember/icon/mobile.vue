<template>
  <div class="icon-mobile">
    <div class="row start">绑定手机</div>
    <div class="row end">77%</div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  watch: {
    // flowData(val) {
    // }
  },
  // props: {
  // 	data: {
  // 		type: Object,
  // 		default: false
  // 	}
  // },
  props: ["title"],
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
.icon-mobile {
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 70px;
  width: 100px;
  .start,
  .end {
    display: flex;
    justify-content: center;
  }

  .start {
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
  }

  .end {
    font-size: 24px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 33px;
    margin-top: 10px;
  }

  // background: yellow;
}
</style>
