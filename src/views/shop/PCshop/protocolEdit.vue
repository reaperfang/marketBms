<template>
  <div class="gbc_container">
    <h2>注册条款设置</h2>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="注册条款：" prop="richValue">
          <RichEditor @editorValueUpdate="editorValueUpdate" :myConfig="myConfig" :richValue="ruleForm.richValue"></RichEditor>
        </el-form-item>
        <div class="confirm_btn">
          <el-button type="primary" @click="saveData" :loading="submitLoadinig">保存</el-button>
        </div>
      </el-form>
  </div>
</template>

<script>
import RichEditor from '@/components/RichEditor';
export default {
  name: 'protocolEdit',
  components: {RichEditor},
  data() {
    return {
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 600,
        // 初始容器宽度
        initialFrameWidth: '100%'
      },
      ruleForm: {
        richValue: ''
      },
      rules: {
         richValue: [
          { required: true, message: "请输入协议内容", trigger: "blur" },
        ], 
      },
      loading: true,
      submitLoadinig: false
    }
  },

  created() {
    this.fetch();
  },

  methods: {
    /* 
     * 富文本数据更新
    */
    editorValueUpdate(value) {
      this.ruleForm.richValue = value;
    },

     /* 获取会员协议 */
    fetch() {
      this.loading = true;
      this._apis.goodsOperate.getProtocol({}).then((response)=>{
        if(response && response.memberRegistrationProtocol) {
          const string = unescape(response.memberRegistrationProtocol);
          if(string) {
            this.ruleForm.richValue = string;
          }
        }
         this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },
    
    /* 修改会员协议 */
    saveData() {
      this.$refs.ruleForm.validate(valid => {
        if(valid) {
          this.submitLoadinig = true;
          this._apis.goodsOperate.setProtocol({memberRegistrationProtocol: escape(this.ruleForm.richValue)}).then((response)=>{
            this.$notify({
              title: '成功',
              message: '修改成功！',
              type: 'success'
            });
            this.submitLoadinig = false;
          }).catch((error)=>{
            console.error(error);
            this.submitLoadinig = false;
          });
        }else {
          this.$message({ message: '填写正确的信息', type: 'warning' });
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.confirm_btn{
  display:flex;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 30px;
  margin-top:20px;
}
</style>
