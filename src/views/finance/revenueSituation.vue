<!--营收状况-->
<template>
  <div>
    <div class="top_part">
      <div class="title">
        <span class="name">当日营收</span>
        <el-popover
          placement="top-start"
          title="数据说明"
          width="300"
          trigger="hover">
          <div>
            <!-- <p>1、总收入即所有线上订单支付的总金额，含所有线上支付和线下支付的所有订单，支付完成后计入；</p> -->
            <p>1、总收入即各端所有线上订单支付的总金额，含所有线上支付和线下支付的所有订单，支付完成后计入；</p>
            <!-- <p>2、总支出即所有线上支出的总金额，含订单退款、用户ID提现的金额，退款成功或提现成功后计入；</p> -->
            <p>2、总支出即所有线上支出的总金额，含订单退款、用户提现的金额，退款成功或提现成功后计入；</p>
            <p>3、实际收入 = 总收入 - 总支出；</p>
            <!-- <p>4、每日数据为当日0时0分0秒到23时59分59秒的数据，今日数据为当日0点后的实时数据；</p> -->
            <p>4、当日营收为当日的总收入、总支出、实际收入数据，每个整点更新；</p>
            <p>5、趋势分析中最近一周，最近一个月等数据中不包含今日数据；</p>
          </div>
          <el-button slot="reference" class="data_note">
            <i class="el-icon-warning-outline"></i>
            查看数据说明
          </el-button>
        </el-popover>
      </div>
      <div class="data_statistics">
        <div class="item">
          <span class="money">总收入（{{ surveyDay.income | displayMoney}}）</span>
          <span class="num">
            <em>{{ surveyDay.income.toFixed(2) | money }}</em>
          </span>
        </div>
        <div class="item">
          <span class="money">总支出（{{surveyDay.expend | displayMoney}}）</span>
          <span class="num">
            <em>{{surveyDay.expend.toFixed(2) | money}}</em>
          </span>
        </div>
        <div class="item">
          <span class="money">实际收入（{{surveyDay.realIncome | displayMoney}}）</span>
          <span class="num">
            <em>{{surveyDay.realIncome.toFixed(2) | money}}</em>
          </span>
        </div>
        <span 
        class="details" 
        @click="_routeTo('revenueExpenditureDetails')"
        v-permission="['财务', '营收状况', '默认页面', '收支明细']"
        >
        收支明细
        </span>
      </div>
    </div>
    <div class="under_part bor-radius" v-calcMinHeight="280">
      <div class="title">
        <span class="name">趋势分析<em>（截止到昨日）</em></span>
        <div class="time">
          <el-radio-group v-model="days" class="mr26">
            <el-radio-button label="7">最近7天</el-radio-button>
            <el-radio-button label="15">最近15天</el-radio-button>
            <el-radio-button label="30">最近30天</el-radio-button>
            <el-radio-button label="1">自定义时间</el-radio-button>
          </el-radio-group>
          <span v-if="isCustomTime">
            <el-date-picker
              class="mr26"
              v-model="timeValue"
              type="datetimerange"
              align="right"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              :editable="false"
              @focus="utils.globalTimeDisabledFocus"
              :picker-options="Object.assign(utils.globalTimePickerOption.call(this, false), this.pickerOptions)"
              >
            </el-date-picker>
            <el-button type="primary" @click="getDataDateRs">确定</el-button>
          </span>
        </div>
      </div>
      <div class="data_statistics">
        该时间段内
        <div class="item">
          <span class="money">总收入（{{survey.income | displayMoney}}）</span>
          <span class="num">
            <em>{{survey.income | money}}</em>
            <span v-if="survey.chainRatioIncome != null">
               <el-popover v-if="survey.chainRatioIncome >= 0" placement="top-start" title="" width="130" trigger="hover">
                <p>环比上升{{survey.chainRatioIncome}}%</p>
                <i class="el-icon-top red" slot="reference"></i>
              </el-popover>              
              <el-popover v-else-if="survey.chainRatioIncome == 0"  placement="top-start" title="" width="130" trigger="hover">
                <p>环比持平{{survey.chainRatioIncome}}%</p>
                  <img src="@/assets/images/finance/gray.png" class="gray" slot="reference">
              </el-popover>              
              <el-popover v-else placement="top-start" title="" width="130" trigger="hover">
                <p>环比下降{{survey.chainRatioIncome}}%</p>
                <i class="el-icon-bottom green" slot="reference"></i>
              </el-popover>
            </span>
          </span>
        </div>
        <div class="item">
          <span class="money">总支出（{{survey.expend | displayMoney}}）</span>
          <span class="num">
            <em>{{survey.expend | money}}</em>
            <span v-if="survey.chainRatioExpend != null">
              <el-popover v-if="survey.chainRatioExpend >= 0" placement="top-start" title="" width="130" trigger="hover">
                <p>环比上升{{survey.chainRatioExpend}}%</p>
                <i class="el-icon-top red" slot="reference"></i>
              </el-popover>              
              <el-popover v-else-if="survey.chainRatioExpend == 0"  placement="top-start" title="" width="130" trigger="hover">
                <p>环比持平{{survey.chainRatioExpend}}%</p>
                  <img src="@/assets/images/finance/gray.png" class="gray" slot="reference">
              </el-popover>              
              <el-popover v-else placement="top-start" title="" width="130" trigger="hover">
                <p>环比下降{{survey.chainRatioExpend}}%</p>
                <i class="el-icon-bottom green" slot="reference"></i>
              </el-popover>
            </span>
          </span>
        </div>
        <div class="item">
          <span class="money">实际收入（{{ survey.realIncome | displayMoney}}）</span>
          <span class="num">
            <em>{{ survey.realIncome | money}}</em>
            <span v-if="survey.chainRatioRealIncome != null">
              <el-popover v-if="survey.chainRatioRealIncome >= 0" placement="top-start" title="" width="130" trigger="hover">
                <p>环比上升{{survey.chainRatioRealIncome}}%</p>
                <i class="el-icon-top red" slot="reference"></i>
              </el-popover>              
              <el-popover v-else-if="survey.chainRatioRealIncome == 0"  placement="top-start" title="" width="130" trigger="hover">
                <p>环比持平{{survey.chainRatioRealIncome}}%</p>
                  <img src="@/assets/images/finance/gray.png" class="gray" slot="reference">
              </el-popover>              
              <el-popover v-else placement="top-start" title="" width="130" trigger="hover">
                <p>环比下降{{survey.chainRatioRealIncome}}%</p>
                <i class="el-icon-bottom green" slot="reference"></i>
              </el-popover>
            </span>
          </span>
        </div>
      </div>
      <financeChart class="financeChart" :dataList="chartData"></financeChart>
    </div>
  </div>
</template>

<script>
import utils from "@/utils";
import financeChart from './components/financeChart';
export default {
  name: 'revenueSituation',
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          
          // var date = new Date();
          // if(utils.formatDate(date, "yyyy-MM-dd") == utils.formatDate(time, "yyyy-MM-dd") ){
          //   this.defaultTime[1] = utils.formatDate(date, "yyyy-MM-dd hh:mm:ss").substring(11)
          //   console.log(utils.formatDate(date, "yyyy-MM-dd hh:mm:ss").substring(11));
          // }
          // return time.getTime() > new Date();
          let yesterday = new Date();
          yesterday = yesterday.getTime()-24*60*60*1000;
          yesterday = this.utils.dayEnd(yesterday);
          return time.getTime() > yesterday.getTime();
        }
      },
      timeValue:[],
      surveyDay:{
        income:0,
        expend:0,
        realIncome:0
      },
      survey:{
        income:0,
        expend:0,
        realIncome:0,
        chainRatioExpend:0, 
        chainRatioIncome:0,
        chainRatioRealIncome:0 
      },
      defaultTime:['00:00:00', '23:59:59'],
      dataList:[],
      days:7,
      chartData:{},
      isCustomTime:false,//是否自定义时间
    }
  },
  components: {financeChart},
  watch: {
    days(newValue,oldValue){
      if(newValue == 1){
        this.isCustomTime = true
      }else{
        this.isCustomTime = false
        this.getDataNumRs()
        this.init(this.days)
      }
    },
    dataList(){
      let dataObj = {
        dates:[],
        incomes:[],
        expends:[],
        realIncomes:[]
      }
      this.dataList.map(item =>{
        item.accountDate = item.accountDate.substring(0,10)
        dataObj.dates.push(item.accountDate)
        dataObj.incomes.push(item.income)
        dataObj.expends.push(item.expend)
        dataObj.realIncomes.push(item.realIncome)
      })
      this.chartData = dataObj
    },
  },
  filters:{
      money(options){
        if(Math.abs(Math.round(options))>9999){
          return (Math.round(options)/10000).toFixed(2)
        }else{
            return options
        }
      },
      displayMoney(options){
        if(Math.abs(Math.round(options))>9999){
          return "万元"
        }else{
            return "元"
        }
      }

  },
  created() {
    this.init(7);
    this.getDataDateRs();
    this.getSurveyDay();
  },
  methods: {
    //格式化最近日期
    nearDays(num) {
      let Num = Number(num);
      let arr = [];
      for(let i = 3; i < Num + 2; i++) {
        arr.push(utils.formatDate(utils.calcDate(new Date(), '-', i), "yyyy-MM-dd"))
      }
      return arr;
    },
    //初始化数据
    init(day){
      let date = new Date()
      let yesterday = new Date(date.getTime()-24*60*60*1000);
      yesterday.setHours(23);
      yesterday.setMinutes(59);
      yesterday.setSeconds(59);
      let endDate = utils.formatDate(yesterday, 'yyyy-MM-dd hh:mm:ss');
      let startDate = utils.countDate(-day)+" 00:00:00"
      this.timeValue = [startDate,endDate];
      this.chartData = {dates: [].concat(this.nearDays(day))}
    },
    //概况
    getSurveyDay(){
      this._apis.finance.getSurveyDayRs({}).then((response)=>{
        this.surveyDay = response
      }).catch((error)=>{
        this.$message.error(error)
      })
    },
    //时间段趋势
    getDataDateRs(){
      let queryDate = {
        accountDateStart:this.timeValue[0],
        accountDateEnd:this.timeValue[1]
      }
      this._apis.finance.getDataDateRs(queryDate).then((response)=>{
        if(response){
          this.survey = response   
          this.dataList = response.accountList;
        }else{
          // this.$notify.info({
          //   title: '消息',
          //   message: "查询结果集为空，没有可以显示的数据"
          // });
          let startDate = Date.parse(queryDate.accountDateStart);
          let endDate = Date.parse(queryDate.accountDateEnd);
          let days=parseInt((endDate - startDate)/(1*24*60*60*1000));
          if(days == this.days) {
            this.init(Number(this.days));
          }else{
            this.init(Number(days));
          }
        }
      }).catch((error)=>{
        this.$message.error(error)
      })
    },
    //最近天数趋势
    getDataNumRs(){
      this._apis.finance.getDataNumRs({recentDays:this.days}).then((response)=>{
        if(response){
          this.survey = response
          this.dataList = response.accountList
        }else{
          // this.$notify.info({
          //   title: '消息',
          //   message: "查询结果集为空，没有可以显示的数据"
          // });
          // this.days = 7
          this.chartData = {dates: [].concat(this.nearDays(this.days))}
          return
        }
      }).catch((error)=>{
        this.chartData = {dates: [].concat(this.nearDays(this.days))}
        this.$message.error(error)
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.red{
  color: red;
}
.green{
  color:green;
}
.gray{
  width: 20px;
  height: 20px;
  display: inline-block;
  // background: url('@/assets/images/finance/gray.png')
}
.top_part{
  width: 100%;
  height: 160px;
  background: #fff;
  border-radius: 4px;
  padding: 20px;
    .title{
      display: flex;
      flex: 1;
      flex-direction:row;
      justify-content: space-between;
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
      border:1px solid #655EFF;
      border-radius: 4px;
      font-size: 14px;
      text-align: center;
      color: #655EFF;
      cursor: pointer;
    }
  }
}
.under_part{
  width: 100%;
  background: #fff;
  margin-top: 20px;
  padding: 0px 20px;
  .title{
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #CACFCB;
    display: flex;
    justify-content: space-between;
    .name{
      color: #161617;
      font-size: 16px;
      em{
        font-size: 12px;
        color: #666;
        text-decoration: none;
      }
    }
    ul{
      width: 123px;
      height: 50px;
      line-height: 50px;
      display: inline-flex;
      flex: 1;
      margin:10px 0 0 64px;
      li{
        width: 60px;
        text-align: center;
        margin-right: 30px;
        cursor: pointer;
      }
      li:hover{
        border-bottom:2px solid #655EFF;
      }
    }
    .time{
      display: inline-block;
    }
  }
  .data_statistics{
    width: 700px;
    display: flex;
    flex: 1;
    flex-direction:row;
    justify-content: space-between;
    margin-top: 30px;
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
.financeChart{
  margin-top: 30px;
}
.mr26{
  margin-right: 26px;
}
.el-radio-group label:last-child{
  margin-left:0px;
}

</style>
