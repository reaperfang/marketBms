<template>
    <div class="after-sales-information">
        <section class="information">
            <!-- <p class="section-header">售后信息</p> -->
            <div class="row align-center justify-between">
                <div class="col">
                    <div class="row">
                        <div class="col list-lefter">
                            售后原因
                        </div>
                        <div class="col list-righter">
                            {{orderAfterSale.reason}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col list-lefter">
                            问题描述
                        </div>
                        <div class="col list-righter">
                            {{orderAfterSale.description}}
                            <div class="images">
                                <template v-for="(item, index) in orderAfterSale.descriptionImages">
                                    <template v-if="/\.mp4|\.ogg$/.test(item.image)">
                                        <div @click="dialogVisible = true; bigMessage.image = false; bigMessage.url = item.image;" class="image-item" :class="{active: item.over}" @mouseover="item.over = true" @mouseout="item.over = false">
                                            <video width="51" controls="controls">
                                            <source :src="item.image" type="video/ogg">
                                            <source :src="item.image" type="video/mp4">
                                            Your browser does not support the video tag.
                                            </video>
                                            <div class="over">
                                                <i class="el-icon-zoom-in"></i>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div @click="dialogVisible = true; bigMessage.image = true; bigMessage.url = item.image;" class="image-item" :class="{active: item.over}" @mouseover="item.over = true" @mouseout="item.over = false">
                                            <img
                                                width="51"
                                                :src="item.image"
                                                alt
                                            />
                                            <div class="over">
                                                <i class="el-icon-zoom-in"></i>
                                            </div>
                                        </div>
                                    </template>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col righter-col">
                    <div class="row">
                        <div class="col list-lefter">
                            退款方式
                        </div>
                        <div class="col list-righter">
                            {{orderAfterSale.refundWay | refundwayFilter}}
                        </div>
                    </div>
                    <div v-if="orderAfterSale.type != 2" class="row">
                        <div class="col list-lefter">
                            退款收款人
                        </div>
                        <div class="col list-righter">
                            {{orderAfterSale.memberName}}
                        </div>
                    </div>
                    <div v-if="orderAfterSale.type == 1 || orderAfterSale.type == 2" class="row">
                        <div class="col list-lefter">
                            客户收货信息
                        </div>
                        <div class="col list-righter">
                            <p>{{orderSendInfo.receivedName}} {{orderSendInfo.receivedPhone}}</p>
                            <p>{{orderSendInfo.receivedProvinceName}} {{orderSendInfo.receivedCityName}} {{orderSendInfo.receivedAreaName}} {{orderSendInfo.receivedDetail}}</p>
                        </div>
                    </div>
                    <div v-if="orderAfterSale.type == 1 || orderAfterSale.type == 2" class="row">
                        <div class="col list-lefter">
                            商户收货信息
                        </div>
                        <div class="col list-righter">
                            <p>{{orderSendInfo.sendName}} {{orderSendInfo.sendPhone}}</p>
                            <p>{{orderSendInfo.sendProvinceName}} {{orderSendInfo.sendCityName}} {{orderSendInfo.sendAreaName}} {{orderSendInfo.sendDetail}}</p>
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
                            prop="goodsPrice"
                            label="商品单价">
                        </el-table-column>
                        <el-table-column
                            prop="subtotalMoney"
                            label="小计">
                        </el-table-column>
                        <!-- <el-table-column
                            prop="afterSaleLimitTime"
                            label="售后有效期">
                        </el-table-column> -->
                    </el-table>
                </div>
            </div>
        </section>
        <!-- <section class="gift">
            <p class="section-header">买家退还奖励</p>
            <div class="row">
                <div class="col">
                    积分：
                </div>
                <div class="col">
                    {{orderAfterSale.memberReturnScore}}
                </div>
            </div> -->
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
        <!-- </section> -->
        <section class="drawback">
            <p class="section-header">卖家退款合计</p>
            <div class="row justity-between align-center">
                <div class="col" style="margin-right: 50px;">
                    <div class="row">
                        <div class="col">
                            应退还积分：
                        </div>
                        <div class="col">
                            {{orderAfterSale.shouldReturnScore || 0}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            应退金额：
                        </div>
                        <div class="col">
                            {{orderAfterSale.shouldReturnMoney || '0.00'}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            应退还余额：
                        </div>
                        <div class="col">
                            {{orderAfterSale.shouldReturnBalance || '0.00'}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            应退还第三方支付：
                        </div>
                        <div class="col">
                            {{orderAfterSale.shouldReturnWalletMoney || '0.00'}}
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
                            <el-input type="number" min="0" v-if="orderAfterSale.orderAfterSaleStatus == 0" v-model="orderAfterSale.realReturnScore"></el-input>
                            <span v-else>{{orderAfterSale.realReturnScore || 0}}</span>
                        </div>
                    </div>
                    <div class="row align-center">
                        <div class="col">
                            实退金额：
                        </div>
                        <div class="col">
                            <el-input v-if="orderAfterSale.orderAfterSaleStatus == 0 && orderAfterSale.type != 2" min="0" type="number" @change="realReturnMoneyHandler" v-model="orderAfterSale.realReturnMoney" @change.native="orderAfterSale.realReturnMoney = (+orderAfterSale.realReturnMoney).toFixed(2) >=0 ? (+orderAfterSale.realReturnMoney).toFixed(2) : 0"></el-input>
                            <span v-else>{{orderAfterSale.realReturnMoney || 0}}</span>
                        </div>
                    </div>
                    <div class="row align-center">
                        <div class="col">
                            实退余额：
                        </div>
                        <div class="col">
                            {{orderAfterSale.realReturnBalance || '0.00'}}
                        </div>
                    </div>
                    <div class="row align-center">
                        <div class="col">
                            实退第三方支付：
                        </div>
                        <div class="col">
                            {{orderAfterSale.realReturnWalletMoney || '0.00'}}
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
        <el-dialog
            title=""
            :visible.sync="dialogVisible"
            width="540px">
            <template v-if="bigMessage.image">
                <img width="500" :src="bigMessage.url" />
            </template>
            <template v-else>
                <video width="500" controls="controls">
                <source :src="bigMessage.url" type="video/ogg">
                <source :src="bigMessage.url" type="video/mp4">
                Your browser does not support the video tag.
                </video>
            </template>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span> -->
        </el-dialog>
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
            dialogVisible: false,
            bigMessage: {}
        }
    },
    filters: {
        operationTypeFilter(code) {
            switch(code) {
                case 1:
                    return '发起售后'//
                case 2:
                    return '撤销售后申请'//
                case 3:
                    return '同意申请'
                case 4:
                    return '拒绝申请'
                case 5:
                    return '客户发货'//
                case 6:
                    return '商家收货'
                case 7:
                    return '商家发货'
                case 8:
                    return '客户收货'//
                case 9:
                    return '退款'
            }
        },
        refundwayFilter(code) {// 1线上 2线下
            if(code == 1) {
                return '原支付方式返还'
            } else if(code == 2) {
                return '原支付方式返还'
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
            // if(this.catchRealReturnWalletMoney == 0 || this.catchRealReturnWalletMoney == '0.00' || this.catchRealReturnWalletMoney == null) {
            //     // 剩余退还余额 0
            //     this.orderAfterSale.realReturnBalance = this.orderAfterSale.realReturnMoney
            // } else if(this.catchRealReturnBalance == 0 || this.catchRealReturnBalance == '0.00' || this.catchRealReturnBalance == null) {
            //     this.orderAfterSale.realReturnWalletMoney = this.orderAfterSale.realReturnMoney
            // } else {
            //     let _number = +this.orderAfterSale.realReturnMoney - +this.orderAfterSale.realReturnBalance

            //     if(_number < 0) {
            //         let _realReturnBalance = +this.orderAfterSale.realReturnBalance + _number
            //         this.orderAfterSale.realReturnBalance = _realReturnBalance.toFixed(2)

            //         this.orderAfterSale.realReturnWalletMoney  = 0
            //     } else {
            //         this.orderAfterSale.realReturnWalletMoney = _number.toFixed(2)
            //     }
            // }
            if(+this.orderAfterSale.realReturnMoney < 0) {
                this.orderAfterSale.realReturnBalance = '0.00'
                this.orderAfterSale.realReturnWalletMoney = '0.00'
                return
            }
            if(this.orderAfterSale.shouldReturnBalance == null || this.orderAfterSale.shouldReturnBalance == '0.00' || this.orderAfterSale.shouldReturnBalance == 0) {
                this.orderAfterSale.realReturnWalletMoney = +this.orderAfterSale.realReturnMoney
            } else {
                if(+this.orderAfterSale.realReturnMoney > +this.orderAfterSale.shouldReturnBalance) {
                    this.orderAfterSale.realReturnBalance = (+this.orderAfterSale.shouldReturnBalance).toFixed(2)
                    this.orderAfterSale.realReturnWalletMoney = (+this.orderAfterSale.realReturnMoney - this.orderAfterSale.realReturnBalance).toFixed(2)
                } else {
                    this.orderAfterSale.realReturnWalletMoney = 0
                    this.orderAfterSale.realReturnBalance = (+this.orderAfterSale.realReturnMoney).toFixed(2)
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
        orderAfterSaleSendInfo: {},
        itemList: {
            type: Array,
            default: []
        },
        orderType: {

        },
        catchRealReturnWalletMoney: {},
        catchRealReturnBalance: {},
        orderSendInfo: {}
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
            &:first-child {
                margin-top: 0;
            }
            &:last-child {
                margin-bottom: 0;
            }
        }
        .section-header {
            margin: 20px 0;
            color: #161617;
            font-size: 16px;
            margin-top: 0;
        }
        &.flow-path {
            margin-top: 50px;
        }
        &.information {
            margin-top: 0;
            padding-top: 0;
            .list-lefter {
                margin-right: 20px;
                width: 90px;
                text-align: right;
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
    .images {
        margin-top: 5px;
        display: flex;
        .image-item {
            margin-right: 5px;
            width: 51px;
            height: 51px;
            position: relative;
            overflow: hidden;
            .over {
                position: absolute;
                width: 51px;
                height: 51px;
                z-index: 1000;
                left: -999px;
                top: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
            &.active {
                outline: 2px solid #35383a;
                .over {
                    left: 0;
                }
            }
            img, video {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
    /deep/ .el-icon-zoom-in:before {
        font-size: 18px;
    }
    /deep/ .el-dialog__body {
        text-align: center;
    }
</style>


