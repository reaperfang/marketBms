<template>
    <div class="reviews">
        <div class="search">
            <el-form ref="form" :inline="true" :model="listQuery" class="form-inline">
                <el-form-item label="订单编号">
                    <el-input v-model="listQuery.orderCode" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input v-model="listQuery.goodsName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="评价时间">
                    <el-date-picker
                        v-model="listQuery.orderDate"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="listQuery.auditStatus">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="待审核" value="0"></el-option>
                        <el-option label="审核通过" value="1"></el-option>
                        <el-option label="审核未通过" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="精选评价">
                    <el-select v-model="listQuery.isChoiceness">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getList" type="primary">查询</el-button>
                    <el-button class="border-button" @click="resetForm('form')">重置</el-button>
                </el-form-item>
                <!-- <div class="buttons" style="display: inline-block; float: right;">
                    <div class="lefter">
                    </div>
                    <div class="righter">
                        <el-button @click="getList" type="primary">搜索</el-button>
                        <el-button class="border-button" @click="resetForm('form')">重置</el-button>
                    </div>
                </div> -->
                <div style="clear: both;"></div>
            </el-form>
        </div>
        <div class="content">
            <div class="content-header">
                <p class="statistics">已选择<span>{{multipleSelection.length}}</span>项，全部<span>{{total}}</span>项</p>
                <el-button v-permission="['订单', '评价管理', '默认页面', '敏感词设置']" @click="$router.push('/order/sensitiveWords')" class="border-button">敏感词设置</el-button>
            </div>
            <div class="table-box">
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
                    <!-- <el-table-column
                        prop="isChoiceness"
                        label="全部"
                        width="120"
                        :filters="[{ text: '精选', value: 1 }, { text: '普通', value: 0 }]"
                        :filter-method="filterTag"
                        filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.isChoiceness == 1" color="#FF4B1C">{{scope.row.isChoiceness | isChoicenessFilter}}</el-tag>
                        </template>
                    </el-table-column> -->
                    <el-table-column
                        prop="goodsName"
                        label="商品名称"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="starNum"
                        label="评价星级"
                        width="120"
                        :filters="[{ text: '1星', value: 1 }, { text: '2星', value: 2 }, { text: '3星', value: 3 }, { text: '4星', value: 4 }, { text: '5星', value: 5 }]"
                        :filter-method="filterStar"
                        filter-placement="bottom-end">
                        <template slot-scope="scope">
                            {{scope.row.starNum}}星
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="orderCode"
                        label="订单编号">
                    </el-table-column>
                    <el-table-column
                        prop="memberName"
                        label="用户昵称">
                    </el-table-column>
                    <el-table-column
                        prop="auditStatus"
                        label="状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.auditStatus | auditStatusFilter}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="isReply"
                        label="回复"
                        :filters="[{ text: '是', value: 1 }, { text: '否', value: 0 }]"
                        :filter-method="replyFilterTag"
                        filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <span>{{scope.row.isReply | isReplyFilter}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="评价时间">
                    </el-table-column>
                    <el-table-column label="操作" width="150px">
                        <template slot-scope="scope">
                            <div class="operate-box">
                                <span v-permission="['订单', '评价管理', '默认页面', '审核']" v-if="scope.row.auditStatus == 0" class="blue" @click="currentDialog = 'AuditDialog'; title='审核'; batch = false; currentData = scope.row; dialogVisible = true">审核</span>
                            <!-- <span class="blue" @click="setChoiceness(scope.row)">{{scope.row.isChoiceness == 1 ? '取消精选' : '设为精选'}}</span> -->
                            <template v-if="scope.row.auditStatus == 1 && scope.row.isChoiceness == 1">
                                <span v-permission="['订单', '评价管理', '默认页面', '取消精选']" class="blue" @click="setChoiceness(scope.row)">取消精选</span>
                            </template>
                            <template v-if="scope.row.auditStatus == 1 && !scope.row.isChoiceness">
                                <span v-permission="['订单', '评价管理', '默认页面', '设为精选']" class="blue" @click="setChoiceness(scope.row)">设为精选</span>
                            </template>
                            <span v-permission="['订单', '评价管理', '默认页面', '查看']" @click="$router.push({ path: '/order/reviewsDetail?id=' +  scope.row.id})" class="blue">查看</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="!loading" class="footer">
                <el-checkbox :indeterminate="isIndeterminate" @change="checkedAllChange" v-model="checkedAll">全选</el-checkbox>
                <el-button v-permission="['订单', '评价管理', '默认页面', '批量审核']" @click="batchAudit" class="border-button">批量审核</el-button>
                <el-button v-permission="['订单', '评价管理', '默认页面', '批量回复']" @click="batchReply" class="border-button">批量回复</el-button>
            </div>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.startIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
        </div>
        <component :is="currentDialog" :dialogVisible.sync="dialogVisible" @submit="onSubmit" @audit="auditSubmit" :title="title"></component>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import BatchReplyDialog from '@/views/order/dialogs/batchReplyDialog'
import AuditDialog from '@/views/order/dialogs/auditDialog'
import utils from "@/utils";

export default {
    data() {
        return {
            orderStateList: [
                {
                    label: '全部',
                    value: ''
                },
                {
                    label: '待处理',
                    value: '待处理'
                },
                {
                    label: '部分发货',
                    value: '部分发货'
                },
                {
                    label: '已收货',
                    value: '已收货'
                },
                {
                    label: '全部发货',
                    value: '全部发货'
                },
                {
                    label: '已拒收',
                    value: '已拒收'
                },
                {
                    label: '已关闭',
                    value: '已关闭'
                },
            ],
            multipleSelection: [],
            multipleTable: [
                
            ],
            total: 0,
            listQuery: {
                startIndex: 1,
                pageSize: 20,
                orderCode: '', // 订单号
                goodsName: '', // 商品名称
                orderDate: '',
                createTimeStart: '', // 评论查询开始时间
                creaTetimeEnd: '', // 评论查询结束时间
                auditStatus: '', // 审核状态
                starNum: '', // 星级数量
                isChoiceness: 0
            },
            tableData: [
                
            ],
            currentDialog: '',
            currentData: {},
            dialogVisible: false,
            title: '',
            batch: false,
            loading: false,
            checkedAll: false,
            isIndeterminate: false
        }
    },
    created() {
        this.getList()
    },
    filters: {
        isChoicenessFilter(code) {
            if(code == 1) {
                return '精选'
            }
        },
        isReplyFilter(code) {
            if(code == 0) {
                return '否'
            } else if(code == 1) {
                return '是'
            }
        },
        auditStatusFilter(code) {
            if(code == 0) {
                return '待审核'
            } else if(code == 1) {
                return '审核通过'
            } else if(code == 2) {
                return '审核未通过'
            }
        }
    },
    methods: {
        checkedAllChange() {
            if(this.checkedAll) {
                this.$refs.multipleTable.clearSelection();
                this.$refs.multipleTable.toggleAllSelection();
            } else {
                this.$refs.multipleTable.clearSelection();
            }
            this.isIndeterminate = false;
        },
        auditSubmit(value) {
            let params = {auditStatus: +value}
            let ids = this.multipleSelection.map(val => +val.id) 

            if(this.batch) {
                params.ids = ids
            } else {
                params.ids = [+this.currentData.id]
            }
            this._apis.order.orderCommentAuth(params).then((res) => {
                this.getList()
                this.visible = false
                this.$message.success('审核成功！');
            }).catch(error => {
                this.visible = false
                this.$message.error(error);
            })
        },
        setChoiceness(row) {
            this._apis.order.setChoiceness({id: row.id, isChoiceness: row.isChoiceness == 1 ? 0 : 1}).then((res) => {
                let message = ''

                if(row.isChoiceness == 1) {
                    message = '取消'
                } else {
                    message = '设置'
                }
                this.getList()
                this.visible = false
                this.$message.success(`${message}成功！`);
            }).catch(error => {
                this.visible = false
                this.$message.error(error);
            })
        },
        onSubmit(value) {
            console.log(value)
            this._apis.order.replyComment({ids: this.multipleSelection.map(val => val.id), replyContent: value}).then((res) => {
                // this.$message.success('批量回复成功！');
                this.getList()
                this.confirm({title: '提示', iconSuccess: true, text: '批量回复成功。', confirmText: '我知道了', showCancelButton: false, showConfirmButton: false})
            }).catch(error => {
                this.$message.error(error);
            })
        },
        batchAudit() {
            if(!this.multipleSelection.length) {
                this.confirm({title: '提示', icon: true, text: '请先勾选当前页需要批量审核的评论', confirmText: '知道了'})
                return
            } else {
                if(this.multipleSelection.filter(val => val.auditStatus != 0).length) {
                    this.confirm({title: '提示', icon: true, text: '勾选的评论中包含已审核的数据，无法批量回复，请重新选择。', confirmText: '知道了'})

                    return
                }
            }

            this.currentDialog = 'AuditDialog'
            this.title = '批量审核'
            this.batch = true
            this.dialogVisible = true
        },
        batchReply() {
            if(!this.multipleSelection.length) {
                this.confirm({title: '提示', icon: false, text: '请先勾选当前页需要批量回复的评论', confirmText: '我知道了', showCancelButton: false})
                return
            } else {
                if(this.multipleSelection.filter(val => val.isReply).length) {
                    this.confirm({title: '提示', icon: false, text: '勾选的评论中包含已回复的数据，无法批量回复，请重新选择。', confirmText: '我知道了', showCancelButton: false})

                    return
                }
            }

            this.currentDialog = 'BatchReplyDialog'
            this.title = '批量回复'
            this.dialogVisible = true
        },
        resetForm(formName) {
            this.listQuery = Object.assign({}, this.listQuery, {
                orderCode: '',
                goodsName: '',
                orderDate: '',
                createTimeStart: '',
                creaTetimeEnd: '',
                auditStatus: '',
                starNum: '',
            })
            this.getList()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            let checkedCount = val.length;
            this.checkedAll = checkedCount === this.tableData.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length;
        },
        filterTag(value, row) {
            return row.isChoiceness === value;
        },
        replyFilterTag(value, row) {
            return row.isReply == +value;
        },
        filterStar(value, row) {
            return row.starNum === +value;
        },
        getList(param) {
            this.loading = true
            let _param
            
            _param = Object.assign({}, this.listQuery, param, {
                createTimeStart: this.listQuery.orderDate[0] ? utils.formatDate(new Date(this.listQuery.orderDate[0] * 1), "yyyy-MM-dd hh:mm:ss") : '',
                creaTetimeEnd: this.listQuery.orderDate[1] ? utils.formatDate(new Date(this.listQuery.orderDate[1] * 1), "yyyy-MM-dd hh:mm:ss") : ''
            })

            this._apis.order.getCommentList(_param).then((res) => {
                this.total = +res.total
                res.list.forEach(val => {
                    if(!val.isChoiceness) {
                        val.isChoiceness = 0
                    }
                })
                this.tableData = res.list
                this.loading = false
            }).catch(error => {
                this.loading = false
            })
        },
    },
    components: {
        Pagination,
        BatchReplyDialog,
        AuditDialog
    }
}
</script>
<style lang="scss" scoped>
.search {
    /deep/ .el-form-item__label {
        padding-right: 8px;
    }
    /deep/ .el-form--inline .el-form-item {
        margin-right: 26px;
        .el-button+.el-button {
            margin-left: 16px;
        }
    }
}
.reviews {
    .search {
        background-color: #fff;
        .form-inline {
            padding: 20px;
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
    .content {
        background-color: #fff;
        padding: 20px;
        margin-top: 20px;
        p {
            font-size: 16px;
            color: #B6B5C8;
            margin: 23px 0 20px 0;
            span {
                color: rgb(76, 75, 83);
            }
        }
        .footer {
            padding: 20px;
            padding-left: 15px;
        }
    }
}
/deep/ .el-input {
    width: auto;
}
/deep/ .el-table__column-filter-trigger .el-icon-arrow-down:before {
    content: '';
}
/deep/ .el-table__column-filter-trigger {
    margin-left: 8px;
}
/deep/ .el-table__column-filter-trigger .el-icon-arrow-down {
    width: 10px;
    height: 10px;
    background: url(../../assets/images/order/filter.png);
}
/deep/ .el-tag {
    color: #fff;
    padding-left: 2px;
    padding-right: 2px;
}
.content-header {
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
</style>


