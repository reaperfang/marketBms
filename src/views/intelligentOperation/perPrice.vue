<template>
    <div>
        <div class="p_block">
            <p class="p_title">实时概况
                <span class="lb">更新时间：</span>
                <i class="el-icon-time"></i>
                <span>{{new Date() | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
            </p>
            <div class="clearfix marT20">
                <img src="../../assets/images/datum/icon_head.png" alt="" class="fl">
                <div class="fl">
                    <p class="p1">{{perPrice}}</p>
                    <p class="p2">客单价（元）</p>
                </div>
            </div>
            <div>
                <div class="clearfix"><el-button class="fr" icon="el-icon-refresh" @click="getRealTimeOverview()">刷新</el-button></div>
                <pp1Chart :title="'测试图表'" ref="pp1"></pp1Chart>
            </div>
        </div>
        <div class="p_block marT20">
             <p class="p_title">历史记录</p>
            <div class="clearfix">
                <div class="fl gflex">
                    <p >按时间筛选</p>
                     <el-radio-group v-model="timeType" @change="changeDay">
                        <el-radio-button class="btn_bor" label="1">最近7天</el-radio-button>
                        <el-radio-button class="btn_bor" label="2">最近15天</el-radio-button>
                        <el-radio-button class="btn_bor" label="3">最近30天</el-radio-button>
                     </el-radio-group>
                </div>
                <div class="fr">
                    <el-button class="border_btn" @click="resetAll()">重 置</el-button>
                </div> 
            </div>
            <div class="clearfix">
                <div class="fl gflex">
                    <p >关键指标详解</p>
                     <el-radio-group v-model="preType" @change="changePre">
                        <el-radio-button class="btn_bor" label="1">客单价</el-radio-button>
                        <el-radio-button class="btn_bor" label="2">订单量</el-radio-button>
                        <el-radio-button class="btn_bor" label="3">人均消费金额趋势</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="fr">
                    <el-button class="export_btn" icon="el-icon-share" @click="exportExl()">导出</el-button>
                    <el-button class="minor_btn fr" @click="getHistoryRecord()">重新筛选</el-button>
                </div> 
            </div>
            <div>
                <pp2Chart :title="'测试图表'" ref="pp2"></pp2Chart>
            </div>
        </div>
        <div class="p_block marT20">
            <p class="p_title" style="padding:10px 0">详细数据</p>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      >
      <el-table-column
        prop="date"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="averageOrderPayment"
        label="客单价（元）">
      </el-table-column>
      <el-table-column
        prop="orderCount"
        label="订单量（笔）">
      </el-table-column>
      <el-table-column
        prop="averagePayment"
        label="人均消费金额（元）"
      >
      </el-table-column>
    </el-table>
    <div class="page_styles">
          <el-pagination @size-change="handleSizeChange" 
          @current-change="handleCurrentChange" 
          :current-page="index" 
          :page-sizes="[5, 10, 15]" 
          :page-size="size" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="tableCopyTableList.length">
          </el-pagination>
    </div>
        </div>
    </div>
</template>
<script>
import pp1Chart from './components/pp1Chart';
import pp2Chart from './components/pp2Chart';
export default {
    name: 'perPrice',
    components: { pp1Chart, pp2Chart },
    data() {
        return {
            listObj:{},
            startTime:'',
            endTime:'',
            timeType:1,
            startIndex:1,
            pageSize:7,
            preType:1,
            oneData:[],
            twoData:[],
            threeData:[],
            xdata:[],
            tableData:[],
            tableCopyTableList: [],
            index: 1,
            size: 5,
            perPrice:''
        }
    },
    methods: {
        // 实时概况
        getRealTimeOverview(){
            this._apis.data.realTimeOverview({}).then(response => {
                let xyData = {
                    xAxisData : [],
                    yAxisData : []
                }
                for(let i=0; i<response.length; i++){
                    xyData.xAxisData.push(response[i].time)
                    xyData.yAxisData.push(response[i].value)
                }
            this.perPrice = response[response.length-1].value
            this.$refs.pp1.con(xyData)
        }).catch(error => {
          this.$message.error(error);
        });
        },
        //历史记录
        getHistoryRecord(){
            let data = {
                startTime:this.startTime,
                endTime:this.endTime,
                timeType:this.timeType,
                startIndex:this.startIndex,
                pageSize:this.pageSize
            }
            this._apis.data.historyRecord(data).then(response => {
                this.listObj = response;
                let arrList = response.list;
                this.tableData = response.list.reverse();
                this.tableCopyTableList = JSON.parse(JSON.stringify(this.tableData));
                this.tableData = this.paging(this.size, this.index);
                this.xdata=[];
                this.oneData=[];
                this.twoData=[];
                this.threeData=[];
                for(let i = 0; i<arrList.length; i++){
                    this.xdata.push(arrList[i].date)
                    this.oneData.push(arrList[i].averageOrderPayment)
                    this.twoData.push(arrList[i].orderCount)
                    this.threeData.push(arrList[i].averagePayment)
            }
                this.chart()
        }).catch(error => {
          this.$message.error(error);
        });
        },
        // 重置
        resetAll(){
            this.preType = 1;
            this.timeType = 1;
            this.pageSize = 7;
            this.getHistoryRecord()
        },
        // 图表处理
        chart(){
            // let arrList = this.listObj.list
            let xyData = {
                xAxisData:[],
                yAxisData:[]
            }
                xyData.xAxisData = this.xdata
            if(this.preType == 1){
                xyData.yAxisData =  this.oneData
            }else if(this.preType == 2){
                xyData.yAxisData = this.twoData
            }else if(this.preType == 3){
                xyData.yAxisData = this.threeData
            }
            this.$refs.pp2.con(xyData,this.preType)
        },
        changePre(){
            this.chart()
        },
         // 导出
        exportExl(){
            let data ={
                startTime: this.startTime,
                endTime: this.endTime,
                timeType:this.timeType,
            }
            this._apis.data.historyExport(data).then(response => {
                window.open(response);
            })
        },
        changeDay(val){
            if(val == 1){
                this.pageSize = 7
            }else if(val == 2){
                this.pageSize = 15
            }if(val == 3){
                this.pageSize = 30
            }
            this.getHistoryRecord()
        },
        // 页数改变事件
    handleSizeChange(size) {
      this.size = size;
      this.tableData = this.paging(size, this.index);
    },
    // 页码改变事件
    handleCurrentChange(current) {
      this.index = current;
      this.tableData = this.paging(this.size, current);
    },
    // 本地分页的方法
    paging(size, current) {
      const tableList = JSON.parse(JSON.stringify(this.tableCopyTableList));
      const tablePush = [];
      tableList.forEach((item, index) => {
        if (size * (current - 1) <= index && index <= size * current - 1) {
          tablePush.push(item);
        }
      });
      return tablePush;
    }
    },
    created(){
        this.getRealTimeOverview()
        this.getHistoryRecord()
    }
}
</script>
<style lang="scss" scoped>
/deep/ .el-tabs__nav{
    float: right;
}
/deep/ .el-tabs{
    padding-right: 140px;
    margin-top: -30px;
}
/deep/ .el-tabs__nav-wrap::after{
    height: 0;
}
/deep/ .el-tabs__item.is-active{
    color: #FFB723
}
/deep/ .el-tabs__active-bar{
    background-color: #FFB723;
}
.p_block{
    background-color: #fff;
    padding: 15px 20px;
    .p_title{
        font-size: 16px;
        span{
            color: #92929B;
            font-size: 12px;
            &.lb{
                display: inline-block;
                border-left: 1px solid #92929B;
                margin-left: 10px;
                padding-left: 6px;
            }
        }
        i{
            color: #92929B;
            font-size: 12px;
        }
    }
    .p1{
        font-size: 30px;
        color: #6ACEA8;
        margin: 0 0 1px 10px;
    }
    .p2{
        color: #92929B;
        margin-left: 14px;
    }
    .p_line{
        padding: 32px 26px;
        .pl{
            width: 360px;
            float: left;
            p{
                font-size: 16px;
                display: inline-block;
            }
            span{
                display: inline-block;
                padding: 0 20px;
                height: 34px;
                line-height: 34px;
                margin-left: 10px;
                cursor: pointer; 
                &.active{
                    color: #655EFF;
                    background:#E6E4FF;
                    border-radius:4px;
                }
            }
        }
        .pr{
            float: right;
            width: 200px;
        }
    }
    .pane_container{
        position: relative;
        
    }
    .export_btn{
        // margin-top: -20px;
        background-color:#FFF8EA;
        color: #FFB723;
        border: none;
    }
}
.gflex{
    display: flex;
    margin: 5px;
    p{
        line-height: 32px;
        margin-right: 10px;
        width: 84px;
    }
}
</style>


