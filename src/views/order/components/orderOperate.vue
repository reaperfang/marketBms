<template>
    <div class="operate-record">
        <p class="header">操作记录</p>
        <el-table :data="orderDetail.orderOperationRecordList" style="width: 100%" :header-cell-style="{background:'#ebeafa', color:'#655EFF'}">
            <el-table-column label="操作" width="180">
                <template slot-scope="scope"> {{scope.row.operationType | operationTypeFilter}} </template>
            </el-table-column>
            <el-table-column prop="createUserName" label="操作人" width="180"> </el-table-column>
            <el-table-column prop="createTime" label="操作时间"> </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    data() {
        return {}
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
    methods: {}
}
</script>
<style lang="scss" scoped>
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
 .goods-detail {
    display: flex;
    align-items: center;
}
.image-box {
    margin-right: 5px;
}
</style>


