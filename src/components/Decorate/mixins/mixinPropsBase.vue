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

    //点击保存按钮验证到组件有未填写项错误时，跳转至组件后显示错误提示
    //这里是切换至验证错误组件时触发
    if(this.$store.state.decorate.checkErrorId){
      this.errorMark = true;
      this.$store.commit('setCheckErrorId', null);
      this.$nextTick(() => {
        if(this.$refs.ruleForm){
          this.$refs.ruleForm.validate();
        }
      })
    }
  },
  watch: {
    ruleForm: {
      handler(newValue) {
        this.emitChangeRuleForm(newValue);
      },
      deep: true
    },
    //点击保存按钮验证到当前显示组件中有未填写项错误时，显示错误提示
    //这里是为了当前显示的组件验证错误时执行，这时不会切换，就不会触发created
    '$store.state.decorate.checkErrorId'(newValue, oldValue) { 
      if(newValue && newValue !== oldValue){
        setTimeout(() => { //为了在切换至错误组件时优先执行created
          this.errorMark = true;
          this.$store.commit('setCheckErrorId', null);
          if(this.$refs.ruleForm){
            this.$refs.ruleForm.validate();
          }
        })
      }
    }
  },
  methods: {
    /* 初始化表单数据 */
    initRuleForm() {
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
