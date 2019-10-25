<template>
  <div class="p_container">
    <div class="clearfix">
      <div class="fr">
        <el-radio-group class="fr" v-model="visitSourceType" @change="all">
          <el-radio-button class="btn_bor" label="0">全部</el-radio-button>
          <el-radio-button class="btn_bor" label="1">小程序</el-radio-button>
          <el-radio-button class="btn_bor" label="2">公众号</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="pane_container">
      <div class="p_line">
        <el-radio-group v-model="dateType" @change="changeDay">
          <el-radio-button class="btn_bor" label="7">最近7天</el-radio-button>
          <el-radio-button class="btn_bor" label="15">最近15天</el-radio-button>
          <el-radio-button class="btn_bor" label="30">最近30天</el-radio-button>
          <el-radio-button class="btn_bor" label="4">自定义时间</el-radio-button>
        </el-radio-group>
        <div class="input_wrap" v-if="dateType == 4">
          <el-date-picker
            v-model="range"
            type="daterange"
            range-separator="—"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="changeTime"
          ></el-date-picker>
        </div>
      </div>

      <div class="chart_container">
        <div class="path_line clearfix">
          <div class="p_l">
            <p>第一步</p>
            <p>访客（人）</p>
          </div>
          <div class="p_r p_1">
            <div>
              <p>首页</p>
              <p>{{dataObj.uv[1]}}</p>
            </div>
            <p class="space"></p>
            <div>
              <p>商品列表页</p>
              <p>{{dataObj.uv[2]}}</p>
            </div>
            <p class="space"></p>
            <div>
              <p style="margin-right:11px">购物车</p>
              <p style="margin-right:11px">{{dataObj.uv[3]}}</p>
            </div>
            <p class="space"></p>
            <div>
              <p>商品页</p>
              <p>{{dataObj.uv[4]}}</p>
            </div>
            <p class="space"></p>
            <div>
              <p>其他页</p>
              <p>{{dataObj.uv[5]}}</p>
            </div>
          </div>
        </div>
         <div class="p_top">
            <p :title="'首页到确认订单页的转化率为'+(dataObj.orderUvPathTransformation[1]*100).toFixed(2)+ '%'">
              {{(dataObj.orderUvPathTransformation[1]*100).toFixed(2)+ '%'}}
            </p>
            <p :title="'商品列表页到确认订单页的转化率为'+(dataObj.orderUvPathTransformation[2]*100).toFixed(2)+ '%'">
              {{(dataObj.orderUvPathTransformation[2]*100).toFixed(2)+ '%'}}
            </p>
            <p :title="'购物车页到确认订单页的转化率为'+(dataObj.orderUvPathTransformation[3]*100).toFixed(2)+ '%'">
              {{(dataObj.orderUvPathTransformation[3]*100).toFixed(2)+ '%'}}
            </p>
            <p :title="'商品详情页到确认订单页的转化率为'+(dataObj.orderUvPathTransformation[4]*100).toFixed(2)+ '%'">
              {{(dataObj.orderUvPathTransformation[4]*100).toFixed(2)+ '%'}}
            </p>
            <p :title="'其他页到确认订单页的转化率为'+(dataObj.orderUvPathTransformation[5]*100).toFixed(2)+ '%'">
              {{(dataObj.orderUvPathTransformation[5]*100).toFixed(2)+ '%'}}
            </p>      
         </div>
        <div class="path_line clearfix">
          <div class="p_l">
            <p>第二步</p>
            <p>下单（人）</p>
          </div>
          <div class="p_r p_2">
           
            <div class="p_bottom">
              <p>确认订单</p>
              <p>{{dataObj.totalOrderCount}}</p>
            </div>
          </div>
        </div>
         <div class="p_top1">
              <p :title="'确认订单页到支付成功的转化率为'+(dataObj.payOrderPathTransformation[1]*100).toFixed(2)+ '%'">
                {{(dataObj.payOrderPathTransformation[1]*100).toFixed(2)+ '%'}}
              </p>
              <p :title="'确认订单页到直接退出的转化率为'+(dataObj.payOrderPathTransformation[2]*100).toFixed(2)+ '%'">
                {{(dataObj.payOrderPathTransformation[2]*100).toFixed(2)+ '%'}}
              </p>            
              <p :title="'确认订单页到其他页的转化率为'+(dataObj.payOrderPathTransformation[3]*100).toFixed(2)+ '%'">
                {{(dataObj.payOrderPathTransformation[3]*100).toFixed(2)+ '%'}}
              </p>
         </div>
        <div class="path_line clearfix">
          <div class="p_l">
            <p>第三步</p>
            <p>支付（人）</p>
          </div>
          <div class="p_r p_3">           
            <div class="p_bottom">
              <div>
                <p>支付成功</p>
                <p>{{dataObj.pay[1]}}</p>
              </div>
               <p class="spaces"></p>
              <div>
                <p>直接退出</p>
                <p>{{dataObj.pay[2]}}</p>
              </div>
               <p class="spaces"></p>
              <div>
                <p>其他</p>
                <p>{{dataObj.pay[3]}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from "@/utils";
import apChart from "./components/apChart";
export default {
  name: "accessPath",
  components: { apChart },
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
      range: "",
      visitSourceType: 0,
      nearDay: "7",
      startTime: "",
      endTime: "",
      dateType: 7,
      dataObj: {},
      channel: "0",
      aaa1:'yel'
    };
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
    getPathConversion() {
      let data = {
        startTime: this.startTime,
        endTime: this.endTime,
        nearDay: this.nearDay,
        //visitSourceType: this.visitSourceType,
        channel: this.channel
      };
      this._apis.data
        .transformation(data)
        .then(response => {
          this.dataObj = response;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    changeTime(val) {
      this.startTime = this.getDate(val[0])
      this.endTime = this.getDate(val[1])
      this.nearDay = "";
      this.getPathConversion();
    },
    all(val) {
      this.channel = val;
      this.getPathConversion();
    },
    changeDay(val) {
      if (val != 4) {
        this.nearDay = val
        this.startTime = ""
        this.endTime = ""
        this.range = ''
        this.getPathConversion();
      }
    }
  },
  created() {
    this.getPathConversion();
  }
};
</script>
<style lang="scss" scoped>
.p_container {
  padding: 20px;
  background-color: #fff;
  .pane_container {
        height: 600px;
    .p_line {
      .input_wrap {
        width: 350px;
        display: inline-block;
      }
      span {
        color: #655eff;
        margin-left: 20px;
        cursor: pointer;
      }
    }
    .btn_tabs {
      margin: 30px 0 22px 0;
      .active_btn {
        background: rgba(101, 94, 255, 0.1);
        color: #655eff;
      }
    }
    .chart_container {
      padding: 100px 0 50px 20px;
      height: 400px;
      .path_line {
        padding: 20px 0px;
        .p_l {
          color: #333;
          font-size: 19px;
          float: left;
          width: 107px;
          p:first-child {
            margin-top: 26px;
          }
        }
        .p_r {
          float: left;
          width: 750px;
          color: #fff;
          &.p_1 {
            height: 87px;
             background: url("../../assets/images/datum/path_01.png") 0 0
              no-repeat;
            padding: 0 90px 0 82px;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            div {
              padding: 0 10px;
              text-align: center;
              p:first-child {
                font-size: 16px;
                margin-top: 17px;
              }
              p:last-child {
                font-size: 24px;
                margin-top: 5px;
              }
            };
            .space{
              width: 5px;
              height: 88px;
              margin-left: 3px;
              background: #fff;
            }
          }
          &.p_2 {
            height: 82px;
            background: url("../../assets/images/datum/path_02.png") 100px 0 no-repeat; 
            .p_bottom {
              padding: 22px 180px 0 190px;             
              p:first-child{
                text-align: center;
                  font-size: 16px;
              }
              p:last-child{
                 text-align: center;
                  font-size: 24px;
              }
            }          
          }
          &.p_3 {
            height: 82px;
            background: url("../../assets/images/datum/path_03.png") 199px 0
              no-repeat;
            .p_bottom {
              padding: 0px 240px 0 264px;
              display: flex;
              justify-content: space-between;
              div {
                width: 60px;
                height: 60px;
                margin-top: 25px;
                text-align: center;
                // p:first-child{
                //     font-size: 16px;
                // }
                // p:last-child{
                //     font-size: 24px;
                // }
              }
            };
             .spaces{
              width: 5px;
              height: 85px;
              background: #fff;
              margin-bottom: -20px;
            }
          }
        }
      }
    .p_top {
          height: 20px;
          width: 900px;
          line-height: 20px;
          padding: 0 100px 0 160px; 
          font-size: 16px;
          color: #000;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-evenly;
        }
    .p_top1 {
          height: 20px;
          width: 750px;
          line-height: 20px;
          padding: 0 70px 0 290px;
          font-size: 16px; 
          color: #000;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
      }
    }
  }
}
</style>

