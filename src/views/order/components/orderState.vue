<template>
    <div class="order-state">
        <template v-if="payWay == 2">
            <!-- 货到付款 -->
            <template v-if="orderState == 0">
                <!-- 待付款 -->
                <div class="item lefter">
                    <el-steps :active="1">
                        <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="货到付款" description=""></el-step>
                        <el-step :title="merchantType" description=""></el-step>
                        <el-step :title="userType" description=""></el-step> 
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
                    <el-steps :active="3">
                        <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="用户付款" description=""></el-step>
                        <el-step :title="merchantType" description=""></el-step>
                        <el-step :title="userType" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>拼团中</p>
                </div>
            </template>
            <template v-else-if="orderState == 2">
                <!-- 关闭 -->
                <div class="item lefter">
                    <el-steps :active="active">
                        <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="订单关闭" :description="orderInfo.closeTime"></el-step>
                        <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>已关闭</p>
                    <p>{{orderInfo | closeReaosnFilter}}</p>
                </div>
            </template>
            <template v-else-if="orderState == 3">
                <!-- 待发货 -->
                <div class="item lefter">
                    <el-steps :active="3">
                        <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="货到付款" description=""></el-step>
                        <el-step :title="merchantType" description=""></el-step>
                        <el-step :title="userType" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>待发货</p>
                    <p>用户选择货到付款，您需要自行安排配送和收款。</p>
                    <div class="button-box">
                        <el-button @click="closeOrder">关闭订单</el-button>
                        <el-button v-if="!authHide" type="primary" @click="sendGoodsHandler">发货</el-button>
                    </div>
                </div>
            </template>
            <template v-else-if="orderState == 4">
                <!-- 部分发货 -->
                <div class="item lefter">
                    <el-steps :active="3">
                        <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="货到付款" description=""></el-step>
                        <el-step :title="merchantType" description=""></el-step>
                        <el-step :title="userType" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>部分发货</p>
                    <div class="button-box">
                        <!--<el-button @click="closeOrder">关闭订单</el-button>-->
                        <el-button v-if="!authHide" type="primary" @click="sendGoodsHandler">发货</el-button>
                    </div>
                </div>
            </template>
            <template v-else-if="orderState == 5">
                <!-- 待收货 -->
                <div class="item lefter">
                    <el-steps :active="4">
                        <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="货到付款" description=""></el-step>
                        <el-step :title="merchantType" :description="orderInfo.sendTime"></el-step>
                        <el-step :title="userType" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>待收货</p>
                    <div v-if="orderInfo.deliveryWay == 4">
                       <el-button class="verifyBtn" @click="currentDialog = 'VerificationDialog'; currentData = orderInfo.id; dialogVisible = true">核销验证</el-button>
                    </div>
                     <!-- 第三方配送且是异常订单时 -->
                    <div class="button-box" v-if="orderInfo.deliveryWay == 3 && !!orderInfo.isAbnormal">
                       <el-button @click="sendOrderAgain(orderInfo)">重新发单</el-button>
                       <el-button @click="closeOrder">关闭订单</el-button>
                    </div>
                </div>
            </template>
            <template v-else-if="orderState == 6">
                <!-- 完成 -->
                <div class="item lefter">
                    <el-steps :active="5">
                        <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="货到付款" :description="orderInfo.createTime"></el-step>
                        <el-step :title="merchantType" :description="orderInfo.sendTime"></el-step>
                         <template v-if="orderInfo.deliveryWay == 4">
                             <el-step title="用户取货" :description="orderInfo.complateTime"></el-step>
                        </template>    
                       <template v-else>
                           <el-step title="用户收货" :description="orderInfo.complateTime"></el-step>
                       </template>
                        <!-- <el-step title="用户收货" :description="orderInfo.complateTime"></el-step> -->
                        <el-step class="close" title="完成" :description="orderInfo.complateTime"></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>已完成</p>
                </div>
            </template>
        </template>
        <template v-else>
            <!-- 线上支付,找人代付 线下支付 -->
            <template v-if="orderState == 0">
                <!-- 待付款 -->
                <div class="item lefter">
                    <el-steps :active="active">
                        <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="用户付款" description=""></el-step>
                        <el-step :title="merchantType" description=""></el-step>
                         <el-step :title="userType" description=""></el-step>
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
                        <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="用户付款" :description="orderInfo.payComplateTime"></el-step>
                        <el-step :title="merchantType" description=""></el-step>
                        <el-step :title="userType" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>拼团中</p>
                </div>
            </template>
            <template v-else-if="orderState == 2">
                <template v-if="orderInfo.closeReason == 0">
                    <!-- 超时取消 -->
                    <div class="item lefter">
                        <el-steps :active="3">
                            <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                            <el-step title="订单关闭" :description="orderInfo.closeTime"></el-step>
                            <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                        </el-steps>
                    </div>
                    <div class="item righter">
                        <p>已关闭</p>
                        <p>{{orderInfo | closeReaosnFilter}}</p>
                    </div>
                </template>
                <template v-else-if="orderInfo.closeReason == 1">
                    <!-- 客户取消 -->
                    <template v-if="orderInfo.payComplateTime">
                        <!-- 客户付款 -->
                        <div class="item lefter">
                            <el-steps :active="4">
                                <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                                <el-step title="用户付款" :description="orderInfo.payComplateTime"></el-step>
                                <el-step title="订单关闭" :description="`用户取消订单${orderInfo.closeTime}`"></el-step>
                                <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                            </el-steps>
                        </div>
                        <div class="item righter">
                            <p>已关闭</p>
                            <p>{{orderInfo | closeReaosnFilter}}</p>
                        </div>
                    </template>
                    <template v-else>
                        <!-- 客户未付款 -->
                        <div class="item lefter">
                            <el-steps :active="3">
                                <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                                <el-step title="订单关闭" :description="`用户取消订单${orderInfo.closeTime}`"></el-step>
                                <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                            </el-steps>
                        </div>
                        <div class="item righter">
                            <p>已关闭</p>
                            <p>{{orderInfo | closeReaosnFilter}}</p>
                        </div>
                    </template>
                </template>
                <template v-else-if="orderInfo.closeReason == 2">
                    <!-- 商户关闭 -->
                    <template v-if="orderInfo.payComplateTime">
                        <!-- 客户付款 -->
                        <div class="item lefter">
                            <el-steps :active="4">
                                <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                                <el-step title="用户付款" :description="orderInfo.payComplateTime"></el-step>
                                <el-step title="订单关闭" :description="`商户关闭订单${orderInfo.closeTime}`"></el-step>
                                <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                            </el-steps>
                        </div>
                        <div class="item righter">
                            <p>已关闭</p>
                            <p>{{orderInfo | closeReaosnFilter}}</p>
                        </div>
                    </template>
                    <template v-else>
                        <!-- 客户未付款 -->
                        <div class="item lefter">
                            <el-steps :active="3">
                                <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                                <el-step title="订单关闭" :description="`商户关闭订单${orderInfo.closeTime}`"></el-step>
                                <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                            </el-steps>
                        </div>
                        <div class="item righter">
                            <p>已关闭</p>
                            <p>{{orderInfo | closeReaosnFilter}}</p>
                        </div>
                    </template>
                </template>
                <template v-else-if="orderInfo.closeReason == 6">
                    <!-- 商户关闭 库存不足 -->
                    <template v-if="orderInfo.payComplateTime">
                        <!-- 客户付款 -->
                        <div class="item lefter">
                            <el-steps :active="4">
                                <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                                <el-step title="用户付款" :description="orderInfo.payComplateTime"></el-step>
                                <el-step title="订单关闭" :description="`商户关闭订单${orderInfo.closeTime}`"></el-step>
                                <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                            </el-steps>
                        </div>
                        <div class="item righter">
                            <p>已关闭</p>
                            <p>{{orderInfo | closeReaosnFilter}}</p>
                        </div>
                    </template>
                    <template v-else>
                        <!-- 客户未付款 -->
                        <div class="item lefter">
                            <el-steps :active="3">
                                <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                                <el-step title="订单关闭" :description="`商户关闭订单${orderInfo.closeTime}`"></el-step>
                                <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                            </el-steps>
                        </div>
                        <div class="item righter">
                            <p>已关闭</p>
                            <p>{{orderInfo | closeReaosnFilter}}</p>
                        </div>
                    </template>
                </template>
                <template v-else-if="orderInfo.closeReason == 7">
                    <!-- 商户关闭 用户申请关闭 -->
                    <template v-if="orderInfo.payComplateTime">
                        <!-- 客户付款 -->
                        <div class="item lefter">
                            <el-steps :active="4">
                                <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                                <el-step title="用户付款" :description="orderInfo.payComplateTime"></el-step>
                                <el-step title="订单关闭" :description="`商户关闭订单${orderInfo.closeTime}`"></el-step>
                                <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                            </el-steps>
                        </div>
                        <div class="item righter">
                            <p>已关闭</p>
                            <p>{{orderInfo | closeReaosnFilter}}</p>
                        </div>
                    </template>
                    <template v-else>
                        <!-- 客户未付款 -->
                        <div class="item lefter">
                            <el-steps :active="3">
                                <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                                <el-step title="订单关闭" :description="`商户关闭订单${orderInfo.closeTime}`"></el-step>
                                <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                            </el-steps>
                        </div>
                        <div class="item righter">
                            <p>已关闭</p>
                            <p>{{orderInfo | closeReaosnFilter}}</p>
                        </div>
                    </template>
                </template>
                <template v-else-if="orderInfo.closeReason == 8">
                    <!-- 商户关闭 其他 -->
                    <template v-if="orderInfo.payComplateTime">
                        <!-- 客户付款 -->
                        <div class="item lefter">
                            <el-steps :active="4">
                                <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                                <el-step title="用户付款" :description="orderInfo.payComplateTime"></el-step>
                                <el-step title="订单关闭" :description="`商户关闭订单${orderInfo.closeTime}`"></el-step>
                                <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                            </el-steps>
                        </div>
                        <div class="item righter">
                            <p>已关闭</p>
                            <p>{{orderInfo | closeReaosnFilter}}</p>
                        </div>
                    </template>
                    <template v-else>
                        <!-- 客户未付款 -->
                        <div class="item lefter">
                            <el-steps :active="3">
                                <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                                <el-step title="订单关闭" :description="`商户关闭订单${orderInfo.closeTime}`"></el-step>
                                <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                            </el-steps>
                        </div>
                        <div class="item righter">
                            <p>已关闭</p>
                            <p>{{orderInfo | closeReaosnFilter}}</p>
                        </div>
                    </template>
                </template>
                <template v-else-if="orderInfo.closeReason == 3">
                    <!-- 拼团失败 -->
                    <div class="item lefter">
                        <el-steps :active="3">
                            <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                            <el-step title="订单关闭" :description="`拼团活动关闭${orderInfo.closeTime}`"></el-step>
                            <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                        </el-steps>
                    </div>
                    <div class="item righter">
                        <p>已关闭</p>
                        <p>{{orderInfo | closeReaosnFilter}}</p>
                    </div>
                </template>
                <template v-else-if="orderInfo.closeReason == 4">
                    <!-- 商户关闭拼团 -->
                    <div class="item lefter">
                        <el-steps :active="3">
                            <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                            <el-step title="订单关闭" :description="`商户关闭拼团${orderInfo.closeTime}`"></el-step>
                            <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                        </el-steps>
                    </div>
                    <div class="item righter">
                        <p>已关闭</p>
                        <p>{{orderInfo | closeReaosnFilter}}</p>
                    </div>
                </template>
                <template v-else-if="orderInfo.closeReason == 5">
                    <!-- 客户拒收 -->
                    <div class="item lefter">
                        <el-steps :active="5">
                            <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                            <el-step title="用户付款" :description="orderInfo.payComplateTime"></el-step>
                            <el-step title="商户发货" :description="orderInfo.sendTime"></el-step>
                            <el-step title="用户收货" description="用户拒绝签收"></el-step>
                            <el-step class="close" title="结束" :description="orderInfo.closeTime"></el-step>
                        </el-steps>
                    </div>
                    <div class="item righter">
                        <p>已关闭</p>
                        <p>{{orderInfo | closeReaosnFilter}}</p>
                    </div>
                </template>
            </template>
            <template v-else-if="orderState == 3">
                <!-- 待发货 -->
                <div class="item lefter">
                    <el-steps :active="active">
                        <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="用户付款" :description="orderInfo.payComplateTime"></el-step>
                        <template v-if="orderInfo.deliveryWay == 4">
                             <el-step title="商户备货" description="用户已完成付款，请尽快完成备货"></el-step>
                        </template>    
                       <template v-else>
                           <el-step title="商户发货" description="用户已完成付款，请尽快完成发货"></el-step>
                       </template>
                        <!-- <el-step :title="merchantType" description="用户已完成付款，请尽快完成发货"></el-step> -->
                        <el-step :title="userType" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>待发货</p>
                    <div class="button-box">
                        <el-button @click="closeOrder">关闭订单</el-button>
                        <el-button v-if="!authHide" type="primary" @click="sendGoodsHandler">发货</el-button>
                    </div>
                </div>
            </template>
            <template v-else-if="orderState == 4">
                <!-- 部分发货 -->
                <div class="item lefter">
                    <el-steps :active="3">
                        <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="用户付款" :description="orderInfo.payComplateTime"></el-step>
                        <template v-if="orderInfo.deliveryWay == 4">
                             <el-step title="商户备货" description="用户已完成付款，请尽快完成剩余备货"></el-step>
                        </template>    
                       <template v-else>
                           <el-step title="商户发货" description="用户已完成付款，请尽快完成剩余发货"></el-step>
                       </template>
                        <el-step :title="userType" description=""></el-step>
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>部分发货</p>
                    <div class="button-box">
                        <!--<el-button @click="closeOrder">关闭订单</el-button>-->
                        <el-button v-if="!authHide" type="primary" @click="sendGoodsHandler">发货</el-button>
                    </div>
                </div>
            </template>
            <template v-else-if="orderState == 5">
                <!-- 待收货 -->
                <div class="item lefter">
                    <el-steps :active="active">
                        <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="用户付款" :description="orderInfo.payComplateTime"></el-step>
                        <el-step :title="merchantType" :description="orderInfo.sendTime"></el-step>
                        <template v-if="orderInfo.deliveryWay == 4">
                             <el-step title="用户取货" description=""></el-step>
                        </template>    
                       <template v-else>
                           <el-step title="用户收货" description="等待签收"></el-step>
                       </template>
                        <!-- <el-step title="用户收货" description="等待签收"></el-step> -->
                        <el-step class="close" title="完成" description=""></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>待收货</p>
                    <div v-if="orderInfo.deliveryWay == 4">
                       <el-button class="verifyBtn" @click="currentDialog = 'VerificationDialog'; currentData = orderInfo.id; dialogVisible = true">核销验证</el-button>
                    </div>
                    <!-- 第三方配送且是异常订单时 -->
                    <div class="button-box" v-if="orderInfo.deliveryWay == 3 && !!orderInfo.isAbnormal">
                       <el-button @click="sendOrderAgain(orderInfo)">重新发单</el-button>
                       <el-button @click="closeOrder">关闭订单</el-button>
                    </div>
                </div>
            </template>
            <template v-else-if="orderState == 6">
                <!-- 完成 -->
                <div class="item lefter">
                    <el-steps :active="active">
                        <el-step title="用户下单" :description="orderInfo.createTime"></el-step>
                        <el-step title="用户付款" :description="orderInfo.payComplateTime"></el-step>
                        <el-step :title="merchantType" :description="orderInfo.sendTime"></el-step>
                        <el-step :title="userType" :description="orderInfo.complateTime"></el-step>
                        <el-step class="close" title="完成" :description="orderInfo.complateTime"></el-step>
                    </el-steps>
                </div>
                <div class="item righter">
                    <p>已完成</p>
                </div>
            </template>
        </template>
        <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @submit="submit" :data="currentData"></component>
    </div>
</template>
<script>
// sendType 订单类型 ,1普通订单,2拼团订单,3优惠套装订单,4赠品订单
// payWay 付款方式 1线上支付,2货到付款,3找人代付 4线下支付
// orderStatus 订单流程状态：0待付款 1待成团 2关闭 3待发货 4部分发货 5待收货 6完成
// 订单关闭原因: 0超时取消 1客户取消 2商户关闭 3拼团失败 4商户关闭拼团 5客户拒收
import CloseOrderDialog from '@/views/order/dialogs/closeOrderDialog'
import anotherAuth from '@/mixins/anotherAuth'
import VerificationDialog from '@/views/order/dialogs/verificationDialog'
import CloseThirdPartyOrderDialog from "@/views/order/dialogs/closeThirdPartyOrderDialog";

export default {
    mixins: [anotherAuth],
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
        },
        userType(){
            if(this.orderInfo.deliveryWay==4){
                return '用户取货'
            }else{
                return '用户收货'
            }
        },
        merchantType(){
            if(this.orderInfo.deliveryWay==4){
                return '商户备货'
            }else{
                return '商户发货'
            }
        }
    },
    filters: {
        closeReaosnFilter(orderInfo) {
            let code = orderInfo.closeReason
            let closeRemark = orderInfo.closeRemark
            switch(+ code) {
                case 0:
                    return '原因: 超时取消'
                case 1:
                    return `原因: ${closeRemark==''?'其他':closeRemark}`
                case 2:
                    return '原因: 商户关闭'
                case 3:
                    return '原因: 拼团失败'
                case 4:
                    return '原因: 商户关闭拼团'
                case 5:
                    return '原因: 用户拒收'
                case 6:
                    return '原因: 库存不足'
                case 7:
                    return '原因: 用户申请关闭'
                case 8:
                    return `原因: 其他: ${closeRemark}`
            }
        }
    },
    methods: {
        sendGoodsHandler() {
            let _ids = ''

            if(this.$route.query._ids) {
                _ids = this.$route.query._ids
            } else {
                _ids = this.orderSendInfo.id
            }
            this.$router.push(`/order/deliverGoods?id=${this.$route.query.id}&_ids=${_ids}`)
        },
        submit(value) {
            this._apis.order.orderClose({...value, id: this.orderInfo.id}).then((res) => {
                this.$message.success('关闭成功！');
                this.$emit('orderStatusSuccess')
            }).catch(error => {
                this.$message.error(error);
            })
        },
        closeOrder() {
            this.currentDialog = 'CloseOrderDialog'; 
            this.currentData=this.orderInfo
            this.dialogVisible = true
        },
       
        sendOrderAgain(order){
            this._apis.order.reOrder({cid:order.cid,orderId:order.id})
            .then(res=>{
                 this.$emit('orderStatusSuccess');
                 this.$message.success('重新发单成功');
            }).catch(error=>{
                this.$message.error('重新发单失败，请再次重新发单');
            })
            
        },
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
        },
        orderSendInfo: {
            type: Object
        }
    },
    components: {
        CloseOrderDialog,
        VerificationDialog,
        CloseThirdPartyOrderDialog
    }
}
</script>
<style lang="scss" scoped>
    .verifyBtn{
        height:34px;
        background:rgba(101,94,255,1);
        border-radius:4px;
        color:#fff;
        font-size:14px;
        margin-top:20px;
    }
    .order-state {
        background-color: #fff;
        padding: 30px 50px;
        display: flex;
        justify-content: space-between;
        border-radius: 4px;
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


