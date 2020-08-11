<template>
<div>
    <div class="viewBut"><img src="@/assets/images/realtime/curtime.png" alt=""></div>
  <div class="p_container">
       <div class="p_title clearfix">
           <h2>数据总览</h2>
           <span class="refresh"><img src="@/assets/images/realtime/refresh.png" alt=""></span>
          <div class="fr fr_channel">
            <!-- <el-button type="primary">实时战况</el-button> -->
          </div>
      </div>
      <div class="pane_container clearfix">
        <div class="p_screening">
            <div class="clearfix pt">
                <p class="fl">支付金额（元）</p>
                <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                <img class="fl" src="@/assets/images/realtime/hoverTips.png" alt="">
                </el-tooltip>
            </div>
            <div class="clearfix pt">
                <strong class="fl">8,233,000</strong>
                <span class="fl">昨日全天：<span>860</span></span>
            </div>
            <screening 
    :title="'测试图表'" 
    ref="dtChart"
    :dataChart="dataChart" height="300px" >
    </screening>
        </div>
        <div class="card-content">
            <div class="card-item">
                <div class="item-top">
                    <p>支付金额（元）</p>
                    <span> <strong>8,233,000</strong> </span>
                </div>
                <p>昨日全天：<span>860</span></p>
            </div>
            <div class="card-item">
                <div class="item-top">
                    <p>支付订单数（单）</p>
                    <span> <strong>50</strong> <el-button type="text">查看</el-button> </span>
                </div>
                <p>昨日全天：<span>860</span></p>
            </div>
            <div class="card-item">
                <div class="item-top">
                    <p>支付人数（人）</p>
                    <span> <strong>8,233,000</strong> </span>
                </div>
                <p>昨日全天：<span>860</span></p>
            </div>
            <div class="card-item">
                <div class="item-top">
                    <p>退款金额（元）</p>
                    <span> <strong>8,233,000</strong></span>
                </div>
                <p>昨日全天：<span>860</span></p>
            </div>
            <div class="card-item">
                <div class="item-top">
                    <p>退款订单数（单）</p>
                    <span> <strong>50</strong> <el-button type="text">查看</el-button> </span>
                </div>
                <p>昨日全天：<span>860</span></p>
            </div>
            <div class="card-item">
                <div class="item-top">
                    <p>客单价（元）</p>
                    <span> <strong>5033</strong>  </span>
                </div>
                <p>昨日全天：<span>860</span></p>
            </div>
            <div class="card-item">
                <div class="item-top">
                    <p>访客数量（次）</p>
                    <span> <strong>50</strong> </span>
                </div>
                <p>昨日全天：<span>860</span></p>
            </div>
            <div class="card-item">
                <div class="item-top">
                    <p>浏览数量（次）</p>
                    <span> <strong>50</strong> </span>
                </div>
                <p>昨日全天：<span>860</span></p>
            </div>
        </div>
      </div>
  </div>
  <div class="p_container">
      
  </div>
</div>
</template>
<script>
import {GetDateStr} from "@/utils/validate.js"
import pfChart from "./components/pfChart";
import screening from "./components/realtime/screening";
export default {
  name: "realTimeView",
  components: { pfChart,screening },
  data() {
    const _self = this;
    return {
      pickerOptions: {
          disabledDate: (time) => {
              let yesterday = new Date();
              yesterday = yesterday.getTime()-24*60*60*1000;
              yesterday = this.utils.dayEnd(yesterday);
              return time.getTime() > yesterday.getTime();
          }
      },
      activeName: "first",
      range: "",
      startTime: "",
      endTime:"",
      visitSourceType: 0, //1 小程序 2 公众号
      analysisType:'1', //数据类型
      nearDay: 7, 
      dataChart: {},
      dataChart1:{},
      title:'浏览/访问',
      duration:'1',
      channel:0,
      type:1,
      isPc:false
    };
  },
  created() {
    this.init()
    this.dataChart={
        xAxis:['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        series:[{
                    name: '招商银行',
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    symbol:'circle',
                    symbolSize: 8,   //设定实心点的大小
                    color:['red'],
                    itemStyle:{  
                        normal:{  
                        color:'red',  
                        borderColor:'#fff',  //拐点边框颜色  
                        }  
                    },
                },
                {
                    name: '浦发银行',
                    data: [620, 711, 823, 934, 1445, 1456, 1178],
                    type: 'line',
                    itemStyle: {
                        //则线图每个点的样式
                        borderWidth: 2,
                    },
                }]
    }
  }, 
  methods: {
    init(){
      this.getFlowAnalysis()
    },

    //浏览量/访问量
    getFlowAnalysis(){
      let data = {
          channel:this.visitSourceType,
          startTime: this.startTime,
          endTime: this.endTime,
          nearDay: this.nearDay  == '4' ? null : this.nearDay,
        };
      this._apis.data.flowAnalysis(data).then(response => {
        this.dataChart = response
      }).catch(error => {
        this.$message.error(error);
      });
    },



    //自定义时间选择
    changeTime(val){
      this.startTime = val[0];
      this.endTime = val[1];
      this.changeType(this.analysisType)
      this.changeDp(this.duration)
    },  
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
.viewBut{
    position: fixed;
    top: 50%;
    margin-top: -50px;
    right: 0;
}
.p_container {
  padding:0 28px;
  margin-bottom: 12px;
  background-color: #fff;
  .p_title{
      width: 100%;
      height: 58px;
      border-bottom: 1px solid #EDEDED;
      padding: 15px 0;
    h2{
        font-size: 16px;
        font-weight: 500;
        color: #252A2E;
        line-height: 28px;
        float: left;
    }  
    .refresh{
        float: left;
        width: 28px;
        height: 28px;
        border-radius: 5px;
        background: #F7F9FC;
        margin-left: 10px;
        img{
            display: block;
            margin-left: 6px;
            margin-top: 6px;
        }
    }
  }
  .pane_container {
	  position: relative;
      padding: 14px 0;
      .p_screening{
          width: calc(100% - 580px);
          color: #92929B;
          font-size: 14px;
          line-height: 16px;
          float: left;
          strong{
              font-size: 24px;
              color: #161617;
              margin-right: 22px;
              font-family:DINAlternate-Bold,DINAlternate;
          }
          .pt{
              padding-bottom: 10px;
              span{
                  font-size: 12px;
                  span{
                      color: #161617;
                      font-weight: 500;
                  }
              }
          }
      }
    
  }
  .card-content{
      width: 558px;
      float: right;
      .card-item{
          width:176px;
        height:106px;
        background:rgba(253,253,253,1);
        border-radius:4px;
        border:1px solid rgba(237,237,237,1);
        overflow: hidden;
        margin-left: 10px;
        margin-bottom: 10px;
        float: left;
        .item-top{
            height:75px;
            padding-top: 14px;
            padding-left: 16px;
            >p{
                color: #92929B;
                padding-bottom: 8px;
            }
            strong{
                color: #161617;
                font-size: 24px;
                font-family:DINAlternate-Bold,DINAlternate;
            }
        }
        >p{
            font-size: 12px;
            height: 30px;
            line-height: 30px;
            padding-left: 16px;
            color: #92929B;
            background:rgba(248,248,248,1);
            border-top:1px solid rgba(237,237,237,1);
            span{
                color: #161617;
            }
        }
      }
  }
}
.el-radio-group label:last-child{
  margin-left: 0px;
}
</style>

