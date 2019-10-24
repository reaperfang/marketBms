<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" :style="bodyHeight">
    <div class="block form">
      <el-form-item label="公告" prop="notice">
        <el-input
          placeholder="请填写内容，如果过长，将会在手机上滚动显示"
          v-model="ruleForm.notice">
        </el-input>
      </el-form-item>
      <el-form-item label="背景颜色" prop="backgroundColor">
        <div class="color_block">
          <el-input v-model="ruleForm.backgroundColor" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.backgroundColor" defaultColor="rgb(255,248,233)"></colorPicker >
          <!-- <el-button type="text">重置</el-button> -->
        </div>
      </el-form-item>
      <el-form-item label="文字颜色" prop="fontColor">
        <div class="color_block">
          <el-input v-model="ruleForm.fontColor" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.fontColor" defaultColor="rgb(102,102,102)"></colorPicker >
          <!-- <el-button type="text">重置</el-button> -->
        </div>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';;
export default {
  name: 'propertyNotice',
  mixins: [propertyMixin],
  components: {},
  data () {
    return {
      ruleForm: {
        notice: '',//公告文本
        backgroundColor: 'rgb(255,248,233)',//背景颜色 
        fontColor: 'rgb(102,102,102)'//文字颜色 
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
