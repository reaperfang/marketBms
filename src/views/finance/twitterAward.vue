<!--推客奖励-->
<template>
  <div>
    <div class="top_part1">
      <div class="title">
        <div>
          <span class="name">概况分析</span>
          <el-select v-model="flag" placeholder="开店以来" style="margin-left:10px;">
            <el-option
              v-for="item in surveyStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-popover
          placement="top-start"
          title="数据说明"
          width="300"
          trigger="hover">
          <div>
            <p>1、总收入即所有线上订单支付的总金额，含所有线上支付和线下支付的所有订单，支付完成后计入；</p>
            <p>2、总支出即所有线上支出的总金额，含订单退款、客户ID提现的金额，退款成功或提现成功后计入；</p>
            <p>3、实际收入 = 总收入 - 总支出；</p>
            <p>4、每日数据为当日0时0分0秒到23时59分59秒的数据，今日数据为当日0点后的实时数据；</p>
            <p>5、最近一周，最近一个月等数据中包含今日数据；</p>
          </div>
          <el-button slot="reference" class="data_note">
            <i class="el-icon-warning-outline"></i>
            查看数据说明
          </el-button>
        </el-popover>
      </div>
      <div class="data_statistics">
        <div class="item">
          <span class="money">累计发放红包</span>
          <span class="num">
            <em>{{survey.hongbao || 0}}元</em>
          </span>
        </div>
        <div class="item">
          <span class="money">累计发放积分</span>
          <span class="num">
            <em>{{survey.integrate || 0}}</em>
          </span>
        </div>
        <div class="item">
          <span class="money">累计发放优惠券</span>
          <span class="num">
            <em>{{survey.coupon || 0}}张</em>
          </span>
        </div>
        <div class="item">
          <span class="money">累计发放优惠码</span>
          <span class="num">
            <em>{{survey.couponCode || 0}}个</em>
          </span>
        </div>
        <div class="item">
          <span class="money">累计发放赠品</span>
          <span class="num">
            <em>{{survey.gift || 0}}个</em>
          </span>
        </div>
      </div>
    </div>
    <taTable style="margin-top:20px"></taTable>
  </div>
</template>

<script>
import utils from "@/utils";
import taTable from './components/taTable'
import financeCons from '@/system/constant/finance'
export default {
  name: 'twitterAward',
  components:{ taTable },
  data() {
    return {
      flag:4,
      survey:{
        hongbao:0,
        integrate:0,
        coupon:0,
        couponCode:0,
        gift:0
      },
    }
  },
  watch: { 
    flag(){
      this.getSurvey()
    }
  },
  computed:{
    surveyStatus(){
      return financeCons.surveyStatus;
    },
  },
  created() {
    this.getSurvey();
  },
  methods: {
    //概况
    getSurvey(){
      this._apis.finance.statisticsTa({flag:this.flag}).then((response)=>{
        this.survey = response
      }).catch((error)=>{
        this.$message.error(error);
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.top_part1{
  width: 100%;
  background: #fff;
  border-radius: 3px;
  padding: 15px 20px;
    .title{
      height: 74px;
      line-height: 74px;
      display: flex;
      flex: 1;
      flex-direction:row;
      justify-content: space-between;
      border-bottom: 1px solid #CACFCB;
      .name{
        color: #161617;
        font-size: 16px;
      }
      .data_note{
        color: #655EFF;
        font-size: 14px;
        cursor: pointer;
        border:none;
      }
    }
  .data_statistics{
    display: flex;
    flex: 1;
    flex-direction:row;
    justify-content: space-between;
    margin-top: 30px;
    padding: 0 20px;
    .item{
      .money{
        height: 21px;
        line-height: 21px;
        display: block;
        font-size: 16px;
        color: #A7ABC3;
      }
      .num{
        height: 40px;
        line-height: 40px;
        display: block;
        font-size: 28px;
        color: #655EFF;
        em{
          font-style: normal;
        }
      }
    }
  }
}
</style>
