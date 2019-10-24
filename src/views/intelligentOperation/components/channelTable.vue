/* 会员分析列表 */
<template>
    <div>
        <el-table
            :data="listObj.list"
            style="width: 100%"
            :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
            :default-sort = "{prop: 'changeRatio', order: 'descending'}"
        >
            <el-table-column
                width="180"
                type="index"
                label="排序">
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
                align="center"
                sortable
            >
            <template slot-scope="scope">
                <span>{{ (scope.row.changeRatio*1).toFixed(2)}}%</span>
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
                layout="sizes, prev, pager, next"
                :total="listObj.totalSize">
            </el-pagination>
        </div>
    </div>
</template>

<script type='es6'>
import TableBase from "@/components/TableBase";
export default {
    name: "channelTable",
    extends: TableBase,
    props:['listObj'],
    data() {
        return {
            pageSize:10,
        };
    },
    created() {
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
        }       
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
</style>
