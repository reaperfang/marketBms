<template>
  <DialogBase :visible.sync="visible" :showFooter="showFooter" width="640px" title="申请达达账号">
    <div class="registerDialog">
      <el-form
        ref="ruleForm"
        :rules="rules"
        label-position="right"
        :model="ruleForm"
        label-width="107px"
        class="formBox"
      >
        <el-form-item label="手机号：" prop="mobile">
          <el-input
            v-model="ruleForm.mobile"
            style="width: 360px;"
            placeholder="请输入手机号"
            maxlength="11"
            @input="handleText(ruleForm.mobile, 'mobile', 1)"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <p class="prompt">此手机号将作为达达商户账号的注册手机号，用于登录达达商户后台， 申请提交后，生成的初始化密码会以短信形式发送到注册手机号上。</p>
        </el-form-item>
        <el-form-item label="城市：" prop="cityName">
          <el-select v-model="ruleForm.cityName" placeholder="选择城市" style="width: 360px;">
            <el-option
              v-for="(item,index) in cityList"
              :key="index+item.cityCode"
              :label="item.cityName"
              :value="item.cityName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业全称：" prop="enterpriseName">
          <el-input
            v-model.trim="ruleForm.enterpriseName"
            style="width: 360px;"
            placeholder="请输入企业全称"
            maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item label="企业地址：" prop="enterpriseAddress">
          <el-input
            v-model.trim="ruleForm.enterpriseAddress"
            style="width: 360px;"
            placeholder="请输入企业地址"
            maxlength="400"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名：" prop="contactName">
          <el-input
            v-model.trim="ruleForm.contactName"
            style="width: 360px;"
            placeholder="请输入联系人姓名"
            maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人电话：" prop="contactPhone">
          <el-input
            v-model.number="ruleForm.contactPhone"
            style="width: 360px;"
            placeholder="请输入联系人电话"
            maxlength="11"
          ></el-input>
        </el-form-item>
         <el-form-item label="店铺名称：" prop="shopName">
          <el-input
            v-model.trim="ruleForm.shopName"
            style="width: 360px;"
            placeholder="请输入店铺名称"
            maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址：" prop="email">
          <el-input v-model.trim="ruleForm.email" maxlength="320" style="width: 360px;" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item label="业务类型：" prop="businessType">
          <el-select v-model="ruleForm.businessType" placeholder="请选择业务类型" style="width: 360px;">
            <el-option
              v-for="(item, index) in businessTypeList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
import DialogBase from '@/components/DialogBase';
import { debounce } from '@/utils/base.js'
import th3Deliver from '@/system/constant/th3Deliver.js'

export default {
  data() {
    const emailValidatePass = (rule, value, callback) => {
      const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

      if (!reg.test(value)) {
        return callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    const shopNameValidate = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{1, 30}$/;

      if (!reg.test(value)) {
        return callback(new Error("仅支持英文、汉字和数字，最多输入30个字符"));
      } else {
        callback();
      }
    }
    return {
      showFooter: false,
      ruleForm: {
        mobile: "",
        cityName: "",
        enterpriseName: "",
        enterpriseAddress: "",
        contactName: "",
        contactPhone: "",
        email: "",
        shopName: "",
        businessType: ""
      },
      businessTypeList: th3Deliver.businessTypeList, // 业务类型列表
      rules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9|][0-9]\d{8}$/,
            message: "格式错误，请重新输入",
            trigger: "blur"
          }
        ],
        cityName: [{ required: true, message: "必选项", trigger: "change" }],
        enterpriseName: [
          { required: true, message: "请输入企业全称", trigger: "blur" },
           { min: 1, max: 100, message: "仅支持英文和汉字，最多输入100个字符", trigger: "blur" }
        ],
        enterpriseAddress: [
          { required: true, message: "请输入企业地址", trigger: "blur" },
           { min: 1, max:400, message: "仅支持英文和汉字，最多输入400个字符", trigger: "blur" }
        ],
        contactName: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
           { min: 1, max: 30, message: "仅支持英文和汉字，最多输入30个字符", trigger: "blur" }
        ],
        contactPhone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9|][0-9]\d{8}$/,
            message: "格式错误，请重新输入",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { min: 1, max: 320, message: "格式错误，请重新输入", trigger: "blur" },
          { validator: emailValidatePass, trigger: "blur" }
        ],
        shopName: [
          { required: true, message: "请输入店铺名称", trigger: "blur" },
          { validator: shopNameValidate, trigger: "blur" }
        ],
        businessType: [{ required: true, message: "必选项", trigger: "change" }],
      },
      
      cityList:[],
      _formatText: null
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
    this._formatText = debounce(this.formatText, 200)
    // this.getList();
    this.init()
  },
  methods: {
    init() {
      // 获取省市区
      // 获取店铺信息
      
    },
    onlyNumber(val, key) {
      const reg = /\D+/gi
      this.ruleForm[key] = String(val).replace(reg, '')
      // this.$refs.ruleForm.validateField(key);
    },
    noSpace(val, key) {
      const reg = /\s+/gi
      this.ruleForm[key] = String(val).replace(reg, '')
      // this.$refs.ruleForm.validateField(key);
    },
    formatText(val, key, rule) {
      console.log(rule, typeof rule)
      switch(rule) {
        // 只能输入数字
        case 1 :
          this.onlyNumber(val, key)
          break
        // 不可输入空格
        case 2 :
          this.noSpace(val, key)
          break
      }
    },
    handleText(val,key, rule = 2) {
      this._formatText(val, key, rule)
    },
    //门店列表
    getList() {
      this._apis.set
        .getCityList()
        .then(response => {
          console.log('getList', response)
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
/deep/ .el-dialog {
  border-radius: 3px;
  overflow: hidden;
}
/deep/ .el-dialog__header {
  background: rgba(246,247,250,1);
  padding: 14px 20px;
}
/deep/ .el-dialog__title {
  font-size: 16px;
  font-weight: 500;
  color: #44434B;
}
.registerDialog {
  .formBox {
    height: 416px;
    overflow: auto;
  }
  .prompt {
    font-size: 12px;
    font-weight: 400;
    color: #92929B;
    line-height: 17px;
  }
}
.footer {
  text-align: center;
  margin-top: 40px;
}
</style>


