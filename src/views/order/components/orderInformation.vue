<template>
    <div class="order-information">
        <el-row>
            <el-col :span="8">
                <div class="grid-content lefter">
                    <div class="item">
                        <div class="label">配送方式</div>
                        <div class="value">{{orderInfo.deliveryWay | deliveryWayFilter}}</div>
                    </div>
                    <div class="item">
                        <div class="label">收货信息</div>
                        <div class="value">
                            <p>{{orderInfo.receivedName}} / {{orderInfo.receivedPhone}}</p>
                            <p>{{orderInfo.receivedProvinceName}} {{orderInfo.receivedCityName}} {{orderInfo.receivedAreaName}} {{orderInfo.receivedDetail}}</p>
                        </div>
                    </div>
                    <p v-if="orderInfo.orderStatus != 2 && orderInfo.orderStatus != 4 && orderInfo.orderStatus != 5 && orderInfo.orderStatus != 6" @click="currentDialog = 'ReceiveInformationDialog'; currentData =orderInfo; ajax = true; dialogVisible = true" class="change"><span class="pointer">修改</span></p>
                </div>
            </el-col>
            <el-col :span="8"><div class="grid-content center">
                <div class="item">
                    <div class="label">付款人</div>
                    <div class="value" style="word-break: break-all;">{{payMan || '--'}}</div> <!-- <span v-if="orderDetail.orderPayRecordList" class="blue orderPayRecordList">详情</span> -->
                </div>
                <div class="item">
                    <div class="label">付款方式</div>
                    <div class="value">{{orderInfo.payWay | payWayFilter}}</div>
                </div>
                <div class="item">
                    <div class="label">付款时间</div>
                    <div class="value">{{orderInfo.payComplateTime}}</div>
                </div>
                <div class="item" v-if="orderDetail.orderPayRecordList && orderDetail.orderPayRecordList.filter(val => val.tradeCode).length">
                    <div class="label">交易流水号</div>
                    <div class="value" style="word-break: break-all;">{{orderDetail.orderPayRecordList | tradeCodeFilter}}</div>
                </div>
                <div class="item" v-if="wechatLength && orderInfo.payWay == 1">
                    <div class="label">微信流水号</div>
                    <div class="value" style="word-break: break-all;">{{orderDetail.orderPayRecordList | wechatFilter}}</div>
                </div>
                <div class="item" v-if="wechatLength && orderInfo.payWay != 1">
                    <div class="label">第三方流水号</div>
                    <div class="value" style="word-break: break-all;">{{orderDetail.orderPayRecordList | wechatFilter}}</div>
                </div>
                <div class="item">
                    <div class="label">本单奖励</div>
                    <div class="value gain">
                        <template>
                            <div class="gain-item">
                                <div class="gain-item-lefter">积分：</div>
                                <div class="gain-item-righter">{{rewardScore + ' 分' || '无'}}</div>
                            </div>
                            <div class="gain-item">
                                <div class="gain-item-lefter">赠品：</div>
                                <div class="gain-item-righter">{{gift || '无'}}</div>
                            </div>
                            <div class="gain-item coupon">
                                <div class="gain-item-lefter">优惠券：</div>
                                <div class="gain-item-righter">
                                    <template v-if="couponList && couponList.length">
                                        <div class="coupon-box">
                                            <div v-if="index == 0" class="coupon" v-for="(item, index) in couponList" :key="index">
                                                <div class="item lefter">
                                                    <template v-if="item.appCoupon.useType == 0">
                                                        <p>{{item.appCoupon.useTypeFullcut}}</p>
                                                        <p>元</p>
                                                    </template>
                                                    <template v-else>
                                                        <p>{{item.appCoupon.useTypeDiscount*10}}</p>
                                                        <p>折</p>
                                                    </template>
                                                </div>
                                                <div class="item righter">
                                                    <p>{{item.appCoupon.name}}</p>
                                                    <p class="limit">使用时限:{{item.appCoupon.effectBeginTime | timeFilter}}-{{item.appCoupon.endTime | timeFilter}}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p v-if="couponList && (couponList.length > 1)" class="more"><span @click="moreHandler(1)" class="pointer">查看更多</span></p>
                                    </template>
                                    <template v-else>
                                        无
                                    </template>
                                </div>
                            </div>
                            <div class="gain-item coupon-code">
                                <div class="gain-item-lefter">优惠码：</div>
                                <div class="gain-item-righter">
                                    <template v-if="couponCodeList && couponCodeList.length">
                                        <div class="coupon-box">
                                            <div class="coupon-code" v-for="(item, index) in couponCodeList" :key="index">
                                                <div class="coupon-code-header">优惠码 {{item.couponCode}}</div>
                                                <div class="coupon">
                                                    <div class="item lefter coupon-code-list-lefter">
                                                        <template v-if="item.appCoupon.useType == 0">
                                                            <p>{{item.appCoupon.useTypeFullcut}}</p>
                                                            <p>元</p>
                                                        </template>
                                                        <template v-else>
                                                            <p>{{item.appCoupon.useTypeDiscount*10}}</p>
                                                            <p>折</p>
                                                        </template>
                                                    </div>
                                                    <div class="item righter coupon-code-list-righter">
                                                        <p>{{item.appCoupon.name}}</p>
                                                        <p class="limit">使用时限:{{item.appCoupon.effectBeginTime | timeFilter}}-{{item.appCoupon.endTime | timeFilter}}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p v-if="couponCodeList && (couponCodeList.length > 1)" class="more"><span @click="moreHandler(2)" class="pointer">查看更多</span></p>
                                    </template>
                                    <template v-else>
                                        无
                                    </template>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div></el-col>
            <el-col :span="8"><div class="grid-content righter">
                <div v-if="invoiceOpen == 1"  class="item">
                    <div class="label">发票信息</div>
                    <div class="value">
                        <template v-if="orderInfo.isInvoice == 1">
                            <p>发票类型： {{orderInfo.invoiceType | invoiceTypeFilter}}</p>
                            <p>发票抬头： {{orderInfo.invoiceTitle}}</p>
                            <p v-if="orderInfo.invoiceTaxpayerCode">纳税人识别号： {{orderInfo.invoiceTaxpayerCode}}</p>
                            <p>发票内容： 商品明细</p>
                            <!-- <p>电子发票将在订单完成后1-2天内开具</p> -->
                        </template>
                        <template v-else>
                            <p>不开发票</p>
                        </template>
                    </div>
                </div>
                <div class="item">
                    <div class="label">用户备注</div>
                    <div class="value">{{orderInfo.buyerRemark || '无备注'}}</div>
                </div>
                <div class="item remark-box">
                    <div class="label">商户备注</div>
                    <div class="value">
                        <span v-if="!remarkVisible">{{orderInfo.sellerRemark}}</span>
                        <el-input
                            v-if="remarkVisible"
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="orderInfo.sellerRemark"
                            maxlength="50">
                        </el-input>
                        <span v-if="!remarkVisible" @click="remarkVisible = true" class="blue pointer">我要备注</span>
                        <span v-if="remarkVisible" class="blue pointer" @click="remarkHandler">完成</span>
                    </div>
                </div>
            </div></el-col>
        </el-row>

        <div class="goods-list">
            <div class="goods-list-header">
                <p class="header">商品清单</p>
                <div v-if="orderDetail.orderAfterSaleDateOfExpiration" class="header-date">售后有效期至：{{orderDetail.orderAfterSaleDateOfExpiration}}</div>
            </div>
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
                        ¥{{scope.row.salePrice}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="商品小计">
                    <template slot-scope="scope">
                        ¥{{(+scope.row.salePrice * scope.row.goodsCount).toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="商品状态"
                    class-name="goods-status">
                    <template slot-scope="scope">
                        <template v-if="scope.row.afterSaleStatus">
                            <router-link :to="{ path: '/order/afterSalesDetails', query: { id: scope.row.orderAfterSaleId }}">{{scope.row | orderStatusFilter}}</router-link>
                        </template>
                        <template v-else>
                            {{scope.row | orderStatusFilter}}
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <div class="goods-list-message">
                <section>
                    <div class="row">
                        <div class="col">商品总金额:</div>
                        <div class="col">+ ¥ {{orderDetail.orderInfo.goodsAmount}}</div>
                    </div>
                    <div class="row">
                        <div class="col">运费:</div>
                        <div class="col">+ ¥ {{orderDetail.orderInfo.freight}}</div>
                    </div>
                    <div class="row strong">
                        <div class="col">订单总金额:</div>
                        <div class="col">¥{{orderAmount}}</div>
                    </div>
                    <div class="row">
                        <div class="col">优惠券金额:</div>
                        <div class="col">
                            <i @click="currentDialog = 'CouponDialog'; currentData = {usedCouponList, usedPromotionList, coupon: true, title: '使用的优惠券'}; dialogVisible = true" class="coupon-img"></i>
                            -¥{{orderDetail.orderInfo.consumeCouponMoney || '0.00'}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">优惠码金额:</div>
                        <div class="col">
                            <i @click="currentDialog = 'CouponDialog'; currentData = {usedCouponList, usedPromotionList, coupon: false, title: '使用的优惠码'}; dialogVisible = true" class="coupon-img"></i>
                            -¥{{orderDetail.orderInfo.consumeCouponCodeMoney || '0.00'}}
                        </div>
                    </div>
                    <template v-if="orderDetail.orderInfo.activityListJson">
                        <div class="row" v-for="(item, index) in JSON.parse(orderDetail.orderInfo.activityListJson)" :key="index">
                            <div class="col">{{`${item.activityTypeName}（${item.name}）`}}:</div>
                            <div class="col">- ¥{{item.reduceMoney || '0.00'}}</div>
                        </div>
                    </template>
                    <div class="row">
                        <div class="col">会员折扣:</div>
                        <div class="col">- ¥{{orderDetail.orderInfo.memberDiscountMoney || '0.00'}}</div>
                    </div>
                    <div class="row">
                        <div class="col">优惠套装:</div>
                        <div class="col">- ¥{{orderDetail.orderInfo.discountPackageMoney || '0.00'}}</div>
                    </div>
                    <div class="row" v-if="orderDetail.orderInfo && orderDetail.orderInfo.discountFreight">
                        <div class="col">满包邮:</div>
                        <div class="col">- ¥{{orderDetail.orderInfo.discountFreight}}</div>
                    </div>
                    <div class="row">
                        <div class="col">积分抵现:</div>
                        <div class="col">- ¥{{orderDetail.orderInfo.consumeScoreConvertMoney || 0}}</div>
                    </div>
                    <!-- <div class="row align-center">
                        <div v-if="this.orderDetail.orderInfo.orderStatus == 0" class="col">
                            <el-select style="margin-right: 5px;" v-model="orderInfo.consultType" placeholder="请选择">
                                <el-option
                                v-for="item in reducePriceTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div v-else-if="orderDetail.orderInfo.consultMoney">
                            <el-select disabled style="margin-right: 5px;" v-model="orderInfo.consultType" placeholder="请选择">
                                <el-option
                                v-for="item in reducePriceTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div v-if="this.orderDetail.orderInfo.orderStatus == 0" class="col">
                            <el-input @input="handleInput2" v-if="changePriceVisible" min="0" type="number" class="reduce-price-input" v-model="orderInfo.consultMoney"></el-input>
                            <span v-if="!changePriceVisible">{{orderInfo.consultMoney}}</span>
                            <span class="blue pointer" v-if="!changePriceVisible" @click="changePriceVisible = true">改价</span>
                            <span class="blue pointer" v-if="changePriceVisible" @click="reducePriceHandler">完成</span>
                        </div>
                        <div v-else-if="orderDetail.orderInfo.consultMoney">
                            <span>¥{{orderDetail.orderInfo.consultMoney}}</span>
                        </div>
                    </div> -->
                </section>
                <section>
                    <div class="row strong" style="align-items: center;">
                        <div :style="{width: changePriceVisible ? '209px' : '199px'}" class="col">应收金额:</div>
                        <div class="col">
                            <div class="yingshow-right-box">
                                <span>¥{{orderDetail.orderInfo.receivableMoney}}</span>
                                <span v-if="this.orderDetail.orderInfo.orderStatus == 0" @click="changePriceVisible = true" class="yingshou-change">改价</span>
                                <el-input v-if="changePriceVisible" style="width: 112px; margin-right: 6px; margin-left: 6px;" type="number" v-model="yingshouChangeMoney" placeholder="请输入金额"></el-input>
                                <el-button v-if="changePriceVisible" @click="yingshouSubmit" type="primary">确定</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="row strong">
                        <div class="col">余额实付:</div>
                        <div class="col">¥{{orderDetail.orderInfo.consumeBalanceMoney || 0}}</div>
                    </div>
                    <div class="row strong">
                        <div class="col">第三方支付:</div>
                        <template v-if="orderDetail.orderInfo.payWay == 2">
                            <div v-if="orderDetail.orderInfo.orderStatus == 6" class="col">¥{{orderDetail.orderInfo.actualMoney || '0.00'}}</div>
                            <div v-else class="col"></div>
                        </template>
                        <template v-else>
                            <div v-if="orderDetail.orderInfo.orderStatus != 0" class="col">¥{{orderDetail.orderInfo.actualMoney || '0.00'}}</div>
                            <div v-else class="col"></div>
                        </template>
                    </div>
                </section>
            </div>
        </div>
        <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData" :ajax="ajax" :sendGoods="sendGoods" @submit="submit"></component>
    </div>
</template>
<script>
import ReceiveInformationDialog from '@/views/order/dialogs/receiveInformationDialog'
import CouponDialog from '@/views/order/dialogs/couponDialog'
import ChangePriceDialog from '@/views/order/dialogs/changePriceDialog'
import gainCouponDialog from '@/views/order/dialogs/gainCouponDialog'
//consultType 协商类型 1加价,2减价
export default {
    data() {
        return {
            expressType: '普通快递',
            receiveInformation: '北京市',
            payer: '张三',
            payMode: '微信支付',
            payTime: '2019',
            batch: '1',
            wechat: '1',
            win: '礼物',
            receiptInformation: '普通发票',
            message: 'message',
            remarks: 'remarks',
            currentDialog: '',
            currentData: '',
            dialogVisible: false,
            remarkVisible: false,
            ajax: false,
            sendGoods: 'received',
            goodsListMessage: {
               consultType: 1,
               consultMoney: 0,
               reducePriceVisible: false
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
            orderAmount: '0.00',
            yingshow: '0.00',
            rewardScore: 0,
            gift: '',
            gainCouponList: '',
            gainCouponCodeList: '',
            //replacePayWechatNames: ''
            yingshouChangeMoney: '',
            invoiceOpen: 1,
            couponList: [],
            couponCodeList: []
        }
    },
    created() {
        //this.getOrderPayRecordList()
        this.getGain()
        this.getShopInfo()
    },
    watch: {
        orderInfo: {
            deep: true,
            handler() {
                this.getOrderAmount()
                this.getYingshou()
            }
        }
    },
    computed: {
        gainCoupon() {
            // couponType 0:获得优惠券 1:使用优惠券
            let couponStr = ''

            if(this.orderDetail.orderCouponList) {
                let gainCouponList = this.orderDetail.orderCouponList.filter(val => val.couponType == 0)

                if(gainCouponList && gainCouponList.length) {
                    gainCouponList.forEach(coupon => {
                        couponStr += coupon.couponName + ' 有效期至 ' + coupon.endTime
                    })
                }
            }

            return couponStr
            
        },
        gainPromotionCode() {
            // promotionCodeType 0:获得优惠码 1:使用优惠码
            let promotionCodeStr = ''

            if(this.orderDetail.orderPromotionCodeList) {
                let gainPromotionCodeList = this.orderDetail.orderPromotionCodeList.filter(val => val.promotionCodeType == 0)

                if(gainPromotionCodeList && gainPromotionCodeList.length) {
                    gainPromotionCodeList.forEach(promotionCode => {
                        promotionCodeStr += promotionCode.promotionCodeName + ' 有效期至 ' + promotionCode.endTime
                    })
                }
            }

            return promotionCodeStr
            
        },
        usedCouponList() {
            return this.orderDetail.orderCouponList && this.orderDetail.orderCouponList.filter(val => val.couponType == 1) || []
        },
        usedPromotionList() {
            return this.orderDetail.orderPromotionCodeList && this.orderDetail.orderPromotionCodeList.filter(val => val.promotionCodeType == 1) || []
        },
        payMan() {
            let str = ''
            let _arr
            if(this.orderInfo.payWay == 1) {
                return this.orderInfo.memberName
            } else if(this.orderInfo.payWay == 2) {
                return this.orderInfo.receivedName
            } else if(this.orderInfo.payWay == 4) {
                return this.orderInfo.memberName
            } else if(this.orderInfo.isConsumeBalance == 1 && (this.orderInfo.actualMoney == '0.00' || this.orderInfo.actualMoney == null)) {
                return this.orderInfo.memberName
            } else {
                if(this.orderDetail.orderPayRecordList) {
                    //_arr = this.orderDetail.orderPayRecordList.slice(0, 3)
                    _arr = this.orderDetail.orderPayRecordList
                    str = _arr.map(val => val.memberName).join(',')
                }
            }
            return str
        },
        wechatLength() {
            if(this.orderDetail.orderPayRecordList) {
                return this.orderDetail.orderPayRecordList.filter(val => val.transactionCode).length
            }
            return 0
        },
        cid(){
          let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
          return shopInfo.id
        }
    },
    methods: {
        // getOrderPayRecordList() {
        //     this._apis.order.getOrderPayRecordList({id: this.$route.query.id}).then(res => {
        //         let str = ''

        //         let namesList = res.map(val => val.replacePayWechatName)

        //         namesL
        //         this.$message.success('查询成功！');
        //     }).catch(error => {
        //         this.$message.error(error);
        //     }) 
        // },
        moreHandler(code) {
            let obj = {}

            if(code == 1) {
                obj.title = '优惠券'
                obj.coupon = true
                obj.couponList = this.couponList
            } else {
                obj.title = '优惠码'
                obj.coupon = false
                obj.couponCodeList = this.couponCodeList
            }
            this.currentData = obj
            this.currentDialog = 'gainCouponDialog'
            this.dialogVisible = true
        },
        getShopInfo(){
          let id = this.cid

          this._apis.set.getShopInfo({id:id}).then(response =>{
            this.invoiceOpen = response.invoiceOpen
          }).catch(error =>{
            console.log(error)
          })
        },
        getGain() {
            let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
            console.log(this);
            this._apis.order.getGain({
                businessId:1,
                tenantId:shopInfo.tenantInfoId,
                merchantId:shopInfo.id,
                gainId: this.$route.query.id
            }).then(res => {
                this.rewardScore = res.rewardScore || 0,
                this.gift = res.giftList && res.giftList.map(val => val.appGift.goodsName).join(',') || ''
                this.gainCouponList = res.couponList && res.couponList.map(val => val.appCoupon.name).join(',') || ''
                this.gainCouponCodeList = res.couponCodeList && res.couponCodeList.map(val => val.appCoupon.name).join(',') || ''
                this.couponList = res.couponList || []
                this.couponCodeList = res.couponCodeList || []
            }).catch(error => {
                this.$message.error(error);
            })
        },
        getOrderAmount() {
            let goodsAmount
            let freight
            let total

            goodsAmount = (typeof this.orderInfo.goodsAmount == 'string') ? parseFloat(this.orderInfo.goodsAmount) : this.orderInfo.goodsAmount
            freight = (typeof this.orderInfo.freight == 'string') ? parseFloat(this.orderInfo.freight) : this.orderInfo.freight
            total = goodsAmount + freight
            total = total.toFixed(2)

            this.orderAmount = total
        },
        getYingshou() {
            let consumeBalanceMoney
            let consumeScoreConvertMoney
            let actualMoney
            let receivableMoney
            let total

            consumeBalanceMoney = typeof this.orderInfo.consumeBalanceMoney == 'string' ? parseFloat(this.orderInfo.consumeBalanceMoney) : this.orderInfo.consumeBalanceMoney
            consumeScoreConvertMoney = typeof this.orderInfo.consumeScoreConvertMoney == 'string' ? parseFloat(this.orderInfo.consumeScoreConvertMoney) : this.orderInfo.consumeScoreConvertMoney
            actualMoney = typeof this.orderInfo.actualMoney == 'string' ? parseFloat(this.orderInfo.actualMoney) : this.orderInfo.actualMoney
            receivableMoney = typeof this.orderInfo.receivableMoney == 'string' ? parseFloat(this.orderInfo.receivableMoney) : this.orderInfo.receivableMoney

            if(this.orderInfo.orderStatus == 3) {
                if(this.orderInfo.payWay == 2) {
                    total = consumeBalanceMoney + consumeScoreConvertMoney + receivableMoney
                    total = total.toFixed(2)
                    this.yingshow = total
                } else {
                    total = consumeBalanceMoney + consumeScoreConvertMoney + actualMoney
                    total = total.toFixed(2)
                    this.yingshow = total
                }
            } else {
                total = consumeBalanceMoney + consumeScoreConvertMoney + receivableMoney
                total = total.toFixed(2)
                this.yingshow = total
            }
        },
        handleInput2(e) {
            //this.goodsListMessage.consultMoney = (this.goodsListMessage.consultMoney.match(/^\d*(\.?\d{0,2})/g)[0]) || null
            this.orderInfo.consultMoney = (this.orderInfo.consultMoney.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        },
        // reducePriceHandler() {
        //     if(this.orderInfo.consultType == 2) {
        //         if(this.orderDetail.orderInfo.receivableMoney < this.orderInfo.consultMoney) {
        //             this.$message({
        //                 message: '不能大于第三方待支付金额',
        //                 type: 'warning'
        //             });
        //             return
        //         }
        //     }
        //     this._apis.order.orderPriceChange({id: this.orderDetail.orderInfo.id, 
        //     consultType: this.orderInfo.consultType, consultMoney: this.orderInfo.consultMoney}).then(res => {
        //         this.changePriceVisible = false
        //         // this.$message.success('添加成功！');
        //         this.currentDialog = 'ChangePriceDialog'
        //         this.dialogVisible = true
        //         this.getDetail()
        //     }).catch(error => {
        //         this.changePriceVisible = false
        //         this.$message.error(error);
        //     }) 
        // },
        reducePriceHandler() {
            if(this.orderInfo.consultType == 2) {
                if(parseFloat(this.orderDetail.orderInfo.receivableMoney) < this.orderInfo.consultMoney) {
                    this.$message({
                        message: '不能大于第三方待支付金额',
                        type: 'warning'
                    });
                    return
                }
            }
            this._apis.order.orderPriceChange({id: this.orderDetail.orderInfo.id, 
            consultType: this.orderInfo.consultType, consultMoney: this.orderInfo.consultMoney}).then(res => {
                this.changePriceVisible = false
                // this.$message.success('添加成功！');
                this.$emit('getDetail')
                this.currentDialog = 'ChangePriceDialog'
                this.dialogVisible = true
            }).catch(error => {
                this.changePriceVisible = false
                this.$message.error(error);
            }) 
        },
        yingshouSubmit() {
            if(+this.yingshouChangeMoney < 0) {
                this.$message({
                    message: '非法输入，仅支持输入非负数，请重新输入',
                    type: 'warning'
                });
                return
            }
            if(+this.yingshouChangeMoney < +this.orderDetail.orderInfo.consumeBalanceMoney) {
                this.$message({
                    message: '改价金额不小于余额实付金额',
                    type: 'warning'
                });
                return
            }
            this._apis.order.orderPriceChange({id: this.orderDetail.orderInfo.id, 
                 consultMoney: +this.yingshouChangeMoney}).then(res => {
                    this.changePriceVisible = false
                    this.$emit('getDetail')
                    this.currentDialog = 'ChangePriceDialog'
                    this.dialogVisible = true
                }).catch(error => {
                    this.changePriceVisible = false
                    this.$message.error(error);
                }) 
        },
        submit() {
            this.$emit('getDetail')
        },
        remarkHandler() {
            this.remarkVisible = true
            this._apis.order.orderRemark({id: this.orderInfo.id, sellerRemark: this.orderInfo.sellerRemark}).then(res => {
                this.remarkVisible = false
                this.$message.success('添加成功！');
            }).catch(error => {
                this.remarkVisible = false
                this.$message.error(error);
            }) 
        }
    },
    filters: {
        deliveryWayFilter(code) {
            if(code === 1) {
                return '普通快递'
            } else if(code === 2) {
                return '商家自送'
            }
        },
        payWayFilter(code) {
            if(code === 1) {
                return '微信支付'
            } else if(code === 2) {
                return '货到付款'
            } else if(code === 3) {
                return '找人代付'
            } else if(code === 4) {
                return '线下支付'
            } else if(code === 5) {
                return '线上支付'
            } else if(code === 6) {
                return '支付宝支付'
            }
        },
        invoiceTypeFilter(code) {
            if(code === 1) {
                return '个人'
            } else if(code === 2) {
                return '公司'
            }
        },
        orderPayRecordListFilter(arr) {
            let str = ''
            let _arr

            if(this.orderInfo.payWay == 2) {
                return this.orderInfo.receivedName
            } else if(this.orderInfo.isConsumeBalance == 1 && !this.orderInfo.actualMoney) {
                return this.orderInfo.memberName
            } else {
                if(arr) {
                    _arr = arr.slice(0, 3)
                    str = _arr.map(val => val.memberName).join(',')
                }
            }

            return str
        },
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
            }
        },
        yingshouFilter(val) {
            if(val.orderStatus == 3) {
                return val.consumeBalanceMoney + val.consumeScoreConvertMoney + val.actualMoney
            } else {
                return val.consumeBalanceMoney + val.consumeScoreConvertMoney + val.receivableMoney
            }
        },
        tradeCodeFilter(value) {
            if(value && value instanceof Array) {
                return value.map(val => val.tradeCode).join(',')
            } else {
                return ''
            }
        },
        wechatFilter(value) {
            if(value && value instanceof Array) {
                return value.map(val => val.transactionCode).join(',')
            } else {
                return ''
            }
        },
        orderStatusFilter(row) {
            if(row.afterSaleStatus== 1 || row.afterSaleStatus== 2 || row.orderAfterStatus == 0) {
                if(row.orderAfterStatus == 0){
            return '售后关闭'
            }else if(row.orderAfterStatus == 1) {
                        return '换货中'
                    } else if(row.orderAfterStatus == 2) {
                        return '退款中'
                    }else if(row.orderAfterStatus == 3) {
                        return '退货中'
                    }else if(row.orderAfterStatus == 4) {
                        return '退款完成'
                    }else if(row.orderAfterStatus == 5) {
                        return '换货完成'
                    }else if(row.orderAfterStatus == 6) {
                        return '退货完成'
                    }
                } else {
                    if(row.orderStatus == 0) {
                    return '待付款'
                } else if(row.orderStatus == 1) {
                    return '待成团'
                } else if(row.orderStatus == 2) {
                    return '交易关闭'
                } else if(row.orderStatus == 3) {
                    return '待发货'
                } else if(row.orderStatus == 4) {
                    return '部分发货'
                } else if(row.orderStatus == 5) {
                    return '待收货'
                } else if(row.orderStatus == 6) {
                    return '交易成功'
                }
                    }
        },
        timeFilter(value) {
            if(value && value.split(/\s+/).length) {
                return value.split(/\s+/)[0]
            }

            return value
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
                    str += _value[i] + '，'
                }
            }

            str = str.replace(/^(.*)\，$/, '$1')

            return str
        },
    },
    props: {
        orderInfo: {
            type: Object,
            required: true
        },
        orderDetail: {
            type: Object,
            required: true
        }
    },
    components: {
        ReceiveInformationDialog,
        CouponDialog,
        ChangePriceDialog,
        gainCouponDialog
    }
}
</script>
<style lang="scss" scoped>
    .gain {
        .gain-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .gain-item-lefter {
                width: 56px;
                margin-right: 6px;
            }
            .more {
                font-size:14px;
                font-weight:400;
                color:rgba(101,94,255,1);
                text-align: right;
            }
        }
    }
    .order-information {
        .blue {
            color: $globalMainColor;
        }
        .grid-content {
            margin-right: 19px;
            padding-right: 19px;
            p {
                line-height: 21px;
            }
            &.lefter {
                height: 146px;
                .change {
                    color: $globalMainColor;
                    text-align: right;
                    margin-top: 10px;
                }
            }
            &.righter {
                border: none;
                .remark-box {
                    p {
                        margin-top: 8px;
                    }
                }
            }
            &.center {
                padding-left: 10px;
                border-left: 1px solid #cacfcb;
                border-right: 1px solid #cacfcb;
            }
            .item {
                display: flex;
                margin-top: 10px;
                .label {
                    margin-right: 20px;
                    flex-shrink: 0;
                    width: 84px;
                    text-align: right;
                }
                .value {
                    color: #9FA29F;
                }
            }
        }
    }
    /deep/ .remark-box .el-textarea {
        width: 180px;
    }
    .goods-list {
        border-top: 1px solid #cacfcb;
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
            float: right;
            section {
                width: 480px;
                border-bottom: 1px solid #CACFCB;
                padding: 20px 0;
                &:last-child {
                    border: none;
                }
            }
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
                background: url(../../../assets/images/order/icon-coupon.png);
                margin-right: 5px;
            }
            .row {
                margin-bottom: 10px;
                .reduce-price-input {
                    width: 100px;
                }
                .col:first-child {
                    width: 200px;
                    text-align: right;
                    margin-right: 5px;
                }
                .col:last-child {
                    margin-left: 35px;
                }
                &.strong {
                    font-weight:600;
                    color:rgba(68,67,75,1);
                }
            }
        }
        .operate-record {
            clear: both;
        }
        .reduce-price-input {
        width: auto;
    }
    .orderPayRecordList {
        margin-left: 5px;
    }
    .goods-detail {
            display: flex;
            align-items: center;
        }
        .image-box {
            margin-right: 5px;
        }
.goods-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-date {
        color: #92929B;
        font-size: 14px;
    }
}
/deep/ .goods-status .cell a {
    color: #FD932B;
}
.yingshou-change {
    color: #655EFF;
    margin-left: 10px;
    cursor: pointer;
}
.yingshow-right-box {
    display: flex;
    align-items: center;
    >span:first-child {
        font-weight: 600;
    }
    .yingshou-change {
        flex-shrink: 0;
    }
}
.coupon, .coupon-code {
    .item.lefter {
        flex-direction: column;
    }
    .item.righter {
        flex-direction: column;
    }
    .limit {
        font-size: 12px;
    }
}
.coupon-code-list-lefter {
    margin-top: 0!important;
}
.coupon-code-list-righter {
    margin-top: 0!important;
}
.coupon-box {
    min-width: 271px;
}
</style>


