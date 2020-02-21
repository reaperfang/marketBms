<template>
    <div class="order">
        <div class="order-header">
            <div class="item goods">
                <div class="row justify-between">
                    <div class="col">商品信息</div>
                    <div class="col">数量</div>
                </div>
            </div>
            <div class="item" style="width: 120px;">订单金额</div>
            <div class="item" style="width: 120px;">收货人及联系方式</div>
            <div class="item">配送方式</div>
            <div class="item">状态</div>
            <div class="item">操作</div>
        </div>
        <div class="order-container" v-loading="loading">
            <div class="container-item" v-for="(order, index) in list" :key="index">
                <div class="container-item-header">
                    <div class="item">
                        <el-checkbox :disabled="order.orderStatus == 2" @change="checkedChange" v-model="order.checked"></el-checkbox>
                        <span class="order-code">
                            <el-tooltip v-if="order.sendType == 2" content="自动发货" placement="bottom" effect="light">
                                <i class="auto"></i>
                            </el-tooltip>
                            <el-tooltip :content="`${order.memberSn}催发货，请尽快发货`" placement="bottom" effect="light">
                                <i v-if="order.isUrge == 0" class="el-icon-message-solid"></i>
                            </el-tooltip>
                            订单编号：{{order.code}}/下单时间：{{order.createTime}}
                        </span>
                    </div>
                    <div class="item righter">
                        <span>订单类型：{{order.orderType | orderTypeFilter}}</span>
                        <span><i class="memberLevelImg" :style="{background: `url(${order.memberLevelImg})`}"></i>客户ID：{{order.memberSn}}</span>
                        <span>订单来源：{{order.channelName}}</span>
                        <!-- <i v-permission="['订单', '订单查询', '商城订单', '删除订单']" @click="closeOrder(order.id)" v-if="order.orderStatus == 2" class="el-icon-delete"></i> -->
                    </div>
                </div>
                <div class="container-item-content">
                    <div class="item goods">
                        <ul>
                            <li class="goods-li" v-for="(goods, index) in order.orderItems" :key="index">
                                <div class="row justify-between align-center goods-box">
                                    <div class="col" style="padding-right: 10px;">
                                        <div class="row align-center">
                                            <div class="col image-box">
                                                <img width="66" :src="goods.goodsImage" alt="">
                                            </div>
                                            <div class="col">
                                                <p class="ellipsis" style="width: 297px;">{{goods.goodsName}}</p>
                                                <p class="goods-specs">{{goods.goodsSpecs | goodsSpecsFilter}}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col">
                                        {{goods.goodsCount}}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="item" style="width: 120px;">
                        <!-- <p class="pay-amount">实收：¥{{order.actualMoney}}</p>
                        <p class="payment-mode">{{order.channelName}}支付</p> -->
                        <p>¥{{order | netReceiptsFilter}}</p>
                        <!-- <p>{{order.channelName}}支付</p> -->
                    </div>
                    <div class="item" style="width: 120px;">
                        <p>{{order.receivedName}}</p>
                        <p>{{order.receivedPhone}}</p>
                    </div>
                    <div class="item">{{order.deliveryWay | deliveryWayFilter}}</div>
                    <div class="item">{{order.orderStatus | orderStatusFilter}}</div>
                    <div class="item operate">
                        <template v-if="order.orderStatus == 0">
                            <!-- 待付款 -->
                            <p v-permission="['订单', '订单查询', '商城订单', '查看详情']" @click="$router.push('/order/orderDetail?id=' + order.id)">查看详情</p>
                            <p v-permission="['订单', '订单查询', '商城订单', '订单改价']" @click="$router.push('/order/orderDetail?id=' + order.id)">订单改价</p>
                            <p v-permission="['订单', '订单查询', '商城订单', '关闭订单']" @click="currentDialog = 'CloseOrderDialog'; currentData = order.id; dialogVisible = true">关闭订单</p>
                            <p v-permission="['订单', '订单查询', '商城订单', '确认收款']" @click="makeCollections(order)">确认收款</p>
                        </template>
                        <template v-else-if="order.orderStatus == 1">
                            <!-- 待成团 -->
                            <p v-permission="['订单', '订单查询', '商城订单', '查看详情']" @click="$router.push('/order/orderDetail?id=' + order.id)">查看详情</p>
                        </template>
                        <template v-else-if="order.orderStatus == 2">
                            <!-- 关闭 -->
                            <p v-permission="['订单', '订单查询', '商城订单', '查看详情']" @click="$router.push('/order/orderDetail?id=' + order.id)">查看详情</p>
                        </template>
                        <template v-else-if="order.orderStatus == 3">
                            <!-- 待发货 -->
                            <p v-permission="['订单', '订单查询', '商城订单', '查看详情']" @click="$router.push('/order/orderDetail?id=' + order.id)">查看详情</p>
                            <p v-permission="['订单', '订单查询', '商城订单', '发货']" @click="$router.push('/order/deliverGoods?id=' + order.id)">发货</p>
                            <p v-permission="['订单', '订单查询', '商城订单', '关闭订单']" @click="currentDialog = 'CloseOrderDialog'; currentData = order.id; dialogVisible = true">关闭订单</p>
                        </template>
                        <template v-else-if="order.orderStatus == 4">
                            <!-- 部分发货 -->
                            <p v-permission="['订单', '订单查询', '商城订单', '查看详情']" @click="$router.push('/order/orderDetail?id=' + order.id)">查看详情</p>
                            <p v-permission="['订单', '订单查询', '商城订单', '继续发货']" @click="$router.push('/order/deliverGoods?id=' + order.id)">继续发货</p>
                            <p v-permission="['订单', '订单查询', '商城订单', '发货信息']" @click="$router.push('/order/orderDetail?id=' + order.id + '&tab=2')">发货信息</p>
                            <p v-permission="['订单', '订单查询', '商城订单', '提前关闭订单']" @click="currentDialog = 'CloseOrderDialog'; currentData = order.id; dialogVisible = true">提前关闭订单</p>
                        </template>
                        <template v-else-if="order.orderStatus == 5">
                            <!-- 待收货 -->
                            <p v-permission="['订单', '订单查询', '商城订单', '查看详情']" @click="$router.push('/order/orderDetail?id=' + order.id)">查看详情</p>
                            <p v-permission="['订单', '订单查询', '商城订单', '发货信息']" @click="$router.push('/order/orderDetail?id=' + order.id + '&tab=2')">发货信息</p>
                            <p v-permission="['订单', '订单查询', '商城订单', '补填物流']" v-if="order.isFillUp == 1" @click="$router.push('/order/supplementaryLogistics?id=' + order.id)">补填物流</p>
                        </template>
                        <template v-else-if="order.orderStatus == 6">
                            <!-- 完成 -->
                            <p v-permission="['订单', '订单查询', '商城订单', '查看详情']" @click="$router.push('/order/orderDetail?id=' + order.id)">查看详情</p>
                            <p v-permission="['订单', '订单查询', '商城订单', '发货信息']" @click="$router.push('/order/orderDetail?id=' + order.id + '&tab=2')">发货信息</p>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <component :is="currentDialog" :dialogVisible.sync="dialogVisible" @submit="submit"></component>
    </div>
</template>
<script>
import CloseOrderDialog from '@/views/order/dialogs/closeOrderDialog'

export default {
    data() {
        return {
            orderList: [
                
            ],
            currentDialog: '',
            currentData: '',
            dialogVisible: false,
            loading: false
        }
    },
    created() {
        
    },
    watch: {

    },
    filters: {
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
        deliveryWayFilter(code) {
            switch(code) {
                case 1:
                    return '普通快递'
                case 2:
                    return '商家自送'
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
        },
        netReceiptsFilter(value) {
            let goodsAmount
            let freight
            let total

            goodsAmount = typeof value.goodsAmount == 'string' ? parseFloat(value.goodsAmount) : value.goodsAmount
            freight = typeof value.freight == 'string' ? parseFloat(value.freight) : value.freight
            total = goodsAmount + freight
            total = total.toFixed(2)

            return total
        }
    },
    methods: {
        closeOrder(id) {
            this._apis.order.deleteOrder({id, deleteFlag: 0}).then((res) => {
                this.$notify({
                    title: '成功',
                    message: '删除成功！',
                    type: 'success'
                });
            }).catch(error => {
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            })
        },
        submit(value) {
            this._apis.order.orderClose({...value, id: this.currentData}).then((res) => {
                this.$emit('getList')
                this.visible = false
                this.$notify({
                    title: '成功',
                    message: '关闭成功！',
                    type: 'success'
                });
            }).catch(error => {
                this.visible = false
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            })
        },
        makeCollections(order) {
           this.confirm({title: '确认收款提示', icon: true, text: `确定收款后无法撤销，您要确认收款吗？`}).then(() => {
                this._apis.order.makeCollections({id: order.id, payWay: 4}).then((res) => {
                    this.$emit('getList')
                    this.visible = false
                    this.$notify({
                        title: '成功',
                        message: '收款成功！',
                        type: 'success'
                    });
                }).catch(error => {
                    this.visible = false
                    this.$notify.error({
                        title: '错误',
                        message: error
                    });
                })
            }) 
        },
        checkedChange() {
            let len = this.list.filter(val => val.checked).length

            this._globalEvent.$emit('checkedLength', len)
        }
    },
    props: {
        list: {
            type: Array
        },
    },
    components: {
        CloseOrderDialog
    }
}
</script>
<style lang="scss" scoped>
    .order {
        .order-header {
            display: flex;
            color: $globalMainColor;
            background-color: rgb(240, 239, 255);
            padding: 12px 20px;
            .item {
                width: 80px;
                margin-right: 20px;
                &:last-child {
                    margin-right: 0;
                }
                &.goods {
                    flex: 1;
                }
            }
        }
        .order-container {
            margin-top: 20px;
            width: 100%;
            overflow-x: scroll;
            &::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            &::-webkit-scrollbar-thumb {
                border-radius: 10px!important;
                background: rgba(101,94,255,.4)!important;
            }
            &::-webkit-scrollbar-track {
                border-radius: 0!important;
                background: rgba(101,94,255,.1)!important;
            }
            .container-item {
                border: 1px solid rgb(202, 207, 203);
                border-radius:10px;
                margin-bottom: 20px;
                min-width: 1108px;
                .container-item-header {
                    display: flex;
                    justify-content: space-between;
                    background-color: rgb(243, 244, 244);
                    height: 60px;
                    line-height: 60px;
                    padding: 0 20px;
                    color: $contentColor;
                    border-radius: 10px 10px 0 0;
                    .righter {
                        color: rgb(173, 174, 177);
                        span {
                            margin-right: 20px;
                        }
                    }
                }
                .container-item-content {
                    display: flex;
                    align-items: center;
                    padding: 22px 20px;
                    color: #333333;
                    .pay-amount {
                        text-align: center;
                        padding-bottom: 2px;
                        width: 100px;
                    }
                    .payment-mode {
                        border-top: 1px solid #CACFCB;
                        width: 100px;
                        text-align: center;
                        padding-top: 2px;
                    }
                    >.item {
                        width: 80px;
                        margin-right: 20px;
                        p {
                            line-height: 21px;
                        }
                        &:last-child {
                            margin-right: 0;
                        }
                        &.goods {
                            flex: 1;
                            ul li {
                                display: flex;
                                align-items: center;
                                .item {
                                    margin-right: 10px;
                                }
                            }
                            .goods-box {
                                width: 100%;
                                .image-box {
                                    margin-right: 10px;
                                }
                            }
                            .goods-li {
                                border-bottom: 1px solid #CACFCB;
                                padding: 9px 0;
                                .goods-specs {
                                    color: #9FA29F;
                                    margin-top: 6px;
                                }
                                &:last-child {
                                    border: none;
                                }
                            }
                        }
                        &.operate {
                            color: $globalMainColor;
                            p {
                                cursor: pointer;
                            }
                            .delivery {
                                margin-top: 6px;
                            }
                        }
                    }
                }
            }
        }
    }
    .order-code {
        margin-left: 4px;
    }
    .memberLevelImg {
        display: inline-block;
        width: 14px;
        height: 13px;
        margin-right: 5px;
    }
    .auto {
        display: inline-block;
        width: 28px;
        height: 16px;
        background: url(../../../assets/images/order/auto.png) no-repeat;
        position: relative;
        top: 3px;
        margin-right: 5px;
    }
</style>


