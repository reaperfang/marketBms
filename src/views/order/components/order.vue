<template>
    <div class="order">
        <div class="order-header">
            <div class="item goods">
                <div class="row justify-between">
                    <div class="col">商品信息</div>
                    <div class="col" style="margin-right: 26px;">数量</div>
                </div>
            </div>
            <div class="item" style="width: 120px; margin-right: 16px;">应收金额</div>
            <div class="item" style="width: 120px; margin-right: 75px;">收货人及联系方式</div>
            <div class="item" :class="{'item-storew': storeMark}">配送方式</div>
            <div class="item">状态</div>
            <div class="item">操作</div>
        </div>
        <div v-if="list.length" class="order-container" v-loading="loading">
            <div class="container-item"  v-for="(order, index) in list" :key="index">
                <div class="container-item-header">
                    <div class="item">
                        <el-checkbox v-if="!authHide" @change="checkedChange" v-model="order.checked"></el-checkbox>
                        <span class="order-code">
                            <el-tooltip v-if="order.sendType == 2" content="自动发货" placement="bottom" effect="dark">
                                <i class="auto"></i>
                            </el-tooltip>
                            <el-tooltip v-if="order.isUrge == 0" content="用户催发货，请尽快发货" placement="bottom" effect="dark">
                                <i class="urge"></i>
                            </el-tooltip>
                            <span class="deliveryWay-icon">{{order.deliveryWayIcon}}</span>
                            <span class="order-code-inner">订单编号：{{order.code}}</span>
                            <span class="createTime">下单时间：{{order.createTime}}</span>
                        </span>
                    </div>
                    <div class="item righter">
                        <span>订单类型：{{order.orderType | orderTypeFilter}}</span>
                        <span><i v-if="order.memberLevelImg" class="memberLevelImg" :style="{background: `url(${order.memberLevelImg})`}"></i>用户昵称：<span class="pointer" :title="order.memberName">{{order.memberName | memberNameFilter}}</span></span>
                        <span>订单来源：{{order.channelName}}</span>
                        <!-- <i v-permission="['订单', '订单查询', '商城订单', '删除订单']" @click="closeOrder(order.id)" v-if="order.orderStatus == 2" class="el-icon-delete"></i> -->
                    </div>
                </div>
                <div class="container-item-content" :class="{deliveryWay3: order.deliveryWay == 3}">
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
                                                <p :title="goods.goodsName" class="ellipsis" style="width: 250px;">{{goods.goodsName}}</p>
                                                <p class="goods-specs">{{goods.goodsSpecs | goodsSpecsFilter}}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col goodsCount" style="margin-right: 26px;">
                                        {{goods.goodsCount}}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="item" style="width: 87px; margin-right: 65px; text-align: right;">
                        <!-- <p class="pay-amount">实收：¥{{order.actualMoney}}</p>
                        <p class="payment-mode">{{order.channelName}}支付</p> -->
                        <!-- <p>¥{{order | yingshowFilter}}</p> -->
                        <p style="margin-left: 0;">¥{{order.receivableMoney}}</p>
                        <!-- <p>{{order.channelName}}支付</p> -->
                    </div>
                    <div class="item" style="width: 120px; margin-right: 75px;">
                        <p>{{order.receivedName}}</p>
                        <p>{{order.receivedPhone}}</p>
                    </div>
                    <div class="item" :class="{'item-storew': storeMark, 'item-indent': storeMark && order.deliveryWay == 1, deliveryWay3: order.deliveryWay == 3}">
                        <span class="icon-store" v-if="storeMark  && order.deliveryWay == 2"></span><span class="icon-store-text">{{order | deliveryWayFilter}}</span>
                        <div class="store-time" v-if="storeMark && order.deliveryWay == 2">
                            <p>{{order.deliveryDate | formatDateRemoveZero}}</p>
                            <p>{{order.deliveryTime}}</p>
                        </div>
                    </div>
                    <div class="item">{{order.orderStatus | orderStatusFilter}}</div>
                    <div class="item operate">
                        <template v-if="order.orderStatus == 0">
                            <!-- 待付款 -->
                            <p v-permission="['订单', '订单查询', '商城订单', '查看详情']" @click="$router.push('/order/orderDetail?id=' + order.id)">查看详情</p>
                            <p v-permission="['订单', '订单查询', '商城订单', '订单改价']" @click="$router.push('/order/orderDetail?id=' + order.id)">订单改价</p>
                            <p v-permission="['订单', '订单查询', '商城订单', '关闭订单']" @click="currentDialog = 'CloseOrderDialog'; currentData = order; dialogVisible = true">关闭订单</p>
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
                            <p v-if="!authHide" v-permission="['订单', '订单查询', '商城订单', '发货']" @click="$router.push(`/order/deliverGoods?orderType=order&sendType=one&ids=${order.id}`)">发货</p>
                            <p v-if="!authHide" v-permission="['订单', '订单查询', '商城订单', '关闭订单']" @click="currentDialog = 'CloseOrderDialog'; currentData = order; dialogVisible = true">关闭订单</p>
                        </template>
                        <template v-else-if="order.orderStatus == 4">
                            <!-- 部分发货 -->
                            <p v-permission="['订单', '订单查询', '商城订单', '查看详情']" @click="$router.push('/order/orderDetail?id=' + order.id)">查看详情</p>
                            <p v-if="!authHide" v-permission="['订单', '订单查询', '商城订单', '继续发货']" @click="$router.push(`/order/deliverGoods?orderType=order&sendType=one&ids=${order.id}`)">继续发货</p>
                            <p v-permission="['订单', '订单查询', '商城订单', '发货信息']" @click="$router.push('/order/orderDetail?id=' + order.id + '&tab=2')">发货信息</p>
                            <!-- <p v-if="!authHide" v-permission="['订单', '订单查询', '商城订单', '提前关闭订单']" @click="currentDialog = 'CloseOrderDialog'; currentData = order.id; dialogVisible = true">提前关闭订单</p> -->
                        </template>
                        <template v-else-if="order.orderStatus == 5">
                            <!-- 待收货 -->
                            <p v-permission="['订单', '订单查询', '商城订单', '查看详情']" @click="$router.push('/order/orderDetail?id=' + order.id)">查看详情</p>
                            <p v-permission="['订单', '订单查询', '商城订单', '发货信息']" @click="$router.push('/order/orderDetail?id=' + order.id + '&tab=2')">发货信息</p>
                            <p v-show="!authHide" v-permission="['订单', '订单查询', '商城订单', '补填物流']" v-if="order.isFillUp == 1" @click="$router.push('/order/supplementaryLogistics?id=' + order.id)">补填物流</p>
                            <!-- 第三方配送的异常订单 -->
                            <p v-if="order.deliveryWay== 3 && (!!order.isAbnormal)" @click="sendOrderAgain(order)">重新发单</p>
                            <p v-if="order.deliveryWay== 3 &&(!!order.isAbnormal)" @click="currentDialog = 'CloseOrderDialog'; currentData = order; dialogVisible = true">关闭订单</p>

                            <p v-if="order.deliveryWay== 4" @click="currentDialog = 'VerificationDialog'; currentData = order.id; dialogVisible = true">核销验证</p>
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
        <Empty v-else></Empty>
        <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @submit="submit" :data='currentData'></component>
    </div>
</template>
<script>
import CloseOrderDialog from '@/views/order/dialogs/closeOrderDialog'
import VerificationDialog from '@/views/order/dialogs/verificationDialog'
import anotherAuth from '@/mixins/anotherAuth'
import Empty from '@/components/Empty'
import CloseThirdPartyOrderDialog from "@/views/order/dialogs/closeThirdPartyOrderDialog";


export default {
    mixins: [anotherAuth],
    data() {
        return {
            orderList: [
                
            ],
            currentDialog: '',
            currentData: '',
            dialogVisible: false,
            loading: false,
            storeMark: false, //商家配送标记，如果列表中包含商家配送，则为true, 为了让配送方式标题宽度变宽
            clicked: false
        }
    },
    created() {
        
    },
    watch: {
        list: {
            deep: true,
            handler(newVal, objVal) {
                newVal.forEach(item=>{
                    switch(item.deliveryWay) {
                        case 1:
                            item.deliveryWayIcon = "普快"
                            break;
                        case 2:
                             item.deliveryWayIcon = "商配"
                            break;
                        case 3:
                            if(item.orderStatus==5||item.orderStatus==6){
                                if(item.thirdType==1){
                                    item.deliveryWayIcon = "达达"
                                }else if(!order.thirdType){
                                    item.deliveryWayIcon ="三方"
                                }
                            }else{
                                item.deliveryWayIcon = "三方"
                            }
                            break;
                        case 4:
                            item.deliveryWayIcon = "自提"
                            break;
                    }
                })
                //如果当前列表中包含商家配送方式，则配送方式标题需要加宽
                if(newVal.some(item => item.deliveryWay == 2)){
                    this.storeMark = true;
                }
            }
        }
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
                // case 5:
                //wyyfx删除     return '分销订单'
            }
        },
        deliveryWayFilter(order) {
            switch(order.deliveryWay) {
                case 1:
                    return '普通快递'
                case 2:
                    return '商家配送'
                case 3:
                    if(order.orderStatus==5||order.orderStatus == 6){
                        if(order.thirdType==1){
                            return '第三方配送-达达'
                        }else if(!order.thirdType){
                            return "第三方配送"
                    }
                    }else{
                        return '第三方配送'
                    }
                case 4:
                    return '上门自提'
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
                    str += i + '：'
                    str += _value[i] + '；'
                }
            }

            str = str.replace(/^(.*)\，$/, '$1')

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
        },
        yingshowFilter(orderInfo) {
            let consumeBalanceMoney
            let consumeScoreConvertMoney
            let actualMoney
            let receivableMoney
            let total
            let yingshow

            consumeBalanceMoney = typeof orderInfo.consumeBalanceMoney == 'string' ? parseFloat(orderInfo.consumeBalanceMoney) : orderInfo.consumeBalanceMoney
            consumeScoreConvertMoney = typeof orderInfo.consumeScoreConvertMoney == 'string' ? parseFloat(orderInfo.consumeScoreConvertMoney) : orderInfo.consumeScoreConvertMoney
            actualMoney = typeof orderInfo.actualMoney == 'string' ? parseFloat(orderInfo.actualMoney) : orderInfo.actualMoney
            receivableMoney = typeof orderInfo.receivableMoney == 'string' ? parseFloat(orderInfo.receivableMoney) : orderInfo.receivableMoney

            if(orderInfo.orderStatus == 3) {
                if(orderInfo.payWay == 2) {
                    total = consumeBalanceMoney + consumeScoreConvertMoney + receivableMoney
                    total = total.toFixed(2)
                    yingshow = total
                } else {
                    total = consumeBalanceMoney + consumeScoreConvertMoney + actualMoney
                    total = total.toFixed(2)
                    yingshow = total
                }
            } else {
                total = consumeBalanceMoney + consumeScoreConvertMoney + receivableMoney
                total = total.toFixed(2)
                yingshow = total
            }

            return yingshow
        },
        memberNameFilter(value) {
            let getStr = function(val) {
                var len = 0;
                var str = '';

                for (var i = 0; i < val.length; i++) {
                    var length = val.charCodeAt(i);

                    if(length>=0&&length<=128) {
                        if(len < 12) {
                            len += 1;
                            str += val[i]
                        } else {
                            if(i == val.length - 1) {
                                str += '...'
                            }
                            break
                        }
                    }
                    else {
                        if(len < 11) {
                            len += 2;
                            str += val[i]
                        } else {
                            if(i == val.length - 1) {
                                str += '...'
                            }
                            break
                        }
                    }
                }
                return str;
            } 

            if(value) {
                return getStr(value)
            }
        }
    },
    methods: {
        closeOrder(id) {
            this._apis.order.deleteOrder({id, deleteFlag: 0}).then((res) => {
                this.$message.success('删除成功！');
            }).catch(error => {
                this.$message.error(error);
            })
        },
        closeThirdOrder(){
            this.currentDialog = 'CloseOrderDialog'
            this.dialogVisible = true
        },
        sendOrderAgain(order){
            if(!this.clicked) {
                this.clicked = true
                this._apis.order.reOrder({cid:order.cid,orderId:order.id})
                .then(res=>{
                    this.$emit('getList');
                    this.$message.success('重新发单成功');
                }).catch(error=>{
                    this.$message.error('重新发单失败，请再次重新发单');
                    this.clicked = false
                })
            }
        },
        submit(value) {
            let orderId = "";
            if(Object.prototype.toString.call(this.currentData)=="[object Object]"){
                orderId=this.currentData.id;
            }else{
                orderId=this.currentData;
            }
            this._apis.order.orderClose({...value, id: orderId}).then((res) => {
                this.$emit('getList')
                this.visible = false
                this.$message.success('关闭成功！');
            }).catch(error => {
                this.visible = false
                this.$message.error(error);
            })
        },
        makeCollections(order) {
           this.confirm({title: '确认收款提示', icon: true, text: `确定收款后无法撤销，您要确认收款吗？`}).then(() => {
                this._apis.order.makeCollections({id: order.id, payWay: 4}).then((res) => {
                    this.$emit('getList')
                    this.visible = false
                    this.$message.success('收款成功！');
                }).catch(error => {
                    this.visible = false
                    this.$message.error(error);
                })
            }) 
        },
        checkedChange() {
            let len = this.list.filter(val => val.checked).length
            let list = this.list.filter(val => val.checked)
            this._globalEvent.$emit('checkedLength', len)
            this._globalEvent.$emit('checkedList', list)
        }
    },
    props: {
        list: {
            type: Array
        },
    },
    components: {
        CloseOrderDialog,
        VerificationDialog,
        Empty,
        CloseThirdPartyOrderDialog
    }
}
</script>
<style lang="scss" scoped>
    .order {
        .order-header {
            display: flex;
            min-width: 1000px;
            color:#44434B;
            padding: 12px 0;
            padding-top: 17px;
            height: 46px;
            background:rgba(208,214,228,.2);
            font-weight:bold;
            .item {
                width: 80px;
                margin-right: 30px;
                &:last-child {
                    margin-right: 0;
                }
                &.goods {
                    flex: 1;
                    .row {
                        .col:first-child {
                            padding-left: 69px;
                        }
                    }
                }
            }
        }
        .order-container {
            margin-top: 20px;
            width: 100%;
            min-width: 1000px;
            overflow-x: auto;
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
                border: 1px solid #D0D6E4;
                border-radius:10px;
                margin-bottom: 20px;
                min-width: 1108px;
                .container-item-header {
                    display: flex;
                    justify-content: space-between;
                    background:rgba(208,214,228,.2);
                    height: 50px;
                    padding: 0 20px;
                    padding-right: 8px;
                    color:#44434B;
                    font-weight:400;
                    border-radius: 10px 10px 0 0;
                    .deliveryWay-icon{
                        display:inline-block;
                        width:32px;
                        height:18px;
                        background:rgba(230,230,250,1);
                        border-radius:3px;  
                        line-height:18px;
                        text-align: center;
                        font-size:12px;
                        font-weight:500;
                        color:rgba(101,94,255,1);
                        margin-left:-10px;
                        margin-right:5px;
                    }
                    .order-code {
                       .order-code-inner {
                           padding-right: 12px;
                           border-right: 1px solid rgba(218,218,227,1);
                       } 
                       .createTime {
                           padding-left: 12px;
                       }
                    }
                    .righter {
                        >span {
                            padding-left: 12px;
                            padding-right: 12px;
                            &:nth-child(1) {
                                border-right: 1px solid #dadae3;
                            }
                            &:nth-child(2) {
                                border-right: 1px solid #dadae3;
                            }
                        }
                    }
                    .item {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
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
                    &.deliveryWay3 {
                        >.item {
                            &:nth-child(2) {
                                margin-right: 72px!important;
                            }
                            &:nth-child(3) {
                                margin-right: 65px!important;
                            }
                            &:nth-child(4) {
                                margin-right: 17px;
                            }
                            .goods-box {
                                .goodsCount {
                                    margin-right: -1px!important;
                                }
                            }
                        }
                    }
                    >.item {
                        width: 80px;
                        margin-right: 27px;
                        &.deliveryWay3 {
                            width: 98px;
                        }
                        &:nth-child(2) {
                            padding-left: 5px;
                            p {
                                margin-left: 16px;
                            }
                        }
                        &:nth-child(3) {
                            text-align: center;
                            padding-left: 32px;
                        }
                        &:nth-child(4) {
                            padding-left: 23px;
                        }
                        &:nth-child(5) {
                            padding-left: 22px;
                        }
                        &:nth-child(6) {
                            padding-left: 19px;
                        }
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
                                .goodsCount {
                                    margin-right: -1px!important;
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
            .container-item:last-child {
                margin-bottom: 10px;
            }
        }
        .item-storew{
            width: 108px !important;
        }
        .icon-store{
            display: inline-block;
            width: 16px;
            height: 15px;
            margin-right: 5px;
            vertical-align: middle;
            background: url(~@/assets/images/order/icon_store.png) no-repeat;
        }
        .icon-store-text{
            vertical-align: middle;
        }
        .store-time{
            padding-top: 5px;
            font-size: 12px;
            color: #9FA29F;
        }
        .item-indent{
            text-indent: 0px;
        }
    }
    .order-code {
        margin-left: 5px;
    }
    .memberLevelImg {
        display: inline-block;
        width: 14px;
        height: 13px;
        margin-right: 5px;
    }
    @media (max-width: 1440px) {
    .container-item {
        min-width: auto!important;
    }
    .goods-specs{
        width:200px !important;
    }
    .goods-box .col:first-child {
        width: 100%!important;
    }
    }
    .order-code {
        align-items: center;
        display: inline-flex;
        justify-content: center;
        .auto {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url(../../../assets/images/order/auto.png) no-repeat;
            background-size: 100% 100%;
            position: relative;
            margin-right: 15px;
        }
        .urge {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url(../../../assets/images/order/urge.png) no-repeat;
            background-size: 100% 100%;
            margin-right: 20px;
        }
    }
</style>


