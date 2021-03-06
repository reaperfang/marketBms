<!--每日营收-->
<template>
  <div>
    <div class="top_part head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline">
        <el-form-item label="日期" style="margin-bottom:0px;">
          <el-date-picker
            v-model="ruleForm.timeValue"
            type="datetimerange"
            align="right"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="utils.globalTimePickerOption.call(this)">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(1)" v-permission="['财务', '每日营收', '默认页面', '查询']">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part bor-radius" v-calcMinHeight="211">
      <div class="total">
        <span>全部 <em>{{total}}</em> 项</span>
        <el-tooltip content="当前最多支持导出1000条数据" placement="top">
          <el-button class="border_btn"  @click='exportToExcel()' v-permission="['财务', '每日营收', '默认页面', '导出']">导出</el-button>
        </el-tooltip>
      </div>
      <el-table
        v-loading="loading"
        :data="dataList"
        class="table"
        :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
        :default-sort = "{prop: 'accountDate', order: 'descending'}"
        @sort-change="changeSort"
        >
        <el-table-column
          prop="accountDate"
          label="日期"
          align="left"
          min-width="160"
          fixed="left" class-name="table-padding"
          sortable = "custom">
        </el-table-column>
        <el-table-column
          prop="income"
          label="总收入（元）"
          min-width="170"
          align="right">
          <template slot-scope="scope">
            {{scope.row.income}}
          </template>
        </el-table-column>
        <el-table-column
          prop="expend"
          label="总支出（元）"
          min-width="170"
          align="right">
          <template slot-scope="scope">
            {{scope.row.expend}}
          </template>
        </el-table-column>
        <el-table-column
          prop="realIncome"
          label="实际收入（元）"
          min-width="170"
          fixed="right" class-name="table-padding"
          align="right">
        </el-table-column>
      </el-table>
      <div class="page_styles">
        <el-pagination
          v-if="dataList.length != 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(ruleForm.startIndex) || 1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize*1"
          layout="prev, pager, next, sizes"
          :total="total*1"
          :background="true">
        </el-pagination>
      </div>
		<exportTipDialog :data="currentData" :dialogVisible.sync="dialogVisible"></exportTipDialog>
    </div>
  </div>
</template>

<script>
import utils from "@/utils";
import TableBase from "@/components/TableBase";
import exportTipDialog from '@/components/dialogs/exportTipDialog'
export default {
  name: 'dailyRevenue',
  extends: TableBase,
  components:{
    exportTipDialog
  },
  data() {
    return {    
      inline:true,
      ruleForm:{
        timeValue:'',
        sort:'desc'
      },
      dataList:[ ],
      total:0,
      loading:true,
      currentData:{},
      dialogVisible:false
    }
  },
  props: {
    background: {
      type: Boolean,
      default: true
    },
  },
  watch: { },
  created() { },
  methods: {
    init(){
      let query = {
        accountDateStart:'',
        accountDateEnd:'',
        startIndex:this.ruleForm.startIndex,
        pageSize:this.ruleForm.pageSize,
        sort:this.ruleForm.sort
      }
      let timeValue = this.ruleForm.timeValue
      if(timeValue){
        query.accountDateStart = timeValue[0]
        query.accountDateEnd = timeValue[1]
      }
      return query;
    },

    fetch(num){
      this.ruleForm.startIndex = num || this.ruleForm.startIndex
      let query = this.init();
      this._apis.finance.getListDr(query).then((response)=>{
        this.dataList = []
        response.list.map(item =>{
          item.accountDate = item.accountDate.substring(0,item.accountDate.length-8)
          this.dataList.push(item)
        })
        this.total = response.total || 0
        this.loading = false
      }).catch((error)=>{
        console.error(error);
        this.loading = false
      })
    },

    //搜索
    onSubmit(num){
      this.fetch(num)
    },

    //重置
    resetForm(){
      this.ruleForm = {
        timeValue:''
      }
      this.fetch()
    },

    //导出
    exportToExcel() {
      let query = this.init();
      if(this.total >1000){
        this.dialogVisible = true;
        this.currentData.api = 'finance.exportDr';
        this.currentData.query =query;
      }else{
        this._apis.finance.exportDr(query).then((response)=>{
        window.location.href = response
      }).catch((error)=>{
        this.$message.error(error)
      })
      }
      
    },
    changeSort(val){
      if(val && val.order == 'ascending') {
        this.ruleForm.sort = 'asc'
      }else if(val && val.order == 'descending'){
        this.ruleForm.sort = 'desc'
      }else{
        return 
      }
      this.fetch()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.top_part{
  width: 100%;
  background: #fff;
  border-radius: 4px;
  padding: 20px;
}
.under_part{
  width: 100%;
  background: #fff;
  margin-top: 20px;
  padding: 20px;
  .total{
    display: flex;
    justify-content: space-between;
    span{
      font-size: 16px;
      color: #B6B5C8;
      display: block;
      // margin-top:15px;
      em{
        font-style: normal;
        color: #000;
      }
    }
  }
}
.table{
  width: 100%; 
  margin-top:20px;
}
/deep/.el-table .descending .sort-caret.descending{
  border-top-color:#44434B;
}
/deep/.el-table .ascending .sort-caret.ascending{
  border-bottom-color:#44434B;
}
/deep/ .el-table--small td{
  padding:16px 10px;
}
/deep/.el-table--small th{
  padding:8px 0px 8px 10px;
}
</style>
