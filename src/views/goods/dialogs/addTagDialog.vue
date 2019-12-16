<template>
  <DialogBase :visible.sync="visible" title="新增标签" :showFooter="showFooter">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="标签名称：" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
        <p class="description">仅支持展示最多2个字的文本标签</p>
      </el-form-item>
      <el-form-item label="状态：" prop="enable">
        <el-radio v-model="ruleForm.enable" label="1">启用</el-radio>
        <el-radio v-model="ruleForm.enable" label="0">禁用</el-radio>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button @click="submit('ruleForm')" type="primary">保 存</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </DialogBase>
</template>
<script>
import DialogBase from "@/components/DialogBase";

export default {
  data() {
    return {
      showFooter: false,
      ruleForm: {
        name: "",
        enable: ""
      },
      rules: {
        name: [{ required: true, message: "请选择", trigger: "blur" },
        { max: 2, message: '标签最大支持两个字符', trigger: 'blur' }],
        enable: [{ required: true, message: "请选择", trigger: "blur" }]
      }
    };
  },
  created() {
    if(this.data.editor) {
      this.ruleForm.name = this.data.name
      this.ruleForm.enable = this.data.enable + ''
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        if(this.data.editor) {
          this.ruleForm.name = this.data.name
          this.ruleForm.enable = this.data.enable + ''
        }
      }
    }
  },
  methods: {
    add() {
      this._apis.goods
      .addTag(this.ruleForm)
      .then(response => {
        this.$emit("submit");
        this.visible = false;
        this.$notify({
            title: '成功',
            message: '新增成功！',
            type: 'success'
        });
      })
      .catch(error => {
        this.visible = false;
        this.resetForm('ruleForm')
        this.$notify.error({
          title: "错误",
          message: error
        });
      });
    },
    editor() {
      this._apis.goods
      .editorTag(Object.assign({}, this.ruleForm, {id: this.data.id}))
      .then(response => {
        this.$emit("submit");
        this.visible = false;
        this.$notify({
            title: '成功',
            message: '修改成功！',
            type: 'success'
        });
      })
      .catch(error => {
        this.visible = false;
        this.resetForm('ruleForm')
        this.$notify.error({
          title: "错误",
          message: error
        });
      });
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(/\s+/.test(this.ruleForm.name)) {
              this.$message({
                  message: '标签名称不能为空',
                  type: 'warning'
              });
              return
          }
          if(this.data.editor) {
            this.editor()
          } else {
            this.add()
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
    }
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    },
    contentText() {
      return "是否确认删除？";
    }
  },
  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true
    }
  },
  components: {
    DialogBase
  }
};
</script>
<style lang="scss" scoped>
.footer {
  text-align: center;
  margin-top: 47px;
}
/deep/ .el-input {
  width: auto;
}
</style>


