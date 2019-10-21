<template>
    <div class="p_container">
        <div class="clearfix">
          <div class="fr">
            <el-radio-group class="fr" v-model="visitSourceType" @change="all">
              <el-radio-button class="btn_bor" label="0" v-permission="['数据', '订单交易', '全部']">全部</el-radio-button>
              <el-radio-button class="btn_bor" label="1" v-permission="['数据', '订单交易', '小程序']">小程序</el-radio-button>
              <el-radio-button class="btn_bor" label="2" v-permission="['数据', '订单交易', '公众号']">公众号</el-radio-button>
            </el-radio-group>
          </div>
       </div>
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
                <span class="c_title">交易趋势（单）</span>
                <div>
                    <span class="c_label">筛选日期：</span>
                    <el-radio-group v-model="nearDay" @change="changeDayM">
                        <el-radio-button class="btn_bor" label="7">最近7天</el-radio-button>
                        <el-radio-button class="btn_bor" label="15">最近15天</el-radio-button>
                        <el-radio-button class="btn_bor" label="30">最近30天</el-radio-button>
                        <el-radio-button class="btn_bor" label="4">自定义</el-radio-button>
                    </el-radio-group>
                    <div class="input_wrap" v-if="nearDay == 4">
                        <el-date-picker
                            v-model="range"
                            type="daterange"
                            range-separator="—"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                            @change="changeTime">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <ip4Chart :title="'测试图表'" ref="ip4"></ip4Chart>
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
                    return time.getTime() > Date.now() - 8.64e7
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
            orderProbabilityData:[]
        }
    },
    components:{ip4Chart},
    computed: {  },
    created(){
        this.getTradingTrend()
    },
    methods:{
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
.p_container{
    padding: 20px;
    background-color: #fff;
    .pane_container{
        color: #3D434A;
        padding: 23px 38px;
        .p_title{
            font-size: 16px;
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
            width: 176px;
            height: 86px;
            border: 1px solid #CCCCCC;
            margin: 0 34px 12px 0;
            border-radius:4px;
            img{
                margin: 19px 0 0 8px;
            }
            div{
                width: 105px;
                margin:19px 6px 0 0;
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
            display: flex;
            justify-content:space-between;
            div{
                &.c_title{
                    font-weight: bold;
                    color: #474C53;
                }
                &.c_label{
                    margin-right: 30px;
                    color: #474C53;
                }
                .input_wrap{
                    width: 220px;
                    display: block;
                    margin-left:35px;
                    margin-top:10px;
                }
            }
        }
        .order_list{
            width: 866px;
            margin: 22px 0;
            border-top: 1px solid #CACFCB;
            .order_line{
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                height: 60px;
                line-height: 60px;
                border-bottom: 1px solid #CACFCB;
                .order_img{
                    margin:20px 5px 0 0;
                }
            }
        }
    }
}
</style>

