<template>
    <div class="after-sales-information">
        <section class="information">
            <!-- <p class="section-header">售后信息</p> -->
            <div class="row align-center justify-between">
                <div class="col" style="width: 50%;">
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
                                    <template v-if="/\.mp4|\.ogg|\.mov$/.test(item.image)">
                                        <div @click="dialogVisible = true; bigMessage.image = false; bigMessage.url = item.image;" class="image-item" :class="{active: item.over}" @mouseover="item.over = true" @mouseout="item.over = false">
                                            <video width="51" controls="controls">
                                            <source :src="item.image" type="video/ogg">
                                            <source :src="item.image" type="video/mp4">
                                            <source :src="item.image" type="video/mov">
                                            Your browser does not support the video tag.
                                            </video>
                                            <div class="over">
                                                <i class="el-icon-zoom-in"></i>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div @click="dialogVisible = true; bigMessage.image = true; bigMessage.url = item.image; bigMessage.descriptionImages = orderAfterSale.descriptionImages; bigMessage.imageIndex = index;" class="image-item" :class="{active: item.over}" @mouseover="item.over = true" @mouseout="item.over = false">
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
                <div class="col righter-col" style="width: 50%;">
                    <div v-if="orderAfterSale.type != 2" class="row">
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
                    <!-- <div v-if="orderAfterSale.type == 1 || orderAfterSale.type == 2" class="row">
                        <div class="col list-lefter">
                            用户收货信息
                        </div>
                        <div class="col list-righter">
                            <p>{{orderSendInfo.receivedName}} {{orderSendInfo.receivedPhone}}</p>
                            <p>{{orderSendInfo.receiveAddress}} {{orderSendInfo.receivedDetail}}</p>
                        </div>
                    </div>
                    <div v-if="orderAfterSale.type == 1 || orderAfterSale.type == 2" class="row">
                        <div class="col list-lefter">
                            商户收货信息
                        </div>
                        <div class="col list-righter">
                            <p>{{orderSendInfo.sendName}} {{orderSendInfo.sendPhone}}</p>
                            <p>{{orderSendInfo.sendAddress}} {{orderSendInfo.sendDetail}}</p>
                        </div>
                    </div> -->
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
                        style="width: 100%"
                        :header-cell-style="{background:'#F6F7FA', color:'#44434B'}">
                        <el-table-column
                            label="商品"
                            fixed="left" 
                            class-name="table-padding"
                            width="380">
                            <template slot-scope="scope">
                                <div class="row justity-between align-center">
                                    <div class="col image-box">
                                        <img width="66" :src="scope.row.goodsImage" alt="">
                                    </div>
                                    <div class="col">
                                        <p :title="scope.row.goodsName" class="ellipsis">{{scope.row.goodsName}}</p>
                                        <p class="goods-specs">{{scope.row.goodsSpces | goodsSpecsFilter}}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="goodsUnit"
                            align="center"
                            label="单位">
                        </el-table-column>
                        <el-table-column
                            prop="afterSaleCount"
                            align="right"
                            label="数量">
                        </el-table-column>
                        <el-table-column
                            v-if="orderAfterSale.type != 2"
                            prop="salePrice"
                            align="right"
                            label="商品单价">
                            <template  slot-scope="scope">
                                ¥{{scope.row.salePrice}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="orderAfterSale.type != 2"
                            prop="subtotalMoney"
                            align="right"
                            label="小计">
                            <template  slot-scope="scope">
                                ¥{{scope.row.subtotalMoney}}
                            </template>
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
        <section class="drawback" v-if="orderAfterSale.type != 2">
            <p class="section-header">商户退款合计</p>
            <div class="row justify-center align-stretch">
                <div class="col return-money-left" style="margin-right: 50px;">
                    <div v-if="orderAfterSale.shouldReturnScore" class="row">
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
                            ￥{{orderAfterSale.shouldReturnMoney || '0.00'}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            应退还余额：
                        </div>
                        <div class="col">
                            ￥{{orderAfterSale.shouldReturnBalance || '0.00'}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            应退还第三方支付：
                        </div>
                        <div class="col">
                            ￥{{orderAfterSale.shouldReturnWalletMoney || '0.00'}}
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
                <div class="col return-money-right">
                    <div class="row align-center">
                        <div class="col">
                            实退积分：
                        </div>
                        <div class="col change-box">
                            <!-- <el-input type="number" min="0" v-if="orderAfterSale.orderAfterSaleStatus == 0" v-model="orderAfterSale.realReturnScore"></el-input>
                            <span style="font-weight:600;" v-else>{{orderAfterSale.realReturnScore || 0}}</span> -->
                            <span v-if="orderAfterSale.orderAfterSaleStatus != 0" class="show-span">{{orderAfterSale.realReturnScore || 0}}</span>
                            <template v-if="orderAfterSale.orderAfterSaleStatus == 0 && !showScoreInput">
                                <span class="show-span">{{orderAfterSale.realReturnScore || 0}}</span>
                                <span class="operate-span" @click="showScoreInput = true">修改</span>
                            </template>
                            <template v-if="orderAfterSale.orderAfterSaleStatus == 0 && showScoreInput">
                                ￥<el-input type="number" min="0" v-if="orderAfterSale.orderAfterSaleStatus == 0" v-model="orderAfterSale.realReturnScore"></el-input>
                                <span class="operate-span" @click="changeScoreHandler">确定</span>
                            </template>
                        </div>
                    </div>
                    <div class="row align-center">
                        <div class="col">
                            实退金额：
                        </div>
                        <div class="col change-box">
                            <!-- <el-input v-if="orderAfterSale.orderAfterSaleStatus == 0 && orderAfterSale.type != 2" min="0" type="number" v-model="orderAfterSale.realReturnMoney" @change.native="orderAfterSale.realReturnMoney = (+orderAfterSale.realReturnMoney).toFixed(2) >=0 ? (+orderAfterSale.realReturnMoney).toFixed(2) : 0"></el-input>
                            <span style="font-weight:600;" v-else>￥{{orderAfterSale.realReturnMoney || 0}}</span> -->
                            <span v-if="orderAfterSale.orderAfterSaleStatus != 0 && orderAfterSale.type != 2" class="show-span">￥{{orderAfterSale.realReturnMoney || 0}}</span>
                            <template v-if="orderAfterSale.orderAfterSaleStatus == 0 && orderAfterSale.type != 2 && !showMoneyInput">
                                <span class="show-span">￥{{orderAfterSale.realReturnMoney || 0}}</span>
                                <span class="operate-span" @click="showMoneyInput = true">修改</span>
                            </template>
                            <template v-if="orderAfterSale.orderAfterSaleStatus == 0 && orderAfterSale.type != 2 && showMoneyInput">
                                ￥<el-input type="number" min="0" v-if="orderAfterSale.orderAfterSaleStatus == 0" v-model="orderAfterSale.realReturnMoney" @change.native="changeHandler"></el-input>
                                <span class="operate-span" @click="changeAmountHandler">确定</span>
                            </template>
                        </div>
                    </div>
                    <div class="row align-center">
                        <div class="col">
                            实退余额：
                        </div>
                        <div class="col">
                            ￥{{orderAfterSale.realReturnBalance || '0.00'}}
                        </div>
                    </div>
                    <div class="row align-center">
                        <div class="col">
                            实退第三方支付：
                        </div>
                        <div class="col">
                            ￥{{orderAfterSale.realReturnWalletMoney || '0.00'}}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="record">
            <p class="section-header">操作记录</p>
            <el-table
                :data="recordList"
                style="width: 100%"
                :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
                class="operate">
                <el-table-column
                    prop="operationType"
                    label="操作">
                    <template slot-scope="scope">
                        <span>{{scope.row.operationType | operationTypeFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createUserName"
                    label="操作人">
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
            width="800px"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <template v-if="!/\.mp4|\.ogg|\.mov$/.test(bigMessage.url)">
                <div class="images-box">
                    <div @click="goImage('left')" class="lefter"></div>
                    <div class="image">
                        <img width="500" :src="bigMessage.url" />
                    </div>
                    <div @click="goImage('right')" class="righter"></div>
                </div>
            </template>
            <template v-else>
                <div class="video-box">
                    <video width="500" controls="controls">
                    <source :src="bigMessage.url" type="video/ogg">
                    <source :src="bigMessage.url" type="video/mp4">
                    Your browser does not support the video tag.
                    </video>
                </div>
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
                
            ],
            data: {
                price: '500',
                detail: '订单满2000元使用（不含邮费）',
                limit: '2019',
                code: '1'
            },
            dialogVisible: false,
            bigMessage: {},
            showScoreInput: false,
            showMoneyInput: false
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
                    return '用户发货'//
                case 6:
                    return '商家收货'
                case 7:
                    return '商家发货'
                case 8:
                    return '用户收货'//
                case 9:
                    return '退款'
                case 10:
                    return '修改退还积分'
                case 11:
                    return '修改退还金额'
                case 12:
                    return '无需用户退货'
                case 13:
                    return '需要用户退货'
            }
        },
        refundwayFilter(code) {// 1线上 2线下
            //if(code == 1) {
            //    return '原支付方式返还'
            //} else if(code == 2) {
            //    return '原支付方式返还'
            //}
            //1微信支付,2线下支付-货到付款,3找人代付,4线下支付-确认收款,5线上支付(余额支付或积分支付或两者组合支付),6支付宝支付
            if(code == 2 || code == 4) {
                return '商户手动确认收款或用户选择货到付款的订单，实退金额都会退到用户余额中'
            } else {
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
                    return '优惠套装订单'
                case 3:
                    return '特权价'
                case 4:
                    return '赠品订单'
            }
        },
    },
    methods: {
        changeHandler() {
            //orderAfterSale.realReturnMoney = (+orderAfterSale.realReturnMoney).toFixed(2) >=0 ? (+orderAfterSale.realReturnMoney).toFixed(2) : 0
        },
        changeScoreHandler() {
            this.showScoreInput = false
            if(this.orderAfterSale.realReturnScore < 0) {
                this.$message({
                message: '非法输入，仅支持输入非负数，请重新输入',
                type: 'warning'
                });
                this.orderAfterSale.realReturnScore = this.catchOrderAfterSale.realReturnScore
                return
            }
            if(!/^\d+$/.test(this.orderAfterSale.realReturnScore)) {
                this.$message({
                message: '非法输入，仅支持输入非负数，请重新输入',
                type: 'warning'
                });
                this.orderAfterSale.realReturnScore = this.catchOrderAfterSale.realReturnScore
                return
            }
            this._apis.order.editorScoreAmount({
                id: this.$route.query.id,
                realReturnScore: this.orderAfterSale.realReturnScore
            }).then(res => {
                this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                this.$emit('submit')
            }).catch(error => {
                console.error(error)
                this.$message.error({
                    message: error,
                    type: 'error'
                });
                this.$emit('submit')
            })
        },
        changeAmountHandler() {
            this.showMoneyInput = false
            if(this.orderAfterSale.realReturnMoney < 0) {
                this.$message({
                message: '非法输入，仅支持输入非负数，请重新输入',
                type: 'warning'
                });
                this.orderAfterSale.realReturnMoney = this.catchOrderAfterSale.realReturnMoney
                return
            }
            if(!/^\d+$|^\d+\.\d+$/.test(this.orderAfterSale.realReturnMoney + '')) {
                this.$message({
                message: '非法输入，仅支持输入非负数，请重新输入',
                type: 'warning'
                });
                this.orderAfterSale.realReturnMoney = this.catchOrderAfterSale.realReturnMoney
                return
            }
            this._apis.order.editorScoreAmount({
                id: this.$route.query.id,
                realReturnMoney: this.orderAfterSale.realReturnMoney
            }).then(res => {
                this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                this.$emit('submit')
            }).catch(error => {
                console.error(error)
                this.$message.error({
                    message: error,
                    type: 'error'
                });
                this.$emit('submit')
            })
        },
        goImage(flag) {
            let index = this.bigMessage.imageIndex
            let list = this.bigMessage.descriptionImages
            
            if(flag == 'left') {
                index = index - 1
                this.bigMessage.imageIndex = index

                if(index >=0) {
                    this.bigMessage.url = list[index].image
                    this.$forceUpdate()
                }
            } else {
                index = index + 1
                this.bigMessage.imageIndex = index
                if(index <= list.length - 1) {
                    this.bigMessage.url = list[index].image
                    this.$forceUpdate()
                }
            }
        },
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
        catchOrderAfterSale: {
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
        border-radius: 4px;
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
                text-align: left;
                flex-shrink: 0;
            }
            .list-righter {
                color: #9FA29F;  
                flex-shrink: 0;
                width: calc(100% - 100px);
            }
            .righter-col {
                //border-left: 2px solid #CACFCB;
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
    /deep/ .el-dialog__body {
        padding: 10px;
        padding-bottom: 60px;
    }
    .images-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .lefter {
            width: 48px;
            height: 48px;
            background: url(../../../assets/images/order/left-icon.png) no-repeat;
            cursor: pointer;
        }
        .righter {
            width: 48px;
            height: 48px;
            background: url(../../../assets/images/order/right-icon.png) no-repeat;
            cursor: pointer;
        }
    }
    .video-box {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .return-money-left {
        padding-right: 100px;
    }
    .return-money-right {
        border-left: 1px solid #D3D3D3;
        padding-left: 40px;
    }
    .drawback .row {
        margin-bottom: 17px;
        color: #44434B;
        .col {
            &:first-child {
                margin-right: 20px;
                color: #92929B;
                text-align: right;
                flex-shrink: 0;
                flex-basis: 140px;
            }
            &:last-child {
                font-weight:600;
            }
        }
    }
    .change-box {
        display: flex; 
        justify-content: flex-start; 
        align-items: center;
        /deep/ .el-input {
            width: 100px;
        }
        span {
            &.operate-span {
                color: #655EFF;
                margin-left: 5px;
                flex-shrink: 0;
                cursor: pointer;
            }
            &.show-span {
                font-weight:600; 
                width: 100px;
            }
        }
    }
    .image-box {
        margin-right: 10px;
    }
    .goods-specs {
        color: #9FA29F;
    }
    .title-section-header {
        height: 50px;
        line-height: 50px;
        background-color: #F6F7FA;
        color: #44434B;
    }
    .title-section .content {
        padding-top: 29px;
    }
    /deep/ .el-table tr th {
        border-bottom: none;
    }
</style>


