<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
    <div class="block form">
      <el-form-item label="公告" prop="notice">
        <el-input
          type="textarea"
          :rows="2"
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
import mixinPropsBase from '../mixins/mixinPropsBase';;
export default {
  name: 'propertyNotice',
  mixins: [mixinPropsBase],
  components: {},
  data () {
    return {
      ruleForm: {
        notice: '',//公告文本
        backgroundColor: 'rgba(255,229,202,0.4)',//背景颜色 
        fontColor: 'rgba(51,51,51,1)'//文字颜色 
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
