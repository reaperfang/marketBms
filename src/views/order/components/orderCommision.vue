<template>
    <div>
   <el-table :data="orderDetail.orderItems" style="width: 100%" :header-cell-style="{background:'#ebeafa', color:'#655EFF'}">
        <el-table-column label="商品" width="380">
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
        <el-table-column label="分佣员姓名" width="180">
            <template><p class="line-height" v-for="item in resellerInfoList">{{item.resellerName}}</p></template>
        </el-table-column>
        <el-table-column label="手机号">
            <template><p class="line-height" v-for="item in resellerInfoList">{{item.resellerPhone}}</p></template>
        </el-table-column>
        <el-table-column label="分佣比例">
            <template><p class="line-height" v-for="item in resellerInfoList">{{item.resellerSettlementScale}}%</p></template>  
        </el-table-column>
        <el-table-column label="分佣金额">
            <template><p class="line-height" v-for="item in resellerInfoList">¥{{item.resellerSettlementMoney}}</p></template>  
        </el-table-column>
        <el-table-column label="分佣状态" class-name="goods-status">
            <template><p class="line-height" v-for="item in resellerInfoList">{{item.status ? '已结算' : '未结算'}}</p></template>  
        </el-table-column>
    </el-table>
</div>
</template>
<script>
export default {
    data() {
        return {
            // resellerInfoList: [
            //     { resellerName: 123, resellerPhone: '13134478776', resellerLevel: 1, resellerSettlementScale: '8', resellerSettlementMoney: 12.34, status: 0 },
            //     { resellerName: 1234, resellerPhone: '13134478777', resellerLevel: 2, resellerSettlementScale: '8', resellerSettlementMoney: 12.34, status: 1 },
            //     { resellerName: 1235, resellerPhone: '13134478778', resellerLevel: 3, resellerSettlementScale: '8', resellerSettlementMoney: 12.34, status: 1 },
            // ]
        }
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
/deep/ .el-table .cell {
    text-align: center;
}
.line-height {
    line-height: 3;
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
 .goods-detail {
    display: flex;
    align-items: center;
}
.image-box {
    margin-right: 5px;
}
</style>


