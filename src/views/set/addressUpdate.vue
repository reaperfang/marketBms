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
              <el-checkbox class="address-item" :label="1" name="type">发货地址</el-checkbox>
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
    }
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
      return {
        id: 1,
        contactPerson: 'bill', // 联系人
        mobile: '15712899623', // 手机号
        sendAddress: '数码庄园', // 联系地址
        address: '', // 详细地址
        type: 3, // 地址类型
        lat: null,
        lng: null,
        addressCode: null, // code码
        province: null, // 省
        city: null, // 市
        area: null, // 区
        defaultDeliveryAddress: 1,
        defaultReturnAddress: 1
      }
    },
    // 处理编辑时，回显数据
    handleEchoData(data) {
      if (!data) return
      this.isMapChoose = true
      this.ruleForm.contactPerson = data.contactPerson || null
      this.ruleForm.mobile = data.mobile || null
      this.ruleForm.sendAddress = data.sendAddress || ''
      this.ruleForm.address = data.address || null
      this.ruleForm.type = this.formateEchoAddressType({
        type: data.type,
        defaultDeliveryAddress: data.defaultDeliveryAddress,
        defaultReturnAddress: data.defaultReturnAddress
      })
      this.ruleForm.lat = data.lat || null
      this.ruleForm.lng = data.lng || null
      this.ruleForm.addressCode = data.addressCode || []
      this.ruleForm.province = data.province || null
      this.ruleForm.city = data.city || null
      this.ruleForm.area = data.area || null
    },
    init() {
      this.ruleForm.id = this.$route.query && this.$route.query.id
      if (this.ruleForm.id) {
        const data = this.getAddressById()
        this.handleEchoData(data)
      }
    },
    // 格式化回显地址类型数据
    formateEchoAddressType({ type, defaultDeliveryAddress, defaultReturnAddress }) {
      const arr = []
      if (type === 3) {
        arr.push(1, 2)
        defaultDeliveryAddress && arr.push(3)
        defaultReturnAddress && arr.push(4)
        return arr
      }
      if (type === 1) {
        arr.push(1)
        defaultDeliveryAddress && arr.push(3)
        return arr
      }
      if (type === 2) {
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
        obj.type = 3
        obj.defaultDeliveryAddress = this.hasChecked(3) ? 1 : 0 // 如果存在 3 则为默认发货地址
        obj.defaultReturnAddress = this.hasChecked(4) ? 1 : 0 // 如果存在 4 则为默认收货地址
        return obj
      }
      if (this.hasChecked(1)) {
        obj.type = 1
        obj.defaultDeliveryAddress = this.hasChecked(3) ? 1 : 0
        return obj
      }
      if (this.hasChecked(2)) {
        obj.type = 2
        obj.defaultReturnAddress = this.hasChecked(4) ? 1 : 0
        return obj
      }
    },
    getReqData() {
      const data = JSON.parse(JSON.stringify(this.ruleForm))
      // 处理地址类型
      const type = this.formateAddressType()
      console.log(type)
      delete data.type
      return { data, ...type }
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
    handleDataRepeatErr() {},
    // 处理开启商家配送提醒
    hanldeIsOpenDelivery() {},
    // 数据保存之后的处理逻辑
    handleAfterSave(res) {
      // 数据重复
      if (res.code === 1) {
        this.handleDataRepeatErr()
        return false
      }
      // 是否开启商家配送
      if (res.code === 2) {
        this.hanldeIsOpenDelivery()
        return false
      }
      // 保存成功
      if (res.code === 0) {
        this.handleSaveSuccess()
        return false
      }
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
          const req = this.getReqData()
          console.log('req',req)
          const res = {
            code: 0
          }
          this.handleAfterSave(res)
          // // 数据重复错误提示
          // this.handleDataRepeatErr(id)
          // this.$router.push({ path: '/set/addressUpdate', query: { id: 1 }})
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