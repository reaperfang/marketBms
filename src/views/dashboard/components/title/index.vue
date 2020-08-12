<template>
  <div class="grid-titile">
    <span>{{ title }}</span>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  watch: {
    // flowData(val) {
    // }
  },
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
.grid-titile {
  margin: 8px 8px 0 8px;
  display: flex;
  align-items: center;
  height: 35px;
  background: linear-gradient(
    90deg,
    rgba(71, 225, 255, 0.3) 0%,
    rgba(71, 225, 255, 0) 100%
  );
  span {
    font-size: 16px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    margin: 0 10px;
  }
}
</style>
