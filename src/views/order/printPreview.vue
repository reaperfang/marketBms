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
                <a href="javascript:void(0)" @click="handlePrinterSet">修改打印机设置</a>
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
                <div class="print_preview_center_box" v-loading="info_loading">
                    <div class="print_preview_center_mx">
                        <div class="print_preview_center_title" v-if="printOrderInfoCurret.shopName">{{printOrderInfoCurret.shopName}}</div>
                        <p class="border"></p>
                        <div class="info">
                            <div class="info_li">
                                <p class="info_p" v-if="printOrderInfoCurret.code"><span class="info_p_l">订单号：</span><span class="info_p_r">{{printOrderInfoCurret.code}}</span></p>
                                <p class="info_p" v-if="printOrderInfoCurret.payWay">
                                    <span class="info_p_l">支付方式：</span>
                                    <!-- <span class="info_p_r" v-text="printOrderInfoCurret.payWay==1?'微信支付':(printOrderInfoCurret.payWay==2?'货到付款'):(printOrderInfoCurret.payWay==3?'找人代付')?
                                        (printOrderInfoCurret.payWay==4?'线下支付')?(printOrderInfoCurret.payWay==5?'线上支付')?(printOrderInfoCurret.payWay==6?'支付宝支付'):''"></span> -->
                                        <span class="info_p_r" v-text="printOrderInfoCurret.payWay==1?'微信支付':printOrderInfoCurret.payWay==2?'货到付款':printOrderInfoCurret.payWay==3?'找人代付':
                                        printOrderInfoCurret.payWay==4?'线下支付':printOrderInfoCurret.payWay==5?'线上支付':printOrderInfoCurret.payWay==6?'支付宝支付':''"></span>
                                </p>
                                <p class="info_p" v-if="printOrderInfoCurret.createTime"><span class="info_p_l">交易时间：</span><span class="info_p_r">{{printOrderInfoCurret.createTime}}</span></p>
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
                                    <li class="clearfix" v-for="(item,index) in printOrderInfoCurret.itemList" :key="index">
                                        <p class="info_li2_mx_p0"><span>{{item.goodsName}}</span></p>
                                        <p class="info_li2_mx_p1 fr">
                                            <span class="number_i">×{{item.goodsCount}}</span>
                                            <span class="money_i">￥{{item.goodsPrice}}</span>
                                            <span class="fh_number_i">{{item.sendCount}}</span>
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            <p class="border"></p>
                            <div class="info_li info_li_3">
                                <p class="info_p"><span class="info_p_l">商品总金额：</span><span class="info_p_r">￥{{printOrderInfoCurret.goodsAmount}}</span></p>
                                <p class="info_p"><span class="info_p_l">运费：</span><span class="info_p_r">￥{{printOrderInfoCurret.freight}}</span></p>
                                <p class="info_p"><span class="info_p_l">订单总金额：</span><span class="info_p_r">￥{{printOrderInfoCurret.receivableMoney}}</span></p>
                                <p class="info_p"><span class="info_p_l">优惠金额：</span><span class="info_p_r">￥{{printOrderInfoCurret.reducedPrice}}</span></p>
                                <p class="info_p"><span class="info_p_l">余额抵扣：</span><span class="info_p_r">￥{{printOrderInfoCurret.consumeBalanceMoney}}</span></p>
                                <p class="info_p"><span class="info_p_l sf_money">实付金额：</span><span class="info_p_r sf_money">￥{{printOrderInfoCurret.actualMoney}}</span></p>
                            </div>
                            <p class="border"></p>
                            <div class="info_li info_li4">
                                <p class="info_p">
                                    <span class="info_p_l">地址：</span>
                                    <span class="info_p_r">{{printOrderInfoCurret.receivedProvinceName}} {{printOrderInfoCurret.receivedCityName}}
                                        {{printOrderInfoCurret.receivedAreaName}} {{printOrderInfoCurret.receivedDetail}}</span>
                                </p>
                                <p class="info_p" v-if="printOrderInfoCurret.receivedName"><span class="info_p_l">收货人：</span><span class="info_p_r">{{printOrderInfoCurret.receivedName}}</span></p>
                                <p class="info_p" v-if="printOrderInfoCurret.receivedPhone"><span class="info_p_l">联系电话：</span><span class="info_p_r">{{printOrderInfoCurret.receivedPhone}}</span></p>
                            </div>
                            <p class="border"></p>
                            <div class="info_li info_li5">
                                <p class="info_p">备注：{{printOrderInfoCurret.buyerRemark}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                
                <!-- 分页 -->
                <el-pagination
                    v-if="printOrderInfo.length>1" 
                    class="pagination"
                    background
                    :total="printOrderInfo.length" 
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
                <el-button class="fr" type="primary" size="small" :loading="btn_loading" @click="handleGoPrinter">去打印</el-button>
            </el-col>
        </el-row>
        
    </div>
</template>
<script>
export default {
    data() {
        return {
            info_loading:false,
            btn_loading:false,
            codes:[],
            printOrderInfo:[],
            printOrderInfoCurret:[]
        }
    },
    computed: {
    },
    created(){
        // console.log(this.$route.query.orderIds.split(","))
        // console.log(this.$route.query.printType)
        // if(this.$route.query.orderIds&&this.$route.query.printType){
            this.getPrinterInfo()
        // }
    },
    methods:{
        //x小票配送单预览
        getPrinterInfo(){
            //printType 0：最后一次发货(入口:从发货后打印配送单)；1：所有发货(入口:批量打印配送单)
            this.info_loading=true
            this._apis.order.shopPrinterPreview({
                ids:this.$route.query.orderIds.split(","),
                printType:this.$route.query.printType
            }).then(res => {
                this.info_loading=false
                // this.codes=res.codes
                this.printOrderInfo=!!res.printOrderInfo?res.printOrderInfo:[]
                this.printOrderInfoCurret = this.printOrderInfo.length>0?this.printOrderInfo[0]:[]
            })
            .catch(error => {this.info_loading=false;this.$message.error(error);});
        },
        //分页页码改变
        handleCurrentChange(val){
            this.printOrderInfoCurret = this.printOrderInfo[val-1]
        },
        //修改打印机设置
        handlePrinterSet(){
            this.$router.push({path:'/order/printerSeting',query:this.$route.query})
        },
        //去打印
        handleGoPrinter(){
            this.btn_loading=true
            //打印机设置详情，获取打印机连接状态
            this._apis.order.getPrinterSetDetail().then(res => {
                this.btn_loading=false
                if(!!res&&res.status==1){
                    //printType 0：最后一次发货(入口:从发货后打印配送单)；1：所有发货(入口:批量打印配送单)
                    // status 连接状态 0离线，1在线，2异常（缺纸）
                    this.goPrinter()
                }else{
                    this.$confirm('找不到打印机，无法打印。请重新设置或确认打印机是否已连接。', {
                        confirmButtonText: '去设置',
                        cancelButtonText: '取消',
                        type: 'warning',
                        showClose:false,
                        closeOnClickModal:false
                    }).then(() => {
                        this.$router.push({path:'/order/printerSeting'})
                    }).catch(() => {});
                }
            })
            .catch(error => {this.$message.error(error);this.btn_loading=false});
        },
        //小票配送单打印
        goPrinter(){
            this._apis.order.goPrinter({
                ids:this.$route.query.orderIds.split(","),
                printType:this.$route.query.printType,
                printOrderInfo:this.printOrderInfo
            }).then(res => {
                if(res==2){
                    this.$confirm('找不到打印机，无法打印。请重新设置或确认打印机是否已连接。', {
                        confirmButtonText: '去设置',
                        cancelButtonText: '取消',
                        type: 'warning',
                        showClose:false,
                        closeOnClickModal:false
                    }).then(() => {
                        this.$router.push({path:'/order/printerSeting'})
                    }).catch(() => {});
                }else{
                    this.$message.success('调用打印小票成功');
                }
            })
            .catch(error => {
                // this.$message.error(error)}
                this.$confirm('找不到打印机，无法打印。请重新设置或确认打印机是否已连接。', {
                    confirmButtonText: '去设置',
                    cancelButtonText: '取消',
                    type: 'warning',
                    showClose:false,
                    closeOnClickModal:false
                }).then(() => {
                    this.$router.push({path:'/order/printerSeting'})
                }).catch(() => {});
            });
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
        // justify-content:space-between;
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
            // width: 272px;
            height: 100%;
            .print_preview_center_box{
                // width: 272px;
                height: calc(100% - 40px);
                // overflow: hidden;
            }
            .print_preview_center_mx{
                width: 272px;
                height: 100%;
                margin: auto;
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
                                width: auto;
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
                            display: flex;
                            display: -webkit-flex;
                            justify-content: space-between;
                            .good_name{padding-right: 8px;}
                            .number{padding-right: 22px;}
                            .money{padding-right: 34px;}
                        }
                        .info_li2_mx{
                            margin-top: 10px;
                            li{
                                margin-top: 4px;
                            }
                            .info_li2_mx_p0{
                                // text-align: right;
                                display: flex;
                                line-height: 16px;
                            }
                            .info_li2_mx_p1{
                                margin-top: 2px;
                                text-align: right;
                                display: flex;
                                flex-wrap: wrap;
                                .number_i{
                                    // padding-right: 34px;
                                    width: 92px;
                                    text-align: right;
                                }
                                .money_i{
                                    // padding-right: 32px;
                                    width: 92px;
                                    text-align: center;
                                    flex: 1;
                                    word-break: break-all;
                                }
                                .fh_number_i{
                                    width: 58px;
                                    text-align: center;
                                }
                            }
                        }
                    }
                    .info_li_3{
                        .info_p{
                           margin-bottom: 6px; 
                        }
                        .info_p .info_p_r.sf_money,
                        .info_p .info_p_l.sf_money{
                            font-size:16px;
                            font-weight:600;
                        }
                    }
                    .info_li4{
                        .info_p .info_p_r{
                            text-align: left;
                            font-size: 16px;
                            font-weight: 600;
                        }
                    }
                    .info_li5{
                        .info_p{
                            font-size: 16px;
                            font-weight: 600;
                        }
                    }
                }
            }
            .pagination{width:272px;margin:auto;margin-top: 24px;}
        } 
    }
    
}
</style>