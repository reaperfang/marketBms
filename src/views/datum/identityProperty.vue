<template>
  <div class="p_container">
    <div class="clearfix">
      <div class="fr">
        <!-- <el-radio-group class="fr" v-model="visitSourceType" @change="all">
          <el-radio-button class="btn_bor" label="0" v-permission="['数据', '身份属性', '全部']">全部</el-radio-button>
          <el-radio-button class="btn_bor" label="1" v-permission="['数据', '身份属性', '小程序']">小程序</el-radio-button>
          <el-radio-button class="btn_bor" label="2" v-permission="['数据', '身份属性', '公众号']">公众号</el-radio-button>
        </el-radio-group>-->
      </div>
    </div>
    <div class="pane_container">
      <p class="i_title">属性比例：</p>
      <div class="chart1_container clearfix">
        <div class="chart1">
          <ip1Chart :title="'测试图表'" ref="ip1"></ip1Chart>
        </div>
        <div class="chart1_info">
          <p>累计客户数：{{grandTotal}}</p>
          <p>非会员：占比 {{(data1.customerRatio*100).toFixed(2)}}% 人数 {{data1.customerNum}}</p>
          <p>
            会员：占比 {{(data1.memberRatio*100).toFixed(2)}}% 人数 {{data1.memberNum}}
            <span
              @click="_routeTo('allClient')"
            >查看详情</span>
          </p>
        </div>
      </div>
      <p class="i_title">会员增长趋势:</p>
      <div class="i_line">
        <el-radio-group v-model="nearDay1" @change="changeDayM">
          <el-radio-button class="btn_bor" label="7">最近7天</el-radio-button>
          <el-radio-button class="btn_bor" label="15">最近15天</el-radio-button>
          <el-radio-button class="btn_bor" label="30">最近30天</el-radio-button>
          <el-radio-button class="btn_bor" label="4">自定义时间</el-radio-button>
        </el-radio-group>
        <div class="input_wrap" v-if="nearDay1 == 4">
          <el-date-picker
            v-model="date1"
            type="daterange"
            range-separator="—"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="changeDate1"
          ></el-date-picker>
          <!-- <el-date-picker v-model="date1" type="month" @change="changeDate1" placeholder="选择日期" :picker-options="pickerOptions"></el-date-picker> -->
        </div>
      </div>
      <div class="chart2_container">
        <ip2Chart :title="'测试图表'" ref="ip2"></ip2Chart>
      </div>
      <p class="i_title">支付趋势：</p>
      <div class="i_line clearfix">
        <el-radio-group v-model="nearDay2" @change="changeDayPay">
          <el-radio-button class="btn_bor" label="7">最近7天</el-radio-button>
          <el-radio-button class="btn_bor" label="15">最近15天</el-radio-button>
          <el-radio-button class="btn_bor" label="30">最近30天</el-radio-button>
          <el-radio-button class="btn_bor" label="4">自定义时间</el-radio-button>
        </el-radio-group>
        <div class="input_wrap" v-if="nearDay2 == 4">
          <el-date-picker v-model="date2" type="month" @change="changeDate2" placeholder="选择月份" :picker-options="pickerOptions"></el-date-picker>
        </div>
        <span class="fr" @click="toLink()">会员消费</span>
      </div>

      <div class="chart3_container clearfix">
        <div class="chart3">
          <ip3Chart :title="'测试图表'" ref="ip3"></ip3Chart>
        </div>
        <div class="chart3_info">
          <el-row :gutter="20">
            <el-col :span="4">
              <p>
                <span class="color_block" style="background-color:#A1E174 "></span>
              </p>
              <p>
                <span class="color_block" style="background-color:#578EFA "></span>
              </p>
              <p>
                <span class="color_block" style="background-color:#FD932B "></span>
              </p>
              <p>
                <span class="color_block" style="background-color:#FD4C2B "></span>
              </p>
            </el-col>
            <el-col :span="8">
              <p class="color_block" v-for="(item,index) in threeData.xAxis">支付 {{item}} 次</p>
            </el-col>
            <el-col :span="6">
              <p class="color_block" v-for="(item,index) in threeData.yAxis">{{item}}人</p>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/utils';
import ip1Chart from "./components/ip1Chart";
import ip2Chart from "./components/ip2Chart";
import ip3Chart from "./components/ip3Chart";
export default {
  name: "identityProperty",
  components: { ip1Chart, ip2Chart, ip3Chart },
  data() {
    return {
      pickerOptions: {
          onPick: ({ maxDate, minDate }) => {
              this.pickerMinDate = minDate.getTime()
              if (maxDate) {
              this.pickerMinDate = ''
              }
          },
          disabledDate: (time) => {
              if (this.pickerMinDate !== '') {
              const day90 = (90 - 1) * 24 * 3600 * 1000
              let maxTime = this.pickerMinDate + day90
              if (maxTime > new Date()) {
                  maxTime = new Date()- 8.64e7
              }
              return time.getTime() > maxTime || time.getTime() == this.pickerMinDate
              }
              return time.getTime() > Date.now()
          }
      },
      visitSourceType: "0",
      nearDay1: "7",
      nearDay2: "7",
      timeM: "",
      timePay: "",
      attrData: {},
      membeData: {},
      payData: {},
      dataChart: {},
      threeData: {},
      grandTotal: "",
      //属性比例需要字段如下
      data1: {},
      //会员增长趋势需要字段如下
      date1: "",
      startTime1: "",
      endTime1: "",
      //支付趋势需要字段
      date2: '',
      startTime2: "",
      endTime2: ""
    };
  },
  created() {
    this.getAttributeRatio();
    this.getMemberTrend();
    this.getPaymentTrend();
  },
  methods: {
    toPersent(num) {
      let str = Number(num*100);
      str+='%';
      return str;
    },
    getDate(date) {
      return utils.formatDate(new Date(date), "yyyy-MM-dd hh:mm:ss");
    },

    /*
     **属性比例
     */

    getAttributeRatio() {
      let data = {
        source: null
      };
      this._apis.data
        .attributeRatio(data)
        .then(response => {
          this.grandTotal = response.memberNum + response.customerNum;
          this.data1 = Object.assign({}, response);
          let arr = [];
          //arr.push({ value: 10, name: "非会员" }, { value: 20, name: "会员" });
          arr.push({value: response.customerNum ,name: '非会员'},{value: response.memberNum ,name: '会员'});
          this.$refs.ip1.con(arr);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    //获取开始日期及结束日期
    getTimeArr(val) {
      let curDate = new Date(val);
      let curDate2 = new Date(val);
      let curMonth = curDate.getMonth();
      curDate.setMonth(curMonth + 1)      
      curDate.setDate(0);
      curDate = curDate.toLocaleString("chinese", { hour12: false });
      curDate = curDate.replace(/\//g, "-");
      curDate = this.editDate(curDate)
      curDate2.setDate(1);
      curDate2 = curDate2.toLocaleString("chinese", { hour12: false });
      curDate2 = curDate2.replace(/\//g, "-");
      curDate2 = this.editDate(curDate2)
      return [curDate2, curDate];
    },
    //修改日期格式
    editDate(date){
      let arr1 = date.split(' ')
      let arr2 = arr1[0].split('-')
      arr2[1].length < 2 && (arr2[1] = '0' + arr2[1])
      arr2[2].length < 2 && (arr2[2] = '0' + arr2[2])
      arr1[0] = arr2.join('-')
      return arr1.join(' ')
    },

    changeDate1(val) {
      if(val){
        this.startTime1 = this.getDate(val[0])
        this.endTime1 = this.getDate(val[1])
        this.nearDay1 = "";
        this.date1 = ''
        this.getMemberTrend();
      }
      // if(val){
      //   let arr = this.getTimeArr(val);
      //   this.startTime1 = arr[0];
      //   this.endTime1 = arr[1];
      //   this.nearDay1 = "";
      //   this.getMemberTrend();
      // }
    },
    changeDate2(val) {
      let arr = this.getTimeArr(val);
      this.startTime2 = arr[0];
      this.endTime2 = arr[1];
      this.nearDay2 = "";
      this.date2 = ''
      this.getPaymentTrend();
    },
    /*
     **会员增长趋势
     */

    getMemberTrend() {
      let data = {
        startTime: this.startTime1,
        endTime: this.endTime1,
        nearDay: this.nearDay1
      };
      this._apis.data
        .memberTrend(data)
        .then(response => {
          this.$refs.ip2.con(response);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    changeDayM(val) {
      if (val != 4) {
        this.nearDay1 = val;
        this.startTime1 = "";
        this.endTime1 = "";
        this.getMemberTrend();
      }
    },
    /*
     **支付趋势
     */
    getPaymentTrend() {
      let data = {
        nearDay: this.nearDay2,
        startTime: this.startTime2,
        endTime: this.endTime2
      };
      this._apis.data
        .paymentTrend(data)
        .then(response => {
          this.threeData = response;
          this.$refs.ip3.con(
            response
          );
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    changeDayPay(val) {
      if (val != 4) {
        this.nearDay2 = val;
        this.startTime2 = "";
        this.endTime2 = "";
        this.date2 = ''
        this.getPaymentTrend();
      }
    },
    // 会员消费跳转
    toLink() {
      this.$router.push({ path: "/datum/memberConsumption" });
    }
  }
};
</script>
<style lang="scss" scoped>
.p_container {
  padding: 20px;
  background-color: #fff;
  .pane_container {
    color: #3d434a;
    .i_title {
      font-weight: bold;
      margin: 23px 0 32px 38px;
    }
    .chart1_container {
      padding-bottom: 32px;
      border-bottom: 1px dashed #d3d3d3;
      .chart1 {
        float: left;
        width: 500px;
      }
      .chart1_info {
        float: left;
        margin: 176px 0 0 91px;
        p {
          margin-bottom: 20px;
          &:first-child {
            font-weight: bold;
          }
          span {
            cursor: pointer;
            margin-left: 20px;
            color: #655eff;
          }
        }
      }
    }
    .i_line {
      padding-left: 35px;
      .input_wrap {
        width: 220px;
        display: inline-block;
      }
      span {
        color: #655eff;
        margin-left: 20px;
      }
    }
    .chart2_container {
      padding-top: 20px;
    }
    .chart3_container {
      padding-top: 20px;
      .chart3 {
        float: left;
        width: 700px;
      }
      .chart3_info {
        float: left;
        width: 400px;
        margin-top: 150px;
        p {
          margin-bottom: 20px;
          span {
            display: inline-block;
            &:first-child {
              width: 16px;
              height: 16px;
              margin-right: 10px;
            }
            &:nth-child(2) {
              width: 240px;
            }
          }
        }
      }
    }
  }
}
</style>

