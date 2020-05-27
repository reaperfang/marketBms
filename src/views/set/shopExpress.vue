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
        <el-form-item label="取货地址：" class="item">
          <!-- <label>取货地址：</label> -->
          {{ address }}
          <el-button type="text" @click="handleToShopInfo">修改</el-button>
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
          <map-radius v-if="ruleForm.lat && ruleForm.lng" class="map-radius" :radius="ruleForm.radius" :center="[ruleForm.lat,ruleForm.lng]" :zoom="14" :address="address"></map-radius>
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
                说明：仅支持当天配送，默认可配送时间为当天06:00:00~20:00:00。点击
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
            <span><em>*</em>支持卖家提前</span>
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
                说明：默认可配送时间为当天06:00:00~20:00:00。点击
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
              <el-radio-group v-model="ruleForm.repeatCycle">
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
                <span class="prompt"> {{ getCheckedweeks }}</span>
              </el-radio-group>
            </el-form-item>
            <!-- 选择时间段 -->
            <div class="everyDayCon">
              <div class="timePeriods" v-for="(item, key) in ruleForm.timePeriods" :key="key" >
                <span>选择时间段</span>
                <el-form-item 
                  :prop="'timePeriods.'+key+'.start'"
                  :rules="[
                    { required: true, message: '请选择时间', trigger: 'change' },
                    { validator: validateTimeRangesStart, trigger: 'change'}
                  ]"
                >
                  
                  <el-time-picker placeholder="开始时间" v-model="item.start" style="width: 156px;"></el-time-picker>
                </el-form-item>
                <span class="line">~</span>
                <el-form-item 
                  :prop="'timePeriods.'+key+'.end'"
                  :rules="[{ required: true, message: '请选择时间', trigger: 'change' },
                    { validator: validateTimeRangesEnd, trigger: 'change'}]"
                >
                  <el-time-picker placeholder="结束时间" v-model="item.end" style="width: 156px;" :picker-options="{selectableRange: getSelectableRange(key)}"></el-time-picker>
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
        <el-button type="primary" class="submit" @click="handleSubmit('ruleForm')" :loading="isLoading">保 存</el-button>
      </div>
     </el-form>
  </div>
</template>

<script>


import mapRadius from './components/mapRadius'
import { debounce } from '@/utils/base.js'
import order from '@/system/constant/order.js'
let isCompleted
let isHasOtherWay
export default {
  components: {
    mapRadius
  },

  data () {
    // 校验数字格式为0.00的否则提示如下错误
    const validateFloat = (rule, value, callback) => {
      const reg = /^(([0-9]+).\d{2})$/ // 判断格式必须位*.**
      if (value && reg.test(value)) {
        callback();
      } else {
        callback(new Error('必填项，请输入非负数，支持小数点后两位'));
      }
    };
    const validateFloat2 = (rule, value, callback) => {
      const reg = /^(([0-9]+).\d{3})$/ // 判断格式必须位*.**
      if (value && reg.test(value)) {
        callback();
      } else {
        callback(new Error('必填项，请输入非负数，支持小数点后三位'));
      }
    };
    const validatePositiveInter = (rule, value, callback) => {
      const reg = /^[0-9]+$/
      if (value && reg.test(value)) {
        callback();
      } else {
        callback(new Error('必填项，请输入天数，仅支持输入正整数'));
      }
    }
    return {
      isOpen: false, // 是否开启商家配送
      address: null, // 默认取货地址
      visible: false,
      visible2: false,
      visible3: false,
      isLoading: false,
      tempWeeks: [],
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
          { validator: validateFloat, trigger: 'blur' }
        ],
        price: [
          { validator: validateFloat, trigger: 'blur'}
        ],
        basicFreight: [
          { validator: validateFloat, trigger: 'blur'}
        ],
        distanceLt: [
          { validator: validateFloat, trigger: 'blur'}
        ],
        weightLt: [
          { validator: validateFloat2, trigger: 'blur'}
        ],
        distancePlus: [
          { validator: validateFloat, trigger: 'blur'}
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
    }
  },

  computed: {
    getSwitchTxt() {
      return this.isOpen ? '已开启' : '已关闭'
    },
    getTimeSlot() {
      return order.timeSlot
    },
    getCheckedweeks() {
      const checkedweeks = []
      this.ruleForm.weeks.forEach(item => {
        const week = this.weeks.find(val => item === val.value)
        if (week) {
          checkedweeks.push(week.label)
        }
      })
      let str = ''
      if (checkedweeks.length > 0) {
        str = checkedweeks.join('、')
      }
      return  str ? `【 ${str}】` : ''
    },
    cid(){
        let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
        return shopInfo.id
    },
    shopInfo() {
      return this.$store.state.shop.shopInfo
    }
  },

  watch: {
    // shopInfo(curr) {
    //   console.log('-----watch-shopInfo------')
    //   if (curr) {
    //     this.getShopInfo(curr)
    //   }
    // }
  },

  created() {
    this._formatDecimals = debounce(this.formatDecimals, 500)
    // if (this.shopInfo) {
    //   this.getShopInfo(this.shopInfo)
    // }
    this.getShopInfo()
    this.getOrderDeliverInfo()
  },

  mounted() {
    
  },

  methods: {
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
    // 校验时间区间start
    validateTimeRangesStart(rule, value, callback) {
      console.log('---validateTimeRangesStart---',rule, value)
      const arr = rule.fullField.split('.') // .fullField: "timePeriods.1.start"
      const index = +arr[1] // 1
      const ruleForm = this.ruleForm.timePeriods
      let curr = new Date(value)
      curr = curr.getTime()
      const len = ruleForm.length
      const validateArr = []
      this.clearValidate('start')
      if (index > 0) {
        let prev = ruleForm[index - 1].start
        if (prev) {
          prev = new Date(prev)
          prev = prev.getTime()
          if (prev >= curr) {
            return callback(new Error('当前时间段的开始时间不能早于上一个时间段的开始时间。'))
          }
        }
      }
      if (index + 1 < len) {
        let next = ruleForm[index + 1].start
        if (next) {
          next = new Date(next)
          next = next.getTime()
          if (next <= curr) {
            return callback(new Error('当前时间段的开始时间不能晚于下一个时间段的开始时间。'))
          }
        } 
      }
      console.log('validateArr', validateArr)
      callback()
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
      console.log('---validateTimeRangesStart---',rule, value)
      const arr = rule.fullField.split('.') // .fullField: "timePeriods.1.end"
      const index = +arr[1] // 1
      const ruleForm = this.ruleForm.timePeriods
      let curr = new Date(value)
      curr = curr.getTime()
      const len = ruleForm.length
      const validateArr = []
      this.clearValidate('end')
      if (index > 0) {
        let prev = ruleForm[index - 1].end
        if (prev) {
          prev = new Date(prev)
          if (prev >= curr) {
            return callback(new Error('时间段可以交叉，不能重叠。'))
          }
        }
      }
      if (index + 1 < len) {
        let next = ruleForm[index + 1].end
        if (next) {
          next = new Date(next)
          next = next.getTime()
          if (next <= curr) {
            return callback(new Error('时间段可以交叉，不能重叠。'))
          }
        }
      }
      callback()
    },
    formatDecimals(val, key, digits = 2) {
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
      // const isCompleted = Math.random() * 10  > 5 ? true : false // mock data
      // 是否完成配置
      if (!isCompleted) {
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
          this.$message.error(error);
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
            this.$message.error(error);
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
      this.confirm({
          title: "提示",
          icon: true,
          text: '取货地址修改后，已设置的配送范围信息将被清空,请修改地址后记得重新配置配送范围。',
          confirmText: '去修改'
        }).then(() => {
          this.$router.push({ path:'/set/shopInfo' })
        }).catch(()=> {
        });
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
        this.$message.error(error);
        // this.loading = false
      })
    },
    //  店铺查询 api
    getShopInfo(res) {
      const id = this.cid
      this._apis.set.getShopInfo({ id }).then(res => {
        
        if (res && res.hasOwnProperty('id')) {
          this.isOpen = res.isOpenMerchantDeliver === 1 ? true : false // 是否开启商家配送 0-否 1-是
          this.ruleForm.radiusType = res.deliverRangeType || 1
          this.ruleForm.radius = res.deliverServiceRadius || null // 配送服务半径
          this.isOpenOrdinaryExpress = res.isOpenOrdinaryExpress // 是否开启普通快递 0-否 1-是
          this.isOpenTh3Deliver = res.isOpenTh3Deliver // 是否开启第三方配送 0-否 1-是
          this.isOpenSelfLift = res.isOpenSelfLift // 是否开启上门自提 0-否 1-是
          this.ruleForm.lng = res.longitude
          this.ruleForm.lat = res.latitude
          const areaCode = res.areaCode
          const cityCode = res.cityCode
          const provinceCode = res.provinceCode
          isHasOtherWay = res.isOpenOrdinaryExpress === 1 || res.isOpenTh3Deliver === 1 || res.isOpenSelfLift === 1
          this.address = this.formatAddress(res.address, provinceCode, cityCode, areaCode) || null
          this.getLngLat(this.address)
        }
      }).catch(err => {
        this.$message.error(err);
      })
    },
    formatTime(date){
      return date >= 10 ? date : `0${date}`
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
        const start = `${year}-${month}-${day} ${timeslot[0]}`
        const end = `${year}-${month}-${day} ${timeslot[1]}`
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
      this._apis.set.getOrderDeliverInfo({ cid }).then(res => {
        isCompleted = res.deliverStartingPrice
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
          {
            start: '',
            end: ''
          }
        ]
        this.ruleForm.timePeriods = this.formatSubscribeTimeHourRanges(res.subscribeTimeHourRanges) || defaultVal // 每天重复的小时时间段(~和逗号分隔): 00:00:00~00:01:00,00:08:00~00:09:00,00:13:00~00:14:00
        const weeks = this.formatSubscribeTimeWeekDays(res.subscribeTimeWeekDays) || [] // 以天为单位，每周重复的时间值(逗号分隔)：1,2,3,4,5,6,7
        this.ruleForm.weeks = weeks
        this.tempWeeks = weeks
      }).catch(err => {
        this.$message.error(err);
      })
    },
    handleSubmit(formName) {
      this.isLoading = true
      let isValidWeeks = true
      this.errWeekMsg = ''
      if (this.ruleForm.repeatCycle === 2) {
        if (this.ruleForm.weeks.length <= 0) {
          this.errWeekMsg = '请点击编辑，选择重复日'
          isValidWeeks = false
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid && isValidWeeks) {
          this.updateOrderDeliverInfo()
          // alert('submit!');
          // this.isLoading = false
        } else {
          // console.log('error submit!!');
          this.isLoading = false
          return false;
        }
      });
    },
    getHourMinuteSecond(start) {
       const date = new Date(start)
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()
        console.log('getHourMinuteSecond:before',hour,minute,second)
        hour = +hour >= 10 ? hour : `0${hour}`
        minute = +minute >= 10 ? minute : `0${minute}`
        second = +second >= 10 ? second : `0${second}`
        console.log('getHourMinuteSecond:after',hour,minute,second)
        return `${hour}:${minute}:${second}`

    },
    getSubscribeTimeHourRanges() {
      const timePeriods = this.ruleForm.timePeriods
      const arr = timePeriods.map(item => {
        let start = item.start
        let end = item.end
        start = this.getHourMinuteSecond(start)
        end = this.getHourMinuteSecond(end)
        return `${start}~${end}`
      })
      if (arr.length > 0) {
        return arr.join(',')
      }
      return ''
    },
    getOrderDeliverReqData() {
      const cid = this.cid
      const deliverBasicFreight = this.ruleForm.basicFreight
      const deliverRadiusDelta = this.ruleForm.distancePlus
      const deliverRadiusFreightDelta = this.ruleForm.distancePlusPrice
      const deliverRadiusNg = this.ruleForm.distanceLt
      const deliverStartingPrice = this.ruleForm.price
      const deliverWeightDelta = this.ruleForm.weightPlus
      const deliverWeightFreightDelta = this.ruleForm.weightPlusPrice
      const deliverWeightNg = this.ruleForm.weightLt
      const advanceSubscribeDays = this.ruleForm.advanceDays
      const isOpenLadderFreight = this.ruleForm.isOpenLadderFreight
      const isOpenSubscribeDeliver = this.ruleForm.isReservationDelivery
      const subscribeTimeCustomizeType = this.ruleForm.repeatCycle
      const subscribeTimeHourRanges = this.getSubscribeTimeHourRanges() // this.ruleForm.timePeriods
      const subscribeTimeType = this.ruleForm.deliveryTimeType
      const subscribeTimeWeekDays = this.ruleForm.weeks.sort().join(',')
      return {
        cid,
        deliverBasicFreight,
        deliverRadiusDelta,
        deliverRadiusFreightDelta,
        deliverRadiusNg,
        deliverStartingPrice,
        deliverWeightDelta,
        deliverWeightFreightDelta,
        deliverWeightNg,
        advanceSubscribeDays,
        isOpenLadderFreight,
        isOpenSubscribeDeliver,
        subscribeTimeCustomizeType,
        subscribeTimeHourRanges,
        subscribeTimeType,
        subscribeTimeWeekDays
      }
    },
    updateOrderDeliverInfo() {
      const req = this.getOrderDeliverReqData()
      console.log('---req---', req)
      // 更新配送价格、时间
      const p1 = this._apis.set.updateOrderDeliverInfo(req)
      const id = this.cid
      const data = {
        id,
        // deliverRangeType: this.ruleForm.radiusType,
        deliverRangeType:0,
        deliverServiceRadius: this.ruleForm.radius,
        longitude: this.ruleForm.longitude,
        latitude: this.ruleForm.latitude
      }
      // 更新店铺经度、纬度、配送半径
      const p2 = this._apis.set.updateShopInfo(data)
      // const p2 = this._apis.set.
      Promise.all([p1, p2]).then(res => {
        this.$store.dispatch('getShopInfo'); 
        if (this.isOpen) {
          this.$message({
              message: '保存成功',
              type: 'success'
          });
        } else {
          const str = `<p style="text-align: center;"><i class="el-icon-success" style="    font-size: 40px;color: rgba(108,213,33,1);"></i><span style="ertical-align: super;">保存成功</span></p>
          <p style="text-align: center;color:#ccc;">您可以去开启商家配送了</p>
          `
          this.$confirm(str, '', {
            dangerouslyUseHTMLString: true,
            distinguishCancelAndClose: true,
            confirmButtonText: '开启',
            cancelButtonText: '暂不开启'
          }).then(()=> {
            this.openMerchantDeliver()
          }).catch((action) => {
            
          });
        }
      }).catch(err => {
        this.$message.error(err);
      }).finally(() => {
        this.isLoading = false
      })
    }
   }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  $color: rgba(68, 67, 75, 1);
  .shopExpress {
    background-color: #fff;
    color:$color;
    .dashed {
      border-bottom: 1px dashed rgba(211, 211, 211, 1);
    }
    h2 {
      position: relative;
      padding:  20px 0;
      font-size:14px;
      font-weight:400;
      line-height:20px;
      em {
        position: absolute;
        right: 100%;
        top: 20px;
        font-size: 14px;
        font-weight: 400;
        color: #fd4c2b;
        line-height: 25px;
        padding-right: 5px;
      }
    }
    .switch {
      padding: 20px 0;
      margin: 0 20px;
      font-size: 14px;
      line-height: 22px;
    }
    .prompt {
      color: rgba(61, 67, 74, .5);
      font-size: 12px;
      .time-range {
        color: #3D434A;
        /deep/ span {
          text-decoration: underline;
        }
      }
    }
    .section {
      margin: 0 20px;
    }
    .delivery-area {
      .radius {
        span {
          padding:0 10px;
          position: relative;
          em {
            position: absolute;
            left: 0;
            top: 0;
            line-height: 22px;
          }
        }
      }
      /deep/ .el-radio-group label:last-child {
        margin-left: 0;
      }
      .map {
        margin-left: 120px;
        padding-bottom: 40px;
        max-width: 827px;
        height: 400px;
      }
    }
    .box {
      margin-left: 120px;
      background:rgba(249,249,249,1);
      padding: 20px;
      margin-bottom:20px;
      .beforehand {
        display: flex;
        > .item {
          width: 156px;
          display: inline-block;
          /deep/ .el-form-item__content {
            margin-left: 0 !important;
          }
          /deep/ .el-form-item__error {
            white-space: nowrap;
          }
        }
        span {
          position: relative;
          padding: 0 10px;
          line-height: 34px;
          em {
            position: absolute;
            left: 0;
            top: 0;
            color: #fd4c2b;
          }
        }
      }
      .deliveryTimeType {
        /deep/ .el-form-item__content {
          margin-left: 0 !important;
        }
      }
    }
    .delivery-price {
      > .item {
        position: relative;
        /deep/ .el-form-item__label {
          text-align: right;
        }
        .group {
          position:absolute;
          left: 0;
          top: 0;
          /deep/ .el-radio {
            padding-top: 10px;
            padding-right: 45px;
          }
        }
        .prompt {
          position: relative;
          min-height: 34px;
          margin-left: 200px;
          padding-left: 35px;
          span {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      }
      > .freight-range {
        
        li {
          display: flex;
          > .item {
            width: 156px;
            /deep/ .el-form-item__content {
              margin-left: 0 !important;
            }
            /deep/ .el-form-item__error {
              white-space: nowrap;
            }
          }
          span {
            position: relative;
            padding: 0 10px;
            line-height: 34px;
            em {
              position: absolute;
              left: 0;
              top: 0;
              color: #fd4c2b;
            }
          }
        }
      }
    }
    .delivery-time {
      .box {
        margin-left: 140px;
      }
      // > .item {
      //   width: 156px;
      //   /deep/ .el-form-item__content {
      //     margin-left: 0 !important;
      //   }
      //   /deep/ .el-form-item__error {
      //     white-space: nowrap;
      //   }
      // }
      .label {
        position: relative;
        padding-right: 30px;
        .err {
          position: absolute;
          left: 0;
          top: 20px;
          color:#FD4C2B;
        }
      }
      .repeatCycle {
        /deep/ .el-form-item__content {
        margin-left:80px;
        }
      }
      .everyDayCon {
        margin-left: 105px;
        /deep/ .el-form-item__label {
          text-align: right;
        }
        .btn-del {
          font-size: 14px;
          color: #fd4c2b;
          padding: 0;
          padding-bottom: 20px;
          padding-left: 10px;
        }
      }
      .timePeriods {
        display: flex;
        padding-bottom:10px;
        span {
          line-height: 34px;
          padding: 0 10px 0 35px;
        }
        .line {
          padding: 0 10px;
        }
        /deep/ .el-form-item__content {
          margin-left: 0 !important;
        }
      }
      
      .btn {
        position: relative;
        padding-bottom: 25px;
        &-add {
          position: absolute;
          left: 222px;
          top: 0;
        }
      }
    }
    .btn {
      padding-bottom:20px;
      text-align: center;
    }
  }
  .timeslot-popover {
    position: relative;
    p, li {
      font-size: 14px;
      line-height: 20px;
      color: rgba(22,22,23,1);
    }
    li {
      letter-spacing: 3px;
    }
    i {
      position: absolute;
      right: -5px;
      top: -5px;
      cursor: pointer;
      font-size: 20px;
      color: #B6B5C8;
    }
  }
</style>