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
                <span class="member-name">用户昵称：{{orderDetail.orderInfo.memberName}}</span>
                <span class="member-sn">用户ID：{{orderDetail.orderInfo.memberSn}}</span>
            </div>
        </div>
        <orderState :orderInfo="orderDetail.orderInfo" :orderSendInfo="orderDetail.orderSendInfo" :orderState="orderDetail.orderInfo.orderStatus" :payWay="orderDetail.orderInfo.payWay" :closeReaosn="orderDetail.orderInfo.closeReaosn" @orderStatusSuccess="getDetail" class="order-state"></orderState>
        <div class="message">
            <el-tabs v-model="activeName">
                <el-tab-pane label="订单信息" name="order">
                    <orderInformation :orderInfo="orderDetail.orderInfo" :orderDetail="orderDetail" @getDetail="getDetail"></orderInformation>
                </el-tab-pane>
                <el-tab-pane v-if="orderDetail.orderSendItemMap && Object.keys(orderDetail.orderSendItemMap).length" label="发货信息" name="delivery">
                    <deliveryInformation :orderDetail="orderDetail"></deliveryInformation>
                </el-tab-pane>
                 <!-- <el-tab-pane v-if="resellConfigInfo && orderDetail.resellerInfoList && orderDetail.resellerInfoList.length" label="分销信息" name="commision">
                    <OrderCommision :orderDetail="orderDetail" @getDetail="getDetail"></OrderCommision>
                </el-tab-pane> -->
            </el-tabs>
        </div>
        <div class="operate-record">
            <p class="header">操作记录</p>
            <el-table
                :data="orderDetail.orderOperationRecordList"
                style="width: 100%"
                :header-cell-style="{background:'#F6F7FA', color:'#44434B'}">
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        {{scope.row.operationType | operationTypeFilter}}
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
        </div>
        
        <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData"></component>
    </div>
</template>
<script>
import OrderState from './components/orderState'
import OrderInformation from './components/orderInformation'
import OrderCommision from './components/orderCommision'
import OrderOperate from './components/orderOperate'
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
            changePriceVisible: false,
            resellConfigInfo: null
        }
    },
    created() {
        this.getDetail().then(() => {
            if(this.$route.query.tab == 2) {
                this.activeName = 'delivery'
            }
        })

        // 获取分销商设置
        this.$store.dispatch('getShopInfo').then( data => {
            if(data.isOpenResell == 1) this.resellConfigInfo = data.resellConfigInfo ? JSON.parse(data.resellConfigInfo) : null;
        }).catch((error) => {
            console.error(error);
        });
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
                    return '库存不足'
                case 8:
                    return '提前关闭订单'
                case 9:
                    return '商户备注'
                case 10:
                    return '修改收货信息'
                case 11:
                    return '自动发货'
                case 12:
                    return '核销验证'
                case 13:
                    return '重新发单'
                case 14:
                    return '自动发单'
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
                case '5': 
                    return '分销订单'
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
    beforeRouteEnter(to, from, next) {
        next(vm => {
          vm.$nextTick(() => {
            document.querySelector('.content-main').scrollTop = 0
          })
        });
    },
    methods: {
        sendGoods() {
            // console.log('sendGoods')
        },
        reducePriceHandler() {
            this._apis.order.orderPriceChange({id: this.orderDetail.orderInfo.id, 
            consultType: this.goodsListMessage.consultType, consultMoney: this.goodsListMessage.consultMoney}).then(res => {
                this.changePriceVisible = false
                this.$message.success('添加成功！');
                this.getDetail()
            }).catch(error => {
                this.changePriceVisible = false
                this.$message.error(error);
            }) 
        },
        getDetail() {
            return new Promise((resolve, reject) => {
                let id = this.$route.query.id
                this._apis.order.fetchOrderDetail({id}).then((res) => {
                    res.orderInfo && (res.orderInfo.consultType = res.orderInfo.consultType || 2)
                    this.orderDetail = res
                    // console.log(typeof res)
                    resolve(res)
                }).catch(error => {
                    this.$message.error(error);
                    reject(error)
                })
            })
        }
    },
    components: {
        OrderState,
        OrderInformation,
        CouponDialog,
        DeliveryInformation,
        OrderCommision,
        OrderOperate
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
            border-radius: 4px;
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
            border-radius: 4px;
        }
        .goods-detail {
            display: flex;
            align-items: center;
        }
        .goods-list, .operate-record {
            background-color: #fff;
            margin-top: 20px;
            padding: 20px;
            border-radius: 4px;
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
            .header {
                padding-left: 0;
            }
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
    .member-name {
        margin-right: 20px;
        color: #b6b6b9;
    }
    /deep/ .el-table tr th {
        border-bottom: none;
    }
    /deep/ .operate-record .el-table td, /deep/ .operate-record .el-table th {
        text-align: center;
        &:nth-child(1) {
            text-align: left;
        }
        &:nth-child(3) {
            text-align: right;
        }
    }
    /deep/ .operate-record .el-table th {
        &:nth-child(3) {
            padding-right: 50px;
        }
    }
</style>


