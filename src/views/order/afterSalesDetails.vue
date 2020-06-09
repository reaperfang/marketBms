<template>
    <div class="after-sales-details">
        <div class="header">
            <el-row>
                <el-col :span="12">
                    <span>售后单编号：{{orderAfterSale.code}}</span>
                    <span>【{{orderAfterSale.type | typeFilter}}】</span>
                </el-col>
                <el-col class="header-righter" :span="12">
                    <span>用户昵称：{{orderAfterSale.memberName}}</span>
                    <span>用户ID：{{orderAfterSale.memberSn}}</span>
                </el-col>
            </el-row>
        </div>
        <section class="flow-path">
            <afterSalesState :orderAfterSale="orderAfterSale" @auth="auth" @reject="reject" @confirmTakeOver="confirmTakeOver" @getDetail="onGetDetail"></afterSalesState>
        </section>
        <section class="container">
            <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-permission="['订单', '售后详情', '售后信息']" label="售后信息" name="afterSalesInformation"></el-tab-pane>
                <el-tab-pane v-if="orderAfterSale.type != 3 && (orderAfterSale.returnExpressNo || orderAfterSaleSendInfo.expressNos || orderAfterSale.deliveryWay == 2 || orderAfterSaleSendInfo.distributorPhone)" v-permission="['订单', '售后详情', '发货信息']" label="发货信息" name="aftermarketDeliveryInformation"></el-tab-pane>
            </el-tabs>
        </section>
        <component @submit="onSubmit" :is="currentView" :recordList="recordList" :orderAfterSale="orderAfterSale" :catchOrderAfterSale="catchOrderAfterSale" :orderAfterSaleSendInfo="orderAfterSaleSendInfo" :itemList="itemList" :sendItemList="sendItemList" :orderType="orderType" :catchRealReturnWalletMoney="catchRealReturnWalletMoney" :catchRealReturnBalance="catchRealReturnBalance" :orderSendInfo="orderSendInfo"></component>
        <component :is="currentDialog" :data="currentData" :dialogVisible.sync="dialogVisible" @reject="onReject" title="审核"></component>
    </div>
</template>
<script>
import AfterSalesInformation from './components/afterSalesInformation'
import AftermarketDeliveryInformation from './components/aftermarketDeliveryInformation'
import AfterSalesState from './components/afterSalesState'
import RejectDialog from '@/views/order/dialogs/rejectDialog'
import ExchangeGoodsDialog from '@/views/order/dialogs/exchangeGoodsDialog'

export default {
    data() {
        return {
            activeName: 'afterSalesInformation',
            currentView: 'afterSalesInformation',
            itemList: [],
            orderAfterSale: {},
            catchOrderAfterSale: {},
            orderAfterSaleSendInfo: {},
            recordList: [],
            sendItemList: [],
            currentDialog: '',
            dialogVisible: false,
            orderType: '',
            catchRealReturnWalletMoney: '',
            catchRealReturnBalance: '',
            orderSendInfo: '',
            currentData: {}
        }
    },
    created() {
        this.getDetail()
    },
    filters: {
        typeFilter(code) {
            if(code == 1) {
                return '退货退款'
            } else  if(code == 2) {
                return '换货'
            } else if(code == 3) {
                return '仅退款'
            }
        }
    },
    methods: {
        onSubmit() {
            this.getDetail()
        },
        onGetDetail() {
            this.getDetail()
        },
        confirmTakeOver() {
            this._apis.order.orderConfirmReceived({id: this.orderAfterSale.id, isSellerReceived: 1}).then(res => {
                //this.$message.success('确认收货成功');
                this.confirm({title: '提示', iconSuccess: true, text: '确认收货成功', showCancelButton: false, confirmText: '我知道了'}).then(() => {
                    
                })
                this.getDetail()
            }).catch(error => {
                this.$message.error(error);
            }) 
        },
        reject() {
            this.currentDialog = 'RejectDialog'
            this.dialogVisible = true
        },
        onReject(value) {
            this._apis.order.orderAfterSaleUpdateStatus({
                id: this.orderAfterSale.id,
                refuseReason: value,
                orderAfterSaleStatus: 5
            }).then((res) => {
                this.getDetail()
                this.visible = false
                this.$message.success('拒绝审核成功！');
            }).catch(error => {
                this.visible = false
                this.$message.error(error);
            })
        },
        auth() {
            let orderAfterSaleStatus

            if(this.orderAfterSale.type == 3) {
                orderAfterSaleStatus = 2
            } else {
                orderAfterSaleStatus = 1
            }

            if(this.orderAfterSale.type == 2) {
                // 换货确认
                let _orderAfterSale = JSON.parse(JSON.stringify(this.orderAfterSale))

                this.currentDialog = 'ExchangeGoodsDialog'
                this.currentData = _orderAfterSale
                this.currentData.orderAfterSaleStatus = orderAfterSaleStatus;
                this.dialogVisible = true
                return
            }
            let params = {
                id: this.orderAfterSale.id,
                //realReturnScore: this.orderAfterSale.realReturnScore,
                //realReturnMoney: this.orderAfterSale.realReturnMoney,
                //realReturnBalance: this.orderAfterSale.realReturnBalance,
                //realReturnWalletMoney: this.orderAfterSale.realReturnWalletMoney,
                orderAfterSaleStatus: orderAfterSaleStatus
            }

            // if(this.orderAfterSale.realReturnMoney != this.orderAfterSale.shouldReturnMoney) {
            //     params.realReturnMoney = this.orderAfterSale.realReturnMoney
            // }
            this._apis.order.orderAfterSaleUpdateStatus(params).then((res) => {
                this.getDetail()
                this.visible = false
                this.$message.success('审核成功！');
            }).catch(error => {
                this.visible = false
                this.$message.error(error);
            })
        },
        getDetail() {
            this._apis.order.getOrderAfterSaleDetail({id: this.$route.query.id}).then((res) => {

                this.itemList = res.itemList
                if(res.orderAfterSale && res.orderAfterSale.descriptionImages) {
                    res.orderAfterSale.descriptionImages = res.orderAfterSale.descriptionImages ? res.orderAfterSale.descriptionImages.split(',').map(val => ({
                        image: val,
                        over: false
                    })) : []
                }
                this.orderAfterSale = res.orderAfterSale || {}
                this.orderAfterSaleSendInfo = res.orderAfterSaleSendInfo || {}
                this.recordList = res.recordList.filter(val => val.operationType != 1 && val.operationType != 2 && val.operationType != 5 && val.operationType != 8)
                this.sendItemList = res.sendItemList
                this.orderType = res.orderType
                this.catchRealReturnWalletMoney = this.orderAfterSale.realReturnWalletMoney
                this.catchRealReturnBalance = this.orderAfterSale.realReturnBalance
                //this.orderAfterSale.realReturnScore = this.orderAfterSale.shouldReturnScore || 0
                this.orderSendInfo = res.orderSendInfo
                this.catchOrderAfterSale = JSON.parse(JSON.stringify(res.orderAfterSale))
            }).catch(error => {
                this.visible = false
                this.$message.error(error);
            })
        },
        handleClick(tab, event) {
            this.currentView = this.activeName
        }
    },
    components: {
        AfterSalesInformation,
        AftermarketDeliveryInformation,
        AfterSalesState,
        RejectDialog,
        ExchangeGoodsDialog
    }   
}
</script>
<style lang="scss" scoped>
    .after-sales-details {
        color: $contentColor;
        .header {
            height: 60px;
            line-height: 60px;
            background-color: #fff;
            padding: 0 20px;
            .header-righter {
                text-align: right;
                color: #b8b8bb;
                span {
                    &:first-child {
                        margin-right: 20px;
                    }
                }
            }
        }

        section {
            background-color: #fff;
            padding: 20px 40px;
            margin-top: 20px;
            &.container {
                padding-top: 0;
            }
            .row {
                margin: 10px 0;
            }
            .section-header {
                margin: 20px 0;
                color: #161617;
                font-size: 16px;
            }
            &.flow-path {
                margin-top: 20px;
            }
            &.information {
                margin-top: 20px;
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
    }
    .tabs {
        margin-top: 20px;
    }
    /deep/ .el-tabs__nav-scroll {
        background-color: #fff;
    }
    /deep/ .el-tabs__header {
        margin-bottom: 0;
    }
</style>


