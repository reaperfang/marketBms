<template>
    <div class="order-delivery">
        <div class="search">
            <div v-show="isOrderAutoSend" class="top">说明：当前已开启订单自动发货，自动发货后请尽快补充物流信息，您也可以到 <span @click="oderDeliver_decor" class="oderDeliver_decor">设置-交易设置</span> 中关闭自动发货 </div> 
            <el-form ref="form" :inline="true" :model="listQuery" class="form-inline input_style">
                <el-form-item>
                    <el-input placeholder="请输入内容" v-model="listQuery.searchValue" class="input-with-select">
                        <el-select v-model="listQuery.searchType" slot="prepend" placeholder="请输入">
                        <el-option label="订单编号" value="orderCode"></el-option>
                        <el-option label="收货人联系电话" value="receivedPhone"></el-option>
                        <el-option label="快递单号" value="expressNos"></el-option>
                        <el-option label="用户昵称" value="memberName"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="订单状态">
                    <el-select v-model="listQuery.status">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="待发货" value="3"></el-option>
                        <el-option label="部分发货" value="4"></el-option>
                        <el-option label="待收货" value="5"></el-option>
                        <el-option label="已关闭" value="2"></el-option>
                        <el-option label="已完成" value="6"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="自动发货">
                    <el-select v-model="listQuery.isAutosend">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="请输入内容" v-model="listQuery.searchValue2" class="input-with-select">
                        <el-select v-model="listQuery.searchType2" slot="prepend" placeholder="请输入">
                        <el-option label="商品名称" value="orderProductNames"></el-option>
                        <el-option label="快递公司" value="expressCompanys"></el-option>
                        <el-option label="收货人" value="receivedName"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item class="searchTimeType">
                    <el-select class="date-picker-select w_135" v-model="listQuery.searchTimeType" placeholder>
                        <el-option label="发货时间" value="send"></el-option>
                        <el-option label="下单时间" value="create"></el-option>
                    </el-select>
                    <el-date-picker
                        v-model="listQuery.orderTimeValue"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="utils.globalTimePickerOption.call(this)"
                    ></el-date-picker>
                </el-form-item>
                <deliveryMethod :listQuery="listQuery"></deliveryMethod>
                <el-form-item>
                    <el-button @click="search" type="primary">查询</el-button>
                    <el-button class="border-button" @click="resetForm('form')">重置</el-button>
                </el-form-item>
                <!-- <div class="buttons">
                    <div class="righter">
                        <el-button @click="getList" type="primary">搜索</el-button>
                        <el-button class="border-button" @click="resetForm('form')">重置</el-button>
                    </div>
                </div> -->
            </el-form>
        </div>
        <div class="line"></div>
        <div class="content">
            <p>已选择 <span>{{multipleSelection.length}}</span> 项，全部<span>{{total}}</span>项</p>
            <el-table
                v-loading="loading"
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                :header-cell-style="{background:'#F6F7FA', color:'#44434B'}">
                <el-table-column
                    type="selection"
                    width="34">
                </el-table-column>
                <!-- <el-table-column
                    prop="isAutoSend"
                    label=""
                    width="40">
                    <template v-if="scope.row.isAutoSend" slot-scope="scope">
                        <el-tooltip content="自动发货" placement="bottom" effect="light">
                            <i class="auto"></i>
                        </el-tooltip>
                    </template>
                </el-table-column> -->
                <el-table-column
                    prop="orderCode"
                    label="订单编号"
                    width="290"
                    fixed="left"
                    :class-name="haveAuto ? 'orderCode table-padding haveAuto' : 'orderCode table-padding'">
                    <template slot-scope="scope">
                        <el-tooltip v-if="scope.row.isAutoSend && (scope.row.deliveryWay != 3)" content="自动发货" placement="bottom" effect="dark">
                            <i class="auto"></i>
                        </el-tooltip>
                        <el-tooltip v-if="scope.row.isUrge == 0" content="用户催发货，请尽快发货" placement="bottom" effect="dark">
                            <i class="urge"></i>
                        </el-tooltip>
                        <i class="unauto" v-if="!scope.row.isAutoSend && (scope.row.isUrge != 0) && haveAuto"></i>
                        <span class="deliveryWay-icon">{{scope.row | deliveryWayIconFilter}}</span>
                        {{scope.row.orderCode}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="memberName"
                    label="用户昵称"
                    align="center"
                    width="105">
                </el-table-column>
                <el-table-column
                    prop="deliveryWay"
                    label="配送方式"
                    align="center"
                    width="125">
                    <template slot-scope="scope">
                        <div>
                            <span class="icon-store" v-if="scope.row.deliveryWay == 2"></span>
                            <span class="icon-store-text">{{scope.row | deliveryWayFilter}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="预约时间"
                    align="center"
                    width="160">
                    <template slot-scope="scope">
                        <div>
                            <div>{{scope.row.deliveryDate | formatDateRemoveZero}}</div>
                            <div>{{scope.row.deliveryTime}}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="receivedName"
                    align="center"
                    label="收货人">
                </el-table-column>
                <el-table-column
                    prop="receivedPhone"
                    label="收货人电话"
                    align="center"
                    width="110">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    align="center"
                    >
                    <template slot-scope="scope">
                        <span>{{scope.row.status | orderStatusFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="sendTime"
                    label="最新发货时间"
                    align="center"
                    width="160">
                    <template slot-scope="scope">
                        <div>
                            <template v-if="scope.row.isAutoSend && (scope.row.status == 3) && scope.row.isFillUp">
                                {{scope.row.updateTime}}
                            </template>
                            <template v-else>
                                {{scope.row.sendTime}}
                            </template>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" :width="operationColumnW" fixed="right" align="left" header-align="center" class-name="table-padding">
                    <template slot-scope="scope">
                        <div class="operate-box table-operate">
                            <span class="table-btn" v-permission="['订单', '发货管理', '订单发货', '查看']" @click="$router.push(`/order/orderDetail?id=${scope.row.orderId}&_ids=${scope.row.id}`)">查看</span>
                            <template v-if="scope.row.status == 4">
                                <span class="table-btn" v-permission="['订单', '发货管理', '订单发货', '继续发货']" @click="$router.push(`/order/deliverGoods?orderType=order&sendType=one&ids=${scope.row.orderId}&_ids=${scope.row.id}`)">继续发货</span>
                            </template>
                            <template v-else-if="scope.row.status == 3">
                                <span class="table-btn" v-permission="['订单', '发货管理', '订单发货', '发货']" v-if="!scope.row.isFillUp" @click="$router.push(`/order/deliverGoods?orderType=order&sendType=one&ids=${scope.row.orderId}&_ids=${scope.row.id}`)">发货</span>
                                <span class="table-btn" v-if="scope.row.isFillUp && scope.row.deliveryWay != 4 && scope.row.deliveryWay != 3" @click="$router.push(`/order/supplementaryLogistics?ids=${scope.row.orderId}&_ids=${scope.row.id}`)">补填物流</span>
                            </template>
                            <template v-if="scope.row.status == 5">
                                <template v-if="scope.row.deliveryWay == 1">
                                    <span class="table-btn" v-if="scope.row.isFillUp && scope.row.deliveryWay != 4 && scope.row.deliveryWay != 3" @click="$router.push(`/order/supplementaryLogistics?ids=${scope.row.orderId}&_ids=${scope.row.id}`)">补填物流</span>
                                </template>
                                <template v-else-if="scope.row.deliveryWay == 4">
                                    <span class="table-btn" @click="verificationHandler(scope.row)">核销验证</span>
                                </template>
                                <template v-else-if="scope.row.deliveryWay == 3 && (!!scope.row.isAbnormal)">
                                    <span class="table-btn" @click="reOrder(scope.row)">重新发单</span>
                                    <span class="table-btn" @click="closeOrder(scope.row)">关闭订单</span>
                                </template>
                            </template>
                            <!-- <template v-else-if="scope.row.deliveryWay == 3 && scope.row.isAbnormal">
                                <span @click="reOrder(scope.row)">重新发单</span>
                                <span @click="closeOrder(scope.row)">关闭订单</span>
                            </template> -->
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-show="!loading" class="footer table-select">
                <el-checkbox :indeterminate="isIndeterminate" @change="checkedAllChange" v-model="checkedAll">全选</el-checkbox>
                <el-button v-permission="['订单', '发货管理', '订单发货', '批量导入发货']" class="border-button" @click="importAndDelivery">批量导入发货</el-button>
                <el-button v-permission="['订单', '发货管理', '订单发货', '批量发货']" class="border-button" @click="batchSendGoods">批量发货</el-button>
                <el-button v-permission="['订单', '发货管理', '订单发货', '批量打印配送订单']" class="border-button" @click="batchPrintDistributionSlip">批量打印配送单</el-button>
                <el-button v-permission="['订单', '发货管理', '订单发货', '批量打印电子面单']" class="border-button" @click="batchPrintElectronicForm">批量打印电子面单</el-button>
                <el-button v-permission="['订单', '发货管理', '订单发货', '批量打印电子面单']" class="border-button" @click="batchSupplementaryLogistics">批量补填物流</el-button>
            </div>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.startIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
        </div>
        <!-- 打印配送单dialog -->
        <DialogPrintList :printDialogVisible.sync="printDialogVisible" :printPath="printPathV" :printQuery="printQuery" @closeDialogVisible="closeDialogVisible()"></DialogPrintList>
        <component
            v-if="dialogVisible"
            :is="currentDialog"
            :dialogVisible.sync="dialogVisible"
            :data="currentData"
            @submit="onSubmit"
            :title="title">
        </component>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import DeliveryMethod from "./deliveryMethod"; //配送方式组件
import DialogPrintList from '@/components/printListDialog'
import utils from "@/utils";
import VerificationDialog from "@/views/order/dialogs/verificationDialog";
import CloseOrderDialog from "@/views/order/dialogs/closeOrderDialog";
import { orderDeliveryMethods } from '@/views/order/mixins/orderDeliveryMixin'

export default {
    mixins: [orderDeliveryMethods],
    data() {

        return {
            multipleSelection: [],
            multipleTable: [

            ],
            total: 0,
            listQuery: {
                startIndex: 1,
                pageSize: 20,
                searchType: 'orderCode',
                searchValue: '',
                status: '3',
                isAutosend: '',
                searchType2: 'orderProductNames',
                searchValue2: '',
                searchTimeType: 'send',
                orderTimeValue: '',
                orderCode: '',
                receivedPhone: '',
                expressNos: '',
                memberSn: '',
                orderProductNames: '',
                expressCompanys: '',
                receivedName: '',
                deliveryWay: "", // 配送方式:1普通快递,2商家配送
                deliveryDate: "", //商家配送-日期
                deliveryTime: "", //商家配送-时间段
                isSupportElectronicSheet: 0,
                isExpressElectronicSheet: '',
            },
            tableData: [],
            loading: false,
            express: false,
            checkedAll: false,
            isIndeterminate: false,
            isOrderAutoSend: false,
            //打印配送单
            printDialogVisible:false,
            printRadio:null,
            printPathV:'',
            printQuery:{},
            currentDialog: '',
            dialogVisible: false,
            currentData: {},
            title: '',
            operationColumnW: 72 //操作列宽度
        }
    },
    created() {
        if(typeof this.$route.query.status != 'undefined') {
            this.listQuery = Object.assign({}, this.listQuery, {status: this.$route.query.status})
        }
        this.getList()
        this.$nextTick(() => {
      this.pickerBeginDateBefore = {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        }
      };
    })
    //this.checkExpress()
    this.getShopInfo()
    },
    watch: {
        'tableData': {
            handler(newVal, oldVal) { //计算操作栏宽度
                this.$nextTick(() => {
                    this.operationColumnW = this.utils.getOperationColumnW();
                })
            },
            deep: true
        }
    },
    filters: {
        deliveryWayIconFilter(item) {
            let  code = item.deliveryWay

            switch(code) {
                case 1:
                    return "普快"
                case 2:
                    return "商配"
                case 3:
                    if(item.orderStatus==5||item.orderStatus==6){
                        return "达达"
                    }else{
                        return "三方"
                    }
                case 4:
                    return "自提"
            }
        }
    },
    computed:{
        cid(){
            let shopInfo = this.$store.getters.shopInfos
            return shopInfo.id
        },
        haveAuto() {
            return this.tableData.some(val => (val.isAutoSend || (val.isUrge == 0)) && (val.deliveryWay != 3))
        }
    },
    methods: {
        importAndDelivery() {
            // this._apis.order
            // .getShopSendAddress({ cid: this.cid })
            // .then(res => {
            //     if(!res) {
            //         this.confirm({title: '提示', icon: true, showCancelButton: false, confirmText: '去设置', text: '您未完成发货地址设置，请到地址库设置发货地址。'}).then(() => {
            //             this.$router.push('/set/address')
            //         })
            //     } else {
            //         this.$router.push('/order/batchImportAndDelivery')
            //     }
            // })
            // .catch(error => {
            //     this.$message.error(error);
            // });
            this.$router.push('/order/batchImportAndDelivery')
        },
        verificationHandler(row) {
            this.currentData = row.orderId
            this.currentDialog = 'VerificationDialog'
            this.dialogVisible = true
        },
        getShopInfo() {
            let id = this.cid
            this.$store.dispatch('getShopInfo').then(response =>{
                this.isOrderAutoSend = Boolean(response.isOrderAutoSend)
            }).catch(error =>{
                this.$message.error(error);
            })
        },
        search() {
            this.listQuery = Object.assign({}, this.listQuery, {
                startIndex: 1,
                pageSize: 20,
            })

            this.getList()
        },
        batchSupplementaryLogistics() {
            if(!this.multipleSelection.length) {
                this.confirm({title: '提示', icon: true, showCancelButton: false, text: '请先勾选当前页需要补填物流信息的订单。'})
                return
            }
            if(utils.unique(this.multipleSelection.map(val => val.deliveryWay)).length > 1) {
                this.confirm({title: '提示', icon: true, showCancelButton: false, confirmText: '我知道了', text: '勾选单据同时包含多种配送方式，无法批量操作。<br/>请先筛选出普通快递、商家配送或第三方配送的待发货订单后再进行批量补填物流。'})
                return;
            }
            if(this.multipleSelection.some(val => val.deliveryWay == 1) && this.multipleSelection.some(val => val.deliveryWay == 2)){
                this.confirm({title: '提示', icon: true, showCancelButton: false, confirmText: '我知道了', text: '勾选单据同时包含商家配送和普通快递的两种单据，无法批量补填物流。<br/>请先筛选出商家配送或普通快递配送的单据，再进行批量补填物流。'})
                return;
            }
            if(this.multipleSelection.filter(val => val.isFillUp != 1).length) {
                this.confirm({title: '提示', icon: true, text: '您勾选的订单包括不能补填物流信息的订单，请重新选择。'})
                return
            }
            this.$router.push(`/order/batchSupplementaryLogistics?ids=${this.multipleSelection.map(val => val.orderId + '').join(',')}&_ids=${this.multipleSelection.map(val => val.id + '').join(',')}`)
        },
        checkedAllChange() {
            if(this.checkedAll) {
                this.$refs.multipleTable.clearSelection();
                this.$refs.multipleTable.toggleAllSelection();
            } else {
                this.$refs.multipleTable.clearSelection();
            }
            this.isIndeterminate = false;
        },
        checkExpress() {
        this._apis.order
            .checkExpress()
            .then(res => {
            this.express = res;
            })
            .catch(error => {
            this.visible = false;
            this.$message.error(error);
            });
        },
        pickerBeginDateBefore (time) {

        },
        batchSendGoods() {
            if(!this.multipleSelection.length) {
                this.confirm({icon: true, showCancelButton: false, text: '请先勾选当前页需要批量发货的单据。'})
                return
            }
            // if(this.multipleSelection.some(val => val.deliveryWay == 1) && this.multipleSelection.some(val => val.deliveryWay == 2)){
            //     this.confirm({title: '提示', icon: true, showCancelButton: false, confirmText: '我知道了', text: '勾选单据同时包含商家配送和普通快递的两种单据，无法批量发货。<br/>请先筛选出商家配送或普通快递配送的单据，再进行批量发货。'})
            //     return;
            // }
            if(utils.unique(this.multipleSelection.map(val => val.deliveryWay)).length > 1) {
                this.confirm({icon: true, showCancelButton: false, confirmText: '我知道了', text: '勾选单据同时包含多种配送方式，无法批量操作。<br/>请先筛选出普通快递、商家配送或第三方配送的待发货订单后再进行批量发货。'})
                return;
            }
            if(this.multipleSelection.some(val => val.status != 3 && val.status != 4)) {
            this.confirm({icon: true, text: '勾选单据包含已完成发货或已关闭的单据，无法批量发货，请重新选择。'})
                return
            }
            if(this.multipleSelection.some(val => val.isFillUp)) {
            this.confirm({icon: true, text: '勾选单据包含已完成发货或已关闭的单据，无法批量发货，请重新选择。'})
                return
            }
            this.$router.push(`/order/orderBulkDelivery?ids=${this.multipleSelection.map(val => val.orderId).join(',')}&_ids=${this.multipleSelection.map(val => val.id).join(',')}`)
        },
        batchPrintElectronicForm() {
            // if(this.express) {
            //     this.confirm({title: '提示', icon: true, text: '不支持打印电子面单。'})
            //     return
            // }
            if(!this.multipleSelection.length) {
                this.confirm({icon: true, showCancelButton: false, text: '请先勾选当前页需要批量打印电子面单的单据。'})
                return
            }
            if(utils.unique(this.multipleSelection.map(val => val.deliveryWay)).length > 1) {
                this.confirm({icon: true, showCancelButton: false, confirmText: '我知道了', text: '勾选单据同时包含多种配送方式，无法批量操作。<br/>请先筛选出配送方式为普通快递-电子面单的单据，再进行批量打印电子面单。'})
                return;
            }
            if(!this.multipleSelection.map(val => val.isKDBird).every(val => val == true)) {
                this.confirm({icon: true, text: '勾选单据中包含不支持电子面单的单据，无法批量打印，请先依据支持电子面单的快递公司筛选单据后，再打印。'})
                return
            }
            if(this.multipleSelection.filter(val => val.isAutoSend).some(val => val.isFillUp == 1)) {
                this.confirm({icon: true, text: '自动发货订单，未填报物流信息，不能批量打印电子面单。'})
                return
            }
            if(this.multipleSelection.filter(val => !val.isAutoSend).some(val => (val.status != 4 && val.status != 5 && val.status != 6))) {
                this.confirm({icon: true, text: '没有完成发货，不能批量打印电子面单。'})
                return
            }

            if(this.multipleSelection.some(val => val.isKDBird === null)) {
                this.confirm({icon: true, text: '不支持打印电子面单。'})
                return
            }

            let ids = this.multipleSelection.map(val => val.orderId).join(',')

            this.$router.push('/order/printingElectronicForm?ids=' + ids)
        },
        //批量打印配送单
        batchPrintDistributionSlip() {
            if(!this.multipleSelection.length) {
                this.confirm({icon: true, showCancelButton: false, text: '请先勾选当前页需要批量打印配送单的单据。'})
                return
            }
            if(utils.unique(this.multipleSelection.map(val => val.deliveryWay)).length > 1) {
                this.confirm({icon: true, showCancelButton: false, confirmText: '我知道了', text: '勾选单据同时包含多种配送方式，无法批量操作。<br/>请先筛选出普通快递、商家配送、第三方配送或上门自提的单据，再进行批量打印配送单。'})
                return;
            }
            if(this.multipleSelection.some(val => val.status == 3)) {
                this.confirm({icon: true, text: '勾选订单包含未发货或未付款订单，无法批量打印；请重新勾选已发货订单批量打印配送单。'})
                return
            }
            let ids = this.multipleSelection.map(val => val.id).join(',')
            let orderIds = this.multipleSelection.map(val => val.orderId).join(',')
            // this.$router.push('/order/printDistributionSheet?ids=' + ids)
            // 0：最后一次发货(入口:从发货后打印配送单)；1：所有发货(入口:批量打印配送单)
            this.handlePrintListOpen('/order/printDistributionSheet',{ids:ids,orderIds:orderIds,printType:1})
        },
        handlePrintListOpen(pagePath,query){
            // console.log(pagePath, query)
            this.printPathV = pagePath
            this.printQuery = query
            this.printDialogVisible=true
        },
        closeDialogVisible(){
            this.printDialogVisible=false
        },
        onSubmit(value) {
            let orderId = "";
            if(Object.prototype.toString.call(this.currentData)=="[object Object]"){
                orderId=this.currentData.orderId;
            }else{
                orderId=this.currentData;
            }
            this._apis.order.orderClose({...value, id: orderId}).then((res) => {
                this.getList()
                this.visible = false
                this.$message.success('关闭成功！');
            }).catch(error => {
                this.visible = false
                this.$message.error(error);
            })
        },
        resetForm(formName) {
            this.listQuery = {
                startIndex: 1,
                pageSize: 20,
                searchType: 'orderCode',
                searchValue: '',
                status: '',
                isAutosend: '',
                searchType2: 'orderProductNames',
                searchValue2: '',
                searchTimeType: 'send',
                orderTimeValue: '',
                orderCode: '',
                receivedPhone: '',
                expressNos: '',
                memberSn: '',
                orderProductNames: '',
                expressCompanys: '',
                receivedName: '',
                deliveryWay: "", // 配送方式:1普通快递,2商家配送
                deliveryDate: "", //商家配送-日期
                deliveryTime: "", //商家配送-时间段
                isExpressElectronicSheet: ''
            }
            this.getList()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            let checkedCount = val.length;
            this.checkedAll = (checkedCount === this.tableData.length) && (checkedCount !== 0);
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length;
        },
        getList() {
            let params = {}
            this.loading =  true

            params = Object.assign({}, this.listQuery, {
                cid:this.cid,
                [this.listQuery.searchType]: this.listQuery.searchValue,
                [this.listQuery.searchType2]: this.listQuery.searchValue2,
                [`${this.listQuery.searchTimeType}TimeStart`]: this.listQuery.orderTimeValue ? utils.formatDate(this.listQuery.orderTimeValue[0], "yyyy-MM-dd hh:mm:ss") : '',
                [`${this.listQuery.searchTimeType}TimeEnd`]: this.listQuery.orderTimeValue ? utils.formatDate(this.listQuery.orderTimeValue[1], "yyyy-MM-dd hh:mm:ss") : ''
            })
            this._apis.order.orderSendPageList(params).then((res) => {
                this.tableData = res.list
                this.total = +res.total
                this.loading = false
            }).catch(error => {
                console.error(error)
                this.loading = false
            })
        },
        // 设置交易设置跳转
        oderDeliver_decor(){
          this._routeTo('tradeSet');
        }
    },
    components: {
        Pagination,
        DeliveryMethod,
        DialogPrintList,
        VerificationDialog,
        CloseOrderDialog
    }
}
</script>
<style lang="scss" scoped>
.operate-box span {
    margin-right: 0!important;
}
.search {
    /deep/ .el-form-item__label {
        padding-right: 8px;
    }
    /deep/ .el-form--inline .el-form-item {
        margin-right: 20px;
        .el-button+.el-button {
            margin-left: 6px;
        }
    }
    /deep/ .el-button {
      width: 60px;
    }
}
.order-delivery {
    .search {
        background-color: #fff;
        margin: 0 20px;
        .top {
            background-color: rgb(255, 247, 238);
            color: rgb(254, 121, 95);
            height: 44px;
            line-height: 44px;
            padding: 0 20px;
        }
        .form-inline {
            padding: 20px;
            padding-bottom: 0;
        }
        .buttons {
            display: flex;
            justify-content: flex-end;
            .resetting {
                color: #FD932B;
                margin-right: 40px;
            }
        }
    }
    .line {
        height: 20px;
        background-color: #f2f2f9;
    }
    .content {
        background-color: #fff;
        padding: 0 20px;
        p {
            font-size: 16px;
            color: #92929b;
            margin: 23px 0 20px 0;
            span {
                color: #44434B;
            }
        }
        .footer {
            padding: 20px 20px 10px 20px;
        }
    }
}
/deep/ .date-picker-select .el-input__inner {
  border-radius: 4px 0 0 4px;
}
/deep/ .date-picker-select .el-input__inner:focus {
  border-color: #dcdfe6;
}
.auto {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url(../../../assets/images/order/auto.png) no-repeat;
        background-size: 100% 100%;
        position: relative;
        top: 3px;
        margin-right: 10px;
        vertical-align: -2px;
    }
    .unauto {
        display: inline-block;
        width: 20px;
        height: 20px;
        position: relative;
        top: 3px;
        margin-right: 10px;
        vertical-align: -2px;
    }
    /deep/ .searchTimeType .el-form-item__content {
        display: flex;
    }
    /deep/ .el-checkbox__label {
        padding-left: 6px;
        padding-right: 6px;
    }
    .el-button+.el-button {
        margin-left: 12px;
    }
    /deep/ input:-ms-input-placeholder{
        color:#92929B;
    }
    .oderDeliver_decor{
      text-decoration: underline;
      display: inline-block;
      cursor: pointer;
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
    /deep/ .el-table thead .orderCode {
        &.haveAuto {
            padding-left: 32px;
        }
    }
    .operate-box {
        text-align: left;
        span {
            border-right: 1px solid rgba(218,218,227,1);
            padding-right: 5px;
            &:last-child {
                border-right: none;
                padding-right: 0;
            }
        }
    }
    .urge {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url(../../../assets/images/order/urge.png) no-repeat;
        background-size: 100% 100%;
        margin-right: 10px;
    }
    /deep/ .el-table th.is-leaf {
        border-bottom: none!important;
    }
    /deep/ .el-table thead tr {
        height: 46px;
    }
    .border-button {
        border:1px solid rgba(218,218,227,1)!important;
        color: #44434B!important;
        &:hover {
            border:1px solid #655EFF!important;
            color: #655EFF!important;
            background-color: #fff;
        }
    }
     /deep/ .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
    /deep/ .el-form--inline .el-form-item {
        margin-bottom: 20px;
    }
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
        margin-left:1px;
        margin-right:5px;
        vertical-align: 1px;
    }
</style>
