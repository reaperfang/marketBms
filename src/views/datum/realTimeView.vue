<template>
<div>
    <!-- 悬浮按钮 数据大屏 -->
    <router-link v-permission="['数据', '实时概况','默认页面', '查看']" class="viewBut" tag="a" target="_blank" :to="{ name: 'dashboard'}">
        <img src="@/assets/images/realtime/curtime.png" alt="">
    </router-link>
    <!-- <div class="viewBut" @click="_routeTo('dashboard')"><img src="@/assets/images/realtime/curtime.png" alt=""></div> -->
    <!-- 数据总览 -->
    <div class="p_container pb12">
       <div class="p_title clearfix">
           <h2>数据总览</h2>
           <span @click="refreshData()" class="refresh"><img src="@/assets/images/realtime/refresh.png" alt=""></span>
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
                <strong class="fl">{{dataRt.paid_order_am_rt | tofix2}}</strong>
                <span class="fl">昨日全天：<span>{{dataRt.paid_order_am_td | tofix2}}</span></span>
            </div>
            <screeningChart 
    :title="'测试图表'" 
    ref="screeningChart"
    :dataChart="dataChart1" height="300px" >
    </screeningChart>
        </div>
        <div class="card-content">
            <div class="card-item">
                <div class="item-top">
                    <p>支付金额（元）</p>
                    <span> <strong>{{dataRt.paid_order_am_rt | tofix2}}</strong> </span>
                </div>
                <p v-if="idData">昨日全天：<span >{{dataRt.paid_order_am_td | tofix2}}</span></p>
                <p v-else>昨日全天：更新中~</p>
            </div>
            <div class="card-item">
                <div class="item-top">
                    <p>支付订单数（单）</p>
                    <span> <strong>{{dataRt.paid_order_cq_rt}}</strong> <el-button type="text" @click="_routeTo('query')">查看</el-button> </span>
                </div>
                <p v-if="idData">昨日全天：<span >{{dataRt.paid_order_cq_td}}</span></p>
                <p v-else>昨日全天：更新中~</p>
            </div>
            <div class="card-item">
                <div class="item-top">
                    <p>支付人数（人）</p>
                    <span> <strong>{{dataRt.paid_order_nu_rt}}</strong> </span>
                </div>
                <p v-if="idData">昨日全天：<span >{{dataRt.paid_order_nu_td}}</span></p>
                <p v-else>昨日全天：更新中~</p>
            </div>
            <div class="card-item">
                <div class="item-top">
                    <p>退款金额（元）</p>
                    <span> <strong>{{dataRt.refund_am_rt | tofix2}}</strong></span>
                </div>
                <p v-if="idData">昨日全天：<span >{{dataRt.refund_am | tofix2}}</span></p>
                <p v-else>昨日全天：更新中~</p>
            </div>
            <div class="card-item">
                <div class="item-top">
                    <p>退款订单数（单）</p>
                    <span> <strong>{{dataRt.refund_cq_rt}}</strong> <el-button type="text" @click="_routeTo('afterSalesManagement')">查看</el-button> </span>
                </div>
                <p v-if="idData">昨日全天：<span >{{dataRt.refund_cq}}</span></p>
                <p v-else>昨日全天：更新中~</p>
            </div>
            <div class="card-item">
                <div class="item-top">
                    <p>客单价（元）</p>
                    <span> <strong>{{dataRt.atv_rt | tofix2}}</strong>  </span>
                </div>
                <p v-if="idData">昨日全天：<span >{{dataRt.atv_td | tofix2}}</span></p>
                <p v-else>昨日全天：更新中~</p>
            </div>
            <div class="card-item">
                <div class="item-top">
                    <p>访客数量（次）</p>
                    <span> <strong>{{dataRt.uv_rt}}</strong> </span>
                </div>
                <p v-if="idData">昨日全天：<span >{{dataRt.uv}}</span></p>
                <p v-else>昨日全天：更新中~</p>
            </div>
            <div class="card-item">
                <div class="item-top">
                    <p>浏览数量（次）</p>
                    <span> <strong>{{dataRt.pv_rt}}</strong> </span>
                </div>
                <p v-if="idData">昨日全天：<span >{{dataRt.pv}}</span></p>
                <p v-else>昨日全天：更新中~</p>
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
                    <div class="choose_item" :class="checkList[0]?'active':''">
                        <div class="choosetop">
                            <p>支付金额（元）<span class="chooseBut" @click="chooseType(0)"></span></p>
                            <span> <strong>{{dataType.paid_order_am | tofix2}}</strong> </span>
                        </div>
                        <div class="choosebot">
                            <p>较前一{{unitsList[seachTimetrad.units]}}：<span v-if="dataType.paid_order_am_rg_pct!='-9999'" :class="dataType.paid_order_am_rg_pct>0?'up':'down'">
                                <img :src="dataType.paid_order_am_rg_pct>0?imgup:imgdown" alt="">
                                {{Math.abs(dataType.paid_order_am_rg_pct*100).toFixed(2)}}%</span><span v-else>--</span></p>
                            <p>较上{{unitsbt[seachTimetrad.units]}}同期：<span v-if="dataType.paid_order_am_up_pct!='-9999'" :class="dataType.paid_order_am_up_pct>0?'up':'down'">
                                <img :src="dataType.paid_order_am_up_pct>0?imgup:imgdown" alt="">
                                {{Math.abs(dataType.paid_order_am_up_pct*100).toFixed(2)}}%</span><span v-else>--</span></p>
                        </div>
                    </div>
                    <div class="choose_item" :class="checkList[1]?'active':''">
                        <div class="choosetop">
                            <p>支付订单数（单）<span class="chooseBut" @click="chooseType(1)"></span></p>
                            <span> <strong>{{dataType.paid_order_cq}}</strong> </span>
                        </div>
                        <div class="choosebot">
                            <p>较前一{{unitsList[seachTimetrad.units]}}：<span v-if="dataType.paid_order_cq_rg_pct!='-9999'" :class="dataType.paid_order_cq_rg_pct>0?'up':'down'">
                                <img :src="dataType.paid_order_cq_rg_pct>0?imgup:imgdown" alt="">
                                {{Math.abs(dataType.paid_order_cq_rg_pct*100).toFixed(2)}}%</span>
                                <span v-else>--</span>
                                </p>
                            <p>较上{{unitsbt[seachTimetrad.units]}}同期：<span v-if="dataType.paid_order_cq_up_pct!='-9999'" :class="dataType.paid_order_cq_up_pct>0?'up':'down'">
                                <img :src="dataType.paid_order_cq_up_pct>0?imgup:imgdown" alt="">
                                {{Math.abs(dataType.paid_order_cq_up_pct*100).toFixed(2)}}%</span>
                                <span v-else>--</span>
                                </p>
                        </div>
                    </div>
                    <div class="choose_item" :class="checkList[2]?'active':''">
                        <div class="choosetop">
                            <p>支付人数（人）<span class="chooseBut" @click="chooseType(2)"></span></p>
                            <span> <strong>{{dataType.paid_order_nu}}</strong> </span>
                        </div>
                        <div class="choosebot">
                            <p>较前一{{unitsList[seachTimetrad.units]}}：<span v-if="dataType.paid_order_nu_rg_pct!='-9999'" :class="dataType.paid_order_nu_rg_pct>0?'up':'down'">
                                <img :src="dataType.paid_order_nu_rg_pct>0?imgup:imgdown" alt="">
                                {{Math.abs(dataType.paid_order_nu_rg_pct*100).toFixed(2)}}%</span><span v-else>--</span></p>
                            <p>较上{{unitsbt[seachTimetrad.units]}}同期：<span v-if="dataType.paid_order_nu_up_pct!='-9999'" :class="dataType.paid_order_nu_up_pct>0?'up':'down'">
                                <img :src="dataType.paid_order_nu_up_pct>0?imgup:imgdown" alt="">
                                {{Math.abs(dataType.paid_order_nu_up_pct*100).toFixed(2)}}%</span><span v-else>--</span></p>
                        </div>
                    </div>
                    <div class="choose_item" :class="checkList[3]?'active':''">
                        <div class="choosetop">
                            <p class="clearfix"> <span class="fl">客单价（元）</span> 
                                <el-tooltip class="item" effect="dark" content="统计时间内，用户平均消费金额" placement="top-start">
                                <img class="fl" style="margin-top:5px" src="@/assets/images/realtime/hoverTips.png" alt="">
                                </el-tooltip>
                                <span class="chooseBut" @click="chooseType(3)"></span>
                            </p>
                            <span> <strong>{{dataType.atv | tofix2}}</strong> </span>
                        </div>
                        <div class="choosebot">
                            <p>较前一{{unitsList[seachTimetrad.units]}}：<span v-if="dataType.atv_rg_pct!='-9999'" :class="dataType.atv_rg_pct>0?'up':'down'">
                                <img :src="dataType.atv_rg_pct>0?imgup:imgdown" alt="">
                                {{Math.abs(dataType.atv_rg_pct*100).toFixed(2)}}%</span><span v-else>--</span></p>
                            <p>较上{{unitsbt[seachTimetrad.units]}}同期：<span v-if="dataType.atv_up_pct!='-9999'" :class="dataType.atv_up_pct>0?'up':'down'">
                                <img :src="dataType.atv_up_pct>0?imgup:imgdown" alt="">
                                {{Math.abs(dataType.atv_up_pct*100).toFixed(2)}}%</span><span v-else>--</span></p>
                        </div>
                    </div>
                </div>
                <tradeChart :title="'测试图表'" ref="tradeChart" :dataChart="dataChart3" :checkList="checkList" height="420px" ></tradeChart>
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
                    :dataChart="dataChart4" height="300px" >
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
                            <el-radio-button class="btn_bor" label="0" >全部</el-radio-button>
                            <el-radio-button class="btn_bor" label="1" >小程序</el-radio-button>
                            <el-radio-button class="btn_bor" label="2" >公众号</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <div class="chartbox">
                    <userChart :title="'测试图表'" ref="userChart" :dataChart="dataChart2" height="300px" ></userChart>
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
                            <el-radio-button class="btn_bor" label="1" >小程序</el-radio-button>
                            <el-radio-button class="btn_bor" label="2" >公众号</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                </div>
                <div class="chartbox">
                    <pieChart :title="'测试图表'" ref="pieChart" :dataChart="dataChart" height="280px"></pieChart>
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
                        <li v-for="(item,index) in goodsList.payProducttop5" :key="index">
                            <span v-if="index==0"><img class="fl" src="@/assets/images/realtime/top1.png" alt=""></span>
                            <span v-if="index==1"><img class="fl" src="@/assets/images/realtime/top2.png" alt=""></span>
                            <span v-if="index==2"><img class="fl" src="@/assets/images/realtime/top3.png" alt=""></span>
                            <span v-if="index==3">04</span>
                            <span v-if="index==4">05</span>
                            <span><img class="fl" :src="item.goods_image" alt=""><p>{{item.goods_name}}</p></span>
                            <span><p>{{item.paid_order_am_pr}}</p></span>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="pro_item">
                    <div class="pro_tle tle2">销量商品TOP</div>
                    <ul>
                        <li><span>排名</span><span>商品</span><span>销量</span></li>
                        <li v-for="(item,index) in goodsList.saleProducttop5" :key="index">
                            <span v-if="index==0"><img class="fl" src="@/assets/images/realtime/top1.png" alt=""></span>
                            <span v-if="index==1"><img class="fl" src="@/assets/images/realtime/top2.png" alt=""></span>
                            <span v-if="index==2"><img class="fl" src="@/assets/images/realtime/top3.png" alt=""></span>
                            <span v-if="index==3">04</span>
                            <span v-if="index==4">05</span>
                            <span><img class="fl" :src="item.goods_image" alt=""><p>{{item.goods_name}}</p></span>
                            <span><p>{{item.product_nu}}</p></span>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="pro_item nonerb">
                    <div class="pro_tle tle3">浏览商品TOP</div>
                    <ul>
                        <li><span>排名</span><span>商品</span><span>浏览数</span></li>
                        <li v-for="(item,index) in goodsList.browseProducttop5" :key="index">
                            <span v-if="index==0"><img class="fl" src="@/assets/images/realtime/top1.png" alt=""></span>
                            <span v-if="index==1"><img class="fl" src="@/assets/images/realtime/top2.png" alt=""></span>
                            <span v-if="index==2"><img class="fl" src="@/assets/images/realtime/top3.png" alt=""></span>
                            <span v-if="index==3">04</span>
                            <span v-if="index==4">05</span>
                            <span><img class="fl" :src="item.goods_image" alt=""><p>{{item.goods_name}}</p></span>
                            <span><p>{{item.pv_pr}}</p></span>
                        </li>
                    </ul>
                </div>
            </el-col>
        </el-row>
    </div>
    <!-- 数据是否计算完成 弹窗 -->
    <div class="dataInfo" v-if="showData">
        <div class="infoTle">提示</div>
        <div class="infoCon">
            <p>
                <img src="@/assets/images/realtime/infoimg.png" alt="">
                <strong>您的店铺统计数据预计在凌晨1:00前更新完成</strong>
            </p>
            <span>{{seconds}}S后自动关闭</span>
        </div>
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
  filters: {
    // tofix2: function(value) {
    //   if(typeof(value)=='undefined'){
    //       return value
    //   }else{
    //       console.log((0.106).toFixed(2))
    //       return Number(value).toFixed(2)
    //   }
    // },
    tofix2: function(num) {
        var  dd=1;  
        var  tempnum;  
        for(var i=0;i<2;i++){
            dd*=10;  
        }  
        tempnum = num*dd;
        tempnum = Math.round(tempnum); 
        return (tempnum/dd)
    },
  },
  data() {
    const _self = this;
    return {
        imgup:require('@/assets/images/realtime/imgup.png'),
        imgdown:require('@/assets/images/realtime/imgdown.png'),
        unitsList:['日','周','月','季度'],
        unitsbt:['周','去年','去年','去年'],
        checkList:[true,false,false,false],
        activetype: 0,
        dataType:{},
        startTime: "",
        endTime:"",
        nearDay: 7, 
        dataRt:{},//右侧 类别数据
        dataChart1: {},//数据总览
        dataChart2: {},//用户概览
        dataChart3: {},//交易看板
        dataChart4: {},//交易分布
        dataChart: [],//渠道转化
        type:1,
        seachTimetrad:{
            units:0,
            date:''
        },
        seachTime:{
            units:0,
            date:''
        },
        userType:0, //1 小程序 2 公众号  ， 用户
        channeData:{},
        visitSourceType: 1, //1 小程序 2 公众号  ， 渠道转化
        idData:false,//数据是否计算 成功 
        showData:false,
        seconds:3,
        goodsList:[],
        query:{
            invokeType:'mzw'
        }
    };
  },
  created() {
      localStorage.setItem("refreshTime",'')
    this.init()
  }, 
  methods: {
    init(){
      this.getdataReady()  
      this.getdataView()
      this.getuserView()
      this.gettransactionView()
      this.gettradeDistribution()
      this.getchannelView()
      this.getgoodsView()
    },

    getdataReady(){//移动商城数据是否完成准备接口
      this._apis.realSurvey.dataReady(this.query).then(response => {
          var oldTime=new Date(JSON.parse(response).date).getTime();
          var oldDatetime=new Date(new Date(oldTime).getFullYear(),new Date(oldTime).getMonth(),new Date(oldTime).getDate())
          if(new Date(oldDatetime).toDateString() === new Date().toDateString()){//判断是不是同一天
              this.idData=true
          }else{
              this.idData=false
              this.showData=true
          }
            this.timer()
      }).catch(error => {
        this.$message.error(error);
      });
    },
    timer() {
      var _this = this;
      var time = window.setInterval(function() {
          _this.seconds -= 1;
        if (_this.seconds === 0) {
          window.clearInterval(time);
          _this.showData=false
        }
      }, 1000);
    },
    getdataView(){//数据总览数据
      this._apis.realSurvey.dataView(this.query).then(response => {
        this.dataRt = JSON.parse(response)  
        this.dataChart1 = {
            xAxis:JSON.parse(response).x,
            data_rt:JSON.parse(response).data_rt,
            data_rd:JSON.parse(response).data_rd,//昨日
        }
        console.log(this.dataChart1)
      }).catch(error => {
        this.$message.error(error);
      });
    },
    refreshData(){//刷新数据总览数据
        var oldTime=localStorage.getItem("refreshTime")
        var newTime=new Date().getTime();
        localStorage.setItem("refreshTime",newTime)
        var s=(newTime-oldTime)/1000
        console.log(s)
        if(s>=600){
            this.getdataView()
        }else{
            this.$message({
                message: '刷新频繁，请10分钟后再进行刷新!',
                type: 'warning'
            });
        }
        
    },
    gettransactionView(){//交易看板数据
    this.query.units=this.seachTimetrad.units
    this.query.date=this.seachTimetrad.date
      this._apis.realSurvey.transactionView(this.query).then(response => {
        this.dataType = JSON.parse(response)
        // console.log(this.dataType)
        var allData=[]
        allData.push(this.dataType.pay_amounts)
        allData.push(this.dataType.pay_order_nums)
        allData.push(this.dataType.pay_people_nums)
        allData.push(this.dataType.per_customer_transactions)
        this.dataChart3 = {
            xAxis:JSON.parse(response).x,
            data:allData,
        }
      }).catch(error => {
        this.$message.error(error);
      });
    },
    gettradeDistribution(){//交易分布数据
        this._apis.realSurvey.tradeDistribution(this.query).then(response => {
            console.log(JSON.parse(response))
            this.dataChart4 = JSON.parse(response)  
        }).catch(error => {
            this.$message.error(error);
        });
    },
    getuserView(){//用户概览数据
        this.query.channelType=this.userType,
        this.query.units=this.seachTime.units,
        this.query.date=this.seachTime.date,
        this._apis.realSurvey.userView(this.query).then(response => {
            this.dataChart2 = {
                xAxis:JSON.parse(response).x,
                yAxis1:JSON.parse(response).c_uv_sh_channel,//总数
                yAxis2:JSON.parse(response).new_c_uv,//新增用户
                yAxis3:JSON.parse(response).new_cmember,//新增会员
            }
        }).catch(error => {
            this.$message.error(error);
        });
    },
    
    chooseType(type){//交易看板选择金额类型
        this.$set(this.checkList,type,!this.checkList[type])
    },
    //用户  全部 or  小程序  or  公众号
    alluserType() {// userType
        this.getuserView()
    },
    getchannelView(){//渠道转化数据
        this._apis.realSurvey.channelView(this.query).then(response => {
            this.channeData = JSON.parse(response)  
            this.dataChart.push({value:this.channeData.nomember_xcx, name:'非会员'})
            this.dataChart.push({value:this.channeData.member_xcx, name:'会员'})
        }).catch(error => {
            this.$message.error(error);
        });
    },
    all() { //渠道  visitSourceType
        var thisdata=[]
        if(this.visitSourceType==1){
            thisdata.push({value:this.channeData.nomember_xcx, name:'非会员'})
            thisdata.push({value:this.channeData.member_xcx, name:'会员'})
        }else if(this.visitSourceType==2){
            thisdata.push({value:this.channeData.nomember_gzh, name:'非会员'})
            thisdata.push({value:this.channeData.member_gzh, name:'会员'})
        }
        this.dataChart=thisdata
    },
    getVal(val){//交易看板 组件传值
        val.date=this.getDayTime(val.date)
        this.seachTimetrad=val
        this.activetype=0
        this.gettransactionView()
    },
    getUserVal(val){//用户概览 组件传值
        val.date=this.getDayTime(val.date)
        console.log(val.date)
        this.seachTime=val
        this.getuserView()
    },
    getDayTime(val){ //把时间戳 转为 2020-08-16格式
        let date = new Date(val);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var day=y + '-' + MM + '-' + d
        // console.log(day)
        return day
    },
    getgoodsView(){//商品看板数据
      this._apis.realSurvey.goodsView(this.query).then(response => {
        this.goodsList = JSON.parse(response)  
      }).catch(error => {
        this.$message.error(error);
      });
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
            margin-top: 4px;
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
.dataInfo{
   width: 420px;
    height: 193px;
    background: #FFFFFF;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
    border-radius: 3px; 
    position: fixed;
    right: 28px;
    bottom: 10px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    font-size: 16px;
    color: #44434B;
    .infoTle{
        width: 420px;
        height: 50px;
        padding: 0 20px;
        background: #F6F7FA;
        border-radius: 3px 3px 0px 0px;
        line-height: 50px;
    }
    .infoCon{
        text-align: center;
        P{
            padding: 40px 30px 10px;
            line-height: 30px;
            img{
                float: left;
                margin-right: 10px;
            }
            strong{
                width: 320px;
                text-align: left;
                font-weight: 500;
            }
        }
        >span{
            font-size: 12px;
            color: #92929B;
            line-height: 20px;
        }
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
