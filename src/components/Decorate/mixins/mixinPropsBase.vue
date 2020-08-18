<script>
export default {
  name: "mixinPropsBase",
  props: ["data"],
  data() {
    return {
      currentComponentData: {},
      errorMark: false, //是否开启错误验证
    }
  },
  created() {
    this.initRuleForm();
  },
  watch: {
    ruleForm: {
      handler(newValue) {
        this.emitChangeRuleForm(newValue);
      },
      deep: true
    },
    //点击保存按钮验证到当前显示组件中有未填写项错误时，显示错误提示
    '$store.state.decorate.checkErrorId': {
      handler(newValue, oldValue) { 
        if(newValue && newValue !== oldValue){
          setTimeout(() => {
            this.errorMark = true;
            this.$store.commit('setCheckErrorId', null);
            if(this.$refs.ruleForm){
              this.$refs.ruleForm.validate();
            }
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    /* 初始化表单数据 */
    initRuleForm() {
      console.log(this.data)
      if (this.data) {
        this.ruleForm = Object.assign({}, this.ruleForm, this.data);
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
