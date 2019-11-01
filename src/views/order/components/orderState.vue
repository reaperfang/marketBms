<template>
    <div class="order-state">
        <template v-if="payWay == 2">
            <!-- 货到付款 -->
            <template v-if="orderState == 0">
                <!-- 待付款 -->
                <div class="item lefter">
                    <el-steps active="1">
                        <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="货到付款" description=""></el-step>
                        <el-step title="商户发货" description=""></el-step>
                        <el-step title="客戶收货" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>待付款</p>
                    <div class="button-box">
                        <el-button @click="closeOrder">关闭订单</el-button>
                    </div>
                </div>
            </template>
            <template v-else-if="orderState == 1">
                <!-- 待成团 -->
                <div class="item lefter">
                    <el-steps active="3">
                        <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="客户付款" description=""></el-step>
                        <el-step title="商户发货" description=""></el-step>
                        <el-step title="客户收货" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>拼团中</p>
                </div>
            </template>
            <template v-else-if="orderState == 3">
                <!-- 待发货 -->
                <div class="item lefter">
                    <el-steps active="3">
                        <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="货到付款" description=""></el-step>
                        <el-step title="商户发货" description=""></el-step>
                        <el-step title="客户收货" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>待发货</p>
                    <p>客户选择货到付款，您需要自行安排配送和收款。</p>
                    <div class="button-box">
                        <el-button @click="closeOrder">关闭订单</el-button>
                        <el-button type="primary" @click="$router.push('/order/deliverGoods?id=' + $route.query.id)">发货</el-button>
                    </div>
                </div>
            </template>
            <template v-else-if="orderState == 4">
                <!-- 部分发货 -->
                <div class="item lefter">
                    <el-steps active="3">
                        <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="货到付款" description=""></el-step>
                        <el-step title="商户发货" description=""></el-step>
                        <el-step title="客户收货" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>部分发货</p>
                    <div class="button-box">
                        <el-button @click="closeOrder">关闭订单</el-button>
                        <el-button type="primary" @click="$router.push('/order/deliverGoods?id=' + $route.query.id)">发货</el-button>
                    </div>
                </div>
            </template>
            <template v-else-if="orderState == 5">
                <!-- 待收货 -->
                <div class="item lefter">
                    <el-steps active="4">
                        <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="货到付款" description=""></el-step>
                        <el-step title="商户发货" :description="orderInfo.sendTime"></el-step>
                        <el-step title="客户收货" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>待收货</p>
                </div>
            </template>
            <template v-else-if="orderState == 6">
                <!-- 完成 -->
                <div class="item lefter">
                    <el-steps active="5">
                        <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="货到付款" description=""></el-step>
                        <el-step title="商户发货" :description="orderInfo.sendTime"></el-step>
                        <el-step title="客户收货" description=""></el-step>
                        <el-step class="close" title="完成" :description="orderInfo.complateTime"></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>已完成</p>
                </div>
            </template>
            <template v-else-if="orderState == 2">
                <!-- 关闭 -->
                <div class="item lefter">
                    <el-steps :active="active">
                        <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="订单关闭" :description="orderInfo.closeTime"></el-step>
                        <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>已关闭</p>
                    <p>{{orderInfo.closeReaosn | closeReaosnFilter}}</p>
                </div>
            </template>
        </template>
        <template v-else>
            <!-- 线上支付,找人代付 线下支付 -->
            <template v-if="orderState == 0">
                <!-- 待付款 -->
                <div class="item lefter">
                    <el-steps :active="active">
                        <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="客户付款" description=""></el-step>
                        <el-step title="商户发货" description=""></el-step>
                        <el-step title="客户收货" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>待付款</p>
                    <div class="button-box">
                        <el-button class="pointer" @click="closeOrder">关闭订单</el-button>
                    </div>
                </div>
            </template>
            <template v-else-if="orderState == 1">
                <!-- 待成团 -->
                <div class="item lefter">
                    <el-steps :active="active">
                        <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="客户付款" :description="orderInfo.payComplateTime"></el-step>
                        <el-step title="商户发货" description=""></el-step>
                        <el-step title="客户收货" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>拼团中</p>
                </div>
            </template>
            <template v-else-if="orderState == 3">
                <!-- 待发货 -->
                <div class="item lefter">
                    <el-steps :active="active">
                        <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="客户付款" :description="orderInfo.payComplateTime"></el-step>
                        <el-step title="商户发货" description="客户已完成付款，请尽快完成发货"></el-step>
                        <el-step title="客户收货" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>待发货</p>
                    <div class="button-box">
                        <el-button @click="closeOrder">关闭订单</el-button>
                        <el-button type="primary" @click="$router.push('/order/deliverGoods?id=' + $route.query.id)">发货</el-button>
                    </div>
                </div>
            </template>
            <template v-else-if="orderState == 4">
                <!-- 部分发货 -->
                <div class="item lefter">
                    <el-steps active="3">
                        <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="客户付款" :description="orderInfo.payComplateTime"></el-step>
                        <el-step title="商户发货" description="客户已完成付款，请尽快完成剩余发货"></el-step>
                        <el-step title="客户收货" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>部分发货</p>
                    <div class="button-box">
                        <el-button @click="closeOrder">关闭订单</el-button>
                        <el-button type="primary" @click="$router.push('/order/deliverGoods?id=' + $route.query.id)">发货</el-button>
                    </div>
                </div>
            </template>
            <template v-else-if="orderState == 5">
                <!-- 待收货 -->
                <div class="item lefter">
                    <el-steps :active="active">
                        <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="客户付款" :description="orderInfo.payComplateTime"></el-step>
                        <el-step title="商户发货" :description="orderInfo.sendTime"></el-step>
                        <el-step title="客户收货" description="等待签收"></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>待收货</p>
                </div>
            </template>
            <template v-else-if="orderState == 6">
                <!-- 完成 -->
                <div class="item lefter">
                    <el-steps :active="active">
                        <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="客户付款" :description="orderInfo.payComplateTime"></el-step>
                        <el-step title="商户发货" :description="orderInfo.sendTime"></el-step>
                        <el-step title="客户收货" description=""></el-step>
                        <el-step class="close" title="完成" :description="orderInfo.complateTime"></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>已完成</p>
                </div>
            </template>
            <template v-else-if="orderState == 2">
                <template v-if="orderInfo.closeReason == 0">
                    <!-- 超时取消 -->
                    <div class="item lefter">
                        <el-steps active="3">
                            <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                            <el-step title="订单关闭" :description="orderInfo.closeTime"></el-step>
                            <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                        </el-steps>
                    </div>
                    <div class="item righter">
                        <p>已关闭</p>
                        <p>{{orderInfo.closeReaosn | closeReaosnFilter}}</p>
                    </div>
                </template>
                <template v-else-if="orderInfo.closeReason == 1">
                    <!-- 客户取消 -->
                    <template v-if="orderInfo.payComplateTime">
                        <!-- 客户付款 -->
                        <div class="item lefter">
                            <el-steps active="4">
                                <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                                <el-step title="客户付款" :description="orderInfo.payComplateTime"></el-step>
                                <el-step title="订单关闭" :description="`客户取消订单${orderInfo.closeTime}`"></el-step>
                                <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                            </el-steps>
                        </div>
                        <div class="item righter">
                            <p>已关闭</p>
                            <p>{{orderInfo.closeReaosn | closeReaosnFilter}}</p>
                        </div>
                    </template>
                    <template v-else>
                        <!-- 客户未付款 -->
                        <div class="item lefter">
                            <el-steps active="3">
                                <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                                <el-step title="订单关闭" :description="`客户取消订单${orderInfo.closeTime}`"></el-step>
                                <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                            </el-steps>
                        </div>
                        <div class="item righter">
                            <p>已关闭</p>
                            <p>{{orderInfo.closeReaosn | closeReaosnFilter}}</p>
                        </div>
                    </template>
                </template>
                <template v-else-if="orderInfo.closeReason == 2">
                    <!-- 商户关闭 -->
                    <template v-if="orderInfo.payComplateTime">
                        <!-- 客户付款 -->
                        <div class="item lefter">
                            <el-steps active="4">
                                <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                                <el-step title="客户付款" :description="orderInfo.payComplateTime"></el-step>
                                <el-step title="订单关闭" :description="`商户关闭订单${orderInfo.closeTime}`"></el-step>
                                <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                            </el-steps>
                        </div>
                        <div class="item righter">
                            <p>已关闭</p>
                            <p>{{orderInfo.closeReaosn | closeReaosnFilter}}</p>
                        </div>
                    </template>
                    <template v-else>
                        <!-- 客户未付款 -->
                        <div class="item lefter">
                            <el-steps active="3">
                                <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                                <el-step title="订单关闭" :description="`商户关闭订单${orderInfo.closeTime}`"></el-step>
                                <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                            </el-steps>
                        </div>
                        <div class="item righter">
                            <p>已关闭</p>
                            <p>{{orderInfo.closeReaosn | closeReaosnFilter}}</p>
                        </div>
                    </template>
                </template>
                <template v-else-if="orderInfo.closeReason == 3">
                    <!-- 拼团失败 -->
                    <div class="item lefter">
                        <el-steps active="3">
                            <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                            <el-step title="订单关闭" :description="`拼团活动关闭${orderInfo.closeTime}`"></el-step>
                            <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                        </el-steps>
                    </div>
                    <div class="item righter">
                        <p>已关闭</p>
                        <p>{{orderInfo.closeReaosn | closeReaosnFilter}}</p>
                    </div>
                </template>
                <template v-else-if="orderInfo.closeReason == 4">
                    <!-- 商户关闭拼团 -->
                    <div class="item lefter">
                        <el-steps active="3">
                            <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                            <el-step title="订单关闭" :description="`商户关闭拼团${orderInfo.closeTime}`"></el-step>
                            <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                        </el-steps>
                    </div>
                    <div class="item righter">
                        <p>已关闭</p>
                        <p>{{orderInfo.closeReaosn | closeReaosnFilter}}</p>
                    </div>
                </template>
                <template v-else-if="orderInfo.closeReason == 5">
                    <!-- 客户拒收 -->
                    <div class="item lefter">
                        <el-steps active="5">
                            <el-step title="客户下单" :description="orderInfo.createTime"></el-step>
                            <el-step title="客户付款" :description="orderInfo.payComplateTime"></el-step>
                            <el-step title="商户发货" :description="orderInfo.sendTime"></el-step>
                            <el-step title="客户收货" description="客户拒绝签收"></el-step>
                            <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                        </el-steps>
                    </div>
                    <div class="item righter">
                        <p>已关闭</p>
                        <p>{{orderInfo.closeReaosn | closeReaosnFilter}}</p>
                    </div>
                </template>
            </template>
        </template>
        <component :is="currentDialog" :dialogVisible.sync="dialogVisible" @submit="submit"></component>
    </div>
</template>
<script>
// sendType 订单类型 ,1普通订单,2拼团订单,3优惠套餐订单,4赠品订单
// payWay 付款方式 1线上支付,2货到付款,3找人代付 4线下支付
// orderStatus 订单流程状态：0待付款 1待成团 2关闭 3待发货 4部分发货 5待收货 6完成
// 订单关闭原因: 0超时取消 1客户取消 2商户关闭 3拼团失败 4商户关闭拼团 5客户拒收
import CloseOrderDialog from '@/views/order/dialogs/closeOrderDialog'

export default {
    data() {
        return {
            currentDialog: '',
            dialogVisible: false
        }
    },
    computed: {
        active() {
            if(this.payWay == 2) {
                // 货到付款
                switch(+this.orderState) {
                    case 0:
                        return 2
                    case 1:
                        return 3
                    case 2:
                        return 5
                    case 3:
                        return 3
                    case 4:
                        return 3
                    case 5:
                        return 4
                    case 6:
                        return 5
                }
            } else {
                // 线上支付,找人代付 线下支付
                switch(+this.orderState) {
                    case 0:
                        return 1
                    case 1:
                        return 3
                    case 2:
                        return 5
                    case 3:
                        return 3
                    case 5:
                        return 4
                    case 6:
                        return 5
                }
            }
        }
    },
    filters: {
        closeReaosnFilter(code) {
            switch(+code) {
                case 0:
                    return '超时取消'
                case 1:
                    return '客户取消'
                case 2:
                    return '商户关闭'
                case 3:
                    return '拼团失败'
                case 4:
                    return '商户关闭拼团'
                case 5:
                    return '客户拒收'
            }
        }
    },
    methods: {
        submit(value) {
            this._apis.order.orderClose({...value, id: this.orderInfo.id}).then((res) => {
                this.$notify({
                    title: '成功',
                    message: '关闭成功！',
                    type: 'success'
                });
                this.$emit('orderStatusSuccess')
            }).catch(error => {
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            })
        },
        closeOrder() {
            this.currentDialog = 'CloseOrderDialog'; 
            this.dialogVisible = true
        }
    },
    props: {
        orderState: {
            type: Number | String,
            required: true
        },
        payWay: {
            type: Number | String
        },
        closeReaosn: {
            type: Number | String
        },
        orderInfo: {
            type: Object
        }
    },
    components: {
        CloseOrderDialog
    }
}
</script>
<style lang="scss" scoped>
    .order-state {
        background-color: #fff;
        padding: 30px 50px;
        display: flex;
        justify-content: space-between;
        .item.righter {
            margin-left: 10px;
            p {
                line-height: 21px;
            }
            p:nth-child(2) {
                font-size: 14px;
                margin-top: 5px;
            }
        }
        .item {
            &.righter {
                width: 230px;
                text-align: center;
                font-size: 20px;
                .button-box {
                    margin-top: 20px;
                }
            }
            &.lefter {
                flex: 1;
            }
        }
    }
    /deep/ .el-step__title {
        margin-top: 10px;
    }
    /deep/ .el-step:nth-child(1) {
        .el-step__title {
            margin-left: -12px;
        }
        .el-step__description {
            margin-left: -28px;
        }
    }
    /deep/ .el-step:nth-child(2) {
        .el-step__title {
            margin-left: -12px;
        }
        .el-step__description {
            margin-left: -28px;
        }
    }
    /deep/ .el-step:nth-child(3) {
        .el-step__title {
            margin-left: -12px;
        }
        .el-step__description {
            margin-left: -28px;
        }
    }
    /deep/ .el-step:nth-child(4) {
        .el-step__title {
            margin-left: -12px;
        }
        .el-step__description {
            margin-left: -28px;
        }
    }
    /deep/ .el-step:nth-child(5) {
        .el-step__title {
            margin-left: 5px;
        }
        .el-step__description {
            margin-left: -28px;
        }
    }
    /deep/ .el-step.close {
        .el-step__title {
            margin-left: 5px;
        }
    }
</style>


