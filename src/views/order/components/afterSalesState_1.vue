<!-- 退货退款 -->
<template>
    <div class="after-sales-state">
        <template v-if="this.orderAfterSale.orderAfterSaleStatus == 0">
            <!-- 待审核 -->
            <div class="row align-center justity-between">
                <div class="col flex1 lefter">
                    <el-steps :active="2">
                        <el-step class="word4" title="提交申请" :description="orderAfterSale.createTime"></el-step>
                        <el-step class="word4" title="商户处理" description=""></el-step>
                        <el-step class="word4" title="客户退货" description=""></el-step>
                        <el-step class="word4" title="商户退款" description=""></el-step>
                        <el-step class="word5" title="系统处理中" description=""></el-step>
                        <el-step class="word2" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="col righter">
                    <p>待审核</p>
                    <p class="des">客户申请售后，待审核</p>
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
                    <el-steps :active="3">
                        <el-step class="word4" title="提交申请" :description="orderAfterSale.createTime"></el-step>
                        <el-step class="word4" title="商户处理" :description="orderAfterSale.examineTime"></el-step>
                        <el-step class="word4" title="客户退货" description=""></el-step>
                        <el-step class="word4" title="商户退款" description=""></el-step>
                        <el-step class="word5" title="系统处理中" description=""></el-step>
                        <el-step class="word2" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="col righter">
                    <p>待退货</p>
                    <p class="des">商户同意售后，客户未发货。</p>

                </div>
            </div>
        </template>
        <template v-else-if="this.orderAfterSale.orderAfterSaleStatus == 2">
            <!-- 待处理 -->
            <div class="row align-center justity-between">
                <div class="col flex1 lefter">
                    <el-steps :active="4">
                        <el-step class="word4" title="提交申请" :description="orderAfterSale.createTime"></el-step>
                        <el-step class="word4" title="商户处理" :description="orderAfterSale.examineTime"></el-step>
                        <el-step class="word4" title="客户退货" :description="orderAfterSale.memberReturnGoodsTime"></el-step>
                        <el-step class="word4" title="商户退款" description=""></el-step>
                        <el-step class="word5" title="系统处理中" description=""></el-step>
                        <el-step class="word2" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="col righter">
                    <p>待处理</p>
                    <p class="des">客户发货，商户未确认收货，未退款</p>
                    <div class="button-box">
                        <el-button v-if="!orderAfterSale.receiveGoodsTime" @click="confirmTakeOver">确认收货</el-button>
                        <el-button type="primary" @click="drawback(orderAfterSale.id)">退款</el-button>
                    </div>
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
                    <p class="des">客户撤销申请或商户拒绝售后。</p>
                </div>
            </div>
        </template>
        <template v-else-if="this.orderAfterSale.orderAfterSaleStatus == 4">
            <!-- 已完成 -->
            <div class="row align-center justity-between">
                <div class="col flex1 lefter">
                    <el-steps :active="6">
                        <el-step class="word4" title="提交申请" :description="orderAfterSale.createTime"></el-step>
                        <el-step class="word4" title="商户处理" :description="orderAfterSale.examineTime"></el-step>
                        <el-step class="word4" title="客户退货" :description="orderAfterSale.memberReturnGoodsTime"></el-step>
                        <el-step class="word4" title="商户退款" :description="orderAfterSale.refundTime"></el-step>
                        <el-step class="word5" title="系统处理中" :description="orderAfterSale.refundTime"></el-step>
                        <el-step class="word2" title="完成" :description="orderAfterSale.refundTime"></el-step>
                    </el-steps>
                </div>
                <div class="col righter">
                    <p>已完成</p>
                    <p class="des">商户确认收货且退款完成</p>
                    <el-button v-if="!orderAfterSale.receiveGoodsTime" @click="confirmTakeOver">确认收货</el-button>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
// examineTime 审核时间           商户处理
// cancelTime  撤销时间
// memberTeturnGoodsTime  客户退货时间
// receiveGoodsTime  商家确认收货时间
// sendTime  商家发货时间
// memberTeceiveGoodsTime  客户收货时间
// refundTime  商家退款时间
export default {
    data() {
        return {
            customerClose: true
        }
    },
    methods: {
        confirmTakeOver() {
            this.$emit('confirmTakeOver')
        },
        auth() {
            this.$emit('auth')
        },
        reject() {
            this.$emit('reject')
        },
        drawback(id) {
            this._apis.order.orderAfterSaleDrawback({id}).then((res) => {
                this.$notify({
                    title: '成功',
                    message: '已发起退款，系统处理中。',
                    type: 'success'
                });
                this.$emit('getDetail')
            }).catch(error => {
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            })
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
                case 5: // 已关闭
                    return 3
                case 4: // 已完成
                    return 6
            }
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