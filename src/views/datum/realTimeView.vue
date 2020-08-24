<template>
<div>
    <!-- 悬浮按钮 数据大屏 -->
    <div class="viewBut" @click="_routeTo('dashboard')"><img src="@/assets/images/realtime/curtime.png" alt=""></div>
    <!-- 数据总览 -->
    <div class="p_container pb12">
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
                <el-tooltip class="item" effect="dark" content="统计时间内，所有支付订单金额之和" placement="top-start">
                <img class="fl" src="@/assets/images/realtime/hoverTips.png" alt="">
                </el-tooltip>
            </div>
            <div class="clearfix pt">
                <strong class="fl">8,233,000</strong>
                <span class="fl">昨日全天：<span>860</span></span>
            </div>
            <screeningChart 
    :title="'测试图表'" 
    ref="dtChart"
    :dataChart="dataChart" height="300px" >
    </screeningChart>
        </div>
        <div class="card-content">
            <div class="card-item">
                <div class="item-top">
                    <p>支付金额（元）</p>
                    <span> <strong>8,233,000</strong> </span>
                </div>
                <p>昨日全天：<span >860</span></p>
            </div>
            <div class="card-item">
                <div class="item-top">
                    <p>支付订单数（单）</p>
                    <span> <strong>50</strong> <el-button type="text" @click="_routeTo('query')">查看</el-button> </span>
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
                    <span> <strong>50</strong> <el-button type="text" @click="_routeTo('afterSalesManagement')">查看</el-button> </span>
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
    <!-- 交易看板 -->
    <el-container class="pb12 clearfix">
        <el-aside class="asideBox" width="65%">
            <div class="p_container p_ltsiade">
                <div class="p_title clearfix">
                    <h2>交易看板</h2>
                    <div class="fr clearfix">
                        <serchRt @change="getVal" class="fr" />
                    </div>
                </div>
                <div class="choose-type clearfix">
                    <div class="choose_item" :class="{'active':activetype==1}">
                        <div class="choosetop">
                            <p>支付金额（元）<span class="chooseBut" @click="chooseType(1)"></span></p>
                            <span> <strong>50</strong> </span>
                        </div>
                        <div class="choosebot">
                            <p>较前一日：<span class="up"><img src="@/assets/images/realtime/imgup.png" alt="">60%</span></p>
                            <p>较上周同期：<span class="down"><img src="@/assets/images/realtime/imgup.png" alt="">60%</span></p>
                        </div>
                    </div>
                    <div class="choose_item" :class="{'active':activetype==2}">
                        <div class="choosetop">
                            <p>支付订单数（单）<span class="chooseBut" @click="chooseType(2)"></span></p>
                            <span> <strong>50</strong> </span>
                        </div>
                        <div class="choosebot">
                            <p>较前一日：<span class="up"><img src="@/assets/images/realtime/imgup.png" alt="">60%</span></p>
                            <p>较上周同期：<span class="down"><img src="@/assets/images/realtime/imgup.png" alt="">60%</span></p>
                        </div>
                    </div>
                    <div class="choose_item" :class="{'active':activetype==3}">
                        <div class="choosetop">
                            <p>支付人数（人）<span class="chooseBut" @click="chooseType(3)"></span></p>
                            <span> <strong>50</strong> </span>
                        </div>
                        <div class="choosebot">
                            <p>较前一日：<span class="up"><img src="@/assets/images/realtime/imgup.png" alt="">60%</span></p>
                            <p>较上周同期：<span class="down"><img src="@/assets/images/realtime/imgup.png" alt="">60%</span></p>
                        </div>
                    </div>
                    <div class="choose_item" :class="{'active':activetype==4}">
                        <div class="choosetop">
                            <p class="clearfix"> <span class="fl">客单价（元）</span> 
                                <el-tooltip class="item" effect="dark" content="统计时间内，用户平均消费金额" placement="top-start">
                                <img class="fl" style="margin-top:5px" src="@/assets/images/realtime/hoverTips.png" alt="">
                                </el-tooltip>
                                <span class="chooseBut" @click="chooseType(4)"></span>
                            </p>
                            <span> <strong>50</strong> </span>
                        </div>
                        <div class="choosebot">
                            <p>较前一日：<span class="up"><img src="@/assets/images/realtime/imgup.png" alt="">60%</span></p>
                            <p>较上周同期：<span class="down"><img src="@/assets/images/realtime/imgdown.png" alt="">60%</span></p>
                        </div>
                    </div>
                </div>
                <tradeChart :title="'测试图表'" ref="dtChart" :dataChart="dataChart" height="420px" ></tradeChart>
            </div>
        </el-aside>
        <el-main class="p_rtsiade" style="padding:0">
            <div class="clearfix ">
                <div class="p_container">
                <div class="p_title clearfix">
                    <h2>交易分布</h2>
                    <el-tooltip class="item" effect="dark" content="商城所有订单省级区域分布" placement="top-start">
                    <img class="fl" src="@/assets/images/realtime/hoverTips.png" alt="">
                    </el-tooltip>
                </div>
                </div>
                <div class="chartbox">
                    <mapChart 
                    :title="'测试图表'" 
                    ref="mapChart"
                    :dataChart="dataChart" height="300px" >
                    </mapChart>
                    <div class="lengebox">
                        <p><span class="line1"></span>3001单以上</p>
                        <p><span class="line2"></span>2001-3000单</p>
                        <p><span class="line3"></span>1001-2000单</p>
                        <p><span class="line4"></span>1-1000单</p>
                        <p><span class="line5"></span>待破零</p>
                    </div>
                </div>
            </div>
        </el-main>
    </el-container>
    <!-- 用户概览 -->
    <el-container class="pb12 clearfix">
        <el-aside class="asideBox" width="65%">
            <div class="p_container p_ltsiade">
                <div class="p_title clearfix">
                    <h2>用户概览</h2>
                    <!-- <el-tooltip class="item" effect="dark" content="商城所有订单省级区域分布" placement="top-start">
                    <img class="fl" src="@/assets/images/realtime/hoverTips.png" alt="">
                    </el-tooltip> -->
                    <div class="fr clearfix">
                        <serchRt class="fr ml12" @change="getUserVal" />
                        <el-radio-group class="fr radioBox" v-model="userType" @change="alluserType">
                            <el-radio-button class="btn_bor" label="0" v-permission="['数据', '客流分析', '全部']">全部</el-radio-button>
                            <el-radio-button class="btn_bor" label="1" v-permission="['数据', '客流分析', '小程序']">小程序</el-radio-button>
                            <el-radio-button class="btn_bor" label="2" v-permission="['数据', '客流分析', '公众号']">公众号</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <div class="chartbox">
                    <userChart :title="'测试图表'" ref="dtChart" :dataChart="dataChart" height="300px" ></userChart>
                </div>
            </div>
        </el-aside>
        <el-main class="p_rtsiade" style="padding:0">
            <div class="clearfix ">
                <div class="p_container">
                <div class="p_title clearfix">
                    <h2>渠道转化</h2>
                    <el-tooltip class="item" effect="dark" content="渠道会员数量占比" placement="top-start">
                    <img class="fl" src="@/assets/images/realtime/hoverTips.png" alt="">
                    </el-tooltip>
                    <div class="fr clearfix">
                        <el-radio-group class="fr radioBox" v-model="visitSourceType" @change="all">
                            <el-radio-button class="btn_bor" label="1" v-permission="['数据', '客流分析', '小程序']">小程序</el-radio-button>
                            <el-radio-button class="btn_bor" label="2" v-permission="['数据', '客流分析', '公众号']">公众号</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                </div>
                <div class="chartbox">
                    <pieChart :title="'测试图表'" ref="pieChart" height="280px"></pieChart>
                </div>
            </div>
        </el-main>
    </el-container>
    <!-- 商品看板 -->
    <div class="clearfix">
        <div class="p_container">
            <div class="p_title clearfix">
            <h2>商品看板</h2>
            </div>
        </div>
        <el-row class="p_product">
            <el-col :span="8">
                <div class="pro_item">
                    <div class="pro_tle tle1">支付商品TOP</div>
                    <ul>
                        <li><span>排名</span><span>商品</span><span>支付金额</span></li>
                        <li>
                            <span><img class="fl" src="@/assets/images/realtime/top1.png" alt=""></span>
                            <span><img class="fl" src="@/assets/images/realtime/hoverTips.png" alt=""><p>商品名称商品商品名称商品</p></span>
                            <span><p>866.23</p></span>
                        </li>
                        <li>
                            <span><img class="fl" src="@/assets/images/realtime/top2.png" alt=""></span>
                            <span><img class="fl" src="@/assets/images/realtime/hoverTips.png" alt=""><p>商品名称商品商品名称商品</p></span>
                            <span><p>866.23</p></span>
                        </li>
                        <li>
                            <span><img class="fl" src="@/assets/images/realtime/top3.png" alt=""></span>
                            <span><img class="fl" src="@/assets/images/realtime/hoverTips.png" alt=""><p>商品名称商品商品名称商品</p></span>
                            <span><p>866.23</p></span>
                        </li>
                        <li>
                            <span><span>04</span></span>
                            <span><img class="fl" src="@/assets/images/realtime/hoverTips.png" alt=""><p>商品名称商品商品名称商品</p></span>
                            <span><p>866.23</p></span>
                        </li>
                        <li>
                            <span><span>05</span></span>
                            <span><img class="fl" src="@/assets/images/realtime/hoverTips.png" alt=""><p>商品名称商品商品名称商品</p></span>
                            <span><p>866.23</p></span>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="pro_item">
                    <div class="pro_tle tle2">销量商品TOP</div>
                    <ul>
                        <li><span>排名</span><span>商品</span><span>支付金额</span></li>
                        <li>
                            <span><img class="fl" src="@/assets/images/realtime/top1.png" alt=""></span>
                            <span><img class="fl" src="@/assets/images/realtime/hoverTips.png" alt=""><p>商品名称商品商品名称商品</p></span>
                            <span><p>866.23</p></span>
                        </li>
                        <li>
                            <span><img class="fl" src="@/assets/images/realtime/top2.png" alt=""></span>
                            <span><img class="fl" src="@/assets/images/realtime/hoverTips.png" alt=""><p>商品名称商品商品名称商品</p></span>
                            <span><p>866.23</p></span>
                        </li>
                        <li>
                            <span><img class="fl" src="@/assets/images/realtime/top3.png" alt=""></span>
                            <span><img class="fl" src="@/assets/images/realtime/hoverTips.png" alt=""><p>商品名称商品商品名称商品</p></span>
                            <span><p>866.23</p></span>
                        </li>
                        <li>
                            <span><span>04</span></span>
                            <span><img class="fl" src="@/assets/images/realtime/hoverTips.png" alt=""><p>商品名称商品商品名称商品</p></span>
                            <span><p>866.23</p></span>
                        </li>
                        <li>
                            <span><span>05</span></span>
                            <span><img class="fl" src="@/assets/images/realtime/hoverTips.png" alt=""><p>商品名称商品商品名称商品</p></span>
                            <span><p>866.23</p></span>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="pro_item nonerb">
                    <div class="pro_tle tle3">浏览商品TOP</div>
                    <ul>
                        <li><span>排名</span><span>商品</span><span>支付金额</span></li>
                        <li>
                            <span><img class="fl" src="@/assets/images/realtime/top1.png" alt=""></span>
                            <span><img class="fl" src="@/assets/images/realtime/hoverTips.png" alt=""><p>商品名称商品商品名称商品</p></span>
                            <span><p>866.23</p></span>
                        </li>
                        <li>
                            <span><img class="fl" src="@/assets/images/realtime/top2.png" alt=""></span>
                            <span><img class="fl" src="@/assets/images/realtime/hoverTips.png" alt=""><p>商品名称商品商品名称商品</p></span>
                            <span><p>866.23</p></span>
                        </li>
                        <li>
                            <span><img class="fl" src="@/assets/images/realtime/top3.png" alt=""></span>
                            <span><img class="fl" src="@/assets/images/realtime/hoverTips.png" alt=""><p>商品名称商品商品名称商品</p></span>
                            <span><p>866.23</p></span>
                        </li>
                        <li>
                            <span><span>04</span></span>
                            <span><img class="fl" src="@/assets/images/realtime/hoverTips.png" alt=""><p>商品名称商品商品名称商品</p></span>
                            <span><p>866.23</p></span>
                        </li>
                        <li>
                            <span><span>05</span></span>
                            <span><img class="fl" src="@/assets/images/realtime/hoverTips.png" alt=""><p>商品名称商品商品名称商品</p></span>
                            <span><p>866.23</p></span>
                        </li>
                    </ul>
                </div>
            </el-col>
        </el-row>
    </div>
</div>
</template>
<script>
import {GetDateStr} from "@/utils/validate.js"
import serchRt from "./components/realtime/serchRt";//季度
import pfChart from "./components/pfChart";
import screeningChart from "./components/realtime/screeningChart";
import mapChart from "./components/realtime/mapChart";
import pieChart from "./components/realtime/pieChart";
import tradeChart from "./components/realtime/tradeChart";
import userChart from "./components/realtime/userChart";
export default {
  name: "realTimeView",
  components: { pfChart,screeningChart,mapChart,pieChart,tradeChart,userChart,serchRt },
  data() {
    const _self = this;
    return {
        activetype: 1,
        startTime: "",
        endTime:"",
        nearDay: 7, 
        dataChart: {},
        type:1,
        seachTime:'',
        userType:0, //1 小程序 2 公众号  ， 用户
        visitSourceType: 1, //1 小程序 2 公众号  ， 渠道转化
        idData:false,//数据是否计算 成功 
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

    chooseType(type){
        this.activetype=type
    },
    //用户  全部 or  小程序  or  公众号
    alluserType() {
      
    },
    all() { //渠道
      
    },
    getVal(val){
        console.log(val)
        this.seachTime=val
    },
    getUserVal(val){
        console.log(val)
        this.seachTime=val
    },
  },
};
</script>
<style lang="scss" scoped>
.viewBut{
    position: fixed;
    top: 50%;
    margin-top: -50px;
    right: 0;
    z-index: 999999;
}
.pb12{
margin-bottom: 12px;
}
.ml12{
margin-left: 12px;
}
.p_container {
  padding:0 28px;
//   margin-bottom: 12px;
  background-color: #fff;
  .p_title{
      width: 100%;
    //   height: 63px;
      border-bottom: 1px solid #EDEDED;
      padding: 15px 0;
    h2{
        font-size: 16px;
        font-weight: 500;
        color: #252A2E;
        line-height: 34px;
        float: left;
        font-family:PingFangSC-Medium,PingFang SC;
    }  
    >img{
        margin: 9px 0 0 5px;
    }
    .refresh{
        float: left;
        width: 28px;
        height: 28px;
        border-radius: 5px;
        background: #F7F9FC;
        margin-left: 10px;
        margin-top: 3px;
        cursor: pointer;
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
        //   width: calc(100% - 580px);
        width: 50%;
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
    //   width: 558px;
    width: 50%;
      float: right;
      padding-left: 30px;
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
::-webkit-scrollbar {//滚动条的宽度
width:0px;
height:0px;
}
.asideBox{
    background: #fff; margin-right:12px;
}
.chartbox{
        width: 100%;
        padding: 20px 0;
      }
.p_ltsiade{
    // width: 65%;
    // min-width: 735px;
    // border-right: 12px solid #f2f2f9;
    padding-bottom: 10px;
    .choose-type{
        padding: 20px 0 10px;
    }
    .choose_item{
        float: left;
        width:176px;
        height:125px;
        border-radius:4px;
        border:1px solid #EDEDED;
        margin-right: 10px;
        margin-bottom: 10px;
        overflow: hidden;
        .chooseBut{
            float: right;
            width: 18px;
            height: 18px;
            cursor: pointer;
            background-image: url(../../assets/images/realtime/choose.png)
        }
        .choosetop{
            height: 75px;
            padding: 10px 15px;
            color: #161617;
            p{
                font-size: 14px;
                line-height: 26px;
            }
            strong{
                font-size: 24px;
                font-family:DINAlternate-Bold,DINAlternate;
            }
        }
        .choosebot{
            font-size: 12px;
            line-height: 18px;
            color: #92929B;
            padding: 6px 15px;
            height: 49px;
            background:#F8F8F8;
            border-top:1px solid #EDEDED;
            p{
                span{
                    float: right;
                    img{
                        padding-right: 3px;
                    }
                }
                span.down{
                    color: #2FC25B;
                }
                span.up{
                    color: #FD4C2B;
                }
            }
        }
    }
    .choose_item:last-child{
        margin-right: 0;
    }
    .choose_item.active{
        background: #F7F7FF;
        border:1px solid #655EFF;
        .choosebot{
            background:#F0EFFF;
        }
        .chooseBut{
            background-image: url(../../assets/images/realtime/choosecur.png);
        }
    }
}
.p_rtsiade{
    background: #fff;
    // width: calc(35% - 0px);
    // min-width:calc(100% - 795px - 12px);
    .chartbox{
        .lengebox{
            width: 160px;
            margin: 0 auto;
            padding: 40px 0 0;
            p{
                height: 20px;
                line-height: 20px;
                color: #161617;
                font-size: 12px;
                margin-bottom: 20px;
                span{
                    float: left;
                    width: 75px;
                    height: 20px;
                    margin-right: 10px;
                }
                span.line1{
                    background: #0077FF;
                }
                span.line2{
                    background: #4FA0FF;
                }
                span.line3{
                    background: #72BAFF;
                }
                span.line4{
                    background: #AFD5FF;
                }
                span.line5{
                    background: #DDEFFF;
                }
            }
        }
    }
}
.p_product{
    padding: 30px 0;
    background: #fff;
    .pro_item{
        width: 100%;
        padding: 0 28px;
        height: 388px;
        border-right: 1px solid #EDEDED;
        .pro_tle{
            width: 248px;
            height: 42px;
            line-height: 36px;
            color: #fff;
            font-size: 16px;
            text-align: center;
            margin: 0 auto;
            font-family:PingFang SC Heavy,PingFang SC;
        }
        .tle1{
            background-image: url(../../assets/images/realtime/title1.png);
        }
        .tle2{
            background-image: url(../../assets/images/realtime/title2.png);
        }
        .tle3{
            background-image: url(../../assets/images/realtime/title3.png);
        }
        ul{
            li{
                width: 100%;
                padding: 10px 0;
                height: 62px;
                color: #3D434A;
                span{
                    float: left;
                }
                span:nth-child(1){
                    width: 36px;
                    text-align: center;
                    img{
                        padding-top: 6px;
                    }
                    span{
                        font-weight: bold;
                        line-height: 42px;
                    }
                }
                span:nth-child(2){
                    width: 60%;
                    text-align: left;
                    padding-left: 40px;
                    img{
                        width: 42px;
                        height: 42px;
                    }
                    p{
                        padding-left: 10px;
                        line-height: 42px;
                        // width: 100%;
                        height: 42px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                }
                span:nth-child(3){
                    width: calc(40% - 36px);
                    text-align: right;
                    p{
                        line-height: 42px;
                    }
                }
            }
            li:first-child{
                padding: 10px 0 0;
                color: #92929B;
                line-height: 28px;
                height: 38px;
            }
        }
    }
    .pro_item.nonerb{
        border-right:none;
    }
}


</style>
<style lang="scss">
.radioBox{
    // margin-right: 12px;
    .btn_bor{
        .el-radio-button__inner{
            border-color: #DADAE3;
            color: #92929B;
        }
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner{
        background-color: #F6F7FA;
            color: #161617;
            box-shadow: -1px 0 0 0 #DADAE3;
    }
    
}
.radioBox label:last-child{
  margin-left: 0px;
}
</style>
