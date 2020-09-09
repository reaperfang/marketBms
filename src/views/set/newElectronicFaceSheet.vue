<template>
  <div class="new-electronic-faceSheet">
    <div v-if="!$route.query.detail" class="title">{{$route.query.id ? '编辑' : '新建'}}电子面单</div>
    <div class="content">
      <div class="row justify-between">
        <div class="col content-lefter">
          <el-form
            :disabled="!!$route.query.detail"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="147px"
            class="ruleForm"
          >
            <el-form-item label="电子面单名称" prop="name">
              <el-input v-model="ruleForm.name" style="width: 330px;"></el-input>
            </el-form-item>
            <el-form-item label="快递公司" prop="expressCompanyCode">
              <el-select v-model="ruleForm.expressCompanyCode" @change="chooseExpressCompany" style="width: 330px;" placeholder="请选择">
                <el-option
                    v-for="item in expressCompanyList"
                    :key="item.id"
                    :label="item.expressName"
                    :value="item.expressCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="isShowPwa" label="快递公司账号" style="width: 330px;" prop="expressCompanyAccount">
                <el-input v-model="ruleForm.expressCompanyAccount" placeholder="请输入，不超过20个字符"></el-input>
                <el-popover
                    placement="bottom-start"
					width="1000"
                    trigger="click"
                >
                    <!--<p class="p_title">账号说明：</p>
                    <p>快递公司账号即在已选择的快递公司申请的用户ID和密码。</p>-->

                    <p>快递公司支持情况</p>
                    <div style="margin-top: 15px">
                      顺丰速运、EMS、宅急送、圆通速递、百世快递、中通快递、韵达速递、申通快递、德邦快递、优速快递、京东快递、信丰物流、安能快递、国通快递、天天快递、跨越速运、邮政快递包裹、中铁快运、邮政国内标快、远成快运、全一快递、速尔快递、品骏快递。
                    </div>
                    <p style="margin-top: 15px">快运公司支持情况</p>
                    <div style="margin-top: 15px">德邦快运、安能快运、京东快运、龙邦快运。</div>
                    <el-table
                      :data="tableData">
                      <el-table-column
                        property="name"
                        label="账号类型"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        property="company"
                        width="780"
                        label="支持快递公司">
                      </el-table-column>
                    </el-table>

                  <span slot="reference" class="account-explain">查看账号说明</span>
                </el-popover>
            </el-form-item>
            <el-form-item v-if="isShowPwa" style="width: 330px;" label="密码" prop="expressCompanyPassword">
                <el-input show-password v-model="ruleForm.expressCompanyPassword" placeholder="请输入，不超过20个字符"></el-input>
            </el-form-item>
            <el-form-item label="邮费支付" prop="payType">
              <el-select style="width: 330px;" v-model="ruleForm.payType" placeholder="请选择">
                <el-option
                    v-for="item in postagePaymentList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="ruleForm.payType == 3 || ruleForm.payType == 4" label="邮费月结号" prop="monthCode">
              <el-input style="width: 330px;" v-model="ruleForm.monthCode" placeholder="请输入，不超过20个字符"></el-input>
            </el-form-item>
            <el-form-item label="规格尺寸" class="is-required" prop="specificationSize" v-if="isHasSkuSize">
              <el-select style="width: 330px;" v-model="ruleForm.specificationSize" @visible-change="handleOpenVisible" placeholder="请选择">
                <el-option
                  v-for="item in expressElectronicSizeList"
                  :key="item.sizeSpecsTemplateSize"
                  :label="item.sizeSpecsTemplateSize"
                  :value="item.sizeSpecsTemplateSize">
                  </el-option>
              </el-select>
              <p class="error" v-if="!isChooseExpressCompany">请先选定快递公司</p>
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
      const validateSpecificationSize = (rule, value, callback) => {
        // let mobile = /^[1][3578][0-9]{9}$/
        console.log(111)
        // if (!mobile.test(value)) {
          return callback(new Error("格式错误，请重新输入正确的手机号码"));
        // } else {
          callback();
        // }
      };
      const validateExpressCompanyAccount = (rule, value, callback) => {
        if (/^\s*$/.test(value)) {
          return callback(new Error('请输入快递公司账号'));
        }
        return callback();
      };
      const validateExpressCompanyPassword = (rule, value, callback) => {
        if (/^\s*$/.test(value)) {
          return callback(new Error('请输入密码'));
        }
        return callback();
      };
        return {
          popVisible: false,
          isChooseExpressCompany: true, // 是否选择快递公司
          ruleForm: {
              name: '',
              expressCompany: '',
              expressCompanyAccount: '',
              expressCompanyPassword: '',
              expressCompanyCode: '',
              payType: '',
              monthCode: '',
              specificationSize: '' // 规格尺寸
          },
          rules: {
            name: [
              { validator: validatePass, trigger: 'blur' },
            ],
            expressCompanyCode: [
              { required: true, message: '请选择快递公司', trigger: 'change' },
            ],
            specificationSize: [
              { required: true, message: '必填项', trigger: 'change' },
            ],
            payType: [
              { required: true, message: '请选择邮费支付方式', trigger: 'change' },
            ],
            expressCompanyAccount: [
              { required: true, message: '请输入快递公司账号', trigger: 'blur' },
              { validator: validateExpressCompanyAccount, trigger: 'blur' },
              { max: 20, message: '快递公司账号不超过20个字符', trigger: 'blur' }
            ],
            expressCompanyPassword: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { validator: validateExpressCompanyPassword, trigger: 'blur' },
              { max: 20, message: '密码不超过20个字符', trigger: 'blur' }
            ],
            monthCode: [
              { required: true, message: '请输入月结号', trigger: 'blur' },
              // { min: 10, max: 10, message: '月结号为十位数字', trigger: 'blur' }
            ],
          },
          expressCompanyList: [],
          expressElectronicSizeList: [],
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
          ],
          isHasSkuSize: false,
          isShowPwa: false,
          dialogVisible: false,
          tableData: [{
            name: '无需申请直接打单',
            company: '顺丰（SF）、EMS（EMS）（仅支持广东省内发货）、宅急送（ZJS）、邮政快递包裹（YZPY）、中铁快运（ZTKY）、邮政国内标快（YZBK），全一快递（UAPEX）',
          }, {
            name: '月结账号直接打单',
            company: '德邦（DBL）、EMS（EMS）',
          }, {
            name: '快递鸟后台申请账号',
            company: '优速（UC）、韵达（YD）、圆通（YTO）、远成（YCWL）、安能（ANE）、百世快递（HTKY）',
          }, {
            name: '线下（网点）申请账号',
            company: 'EMS（EMS）、中通（ZTO）、申通（STO）、德邦（DBL）、京东（JD）、信丰（XFEX）、国通（GTO）、天天快递（HHTT）、速尔快递（SURE）、品骏快递（PJ）',
          }, {
            name: '快运电子面单',
            company: '京东快运（JDKY）,安能快运（ANEKY）,德邦快运（DBLKY），龙邦快运（LB）。',
          }]
        }
    },
    created() {
      this.getExpressCompanyList()
      // this.getExpressElectronicSize()
      if(this.$route.query.id) {
        this.getDetail()
      }
    },
    methods: {
      handleExpressCompanyCode(val) {
        if (val) {
          this.isChooseExpressCompany = true
          this.ruleForm.specificationSize = ''
          this.getExpressElectronicSize(val)
        }
      },
      handleOpenVisible(val) {
        console.log(val, this.ruleForm.expressCompanyCode)
        if (!val) return false
        if (this.ruleForm.expressCompanyCode) {
          this.isChooseExpressCompany = true
        } else {
          this.isChooseExpressCompany = false
        }
      },
      formateElectronicSize(res) {
        const map = res.map((item) => {
          item.sizeSpecsTemplateSize = `${item.sizeSpecs} ${item.templateSize}`
          return item
        })
        return map
      },
      getExpressElectronicSize(companyCode) {
        this.expressElectronicSizeList = []
        this._apis.order
        .getExpressSpec({ companyCode })
        .then(res => {
          if (res && res.length > 0) {
            this.isHasSkuSize = true
            this.expressElectronicSizeList = this.formateElectronicSize(res)
            if (this.$route.query.id) {
              const obj = this.expressElectronicSizeList.find(item => {
                return item.templateSize === this.ruleForm.specificationSize
              })
              if (obj) this.ruleForm.specificationSize = `${obj.sizeSpecs} ${obj.templateSize}`
            } 
          } else {
            this.isHasSkuSize = false
            this.expressElectronicSizeList = []
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
      },
      handleClose() {
        this.dialogVisible = false
      },
    	// 查询快递公司列表
      getExpressCompanyList() {
        this._apis.order
        .getElectronicFaceSheetExpressCompanyList({isElectronicSingle: 1})
        .then(res => {
          this.expressCompanyList = res
        })
        .catch(error => {
          this.$message.error(error);
        });
      },
      // 切换选择的快递公司
      chooseExpressCompany(val) {
        let expressCompanyCode = this.ruleForm.expressCompanyCode
        let expressCompany = this.expressCompanyList.find(val => val.expressCode == expressCompanyCode)
        console.log(expressCompany);
        if (expressCompany.isClientNumber * 1 === 1) {
          this.isShowPwa = true
        } else {
          this.isShowPwa = false
        }
        this.handleExpressCompanyCode(val)
      },
      editor() {
        let expressCompanyCode = this.ruleForm.expressCompanyCode
        let expressCompany = this.expressCompanyList.find(val => val.expressCode == expressCompanyCode).expressName

        this.ruleForm.expressCompany = expressCompany
        const req = this.getReqData(this.ruleForm)
        this._apis.order
        .editorElectronicFaceSheet(req)
        .then(res => {
          this.$message.success('编辑成功！');
          this.$router.push({path:'/set/ordinaryExpress', query: { currentTab: 'electronicFaceSheet' }});
        })
        .catch(error => {
          this.visible = false;
          this.$message.error(error);
        });
      },
      getReqData(ruleForm) {
        const data = JSON.parse(JSON.stringify(ruleForm))
        if (!this.isShowPwa) {
          data.expressCompanyAccount = ''
          data.expressCompanyPassword = ''
        }
        if (data.payType != 3 && data.payType != 4) {
          data.monthCode = ''
        }
        let arr = data.specificationSize.split(' ')
        data.specificationSize = arr[arr.length - 1]
        console.log('data',data)
        return data
      },
      add() {
        let expressCompanyCode = this.ruleForm.expressCompanyCode
        let expressCompany = this.expressCompanyList.find(val => val.expressCode == expressCompanyCode).expressName

        this.ruleForm.expressCompany = expressCompany
        const req = this.getReqData(this.ruleForm)
        this._apis.order
        .addElectronicFaceSheet(req)
        .then(res => {
          this.$message.success('添加成功！');
           this.$router.push({path:'/set/ordinaryExpress', query: { currentTab: 'electronicFaceSheet' }});
        })
        .catch(error => {
          this.visible = false;
          this.$message.error(error);
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
          if (res.expressCompanyAccount) {
            this.isShowPwa = true
          } else {
            this.isShowPwa = false
          }
          this.ruleForm = Object.assign({}, res)
          this.getExpressElectronicSize(res.expressCompanyCode)
        })
        .catch(error => {
          console.log('error',error)
          this.visible = false;
          this.$message.error(error);
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
    font-weight:500;
    color: #161617;
    margin-bottom: 30px;
  }
  .error {
    font-size:12px;
    font-weight:400;
    color:rgba(253,76,43,1);
  }
  .content {
    .content-lefter {
      width: 50%;
      border-right: 1px solid #cacfcb;
      .account-explain {
        margin-left: -97px;
        margin-top: -14px;
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


