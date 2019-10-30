<!-- 仅退款 -->
<template>
    <div class="after-sales-state">
        <template v-if="this.orderAfterSale.orderAfterSaleStatus == 0">
            <!-- 待审核 -->
            <div class="row align-center justity-between">
                <div class="col flex1 lefter">
                    <el-steps :active="2">
                        <el-step class="word4" title="提交申请" :description="orderAfterSale.createTime"></el-step>
                        <el-step class="word4" title="商户处理" description=""></el-step>
                        <el-step class="word2" title="退款" description=""></el-step>
                        <el-step class="word5" title="系统处理中" description=""></el-step>
                        <el-step class="word2" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="col righter">
                    <p>待审核</p>
                    <p class="des">客户申请售后，待审核</p>
                    <!-- <div class="button-box">
                        <el-button @click="reject">拒绝</el-button>
                        <el-button type="primary" @click="auth">同意</el-button>
                    </div> -->
                </div>
            </div>
        </template>
        <template v-else-if="this.orderAfterSale.orderAfterSaleStatus == 2">
            <!-- 待处理 -->
            <div class="row align-center justity-between">
                <div class="col flex1 lefter">
                    <el-steps :active="3">
                        <el-step class="word4" title="提交申请" :description="orderAfterSale.createTime"></el-step>
                        <el-step class="word4" title="商户处理" description=""></el-step>
                        <el-step class="word2" title="退款" description=""></el-step>
                        <el-step class="word5" title="系统处理中" description=""></el-step>
                        <el-step class="word2" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="col righter">
                    <p>待处理</p>
                    <div class="button-box">
                        <el-button @click="drawback(orderAfterSale.id)">退款</el-button>
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
                    <p class="des">客户撤销申请或商户拒绝售后的</p>
                </div>
            </div>
        </template>
        <template v-else-if="this.orderAfterSale.orderAfterSaleStatus == 4">
            <!-- 已完成 -->
            <div class="row align-center justity-between">
                <div class="col flex1 lefter">
                    <el-steps :active="5">
                        <el-step class="word4" title="提交申请" :description="orderAfterSale.createTime"></el-step>
                        <el-step class="word4" title="商户处理" :description="orderAfterSale.examineTime"></el-step>
                        <el-step class="word2" title="退款" :description="orderAfterSale.refundTime"></el-step>
                        <el-step class="word5" title="系统处理中" :description="orderAfterSale.refundTime"></el-step>
                        <el-step class="word2" title="完成" :description="orderAfterSale.refundTime"></el-step>
                    </el-steps>
                </div>
                <div class="col righter">
                    <p>已完成</p>
                    <p class="des">商户退款完成</p>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
export default {
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
        },
        sendGoods() {
            this.$router.push('/order/orderAfterDeliverGoods?id=' + this.orderAfterSale.id)
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