<template>
    <div class="after-sales">
        <div class="search">
            <el-form ref="form" :inline="true" :model="listQuery" class="form-inline input_style">
                <el-form-item>
                    <el-input placeholder="请输入内容" v-model="listQuery.searchValue" class="input-with-select">
                        <el-select v-model="listQuery.searchType" slot="prepend" placeholder="请输入">
                            <el-option label="售后单编号" value="code"></el-option>
                            <el-option label="订单编号" value="orderCode"></el-option>
                            <el-option label="用户昵称" value="memberName"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="申请时间">
                    <el-date-picker
                        v-model="listQuery.applicationDate"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="utils.globalTimePickerOption.call(this)">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="售后类型">
                    <el-select v-model="listQuery.type">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="退货退款" value="1"></el-option>
                        <el-option label="换货" value="2"></el-option>
                        <el-option label="仅退款" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="listQuery.orderAfterSaleStatus">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="待审核" value="0"></el-option>
                        <el-option label="待退货" value="1"></el-option>
                        <el-option label="待处理" value="2"></el-option>
                        <el-option label="待收货" value="3"></el-option>
                        <el-option label="已完成" value="4"></el-option>
                        <el-option label="已关闭" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="search" type="primary">查询</el-button>
                    <el-button class="border-button" @click="resetForm('form')">重置</el-button>
                </el-form-item>
                <!-- <div class="buttons" style="display: inline-block; float: right;">
                    <div class="righter">
                        <el-button @click="getList" type="primary">搜索</el-button>
                        <el-button class="border-button" @click="resetForm('form')">重置</el-button>
                    </div>
                </div> -->
            </el-form>
        </div>
        <div class="line"></div>
        <div class="content" v-calcMinHeight="211">
            <div class="export-header">
                <p>已选择 <span>{{multipleSelection.length}}</span> 项，全部<span>{{total}}</span>项</p>
                <el-tooltip class="item" effect="dark" content="当前最多支持导出1000条数据" placement="top">
                <el-button style="margin-top: -20px;" v-permission="['订单', '售后管理', '默认页', '导出']" class="border-button" @click="exportOrder">导出</el-button>
                </el-tooltip>
            </div>
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
                    prop="code"
                    label="售后单编号"
                    fixed="left"
                    class-name="table-padding"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="type"
                    align="center"
                    label="售后类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.type | orderAfterSaleType}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="orderCode"
                    label="订单编号"
                    align="center"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="memberName"
                    align="center"
                    label="用户昵称">
                </el-table-column>
                <el-table-column
                    prop="orderAfterSaleStatus"
                    align="center"
                    label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.orderAfterSaleStatus | orderAfterSaleStatusFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="申请时间"
                    align="center"
                    width="160">
                </el-table-column>
                <el-table-column label="操作" :width="operationColumnW" fixed="right" align="left" header-align="center" class-name="table-padding">
                    <template slot-scope="scope">
                        <div class="operate-box table-operate">
                            <span v-permission="['订单', '售后管理', '默认页', '查看']" class="table-btn" @click="$router.push(`/order/afterSalesDetails?id=${scope.row.id}&afterSale=true`)">查看</span>
                            <span v-permission="['订单', '售后管理', '默认页', '同意']" class="table-btn" v-if="scope.row.orderAfterSaleStatus == 0" @click="updateStatus(scope.row)">同意</span>
                            <span v-permission="['订单', '售后管理', '默认页', '拒绝']" class="table-btn" v-if="scope.row.orderAfterSaleStatus == 0" @click="updateRejectStatus(scope.row)">拒绝</span>
                            <span v-permission="['订单', '售后管理', '默认页', '查看物流']" class="table-btn" @click="showLogistics(scope.row)" v-if="scope.row.orderAfterSaleStatus == 2 && scope.row.type != 3 && scope.row.exchangeConfirmation == 1 && scope.row.deliveryWay == 1">查看物流</span>
                            <span v-show="!authHide" v-permission="['订单', '售后管理', '默认页', '确认收货']" class="table-btn" @click="confirmReceived(scope.row)" v-if="scope.row.exchangeConfirmation ==1  &&  (scope.row.isSellerReceived == 0)">确认收货</span><!-- scope.row.orderAfterSaleStatus == 2 && !scope.row.isSellerReceived && scope.row.type != 3 && scope.row.exchangeConfirmation == 1 -->
                            <span v-permission="['订单', '售后管理', '默认页', '退款']" class="table-btn" @click="drawback(scope.row)" v-if="scope.row.orderAfterSaleStatus == 2 && scope.row.type != 2">退款</span>
                            <span v-show="!authHide" class="table-btn" @click="$router.push(`/order/orderAfterDeliverGoods?id=${scope.row.id}&afterSale=true`)" v-if="scope.row.orderAfterSaleStatus == 2 && scope.row.type == 2">发货</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-show="!loading" class="footer table-select">
                <el-checkbox :indeterminate="isIndeterminate" @change="checkedAllChange" v-model="checkedAll">全选</el-checkbox>
                <el-button v-permission="['订单', '售后管理', '默认页', '批量审核']" class="border-button" @click="batchUpdateStatus">批量审核</el-button>
            </div>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.startIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
        </div>
        <component ref="sunComponent" v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @submit="onSubmit" :title="title" @reject="rejectHandler" @confirm="confirmHandler" :data="currentData" :expressNo="expressNo" :expressCompanys="expressCompanys" :updateStatusDisabled.sync="updateStatusDisabled"></component>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import RejectDialog from '@/views/order/dialogs/rejectDialog'
import AuditDialog from '@/views/order/dialogs/auditDialog'
import BatchUpdateStatusDialog from '@/views/order/dialogs/batchUpdateStatusDialog'
import ExchangeGoodsDialog from '@/views/order/dialogs/exchangeGoodsDialog'
import LogisticsDialog from '@/views/order/dialogs/logisticsDialog'
import utils from "@/utils";
import anotherAuth from '@/mixins/anotherAuth'
import { afterSalesManagementMethods } from '@/views/order/mixins/afterSalesManagementMixin'

export default {
    mixins: [anotherAuth, afterSalesManagementMethods],
    data() {
        return {
            orderNumberTypeList: [
                {
                    label: '订单编号',
                    value: '订单编号'
                },
                {
                    label: '收货人联系电话',
                    value: '收货人联系电话'
                },
                {
                    label: '快递单号',
                    value: '快递单号'
                },
                {
                    label: '用户ID',
                    value: '用户ID'
                },
            ],
            afterSalesTypeList: [
                {
                    label: '全部',
                    value: ''
                },
                {
                    label: '退货退款',
                    value: '退货退款'
                },
                {
                    label: '换货',
                    value: '换货'
                },
                {
                    label: '仅退款',
                    value: '仅退款'
                },
            ],
            multipleSelection: [],
            multipleTable: [
                
            ],
            total: 0,
            tableData: [],
            listQuery: {
                startIndex: 1,
                pageSize: 20,
                searchValue: '',
                searchType: 'code',
                applicationDate: '',
                orderAfterSaleStatus: '',
                type: ''
            },
            currentDialog: '',
            dialogVisible: false,
            title: '',
            currentData: '',
            loading: false,
            checkedAll: false,
            isIndeterminate: false,
            expressCompanys: '',
            expressNo: '',
            operationColumnW: 72 //操作列宽度
        }
    },
    created() {
        if(typeof this.$route.query.orderAfterSaleStatus != 'undefined') {
            this.listQuery = Object.assign({}, this.listQuery, {orderAfterSaleStatus: this.$route.query.orderAfterSaleStatus})
        }
        this.getList()
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
        showLogistics(row) {
            this.expressNo = row.returnExpressNo
            this.expressCompanys = row.returnExpressName
            this._apis.order.orderLogistics({expressNo: row.returnExpressNo, id: row.id, isOrderAfter: 1}).then(res => {
                this.currentDialog = 'LogisticsDialog'
                this.currentData = {
                    traces: res.traces || [],
                    deliveryWay: 1
                }
                this.dialogVisible = true
            }).catch(error => {
                this.$message.error(error);
            }) 
        },
        exportOrder() {
            var _param
            var __param
            
            _param = Object.assign({}, this.listQuery, {
                [this.listQuery.searchType]: this.listQuery.searchValue,
                createTimeStart: this.listQuery.applicationDate && this.listQuery.applicationDate.length ? utils.formatDate(this.listQuery.applicationDate[0], "yyyy-MM-dd hh:mm:ss") : '',
                createTimeEnd: this.listQuery.applicationDate && this.listQuery.applicationDate.length ? utils.formatDate(this.listQuery.applicationDate[1], "yyyy-MM-dd hh:mm:ss") : '',
                //ids: this.multipleSelection.map(val => val.id),
                isExport: 0
            })
            if(this.multipleSelection.length) {
              _param = Object.assign({}, _param, {
                ids: this.multipleSelection.map(val => val.id)
              })
            }
           this._apis.order.orderAfterSaleExport(_param).then((res) => {
                // console.log(res)
                if(res > 1000) {
                    this.confirm({icon: true, text: '导出数据量超出1000条，建议分时间段导出。<br />点击确定导出当前筛选下的前1000条数据<br />点击取消请重新筛选'}).then(() => {
                        _param.isExport = 1
                        this._apis.order
                        .orderAfterSaleExport(_param)
                        .then(res => {
                            window.location.href = res
                            this.$message.success('导出成功！');
                        })
                        .catch(error => {
                            this.$message.error(error);
                        });
                    })
                } else {
                    window.location.href = res
                    this.$message.success('导出成功！');
                }
            }).catch(error => {
                this.$message.error(error);
            }) 
        },
        batchUpdateStatus() {
            if(!this.multipleSelection.length) {
                this.confirm({ icon: true, text: '请勾选需要批量审核的售后单', showCancelButton: false, confirmText: '我知道了'})
                return
            } else {
                if(this.multipleSelection.filter(val => val.orderAfterSaleStatus != 0).length) {
                    this.confirm({icon: true, text: '选择的数据中包含已经审核过的售后单， 无法批量审核，请重新选择', showCancelButton: false, confirmText: '我知道了'})
                    return
                }
            }

            this.currentDialog = 'BatchUpdateStatusDialog'
            this.title = '批量审核'
            this.dialogVisible = true
        },
        onSubmit(value) {
            // console.log(value)
            if(value.status == 1) {
                // 通过
                if(this.multipleSelection.some(val => val.type == 2)) {
                    this.currentDialog = 'ExchangeGoodsDialog'
                    this.currentData = {id: this.multipleSelection.map(val => val.id).join(','), type: 2}
                    this.dialogVisible = true
                    return
                } else {
                    this._apis.order.orderAfterSaleUpdateStatus({ids: this.multipleSelection.map(val => val.id), orderAfterSaleStatus: 1}).then((res) => {
                        // console.log(res)
                        this.getList()
                        this.$message.success('审核成功！');
                        this.$refs['sunComponent'].visible = false
                    }).catch(error => {
                        this.$message.error(error);
                    })
                }
            } else {
                this._apis.order.orderAfterSaleUpdateStatus({ids: this.multipleSelection.map(val => val.id), orderAfterSaleStatus: 5, refuseReason: value.refuseReason}).then((res) => {
                    // console.log(res)
                    this.getList()
                    this.$message.success('拒绝审核成功！');
                }).catch(error => {
                    this.$message.error(error);
                })
            }
        },
        // 换货确认
        confirmHandler(value) {
            this._apis.order.orderAfterSaleConfirmExchange({id: this.currentData.id, exchangeConfirmation: value.exchangeConfirmation}).then((res) => {
                this.$message.success('换货确认成功！');
            }).catch(error => {
                this.$message.error(error);
            })
        },
        resetForm(formName) {
            this.listQuery = {
                startIndex: 1,
                pageSize: 20,
                searchValue: '',
                searchType: 'code',
                applicationDate: '',
                orderAfterSaleStatus: '',
                type: ''
            }
            this.getList()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            let checkedCount = val.length;
            this.checkedAll = (checkedCount === this.tableData.length) && (checkedCount !== 0);
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length;
        },
        getList(param) {
            this.loading = true
            let _param
            
            _param = Object.assign({}, this.listQuery, param, {
                [this.listQuery.searchType]: this.listQuery.searchValue,
                createTimeStart: this.listQuery.applicationDate && this.listQuery.applicationDate.length ? utils.formatDate(this.listQuery.applicationDate[0], "yyyy-MM-dd hh:mm:ss") : '',
                createTimeEnd: this.listQuery.applicationDate && this.listQuery.applicationDate.length ? utils.formatDate(this.listQuery.applicationDate[1], "yyyy-MM-dd hh:mm:ss") : ''
            })

            this._apis.order.getOrderAfterSalePageList(_param).then((res) => {
                this.total = +res.total
                this.tableData = res.list
                this.loading = false
            }).catch(error => {
                console.error(error)
                this.loading = false
            })
        },
    },
    components: {
        Pagination,
        RejectDialog,
        AuditDialog,
        BatchUpdateStatusDialog,
        ExchangeGoodsDialog,
        LogisticsDialog
    }
}
</script>
<style lang="scss" scoped>
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
        border-radius: 4px;
        .form-inline {
            padding: 20px 20px 2px 20px;
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
        padding-top: 23px;
        border-radius: 4px;
        p {
            font-size: 16px;
            color: #B6B5C8;
            margin: 0 0 20px 0;
            span {
                color: #45444c;
            }
        }
        .footer {
            padding: 20px 20px 10px 20px;
        }
    }
}
.export-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
/deep/ .el-table tr th {
    border-bottom: none;
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
/deep/ .el-date-editor{
    border-top-left-radius: 1;
    border-bottom-left-radius: 1;
}
</style>


