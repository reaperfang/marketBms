<template>
<el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" :inline="true" v-calcHeight="height">
  <div class="block form">
    <el-form-item label="背景颜色">
      <div class="color_block">
        <el-input v-model="ruleForm.backgroundColor" :disabled="true"></el-input>
        <colorPicker  v-model="ruleForm.backgroundColor" defaultColor="#ffffff"></colorPicker>
      </div>
    </el-form-item>
    <el-form-item label="页面边距">
      <el-checkbox v-model="ruleForm.remainPageMargin">保留边距</el-checkbox>
    </el-form-item>
    <el-form-item label="">
      <RichEditor @editorValueUpdate="editorValueUpdate" :myConfig="myConfig" :richValue="ruleForm.richValue" ref="richEditor"></RichEditor>
    </el-form-item>
    </div>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';;
import RichEditor from '@/components/RichEditor';
export default {
  name: 'propertyRichEditor',
  mixins: [propertyMixin],
  components: {RichEditor},
  data () {
    return {
      editorData: '',  //富文本数据
      myConfig: {
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 320,
          // 初始容器宽度
          initialFrameWidth: 306
      },
      ruleForm: {
        backgroundColor: '#ffffff',//背景颜色
        remainPageMargin: true,//是否保留边距
        richValue: ''//富文本内容
      },
      rules: {

      }
    }
  },

  mounted() {
    setTimeout(() => {
      this.setEditorBackground();
    },500);
  },

  watch: {
    'ruleForm.backgroundColor'() {
      this.setEditorBackground();
    }
  },

  methods: {

    /* 富文本内容更新 */
    editorValueUpdate(html) {
      this.ruleForm.richValue = html;
    },

    setEditorBackground() {
      const richEditor = this.$refs.richEditor;
      if(!richEditor) {
        return;
      }
      const body = richEditor.editor.body;
      body.style.backgroundColor = this.ruleForm.backgroundColor;
    }

  }
}
</script>

<style lang="scss" scoped>
/deep/.edui-editor{
    z-index: initial!important;
}
/deep/.m-colorPicker .box.open {
    z-index: 9999!important;
}
</style>
