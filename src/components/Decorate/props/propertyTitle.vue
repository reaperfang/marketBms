<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
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
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions">
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
        v-if="!ruleForm.linkTo"
        type="text"
        @click="dialogVisible=true; currentDialog='dialogSelectJumpPage'">选择跳转到的页面</el-button>
        <div class="link_overview clearFix" v-if="ruleForm.linkTo">
          <div class="cont l">
            <span class="l" :title="ruleForm.linkTo.typeName + '-' + (ruleForm.linkTo.data.title || ruleForm.linkTo.data.name)">{{ruleForm.linkTo.typeName + ' | ' + (ruleForm.linkTo.data.title || ruleForm.linkTo.data.name)}}</span>
            <i @click="removeLink"></i>
          </div>
          <span class="modify r" @click="dialogVisible=true; currentDialog='dialogSelectJumpPage'">修改</span>
        </div>
      </el-form-item>
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @seletedPage="seletedPage"></component>
  </el-form>
</template>

<script>
import mixinPropsBase from '../mixins/mixinPropsBase';
import dialogSelectJumpPage from '@/views/shop/dialogs/decorateDialogs/dialogSelectJumpPage';
export default {
  name: 'propertyTitle',
  mixins: [mixinPropsBase],
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
      pickerOptions: {
          disabledDate: (time) => {
              return time.getTime() > Date.now();
          }
      }
    }
  },
  watch: {
    'ruleForm.date'(newValue) {
      if(new Date(newValue) > Date.now()) {
        this.ruleForm.date = this.utils.formatDate(Date.now(), "yyyy-MM-dd hh:mm:ss")
      }
    }
  },
  methods: {

    /* 弹窗选中了跳转链接 */
    seletedPage(linkTo) {
      this.ruleForm.linkTo = linkTo;
    },

    /* 移除链接 */
    removeLink() {
      this.$set(this.ruleForm, 'linkTo', null)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.m-colorPicker .box.open {
    z-index: 10!important;
}
</style>
