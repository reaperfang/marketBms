<template>
<div>
    <div class="p_container p_channel">
        <div class="clearfix">
          <div class="fr fr_channel">
            <el-radio-group class="fr" v-model="visitSourceType" @change="all">
              <el-radio-button class="btn_bor" label="0" v-permission="['数据', '订单交易', '全部']">全部</el-radio-button>
              <el-radio-button class="btn_bor" label="1" v-permission="['数据', '订单交易', '小程序']">小程序</el-radio-button>
              <el-radio-button class="btn_bor" label="2" v-permission="['数据', '订单交易', '公众号']">公众号</el-radio-button>
              <el-radio-button class="btn_bor" label="3" v-if="isPc">pc</el-radio-button>
              <el-radio-button class="btn_bor" label="4" v-if="isPc">wap</el-radio-button>
            </el-radio-group>
          </div>
       </div>
    </div>
    <div class="p_container">
        <div class="pane_container">
            <p class="p_title">交易总况：</p>
            <div class="order_list">
                <div class="order_line">
                    <div class="clearfix">
                        <img src="../../assets/images/datum/icon_order.png" alt="" class="fl order_img">
                        <span>下单</span>
                    </div>
                    <div v-for="item in placeOrderData" :key="item.id">
                        <span class="marR10">{{item.text}}</span>
                        <span class="addMainColor">{{item.num}}{{item.unit}}</span>
                    </div>
                </div>
                <div class="order_line">
                    <div class="clearfix">
                        <img src="../../assets/images/datum/icon_pay.png" alt="" class="fl order_img">
                        <span>未支付</span>
                    </div>
                    <div v-for="item in nonPaymentData" :key="item.id">
                        <span class="marR10">{{item.text}}</span>
                        <span class="addMainColor">{{item.num}}{{item.unit}}</span>
                    </div>
                </div>
                <div class="order_line">
                    <div class="clearfix">
                        <img src="../../assets/images/datum/icon_money.png" alt="" class="fl order_img">
                        <span>支付</span>
                    </div>
                    <div v-for="item in paymentData" :key="item.id">
                        <span class="marR10">{{item.text}}</span>
                        <span class="addMainColor">{{item.num}}{{item.unit}}</span>
                    </div>
                </div>
            </div>
            <div class="p_blocks">
                <div class="p_item" v-for="item in orderProbabilityData" :key="item.id" >
                    <img :src="item.url" alt="" class="fl">
                    <div class="fr">
                        <p>{{item.text}}</p>
                        <p :style="{color: item.color}">{{item.num}}%</p>
                    </div>
                </div>
            </div>
            <div class="c_line">
                <span class="c_title">交易趋势（单）：</span>
                <div class="line_div">
                    <span class="c_label">筛选日期：</span>
                    <el-radio-group v-model="nearDay" @change="changeDayM">
                        <el-radio-button class="btn_bor" label="7">最近7天</el-radio-button>
                        <el-radio-button class="btn_bor" label="15">最近15天</el-radio-button>
                        <el-radio-button class="btn_bor" label="30">最近30天</el-radio-button>
                        <el-radio-button class="btn_bor" label="4">自定义</el-radio-button>
                    </el-radio-group>
                    <div class="input_wrap" v-show="nearDay == 4">
                        <el-date-picker
                            v-model="range"
                            type="datetimerange"
                            align="right"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="Object.assign(utils.globalTimePickerOption.call(this, false), this.pickerOptions)"
                            @change="changeTime">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <ip4Chart :title="'测试图表'" ref="ip4"></ip4Chart>
        </div>
    </div>
    </div>
</template>
<script>
import ip4Chart from "./components/ip4Chart";
import datumCont from '@/system/constant/datum';

export default {
    name: 'purchaseOrder',
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
            nearDay:7,
            visitSourceType:0,
            startTime: "",
            endTime: "",
            placeOrderData:[],
            nonPaymentData:[],
            paymentData:[],
            orderProbabilityData:[],
            isPc:false
        }
    },
    components:{ip4Chart},
    computed: {  },
    created(){
        this.getTradingTrend()
        this.getOpen()
    },
    methods:{
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

        //切换数据来源
        all(){
            this.getTradingTrend()
        },
        //切换天数
        changeDayM(){
            if(this.nearDay != 4){
                this.startTime = ""
                this.endTime = ""
                this.range = ''
                this.getTradingTrend()
            }
        },
       //自定义时间改变     
        changeTime(val){
            this.startTime = val[0];
            this.endTime = val[1];
            this.nearDay = ''
            this.getTradingTrend()
        },
       
        //获取交易数据
        getTradingTrend(){
            this.placeOrderData = datumCont.placeOrderData
            this.nonPaymentData = datumCont.nonPaymentData
            this.paymentData = datumCont.paymentData
            this.orderProbabilityData = datumCont.orderProbabilityData
            let query = {
                channel:this.visitSourceType,
                nearDay:this.nearDay == '4' ? null : this.nearDay,
                startTime:this.startTime,
                endTime:this.endTime,
            }
            this._apis.data.tradingTrend(query).then(response => {
                // console.log('res',response)
                this.placeOrderData.forEach(e => {
                    switch (e.id){
                        case '01': e.num = response.buyerNum
                            break;
                        case '02': e.num = response.orderNum
                            break;
                        case '03': e.num = response.orderMoneyAmount
                            break;
                        case '04': e.num = response.visitOrderRate
                            break;
                    }
                });
                this.nonPaymentData.forEach(e => {
                    switch (e.id){
                        case '01': e.num = response.noPayerNum
                            break;
                        case '02': e.num = response.noPayOrderNum
                            break;
                        case '03': e.num = response.noPayMoneyAmount
                            break;
                    }
                });
                this.paymentData.forEach(e => {
                    switch (e.id){
                        case '01': e.num = response.payerNum
                            break;
                        case '02': e.num = response.orderPayNum
                            break;
                        case '03': e.num = response.payMoneyAmount
                            break;
                        case '04': e.num = response.orderPayRate
                            break;
                    }
                });
                this.orderProbabilityData.forEach(e => {
                    switch (e.id){
                        case '001': e.num = response.shopRepurchaseRate
                            break;
                        case '002': e.num = response.shopPayRate
                            break;
                    }
                });
                 this.$refs.ip4.con(response.echarts)
            }).catch(error =>{
                console.log(error)
            })
        },
    },
}
</script>
<style lang="scss" scoped>

/**
*
* @Author zpw
* @Update 2020/4/17
* @Description  产研-电商中台  bugID: CYDSZT-3450
*
*/

.p_channel{
    padding:0px;
    margin-bottom:20px;
    .fr_channel{
        float:left;
        margin-left:38px;
    }
}
.p_container{
    padding: 20px;
    background-color: #fff;
    .pane_container{
        color: #3D434A;
        padding: 23px 38px;
        .p_title{
            font-size: 16px;
            font-weight: bold;
            color: #474C53;
        }
        .p_blocks{
            width: 900px;
            display: flex;
            flex-wrap: wrap;
            margin: 15px 0;
        }
        .title_line{
            height: 86px;
            line-height: 86px;
            margin: 5px 0;
        }
        .p_item{
            width: 200px;
            height: 86px;
            border: 1px solid #CCCCCC;
            margin: 0 14px 12px 0;
            border-radius: 4px;
            img{
                margin: 19px 0 0 8px;
            }
            div{
                width: 105px;
                margin:19px 19px 0 0;
                p{
                    text-align: center;
                    &:last-child{
                        font-size: 22px;
                        margin-top: 8px;
                    }
                }
            }
        }
        .c_line{
            padding-top: 30px;
            border-top: 1px dashed #D3D3D3;
            // display: flex;
            // justify-content:space-between;
            .c_title{
                font-weight: bold;
                color: #474C53;
                font-size: 16px;
            }
            .c_label{
                color: #474C53;
            }
            div{
                &.line_div{
                    margin-top:30px;
                }
                .input_wrap{
                    width: 220px;
                    margin-left:10px;
                    display: inline-block;
                }
            }
        }
        .order_list{
            width: 1080px;
            margin: 22px 0;
            border-top: 1px solid #CACFCB;
            .order_line{
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                height: 60px;
                line-height: 60px;
                border-bottom: 1px solid #CACFCB;
                div{
                    flex: 1;
                }
                .order_img{
                    margin:20px 5px 0 0;
                }
            }
        }
    }
}
.el-radio-group label:last-child{
  margin-left: 0px;
}
</style>

