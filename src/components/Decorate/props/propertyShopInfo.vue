<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
    <div class="block form">
      <el-form-item label="显示样式" prop="displayStyle">
        <el-radio-group v-model="ruleForm.displayStyle">
          <el-radio :label="1">样式1</el-radio>
          <el-radio :label="2">样式2</el-radio>
          <el-radio :label="3">样式3</el-radio>
          <el-radio :label="4">样式4</el-radio>
          <el-radio :label="5">样式5</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="背景图片" prop="backgroundImage">
        <div class="img_preview" v-if="ruleForm.backgroundImage">
          <img :src="ruleForm.backgroundImage" alt="">
          <i class="delete_btn" @click.stop="deleteImage()"></i>
          <span @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">更换图片</span>
        </div>
        <div class="add_button" v-if="!ruleForm.backgroundImage" @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">
          <i class="inner"></i>
          <p>添加图片</p>
        </div>
        <p class="prop-message" style="margin-top:5px;">建议尺寸：750*370像素，尺寸不匹配时，图片将被压缩或拉伸以铺满四周</p>
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
  name: 'propertyShopInfo',
  mixins: [mixinPropsBase],
  components: {dialogSelectImageMaterial},
  data () {
    return {
      ruleForm: {
        displayStyle: 1,//显示样式
        backgroundImage: ''//背景图片
      },
      rules: {

      },
      dialogVisible: false,
      currentDialog: '',

    }
  },
  methods: {

    /* 弹框选中图片 */
    imageSelected(dialogData) {
      this.ruleForm.backgroundImage = dialogData.filePath;
    },

     /* 清除背景图片 */
    deleteImage() {
      this.ruleForm.backgroundImage = ''
    }
  }
}
</script>

<style lang="scss">

</style>
