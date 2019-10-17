<template>
    <div class="after-sales-information">
        <section class="information">
            <p class="section-header">售后信息</p>
            <div class="row align-center justify-between">
                <div class="col">
                    <div class="row justify-between">
                        <div class="col list-lefter">
                            售后原因
                        </div>
                        <div class="col list-righter">
                            {{orderAfterSale.reason}}
                        </div>
                    </div>
                    <div class="row justify-between">
                        <div class="col list-lefter">
                            问题描述
                        </div>
                        <div class="col list-righter">
                            {{orderAfterSale.description}}
                            <div class="images">
                                <img height="51" v-for="(item, index) in orderAfterSale.descriptionimages" :src="item" alt="" :key="index">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col righter-col">
                    <div class="row justify-between">
                        <div class="col list-lefter">
                            退款方式
                        </div>
                        <div class="col list-righter">
                            {{orderAfterSale.refundway | refundwayFilter}}
                        </div>
                    </div>
                    <div class="row justify-between">
                        <div class="col list-lefter">
                            退款收款人
                        </div>
                        <div class="col list-righter">
                            {{orderAfterSale.memberName}}
                        </div>
                    </div>
                    <div class="row justify-between">
                        <div class="col list-lefter">
                            客户收货信息
                        </div>
                        <div class="col list-righter">
                            <p>{{orderAfterSale.receivedname}} {{orderAfterSale.receivedPhone}}</p>
                            <p>{{orderAfterSale.receiveddetail}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section>
            <p class="section-header">售后商品清单</p>
            <div class="title-section">
                <div class="title-section-header">
                    <div class="title-section-header-lefter">
                        <span>订单编号：{{orderAfterSale.orderCode}}</span> | 
                        <span>{{orderAfterSale.channelInfoId | channelTypeFilter}}</span> | 
                        <span>{{orderType | orderTypeFilter}}</span>
                    </div>
                </div>
                <div class="content">
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
                </div>
            </div>
        </section>
        <section class="gift">
            <p class="section-header">买家退还奖励</p>
            <div class="row">
                <div class="col">
                    积分：
                </div>
                <div class="col">
                    {{orderAfterSale.memberReturnScore}}
                </div>
            </div>
            <!-- <div class="row">
                <div class="col">
                    赠品：
                </div>
                <div class="col">
                    {{orderAfterSale.memberReturnGift}}
                </div>
            </div>
            <div class="row">
                <div class="col">
                    红包：
                </div>
                <div class="col">
                    
                </div>
            </div> -->
            <!-- <div class="row">
                <div class="col">
                    优惠券：
                </div>
                <div class="col">
                    <div class="coupon-box">
                        <div class="coupon">
                            <div class="item lefter">
                                <p>{{data.price}}</p>
                                <p>元</p>
                            </div>
                            <div class="item righter">
                                <p>{{data.detail}}</p>
                                <p class="limit">{{data.limit}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
            <!-- <div class="row">
                <div class="col">
                    优惠码：
                </div>
                <div class="col">
                    <div class="coupon-box">
                        <div class="coupon-code">
                            <div class="coupon-code-header">优惠码 {{data.code}}</div>
                            <div class="coupon">
                                <div class="item lefter">
                                    <p>{{data.price}}</p>
                                    <p>元</p>
                                </div>
                                <div class="item righter">
                                    <p>{{data.detail}}</p>
                                    <p class="limit">{{data.limit}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
        </section>
        <section class="drawback">
            <p class="section-header">卖家退款合计</p>
            <div class="row justity-between align-center">
                <div class="col" style="margin-right: 50px;">
                    <div class="row">
                        <div class="col">
                            应退还积分：
                        </div>
                        <div class="col">
                            {{orderAfterSale.shouldReturnScore}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            应退金额：
                        </div>
                        <div class="col">
                            {{orderAfterSale.shouldReturnMoney}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            应退还余额：
                        </div>
                        <div class="col">
                            {{orderAfterSale.shouldReturnBalance}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            应退还第三方支付：
                        </div>
                        <div class="col">
                            {{orderAfterSale.shouldReturnWalletMoney || 0}}
                        </div>
                    </div>
                    <!-- <div class="row">
                        <div class="col">
                            退还优惠券：
                        </div>
                        <div class="col">
                            <div class="coupon-box">
                                <div class="coupon">
                                    <div class="item lefter">
                                        <p>{{data.price}}</p>
                                        <p>元</p>
                                    </div>
                                    <div class="item righter">
                                        <p>{{data.detail}}</p>
                                        <p class="limit">{{data.limit}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> -->
                    <!-- <div class="row">
                        <div class="col">
                            退还优惠码：
                        </div>
                        <div class="col">
                            <div class="coupon-box">
                                <div class="coupon-code">
                                    <div class="coupon-code-header">优惠码 {{data.code}}</div>
                                    <div class="coupon">
                                        <div class="item lefter">
                                            <p>{{data.price}}</p>
                                            <p>元</p>
                                        </div>
                                        <div class="item righter">
                                            <p>{{data.detail}}</p>
                                            <p class="limit">{{data.limit}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> -->
                </div>
                <div class="col">
                    <div class="row align-center">
                        <div class="col">
                            实退积分：
                        </div>
                        <div class="col">
                            <el-input v-if="orderAfterSale.orderAfterSaleStatus == 0" v-model="orderAfterSale.realReturnScore"></el-input>
                            <span v-else>{{orderAfterSale.realReturnScore}}</span>
                        </div>
                    </div>
                    <div class="row align-center">
                        <div class="col">
                            实退金额：
                        </div>
                        <div class="col">
                            <el-input v-if="orderAfterSale.orderAfterSaleStatus == 0" min="0" type="number" @change="realReturnMoneyHandler" v-model="orderAfterSale.realReturnMoney"></el-input>
                            <span v-else>{{orderAfterSale.realReturnMoney}}</span>
                        </div>
                    </div>
                    <div class="row align-center">
                        <div class="col">
                            实退余额：
                        </div>
                        <div class="col">
                            {{orderAfterSale.realReturnBalance || 0}}
                        </div>
                    </div>
                    <div class="row align-center">
                        <div class="col">
                            实退第三方支付：
                        </div>
                        <div class="col">
                            {{orderAfterSale.realReturnWalletMoney || 0}}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="record">
            <p class="section-header">操作记录</p>
            <el-table
                :data="recordList"
                style="width: 100%">
                <el-table-column
                    prop="operationType"
                    label="操作"
                    width="180">
                    <template slot-scope="scope">
                        <span>{{scope.row.operationType | operationTypeFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createUserName"
                    label="操作人"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="操作时间">
                </el-table-column>
            </el-table>
        </section>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tableData: [
                {}
            ],
            data: {
                price: '500',
                detail: '订单满2000元使用（不含邮费）',
                limit: '2019',
                code: '1'
            },
        }
    },
    filters: {
        operationTypeFilter(code) {
            switch(code) {
                case 1:
                    return '修改退还积分'
                case 2:
                    return '修改退还金额'
                case 3:
                    return '同意申请'
                case 4:
                    return '拒绝申请'
                case 5:
                    return '发货'
                case 6:
                    return '确认收货'
                case 7:
                    return '退款'
            }
        },
        refundwayFilter(code) {
            if(code == 1) {
                return '线上退款'
            } else if(code == 2) {
                return '线下退款'
            }
        },
        channelTypeFilter(code) {
            if(code == 1) {
                return '微信小程序'
            } else if(code == 2) {
                return '微信公众号'
            }
        },
        orderTypeFilter(code) {
            switch(code) {
                case 0:
                    return '普通订单'
                case 1:
                    return '拼团订单'
                case 2:
                    return '优惠套餐订单'
                case 3:
                    return '特权价'
                case 4:
                    return '赠品订单'
            }
        },
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
        }
    },
    methods: {
        realReturnMoneyHandler() {
            // realReturnWalletMoney 剩余退还余额
            // realReturnMoney 实退金额
            // realReturnBalance 退还余额
            if(this.orderAfterSale.realReturnWalletMoney == 0) {
                // 剩余退还余额 0
                this.orderAfterSale.realReturnWalletMoney = this.orderAfterSale.realReturnMoney
            } else if(this.orderAfterSale.realReturnBalance == 0) {
                this.orderAfterSale.realReturnWalletMoney = this.orderAfterSale.realReturnMoney
            } else {
                let _number = this.orderAfterSale.realReturnMoney - this.orderAfterSale.realReturnBalance

                if(_number < 0) {
                    let _realReturnBalance = this.orderAfterSale.realReturnBalance + _number
                    this.orderAfterSale.realReturnBalance = _realReturnBalance

                    this.orderAfterSale.realReturnWalletMoney  = 0
                } else {
                    this.orderAfterSale.realReturnWalletMoney = _number
                }
            }
        }
    },
    props: {
        recordList: {
            type: Array,
            required: true
        },
        orderAfterSale: {
            type: Object,
            default: {}
        },
        itemList: {
            type: Array,
            default: []
        },
        orderType: {

        }
    }
}
</script>
<style lang="scss" scoped>
    section {
        background-color: #fff;
        padding: 20px;
        margin-top: 20px;
        .row {
            margin: 10px 0;
        }
        .section-header {
            margin: 20px 0;
            color: #161617;
            font-size: 16px;
        }
        &.flow-path {
            margin-top: 50px;
        }
        &.information {
            margin-top: 0;
            .list-lefter {
                margin-right: 20px;
            }
            .list-righter {
                color: #9FA29F;  
            }
            .righter-col {
                border-left: 2px solid #CACFCB;
                padding: 10px 20px;
            }
        }
    }
</style>


