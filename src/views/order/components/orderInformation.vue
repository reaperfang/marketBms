<template>
    <div class="order-information">
        <el-row>
            <el-col :span="8">
                <div class="grid-content lefter">
                    <div class="item">
                        <div class="label">配送方式</div>
                        <div class="value">{{orderInfo.deliveryWay | deliveryWayFilter}}</div>
                    </div>
                    <div class="item">
                        <div class="label">收货信息</div>
                        <div class="value">
                            <p>{{orderInfo.receivedName}} / {{orderInfo.receivedPhone}}</p>
                            <p>{{orderInfo.receivedDetail}}</p>
                        </div>
                    </div>
                    <p @click="currentDialog = 'ReceiveInformationDialog'; currentData =orderInfo; ajax = true; dialogVisible = true" class="change"><span class="pointer">修改</span></p>
                </div>
            </el-col>
            <el-col :span="8"><div class="grid-content center">
                <div class="item">
                    <div class="label">付款人</div>
                    <div class="value">{{orderDetail.orderPayRecordList | orderPayRecordListFilter}}</div> <!-- <span v-if="orderDetail.orderPayRecordList" class="blue orderPayRecordList">详情</span> -->
                </div>
                <div class="item">
                    <div class="label">付款方式</div>
                    <div class="value">{{orderInfo.payWay | payWayFilter}}</div>
                </div>
                <div class="item">
                    <div class="label">付款时间</div>
                    <div class="value">{{orderInfo.payComplateTime}}</div>
                </div>
                <div class="item">
                    <div class="label">交易流水号</div>
                    <div class="value">{{orderInfo.transactionCode}}</div>
                </div>
                <div class="item">
                    <div class="label">本单获得</div>
                    <div class="value">
                        <p>积分 {{orderInfo.gainScore}}</p>
                        <p>赠品 {{orderInfo.gift || 0}}</p>
                        <p>优惠券 {{gainCoupon || 0}}</p>
                        <p>优惠码 {{gainPromotionCode || 0}}</p>
                    </div>
                </div>
            </div></el-col>
            <el-col :span="8"><div class="grid-content righter">
                <div class="item">
                    <div class="label">发票信息</div>
                    <div class="value">
                        <p>发票类型 {{orderInfo.invoiceType | invoiceTypeFilter}}</p>
                        <p>发票抬头 {{orderInfo.invoiceTitle}}</p>
                        <p>发票内容 商品明细</p>
                        <p>电子发票将在订单完成后1-2天内开具</p>
                    </div>
                </div>
                <div class="item">
                    <div class="label">客户备注</div>
                    <div class="value">{{orderInfo.buyerRemark}}</div>
                </div>
                <div class="item remark-box">
                    <div class="label">商户备注</div>
                    <div class="value">
                        <span v-if="!remarkVisible">{{orderInfo.sellerRemark}}</span>
                        <el-input
                            v-if="remarkVisible"
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="orderInfo.sellerRemark">
                        </el-input>
                        <span v-if="!remarkVisible" @click="remarkVisible = true" class="blue pointer">我要备注</span>
                        <span v-if="remarkVisible" class="blue pointer" @click="remarkHandler">完成</span>
                    </div>
                </div>
            </div></el-col>
        </el-row>

        <div class="goods-list">
            <p class="header">订单清单</p>
            <el-table
                :data="orderDetail.orderItems"
                style="width: 100%"
                :header-cell-style="{background:'#ebeafa', color:'#655EFF'}">
                <el-table-column
                    label="商品"
                    width="380">
                    <template slot-scope="scope">
                        <div class="goods-detail">
                            <div class="item image-box">
                                <img width="66" :src="scope.row.goodsImage" alt="">
                            </div>
                            <div class="item">
                                <p class="ellipsis" style="width: 300px">{{scope.row.goodsName}}</p>
                                <p class="goods-specs">{{scope.row.goodsSpecs | goodsSpecsFilter}}</p>
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
                    prop="goodsCount"
                    label="数量">
                </el-table-column>
                <el-table-column
                    label="商品单价">
                    <template slot-scope="scope">
                        ¥{{scope.row.goodsPrice}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="商品小计">
                    <template slot-scope="scope">
                        ¥{{scope.row.subtotalMoney}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="goods-list-message">
                <div class="row">
                    <div class="col">运费:</div>
                    <div class="col">+ ¥{{orderDetail.orderInfo.freight}}</div>
                </div>
                <div class="row">
                    <div class="col">应收金额:</div>
                    <div class="col">¥{{orderDetail.orderInfo.receivableMoney}}</div>
                </div>
                <div class="row">
                    <div class="col">优惠券金额:</div>
                    <div class="col">
                        ¥{{orderDetail.orderInfo.consumeCouponMoney || 0}}
                        <i @click="currentDialog = 'CouponDialog'; currentData = {usedCouponList, usedPromotionList}; dialogVisible = true" class="coupon-img"></i>
                    </div>
                </div>
                <div class="row">
                    <div class="col">满减/满折:</div>
                    <div class="col">- ¥{{orderDetail.orderInfo.discountMoney || 0}}</div>
                </div>
                <div class="row">
                    <div class="col">会员折扣:</div>
                    <div class="col">- ¥{{orderDetail.orderInfo.memberDiscountMoney || 0}}</div>
                </div>
                <div class="row">
                    <div class="col">优惠套装:</div>
                    <div class="col">- ¥{{orderDetail.orderInfo.discountPackageMoney || 0}}</div>
                </div>
                <div class="row" v-if="orderDetail.orderInfo && orderDetail.orderInfo.discountFreight">
                    <div class="col">满包邮:</div>
                    <div class="col">- ¥{{orderDetail.orderInfo.discountFreight}}</div>
                </div>
                <div class="row align-center">
                    <div v-if="this.orderDetail.orderInfo.orderStatus != 4" class="col">
                        <el-select style="margin-right: 5px;" v-model="goodsListMessage.consultType" placeholder="请选择">
                            <el-option
                            v-for="item in reducePriceTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div v-if="this.orderDetail.orderInfo.orderStatus != 4" class="col">
                        <el-input v-if="changePriceVisible" min="0" type="number" class="reduce-price-input" v-model="goodsListMessage.consultMoney"></el-input>
                        <span v-if="!changePriceVisible">{{goodsListMessage.consultMoney}}</span>
                        <span class="blue pointer" v-if="!changePriceVisible" @click="changePriceVisible = true">改价</span>
                        <span class="blue pointer" v-if="changePriceVisible" @click="reducePriceHandler">完成</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col">实收金额:</div>
                    <div class="col">¥{{orderDetail.orderInfo.actualMoney}}</div>
                </div>
            </div>
            <div class="operate-record">
                <p class="header">操作记录</p>
                <el-table
                    :data="orderDetail.orderOperationRecordList"
                    style="width: 100%"
                    :header-cell-style="{background:'#ebeafa', color:'#655EFF'}">
                    <el-table-column
                        label="操作"
                        width="180">
                        <template slot-scope="scope">
                            {{scope.row.operationType | operationTypeFilter}}
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
            </div>
        </div>
        <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData" :ajax="ajax" :sendGoods="sendGoods" @submit="submit"></component>
    </div>
</template>
<script>
import ReceiveInformationDialog from '@/views/order/dialogs/receiveInformationDialog'
import CouponDialog from '@/views/order/dialogs/couponDialog'

export default {
    data() {
        return {
            expressType: '普通快递',
            receiveInformation: '北京市',
            payer: '张三',
            payMode: '微信支付',
            payTime: '2019',
            batch: '1',
            wechat: '1',
            win: '礼物',
            receiptInformation: '普通发票',
            message: 'message',
            remarks: 'remarks',
            currentDialog: '',
            currentData: '',
            dialogVisible: false,
            remarkVisible: false,
            ajax: false,
            sendGoods: 'received',
            goodsListMessage: {
               consultType: 1,
               consultMoney: 0,
               reducePriceVisible: false
            },
            reducePriceTypeList: [
                {
                    label: '协商加价',
                    value: 1
                },
                {
                    label: '协商减价',
                    value: 2
                }
            ],
            changePriceVisible: false
            //replacePayWechatNames: ''
        }
    },
    created() {
        //this.getOrderPayRecordList()
    },
    computed: {
        gainCoupon() {
            // couponType 0:获得优惠券 1:使用优惠券
            let couponStr = ''

            if(this.orderDetail.orderCouponList) {
                let gainCouponList = this.orderDetail.orderCouponList.filter(val => val.couponType == 0)

                if(gainCouponList && gainCouponList.length) {
                    gainCouponList.forEach(coupon => {
                        couponStr += coupon.couponName + ' 有效期至 ' + coupon.endTime
                    })
                }
            }

            return couponStr
            
        },
        gainPromotionCode() {
            // promotionCodeType 0:获得优惠码 1:使用优惠码
            let promotionCodeStr = ''

            if(this.orderDetail.orderPromotionCodeList) {
                let gainPromotionCodeList = this.orderDetail.orderPromotionCodeList.filter(val => val.promotionCodeType == 0)

                if(gainPromotionCodeList && gainPromotionCodeList.length) {
                    gainPromotionCodeList.forEach(promotionCode => {
                        promotionCodeStr += promotionCode.promotionCodeName + ' 有效期至 ' + promotionCode.endTime
                    })
                }
            }

            return promotionCodeStr
            
        },
        usedCouponList() {
            return this.orderDetail.orderCouponList && this.orderDetail.orderCouponList.filter(val => val.couponType == 1) || []
        },
        usedPromotionList() {
            return this.orderDetail.orderPromotionCodeList && this.orderDetail.orderPromotionCodeList.filter(val => val.promotionCodeType == 1) || []
        }
    },
    methods: {
        // getOrderPayRecordList() {
        //     this._apis.order.getOrderPayRecordList({id: this.$route.query.id}).then(res => {
        //         let str = ''

        //         let namesList = res.map(val => val.replacePayWechatName)

        //         namesL
        //         this.$notify({
        //             title: '成功',
        //             message: '查询成功！',
        //             type: 'success'
        //         });
        //     }).catch(error => {
        //         this.$notify.error({
        //             title: '错误',
        //             message: error
        //         });
        //     }) 
        // },
        reducePriceHandler() {
            this._apis.order.orderPriceChange({id: this.orderDetail.orderInfo.id, 
            consultType: this.goodsListMessage.consultType, consultMoney: this.goodsListMessage.consultMoney}).then(res => {
                this.changePriceVisible = false
                this.$notify({
                    title: '成功',
                    message: '添加成功！',
                    type: 'success'
                });
                this.getDetail()
            }).catch(error => {
                this.changePriceVisible = false
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            }) 
        },
        reducePriceHandler() {
            this._apis.order.orderPriceChange({id: this.orderDetail.orderInfo.id, 
            consultType: this.goodsListMessage.consultType, consultMoney: this.goodsListMessage.consultMoney}).then(res => {
                this.changePriceVisible = false
                this.$notify({
                    title: '成功',
                    message: '添加成功！',
                    type: 'success'
                });
                this.getDetail()
            }).catch(error => {
                this.changePriceVisible = false
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            }) 
        },
        submit() {
            this.$emit('getDetail')
        },
        remarkHandler() {
            this.remarkVisible = true
            this._apis.order.orderRemark({id: this.orderInfo.id, sellerRemark: this.orderInfo.sellerRemark}).then(res => {
                this.remarkVisible = false
                this.$notify({
                    title: '成功',
                    message: '添加成功！',
                    type: 'success'
                });
            }).catch(error => {
                this.remarkVisible = false
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            }) 
        }
    },
    filters: {
        deliveryWayFilter(code) {
            if(code === 1) {
                return '普通快递'
            } else if(code === 2) {
                return '商家自送'
            }
        },
        payWayFilter(code) {
            if(code === 1) {
                return '线上支付'
            } else if(code === 2) {
                return '货到付款'
            } else if(code === 3) {
                return '找人代付'
            } else if(code === 4) {
                return '线下支付'
            }
        },
        invoiceTypeFilter(code) {
            if(code === 1) {
                return '个人'
            } else if(code === 2) {
                return '公司'
            }
        },
        orderPayRecordListFilter(arr) {
            let str = ''
            let _arr

            if(arr) {
                _arr = arr.slice(0, 3)
                str = _arr.map(val => val.memberName).join(',')
            }

            return str
        }
    },
    props: {
        orderInfo: {
            type: Object,
            required: true
        },
        orderDetail: {
            type: Object,
            required: true
        }
    },
    components: {
        ReceiveInformationDialog,
        CouponDialog
    }
}
</script>
<style lang="scss" scoped>
    .order-information {
        .blue {
            color: $globalMainColor;
        }
        .grid-content {
            margin-right: 19px;
            padding-right: 19px;
            p {
                line-height: 21px;
            }
            &.lefter {
                height: 146px;
                .change {
                    color: $globalMainColor;
                    text-align: right;
                    margin-top: 10px;
                }
            }
            &.righter {
                border: none;
                .remark-box {
                    p {
                        margin-top: 8px;
                    }
                }
            }
            &.center {
                padding-left: 10px;
                border-left: 1px solid #cacfcb;
                border-right: 1px solid #cacfcb;
            }
            .item {
                display: flex;
                margin-top: 10px;
                .label {
                    margin-right: 20px;
                }
                .value {
                    color: #9FA29F;
                }
            }
        }
    }
    /deep/ .remark-box .el-textarea {
        width: 180px;
    }

    .goods-list, .operate-record {
            background-color: #fff;
            margin-top: 20px;
            padding: 20px;
            .header {
                padding-bottom: 20px;
                font-size: 16px;
                color: #161617;
            }
        }
        .goods-list-message {
            margin-top: 20px;
            padding-right: 50px;
            float: right;
            .item {
                display: flex;
                margin-top: 10px;
            }
            .reduce-price {
                display: flex;
                align-items: center;
                /deep/ .el-input {
                    width: 100px;
                }
            }
            .coupon-img {
                width: 14px;
                height: 14px;
                display: inline-block;
                background: url(../../../assets/images/order/icon-coupon.png);
                margin-left: 14px;
            }
            .row {
                margin-bottom: 10px;
                .reduce-price-input {
                    width: 100px;
                }
                .col:first-child {
                    width: 110px;
                    text-align: right;
                    margin-right: 5px;
                }
            }
        }
        .operate-record {
            clear: both;
        }
        .reduce-price-input {
        width: auto;
    }
    .orderPayRecordList {
        margin-left: 5px;
    }
</style>


