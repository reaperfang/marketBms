<template>
    <div class="column_container">
      图文广告编辑
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请输入标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="图片(横向滑动)" prop="backgroundImage">
          <el-button type="text" @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">新增</el-button>
          <div>
            <span>新浪</span>
            <el-button type="text">删除</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div class="confirm_btn">
        <el-button type="primary" @click="saveData" :loading="submitLoadinig">保存并生效</el-button>
        <el-button type="primary" @click="$router.go(-1)">取消</el-button>
      </div>
    
      <!-- 动态弹窗 -->
      <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected"></component>
    </div>
</template>

<script>
import utils from '@/utils';
import dialogSelectImageMaterial from '@/views/shop/dialogs/dialogSelectImageMaterial';
export default {
  name: "5picText",
  components: {dialogSelectImageMaterial},
  data() {
    return {
      loading: false,
      dialogVisible: false,
      currentDialog: '',
      ruleForm: {
        title: '',//显示样式
        informationId: []//背景图片
      },
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur"
          }
        ]
        // informationId: [
        //   { required: true, message: "请添加图片", trigger: "change" }
        // ]
      },
      submitLoadinig: false
    };
  },
  created() {
    this.fetch();
  },
  methods: {

    /* 获取装修数据 */
    fetch() {
      if(!this.id) {
        return;
      }
      // this.loading = true;
      // this._apis.shop.getInfo({id: this.id}).then((response)=>{
      //    this.loading = false;
      //    this.decorateData = response;
      // }).catch((error)=>{
      //   console.error(error);
      //   this.loading = false;
      // });
    },

    /* 保存数据 */
    saveData() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submitLoadinig = true;
          // this._apis.shop[params.methodName](params.resultData).then((response)=>{
          //   this.$notify({
          //     title: '成功',
          //     message: params.tipWord,
          //     type: 'success'
          //   });
          //   this.submitLoadinig = false;
          //   this._routeTo('p_infoManageIndex');
          // }).catch((error)=>{
          //   this.$notify.error({
          //     title: '错误',
          //     message: error
          //   });
          //   this.submitLoadinig = false;
          // });
        } else {
          this.$message({ message: '填写正确的信息', type: 'warning' });
        }
      });
    },

     /* 弹框选中图片 */
    imageSelected(dialogData) {
      console.log(dialogData);
      // this.ruleForm.backgroundImage = dialogData.filePath;
    }

  },

};
</script>
<style lang="scss" scoped>
.createInfo_container{
  background:#fff;
}
.confirm_btn{
  display:flex;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 30px;
}
</style>

