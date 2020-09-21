<template>
  <div class="addSelfLift">
    <h2>{{ setTitle }}</h2>
    <el-form class="ruleForm" ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
       <div class="form-area">
         <el-form-item class="status" label="自提点状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio class="radio" :label="1">启用</el-radio>
            <el-radio class="radio" :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="ruleForm.pickUpId" label="自提点编号" prop="pickUpId">
          <span>{{ ruleForm.pickUpId }}</span>
        </el-form-item>
        <el-form-item label="自提点名称" prop="name">
          <el-input v-model="ruleForm.name" style="width:360px;" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="ruleForm.contactPerson" style="width:360px;" placeholder="请输入联系人姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input v-model="ruleForm.mobile" style="width:360px;" placeholder="请输入联系人手机号"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="ruleForm.address" @change="handleChangeAddress" style="width:360px;" placeholder="请输入并点击搜索地图确定详细地址" />
          <DialogMapSearch @getMapClickPoi="getMapClickPoi" :sendAddress="ruleForm.address"></DialogMapSearch>
        </el-form-item>
        <el-form-item label="详细地址" class="addressDetail" prop="addressDetail">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请填写详细地址信息"
            v-model="ruleForm.addressDetail"
            style="width:360px;" 
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <!-- 自提时间 -->
        <div  class="box">
          <el-form-item label="自提时间" class="deliveryTimeType" prop="deliveryTimeType">
            <div>
            <div>
              <el-radio v-model="ruleForm.deliveryTimeType" :label="1">全天</el-radio>
              <span class="prompt">
                默认可配送时间为当天06:00:00~20:00:00。点击
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
            </div>
          </el-form-item>
          <div class="delivery-time" v-if="ruleForm.deliveryTimeType === 2">
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
      </div>
      <div class="btn-area">
        <el-button
          type="primary"
          class="submit"
          :loading="isLoading"
          @click="handleSubmit('ruleForm')"
        >保 存</el-button>
      </div>
     </el-form>
  </div>
</template>

<script>
import DialogMapSearch from '@/components/mapSearchDialog'
import order from '@/system/constant/order.js'
export default {
  components: {
    DialogMapSearch
  },

  props: {},

  data () {
    // 验证自提点名称
    const validateName = (rule, value, callback) => {
      let reg = /^[\u4e00-\u9fa5a-zA-Z]{1,50}$/gi;
      // console.log('---reg--',reg.test(value))
      if (!reg.test(value)) {
        return callback(new Error("仅支持输入中英文字符，不能超过50个字符。"));
      } else {
        callback();
      }
    };
    // 验证联系人
    const validateContactPerson = (rule, value, callback) => {
      let reg = /^[\u4e00-\u9fa5a-zA-Z]{1,20}$/gi;
      // console.log('---reg--',reg.test(value))
      if (!reg.test(value)) {
        return callback(new Error("仅支持输入中英文字符，不能超过20个字符。"));
      } else {
        callback();
      }
    };
    // 验证手机号
    const validateMobile = (rule, value, callback) => {
      let mobile = /^[1][3578][0-9]{9}$/
      if (!mobile.test(value)) {
        return callback(new Error("格式错误，请重新输入正确的手机号码"));
      } else {
        callback();
      }
    };
    const validateAddressDetail = (rule, value, callback) => {
      let reg = /\S+/
      if (!reg.test(value)) {
        return callback(new Error("必填项"));
      } else {
        callback();
      }
    };
    return {
      isLoading: false,
      isMapChoose: false,
      errWeekMsg: '',
      visible2: false,
      visible3: false,
      tempWeeks: [],
      ruleForm: {
        status: 1, // 0 停用 1 启用
        pickUpId: null,
        name: null,
        contactPerson: null,
        mobile: null,
        address: '',
        lat: null,
        lng: null,
        provinceCode: null,
        cityCode: null,
        areaCode: null,
        province: null,
        city: null,
        area: null,
        addressDetail: '',
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
      rules: {
        status: [
          { required: true, message: "必填项", trigger: "change" }
        ],
        name: [
          { required: true, message: "必填项", trigger: "blur" },
          { validator: validateName, trigger: "blur" }
        ],
        contactPerson: [
          { required: true, message: "必填项", trigger: "blur" },
          { validator: validateContactPerson, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "必填项", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" }
        ],
        deliveryTimeType: [
          { required: true, message: "必填项", trigger: "change" }
        ],
        address: [
          { required: true, message: "联系地址不能为空，请输入后点击搜索地图，在地图上选择准确位置", trigger: "blur" }
        ],
        addressDetail: [
          { required: true, message: "必填项", trigger: "blur" },
          { validator: validateAddressDetail, trigger: "blur" }
        ]
      },
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
      ]
    }
  },

  computed: {
    setTitle() {
      return this.$route.query && this.$route.query.id ? '编辑自提点' : '新建自提点'
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
    getTimeSlot() {
      return order.timeSlot
    }
  },

  watch: {},

  created() {},

  mounted() {
    this.init()
  },

  methods: {
    init() {
      const id = this.$route.query && +this.$route.query.id
      if (id) this.getSelfLiftById()
      // 如果通过地址库选择进入
      this.getAddressInfo()
    },
    getAddressById(id) {
      this._apis.set.getAddressDetail({ id }).then((res)=> {
        this.handleAddressEchoData(res)
      }).catch((err) => {
        this.$message.error(err || '获取数据失败')
      })
    },
    handleAddressEchoData(data) {
      this.ruleForm.contactPerson = data.name || null
      this.ruleForm.mobile = data.mobile || null
      this.ruleForm.address = data.address || ''
      this.ruleForm.addressDetail = data.addressDetail || ''
      this.ruleForm.lat = data.latitude || null
      this.ruleForm.lng = data.longitude || null
      this.ruleForm.provinceCode = data.provinceCode || null
      this.ruleForm.cityCode = data.cityCode || null
      this.ruleForm.areaCode = data.areaCode || null
      this.ruleForm.province = data.provinceName || null
      this.ruleForm.city = data.cityName || null
      this.ruleForm.area = data.areaName || null
      this.isMapChoose = true
    },
    getAddressInfo() {
      const id = this.$route.query && +this.$route.query.addressId
      if (id) {
        this.getAddressById(id)
      }
    },
    // 格式化 每天重复的小时时间段
    formatSubscribeTimeHourRanges(str) {
      if (!str) return false
      let arr = []
      arr = str.split(',')
      const date = new Date()
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      // month = month > 10 ? month : `0${month}`
      month = this.formatLessTenTime(month)
      let day = date.getDate()
      // day = day > 10 ? day : `0${day}`
      day = this.formatLessTenTime(day)
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
    handleEchoData(res) {
      this.ruleForm.deliveryTimeType = res.subscribeTimeType || 1 // 买家预约时间类型 1-全天 2-自定义
      this.ruleForm.repeatCycle = res.subscribeTimeCustomizeType || 1 // 买家预约时间自定义类型 1-每天重复 2-每周重复
      const defaultVal = [ 
        {
          start: '',
          end: ''
        }
      ]
      console.log('-----res.subscribeTimeHourRanges--', res.subscribeTimeHourRanges)
      this.ruleForm.timePeriods = this.formatSubscribeTimeHourRanges(res.subscribeTimeHourRanges) || defaultVal // 每天重复的小时时间段(~和逗号分隔): 00:00:00~00:01:00,00:08:00~00:09:00,00:13:00~00:14:00
      const weeks = this.formatSubscribeTimeWeekDays(res.subscribeTimeWeekDays) || [] // 以天为单位，每周重复的时间值(逗号分隔)：1,2,3,4,5,6,7
      this.ruleForm.weeks = weeks
      this.tempWeeks = weeks
      delete res.subscribeTimeHourRanges
      delete res.subscribeTimeWeekDays
      delete res.subscribeTimeType
      delete res.subscribeTimeCustomizeType
      this.ruleForm.status = res.pickUpStatus
      this.ruleForm.name = res.pickUpName || null
      this.ruleForm.contactPerson = res.name || null
      this.ruleForm.mobile = res.mobile || null
      this.ruleForm.address = res.address || ''
      this.ruleForm.addressDetail = res.addressDetail || ''
      this.ruleForm.provinceCode = res.provinceCode || null
      this.ruleForm.province = res.provinceName || null
      this.ruleForm.cityCode = res.cityCode || null
      this.ruleForm.city = res.cityName || null
      this.ruleForm.areaCode = res.areaCode || null
      this.ruleForm.area = res.areaName || null
      this.ruleForm.lng = res.longitude || null
      this.ruleForm.lat = res.latitude || null
      this.ruleForm.pickUpId = res.pickUpId || null
      this.isMapChoose = true
    },
    getSelfLiftById() {
      const id = this.$route.query && +this.$route.query.id
      this._apis.set.getSelfLiftById({ id }).then((response) => {
        this.handleEchoData(response)
      }).catch((err) => {
        this.$message.error(err || '获取数据失败')
      })
    },
    // 格式化小于10的年/月/日
    formatLessTenTime(date){
      return date >= 10 ? date : `0${date}`
    },
    getPrevVal(form, index, key) {
      console.log(form,index, key)
      if (index < 0) return null
      let prev =  form && form[index] && form[index][key]
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
    /**
     * 返回 fullField 中的索引值
     * @param { String } fullField timePeriods.0.start
     * @return { Number } -1 查找失败  
     */
    getRuleFullFieldIndex(fullField) {
      const arr = fullField.split('.') // .fullField: "timePeriods.1.start"
      const index = +arr[1] // 1
      return index !== -1 ? index : -1
    },
    /**
     * 此方法仅为了解决element-ui中的el-time-picker的bug
     * 重新处理时间，因为element-ui框架手动输入的时间与初始化时通过选择的时间的年月日不一致导致， 这里重新定义日期
     * @param { Date } 日期时间
     * @return { Timestamp } 时间戳
     */
    getTimestamp(datetime) {
      let curr = new Date(datetime)
      // 重新处理时间，因为element-ui框架手动输入的时间与初始化时通过选择的时间的年月日不一致导致， 这里重新定义日期
      const date = new Date()
      const year = date.getFullYear()
      const month = this.formatLessTenTime(date.getMonth() + 1)
      const day = this.formatLessTenTime(date.getDate())
      const hours = this.formatLessTenTime(curr.getHours())
      const minutes = this.formatLessTenTime(curr.getMinutes())
      const newValue = `${year}/${month}/${day} ${hours}:${minutes}:00`
      curr = new Date(newValue)
      curr = curr.getTime()
      return curr
    },
    // 校验时间区间start
    validateTimeRangesStart(rule, value, callback) {
      const index = this.getRuleFullFieldIndex(rule.fullField)
      const ruleForm = this.ruleForm.timePeriods
      const curr = this.getTimestamp(value)
      const len = ruleForm.length
      let isValid = true
      console.log('validateTimeRangesStart',curr, this.getTimestamp(ruleForm[index].end))
      if (index > 0) {
        let prev = this.getPrevVal(ruleForm, index - 1, 'start')
        if (prev) {
          this.$refs.ruleForm.clearValidate(`timePeriods.${this.prevIndex}.start`)
          prev = this.getTimestamp(prev)
          if (prev >= curr) {
            isValid = false
            callback(new Error('当前时间段的开始时间需晚于上一个时间段的开始时间'))
          }
        } 
      }
      if (index + 1 < len) {
        let next = this.getNextVal(ruleForm, index + 1, 'start')
        if (next) {
          this.$refs.ruleForm.clearValidate(`timePeriods.${this.nextIndex}.start`)
          next = this.getTimestamp(next)
          if (next <= curr) {
            isValid = false
            callback(new Error('当前时间段的开始时间不能晚于下一个时间段的开始时间。'))
          }
        }
      }
      // 获取后一个的值，进行校验处理
      if (ruleForm[index].end) {
        let end = this.getTimestamp(ruleForm[index].end)
        // this.$refs.ruleForm.clearValidate(`timePeriods.${index}.end`)
        if (curr > end) {
          isValid = false
          callback(new Error('结束时间不能早于开始时间'))
        }
        if (curr === end){
          isValid = false
          callback(new Error('结束时间不能等于开始时间'))
        } 
      }
      if (isValid) callback()
    },
    // 校验时间区间 end
    validateTimeRangesEnd(rule, value, callback) {
      const index = this.getRuleFullFieldIndex(rule.fullField)
      const ruleForm = this.ruleForm.timePeriods
      const curr = this.getTimestamp(value)
      const len = ruleForm.length
      let isValid = true
      console.log('validateTimeRangesEnd',curr, this.getTimestamp(ruleForm[index].start))
      if (index > 0) {
        let prev = this.getPrevVal(ruleForm, index - 1, 'end')
        if (prev) {
          this.$refs.ruleForm.clearValidate(`timePeriods.${this.prevIndex}.end`)
          prev = this.getTimestamp(prev)
          if (prev >= curr) {
            isValid = false
            callback(new Error('时间段可以交叉，不能重叠。'))
          }
        }
      }
      if (index + 1 < len) {
        let next = this.getNextVal(ruleForm, index + 1, 'end')
        if (next) {
          this.$refs.ruleForm.clearValidate(`timePeriods.${this.nextIndex}.end`)
          next = this.getTimestamp(next)
          if (next <= curr) {
            isValid = false
            callback(new Error('时间段可以交叉，不能重叠。'))
          }
        }
      }
      
      // // 获取后一个的值，进行校验处理
      if (ruleForm[index].start) {
      //   console.log('1111111')
        this.$refs.ruleForm.validateField(`timePeriods.${index}.start`)
      //   let start = this.getTimestamp(ruleForm[index].start)
      //   // this.$refs.ruleForm.clearValidate(`timePeriods.${index}.start`)
      //   if (curr < start) { 
      //     isValid = false
      //     callback(new Error('结束时间不能早于开始时间')) 
      //   }
      //   if (curr === start) {
      //     isValid = false
      //     callback(new Error('结束时间不能等于开始时间'))
      //   }
      }
      if (isValid) callback()
    },
    clearValidate(key) {
      const arr = []
      const timePeriods = this.ruleForm.timePeriods
      timePeriods.forEach((item, index) => {
        arr.push(`timePeriods.${index}.${key}`)
      })
      this.$refs.ruleForm.clearValidate(arr)
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
    handleRepeatCycleChange(val) {
      console.log('---val--', val)
      // if (val === 1) {
      //   this.ruleForm.weeks = []
      //   this.tempWeeks = []
      // }
    },

    getHourMinuteSecond(start) {
       const date = new Date(start)
        let hour = date.getHours()
        let minute = date.getMinutes()
        // let second = date.getSeconds()
        // console.log('getHourMinuteSecond:before',hour,minute,second)
        hour = +hour >= 10 ? hour : `0${hour}`
        minute = +minute >= 10 ? minute : `0${minute}`
        // second = +second >= 10 ? second : `0${second}`
        // console.log('getHourMinuteSecond:after',hour,minute,second)
        return `${hour}:${minute}`

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
    getReqData() {
      let id = this.$route.query && +this.$route.query.id
      id = id ? { id } : null
      const ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
      const subscribeTimeCustomizeType = ruleForm.repeatCycle
      const subscribeTimeType = ruleForm.deliveryTimeType
      let subscribeTimeHourRanges
      if (subscribeTimeType === 2) {
        subscribeTimeHourRanges = { subscribeTimeHourRanges: this.getSubscribeTimeHourRanges()} // this.ruleForm.
      }
      let subscribeTimeWeekDays = ruleForm.weeks.length > 0 ? { subscribeTimeWeekDays:ruleForm.weeks.sort().join(',')  } : null
      // delete ruleForm.weeks
      // delete ruleForm.timePeriods
      // delete ruleForm.repeatCycle
      // delete ruleForm.deliveryTimeType
      const pickUpName = ruleForm.name
      const address = ruleForm.address
      const addressDetail = ruleForm.addressDetail
      const name = ruleForm.contactPerson
      const pickUpStatus = ruleForm.status
      const provinceCode = ruleForm.provinceCode
      const provinceName = ruleForm.province
      const cityCode = ruleForm.cityCode
      const cityName = ruleForm.city
      const areaCode = ruleForm.areaCode
      const areaName = ruleForm.area
      const longitude = ruleForm.lng
      const subscribe_time_type = subscribeTimeType
      const mobile = ruleForm.mobile
      const latitude = ruleForm.lat
      return{
        ...id,
        pickUpName,
        name,
        mobile,
        address,
        addressDetail,
        pickUpStatus,
        provinceCode,
        provinceName,
        cityCode,
        cityName,
        areaCode,
        areaName,
        longitude,
        latitude,
        subscribeTimeType,
        subscribeTimeCustomizeType,
        ...subscribeTimeHourRanges,
        ...subscribeTimeWeekDays
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm.weeks = [], // 重复日
      this.ruleForm.timePeriods = [ 
        {
          start: '',
          end: ''
        }
      ]
      this.ruleForm.province = null
      this.ruleForm.provinceCode = null
      this.ruleForm.city = null
      this.ruleForm.cityCode = null
      this.ruleForm.area = null
      this.ruleForm.areaCode = null
      this.tempWeeks = []
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
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid && isValidWeeks) {
          if (!this.isMapChoose) {
            this.$message.error('保存失败')
            this.ruleForm.address = ''
            this.$refs.ruleForm.validateField('address')
            this.isLoading = false
            return false
          }
          this.isLoading = true
          const id = this.$route.query && this.$route.query.id
          const req = this.getReqData()
          console.log('req',req)
          const p1 = id ? this._apis.set.editSelfLiftById(req) : this._apis.set.addSelfLift(req)
          p1.then((res) => {
            let txt = ''
            if (!id) {
              const url = `${location.protocol}//${location.host}/bp/set/addSelfLift`
              txt = `<span class="success" style="font-size:16px;color:rgba(68,67,75,1);">保存成功！</span><span class="prompt" style="font-size:12px;color:rgba(68,67,75,1);"><a href="${url}" style="color:#655EFF;text-decoration: underline;">继续新建自提点</a></span>`
            } else {
              txt = `<span class="success" style="font-size:16px;color:rgba(68,67,75,1);">保存成功！</span>`
            }
            this.confirm({
              title: "",
              iconSuccess: true,
              text: txt,
              showConfirmButton: false,
              confirmText: '我知道了',
              customClass: 'setting-custom',
              showCancelButton: false
            }).catch(() => {
              this.$router.push({ path: '/set/selfLift'})
            })
          }).catch((err) => {
            this.$message.error(err || '保存失败')
          }).finally(() => {
            this.isLoading = false
          })

        } else {
          console.log('error submit!!');
          this.isLoading = false
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
      this.ruleForm.address = poi.address
      this.ruleForm.lat = poi.location.lat
      this.ruleForm.lng = poi.location.lng
      this.isMapChoose = true
      this.ruleForm.provinceCode = poi.provinceCode;
      this.ruleForm.cityCode = poi.areaCode;
      this.ruleForm.areaCode = poi.areaCode;
      this.ruleForm.province = poi.provinceName
      this.ruleForm.city = poi.cityName
      this.ruleForm.area = poi.areaName
      this.$nextTick(() => {
        this.$refs.ruleForm.validateField('address')
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.addSelfLift {
  background-color: #fff;
  padding: 15px 20px 50px 20px;
  >h2 {
    padding-bottom: 30px;
    font-size:16px;
    font-weight:500;
    color:rgba(22,22,23,1);
  }
  .addressDetail {
    padding-bottom: 22px;
  }
  .form-area {
    position: relative;
    .status {
      position: absolute;
      left: 600px;
      z-index: 2;
      .radio {
        display: block;
        padding-bottom: 17px;
        margin-left: 0;
        &:first-of-type {
          padding-top: 9px;
        }
      }
    }
  }
  .box {
    padding-top:40px;
    border-top: 1px dashed #D3D3D3;
    // margin-left: 120px;
    // background:rgba(249,249,249,1);
    // padding: 20px;
    // margin-bottom:20px;
    // .deliveryTimeType {
    //   /deep/ .el-form-item__content {
    //     margin-left: 0 !important;
    //   }
    // }
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

    .delivery-time {
      background:rgba(249,249,249,1);
      margin-left: 148px;
      padding: 20px;
      /deep/ .el-form-item__content {
        margin-left: 0 !important;
      }
      // .box {
      //   margin-left: 140px;
      // }
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
          padding: 0 10px 0 25px;
          font-size:14px;
          font-weight:400;
          color:rgba(68,67,75,1);
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
        height: 32px;
        box-sizing: content-box;
        &-add {
          position: absolute;
          left: 105px;
          top: 0;
          border-radius:4px;
          border:1px solid rgba(101,94,255,1);
          font-size:14px;
          font-weight:400;
          color:rgba(101,94,255,1);
          background-color: transparent;
          &:hover {
            color:rgba(101,94,255,1);
            background-color: transparent;
          }
        }
      }
    }
  }
  .btn-area {
    padding-top: 40px;
    text-align: center;
    .submit {
      margin: 0 auto;
    }
  }
}
.timeslot-popover {
  position: relative;
  padding-top: 15px;
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