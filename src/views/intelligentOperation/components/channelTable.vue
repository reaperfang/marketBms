/* 会员分析列表 */
<template>
    <div>
        <el-table
            :data="listObj.list"
            style="width: 100%"
            :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
            :default-sort = "{prop: 'changeRatio', order: 'descending'}"
            @sort-change="changeSort"
            v-loading="loading1"
        >
            <el-table-column
                width="180"
                type="index"
                label="排序"
                align="left">
            </el-table-column>
            <el-table-column
                prop="chanelName"
                label="渠道类型"
                align="center"
            >
            <template slot-scope="scope">
                <span>{{ scope.row.chanelName ? scope.row.chanelName : '直接购买' }}</span>
            </template>
            </el-table-column>
            <el-table-column
                prop="activityName"
                label="（活动）名称"
                align="center"
            >
            <template slot-scope="scope">
                <span>{{ scope.row.chanelName ? scope.row.activityName : '-' }}</span>
            </template>
            </el-table-column>
            <el-table-column
                prop="changeRatio"
                label="支付转化率"
                align="right"
                sortable
            >
            <template slot-scope="scope">
                <span>{{ (scope.row.changeRatio*100).toFixed(2)}}%</span>
            </template>
            </el-table-column>
        </el-table>
        <div class="page_styles">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="prev, pager, next, sizes"
                :total="listObj.totalSize"
                :background="true">
            </el-pagination>
        </div>
    </div>
</template>

<script type='es6'>
import TableBase from "@/components/TableBase";
export default {
    name: "channelTable",
    extends: TableBase,
    props:['listObj','background', 'loading'],
    data() {
        return {
            pageSize:10,
            loading1: true
        };
    },
    created() {
    },
    watch: {
        loading(newValue) {
            this.loading1 = newValue;
        }
    },
    methods: {
        //更改每页条数
        handleSizeChange(val){
            this.pageSize = val;
            this.$emit('sizeChange',val)
        },
        //选择页数
        handleCurrentChange(val){
            console.log(val)
            this.$emit('currentChange',val)
        },
        //支付转化率排序
        changeSort(val){
            this.$emit('changeSort',val)
        },    
    },
    filters:{
        //时间戳过滤
        time:function(value) {
            let date = new Date(value)
            let Y = date.getFullYear() + '-'
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
            let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
            let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
            let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + '' : date.getMinutes()
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            return Y + M + D + h + m
        }
    },
    components: {}
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .cell{
    .btns{
        span{
            color: #655EFF;
            margin-right: 5px;
        }
    }
}
/deep/.el-table .descending .sort-caret.descending{
  border-top-color:#44434B;
}
/deep/.el-table .ascending .sort-caret.ascending{
  border-bottom-color:#44434B;
}
/deep/ .el-table--small td, /deep/.el-table--small th{
  padding:8px 10px;
}
.page_styles {
    margin: 40px 0 30px 0;
}
</style>
