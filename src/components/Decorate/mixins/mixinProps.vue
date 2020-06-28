<script>
export default {
  name: "propertyMixin",
  props: ["data"],
  data() {
    return {
      currentComponentData: {},
      items: [],
      height: 128+116+20
    }
  },
  created() {
    this.initRuleForm();
  },
  mounted() {
  },
  watch: {
    ruleForm: {
      handler(newValue) {
        this.emitChangeRuleForm(newValue);
      },
      deep: true
    }
  },
  methods: {
    /* 初始化表单数据 */
    initRuleForm() {
      if (this.data) {
        this.ruleForm = this.data;
      }
      this.emitChangeRuleForm(this.ruleForm);
    },

    /* 发送数据改变事件 */
    emitChangeRuleForm(newValue) {
      this.currentComponentData['data'] = newValue;
      this.$emit("change", {
        id: this.$parent.currentComponentId,
        data: newValue
      });
    },

     /* 删除数据项 */
    deleteItem(item) {
      if(item.fakeData) {  //如果是假数据
        this.$message.error('示例数据不支持删除操作，请在右侧替换真实数据后重试!');
        return;
      }
      const tempItems = [...this.ruleForm.displayList];
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
<style lang="scss" scoped>
.el-radio-group{
  margin-top: 9px;
  .el-radio {
      margin-bottom: 10px;
      margin-right: 10px;
  }
}
.el-checkbox-group{
  .el-checkbox{
    margin-right: 10px;
  }
}
</style>
