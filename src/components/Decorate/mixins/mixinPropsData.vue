<script>
import mixinPropsBase from './mixinPropsBase';
export default {
  name: "mixinPropsData",
  extends: mixinPropsBase,
  data() {
    return {
      items: []
    }
  },
  created() {
    this.fetch(false);
  },
  methods: {
     /* 删除数据项 */
    deleteItem(item) {
      const tempItems = [...this.displayList];
      for(let i=0;i<tempItems.length;i++) {
        if(item === tempItems[i]) {
          tempItems.splice(i, 1);
        }
      }
      this.items = tempItems;
    },

    /* 弹窗选中了数据项 */
    dialogDataSelected(items) {
      this.items = items;
    },

    /* 同步到预览区 (若传入组件type和数据则按照传入的组件类型触发，否则按照当前组件类型触发) */
    syncToMiddle(componentType, data) {
      componentType = componentType || this.$attrs.type || '';
      data = data || this.ruleForm || {};
      this._globalEvent.$emit(`fetch${this.utils.titleCase(componentType)}`, data, this.$parent.currentComponentId);
      this.$store.commit('addEvent', `fetch${this.utils.titleCase(componentType)}`);
    }
  }
};
</script>
