<template>
   <div class="address" v-if="renderComponent">
     <h2>地址管理/{{ setTitle }}</h2>
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
        <el-form-item label="地址类型" prop="type" class="is-required">
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
    const validateType = (rule, value, callback) => {
      if(this.hasChecked(1) || this.hasChecked(2)) return callback();
      return callback(new Error("必选项"));
    };
    return {
      isMapChoose: false,
      isLoading: false,
      isDisabled: false,
      renderComponent: true, // 初始化渲染组件
      ruleForm: {
        id: null,
        contactPerson: null, // 联系人
        mobile: null, // 手机号
        sendAddress: '', // 联系地址
        address: null, // 详细地址
        type: [], // 地址类型
        lat: null,
        lng: null,
        addressCode: [], // code码
        province: '', // 省
        city: '', // 市
        area: '', // 区
        isBindShopsend: 0,
        isBindThirdsend: 0
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
        address: [
          { required: true, message: "详细地址不能为空", trigger: "blur" }
        ],
        type: [
          // { type: 'array', required: true, message: '必选项', trigger: 'change' }
          { validator: validateType, trigger: "change"}
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
      // console.log(curr)
    }
  },

  created() {},

  mounted() {
    this.init()
	  // console.log(this.$route.query.orderType)
	  if (this.$route.query.orderType == 1) {
		  this.ruleForm.type = [1]
		  this.isDisabled = true
	  }
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
      this.ruleForm.province = data.provinceName || ''
      this.ruleForm.city = data.cityName || ''
      this.ruleForm.area = data.areaName || ''
      this.ruleForm.isBindShopsend = data.isBindShopsend
      this.ruleForm.isBindThirdsend = data.isBindThirdsend
    },
    init() {
      this.ruleForm.id = this.$route.query && this.$route.query.id
      this.isDisabled = this.$route.query && +this.$route.query.source === 1 ? true : false
      if (this.ruleForm.id) {
        this.getAddressById(this.ruleForm.id)
      }
      // 如果没有id 则为新建，如果商家配送页面点击新建跳转过来，需要默认选中发货地址
      if (this.isDisabled && !this.ruleForm.id) {
        this.ruleForm.type.push(1)
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
        obj.province_name = data.province || ''  // 省名称
        obj.province_code = data.addressCode[0] || ''// 省编码
        obj.city_name = data.city || '' // 市名称
        obj.city_code = data.addressCode[1] || '' // 市编码
        obj.area_name = data.area || '' // 地区名称
        obj.area_code = data.addressCode[2] || '' // 地区码
        obj.longitude = data.lng // 经度
        obj.latitude = data.lat // 纬度
        obj.address_type = data.type // 地址类型0:发货地址 1:退货地址 2:发货退货地址
        obj.is_defalt_sender_address = data.defaultDeliveryAddress
        obj.is_defalt_return_address = data.defaultReturnAddress
        obj.address = data.sendAddress
        obj.address_detail = data.address
        obj.isBindShopsend = data.isBindShopsend
        obj.isBindThirdsend = data.isBindThirdsend
      }
      return obj
    },
    getReqData() {
      const data = JSON.parse(JSON.stringify(this.ruleForm))
      // 处理地址类型
      const obj = this.formateAddressType()
      delete data.type
      // 同城配送默认地址逻辑变更
      const source = this.$route.query && +this.$route.query.source // 来源是否为同城配送
      const sourceType = this.$route.query && this.$route.query.sourceType // 1 商家配送 2 三方配送
      // 如果选择发货地址
      if (obj.type === 0 || obj.type === 2) {
        data.isBindShopsend = +source === 1 && +sourceType === 1 ? 1 : this.ruleForm.isBindShopsend
        data.isBindThirdsend = +source === 1 && +sourceType === 2 ? 1 : this.ruleForm.isBindThirdsend
      } else {
        data.isBindShopsend = 0
        data.isBindThirdsend = 0
      }
     

      return { ...data, ...obj }
    },
    hasChecked(val) {
      return this.ruleForm.type.includes(val)
    },
    // 处理保存成功的逻辑
    handleSaveSuccess() {
      const html = '<span class="sucess">保存成功！</span>'
      this.confirm({
        title: '', 
        iconSuccess: true, 
        text: html,
        customClass: 'setting-custom',
        confirmText: '返回地址列表',
        cancelButtonText: '继续新建地址'
      }).then(() => {
        this.$router.push({ path: '/set/address' })
      }).catch(()=> {
        this.$router.push({ path: '/set/addressUpdate' })
        location.reload()

      });
    },
    // 处理数据重复问题
    handleDataRepeatErr(id) {
      this.confirm({
        title: "",
        iconWarning: true,
        text: '地址信息重复，点击可直接查看或编辑已创建的地址信息。',
        confirmText: '查看',
        showCancelButton: false
      }).then(() => {
        this.$router.push({ path: '/set/addressUpdate', query: { id } })
      });
    },
    // 是否弹出更新商家配送
    isNotUpdateMerchantAddress(res) {
      // 当前地址是否保存默认发货地址
      // 原地址是否为默认发货地址
      //同城配送发货地址为默认地址
      const oldIsTrue = res && ((res.addressType === 0 || res.addressType === 2) && res.isDefaltSenderAddress === 1)
      const newIsTrue = this.hasChecked(3) && this.hasChecked(1)
      // console.log('---newIsTrue, oldIsTrue--',newIsTrue, oldIsTrue)
      // 同城配送发货地址不为默认地址
      const oldIsTrue1 = res && ((res.addressType === 0 || res.addressType === 2) && res.isDefaltSenderAddress === 0)
      const newIsTrue1 = this.hasChecked(1)
      return !((oldIsTrue && newIsTrue) || (oldIsTrue1 && newIsTrue1))
    },
    // 达达是否覆盖
    isDaDaCoveredArea(params) {
      const req = {
        // cid: this.cid,
        // cityCode: this.cityCode,
        // areaCode: this.areaCode,
        ...params,
        thirdType: 1 // 达达
      }
      return this._apis.set.isDaDaCoveredArea(req)
    },
    // 处理达达没有覆盖的逻辑
    handleNoDaDaCoveredArea(){
      this.confirm({
        title: '', 
        iconWarning: true, 
        text: '非常抱歉，发货地所在的城市尚未开通达达同城配送，暂无法使用，敬请期待。',
        confirmText: '我知道了',
        customClass: 'setting-custom',
        showCancelButton: false
      });
    },
    updateStoreInfo() {
      let req = this.getReqData()
      // console.log('req',req)
      req = this.formateReqData(req)
      const data = {
        cid: req.cid,
        cityName: req.city_name,
        cityCode: req.city_code,
        areaName: req.area_name,
        areaCode: req.area_code,
        stationAddress: (req.address || req.address_detail) ?  `${req.address} ${req.address_detail}` : '',
        lng: req.longitude,
        lat: req.latitude,
        thirdType: 1,
        contactName: req.name,
        phone: req.mobile
      }
      return this._apis.set.updateStore(data)
    },
    // 处理达达已经覆盖的逻辑
    handleHasDaDaCoveredArea() {
      // const p1 = this.saveAddress()
      // const p2 = this.updateStoreInfo()
      this.updateStoreInfo().then(() => {
        this.saveAddress()
      }).catch((err) => {
        console.error('err',err)
        this.isLoading = false
        this.$message.error(err || '保存失败')
      }).finally(() => {
      })
    },
    // 处理开启商家配送提醒 status 1 商家配送 2 三方配送
    hanldeIsOpenDelivery(res, status) {
      // 么有发货地址的情况???
      // if (!res) {
      //   this.confirm({
      //     title: "",
      //     iconWarning: true,
      //     text: '保存后，此地址将成为同城配送的发货地址，同城配送规则将以最新发货地址为准，您确定要保存吗？',
      //     confirmText: '确定',
      //     showCancelButton: true,
      //     customClass: 'address-update'
      //   }).then(() => {
      //     this.saveAddress()
      //   }).catch(() => {
      //     this.isLoading = false
      //   });
      //   return false
      // }
      let req = this.getReqData()
      req = this.formateReqData(req)
      const isTrue = (req.id === res.id)
      || (status === 1 && req.isBindShopsend === 1)
      || (status === 1 && req.isDefaltSenderAddress === 1 && res.isBindShopsend !== 1)
      || (status === 1 && res.isDefaltSenderAddress !== 1 && res.isBindShopsend !== 1)
      || (status === 2 && req.isBindThirdsend === 1)
      || (status === 2 && req.isDefaltSenderAddress === 1 && res.isBindThirdsend !== 1)
      || (status === 2 && res.isDefaltSenderAddress !== 1 && res.isBindThirdsend !== 1)

      if (isTrue) {
        this.confirm({
          title: "",
          iconWarning: true,
          text: '保存后，此地址将成为同城配送的发货地址，同城配送规则将以最新发货地址为准，您确定要保存吗？',
          confirmText: '确定',
          showCancelButton: true,
          customClass: 'address-update'
        }).then(() => {
          // console.log('res', status)
          if (status === 2) {
            const params = {
              cid: req.cid,
              cityCode: req.city_code,
              areaCode: req.area_code
            }
            this.isDaDaCoveredArea(params).then(() => {
              this.handleHasDaDaCoveredArea()
            }).catch(() => {
              this.isLoading = false
              this.handleNoDaDaCoveredArea()
            })
          } else if (status === 1) {
            this.saveAddress()
          }
        }).catch(() => {
          this.isLoading = false
        });
        return false
      }
      // // 是否最新地址
      this.saveAddress()
    },
    // 是否开启同城配送
    isOpenCityDeliver() {
      const id = this.cid
      return new Promise((resolve, reject) => {
        this._apis.set.getShopInfo({ id }).then(res => {
          // console.log("----",res)
          const isOpenMerchantDeliver = res && res.isOpenMerchantDeliver === 1 ? true : false // 是否开启商家配送 0-否 1-是
          const isOpenTh3Deliver = res && res.isOpenTh3Deliver === 1 ? true : false // 是否开启三方配送 0-否 1-是
          resolve({ isOpenMerchantDeliver, isOpenTh3Deliver })
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 是否开启商家配送
    isOpenMerchantDeliver() {
      const id = this.cid
      return new Promise((resolve, reject) => {
        this._apis.set.getShopInfo({ id }).then(res => {
          // console.log("----",res)
          const isOpenMerchantDeliver = res && res.isOpenMerchantDeliver === 1 ? true : false // 是否开启商家配送 0-否 1-是
          resolve(isOpenMerchantDeliver)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 数据保存之后的处理逻辑
    handleAfterSave(res) {
      // console.log(res)
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
      // console.log('req',req)
      req = this.formateReqData(req)
      // console.log('req',req.id)
      let p1
      if (req.id) {
        p1 = this._apis.set.editAddressById(req)
      } else {
        p1 = this._apis.set.addAddress(req)
      }
      return p1.then((res) => {
        const status = Object.create(null)
        // console.log('res', res)
        if (res) {
          status.code = 1
          status.id = res.id
        } else {
          status.code = 0
        }
        this.handleAfterSave(status)
      }).catch((err) => {
        // console.log(1111111)
        console.error(err)

        this.$message.error(err || '保存失败')
      }).finally(() => {
        this.isLoading = false
      })
      // 保存后

      // this.handleAfterSave(res)
    },
    // 获取商家配送地址
    getMerchantDeliverAddressById(id) {
      return new Promise((resolve, reject) => {
        this._apis.set.getAddressDefaultSender({ isBindShopsend: 1 }).then((response) => {
          resolve(response)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    // 获取三方配送发货地址
    getTh3DeliverAddressById() {
      return new Promise((resolve, reject) => {
        this._apis.set.getAddressDefaultSender({ isBindThirdsend: 1 }).then((response) => {
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
          const p1 = this.isOpenCityDeliver()
          const p2 = this.getMerchantDeliverAddressById() // 获取商家配送默认地址
          const p3 = this.getTh3DeliverAddressById() // 获取三方配送默认地址
          Promise.all([p1, p2, p3]).then((result) => {
            // console.log('--onSubmit:result--',result)
            const [{ isOpenMerchantDeliver, isOpenTh3Deliver }, res1, res2] = result
            // 是否打开同城配送
            if (isOpenTh3Deliver) {
              this.hanldeIsOpenDelivery(res2, 2)
            } else if (isOpenMerchantDeliver) {
              this.hanldeIsOpenDelivery(res1, 1)
            } else {
              this.saveAddress()
            }
          }).catch((err) => {
            console.error('err',err)
            this.$message.error(err || '保存失败')
            this.isLoading = false
          })
        } else {
          console.error('error submit!!');
          return false;
        }
      });
    },
    handleChangeAddress() {
      this.isMapChoose = false
    },
    getMapClickPoi(poi) {
      // console.log('poi----getMapClickPoi', poi)
      if (!poi) {
        return false
      }
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
