<template>
<div>
  <div class="p_container p_channel">
      <div class="clearfix">
        <div class="fr fr_channel">
          <el-radio-group class="fr" v-model="visitSourceType" @change="all">
            <el-radio-button class="btn_bor" label="0">全部</el-radio-button>
            <el-radio-button class="btn_bor" label="1">小程序</el-radio-button>
            <el-radio-button class="btn_bor" label="2">公众号</el-radio-button>
            <el-radio-button class="btn_bor" label="3" v-if="isPc">pc</el-radio-button>
            <el-radio-button class="btn_bor" label="4" v-if="isPc">wap</el-radio-button>
          </el-radio-group>
        </div>
      </div>

  </div>
  <div class="p_container" v-calcHeight="60+40+92">
    <div class="pane_container">
		<div class="p_line">
			<!--<el-radio-group v-model="dateType" @change="changeDay">-->
				<!--<el-radio-button class="btn_bor" label="7">最近7天</el-radio-button>-->
				<!--<el-radio-button class="btn_bor" label="15">最近15天</el-radio-button>-->
				<!--<el-radio-button class="btn_bor" label="30">最近30天</el-radio-button>-->
				<!--<el-radio-button class="btn_bor" label="4">自定义时间</el-radio-button>-->
			<!--</el-radio-group>-->
			<div class="radio-group" style="margin-right: 10px;">
				<span @click="changeDay(7)" :class="dateType == 7 ? 'active' : ''">最近7天</span>
				<span @click="changeDay(15)" :class="dateType == 15 ? 'active' : ''">最近15天</span>
				<span @click="changeDay(30)" :class="dateType == 30 ? 'active' : ''">最近30天</span>
				<span @click="changeDay(4)" :class="dateType == 4 ? 'active' : ''">自定义时间</span>
			</div>
			<div class="input_wrap" v-if="dateType == 4">
				<el-date-picker
					v-model="range"
					type="datetimerange"
					align="right"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
          @focus="utils.globalTimeDisabledFocus"
					:picker-options="Object.assign(utils.globalTimePickerOption.call(this, false), this.pickerOptions)"
					@change="changeTime"
				></el-date-picker>
			</div>
		</div>
      <div class="chart_container" v-loading="loading">
        <div class="path_line clearfix" v-if="dataObj.uv">
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
              <p>商品详情页</p>
              <p>{{dataObj.uv[4]}}</p>
            </div>
            <!-- <p class="space"></p>
            <div>
              <p>其他页</p>
              <p>{{dataObj.uv[5]}}</p>
            </div> -->
          </div>
        </div>
         <div class="p_top" v-if="dataObj.orderUvPathTransformation">
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
            <!-- <p :title="'其他页到确认订单页的转化率为'+(dataObj.orderUvPathTransformation[5]*100).toFixed(2)+ '%'">
              {{(dataObj.orderUvPathTransformation[5]*100).toFixed(2)+ '%'}}
            </p>       -->
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

        <div class="path_line clearfix">
          <div class="p_l">
            <p>第三步</p>
            <p>支付（人）</p>
          </div>
          <div class="p_r p_3">           
            <div class="p_bottom" v-if="dataObj.pay">
              <div>
                <p>支付成功</p>
                <p>{{dataObj.pay[1]}}</p>
              </div>
               <p class="spaces"></p>
              <div>
                <p>直接退出</p>
                <p>{{dataObj.pay[2]}}</p>
              </div>
               <!-- <p class="spaces"></p>
              <div>
                <p>其他</p>
                <p>{{dataObj.pay[3]}}</p>
              </div> -->
            </div>
          </div>
        </div>
		  <div class="p_top1" v-if="dataObj.payOrderPathTransformation">
			  <p :title="'确认订单页到支付成功的转化率为'+(dataObj.payOrderPathTransformation[1]*100).toFixed(2)+ '%'" style="text-align: right;margin-right: 48px;">
				  {{(dataObj.payOrderPathTransformation[1]*100).toFixed(2)+ '%'}}
			  </p>
			  <p :title="'确认订单页到直接退出的转化率为'+(dataObj.payOrderPathTransformation[2]*100).toFixed(2)+ '%'" style="text-align: left;margin-left: 14px;">
				  {{(dataObj.payOrderPathTransformation[2]*100).toFixed(2)+ '%'}}
			  </p>
			  <!-- <p :title="'确认订单页到其他页的转化率为'+(dataObj.payOrderPathTransformation[3]*100).toFixed(2)+ '%'">
                {{(dataObj.payOrderPathTransformation[3]*100).toFixed(2)+ '%'}}
              </p> -->
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
          disabledDate: (time) => {
              let yesterday = new Date();
              yesterday = yesterday.getTime()-24*60*60*1000;
              yesterday = this.utils.dayEnd(yesterday);
              return time.getTime() > yesterday.getTime();
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
      isPc:false,
      loading: true
    };
  },
  created() {
    this.getPathConversion();
    this.getOpen()
  },
  methods: {
    //pc wap是否开通
    getOpen(){
      this._apis.data.openPcWap().then(response => {
        if(response == null){
          this.isPc = false
        }else if(response.onoff == 0){
          this.isPc = false
        }else{
          this.isPc = true
        }
      }).catch(error => {
        this.$message.error(error);
      });
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
      this.loading = true;
      this._apis.data
        .transformation(data)
        .then(response => {
          this.dataObj = response;
          this.loading = false;
        })
        .catch(error => {
          this.$message.error(error);
          this.loading = false;
        });
    },
    changeTime(val) {
      this.startTime = val[0]
      this.endTime = val[1]
      this.nearDay = "";
      this.getPathConversion();
    },
    all(val) {
      this.channel = val;
      this.getPathConversion();
    },
    changeDay(val) {
    	this.dateType= val;
      if (val != 4) {
        this.nearDay = val
        this.startTime = ""
        this.endTime = ""
        this.range = ''
        this.getPathConversion();
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.radio-group{
	display: inline-block;
}
.radio-group span{
	display: inline-block;
	font-size: 14px;
	background-color: #fff;
	line-height: 14px;
	padding: 6px 29px;
	cursor: pointer;
	color: #B6B5C8;
}
.radio-group span.active{
	color:#655EFF;
	background-color: #E6E4FF;
}
.p_channel{
    padding:0px;
    margin-bottom:20px;
    .fr_channel{
        float:left;
    }
}
.input_wrap {
	width: 400px;
	display: inline-block;
}
.p_container {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  .pane_container {
    .p_line {
		padding-bottom: 30px;
		border-bottom: 1px dashed #d3d3d3;
      span {
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
      padding: 20px 0 50px 20px;
      height: 400px;
      .path_line {
        padding: 20px 0px;
		padding-bottom:10px;
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
          width: 670px;
          line-height: 20px;
          // padding: 0 100px 0 160px; 
          margin-left:130px;
          font-size: 16px;
          color: #35dcd2;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-evenly;
        p{
          width: 75px;
          text-align: center;
        }  
      }
    .p_top1 {
          height: 20px;
          width: 750px;
          line-height: 20px;
          padding: 0 70px 0 300px;
          font-size: 16px; 
          color: #22c1ef;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          p{
            width: 100%;
            text-align: center;
          }
      }
    }

  }
}
.el-radio-group label:last-child{
  margin-left: 0px;
}
</style>

