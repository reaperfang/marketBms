<template>
  <DialogBase :visible.sync="visible" :showFooter="showFooter" width="750px" title="申请达达账号">
    <div class="content">
      <el-form
        ref="ruleForm"
        :rules="rules"
        label-position="left"
        :model="ruleForm"
        label-width="100px"
        class="formBox"
      >
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model.number="ruleForm.mobile"
            style="width: 410px;"
            placeholder="请输入手机号"
            maxlength="11"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="cityName">
          <el-select v-model="ruleForm.cityName" placeholder="选择城市" style="width: 410px;">
            <el-option
              v-for="(item,index) in cityList"
              :key="index+item.cityCode"
              :label="item.cityName"
              :value="item.cityName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业全称" prop="enterpriseName">
          <el-input
            v-model.trim="ruleForm.enterpriseName"
            style="width: 410px;"
            placeholder="请输入企业全称"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="企业地址" prop="enterpriseAddress">
          <el-input
            v-model.trim="ruleForm.enterpriseAddress"
            style="width: 410px;"
            placeholder="请输入企业地址"
            maxlength="255"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="contactName">
          <el-input
            v-model.trim="ruleForm.contactName"
            style="width: 410px;"
            placeholder="请输入联系人姓名"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" prop="contactPhone">
          <el-input
            v-model.number="ruleForm.contactPhone"
            style="width: 410px;"
            placeholder="请输入联系人电话"
            maxlength="11"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model.trim="ruleForm.email" style="width: 410px;" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button @click="submit('ruleForm')" type="primary">提 交</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
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
        mobile: "",
        cityName: "",
        enterpriseName: "",
        enterpriseAddress: "",
        contactName: "",
        contactPhone: "",
        email: ""
      },
      rules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { type: "number", message: "请输入有效手机号" },
          {
            pattern: /^1[3|4|5|6|7|8|9|][0-9]\d{8}$/,
            message: "请输入有效手机号",
            trigger: "blur"
          }
        ],
        cityName: [{ required: true, message: "请选择城市", trigger: "blur" }],
        enterpriseName: [
          { required: true, message: "请输入企业全称", trigger: "blur" },
           { min: 1, max: 30, message: "最多输入30个字", trigger: "blur" }
        ],
        enterpriseAddress: [
          { required: true, message: "请输入企业地址", trigger: "blur" },
           { min: 1, max:255, message: "最多输入255个字", trigger: "blur" }
        ],
        contactName: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
           { min: 1, max: 20, message: "最多输入30个字", trigger: "blur" }
        ],
        contactPhone: [
          { required: true, message: "请输入联系人电话", trigger: "blur" },
          {
            type: "number",
            message: "请输入有效手机号",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^1[3|4|5|6|7|8|9|][0-9]\d{8}$/,
            message: "请输入有效手机号",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      },
      cityList:[]
    };
  },
  components: {
    DialogBase
  },
  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true
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
    }
  },
  created() {
    this.geteList();
  },
  methods: {
    //门店列表
    geteList() {
      this._apis.set
        .getCityList()
        .then(response => {
          this.cityList=response
        })
        .catch(error => {
          this.loading = false;
        });
    },
    //保存
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
         // this.$emit("submit");
          this.add();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
       if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },
    add() {
      this._apis.set
        .registerUser(this.ruleForm)
        .then(response => {
          console.log("zhuce ", response);
          this.sourceId=response
          this.$message({
            message: "提交成功！",
            type: "success"
          });
         
          this.$emit("submitForm",this.sourceId);
          this.visible = false;
          this.resetForm(this.ruleForm)
        })
        .catch(error => {
         // this.visible = false;
         // this.resetForm("ruleForm");
          this.$message.error({
            message: error,
            type: "error"
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  overflow: auto;
  margin-left: 30px;
}
.footer {
  text-align: center;
  margin-top: 40px;
}
</style>


