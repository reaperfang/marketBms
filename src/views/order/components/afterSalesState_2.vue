<!-- 换货 -->
<template>
    <div class="after-sales-state">
        <template v-if="this.orderAfterSale.orderAfterSaleStatus == 0">
            <!-- 待审核 -->
            <div class="row align-center justity-between">
                <div class="col flex1 lefter">
                    <el-steps :active="2">
                        <el-step class="word4" title="提交申请" :description="orderAfterSale.createTime"></el-step>
                        <el-step class="word4" title="商户处理" description=""></el-step>
                        <el-step class="word4" title="用户退货" description=""></el-step>
                        <el-step class="word4" title="商户发货" description=""></el-step>
                        <el-step class="word4" title="用户收货" description=""></el-step>
                        <el-step class="word2" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="col righter">
                    <p>待审核</p>
                    <p class="des">用户申请售后，待审核</p>
                    <div class="button-box">
                        <el-button @click="reject">拒绝</el-button>
                        <el-button type="primary" @click="auth">同意</el-button>
                    </div>
                </div>
            </div>
        </template>
        <template v-else-if="this.orderAfterSale.orderAfterSaleStatus == 1">
            <!-- 待退货 -->
            <div class="row align-center justity-between">
                <div class="col flex1 lefter">
                    <el-steps :active="this.orderAfterSale.exchangeConfirmation == 0 ? 2 : 3">
                        <el-step class="word4" title="提交申请" :description="orderAfterSale.createTime"></el-step>
                        <el-step class="word4" title="商户处理" :description="orderAfterSale.examineTime"></el-step>
                        <el-step v-if="this.orderAfterSale.exchangeConfirmation != 0" class="word4" title="用户退货" description=""></el-step>
                        <el-step class="word4" title="商户发货" description=""></el-step>
                        <el-step class="word4" title="用户收货" description=""></el-step>
                        <el-step class="word2" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="col righter">
                    <template v-if="this.orderAfterSale.exchangeConfirmation != 0">
                        <p>待退货</p>
                        <p class="des">商户同意售后，用户未发货。</p>
                    </template>
                    <template v-else>
                        <p>待处理</p>
                        <p class="des">商户未发货</p>
                        <div v-if="this.orderAfterSale.exchangeConfirmation == 1" class="button-box">
                            <el-button v-if="!authHide" type="primary" @click="sendGoods">发货</el-button>
                        </div>
                    </template>
                </div>
            </div>
        </template>
        <template v-else-if="this.orderAfterSale.orderAfterSaleStatus == 2">
            <!-- 待处理 -->
            <div class="row align-center justity-between">
                <div class="col flex1 lefter">
                    <el-steps :active="this.orderAfterSale.exchangeConfirmation == 0 ? 3 :4">
                        <el-step class="word4" title="提交申请" :description="orderAfterSale.createTime"></el-step>
                        <el-step class="word4" title="商户处理" :description="orderAfterSale.examineTime"></el-step>
                        <el-step class="word4" title="用户退货" :description="orderAfterSale.memberReturnGoodsTime" v-if="orderAfterSale.exchangeConfirmation != 0"></el-step>
                        <el-step class="word4" title="商户发货" description=""></el-step>
                        <el-step class="word4" title="用户收货" description=""></el-step>
                        <el-step class="word2" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="col righter">
                    <p>待处理</p>
                    <p class="des">用户已退货，商户未发货</p>
                    <div class="button-box">
                        <el-button v-if="!authHide && !orderAfterSale.receiveGoodsTime && orderAfterSale.exchangeConfirmation != 0" @click="confirmTakeOver">确认收货</el-button>
                        <el-button v-if="!authHide" type="primary" @click="sendGoods">发货</el-button>
                    </div>
                </div>
            </div>
        </template>
        <template v-else-if="this.orderAfterSale.orderAfterSaleStatus == 3">
            <!-- 待收货 -->
            <div class="row align-center justity-between">
                <div class="col flex1 lefter">
                    <el-steps :active="this.orderAfterSale.exchangeConfirmation == 0 ? 4: 5">
                        <el-step class="word4" title="提交申请" :description="orderAfterSale.createTime"></el-step>
                        <el-step class="word4" title="商户处理" :description="orderAfterSale.examineTime"></el-step>
                        <el-step class="word4" title="用户退货" :description="orderAfterSale.memberReturnGoodsTime" v-if="orderAfterSale.exchangeConfirmation != 0"></el-step>
                        <el-step class="word4" title="商户发货" :description="orderAfterSale.sendTime"></el-step>
                        <el-step class="word4" title="用户收货" description=""></el-step>
                        <el-step class="word2" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="col righter">
                    <p>待收货</p>
                    <p class="des">商户已换货发货，用户未收货</p>
                    <el-button v-if="!authHide && !orderAfterSale.receiveGoodsTime && orderAfterSale.exchangeConfirmation != 0" @click="confirmTakeOver">确认收货</el-button>
                </div>
            </div>
        </template>
        <template v-else-if="this.orderAfterSale.orderAfterSaleStatus == 5">
            <!-- 已关闭 -->
            <div class="row align-center justity-between">
                <div class="col flex1 lefter">
                    <template v-if="orderAfterSale.closeReason == 1">
                        <el-steps :active="3">
                            <el-step class="word4" title="提交申请" :description="orderAfterSale.createTime"></el-step>
                            <el-step class="word4" title="撤销申请" :description="orderAfterSale.cancelTime"></el-step>
                            <el-step class="word5" title="申请已撤销" :description="orderAfterSale.cancelTime"></el-step>
                        </el-steps>
                    </template>
                    <template v-else>
                        <el-steps :active="3">
                            <el-step class="word4" title="提交申请" :description="orderAfterSale.createTime"></el-step>
                            <el-step class="word4" title="商户处理" :description="orderAfterSale.examineTime"></el-step>
                            <el-step class="word8" title="拒绝申请，已完结" :description="orderAfterSale.examineTime"></el-step>
                        </el-steps>
                    </template>
                </div>
                <div class="col righter">
                    <p>已关闭</p>
                    <p v-if="orderAfterSale.refuseReason" class="des">拒绝申请原因：{{orderAfterSale.refuseReason}}</p>
                </div>
            </div>
        </template>
        <template v-else-if="this.orderAfterSale.orderAfterSaleStatus == 4">
            <!-- 已完成 -->
            <div class="row align-center justity-between">
                <div class="col flex1 lefter">
                    <el-steps :active="this.orderAfterSale.exchangeConfirmation == 0 ? 6 :7">
                        <el-step class="word4" title="提交申请" :description="orderAfterSale.createTime"></el-step>
                        <el-step class="word4" title="商户处理" :description="orderAfterSale.examineTime"></el-step>
                        <el-step class="word4" title="用户退货" :description="orderAfterSale.memberReturnGoodsTime" v-if="orderAfterSale.exchangeConfirmation != 0"></el-step>
                        <el-step class="word4" title="商户发货" :description="orderAfterSale.sendTime"></el-step>
                        <el-step class="word4" title="商户收货" :description="orderAfterSale.receiveGoodsTime" v-if="orderAfterSale.exchangeConfirmation != 0"></el-step>
                        <el-step class="word4" title="用户收货" :description="orderAfterSale.memberReceiveGoodsTime"></el-step>
                        <el-step class="word2" title="完成" :description="orderAfterSale.memberReceiveGoodsTime"></el-step>
                    </el-steps>
                </div>
                <div class="col righter">
                    <p>已完成</p>
                    <p class="des">客户确认收货，完成换货。</p>
                    <el-button v-if="!authHide && !orderAfterSale.receiveGoodsTime && orderAfterSale.exchangeConfirmation != 0" @click="confirmTakeOver">确认收货</el-button>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import anotherAuth from '@/mixins/anotherAuth'

export default {
    mixins: [anotherAuth],
    data() {
        return {
            customerClose: true
        }
    },
    computed: {
        active() {
            switch(this.orderAfterSale.orderAfterSaleStatus) {
                case 0: // 提交申请(待审核)
                    return 1
                case 1: // 待退货
                    return 2
                case 2: // 待处理(客户发货)
                    return 3
                case 3: // 待收货
                    return 4
                case 5: // 已关闭
                    return 3
                case 4: // 已完成
                    return 6
            }
        }
    },
    methods: {
        sendGoods() {
            this.$router.push(`/order/orderAfterDeliverGoods?afterSale=true&id=${this.orderAfterSale.id}`)
        },
        confirmTakeOver() {
            this.$emit('confirmTakeOver')
        },
        auth() {
            this.$emit('auth')
        },
        reject() {
            this.$emit('reject')
        }
    },
    props: {
        orderAfterSale: {
            type: Object,
            required: true
        }
    }
}
</script>
<style lang="scss" scoped>
    .after-sales-state {
        .row .col.lefter {
            padding-right: 50px;
        }
        .row .col.righter {
            text-align: center;
            border-left: 2px solid #CACFCB;
            padding-left: 30px;
            p {
                margin-bottom: 20px;
                &:last-child {
                    margin-bottom: 0;
                }
                &:first-child {
                    font-size: 20px;
                }
                &.des {
                    color: #9FA29F;
                }
            }
        }
    }
    .button-box {
        margin-top: 20px;
    }
    /deep/ .el-step__title {
        margin-top: 10px;
    }
    /deep/ .el-step.word2 {
        .el-step__title {
            margin-left: 5px;
        }
        .el-step__description {
            margin-left: -28px;
        }
    }
    /deep/ .el-step.word4 {
        .el-step__title {
            margin-left: -12px;
        }
        .el-step__description {
            margin-left: -28px;
        }
    }
    /deep/ .el-step.word5 {
        .el-step__title {
            margin-left: -20px;
        }
        .el-step__description {
            margin-left: -28px;
        }
    }
</style>