<template>
  <DialogBase :visible.sync="visible" :showFooter="showFooter" width="640px" title="申请达达账号">
    <div class="registerDialog">
      <p class="error" v-if="submitPromptMessage" v-html="submitPromptMessage"></p>
      <el-form
        ref="ruleForm"
        :rules="rules"
        label-position="right"
        :model="ruleForm"
        label-width="107px"
        class="formBox"
      >
        <el-form-item label="手机号：" class="item" prop="mobile">
          <el-input
            v-model="ruleForm.mobile"
            style="width: 470px;"
            placeholder="请输入手机号"
            maxlength="11"
            :disabled="isEdit"
            @input="handleText(ruleForm.mobile, 'mobile', 1)"
          ></el-input>
        </el-form-item>
        <el-form-item label="" class="item">
          <p class="prompt">此手机号将作为达达商户账号的注册手机号，用于登录达达商户后台， <br/>申请提交后，生成的初始化密码会以短信形式发送到注册手机号上。</p>
        </el-form-item>
        <el-form-item label="城市：" class="address" required>
          <el-col :span="8">
            <el-form-item prop="provinceCode"  class="item">
              <el-select v-model="ruleForm.provinceCode" @change="handleProvince" placeholder="选择省份" style="width: 150px;" :disabled="isEdit">
                <el-option
                  v-for="(item,index) in provinceList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="cityCode" class="item">
              <el-select v-model="ruleForm.cityCode" @change="handleCity" placeholder="选择城市" style="width: 150px;" :disabled="isEdit">
                <el-option
                  v-for="(item,index) in cityList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="areaCode" class="item">
              <el-select v-model="ruleForm.areaCode" @change="handleArea" placeholder="选择区域" style="width: 150px;" :disabled="isEdit">
                <el-option
                  v-for="(item,index) in areaList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="企业全称：" class="item" prop="enterpriseName">
          <el-input
            v-model.trim="ruleForm.enterpriseName"
            style="width: 470px;"
            placeholder="请输入企业全称"
            maxlength="100"
            :disabled="isEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="企业地址：" class="item" prop="enterpriseAddress">
          <el-input
            v-model.trim="ruleForm.enterpriseAddress"
            style="width: 470px;"
            placeholder="请输入企业地址"
            maxlength="400"
            :disabled="isEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名：" class="item" prop="contactName">
          <el-input
            v-model.trim="ruleForm.contactName"
            style="width: 470px;"
            placeholder="请输入联系人姓名"
            :disabled="isEdit"
            maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人电话：" class="item" prop="contactPhone">
          <el-input
            v-model.number="ruleForm.contactPhone"
            style="width: 470px;"
            placeholder="请输入联系人电话"
            :disabled="isEdit"
            maxlength="11"
          ></el-input>
        </el-form-item>
         <el-form-item label="店铺名称：" class="item" prop="shopName">
          <el-input
            v-model.trim="ruleForm.shopName"
            style="width: 470px;"
            placeholder="请输入店铺名称"
            maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址：" class="item" prop="email">
          <el-input v-model.trim="ruleForm.email" maxlength="320" style="width: 470px;" placeholder="请输入邮箱地址" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="业务类型：" class="item" prop="businessType">
          <el-select v-model="ruleForm.businessType" placeholder="请选择业务类型" style="width: 470px;">
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
        <el-button @click="submit('ruleForm')" :loading="isSubmit" type="primary">提 交</el-button>
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
      const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,30}$/gi;

      if (!reg.test(value)) {
        return callback(new Error("仅支持英文、汉字和数字，最多输入30个字符"));
      } else {
        callback();
      }
    }
    const validateEnterpriseAddress = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,100}$/gi;
      if (!reg.test(value)) {
        return callback(new Error("仅支持英文和汉字，最多输入100个字符"));
      } else {
        callback();
      }
    }
    const validateContactName = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,30}$/gi;
      if (!reg.test(value)) {
        return callback(new Error("仅支持英文和汉字，最多输入30个字符"));
      } else {
        callback();
      }
    }
    return {
      isEdit: false,
      showFooter: false,
      isSubmit: false,
      submitPromptMessage: '',
      ruleForm: {
        id: "",
        mobile: "",
        provinceName: "",
        provinceCode: "",
        cityName: "",
        cityCode: "",
        areaName: "",
        areaCode: "",
        enterpriseName: "",
        enterpriseAddress: "",
        contactName: "",
        contactPhone: "",
        email: "",
        shopName: "",
        businessType: ""
      },
      businessTypeList: th3Deliver.businessTypeList, // 业务类型列表
      provinceList: [],
      rules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9|][0-9]\d{8}$/,
            message: "格式错误，请重新输入",
            trigger: "blur"
          }
        ],
        provinceCode: [{ required: true, message: "必选项", trigger: "change" }],
        cityCode: [{ required: true, message: "必选项", trigger: "change" }],
        areaCode: [{ required: true, message: "必选项", trigger: "change" }],
        enterpriseName: [
          { required: true, message: "请输入企业全称", trigger: "blur" },
           { min: 1, max: 100, message: "仅支持英文和汉字，最多输入100个字符", trigger: "blur" }
        ],
        enterpriseAddress: [
          { required: true, message: "请输入企业地址", trigger: "blur" },
          { validator: validateEnterpriseAddress, trigger: "blur" }
        ],
        contactName: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
          { validator: validateContactName, trigger: "blur" }
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
      _formatText: null
    };
  },
  components: {
    DialogBase
  },
  props: {
    addressInfo: {
      type: Object,
      default() {
        return null
      }
    },
    data: {
      type: Object,
      default() {
        return null
      }
    },
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
    },
    shopName() {
       let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.shopName;
    },
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    },
    cityList() {
      const provinceCode = this.ruleForm.provinceCode
      if (!provinceCode) return []
      const provinceList = this.provinceList
      const province = provinceList.find(item => {
        return +item.code === +provinceCode
      })
      const cityList = province ? province.citys : []
      return cityList
    },
    areaList() {
      const cityCode = this.ruleForm.cityCode
      if (!cityCode) return []
      const cityList = this.cityList
      const city = cityList.find(item => {
        return +item.code === +cityCode
      })
      const areaList = city ? city.areas : []
      return areaList
    }
  },
  created() {
    this._formatText = debounce(this.formatText, 200)
    // this.getList();
    this.init()
  },
  methods: {
    getSubmitPromptMessage(status, err) {
      this.submitPromptMessage = ''
      // 1 达达商户注册失败，达达门店注册失败
      if (status === 1 && err) {
        this.submitPromptMessage = `<i class="el-icon-error" style="font-size:13px;"></i><span style="padding-left:9px;">${err}</span>`
        return false
      }
      // 2 达达商户注册成功，达达门店注册失败
      if (status === 2 && err) {
        this.submitPromptMessage = `<i class="el-icon-error" style="font-size:13px;"></i><span style="padding-left:9px;">${err}</span>`
        return false
      }
      return ''
    },
    handleProvince() {
      this.ruleForm.cityCode = ''
      this.ruleForm.areaCode = ''
      this.setAddressName()
    },
    handleCity() {
      this.ruleForm.areaCode = ''
      this.setAddressName()
    },
    handleArea() {
      this.setAddressName()
    },
    init() {
      // 设置默认店铺名称
      this.ruleForm.shopName = this.shopName
      // 获取省市区
      this.getTh3DeliverDetail()
      // 获取店铺信息
      this.getAddressData().then(() => {
        // 初始化省市区name
        this.setAddressName()
      })
    },
    handleEchoData(res) {
      this.ruleForm.mobile = res.phone || ''
      this.ruleForm.provinceName = res.provinceName || ''
      this.ruleForm.provinceCode = res.provinceCode || ''
      this.ruleForm.cityName = res.cityName || ''
      this.ruleForm.cityCode = res.cityCode || ''
      this.ruleForm.areaName = res.areaName || ''
      this.ruleForm.areaCode = res.areaCode || ''
      this.ruleForm.enterpriseName = res.businessName || ''
      this.ruleForm.enterpriseAddress = res.businessAddress || ''
      this.ruleForm.contactName = res.contactName || ''
      this.ruleForm.contactPhone = res.contactPhone || ''
      this.ruleForm.email = res.email || ''
      this.ruleForm.shopName = res.stationName  || this.ruleForm.shopName
      this.ruleForm.businessType = res.businessType || ''
    },
    getTh3DeliverDetail() {
      if (!this.data) return false
      const req = {
        thirdType: this.data.thirdType
      }
      return this._apis.set
        .getTh3DeliverDetail(req)
        .then(response => {
          console.log('----response-:getTh3DeliverDetail---',response)
          this.handleEchoData(response)
          this.isEdit = true
          return response
        })
        .catch(error => {
          this.$message.error(err)
        });
    },
    setAddressName() {
      if (this.provinceList.length <= 0) return false
      if (!this.ruleForm.provinceCode || !this.ruleForm.cityCode || !this.ruleForm.areaCode) return false
      const province = this.provinceList.find(item => {
        return +item.code === +this.ruleForm.provinceCode
      })
      if (!province) return false
      this.ruleForm.provinceName = province.name
      if (province.citys.length <= 0) return false
      const city = province.citys.find(item => {
        return +item.code === +this.ruleForm.cityCode
      })
      if (!city) return false
      this.ruleForm.cityName = city.name
      const area = city.areas.find(item => {
        return +item.code === +this.ruleForm.areaCode
      })
      if (!area) return false
      this.ruleForm.areaName = area.name
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
    getAddressData() {
      return this._apis.order
        .getArea()
        .then(response => {
          this.provinceList = response
        })
        .catch(error => {
          this.loading = false;
        });
    },
    //保存
    submit(formName) {
      if (this.isSubmit) return false
      this.isSubmit = true
      this.$refs[formName].validate(valid => {
        if (valid) {
         // this.$emit("submit");
        //  if (!this.ruleForm.id) {
           this.add();
        //  } else {
        //    this.edit();
        //  }
          
        } else {
          console.log("error submit!!");
          this.isSubmit = false
          return false;
        }
      });
    },
    resetForm(formName) {
       if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },
    // 格式化商户请求数据
    formatReqRegisterMerchantsData(data) {
      const req = Object.create(null)
      req.cid = this.cid
      req.phone = data.mobile || ''
      req.provinceName = data.provinceName || ''
      req.provinceCode = data.provinceCode || ''
      req.cityName = data.cityName || ''
      req.cityCode = data.cityCode || ''
      req.areaName = data.areaName || ''
      req.areaCode = data.areaCode || ''
      req.businessName = data.enterpriseName || ''
      req.businessAddress = data.enterpriseAddress || ''
      req.contactName = data.contactName || ''
      req.contactPhone = data.contactPhone || ''
      req.email = data.email || ''
      req.thirdType = 1
      return req
    },
    // 获取商户请求数据
    getReqRegisterMerchantsData() {
      let data = JSON.parse(JSON.stringify(this.ruleForm))
      data = this.formatReqRegisterMerchantsData(data)
      return data
    },
    registerMerchants() {
      const req = this.getReqRegisterMerchantsData()
      return this._apis.set.registerMerchants(req)
    },
    formatReqRegisterStoreData(data) {
      const req = Object.create(null)
      req.cid = this.cid
      req.stationName = data.shopName || ''
      // 获取发货地址的
      req.cityName = this.addressInfo.cityName || ''
      req.cityCode = this.addressInfo.cityCode || ''
      req.areaName = this.addressInfo.areaName || ''
      req.areaCode = this.addressInfo.areaCode || ''

      req.stationAddress = `${this.addressInfo.address} ${this.addressInfo.addressDetail}`
      req.lng = this.addressInfo.longitude
      req.lat = this.addressInfo.latitude

      req.businessType = data.businessType || ''
      req.email = data.email || ''
      req.thirdType = 1
      return req
    },
    // 获取门店请求数据
    getReqRegisterStoreData() {
      let data = JSON.parse(JSON.stringify(this.ruleForm))
      data = this.formatReqRegisterStoreData(data)
      return data
    },
    registerStore() {
      const req = this.getReqRegisterStoreData()
      return this._apis.set.registerStore(req)
    },
    add() {
      this.registerMerchants().then((res) => {
        this.registerStore(res).then(() => {
          this.$message({
            message: '注册成功',
            type: 'success'
          });
          this.$emit("submitForm");
          this.visible = false;
          this.resetForm(this.ruleForm)
        }).catch((err) => {
          this.getSubmitPromptMessage(2, err)
          this.isEdit = true
        })
      }).catch(() => {
        this.getSubmitPromptMessage(1, err)
      }).finally(() => {
        // this.visible = false;
        this.isSubmit = false
      })
      // this._apis.set
      //   .registerUser(this.ruleForm)
      //   .then(response => {
      //     console.log("zhuce ", response);
      //     this.sourceId=response
      //     this.$message({
      //       message: "提交成功！",
      //       type: "success"
      //     });
         
      //     this.$emit("submitForm",this.sourceId);
      //     this.visible = false;
      //     this.resetForm(this.ruleForm)
      //   })
      //   .catch(error => {
      //    // this.visible = false;
      //    // this.resetForm("ruleForm");
      //     this.$message.error({
      //       message: error,
      //       type: "error"
      //     });
      //   });
    }
  }
};
</script>
<style lang="scss" scoped>
// /deep/ .el-dialog {
//   border-radius: 3px;
//   overflow: hidden;
// }
// /deep/ .el-dialog__header {
//   background: rgba(246,247,250,1);
//   padding: 14px 20px;
// }
// /deep/ .el-dialog__title {
//   font-size: 16px;
//   font-weight: 500;
//   color: #44434B;
// }
.registerDialog {
  position: relative;
  >.error {
    position: absolute;
    left: -30px;
    top: -30px;
    line-height: 30px;
    width: 640px;
    text-align: center;
    height: 30px;
    background: #FFEDEA;
    color: rgba(253, 76, 43, 1);
    font-size: 12px;
    font-weight: 400;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .formBox {
    height: 416px;
    overflow: auto;
    .item {
      margin-bottom: 20px;
    }
    .address {
      margin-bottom: 0;
    }
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
  margin-top: 30px;
}
</style>


