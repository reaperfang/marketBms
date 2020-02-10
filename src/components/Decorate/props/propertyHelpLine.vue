<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" v-calcHeight="height">
    <div class="block form">
      <el-form-item label="颜色" prop="lineColor">
        <div class="color_block">
          <el-input v-model="ruleForm.lineColor" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.lineColor" defaultColor="rgb(229,229,229)"></colorPicker >
          <!-- <el-button type="text">重置</el-button> -->
        </div>
      </el-form-item>
      <el-form-item label="边距" prop="lineMargin">
        <el-radio-group v-model="ruleForm.lineMargin">
          <el-radio :label="1">无边距</el-radio>
          <el-radio :label="2">左右留边</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="样式" prop="lineStyle">
        <el-radio-group v-model="ruleForm.lineStyle">
          <el-radio :label="1">实线</el-radio>
          <el-radio :label="2">虚线</el-radio>
          <el-radio :label="3">点线</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';;
export default {
  name: 'propertyHelpLine',
  mixins: [propertyMixin],
  components: {},
  data () {
    return {
      ruleForm: {
        lineColor: 'rgb(229,229,229)',//颜色
        lineMargin: 1,//	边距
        lineStyle: 1//	样式
      },
      rules: {

      },

    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
/deep/.m-colorPicker .box.open {
    z-index: 10!important;
}
</style>
