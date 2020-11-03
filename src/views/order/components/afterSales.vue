<template>
    <div class="after-sales">
        <div class="search">
            <!-- <div class="top">说明：当前已开启订单自动发货，自动发货后请尽快补充物流信息，您也可以到</div> -->
            <el-form ref="form" :inline="true" :model="listQuery" class="form-inline input_style">
                <el-form-item>
                    <el-input placeholder="请输入内容" v-model="listQuery.searchValue" class="input-with-select">
                        <el-select v-model="listQuery.searchType" slot="prepend" placeholder="请输入">
                        <el-option label="售后单编号" value="orderAfterSaleCode"></el-option>
                        <el-option label="收货人联系电话" value="receivedPhone"></el-option>
                        <el-option label="快递单号" value="expressNos"></el-option>
                        <el-option label="用户昵称" value="memberName"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="listQuery.status">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="待退货" value="1"></el-option>
                            <el-option label="待处理" value="2"></el-option>
                            <el-option label="待收货" value="3"></el-option>
                            <el-option label="已关闭" value="5"></el-option>
                            <el-option label="已完成" value="4"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-input placeholder="请输入内容" v-model="listQuery.searchValue2" class="input-with-select">
                        <el-select v-model="listQuery.searchType2" slot="prepend" placeholder="请输入">
                        <el-option label="商品名称" value="orderAfterSaleProductNames"></el-option>
                        <el-option label="快递公司" value="expressCompanys"></el-option>
                        <el-option label="收货人" value="receivedName"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label=""  class="searchTimeType">
                    <el-select class="date-picker-select" v-model="listQuery.searchTimeType" placeholder>
                        <el-option label="发货时间" value="send"></el-option>
                        <el-option label="下单时间" value="orderAfterSaleCreate"></el-option>
                        <el-option label="售后时间" value="create"></el-option>
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
                <deliveryMethod :listQuery="listQuery" :isAfterSales="true"></deliveryMethod>
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
                <el-table-column
                    prop="orderAfterSaleCode"
                    label="售后单编号"
                    fixed="left" 
                    class-name="table-padding"
                    width="250">
                </el-table-column>
                <el-table-column
                    prop="memberName"
                    label="用户昵称"
                    align="center"
                    width="120">
                </el-table-column>
                <!-- <el-table-column
                    prop="deliveryWay"
                    label="退货方式"
                    width="120">
                    <template slot-scope="scope">
                        <div>
                            <span class="icon-store" v-if="scope.row.deliveryWay == 2"></span>
                            <span class="icon-store-text">{{scope.row.deliveryWay | deliveryWayFilter}}</span>
                        </div>
                    </template>
                </el-table-column> -->
                <!-- <el-table-column
                    prop="updateTime"
                    label="取货时间"
                    width="110">
                    <template slot-scope="scope">
                        <div>
                            <div>{{scope.row.deliveryDate | formatDateRemoveZero}}</div> 
                            <div>{{scope.row.deliveryTime}}</div>
                        </div>
                    </template>
                </el-table-column> -->
                <el-table-column
                    prop="receivedName"
                    align="center"
                    label="收货人">
                </el-table-column>
                <el-table-column
                    prop="receivedPhone"
                    align="center"
                    width="110"
                    label="收货人电话">
                </el-table-column>
                <el-table-column
                    prop="status"
                    align="center"
                    label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.status | statusFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    align="center"
                    width="160"
                    label="最新发货时间">
                </el-table-column>
                <el-table-column label="操作" :width="computeWidth" fixed="right" header-align="center" class-name="table-padding">
                    <template slot-scope="scope">
                        <div class="operate-box table-operate">
                            <span class="table-btn" v-permission="['订单', '发货管理', '售后发货', '查看']" @click="$router.push('/order/afterSalesDetails?id=' + scope.row.orderAfterSaleId)">查看</span>
                            <span class="table-btn" v-permission="['订单', '发货管理', '售后发货', '发货']" v-if="scope.row.status == 2" @click="$router.push(`/order/orderAfterDeliverGoods?ids=${scope.row.orderAfterSaleId}&afterSale=true&_ids=${scope.row.id}`)">发货</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-show="!loading" class="footer table-select">
                <el-checkbox :indeterminate="isIndeterminate" @change="checkedAllChange" v-model="checkedAll">全选</el-checkbox>
                <el-button v-permission="['订单', '发货管理', '售后发货', '批量导入发货']" @click="$router.push('/order/batchImportAndDelivery?afterSale=true')" class="border-button">批量导入发货</el-button>
                <el-button v-permission="['订单', '发货管理', '售后发货', '批量发货']" @click="batchSendGoods" class="border-button">批量发货</el-button>
                <el-button v-permission="['订单', '发货管理', '售后发货', '批量打印配送订单']" class="border-button" @click="batchPrintDistributionSlip">批量打印配送单</el-button>
                <el-button v-permission="['订单', '发货管理', '售后发货', '批量打印电子面单']" class="border-button" @click="batchPrintElectronicForm">批量打印电子面单</el-button>
            </div>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.startIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
        </div>
        <!-- 打印配送单dialog -->
        <DialogPrintList :printDialogVisible.sync="printDialogVisible" :printPath="printPathV" :printQuery="printQuery" @closeDialogVisible="closeDialogVisible()"></DialogPrintList>
    
    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import DeliveryMethod from "./deliveryMethod"; //配送方式组件
import DialogPrintList from '@/components/printListDialog'
import utils from "@/utils";

export default {
    data() {
        return {
            multipleSelection: [],
            multipleTable: [
                
            ],
            total: 0,
            listQuery: {
                startIndex: 1,
                pageSize: 20,
                searchType: 'orderAfterSaleCode',
                searchValue: '',
                status: '',
                searchType2: 'orderAfterSaleProductNames',
                searchValue2: '',
                searchTimeType: 'send',
                orderTimeValue: '',
                receivedPhone: '',
                memberSn: '',
                orderProductName: '',
                expressCompany: '',
                receivedName: '',
                expressNos: '',
                orderAfterSaleProductNames: '',
                expressCompanys: '',
                deliveryWay: "", // 配送方式:1普通快递,2商家配送
                deliveryDate: "", //商家配送-日期
                deliveryTime: "" //商家配送-时间段
            },
            tableData: [],
            loading: false,
            checkedAll: false,
            isIndeterminate: false,
            //打印配送单
            printDialogVisible:false,
            printRadio:null,
            printPathV:'',
            printQuery:{}
        }
    },
    created() {
        this.getList()
    },
    computed:{
        cid(){
            let shopInfo = this.$store.getters.shopInfos
            return shopInfo.id
        },
        computeWidth() {
            if(this.tableData.some(item => item.status == 2)) {
                return '117'
            } else {
                return '72'
            }
        }
    },
    filters: {
        statusFilter(code) {
            switch(+code) {
                case 0:
                    return '待审核'
                case 1:
                    return '待退货'
                case 2:
                    return '待处理'
                case 3:
                    return '待收货'
                case 4:
                    return '已完成'
                case 5:
                    return '已关闭'
            }
        },
        deliveryWayFilter(code) {
            switch(code) {
                case 1:
                    return '快递退货'
                case 2:
                    return '商家自取'
            }
        },
    },
    methods: {
        search() {
            this.listQuery = Object.assign({}, this.listQuery, {
                startIndex: 1,
                pageSize: 20,
            })
            
            this.getList()
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
        batchSendGoods() {
            if(!this.multipleSelection.length) {
                this.confirm({icon: true, text: '请选择需要发货的售后单'})
                return
            }
            // if(this.multipleSelection.some(val => val.deliveryWay == 1) && this.multipleSelection.some(val => val.deliveryWay == 2)){
            //     this.confirm({title: '提示', icon: true, showCancelButton: false, confirmText: '我知道了', text: '勾选单据同时包含商家配送和普通快递的两种单据，无法批量发货。<br/>请先筛选出商家配送或普通快递配送的单据，再进行批量发货。'})
            //     return;
            // }
            // if(utils.unique(this.multipleSelection.map(val => val.deliveryWay)).length > 1) {
            //     this.confirm({title: '提示', icon: true, showCancelButton: false, confirmText: '我知道了', text: '勾选单据同时包含多种配送方式，无法批量操作。<br/>请先筛选出普通快递、商家配送或第三方配送的待发货订单后再进行批量发货。'})
            //     return;
            // }
            if(this.multipleSelection.some(val => val.status != 2)) {
            this.confirm({icon: true, text: '请选择待发货的售后单'})
                return
            }
            this.$router.push(`/order/afterSaleBulkDelivery?ids=${this.multipleSelection.map(val => val.orderAfterSaleId).join(',')}&afterSale=true`)
        },
        //批量打印配送单
        batchPrintDistributionSlip() {
            if(!this.multipleSelection.length) {
                this.confirm({ icon: true, text: '请选择需要打印配送单的售后单'})
                return
            }
            // if(utils.unique(this.multipleSelection.map(val => val.deliveryWay)).length > 1) {
            //     this.confirm({title: '提示', icon: true, showCancelButton: false, confirmText: '我知道了', text: '勾选单据同时包含多种配送方式，无法批量操作。<br/>请先筛选出普通快递、商家配送、第三方配送或上门自提的单据，再进行批量打印配送单。'})
            //     return;
            // }
            if(this.multipleSelection.some(val => (val.status != 3 && val.status != 4))) {
                this.confirm({icon: true, text: '没有完成发货，不能批量打印配送单。'})
                return
            }
            let ids = this.multipleSelection.map(val => val.orderAfterSaleId).join(',')
            let orderIds = this.multipleSelection.map(val => val.orderAfterSaleId).join(',')
            
            // this.$router.push('/order/printDistributionSheet?ids=' + ids + '&afterSale=' + true)
            // 0：最后一次发货(入口:从发货后打印配送单)；1：所有发货(入口:批量打印配送单)
            this.handlePrintListOpen('/order/printDistributionSheet',{ids: ids,orderIds:orderIds,printType:1,afterSale: true})
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
        batchPrintElectronicForm() {
            if(!this.multipleSelection.length) {
                this.confirm({icon: true, text: '请选择需要打印电子面单的售后单'})
                return
            }
            // if(utils.unique(this.multipleSelection.map(val => val.deliveryWay)).length > 1) {
            //     this.confirm({title: '提示', icon: true, showCancelButton: false, confirmText: '我知道了', text: '勾选单据同时包含多种配送方式，无法批量操作。<br/>请先筛选出配送方式为普通快递-电子面单的单据，再进行批量打印电子面单。'})
            //     return;
            // }
            if(this.multipleSelection.some(val => (!val.isSupportElectronicSheet))) {
                this.confirm({ icon: true, text: '含有不支持打印电子面单的售后单，不能批量打印电子面单。'})
                return
            }
            let ids = this.multipleSelection.map(val => val.orderAfterSaleId).join(',')

            this.$router.push('/order/printingElectronicForm?ids=' + ids + '&afterSale=' + true)
        },
        onSubmit() {

        },
        resetForm(formName) {
            this.listQuery = {
                startIndex: 1,
                pageSize: 20,
                searchType: 'orderAfterSaleCode',
                searchValue: '',
                status: '',
                searchType2: 'orderAfterSaleProductNames',
                searchValue2: '',
                searchTimeType: 'send',
                orderTimeValue: '',
                receivedPhone: '',
                memberSn: '',
                orderProductName: '',
                expressCompany: '',
                receivedName: '',
                expressNos: '',
                orderAfterSaleProductNames: '',
                expressCompanys: '',
                deliveryWay: "", // 配送方式:1普通快递,2商家配送
                deliveryDate: "", //商家配送-日期
                deliveryTime: "" //商家配送-时间段
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
            this.loading = true

            params = Object.assign({}, this.listQuery, {
                cid:this.cid,
                [this.listQuery.searchType]: this.listQuery.searchValue,
                [this.listQuery.searchType2]: this.listQuery.searchValue2,
                [`${this.listQuery.searchTimeType}TimeStart`]: this.listQuery.orderTimeValue ? utils.formatDate(this.listQuery.orderTimeValue[0], "yyyy-MM-dd hh:mm:ss") : '',
                [`${this.listQuery.searchTimeType}TimeEnd`]: this.listQuery.orderTimeValue ? utils.formatDate(this.listQuery.orderTimeValue[1], "yyyy-MM-dd hh:mm:ss") : ''
            })
            this._apis.order.SendPageList(params).then((res) => {
                // console.log(res)
                this.total = +res.total
                this.tableData = res.list
                this.loading = false
            }).catch(error => {
                console.error(error)
                this.visible = false
                // this.$notify.error({
                //     title: '错误',
                //     message: error
                // });
                this.loading = false
            })
        }
    },
    components: {
        Pagination,
        DeliveryMethod,
        DialogPrintList
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
.after-sales {
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
        padding: 20px;
        padding-bottom:0;
        //margin: 0 20px;
        padding-top: 0;
        p {
            font-size: 16px;
            color: #B6B5C8;
            margin: 23px 0 20px 0;
            span {
                color: #45444c;
            }
        }
        .footer {
            padding: 20px 20px 10px 20px;
        }
    }
}
/deep/ .el-input {
    width: auto;
}
/deep/ .input-with-select .el-input__inner {
  width: 139px;
}
/deep/ .el-date-editor {
  margin-left: -6px;
  border-radius: 0 0 4px 4px;
}
/deep/ .date-picker-select .el-input__inner {
  border-radius: 4px 0 0 4px;
}
/deep/ .date-picker-select .el-input__inner:focus {
  border-color: #dcdfe6;
}
/deep/ .searchTimeType .el-input {
        width: 100px;
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
    /deep/ .el-table td, /deep/ .el-table th {
        text-align: center;
        &:nth-child(2) {
            text-align: left;
        }
    }
    /deep/ .el-table-column--selection .cell {
        padding-left: 20px;
        padding-right: 10px;
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
</style>


