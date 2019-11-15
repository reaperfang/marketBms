<template>
    <div class="order-detail">
        <div class="header">
            <div class="lefter">
                <span>订单编号：{{orderDetail.orderInfo.code}}</span>
                <span>{{orderDetail.orderInfo.channelInfoId | channelInfoIdFilter}}</span>
                <span>{{orderDetail.orderInfo.orderType | orderTypeFilter}}</span>
                <span v-if="orderDetail.orderInfo.orderType == 1 && orderDetail.orderInfo.groupId">拼团编号：{{orderDetail.orderInfo.groupId}}</span>
            </div>
            <div class="righter">
                <i class="memberLevelImg" :style="{background: `url(${orderDetail.memberLevelImg})`}"></i>
                <span class="member-sn">客户ID：{{orderDetail.orderInfo.memberSn}}</span>
            </div>
        </div>
        <orderState :orderInfo="orderDetail.orderInfo" :orderState="orderDetail.orderInfo.orderStatus" :payWay="orderDetail.orderInfo.payWay" :closeReaosn="orderDetail.orderInfo.closeReaosn" @orderStatusSuccess="getDetail" class="order-state"></orderState>
        <div class="message">
            <el-tabs v-model="activeName">
                <el-tab-pane label="订单信息" name="order">
                    <orderInformation :orderInfo="orderDetail.orderInfo" :orderDetail="orderDetail" @getDetail="getDetail"></orderInformation>
                </el-tab-pane>
                <el-tab-pane label="发货信息" name="delivery">
                    <deliveryInformation :orderDetail="orderDetail"></deliveryInformation>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- <div class="goods-list">
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
                    <div class="col">
                        <el-select style="margin-right: 5px;" v-model="goodsListMessage.consultType" placeholder="请选择">
                            <el-option
                            v-for="item in reducePriceTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="col">
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
        </div> -->
        <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData"></component>
    </div>
</template>
<script>
import OrderState from './components/orderState'
import OrderInformation from './components/orderInformation'
import DeliveryInformation from './components/deliveryInformation'
import CouponDialog from '@/views/order/dialogs/couponDialog'

export default {
    data() {
        return {
            orderNumber: '1',
            collageNumber: '1',
            customerId: 1,
            activeName: 'order',
            tableData: [
                
            ],
            goodsListMessage: {
               consultType: 1,
               consultMoney: 0,
               reducePriceVisible: false
            },
            operateRecord: [
                
            ],
            currentDialog: '',
            dialogVisible: false,
            currentData: {
                price: '',
                detail: '',
                limit: '',
                code: ''
            },
            orderDetail: {
                orderInfo: {},
                orderCouponList: [],
                orderPromotionCodeList: []
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
        }
    },
    created() {
        this.getDetail().then(() => {
            if(this.$route.query.tab == 2) {
                this.activeName = 'delivery'
            }
        })
    },
    computed: {
        usedCouponList() {
            return this.orderDetail.orderCouponList && this.orderDetail.orderCouponList.filter(val => val.couponType == 1) || []
        },
        usedPromotionList() {
            return this.orderDetail.orderPromotionCodeList && this.orderDetail.orderPromotionCodeList.filter(val => val.promotionCodeType == 1) || []
        }
    },
    filters: {
        operationTypeFilter(code) {
            switch(code) {
                case 1:
                    return '确认收款'
                case 2:
                    return '改价'
                case 3:
                    return '继续发货'
                case 4:
                    return '补填物流信息'
                case 5:
                    return '发货'
                case 6:
                    return '关闭订单'
                case 7:
                    return '提前关闭订单'
            }
        },
        channelInfoIdFilter(code) {
            switch(code) {
                case '1':
                    return '小程序'
                case '2':
                    return '公众号'
            }
        },
        orderTypeFilter(code) {
            switch(code + '') {
                case '0':
                    return '普通订单'
                case '1':
                    return '拼团订单'
                case '2':
                    return '优惠套装订单'
                case '3':
                    return '特权价'
                case '4':
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
        sendGoods() {
            console.log('sendGoods')
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
        getDetail() {
            return new Promise((resolve, reject) => {
                let id = this.$route.query.id

                this._apis.order.fetchOrderDetail({id}).then((res) => {
                    res.orderInfo && (res.orderInfo.consultType = res.orderInfo.consultType || 2)
                    this.orderDetail = res
                    resolve(res)
                }).catch(error => {
                    this.$notify.error({
                        title: '错误',
                        message: error
                    });
                    reject(error)
                })
            })
        }
    },
    components: {
        OrderState,
        OrderInformation,
        CouponDialog,
        DeliveryInformation
    }
}
</script>
<style lang="scss" scoped>
    .order-detail {
        color: $contentColor;
        .header {
            display: flex;
            justify-content: space-between;
            background-color: #fff;
            height: 60px;
            line-height: 60px;
            padding: 0 20px;
            .lefter {
                span {
                    border-right: 1px solid #cacfcb;
                    padding-right: 5px;
                    &:last-child {
                        border: none;
                    }
                }
            }
        }
        .order-state {
            margin-top: 20px;
        }
        .message {
            background-color: #fff;
            margin-top: 20px;
            padding: 20px;
            padding-top: 5px;
        }
        .goods-detail {
            display: flex;
            align-items: center;
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
                background: url(../../assets/images/order/icon-coupon.png);
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
    }
    .reduce-price-input {
        width: auto;
    }
    .memberLevelImg {
        display: inline-block;
        width: 14px;
        height: 13px;
        margin-right: 5px;
    }
    .image-box {
        margin-right: 5px;
    }
    .member-sn {
        color: #b6b6b9;
    }
</style>


