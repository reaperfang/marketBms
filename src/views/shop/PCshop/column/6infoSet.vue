<template>
    <div class="column_container">
      信息资讯编辑
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="图片(一张)" prop="backgroundImage">
          <div class="img_preview" v-if="ruleForm.backgroundImage">
            <img :src="ruleForm.backgroundImage" alt="">
            <span @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">更换图片</span>
          </div>
          <div class="add_button" v-if="!ruleForm.backgroundImage" @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">
            <i class="inner"></i>
          </div>
          建议尺寸：图片大小待补充
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
  name: "1picText",
  components: {dialogSelectImageMaterial},
  data() {
    return {
      loading: false,
      dialogVisible: false,
      currentDialog: '',
      ruleForm: {
        name: '',//显示样式
        detail: '', 
        backgroundImage: '',//背景图片
        useBtn: 1,
        btnName: '立即购买',
        dataSource: 1
      },
      rules: {
        name: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur"
          }
        ], 
        detail: [
          { required: true, message: "请输入详情", trigger: "blur" }
        ],
        backgroundImage: [
          { required: true, message: "请添加图片", trigger: "change" }
        ],
        useBtn: [
          { required: true, message: "请选择按钮使用", trigger: "change" }
        ], 
        btnName: [
          { required: true, message: "请输入按钮名称", trigger: "blue" }
        ],
        dataSource: [
          { required: true, message: "请选择数据来源", trigger: "change" }
        ],
      },
      submitLoadinig: false
    };
  },
  created() {
    this.fetch();
  },
  methods: {

    /* 获取店铺装修数据 */
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

    /* 
     * 富文本数据更新
    */
    editorValueUpdate(value) {
      this.ruleForm.editorData = value;
    },

     /* 弹框选中图片 */
    imageSelected(dialogData) {
      this.ruleForm.backgroundImage = dialogData.filePath;
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

