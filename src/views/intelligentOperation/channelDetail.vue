/* 会员分析列表 */
<template>
    <div class="m_container mh bor-radius">
        <div class="chennelDetailHead">
            <p style="font-size: 16px">渠道转化订单具体信息：</p>
            <el-button class="yellow_btn" icon="el-icon-share" @click="exportExl">导出到Excel</el-button>
        </div>
        <el-table
            :data="list"
            style="width: 100%"
            :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
            :default-sort = "{prop: 'changeRatio', order: 'descending'}"
            v-loading="loading"
        >
            <el-table-column
                width="80"
                type="index"
                fixed="left" class-name="table-padding"
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
                label="用户ID"
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
                fixed="right" class-name="table-padding"
                width="160"

            >
                <template slot-scope="scope">
                    <span>{{Number(scope.row.bookOrderTime) | time}}</span>
                    </template>
            </el-table-column>
        </el-table>
        <div class="page_styles">
            <el-pagination
                :background="true"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="prev, pager, next, sizes"
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
            loading: true
        };
    },
    mounted(){
        this.getData();
    },
    created() {

    },
    methods: {
        //获取详情数据
        getData(){
            this.ruleForm = {
                startTime : this.$route.query.startTime,
                endTime : this.$route.query.endTime,
                channel : this.$route.query.channel,
                changeRatioRange : this.$route.query.changeRatioRange,
                timeType : this.$route.query.timeType,
                startIndex : this.ruleForm.startIndex,
                pageSize : this.ruleForm.pageSize
            }
            this.loading = true;
            this._apis.data.channelConversionDetails(this.ruleForm).then(response => {
                this.list = response.list;
                this.totalCount = response.totalSize;
                this.loading = false;
            }).catch((error)=>{
                this.$message.error(error);
                this.loading = false;
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
            this.ruleForm.startIndex = val
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
.chennelDetailHead{
    padding: 20px;
    display: flex;
    justify-content: space-between;
}
</style>
