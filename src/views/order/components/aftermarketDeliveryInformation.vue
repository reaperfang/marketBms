<template>
    <div class="aftermarketDeliveryInformation">
        <div v-if="orderAfterSale.returnExpressNo" class="delivery-information-header">
            客户发货
        </div>
        <div class="container">
            <div v-if="orderAfterSale.returnExpressNo" class="item" :class="{close: !showCustomerContent}">
                <div class="header">
                    <div class="header-lefter">
                        <div class="header-lefter-item number">1</div>
                        <div class="header-lefter-item ">快递单号：{{orderAfterSale.returnExpressNo}}</div>
                        <div @click="showLogistics(orderAfterSale.returnExpressNo)" class="header-lefter-item  blue pointer">查看物流</div>
                    </div>
                    <div class="header-righter">
                        <div class="header-righter-item">{{orderAfterSale | customerFilter}}</div>
                        <div class="header-righter-item">发货人：{{orderAfterSale.memberSn}}</div>
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
                        style="width: 100%">
                        <el-table-column
                            label="商品"
                            width="380">
                            <template slot-scope="scope">
                                <div class="row justity-between align-center">
                                    <div class="col">
                                        <img width="66" :src="scope.row.goodsImage" alt="">
                                    </div>
                                    <div class="col">
                                        <p class="ellipsis" style="width: 300px">{{scope.row.goodsName}}</p>
                                        <p>{{scope.row.goodsSpces | goodsSpecsFilter}}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="goodsUnit"
                            label="单位"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="afterSaleCount"
                            label="数量">
                        </el-table-column>
                        <el-table-column
                            prop="subtotalMoney"
                            label="小计">
                        </el-table-column>
                        <el-table-column
                            prop="afterSaleLimitTime"
                            label="售后有效期">
                        </el-table-column>
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
                        <div class="header-lefter-item ">快递单号：{{orderAfterSaleSendInfo.expressNos}}</div>
                        <div @click="showLogistics(orderAfterSaleSendInfo.expressNos)" class="header-lefter-item  blue pointer">查看物流</div>
                    </div>
                    <div class="header-righter">
                        <div class="header-righter-item">{{orderAfterSale | businessFilter(orderAfterSaleSendInfo.expressNos)}}</div>
                        <div class="header-righter-item">发货人：{{orderAfterSale.sendName}}</div>
                        <div class="header-righter-item">{{orderAfterSale.receiveGoodsTime}}</div>
                        <div @click="showContent = !showContent">
                            <i v-if="showContent" class="el-icon-caret-top pointer"></i>
                            <i v-if="!showContent" class="el-icon-caret-bottom pointer"></i>
                        </div>
                    </div>
                </div>
                <div v-if="showContent" class="content">
                    <el-table
                        :data="sendItemList"
                        style="width: 100%">
                        <el-table-column
                            label="商品"
                            width="380">
                            <template slot-scope="scope">
                                <div class="row justity-between">
                                    <div class="col">
                                        <img width="66" :src="scope.row.goodsImage" alt="">
                                    </div>
                                    <div class="col">
                                        <p class="ellipsis" style="width: 300px">{{scope.row.goodsName}}</p>
                                        <p>{{scope.row.goodsSpces | goodsSpecsFilter}}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="goodsUnit"
                            label="单位"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="afterSaleCount"
                            label="数量">
                        </el-table-column>
                        <el-table-column
                            prop="subtotalMoney"
                            label="小计">
                        </el-table-column>
                        <el-table-column
                            prop="afterSaleLimitTime"
                            label="售后有效期">
                        </el-table-column>
                    </el-table>
                    <!-- <div class="remark">快递单号：{{}}</div> -->
                </div>
            </div>
        </div>
        <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData"></component>
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
            currentData: {},
            showCustomerContent: true,
            showContent: true
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

            return str
        },
        customerFilter(value) {
            if(value.receiveGoodsTime) {
                return '【商户签收】'
            } else if(value.returnExpressNo) {
                return '【客户发货】'
            } else {
                return ''
            }
        },
        businessFilter(value, expressNos) {
            if(value.memberReceiveGoodsTime) {
                return '【客户签收】'
            } else if(expressNos) {
                return '【商户发货】'
            } else {
                return ''
            }
        }
    },
    methods: {
        showLogistics(expressNo) {
            this._apis.order.orderLogistics({expressNo}).then(res => {
                this.currentDialog = 'LogisticsDialog'
                this.currentData = res.traces
                this.dialogVisible = true
            }).catch(error => {
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            }) 
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
                    height: 60px;
                    background-color: rgb(243, 244, 244);
                    border-radius: 10px 10px 0 0;
                    padding: 0 20px;
                    line-height: 60px;
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
</style>


