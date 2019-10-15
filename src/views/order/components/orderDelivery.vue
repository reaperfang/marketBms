<template>
    <div class="order-delivery">
        <div class="search">
            <!-- <div class="top">说明：当前已开启订单自动发货，自动发货后请尽快补充物流信息，您也可以到</div> -->
            <el-form ref="form" :inline="true" :model="listQuery" class="form-inline">
                <el-form-item>
                    <el-input placeholder="请输入内容" v-model="listQuery.searchValue" class="input-with-select">
                        <el-select v-model="listQuery.searchType" slot="prepend" placeholder="请输入">
                        <el-option label="订单编号" value="orderCode"></el-option>
                        <el-option label="收货人联系电话" value="receivedPhone"></el-option>
                        <el-option label="快递单号" value="expressNos"></el-option>
                        <el-option label="客户ID" value="memberSn"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="订单状态">
                    <el-select v-model="listQuery.status">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="待发货" value="3"></el-option>
                        <el-option label="部分发货" value="4"></el-option>
                        <el-option label="待收货" value="5"></el-option>
                        <el-option label="完成" value="6"></el-option>
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
                    <el-select class="date-picker-select" v-model="listQuery.searchTimeType" placeholder>
                        <el-option label="发货时间" value="send"></el-option>
                        <el-option label="下单时间" value="order"></el-option>
                    </el-select>
                    <el-date-picker
                        v-model="listQuery.orderTimeValue"
                        :picker-options="pickerBeginDateBefore"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                    ></el-date-picker>
                </el-form-item>
                <div class="buttons">
                    <div class="lefter">
                        <el-button v-permission="['订单', '发货管理', '订单发货', '批量导入发货']" class="border-button" @click="$router.push('/order/batchImportAndDelivery')">批量导入发货</el-button>
                        <el-button v-permission="['订单', '发货管理', '订单发货', '批量发货']" class="border-button" @click="batchSendGoods">批量发货</el-button>
                        <el-button v-permission="['订单', '发货管理', '订单发货', '批量打印配送订单']" class="border-button" @click="batchPrintDistributionSlip">批量打印配送单</el-button>
                        <el-button v-permission="['订单', '发货管理', '订单发货', '批量打印电子面单']" class="border-button" @click="batchPrintElectronicForm">批量打印电子面单</el-button>
                    </div>
                    <div class="righter">
                        <span @click="resetForm('form')" class="resetting pointer">重置</span>
                        <el-button @click="getList" type="primary">搜 索</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="content">
            <p>已选择 {{multipleSelection.length}} 项，全部{{total}}项</p>
            <el-table
                v-loading="loading"
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                :header-cell-style="{background:'#ebeafa', color:'#655EFF'}">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="isAutoSend"
                    label=""
                    width="40">
                    <template slot-scope="scope">
                        <el-tooltip v-if="scope.row.isAutoSend" content="自动发货" placement="bottom" effect="light">
                            <i class="auto"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="orderCode"
                    label="订单编号"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="memberSn"
                    label="客户ID"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="receivedName"
                    label="收货人">
                </el-table-column>
                <el-table-column
                    prop="receivedPhone"
                    label="收货人电话">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.status | statusFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="最新发货时间"
                    width="170">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div class="operate-box">
                            <span v-permission="['订单', '发货管理', '订单发货', '查看']" @click="$router.push('/order/orderDetail?id=' + scope.row.orderId)">查看</span>
                            <template v-if="scope.row.status == 4">
                                <span v-permission="['订单', '发货管理', '订单发货', '继续发货']" @click="$router.push('/order/deliverGoods?id=' + scope.row.orderId)">继续发货</span>
                            </template>
                            <template v-else-if="scope.row.status == 3">
                                <span v-permission="['订单', '发货管理', '订单发货', '发货']" v-if="!scope.row.isFillUp" @click="$router.push('/order/deliverGoods?id=' + scope.row.orderId)">发货</span>
                                <span v-else @click="$router.push('/order/supplementaryLogistics?id=' + scope.row.orderId)">补填物流</span>
                            </template>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.startIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
        </div>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import utils from "@/utils";

export default {
    data() {

        return {
            multipleSelection: [],
            multipleTable: [
                {}
            ],
            total: 0,
            listQuery: {
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
            },
            tableData: [],
            loading: false,
            express: false
        }
    },
    filters: {
        statusFilter(code) {
            switch(code) {
                case 3:
                    return '待发货'
                case 4:
                    return '部分发货'
                case 5:
                    return '待收货'
                case 6:
                    return '完成'
            }
        },
    },
    created() {
        this.getList()
        this.$nextTick(() => {
      this.pickerBeginDateBefore = {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        }
      };
    })
    this.checkExpress()
    },
    computed:{
        cid(){
            let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
            return shopInfo.id
        }
    },
    methods: {
        checkExpress() {
        this._apis.order
            .checkExpress()
            .then(res => {
            this.express = res;
            })
            .catch(error => {
            this.visible = false;
            this.$notify.error({
                title: "错误",
                message: error
            });
            });
        },
        pickerBeginDateBefore (time) {
            
        },
        batchSendGoods() {
            if(!this.multipleSelection.length) {
                this.confirm({title: '提示', icon: true, text: '请先勾选当前页需要批量发货的单据。'})
                return
            }
            if(this.multipleSelection.some(val => val.status != 3 && val.status != 4)) {
            this.confirm({title: '提示', icon: true, text: '勾选单据包含已完成发货或已关闭的单据，无法批量发货，请重新选择。'})
                return
            }
            if(this.multipleSelection.some(val => val.isFillUp)) {
            this.confirm({title: '提示', icon: true, text: '勾选单据包含已完成发货或已关闭的单据，无法批量发货，请重新选择。'})
                return
            }
            this.$router.push('/order/orderBulkDelivery?ids=' + this.multipleSelection.map(val => val.orderId).join(','))
        },
        batchPrintElectronicForm() {
            if(this.express) {
                this.confirm({title: '提示', icon: true, text: '不支持打印电子面单。'})
                return
            }
            if(!this.multipleSelection.length) {
                this.confirm({title: '提示', icon: true, text: '请先勾选当前页需要批量打印电子面单的单据。'})
                return
            }
            if(this.multipleSelection.filter(val => val.isAutoSend).some(val => val.isFillUp == 1)) {
                this.confirm({title: '提示', icon: true, text: '自动发货订单，未填报物流信息，不能批量打印电子面单。'})
                return
            }
            if(this.multipleSelection.filter(val => !val.isAutoSend).some(val => (val.status != 4 && val.status != 5 && val.status != 6))) {
                this.confirm({title: '提示', icon: true, text: '没有完成发货，不能批量打印电子面单。'})
                return
            }

            let ids = this.multipleSelection.map(val => val.orderId).join(',')

            this.$router.push('/order/printingElectronicForm?ids=' + ids)
        },
        batchPrintDistributionSlip() {
            if(!this.multipleSelection.length) {
                this.confirm({title: '提示', icon: true, text: '请先勾选当前页需要批量打印配送单的单据。'})
                return
            }
            if(this.multipleSelection.some(val => val.status == 3)) {
                this.confirm({title: '提示', icon: true, text: '勾选订单包含未发货或未付款订单，无法批量打印；请重新勾选已发货订单批量打印配送单。'})
                return
            }
            let ids = this.multipleSelection.map(val => val.id).join(',')

            this.$router.push('/order/printDistributionSheet?ids=' + ids)
        },
        onSubmit() {

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
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
                this.loading = false
            })
        }
    },
    components: {
        Pagination
    }
}
</script>
<style lang="scss" scoped>
.order-delivery {
    .search {
        background-color: #fff;
        .top {
            background-color: rgb(255, 247, 238);
            color: rgb(254, 121, 95);
            height: 44px;
            line-height: 44px;
            padding: 0 20px;
        }
        .form-inline {
            padding: 20px;
        }
        .buttons {
            display: flex;
            justify-content: space-between;
            .resetting {
                color: #FD932B;
                margin-right: 40px;
            }
        }
    }
    .content {
        background-color: #fff;
        padding: 20px;
        p {
            font-size: 16px;
            color: #B6B5C8;
            margin: 23px 0 20px 0;
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
.auto {
        display: inline-block;
        width: 28px;
        height: 16px;
        background: url(../../../assets/images/order/auto.png) no-repeat;
        position: relative;
        top: 3px;
        margin-right: 5px;
    }
    /deep/ .searchTimeType .date-picker-select .el-input {
        width: 100px;
    }
    /deep/ .searchTimeType .el-form-item__content {
        display: flex;
    }
</style>


