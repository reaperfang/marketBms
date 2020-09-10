<template>
  <div class="shopExpress">
    <!-- 商家配送 -->
    <section class="switch dashed">
      <span>商家配送</span>
      <el-switch v-model="isOpen" @change="handleIsOpen"></el-switch>
      <span>{{ getSwitchTxt }}</span>
      <span class="prompt">启用后，买家下单可以选择商家配送，申请退换货售后时可以选择商家自取，由你提供上门配送服务</span>
    </section>
    <el-form ref="ruleForm"  :rules="rules" label-position="left" :model="ruleForm" label-width="120px">
       <!-- 配送范围 -->
      <section class="section dashed delivery-area">
        <h2><em>*</em> 配送范围</h2>
        <el-form-item label="发货地址：" class="item">
          <!-- <label>取货地址：</label> -->
          <template v-if="address">{{ address }}</template>
          <el-button type="text" @click="handleToShopInfo">{{ btnTxt }}</el-button>
        </el-form-item>
        <el-form-item label="配送范围设置：" prop="radiusType" class="item">
          <!-- <label>配送范围设置：</label> -->
          <p class="prompt">收货地址在配送范围之外的买家将无法使用商家配送</p>
          <el-radio-group v-model="ruleForm.radiusType">
            <el-radio :label="1">按服务半径</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="radius">
          <div class="radius">
            <span><em>*</em>服务半径</span>
            <el-input v-model="ruleForm.radius" @input="handleDecimals(ruleForm.radius, 'radius')" style="width: 156px;" placeholder="请输入"></el-input>
            <span>公里</span>
            <!-- <span class="prompt">仅支持输入大于0的数字，支持小数点后两位。</span> -->
          </div>
        </el-form-item>
        <div class="map">
          <map-radius class="map-radius" v-if="isLoadMap" :radius="ruleForm.radius" :center="getCenter" :zoom="zoom" :address="address"></map-radius>
        </div>
        
      </section>
       <!-- 配送价格 -->
      <section class="section dashed delivery-price">
        <h2><em>*</em> 配送价格</h2>
        <el-form-item label="起送价" class="item" prop="price">
          <div class="group">
            <el-input v-model="ruleForm.price" @input="handleDecimals(ruleForm.price,'price')" style="width: 156px;" placeholder="请输入"></el-input>
            <span>元</span>
          </div>
          <p class="prompt">
            <span>说明：</span>订单中的商品在优惠前的金额即订单总金额（不包含运费）低于起送价时，买家将不能享受商家配送
          </p>
        </el-form-item>
        <el-form-item class="item" label="基础运费" prop="basicFreight">
          <div class="group">
            <el-input v-model="ruleForm.basicFreight"  @input="handleDecimals(ruleForm.basicFreight,'basicFreight')" style="width: 156px;" placeholder="请输入"></el-input>
            <span>元</span>
          </div>
          <p class="prompt">
            <span>说明：</span>商家未设置阶梯价时，则所有订单统一运费标准；商家可按配送服务半径设置阶梯价
          </p>
        </el-form-item>
        <el-form-item class="item" label="阶梯运费" prop="isOpenLadderFreight">
          <el-radio-group class="group" v-model="ruleForm.isOpenLadderFreight">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <p class="prompt">
            <span>说明：</span>配送距离按步行距离计算，非地图直线距离；起送重量为空时，按不限配送重量计算； 实际配送距离大于起送半径，不满增加公里数，运费按增加计算;实际配送重量大于起送重量，不满增加重量 运费按增加计算，依次类推;
          </p>
        </el-form-item>
        <div class="freight-range box" v-if="ruleForm.isOpenLadderFreight === 1">
          <ul>
            <li>
              <span><em>*</em>配送距离不大于</span>
              <el-form-item class="item" prop="distanceLt">
                <el-input type="text" v-model="ruleForm.distanceLt" @input="handleDecimals(ruleForm.distanceLt,'distanceLt')" style="width: 156px;"></el-input>
              </el-form-item>
              <span>
                公里，且重量不超过
              </span>
              <el-form-item class="item" prop="weightLt">
                <el-input type="text" v-model="ruleForm.weightLt" @input="handleDecimals(ruleForm.weightLt,'weightLt', 3)" style="width: 156px;"></el-input>
              </el-form-item>
              <span>
                kg时,使用基础运费；
              </span>
            </li>
            <li>
              <span><em>*</em>配送距离每增加</span>
              <el-form-item class="item" prop="distancePlus">
                <el-input type="text" v-model="ruleForm.distancePlus" @input="handleDecimals(ruleForm.distancePlus,'distancePlus')" style="width: 156px;"></el-input>
              </el-form-item>
              <span>
                公里时，运费增加
              </span>
              <el-form-item class="item" prop="distancePlusPrice">
                <el-input type="text" v-model="ruleForm.distancePlusPrice" @input="handleDecimals(ruleForm.distancePlusPrice,'distancePlusPrice')" style="width: 156px;"></el-input>
              </el-form-item>
              <span>
                元；
              </span>
            </li>
            <li>
              <span><em>*</em>配送重量每增加</span>
              <el-form-item class="item" prop="weightPlus">
                <el-input type="text" v-model="ruleForm.weightPlus" @input="handleDecimals(ruleForm.weightPlus,'weightPlus', 3)" style="width: 156px;"></el-input>
              </el-form-item>
              <span>
                kg时，运费增加
              </span>
              <el-form-item class="item" prop="weightPlusPrice">
                <el-input type="text" v-model="ruleForm.weightPlusPrice" @input="handleDecimals(ruleForm.weightPlusPrice,'weightPlusPrice')" style="width: 156px;"></el-input>
              </el-form-item>
              <span>
                元
              </span>
            </li>
          </ul>
        </div>
      </section> 
      <!-- 配送时间 -->
      <section class="section delivery-time">
        <h2><em>*</em> 配送时间</h2>
        <el-form-item prop="isReservationDelivery">
          <div>
              <el-radio v-model="ruleForm.isReservationDelivery" :label="0">不开启预约配送</el-radio>
              <span class="prompt">
                说明：仅支持当天配送，默认可配送时间为当天06:00~20:00。点击
                <el-popover
                  placement="top"
                  width="240"
                  v-model="visible"
                  trigger="click">
                  <div class="timeslot-popover">
                    <i class="el-icon-close" @click="visible= false"></i>
                    <p>买家下单时可选择当天时间段为：</p>
                    <ul>
                      <li v-for="item in getTimeSlot" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                  <el-button slot="reference" type="text" class="time-range">查看买家可选时间段</el-button>
                </el-popover>
              </span>
          </div>
          <el-radio v-model="ruleForm.isReservationDelivery" :label="1">开启预约配送</el-radio>
        </el-form-item>
        <div class="box" v-if="ruleForm.isReservationDelivery === 1">
          <div class="beforehand">
            <span><em>*</em>支持买家提前</span>
            <el-form-item class="item" prop="advanceDays">
              <el-input type="text" v-model="ruleForm.advanceDays" style="width: 156px;"></el-input>
            </el-form-item>
            <span>
              天下单
            </span>
          </div>
          <el-form-item class="deliveryTimeType" prop="deliveryTimeType">
            <div>
              <el-radio v-model="ruleForm.deliveryTimeType" :label="1">全天</el-radio>
              <span class="prompt">
                说明：默认可配送时间为当天06:00~20:00。点击
                <el-popover
                  placement="top"
                  width="240"
                  v-model="visible2"
                  trigger="click">
                  <div class="timeslot-popover" @click="visible2 = false">
                    <i class="el-icon-close"></i>
                    <p>买家下单时可选择当天时间段为：</p>
                    <ul>
                      <li v-for="item in getTimeSlot" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                  <el-button slot="reference" type="text" class="time-range">查看买家可选时间段</el-button>
                </el-popover>
              </span>
            </div>
            <div>
              <el-radio v-model="ruleForm.deliveryTimeType" :label="2">自定义</el-radio>
            </div>
          </el-form-item>
          <div v-if="ruleForm.deliveryTimeType === 2">
            <el-form-item  class="repeatCycle" prop="repeatCycle">
              <el-radio-group v-model="ruleForm.repeatCycle" @change="handleRepeatCycleChange">
                <el-radio :label="1"><span class="label">每天重复</span></el-radio>
                <el-radio :label="2"><span class="label">每周重复<span class="err">{{errWeekMsg}}</span></span></el-radio>
                <el-popover
                  placement="top"
                  width="160"
                  v-model="visible3"
                  v-show="ruleForm.repeatCycle === 2"
                  trigger="click">
                  <el-checkbox-group v-model="tempWeeks">
                  <ul>
                    <li v-for="(item, key) in weeks" :key="key">
                      <el-checkbox :label="item.value" name="weeks">{{ item.label }}</el-checkbox>
                    </li>
                    <li>
                      <el-button type="primary"  size="mini" @click="handleWeeks">确定</el-button>
                      <el-button type="primary" plain  size="mini" @click="visible3 = false">取消</el-button>
                    </li>
                  </ul>
                  </el-checkbox-group>
                  <el-button slot="reference" type="text" class="edit">编辑</el-button>
                </el-popover>
                <span class="prompt" v-show="ruleForm.repeatCycle === 2"> {{ getCheckedweeks }}</span>
              </el-radio-group>
            </el-form-item>
            <!-- 选择时间段 -->
            <div class="everyDayCon">
              <div class="timePeriods" v-for="(item, key) in ruleForm.timePeriods" :key="key" >
                <span>选择时间段</span>
                <el-form-item 
                  :prop="'timePeriods.'+key+'.start'"
                  :rules="[
                    { required: true, message: '请选择时间', trigger:  'change' },
                    { validator: validateTimeRangesStart, trigger:  'change'}
                  ]"
                >
                  
                  <el-time-picker format="HH:mm" placeholder="开始时间" v-model="item.start" style="width: 156px;"></el-time-picker>
                </el-form-item>
                <span class="line">~</span>
                <el-form-item 
                  :prop="'timePeriods.'+key+'.end'"
                  :rules="[{ required: true, message: '请选择时间', trigger:  'change' },
                    { validator: validateTimeRangesEnd, trigger: 'change'}]"
                >
                  <el-time-picker format="HH:mm" placeholder="结束时间" v-model="item.end" style="width: 156px;" :picker-options="{selectableRange: getSelectableRange(key), format:'HH:mm'}"></el-time-picker>
                </el-form-item>
                <el-button type="text" size="mini" v-if="key !== 0 && (ruleForm.timePeriods.length - 1 === key)" class="btn-del" @click="handleDelTimePeriod(key)">删除</el-button>
              </div>
            </div>
            <div class="btn">
              <el-button class="btn-add" type="primary" plain @click="handleAddTimePeriod">添加时间段</el-button>
            </div>
          </div>
        </div>
      </section>
      <div class="btn">
        <el-button type="primary" class="submit"  v-permission="['设置','同城配送','默认页面', '保存']" @click="handleSubmit('ruleForm')" :loading="isLoading">保 存</el-button>
      </div>
     </el-form>
  </div>
</template>

<script>
import merchantDeliver from './components/merchantDeliver'
import th3Deliver from './components/th3Deliver'
export default {
  name: 'shopExpress',
  data() {
    return {
<<<<<<< HEAD
      currentTab: 'merchantDeliver',
=======
      prevIndex: null,
      nextIndex: null,
      zoom: 4,
      isOpen: false, // 是否开启商家配送
      address: null, // 默认取货地址
      addressId: null,
      visible: false,
      visible2: false,
      visible3: false,
      isLoading: false,
      tempWeeks: [],
      isLoadMap: true,
      ruleForm: {
        radiusType: 1,  // 配送范围设置类型
        radius: null, //  配送半径
        lng: null, // 经度
        lat: null, // 纬度
        provinceCode: null,
        cityCode: null,
        areaCode: null,
        price: null, // 起送价
        basicFreight: null, // 基础运费
        isOpenLadderFreight: 0, // 是否启用阶梯运费 0-否 1-是
        distanceLt: null, // 配送距离不大于
        weightLt: null ,// 重量不超过 
        distancePlus: null, // 配送距离每增加
        distancePlusPrice: null, // 配送距离运费增加
        weightPlus: null, // 配送重量每增加
        weightPlusPrice: null, // 配送重量运费增加 
        isReservationDelivery: 0, // 是否开启预约配送
        advanceDays: null, // 提前几天下单
        deliveryTimeType: 1, // 配送时间类型
        repeatCycle: 1, // 重复周期
        weeks: [], // 重复日
        timePeriods: [ 
          {
            start: '',
            end: ''
          }
        ] // 选择时间段
      },
      // (/(([0-9])+(.)(\d{1,2}))/)
      rules: {
        radius: [
          { validator: validateFloat, trigger: 'blur' },
          { validator: validateRadius, trigger: 'blur' }
        ],
        price: [
          { validator: validateFloat, trigger: 'blur'}
        ],
        basicFreight: [
          { validator: validateFloat, trigger: 'blur'}
        ],
        distanceLt: [
          { validator: validateFloat, trigger: 'blur'},
          { validator: validateExceedsRadiuo, trigger: 'blur'}
        ],
        weightLt: [
          { validator: validateFloat2, trigger: 'blur'}
        ],
        distancePlus: [
          { validator: validateFloat, trigger: 'blur'},
          { validator: validateExceedsRadiuo, trigger: 'blur'}
        ],
        distancePlusPrice: [
          { validator: validateFloat, trigger: 'blur'}
        ],
        weightPlus: [
          { validator: validateFloat2, trigger: 'blur'}
        ],
        weightPlusPrice: [
          { validator: validateFloat, trigger: 'blur'}
        ],
        advanceDays: [
          { validator: validatePositiveInter, trigger: 'blur'}
        ]
      },
      _formatDecimals: null,
      weeks: [
        {
          value: 1,
          label: '周一'
        },
        {
          value: 2,
          label: '周二'
        },
        {
          value: 3,
          label: '周三'
        },
        {
          value: 4,
          label: '周四'
        },
        {
          value: 5,
          label: '周五'
        },
        {
          value: 6,
          label: '周六'
        },
        {
          value: 7,
          label: '周日'
        }
      ],
      errWeekMsg: ''
>>>>>>> dev_v1.6.2
    }
  },
  components: {
    merchantDeliver,
    th3Deliver
  },
  watch: {
    currentTab(curr) {
      console.log(curr)
      // this.init()
    }
  },
  created() {
<<<<<<< HEAD
    // this.init()
=======
    this._formatDecimals = debounce(this.formatDecimals, 500)
    // if (this.shopInfo) {
    //   this.getShopInfo(this.shopInfo)
    // }
    const p1 = this.getDeliveryAddress()
    const p2 = this.getShopInfo()
    const p3 = this.getOrderDeliverInfo()
    Promise.all([p1,p2,p3]).then(([res1, res2, res3]) => {
      console.log('promise', res1, res2, res3)
      if (res1) {
        this.address = `${res1.address} ${res1.addressDetail}`
        this.ruleForm.lng = res1.longitude
        this.ruleForm.lat = res1.latitude
        this.addressId = res1.id
      }
      if (res2) {
         this.ruleForm.radius = res2.deliverServiceRadius || null // 配送服务半径
      }
    })
>>>>>>> dev_v1.6.2
  },
  destroyed() {
  },
  methods: {
<<<<<<< HEAD
    hasPermission(auth) {
      const localMsfList = localStorage.getItem('shopInfos');
      let msfList = [];
      if(localMsfList && JSON.parse(localMsfList) && JSON.parse(localMsfList).data && JSON.parse(localMsfList).data.msfList) {
        msfList = JSON.parse(localMsfList).data.msfList
      }
      if(msfList){
        if (auth) {
          return msfList.some(item => auth == item.name ) || auth == '概况首页' || auth == '概况' || auth == '账号信息'
        }else{
          return true
        }
      }else {
        return auth == '概况首页' || auth == '概况' || auth == '账号信息' ? true : false
      }
    },
    init() {
      // this.currentTab = 'quickDelivery'
      // this.$nextTick(() => {
        const currentTab = this.$route.query.currentTab
        console.log('--currentTab---', currentTab)
        if (currentTab) {
          this.currentTab = currentTab
        } else {
          const auths = [
=======
    // 获取发货地址
    getDeliveryAddress() {
      return this._apis.set.getAddressDefaultSender().then((response) => {
        // if (response) {
        //   this.address = `${response.address} ${response.addressDetail}`
        //   this.ruleForm.lng = response.longitude
        //   this.ruleForm.lat = response.latitude
        //   this.addressId = response.id
        // }
        return response
      }).catch((err) => {
        console.log('err',err)
        this.$message.error(err || '数据获取失败')
      })
    },
    handleRepeatCycleChange(val) {
      console.log('---val--', val)
      // if (val === 1) {
      //   this.ruleForm.weeks = []
      //   this.tempWeeks = []
      // }
    },
    // 格式化省市县
    formatAddress(address, provinceCode, cityCode, areaCode) {
      const reg = /.+?(省|市|自治区|自治州|县|区)/g
      const province = this.$pcaa[86][provinceCode];
      const city = this.$pcaa[provinceCode][cityCode];
      const area = this.$pcaa[cityCode][areaCode];
      if (reg.test(address)) {
        address = address.replace(reg, '')
      }
      console.log('--formatAddress---',address)

      address = province === city ? `${province}${area}${address}`: `${province}${city}${area}${address}`
      
      return address
    },
    // 获取经纬度
    getLngLat(address) {
      // this.ruleForm.lng = res.longitude
      //   this.ruleForm.lat = res.latitude
      const lng = this.ruleForm.lng
      const lat = this.ruleForm.lat
      if (!lng || !lat) {
        // api
        this._apis.map.getGeocoderAddress({
          address
        }).then((res) => {
          this.ruleForm.lng = res.result.location.lng
          this.ruleForm.lat = res.result.location.lat
        })
      }
    },
    getSelectableRange(key) {
      const ruleForm = this.ruleForm.timePeriods
      const timePeriod = ruleForm[key]
      let { start } = timePeriod
      if (!start) {
        return `00:00:00 - 23:59:59`
      }
      start = new Date(start)
      let hour = start.getHours()
      let minute = start.getMinutes()
      let second = start.getSeconds()
      hour = +hour >= 10 ? hour : `0${hour}`
      minute = +minute >= 10 ? minute : `0${minute}`
      second = +second >= 10 ? second : `0${second}`
      return `${hour}:${minute}:${second} - 23:59:59`
    },
    clearValidate(key) {
      const arr = []
      const timePeriods = this.ruleForm.timePeriods
      timePeriods.forEach((item, index) => {
        arr.push(`timePeriods.${index}.${key}`)
      })
      this.$refs.ruleForm.clearValidate(arr)
    },
    getPrevVal(form, index, key) {
      console.log(form,index, key)
      if (index < 0) return null
      let prev =  form && form[index] && form[index][key]
      // if (!prev) {
      //   index--
      //   prev = this.getPrevVal(form, index, key)
      // }
      while(index >= 0 && !prev) {
        index--
        prev = form && form[index] && form[index][key]
      }
      this.prevIndex = index
      return prev
    },
    getNextVal(form, index, key) {
      console.log(form,index, key)
      if (index >= form.length) return null
      let next = form && form[index] && form[index][key]
      while(index < form.length && !next) {
        index++
        next = form && form[index] && form[index][key]
      }
      this.nextIndex = index
      return next
    },
    // 校验时间区间start
    validateTimeRangesStart(rule, value, callback) {
      console.log('---validateTimeRangesStart---', rule, value)
      const arr = rule.fullField.split('.') // .fullField: "timePeriods.1.start"
      const index = +arr[1] // 1
      const ruleForm = this.ruleForm.timePeriods
      let curr = this.formatDate(value)
      curr = new Date(curr)

      // 重新处理时间，因为element-ui框架手动输入的时间与初始化时通过选择的时间的年月日不一致导致， 这里重新定义日期
      let date = new Date()
      const year = date.getFullYear()
      const month = this.formatTime(date.getMonth() + 1)
      const day = this.formatTime(date.getDate())
      const hours = this.formatTime(curr.getHours())
      const minutes = this.formatTime(curr.getMinutes())
      const newValue = `${year}/${month}/${day} ${hours}:${minutes}:00`

      console.log(newValue)
      curr = new Date(newValue)

      curr = curr.getTime()
      const len = ruleForm.length
      let isValidated = true
      // const validateArr = []
      // this.clearValidate('start')
        console.log('--index-------', index)
      if (index > 0) {
        // prev prev = ruleForm[index - 1].start
        let prev = this.getPrevVal(ruleForm, index - 1, 'start')
        // let prev = oPrev && oPrev.value
        console.log('------prev---', prev,'---curr--', curr)
        if (prev) {
          // this.clearValidate('start')
          this.$refs.ruleForm.clearValidate(`timePeriods.${this.prevIndex}.start`)
          // this.$refs.ruleForm.validateField(`timePeriods.${this.prevIndex}.start`);
          console.log('---validateTimeRangesStart:prev:curr---', prev, curr)
          prev = this.formatDate(prev)
          prev = new Date(prev)
          prev = prev.getTime()
          console.log('---validateTimeRangesStart:prev:curr:time---', prev, curr)
          if (prev >= curr) {
            isValidated = false
            callback(new Error('当前时间段的开始时间需晚于上一个时间段的开始时间'))
          }
        } 
      }
      if (index + 1 < len) {
        // let next = ruleForm[index + 1].start
        let next = this.getNextVal(ruleForm, index + 1, 'start')
        // let next = oNext && oNext.value
        console.log('---next--',next)
        if (next) {
          // this.clearValidate('start')
          this.$refs.ruleForm.clearValidate(`timePeriods.${this.nextIndex}.start`)
          // this.$refs.ruleForm.validateField(`timePeriods.${this.nextIndex}.start`);
          next = this.formatDate(next)
          next = new Date(next)
          next = next.getTime()
          console.log('---validateTimeRangesStart:next:curr:time---', next, curr)
          if (next <= curr) {
            isValidated = false
            callback(new Error('当前时间段的开始时间不能晚于下一个时间段的开始时间。'))
          }
        }
      }
      // console.log('validateArr', validateArr)
      if (isValidated) {
        callback()
      }
      // callback()
      // const reg = /^[0-9]+$/
      // if (value && reg.test(value)) {
      //   callback();
      // } else {
        // callback(new Error('必填项，请输入天数，仅支持输入正整数'));
      // }
    },
    // 校验时间区间 end
    validateTimeRangesEnd(rule, value, callback) {
      // console.log('---validateTimeRangesEnd---',rule, value)
      const arr = rule.fullField.split('.') // .fullField: "timePeriods.1.end"
      const index = +arr[1] // 1
      const ruleForm = this.ruleForm.timePeriods
      let curr = this.formatDate(value)
      curr = new Date(curr)

      // 重新处理时间，因为element-ui框架手动输入的时间与初始化时通过选择的时间的年月日不一致导致， 这里重新定义日期获取当前最新时间

      let date = new Date()
      const year = date.getFullYear()
      const month = this.formatTime(date.getMonth() + 1)
      const day = this.formatTime(date.getDate())
      const hours = this.formatTime(curr.getHours())
      const minutes = this.formatTime(curr.getMinutes())
      const newValue = `${year}/${month}/${day} ${hours}:${minutes}:00`

        console.log('---validateTimeRangesEnd:curr---', curr)
      console.log(newValue)
      curr = new Date(newValue)
      
      curr = curr.getTime()
      const len = ruleForm.length
      // const validateArr = []
      // this.clearValidate('end')
      let isValidated = true
      if (index > 0) {
        // let prev = ruleForm[index - 1].end
        let prev = this.getPrevVal(ruleForm, index - 1, 'end')
        console.log('---validateTimeRangesEnd:prev---', prev)
        if (prev) {
          // this.clearValidate('end')
          this.$refs.ruleForm.clearValidate(`timePeriods.${this.prevIndex}.end`)
          prev = this.formatDate(prev)
          prev = new Date(prev)
          prev = prev.getTime()
          console.log('---validateTimeRangesEnd:prev:curr:time---', prev, curr, prev >= curr)
          if (prev >= curr) {
            console.log('12121212')
            isValidated = false
            callback(new Error('时间段可以交叉，不能重叠。'))
          }
        }
        //  else {
        //    return callback(new Error('请选择时间'))
        // }
      }
      if (index + 1 < len) {
        // let next = ruleForm[index + 1].end
        let next = this.getNextVal(ruleForm, index + 1, 'end')
        console.log('---next--',next)
        if (next) {
          // this.clearValidate('end')
          this.$refs.ruleForm.clearValidate(`timePeriods.${this.nextIndex}.end`)
          next = this.formatDate(next)
          next = new Date(next)
          next = next.getTime()
          // console.log('---validateTimeRangesEnd:next:curr---', prev, curr)
          if (next <= curr) {
            isValidated = false
            callback(new Error('时间段可以交叉，不能重叠。'))
          }
        }
      }
      if (isValidated) {
        callback()
      }
    },
    formatDecimals(val, key, digits = 2) {
      console.log(val, Number.isNaN(+val))
      if (val) {
        if (Number.isNaN(+val)) {
          return false
        }
        this.ruleForm[key] = Number(val).toFixed(digits) 
      }
    },
    handleIsOpen(val) {
      console.log('val', val)
      // 当前是否开启普通快递
      if (val) {
        this.open()
      } else {
        this.close()
      }
    },
    open() {
      console.log('isCompleted',this.isCompleted)
      // const isCompleted = Math.random() * 10  > 5 ? true : false // mock data
      // 是否完成配置
      if (!this.isCompleted) {
        this.confirm({
          title: "提示",
          icon: true,
          text: '您未完成配送范围、起送金额、配送时间等配置项设置，需设置并提交保存后，才能开启商家配送开关。',
          confirmText: '我知道了',
          showCancelButton: false
        }).finally(() => {
          this.isOpen = false
        })
      } else {
        this.updateShopInfo({ isOpenMerchantDeliver: 1 }).then(response =>{
          this.confirm({
            title: "提示",
            iconSuccess: true,
            text: '已成功开启商家配送！',
            confirmText: '我知道了',
            showCancelButton: false
          });
          if (!this.isOpen) {
            this.isOpen = true
          }
        }).catch(error =>{
          this.isOpen = false
          this.$message.error(error || '保存失败');
          // this.loading = false
        })
      }
    },
    updateShopInfo(data) {
      const id = this.cid
      return new Promise((resolve, reject) => {
        this._apis.set.updateShopInfo({...data, id }).then(response =>{
          this.$store.dispatch('getShopInfo');    
          resolve(response)
        }).catch(error =>{
          reject(error)
        })
      })
    },
    close() {
      console.log('--isHasOtherWay---', isHasOtherWay)
      // 判断是否有其他配送方式
      // const isHasOtherWay = Math.random() * 10  > 5 ? true : false // mock data
      if (isHasOtherWay) {
        this.confirm({
          title: "提示",
          icon: true,
          text: '关闭后买家下单后将不再支持商家配送，您确定要关闭吗？',
          // beforeClose() {
          //   this.isOpen = true
          // }
        }).then(() => {
          this.updateShopInfo({ isOpenMerchantDeliver: 0 }).then(response =>{  
            this.isOpen = false
            this.$message.success('保存成功！');
          }).catch(error =>{
            this.isOpen = true
            this.$message.error('保存失败');
            // this.loading = false
          })
          // this.isOpen = false
          //   this.$message.success('保存成功！');
        }).catch(()=> {
            this.isOpen = true
        });
      } else {
        this.confirm({
          title: "提示",
          icon: true,
          text: '至少需要开启快递发货、商家配送中的一种配送方式 店铺才能正常经营',
          confirmText: '我知道了',
          showCancelButton: false,
        }).finally(() => {
          console.log('----finally--')
          this.isOpen = true
        });
      }
    },
    handleDecimals(val,key, digits) {
      this._formatDecimals(val, key, digits)
    },
    handleWeeks() {
      if (this.tempWeeks.length <= 0) {
      //  请点击编辑，选择重复日
        this.errWeekMsg = '请点击编辑，选择重复日'
      } else {
        this.errWeekMsg = ''
      }
      this.ruleForm.weeks = this.tempWeeks.sort()
      // this.tempWeeks = [] // clear
      
      this.visible3 = false
    },
    handleDelTimePeriod(index) {
      this.ruleForm.timePeriods.splice(index, 1)
    },
    handleAddTimePeriod() {
      const timePeriod = {
        start: '',
        end: ''
      }
      this.ruleForm.timePeriods.push(timePeriod)
    },
    handleToShopInfo() {
      if (this.addressId) {
        this.confirm({
          title: "提示",
          icon: true,
          text: '修改发货地址后请重新确认其它商家配送设置项，如无修改将以新的发货地址为中心按原配送规则执行',
          confirmText: '去修改'
        }).then(() => {
          // source 1 商家配送
          this.$router.push({ path:'/set/addressUpdate', query: {id: this.addressId, source: 1 } })
        }).catch(()=> {
        });
      } else {
          this.$router.push({ path:'/set/addressAdd', query: { source: 1 } })
      }
    },
    // 开启商家配送 api
    openMerchantDeliver() {
      const id = this.cid
      const data = {
        id,
        isOpenMerchantDeliver: 1
      }
      this._apis.set.updateShopInfo(data).then(response =>{  
        this.$store.dispatch('getShopInfo');      
        this.confirm({
          title: "提示",
          iconSuccess: true,
          text: '已成功开启商家配送！',
          confirmText: '我知道了',
          showCancelButton: false
        });
        if (!this.isOpen) {
          this.isOpen = true
        }
      }).catch(error =>{
        this.isOpen = false
        this.$message.error('保存失败');
        // this.loading = false
      })
    },
    //  店铺查询 api
    getShopInfo(res) {
      const id = this.cid
      return this._apis.set.getShopInfo({ id }).then(res => {
        
        if (res && res.hasOwnProperty('id')) {
          this.isOpen = res.isOpenMerchantDeliver === 1 ? true : false // 是否开启商家配送 0-否 1-是
          this.ruleForm.radiusType = res.deliverRangeType || 1
          // this.ruleForm.radius = res.deliverServiceRadius || null // 配送服务半径
          this.isOpenOrdinaryExpress = res.isOpenOrdinaryExpress // 是否开启普通快递 0-否 1-是
          this.isOpenTh3Deliver = res.isOpenTh3Deliver // 是否开启第三方配送 0-否 1-是
          this.isOpenSelfLift = res.isOpenSelfLift // 是否开启上门自提 0-否 1-是
          // 经纬度需要获取地址库的默认地址
          // this.ruleForm.lng = res.longitude
          // this.ruleForm.lat = res.latitude
          const areaCode = res.areaCode
          const cityCode = res.cityCode
          const provinceCode = res.provinceCode
          isHasOtherWay = res.isOpenOrdinaryExpress === 1 || res.isOpenTh3Deliver === 1 || res.isOpenSelfLift === 1
          // this.address = `${res.sendAddress}${res.address}` || null // 取地址库的
        }
        return res
      }).catch(err => {
        console.log('---getShopInfo--', err)
        // this.$message.error(err && err.message || '查询失败');
      })
    },
    formatTime(date){
      return date >= 10 ? date : `0${date}`
    },
    formatDate(val){
      const date = new Date(val)
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      month = this.formatTime(month)
      let day = date.getDate()
      day = this.formatTime(day)
      let hour = date.getHours()
      hour = this.formatTime(hour)
      let minute = date.getMinutes()
      minute = this.formatTime(minute)
      return `${year}/${month}/${day} ${hour}:${minute}:00`
      
    },
    // 格式化 每天重复的小时时间段
    formatSubscribeTimeHourRanges(str) {
      if (!str) return false
      let arr = []
      arr = str.split(',')
      const date = new Date()
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month > 10 ? month : `0${month}`
      let day = date.getDate()
      day = day > 10 ? day : `0${day}`
      const timePeriods = arr.map(item => {
        const timeslot = item.split('~')
        let start = `${year}-${month}-${day} ${timeslot[0]}`
        let end = `${year}-${month}-${day} ${timeslot[1]}`
        // 解决safari不兼容上面的时间格式问题
        start = new Date(start.replace(/-/g, '/'))
        end = new Date(end.replace(/-/g, '/'))
        console.log(start, end)
        return {
          start,
          end
        }
      })
      console.log('formatSubscribeTimeHourRanges:timePeriods', timePeriods)
      return timePeriods
    },
    // 格式化  以天为单位，每周重复的时间值(逗号分隔)：1,2,3,4,5,6,7
    formatSubscribeTimeWeekDays(str) {
      if (!str) return false
      let weeks = str.split(',')
      weeks = weeks.map(item => {
        return Number(item)
      })
      return weeks
    },
    // 商家配送详情
    getOrderDeliverInfo() {
      const cid = this.cid
      return this._apis.set.getOrderDeliverInfo({ cid }).then(res => {
        // isCompleted = res.deliverStartingPrice
        this.ruleForm.price = res.deliverStartingPrice || null // 起送价
        this.ruleForm.basicFreight = res.deliverBasicFreight || null // 基础运费
        this.ruleForm.isOpenLadderFreight = res.isOpenLadderFreight || 0 // 是否启用阶梯运费 0-否 1-是
        this.ruleForm.distanceLt = res.deliverRadiusNg || null // 配送距离不大于此公里数时,使用基础运费
        this.ruleForm.weightLt = res.deliverWeightNg || null // 配送重量不超过此值时，使用基础运费
        this.ruleForm.distancePlus = res.deliverRadiusDelta || null // 配送距离增加公里数
        this.ruleForm.distancePlusPrice = res.deliverRadiusFreightDelta || null // 配送距离增加distribution_radius_delta,运费增加
        this.ruleForm.weightPlus = res.deliverWeightDelta || null // 配送重量增加KG数
        this.ruleForm.weightPlusPrice = res.deliverWeightFreightDelta || null // 配送重量增加distribution_weight_delta，运费增加
        this.ruleForm.isReservationDelivery = res.isOpenSubscribeDeliver || 0 // 是否开启预约配送 0-否 1-是
        this.ruleForm.advanceDays = res.advanceSubscribeDays || null // 买家可提前预约天数
        this.ruleForm.deliveryTimeType = res.subscribeTimeType || 1 // 买家预约时间类型 1-全天 2-自定义
        this.ruleForm.repeatCycle = res.subscribeTimeCustomizeType || 1 // 买家预约时间自定义类型 1-每天重复 2-每周重复
        const defaultVal = [ 
>>>>>>> dev_v1.6.2
          {
            name: 'merchantDeliver',
            title: '商家配送'
          },{
            name: 'th3Deliver',
            title: '第三方配送'
          }]
          for(let i = 0; i < auths.length; i++) {
            console.log(this.hasPermission(auths[i].title))
            if (this.hasPermission(auths[i].title)) {
            console.log(auths[i].name)
              this.currentTab = auths[i].name
              break
            }
          }
<<<<<<< HEAD
=======
        ]
        console.log('-----res.subscribeTimeHourRanges--', res.subscribeTimeHourRanges)
        this.ruleForm.timePeriods = this.formatSubscribeTimeHourRanges(res.subscribeTimeHourRanges) || defaultVal // 每天重复的小时时间段(~和逗号分隔): 00:00:00~00:01:00,00:08:00~00:09:00,00:13:00~00:14:00
        const weeks = this.formatSubscribeTimeWeekDays(res.subscribeTimeWeekDays) || [] // 以天为单位，每周重复的时间值(逗号分隔)：1,2,3,4,5,6,7
        this.ruleForm.weeks = weeks
        this.tempWeeks = weeks
        return res
      }).catch(err => {
        console.log('---getOrderDeliverInfo--', err)
        // this.$message.error(err && err.message || '');
      })
    },
    handleSubmit(formName) {
      this.isLoading = true
      let isValidWeeks = true
      this.errWeekMsg = ''
      console.log('handleSubmit:before')
      if (this.ruleForm.repeatCycle === 2) {
        if (this.ruleForm.weeks.length <= 0) {
          this.errWeekMsg = '请点击编辑，选择重复日'
          isValidWeeks = false
>>>>>>> dev_v1.6.2
        }
      // })
    },
    handleClick(comp) {
      console.log(comp)
      this.currentTab = comp.name;
      this.$router.replace({path: '/set/shopExpress', query:{currentTab: comp.name }})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.tabs{
  >>> .el-tabs__item {
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    font-weight: 400;
    color: #44434B;
  }
  >>> .el-tabs__header {
    background-color: #fff;
    margin:0;
    padding: 0 20px 0 20px;
  }
}
.main{
  width: 100%;
  padding: 20px;
  background: #fff;
}
</style>