<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" :style="bodyHeight">
    <div class="block form">
      <el-form-item label="标题名" prop="mainTitle">
        <el-input placeholder="请输入标题" v-model="ruleForm.mainTitle"></el-input>
      </el-form-item>
      <el-form-item label="标题模板" prop="titleTemplate">
        <el-radio-group v-model="ruleForm.titleTemplate">
          <el-radio :label="1">传统样式</el-radio>
          <el-radio :label="2">模仿微信图文页样式</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="显示位置" prop="displayPosition">
        <el-radio-group v-model="ruleForm.displayPosition">
          <el-radio :label="1">居左显示</el-radio>
          <el-radio :label="2">居中显示</el-radio>
          <el-radio :label="3">居右显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="副标题" prop="subTitle" v-if="ruleForm.titleTemplate === 1">
        <el-input placeholder="请输入标题" v-model="ruleForm.subTitle"></el-input>
      </el-form-item>
      <el-form-item label="背景颜色" prop="backgroundColor" v-if="ruleForm.titleTemplate === 1">
        <div class="color_block">
          <el-input v-model="ruleForm.backgroundColor" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.backgroundColor" defaultColor="#ffffff"></colorPicker >
          <!-- <el-button type="text">重置</el-button> -->
        </div>
      </el-form-item>
      <el-form-item label="日期" prop="date" v-if="ruleForm.titleTemplate === 2">
        <el-date-picker
          v-model="ruleForm.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="作者" prop="author" v-if="ruleForm.titleTemplate === 2">
        <el-input placeholder="请输入作者" v-model="ruleForm.author"></el-input>
      </el-form-item>
      <!-- <el-form-item label="">
        <el-button type="primary" plain>添加一个文本导航</el-button>
      </el-form-item> -->
      <el-form-item label="导航名称" prop="navName">
        <el-input placeholder="请输入名称" v-model="ruleForm.navName"></el-input>
      </el-form-item>
       <el-form-item label="跳转链接" prop="linkTo">
        <el-button 
        type="text" 
        @click="dialogVisible=true; currentDialog='dialogSelectJumpPage'" 
        :title="ruleForm.linkTo ? ruleForm.linkTo.typeName + '-' +  (ruleForm.linkTo.data.title || ruleForm.linkTo.data.name) : '选择跳转到的页面'">
        {{ruleForm.linkTo ? ruleForm.linkTo.typeName + '-' +  (ruleForm.linkTo.data.title || ruleForm.linkTo.data.name) : '选择跳转到的页面'}}
        </el-button>
      </el-form-item>
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @seletedPage="seletedPage"></component>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';
import dialogSelectJumpPage from '@/views/shop/dialogs/dialogSelectJumpPage';
export default {
  name: 'propertyTitle',
  mixins: [propertyMixin],
  components: {dialogSelectJumpPage},
  data () {
    return {
      ruleForm: {
        mainTitle: '',//标题名
        titleTemplate: 1,//标题模板
        displayPosition: 1,//显示位置
        subTitle: '',//副标题
        backgroundColor: '#ffffff',//背景颜色
        navName: '',//导航名称
        linkTo: null,//链接到
        author: '',//作者
        date: ''//时间
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
