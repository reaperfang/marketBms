<template>
  <div class="new-electronic-faceSheet">
    <div v-if="!$route.query.detail" class="title">{{$route.query.id ? '编辑' : '新建'}}电子面单</div>
    <div class="content">
      <div class="row justify-between">
        <div class="col content-lefter">
          <el-form
            :disabled="$route.query.detail"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="110px"
            class="ruleForm"
          >
            <el-form-item label="电子面单名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="快递公司" prop="expressCompanyCode">
              <el-select v-model="ruleForm.expressCompanyCode" placeholder="请选择">
                <el-option
                    v-for="item in expressCompanyList"
                    :key="item.id"
                    :label="item.expressName"
                    :value="item.expressCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="快递公司账号" prop="expressCompanyAccount">
                <el-input v-model="ruleForm.expressCompanyAccount" placeholder="请输入，不超过20个字符"></el-input>
                <span v-popover:popover class="account-explain">查看账号说明</span>
                <el-popover
                    ref="popover"
                    placement="right"
                    width="400"
                    v-model="popVisible"
                    trigger="hover"
                >
                    <p class="p_title">账号说明：</p>
                    <p>快递公司账号即在已选择的快递公司申请的客户ID和密码。</p>
                </el-popover>
            </el-form-item>
            <el-form-item label="密码" prop="expressCompanyPassword">
                <el-input show-password v-model="ruleForm.expressCompanyPassword" placeholder="请输入，不超过20个字符"></el-input>
            </el-form-item>
            <el-form-item label="邮费支付" prop="payType">
              <el-select v-model="ruleForm.payType" placeholder="请选择">
                <el-option
                    v-for="item in postagePaymentList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="ruleForm.payType == 3 || ruleForm.payType == 4" label="邮费月结号" prop="monthCode">
              <el-input v-model="ruleForm.monthCode" placeholder="请输入，不超过20个字符"></el-input>
            </el-form-item>
            <el-form-item v-if="!$route.query.detail">
                <el-button @click="$router.go(-1)">取 消</el-button>
                <el-button type="primary" @click="submit('ruleForm')">提 交</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="col content-righter">
            <div class="title">电子面单样例</div>
            <div class="image-box">
                <img src="../../assets/images/order/electronic-face-sheet.png" alt="">
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入电子面单名称'));
        } else if(/^\s*$/.test(value)) {
          callback(new Error('电子面单名称不能为空'));
        } else {
          if(value.length > 20) {
            callback(new Error('电子面单名称不超过20个字符'));
          }
          callback();
        }
      };
        return {
          popVisible: false,
            ruleForm: {
                name: '',
                expressCompany: '',
                expressCompanyAccount: '',
                expressCompanyPassword: '',
                expressCompanyCode: '',
                payType: '',
                monthCode: ''
            },
            rules: {
              name: [
                { validator: validatePass, trigger: 'blur' },
              ],
              expressCompanyCode: [
                { required: true, message: '请选择快递公司', trigger: 'blur' },
              ],
              payType: [
                { required: true, message: '请选择邮费支付方式', trigger: 'blur' },
              ],
              expressCompanyAccount: [
                { required: true, message: '请输入快递公司账号', trigger: 'blur' },
                { max: 20, message: '快递公司账号不超过20个字符', trigger: 'blur' }
              ],
              expressCompanyPassword: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { max: 20, message: '密码不超过20个字符', trigger: 'blur' }
              ],
              monthCode: [
                { required: true, message: '请输入月结号', trigger: 'blur' },
                // { min: 10, max: 10, message: '月结号为十位数字', trigger: 'blur' }
              ],
            },
            expressCompanyList: [],
            postagePaymentList: [
              {
                label: '请选择',
                value: ''
              },
              {
                label: '现付',
                value: 1
              },
              {
                label: '到付',
                value: 2
              },
              {
                label: '月结',
                value: 3
              },
              {
                label: '第三方支付（仅顺丰支持）',
                value: 4
              },
            ]
        }
    },
    created() {
      this.getExpressCompanyList()
      if(this.$route.query.id) {
        this.getDetail()
      }
    },
    methods: {
      getExpressCompanyList() {
        this._apis.order
        .getElectronicFaceSheetExpressCompanyList({isElectronicSingle: 1})
        .then(res => {
          this.expressCompanyList = res
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error
          });
        });
      },
      editor() {
        let expressCompanyCode = this.ruleForm.expressCompanyCode
        let expressCompany = this.expressCompanyList.find(val => val.expressCode == expressCompanyCode).expressName

        this.ruleForm.expressCompany = expressCompany
        this._apis.order
        .editorElectronicFaceSheet(this.ruleForm)
        .then(res => {
          this.$notify({
            title: "成功",
            message: "编辑成功！",
            type: "success"
          });
          this.$router.push('/order/electronicFaceSheet')
        })
        .catch(error => {
          this.visible = false;
          this.$notify.error({
            title: "错误",
            message: error
          });
        });
      },
      add() {
        let expressCompanyCode = this.ruleForm.expressCompanyCode
        let expressCompany = this.expressCompanyList.find(val => val.expressCode == expressCompanyCode).expressName

        this.ruleForm.expressCompany = expressCompany
        this._apis.order
        .addElectronicFaceSheet(this.ruleForm)
        .then(res => {
          this.$notify({
            title: "成功",
            message: "添加成功！",
            type: "success"
          });
          this.$router.push('/order/electronicFaceSheet')
        })
        .catch(error => {
          this.visible = false;
          this.$notify.error({
            title: "错误",
            message: error
          });
        });
      },
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(!this.$route.query.id) {
              this.add()
            } else {
              this.editor()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getDetail() {
        this._apis.order
        .getElectronicFaceSheetDetail({expressCompanyCode: this.$route.query.expressCompanyCode})
        .then(res => {
          console.log(res)
          this.ruleForm = Object.assign({}, res)
        })
        .catch(error => {
          this.visible = false;
          this.$notify.error({
            title: "错误",
            message: error
          });
        });
      }
    }
};
</script>
<style lang="scss">
  .app-main .content-main .new-electronic-faceSheet::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .app-main .content-main .new-electronic-faceSheet::-webkit-scrollbar-thumb {
    border-radius: 10px!important;
    background: rgba(101,94,255,.4)!important;
  }
  .app-main .content-main .new-electronic-faceSheet::-webkit-scrollbar-track {
    border-radius: 0!important;
    background: rgba(101,94,255,.1)!important;
  }
</style>
<style lang="scss" scoped>
.new-electronic-faceSheet {
  background-color: #fff;
  padding: 20px;
  .title {
    font-size: 16px;
    color: #161617;
    margin-bottom: 30px;
  }
  .content {
    .content-lefter {
      width: 50%;
      border-right: 1px solid #cacfcb;
      .account-explain {
        margin-left: -355px;
        margin-top: 18px;
        color: $globalMainColor;
        position: absolute;
        cursor: pointer;
      }
      /deep/ .el-input {
          width: auto;
      }
    }
    .content-righter {
      width: 50%;
      padding-left: 50px;
      .title {
          margin-bottom: 20px;
      }
      .image-box {
          padding-left: 30px;
      }
    }
  }
}
/deep/ label[for="name"]::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}
/deep/ .el-input {
  width: 260px!important;
}
</style>


