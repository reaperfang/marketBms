<script>
export default {
  name: "propertyMixin",
  props: ["data"],
  data() {
    return {
      currentComponentData: {},
      items: [],
      bodyHeight: {}
    }
  },
  created() {
    this.initRuleForm();
  },
  mounted() {
    this.bodyHeight = {
      height: document.body.clientHeight - 128 - 116 - 20 + 'px'
    }
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
        this.$alert('示例数据不支持删除操作，请在右侧替换真实数据后重试!', '警告', {
          confirmButtonText: '确定'
        })
        return;
      }
      const tempItems = [...this.list];
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
