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
          北京市北京市东城区长保大厦
          <el-button type="text">修改</el-button>
        </el-form-item>
        <el-form-item label="配送范围设置：" prop="radiusType" class="item">
          <!-- <label>配送范围设置：</label> -->
          <p class="prompt">收货地址在配送范围之外的买家将无法使用商家配送</p>
          <el-radio-group v-model="ruleForm.radiusType">
            <el-radio label="1">按服务半径</el-radio>
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
        <div class="map"></div>
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
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">关闭</el-radio>
          </el-radio-group>
          <p class="prompt">
            <span>说明：</span>配送距离按步行距离计算，非地图直线距离；起送重量为空时，按不限配送重量计算； 实际配送距离大于起送半径，不满增加公里数，运费按增加计算;实际配送重量大于起送重量，不满增加重量 运费按增加计算，依次类推;
          </p>
        </el-form-item>
        <div class="freight-range" v-if="ruleForm.isOpenLadderFreight === '1'">
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
      <section class="section dashed delivery-time">
        <el-form-item>
          <div>
              <el-radio v-model="ruleForm.isReservationDelivery" label="1">不开启预约配送</el-radio>
              <span class="prompt">
                说明：仅支持当天配送，默认可配送时间为当天06:00:00~20:00:00。点击
                <el-popover
                  placement="top"
                  width="400"
                  trigger="click">
                  <el-button slot="reference" type="text" class="time-range">查看买家可选时间段</el-button>
                </el-popover>
              </span>
          </div>
          <el-radio v-model="ruleForm.isReservationDelivery" label="2">开启预约配送</el-radio>
        </el-form-item>
      </section>
     </el-form>
  </div>
</template>

<script>

import { debounce } from '@/utils/base.js'
export default {
  components: {},

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
    return {
      isOpen: false,
      ruleForm: {
        radiusType: '1',  // 配送范围设置类型
        radius: null, //  配送半径
        price: null, // 起送价
        basicFreight: null, // 基础运费
        isOpenLadderFreight: '0', // 是否启用阶梯运费
        distanceLt: null, // 配送距离不大于
        weightLt: null ,// 重量不超过 
        distancePlus: null, // 配送距离每增加
        distancePlusPrice: null, // 配送距离运费增加
        weightPlus: null, // 配送重量每增加
        weightPlusPrice: null, // 配送重量运费增加 
        isReservationDelivery: '1' // 是否开启预约配送
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
        ]
      },
      _formatDecimals: null
    }
  },

  computed: {
    getSwitchTxt() {
      return this.isOpen ? '已开启' : '已关闭'
    }
  },

  watch: {},

  created() {
     this._formatDecimals = debounce(this.formatDecimals, 500)
  },

  mounted() {
  },

   methods: {
     formatDecimals(val, key, digits = 2) {
      if (Number.isNaN(+val)) {
        return false
      }
      this.ruleForm[key] = Number(val).toFixed(digits) 
     },
     handleIsOpen() {},
     handleDecimals(val,key, digits) {
       this._formatDecimals(val, key, digits)
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
        height: 400px;
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
        margin-left: 120px;
        background:rgba(249,249,249,1);
        padding: 20px;
        margin-bottom:20px;
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
      .time-range {
        color: #3D434A;
        span {
          text-decoration: underline;
        }
      }
    }
  }
</style>