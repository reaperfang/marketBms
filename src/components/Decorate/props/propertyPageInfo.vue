<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
    <div class="block form">
      <el-form-item label="页面名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入页面名称" @blur="changeValidate"></el-input>
      </el-form-item>
      <el-form-item label="页面标题" prop="title">
        <el-input v-model="ruleForm.title" placeholder="请输入页面标题" @blur="changeValidate"></el-input>
      </el-form-item>
      <el-form-item label="页面描述" prop="explain">
        <el-input v-model="ruleForm.explain" placeholder="请输入页面描述" @blur="changeValidate" type="textarea" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="页面分类" prop="pageCategoryInfoId">
        <el-select v-if="classifyList.length" v-model="ruleForm.pageCategoryInfoId" placeholder="请选择分类">
          <el-option v-for="(item, key) of classifyList" :key="key" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <span v-else style="color:#ccc">未获取到页面分类,默认未分类</span>
      </el-form-item>
      <el-form-item label="背景颜色" prop="colorStyle">
        <div class="color_block">
          <el-input v-model="ruleForm.colorStyle" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.colorStyle" defaultColor="#fff"></colorPicker >
        </div>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import mixinPropsBase from '../mixins/mixinPropsBase';
export default {
  name: 'propertyPageInfo',
  mixins: [mixinPropsBase],
  components: {},
  data () {
    return {
      classifyList: [],
      ruleForm: {
        name: '',
        title: '',
        explain: '',
        pageCategoryInfoId: '-1',
        colorStyle: '#ffffff',
        pageKey: '',
        status: 0,
        vError: false,
        pageTemplateId: '-1'
      },
      errorMessage: '请填写基础信息后重试',
      rules: {
        name: [
          { required: true, message: "请输入内容", trigger: "blur", validator: this.utils.ruleValidator.validateRequired },
          {
            min: 1,
            max: 10,
            message: "要求1~10个字符",
            trigger: "blur",
            validator: this.utils.ruleValidator.validateMax
          }
        ],
        title: [
          { required: true, message: "请输入内容", trigger: "blur", validator: this.utils.ruleValidator.validateRequired },
          {
            min: 1,
            max: 10,
            message: "要求1~10个字符",
            trigger: "blur",
            validator: this.utils.ruleValidator.validateMax
          }
        ],
        explain: [
          { required: true, message: "请输入内容", trigger: "blur", validator: this.utils.ruleValidator.validateRequired },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
            validator: this.utils.ruleValidator.validateMax
          }
        ],
        pageCategoryInfoId: [
          { required: true, message: "请输入内容", trigger: "change" }
        ],
        colorStyle: [
          { required: true, message: "请输入内容", trigger: "change" }
        ],
      },
    }
  },
  created() {
    this.$set(this.ruleForm, 'pageCategoryInfoId', this.ruleForm.pageCategoryInfoId || '-1');
    this.$set(this.ruleForm, 'colorStyle', this.ruleForm.colorStyle || '#ffffff');
    this.getClassifyList();
  },
  watch: {
    'ruleForm.pageCategoryInfoId': {
      handler(newValue) {
        this.changeValidate();
      },
      deep: true
    },
    'ruleForm.colorStyle': {
      handler(newValue) {
        this.changeValidate();
      },
      deep: true
    }
  },
  methods: {
    //获取分类列表
    getClassifyList() {
      this._apis.shop.selectAllClassify({}).then((response)=>{
        this.classifyList = response;
        // this.ruleForm.pageCategoryInfoId = response[0].id;
      }).catch((error)=>{
        this.$message({ message: error, type: 'error' });
      });
    },

    // 值改变
    changeValidate(value) {
      let self = this;
      this.$refs.ruleForm.validate( valid => {
        self.ruleForm.vError = !valid;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.m-colorPicker .box.open {
    z-index: 10!important;
}
</style>
