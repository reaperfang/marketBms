<!--短信群发-->
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
        <!-- <el-popover
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
        </el-popover> -->
      </div>
      <div class="data_statistics">
        <div class="item">
          <span class="money">累计充值金额</span>
          <span class="num">
            <em>{{survey.rechargeSum || 0}}元</em>
          </span>
        </div>
        <div class="item">
          <span class="money">预计可发送短信条数</span>
          <span class="num">
            <em>{{survey.smsLeftCount || 0}}条</em>
          </span>
        </div>
        <div class="item">
          <span class="money">当前短信余额</span>
          <span class="num">
            <em>{{survey.accountBalance || 0}}元</em>
          </span>
        </div>
        <div class="item">
          <span class="money">已发送短信（营销）</span>
          <span class="num">
            <em>{{survey.marketingSmsSentCount || 0}}条</em>
          </span>
        </div>
        <div class="item">
          <span class="money">已发送短信（通知）</span>
          <span class="num">
            <em>{{survey.notifySmsSentCount || 0}}条</em>
          </span>
        </div>
        <div>
          <span class="details" v-permission="['财务', '短信成本', '默认页面', '充值记录']" @click="toRecord">充值记录</span>
          <span class="details" v-permission="['财务', '短信成本', '默认页面', '申请开票']" @click="applyTicket">申请开票</span>
        </div>
      </div>
    </div>
    <sgsTable style="margin-top:20px"></sgsTable>
  </div>
</template>

<script>
import utils from "@/utils";
import Blob from '@/excel/Blob'
import Export2Excel from '@/excel/Export2Excel.js'
import sgsTable from './components/sgsTable'
import financeCons from '@/system/constant/finance'
import { mapMutations } from 'vuex'
export default {
  name: 'smsGroupSends',
  components:{ sgsTable },
  data() {
    return {
      flag:4,
      survey:{
        accountBalance:0,
        marketingSmsSentCount:0,
        notifySmsSentCount:0,
        rechargeSum:0,
        smsLeftCount:0
      },
    }
  },
  computed:{
    surveyStatus(){
      return financeCons.surveyStatus;
    },
    smsStatus(){
      return financeCons.smsStatus;
    }
  },
  watch: {
    flag(){
      this.getSurvey()
    }
  },
  created() {
    this.getSurvey();
  },
  methods: {
    ...mapMutations(['SETCURRENT']),
    //概况
    getSurvey(){
      this._apis.finance.smsStatistics({flag:this.flag}).then((response)=>{
        this.survey = response
      }).catch((error)=>{
        this.$message.error(error);
      })
    },
    //充值记录
    toRecord(){
      this.$router.push({path:'/apply',params:{paths:'/application/toolapp/paySms'}})
      this.SETCURRENT(8)
    },
    //申请开票
    applyTicket(){
      this.$router.push({path:'/apply',params:{paths:'/application/toolapp/rechargeHistory'}})
      this.SETCURRENT(8)
    }
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
    .details{
      width: 80px;
      height: 34px;
      line-height: 34px;
      display: inline-block;
      border:1px solid #655EFF;
      border-radius: 4px;
      font-size: 14px;
      text-align: center;
      color: #655EFF;
      cursor: pointer;
    }
  }
}
</style>
