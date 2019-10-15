/* 会员分析列表 */
<template>
    <div class="m_container">
        <div class="chennelDetailHead">
            <p style="font-size: 16px">渠道转化订单具体信息：</p>
            <el-button class="yellow_btn" icon="el-icon-share" @click="exportExl">导出到Excel</el-button>
        </div>
        <el-table
            :data="list"
            style="width: 100%"
            :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
            :default-sort = "{prop: 'changeRatio', order: 'descending'}"
        >
            <el-table-column
                width="180"
                type="index"
                align="center"
                label="排序">
            </el-table-column>
            <el-table-column
                prop="orderId"
                label="订单号"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="customerId"
                label="客户ID"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="channelName"
                label="渠道类型"
                align="center"
            >
            <template slot-scope="scope">
                <span>{{ scope.row.channelName ? scope.row.channelName : '直接购买' }}</span>
            </template>
            </el-table-column>
            <el-table-column
                prop="activityName"
                label="（活动）名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="订单支付时间"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{Number(scope.row.bookOrderTime) | time}}</span>
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
                :total="totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script type='es6'>
import TableBase from "@/components/TableBase";
export default {
    name: "channelDetail",
    extends: TableBase,
    data() {
        return {
            currentPage:1,
            pageSize:10,
            totalCount:0,
            ruleForm:[],
            list:[],//列表
        };
    },
    mounted(){
        this.ruleForm.startTime = this.$route.query.startTime;
        this.ruleForm.endTime = this.$route.query.endTime;
        this.ruleForm.channel = this.$route.query.channel;
        this.ruleForm.changeRatioRange = this.$route.query.changeRatioRange;
        this.ruleForm.timeType = this.$route.query.timeType;
        this.ruleForm.startIndex = 1;
        this.ruleForm.pageSize = 10;
        this.getData();
    },
    created() {

    },
    methods: {
        //获取详情数据
        getData(){
            this._apis.data.channelConversionDetails(this.ruleForm).then(response => {
                this.list = response.list;
                this.totalCount = response.totalSize;
            })
        },
        //导出
        exportExl(){
            let data = {};
            data.startTime = this.ruleForm.startTime
            data.endTime = this.ruleForm.endTime
            if(this.ruleForm.channel!= null){
                data.channel = Number(this.ruleForm.channel);
            }else{
                data.channel = null
            }
            data.changeRatioRange = this.ruleForm.changeRatioRange     
            data.timeType = this.ruleForm.timeType
            this._apis.data.channelConversionDetailsExport(data)
            .then(res => {
                window.open(res);
            })
            .catch(err=>{
                this.$message.error(err);
            })
        },
        //更改每页条数
        handleSizeChange(val){
            this.pageSize = val;
            this.ruleForm.pageSize = val;
            this.getData();
        },
        //选择页数
        handleCurrentChange(val){
            this.currentPage = val;
            this.getData();
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
.m_container{
    background-color: #fff;
    padding: 10px 20px;
}
/deep/ .cell{
            .btns{
                span{
                    color: #655EFF;
                    margin-right: 5px;
                }
            }
        }
.chennelDetailHead{
    padding: 20px;
    display: flex;
    justify-content: space-between;
}
</style>
