<template>
    <div class="after-sales">
        <div class="search">
            <!-- <div class="top">说明：当前已开启订单自动发货，自动发货后请尽快补充物流信息，您也可以到</div> -->
            <el-form ref="form" :inline="true" :model="listQuery" class="form-inline">
                <el-form-item>
                    <el-input placeholder="请输入内容" v-model="listQuery.searchValue" class="input-with-select">
                        <el-select v-model="listQuery.searchType" slot="prepend" placeholder="请输入">
                        <el-option label="售后单编号" value="orderAfterSaleCode"></el-option>
                        <el-option label="收货人联系电话" value="receivedPhone"></el-option>
                        <el-option label="快递单号" value="expressNos"></el-option>
                        <el-option label="客户ID" value="memberSn"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="listQuery.status">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="待发货" value="3"></el-option>
                            <el-option label="待收货" value="4"></el-option>
                            <el-option label="已完成" value="5"></el-option>
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
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                    ></el-date-picker>
                </el-form-item>
                <div class="buttons">
                    <div class="lefter">
                        <el-button v-permission="['订单', '发货管理', '售后发货', '批量导入发货']" @click="$router.push('/order/batchImportAndDelivery?afterSale=true')" class="border-button">批量导入发货</el-button>
                        <el-button v-permission="['订单', '发货管理', '售后发货', '批量发货']" @click="batchSendGoods" class="border-button">批量发货</el-button>
                        <el-button v-permission="['订单', '发货管理', '售后发货', '批量打印配送订单']" class="border-button" @click="batchPrintDistributionSlip">批量打印配送单</el-button>
                        <el-button v-permission="['订单', '发货管理', '售后发货', '批量打印电子面单']" class="border-button" @click="batchPrintElectronicForm">批量打印电子面单</el-button>
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
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="orderAfterSaleCode"
                    label="售后单编号"
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
                    prop="orderAfterSaleStatus"
                    label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.status | statusFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="最新发货时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div class="operate-box">
                            <span v-permission="['订单', '发货管理', '售后发货', '查看']" @click="$router.push('/order/afterSalesDetails?id=' + scope.row.orderAfterSaleId)">查看</span>
                            <span v-permission="['订单', '发货管理', '售后发货', '发货']" v-if="scope.row.status == 2" @click="$router.push('/order/orderAfterDeliverGoods?id=' + scope.row.orderAfterSaleId + '&afterSale=' + true)">发货</span>
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
            },
            tableData: [],
            loading: false
        }
    },
    created() {
        this.getList()
    },
    computed:{
        cid(){
            let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
            return shopInfo.id
        }
    },
    filters: {
        statusFilter(code) {
            switch(+code) {
                case 1:
                    return '待退货'
                case 2:
                    return '待处理'
                case 3:
                    return '待发货'
                case 4:
                    return '待收货'
                case 5:
                    return '已完成'
            }
        },
    },
    methods: {
        batchSendGoods() {
            if(!this.multipleSelection.length) {
                this.confirm({title: '提示', icon: true, text: '请选择需要发货的售后单'})
                return
            }
            if(this.multipleSelection.some(val => val.status != 2)) {
            this.confirm({title: '提示', icon: true, text: '请选择待发货的售后单'})
                return
            }
            this.$router.push('/order/afterSaleBulkDelivery?ids=' + this.multipleSelection.map(val => val.orderAfterSaleId).join(','))
        },
        batchPrintDistributionSlip() {
            if(!this.multipleSelection.length) {
                this.confirm({title: '提示', icon: true, text: '请选择需要打印配送单的售后单'})
                return
            }
            let ids = this.multipleSelection.map(val => val.orderAfterSaleId).join(',')

            this.$router.push('/order/printDistributionSheet?ids=' + ids + '&afterSale=' + true)
        },
        batchPrintElectronicForm() {
            if(!this.multipleSelection.length) {
                this.confirm({title: '提示', icon: true, text: '请选择需要发货的售后单'})
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
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
                console.log(res)
                this.total = +res.total
                this.tableData = res.list
                this.loading = false
            }).catch(error => {
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
        Pagination
    }
}
</script>
<style lang="scss" scoped>
.after-sales {
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
/deep/ .searchTimeType .el-input {
        width: 100px;
    }
    /deep/ .searchTimeType .el-form-item__content {
        display: flex;
    }
</style>


