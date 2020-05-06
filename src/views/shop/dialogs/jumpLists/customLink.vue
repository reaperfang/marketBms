<template>
  <div>
     <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0" :inline="true">
        <el-form-item label="" prop="activityName">
          <el-input v-model="ruleForm.customLink" placeholder="请输入自定义链接" clearable></el-input>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
import tableBase from '@/components/TableBase';
export default {
  name: "customLink",
  extends: tableBase,
  components: {},
  props: {
  },
  data() {
    return {
      ruleForm: {
        customLink: ''
      },
      rules: {
        customLink: [
          { required: true, message: "请输入自定义链接", trigger: "blur" },
          // {validator: validateTitle, trigger: "blur"}
        ]
      },
    };
  },
  created() {
  },
  watch: {
    'ruleForm.customLink'(newValue) {
      this.seletedChange(newValue);
    }
  },
  methods: {


    /* 选中改变 */
    seletedChange(newValue) {

      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
          let cid = shopInfo && shopInfo.id || ''

          /* 向父组件发送选中的数据 */
          this.$emit('seletedRow',  {
            pageType: 'customLink',
            typeName: '自定义链接',
            id: 8,
            data: {
              id: 'customLink',
              name: newValue,
              customLink: newValue
            },
            cid
          });
        }
      })
    }

  }
};
</script>

<style lang="scss">
.el-input{
  width: 500px;
  margin: 0 auto;
}
</style>