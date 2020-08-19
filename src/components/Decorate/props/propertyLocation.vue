<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
    <div class="block form">
      <el-form-item label="文字颜色" prop="fontColor">
        <div class="color_block">
          <el-input v-model="ruleForm.fontColor" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.fontColor" defaultColor="rgba(0,0,0,1)"></colorPicker >
        </div>
      </el-form-item>
      <el-form-item label="背景" prop="fontColor">
        <el-radio-group v-model="ruleForm.bgType">
          <div class="color_block">
            <el-radio :label="1">背景颜色</el-radio>
            <el-input v-model="ruleForm.backgroundColor" :disabled="true"></el-input>
            <colorPicker  v-model="ruleForm.backgroundColor" :disabled="ruleForm.bgType!=1" defaultColor="rgba(255,255,255,1)"></colorPicker>
          </div>
          <div class="color_block mg_top12">
            <el-radio :label="2">背景图</el-radio>
            <div class="el-form-item__error" v-show="errorMark && ruleForm.bgType === 2 && ruleForm.backgroundImage === ''">
              请上传背景图片
            </div>
            <div class="img_preview" v-if="ruleForm.backgroundImage">
              <img :src="ruleForm.backgroundImage" alt="">
              <i v-show="ruleForm.bgType == 2" class="delete_btn" @click.stop="deleteImage()"></i>
              <span v-show="ruleForm.bgType == 2" @click="showDialog">更换图片</span>
            </div>
            <div class="add_button add_button_img" :class="{'disable':ruleForm.bgType!=2}" v-if="!ruleForm.backgroundImage" @click="showDialog">
              <i class="inner"></i>
              <p style="font-size: 14px;">上传图片</p>
            </div>
          </div>
          <p class="prop-message">建议尺寸: <br>300*40像素或同等比例<br>大小不超过3M</p>
        </el-radio-group>
      </el-form-item>
      
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected"></component>
  </el-form>
</template>

<script>
import mixinPropsBase from '../mixins/mixinPropsBase';
import dialogSelectImageMaterial from '@/components/dialogs/selectImageMaterial/index';
export default {
  name: 'propertyLocation',
  mixins: [mixinPropsBase],
  components: {dialogSelectImageMaterial},
  data () {
    return {
      ruleForm: {
        text: '位置信息',
        fontColor: 'rgba(0,0,0,1)',
        bgType: 1,// 背景类型
        backgroundColor: 'rgba(255,255,255,1)',//背景颜色
        backgroundImage: ''
      },
      rules: {

      },
      dialogVisible: false,
      currentDialog: ''
    }
  },
  created() {
    
  },
  methods: {
    //保存时需要触发的回调函数
    saveCallBack(data) {
      if(data.bgType === 2 && data.backgroundImage === ''){
        this.$alert('请上传背景图片!', '警告', {
          confirmButtonText: '确定'
        });
        return false;
      }
      return true;
    },

    /* 弹框选中图片 */
    imageSelected(dialogData) {
      if(this.ruleForm.bgType == 2){
        this.ruleForm.backgroundImage = dialogData.filePath;
      }
    },

     /* 清除背景图片 */
    deleteImage() {
      if(this.ruleForm.bgType == 2){
        this.ruleForm.backgroundImage = ''
      }
    },

    showDialog() {
      if(this.ruleForm.bgType == 2){
        this.dialogVisible=true;
        this.currentDialog='dialogSelectImageMaterial'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.m-colorPicker .box.open {
    z-index: 10!important;
}
.block.form .el-radio-group{
  margin-top: 0px;
}
.color_block{
  display: flex;
  height: auto !important;
}
.color_block .el-radio{
  margin-top: 9px;
}
.mg_top12{
  display: block;
  margin-top: 12px;
  margin-bottom: 8px;
  .el-form-item__error {
    position: static;
    display: inline-block;
  }
}
.img_preview span{
  font-size: 14px;
}
.add_button.disable{
  cursor: not-allowed;
}
.add_button.disable:hover {
  border-color: #b6b5c8;
}
/deep/ .color_block .colorBtn {
  margin-left: 6px;
  margin-right: 0;
}

</style>
