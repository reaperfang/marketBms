<template>
    <div class="gbc_container">
      <h2>新建资讯</h2>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item label="资讯标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请勿超过64个字" clearable></el-input>
        </el-form-item>
        <el-form-item label="资讯封面" prop="cover">
          <div class="img_preview" v-if="ruleForm.cover">
            <img :src="ruleForm.cover" alt="">
            <span @click="currentImage= 'cover'; dialogVisible=true; currentDialog='dialogSelectImageMaterial'">更换图片</span>
          </div>
          <div class="add_button" v-if="!ruleForm.cover" @click="currentImage= 'cover'; dialogVisible=true; currentDialog='dialogSelectImageMaterial'">
            <i class="inner"></i>
          </div>
          建议尺寸：550*550像素
        </el-form-item> <el-form-item label="作者名称" prop="author">
          <el-input v-model="ruleForm.author" placeholder="请勿超过64个字" clearable></el-input>
        </el-form-item>
        <el-form-item label="作者头像" prop="authorHeadPath">
          <div class="img_preview" v-if="ruleForm.authorHeadPath">
            <img :src="ruleForm.authorHeadPath" alt="">
            <span @click="currentImage= 'authorHeadPath'; dialogVisible=true; currentDialog='dialogSelectImageMaterial'">更换图片</span>
          </div>
          <div class="add_button" v-if="!ruleForm.authorHeadPath" @click="currentImage= 'authorHeadPath'; dialogVisible=true; currentDialog='dialogSelectImageMaterial'">
            <i class="inner"></i>
          </div>
          建议尺寸：50*50像素
        </el-form-item>
        <el-form-item label="资讯正文" prop="data">
          <RichEditor @editorValueUpdate="editorValueUpdate" :myConfig="myConfig" :richValue="ruleForm.data"></RichEditor>
        </el-form-item>
      </el-form>
      <div class="confirm_btn">
        <el-button type="primary" @click="saveData" :loading="submitLoadinig">保存到草稿箱</el-button>
        <el-button type="primary" @click="$router.go(-1)">返回</el-button>
      </div>
    
      <!-- 动态弹窗 -->
      <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected"></component>
    </div>
</template>

<script>
import utils from '@/utils';
import dialogSelectImageMaterial from '@/views/shop/dialogs/dialogSelectImageMaterial';
import RichEditor from '@/components/RichEditor';
export default {
  name: "createInfo",
  components: {RichEditor, dialogSelectImageMaterial},
  data() {

    var validateTextLength = (value) =>{
      // 中文、中文标点、全角字符按1长度，英文、英文符号、数字按0.5长度计算
      let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g
      let mat = value.match(cnReg)
      let length
      if (mat) {
        length = (mat.length + (value.length - mat.length) * 0.5)
        return length
      } else {
        return value.length * 0.5
      }
    }

    var validateTitle = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入资讯标题'));
      } else {
        if(validateTextLength(value) > 64) {
          callback(new Error('长度不超过64个汉字/128个英文字符'));
        }else{
          callback();
        }
      }
    };

    var validateAuthor = (rule, value, callback) => {
      if(value) {
        if (value.trim().length === 0) {
          callback(new Error('请输入作者名称'));
        } else {
          if(validateTextLength(value) > 64) {
            callback(new Error('长度不超过64个汉字/128个英文字符'));
          }else{
            callback();
          }
        }
      }else{
        callback();
      }
    };

    return {
      loading: false,
      dialogVisible: false,
      currentDialog: '',
      currentImage: 'cover',  //图片弹窗类型
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 526,
        // 初始容器宽度
        initialFrameWidth: 765
      },
      ruleForm: {
        title: '',//显示样式
        cover: '',//背景图片
        author: '',//作者
        authorHeadPath: '',//作者头像
        data: ''
      },
      rules: {
        title: [
          { required: true, message: "请输入资讯标题", trigger: "blur" },
          {validator: validateTitle, trigger: "blur"}
        ], 
        author: [
          { required: false, message: "请输入作者名称", trigger: "blur" },
          {validator: validateAuthor, trigger: "blur"}
        ], 
        data: [
          { required: true, message: "请输入资讯正文", trigger: "change" }
        ]
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
      if(!this.$route.query.id) {
        return;
      }
      this.loading = true;
      this._apis.shop.getInfo({id: this.$route.query.id}).then((response)=>{
        this.ruleForm = response;
        if(response && response.data) {
          const string = unescape(response.data);
          if(string) {
            this.ruleForm.data = string;
          }
        }
         this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

    /* 保存数据 */
    saveData() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let result = {...this.ruleForm};
          result['data'] = escape(this.ruleForm.data);
          this.submitLoadinig = true;
          if(!this.$route.query.id) {
            this._apis.shop.createInfo(result).then((response)=>{
              this.$notify({
                title: '成功',
                message: '创建成功！',
                type: 'success'
              });
              this.submitLoadinig = false;
              this._routeTo('p_infoManageIndex');
            }).catch((error)=>{
              this.$notify.error({
                title: '错误',
                message: error
              });
              this.submitLoadinig = false;
            });
          }else{
             this._apis.shop.modifyInfo(result).then((response)=>{
              this.$notify({
                title: '成功',
                message: '修改成功!',
                type: 'success'
              });
              this.submitLoadinig = false;
              this._routeTo('p_infoManageIndex');
            }).catch((error)=>{
              this.$notify.error({
                title: '错误',
                message: error
              });
              this.submitLoadinig = false;
            });
          }
        } else {
          this.$message({ message: '填写正确的信息', type: 'warning' });
        }
      });
    },

    /* 
     * 富文本数据更新
    */
    editorValueUpdate(value) {
      this.ruleForm.data = value;
    },

     /* 弹框选中图片 */
    imageSelected(dialogData) {
      this.ruleForm[this.currentImage] = dialogData.filePath;
    }

  },

};
</script>
<style lang="scss" scoped>
.confirm_btn{
  display:flex;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 30px;
}
</style>

