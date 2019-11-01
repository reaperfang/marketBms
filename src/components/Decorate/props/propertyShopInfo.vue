<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" :style="bodyHeight">
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
          <span @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">更换图片</span>
        </div>
        <div class="add_button" v-if="!ruleForm.backgroundImage" @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">
          <i class="inner"></i>
        </div>
        建议尺寸：750*370，尺寸不匹配时，图片将被压缩或拉伸以铺满四周
      </el-form-item>
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected"></component>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';
import dialogSelectImageMaterial from '@/views/shop/dialogs/dialogSelectImageMaterial';
export default {
  name: 'propertyShopInfo',
  mixins: [propertyMixin],
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
    }
  }
}
</script>

<style lang="scss">

</style>
