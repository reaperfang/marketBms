<!--客户ID余额-->
<template>
  <div>
    <div class="top_part head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline">
        <el-form-item label="交易流水号">
          <el-input v-model="ruleForm.tradeDetailSn" placeholder="请输入" style="width:226px;"></el-input>
        </el-form-item>
        <el-form-item> 
          <el-select v-model="ruleForm.userType" style="width:124px;padding-right:4px;">
            <el-option
              v-for="item in commissionClerkStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="ruleForm.userValue" placeholder="请输入" style="width:226px;"></el-input>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select v-model="ruleForm.businessType" style="width:100px;" placeholder="全部">
            <el-option
              v-for="item in businessTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易时间">
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
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="onSubmit(1)">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part">
      <div class="total">
        <span>全部 <em>{{total}}</em> 项</span>
        <el-tooltip content="当前最多支持导出1000条数据" placement="top">
          <el-button class="border_btn"  @click='exportToExcel()'>导出</el-button>
        </el-tooltip>
      </div>
      <el-table
        v-loading="loading"
        :data="dataList"
        class="table"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        :default-sort = "{prop: 'tradeTime', order: 'descending'}"
        @sort-change="changeSort"
        >
        <el-table-column
          prop="tradeDetailSn"
          label="交易流水号"
          width='200'>
        </el-table-column>
        <el-table-column
          prop="relationSn"
          label="关联单据编号"
          :render-header="renderRelationSn"
          width='200'>
        </el-table-column>
        <el-table-column
          prop="resellerSn"
          label="分佣ID">
        </el-table-column>
        <el-table-column
          prop="resellerName"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="resellerPhone"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="businessType"
          label="业务类型">
          <template slot-scope="scope">
            {{businessTypeList[scope.row.businessType].label}}
          </template>
        </el-table-column>
        <el-table-column
          prop="tradeAmount"
          label="变动金额(元)">
        </el-table-column>
        <el-table-column
          prop="balance"
          label="剩余金额(元)">
        </el-table-column>
        <el-table-column
          prop="tradeTime"
          label="交易时间"
          sortable = "custom">
        </el-table-column>
      </el-table>
      <div class="page_styles">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(ruleForm.startIndex) || 1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="ruleForm.pageSize*1"
          layout="sizes, prev, pager, next"
          :total="total*1">
        </el-pagination>
      </div>
      <exportTipDialog :data = currentData :dialogVisible.sync="dialogVisible" ></exportTipDialog>
    </div>
  </div>
</template>

<script>
import utils from "@/utils";
import TableBase from "@/components/TableBase";
import financeCons from '@/system/constant/finance'
import exportTipDialog from '@/components/dialogs/exportTipDialog'
export default {
  name: 'customerBalance',
  extends: TableBase,
  components:{
    exportTipDialog
  },
  data() {
    return {
      inline:true,
      ruleForm:{
        userType:'resellerSn', // 分佣员类型
        userValue:'', // 分佣员类型对应值
        tradeDetailSn:'', // 交易流水号
        businessType:0, // 业务类型
        timeValue:'', // 交易时间
        startIndex:1,
        pageSize:10,
        sort:'desc'
      },
      dataList:[ ],
      total:0,
      loading:true,
      dialogVisible:false,
      currentData:{}
    }
  },
  watch: { },
  computed:{
    businessTypeList(){
      return financeCons.businessTypeList;
    },
    commissionClerkStatus(){
      return financeCons.commissionClerkStatus;
    }
  },
  created() { },
  methods: {
    renderRelationSn(){
      return(
        <div style="height:49px;line-height:49px;">
          <span style="font-weight:bold;vertical-align:middle;">关联单据编号</span>
          <el-popover
            placement="top-start"
            title=""
            width="170"
            trigger="hover"
            content="订单编号或提现编号">
            <i slot="reference" class="el-icon-warning-outline" style="vertical-align:middle;"></i>
          </el-popover>
        </div>
      )
    },
    init(){
      let query = {
        choosePage:'2',
        tradeDetailSn:this.ruleForm.tradeDetailSn,
        businessType:this.ruleForm.businessType == '0' ? null : this.ruleForm.businessType,
        startTradeTime:'',
        endTradeTime:'',
        resellerSn: '',
        resellerName: '',
        resellerPhone: '',
        startIndex:this.ruleForm.startIndex,
        pageSize:this.ruleForm.pageSize,
        sort:this.ruleForm.sort
      }
      for(let key  in query){
        if(this.ruleForm.userType == key){
          query[key] = this.ruleForm.userValue
        }
      }
      let timeValue = this.ruleForm.timeValue
      if(timeValue){
        query.startTradeTime = timeValue[0]
        query.endTradeTime = timeValue[1]
      }
      return query;
    },

    fetch(num){
      this.ruleForm.startIndex = num || this.ruleForm.startIndex
      let query = this.init();
        this._apis.finance.getCommissionLIst(query).then((response)=>{
          this.dataList = response.list
          this.total = response.total || 0
          this.loading = false
      }).catch((error)=>{
        this.loading = false
      })
    },

    onSubmit(num){
      this.fetch(num)
    },
    //重置
    resetForm(){
      this.ruleForm = {
        userType:'resellerSn', // 分佣员类型
        userValue:'', // 分佣员类型对应值
        tradeDetailSn:'', // 交易流水号
        businessType:0, // 业务类型
        timeValue:'', // 交易时间
        startIndex:1,
        pageSize:10,
        sort:'desc'
      },
      this.fetch()
    },
    // 导出参数特殊处理
    queryExport() {
      let query = this.init();
      query.exportType = 1
      delete query.pageSize;
      delete query.startIndex;
      if (this.total > 1000) {
        query.isExport = '0'
      } else {
        query.isExport = '1'
      }
      return query
    },
    //导出
    exportToExcel(){
      if(this.total > 1000){
        this.currentDialog = exportTipDialog;
        this.dialogVisible = true;
        this.currentData.api = 'finance.commissionExport';
        let query = this.queryExport();
        this.currentData.query = query
      } else {
        let query = this.queryExport();
        this._apis.finance.commissionExport(query).then((response)=>{
          window.location.href = response
        }).catch((error)=>{
         this.$message.error(error)
        })
      }
    },
    //交易时间排序
     changeSort(val){
      if(val && val.order == 'ascending') {
        this.ruleForm.sort = 'asc'
      }else if(val && val.order == 'descending'){
        this.ruleForm.sort = 'desc'
      }else{
        return 
      }
      this.fetch()
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.top_part{
  width: 100%;
  background: #fff;
  border-radius: 3px;
  padding: 15px 20px;
}
.under_part{
  width: 100%;
  background: #fff;
  margin-top: 20px;
  padding: 15px 20px;
  .total{
    display: flex;
    justify-content: space-between;
    span{
      font-size: 16px;
      color: #B6B5C8;
      display: block;
      margin-top:15px;
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
</style>
