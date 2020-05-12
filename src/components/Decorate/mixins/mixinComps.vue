<script>
import componentEmpty from '../tools/componentEmpty';
import componentButton from '../tools/componentButton';
export default {
  name: "componentMixin",
  components: {componentEmpty, componentButton},
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
  created(){
      this.decoration && this.decoration();
  },
  watch: {
      currentComponentData(){
         this.decoration && this.decoration();
      },
      allLoaded (newValue) {
        this.$emit("loadStatusChange", {
          id: this.data.id,
          loadStatus: newValue
        });
      }
    },
};
</script>	
