<template>
   <div class="address">
     <h2>地址库/{{ setTitle }}</h2>
     <el-form class="ruleForm" ref="ruleForm" :model="ruleForm" :rules="rules" label-width="102px">
       <div class="form-area">
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="ruleForm.contactPerson" style="width:200px;" placeholder="请输入联系人姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input v-model="ruleForm.mobile" style="width:200px;" placeholder="请输入联系人手机号"></el-input>
        </el-form-item>
        <el-form-item label="联系地址:" prop="sendAddress">
          <el-input v-model="ruleForm.sendAddress" @change="handleChangeAddress" style="width:360px;" placeholder="请输入并点击搜索地图确定详细地址" />
          <DialogMapSearch @getMapClickPoi="getMapClickPoi" :sendAddress="ruleForm.sendAddress"></DialogMapSearch>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="ruleForm.address"
            style="width:360px;" 
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="地址类型" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <div class="address-group">
              <el-checkbox class="address-item" :disabled="isDisabled" :label="1" name="type">发货地址</el-checkbox>
              <el-checkbox class="address-item" v-if="isDelivery" :label="3">默认发货地址</el-checkbox>
            </div>
            <div class="address-group">
              <el-checkbox class="address-item" :label="2" name="type">退货地址</el-checkbox>
              <el-checkbox class="address-item"  v-if="isReturn" :label="4">默认退货地址</el-checkbox>
            </div>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <div class="btn-area">
        <el-button
          type="primary"
          class="submit"
          :loading="isLoading"
          @click="onSubmit('ruleForm')"
        >保 存</el-button>
      </div>
     </el-form>
   </div>
</template>

<script>
import DialogMapSearch from '@/components/mapSearchDialog'
export default {
  components: {
    DialogMapSearch
  },

  data () {
    const validateContactPerson = (rule, value, callback) => {
      let reg = /^[\u4e00-\u9fa5a-zA-Z]{1,20}$/gi;
      // console.log('---reg--',reg.test(value))
      if (!reg.test(value)) {
        return callback(new Error("仅支持输入中英文字符，不能超过20个字符。"));
      } else {
        callback();
      }
    };
    const validateMobile = (rule, value, callback) => {
      let mobile = /^[1][3578][0-9]{9}$/
      if (!mobile.test(value)) {
        return callback(new Error("格式错误，请重新输入正确的手机号码"));
      } else {
        callback();
      }
    };
    return {
      isMapChoose: false,
      isLoading: false,
      isDisabled: false,
      ruleForm: {
        id: null,
        contactPerson: null, // 联系人
        mobile: null, // 手机号
        sendAddress: '', // 联系地址
        address: null, // 详细地址
        type: [], // 地址类型
        lat: null,
        lng: null,
        addressCode: null, // code码
        province: null, // 省
        city: null, // 市
        area: null // 区
      },
      rules: {
        contactPerson: [
          { required: true, message: "必填项", trigger: "blur" },
          { validator: validateContactPerson, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "必填项", trigger: "blur" },
          { validator: validateMobile, trigger: "blur"}
        ],
        sendAddress: [
          { required: true, message: "联系地址不能为空，请输入后点击搜索地图，在地图上选择准确位置", trigger: "blur" }
        ],
        type: [
          { type: 'array', required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },

  computed: {
    isDelivery() {
      return this.hasChecked(1)
    },
    isReturn() {
      return this.hasChecked(2)
    },
    setTitle() {
      return this.ruleForm.id ? '编辑地址' : '新建地址'
    },
    cid(){
      let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
      return shopInfo.id
    },
  },

  watch: {
    '$route'(curr) {
      console.log(curr)
    }
  },

  created() {},

  mounted() {
    this.init()
  },

  methods: {
    getAddressById(id) {
      id = +id
      this._apis.set.getAddressDetail({ id }).then((res)=> {
        this.handleEchoData(res)
      }).catch((err) => {
        this.$message.error(err || '获取数据失败')
      })
    },
    // 处理编辑时，回显数据
    handleEchoData(data) {
      if (!data) return
      this.isMapChoose = true
      this.ruleForm.contactPerson = data.name || null
      this.ruleForm.mobile = data.mobile || null
      this.ruleForm.sendAddress = data.address || ''
      this.ruleForm.address = data.addressDetail || null
      this.ruleForm.type = this.formateEchoAddressType({
        type: data.addressType, // 后端返回数据  0 发货地址 1 退货地址 2 发货地址、退货地址都选中
        defaultDeliveryAddress: data.isDefaltSenderAddress,
        defaultReturnAddress: data.isDefaltReturnAddress
      })
      this.ruleForm.lat = data.latitude || null
      this.ruleForm.lng = data.longitude || null
      this.ruleForm.addressCode =  [data.provinceCode, data.cityCode, data.areaCode] || []
      this.ruleForm.province = data.provinceName || null
      this.ruleForm.city = data.cityName || null
      this.ruleForm.area = data.areaName || null
    },
    init() {
      this.ruleForm.id = this.$route.query && this.$route.query.id
      this.isDisabled = this.$route.query && this.$route.query.source === 1 ? true : false
      if (this.ruleForm.id) {
        this.getAddressById(this.ruleForm.id)
      } else {
        this.ruleForm.type.push(1) // 1为勾选发货地址
      }
    },
    // 格式化回显地址类型数据
    formateEchoAddressType({ type, defaultDeliveryAddress, defaultReturnAddress }) {
      const arr = []
      if (type === 2) {
        arr.push(1, 2)
        defaultDeliveryAddress && arr.push(3)
        defaultReturnAddress && arr.push(4)
        return arr
      }
      if (type === 0) {
        arr.push(1)
        defaultDeliveryAddress && arr.push(3)
        return arr
      }
      if (type === 1) {
        arr.push(2)
        defaultReturnAddress && arr.push(4)
        return arr
      }
    },
    // 格式化地址类型数据
    formateAddressType() {
      const defaultDeliveryAddress = 1
      const defaultReturnAddress = 1
      // obj.type 1 发货地址 2 退货地址 3 发货地址、退货地址都选中
      let obj = Object.create(null)
      if (this.hasChecked(1) && this.hasChecked(2)) {
        obj.type = 2
        obj.defaultDeliveryAddress = this.hasChecked(3) ? 1 : 0 // 如果存在 3 则为默认发货地址
        obj.defaultReturnAddress = this.hasChecked(4) ? 1 : 0 // 如果存在 4 则为默认收货地址
        return obj
      }
      if (this.hasChecked(1)) {
        obj.type = 0
        obj.defaultDeliveryAddress = this.hasChecked(3) ? 1 : 0
        return obj
      }
      if (this.hasChecked(2)) {
        obj.type = 1
        obj.defaultReturnAddress = this.hasChecked(4) ? 1 : 0
        return obj
      }
    },
    // 格式化请求数据
    formateReqData(data) {
      const obj = Object.create(null)
      if (data) {
        obj.cid = this.cid
        obj.id = data.id || null
        obj.name = data.contactPerson // 联系人姓名
        obj.mobile = data.mobile // 联系人电话
        obj.province_name = data.province  // 省名称
        obj.province_code = data.addressCode[0]// 省编码
        obj.city_name = data.city // 市名称
        obj.city_code = data.addressCode[1] // 市编码
        obj.area_name = data.area // 地区名称
        obj.area_code = data.addressCode[1] // 地区码
        obj.longitude = data.lng // 经度
        obj.latitude = data.lat // 纬度
        obj.address_type = data.type // 地址类型0:发货地址 1:退货地址 2:发货退货地址
        obj.is_defalt_sender_address = data.defaultDeliveryAddress
        obj.is_defalt_return_address = data.defaultReturnAddress
        obj.address = data.sendAddress
        obj.address_detail = data.address
      }
      return obj
    },
    getReqData() {
      const data = JSON.parse(JSON.stringify(this.ruleForm))
      // 处理地址类型
      const type = this.formateAddressType()
      delete data.type
      return { ...data, ...type }
    },
    hasChecked(val) {
      return this.ruleForm.type.includes(val)
    },
    // 处理保存成功的逻辑
    handleSaveSuccess() {
      this.confirm({
        title: "提示",
        iconSuccess: true,
        text: '保存成功',
        confirmText: '返回地址列表',
        cancelButtonText: '继续新建地址'
      }).then(() => {
        this.$router.push({ path: '/set/address' })
      }).catch(()=> {
        this.$router.push({ path: '/set/addressUpdate' })
      });
    },
    // 处理数据重复问题
    handleDataRepeatErr(id) {
      this.confirm({
        title: "提示",
        iconWarning: true,
        text: '地址信息重复，点击可直接查看或编辑已创建的地址信息。',
        confirmText: '查看'
      }).then(() => {
        this.$router.push({ path: '/set/addressUpdate', query: { id } })
      });
    },
    // 是否弹出更新商家配送
    isNotUpdateMerchantAddress(res) {
      // 当前地址是否保存默认发货地址
      // 原地址是否为默认发货地址
      const oldIsTrue = res && res.isDefaltSenderAddress
      const newIsTrue = this.ruleForm.type.includes(3)
      
      return oldIsTrue && !newIsTrue
    },
    // 处理开启商家配送提醒
    hanldeIsOpenDelivery(res) {
      // 是否是默认发货地址，如果是，并且 当前地址不是设置为默认发货地址，则 不提示，其他都提示
        // merchantDeliver 商家配送地址
        // res && res.isDefaltSenderAddress && (res.addressType === 0 || res.addressType === 2)  && (this.ruleForm.type === 1 || this.ruleForm.type === 2)
      if (!this.isNotUpdateMerchantAddress(res)) {
        this.confirm({
          title: "提示",
          iconWarning: true,
          text: '保存后，此地址将成为商家配送的发货地址，商家配送规则将以最新发货地址为准，您确定要保存吗？',
          confirmText: '确定',
          showCancelButton: true,
          customClass: 'address-update'
        }).then(() => {
          this.saveAddress()
        }).catch(() => {
          this.isLoading = false
        });
      } else {
        this.saveAddress()
      }
    },
    // 是否开启商家配送
    isOpenMerchantDeliver() {
      const id = this.cid
      return new Promise((resolve, reject) => {
        this._apis.set.getShopInfo({ id }).then(res => {
          console.log("----",res)
          const isOpenMerchantDeliver = res && res.isOpenMerchantDeliver === 1 ? true : false // 是否开启商家配送 0-否 1-是
          resolve(isOpenMerchantDeliver)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 数据保存之后的处理逻辑
    handleAfterSave(res) {
      console.log(res)
      // 数据重复
      if (res.code === 1) {
        this.handleDataRepeatErr(res.id)
        return false
      }
      // 保存成功
      if (res.code === 0) {
        this.handleSaveSuccess()
        return false
      }
    },
    saveAddress() {
      let req = this.getReqData()
      console.log('req',req)
      req = this.formateReqData(req)
      console.log('req',req.id)
      let p1
      if (req.id) {
        p1 = this._apis.set.editAddressById(req)
      } else {
        p1 = this._apis.set.addAddress(req)
      }
      p1.then((res) => {
          const status = Object.create(null)
          console.log('res', res)
          if (res) {
            status.code = 1
            status.id = res.id
          } else {
            status.code = 0
          }
          this.handleAfterSave(status)
        }).catch((err) => {
          console.log(1111111)
          console.log(err)

          this.$message.error(err || '保存失败')
        }).finally(() => {
          this.isLoading = false
        })
      // 保存后
      
      // this.handleAfterSave(res)
    },
    // 判断地址是否为商家配送地址
    getMerchantDeliverAddressById(id) {
      return new Promise((resolve, reject) => {
        this._apis.set.getAddressDefaultSender().then((response) => {
          resolve(response)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.isMapChoose) {
            this.$message.error('保存失败')
            this.ruleForm.sendAddress = ''
            this.$refs.ruleForm.validateField('sendAddress')
            return false
          }
          this.isLoading = true
          const p2 = this.isOpenMerchantDeliver()
          const p1 = this.getMerchantDeliverAddressById() // 获取商家配送默认地址
          Promise.all([p1, p2]).then((result) => {
            console.log(result)
            const [response, isOpen] = result
            // 是否打开
            if (isOpen) {
              this.hanldeIsOpenDelivery(response)
            } else {
              this.saveAddress()
            }
          }).catch((err) => {
            console.log('err',err)
            this.$message.error(err || '保存失败')
            this.isLoading = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleChangeAddress() {
      this.isMapChoose = false
    },
    getMapClickPoi(poi) {
      console.log('poi----getMapClickPoi', poi)
      if (!poi) return false 
      this.ruleForm.sendAddress = poi.address
      this.ruleForm.lat = poi.location.lat
      this.ruleForm.lng = poi.location.lng
      this.isMapChoose = true
      const arr = [poi.provinceCode, poi.cityCode, poi.areaCode]
      this.ruleForm.addressCode = arr;
      this.ruleForm.province = poi.provinceName
      this.ruleForm.city = poi.cityName
      this.ruleForm.area = poi.areaName
      this.$nextTick(() => {
        this.$refs.ruleForm.validateField('sendAddress')
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/.address-update {
  color:red;
}
.address {
  padding: 15px 0 0 20px;
  box-sizing: border-box;
  background-color: #fff;
  h2 {
    font-size: 14px;
    font-weight:500;
    color:rgba(68,67,75,1);
    line-height:20px;
  }
  .ruleForm {
    padding-top:30px;
    .btn-area {
      text-align: center;
      padding-bottom: 50px;
    }
    .address-group {
      .address-item {
        padding-right: 20px;
      }
    }
  }
}
</style>