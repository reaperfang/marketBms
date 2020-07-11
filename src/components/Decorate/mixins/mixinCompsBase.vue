<script>
import componentEmpty from '../tools/componentEmpty';
export default {
  name: "mixinCompsBase",
  components: {componentEmpty},
  props: {
    data: {
      type: Object
    },
    dragable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dataLoaded: false  //组件数据加载完成
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
    /* 组件数据加载结束 */
      'dataLoaded' (newValue) {
        this.$emit("componentDataLoaded", this.currentComponentData);
      }
  }
};
</script>	
