<template>
  <div>
     <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0" :inline="true">
        <el-form-item label="" prop="customLink" style="margin-top: 18px;">
          <el-input v-model="ruleForm.customLink" placeholder="请输入自定义链接" clearable></el-input>
        </el-form-item>
      </el-form>
	  <div style="text-align: center; color: red">支持omo域名下的链接且只有公众号可用，小程序不支持，小程序支持京东直播的链接</div>
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
          {validator: (rule, value, callback) => {
            var reg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
            if(reg.test(value)) {
              callback();
            }else {
              callback(new Error('请输入正确的网址格式'));
            }
          }, trigger: "blur"}
        ]
      },
      invalid: true  //数据是否无效
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
        let shopInfo = this.$store.getters.shopInfos
        let cid = shopInfo && shopInfo.id || ''
        if (valid) {

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
          this.$emit('invalidChange', false)
        }else {
          /* 向父组件发送选中的数据 */
          this.$emit('seletedRow',  null);
          this.$emit('invalidChange', true)
        }
      })
    }

  }
};
</script>

<style lang="scss" scoped>
/deep/.el-form-item{
  input{
    width: 500px!important;
    height:40px!important;
    margin-left:118px!important;
  }
  .el-form-item__error {
    padding-top: 2px;
    margin-left: 118px;
    margin-top:5px;
  }
}
</style>
