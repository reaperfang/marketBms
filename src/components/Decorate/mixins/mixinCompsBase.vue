<script>
import componentEmpty from '../tools/componentEmpty';
export default {
  name: "mixinCompsBase",
  components: {componentEmpty},
  props: ["data"],
  data() {
    return {
      allLoaded: true  //全部加载完成
    }
  },
  computed: {
    currentComponentId() {
      return this.data.id;
    },
    componentDataMap() {
      return this.$store.getters.componentDataMap || {};
    },
    currentComponentData() {
      return this.componentDataMap[this.currentComponentId] || {};
    }
  },
  watch: {
      allLoaded (newValue) {
        this.$emit("loadStatusChange", {
          id: this.data.id,
          loadStatus: newValue
        });
      }
  }
};
</script>	
