<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" :style="bodyHeight">
    <div class="block form">
      <el-form-item label="文本" prop="textContent">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入要说明的文字，最多100字"
          v-model="ruleForm.textContent">
        </el-input>
      </el-form-item>
      <el-form-item label="字体大小" prop="fontSize">
        <el-radio-group v-model="ruleForm.fontSize">
          <el-radio :label="1">大</el-radio>
          <el-radio :label="2">中</el-radio>
          <el-radio :label="3">小</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文字颜色" prop="fontColor">
        <div class="color_block">
          <el-input v-model="ruleForm.fontColor" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.fontColor" defaultColor="#000000"></colorPicker >
          <!-- <el-button type="text">重置</el-button> -->
        </div>
      </el-form-item>
      <el-form-item label="背景颜色" prop="backgroundColor">
        <div class="color_block">
          <el-input v-model="ruleForm.backgroundColor" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.backgroundColor" defaultColor="#ffffff"></colorPicker >
          <!-- <el-button type="text">重置</el-button> -->
        </div>
      </el-form-item>
      <el-form-item label="显示设置" prop="displayStyle">
        <el-radio-group v-model="ruleForm.displayStyle">
          <el-radio :label="1">居左</el-radio>
          <el-radio :label="2">居中</el-radio>
          <el-radio :label="3">居右</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="跳转链接" prop="linkTo">
        <el-button 
        type="text" 
        @click="dialogVisible=true; currentDialog='dialogSelectJumpPage'" 
        :title="ruleForm.linkTo ? ruleForm.linkTo.typeName + '-' +  (ruleForm.linkTo.data.title || ruleForm.linkTo.data.name) : '选择跳转到的页面'">
        {{ruleForm.linkTo ? ruleForm.linkTo.typeName + '-' +  (ruleForm.linkTo.data.title || ruleForm.linkTo.data.name) : '选择跳转到的页面'}}
        </el-button>
      </el-form-item>
      <el-form-item label="更多设置" prop="showDivider">
        <el-checkbox v-model="ruleForm.showDivider">显示底部分割线</el-checkbox>
      </el-form-item>
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @seletedPage="seletedPage"></component>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';
import dialogSelectJumpPage from '@/views/shop/dialogs/decorateDialogs/dialogSelectJumpPage';
export default {
  name: 'propertyText',
  mixins: [propertyMixin],
  components: {dialogSelectJumpPage},
  data () {
    return {
      ruleForm: {
        textContent: "",//文本
        fontSize: 2,//字体大小
        fontColor: '#000000',//文本颜色
        backgroundColor: '#ffffff',//背景颜色
        displayStyle: 2,//显示位置
        linkTo: null,//链接
        showDivider: false// 显示底部分割线
      },
      rules: {

      },
      dialogVisible: false,
      currentDialog: '',

    }
  },
  methods: {

    /* 弹窗选中了跳转链接 */
    seletedPage(linkTo) {
      this.ruleForm.linkTo = linkTo;
    },
  }
}
</script>

<style lang="scss" scoped>
/deep/.m-colorPicker .box.open {
    z-index: 10!important;
}
</style>
