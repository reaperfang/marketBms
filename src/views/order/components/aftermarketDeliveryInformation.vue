<template>
    <div class="aftermarketDeliveryInformation">
        <!-- 普通快递 -->
        <template v-if="orderAfterSale.deliveryWay == 1 || orderAfterSale.deliveryWay == 3 || orderAfterSale.deliveryWay == 4">
        <div v-if="orderAfterSale.returnExpressNo" class="delivery-information-header">
            用户退货
        </div>
        <div class="container">
            <div v-if="orderAfterSale.returnExpressNo" class="item" :class="{close: !showCustomerContent}">
                <div class="header">
                    <div class="header-lefter">
                        <div class="header-lefter-item number">1</div>
                        <div class="header-lefter-item">快递退货</div>
                        <div class="header-lefter-item">快递公司：{{orderAfterSale.returnExpressName}}</div>
                        <div class="header-lefter-item ">快递单号：{{orderAfterSale.returnExpressNo}}</div>
                        <div @click="showLogistics(orderAfterSale.returnExpressNo, true, orderAfterSale.id)" class="header-lefter-item  blue pointer">查看物流</div>
                    </div>
                    <div class="header-righter">
                        <div class="header-righter-item">{{orderAfterSale | customerFilter}}</div>
                        <div class="header-righter-item">发货人：{{orderAfterSale.memberName}}</div>
                        <div class="header-righter-item">{{orderAfterSale.memberReturnGoodsTime}}</div>
                        <div @click="showCustomerContent = !showCustomerContent">
                            <i v-if="showCustomerContent" class="el-icon-caret-top pointer"></i>
                            <i v-if="!showCustomerContent" class="el-icon-caret-bottom pointer"></i>
                        </div>
                    </div>
                </div>
                <div v-if="showCustomerContent" class="content">
                    <div class="message">
                        <p>
                            <span>收货信息</span>
                            <span>{{orderSendReceivedAddress.receivedName}} {{orderSendReceivedAddress.receivedPhone && '/'}} {{orderSendReceivedAddress.receivedPhone}}</span>
                            <span>{{orderSendReceivedAddress.receiveAddress}} {{orderSendReceivedAddress.receivedDetail}} </span>
                        </p>
                        <p>
                            <span>发货信息</span>
                            <span>{{orderSendReceivedAddress.sendName}} {{orderSendReceivedAddress.sendPhone && '/'}} {{orderSendReceivedAddress.sendPhone}}</span>
                            <span>{{orderSendReceivedAddress.sendAddress}} {{orderSendReceivedAddress.sendDetail}} </span>
                        </p>
                    </div>
                    <el-table
                        :data="itemList"
                        style="width: 100%"
                        :header-cell-style="{background:'#F6F7FA', color:'#44434B'}">
                        <el-table-column
                            label="商品"
                            class-name="table-padding"
                            width="380">
                            <template slot-scope="scope">
                                <div class="row justity-between align-center">
                                    <div class="col image-box">
                                        <img width="66" :src="scope.row.goodsImage" alt="">
                                    </div>
                                    <div class="col">
                                        <p class="ellipsis">{{scope.row.goodsName}}</p>
                                        <p class="goods-specs">{{scope.row.goodsSpces | goodsSpecsFilter}}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="goodsUnit"
                            label="单位">
                        </el-table-column>
                        <el-table-column
                            prop="afterSaleCount"
                            label="本次发货数量">
                        </el-table-column>
                        <!-- <el-table-column
                            prop="goodsPrice"
                            label="商品单价">
                        </el-table-column>
                        <el-table-column
                            prop="subtotalMoney"
                            label="小计">
                        </el-table-column> -->
                        <!-- <el-table-column
                            prop="afterSaleLimitTime"
                            label="售后有效期">
                        </el-table-column> -->
                    </el-table>
                    <!-- <div class="remark">快递单号：{{}}</div> -->
                </div>
            </div>
        </div>

        <div v-if="orderAfterSaleSendInfo.expressNos" class="delivery-information-header">
            商家发货
        </div>
        <div class="container">
            <div v-if="orderAfterSaleSendInfo.expressNos" class="item" :class="{close: !showContent}">
                <div class="header">
                    <div class="header-lefter">
                        <div class="header-lefter-item number">2</div>
                        <div class="header-lefter-item">快递发货</div>
                        <div class="header-lefter-item">快递公司：{{orderAfterSaleSendInfo.expressCompanys}}</div>
                        <div class="header-lefter-item ">快递单号：{{orderAfterSaleSendInfo.expressNos}}</div>
                        <div @click="showLogistics(orderAfterSaleSendInfo.expressNos, false, orderAfterSaleSendInfo.orderAfterSaleId)" class="header-lefter-item  blue pointer">查看物流</div>
                    </div>
                    <div class="header-righter">
                        <div class="header-righter-item">{{orderAfterSale | businessFilter(orderAfterSaleSendInfo.expressNos)}}</div>
                        <div class="header-righter-item">发货人：{{tenantName}}</div>
                        <div class="header-righter-item">{{orderAfterSaleSendInfo.sendTime}}</div>
                        <div @click="showContent = !showContent">
                            <i v-if="showContent" class="el-icon-caret-top pointer"></i>
                            <i v-if="!showContent" class="el-icon-caret-bottom pointer"></i>
                        </div>
                    </div>
                </div>
                <div v-if="showContent" class="content">
                    <div class="message">
                        <p>
                            <span>收货信息</span>
                            <span>{{orderAfterSaleSendInfo.receivedName}} / {{orderAfterSaleSendInfo.receivedPhone}}</span>
                            <span>{{orderAfterSaleSendInfo.receiveAddress}} {{orderAfterSaleSendInfo.receivedDetail}} </span>
                        </p>
                        <p>
                            <span>发货信息</span>
                            <span>{{orderAfterSaleSendInfo.sendName}} / {{orderAfterSaleSendInfo.sendPhone}}</span>
                            <span>{{orderAfterSaleSendInfo.sendAddress}} {{orderAfterSaleSendInfo.sendDetail}} </span>
                        </p>
                    </div>
                    <el-table
                        :data="sendItemList"
                        style="width: 100%"
                        :header-cell-style="{background:'#F6F7FA', color:'#44434B'}">
                        <el-table-column
                            label="商品"
                            width="380">
                            <template slot-scope="scope">
                                <div class="row justity-between">
                                    <div class="col image-box">
                                        <img width="66" :src="scope.row.goodsImage" alt="">
                                    </div>
                                    <div class="col">
                                        <p class="ellipsis" style="width: 300px">{{scope.row.goodsName}}</p>
                                        <p class="goods-specs">{{scope.row.goodsSpces | goodsSpecsFilter}}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="goodsUnit"
                            label="单位">
                        </el-table-column>
                        <el-table-column
                            prop="sendCount"
                            label="本次发货数量">
                        </el-table-column>
                        <!-- <el-table-column
                            prop="subtotalMoney"
                            label="小计">
                        </el-table-column>
                        <el-table-column
                            prop="afterSaleLimitTime"
                            label="售后有效期">
                        </el-table-column> -->
                    </el-table>
                    <!-- <div class="remark">快递单号：{{}}</div> -->
                </div>
                <div class="content" v-if="orderAfterSaleSendInfo && orderAfterSaleSendInfo.sendRemark">备注：{{orderAfterSaleSendInfo.sendRemark}}</div>
            </div>
        </div>
        </template>
        <!-- 商家配送 -->
        <template v-if="orderAfterSale.deliveryWay == 2">
        <div class="delivery-information-header">
            用户退货
        </div>
        <div class="container">
            <div class="item" :class="{close: !showCustomerContent}">
                <div class="header">
                    <div class="header-lefter">
                        <div class="header-lefter-item number">1</div>
                        <div class="header-lefter-item ">商家自取</div>
                        <div class="header-lefter-item " v-if="!orderAfterSale.deliveryDate">与商家电话约定取货时间</div>
                        <div class="header-lefter-item " v-if="orderAfterSale.deliveryDate">取货时间：{{orderAfterSale.deliveryDate | formatDateRemoveZero}} {{orderAfterSale.deliveryTime}}</div>
                     </div>
                    <div class="header-righter">
                        <div class="header-righter-item">{{orderAfterSale | sotreCustomerFilter}}</div>
                        <div class="header-righter-item">{{orderAfterSale.memberReturnGoodsTime}}</div>
                        <div @click="showCustomerContent = !showCustomerContent">
                            <i v-if="showCustomerContent" class="el-icon-caret-top pointer"></i>
                            <i v-if="!showCustomerContent" class="el-icon-caret-bottom pointer"></i>
                        </div>
                    </div>
                </div>
                <div v-if="showCustomerContent" class="content">
                    <el-table
                        :data="itemList"
                        style="width: 100%"
                        :header-cell-style="{background:'#F6F7FA', color:'#44434B'}">
                        <el-table-column
                            label="商品"
                            class-name="table-padding"
                            width="380">
                            <template slot-scope="scope">
                                <div class="row justity-between align-center">
                                    <div class="col image-box">
                                        <img width="66" :src="scope.row.goodsImage" alt="">
                                    </div>
                                    <div class="col">
                                        <p class="ellipsis">{{scope.row.goodsName}}</p>
                                        <p class="goods-specs">{{scope.row.goodsSpces | goodsSpecsFilter}}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="goodsUnit"
                            label="单位">
                        </el-table-column>
                        <el-table-column
                            prop="afterSaleCount"
                            label="本次发货数量">
                        </el-table-column>
                        <!-- <el-table-column
                            prop="goodsPrice"
                            label="商品单价">
                        </el-table-column>
                        <el-table-column
                            prop="subtotalMoney"
                            label="小计">
                        </el-table-column> -->
                        <!-- <el-table-column
                            prop="afterSaleLimitTime"
                            label="售后有效期">
                        </el-table-column> -->
                    </el-table>
                    <!-- <div class="remark">快递单号：{{}}</div> -->
                </div>
            </div>
        </div>

        <div v-if="orderAfterSaleSendInfo.distributorPhone" class="delivery-information-header">
            商家发货
        </div>
        <div class="container">
            <div v-if="orderAfterSaleSendInfo.distributorPhone" class="item" :class="{close: !showContent}">
                <div class="header">
                    <div class="header-lefter">
                        <div class="header-lefter-item number">2</div>
                        <div class="header-lefter-item ">商家配送</div>
                        <div class="header-lefter-item ">配送员：{{orderAfterSaleSendInfo.distributorName}}</div>
                        <div class="header-lefter-item ">联系方式：{{orderAfterSaleSendInfo.distributorPhone}}</div>
                    </div>
                    <div class="header-righter">
                        <div class="header-righter-item">{{orderAfterSale | storeBusinessFilter(orderAfterSaleSendInfo.distributorPhone)}}</div>
                        <div class="header-righter-item">{{orderAfterSaleSendInfo.sendTime}}</div>
                        <div @click="showContent = !showContent">
                            <i v-if="showContent" class="el-icon-caret-top pointer"></i>
                            <i v-if="!showContent" class="el-icon-caret-bottom pointer"></i>
                        </div>
                    </div>
                </div>
                <div v-if="showContent" class="content">
                    <el-table
                        :data="sendItemList"
                        style="width: 100%"
                        :header-cell-style="{background:'#F6F7FA', color:'#44434B'}">
                        <el-table-column
                            label="商品"
                            width="380">
                            <template slot-scope="scope">
                                <div class="row justity-between">
                                    <div class="col image-box">
                                        <img width="66" :src="scope.row.goodsImage" alt="">
                                    </div>
                                    <div class="col">
                                        <p class="ellipsis" style="width: 300px">{{scope.row.goodsName}}</p>
                                        <p class="goods-specs">{{scope.row.goodsSpces | goodsSpecsFilter}}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="goodsUnit"
                            label="单位">
                        </el-table-column>
                        <el-table-column
                            prop="sendCount"
                            label="本次发货数量">
                        </el-table-column>
                        <!-- <el-table-column
                            prop="subtotalMoney"
                            label="小计">
                        </el-table-column>
                        <el-table-column
                            prop="afterSaleLimitTime"
                            label="售后有效期">
                        </el-table-column> -->
                    </el-table>
                    <!-- <div class="remark">快递单号：{{}}</div> -->
                </div>
                <div class="content" v-if="orderAfterSaleSendInfo && orderAfterSaleSendInfo.sendRemark">备注：{{orderAfterSaleSendInfo.sendRemark}}</div>
            </div>
        </div>
        </template>
        <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData" :expressNo="expressNo" :expressCompanys="expressCompanys"></component>
    </div>
</template>
<script>
import StatisticsDialog from '@/views/order/dialogs/statisticsDialog'
import LogisticsDialog from '@/views/order/dialogs/logisticsDialog'

export default {
    data() {
        return {
            typeNumber: 3,
            failNumber: 2,
            deliveryNumber: 2,
            unconfirmedNumber: 1,
            items: [
                {
                    expressNumber: 1,
                    deliverier: '小王',
                    time: '',
                    showContent: true,
                    list: [
                        {}
                    ]
                }
            ],
            currentDialog: '',
            dialogVisible: false,
            currentData: [],
            showCustomerContent: true,
            showContent: true,
            expressNo: '',
            expressCompanys: '',
            isTrace: 0,
            reject: false,
            tenantName: ''
        }
    },
    filters: {
        goodsSpecsFilter(value) {
            let _value
            if(!value) return ''
            if(typeof value == 'string') {
                _value = JSON.parse(value)
            }
            let str = ''
            for(let i in _value) {
                if(_value.hasOwnProperty(i)) {
                    str += i + ':'
                    str += _value[i] + ','
                }
            }
            str = str.replace(/^(.*)\,$/, '$1')
            return str
        },
        customerFilter(value) {
            if(value.receiveGoodsTime) {
                return '【商户签收】'
            } else if(value.returnExpressNo) {
                return '【用户发货】'
            } else {
                return ''
            }
        },
        businessFilter(value, expressNos) {
            if(value.memberReceiveGoodsTime) {
                return '【用户签收】'
            } else if(expressNos) {
                return '【商户发货】'
            } else {
                return ''
            }
        },
        sotreCustomerFilter(value) {
            if(value.receiveGoodsTime) {
                return '【商户签收】'
            } else if(value.memberReturnGoodsTime) {
                return '【等待取货】'
            } else {
                return ''
            }
        },
        storeBusinessFilter(value, expressNos) {
            if(value.memberReceiveGoodsTime) {
                return '【用户签收】'
            } else if(expressNos) {
                return '【商户发货】'
            } else {
                return ''
            }
        },
    },
    computed: {
        cid() {
            let shopInfo = this.$store.getters.shopInfos;
            return shopInfo.id;
        },
        orderSendReceivedAddress() {
            return this.sendInfoMap && this.sendInfoMap.returnSendInfo && this.sendInfoMap.returnSendInfo[0] && this.sendInfoMap.returnSendInfo[0].orderSendReceivedAddress || {}
        }
    },
    created() {
        this.getIsTrace();
        this.getShopInfo()
    },
    methods: {
        getShopInfo() {
            let id = this.cid;
            this.$store.dispatch('getShopInfo').then(response => {
                    console.log(response)
                    this.tenantName = response.tenantName
                })
                .catch(error => {
                    this.$message.error('查询失败');
                });
            },
        showLogistics(expressNo, isComstomer, id) {
            this.expressNo = expressNo
            if(isComstomer) {
                this.expressCompanys = this.orderAfterSale.returnExpressName
            } else {
                this.expressCompanys = this.orderAfterSaleSendInfo.expressCompanys
            }
            // this._apis.order.orderLogistics({expressNo}).then(res => {
            //     this.currentDialog = 'LogisticsDialog'
            //     this.currentData = res.traces
            //     this.dialogVisible = true
            // }).catch(error => {
            //     this.$notify.error({
            //         title: '错误',
            //         message: error
            //     });
            // }) 

            if (this.isTrace == 0) {
                this.currentDialog = "LogisticsDialog";
                this.currentData = {
                        traces: [],
                        deliveryWay:this.orderAfterSale.deliveryWay,
                        thirdType: this.orderAfterSale.thirdType?this.orderAfterSale.thirdType:''
                    }
                this.reject = true;
                this.expressNo = expressNo
                this.expressCompanys = this.expressCompanys
                this.dialogVisible = true;
            } else {
                this.reject = false;
                this.expressNo = expressNo
                this._apis.order
                .orderLogistics({ expressNo, id: id, isOrderAfter: 1 })
                .then(res => {
                    this.currentDialog = "LogisticsDialog";
                    this.currentData = {
                        traces:res.traces || [],
                        deliveryWay:this.orderAfterSale.deliveryWay,
                        thirdType: this.orderAfterSale.thirdType?this.orderAfterSale.thirdType:''
                    }
                    this.expressCompanys = this.expressCompanys
                    this.dialogVisible = true;
                })
                .catch(error => {
                    console.error(error)
                    // this.$notify.error({
                    //   title: "错误",
                    //   message: error
                    // });
                });
            }
        },
        getIsTrace() {
            this._apis.order
                .getIsTrace({ cid: this.cid })
                .then(res => {
                // console.log(res);
                this.isTrace = res.isTrace;
                })
                .catch(error => {
                    console.error(error)
                // this.$notify.error({
                //     title: "错误",
                //     message: error
                // });
            });
        },
    },
    props: {
        sendItemList: {
            type: Array,
            default: []
        },
        itemList: {
            type: Array,
            default: []
        },
        orderAfterSale: {
            type: Object,
            default: {}
        },
        orderAfterSaleSendInfo: {
            type: Object,
            default: {}
        },
        sendInfoMap: {

        }
    },
    components: {
        StatisticsDialog,
        LogisticsDialog
    }
}
</script>
<style lang="scss" scoped>
    .aftermarketDeliveryInformation {
        background-color: #fff;
        padding: 30px;
        .blue {
            color: $globalMainColor;
        }
        .delivery-information-header {
            margin: 20px 0;
            margin-top: 10px;
        }
        .container {
            .item {
                border-radius: 10px;
                border: 1px solid #cacfcb;
                &.close {
                    .header {
                        border-radius: 10px;
                    }
                }
                .header {
                    height: 50px;
                    background-color: #F6F7FA;
                    color: #44434B;
                    border-radius: 10px 10px 0 0;
                    padding: 0 20px;
                    display: flex;
                    justify-content: space-between;
                    .header-lefter {
                        display: flex;
                        align-items: center;
                        .header-lefter-item  {
                            margin-right: 20px;
                        }
                        .number {
                            width: 20px;
                            height: 20px;
                            background-color: $globalMainColor;
                            line-height: 21px;
                            color: #fff;
                            text-align: center;
                            border-radius: 50%;
                        }
                    }
                    .header-righter {
                        display: flex;
                        align-items: center;
                        .header-righter-item  {
                            margin-right: 20px;
                        }
                    }
                }
                .content {
                    padding: 20px;
                    .goods-detail {
                        display: flex;
                        .goods-detail-item {

                        }
                    }
                    .remark {
                        border-top: 1px solid #CACFCB;
                        padding-top: 20px;
                    }
                }
            }
        }
    }
    .message {
        font-size:14px;
        font-weight:400;
        color:rgba(146,146,155,1);
        padding-bottom: 12px;
        padding-left: 40px;
        p {
            span {
                &:nth-child(2) {
                    margin-left: 30px;
                    margin-right: 15px;
                }
            }
            &:first-child {
                margin-bottom: 10px;
            }
        }
    }
    .image-box {
        margin-right: 10px;
    }
    .goods-specs {
        color: #9FA29F;
    }
    /deep/ .el-table td, /deep/ .el-table th {
        text-align: center;
        &:nth-child(1) {
            text-align: left;
        }
    }
</style>


