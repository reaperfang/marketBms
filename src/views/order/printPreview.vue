<template>
    <div class="print_preview_body">
        <!-- <div class="print_preview_info">
            <div class="print_preview_left">
                <p>打印配送单小票</p>
                <a href="javascript:void(0)">修改打印机设置</a>
            </div>
            <div class="print_preview_center"></div>
            <div class="print_preview_right"></div>
        </div> -->
        <el-row class="print_preview_info">
            <el-col :span="8" class="print_preview_left">
                <p>打印配送单小票</p>
                <a href="javascript:void(0)">修改打印机设置</a>
            </el-col>
            <el-col :span="8" class="print_preview_center">
                <!-- <div class="print_preview_center_mx">
                    <div class="print_preview_center_title">有翼云餐饮店荣昌东街店</div>
                    <p class="border"></p>
                    <div class="info">
                        <div class="info_li">
                            <p class="info_p"><span class="info_p_l">订单号：</span><span class="info_p_r">PD20111ddddddddddddd9061000001</span></p>
                            <p class="info_p"><span class="info_p_l">交易方式：</span><span class="info_p_r">PD2019061000001</span></p>
                            <p class="info_p"><span class="info_p_l">交易时间：</span><span class="info_p_r">PD2019061000001</span></p>
                        </div>
                        <p class="border"></p>
                        <div class="info_li info_li2">
                            <div class="info_li2_tab">
                                <span class="good_name">商品名称</span>
                                <span class="number">数量</span>
                                <span class="money">金额</span>
                                <span class="fh_number">发货数量</span>
                            </div>
                            <ul class="info_li2_mx">
                                <li class="clearfix">
                                    <p class="info_li2_mx_p0"><span>麻辣鱼头麻辣鱼头辣鱼头麻辣</span></p>
                                    <p class="info_li2_mx_p1 fr"><span class="number_i">×2</span><span class="money_i">￥129.00</span><span class="fh_number_i">2</span></p>
                                </li>
                                <li class="clearfix">
                                    <p class="info_li2_mx_p0"><span>麻辣鱼头麻辣鱼头麻辣鱼头辣鱼头麻辣</span></p>
                                    <p class="info_li2_mx_p1 fr"><span class="number_i">×2</span><span class="money_i">￥129.00</span><span class="fh_number_i">2</span></p>
                                </li>
                            </ul>
                        </div>
                        <p class="border"></p>
                        <div class="info_li">
                            <p class="info_p"><span class="info_p_l">商品总金额：</span><span class="info_p_r">￥80.00</span></p>
                            <p class="info_p"><span class="info_p_l">运费：</span><span class="info_p_r">￥6.00</span></p>
                            <p class="info_p"><span class="info_p_l">订单总金额：</span><span class="info_p_r">￥86.00</span></p>
                            <p class="info_p"><span class="info_p_l">优惠金额：</span><span class="info_p_r">￥6.00</span></p>
                            <p class="info_p"><span class="info_p_l">余额抵扣：</span><span class="info_p_r">￥86.00</span></p>
                        </div>
                    </div>
                </div> -->
                <div class="print_preview_center_mx" v-for="(item,index) in printOrderInfo" :key="index">
                    <div class="print_preview_center_title">{{item.shopName}}</div>
                    <p class="border"></p>
                    <div class="info">
                        <div class="info_li">
                            <p class="info_p"><span class="info_p_l">订单号：</span><span class="info_p_r">{{item.orderCode}}</span></p>
                            <p class="info_p" v-if="!!item.payWay">
                                <span class="info_p_l">交易方式：</span>
                                <!-- <span class="info_p_r" v-text="item.payWay==1?'微信支付':(item.payWay==2?'货到付款'):(item.payWay==3?'找人代付')?
                                    (item.payWay==4?'线下支付')?(item.payWay==5?'线上支付')?(item.payWay==6?'支付宝支付'):''"></span> -->
                                    <span class="info_p_r" v-text="item.payWay==1?'微信支付':item.payWay==2?'货到付款':item.payWay==3?'找人代付':
                                    item.payWay==4?'线下支付':item.payWay==5?'线上支付1':item.payWay==6?'支付宝支付':''"></span>
                            </p>
                            <p class="info_p"><span class="info_p_l">交易时间：</span><span class="info_p_r">{{item.createTime}}</span></p>
                        </div>
                        <p class="border"></p>
                        <div class="info_li info_li2">
                            <div class="info_li2_tab">
                                <span class="good_name">商品名称</span>
                                <span class="number">数量</span>
                                <span class="money">金额</span>
                                <span class="fh_number">发货数量</span>
                            </div>
                            <ul class="info_li2_mx">
                                <li class="clearfix">
                                    <p class="info_li2_mx_p0"><span>麻辣鱼头麻辣鱼头辣鱼头麻辣</span></p>
                                    <p class="info_li2_mx_p1 fr"><span class="number_i">×2</span><span class="money_i">￥129.00</span><span class="fh_number_i">2</span></p>
                                </li>
                                <li class="clearfix">
                                    <p class="info_li2_mx_p0"><span>麻辣鱼头麻辣鱼头麻辣鱼头辣鱼头麻辣</span></p>
                                    <p class="info_li2_mx_p1 fr"><span class="number_i">×2</span><span class="money_i">￥129.00</span><span class="fh_number_i">2</span></p>
                                </li>
                            </ul>
                        </div>
                        <p class="border"></p>
                        <div class="info_li">
                            <p class="info_p"><span class="info_p_l">商品总金额：</span><span class="info_p_r">￥{{item.goodsAmount}}</span></p>
                            <p class="info_p"><span class="info_p_l">运费：</span><span class="info_p_r">￥{{item.freight}}</span></p>
                            <p class="info_p"><span class="info_p_l">订单总金额：</span><span class="info_p_r">￥{{item.receivableMoney}}</span></p>
                            <p class="info_p"><span class="info_p_l">优惠金额：</span><span class="info_p_r">￥{{item.reducedPrice}}</span></p>
                            <p class="info_p"><span class="info_p_l">余额抵扣：</span><span class="info_p_r">￥{{item.discountMoney}}</span></p>
                        </div>
                    </div>
                </div>
                
                <!-- 分页 -->
                <el-pagination
                    v-if="printOrderInfo.length>1" 
                    class="pagination"
                    background
                    :total="5" 
                    :page-size="1"
                    :pager-count="5"
                    :current-page="1"
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                >
                </el-pagination>
            </el-col>
            <!-- 去打印 -->
            <el-col :span="8" class="print_preview_right">
                <el-button class="fr" type="primary" size="small" :loading="false">去打印</el-button>
            </el-col>
        </el-row>
        
    </div>
</template>
<script>
export default {
    data() {
        return {
            printOrderInfo:[]
        }
    },
    computed: {
    },
    created(){
        console.log(this.$route.query.orderIds.split(","))
        console.log(this.$route.query.printType)
        if(this.$route.query.orderIds&&this.$route.query.printType){
            this.getPrinterInfo()
        }
    },
    methods:{
        getPrinterInfo(){
            //printType 0：最后一次发货(入口:从发货后打印配送单)；1：所有发货(入口:批量打印配送单)
            this._apis.order.shopPrinterPreview({
                ids:this.$route.query.orderIds.split(","),
                printType:this.$route.query.printType
            }).then(res => {
                console.log(res)
                this.printOrderInfo=!!res.printOrderInfo?res.printOrderInfo:[]
            })
            .catch(error => {});
        },
        //分页页码改变
        handleCurrentChange(val){
            console.log(val)
        }
    }
}
</script>
<style lang="scss" scoped>
.print_preview_body{
    padding: 20px;
    background: #fff;
    height: 100%;
    .print_preview_info{
        height: 100%;
        padding: 0px 10px 18px 0px;
        display: flex;
        display:flex;
        display:-webkit-flex;
        justify-content:space-between;
        // flex-wrap:wrap;
        .print_preview_left{
            font-size: 14px;
            color: #3D434A;
            line-height: 20px;
            a{
                color: #655EFF;
                margin-top: 20px;
                display: block;
            }
        }
        .print_preview_center{
            width: 272px;
            height: 100%;
            .print_preview_center_mx{
                width: 100%;
                height: calc(100% - 72px);
                background: #fff;
                box-shadow:0px 0px 8px 0px rgba(0,0,0,0.1);
                border:2px solid rgba(242,242,249,1);
                overflow-y:auto;
                padding:24px 12px 8px 12px;
                font-size:14px;
                font-family:PingFangSC-Regular,PingFang SC;
                color:#000000;
                line-height:20px;
                text-shadow:0px 0px 8px rgba(0,0,0,0.1);
                position: relative;
                .print_preview_center_title{
                    font-weight:500;
                    line-height:30px;
                    font-size: 22px;
                    padding: 0 46px;
                    text-align: center;
                    height: auto;
                    padding-bottom: 20px;
                }
                .border{
                    width: 100%;
                    height: 0px;
                    border-top: 2px dashed #ADA9A7;
                    display: block;
                }
                .info{
                    .info_li{
                        margin-top: 12px;
                        margin-bottom: 12px; 
                        .info_p{
                            display: flex;
                            display: -webkit-flex;
                            justify-content: space-between;
                            flex-wrap: wrap;
                            margin-bottom: 10px;
                            .info_p_l{
                                flex: 1;
                                max-width: 100px;
                            }
                            .info_p_r{
                                flex: 1;
                                word-break: break-all;
                                text-align: right;
                            }
                        }
                    }
                    .info_li2{
                        .info_li2_tab{
                            .good_name{padding-right: 6px;}
                            .number{padding-right: 22px;}
                            .money{padding-right: 20px;}
                        }
                        .info_li2_mx{
                            margin-top: 10px;
                            padding-right: 20px;
                            li{
                                margin-top: 4px;
                            }
                            .info_li2_mx_p0{
                                // text-align: right;
                                display: flex;
                            }
                            .info_li2_mx_p1{
                                margin-top: 2px;
                                text-align: right;
                                display: flex;
                                flex-wrap: wrap;
                                .number_i{
                                    padding-right: 34px;
                                }
                                .money_i{
                                    padding-right: 32px;
                                    flex: 1;
                                    word-break: break-all;
                                }
                            }
                        }
                    }
                }
            }
            .pagination{margin-top: 40px;}
        } 
    }
    
}
</style>