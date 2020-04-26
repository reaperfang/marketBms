<!--分佣明细-->
<template>
  <div>
    <div class="top_part head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline">
        <el-form-item>
          <el-select v-model="ruleForm.searchType" placeholder="交易流水号" style="width:124px;padding-right:4px;">
            <el-option
              v-for="item in serialNumberType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="ruleForm.searchValue" placeholder="请输入" style="width:226px;"></el-input>
        </el-form-item>
        <el-form-item label="分佣金额">
          <el-input-number v-model="ruleForm.minTradeAmount" :precision="2" :step="0.1" :min="0" placeholder="请输入" style="width:120px;"></el-input-number>
          -
          <el-input-number v-model="ruleForm.maxTradeAmount" :precision="2" :step="0.1" :min="0" placeholder="请输入" style="width:120px;"></el-input-number>
        </el-form-item>
        <el-form-item label="交易时间">
          <el-date-picker
            v-model="ruleForm.timeValue"
            type="datetimerange"
            align="right"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="utils.globalTimePickerOption.call(this)">
          </el-date-picker>
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
        <el-form-item>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="onSubmit(1)" v-permission="['财务', '提现明细', '默认页面', '搜索']">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part">
      <div class="total">
          <span>全部 <em>{{total}}</em> 项</span>
          <el-tooltip content="当前最多支持导出1000条数据" placement="top">
            <el-button class="border_btn"   @click='exportToExcel()' v-permission="['财务', '提现明细', '默认页面', '导出']">导出</el-button>
          </el-tooltip>
      </div>
      <el-table
        v-loading="loading"
        :data="dataList"
        class="table"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        :default-sort = "{prop: 'tradeTime', order: 'descending'}"
        >
        <el-table-column
          prop="tradeDetailSn"
          label="交易流水号">
        </el-table-column>
         <el-table-column
          prop="relationSn"
          label="关联单据编号"
          :render-header="renderRelationSn">
        </el-table-column>
        <el-table-column
          prop="resellerSn"
          label="分佣员ID">
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
          prop="thirdPartySn"
          label="第三方流水号">
        </el-table-column>
        <el-table-column
          prop="tradeAmount"
          label="分佣金额（元）">
        </el-table-column>
        <el-table-column
          prop="tradeTime"
          label="交易时间"
          sortable>
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
    </div>
    <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData" @handleSubmit="handleSubmit"></component>
  </div>
</template>

<script>
import utils from "@/utils";
import financeCons from '@/system/constant/finance'
import exportTipDialog from '@/components/dialogs/exportTipDialog' //导出提示框 
import TableBase from "@/components/TableBase"
export default {
  name: 'revenueSituation',
  extends: TableBase,
  components:{exportTipDialog},
  data() {
    return {
      inline:true,
      ruleForm:{
        searchType:'tradeDetailSn', //交易流水号
        searchValue:'', // 交易流水号对应值
        minTradeAmount: '0.00', // 分佣金额上限
        maxTradeAmount: '0.00', // 分佣金额下限
        timeValue:'', // 交易时间
        userType:'resellerSn', // 分佣员类型
        userValue:'',// 分佣员类型对应值
        startIndex:1,
        pageSize:10
      },
      dataList:[ ],
      total:0,
      loading:true,
      selectStatus:false,
      currentDialog:"",
      dialogVisible: false,
      currentData:{},
    }
  },
  watch: { },
  computed:{
    serialNumberType(){
      return financeCons.serialNumberType;
    },
    commissionClerkStatus(){
      return financeCons.commissionClerkStatus;
    }
  },
  created() {
  },
  methods: {
    init(){
      let query = {
        tradeDetailSn:'',
        relationSn: '',
        thirdPartySn: '',
        minTradeAmount: '', 
        maxTradeAmount: '',
        startTradeTime: '',
        endTradeTime: '',
        resellerSn: '',
        resellerName: '',
        resellerPhone: '',
        startIndex:this.ruleForm.startIndex,
        pageSize:this.ruleForm.pageSize
      }
      for(let key  in query){
        if(this.ruleForm.searchType == key){
          query[key] = this.ruleForm.searchValue
        }
        if(this.ruleForm.userType == key){
          query[key] = this.ruleForm.userValue
        }
        for(let item in this.ruleForm){ 
          if(item == key){
            query[key] = this.ruleForm[item]
          }
        }
      }
      query.minTradeAmount = this.ruleForm.minTradeAmount == 0 ? '' : this.ruleForm.minTradeAmount
      query.maxTradeAmount = this.ruleForm.maxTradeAmount == 0 ? '' : this.ruleForm.maxTradeAmount
      let timeValue = this.ruleForm.timeValue
      if(timeValue){
        query.startTradeTime = timeValue[0]
        query.endTradeTime = timeValue[1]
      }
      return query;
    },

    fetch(num){
      if(this.ruleForm.minTradeAmount == undefined || this.ruleForm.maxTradeAmount == undefined){
        this.$message('分佣金额不能为空')
      }else if(this.ruleForm.minTradeAmount > this.ruleForm.maxTradeAmount){
        this.$message('分佣金额最小值应该小于最大值')
      }else{
        this.ruleForm.startIndex = num || this.ruleForm.startIndex
        let query = this.init();
        this._apis.finance.getCommissionLIst(query).then((response)=>{
          this.dataList = response.list
          this.total = response.total || 0
          this.loading = false
        }).catch((error)=>{
          this.loading = false
        })
      }
    },
    //搜索
    onSubmit(num){
      this.fetch(num)
    },
    //重置
    resetForm(){
      this.ruleForm = {
        searchType:'tradeDetailSn', //交易流水号
        searchValue:'', // 交易流水号对应值
        minTradeAmount: '0.00', // 分佣金额上限
        maxTradeAmount: '0.00', // 分佣金额下限
        timeValue:'', // 交易时间
        userType:'resellerSn', // 分佣员类型
        userValue:'', // 分佣员类型对应值
        startIndex:1,
        pageSize:10
      }
      this.fetch()
    },
    // 导出参数特殊处理
    queryExport() {
      let query = this.init();
      query.exportType = 1
      delete query.pageSize;
      delete query.startIndex;
      if (this.total > 1000) {
        query.isExport = '1'
      } else {
        query.isExport = '0'
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
    renderRelationSn(){
      return(
        <div style="height:49px;line-height:49px;">
          <span style="font-weight:bold;vertical-align:middle;">关联单据编号</span>
          <el-popover
            placement="top-start"
            title=""
            width="160"
            trigger="hover"
            content="订单编号">
            <i slot="reference" class="el-icon-warning-outline" style="vertical-align:middle;"></i>
          </el-popover>
        </div>
      )
    },
    handleSubmit(datas){
      this._apis.finance.commissionExport(datas).then((response)=>{
           this.fetch()
           this.dialogVisible = true
           this.currentDialog = auditSuccessDialog
      }).catch((error)=>{
          this.$message.error('网络原因,审核失败！')
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.el-table__header-wrapper  {
    .el-checkbox{
      display:none;
    }
	
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>

.top_part{
  width: 100%;
  background: #fff;
  border-radius: 3px;
  padding: 15px 20px;
  .withdraw{
    text-align: right;
    display: block;
    color:#655EFF;
    font-size:14px;
    margin-bottom:15px;
  }
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
.page_styles{
  // display: flex;
  .checkAudit{
    // margin-right:220px;
    float:left;
    .selectAll{
      margin-left:14px;
      margin-right:8px;
    }
  }
}
  
</style>
